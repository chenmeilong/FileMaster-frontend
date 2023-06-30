/**
 * @author MilesChen
 * @description common action 通用action
 * @createDate 2023-06-30 15:31:48
 */
import { Messages } from '@/types'

export const SET_MESSAGES = 'SET_MESSAGES'
export const SET_MESSAGES_ADD = 'SET_MESSAGES_ADD'
export const SET_MESSAGES_DELETE = 'SET_MESSAGES_DELETE'

// 设置消息队列
export function setMessages(message: Messages) {
  return {
    type: SET_MESSAGES,
    message
  }
}
