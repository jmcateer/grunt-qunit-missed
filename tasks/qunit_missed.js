/*
 * grunt-qunit-missed
 * https://github.com/jmcateer/grunt-qunit-missed
 *
 * Copyright (c) 2015 Jeremy McAteer
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

    var fileHelper = require("./libs/XMLReportHelper").init(grunt);

    grunt.registerTask("fileHelper", 'read, pasrse ', function() {
        grunt.log.writeln("inside and running fileHelper")
        if(!fileHelper) {
            grunt.log.writeln("fileHelper is not instantiated :(");
        }
        fileHelper.loadXmlDoc("test/reports/coverage_reports/clover.xml");
    });

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    if (!String.format) {
        String.format = function(format) {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match ;
            });
        };
    }

    var HtmlReportHelper = require('./libs/HtmlReportHelper').init(grunt);
    var Looper = require('./libs/Looper').init(grunt);

    grunt.registerMultiTask( 'qunit_missed', 'Generate report for JS files missed in code coverage', function() {

            grunt.log.writeln("adding requires");
            var options = this.options({
                htmlReport: "",
                htmlResultLocation: "",
                htmlTemplate: "",
                teamName: ""
            });

            if (!options.htmlResultLocation || options.htmlResultLocation === "") {
                options.htmlResultLocation = options.htmlReport;
            }

            grunt.log.writeln("Looper:" + Looper.toString());
            if(!Looper || !HtmlReportHelper) {
                grunt.log.writeln("looper or html helper is not instantiated :(");
            }
            if(!Looper.generateCoveredFilesList || HtmlReportHelper.createTemplate) {
                grunt.log.writeln("functions are not instantiated :(");
            }
            Looper.generateCoveredFilesList(options.htmlReport);
            Looper.setPaths(this.filesSrc);
            Looper.initAccordionMap();
            Looper.checkFiles();

            // create report numbers
            var total = Looper.total;
            var hit = Looper.hit;
            var missed = total - hit;
            var percent = ((hit/total) * 100).toPrecision(4);

            grunt.log.writeln("\n>> JS File Coverage:");
            grunt.log.writeln(">>\tTotal Files: " + total);
            grunt.log.writeln(">>\tHit: " + hit);
            grunt.log.writeln(">>\tMissed: " + missed);
            grunt.log.writeln(">>\tPercent: " + percent + "%");

            // generate html
            HtmlReportHelper.htmlTemplate = options.htmlTemplate;
            HtmlReportHelper.teamName = options.teamName;
            HtmlReportHelper.createTemplate();
            HtmlReportHelper.setVariablesToTemplate(percent, total, hit);
            HtmlReportHelper.setTableRows(Looper.accordion);

            grunt.verbose.debug("Contents of generated html report.");
            grunt.verbose.debug(HtmlReportHelper.htmlFile);
            var outputHtmlFile = options.htmlResultLocation + "/JS_CodeCoverage_files_missed_Report.html";
            grunt.file.write(outputHtmlFile, HtmlReportHelper.htmlFile);
            grunt.log.writeln(">>\n>>\tReport Location: " + outputHtmlFile);
        }
    );
};
