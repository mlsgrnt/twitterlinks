module.exports = store

const fetch = window.fetch ? window.fetch : console.log // bad hack, but hey

function store (state, emitter) {
  state.linksGrabbed = false
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
    state.links = []
    state.linksGrabbed = false
    state.oauth = {}

    emitter.emit('render')
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
            if (json.errors) {
              console.warn('oh no twitter had an error. maybe display a message?')
              return
            }
            state.tweets = json
            emitter.emit(state.events.RENDER)
          })
          .catch(err => {
            console.warn(err)
          })
      })
  })
}
