const natural = require('natural')
const path = require('path')

const base_folder = path.join(path.dirname(require.resolve('natural')), 'brill_pos_tagger')
const rulesFilename = `${base_folder}/data/English/tr_from_posjs.txt`
const lexiconFilename = `${base_folder}/data/English/lexicon_from_posjs.json`
const defaultCategory = 'N'

const lexicon = new natural.Lexicon(lexiconFilename, defaultCategory)
const rules = new natural.RuleSet(rulesFilename)
const tagger = new natural.BrillPOSTagger(lexicon, rules)

// const sentence = ['I', 'see', 'the', 'man', 'with', 'the', 'telescope']
// console.log(JSON.stringify(tagger.tag(sentence)))
module.exports = tagger
