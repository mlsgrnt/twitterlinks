var html = require('choo/html')

var TITLE = 'loading...'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)
  if (typeof window === 'undefined') return '<body></body>'

  state.oauth.verifier = state.query.oauth_verifier
  emit('oauth:verifyToken', state.query.oauth_token)

  return html`
    <body class="bg-near-white lh-copy">
      <main class="flex blue f1 pa3 cf center">
      ${state.error ? html`
        <div>
          Bad news! There's been an error! ${state.error}<br>
          <a href="/" class="blue hover-navy b link underline">Couldn't hurt to try again...</a>
        </div>
      ` : ''}
      </main>
    </body>
  `
}
