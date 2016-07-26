module.exports = function(options) {

    var extend = require('jquery-extend');
    var fs = require('fs');
    var parseCsv = require('csv-parse/lib/sync');
    var CsvFileParser = require('./csv-file-parser');
    var mkdirp = require('mkdirp');

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

    function createDestDir(destFilePath) {
        if (typeof destFilePath !== 'string') {
            throw new Error("Illegal argument destFilePath: " + destFilePath + ". It actually is a " + (typeof destFilePath));
        }

        var dirPath = require('path').parse(destFilePath).dir;
        mkdirp.sync(dirPath);
    }

    function log(message, forVerbose) {
        if ((forVerbose && options.verbose) || !forVerbose) {
            console.log(message);
        }
    }

    function logV(message) {
        log(message, true);
    }

    function concatFiles(resolve, reject) {
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

        createDestDir(options.dest);

        try {
            scannableFiles.forEach(function (file) {
                logV("\nReading file: " + file);

                var lines = [];

                try {
                    var csvFileParser = new CsvFileParser(file, options, parseCsv, fs);
                    var records = csvFileParser.getRecords();

                    logV("  - Writing " + records.length + " lines into " + options.dest);

                    records.forEach(function (recordIter) {
                        lines.push(recordIter.join(options.delimiter));
                    });
                } catch (e) {
                    logV("- Failed parsing a record: " + e);
                    throw e;
                }

                try {
                    fs.appendFileSync(options.dest, '\n' + lines.join('\n'));
                } catch (e) {
                    logV("- Failed writing to the file: " + options.dest + ". Exception: " + e);
                    throw e;
                }
            });
        } catch (e) {
            if (reject instanceof Function) {
                reject("Concatenation failed.");
                return;
            }
        }

        logV("\nConcatenation written into: " + options.dest);

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
};
