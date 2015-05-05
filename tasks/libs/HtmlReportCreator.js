'use strict';

exports.init = function(grunt) {

    var path = require("path");

    var reportCreator = {
        htmlTemplate: "",
        htmlFile: "",
        teamName: "Not Set",
        fileTD: "<tr>\n<td class=\"file {0}\" data-value=\"{1}\">{2}</td>\n",
        graphTD: "<td data-value=\"{0}\" class=\"pic {1}\"><span class=\"cover-fill\" style=\"width: {2}px;\"></span><span class=\"cover-empty\" style=\"width:{3}px;\"></span></td>\n</tr>",

        DEFAULT_HTML_TEMPLATE: "tasks/html/Template_Missing_File_Report.html"
    };

    reportCreator.createTemplate = function () {
        if (!this.htmlTemplate || this.htmlTemplate === "") {

            var cwd = path.resolve();
            var checkModulesPath = cwd + "/node_modules/grunt-qunit-missed/";
            var checkPluginPath = cwd + "/";

            if(grunt.file.isDir(checkModulesPath)) {
                this.htmlTemplate = checkModulesPath + this.DEFAULT_HTML_TEMPLATE;
            }
            else if (grunt.file.isDir(checkPluginPath)) {
                this.htmlTemplate = checkPluginPath + this.DEFAULT_HTML_TEMPLATE;
            }
        }
        this.htmlFile = grunt.file.read(this.htmlTemplate);
    };

    reportCreator.setVariablesToTemplate = function (percentHit, total, hit, covPercent) {
        this.htmlFile = this.htmlFile.replace("<!-- teamName -->", this.teamName);

        var headerText = "{0}% ";
        var totalFileStats = String.format(headerText, covPercent, hit, total);
        this.htmlFile = this.htmlFile.replace("<!-- percentCovered -->", totalFileStats);

        var withZeroText = "{0} of {1} ({2}% hit)";
        var missed = total - hit;
        var totalWtihZeroStats = String.format(withZeroText, missed, total, percentHit);
        this.htmlFile = this.htmlFile.replace("<!-- withZero -->", totalWtihZeroStats);

        var headerColor = percentHit < 60 ? "low" : percentHit < 90 ? "medium" : "high";
        this.htmlFile = this.htmlFile.replace("header UNSET", "header " + headerColor);
    };

    reportCreator.setTableRows = function (accordion) {
        var fileTableRows = "";
        for (var key in accordion) {
            var color = accordion[key] ? "medium" : "low";
            var value = color === "medium" ? 50 : 1;
            var width = 100 - value;

            var row = String.format(this.fileTD, color, key, key);
            row = row + String.format(this.graphTD, value, color, value, width);

            fileTableRows = fileTableRows + row;
        }
        this.htmlFile = this.htmlFile.replace("<!-- FileList -->", fileTableRows);
    };

    return reportCreator;
};
