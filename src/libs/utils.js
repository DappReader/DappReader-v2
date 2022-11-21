 /* eslint-disable */ 
export const throttle = (fn, wait) => {
  let callback = fn
  let timerId = null
  let firstInvoke = true
  const throttled = () => {
    let context = this
    let args = arguments
    if (firstInvoke) {
      callback.apply(context, args)
      firstInvoke = false
      return
    }     
    if (timerId) {
      return
    }
    timerId = setTimeout(() => {
      clearTimeout(timerId)
      timerId = null
      callback.apply(context, args)
    }, wait)
  }
  return throttled
}

export const formatDate = (fmt, date) => {
  let ret
  date = new Date(date)
  let opt = {
    'Y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'M+': date.getMinutes().toString(),
    'S+': date.getSeconds().toString()
  };
  for (let k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

export const formatAddress = (address) => {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''
}