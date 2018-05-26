module.exports = store

function store (state, emitter) {
  emitter.on('DOMContentLoaded', function () {
    emitter.on('parser:parse', function (passed) {
      const url = passed.url
      fetch(`https://article-parser.now.sh/${url}`)
        .then(res => {
          res.json()
            .then(json => {
              json.sharedBy = passed.sharedBy
              json.tweetUrl = passed.tweetUrl
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
  })
}
