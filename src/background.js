// import store from './store'
import { sendMessageToContentScript, captureVisibleTab } from './common'

//-------------------- 右键菜单演示 ------------------------//
chrome.contextMenus.create({
  title: '页面取色器',
  id: 'color-picker-Menus-1'
})

chrome.contextMenus.onClicked.addListener(function(info) {
  if (info.menuItemId == 'color-picker-Menus-1') {
    captureVisibleTab().then(image => {
      sendMessageToContentScript(
        { cmd: 'color-picker-open', data: { src: image } },
        function(/* eslint-disable */ response) {
                  console.log('-----发送 color-picker-open')
              }
          )
      })
  }
})

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('收到来自content-script的消息：')
  console.log(request, sender, sendResponse)
  if (request.cmd === 'color-picker-cache-set') {
    const { key, value } = request.data
    localStorage.setItem(key, value)
    sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request))
    return
  }
  if (request.cmd === 'color-picker-cache-get') {
    const { key } = request.data
    const value = localStorage.getItem(key)
    sendResponse(value)
    return
  }

})
