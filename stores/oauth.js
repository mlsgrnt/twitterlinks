module.exports = store

const fetch = window.fetch ? window.fetch : console.log // bad hack, but hey

function store (state, emitter) {
  state.links = []

  emitter.on('oauth:requestToken', () => {
    if (!state.oauth) {
      state.oauth = {}
    }
    fetch('https://smooth-octagon.glitch.me/?type=oauth_request')
      .then((res) => {
        res.json()
          .then((json) => {
            state.oauth = json.data
            emitter.emit('oauth:redirectUser', state.oauth.oAuthToken)
          })
      })
  })
  emitter.on('oauth:redirectUser', (token) => {
    window.location = `https://api.twitter.com/oauth/authenticate?oauth_token=${token}`
  })
  emitter.on('oauth:verifyToken', (token) => {
    const verified = token === state.oauth.oAuthToken
    if (verified) emitter.emit('oauth:accessToken')
    else console.error('oh no')
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
  emitter.on('oauth:deleteToken', () => {
    state.oauth = {}
    state.links = []
    emitter.emit(state.events.RENDER)
  })
  emitter.on('oauth:getTweets', () => {
    fetch('https://smooth-octagon.glitch.me/?type=tweets', {
      method: 'POST',
      body: JSON.stringify({
        accessToken: state.oauth.accessToken,
        accessTokenSecret: state.oauth.accessTokenSecret,
        userId: state.oauth.user.id
      })
    })
      .then((response) => {
        response.json()
          .then((json) => {
            const links = json.data.map(tweet => {
              const urls = tweet.entities.urls
              if (urls.length > 0) {
                return urls[0].expanded_url
              }
            })
            state.links = links
            emitter.emit(state.events.RENDER)
          })
      })
  })
}
