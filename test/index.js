var Code = require('code');   // assertion library
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var Hapi = require('hapi');
var Hoek = require('hoek')

var subdomain = require('../');

var expect = Code.expect;

lab.experiment('Subdomain plugin', function () {

  lab.test('should load correctly', function(done) {

    var server = new Hapi.Server({ minimal: true});

    server.register([{
      register: subdomain,
      options: {
        destination: 'tenant'
      }
    }], function (err) {
      expect(err).to.not.exist();
      done()

    });

  })

  lab.test('should do nothing if no subdomain', function(done) {

    var server = new Hapi.Server({ minimal: true});

    server.connection({host: 'example.com'});

    server.route({
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        reply('ok');
      }
    })

    server.register([{
      register: subdomain,
      options: {
        exclude: ['www', 'api'],
        destination: '/tenant'
      }
    }], Hoek.ignore);

    server.inject('http://example.com/', function(res) {
      expect(res.statusCode).to.equal(200);
      done();
    })

  })

  lab.test('should ignore whitelist', function(done) {

    var server = new Hapi.Server({ minimal: true});

    server.connection({host: 'example.com'});

    server.route({
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        reply('ok');
      }
    })

    server.register([{
      register: subdomain,
      options: {
        exclude: ['www', 'api'],
        destination: '/tenant'
      }
    }], Hoek.ignore);

    server.inject('http://api.example.com/', function(res) {
      expect(res.statusCode).to.equal(200);
      done();
    })

  })

  lab.test('should route to destination', function(done) {

    var server = new Hapi.Server({ minimal: true});

    server.connection({host: 'example.com'});

    server.route({
      method: 'GET',
      path: '/tenant/{tenant}/',
      handler: function(request, reply) {
        reply(request.params.tenant);
      }
    })

    server.register([{
      register: subdomain,
      options: {
        exclude: ['www'],
        destination: '/tenant'
      }
    }], Hoek.ignore);

    server.inject('http://acme.example.com', function(res) {
      expect(res.statusCode).to.equal(200);
      expect(res.result).to.contain('acme');
      done();
    })

  })

  lab.test('should route even complex paths', function(done) {

    var server = new Hapi.Server({ minimal: true});

    server.connection({host: 'example.com'});

    server.route({
      method: 'GET',
      path: '/tenant/{tenant}/example',
      handler: function(request, reply) {

        reply({tenant: request.params.tenant, query: request.query.foo});

      }
    })

    server.register([{
      register: subdomain,
      options: {
        exclude: ['www'],
        destination: '/tenant'
      }
    }], Hoek.ignore);

    server.inject('http://acme.example.com/example?foo=bar', function(res) {
      expect(res.statusCode).to.equal(200);
      expect(res.result.tenant).to.contain('acme');
      expect(res.result.query).to.contain('bar')
      done();
    })

  })

  lab.test('post works as well')




});
