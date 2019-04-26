/* eslint-env browser */

/**
 * Detect whether exists a logged in user
 * @returns Boolean if user logged in
 */
function isLoggedIn () {
  // TODO: The better way is to check the connect.sid cookie,
  // but we cannot get that cookie, unless we use chrome.cookies API
  var cookie = document.cookie
  if (cookie.search('userid') !== -1 && cookie.search('loginstate') !== -1) return true

  return false
}

/**
 * Get notes written by logged in user
 * @returns Array Information including href and title
 */
async function getNote () {
  const doc = await getDOM('/profile')
  const maxPage = doc.querySelector('.pagination >li:last-child a').innerText

  let result = []
  for (var i = 1; i <= maxPage; ++i) {
    const doc = await getDOM('/profile?page=' + i)
    const element = doc.querySelectorAll('.content a')

    element.forEach(ele => {
      result.push({
        href: ele.href,
        title: ele.innerHTML
      })
    })
  }

  return result
}

async function getDOM (url) {
  console.log('received url: ' + url)
  var res = await fetch(url)
  var text = await res.text()
  return new DOMParser().parseFromString(text, 'text/html').firstElementChild
}

/**
 * Get History of a logged in user
 * @returns Array
 */
async function getHistory () {
  var history = await fetch('/history')
  return JSON.parse(await history.text())
}

/**
 * Delete note of specific notdId
 * @param noteId
 * @returns Boolean Whether delete success or not
 */
async function delNote (noteId) {
  const socket = await connect(noteId)
  socket.on('connect', () => {
    socket.emit('delete')
  })
}

async function connect (noteId) {
  // Register realtime server
  var server = await fetch('/realtime-reg/realtime?noteId=' + noteId)
  server = await server.text()
  var url = JSON.parse(server)['url']
  url = url.substring(url.indexOf('hackmd.io') + 9) + '/socket.io/'

  /* global io */
  return io('https://hackmd.io', {
    path: url,
    query: {
      noteId: noteId
    },
    reconnectionAttempts: 20
  })
}

async function getConfig () {
  var doc = await getDOM('/profile?q=hackmdir-config')
  const page = doc.querySelector('.content a')
  if (page === null) {
    newConfig()
    return {}
  }

  const href = page.href + '/publish'
  doc = await getDOM(href)
  const info = doc.querySelector('#doc').innerHTML
  console.log(info)
}

async function newConfig () {
  const newPage = (await fetch('/new')).url

  setTimeout(function () {
    writeConfig(newPage.substring(newPage.indexOf('hackmd.io') + 10),
      ':::info\nThis is test config\n:::')
  }, 5000)
}

function writeConfig (noteId, data) {
  console.log('noteId: ' + noteId)
  console.log('data: ' + data)
  var element = document.createElement('iframe')
  element.style.display = 'none'
  element.onload = (function () {
    return function () {
      element.contentWindow.editor.setValue(data)
      console.log('write OK')
    }
  }())
  element.src = '/' + noteId
  document.body.appendChild(element)
}

module.export = {
  writeConfig: writeConfig,
  getConfig: getConfig,
  getHistory: getHistory,
  getNote: getNote,
  isLoggedIn: isLoggedIn,
  delNote: delNote
}
