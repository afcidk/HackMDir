const API = require('../../api/api.js')
const mainHTML = require('./main.html')
const mutations = require('./store.js').mutations
const getters = require('./store.js').getters

const components = {
  root: null,
  listRoot: null,
  list: null
}

const constructor = async function () {
  try {
    this.root = htmlToElement(mainHTML)
    this.listRoot = this.root.querySelector('.hmdir_recent_list_section')
    this.list = this.listRoot.querySelector('ul')
    this.input = this.root.querySelector('.hmdir_recent_operation_section > input')
    mutations.setList(await API.getHistory())

    this.render()
    console.log(this.root)
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
const render = async function () {
  mutations.setList(await API.getHistory())
  // console.log(getters.getList())
  const root = this.listRoot
  let ul
  if (this.list === null) {
    root.innerHTML = ''
    // insert ul element
    ul = document.createElement('ul')
    // config list element to components
    this.list = ul
    root.appendChild(this.list)
  } else {
    ul = this.list
  }
  // use fragment to update the list content
  const fragment = document.createDocumentFragment()
  // loop all element in list
  for (let [index, note] of getters.getList().entries()) {
    const htmlString = `<li><input type="checkbox" data-index="${index}" /><a href="${note.href}" target="_blank">${note.title}</a></li>`
    const li = htmlToElement(htmlString)
    const checkbox = li.querySelector('input')
    checkbox.addEventListener('click', function () {
      const noteID = note.href.substring(18)
      if (checkbox.checked) {
        mutations.addTempRemoved(noteID)
      } else {
        mutations.removeTempRemoved(noteID)
      }
      const operationButton = document.getElementsByClassName('hmdir_operation_button')
      for (let i = 0; i < 3; ++i) {
        const target = operationButton[i]
        if (getters.getTempRemoved().length > 0) {
          if (!target.classList.contains('active')) {
            target.classList.add('active')
          }
        } else {
          target.classList.remove('active')
        }
      }
    })
    fragment.appendChild(li)
  }
  // use replacement to refresh the list
  const temp = ul.cloneNode(false)
  temp.appendChild(fragment)
  root.replaceChild(temp, this.list)
  // update components list reference
  this.list = temp
}

module.exports = {
  ...components,
  initialize: constructor,
  render: render
}
