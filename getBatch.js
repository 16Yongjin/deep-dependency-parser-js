function shuffle(a) {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1))
      x = a[i]
      a[i] = a[j]
      a[j] = x
  }
  return a
}


function * getBatch (batch_size, train_data) {
  trainData = shuffle(train_data)
  let start = 0
  let end = batch_size
  let batch = []

  while (end < train_data.length) {
    yield train_data.slice(start, end)
    start = end
    end = end + batch_size
  }

  if (end >= train_data.length) {
    yield train_data.slice(start)
  }
}

// const b = [[1], [2], [3], [4], [5]]

// for (let batch of getBatch(1, b)) {
//   console.log(batch)
// }

module.exports = getBatch