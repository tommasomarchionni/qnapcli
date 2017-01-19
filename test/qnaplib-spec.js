const assert = require("assert");
const sinon = require("sinon");
const qnaplib = require('./../lib/qnaplib');
const expect = require("chai").expect;
const Promise = this.Promise || require('es6-promise');
const mockery = require('mockery');

describe("qnaplib", function() {
    describe("when make qnap beep without parameters", function() {
        it("should throw an error", function() {
            return qnaplib.beep().then(function fulfilled(result) {
                throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
            }, function rejected(error) {
                assert.equal(error.message, 'Error: Invalid protocol: undefined:');
            });
        });
    });

    describe("when make qnap restart without parameters", function() {
        it("should throw an error", function() {
            return qnaplib.restart().then(function fulfilled(result) {
                throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
            }, function rejected(error) {
                assert.equal(error.message, 'Error: Invalid protocol: undefined:');
            });
        });
    });

    describe("when make qnap beep with correct parameters", function() {

        before(function (done) {

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.registerMock('request-promise-native', function () {
                return Promise.resolve('<?xml version="1.0" encoding="UTF-8"?><QDocRoot><authPassed>1</authPassed></QDocRoot></xml>');
            });

            done();
        });

        after(function (done) {
            mockery.disable();
            mockery.deregisterAll();
            done();
        });

        it("should return a resolved promise with 'Beep' string", function() {
            "use strict";
            let rp = require('request-promise-native');
            return qnaplib.beep('http', 'http://test', 80, 'sid', 5000, 1, rp).then(function fulfilled(result) {
                assert.equal(result, 'Beep');
            }, function rejected(error) {
                throw new Error('Promise was rejected. Error: ' + error);
            });
        });
    });

    describe("when make qnap restart with correct parameters", function() {

        before(function (done) {

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.registerMock('request-promise-native', function () {
                return Promise.resolve('<?xml version="1.0" encoding="UTF-8"?><QDocRoot><authPassed>1</authPassed></QDocRoot></xml>');
            });

            done();
        });

        after(function (done) {
            mockery.disable();
            mockery.deregisterAll();
            done();
        });

        it("should return a resolved promise with 'Beep' string", function() {
            "use strict";
            let rp = require('request-promise-native');
            return qnaplib.restart('http', 'http://test', 80, 'sid', 5000, 1, rp).then(function fulfilled(result) {
                assert.equal(result, 'Restarting Qnap...');
            }, function rejected(error) {
                throw new Error('Promise was rejected. Error: ' + error);
            });
        });
    });

    describe("when make qnap beep with correct parameters but with unauthorized user", function() {

        before(function (done) {

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.registerMock('request-promise-native', function () {
                return Promise.resolve('<?xml version="1.0" encoding="UTF-8"?><QDocRoot><authPassed>0</authPassed></QDocRoot></xml>');
            });

            done();
        });

        after(function (done) {
            mockery.disable();
            mockery.deregisterAll();
            done();
        });

        it("should return a rejected promise with error description 'Error: You are not authorized!'", function() {
            "use strict";
            let rp = require('request-promise-native');
            return qnaplib.beep('http', 'http://test', 80, 'sid', 5000, 1, rp).then(function fulfilled(result) {
                throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
            }, function rejected(error) {
                assert.equal(error.message, 'Error: You are not authorized!')
            });
        });
    });

    describe("when make qnap restart with correct parameters but with unauthorized user", function() {

        before(function (done) {

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.registerMock('request-promise-native', function () {
                return Promise.resolve('<?xml version="1.0" encoding="UTF-8"?><QDocRoot><authPassed>0</authPassed></QDocRoot></xml>');
            });

            done();
        });

        after(function (done) {
            mockery.disable();
            mockery.deregisterAll();
            done();
        });

        it("should return a rejected promise with error description 'Error: You are not authorized!'", function() {
            "use strict";
            let rp = require('request-promise-native');
            return qnaplib.restart('http', 'http://test', 80, 'sid', 5000, 1, rp).then(function fulfilled(result) {
                throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
            }, function rejected(error) {
                assert.equal(error.message, 'Error: You are not authorized!')
            });
        });
    });

    describe("when get sid without parameters", function() {
        it("should throw an error", function() {
            return qnaplib.getSid().then(function fulfilled(result) {
                throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
            }, function rejected(error) {
                assert.equal(error.message, 'Error: Invalid protocol: undefined:');
            });
        });
    });
    describe("when get sid with correct parameters", function() {

        before(function (done) {

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.registerMock('request-promise-native', function () {
                return Promise.resolve('<?xml version="1.0" encoding="UTF-8"?><QDocRoot><authSid>sid</authSid><authPassed>1</authPassed></QDocRoot></xml>');
            });

            done();
        });

        after(function (done) {
            mockery.disable();
            mockery.deregisterAll();
            done();
        });

        it("should return a resolved promise with the sid", function() {
            "use strict";
            let rp = require('request-promise-native');
            return qnaplib.getSid('http', 'http://test', 80, 'user', 'password', 5000, 1, rp).then(function fulfilled(result) {
                assert.equal(result, 'sid');
            }, function rejected(error) {
                throw new Error('Promise was rejected. Error: ' + error);
            });
        });
    });
    describe("when get sid with correct parameters but with unauthorized user", function() {

        before(function (done) {

            mockery.enable({
                warnOnReplace: false,
                warnOnUnregistered: false,
                useCleanCache: true
            });

            mockery.registerMock('request-promise-native', function () {
                return Promise.resolve('<?xml version="1.0" encoding="UTF-8"?><QDocRoot><authPassed>0</authPassed></QDocRoot></xml>');
            });

            done();
        });

        after(function (done) {
            mockery.disable();
            mockery.deregisterAll();
            done();
        });

        it("should return a rejected promise with error description 'Error: Authentication failed!'", function() {
            "use strict";
            let rp = require('request-promise-native');
            return qnaplib.getSid('http', 'http://test', 80, 'user', 'password', 5000, 1, rp).then(function fulfilled(result) {
                throw new Error('Promise was unexpectedly fulfilled. Result: ' + result);
            }, function rejected(error) {
                assert.equal(error.message, 'Error: Authentication failed!')
            });
        });
    });
});
