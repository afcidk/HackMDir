const components = {
  input: null,
  button: {
    submit: null,
    cancel: null
  }
}

const constructor = async function (title, input = false) {
  try {
    render()
  } catch (error) {
    console.log(error)
  }
}

// the render function to update the screen
const render = function () {
}

module.exports = {
  ...components,
  initialize: constructor,
  render: render
}
