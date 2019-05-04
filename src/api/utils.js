/* eslint-env browser */

/**
 * async version for forEach
 * @param Array array
 * @param Function callback
 */
const asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const io = require('socket.io-client')
/**
 * Create a websocket connection instance
 * @param String noteId
 * @returns Websocket instance(io)
 */
async function connect (noteId) {
  // FIXME: Add exception handling if cannot connect

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
  // TODO: This is not a robust function, cannot remove characters
  // // possibly related to cursor

  const socket = await connect(noteId)
  const doc = await getDOM(`https://hackmd.io/${noteId}/publish`)
  const length = doc.querySelector('#doc').innerHTML.length
  console.log(length)
  socket.emit('doc', { revision: 0, force: true })
  // if (length === 0) {
  socket.emit('operation', 0, [content], null)
  /*
  } else {
    socket.emit('operation', 0, [-length], null)
    socket.emit('operation', 1, [content], null)
  }
  */

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
