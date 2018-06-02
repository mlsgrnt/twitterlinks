var html = require('choo/html')

module.exports = view

function view (state, emit) {
  if (typeof window === 'undefined') return '<body></body>'
  if (!state.oauth.user) return html`<body><script>window.location='/login'</script></body>`

  // clear out tweets
  state.links = []
  state.tweets = []
  // run gettweets but for a specific user
  emit('oauth:getUser', state.params.user)
  // set user to state so it can be displayed
  state.viewingUser = state.params.user

  return html`
    <body class="bg-near-white">
    </body>
  `
}
