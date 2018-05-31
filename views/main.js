const html = require('choo/html')

const TITLE = 'Linkr'

module.exports = view

const Article = require('../components/article')

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (!state.hasOwnProperty('oauth')) {
    state.oauth = {}
  }

  if (!state.oauth.user) {
    // user not logged in, redirect them to landing page
    if (!window) return 'fuck you'
    emit('replaceState', '/login')
  }

  return html`
    <body class="">
    <div class="">
        <nav class="">
          <h2 class="">${state.oauth.user ? `Hello, ${state.oauth.user.name}` : 'Hello'}</h2>
          ${state.oauth.user
    ? html`<a href="/" class="" onclick=${handleClick}> Log out </a> ` : ''}
        </nav>
        <section class="">
            <div class="">
              <h1 class="">Linkr</h1>
              ${state.error ? html`
                 <div class="">
                  <a class="" href="#" onclick=${clearerror}>Can not fetch tweets. ${state.errorDetail && state.errorDetail.length > 0 ? state.errorDetail[0].message : ''}.<br> Click me to try again.</a>
                 </div>
              ` : ''}
            </div>

          <ul class="pa0 ma0">
          ${state.tweets.map(tweet => {
    const article = new Article(tweet)

    article.render()
  })}
          </ul>

        </section>
        </div>
    </body>
  `

  function handleClick () {
    if (!state.oauth.user) {
      emit('oauth:requestToken')
    } else {
      emit('oauth:deleteToken')
      emit('replaceState', '/login')
    }
  }
  function clearerror () {
    emit('clearerror')
  }
}
