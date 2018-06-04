module.exports = store

function store (state, emitter) {
  state.typing = state.typing ? state.typing : ''
  state.typingOpen = false

  emitter.on('DOMContentLoaded', function () {
    state.hovering = false
    state.tweetHovering = false

    emitter.on('effects:linkHover', function (id) {
      state.hovering = state.hovering ? false : id
      emitter.emit(state.events.RENDER)
    })
    emitter.on('effects:tweetLinkHover', function (id) {
      state.tweetHovering = id
      emitter.emit(state.events.RENDER)
    })
    emitter.on('effects:tweetLinkUnHover', function () {
      state.tweetHovering = false
      emitter.emit(state.events.RENDER)
    })

    // search buttons that turn into inputs
    emitter.on('effects:openSearch', function (id) {
      if (state.typingOpen !== id) {
        state.typing = ''
        state.typingOpen = id
        emitter.emit('render')
      }

      const searchLink = document.querySelector(`#${id}`)
      searchLink.contentEditable = 'true'
      searchLink.innerText = state.typing

      // const range = document.createRange()
      // const sel = window.getSelection()
      // range.selectNodeContents(searchLink)
      // range.collapse(false)
      // sel.removeAllRanges()
      // sel.addRange(range)
      searchLink.focus()
      // range.detach() // optimization
      // console.log('i ran')
    })

    window.addEventListener('scroll', e => {
      const scrollDistance = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop || 0
      const pageHeight = Math.max(document.body.scrollHeight || 0, document.documentElement.scrollHeight || 0, document.body.offsetHeight || 0, document.documentElement.offsetHeight || 0, document.body.clientHeight || 0, document.documentElement.clientHeight || 0)

      const scrollPercentage = scrollDistance / pageHeight

      if (scrollPercentage > 0.77) { // lucky number
        emitter.emit('parser:parseMany')
      }
    })
  })
}
