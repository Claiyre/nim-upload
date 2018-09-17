
/**
 * check Uploader class param, if not pass, throw errors
 * @method checkParams
 * @param param the param  of Uploader constructor
 */

function checkParams (param, error) {
  if (this.target.type !== 'file') {
    error(new Error(`param.target cam only be file input dom, File object or File object array. Not ${this.target}`))
  }
}

export default checkParams
