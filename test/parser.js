const {assert} = require('chai');

const {RouteParser} = require('../lib/Parser');

const cases = [
    {
        template: '/constant-route/',
        result: {
            template: 'constant\\-route',
            parameters: []
        }
    },
    {
        template: 'constant!@#$%^&*()[]_+route',
        result: {
            template: 'constant!@\\#\\$%\\^&*()\\[\\]_\\+route',
            parameters: []
        }
    },
    {
        template: 'constant/route/few/chunks/',
        result: {
            template: 'constant/route/few/chunks',
            parameters: []
        }
    },
    {
        template: ':named_var',
        result: {
            template: '([^\/]+)',
            parameters: ['named_var']
        }
    },
    {
        template: '*wildcard_var',
        result: {
            template: '(.*?)',
            parameters: ['wildcard_var']
        }
    },
    {
        template: 'static/prefix:var1/:var2',
        result: {
            template: 'static/prefix([^\/]+)/([^\/]+)',
            parameters: ['var1', 'var2']
        }
    },
    {
        template: 'static/prefix*wildcard',
        result: {
            template: 'static/prefix(.*?)',
            parameters: ['wildcard']
        }
    },
    {
        template: 'static/prefix*wildcard/*second_wildcard',
        result: {
            template: 'static/prefix(.*?)/(.*?)',
            parameters: ['wildcard', 'second_wildcard']
        }
    },
    {
        template: 'static-part/:var1-:var2-:var3/*wildcard1:*wildcard2',
        result: {
            template: 'static\\-part/([^\/]+)\\-([^\/]+)\\-([^\/]+)/(.*?):(.*?)',
            parameters: ['var1', 'var2', 'var3', 'wildcard1', 'wildcard2']
        }
    },
    {
        template: '*wildcard/:var1-:var2/static/static-:var3/*wildcard2',
        result: {
            template: '(.*?)/([^\/]+)\\-([^\/]+)/static/static\\-([^\/]+)/(.*?)',
            parameters: ['wildcard', 'var1', 'var2', 'var3', 'wildcard2']
        }
    }
];

describe('Parser', function () {
    let parser;

    it('should create parser object', function () {
        parser = new RouteParser();

        assert.instanceOf(parser, RouteParser);
        assert.isFunction(parser.parse);
    });

    cases.forEach((c) => {
        it(`should parse "${ c.template }"`, function () {
            const result = parser.parse(c.template);
            assert.deepEqual(result, c.result);
        });
    });

});