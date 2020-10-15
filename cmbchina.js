const cookieName = '招商银行'
const cookieKey = 'chavy_cookie_cmbchina'
const tokenKey = 'chavy_token_cmbchina'
const chavy = init()
let cookieVal = chavy.getdata(cookieKey)
let tokenVal = chavy.getdata(tokenKey)

sign()

function sign() {
  const title = `${cookieName}`
  const subTitle = `签到脚本可能会导致账号异常, 请暂停使用`
  const detail = ``
  chavy.msg(title, subTitle, detail)
}

function _sign() {
  const token = JSON.parse(tokenVal)
  let url = { url: `https://weclub.ccc.cmbchina.com/SCRMCustomActivityFront/checkin/request/checkin.json?csrf_token=${token.csrf_token}`, headers: { Cookie: cookieVal }, body:  JSON.stringify({'activityCode' : 'checkin'})
    } 

  chavy.post(url, (error, response, data) => {
    chavy.log(`${cookieName}, data: ${data}`)
    const result = JSON.parse(data)
    const title = `${cookieName}`
    let subTitle = ``
    let detail = ``
    if (result.code == '1000') {
      subTitle = `签到结果: 成功`
      detail = `积分: ${result.data.awardValue + " 积分🎁"}`
    } else if (result.code == '1452') {
      subTitle = `签到失败: 请获取cookie`
      detail = `说明: ${result.errorCode}`
    } else {
      subTitle = `签到失败: 未知`
      detail = `编码: ${result.code}, 说明: ${result.errorCode}`
    }
    chavy.msg(title, subTitle, detail)
  })
  chavy.done()
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, {}, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
