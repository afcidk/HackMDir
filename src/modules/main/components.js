const API = require('../../../api.js')
const mutations = require('./store.js').mutations
const getters = require('./store.js').getters

const components = {
  button: null,
  root: null,
  list: null
}

const constructor = async function () {
  try {
    mutations.setLoginStatus(API.isLoggedIn())
    if (!getters.getLoginStatus()) {
      return
    }
    // initialize the operation button
    const button = document.createElement('button')
    button.id = 'hmdir_operation_button'
    button.classList.add('hmdir_operation_button')
    document.body.appendChild(button)
    // config root element reference to the components
    components.button = button
    // append root div to the page
    const root = document.createElement('div')
    root.classList.add('hmdir_root')
    document.body.appendChild(root)
    root.style.display = 'none'
    // config root element reference to the components
    components.root = root
    // add button click event to display the root
    button.onclick = function () {
      mutations.setDisplay(!getters.getDisplayRoot())
      root.style.display = getters.getDisplayRoot() ? 'block' : 'none'
      button.style.left = getters.getDisplayRoot() ? '220px' : '0px'
      button.style.transform = getters.getDisplayRoot() ? 'scaleX(-1)' : 'scaleX(1)'
    }
    mutations.setList(await API.getHistory())
    render()
  } catch (error) {
    console.log(error)
  }
}

// the render function to update the screen
const render = function () {
  const root = components.root
  let ul
  if (components.list === null) {
    // insert ul element
    ul = document.createElement('ul')
    ul.classList.add('hmdir_list_root')
    // config list element to components
    components.list = ul
    root.appendChild(components.list)
  } else {
    ul = components.list
  }
  // use fragment to update the list content
  const fragment = document.createDocumentFragment()
  // loop all element in list
  getters.getList().forEach(note => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.textContent = note.title
    a.href = note.href
    a.target = '_blank'
    li.appendChild(a)
    fragment.appendChild(li)
  })
  // use replacement to refresh the list
  const temp = ul.cloneNode(false)
  temp.appendChild(fragment)
  console.log(root)
  root.replaceChild(temp, components.list)
  // update components list reference
  components.list = temp
}

module.exports = {
  ...components,
  initialize: constructor,
  render: render
}
