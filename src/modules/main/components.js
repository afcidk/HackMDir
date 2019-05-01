const API = require('../../../api.js')
const mutations = require('./store.js').mutations
const getters = require('./store.js').getters

const components = {
  button: null,
  root: null,
  grid: null,
  list: null,
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
    const grid = document.createElement('section')
    grid.classList.add('hmdir_grid_section')
    root.appendChild(grid)
    components.grid = grid
    // append type button to the root
    const tabContainer = document.createElement('div')
    tabContainer.classList.add('hmdir_tab_root')
    const type = ['Recent', 'Personal', 'Dir']
    type.forEach(target => {
      const button = document.createElement('button')
      button.classList.add('hmdir_type_button')
      button.textContent = target
      tabContainer.appendChild(button)
      // config type button reference to the components
      components.typeButton[target.toLocaleLowerCase()] = button
      // config tab switch event
      button.onclick = async function () {
        try {
          mutations.setType(target.toLocaleLowerCase())
          if (target === 'Recent') {
            mutations.setList(await API.getHistory())
          } else if (target === 'Personal') {
            mutations.setList(await API.getNote())
          } else if (target === 'Dir') {
            // TODO: fetch dir infomation and set list
          }
          render()
        } catch (error) {
          console.log(error)
        }
      }
    })
    grid.appendChild(tabContainer)
    // add button click event to display the root
    button.onclick = function () {
      mutations.setDisplay(!getters.getDisplayRoot())
      root.style.display = getters.getDisplayRoot() ? 'block' : 'none'
      button.style.left = getters.getDisplayRoot() ? '180px' : '10px'
      button.style.transform = getters.getDisplayRoot() ? 'scaleX(-1)' : 'scaleX(1)'
    }
    mutations.setList(await API.getHistory())
    // append list container
    const div = document.createElement('div')
    div.classList.add('hmdir_list_root')
    grid.appendChild(div)
    render()

    window.onload = () => {
      // alert('load')
      const noteList = document.querySelectorAll('.item')
      noteList.forEach((element) => {
        element.draggable = true
        element.ondragstart = (event) => {
          event.stopPropagation()
          while (element.tagName.toLocaleLowerCase() !== 'a') {
            element = element.parentNode
          }
          event.dataTransfer.setData('items', element.href)
          console.log(element)
        }
      })
    }
    const dropZone = document.querySelector('.hmdir_grid_section')

    dropZone.ondragover = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    dropZone.ondrop = (event) => {
      const li = document.createElement('li')
      const aTag = document.createElement('a')
      aTag.href = event.dataTransfer.getData('items')
      aTag.target = '_blank'
      aTag.text = 'temp'
      li.appendChild(aTag)
      root.querySelector('.hmdir_list_root').childNodes[0].appendChild(li)
      console.log(event.dataTransfer)
    }
  } catch (error) {
    console.log(error)
  }
}

// the render function to update the screen
const render = function () {
  const root = components.grid
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
  console.log(root)
  root.querySelector('.hmdir_list_root').replaceChild(temp, components.list)
  // update components list reference
  components.list = temp
}

module.exports = {
  ...components,
  initialize: constructor,
  render: render
}
