'use strict';

exports.init = function(grunt) {

    var xml2js = require('xml2js');

    var xmlHelper= {
        xml: "",
        jsonObj: "",
        type: ""
    };

    var TypeEnum = {
        CLOVER: 'clover',
        COBERTURA: 'cobertura'
    }

    xmlHelper.loadXmlDoc = function (path, type) {
        this.type = type; // must be clover or cobertura

        this.xml = grunt.file.read(path);

        var data = "";
        var parser = xml2js.Parser();
        parser.parseString(this.xml, function(err, result) {
            if (err) {
                grunt.fail.warn('File ' + path + ' parsing errors: ' + err);
            }
            data = JSON.stringify(result, null, 2);
        });

        grunt.log.writeln(data);
        this.jsonObj = JSON.parse(data);

        this.type = this.jsonObj.coverage.$ == undefined ? TypeEnum.COBERTURA : TypeEnum.CLOVER;

        grunt.log.writeln("getting value from json: " + this.jsonObj.coverage.$.generated);
};

    xmlHelper.getFileNames = function () {
        var fileList = [];

        if(this.type === TypeEnum.COBERTURA ) {
            // cobertura format
            // coverage -> packages -> classes -> class name="file.js"

        }
        else if (this.type === TypeEnum.CLOVER) {
            // clover format
            // coverage -> project[] -> package -> file name="file.js"

        }

        return fileList;
    };
    return xmlHelper;
};
