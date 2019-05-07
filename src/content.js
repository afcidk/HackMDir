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
  // use mutation observe to detect the note's availability if thr url is in '/'
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
        console.log(element)
      }
    })
  }
}

main()
