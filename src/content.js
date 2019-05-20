import React from 'react'
import ReactDOM from 'react-dom'
import Root from './app/Root.js'

import './style/theme.scss'

/* main function */
const main = async function () {
  console.log(window.outerWidth)
  const root = document.createElement('div')
  root.classList.add('hmdir_app')
  document.body.appendChild(root)
  // daemon the root component on div
  ReactDOM.render(<Root />, root)
}

main()
