var html = require('choo/html')

var TITLE = 'twitterLinks - main'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (!!state.oauth && state.oauth.user && !state.linksGrabbed) { // TODO: timer
    emit('oauth:getTweets')
  }

  return html`
    <body class="bg-blue">
    <div class="pa2">
        <nav class="flex">
          <h2 class="f3 w-90 dib ph3 lightest-blue">${state.oauth.user ? `Hello, ${state.oauth.user.name}` : 'login!'}</h2>
          <a href="/" class="f4 w-10 link washed-red hover-light-pink logout-link center" onclick=${handleClick}>
            ${state.oauth.user ? 'log out of' : 'log in to'} twitter
          </a>
        </nav>
        <section class="ph6 pv2">
          <ul>
          ${state.links.map(link => html`
          <li class="card shadow-4 br2 flex ph4 pv1 ma3 bg-near-white">
              <div class="flex-two-thirds flex flex-column space-around">
                <div>
                  <h1 class="lh-solid measure f1 b pb0 mb0"><a class="link hover-blue navy" href="${link.url}">${link.title}</a></h1>
                  <h2 class="f3 pt1 mt0">${link.author ? `${link.author} • ` : ''}${link.source ? link.source : link.domain}</h2>
                  <div class="measure-narrow f4 lh-copy gray ">
                    <p>${link.description}</p>
                  </div>
                </div>
                <div class="pb4">
                    <a data-pocket-label="pocket" data-save-url="${link.url}" data-pocket-count="horizontal" class="pocket-btn" data-lang="en"></a>
<script type="text/javascript">!function(d,i){if(!d.getElementById(i)){var j=d.createElement("script");j.id=i;j.src="https://widgets.getpocket.com/v1/j/btn.js?v=1";var w=d.getElementById(i);d.body.appendChild(j);}}(document,"pocket-btn-js");</script>
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
}
