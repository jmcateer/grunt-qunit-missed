'use strict';

exports.init = function(grunt) {

    var reportHelper = {
        htmlTemplate: "",
        htmlFile: "",
        teamName: "Not Set",
        fileTD: "<tr>\n<td class=\"file {0}\" data-value=\"{1}\">{2}</td>\n",
        graphTD: "<td data-value=\"{0}\" class=\"pic {1}\"><span class=\"cover-fill\" style=\"width: {2}px;\"></span><span class=\"cover-empty\" style=\"width:{3}px;\"></span></td>\n</tr>",

        DEFAULT_HTML_TEMPLATE: "node_modules/grunt-qunit-missed/html/Template_Missing_File_Report.html",
    };

    reportHelper.createTemplate = function () {
        if (!this.htmlTemplate || this.htmlTemplate === "") {
            grunt.verbose.writeln("reportHelper: htmlTemplate not set. Using default");
            this.htmlTemplate = this.DEFAULT_HTML_TEMPLATE;
        }
        this.htmlFile = grunt.file.read(this.htmlTemplate);
    };

    reportHelper.setVariablesToTemplate = function (percent, total, hit) {
        this.htmlFile = this.htmlFile.replace("<!-- teamName -->", this.teamName);

        var headerText = "{0}%  ( {1} of {2} have some coverage )";
        var totalFileStats = String.format(headerText, percent, hit, total);
        this.htmlFile = this.htmlFile.replace("<!-- percentCovered -->", totalFileStats);

        var headerColor = percent < 70 ? "low" : percent < 90 ? "medium" : "high";
        this.htmlFile = this.htmlFile.replace("header UNSET", "header " + headerColor);
    };

    reportHelper.setTableRows = function (accordion) {
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

    return reportHelper;
};
