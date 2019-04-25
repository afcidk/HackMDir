/* The section for import style */
const style = require('./style/theme.scss')

/* The section for defination of all variables */
const store = require('./store')

/* The section for defination of all functions */

const showDetail = function () {
  // remove the root element when the root exist
  if (store.ui.displayRoot) {
    const root = document.body.querySelector('.hmdir_root')
    root.remove()
    store.ui.displayRoot = false
    return
  }
  const root = document.createElement('div')
  root.classList.add('hmdir_root')
  root.style.cssText = 'background-color: rgba(255, 255, 255, 0.8); position: absolute; z-index: 998; height: 1000px; width: 300px; top: 0px;'

  document.body.appendChild(root)
  store.ui.displayRoot = true
}

/* main function */
const main = function () {
  // initialize the operation button
  const button = document.createElement('button')
  button.id = 'hmdir_operation_button'
  button.classList.add('hmdir_operation_button')
  document.body.appendChild(button)
  document.getElementById('hmdir_operation_button').onclick = function () {
    showDetail()
  }
}

main()
