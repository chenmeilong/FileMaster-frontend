import axios from 'axios'
import { Middleware } from 'redux'

const apiMiddleware =
  (apiUrl: string): Middleware =>
  () =>
  (next) =>
  (action) => {
    // 当一个action被派发到store时，此中间件会对该action进行检查。如果action.request存在，说明该action需要进行API请求，否则将继续执行下一个中间件。
    if (!action.request) {
      return next(action)
    }
    // 是API请求
    let REQUEST: string, SUCCESS: string, FAILURE: string

    if (action.types) {
      REQUEST = action.types[0]
      SUCCESS = action.types[1]
      FAILURE = action.types[2]
    } else {
      REQUEST = `${action.type}_REQUEST`
      SUCCESS = action.type
      FAILURE = `${action.type}_FAILURE`
    }
    // 这次的next用于 loading 使程序不至于卡死 告诉reduces正在请求中，但是这里可以将这行去掉
    next({ type: REQUEST })
    return axios({
      method: action.request.method,
      headers: {
        'Content-Type': 'application/json',
        cronustoken: window.localStorage.getItem('jwtToken')
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
