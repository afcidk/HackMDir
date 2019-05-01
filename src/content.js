/* The section for import style */
require('./style/theme.scss')

/* The section for defination of all variables */
const module = require('./modules')

/* The section for defination of all functions */

/* main function */
const main = async function () {
  if (!('Proxy' in window)) {
    console.warn('Your browser doesn\'t support Proxies.')
    return
  }
  // construct all element to the page
  await module.main.components.initialize()
  const modal = await module.modal.components.initialize('新增資料夾', '輸入新資料夾名稱: ', true)
  modal.style.display = 'none'
}

main()
