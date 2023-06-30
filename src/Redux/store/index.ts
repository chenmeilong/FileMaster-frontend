/**
 * @author MilesChen
 * @description create store
 * @createDate 2023-01-19 22:16:56
 */

import { configureStore } from '@reduxjs/toolkit'
import promise from 'redux-promise'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import reducer from '../reducers'
import apiMiddleware from '../middleware/api'
import Config from '../../Data/Config'

/**
 * apiMiddleware API请求中间件
 * thunk 异步操作中间件
 * promise 处理 Promise 的中间件
 * logger 日志中间件
 */
// thunk, promise 暂时没用 后续使用 todo loading会使用到
// const middleware = [apiMiddleware(Config.serverPath), thunk, promise, logger]
const middleware = [apiMiddleware(Config.serverPath)]
// 创建 store
const store = configureStore({
  reducer,
  middleware
})

export default store
