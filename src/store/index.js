import {createStore} from 'vuex'

const url = 'http://47.122.41.214:18888';
export default createStore({
    // 注册全局变量
    state: {
        global_url: url,
        token: "1",
        loginStatus: '0',
        username: 'user',
        currentUser: 0,
    }
})
