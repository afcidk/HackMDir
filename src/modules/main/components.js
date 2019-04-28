const API = require('../../../api.js')
const html = require('./main.html')
const mutations = require('./store.js').mutations
const getters = require('./store.js').getters

const components = {
  button: null,
  root: null,
  grid: null,
  list: null,
  loading: null,
  typeButton: {
    recent: null,
    personal: null,
    dir: null
  }
}

const constructor = async function () {
  try {
    mutations.setLoginStatus(API.isLoggedIn())
    if (!getters.getLoginStatus()) {
      return
    }
    // // initialize the display button
    const button = document.createElement('button')
    button.id = 'hmdir_display_button'
    button.classList.add('hmdir_display_button')
    document.body.appendChild(button)
    // config root element reference to the components
    components.button = button
    // append root div to the page
    const root = document.createElement('span')
    root.style.display = 'none'
    document.body.appendChild(root)
    root.innerHTML = html
    // config root element reference to the components
    components.root = root
    // add button click event to display the root
    button.onclick = function () {
      mutations.setDisplay(!getters.getDisplayRoot())
      root.style.display = getters.getDisplayRoot() ? 'block' : 'none'
      button.style.left = getters.getDisplayRoot() ? '180px' : '10px'
      button.style.transform = getters.getDisplayRoot() ? 'scaleX(-1)' : 'scaleX(1)'
    }
    mutations.setList(await API.getHistory())
    // get the reference of all element
    components.grid = document.querySelector('.hmdir_grid_section')
    components.list = document.querySelector('.hmdir_list_container > ul')
    components.loading = document.querySelector('.lds_ring')
    components.loading.style.display = 'none'
    components.typeButton.recent = document.querySelector('.hmdir_type_button:nth-child(1)')
    components.typeButton.personal = document.querySelector('.hmdir_type_button:nth-child(2)')
    components.typeButton.dir = document.querySelector('.hmdir_type_button:nth-child(3)')
    // config type button event
    Object.keys(components.typeButton).forEach(key => {
      const button = components.typeButton[key]
      button.onclick = async function () {
        // clear the list first
        mutations.setList([])
        render()
        // start loading effect
        components.loading.style.display = 'block'
        try {
          mutations.setType(key)
          if (key === 'recent') {
            mutations.setList(await API.getHistory())
          } else if (key === 'personal') {
            mutations.setList(await API.getNote())
          } else if (key === 'dir') {
            // TODO: fetch dir infomation and set list
          }
          render()
        } catch (error) {
          console.log(error)
        }
        // start loading effect
        components.loading.style.display = 'none'
      }
    })
    render()
  } catch (error) {
    console.log(error)
  }
}

// the render function to update the screen
const render = function () {
  const root = components.list.parentNode
  let ul
  if (components.list === null) {
    // insert ul element
    ul = document.createElement('ul')
    // config list element to components
    components.list = ul
    root.querySelector('.hmdir_list_root').appendChild(components.list)
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
  root.replaceChild(temp, components.list)
  // update components list reference
  components.list = temp
}

module.exports = {
  ...components,
  initialize: constructor,
  render: render
}
