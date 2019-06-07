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
  // use observer to observe the dom injection
  if (window.location.href === 'https://hackmd.io/') {
    const observer = new window.MutationObserver(function (mutations) {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          const noteList = document.querySelectorAll('.item')
          console.log(noteList)
          noteList.forEach((element) => {
            element.draggable = true
            element.ondragstart = (event) => {
              event.stopPropagation()
              while (element.tagName.toLocaleLowerCase() !== 'a') {
                element = element.parentNode
              }
              const title = element.querySelector('.text').textContent
              event.dataTransfer.setData('href', element.href)
              event.dataTransfer.setData('title', title)
            }
          })
          observer.disconnect()
        }
      })
    })
    // observe only child list
    observer.observe(document.body.querySelector('#overview-page > div'), {
      attributes: false,
      childList: true,
      characterData: false
    })
  }
  // directly add drag attribute if thr url is in '/recent'
  if (window.location.href === 'https://hackmd.io/recent') {
    const noteList = document.querySelectorAll('.item')
    console.log(noteList)
    noteList.forEach((element) => {
      element.draggable = true
      element.ondragstart = (event) => {
        event.stopPropagation()
        while (element.tagName.toLocaleLowerCase() !== 'a') {
          element = element.parentNode
        }
        const title = element.querySelector('.text').textContent
        event.dataTransfer.setData('href', element.href)
        event.dataTransfer.setData('title', title)
      }
    })
  }

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
      if (event.clientX < 300 && event.clientY > 60) {
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
