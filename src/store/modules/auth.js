import authApi from '@/api/auth'
import { setItem } from '@/helpers/persistanceStorage'

const state = {
  isSubmitting: false,
  currentUser: null,
  validationErrors: null,
  isLoggedIn: null,
}

export const mutationTypes = {
  registerStart: '[auth] registerStart',
  registerSuccess: '[auth] registerSuccess',
  registerFailure: '[auth] registerFailure',

  loginStart: '[auth] loginStart',
  loginSuccess: '[auth] loginSuccess',
  loginFailure: '[auth] loginFailure',
}

const mutations = {
  [mutationTypes.registerStart](state) {
    state.isSubmitting = true
    state.validationErrors = null
  },
  [mutationTypes.registerSuccess](state, user) {
    state.isSubmitting = false
    state.currentUser = user
    state.isLoggedIn = true
  },
  [mutationTypes.registerFailure](state, errors) {
    state.isSubmitting = false
    state.validationErrors = errors
  },
  [mutationTypes.loginStart](state) {
    state.isSubmitting = true
    state.validationErrors = null
  },
  [mutationTypes.loginSuccess](state, user) {
    state.isSubmitting = false
    state.currentUser = user
    state.isLoggedIn = true
  },
  [mutationTypes.loginFailure](state, errors) {
    state.isSubmitting = false
    state.validationErrors = errors
  },
}

export const actionTypes = {
  register: '[auth] register',
}

const actions = {
  [actionTypes.register]({ commit }, credentials) {
    return new Promise((resolve) => {
      commit(mutationTypes.registerStart)
      authApi
        .register(credentials)
        .then((response) => {
          commit(mutationTypes.registerSuccess, response.data.user)
          setItem('accessToken', response.data.user.token)
          resolve(response.data.user)
        })
        .catch((result) => {
          commit(mutationTypes.registerFailure, result.response.data.errors)
          console.log('result errors - ', result)
        })
    })
  },
  [actionTypes.login]({ commit }, credentials) {
    return new Promise((resolve) => {
      commit(mutationTypes.loginStart)
      authApi
        .login(credentials)
        .then((response) => {
          commit(mutationTypes.loginSuccess, response.data.user)
          setItem('accessToken', response.data.user.token)
          resolve(response.data.user)
        })
        .catch((result) => {
          commit(mutationTypes.loginFailure, result.response.data.errors)
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
