/* eslint-env browser */
module.exports = store

function store (state, emitter) {
  emitter.on('parser:parse', function (tweet) {
    const url = tweet.entities.urls[0].expanded_url // we can do this because the api only returns tweets with urls
    fetch(`https://article-parser.now.sh/${url}`)
      .then(res => {
        res.json()
          .then(json => {
            json.sharedBy = tweet.user
            json.tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`
            json.duration = Math.ceil(json.duration / 60)
            state.links.push(json)

            // rendering too often crashes choo so we have to be smart about it:
            if (state.links.length % 20 === 0) {
              emitter.emit(state.events.RENDER)
            }
            // load pocket buttons if done
            if (state.links.length === state.tweets.length) {
              emitter.emit(state.events.RENDER)
              emitter.emit('pocket:loadButtons')
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
