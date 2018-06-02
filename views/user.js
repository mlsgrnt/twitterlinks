var html = require('choo/html')

module.exports = view

function view (state, emit) {
  if (typeof window === 'undefined') return '<body></body>'
  if (!state.oauth.user) return html`<body><script>window.location='/login'</script></body>`

  // run gettweets but for a specific user
  emit('oauth:getUser', state.params.user)

  return html`
    <body class="bg-near-white">
    </body>
  `
}
