module.exports = function (grunt) {
    var files = [
        "js/main.js",
        "js/modal.js",
        "js/ui-bootstrap-custom-0.12.1.min.js",
        "bower_components/angular-blurred-modal/st-blurred-dialog.js"
    ];

    var withounBrowserify = ['static/js/br_app.js', 'bower_components/materialize/bin/materialize.js'];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            compress: {
                options: {
                    keepSpecialComments: "0"
                },
                files: {
                    "static/css/app.css": [
                        "node_modules/materialize-css/bin/materialize.css",
                        "node_modules/bootstrap/dist/css/bootstrap.css",
                        "bower_components/angular-modal/modal.css",
                        "node_modules/ng-table/ng-table.css",
                        "tmp/app.css"
                    ]
                }
            }
        },
        less: {
            app: {
                files: {
                    "tmp/app.css": [
                        "css/application.less"
                    ]
                }
            }
        },
        concat: {
            develop: {
                files: {
                    "static/js/app.js": files
                }
            },
            ignoringBrowserify: {
                files: {
                    "static/js/vendor_app.js": withounBrowserify
                }
            }
        },
        browserify: {
            main: {
                src: 'static/js/app.js',
                dest: 'static/js/br_app.js'
            }
        },
        copy: {
            static: {
                files: [
                    {
                        expand: true,
                        dest: 'mobWallet/www/static',
                        cwd: 'static',
                        src: [
                            '**/*'
                        ]
                    }
                ]
            },
            partials: {
                files: [
                    {
                        expand: true,
                        dest: 'mobWallet/www/partials',
                        cwd: 'partials',
                        src: [
                            '**/*'
                        ]
                    }
                ]
            },
            images: {
                files: [
                    {
                        expand: true,
                        dest: 'mobWallet/www/images',
                        cwd: 'images',
                        src: [
                            '**/*'
                        ]
                    }
                ]
            },
            font: {
                files: [
                    {
                        expand: true,
                        dest: 'mobWallet/www/font',
                        cwd: 'font',
                        src: [
                            '**/*'
                        ]
                    }
                ]
            },
            wallet: {
                files: [
                    {
                        expand: true,
                        dest: 'mobWallet/www/',

                        src: 'wallet.html'
                    }
                ]
            }
        },
        uglify: {
            release: {
                options: {
                    preserveComments: false,
                    wrap: false,
                    mangle: false
                },
                files: {
                    "static/js/app.js": files
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-browserify');


    // Default task.
    grunt.registerTask("default", ["less", "cssmin", "concat:develop", 'browserify', "concat:ignoringBrowserify", "copy:static", "copy:partials", "copy:images", "copy:font", "copy:wallet"]);
    // Release task
    grunt.registerTask("release", ["default", "uglify:release"]);

};
