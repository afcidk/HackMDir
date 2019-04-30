/* eslint-env browser */
// FIXME: move some functions to new file (utils)

var noteData = ''

/**
 * Detect whether exists a logged in user
 * @returns Boolean if user logged in
 */
async function isLoggedIn () {
  var cookie = document.cookie

  // open data file at background, which supports socketio
  getData()

  if (cookie.search('userid') !== -1 && cookie.search('loginstate') !== -1) return true

  return false
}
/**
 * Get notes written by logged in user
 * @returns Array Information including href and title
 */
async function getNote () {
  const doc = await getDOM('/profile')

  try {
    var maxPage = doc.querySelector('.pagination >li:last-child a').innerText
  } catch (e) { // prevent error when no user note
    return []
  }

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
  const res = await fetch(url)
  const text = await res.text()
  return new DOMParser().parseFromString(text, 'text/html').firstElementChild
}

/**
 * Get History of a logged in user
 * @returns JSON History lists
 */
async function getHistory () {
  var history = await fetch('/history')
  return JSON.parse(await history.text()).history.map(target => ({
    title: target.text,
    href: `https://hackmd.io/${target.id}`
  }))
}

/**
 * Delete note of specific notdId
 * @param Array Array of noteId
 */
function delNote (noteId) {
  noteId.forEach(async id => {
    const socket = await connect(id)
    socket.on('connect', () => {
      socket.emit('delete')
    })
  })
}

/**
 * Create a websocket connection instance
 * @param String noteId
 * @returns Websocket instance(io)
 */
async function connect (noteId, base = document.getElementById('hkmdir-data').contentWindow) {
  // FIXME: Add exception handling if cannot connect

  // Register realtime server
  var server = await fetch(`/realtime-reg/realtime?noteId=${noteId}`)
  server = await server.text()
  var url = JSON.parse(server)['url']
  url = url.replace('https://hackmd.io', '') + '/socket.io/'

  return base.io('https://hackmd.io', {
    path: url,
    query: {
      noteId: noteId
    },
    reconnectionAttempts: 20
  })
}

/**
 * Get config content
 * @returns String Raw config content (Not parsed)
 */
async function getData () {
  var doc = await getDOM('/profile?q=hkmdir-data')
  var url = ''
  const page = doc.querySelector('.content a')
  if (page === null) {
    url = await newData('###### hkmdir-data\n')
  } else {
    url = page.href
    const href = `${page.href}/publish`
    doc = await getDOM(href)
    noteData = doc.querySelector('#doc').innerHTML
    console.log(noteData)
  }

  // create hidden note for later socketio usage
  if (document.getElementById('hkmdir-data') === null) {
    createHiddenNote(url.replace('https://hackmd.io/', ''))
  }
}

/**
 * Create a new config file
 * @param String Initial content for config file
 * @return String Url of new note
 */
async function newData (content) {
  const newPage = (await fetch('/new')).url

  // FIXME: set timeout since the page may not be initialized soon
  // FIXME: Add exception if the note cannot be created
  setTimeout(function () {
    writeData(newPage.replace('https://hackmd.io/', ''),
      content)
  }, 10000)

  return newPage
}

/**
 * Write to config file (overwrite)
 * @param String noteId
 * @param String Content to overwrite the file
 */
async function writeData (noteId, content) {
  const contentWindow = document.getElementById('hkmdir-data').contentWindow

  contentWindow.editor.setValue(content)
  const socket = await connect(noteId)
  socket.emit('permission', 'private')
}

function createHiddenNote (noteId = 'new') {
  var element = document.createElement('iframe')
  element.style.display = 'none'
  element.setAttribute('id', 'hkmdir-data')
  element.src = '/' + noteId
  document.body.appendChild(element)
}

/**
 * Change permission of multiple notes
 * @param Array url of notes
 * @param Array permission of choices (read->3/2/1, write->30/20/10)
 */
function changePermission (urls, perm) {
  // preprocess url
  var notes = []
  urls.forEach(url => {
    notes.push(url.replace('https://hackmd.io', ''))
  })

  var pstr = ''
  if (perm === 33) pstr = 'private'
  else if (perm === 32) pstr = 'protected'
  else if (perm === 22) pstr = 'limited'
  else if (perm === 31) pstr = 'locked'
  else if (perm === 21) pstr = 'editable'
  else if (perm === 11) pstr = 'freely'

  // open the first url as base window
  notes.forEach(async note => {
    const socket = await connect(note)
    socket.emit('permission', pstr)
  })
}

/**
 * Merge multiple notes into bookmode
 * @param String Title of bookmode note
 * @param Array data [[title1, href1], [title2, href2], ...]
 * @returns String Url of bookmode note
 */
async function addBookmode (title, data) {
  // create content
  var content = `${title}\n===\n\n`
  data.forEach(ele => {
    content += `- [${ele[0]}](${ele[1]})\n`
  })
  const url = await newData(content)
  const bmUrl = await fetch(`${url}/publish`)
  return bmUrl.url.replace('/s/', '/c/')
}

module.exports = {
  writeData: writeData,
  getData: getData,
  getHistory: getHistory,
  getNote: getNote,
  isLoggedIn: isLoggedIn,
  delNote: delNote,
  changePermission: changePermission,
  addBookmode: addBookmode,
  noteData: noteData
}
