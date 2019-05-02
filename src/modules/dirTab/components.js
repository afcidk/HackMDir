const mainHTML = require('./main.html')
const mutations = require('./store.js').mutations
const getters = require('./store.js').getters

const eventBus = require('../eventBus')

const components = {
  root: null,
  newDirButton: null,
  input: null,
  listRoot: null,
  list: null
}

const constructor = async function () {
  try {
    this.root = htmlToElement(mainHTML)
    this.listRoot = this.root.querySelector('.hmdir_dir_list_section')
    this.list = this.listRoot.querySelector('ul')
    this.newDirButton = this.root.querySelector('.hmdir_new_dir_button')
    this.input = this.root.querySelector('.hmdir_dir_operation_section > input')

    // config event bus
    this.newDirButton.onclick = function () {
      eventBus.publish('displayNewDirModal')
    }
    eventBus.subscribe('addNewDir', function (value) {
      mutations.newDir(value)
      this.render()
    }.bind(this))
    this.render()
    return this.root
  } catch (error) {
    console.log(error)
  }
}

// the function to create element by html string
const htmlToElement = function (html) {
  const template = document.createElement('template')
  html = html.trim()
  template.innerHTML = html
  return template.content.firstChild
}

// the render function to update the screen
const render = function () {
  const ul = this.list
  // use fragment to update the list content
  const fragment = document.createDocumentFragment()
  const dirs = getters.getDirs()
  Object.keys(dirs).forEach(dirname => {
    const htmlString = `<li><i></i><a>${dirname} (${dirs[dirname].length})</a><input type="checkbox"/><div class="hmdir_subdir_root" style="display: none;"><ul></ul></div></li>`
    const li = htmlToElement(htmlString)
    const a = li.querySelector('a')
    const subListRoot = li.querySelector('.hmdir_subdir_root')
    const subList = li.querySelector('ul')
    a.onclick = function () {
      subListRoot.style.display = subListRoot.style.display === 'block' ? 'none' : 'block'
      li.querySelector('i').setAttribute('data-open', subListRoot.style.display === 'block' ? 'true' : 'false')
    }
    // use fragment to append li
    const subFragment = document.createDocumentFragment()
    dirs[dirname].forEach(note => {
      const htmlString = `<li><a href="${note.href}" target="_blank">${note.title}</a> <input type="checkbox" /></li>`
      const noteDOM = htmlToElement(htmlString)
      subFragment.appendChild(noteDOM)
    })
    subList.appendChild(subFragment)
    fragment.appendChild(li)
  })
  ul.innerHTML = ''
  ul.appendChild(fragment)
}

module.exports = {
  ...components,
  initialize: constructor,
  render: render
}
