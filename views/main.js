var html = require('choo/html')

var TITLE = 'twitterLinks - main'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (state.oauth.user && state.links.length === 0) {
    emit('oauth:getTweets')
  }

  return html`
    <body class="code lh-copy">
      <main class="pa3 cf center">
        <section class="fl mw6 w-50-m w-third-l pa3">
          <h2>${state.oauth.user ? `Hello, ${state.oauth.user.name}` : 'login!'}</h2>

          <p>
          ${state.links.map(link => link)}
          </p>

          <button class="dim ph3 ba bw1 pv2 b--black pointer bg-white"
            onclick=${handleClick}>
            ${state.oauth.user ? 'log out of' : 'log in to'} twitter
          </button>

          <br><br>
        </section>
      </main>
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
