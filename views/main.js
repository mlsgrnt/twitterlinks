var html = require('choo/html')

var TITLE = 'Linkr'

module.exports = view

function view (state, emit) {
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (typeof window === 'undefined') return '<body></body>'
  if (!state.oauth.user) return html`<body><script>window.location='/login'</script></body>`

  if (state.links.length === 0 && !state.error && !state.currentlyGrabbing) {
    if (!state.viewingUser && (!state.tweets || (Date.now() - state.tweetsGrabbed > 900000))) { // 15 minutes
      emit('oauth:getTimeline')
    } else {
      if (state.viewingUser) {
        emit('oauth:getUser', state.viewingUser)
      } else {
        emit('parser:parseMany')
      }
    }
  }

  return html`
    <body class="">
    <div class="">
        <nav class="flex-ns flex-wrap-ns justify-between items-center ph1 ph4-ns mt2 mt0-ns">
          <span class="flex-1 w6-ns normal cursor-normal">
            <h2 class="dib pa0 ma0 " ><a class="link  ${state.viewingUser ? 'blue' : 'dark-blue'}" href="/" onclick=${viewMyself}>Timeline</a></h2>
            <h2 class="dib pa0 pl2 ma0 "><a 
            class="link  ${state.viewingUser ? 'dark-blue' : 'blue'} searchLink" 
            href="/" 
            onkeypress=${handleKeypress}
            onclick=${openSearch}
            >${state.typingUser || state.viewingUser ? `@${state.typingUser || state.viewingUser}` : 'User'}</a></h2>
          </span>
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
              <div class="pa5 f1-ns f3">Cute loading message and spinner go here</div>`
    : ''}

          <ul class="pa0 ma0">
          ${state.links.map(link => html`
          <li 
class="article pa5-ns pa2 pv3 mv5-ns mv4 flex flex-row-reverse items-start justify-between" 
style="${link.image ? `background: rgba(${state.hovering === link.url ? '29,161,242' : '0,0,0'},${state.hovering === link.url ? '1' : '0.45'}) url(${link.image}) right center / cover no-repeat fixed;`
    : 'background: #1DA1F2'
}">
              <div 
              class="near-black helvetica measure-narrow lh-copy f3 dn db-ns pa4 tweetBody cursor-normal br1"
              style="transform:translateX(${state.tweetHovering === link.url ? '0);opacity:1' : '0);opacity:0'}"
              >
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
    if (state.viewingUser) emit('oauth:viewMyself')
  }
  function openSearch () {
    state.typingUser = state.typingUser ? state.typingUser : ''

    const searchLink = document.querySelector('.searchLink')
    searchLink.contentEditable = 'true'
    searchLink.innerText = `@${state.typingUser}`

    const range = document.createRange()
    const sel = window.getSelection()
    range.selectNodeContents(searchLink)
    range.collapse(false)
    sel.removeAllRanges()
    sel.addRange(range)
    searchLink.focus()
    range.detach() // optimization
  }
  function handleKeypress (e) {
    if (e.keyCode === 13) {
      e.preventDefault()
      state.typingUser = false

      let username = e.target.innerText.split('@')
      username = username.length > 1 ? username[1] : username[0]

      emit('oauth:getUser', username)
    } else {
      state.typingUser += e.key
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
