
import Handlers from './handlers'
const h = new Handlers()
/**
 * check Uploader class param, if not pass, throw errors
 * @method checkParams
 * @param param the param  of Uploader constructor
 */

function checkParams () {
  let { target, trunkSize } = this.options
  if (
    !(target instanceof Array && target.every(item => item instanceof File)) &&
    !(target.nodeName === 'INPUT' && target.type === 'file') &&
    !(target instanceof File)
  ) {
    h.onError(new Error(`param.target can only be file input dom, File object or File object array. Not ${target}`))
  }
  try {
    trunkSize = parseInt(trunkSize)
    if (trunkSize < 0 || trunkSize > 4 * 1024 * 1024) {
      h.onError(new Error(`param.trunkSize can be an integer less than 4*1024*1024 and greater than 0`))
    }
  } catch (e) {
    h.onError(e)
  }
}

export default checkParams
