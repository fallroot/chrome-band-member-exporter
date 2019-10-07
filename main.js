// requestIdleCallback(onIdle)

// function onIdle (deadline) {
//   while (deadline.timeRemaining() > 0 && !document.querySelector('.cMemberList')) {
//     count += 1
//   }
//   console.log(count, getMembers())
// }

// function rafAsync() {
//   return new Promise(resolve => {
//     requestAnimationFrame(resolve)
//   })
// }

// async function checkElement(selector) {
//   let count = 0
//   const querySelector = document.querySelector(selector)
//   while (querySelector === null) {
//     await rafAsync()
//     count += 1
//   }
//   console.log(count)
//   return querySelector
// }

const checkElement = async selector => {
  while ( document.querySelector(selector) === null) {
    await new Promise(resolve => requestAnimationFrame(resolve))
  }
  return document.querySelector(selector)
}

function getMembers () {
  return Array.from(document.querySelectorAll('.cMemberList .uFlexItem')).map(el => {
    const lastInfo = el.querySelector('.lastInfo')

    return {
      bandId: el.dataset.user_no,
      name: el.dataset.user_name,
      mobile: lastInfo ? lastInfo.textContent : '',
      profile: el.querySelector('.profileInner img').getAttribute('src')
    }
  }).filter(Boolean)
}

console.log('started')
checkElement('.cMemberList').then(() => console.log(getMembers()))
console.log('finished')
