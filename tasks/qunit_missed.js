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

    var DEFAULT_HTML_TEMPLATE = "node_modules/grunt-qunit-missed/html/Template_Missing_File_Report.html";

    var LoopHelper = {
        accordion: {},
        paths: [],
        hitFiles: [],
        total: 0,
        hit: 0,

        setPaths: function(filesSrc){
            grunt.verbose.writeln("------  setPaths");
            if(filesSrc === undefined || filesSrc.length === 0) {
                grunt.log.error("qunit_missed:  filesSrc not set");
            }
            this.paths = filesSrc;
            this.total = this.paths.length;
        },

        initAccordionMap: function() {
            grunt.verbose.writeln("------  initAccordionMap");
            if(this.paths === undefined || this.paths.length === 0) {
                grunt.log.error("qunit_missed:  paths not set");
                return;
            }
            for(var i = 0; i < this.paths.length; i++)
            {
                this.accordion[this.paths[i]] = false;
            }
        },

        generateCoveredFilesList: function(outputLocation) {
            grunt.verbose.writeln("------  generateCoveredFilesList");
            // generate list of files with coverage based on instanbul reports.
            var configHit = [outputLocation + "/**/*.js.html"];
            var hitFilesRaw = grunt.file.expand(configHit);
            for(var j = 0; j < hitFilesRaw.length; j++)
            {
                var path = hitFilesRaw[j];
                path = path.replace(".html", "").replace(outputLocation + "/scripts/", "");
                this.hitFiles.push(path);
            }
            this.hit = this.hitFiles.length;
        },

        checkFiles: function() {
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
        }
    };

    var HtmlReportHelper = {
        htmlTemplate: "",
        htmlFile: "",
        teamName: "Not Set",
        fileTD: "<tr>\n<td class=\"file {0}\" data-value=\"{1}\" style=\"text-align: left\">{2}</td>\n",
        graphTD: "<td data-value=\"{0}\" class=\"pic {1}\"><span class=\"cover-fill\" style=\"width: {2}px;\"></span><span class=\"cover-empty\" style=\"width:{3}px;\"></span></td>\n</tr>",

        createTemplate: function() {
            if(!this.htmlTemplate || this.htmlTemplate === "") {
                grunt.verbose.writeln("HtmlReportHelper: htmlTemplate not set. Using default");
                this.htmlTemplate = DEFAULT_HTML_TEMPLATE;
            }
            this.htmlFile = grunt.file.read(this.htmlTemplate);
        },
        setVariablesToTemplate: function(percent, total, hit){
            this.htmlFile = this.htmlFile.replace("<!-- teamName -->", this.teamName);

            var headerText = "{0}%  ( {1} of {2} have some coverage )";
            var totalFileStats =  String.format(headerText, percent, hit, total);
            this.htmlFile = this.htmlFile.replace("<!-- percentCovered -->", totalFileStats);

            var headerColor = percent < 70 ? "low" : percent < 90 ? "medium" : "high";
            this.htmlFile = this.htmlFile.replace("header UNSET", "header " + headerColor);
        },
        setTableRows: function(accordion) {
            var fileTableRows = "";
            for (var key in accordion) {
                var color = accordion[key] ? "high" : "low";
                var value = color === "high" ? 50 : 1;
                var width = 100 - value;

                var row = String.format(this.fileTD, color, key, key);
                row = row + String.format(this.graphTD, value, color, value, width);

                fileTableRows = fileTableRows + row;
            }
            this.htmlFile = this.htmlFile.replace("<!-- FileList -->", fileTableRows);
        }
    };

    grunt.registerMultiTask( 'qunit_missed', 'Generate report for JS files missed in code coverage', function() {

            var options = this.options({
                htmlReport: "",
                htmlTemplate: "",
                teamName: ""
            });

            LoopHelper.generateCoveredFilesList(options.htmlReport);
            LoopHelper.setPaths(this.filesSrc);
            LoopHelper.initAccordionMap();
            LoopHelper.checkFiles();

            // create report numbers
            var total = LoopHelper.total;
            var hit = LoopHelper.hit;
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
            HtmlReportHelper.setTableRows(LoopHelper.accordion);

            grunt.verbose.writeln("Contents of generated html report.");
            grunt.verbose.writeln(HtmlReportHelper.htmlFile);
            var outputHtmlFile = options.htmlReport + "/JS_CodeCoverage_files_missed_Report.html";
            grunt.file.write(outputHtmlFile, HtmlReportHelper.htmlFile);
            grunt.log.writeln(">>\n>>\tReport Location: " + outputHtmlFile);
        }
    );
};
