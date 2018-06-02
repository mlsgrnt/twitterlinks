var html = require('choo/html')

var TITLE = 'Linkr'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (typeof window === 'undefined') return '<body></body>'
  if (!state.oauth.user) return html`<body><script>window.location='/login'</script></body>`

  if (state.links.length === 0) {
    if (!state.tweets) { // || (Date.now() - state.tweetsGrabbed > 900)) {
      emit('oauth:getTweets')
    } else {
      state.tweets.forEach(tweet => emit('parser:parse', tweet))
    }
  }

  return html`
    <body class="">
    <div class="">
        <nav class="flex">
          <h2 class="">${state.oauth.user ? `Hello, ${state.oauth.user.name}` : 'Hello'}</h2>
          <a href="/" class="" onclick=${handleClick}>
          Log out
          </a>
        </nav>
        <section class="">
            <div class="">
              ${state.error ? html`
                 <div class="">
                  <a class="washed-red link b" href="#" onclick=${clearerror}>Can not fetch tweets. ${state.errorDetail && state.errorDetail.length > 0 ? state.errorDetail[0].message : ''}.<br> Click me to try again.</a>
                 </div>
              ` : ''}

            </div>

          <ul class="pa0 ma0">
          ${state.links.map(link => html`
          <li class="flex-ns justify-between">
              <div class="flex-two-thirds flex-ns flex-column space-around">
                <div class="measure-wide">
                  <h1 class="lh-solid measure b"><a class="link" href="${link.url}">${link.title}</a></h1>
                  <h2 class="normal gray">${link.author ? `${link.author} | ` : ''}${link.source ? link.source : link.domain}</h2>
                  <div class="measure-narrow normal lh-copy gray ">
                    <p>${link.description}</p>
                  </div>
                </div>
                <div class="tr tl-ns">
                    <a data-pocket-label="pocket" data-save-url="${link.url}" data-pocket-count="vertical" class="pocket-btn" data-lang="en"></a>
                </div>
              </div>
              <div class="flex-one-third article-image pa0 ma0">
                ${link.image ? html`<img class="ma1" src="${link.image}"></img>` : ''}
                    <div class="tr lh-copy gray">
                      <h5 class="pb0 mb0 normal">${link.duration} minute read</h5>
                      <h5 class="pt0 mt0 normal"><a class="" href="${link.tweetUrl}">Shared by ${link.sharedBy.name}</a></h5>
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
    emit('oauth:deleteToken')
  }
  function clearerror () {
    emit('clearerror')
  }
}
