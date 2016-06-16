module.exports = function(options) {

    var extend = require('jquery-extend');
    var fs = require('fs');
    var parseCsv = require('csv-parse/lib/sync');
    var CsvFileParser = require('./csv-file-parser');

    var defaultOptions = {

        //What are the columns delimited by?
        delimiter: ',',

        //Source directory where the csv files are
        src: '',

        //Ignore files with these names
        ignore: [],

        //Destination file where the concatd CSVs are placed into
        dest: '',

        //Generate a prefix for the keys from the folder structure and the file name?
        addPrefixToKey: false
    };

    options = extend({}, defaultOptions, options);

    /**
     * Private methods
     */
    function getScannableFiles(files) {
        return files.filter(function(fileIter) {
            var filePathParts = fileIter.split('/');
            var fileName = filePathParts[filePathParts.length - 1];
            return options.ignore.indexOf(fileName) === -1;
        });
    }

    function getFiles (dir, extension, files_){
        var files_ = files_ || [];
        var files = fs.readdirSync(dir);
        for (var i in files){
            var name = dir + '/' + files[i];
            if (fs.statSync(name).isDirectory()){
                getFiles(name, extension, files_);
            } else {
                if (name.indexOf("." + extension)) {
                    files_.push(name);
                }
            }
        }
        return files_;
    }

    function concatFiles(resolve, reject) {
        var outputStream = fs.createWriteStream(
            options.dest,
            {
                flags: 'a'
            });

        outputStream.write('\n');

        var files = getFiles(options.src, "csv");

        var scannableFiles = getScannableFiles(files);

        scannableFiles.forEach(function(file) {
            var csvFileParser = new CsvFileParser(file, options, parseCsv, fs);
            var records = csvFileParser.getRecords();

            records.forEach(function(recordIter) {
                outputStream.write(recordIter.join(options.delimiter) + '\n');
            });
        });

        outputStream.end();

        if (resolve instanceof Function) {
            resolve();
        }
    }

    function concatFilesPromise() {
        return new Promise(concatFiles);
    }

    return {
        concatFiles: concatFilesPromise
    };
}
