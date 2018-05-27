var html = require('choo/html')

var TITLE = 'loading...'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  state.oauth.verifier = state.query.oauth_verifier
  emit('oauth:verifyToken', state.query.oauth_token)

  return html`
    <body class="bg-dark-blue lh-copy">
      <main class="lightest-blue f-headline pa3 cf center">
     ${state.error ? html`
     <div>
     <a href="/" class="white b link">Try again...</a>
      ${state.error}
    </div>
     ` : ''}
      </main>
    </body>
  `
}
