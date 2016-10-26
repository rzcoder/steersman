const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const {assert, expect} = chai;


const {Transitor} = require('../lib/Transitor');
const {Route} = require('../lib/Route');
const {ReplacedError, InterceptedError, RedirectedError} = require('../lib/Errors');

process.on("unhandledRejection", function (err) { throw err; })

const delayedPromise = function (timeout, shouldReject = false, value) {
    if (timeout >= 0) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                shouldReject ? reject(value) : resolve(value);
            }, timeout);
        });
    } else {
        shouldReject ? Promise.reject(value) : Promise.resolve(value);
    }
};

class DelayedRoute extends Route {
    constructor(options = {}) {
        super();
        this.name = options.name;
        this.options = options;
    }

    beforeExit(newRoute) {
        return delayedPromise(this.options.beforeExitTimeout, this.options.beforeExitReject, this.options.beforeExitValue);
    }

    onExit(newRoute) {
        return delayedPromise(this.options.onExitTimeout, this.options.onExitReject, this.options.onExitValue);
    }

    beforeEnter() {
        return delayedPromise(this.options.beforeEnterTimeout, this.options.beforeEnterReject, this.options.beforeEnterValue);
    }

    onEnter() {
        return delayedPromise(this.options.onEnterTimeout, this.options.onEnterReject, this.options.onEnterValue);
    }
}

describe('Transitor', function () {
    describe('Basic', function () {
        it('should create transitor object', function () {
            const transitor = new Transitor("wait");

            assert.instanceOf(transitor, Transitor);
            assert.equal(transitor.conflictStrategy, "wait");
            assert.equal(transitor.inTransition, false);
            assert.isFunction(transitor.transitionTo);
        });
    });

    describe('Conflict strategy: "Wait"', function () {
        const transitor = new Transitor("wait");

        it('initial transition', function () {
            assert.isUndefined(transitor.currentRoute);
            return transitor.transitionTo(new DelayedRoute({name: '1'})).promise.then(() => {
                assert.equal(transitor.currentRoute.name, '1');
                assert.instanceOf(transitor.currentRoute, DelayedRoute);
            });
        });

        it('next transition', function () {
            assert.equal(transitor.currentRoute.name, '1');
            return transitor.transitionTo(new DelayedRoute({name: '2'})).promise.then(() => {
                assert.equal(transitor.currentRoute.name, '2');
            });
        });

        it('queue transitions', function () {
            assert.equal(transitor.currentRoute.name, '2');

            const t1 = transitor.transitionTo(new DelayedRoute({name: 'should be done'}));
            const t2 = transitor.transitionTo(new DelayedRoute({name: 'should be replaced'}));
            const t3 = transitor.transitionTo(new DelayedRoute({name: 'should be replaced too'}));
            const t4 = transitor.transitionTo(new DelayedRoute({name: 'and this should be replaced too'}));
            const t5 = transitor.transitionTo(new DelayedRoute({name: 'should be done too'}));

            return Promise.all([
                expect(t1.promise).to.be.fulfilled,
                expect(t2.promise).to.be.rejectedWith(ReplacedError),
                expect(t3.promise).to.be.rejectedWith(ReplacedError),
                expect(t4.promise).to.be.rejectedWith(ReplacedError),
                expect(t5.promise).to.be.fulfilled,
                t5.promise.then(() => {
                    assert.equal(transitor.currentRoute.name, 'should be done too');
                })
            ]);
        });
    });
});