const preprocess = require('./preprocess')
const TransitionState = require('./transitionState')
const getFeature = require('./getFeature')
const getIndeces = require('./indeces')

const trainSet = async () => {
  const splitedData = await preprocess()
  const { word2index, tag2index, action2index } = await getIndeces()

  const trainData = []
  for (let [x, y] of splitedData.slice(0, 1)) {    
    state = new TransitionState(x)
    y.push('REDUCE_R')
    transitions = y
    while (transitions.length) {
      feature = getFeature(state, word2index, tag2index)
      const action = transitions.shift()
      const actionIdx = action2index[action]
      trainData.push([...feature, actionIdx])

      action === 'SHIFT' ? state.shift() :
      action === 'REDUCE_L' ? state.leftArc() :
      action === 'REDUCE_R' ? state.rightArc() : ''
    }
  }
  return trainData
}

// trainSet().then(console.log)
module.exports = trainSet
