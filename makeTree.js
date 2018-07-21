function _make_tree (ingredient, i, root = true) {
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
        treestr += `${_make_tree(ingredient, idx, false)} `
    })

    treestr = `${treestr.trim()})`
  }

  if (root)
      treestr += ')'
  return treestr
}

const b = [['ROOT', 'has'], ['has', 'he'], ['control', 'good'], ['has', 'control']]
console.log(
  _make_tree(b, 0)
)