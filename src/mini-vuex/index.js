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
    }
    // Object.defineProperty(store, 'state', {
    //     get state() {
    //         return this._state
    //     },
    //     set state(v) {
    //         console.error('please use replaceState() to reset state')
    //     },
    // })
    // 插件实现要求的install方法
    store.install = function (app) {
        const store = this
        // 注册$router
        app.config.globalProperties.$store = store
    }

    return store
}