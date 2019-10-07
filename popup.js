chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  chrome.tabs.sendMessage(tabs[0].id, { command: 'getMembers' }, response => {
    const parent = document.querySelector('div')
    parent.textContent = JSON.stringify(response.members)
  })
})
