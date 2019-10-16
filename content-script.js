function getMembers () {
  return Array.from(document.querySelectorAll('.cMemberList .uFlexItem')).map(el => {
    const lastInfo = el.querySelector('.lastInfo')
    const subText = el.querySelector('.subText')

    return {
      id: el.dataset.user_no,
      name: el.dataset.user_name,
      mobile: lastInfo ? lastInfo.textContent : '',
      status: subText ? subText.textContent : '',
      profile: el.querySelector('.profileInner img').getAttribute('src')
    }
  }).filter(Boolean)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command !== 'getMembers') {
    return
  }
  sendResponse({ members: getMembers() })
})
