import { configureStore } from '@reduxjs/toolkit'
import promise from 'redux-promise'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import reducer from '../reducers'
import apiMiddleware from '../middleware/api'
import Config from '../../Data/Config'

const middleware = [apiMiddleware(Config.serverPath), thunk, promise, logger]
// 创建 store
const store = configureStore({
  reducer,
  middleware
})

export default store
