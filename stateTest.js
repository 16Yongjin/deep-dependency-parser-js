const TransitionState  = require('./transitionState')
const pos = require('./posTagger')
const getFeature = require('./getFeature')
const getIndeces = require('./indeces')
const test = async () => {
  const { word2index, tag2index, action2index } = await getIndeces()
  const state = new TransitionState(pos.tag("He has good control .".split(' ')))
  console.log(
    getFeature(state, word2index, tag2index)
  )
}
try {
  test()
} catch (e) {
  console.log(e)
}
// state.print()
// state.shift()
// state.print()
// state.shift()
// state.print()

// state.rightArc()
// state.print()
// console.log(state.arcs)
// console.log(
//   state.getLeftMost(0)
// )
