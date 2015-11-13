"use strict";

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		mochaTest: {
			test: {
				options: {
					reporter: "min"
				},
				src: ["test/*.test.js"]
			}
		},

		jshint: {
			options: {
				jshintrc: true
			},
			furious: ["lib/**/*.js"],
			test: ["test/*.test.js"],
			bench: ["bench/*.js"],
			build: ["Gruntfile.js"]
		},

		browserify: {	
			library: {
				options: {
					exclude: ["node-webcl"],
					transform: ["brfs"],
					browserifyOptions : {
						debug: false,
						standalone: "furious"
					}
				},
				files: {
					"furious.js": ["lib/furious.js"]
				}
			},
			jsworker: {
				options: {
					transform: ["brfs"],
					browserifyOptions : {
						debug: false
					}
				},
				files: {
					"furious-worker.js": ["lib/js/JSWorker.js"]
				}
			},
			asmjsworker: {
				options: {
					transform: ["brfs"],
					browserifyOptions : {
						debug: false
					}
				},
				files: {
					"furious-asmjs-worker.js": ["lib/asmjs/AsmJSWorker.js"]
				}
			},
			test: {
				options: {
					exclude: ["node-webcl"],
					transform: ["brfs"],
					browserifyOptions : {
						debug: true
					}
				},
				files: {
					"test.js": ["test/*.test.js"]
				}
			},
			benchmark: {
				options: {
					exclude: ["node-webcl"],
					transform: ["brfs"],
					browserifyOptions : {
						debug: true
					}
				},
				files: {
					"bench.js": ["bench/demo.js"]
				}
			}
		},

		uglify: {
			library: {
				files: {
					"furious.min.js": ["furious.js"]
				}
			},
			worker: {
				files: {
					"furious-worker.min.js": ["furious-worker.js"]
				}
			},
			asmjsworker: {
				files: {
					"furious-asmjs-worker.min.js": ["furious-asmjs-worker.js"]
				}
			}
		},

		yuidoc: {
			furious: {
				name: "<%= pkg.name %>",
				description: "<%= pkg.description %>",
				version: "<%= pkg.version %>",
				options: {
					paths: "lib",
					outdir: "doc",
					themedir: "./node_modules/yuidoc-bootstrap-theme",
					helpers: ["./node_modules/yuidoc-bootstrap-theme/helpers/helpers.js"]
				}
			}
		},

		shell: {
			configure: {
				command: "python configure.py"
			},
			emcc: {
				command: "emcc lib/asmjs/AsmJSWorker.c -o furious-asmjs-worker.js -s EXPORTED_FUNCTIONS=\"['_createConstArray', '_fillDiag']\" --post-js furious-asmjs-worker.js"
			},
			build: {
				command: "ninja"
			}
		}
	});

	grunt.loadNpmTasks("grunt-mocha-test");
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-yuidoc");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-shell");

	grunt.registerTask("default", ["mochaTest", "jshint", "browserify", "uglify", "yuidoc", "shell:configure", "shell:build"]);
	grunt.registerTask("test", ["mochaTest"]);
};
