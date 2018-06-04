module.exports = store

function store (state, emitter) {
  state.links = []
  state.error = false

  state.oauth = state.oauth ? state.oauth : {}
  state.tweetsGrabbed = state.tweetsGrabbed ? state.tweetsGrabbed : false

  emitter.on('oauth:requestToken', () => {
    if (!state.oauth) {
      state.oauth = {}
    }
    fetch('https://smooth-octagon.glitch.me/?type=oauth_request')
      .then((res) => {
        res.json()
          .then((json) => {
            state.oauth = json.data
            emitter.emit(state.events.RENDER)// render triggers the localstorage write
            setTimeout(() => {
              window.location.replace(`https://api.twitter.com/oauth/authenticate?oauth_token=${state.oauth.oAuthToken}`)
            }, 5)
          })
      })
  })
  emitter.on('oauth:verifyToken', (token) => {
    const verified = token === state.oauth.oAuthToken
    if (verified) emitter.emit('oauth:accessToken')
    else {
      state.error = 'Twitter login failed!'
      emitter.emit(state.events.RENDER)
    }
  })
  emitter.on('oauth:accessToken', () => {
    fetch('https://smooth-octagon.glitch.me/?type=auth_token', {
      method: 'POST',
      body: JSON.stringify({
        token: state.oauth.oAuthToken,
        tokenSecret: state.oauth.oAuthTokenSecret,
        verifier: state.oauth.verifier
      })
    })
      .then((response) => {
        response.json()
          .then((json) => {
            // destructuring preferred
            state.oauth.accessToken = json.data.oAuthAccessToken
            state.oauth.accessTokenSecret = json.data.oAuthAccessTokenSecret
            state.oauth.user = json.data.user
            emitter.emit('pushState', '/')
          })
      })
  })
  emitter.on('oauth:logOut', () => {
    state.links = []
    state.tweetsGrabbed = false
    state.oauth = {}
    state.error = false

    // emitter.emit(state.events.RENDER)
    emitter.emit(state.events.PUSHSTATE, '/login')
  })

  emitter.on('clearerror', () => {
    state.error = false
    emitter.emit(state.events.RENDER)
  })
}
