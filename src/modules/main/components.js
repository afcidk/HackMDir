const API = require('../../../api.js')
const mainHTML = require('./main.html')
const dirHTML = require('./dir.html')
const mutations = require('./store.js').mutations
const getters = require('./store.js').getters

const components = {
  button: null,
  root: null,
  grid: null,
  list: null,
  listRoot: null,
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
    root.innerHTML = mainHTML
    // config root element reference to the components
    components.root = root
    // add button click event to display the root
    button.onclick = function () {
      mutations.setDisplay(!getters.getDisplayRoot())
      root.style.display = getters.getDisplayRoot() ? 'block' : 'none'
      button.style.left = getters.getDisplayRoot() ? '360px' : '0px'
    }
    mutations.setList(await API.getHistory())
    // get the reference of all element
    components.grid = document.querySelector('.hmdir_grid_section')
    components.listRoot = document.querySelector('.hmdir_list_container')
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
        // start loading effect
        components.loading.style.display = 'block'
        components.typeButton.recent.removeAttribute('current')
        components.typeButton.personal.removeAttribute('current')
        components.typeButton.dir.removeAttribute('current')
        components.typeButton[key].setAttribute('current', 'true')
        try {
          mutations.setType(key)
          // clear the list first
          mutations.setList([])
          render()
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
        // finish loading effect
        components.loading.style.display = 'none'
      }
    })
    // set recent current status
    components.typeButton.recent.setAttribute('current', 'true')
    render()
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
  const root = components.listRoot
  if (getters.getType() === 'dir') {
    root.innerHTML = dirHTML
    root.appendChild(components.loading)
    // set list reference to null
    components.list = null
    const ul = root.querySelector('.hmdir_dir_list_section > ul')
    // render for dir
    Object.keys(getters.getDirs()).forEach(dirname => {
      const li = htmlToElement(`<li><i  ></i>${dirname}</li>`)
      ul.appendChild(li)
    })
    return
  }
  let ul
  if (components.list === null) {
    root.innerHTML = ''
    root.appendChild(components.loading)
    // insert ul element
    ul = document.createElement('ul')
    // config list element to components
    components.list = ul
    root.appendChild(components.list)
  } else {
    ul = components.list
  }
  // use fragment to update the list content
  const fragment = document.createDocumentFragment()
  // loop all element in list
  for (let [index, note] of getters.getList().entries()) {
    const li = htmlToElement(`<li><input type="checkbox" data-index="${index}" /><a href="${note.href}" target="_blank">${note.title}</a></li>`)
    fragment.appendChild(li)
  }
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
