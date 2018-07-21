const fs = require('mz/fs')
const tags = require('./tags')

const indexing = arr => arr.reduce((acc, v, idx) => (acc[v] = idx, acc), {})

const getIndeces = async () => { 
  const voca = await fs
    .readFile('./dataset/dparser/vocab.txt', 'utf-8')
    .then(txt => txt.trim().split('\n').map(t => t.split(/\s/)[0]))

  const word2index = indexing([...voca, 'ROOT', '<NULL>'])
  const tag2index = indexing([...tags, '<root>', '<NULL>'])
  const action2index = indexing(['SHIFT', 'REDUCE_L', 'REDUCE_R'])

  const wordSize = voca.length + 2
  const tagSize = tags.length + 2
  const actionSize = 3

  return { word2index, tag2index, action2index, wordSize, tagSize, actionSize }
}

module.exports = getIndeces
