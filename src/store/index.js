import { createStore } from "vuex"

// 创建Store实例
const store = createStore({
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