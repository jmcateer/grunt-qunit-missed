'use strict';

exports.init = function(grunt) {

    var xmlHelper = require("./XMLReportHelper").init(grunt);
    var htmlHelper = require("./HTMLReportHelper").init(grunt);
    var pathLib = require("path");

    var looper = {
        accordion: {},
        reportSource: "",
        paths: [],
        hitFiles: [],
        total: 0,
        hit: 0,
        coverageOnHitFiles: 0
    };

    looper.setPaths = function(filesSrc){
        if(filesSrc === undefined || filesSrc.length === 0) {
            grunt.log.error("qunit_missed:  filesSrc not set");
        }
        this.paths = filesSrc;
        this.total = this.paths.length;
    };

    looper.initAccordionMap = function() {
        if(this.paths === undefined || this.paths.length === 0) {
            grunt.verbose.debug("qunit_missed:  paths not set");
            return;
        }
        for(var i = 0; i < this.paths.length; i++)
        {
            this.accordion[this.paths[i]] = false;
        }
    };

    looper.generateCoveredFilesList = function(reportSourcePath) {
        this.reportSource = reportSourcePath;
        var isFile = grunt.file.isFile(reportSourcePath);
        grunt.verbose.debug("Report source path: " + reportSourcePath);

        if (isFile) {
            grunt.verbose.debug("File passed in.  Treating as clover / cobertura xml report");
            xmlHelper.loadXmlDoc(reportSourcePath);
            this.hitFiles = xmlHelper.getFileNames();
        }
        else {
            grunt.verbose.debug("Directory passed in.  Treating as a directory for *.js.html files");
            htmlHelper.loadHtmlFromLocation(reportSourcePath);
            this.hitFiles = htmlHelper.getFileNames();
        }
        this.hit = this.hitFiles.length;
    };

    looper.getCodeCoverageOfHitFiles = function() {
        var isFile = grunt.file.isFile(this.reportSource);
        var covPercent = 0.0;
        if(isFile) {
            covPercent = xmlHelper.getCodeCoverageOnHitFiles();
        }
        else {

        }
        return covPercent;
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
