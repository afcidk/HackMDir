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
    console.log(API)
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
    // config observer
    observerConfig()
    // render the root element
    render()
  } catch (error) {
    console.log(error)
  }
}

const render = function () {
  const root = components.root
  let ul
  if (components.list === null) {
    // insert ul element
    ul = document.createElement('ul')
    ul.class = 'hmdir_list_root'
    ul.style.cssText = 'color: black;'
    // config list element to components
    components.list = ul
    root.appendChild(components.list)
  } else {
    ul = components.list
  }
  // use fragment to update the list content
  const fragment = document.createDocumentFragment()
  // loop all element in list
  state.list.forEach(note => {
    const li = document.createElement('li')
    li.textContent = note.title
    li.onclick = function () {
      const target = window.open(note.href, '_blank')
      target.focus()
    }
    fragment.appendChild(li)
  })
  // use replacement to refresh the list
  const temp = ul.cloneNode(false)
  temp.appendChild(fragment)
  root.replaceChild(temp, components.list)
  // update components list reference
  components.list = temp
}

const observerConfig = function () {
  // config state list proxy
  state.list = new Proxy(state.list, {
    apply: function (target, thisArg, argumentsList) {
      return thisArg[target].apply(this, argumentsList)
    },
    deleteProperty: function (target, property) {
      render()
      return true
    },
    set: function (target, property, value, receiver) {
      target[property] = value
      render()
      return true
    }
  })
}

module.exports = {
  constructor: constructor,
  state: state,
  components: components
}
