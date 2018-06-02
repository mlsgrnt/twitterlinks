module.exports = store

const fetch = require('node-fetch') // oh man this is so so so bad i'mso sorry but it's the only way to get the build to work

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
      state.error = 'oauthVerificationError'
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
  emitter.on('oauth:deleteToken', () => {
    state.links = []
    state.tweetsGrabbed = false
    state.oauth = {}
    state.error = false
    state.errorDetail = null

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
            if (Object.keys(json.errors).length > 0) {
              console.warn(json.errors)
              state.error = 'feedLoadingError'
              state.errorDetail = JSON.parse(json.errors.data).errors
              emitter.emit(state.events.RENDER)
              return
            }
            state.tweets = json.data
            state.tweetsGrabbed = Date.now()
            json.data.forEach(tweet => {
              emitter.emit('parser:parse', tweet)
            })
          })
          .catch(err => {
            console.warn(err)
          })
      })
  })

  emitter.on('clearerror', () => {
    state.error = false
    emitter.emit(state.events.RENDER)
  })
}
