var html = require('choo/html')

module.exports = view

function view (state, emit) {
  var TITLE = 'Linkr'
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (state.oauth.user) return html`<body><script>window.location='/'</script></body>`

  return html`
    <body>
      <a onclick=${handleClick} class="" href="#">Log in to Twitter</a>
              <h1 class="f-headline  measure-narrow ma0 pa0">Linkr</h1>
              <p style="line-height:0.5" class="f1-ns f2 lh-copy measure  pa0 ma0 mb4 ">
              <span>Twitter; just the links</span>
              </p>
    </body>
  `

  function handleClick () {
    emit('oauth:requestToken')
  }
}
