'use strict';

exports.init = function(grunt) {

    var pathLib = require("path");

    var looper = {
        accordion: {},
        paths: [],
        hitFiles: [],
        total: 0,
        hit: 0
    };

    looper.setPaths = function(filesSrc){

        grunt.verbose.debug("------  setPaths");
        if(filesSrc === undefined || filesSrc.length === 0) {
            grunt.log.error("qunit_missed:  filesSrc not set");
        }
        this.paths = filesSrc;
        this.total = this.paths.length;
    };

    looper.initAccordionMap = function() {
        grunt.verbose.debug("------  initAccordionMap");
        if(this.paths === undefined || this.paths.length === 0) {
            grunt.verbose.debug("qunit_missed:  paths not set");
            return;
        }
        for(var i = 0; i < this.paths.length; i++)
        {
            this.accordion[this.paths[i]] = false;
        }
    };

    looper.generateCoveredFilesList = function(outputLocation) {
        grunt.log.writeln("generateCoveredFilesList");
        grunt.verbose.debug("------  generateCoveredFilesList");
        // generate list of files with coverage based on instanbul reports.
        var configHit = [outputLocation + "/**/*.js.html"];
        var hitFilesRaw = grunt.file.expand(configHit);
        for(var j = 0; j < hitFilesRaw.length; j++)
        {
            var path = hitFilesRaw[j];
            path = path.replace(".html", "");
            path = pathLib.basename(path);
            this.hitFiles.push(path);
        }
        this.hit = this.hitFiles.length;
    };

    looper.checkFiles = function() {
        grunt.verbose.writeln("\nFiles (true if we have some code coverage, false if 0% coverage:");
        grunt.verbose.writeln("Hit:\tFile:");
        for(var key in this.accordion){
            for(var i = 0; i < this.hitFiles.length; i++){
                if(key.search(this.hitFiles[i]) > -1) {
                    this.accordion[key] = true;
                }
            }
            grunt.verbose.writeln(this.accordion[key] + "\t" + key);
        }
    };
    return looper;
};
