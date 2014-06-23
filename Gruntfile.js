module.exports = function() {

  this.loadNpmTasks("grunt-contrib-jshint");
  this.loadNpmTasks("grunt-contrib-csslint");
  this.loadNpmTasks("grunt-html-validation");

  this.initConfig({
    jshint: {
      files: ['scripts.js'],
      options: {
        globals: {
          $: false,
          jQuery: false,
          _: false
        }
      }
    },
    csslint: {
      lint: {
        options: {
          'ids': false,
          'box-model': false,
          'qualified-headings': false,
          'unique-headings': false
        },
        src: ['style.css']
      }
    },
    validation: {
      files: '_site/**/!(google*).html'
    }
  });

  return this.registerTask("default", ["jshint", "csslint"]);
};
