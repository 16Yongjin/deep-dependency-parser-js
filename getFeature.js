/*
  1. The top 3 words on the stack and buffer
  2. The first and second leftmost / rightmost children of the top two words on the stack
  3. POS tags for St
*/

const zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]))

const getFeature = (transitionState, word2index, tag2index, label2index) => {

  const stackFeat = [1, 2, 3].map(i => transitionState.stack.length - i)
    .map(idx => transitionState.stack[idx])
    .map((s = ['<NULL>', '<NULL>']) => [ word2index[s[0]], tag2index[s[1]] ])

  const tagFeat = [1, 2, 3].map(i => i - 1)
      .map(idx => transitionState.buffer[idx])
      .map((b = ['<NULL>', '<NULL>']) => [ word2index[b[0]], tag2index[b[1]] ])

  const stackChildrenFeat = [1, 2].map(i => transitionState.stack.length - i)
    .map(idx => transitionState.stack[idx] && transitionState.stack[idx][2])
    .map(head => [ transitionState.getLeftMost(head), transitionState.getRightMost(head) ])
    .reduce((acc, v) => acc.concat(v))
    .map((s = ['<NULL>', '<NULL>']) => [ word2index[s[0]], tag2index[s[1]] ])

  return zip(...stackFeat, ...stackChildrenFeat, ...tagFeat)
}

module.exports = getFeature