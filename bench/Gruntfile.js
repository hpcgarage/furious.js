(function(){
    module.exports = function(grunt) {
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),

            browserify: {
                js: {
                    options: {
                        exclude: ["node-webcl"],
                        transform: ["brfs"],
                        browserifyOptions:{debug:true}
                    },
                    src:["dev/js/index.js"
                        , "dev/js/routes.js"
                        , "dev/partials/HomeCtrl.js"],
                    dest: "dist/js/index.js"
                }
            },
            copy:{
                all: {
                    expand: true,
                    cwd:'dev/',
                    src:['**/*.html', '**/*.css'],
                    dest:'dist/'
                }
            }

        });
        grunt.loadNpmTasks('grunt-browserify');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.registerTask('default', ['browserify', 'copy']);
    }
})();