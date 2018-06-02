module.exports = store

function store (state, emitter) {
  emitter.on('DOMContentLoaded', function () {
    state.hovering = false

    emitter.on('effects:linkHover', function (id) {
      state.hovering = state.hovering ? false : id
      emitter.emit(state.events.RENDER)
    })
  })
}
