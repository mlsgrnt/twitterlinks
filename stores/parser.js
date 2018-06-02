/* eslint-env browser */
module.exports = store

function store (state, emitter) {
  state.renderedCount = 0
  state.renderLimit = 20

  emitter.on('parser:parse', function (tweet) {
    if (tweet.entities.urls.length === 0) return

    const url = tweet.entities.urls[0].expanded_url
    fetch(`https://article-parser.now.sh/${url}`, {signal: fetchAbortSignal})
      .then(res => {
        res.json()
          .then(json => {
            json.sharedBy = tweet.user
            json.tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
            json.duration = Math.ceil(json.duration / 60)

            // filter out some lousy results
            if (!json.description) return
            if (state.links.some(link => link.url === json.url)) return

            state.links.push(json)

            if (state.renderedCount < state.renderLimit) emitter.emit(state.events.RENDER)

            state.renderedCount++
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(err => {
        console.log(err)
      })
  })
}
