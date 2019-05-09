/* eslint-env browser */
const io = require('socket.io-client')

/**
 * Async version for forEach
 * @param Array array
 * @param Function callback
 */
async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

/**
 * Create a websocket connection instance
 * @param String noteId
 * @returns Websocket instance(io)
 */
async function connect (noteId) {
  // Register realtime server
  var server = await fetch(`/realtime-reg/realtime?noteId=${noteId}`)
  server = await server.text()
  var url = JSON.parse(server)['url']
  url = url.replace('https://hackmd.io', '') + '/socket.io/'

  return io('https://hackmd.io', {
    path: url,
    query: {
      noteId: noteId
    },
    reconnectionAttempts: 20
  })
}

/**
 * Get the revision number of a note
 * @param noteId
 * @return Int Revision number
 */
async function getRevision (noteId) {
  var fetched = await fetch(`/realtime-reg/realtime?noteId=${noteId}`)
  var raw = await fetched.text()
  const server = JSON.parse(raw)['url'].replace('https://hackmd.io', '') + '/socket.io'

  fetched = await fetch(`${server}/?noteId=${noteId}&transport=polling`)
  raw = await fetched.text()
  const sid = JSON.parse(raw.substring(raw.indexOf('{'))).sid

  fetched = await fetch(`${server}/?noteId=${noteId}&transport=polling&sid=${sid}`)
  raw = await fetched.text()

  // may fail sometimes, make more attempts~
  try {
    return parseInt(raw.match('"revision":([0-9]*)')[1])
  } catch (TypeError) {
    return getRevision(noteId)
  }
}

/**
 * Get DOM of a page
 * @param String Url
 * @return DOMElement
 */
async function getDOM (url) {
  const res = await fetch(url)
  const text = await res.text()
  return new DOMParser().parseFromString(text, 'text/html').firstElementChild
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
  const socket = await connect(noteId)
  const doc = await getDOM(`https://hackmd.io/${noteId}/publish`)
  const length = doc.querySelector('#doc').innerText.length
  var revision = await getRevision(noteId)

  if (length > 2) {
    socket.emit('operation', revision, [1, -1, length - 2], null)
    socket.emit('operation', revision + 1, [-length + 1], null)
    revision += 2
  } else if (length > 0) {
    socket.emit('operation', revision, [-length], null)
    revision += 1
  }
  socket.emit('operation', revision, [content], null)

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
  return { noteId: noteId, cache: cache }
}

module.exports = {
  connect: connect,
  getDOM: getDOM,
  newData: newData,
  writeData: writeData,
  initCache: initCache,
  asyncForEach: asyncForEach
}
