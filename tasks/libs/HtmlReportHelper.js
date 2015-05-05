'use strict';

exports.init = function(grunt) {

    var pathLib = require("path");

    var htmlHelper= {
        location: "",
        hitFiles: []
    };

    htmlHelper.loadHtmlFromLocation = function (path) {
        this.location = path;
    };

    htmlHelper.getFileNames = function () {
        // generate list of files with coverage based on instanbul html reports.

        var configHit = [this.location + "/**/*.js.html"];
        var hitFilesRaw = grunt.file.expand(configHit);

        grunt.verbose.writeln("\nHtmlReportHelper *.js.html files found: ");
        for (var j = 0; j < hitFilesRaw.length; j++) {
            var path = hitFilesRaw[j];
            grunt.verbose.writeln("path: " + path);
            path = path.replace(".html", "");
            path = pathLib.basename(path);
            this.hitFiles.push(path);
        }
        grunt.verbose.writeln();
        return this.hitFiles;
    };

    return htmlHelper;
};
