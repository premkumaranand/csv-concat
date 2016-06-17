module.exports = function(options) {

    var extend = require('jquery-extend');
    var fs = require('fs');
    var parseCsv = require('csv-parse/lib/sync');
    var CsvFileParser = require('./csv-file-parser');

    var defaultOptions = {

        //What are the columns delimited by?
        delimiter: ',',

        //Array: Source directories where the csv files are and/or list of files
        src: [],

        //Ignore files with these names
        ignore: [],

        //Destination file where the concatenated CSVs are placed into
        dest: '',

        //Generate a prefix for the keys from the folder structure and the file name?
        addPrefixToKey: false,

        verbose: false
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
                if (name.indexOf("." + extension) !== -1) {
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

        var files = [];

        for (var i in options.src) {
            var name = options.src[i];

            if (!fs.statSync(name).isDirectory()){
                files.push(name);
            } else {
                files = getFiles(name, "csv", files);
            }
        }

        var scannableFiles = getScannableFiles(files);

        scannableFiles.forEach(function(file) {

            if (options.verbose) {
                console.log("   ");
                console.log("Reading file: " + file);
            }

            try {
                var csvFileParser = new CsvFileParser(file, options, parseCsv, fs);
                var records = csvFileParser.getRecords();

                if (options.verbose) {
                    console.log("  - Writing " + records.length + " lines into " + options.dest);
                }

                records.forEach(function (recordIter) {
                    outputStream.write(recordIter.join(options.delimiter) + '\n');
                });
            } catch (e) {
                if (options.verbose) {
                    console.log("- Failed parsing a record: " + e);
                }

                if (reject instanceof Function) {
                    reject("Failed parsing a record in file: " + file + "\nOriginal error message: " + e);
                    outputStream.end();
                    return;
                }
            }
        });
        
        outputStream.end();

        if (options.verbose) {
            console.log("    ");
            console.log("Concatenation written into: " + options.dest);
        }
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
