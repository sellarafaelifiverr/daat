process.chdir(__dirname);

var resolve = require('path').resolve,
    express = require('express'),
    mongoose = require('mongoose'),
    conf = require(resolve('./init/conf')),
    info = require('debug')('app:info'),
    debug = require('debug')('app:debug'),
    routes = require(resolve('./routes'));

var app = express();

mongoose.connect(conf.mongo.url);

// all environments
app.set('port', conf.frontend.port);
app.set('views', resolve('./views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

//serve static content:
var staticPath = resolve(conf.frontend.static);
app.use(conf.frontend.uiEndpoint, express.static(staticPath));

// development only
if ('development' == conf.env) {
    app.use(express.errorHandler());
}

routes.setup(app);

app.listen(conf.frontend.port, function() {
    debug('Configuration is %s', JSON.stringify(conf));
    info('Server is running at port %d', conf.frontend.port);
});

if (conf.neverDie) {
    process.on('uncaughtException', function(err) {
        info('Process is dead. %s', err);
    });
}

process.on('SIGINT', function() {
    info('Shutting down.');
    process.exit();
});