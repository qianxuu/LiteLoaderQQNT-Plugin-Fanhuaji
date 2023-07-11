const { getConfig, setConfig } = window.fanhuaji
const { plugin: pluginPath, data: dataPath } = LiteLoader.plugins.fanhuaji.path

const separatorHTML = `
<div class="q-context-menu-separator" role="separator"></div>
`
const fanhuajiInnerHTML = `
<a
  id="fanhuaji"
  class="q-context-menu-item q-context-menu-item--normal"
  aria-disabled="false"
  role="menuitem"
  tabindex="-1"
>
  <div class="q-context-menu-item__icon q-context-menu-item__head">
    <img
      src="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAAAAAAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAAAAAAAAAAAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAAAAAAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAAAAAAAAAAD//wAA//8AAAAAAAAAAAAAAAAAAP//AAD//wAAAAAAAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAAAAAAAP//AAD//wAAAAAAAAAAAAAAAAAA//8AAAAAAAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAAAAAAAAAAAAAAAAD//wAA//8AAAAAAAAAAAAAAAAAAP//AAAAAAAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAAAAAAAAAAAAAAAA//8AAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAAAAAAAAAAAAAAAAAAAAAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAAAAAAAAAAAAAAAAAAAAAAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAAAAAAAAAAAAAAAAAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAA//8AAAAAAAAAAAAA//8AAP//AAAAAAAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAAAAAAAAAAAP//AAD//wAAAAAAAAAAAAD//wAA//8AAP//AAAAAAAAAP8AAAD/AAAAAAAAAAAAAAD/AAAA/wAAAAAAAAAAAAD//wAA//8AAAAAAAAAAAAA//8AAP//AAD//wAAAAAAAAD/AAAA/wAAAAAAAAAAAAAA/wAAAP8AAAAAAAAAAAAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAAAAAAAA/wAAAP8AAAAAAAAAAAAAAP8AAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAICZAACAmQAAnJkAAM6ZAADOmQAAz5kAAOeBAADngQAA85kAALOZAACYmQAAmJkAAICZAAD//wAA//8AAA=="
    />
  </div>
  <span class="q-context-menu-item__text">繁化姬</span>
</a>
`

function onLoad() {
  document.addEventListener('contextmenu', (event) => {
    const { target } = event
    const { classList, innerText } = target
    if (['text-normal', 'message-content', 'msg-content-container'].includes(classList[0])) {
      // 获取右键菜单
      const qContextMenu = document.querySelector('#qContextMenu')
      // 插入分隔线
      qContextMenu.insertAdjacentHTML('beforeend', separatorHTML)
      // 插入繁化姬
      qContextMenu.insertAdjacentHTML('beforeend', fanhuajiInnerHTML)
      // 调整右键菜单位置
      const rect = qContextMenu.getBoundingClientRect()
      if (rect.bottom > window.innerHeight) {
        qContextMenu.style.top = `${window.innerHeight - rect.height}px`
      }
      // 监听繁化姬点击
      const fanhuaji = qContextMenu.querySelector('#fanhuaji')
      fanhuaji.addEventListener('click', () => {
        // 繁化姬转换
        const textNormal = target.querySelector('.text-normal')
        fanhuajiConvert(textNormal ? textNormal.innerText : innerText)
          .then((text) => {
            if (textNormal) {
              textNormal.innerText = text
              return
            }
            target.innerText = text
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
            // 去除前后空格换行
            data.text = data.text.replace(/^\s+|\s+$/g, '')
            resolve(`${text}\n\n\n繁化姬：\n${data.text}`)
          }
        })
    })
  })
}

async function onConfigView(view) {
  // 获取设置页文件路径
  const htmlFilePath = `file:///${pluginPath}/src/setting/setting.html`
  const cssFilePath = `file:///${pluginPath}/src/setting/setting.css`
  // 插入设置页
  const htmlText = await (await fetch(htmlFilePath)).text()
  view.insertAdjacentHTML('afterbegin', htmlText)
  // 插入设置页样式
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = cssFilePath
  document.head.appendChild(link)

  const converterSelect = view.querySelector('#converterSelect')

  // 获取配置
  getConfig(dataPath).then((config) => {
    converterSelect.value = config.converter
  })

  // 监听选择器变化
  converterSelect.addEventListener('change', () => {
    // 修改配置
    setConfig(dataPath, converterSelect.value)
  })
}

export { onLoad, onConfigView }
