import './index.scss'

const Uploader = require('../src/index')
let target = document.getElementById('file-input')
let loader1 = new Uploader({
  target,
  trunkSize: 2 * 1024 * 1024,
  Nonce: 585821224,
  AppKey: 'c60e8d10b3714ab4a59c8f1bb0b696ef',
  CheckSum: '3395b9c2aead4100db49ae8554810b531a37f60c',
  CurTime: 1538209579
})
let box = document.getElementById('box')
loader1.on('added', function (fileKey) {
  loader1.uploadFile(fileKey)
  addMsg(loader1.findFile(fileKey).fileName, '开始上传')
})
loader1.on('uploaded', function (fileKey) {
  console.log('file upload done: ', loader1.findFile(fileKey))
  addMsg(loader1.findFile(fileKey).fileName, '上传完成')
})
loader1.on('progress', function (p, fileKey) {
  console.log('uploading, progress: ', p * 100 + '%')
  addMsg(loader1.findFile(fileKey).fileName, '上传进度：' + p * 100 + '%')
})

function addMsg (name, msg) {
  let p = document.createElement('p')
  p.innerHTML = `<span style="color: green">${name}</span> ${msg}`
  box.appendChild(p)
}
