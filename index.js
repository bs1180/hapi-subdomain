var Hoek = require('hoek');

exports.register = function(server, options, next) {

  Hoek.assert(options.destination, 'Must provide a destination');

  if (options.exclude) {

    Hoek.assert(options.exclude instanceof Array, 'Exclude must be an array' );

  }

  server.ext('onRequest', function(request, reply) {

    var expression = new RegExp(/(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i);

    var subdomain = expression.exec(request.info.hostname);

    if (subdomain) subdomain = subdomain[1];

    if (subdomain && !Hoek.contain(options.exclude, subdomain)) {

      request.setUrl(options.destination + '/' + subdomain + request.url.path);

    }

    return reply.continue();

  })

  next();
}

exports.register.attributes = {

  pkg: require('./package.json')

};
