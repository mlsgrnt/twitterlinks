var html = require('choo/html')

var TITLE = 'Linkr'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (typeof window === 'undefined') return '<body></body>'
  if (!state.oauth.user) return html`<body><script>window.location='/login'</script></body>`

  if (!state.error) {
    if (state.links.length === 0 && !state.currentlyGrabbing) {
      if (state.viewing === 'tl') {
        if ((Date.now() - state.tweetsGrabbed > 900000)) { // 15 minutes
          emit('tweets:getTimeline')
        }
      }
      if (!state.tweets) {
        if (state.viewing === 'user') {
          emit('tweets:getUser', state.viewingUser)
        }
        if (state.viewing === 'search') {
          emit('tweets:getSearch', state.searchTerm)
        }
      }
    }
    if (state.tweets.length > 0 && state.links.length === 0 && !state.currentlyGrabbing) {
      emit('parser:parseMany')
    }
  }

  return html`
    <body class="">
    <div class="">
        <nav class="flex-ns flex-wrap-ns justify-around items-center ph1 ph4-ns mt2 mt0-ns">
          <div class="flex-1 w6-ns normal cursor-normal mt2">
            <h2 class="dib pa0 ma0 " ><a class="link  ${state.viewing !== 'tl' ? 'blue' : 'dark-blue'}" href="/" onclick=${viewMyself}>Timeline</a></h2>
            <div class="flex ${state.viewingUser ? 'dark-blue' : 'blue'} bold f3 items-center justify-center">
            <span>${state.typingId === 'User' || state.viewingUser ? '@' : ''}</span><input
            class="dib pa0  ma0 bold ${state.viewingUser ? 'dark-blue' : 'blue'} search"
            type="text"
            autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            href="/"
            onkeypress=${handleKeypress}
            onfocus=${handleFocus}
            placeholder="User"
            id="User"
            value=${state.viewingUser ? state.viewingUser : state.typingId === 'User' ? state.typing : ''}
            /></div>
            <input
            type="text"
            autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            class="dib pa0 bold f3 ma0 ${state.searchTerm ? 'dark-blue' : 'blue'} search"
            href="/"
            onkeypress=${handleKeypress}
            onfocus=${handleFocus}
            placeholder="Search"
            id="Search"
            value=${state.searchTerm ? state.searchTerm : state.typingId === 'Search' ? state.typing : ''}
            />
          </div>
          <h1 class="flex-1 w5-ns ma0 pa0 center tc f1 blue db-ns dn cursor-normal">Linkr</h1>
          <a href="/" class="flex-1 b w5-ns tr f3 link red hover-light-red fr fn-ns" onclick=${handleClick}>Log out</a>
        </nav>
        <section class="">
          ${state.error ? html`
                 <div class="pa5 f1-ns f3">
                  <a class="red link b" href="/" onclick=${clearerror}>Oh dear there's been a problem: ${state.error}<br>Click to try again.</a>
                 </div>
         `
    : ''}

          ${state.links.length === 0 ? html`
              <div class="pa5 f1-ns f3 loading">Searching for links...</div>`
    : ''}

          <ul class="pa0 ma0">
          ${state.links.map(link => html`
          <li 
class="article pa5-ns pa2 pv3 mv1 flex flex-row-reverse items-start justify-between" 
style="${link.image ? `background: rgba(${state.hovering === link.url ? '29,161,242' : '0,0,0'},${state.hovering === link.url ? '1' : '0.45'}) url(${link.image}) right center / cover no-repeat fixed;`
    : 'background: #1DA1F2'
}">
              <div 
              class="near-black helvetica measure-narrow lh-copy f3 dn db-ns pa4 tweetBody cursor-normal br1"
              style="transform:translateX(${state.tweetHovering === link.url ? '0);opacity:1' : '0);opacity:0'}"
              >
              <h4 class="f4 pa0 ma0 mb2">Original Tweet</h4>
              ${link.tweetBody}
              </div>
              <div class="flex flex-column items-start justify-between h-100 mw7-ns w-100">
                <div class="measure-wide w-100">
                  <h1 class="lh-solid measure b pt0 mt0 pb0 mb1"><a
                    class="link white"
                    href="${link.url}"
                    onmouseleave=${() => { mouseover(link.url) }}
                    onmouseover=${() => { mouseover(link.url) }}
                  >${link.title}</a></h1>
                  <h2 
                  class="normal light-gray pt0 mt0 ${state.hovering === link.url ? 'o-50' : ''}">
                  ${link.author ? `${link.author} | ` : ''}${link.source ? link.source : link.domain}
                  </h2>
                  <div class="measure-narrow normal lh-copy light-gray f4 ${state.hovering === link.url ? 'o-50' : ''}">
                    <p>${link.description}</p>
                  </div>
                </div>
                <div class="tr tl-ns flex items-start justify-between w-100 ${state.hovering === link.url ? 'o-50' : ''}">
                    <iframe width="60" height="63" id="pocket-button" frameborder="0" allowtransparency="true" scrolling="NO" src="https://widgets.getpocket.com/v1/button?align=center&count=vertical&label=pocket&url=${encodeURIComponent(link.url)}&src=example.com"></iframe>
                    <div class="tr lh-copy light-gray f4">
                      <h5 class="pb0 mb0 normal">${link.duration} minute read</h5>
                      <h5 class="pt0 mt0 normal"><a 
onmouseleave=${() => { tweetmouseleave() }} 
onmouseover=${() => { tweetmouseover(link.url) }} 
class="link light-gray hover-light-blue" 
href="${link.tweetUrl}
">Tweeted by ${link.sharedBy.name}</a></h5>
                    </div>
                </div>
              </div>
          </li>
          `
  )}
          </ul>

        </section>
        </div>
    </body>
  `
  // log out button
  function handleClick () {
    emit('oauth:logOut')
  }

  // timeline and user buttons
  function viewMyself () {
    if (state.viewing !== 'tl') emit('tweets:getTimeline')
  }
  function handleFocus (e) {
    if (state.typingId !== e.target.id) {
      state.typingId = e.target.id
      state.typing = ''
      emit(state.events.RENDER)
    }
  }
  function handleKeypress (e) {
    state.typingId = e.target.id

    if (e.keyCode === 13) {
      e.preventDefault()
      state.typingUser = false

      let text = e.target.value
      emit(`tweets:get${state.typingId}`, text)
    } else {
      state.typing += e.key
    }
  }

  // other links
  function mouseover (id) {
    emit('effects:linkHover', id)
  }
  function tweetmouseover (id) {
    state.tweetHoverTimeout = setTimeout(() => { emit('effects:tweetLinkHover', id) }, 500)
  }
  function tweetmouseleave () {
    clearTimeout(state.tweetHoverTimeout)
    emit('effects:tweetLinkUnHover')
  }
  function clearerror () {
    emit('clearerror')
  }
}
