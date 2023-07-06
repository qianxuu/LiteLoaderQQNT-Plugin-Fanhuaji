const { ipcMain } = require('electron')
const axios = require('axios')

function onLoad() {
  // 繁化姬转换
  ipcMain.handle('fanhuaji.convert', async (_, text) => {
    const res = await covert(text)
    return res
  })
}

// 调用繁化姬 API 进行转换
function covert(text) {
  return new Promise((resolve, reject) => {
    axios
      .get('https://api.zhconvert.org/convert', {
        params: {
          text,
          converter: 'China',
        },
      })
      .then((res) => {
        const { code, msg, data } = res.data
        if (code !== 0) {
          reject(msg)
        }
        resolve(data.text)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = {
  onLoad,
}
