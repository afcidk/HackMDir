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

/* main function */
const main = async function () {
  if (!API.isLoggedIn()) return
  await API.initCache()
  console.log(window.outerWidth)
  const root = document.createElement('div')
  root.classList.add('hmdir_app')
  document.body.appendChild(root)
  // daemon the root component on div
  ReactDOM.render(
    <Provider store={store}>
      <Root />
    </Provider>,
    root
  )
}

main()
