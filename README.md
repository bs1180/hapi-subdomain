# Hapi-subdomain

This is a simple plugin for using subdomains with Hapi.js, intended for simple multi-tenant applications. For example, if you give each user their own profile page at username.example.com, this plugin can invisibly redirect those urls to example.com/users/username.

Once the plugin is installed, it takes two options:

server.register([{
  register: require('hapi-subdomain'),
  options: {
    exclude: ['www', 'api', 'mail'],
    destination: '/tenant'
  }
  }], function(err) {
    if (err) console.log(err)
    });


Exclude is an array of subdomains to ignore.
Destination is the path to prepend the subdomain to.
Nothing happens if no subdomain (eg. https://example.com) is provided.
It only recognises the first subdomain.

Feedback and pull requests happily accepted.
