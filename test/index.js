var Code = require('code');   // assertion library
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var Hapi = require('hapi');
var Hoek = require('hoek')

var subdomain = require('../');

var expect = Code.expect;

lab.experiment('Subdomain plugin', function () {

  lab.test('should load correctly', async () => {

    const server = Hapi.Server({ });

    await server.register([{
      plugin: subdomain,
      options: {
        destination: 'tenant'
      }
    }]);
  })

  lab.test('should do nothing if no subdomain', async () => {

    const server = Hapi.Server({ host: 'example.com' });

    server.route({
      method: 'GET',
      path: '/',
      handler: async (request) => {
        return 'ok'
      }
    })

    await server.register({
      plugin: subdomain,
      options: {
        exclude: ['www', 'api'],
        destination: '/tenant'
      }
    });

    const res = await server.inject('http://example.com/');
    expect(res.statusCode).to.equal(200);

  })

  lab.test('should ignore whitelist', async () => {

    const server = Hapi.Server({ host: 'example.com' });

    server.route({
      method: 'GET',
      path: '/',
      handler: function(request) {
        return 'ok';
      }
    })

    await server.register([{
      plugin: subdomain,
      options: {
        exclude: ['www', 'api'],
        destination: '/tenant'
      }
    }]);

    const res = await server.inject('http://api.example.com/');
    expect(res.statusCode).to.equal(200);

  })

  lab.test('should route to destination', async () => {

    const server = Hapi.Server({ host: 'example.com' });

    await server.register([{
      plugin: subdomain,
      options: {
        exclude: ['www'],
        destination: '/tenant'
      }
    }]);

    server.route({
      method: 'GET',
      path: '/tenant/{tenant}/',
      handler: async (request) => {
        return request.params.tenant;
      }
    })


    const res = await server.inject('http://acme.example.com');
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.contain('acme');

  })

  lab.test('should route even complex paths', async () => {

    const server = Hapi.Server({ host: 'example.com' });

    server.route({
      method: 'GET',
      path: '/tenant/{tenant}/example',
      handler: async (request) => {

        return {tenant: request.params.tenant, query: request.query.foo};

      }
    })

    await server.register([{
      plugin: subdomain,
      options: {
        exclude: ['www'],
        destination: '/tenant'
      }
    }]);

    const res = await server.inject('http://acme.example.com/example?foo=bar');
    expect(res.statusCode).to.equal(200);
    expect(res.result.tenant).to.contain('acme');
    expect(res.result.query).to.contain('bar')

  })

  lab.test('POST', async () => {

    const server = Hapi.Server({ host: 'example.com' });

    server.route({
      method: 'POST',
      path: '/tenant/{tenant}/',
      handler: async (request) => {

        return request.payload.foo;

      }
    })

    await server.register([{
      plugin: subdomain,
      options: {
        exclude: ['www'],
        destination: '/tenant'
      }
    }]);

    const res = await server.inject({ 
      url: 'http://acme.example.com/',
      method: 'POST',
      payload:'{"foo": "bar"}'
    });
    expect(res.statusCode).to.equal(200);
    expect(res.result).to.equal('bar');

  })

});
