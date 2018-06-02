/* eslint-env browser */
module.exports = store

function store (state, emitter) {
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

            // filter out some lousy results
            if (!json.description) return
            if (state.links.some(link => link.url === json.url)) return

            state.links.push(json)

            // rendering too often crashes choo so we have to be smart about it:
            if (state.links.length === state.tweets.length || state.links.length % 20 === 0) {
              emitter.emit(state.events.RENDER)
            }
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
