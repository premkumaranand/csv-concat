(function() {
    var CsvMerger = require('./csv-merger');
    var OptionsParser = require('./merge-options-parser');

    var options = new OptionsParser().getOptions();

    var csvMerger = new CsvMerger(options);

    csvMerger.mergeFiles()
        .then(
            function() {
                console.log('Files successfully merged');
            }
        )
        .catch(
            function(err) {
                console.log('Fatal error merging files: ' + err);
            }
        );
})();
