const {assert} = require('chai');

const {RouteMapper} = require('../lib/Mapper');
const {RouteParser} = require('../lib/Parser');
const {Route} = require('../lib/Route');

class TestRoute1 extends Route {
}
class TestRoute2 extends Route {
}
class TestRoute3 extends Route {
}

const cases = [
    {
        mapping: (route) => {
            route('/path1/').to(TestRoute1);
            route('/path2').to(TestRoute2);
            route('path3/').to(TestRoute3);
        },
        result: [{
            template: 'path1',
            regexp: /^path1$/i,
            parameters: [],
            resolve: TestRoute1
        }, {
            template: 'path2',
            regexp: /^path2$/i,
            parameters: [],
            resolve: TestRoute2
        }, {
            template: 'path3',
            regexp: /^path3$/i,
            parameters: [],
            resolve: TestRoute3
        }]
    },

    {
        mapping: (route) => {
            route('/details/:id', (route) => {
                route('/').to(TestRoute1);
                route('/:section').to(TestRoute2);
                route('/:section/:filters').to(TestRoute2);
            })
        },
        result: [{
            template: 'details/([^/]+)',
            regexp: /^details\/([^/]+)$/i,
            parameters: ['id'],
            resolve: TestRoute1
        }, {
            template: 'details/([^/]+)/([^/]+)',
            regexp: /^details\/([^/]+)\/([^/]+)$/i,
            parameters: ['id', 'section'],
            resolve: TestRoute2
        }, {
            template: 'details/([^/]+)/([^/]+)/([^/]+)',
            regexp: /^details\/([^/]+)\/([^/]+)\/([^/]+)$/i,
            parameters: ['id', 'section', 'filters'],
            resolve: TestRoute2
        }]
    },

    {
        mapping: (route) => {
            route('/path1', (route) => {
                route('/path2', (route) => {
                    route('/path3', (route) => {
                        route('/path4').to(TestRoute1);
                    })
                });
            });
        },
        result: [{
            template: 'path1/path2/path3/path4',
            regexp: /^path1\/path2\/path3\/path4$/i,
            parameters: [],
            resolve: TestRoute1
        }]
    },

    {
        mapping: (route) => {
            route('/path1', (route) => {
                route('/path2').to(TestRoute1);
            });
            route('/path3', (route) => {
                route('/:var').to(TestRoute2);
            });
            route('/path5').to(TestRoute3);
        },
        result: [{
            template: 'path1/path2',
            regexp: /^path1\/path2$/i,
            parameters: [],
            resolve: TestRoute1
        }, {
            template: 'path3/([^/]+)',
            regexp: /^path3\/([^/]+)$/i,
            parameters: ['var'],
            resolve: TestRoute2
        }, {
            template: 'path5',
            regexp: /^path5$/i,
            parameters: [],
            resolve: TestRoute3
        }]
    },
];

describe('Mapper', function () {
    let mapper;

    it('should create mapper object', function () {
        const parser = new RouteParser();
        mapper = new RouteMapper(parser);

        assert.instanceOf(mapper, RouteMapper);
        assert.isFunction(mapper.mapping);
    });

    cases.forEach((c) => {
        it(`should mapping "${ c.mapping.toString().replace(/\s\s+/g, ' ') }"`, function () {
            const result = mapper.mapping(c.mapping);
            for (let i = 0; i < c.result.length; i++) {
                assert.deepEqual(result[i].template, c.result[i].template);
                assert.deepEqual(result[i].parameters, c.result[i].parameters);
                assert.deepEqual(result[i].regexp, c.result[i].regexp);
                assert.deepEqual(result[i].resolve._routeClass, c.result[i].resolve);
            }
        });
    });
});