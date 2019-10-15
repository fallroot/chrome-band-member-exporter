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
