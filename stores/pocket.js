module.exports = store

function store (state, emitter) {
  emitter.on('pocket:loadButtons', function () {
    !(function (d, i) { if (!d.getElementById(i)) { var j = d.createElement('script'); j.id = i; j.src = 'https://widgets.getpocket.com/v1/j/btn.js?v=1'; var w = d.getElementById(i); d.body.appendChild(j) } }(document, 'pocket-btn-js'))
  })
  emitter.on('DOMContentLoaded', () => {
  })
}
