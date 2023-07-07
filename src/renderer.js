const { getConfig, setConfig } = window.fanhuaji
const { plugin: pluginPath, data: dataPath } = LiteLoader.plugins.fanhuaji.path

const fanhuajiInnerHTML = `
<div class="q-context-menu-item__icon q-context-menu-item__head">
  <img
    class="q-icon"
    src="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAAAAAAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAAAAAAAAAAAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAAAAAAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAAAAAAAAAAD//wAA//8AAAAAAAAAAAAAAAAAAP//AAD//wAAAAAAAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAAAAAAAP//AAD//wAAAAAAAAAAAAAAAAAA//8AAAAAAAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAAAAAAAAAAAAAAAAD//wAA//8AAAAAAAAAAAAAAAAAAP//AAAAAAAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAAAAAAAAAAAAAAAA//8AAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAAAAAAAAAAAAAAAAAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAA//8AAAAAAAAAAAAA//8AAP//AAAAAAAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAAAAAAAAAAAP//AAD//wAAAAAAAAAAAAD//wAA//8AAP//AAAAAAAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAAAAAAAAAAD//wAA//8AAAAAAAAAAAAA//8AAP//AAD//wAAAAAAAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAAAAAAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAICZAACAmQAAnJkAAM6ZAADOmQAAz5kAAOeBAADngQAA85kAALOZAACYmQAAmJkAAICZAAD//wAA//8AAA=="
  />
</div>
<span class="q-context-menu-item__text">繁化姬</span>
`

function onLoad() {
  document.addEventListener('contextmenu', (event) => {
    const { classList, innerText } = event.target
    if (['text-normal', 'message-content', 'msg-content-container'].includes(classList[0])) {
      // 获取右键菜单
      const qContextMenu = document.getElementById('qContextMenu')
      // 插入分隔线
      const separator = document.createElement('div')
      separator.classList.add('q-context-menu-separator')
      separator.setAttribute('role', 'separator')
      qContextMenu.appendChild(separator)
      // 插入繁化姬
      const fanhuaji = document.createElement('a')
      fanhuaji.classList.add('q-context-menu-item', 'q-context-menu-item--normal')
      fanhuaji.setAttribute('aria-disabled', 'false')
      fanhuaji.setAttribute('role', 'menuitem')
      fanhuaji.setAttribute('tabindex', '-1')
      fanhuaji.innerHTML = fanhuajiInnerHTML
      qContextMenu.appendChild(fanhuaji)
      // 调整右键菜单位置
      const rect = qContextMenu.getBoundingClientRect()
      if (rect.bottom > window.innerHeight) {
        qContextMenu.style.top = `${window.innerHeight - rect.height}px`
      }
      // 添加繁化姬点击事件
      fanhuaji.addEventListener('click', () => {
        // 繁化姬转换
        fanhuajiConvert(innerText)
          .then((text) => {
            event.target.innerText = text
          })
          .catch((error) => {
            console.error(error)
          })
        // 关闭右键菜单
        qContextMenu.remove()
      })
    }
  })
}

// 繁化姬转换
const fanhuajiConvert = (text) => {
  return new Promise((resolve, reject) => {
    // 获取配置
    getConfig(dataPath).then((config) => {
      const { converter } = config
      // 调用繁化姬 API
      fetch('https://api.zhconvert.org/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          converter,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          const { code, msg, data } = json
          if (code !== 0) {
            reject(new Error(msg))
          }
          const unconverted = !text.includes('\n\n\n繁化姬：\n')
          if (data.text !== text && unconverted) {
            resolve(`${text}\n\n\n繁化姬：\n${data.text}`)
          }
        })
    })
  })
}

async function onConfigView(view) {
  const htmlFilePath = `file:///${pluginPath}/src/settings/settings.html`
  const cssFilePath = `file:///${pluginPath}/src/settings/settings.css`

  const htmlText = await (await fetch(htmlFilePath)).text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlText, 'text/html')
  doc.querySelectorAll('section').forEach((node) => view.appendChild(node))

  const css = document.createElement('link')
  css.rel = 'stylesheet'
  css.href = cssFilePath
  document.head.appendChild(css)

  const converterSelect = view.querySelector('#converterSelect')

  // 获取配置
  getConfig(dataPath).then((config) => {
    converterSelect.value = config.converter
  })

  // 修改配置
  converterSelect.addEventListener('change', () => {
    setConfig(dataPath, converterSelect.value)
  })
}

export { onLoad, onConfigView }
