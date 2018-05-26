var html = require('choo/html')

var TITLE = 'twitterLinks - main'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (state.oauth.user && !state.linksGrabbed) { // TODO: timer
    emit('oauth:getTweets')
  }

  return html`
    <body class="code lh-copy">
      <main class="pa3 cf center">
        <section class="fl mw6 w-50-m w-third-l pa3">
          <h2>${state.oauth.user ? `Hello, ${state.oauth.user.name}` : 'login!'}</h2>

          <ul>
          ${state.links.map(link => html`
          <li>
            <div>
              ${link.image ? html`<img src="${link.image}" style="float:right"></img>` : ''}
              <h1><a href="${link.url}">${link.title}</a></h1>
              <h2>${link.author} - ${link.source ? link.source : link.domain}</h2>
              <p>${link.description}</p>
              <h5>${link.duration} minute read</h5>
              <h5>Shared by ${link.sharedBy.name}</h5>

            </div>
          </li>
          `)}
          </ul>

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
