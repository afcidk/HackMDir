/* The section for import style */
require('./style/theme.scss')

/* The section for defination of all variables */
const store = require('./store')

/* The section for defination of all functions */

/* main function */
const main = async function () {
  if (!('Proxy' in window)) {
    console.warn('Your browser doesn\'t support Proxies.')
    return
  }
  // construct all element to the page
  await store.ui.constructor()
}

main()