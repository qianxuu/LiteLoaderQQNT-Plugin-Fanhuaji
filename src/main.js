const { ipcMain } = require('electron')
const fs = require('fs')
const path = require('path')

function onLoad() {
  // 获取配置
  ipcMain.handle('fanhuaji.getConfig', (_, dataPath) => {
    // 配置文件路径
    const configPath = path.join(dataPath, 'config.json')
    // 配置文件不存在则创建
    if (!fs.existsSync(configPath)) {
      // 配置文件目录不存在则创建
      if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath, { recursive: true })
      }
      // 写入默认配置
      fs.writeFileSync(
        configPath,
        JSON.stringify({
          converter: 'China',
        })
      )
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    return config
  })

  // 修改配置
  ipcMain.handle('fanhuaji.setConfig', (_, dataPath, converter) => {
    // 配置文件路径
    const configPath = path.join(dataPath, 'config.json')
    // 写入配置
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        converter,
      })
    )
  })
}

module.exports = {
  onLoad,
}
