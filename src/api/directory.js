/* ======== dirCache format ========
 * [
 *  {
 *    dirId: xxx,
 *    title: xxx,
 *    notes: [
 *      { noteId: xxx, title: xxx, href: xxx},
 *      { noteId: xxx, title: xxx, href: xxx}
 *    ]
 *  },
 *  {
 *    ......
 *  }
 * ]
 */
var dirCache = []
const writeContent = require('./api.js').writeContent

/**
 * Swap two notes
 * @param String title
 * @param String href
 * @param JSON info of destination note {dirId: dirId, noteId: noteId}
 * @param JSON info of source note {dirId: dirId, noteId: noteId}
 * @returns JSON [src info, dest info]
 */
function moveNote (title, href, dst = null, src = null) {
  if (src) { // drag in new note will not enter this scope
    let srcNotes = dirCache.find((e) => e.dirId === src.dirId).notes
    const srcNote = srcNotes.find((e) => e.noteId === src.noteId)
    srcNotes.splice(srcNotes.indexOf(srcNote), 1)
    srcNotes.forEach(e => { e.noteId -= +(e.noteId > src.noteId) })
  }

  if (dst) { // remove note will not enter this scope
    let dstNotes = dirCache.find((e) => e.dirId === dst.dirId).notes
    dstNotes.forEach(e => { e.noteId += +(e.noteId > dst.noteId) })
    dstNotes.push({ noteId: dst.noteId, title: title, href: href })
  }

  write()
}

/**
 * Create new directory (default at the end!)
 * @param String title
 */
function newDir (title) {
  dirCache.forEach(e => { e.dirId += 1 })
  dirCache.push({ dirId: 0, title: title, notes: [] })
  write()
}

/**
 * Swap two directories
 * @param Integer Destination dirId
 * @param Integer Source dirId
 */
function moveDir (dst, src) {
  dirCache.find((e) => e.dirId === dst).dirId = src
  dirCache.find((e) => e.dirId === src).dirId = dst
  write()
}

/**
 * Delete directory
 * @param Integer dirId
 */
function delDir (dirId) {
  var target = dirCache.find((e) => e.dirId === dirId)
  dirCache.splice(dirCache.indexOf(target), 1)
  dirCache.forEach(e => { e.dirId -= +(e.dirId > dirId) })
  write()
}

function write () {
  writeContent('dir', JSON.stringify(dirCache))
}

module.exports = {
  moveNote: moveNote,
  newDir: newDir,
  moveDir: moveDir,
  delDir: delDir
}
