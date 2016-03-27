'use strict';

var config = require("./config.json");
require("streamline").register(config.streamline);

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var app = module.exports = loopback();
var env = process.env.NODE_ENV;
var customRegistry = require('./registry');



// Set up the /favicon.ico
app.use(loopback.favicon());

// request pre-processing middleware
app.use(loopback.compress());

// -- Add your pre-processing middleware here --


// spirit custom registry
customRegistry(app);

// boot scripts mount components like REST API
boot(app, __dirname);

// -- Mount static files here--
// All static middleware should be registered at the end, as all requests
// passing the static middleware are hitting the file system
// Example:

var staticPath = null;

if (env !== 'prod') {
  staticPath = path.resolve(__dirname, '..', 'spirit-ng2/dist');
  console.log("Running app in development mode");
  app.use('/app', loopback.static(path.resolve(staticPath, 'app')));
} else {
  staticPath = path.resolve(__dirname, '..', 'dist');
  console.log("Running app in production mode");
  app.use('/app', loopback.static(path.resolve(staticPath, 'dist')));
}


//
app.use(loopback.static(staticPath));
/*app.use('/dist', loopback.static(path.resolve(staticPath, 'dist')));
app.use('/css', loopback.static(path.resolve(staticPath, 'css')));
app.use('/images', loopback.static(path.resolve(staticPath, 'images')));
app.use('/node_modules', loopback.static(path.resolve(staticPath, 'node_modules')));



//https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode
app.all('/*', function(req, res, next) {
	console.log("req.url: "+req.url);
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile('index.html', { root: staticPath });
});
*/

// Requests that get this far won't be handled
// by any middleware. Convert them into a 404 error
// that will be handled later down the chain.
app.use(loopback.urlNotFound());

// The ultimate error handler.
app.use(loopback.errorHandler());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
