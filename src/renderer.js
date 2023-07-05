function onLoad() {
  document.addEventListener('contextmenu', (event) => {
    if (event.target.className === 'text-normal') {
      const qContextMenu = document.getElementById('qContextMenu')

      // 插入分隔线
      const separator = document.createElement('div')
      separator.classList.add('q-context-menu-separator')
      separator.role = 'separator'
      qContextMenu.appendChild(separator)
      // 插入菜单项
      const fanhuaji = document.createElement('a')
      fanhuaji.classList.add('q-context-menu-item', 'q-context-menu-item--normal')
      fanhuaji.setAttribute('aria-disabled', 'false')
      fanhuaji.setAttribute('role', 'menuitem')
      fanhuaji.setAttribute('tabindex', '-1')
      // 插入图标
      const icon = document.createElement('div')
      icon.classList.add('q-context-menu-item__icon', 'q-context-menu-item__head')
      const img = document.createElement('img')
      img.classList.add('q-icon')
      window.fanhuaji.icon().then((res) => {
        img.setAttribute('src', res)
      })
      icon.appendChild(img)
      fanhuaji.appendChild(icon)
      // 插入文本
      const text = document.createElement('span')
      text.classList.add('q-context-menu-item__text')
      text.textContent = '繁化姬'
      fanhuaji.appendChild(text)
      qContextMenu.appendChild(fanhuaji)
      // 调整菜单位置
      const rect = qContextMenu.getBoundingClientRect()
      if (rect.bottom > window.innerHeight) {
        qContextMenu.style.top = `${window.innerHeight - rect.height}px`
      }

      // 添加繁化姬点击事件
      fanhuaji.addEventListener('click', () => {
        // 繁化姬转换
        window.fanhuaji.convert(event.target.innerText).then((res) => {
          if (res !== event.target.innerText) {
            event.target.innerText = `${event.target.innerText}\n\n\n繁化姬：\n${res}`
          }
        })
        // 关闭右键菜单
        qContextMenu.style.display = 'none'
      })
    }
  })
}

export { onLoad }
