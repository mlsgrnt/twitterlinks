module.exports = store

const fetch = require('node-fetch') // oh man this is so so so bad i'mso sorry but it's the only way to get the build to work

function store (state, emitter) {
  state.viewing = state.viewing ? state.viewing : 'tl'

  emitter.on('tweets:reset', () => {
    state.error = false
    state.typing = false
    state.typingOpen = false
    state.viewingUser = false
    state.searchTerm = false
    state.tweetsGrabbed = false
    state.tweets = []
    state.links = []
    state.loadedIndex = 0
    state.currentlyGrabbing = false
  })
  emitter.on('tweets:handleJSON', json => {
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
    emitter.emit(state.events.RENDER)
  })

  emitter.on('tweets:getSearch', (q) => {
    emitter.emit('tweets:reset')
    state.viewing = 'search'
    state.searchTerm = q
    state.currentlyGrabbing = true
    emitter.emit(state.events.RENDER)

    fetch('https://smooth-octagon.glitch.me/?type=search', {
      method: 'POST',
      body: JSON.stringify({
        accessToken: state.oauth.accessToken,
        accessTokenSecret: state.oauth.accessTokenSecret,
        userId: state.oauth.user.id,
        q: q
      })
    })
      .then((response) => {
        response.json()
          .then(json => { emitter.emit('tweets:handleJSON', json) })
          .catch(err => {
            console.warn(err)
          })
      })
  })
  emitter.on('tweets:getUser', (targetUserId) => {
    emitter.emit('tweets:reset')
    state.viewing = 'user'
    state.viewingUser = targetUserId
    state.currentlyGrabbing = true
    emitter.emit(state.events.RENDER)

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
          .then(json => { emitter.emit('tweets:handleJSON', json) })
          .catch(err => {
            console.warn(err)
          })
      })
  })
  emitter.on('tweets:getTimeline', () => {
    emitter.emit('tweets:reset')
    state.viewing = 'tl'
    state.currentlyGrabbing = true
    emitter.emit(state.events.RENDER)

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
          .then(json => { emitter.emit('tweets:handleJSON', json) })
          .catch(err => {
            console.warn(err)
          })
      })
  })
}
