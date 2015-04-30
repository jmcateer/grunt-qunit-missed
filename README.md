# grunt-qunit-missed

This plugin produces a html report of files which have code coverage and those that do not. The html report color-codes the file yellow or red based on if it was hit during an Istanbul coverage pass.
The prerequisites for this plugin to function properly are that grunt-qunit-istanbul has been run and html reports have been generated.  This plugin will use that information to report files missed or have 0% coverage.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-qunit-missed --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-qunit-missed');
```

## The "qunit_missed" task

### Overview
In your project's Gruntfile, add a section named `qunit_missed` to the data object passed into `grunt.initConfig()`.


### Options
```js
grunt.initConfig({

    qunit_missed: {
        options: {
            // Task-specific options go here.
        },
        all: {

        }
    },
})
```

### Options

#### options.htmlReport
Type: `String`
No Default value

Specify where the location of the Istanbul html reports.  This location is used to find files with coverage as well as output location.

#### options.htmlResultLocation
Type: `String`
Default value: options.htmlReport

Specify where the result html report should be placed.  The default location is the same directory given by the options.htmlReport.

#### options.teamName
Type: `String`
Default value: empty string

Specify a name to be displayed at the head of the report.

#### options.htmlTemplate
Type `String`
Default value: `node_modules/grunt-qunit-missed/html/Template_Missing_File_Report.html`

Specify a templated file for the output of the results.

### all

#### all.src
Type: `String`
No Default value

File list of locations or globs.

## Release History
_(Nothing yet)_
# grunt-qunit-missed
