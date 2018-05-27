module.exports = store

function store (state, emitter) {
  state.cardsLoaded = 0
  state.debounceTimeout

  emitter.on('parser:findLinks', () => {
    if (state.hasOwnProperty('tweets')) {
      state.tweets.forEach(tweet => {
        const urls = tweet.entities.urls
        if (urls.length > 0) {
          emitter.emit('parser:parse', {
            sharedBy: tweet.user,
            tweetUrl: `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
            url: urls[0].expanded_url
          })
        }
      })
      state.linksGrabbed = Date.now()
    }
  })
  emitter.on('parser:parse', function (passed) {
    const url = passed.url
    fetch(`https://article-parser.now.sh/${url}`)
      .then(res => {
        res.json()
          .then(json => {
            json.sharedBy = passed.sharedBy
            json.tweetUrl = passed.tweetUrl
            json.duration = Math.ceil(json.duration / 60)
            state.links.push(json)
            emitter.emit('parser:debounceRender')
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  })
  emitter.on('parser:debounceRender', () => {
    if (state.cardsLoaded !== false) state.cardsLoaded++
    if (state.cardsLoaded > 3) {
      state.cardsLoaded = false
      emitter.emit(state.events.RENDER) // show something to teh user as the rest load in
    }
    clearTimeout(state.debounceTimeout)
    state.debounceTimeout = setTimeout(() => { emitter.emit(state.events.RENDER); emitter.emit('pocket:loadButtons') }, 1500)
  })
}
