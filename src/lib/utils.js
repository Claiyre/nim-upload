
/**
 * 用js对象构造URL查询参数
 * @param {Object} obj
 */
function searchParamToString (obj) {
  let str = ''
  Object.keys(obj).forEach(item => {
    str += encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]) + '&'
  })
  str = str.slice(0, str.length - 1)
  return str
}

export {
  searchParamToString
}
