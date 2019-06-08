import localForage from 'localforage'

const TokenKey = 'admin-token'
const UserKey = 'admin-user'

// 设置token
export function setToken (token) {
  localForage.setItem(TokenKey, token)
}
export function setUser (token) {
  localForage.setItem(UserKey, token)
}

// 获取token
export function getToken () {
  return new Promise((resolve) => {
    localForage.getItem(TokenKey).then(value => {
      resolve(value)
    })
  })
}
export function getUser () {
  return new Promise((resolve) => {
    localForage.getItem(UserKey).then(value => {
      resolve(value)
    })
  })
}

// 删除token
export function removeToken () {
  localForage.removeItem(TokenKey)
}
export function removeUser () {
  localForage.removeItem(UserKey)
}
