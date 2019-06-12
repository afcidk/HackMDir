/* eslint-env browser */

const utils = require('./utils.js')
var personalCache = ''
var historyCache = ''
var dataCache = utils.defaultDataCache

/**
 * Detect whether exists a logged in user
 * @returns Boolean if user logged in
 */
async function isLoggedIn () {
  var cookie = document.cookie

  if (cookie.search('userid') !== -1 && cookie.search('loginstate') !== -1) return true

  return false
}

async function initCache () {
  await utils.getDataUrl()
  personalCache = await utils.getPersonal()
  historyCache = await utils.getHistory()
  dataCache = await utils.getData()

  setInterval(async () => {
    personalCache = await utils.getPersonal()
  }, 5000)
  setInterval(async () => {
    historyCache = await utils.getHistory()
  }, 5000)
}

/**
 * Delete note in history page by specific notdId
 * @param Array Array of noteId
 */
async function delHistoryNote (noteId) {
  await utils.asyncForEach(noteId, async function (id) {
    const header = new Headers()
    header.append('x-requested-with', 'XMLHttpRequest')
    // get the csfr token
    let token
    const metas = document.getElementsByTagName('meta')
    for (let i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute('name') === 'csrf-token') {
        token = metas[i].getAttribute('content')
        break
      }
    }
    header.append('x-xsrf-token', token)
    await fetch(`history/${id}`, {
      method: 'delete',
      headers: header
    })
  })

  historyCache = await utils.getHistory()
  const hrefList = historyCache.map(e => e.href)
  var fail = []
  noteId.forEach(id => {
    if (hrefList.indexOf(id) !== -1) fail.push(id)
  })

  if (fail.length > 0) return delHistoryNote(fail)
  return []
}

/**
 * Delete note of specific notdId
 * @param Array Array of noteId
 */
async function delNote (noteId) {
  await utils.asyncForEach(noteId, async function (id) {
    const socket = await utils.connect(id)
    socket.on('connect', async () => {
      socket.emit('delete')
      await delHistoryNote([id])
    })
  })

  personalCache = await utils.getPersonal()
  const hrefList = personalCache.map(e => e.href)
  var fail = []
  noteId.forEach(id => {
    if (hrefList.indexOf(id) !== -1) fail.push(id)
  })

  if (fail.length > 0) return delNote(fail)
  return []
}

/**
 * Write content to hkmdir-data (overwrite)
 * @param JSON Content to write
 */
async function writeContent (key, value) {
  const prefix = utils.common_prefix
  const keyFilter = ['last_tab', 'dir']
  if (keyFilter.indexOf(key) === -1) {
    console.log('error key')
    return
  }

  dataCache[key] = value

  const url = await utils.getDataUrl()
  const ret = utils.writeData(url.replace('https://hackmd.io/', ''), prefix + JSON.stringify(dataCache))
  if (ret === false) {
    console.log('Retrieve hkmdir-data error, flush dataCache')
    await initCache()
  }
}

/**
 * Change permission of multiple notes
 * @param Array url of notes
 * @param Integer permission of choices (read->3/2/1, write->30/20/10)
 */
async function changePermission (urls, perm) {
  // preprocess url
  var notes = []
  urls.forEach(url => {
    notes.push(url.replace('https://hackmd.io/', ''))
  })
  var pstr = ''
  if (perm === 11) pstr = 'private'
  else if (perm === 21) pstr = 'protected'
  else if (perm === 31) pstr = 'limited'
  else if (perm === 22) pstr = 'locked'
  else if (perm === 32) pstr = 'editable'
  else if (perm === 33) pstr = 'freely'

  // open the first url as base window
  await utils.asyncForEach(notes, async function (note) {
    const socket = await utils.connect(note)
    socket.on('connect', () => {
      socket.emit('permission', pstr)
    })
  })
}

/**
 * Merge multiple notes into bookmode
 * @param String Title of bookmode note
 * @param Array data [{title: xxx, href: xxx}, .....]
 * @returns String Url of bookmode note
 */
async function addBookmode (title, data) {
  // create content
  var content = `${title}\n===\n\n`
  data.forEach(ele => {
    content += `- [${ele.title}](${ele.href})\n`
  })
  const url = await utils.newData(content)
  const publish = await fetch(`${url}/publish`)
  return publish.url.replace('type=view', '') + 'type=book'
}

function getData (option) {
  if (option === 'personal') {
    return personalCache
  } else if (option === 'history') {
    return historyCache
  } else if (option === 'directory') {
    return dataCache.dir.sort((a, b) => { return a.dirId > b.dirId ? 1 : -1 })
      .map(c => ({ title: c.title,
        notes: c.notes.sort((d, e) => { return d.noteId > e.noteId ? 1 : -1 })
          .map(f => ({ title: f.title, href: f.href })) }))
  } else if (option === 'last_tab') {
    return dataCache['last_tab']
  } else if (option === 'directory-backend') {
    return dataCache.dir
  } else {
    return undefined
  }
}

module.exports = {
  isLoggedIn: isLoggedIn,
  initCache: initCache,
  getData: getData,
  writeContent: writeContent,
  delNote: delNote,
  delHistoryNote: delHistoryNote,
  changePermission: changePermission,
  addBookmode: addBookmode
}
