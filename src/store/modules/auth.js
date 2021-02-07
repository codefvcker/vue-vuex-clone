import authApi from '@/api/auth'
import { setItem } from '@/helpers/persistanceStorage'

const state = {
  isSubmitting: false,
  currentUser: null,
  validationErrors: null,
  isLoggedIn: null,
}

const mutations = {
  registerStart(state) {
    state.isSubmitting = true
    state.validationErrors = null
  },
  registerSuccess(state, user) {
    state.isSubmitting = false
    state.currentUser = user
    state.isLoggedIn = true
  },
  registerFailure(state, errors) {
    state.isSubmitting = false
    state.validationErrors = errors
  },
}

const actions = {
  register({ commit }, credentials) {
    return new Promise(resolve => {
      commit('registerStart')
      authApi
        .register(credentials)
        .then(response => {
          console.log('RES - ', response)
          commit('registerSuccess', response.data.user)
          setItem('accessToken', response.data.user.token)
          resolve(response.data.user)
        })
        .catch(result => {
          commit('registerFailure', result.response.data.errors)
          console.log('result errors - ', result)
        })
    })
  },
}

export default {
  state,
  mutations,
  actions,
}
