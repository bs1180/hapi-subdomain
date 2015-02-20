# Hapi-subdomain

This is a simple plugin for using subdomains with Hapi.js, as is typical in multi-tenant applications. For example, if you give each user their own profile page at username.example.com, this plugin can invisibly redirect those urls to example.com/users/username, making configuring your routes much easier.

Once the plugin is installed, it gets added to your:

'''
server.register([{
  register: require('hapi-subdomain'),
  options: {
    exclude: ['www', 'api', 'mail'],
    destination: '/tenant'
  }
  }], function(err) {
    if (err) console.log(err)
    });
'''

<pre>exclude</pre> is an array of subdomains to ignore.
<pre>destination</pre> is the path to prepend the subdomain to.

Only the first subdomain is detected by the regex, and any route with no subdomain (http://example.com) is ignored.


Feedback and pull requests happily accepted.
