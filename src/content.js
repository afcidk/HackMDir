import React from 'react'
import ReactDOM from 'react-dom'
import Root from './app/Root.js'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducers from './app/redux/reducers'
import API from './api/api.js'

import './style/theme.scss'

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

window.__HMDIR = {
  display: false,
  root: null,
  mousemoving: false,
  mousePrevX: 0
}

/* main function */
const main = async function () {
  if (!API.isLoggedIn()) return

  const handleLoad = function () {
    const notelist = document.querySelectorAll('.item')
    notelist.forEach((element) => {
      element.draggable = true
      element.ondragstart = (event) => {
        event.stopPropagation()
        while (element.tagName.toLocaleLowerCase() !== 'a') {
          element = element.parentNode
        }
        event.dataTransfer.setData('href', element.href)
        const text = element.querySelectorAll('.text')
        event.dataTransfer.setData('name', text[0].innerText)
      }
    })
  }
  window.addEventListener('load', handleLoad)

  await API.initCache()
  // daemon the root component on root div
  const root = document.createElement('div')
  root.classList.add('hmdir_app')
  document.body.appendChild(root)
  root.setAttribute('data-display', 'false')
  window.__HMDIR.root = root
  ReactDOM.render(
    <Provider store={store}>
      <Root />
    </Provider>,
    root
  )
  const mousemoveHandler = function (event) {
    clearTimeout(window.__HMDIR.mousemoving)
    window.__HMDIR.mousemoving = setTimeout(function () {
      if (event.clientX < 300) {
        window.__HMDIR.display = true
        window.__HMDIR.root.focus()
        document.removeEventListener('mousemove', mousemoveHandler)
      }
    }, 100)
  }
  document.addEventListener('mousemove', mousemoveHandler)
  // if (process.env.NODE_ENV !== 'production') {
  //   const { whyDidYouUpdate } = require('why-did-you-update')
  //   whyDidYouUpdate(React, { groupByComponent: true, collapseComponentGroups: true })
  // }
}

main()
