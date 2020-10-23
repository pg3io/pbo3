import Vue from 'vue'
import Vuex from 'vuex'
import { onLogout, apolloClient } from '@/vue-apollo'
import { LOGGED_IN_USER } from '@/graphql/login'
import gql from 'graphql-tag'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage
})

export default new Vuex.Store({
  state: {
    token: null,
    user: {},
    authStatus: false
  },
  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.authStatus,
    user: state => state.user
  },
  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },
    LOGIN_USER (state, user) {
      state.authStatus = true
      state.user = { ...user }
    },
    LOGOUT_USER (state) {
      state.authStatus = ''
      state.token = '' && localStorage.removeItem('apollo-token')
    }
  },
  actions: {
    async login ({ commit, dispatch }, authDetails) {
      try {
        var {data} = await apolloClient.mutate({
          mutation: gql`
            mutation($identifier: String!, $password: String!) {
              login(input: { identifier: $identifier, password: $password }) {
                  jwt
              }
          }`,
          variables: authDetails
        })
        const token = JSON.stringify("Bearer " + data.login.jwt)
        commit('SET_TOKEN', token)
        localStorage.setItem('apollo-token', token)
        dispatch('setUser')
      } catch (e) {
        console.log(e)
      }
    },
    async setUser ({ commit }) {
      const { data } = await apolloClient.query({ query: LOGGED_IN_USER })
      commit('LOGIN_USER', data.me)
    },
    async logOut ({ commit }) {
      commit('LOGOUT_USER')
      onLogout(apolloClient)
    }
  },
  plugins: [vuexLocal.plugin]

})
