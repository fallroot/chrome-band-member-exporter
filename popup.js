const FIELDS = ['id', 'name', 'mobile', 'status', 'profile']
const store = {}

function init (members) {
  initMessages()
  getMembers().then(members => {
    store.members = members
    Array.from(document.querySelectorAll('a')).forEach(a => {
      a.addEventListener('click', onClickDownload)
    })
  })
}

function initMessages () {
  Array.from(document.querySelectorAll('[data-i18n]')).forEach(el => {
    el.textContent = chrome.i18n.getMessage(el.dataset.i18n)
  })
}

function getFields () {
  return Array.from(document.querySelectorAll('[name=field]')).filter(el => el.checked).map(el => el.value)
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

function makeBlob (data, fields, type) {
  const filtered = data.map(item => {
    return fields.reduce((memo, field) => {
      memo[field] = item[field]
      return memo
    }, {})
  }, {})
  const array = []

  if (type === 'text/csv') {
    array.push(makeCsv(filtered, fields))
  } else if (type === 'text/tab-separated-values') {
    array.push(makeTsv(filtered, fields))
  } else if (type === 'application/json') {
    array.push(makeJson(filtered))
  }

  const file = new Blob(array, { type })

  return window.URL.createObjectURL(file)
}

function makeJson (items) {
  return JSON.stringify(items, null, 2)
}

function makeSv (items, fields, delimiter) {
  return [makeSvHeader(fields)].concat(items.map(item => {
    return Object.values(item).map(value => {
      if (typeof value === 'string') {
        return `"${value.replace(/"/g, '\\"')}"`
      } else {
        return value
      }
    }).join(delimiter)
  })).join('\n')
}

function makeSvHeader (fields, delimiter) {
  return fields.map(field => chrome.i18n.getMessage(field)).join(delimiter)
}

function makeCsv (items, fields) {
  return makeSv(items, fields, ',')
}

function makeTsv (items, fields) {
  return makeSv(items, fields, '\t')
}

function onClickDownload (event) {
  const fields = getFields()

  if (!fields.length) {
    event.preventDefault()
    alert(chrome.i18n.getMessage('selectFields'))
    return
  }

  const target = event.currentTarget
  const type = target.dataset.type
  const url = makeBlob(store.members, fields, type)

  target.href = url
  setTimeout(() => window.URL.revokeObjectURL(url), 1000)
}

init()
