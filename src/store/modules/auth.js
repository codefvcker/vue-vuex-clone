import authApi from '@/api/auth'
import { setItem } from '@/helpers/persistanceStorage'

const state = {
  isSubmitting: false,
  isLoading: false,
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

  getCurrentUserStart: '[auth] getCurrentUserStart',
  getCurrentUserSuccess: '[auth] getCurrentUserSuccess',
  getCurrentUserFailure: '[auth] getCurrentUserFailure',
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
  [mutationTypes.getCurrentUserStart](state) {
    state.isLoading = true
  },
  [mutationTypes.getCurrentUserSuccess](state, payload) {
    state.isLoading = false
    state.currentUser = payload
    state.isLoggedIn = true
  },
  [mutationTypes.getCurrentUserFailure](state) {
    state.isLoading = false
    state.isLoggedIn = false
    state.currentUser = null
  },
}

export const actionTypes = {
  register: '[auth] register',
  login: '[auth] login',
  getCurrentUser: '[auth] getCurrentUser',
}

const actions = {
  [actionTypes.register]({ commit }, credentials) {
    return new Promise(resolve => {
      commit(mutationTypes.registerStart)
      authApi
        .register(credentials)
        .then(response => {
          commit(mutationTypes.registerSuccess, response.data.user)
          setItem('accessToken', response.data.user.token)
          resolve(response.data.user)
        })
        .catch(result => {
          commit(mutationTypes.registerFailure, result.response.data.errors)
          console.log('result errors - ', result)
        })
    })
  },
  [actionTypes.login]({ commit }, credentials) {
    return new Promise(resolve => {
      commit(mutationTypes.loginStart)
      authApi
        .login(credentials)
        .then(response => {
          commit(mutationTypes.loginSuccess, response.data.user)
          setItem('accessToken', response.data.user.token)
          resolve(response.data.user)
        })
        .catch(result => {
          commit(mutationTypes.loginFailure, result.response.data.errors)
          console.log('result errors - ', result)
        })
    })
  },
  [actionTypes.getCurrentUser]({ commit }) {
    return new Promise(resolve => {
      commit(mutationTypes.getCurrentUserStart)
      authApi
        .getCurrentUser()
        .then(response => {
          commit(mutationTypes.getCurrentUserSuccess, response.data.user)
          resolve(response.data.user)
        })
        .catch(() => {
          commit(mutationTypes.getCurrentUserFailure)
        })
    })
  },
}

export const getterTypes = {
  currentUser: '[auth] currentUsser',
  isLoggedIn: '[auth] isLoggedIn',
  isAnonymous: '[auth] isAnonimous',
}

const getters = {
  [getterTypes.currentUser]: state => state.currentUser,
  [getterTypes.isLoggedIn]: state => Boolean(state.isLoggedIn),
  [getterTypes.isAnonymous]: state => state.isLoggedIn === false,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
