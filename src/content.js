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
  const header = document.body.querySelector('.header-wrapper')
  // construct all element to the page
  const root = await module.main.components.initialize()
  header.appendChild(root)
  // use scroll event to check the display of header
  window.addEventListener('scroll', function () {
    if (header.classList.contains('navbar-hide') && module.main.getters.getDisplayRoot()) {
      module.main.components.menuRoot.style.display = 'none'
      module.main.mutations.setDisplay(false)
      module.main.components.button.querySelector('span').innerText = 'Append ►'
    }
  })
  const modal = await module.modal.components.initialize('新增資料夾', '輸入新資料夾名稱: ', true)
  modal.style.display = 'none'
}

main()
