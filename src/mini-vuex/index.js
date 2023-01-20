import { reactive } from "vue"

export function createStore(options) {
    // Store实例
    const store = {
        // 响应式state
        _state: reactive(options.state()),
        // 访问保护
        get state() {
            return this._state
        },
        set state(v) {
            console.error('please use replaceState() to reset state')
        },
        _mutations: options.mutations,
        _actions: options.actions,
    }
    // Object.defineProperty(store, 'state', {
    //     get state() {
    //         return this._state
    //     },
    //     set state(v) {
    //         console.error('please use replaceState() to reset state')
    //     },
    // })
    // commit(type, payload)
    function commit(type, payload) {
        // 获取type对应的mutation
        const entry = this._mutations[type]
        if (!entry) {
            console.error(`unknown mutation type: ${type}`)
            return
        }
        entry.call(this.state, this.state, payload)
    }

    // dispatch(type, payload)
    function dispatch(type, payload) {
        // 获取用户编写的type对应的action
        const entry = this._actions[type]
        if (!entry) {
            console.error(`unknown action type: ${type}`)
            return
        }
        return entry.call(this, this, payload)
    }

    store.commit = commit.bind(store) // commit调用时的上下文为store
    store.dispatch = commit.bind(store) // dispatch调用时的上下文为store

    // 插件实现要求的install方法
    store.install = function (app) {
        const store = this
        // 注册$router
        app.config.globalProperties.$store = store
    }

    return store
}