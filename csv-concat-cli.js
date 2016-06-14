(function() {
    var CsvConcat = require('./csv-concat');
    var OptionsParser = require('./csv-concat-options-parser');

    var options = new OptionsParser().getOptions();

    var csvConcat = new CsvConcat(options);

    csvConcat.concatFiles()
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
