import './index.scss'
import Uploader from '../index'

let target = document.getElementById('file-input')
let loader1 = new Uploader({
  target,
  trunkSize: 2 * 1024 * 1024,
  Nouce: 16,
  AppKey: '2f2a7935c3a5412a9a31be60924927f6',
  CheckSum: 'e3e847f6a0d7c8d9a78c43a2bbe6d1d91db83acd'
})
loader1.on('added', function (fileKey) {
  loader1.uploadFile(fileKey)
})
