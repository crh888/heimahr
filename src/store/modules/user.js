import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
const state = {
  token: getToken() // 从缓存中读取初始值
}

const mutations = {
  setToken(state, token) {
    state.token = token
    // 同步到缓存
    setToken(token)
  },

  removeToken(state) {
    state.token = null
    removeToken()
  }
}

const actions = {
  // context 上下文
  async login(context, data) {
    // 调用登录接口
    const token = await login(data)
    // 返回一个token
    context.commit('setToken', token)
  }
}

export default {
  namespaced: true, // 开启命名空间
  state,
  mutations,
  actions
}
