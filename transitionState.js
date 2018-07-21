// const zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]))

class TransitionState {
  constructor (taggedSentence) {
    this.root = ['ROOT', '<root>', -1]
    this.stack = [this.root]
    this.buffer = taggedSentence.map(([word, pos], index) => [word, pos, index]) // [[ 'Bell', 'NNP', 0], [ ',', ',', 1], [ 'based', 'VBN', 2]]
    this.address = [...taggedSentence.map(([word]) => word), 'ROOT']
    this.arcs = []
  }

  print () {
    console.log(`stack: [${this.stack.map(([word]) => word).join(' ')}] \nbuffer: [${this.buffer.map(([word]) => word).join(' ')}]`)
  }

  shift () {
    if (this.buffer.length >= 1)
      this.stack.push(this.buffer.shift())
  }

  leftArc (relation) {
    if (this.stack.length >= 2) {
      
      const [s2, s1] = this.stack.slice(-2)
      const arc = {
        graphId: this.arcs.length,
        form: s1[0],
        addr: s1[2],
        head: s2[2],
        pos: s1[1],
        relation
      }
      this.arcs.push(arc)
      this.stack.splice(-2, 1)
    }
  }

  rightArc (relation) {
    if (this.stack.length >= 2) {

      const [s2, s1] = this.stack.slice(-2)
      const arc = {
        graphId: this.arcs.length,
        form: s2[0],
        addr: s2[2],
        head: s1[2],
        pos: s2[1],
        relation
      }
      this.arcs.push(arc)
      this.stack.splice(-1, 1)
    }
  }

  getLeftMost(index) {
    const arc = this.arcs.find(arc => arc.head === index)
    return arc ? [arc.form, arc.pos, arc.addr] : ['<NULL>', '<NULL>', null]
  }

  getRightMost(index) {
    const arc = this.arcs.reverse().find(arc => arc.head === index)
    return arc ? [arc.form, arc.pos, arc.addr] : ['<NULL>', '<NULL>', null]
  }

  isDone () {
    return this.buffer.length === 0 && this.stack.length === 1 && this.stack[0] === this.root
  }

  toTreeString () {
    if (!this.is_done())
      return

    let ingredient = this.arcs.map(({ form, haed }) => [form, this.address(head)])
    ingredient.unshift(ingredient.pop()) // 루트를 맨 앞으로
    return this._makeTree(ingredient, 0)
  }

  _makeTree (ingredient, i, root = true) {
    let treestr = root ? `(${ingredient[i][0]} ` : ''

    ingredient[i][0] = 'CHECK'
  
    const parents = ingredient.map(i => i[0])
    if (!parents.includes(ingredient[i][1])) {
      treestr += ingredient[i][1]
      return treestr
    } else {  
      treestr += `(${ingredient[i][1]} `
      parents.forEach((node, idx) => {
        if (node === ingredient[i][1])
          treestr += `${this._makeTree(ingredient, idx, false)} `
      })
      treestr = `${treestr.trim()})`
    }

    if (root)
        treestr += ')'
    return treestr
  }
}

module.exports = TransitionState
