import { reactive, computed, watch } from "vue"

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
        _commit: false, // 提交的标识符，如果通过commit方式修改状态，则设置为true
        _withCommit(fn) { // fn就是用户设置的mutation执行函数
            this._commit = true
            fn()
            this._commit = false
        }
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
        // 要使用withCommit方式提交
        this._withCommit(() => {
            entry.call(this.state, this.state, payload)
        })
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

    // 定义store.getters
    store.getters = {}

    // 遍历用户定义getters
    Object.keys(options.getters).forEach(key => {
        // 定义计算属性
        const result = computed(() => {
            const getter = options.getters[key]
            if (getter) {
                return getter.call(store, store.state)
            } else {
                console.error('unknown getter type:' + key)
                return ''
            }
        })
        // 动态定义store.getters.xxx
        // 值来自于用户定义的getter函数的返回值
        Object.defineProperty(store.getters, key, {
            // 只读
            get() {
                return result
            }
        })
    })

    // strict模式
    if (options.strict) {
        // 监听store.state变化
        watch(store.state, () => {
            if (!store._commit) {
                console.warn('please use commit to mutate state')
            }
        }, {
            deep: true,
            flush: 'sync'
        })
    }

    // 插件实现要求的install方法
    store.install = function (app) {
        const store = this
        // 注册$router
        app.config.globalProperties.$store = store
    }

    return store
}