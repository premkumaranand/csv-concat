'use strict';

var grunt = require('grunt');
var CsvConcat = require('../csv-concat');

exports.testWithPrefix = function(test) {
    var csvConcat = new CsvConcat({
        delimiter: '|',
        src: ['test/fixtures/sub', 'test/fixtures/test1.csv', 'test/fixtures/test2.csv'],
        dest: 'test/tmp/final_with_prefix.csv',
        verbose: true,
        addPrefixToKey: true
    });

    test.expect(1);

    csvConcat.concatFiles()
        .then(function() {
            var actual = grunt.file.read('test/tmp/final_with_prefix.csv');
            var expected = grunt.file.read('test/expected/final_with_prefix.csv');

            test.equal(actual, expected, 'should concat file contents from different files');

            test.done();
        })
        .catch(function(err) {
            console.log(err);
            test.done(false);
        });
};
