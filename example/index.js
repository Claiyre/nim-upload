import './index.scss'

let input = document.getElementById('file-input')
input.onchange = (e) => {
  log(e)
  log(input.files)
}
document.getElementsByTagName('button')[0].onclick = function (e) {
  log(e)
}

function log () {
  console.log.apply(null, arguments)
}
