/**
 * @author MilesChen
 * @description common reducer
 * @createDate 2023-06-30 17:05:34
 */

import { ActionTypes } from '../store/types'
import commonInitState from '../store/common'
import { SET_MESSAGES_ADD, SET_MESSAGES_DELETE } from '../actions'

// common reducer
export default function reducer(state = commonInitState, action: ActionTypes) {
  switch (action.type) {
    case SET_MESSAGES_ADD:
      // 清空消息队列 todo 消息队列
      if (action.message.title === '') {
        return { ...state, messages: [] }
      } else {
        return { ...state, messages: [action.message] }
      }
    case SET_MESSAGES_DELETE:
      // 清理最前面的消息  如果没有的话就不清理
      if (state.messages.length > 0) {
        state.messages.shift()
        return { ...state, messages: [...state.messages] }
      }
      return state

    // 不做任何处理
    default:
      return state
  }
}
