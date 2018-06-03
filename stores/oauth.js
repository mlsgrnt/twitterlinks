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

  emitter.on('oauth:getUser', (targetUserId) => {
    state.viewingUser = targetUserId

    state.error = false
    state.links = []
    state.tweets = []
    state.loadedIndex = 0
    emitter.emit(state.events.RENDER)

    state.currentlyGrabbing = true

    fetch('https://smooth-octagon.glitch.me/?type=user', {
      method: 'POST',
      body: JSON.stringify({
        accessToken: state.oauth.accessToken,
        accessTokenSecret: state.oauth.accessTokenSecret,
        userId: state.oauth.user.id,
        targetUserId: targetUserId
      })
    })
      .then((response) => {
        response.json()
          .then((json) => {
            if (Object.keys(json.errors).length > 0) {
              console.warn(json.errors)
              console.log(JSON.parse(json.errors.data))
              state.error = JSON.parse(json.errors.data).error || JSON.parse(json.errors.data).errors[0].message || 'Feed loading error!'
              emitter.emit(state.events.RENDER)
              return
            }
            state.tweets = json.data
            state.tweetsGrabbed = Date.now()
            state.currentlyGrabbing = false

            emitter.emit('parser:parseMany')
          })
          .catch(err => {
            console.warn(err)
          })
      })
  })

  emitter.on('oauth:viewMyself', () => {
    state.error = false
    state.viewingUser = false
    state.tweetsGrabbed = false
    state.tweets = []
    state.links = []
    state.loadedIndex = 0
    emitter.emit(state.events.RENDER)
  })
  emitter.on('oauth:getTimeline', () => {
    state.currentlyGrabbing = true

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
              state.error = JSON.parse(json.errors.data).error || JSON.parse(json.errors.data).errors[0].message || 'Feed loading error!'
              emitter.emit(state.events.RENDER)
              return
            }
            state.tweets = json.data
            state.tweetsGrabbed = Date.now()
            state.currentlyGrabbing = false
            emitter.emit('parser:parseMany')
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
