let assert = require('assert')
let pythonBridge = require('python-bridge')
 
let python = pythonBridge({ python: 'python3' })
python.ex`import math`
python.ex`import nltk`
python`math.sqrt(9)`.then(x => assert.equal(x, 3))
 
let list = [3, 4, 2, 1]
python`sorted(${list})`.then(x => assert.deepEqual(x, list.sort()))

python`nltk.pos_tag('He has good control'.split())`.then(console.log)

python.end()
