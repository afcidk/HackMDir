/* eslint-env browser */

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

async function getDOM (url) {
  const res = await fetch(url)
  const text = await res.text()
  return new DOMParser().parseFromString(text, 'text/html').firstElementChild
}

function createHiddenNote (noteId = 'new') {
  var element = document.createElement('iframe')
  element.style.display = 'none'
  element.setAttribute('id', 'hkmdir-data')
  element.src = '/' + noteId
  document.body.appendChild(element)
}

/**
 * Create new data note
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
 * Write content to note
 * @param String noteId
 * @param String Content to overwrite the file
 */
async function writeData (noteId, content) {
  const contentWindow = document.getElementById('hkmdir-data').contentWindow

  contentWindow.editor.setValue(content)
  const socket = await connect(noteId)
  socket.emit('permission', 'private')
}

/**
 * Initialize cache
 * @returns JSON
 */
async function initCache () {
  var cache = ''
  var noteId = ''

  var doc = await getDOM('/profile?q=hkmdir-data')
  const page = doc.querySelector('.content a')
  if (page === null) {
    noteId = await newData('###### hkmdir-data\n')
  } else {
    noteId = page.href
    const href = `${page.href}/publish`
    doc = await getDOM(href)
    cache = doc.querySelector('#doc').innerHTML
    console.log(cache)
  }

  noteId = noteId.replace('https://hackmd.io/', '')
  // create hidden note for later socketio usage
  if (document.getElementById('hkmdir-data') === null) {
    createHiddenNote(noteId.replace('https://hackmd.io/', ''))
  }
  return { noteId: noteId, cache: cache }
}

module.exports = {
  connect: connect,
  getDOM: getDOM,
  createHiddenNote: createHiddenNote,
  newData: newData,
  writeData: writeData,
  initCache: initCache
}
