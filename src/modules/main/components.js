const mainHTML = require('./main.html')
const mutations = require('./store.js').mutations
const getters = require('./store.js').getters

const dirTabComponent = require('../dirTab')
const recentTabComponent = require('../recentTab')

const components = {
  button: null,
  root: null,
  menuRoot: null,
  grid: null,
  contentSlot: null,
  typeButton: {
    recent: null,
    personal: null,
    dir: null
  },
  recentTab: null,
  personalTab: null,
  dirTab: null
}

const constructor = async function () {
  try {
    const status = true// await API.isLoggedIn()
    mutations.setLoginStatus(status)
    if (!status) {
      return
    }
    // append root div to the page
    const root = document.createElement('div')
    root.classList.add('hmdir_root')
    // initialize the display button
    const buttonHTML = `<button class="hmdir_display_button"><span>Append ►</span></button>`
    const button = htmlToElement(buttonHTML)
    root.appendChild(htmlToElement(mainHTML))
    root.appendChild(button)
    // get the reference of all element
    this.root = root
    this.menuRoot = root.querySelector('.hmdir_menu_root')
    this.menuRoot.style.display = 'none'
    this.button = button
    this.grid = this.menuRoot.querySelector('.hmdir_grid_section')
    this.typeButton.recent = this.menuRoot.querySelector('.hmdir_type_button:nth-child(1)')
    this.typeButton.personal = this.menuRoot.querySelector('.hmdir_type_button:nth-child(2)')
    this.typeButton.dir = this.menuRoot.querySelector('.hmdir_type_button:nth-child(3)')
    this.contentSlot = this.menuRoot.querySelector('.hmdir_content_container')
    this.dirTab = await dirTabComponent.components.initialize()
    this.recentTab = await recentTabComponent.components.initialize()
    // append the recent to the content slot
    recentTabComponent.mutations.setDisplay(false)
    this.contentSlot.appendChild(this.recentTab)
    // set recent current status
    this.typeButton.recent.setAttribute('current', 'true')
    // TODO: get dir list
    // add button click event to display the root
    button.onclick = function () {
      mutations.setDisplay(!getters.getDisplayRoot())
      this.menuRoot.style.display = getters.getDisplayRoot() ? 'block' : 'none'
      this.button.childNodes[0].innerText = getters.getDisplayRoot() ? 'Close ◄' : 'Append ►'
    }.bind(this)
    // config type button event
    Object.keys(this.typeButton).forEach(key => {
      const button = this.typeButton[key]
      button.onclick = async function () {
        this.typeButton.recent.removeAttribute('current')
        this.typeButton.personal.removeAttribute('current')
        this.typeButton.dir.removeAttribute('current')
        this.typeButton[key].setAttribute('current', 'true')
        try {
          mutations.setType(key)
          this.render()
        } catch (error) {
          console.log(error)
        }
      }.bind(this)
    })

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
    const dropZone = this.root.querySelector('.hmdir_grid_section')

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
  while (this.contentSlot.firstChild) {
    this.contentSlot.firstChild.remove()
  }
  switch (getters.getType()) {
    case 'recent':
      recentTabComponent.components.render()
      recentTabComponent.mutations.setDisplay(true)
      // personalTabComponent.mutations.setDisplay(false)
      dirTabComponent.mutations.setDisplay(false)
      this.contentSlot.appendChild(this.recentTab)
      break
    case 'personal':
      // personalTabComponent.compnoents.redner()
      recentTabComponent.mutations.setDisplay(false)
      // personalTabComponent.mutations.setDisplay(true)
      dirTabComponent.mutations.setDisplay(false)
      // this.contentSlot.appendChild(this.personalTab)
      break
    case 'dir':
      dirTabComponent.components.render()
      recentTabComponent.mutations.setDisplay(false)
      // personalTabComponent.mutations.setDisplay(false)
      dirTabComponent.mutations.setDisplay(true)
      this.contentSlot.appendChild(this.dirTab)
      break
  }
}

module.exports = {
  ...components,
  initialize: constructor,
  render: render
}
