import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './store'

/**
 * 前置守卫
 */

const whiteList = ['/login', '/404']

// eslint-disable-next-line space-before-function-paren
router.beforeEach(async (to, from, next) => {
  nprogress.start()
  if (store.getters.token) {
    // 存在token
    if (to.path === '/login') {
      // 跳转到主页
      next('/') // 中转到主页
      // next(有地址) 没有执行后置守卫
      nprogress.done()
    } else {
      // 判断是否获取过资料
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      next()
    }
  } else {
    // 没有token
    // 查看是否在白名单中
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      nprogress.done()
    }
  }
})

/**
 * 后置守卫
 */

router.afterEach(() => {
  nprogress.done()
})
