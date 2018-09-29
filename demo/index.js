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
loader1.on('added', function (fileKey) {
  loader1.uploadFile(fileKey)
})
