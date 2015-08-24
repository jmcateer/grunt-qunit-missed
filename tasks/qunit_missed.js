/*
 * grunt-qunit-missed
 * https://github.com/jmcateer/grunt-qunit-missed
 *
 * Copyright (c) 2015 Jeremy McAteer
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

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


    var htmlReportCreator = require('./libs/HtmlReportCreator').init(grunt);
    var Looper = require('./libs/Looper').init(grunt);

    grunt.registerMultiTask( 'qunit_missed', 'Generate report for JS files missed in code coverage', function() {

            var options = this.options({
                coverageSourceLocation: "",
                htmlResultOutputLocation: "",
                htmlTemplate: "",
                teamName: "",
                threshold: 0,
                force: false
            });
            var checkFileCoverage = function(threshold, value, printName) {
                if (threshold && value < threshold) {
                    grunt.log.writeln();
                    var message = 'File coverage for ' + printName + ' was below threshold (' + value + '% < ' + threshold + '%)';
                    if (options && options.force) {
                        grunt.log.error(message);
                    } else {

                        grunt.warn(message);
                    }
                }
            };

            Looper.generateCoveredFilesList(options.coverageSourceLocation);
            Looper.setPaths(this.filesSrc);
            Looper.initAccordionMap();
            Looper.checkFiles();

            // create report numbers
            var covPercent = (Looper.coverageOnHitFiles * 100).toPrecision(4);
            var total = Looper.total;
            var hit = Looper.hit;
            var missed = total - hit;
            var percentHit = ((hit/total) * 100).toPrecision(4);
            var percentMissed = ((missed/total) * 100).toPrecision(4);

            grunt.log.writeln("\n>> JS File Coverage:");
            grunt.log.writeln(">>\tTotal Files: " + total);
            grunt.log.writeln(">>\tHit: " + hit);
            grunt.log.writeln(">>\tMissed: " + missed);
            grunt.log.writeln(">>\tPercent: " + percentHit + "%\n");

            // print full summary with code coverage numbers
            var consoleSummaryTemplate = "qunitSummary: Coverage: {0}% on {1} files. Missed {2} / {3}. **";
            var consoleSummary = String.format(consoleSummaryTemplate, covPercent, hit, missed, total, percentMissed);
            var teamSuffix = (options.teamName === "") ? "" : String.format("{0}: ", options.teamName);

            grunt.log.writeln(teamSuffix + consoleSummary);
            grunt.log.writeln(teamSuffix + "qunitCodecoverage-Line:" + covPercent + "%");
            grunt.log.writeln(teamSuffix + "qunitCodecoverage-TotalFiles:" + total);
            grunt.log.writeln(teamSuffix + "qunitCodecoverage-Hit:" + hit);
            grunt.log.writeln(teamSuffix + "qunitCodecoverage-Missed:" + missed);
            grunt.log.writeln(teamSuffix + "qunitCodecoverage-MissedPercent:" + percentMissed + "%");
            grunt.log.writeln(teamSuffix + "qunitCodecoverage-HitPercent:" + percentHit + "%");

            // generate html
            htmlReportCreator.htmlTemplate = options.htmlTemplate;
            htmlReportCreator.teamName = options.teamName;
            htmlReportCreator.createTemplate();
            htmlReportCreator.setVariablesToTemplate(percentHit, total, hit, covPercent);
            htmlReportCreator.setTableRows(Looper.accordion);

            var outputHtmlFile = options.htmlResultOutputLocation + "/JS_CodeCoverage_files_missed_Report.html";
            grunt.file.write(outputHtmlFile, htmlReportCreator.htmlFile);
            grunt.log.writeln(">>\tReport Location: " + outputHtmlFile);

            checkFileCoverage(options.threshold, percentHit, options.teamName);
        }
    );
};
