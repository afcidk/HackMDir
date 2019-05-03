/* eslint-env browser */
// FIXME: move some functions to new file (utils)

var cache = ''
var cacheId = ''
const utils = require('./utils.js')

/**
 * Detect whether exists a logged in user
 * @returns Boolean if user logged in
 */
async function isLoggedIn () {
  var cookie = document.cookie

  // open data file at background, which supports socketio
  const res = await utils.initCache()
  cache = res.cache
  cacheId = res.noteId

  if (cookie.search('userid') !== -1 && cookie.search('loginstate') !== -1) return true

  return false
}
/**
 * Get notes written by logged in user
 * @returns Array Information including href and title
 */
async function getPersonal () {
  console.log('getPersona')
  const doc = await fetch('/api/overview')
  const text = await doc.text()
  const result = Array.from(JSON.parse(text)).map(function (e) {
    return { href: `https://hackmd.io/${e.id}`, title: e.title }
  })

  // update Cache
  writeCache(result)
  return result
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
    console.log(id)
    const socket = await utils.connect(id)
    socket.on('connect', () => {
      socket.emit('delete')
    })
  })
}

/**
 * Write content to hkmdir-data (overwrite)
 * @param JSON Content to write
 */
function writeCache (content) {
  const prefix = '###### tags: hkmdir-data\n\n'
  utils.writeData(cacheId, prefix + JSON.stringify(content))
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
    const socket = await utils.connect(note)
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
  const url = await utils.newData(content)
  const bmUrl = await fetch(`${url}/publish`)
  return bmUrl.url.replace('/s/', '/c/')
}

function getCache (option) {
  if (option === 'personal') {
    console.log('getCache')
    if (cache === '') return getPersonal()
    else return cache
  } else {
    return undefined
  }
}

module.exports = {
  isLoggedIn: isLoggedIn,
  getCache: getCache,
  writeCache: writeCache,
  getHistory: getHistory,
  getPersonal: getPersonal,
  delNote: delNote,
  changePermission: changePermission,
  addBookmode: addBookmode
}
