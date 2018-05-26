var html = require('choo/html')

var TITLE = 'twitterLinks - main'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (state.oauth.user && !state.linksGrabbed) { // TODO: timer
    emit('oauth:getTweets')
  }

  return html`
    <body class="bg-blue">
    <div class="pa2">
        <nav class="flex">
          <h2 class="w-90 dib ph3 lightest-blue">${state.oauth.user ? `Hello, ${state.oauth.user.name}` : 'login!'}</h2>
          <a href="/" class="w-10 link lightest-blue hover-white logout-link center" onclick=${handleClick}>
            ${state.oauth.user ? 'log out of' : 'log in to'} twitter
          </a>
        </nav>
        <section class="ph6 pv2">
          <ul>
          ${state.links.map(link => html`
          <li class="shadow-4 br2 flex ph3 pv1 ma3 bg-near-white">
              <div class="w-75">
                <h1 class="f1 b"><a href="${link.url}">${link.title}</a></h1>
                <h2 class="f3">${link.author ? `${link.author} - ` : ''}${link.source ? link.source : link.domain}</h2>
                <div class="f4 lh-copy gray">
                  <p>${link.description}</p>
                  <h5>${link.duration} minute read</h5>
                  <h5><a href="${link.tweetUrl}">Shared by ${link.sharedBy.name}</a></h5>
                </div>
              </div>
              <div class="w-25">
                ${link.image ? html`<img class="" src="${link.image}"></img>` : ''}
              </div>
          </li>
          `)}
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
    }
  }
}
