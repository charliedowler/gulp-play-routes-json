'use strict';

var fs = require('fs'),
  es = require('event-stream'),
  should = require('should');

require('mocha');

delete require.cache[require.resolve('../')];

var gutil = require('gulp-util'),
  routesToJSON = require('../');

describe('gulp-play-routes-to-json', function () {
  var routes, routes_JSON;

  beforeEach(function () {
    routes = new gutil.File({
      path: 'test/fixtures/routes',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/routes')
    });
    routes_JSON = new gutil.File({
      path: 'test/fixtures/routes.json',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.readFileSync('test/fixtures/routes.json')
    });
  });

  it('should convert the routes file to JSON', function (done) {

    var stream = routesToJSON({
      toJSON: true
    });

    stream.on('error', function (err) {
      should.exist(err);
      done(err);
    });

    stream.on('data', function (newFile) {

      should.exist(newFile);
      should.exist(newFile.contents);
      String(newFile.contents).should.equal(String(routes_JSON.contents));
      done();
    });

    stream.write(routes);
    stream.end();
  });
  it('should convert the routes file from JSON', function (done) {

    var stream = routesToJSON({
      fromJSON: true
    });

    stream.on('error', function (err) {
      should.exist(err);
      done(err);
    });

    stream.on('data', function (newFile) {

      should.exist(newFile);
      should.exist(newFile.contents);
      String(newFile.contents).should.equal(String(routes.contents));
      done();
    });
    routes_JSON.contents = new Buffer(String(routes_JSON.contents));
    stream.write(routes_JSON);
    stream.end();
  });


  it('should error on stream', function (done) {

    var srcFile = new gutil.File({
      path: 'test/fixtures/routes',
      cwd: 'test/',
      base: 'test/fixtures',
      contents: fs.createReadStream('test/fixtures/routes')
    });

    var stream = routesToJSON({
      toJSON: true
    });

    stream.on('error', function (err) {
      should.exist(err);
      done();
    });

    stream.on('data', function (newFile) {
      newFile.contents.pipe(es.wait(function (err, data) {
        done(err);
      }));
    });

    stream.write(srcFile);
    stream.end();
  });
});