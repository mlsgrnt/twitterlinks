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
    <body class="bg-${state.oauth.user ? 'blue' : 'near-white'}">
    <div class="pa2-ns pa0">
        <nav class="flex">
          <h2 class="f3-ns f4 w-70 dib ph3 lightest-blue">${state.oauth.user ? `Hello, ${state.oauth.user.name}` : ''}</h2>
          ${state.oauth.user
    ? html`<a href="/" class="tr f4-ns f5 w-30 link logout-link center pr1 pr0-ns washed-red hover-light-pink" onclick=${handleClick}> Log out </a> ` : ''}
        </nav>
        <section class="ph6-ns ph0 pv2 ${state.oauth.user ? 'lightest-blue' : 'blue'}">
            <div class="animate ${state.links.length > 0 ? '' : ''} mb5-ns">
              <h1 class="f-headline  measure-narrow ma0 pa0">Linkr</h1>
              <p style="line-height:0.5" class="f1-ns f2 lh-copy measure  pa0 ma0 mb4 ">
              <span>Twitter; just the links</span>
              </p>
              ${state.error ? html`
                 <div class="pt3 lh-solid pv2">
                   <a class="washed-red link b" href="#" onclick=${clearerror}>Can not fetch tweets. ${state.errorDetail[0].message}.<br> Click me to try again.</a>
                 </div>
              ` : ''}

              ${state.oauth.user ? '' : html`
              <div>
                <div class="db pt5 tl f1-ns f2 center ">
                  <a href="/" class="fr normal f-subheadline-ns f1 pa4-ns pa3 link dark-blue hover-white fade hover-bg-blue ba" onclick=${handleClick}>Log in to begin </a>
                </div>
              </div>
              `}
            </div>



          <ul class="pa0 ma0">
          ${state.links.map(link => html`
          <li class="list pl0 card shadow-4 br2 flex-ns ph4-ns ph4 pv1 ma0 mv3 ma3-ns bg-near-white">
              <div class="flex-two-thirds flex-ns flex-column space-around">
                <div class="measure-wide">
                  <h1 class="lh-solid  measure f2-ns f3 b pb0 mb0"><a class="link hover-blue dark-gray" href="${link.url}">${link.title}</a></h1>
                  <h2 class="f3-ns f5 pt1 mt0 normal gray">${link.author ? `${link.author} • ` : ''}${link.source ? link.source : link.domain}</h2>
                  <div class="measure-narrow normal f4 lh-copy gray ">
                    <p>${link.description}</p>
                  </div>
                </div>
                <div class="pb4-ns tr tl-ns">
                    <a data-pocket-label="pocket" data-save-url="${link.url}" data-pocket-count="vertical" class="pocket-btn" data-lang="en"></a>
                </div>
              </div>
              <div class="flex-one-third article-image pa0 ma0 ph1 pt5-ns">
                ${link.image ? html`<img class="ma1" src="${link.image}"></img>` : ''}
                    <div class="tr f4 lh-copy gray">
                      <h5 class="pb0 mb0 normal">${link.duration} minute read</h5>
                      <h5 class="pt0 mt0 normal">Shared by <a class="link navy hover-blue" href="${link.tweetUrl}">${link.sharedBy.name}</a></h5>
                    </div>
              </div>
          </li>
          `)}
          </ul>
            ${state.links.length > 0 && false /* temp disabled TODO:... */ ? html`<a class="pl6 center link white hover-lightest-blue f-subheadline" href="#">More is on the way...</a>` : ''}

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
