var html = require('choo/html')

module.exports = view

function view (state, emit) {
  var TITLE = 'Linkr'
  if (state.title !== TITLE) emit(state.events.DOMTITLECHANGE, TITLE)

  if (state.oauth.user) return html`<body><script>window.location='/'</script></body>`

  return html`
    <body class="bg-blue white vh-100 dt w-100">
            <div class="pa5-ns pa2">
              <h1 class="f-headline  measure-narrow ma0 pa0">Linkr</h1>
              <p style="line-height:0.5" class="f1-ns f4 lh-copy measure  pa0 ma0 mb4 ">
                <span>Twitter; just the links</span>
              </p>
              <p class="f2-ns f3 lh-copy pv5-ns pv2 measure-narrow">
                Your Twitter timeline is filled with vile hate, racism, and inscrutible irony.
                <div class="bt o-30 w5"></div>
                Filter it down to the essentials.
                <div class="bt o-30 w5"></div>
                Filter out everything except the links.
              </p>
            </div>
            <div class="fr mh3 ma1 f1-ns f3 ">
              <a onclick=${handleClick} class="link b blue bg-white hover-bg-washed-blue bg-animate pa3 br3" href="">Log in with Twitter</a>
            </div>
   </body>
  `

  function handleClick () {
    emit('oauth:requestToken')
  }
}
