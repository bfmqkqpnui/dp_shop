/**
 * 是否存在
 * @param opt
 * @returns {boolean}
 */
const isExist = opt => {
  let flag = false;
  if (opt !== null && opt !== "" && typeof opt !== "undefined") {
    flag = true;
  }
  return flag;
}

/**
 * 日期格式化
 * @param format
 * @param time
 * @returns {*}
 */
const dateFormat = (format, time) => {
  let dt = new Date();
  if (time) {
    if (typeof time !== 'number') {
      time = time.toString().replace(/-/g, '/')
    }
    dt = new Date(time);
  }
  let date = {
    "M+": dt.getMonth() + 1,
    "d+": dt.getDate(),
    "h+": dt.getHours(),
    "m+": dt.getMinutes(),
    "s+": dt.getSeconds(),
    "q+": Math.floor((dt.getMonth() + 3) / 3),
    "S+": dt.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
    format = format.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (var k in date) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length))
    }
  }
  return format
}

/**
 * 获取localStorage信息
 * @returns {*}
 */
const dbGet = (name) => {
  let value = localStorage.getItem(name)
  if (/^\{.*\}$/.test(value)) {
    value = JSON.parse(value)
  }
  return value
}


/**
 * 解决滑动上面的浮层下面的内容滚动
 * @chenpeng
 * @DateTime 2017-08-06T12:05:23+0800
 * @return   {[type]}                 [description]
 */
const fixedBody = () => {
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
  document.body.style.cssText += 'position:fixed;width:100%;height:100%;top:-' + scrollTop + 'px;';
}

const looseBody = () => {
  var body = document.body;
  body.style.position = '';
  body.style.width = '';
  body.style.height = '';
  var top = body.style.top;
  document.body.scrollTop = document.documentElement.scrollTop = -parseInt(top);
  body.style.top = '';
}

/**
 * 日期倒计时最多到天数
 * @param endTime
 * @param intervalId
 * @returns {{days: number, hours: number, minutes: number, seconds: number}}
 */
const timerCountDown = (endTime, intervalId) => {
  let target_date = new Date(endTime).getTime() // set target date
  let current_date = new Date().getTime() // get fixed current date
  let difference = target_date - current_date;
  if (difference < 0) {
    if (intervalId) {
      clearInterval(intervalId);
    }
    return {
      days: -1,
      hours: -1,
      minutes: -1,
      seconds: -1
    };
  }
  let _second = 1000,
    _minute = _second * 60,
    _hour = _minute * 60,
    _day = _hour * 24;
  let days = Math.floor(difference / _day),
    hours = Math.floor((difference % _day) / _hour),
    minutes = Math.floor((difference % _hour) / _minute),
    seconds = Math.floor((difference % _minute) / _second);
  days = (String(days).length >= 2) ? days : days;
  hours = (String(hours).length >= 2) ? hours : '0' + hours;
  minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
  seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;
  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}
/**
 * 设置localStorage信息
 * @param name
 * @param value
 */
const dbSet = (name, value) => {
  if (typeof value === typeof {}) {
    value = JSON.stringify(value)
  }
  return localStorage.setItem(name, value)
}

/**
 * 移除localStorage信息
 * @param name
 */
const dbRemove = (name) => {
  localStorage.removeItem(name);
}

/**
 * 校验手机号码
 * @param phone
 * @returns {boolean}
 */
const isPhone = (phone) => {
  let myReg = /^[1][0-9]{10}$/;
  if (phone == null || phone == "") {
    return false;
  } else if(!myReg.test(phone)){
    return false;
  } else {
    return true;
  }
}

/**
 * 是否为Email
 * @param mailValue
 * @returns {boolean}
 */
const isEmail = (mailValue) => {
  let myReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  if(isExist(mailValue)){
    if(myReg.test(mailValue)){
      return true;
    }else {
      return false;
    }
  }else{
    return false;
  }
}

/**
 * 邮政编码
 * @param val
 * @returns {boolean}
 */
const isCode = (val) => {
  let reg = /[1-9]\d{5}/;
  let flag = false;
  if(reg.test(val)){
    flag = true;
  }
  return flag;
}
export default {
  dbGet,
  dbSet,
  dbRemove,
  dateFormat,
  isExist,
  fixedBody,
  looseBody,
  timerCountDown,
  isPhone,
  isCode
}
