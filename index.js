var css = require('sheetify')
var choo = require('choo')
var persist = require('choo-persist')

css('tachyons')
css('./custom.css')

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
} else {
  app.use(require('choo-service-worker')())
}

app.use(persist())
app.use(require('./stores/parser'))
app.use(require('./stores/oauth'))
app.use(require('./stores/pocket'))

app.route('/', require('./views/main'))
app.route('/callback', require('./views/callback'))
app.route('/login', require('./views/login'))
app.route('/*', require('./views/404'))

module.exports = app.mount('body')
