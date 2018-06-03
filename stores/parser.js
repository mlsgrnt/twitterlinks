/* eslint-env browser */
module.exports = store

function store (state, emitter) {
  state.loadedIndex = 0

  emitter.on('parser:parseMany', function (count) {
    if (!count) count = 10
    if (count + state.loadedIndex > state.tweets.length) {
      count = state.tweets.length - state.loadedIndex
    }

    for (let i = 0; i < count; i++) {
      emitter.emit('parser:parse', state.tweets[i + state.loadedIndex])
    }

    state.loadedIndex += count
  })
  emitter.on('parser:parse', function (tweet) {
    if (tweet.entities.urls.length === 0) return

    const url = tweet.entities.urls[0].expanded_url
    fetch(`https://article-parser.now.sh/${url}`)
      .then(res => {
        res.json()
          .then(json => {
            json.sharedBy = tweet.user
            json.tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
            json.duration = Math.ceil(json.duration / 60)

            json.tweetBody = tweet.text
            // strip urls from tweet body
            tweet.entities.urls.forEach(function (url) {
              json.tweetBody = json.tweetBody.replace(url.url, '')
            })
            if (tweet.entities.media) {
              tweet.entities.media.forEach(function (url) {
                json.tweetBody = json.tweetBody.replace(url.url, '')
              })
            }

            // filter out some lousy results
            if (!json.description) return
            if (state.links.some(link => link.url === json.url)) return

            state.links.push(json)

            emitter.emit(state.events.RENDER)
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
