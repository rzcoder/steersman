'use strict';

const path = require('path');

module.exports = function (grunt) {
    const config = {
        pkg: require('./package.json'),
        isDev: grunt.option('no-dev'),
        noTests: grunt.option('no-off-test'),
        isWatch: grunt.option('no-watch')
    };

    grunt.initConfig({
        clean: {
            dist: ['lib/']
        },

        babel: {
            options: {
                sourceMap: config.isDev,
                presets: ['es2015']
            },
            dist: {
                files: [
                    {expand: true, cwd: "./src/", src: "**/*.js", dest: "./lib"}
                ]
            }
        },

        jshint: {
            js: {
                options: {
                    esversion: 6
                },
                files: {
                    src: ['src/**/*.js', 'tests/**/*.js']
                }
            }
        },

        simplemocha: {
            options: {
                reporter: 'list'
            },
            all: {src: ['tests/**/*.js']}
        },

        watch: {
            //js: {
            //    files: ['src/**/*.js', 'tests/**/*.js'],
            //    tasks: ['jshint']
            //},
            build: {
                files: ['src/**/*.js'],
                tasks: ['babel']
            }
        },

        webpack: {
            options: {
                stats: {
                    colors: true,
                    modules: false,
                    reasons: false
                },

                failOnError: !config.isWatch,
                devtool: config.isDev && "inline-source-map",

                watch: config.isWatch,
                keepalive: config.isWatch
            },
            js: {
                entry: './tests/web/index.js',
                output: {
                    path: './tests/web',
                    filename: 'bundle.js'
                },

                resolve: {
                    extensions: ["", ".js", ".styl"],
                    root: [path.resolve('./src'), path.resolve(__dirname, 'node_modules')],
                    alias: {
                        blocks: 'scripts/blocks',
                        components: 'scripts/components',
                        styles: 'styles'
                    }
                },

                module: {
                    loaders: [
                        {
                            test: /\.js?$/,
                            exclude: /(node_modules|bower_components)/,
                            loader: 'babel',
                            query: {
                                cacheDirectory: true,
                                presets: ['es2015', 'stage-1']
                            }
                        }
                    ]
                }
            }
        }
    });

    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        'simplemocha': 'grunt-simple-mocha'
    });

    grunt.registerTask('compile', ['babel']);

    grunt.registerTask('default', ['jshint', 'compile', 'test']);

    grunt.registerTask('test', config.noTests ? ['simplemocha'] : []);

    grunt.registerTask('web', 'jshint', 'webpack');

    grunt.registerTask('w', ['default', 'watch']);
};