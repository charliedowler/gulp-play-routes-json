'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var playToJSON = require('play-routes-to-json');
var playFromJSON = require('play-routes-from-json');

module.exports = function(param) {
  if (!param) {
    new gutil.PluginError('gulp-play-routes-to-json', {
      message: 'No param supplied'
    });
  }
  else if (!param.toJSON || !param.fromJSON) {
    new gutil.PluginError('gulp-play-routes-to-json', {
      message: 'Missing toJSON or fromJSON params, check the README.'
    });
  }

  // see 'Writing a plugin'
  // https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/README.md
  function playRoutesToJSON(file, enc, callback) {
    /*jshint validthis:true*/

    // Do nothing if no contents
    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {

      // http://nodejs.org/api/stream.html
      // http://nodejs.org/api/child_process.html
      // https://github.com/dominictarr/event-stream

      // accepting streams is optional
      this.emit('error',
        new gutil.PluginError('gulp-play-routes-to-json', 'Stream content is not supported'));
      return callback();
    }

    // check if file.contents is a `Buffer`
    if (file.isBuffer()) {

      // manipulate buffer in some way
      // http://nodejs.org/api/buffer.html
      var contents = file.contents.toString();
      var key = param.key;

      if (param.toJSON) {
        contents = playToJSON(contents);
      }
      else {
        contents = playFromJSON(JSON.parse(contents).routes);
      }
      file.contents = new Buffer(contents);

      this.push(file);
    }
    return callback();
  }

  return through.obj(playRoutesToJSON);
};