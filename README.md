# nim-upload

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A helpful library for uploading files on web.

## Features

- web文件上传
- 断点续传
- 文件状态管理
- 云信点播上传流程封装
- 点播上传接口鉴权

## Installation

```javascript
npm install nim-uploader --save
// or
<script src="..../uploader.js"></script>
// or
<script src="..../uploader.min.js"></script>
```

## Usage

```javascript
import Uploader from 'nim-uploader'

let loader = new Uploader({
  target: 'xxx',  // required, File对象/File对象数组/FileList/Input[type='file'] DOM
  trunkSize: 4*1024*1024, // 分片大小
  fileExts: [],  // 可接受的文件类型数组
  Nouce: 'xxx', // 用于接口鉴权，只有Nouce, AppKey, CheckSum都传入时，才会进行接口鉴权
  AppKey: 'xxx',
  CheckSum: 'xxx',
  onError/onAdded/onProgress/onUploaded/onFileTypeNotMatch: Function  // 事件监听函数，初始化后也可通过 instance.on('error', handler)添加
})
```

### attr

- `loader.fileList`: `Array`, 由富文件对象组成的数组
- `loader.trunksize`: `{Number}` 分片大小，最大4M，默认为4M
- `loader.fileExts`: `Array` 可接受的文件类型数组， 默认接受所有类型的文件

### api

- `loader.uploadFile(fileKey)`: 上传文件
- `loader.uploadAll()`: 上传 `fileList` 中的所有文件
- `loader.addFile(param)`: 向`fileList` 中添加文件， param可以是File/FileList/File数组
- `loader.removeFile(fileKey)`: 从 `fileList` 中移除某文件

其中`uploadFile`, `uploadAll`可以继续传入两个函数参数，作为上传成功和失败的回调，也可不传，返回Promise对象

### event Listener

- `onError(err)`: 发生错误时调用
- `onAdded(fileKey)`: 文件添加到`fileList`中调用
- `onProgress(p)`: 上传进度变化时调用 `p`是小数（保留四位）
- `onUploaded(fileKey)`: 文件上传完成后调用
- `onAllUploaded(fileKeyArr)`: 文件批量上传成功后调用
- `onFileTypeNotMatch(format)`: 上传文件类型不匹配时调用（仅当 `fileExts` 被指定时才可能会触发）

event listener 可以在实例初始化时添加，如：

```javascript
let uploader = new Uploader({
  // 其他参数
  onError: function (err) { console.error(err) },
  onAdded: function (fileKey) { // ...  }
})
```

也可在初始化后通过`on`方法添加:

```javascript
uploader.on('allUploaded', function(fileKeyArr) {
  // ...
})
```

## Todo

test
