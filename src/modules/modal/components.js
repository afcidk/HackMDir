const mutations = require('./store').mutations
const mainHTML = require('./main.html')

const eventBus = require('../eventBus')

const components = {
  root: null,
  title: null,
  context: null,
  input: null,
  button: {
    submit: null,
    cancel: null,
    exit: null
  }
}

const constructor = async function (title, context, input = false) {
  try {
    mutations.setDisplayInput(input)
    components.root = htmlToElement(mainHTML)
    document.body.appendChild(components.root)
    // config all components
    components.title = components.root.querySelector('.hmdir_modal_header_section > h4')
    components.context = components.root.querySelector('.hmdir_modal_main_section > p')
    if (input) {
      components.input = document.createElement('input')
      components.input.setAttribute('type', 'text')
      components.context.parentNode.appendChild(components.input)
    }
    components.button.submit = components.root.querySelector('.hmdir_submit_button')
    components.button.cancel = components.root.querySelector('.hmdir_cancel_button')
    components.button.exit = components.root.querySelector('.hmdir_modal_header_section > button')
    // config button event
    components.button.exit.onclick = function () {
      components.root.style.display = 'none'
    }
    components.button.cancel.onclick = function () {
      components.root.style.display = 'none'
    }
    // subscribe the click event
    eventBus.subscribe('displayNewDirModal', function () {
      components.root.style.display = 'grid'
    })
    render(title, context, input)
    return components.root
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
const render = function (title, context, input) {
  if (components.root === null) {
    components.root = htmlToElement(mainHTML)
  }
  components.title.textContent = title
  components.context.textContent = context
  if (components.input === null && input) {
    components.input = document.createElement('input')
    components.input.setAttribute('type', 'text')
    components.context.parentNode.appendChild(components.input)
  } else if (components.input !== null && input) {
    components.input.value = ''
    components.context.parentNode.appendChild(components.input)
  } else {
    components.context.parentNode.removeNode(components.input)
  }
}

module.exports = {
  ...components,
  initialize: constructor,
  render: render
}
