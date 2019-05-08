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
    const htmlString = `<li data-dirname="${dirname}"><i></i><a>${dirname} (${dirs[dirname].length})</a><input type="checkbox"/><div class="hmdir_subdir_root" style="display: none;"><ul></ul></div></li>`
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
    for (let [index, note] of dirs[dirname].entries()) {
      const htmlString = `<li><a href="${note.href}" target="_blank">${note.title}</a> <input type="checkbox" data-index="${index}" data-dirname="${dirname}"/></li>`
      const noteDOM = htmlToElement(htmlString)
      subFragment.appendChild(noteDOM)
    }
    subList.appendChild(subFragment)
    // config click event at folder checkbox
    const folderCheckbox = li.querySelector(':scope > input')
    const noteCheckboxs = Object.values(subList.querySelectorAll('input'))
    const operationButton = Object.values(document.getElementsByClassName('hmdir_operation_button'))
    folderCheckbox.addEventListener('click', function () {
      noteCheckboxs.forEach(checkbox => {
        checkbox.checked = folderCheckbox.checked
      })
    })
    noteCheckboxs.forEach(checkbox => {
      checkbox.addEventListener('click', function () {
        if (checkbox.checked) {
          mutations.addTempRemoved(dirname, checkbox.getAttribute('data-index'))
        } else {
          mutations.removeTempRemoved(dirname, checkbox.getAttribute('data-index'))
        }
        let count = 0
        for (let i = 0; i < noteCheckboxs.length; ++i) {
          count = count + (noteCheckboxs[i].checked ? 1 : 0)
        }
        folderCheckbox.checked = count === noteCheckboxs.length
      })
    })
    // check if there is a checkbox checked
    const allCheckbox = [...noteCheckboxs, folderCheckbox]
    allCheckbox.forEach(checkbox => {
      checkbox.addEventListener('click', function () {
        let flag = false
        allCheckbox.forEach(checkbox => {
          if (checkbox.checked) {
            flag = true
          }
        })
        if (flag) {
          operationButton.forEach(button => {
            button.classList.add('active')
          })
        } else {
          operationButton.forEach(button => {
            button.classList.remove('active')
          })
        }
      })
    })
    if (getters.getTempRemoved().length === 0) {
      document.getElementById('permission_block').style.display = 'none'
    }
    fragment.appendChild(li)
  })
  ul.innerHTML = ''
  ul.appendChild(fragment)
  // config all folder li as drag zone
  const folders = ul.querySelectorAll(':scope > li')
  for (let i = 0; i < folders.length; ++i) {
    console.log(folders[i])
    folders[i].addEventListener('dragover', function (event) {
      event.preventDefault()
      event.stopPropagation()
      let element = event.target
      while (element.tagName.toLocaleLowerCase() !== 'li') {
        element = element.parentNode
      }
      element.classList.add('active')
    })
    folders[i].addEventListener('dragleave', function (event) {
      console.log(event.target)
      event.preventDefault()
      event.stopPropagation()
      let element = event.target
      while (element.tagName.toLocaleLowerCase() !== 'li') {
        element = element.parentNode
      }
      element.classList.remove('active')
    })
    folders[i].addEventListener('drop', function (event) {
      let element = event.target
      while (element.tagName.toLocaleLowerCase() !== 'li') {
        element = element.parentNode
      }
      const key = element.getAttribute('data-dirname')
      mutations.addNoteToDir(key, {
        title: event.dataTransfer.getData('title'),
        href: event.dataTransfer.getData('href')
      })
      this.render()
    }.bind(this))
  }
}

module.exports = {
  ...components,
  initialize: constructor,
  render: render
}
