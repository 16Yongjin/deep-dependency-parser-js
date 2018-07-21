const fs = require('mz/fs')
const pos = require('./posTagger')

const preprocess = async () => {
	const data = await fs
		.readFile('./dataset/dparser/train.txt', 'utf-8')
		.then(txt => txt.trim().split('\n'))

	const splitedData = data
		.map(d => d.split(' ||| '))
		.map(([sentence, actions]) => [sentence.split(' '), actions.split(' ')])
    .map(([sentence, actions]) => [pos.tag(sentence), actions])
    
  return splitedData
}

module.exports = preprocess
