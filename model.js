const tf = require('@tensorflow/tfjs')
const getIndeces = require('./indeces')
const trainSet = require('./trainSet')
const zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]))

const step = 5,
	batchSize = 256,
	wordEmbedSize = 50,
	tagEmbedSize = 10,
	hiddenSize = 512,
	learningRate = 0.001

const DependencyParser = (wordSize, wordEmbedDim, tagSize, tagEmbedDim, hiddenSize, targetSize) => {
  const wordInput = tf.input({ shape: [10] })
  const tagInput = tf.input({ shape: [10] })

  const wordEmbedding = tf.layers.embedding({ inputDim: wordSize, outputDim: wordEmbedDim })
  const tagEmbedding = tf.layers.embedding({ inputDim: tagSize, outputDim: tagEmbedDim })

  const wordEmReshape = tf.layers.reshape({targetShape: [10 * wordEmbedDim]})
  const tagEmReshape = tf.layers.reshape({targetShape: [10 * tagEmbedDim]})

  const concatLayer = tf.layers.concatenate({ axis: 1 })

  const hiddenLayer = tf.layers.dense({ units: hiddenSize, activation: 'sigmoid' });
  const outputLayer = tf.layers.dense({ units: targetSize, activation: 'softmax' })

  let outputs = [wordEmbedding.apply(wordInput), tagEmbedding.apply(tagInput)]
  console.log(outputs[0].shape, outputs[1].shape)
  outputs = outputs.reduce((w, t) => [wordEmReshape.apply(w), tagEmReshape.apply(t)])
  console.log(...outputs.map(i => i.shape))
  outputs = concatLayer.apply(outputs)
  console.log('concatLayer', outputs.shape)
  console.log(outputs.shape)  
  outputs = hiddenLayer.apply(outputs)
  console.log(outputs.shape)
  outputs = outputLayer.apply(outputs)
  console.log(outputs.shape)

  const optimizer = tf.train.adam(learningRate)
  const model = tf.model({ inputs: [wordInput, tagInput], outputs})
  model.compile({ optimizer, loss: 'categoricalCrossentropy', metrics: ['accuracy'] })
  model.summary()
  return model
}

const main = async () => {
  const { wordSize, tagSize, actionSize } = await getIndeces()
  const trainset = await trainSet()
  let [words, tags, actions] = zip(...trainset.slice(0, 1))

  console.log(words, tags, actions)
  try {

    words = tf.tensor2d(words, [words.length, 10])
    tags = tf.tensor2d(tags, [tags.length, 10])
    actions = tf.tensor1d(actions, 'int32')
    actions = tf.oneHot(actions, 3)
    const step = 5,
    batchSize = 256,
    wordEmbedDim = 50,
    tagEmbedDim = 10,
    hiddenSize = 128,
    learningRate = 0.001
    const model = DependencyParser(wordSize, wordEmbedDim, tagSize, tagEmbedDim, hiddenSize, actionSize)
    
    const pred = await model.predict([words, tags], actions)
    pred.print(true)
    const eva = model.evaluate([words, tags], actions)
    console.log(eva)

    console.log(...[words, tags, actions].map(i => i.shape))
    for (let i = 0; i < 5; ++i) {
      console.log(i)
      let history = await model.fit([words, tags], actions, {batchSize: 1, epochs: step, callbacks: { onEpochEnd: console.log }})
      console.log(i, history.history.loss[0])
    }
  } catch (e) {
    console.log(e)
  }
}

main()
