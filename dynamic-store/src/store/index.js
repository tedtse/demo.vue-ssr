import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      nameList: []
    },
    getters: {
      nameList (state) {
        return state.nameList || []
      }
    },
    actions: {
      getNameList ({ commit }) {
        return axios.get('http://rap2api.taobao.org/app/mock/9798/test/:id')
          .then(res => {
            if (res.data.ret !== 0) {
              return
            }
            commit('setNameList', { list: res.data.list })
          })
      }
    },
    mutations: {
      setNameList (state, { list }) {
        Vue.set(state, 'nameList', list)
      }
    }
  })
}
