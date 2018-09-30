import { searchParamToString } from './utils'
class Ajax {
  constructor (config) {
    this.config = Object.assign({
      method: 'GET',
      baseUrl: '',
      parseJson: true, // tranform response to JSON when response content-type is 'application/json'
      headers: {}
    }, config)
    this.config.method = this.config.method.toUpperCase()

    this.interceptor = {
      response: {
        use: function (handler, err) {
          this.handler = handler
          this.err = err
        }
      },
      request: {
        handlers: [], // request interceptor can be multiple
        use: function (handler) {
          this.handlers.push(handler)
        }
      }
    }
  }
  request (url, params, options = {}) {
    let _that = this
    let _options = this._merge(this.config, options)
    let _headers = _options.headers
    let _params = Object.assign({}, params)
    let contentType = options.headers['Content-Type'] || ''
    let reqIns = this.interceptor.request.handlers
    let xhr = new XMLHttpRequest()

    // transform post formdata
    if (_options.method === 'POST' && !_options.data && (!contentType || contentType.match(/x-www-form-urlencoded/))) {
      let form = new FormData()
      for (let key in _params) {
        form[key] = _params[key]
      }
      _options.data = form
      _params = {}
    }
    let _url = this._makeUrl(url, _params, _options.baseUrl)
    _options.url = _url

    // excute request interceptor
    reqIns.forEach(h => h instanceof Function && (h(_options)))

    // return this._makeRequest(_url, _options)
    return new Promise((resolve, reject) => {
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return
        let code = xhr.status
        let res = xhr.responseText
        if ((code >= 200 && code < 300) || code === 304) {
          if (_that.config.parseJson && xhr.responseType.match(/application\/json/)) {
            res = JSON.parse(res)
          }
          resolve({ code, data: res })
        } else {
          reject(new Error({ code, err: res }))
        }
      }
      xhr.open(_options.method, _url, true)
      if (_headers) {
        for (let key in _headers) {
          // some header fileds are readonly
          try {
            xhr.setRequestHeader(key, _headers[key])
          } catch (e) {}
        }
      }
      xhr.send(_options.method === 'GET' ? null : _options.data)
    })
  }
  _makeUrl (url, params, baseUrl) {
    let _url = url.trim()
    let _paramsUrl = ''
    if (params && Object.keys(params).length > 0) {
      _paramsUrl = '?' + searchParamToString(params)
    }
    if (_url.startWith('http') || !baseUrl) return _url + _paramsUrl

    if (_url.startWith('/')) _url = _url.slice(1)
    if (!baseUrl.endsWith('/')) baseUrl += '/'

    return baseUrl + _url + _paramsUrl
  }
  _merge (a, b) {
    let obj = Object.assign({}, a)
    for (let key in b) {
      if (b[key] instanceof Object && a[key] instanceof Object) {
        obj[key] = this._merge(a[key], b[key])
      } else {
        obj[key] = b[key]
      }
    }
    return obj
  }
}
// let global = new Ajax()
module.exports = Ajax
