/*
 * grunt-qunit-missed
 * https://github.com/jmcateer/grunt-qunit-missed
 *
 * Copyright (c) 2015 Jeremy McAteer
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        clean: {
            options: {
                force: "true"
            },
            tests: ['tmp']
        },
        qunit_missed: {
            options: {
                coverageSourceLocation: "test/reports/coverage_reports/clover.xml", //cobertura-coverage.xml", //
                htmlResultOutputLocation: "tmp/results",
                teamName: "Team Grunt QUnit Missed"
            },
            all: {
                src: [
                    "test/scripts/**/*.js",
                    "!test/scripts/jquery*.js",
                    "!test/scripts/*qunit*.js"
                ]
            }
        },
        nodeunit: {
            tests: ['test/*_test.js']
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'qunit_missed', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);
};
