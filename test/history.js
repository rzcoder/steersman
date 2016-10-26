const {assert} = require('chai');

const {VirtualHistory} = require('../lib/history/VirtualHistory');
const {BrowserHistory} = require('../lib/history/BrowserHistory');
const {HashHistory} = require('../lib/history/HashHistory');

describe('History', function () {

    describe(`Common`, function () {
        for (let type of [VirtualHistory /*, BrowserHistory, HashHistory*/]) {
            (function (type) {
                describe(type.name, function () {
                    let history;
                    it('should create history object', function () {
                        history = new type(function(path) { return path + '___'});

                        assert.instanceOf(history, type);
                        assert.isFunction(history.setPath);
                        assert.isFunction(history.goBack);
                        assert.isFunction(history.goForward);
                        assert.equal(history.onNavigate('new_path'), 'new_path___', 'onNavigate doesn\'t work');
                    });
                });
            })(type);
        }
    });

    describe('VirtualHistory', function () {
        let history = new VirtualHistory(function(path) { return path; });

        it('should add entries to history', function () {
            history.setPath('first_path');
            assert.equal(history.history.length, 1);

            history.setPath('second_path');
            assert.equal(history.history.length, 2);

            history.setPath('third_path');
            assert.equal(history.history.length, 3);
        });

        it('should navigate over history', function () {
            history.goForward();
            assert.equal(history.currentPath, 'third_path');
            history.goBack();
            assert.equal(history.currentPath, 'second_path');
            history.goBack();
            assert.equal(history.currentPath, 'first_path');
            history.goBack();
            assert.equal(history.currentPath, 'first_path');
            history.goForward();
            assert.equal(history.currentPath, 'second_path');
            history.goForward();
            assert.equal(history.currentPath, 'third_path');
        });

        it('should insert new record after current history position', function () {
            history.setPath('fourth_path');
            assert.equal(history.history.length, 4);
            history.goBack();
            assert.equal(history.currentPath, 'third_path');
            history.goBack();
            assert.equal(history.currentPath, 'second_path');

            history.setPath('third_path_2');
            assert.equal(history.history.length, 3);
            assert.equal(history.currentPath, 'third_path_2');
            history.goBack();
            assert.equal(history.currentPath, 'second_path');
        });

        it('should insert new record to current history position', function () {
            assert.equal(history.currentPath, 'second_path');
            assert.equal(history.history.length, 3);
            history.setPath('second_path_2', true); //replace
            assert.equal(history.history.length, 2);
            assert.equal(history.currentPath, 'second_path_2');
            history.goBack();
            assert.equal(history.currentPath, 'first_path');
        });
    });
});