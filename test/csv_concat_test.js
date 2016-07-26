'use strict';

var grunt = require('grunt');
var CsvConcat = require('../csv-concat');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.testWithoutPrefix = function(test) {
    var csvConcat = new CsvConcat({
        delimiter: '|',
        src: ['test/fixtures/sub', 'test/fixtures/test1.csv', 'test/fixtures/test2.csv'],
        dest: 'test/tmp/final.csv',
        verbose: true
    });

    test.expect(1);

    csvConcat.concatFiles()
        .then(function() {
            var actual = grunt.file.read('test/tmp/final.csv');
            var expected = grunt.file.read('test/expected/final.csv');

            test.equal(actual, expected, 'should concat file contents from different files');

            test.done();
        })
        .catch(function(err) {
            console.log(err);
            test.done(false);
        });
};
