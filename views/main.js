var html = require('choo/html')

var TITLE = 'twitterLinks - main'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (!state.hasOwnProperty('oauth')) {
    state.oauth = {}
  }

  if (state.oauth.user && !state.linksGrabbed && !state.error) {
    if (Date.now() - state.linksGrabbed > 900) {
      emit('oauth:getTweets')
    }
    if (state.tweets) {
      emit('parser:findLinks')
    }
  }

  return html`
    <body class="bg-blue">
    <div class="pa2">
        <nav class="flex">
          <h2 class="f3 w-90 dib ph3 lightest-blue">${state.oauth.user ? `Hello, ${state.oauth.user.name}` : 'Linkr'}</h2>
          <a href="/" class="f4 w-10 link logout-link center ${state.oauth.user ? 'washed-red hover-light-pink' : 'lightest-blue hover-white'}" onclick=${handleClick}>
            ${state.oauth.user ? 'log out of' : 'log in to'} twitter
          </a>
        </nav>
        <section class="ph6 pv2">
            <div class="animate ${state.links.length > 0 ? 'hidden' : ''}">
              <h1 class="f-headline lightest-blue measure-narrow">Twitter; just the links</h1>
              <p class="f1 lh-copy measure near-white ml1">
                ${state.error ? html`
                  <a class="white link b" href="#" onclick=${clearerror}>${state.errorDetail[0].message}. Click me to try again.</a>
                ` : ''}

              </p>
            </div>
          
          <ul>
          ${state.links.map(link => html`
          <li class="card shadow-4 br2 flex ph4 pv1 ma3 bg-near-white">
              <div class="flex-two-thirds flex flex-column space-around">
                <div>
                  <h1 class="lh-solid measure f2 b pb0 mb0"><a class="link hover-blue navy" href="${link.url}">${link.title}</a></h1>
                  <h2 class="f3 pt1 mt0">${link.author ? `${link.author} • ` : ''}${link.source ? link.source : link.domain}</h2>
                  <div class="measure-narrow f4 lh-copy gray ">
                    <p>${link.description}</p>
                  </div>
                </div>
                <div class="pb4">
                    <a data-pocket-label="pocket" data-save-url="${link.url}" data-pocket-count="horizontal" class="pocket-btn" data-lang="en"></a>
                </div>
              </div>
              <div class="flex-one-third article-image pa0 ma0 ph1 pt5">
                ${link.image ? html`<img class="ma1" src="${link.image}"></img>` : ''}
                    <div class="tr f4 lh-copy gray">
                      <h5 class="pb0 mb0">${link.duration} minute read</h5>
                      <h5 class="pt0 mt0"><a class="link navy hover-blue" href="${link.tweetUrl}">Shared by ${link.sharedBy.name}</a></h5>
                    </div>
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
  function clearerror () {
    emit('clearerror')
  }
}
