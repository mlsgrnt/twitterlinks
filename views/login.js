var html = require('choo/html')

var TITLE = 'Linkr Login'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)
  return html`
  <body>
    <a href="/" class="f1 link" onclick=${handleClick}> Sign in </a>
    <p class="f1-ns f2 lh-copy measure  pa0 ma0 mb4 ">
      <span>Twitter; just the links</span>
    </p>
  </body>
  `

  function handleClick () {
    if (!state.oauth.user) {
      emit('oauth:requestToken')
    } else {
      emit('oauth:deleteToken')
    }
  }
}
