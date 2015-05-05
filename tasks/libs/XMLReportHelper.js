'use strict';

exports.init = function(grunt) {

    var xml2js = require('xml2js');

    var xmlHelper= {
        xml: "",
        jsonObj: "",
        type: "",
        fileNames: []
    };

    var TypeEnum = {
        CLOVER: 'clover',
        COBERTURA: 'cobertura'
    };

    xmlHelper.loadXmlDoc = function (path) {
        grunt.verbose.writeln("+++ Call XMLReportHelper.loadXmlDoc");

        this.xml = grunt.file.read(path);

        var data = "";
        var parser = xml2js.Parser();
        parser.parseString(this.xml, function(err, result) {
            if (err) {
                grunt.fail.warn('File ' + path + ' parsing errors: ' + err);
            }
            data = JSON.stringify(result, null, 2);
        });

        this.jsonObj = JSON.parse(data);
        this.type = this.jsonObj.coverage.$.clover === undefined ? TypeEnum.COBERTURA : TypeEnum.CLOVER;
    };

    xmlHelper.getFileNames = function () {
        grunt.verbose.debug("+++ Call XMLReportHelper.getFileNames");
        grunt.verbose.debug("report type: " + this.type);
        this.fileNames = [];

        if(this.jsonObj === "") {
            grunt.log.writeln("Xml file has not been loaded.  Unable to get file names.");
            grunt.log.writeln("returning null.");
            return null;
        }

        if(this.type === TypeEnum.COBERTURA ) {
            this.populateFileNamesCobertura();
        }
        else if (this.type === TypeEnum.CLOVER) {
            this.populateFileNamesClover();
        }

        return this.fileNames;
    };

    xmlHelper.getCodeCoverageOnHitFiles = function() {
        var covPercent = 0.0;
        if(this.jsonObj === "") {
            grunt.log.writeln("Xml file has not been loaded.  Unable to get file names.");
            grunt.log.writeln("returning null.");
            return null;
        }

        if(this.type === TypeEnum.COBERTURA ) {
            var metricsCO = this.jsonObj.coverage.$;
            covPercent = metricsCO['line-rate'];
        }
        else if (this.type === TypeEnum.CLOVER) {
            var metricsCL = this.jsonObj.coverage.project[0].metrics[0].$;
            var statements = metricsCL.statements;
            var coveredstatements = metricsCL.coveredstatements;
            covPercent = (coveredstatements / statements).toPrecision(4);
        }
        return covPercent;
    };

    xmlHelper.populateFileNamesCobertura = function() {
        // cobertura format
        // coverage -> packages[] -> classes[] -> class[] -> $ -> name="file.js"

        var packages = this.jsonObj.coverage.packages;

        for(var i = 0; i < packages.length; i++) {
            var packageObj = packages[i].package;

            for(var j= 0; j < packageObj.length; j++ ) {
                var classes = packageObj[j].classes;

                for (var k = 0; k < classes.length; k++) {
                    var classObj = classes[k].class;

                    for(var m = 0; m < classObj.length; m++) {
                        var file = classObj[m].$.name;
                        this.fileNames.push(file);
                    }
                }
            }
        }
    };

    xmlHelper.populateFileNamesClover = function() {
        // clover format
        // coverage -> project[] -> package[] -> file[] -> $ -> name="file.js"

        var project = this.jsonObj.coverage.project;

        for(var i = 0; i < project.length; i++) {
            var packageObj = project[i].package;

            for(var j = 0; j < packageObj.length; j++) {
                var fileObj = packageObj[j].file;

                for(var k = 0; k < fileObj.length; k++) {
                    var file = fileObj[k].$.name;
                    this.fileNames.push(file);
                }
            }
        }
    };

    return xmlHelper;
};
