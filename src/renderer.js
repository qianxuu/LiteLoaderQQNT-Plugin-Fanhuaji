const { getConfig, setConfig } = window.fanhuaji
const { plugin: pluginPath, data: dataPath } = LiteLoader.plugins.fanhuaji.path

const SEPARATOR_HTML = `
<div class="q-context-menu-separator" role="separator"></div>
`
const FANHUAJI_HTML = `
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

const onLoad = () => {
  document.addEventListener('contextmenu', (event) => {
    const { target } = event
    const { classList } = target
    if (['text-normal', 'message-content', 'msg-content-container'].includes(classList[0])) {
      // 获取右键菜单
      const qContextMenu = document.querySelector('#qContextMenu')
      // 插入分隔线
      qContextMenu.insertAdjacentHTML('beforeend', SEPARATOR_HTML)
      // 插入繁化姬
      qContextMenu.insertAdjacentHTML('beforeend', FANHUAJI_HTML)
      // 调整右键菜单位置
      const rect = qContextMenu.getBoundingClientRect()
      if (rect.bottom > window.innerHeight) {
        qContextMenu.style.top = `${window.innerHeight - rect.height - 8}px`
      }
      // 监听繁化姬点击
      const fanhuaji = qContextMenu.querySelector('#fanhuaji')
      fanhuaji.addEventListener('click', () => {
        // 获取最里层元素
        const textNormal = target.querySelector('.text-normal')
        const targetElement = textNormal ? textNormal : target
        // 判断是否转换过
        const unconverted = !targetElement.innerText.includes('\n\n\n繁化姬：\n')
        if (unconverted) {
          const { innerText: rawText } = targetElement
          // 添加转换中提示
          targetElement.innerText = `${rawText}\n\n\n繁化姬：\n转换中...`
          // 繁化姬转换
          fanhuajiConvert(rawText)
            .then((text) => {
              targetElement.innerText = `${rawText}\n\n\n繁化姬：\n${text}`
            })
            .catch((error) => {
              targetElement.innerText = `${rawText}\n\n\n繁化姬：\n转换失败！`
              console.error(error)
            })
        }
        // 关闭右键菜单
        qContextMenu.remove()
      })
    }
  })
}

const onConfigView = async (view) => {
  // 获取设置页文件路径
  const htmlFilePath = `llqqnt://local-file/${pluginPath}/src/setting/setting.html`
  const cssFilePath = `llqqnt://local-file/${pluginPath}/src/setting/setting.css`
  // 插入设置页
  const htmlText = await (await fetch(htmlFilePath)).text()
  view.insertAdjacentHTML('afterbegin', htmlText)
  // 插入设置页样式
  document.head.insertAdjacentHTML('beforeend', `<link rel="stylesheet" href="${cssFilePath}" />`)

  // 获取转换器选择器
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
          // 去除前后空白字符
          data.text = data.text.replace(/^\s+|\s+$/g, '')
          resolve(data.text)
        })
        .catch((error) => {
          reject(error)
        })
    })
  })
}

export { onLoad, onConfigView }
