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
/* =================================
 */
var dirCache = []
const writeContent = require('./api.js').writeContent
const getData = require('./api.js').getData

/**
 * Swap two notes
 * @param String title
 * @param String href
 * @param JSON info of destination note {dirId: dirId, noteId: noteId}
 * @param JSON info of source note {dirId: dirId, noteId: noteId}
 * @returns Boolean Whether exists duplicate note or not
 */
function moveNote (title, href, src = null, dst = null) {
  console.log('moveNote:')
  console.table(src, dst)
  read()
  // dirCache.forEach(e => console.table(e.notes))
  if (src) { // drag in new note will not enter this scope
    let srcNotes = dirCache.find((e) => e.dirId === src.dirId).notes
    const srcNote = srcNotes.find((e) => e.noteId === src.noteId)
    srcNotes.splice(srcNotes.indexOf(srcNote), 1)
    srcNotes.forEach(e => { e.noteId -= +(e.noteId > src.noteId) })
  }
  // dirCache.forEach(e => console.table(e.notes))

  if (dst) { // remove note will not enter this scope
    let dstNotes = dirCache.find((e) => e.dirId === dst.dirId).notes
    dstNotes.forEach(e => { e.noteId += +(e.noteId >= dst.noteId) })
    if (dstNotes.findIndex(e => e.href === href) !== -1) return false
    dstNotes.push({ noteId: dst.noteId, title: title, href: href })
  }
  // dirCache.forEach(e => console.table(e.notes))
  write()

  return true
}

/* Delete multiple notes in dirCache
 * @param Array of String NoteId
 */
function delNote (noteIds) {
  read()
  dirCache.forEach(dir => {
    dir.notes = dir.notes.filter(e =>
      !noteIds.includes(e.href.replace('https://hackmd.io/', ''))
    )
  })
  write()
}

/**
 * Create new directory (default at the end!)
 * @param String title
 * @return Boolean Whether action succeed or not
 */
function newDir (title) {
  read()
  // No duplicate title!
  if (dirCache.findIndex((e) => e.title === title) !== -1) return false
  dirCache.forEach(e => { e.dirId += 1 })
  dirCache.push({ dirId: 0, title: title, notes: [] })
  write()

  return true
}

/**
 * Swap two directories
 * @param Integer Destination dirId
 * @param Integer Source dirId
 */
function moveDir (dst, src) {
  read()
  let srcDir = dirCache.find((e) => e.dirId === src)
  dirCache.forEach((e) => { e.dirId -= +(e.dirId > src) })
  dirCache.forEach((e) => { e.dirId += +(e.dirId >= dst) })
  srcDir.dirId = dst
  write()
}

/**
 * Delete directory
 * @param Integer dirId
 */
function delDir (dirId) {
  console.log(`delDir: ${dirId}`)
  read()
  var target = dirCache.find((e) => e.dirId === dirId)
  dirCache.splice(dirCache.indexOf(target), 1)
  dirCache.forEach(e => { e.dirId -= +(e.dirId > dirId) })
  write()
}

/**
 * Rename the title of a directory
 * @param Integer directory ID
 * @param String title
 * @return Boolean Whether exists duplicate title or not
 */
function renameDir (dirId, title) {
  read()
  if (dirCache.findIndex(e => e.title === title) !== -1) return false
  dirCache.find(e => e.dirId === dirId).title = title
  write()
  return true
}

function write () {
  writeContent('dir', dirCache)
}

function read () {
  dirCache = getData('directory-backend')
}

module.exports = {
  moveNote: moveNote,
  delNote: delNote,
  newDir: newDir,
  moveDir: moveDir,
  delDir: delDir,
  renameDir: renameDir
}
