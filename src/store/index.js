// import { createStore } from "vuex"
import { createStore } from "../mini-vuex"

// 创建Store实例
const store = createStore({
    strict: true,
    state() {
        return {
            count: 1
        }
    },
    mutations: {
        // state从何而来？
        add(state) {
            state.count++
        }
    },
    getters: {
        doubleCounter(state) {
            return state.count * 2
        }
    },
    actions: {
        add({ commit }) {
            setTimeout(() => {
                commit('add')
            }, 1000)
        }
    }
})

export { store }