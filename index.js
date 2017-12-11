const Hoek = require('hoek');

async function register (server, options) {

  Hoek.assert(options.destination, 'Must provide a destination');

  if (options.exclude) {

    Hoek.assert(options.exclude instanceof Array, 'Exclude must be an array' );

  }

  server.ext('onRequest', async (request, h) => {

    const expression = new RegExp(/(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i);

    let subdomain = expression.exec(request.info.hostname);

    if (subdomain) subdomain = subdomain[1];

    if (subdomain && !Hoek.contain(options.exclude, subdomain)) {
      
      const targetPath = options.destination + '/' + subdomain + request.url.path;
      request.setUrl(targetPath);

    }

    return h.continue

  })

}

module.exports = {
  name: 'hapi-subdomain',
  version: '1.0.0',
  register,
}
