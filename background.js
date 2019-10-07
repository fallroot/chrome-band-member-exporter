const re = new RegExp('^https://band.us/band/\\w+/member/?', 'i')

function isValidUrl (url) {
  return url && url.match(re)
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = tab.url

  if (isValidUrl(url)) {
    chrome.pageAction.show(tabId)
  } else {
    chrome.pageAction.hide(tabId)
  }
})

// chrome.pageAction.onClicked.addListener(tab => {
//   chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//     chrome.tabs.sendMessage(tabs[0].id, { command: 'getMembers' }, response => {
//       console.log(response)
//     })
//   })
// })
