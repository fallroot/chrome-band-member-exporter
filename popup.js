const store = {}

function init (members) {
  store.members = members

  Array.from(document.querySelectorAll('a')).forEach(a => {
    a.addEventListener('click', onClickDownload)
  })
}

function getMembers () {
  return new Promise(resolve => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { command: 'getMembers' }, response => {
        resolve(response.members)
      })
    })
  })
}

function makeBlob (data, type) {
  const array = []

  if (type === 'text/csv') {
    array.push(makeCsv(data))
  } else if (type === 'text/tab-separated-values') {
    array.push(makeTsv(data))
  } else if (type === 'application/json') {
    array.push(makeJson(data))
  }

  const file = new Blob(array, { type })

  return window.URL.createObjectURL(file)
}

function makeJson (items) {
  return JSON.stringify(items, null, 2)
}

function makeSv (items, delimiter) {
  return [makeSvHeader()].concat(items.map(item => {
    return Object.values(item).map(value => {
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '\\"')}"`
      } else {
        return value
      }
    }).join(delimiter)
  })).join('\n')
}

function makeSvHeader (delimiter) {
  return [
    '밴드 아이디',
    '이름',
    '전화번호',
    '상태 메시지',
    '프로필 이미지'
  ].join(delimiter)
}

function makeCsv (items) {
  return makeSv(items, ',')
}

function makeTsv (items) {
  return makeSv(items, '\t')
}

function onClickDownload (event) {
  const target = event.currentTarget
  const type = target.dataset.type

  target.href = makeBlob(store.members, type)
}

getMembers().then(init)
