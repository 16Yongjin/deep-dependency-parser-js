const tf = require('@tensorflow/tfjs')

const embed = tf.layers.embedding({ inputDim: 3, outputDim: 5})
const res = embed.apply(tf.tensor([[0, 1, 2]]))
// res

res.print()

console.log(res.shape[0])
tf.reshape(res, [res.shape[0], -1]).print()