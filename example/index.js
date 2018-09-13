import './index.scss'
// import Uploader from '../src/index'
let input = document.getElementById('file-input')
console.log(input.nodeType)
console.log(input.type)
console.log(input.nodeName)
input.onchange = (e) => {
  console.log(e.target.files[0] instanceof File)
  console.log(input.files[0].slice(0, 100) instanceof File)
  console.log(input.files[0].slice(0, 100) instanceof Blob)
  console.log(input.files[0].slice(0, 100))
}

// let loader = new Uploader()
function addAge (target) {
  target.prototype.age = 10
}

@addAge
class Test {
  constructor (name) {
    this.name = name
    return false
  }
  setName (name) {
    this.name = name
  }
  getName () {
    this.setName('world')
    return this.name
  }
}

let test = new Test('claiyre')
let test2 = new Test('claiyre2')

console.log(test2.age)
console.log(test2.getName())
console.log(test)
