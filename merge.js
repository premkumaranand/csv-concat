(function() {
    var fs = require('fs');
    var parse = require('csv-parse');
    var glob = require( 'glob' );
    var parseCsv = require('csv-parse/lib/sync');

    var OptionsParser = require('./merge-options-parser');
    var TranslateFileParser = require('./translate-file-parser');

    var options = new OptionsParser().getOptions();

    var outputStream = fs.createWriteStream(
                        options.dir + '/napa.csv',
                        {
                            flags: 'a'
                        });
    
    outputStream.write('\n');

    glob( options.dir + '/**/*.csv', function( err, files ) {
        files.forEach(function(file) {
            if (!file.includes('napa.csv')) {
                var translateFileParser = new TranslateFileParser(file, options.dir, parseCsv, fs);
                var translations = translateFileParser.getTranslations();

                translations.forEach(function(translation) {
                    outputStream.write(translation.toString() + '\n');
                });
            }
        });

        outputStream.end();
    });
})();
