import './index.scss'
import axios from 'axios'
import fly from 'flyio'

fly.get('http://wanproxy.127.net/lbs', {
  version: '1.0',
  bucketname: 'vod0j9f7jwb'
}).then(res => console.log('res', res))
  .catch(err => console.log(err))

let xhr = new XMLHttpRequest()
xhr.onreadystatechange = function () {
  if (xhr.readyState !== 4) {
    return
  }
  let result
  try {
    result = JSON.parse(xhr.responseText)
  } catch (e) {
    result = {
      errCode: 500,
      errMsg: '未知错误'
    }
  }
  console.log('---', result)
}
xhr.open('get', 'http://wanproxy.127.net/lbs?version=1.0&bucketname=vod0j9f7jwb&version=1.0&bucketname=vod0j9f7jwb')
xhr.send(null)

// const Uploader = require('../src/index')
// console.log(Uploader)
// let target = document.getElementById('file-input')
// let loader1 = new Uploader({
//   target,
//   trunkSize: 2 * 1024 * 1024,
//   Nonce: 553238753,
//   AppKey: 'c60e8d10b3714ab4a59c8f1bb0b696ef',
//   CheckSum: 'd84937d4f9d9c2d1e0466d739a6619904721ff17',
//   CurTime: 1537946424
// })
// loader1.on('added', function (fileKey) {
//   loader1.uploadFile(fileKey)
// })
