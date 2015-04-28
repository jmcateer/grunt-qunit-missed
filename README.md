# grunt-qunit-missed

> The best Grunt plugin ever.

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

Specify where the location for the report to be located.

#### options.fileNamer
Type: `Function`
Default value: `function (url) { return path.basename(url).replace(/\.html(.*)$/, ''); }`

Specify a function that converts test URLs into destination filenames.  Note that filenames are automatically prefixed with 'TEST-' and given a '.xml' extension.  The default implementation uses the name of the HTML test-runner, discarding the query string.

#### options.classNamer
Type `Function`
Default value: `function (moduleName, url) { return moduleName.replace(/[\\|\/]/g, '.').replace(/\s+/g, '_'); }`

Specify a function that converts the supplied module name and URL into the value used in the report's 'classname' attribute.  Note that if the test did not belong to a module, the string `'global'` will be passed.  In order to be compliant, the function should ensure that the resulting value represents full classpaths as you might see in Java, such as `my.example.package.someFile` or `com.example.coolthings.Sorter`; the main restriction is that folders or packages must be separated by dots. These enable tools such as Jenkins to group the tests and provide an interface to drill down into the results.

## Release History
_(Nothing yet)_
# grunt-qunit-missed
