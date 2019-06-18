import axios from 'axios'

let base = ''

window.token = ''
window.userId = ''
window.userName = ''

export const requestLogin = params => {
  return axios.post(`${base}/api/login`, params).then(res => {
    console.log(res)
    if (res.data.code === 200) {
      let { token, userId, userName } = res.data.data
      window.token = token
      window.userId = userId
      window.userName = userName

      console.log(token, userId, userName)
      sessionStorage.setItem('token', token)
      sessionStorage.setItem('userId', userId)
      sessionStorage.setItem('userName', userName)
    }
    return res.data
  })
}

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }) }

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }) }

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }) }

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }) }

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }) }

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }) }
