const urlMetadata = require('url-metadata')

module.exports = store

function store (state, emitter) {
  state.parsedLinks = []

  emitter.on('DOMContentLoaded', function () {
    emitter.on('parser:parse', function (url) {
      console.log(url)
      urlMetadata(url).then((article) => {
        console.log(article)
        state.parsedLinks.push(article)
      }).catch((err) => {
        console.log(err)
      })
    })
  })
}
