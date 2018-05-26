var html = require('choo/html')

var TITLE = 'twitterLinks - callback'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  state.oauth.verifier = state.query.oauth_verifier
  emit('oauth:verifyToken', state.query.oauth_token)

  return html`
    <body class="code lh-copy">
      <main class="pa3 cf center">
      loading...
      </main>
    </body>
  `
}
