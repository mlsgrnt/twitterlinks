module.exports = store

function store (state, emitter) {
  state.debounceTimeout = null
  let continuousRender = null

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
      // start render interval, this is cleared when all are loaded
      continuousRender = setInterval(() => {
        emitter.emit(state.events.RENDER)
      }, 1000)
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
    clearTimeout(state.debounceTimeout)
    state.debounceTimeout = setTimeout(() => { clearTimeout(continuousRender); emitter.emit('pocket:loadButtons') }, 1500)
  })
}
