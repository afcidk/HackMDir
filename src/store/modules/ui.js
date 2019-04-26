const API = require('../../../api.js')

const state = {
  displayRoot: false,
  list: [],
  isLogin: false
}

const components = {
  button: null,
  root: null,
  list: null
}

const constructor = async function () {
  try {
    state.isLogin = API.isLoggedIn()
    state.list = await API.getNote()
    if (!state.isLogin) {
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
      state.displayRoot = !state.displayRoot
      root.style.display = state.displayRoot ? 'block' : 'none'
      button.style.left = state.displayRoot ? '220px' : '0px'
      button.style.transform = state.displayRoot ? 'scaleX(-1)' : 'scaleX(1)'
    }
    // render the root element
    render()
  } catch (error) {
    console.log(error)
  }
}

const render = function () {
  const root = components.root
  // insert ul element
  const ul = document.createElement('ul')
  ul.style.cssText = 'color: black;'
  root.appendChild(ul)
  // config list component
  components.list = ul
  // user fragment to append all list element
  const fragment = document.createDocumentFragment()
  state.list.forEach(note => {
    const li = document.createElement('li')
    li.textContent = note.title
    fragment.appendChild(li)
  })
  ul.appendChild(fragment)
}

module.exports = {
  constructor: constructor,
  state: state,
  components: components
}
