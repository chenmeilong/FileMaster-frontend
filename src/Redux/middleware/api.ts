/**
 * @author MilesChen
 * @description request API
 * @createDate 2023-01-25 20:14:34
 */

import axios from 'axios'
import { Middleware } from 'redux'
import { SET_MESSAGES } from '../actions'

let timmer: NodeJS.Timeout
/**
 * 自定义中间件实现了action分发，如果不是request请求就通过中间到reducer
 * 如果是request请求则调用两次reducer
 * 1.通过中间到reducer
 * 2.发起axios获取数据，成功或失败通过中间件到reducer
 * @param apiUrl 请求根地址
 * @return dispatch | Promise dispatch内容或者axios的请求对象
 */
const apiMiddleware =
  (apiUrl: string): Middleware =>
  () =>
  (next) =>
  (action) => {
    // 当一个action被派发到store时，此中间件会对该action进行检查。如果action.request存在，说明该action需要进行API请求，否则将继续执行下一个中间件。
    if (!action.request) {
      if (action.type !== SET_MESSAGES) return next(action)
      else {
        // 消息队列,分发成一个同步任务，一个异步任务
        clearTimeout(timmer)
        timmer = setTimeout(() => {
          next({ type: `${action.type}_DELETE`, message: action.message })
        }, 2000)
        return next({ type: `${action.type}_ADD`, message: action.message })
      }
    }
    // 是API请求
    const REQUEST = `${action.type}_REQUEST`
    const SUCCESS = action.type
    const FAILURE = `${action.type}_FAILURE`
    // next 可用于 loading 使程序不至于卡死 告诉reduces正在请求中
    next({ type: REQUEST })
    const ContentType =
      action.type === 'UPLOAD_FILES'
        ? 'multipart/form-data'
        : 'application/json'

    // todo 使用async、await的方式重构axios请求API
    return axios({
      method: action.request.method,
      headers: {
        'Content-Type': ContentType
      },
      url: `${apiUrl}${action.request.url}`,
      data: action.body
    })
      .then(({ data }) =>
        next({
          type: SUCCESS,
          data
        })
      )
      .catch((error) => {
        next({
          type: FAILURE,
          error: error.response
        })
        const message =
          typeof error.response !== undefined ? error.response : error
        throw message
      })
  }

export default apiMiddleware
