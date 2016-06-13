module.exports = function(file, baseDir, parseCsv, fs) {
    var Translation = require('./translation');

    var keyPrefix = file.replace(baseDir + '/', '');
    keyPrefix = keyPrefix.replace('.csv', '');
    keyPrefix += '/';

    function getTranslations() {
        var fileContent = fs.readFileSync(file);

        var records = parseCsv(fileContent, {
            delimiter: '|',
            relax: true
        });

        var translations = [];

        records.forEach(function(theRecord) {
            var translation = new Translation(
                keyPrefix + theRecord[0],
                theRecord[1]
            );

            translations.push(translation);
        });

        return translations;
    }

    return {
        getTranslations: getTranslations
    };
};
