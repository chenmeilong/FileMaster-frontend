/**
 * @author MilesChen
 * @description redux type definition
 * @createDate 2023-06-25 22:37:52
 */

import { Item, Messages } from '@/types'
import {
  SET_SELECTED_FILES,
  UNSET_SELECTED_FILES,
  SELECT_ALL_FILES,
  INVERSE_SELECTED_FILES,
  COPY_FILES_TOBUFFER,
  CUT_FILES_TOBUFFER,
  PASTE_FILES,
  SET_SELECTED_FOLDER,
  GET_FOLDERS_LIST,
  GET_FILES_LIST,
  SET_HISTORY_INDEX,
  SET_ITEM_VIEW,
  SET_SORT_ORDER_BY,
  RUN_SORTING_FILTER,
  SET_IMAGE_SETTINGS,
  CLEAR_FILES_TOBUFFER,
  RENAME_FILE,
  CREATE_FILE,
  CREATE_FOLDER,
  UNZIP_FILE,
  DUPLICATE_ITEM,
  DELETE_ITEMS,
  UPLOAD_FILES,
  SAVE_IMAGE,
  ARCHIVE_FILES,
  SET_MESSAGES,
  SET_MESSAGES_ADD,
  SET_MESSAGES_DELETE
} from '../actions'

export interface Request {
  method: string
  url: string
}

// 本地操作action
export type LocalActionTypes =
  | { type: typeof SET_SELECTED_FILES; item: Item }
  | { type: typeof SET_ITEM_VIEW; view: string }
  | { type: typeof SET_SORT_ORDER_BY; orderBy: string; field: string }
  | { type: typeof RUN_SORTING_FILTER }
  | { type: typeof SET_IMAGE_SETTINGS; imagePreview: string }
  | { type: typeof UNSET_SELECTED_FILES }
  | { type: typeof SELECT_ALL_FILES }
  | { type: typeof INVERSE_SELECTED_FILES }
  | { type: typeof COPY_FILES_TOBUFFER }
  | { type: typeof CUT_FILES_TOBUFFER }
  | { type: typeof CLEAR_FILES_TOBUFFER }
  | { type: typeof SET_SELECTED_FOLDER; path: string; history: boolean }
  | { type: typeof SET_HISTORY_INDEX; index: number }

// todo 给每个请求的API返回的内容添加类型定义
// 走中间件axios请求的action
export type APIActionTypes =
  | {
      type: typeof GET_FILES_LIST
      data: any
    }
  | {
      type: typeof GET_FOLDERS_LIST
      data: object
    }
  | {
      type: typeof RENAME_FILE
      data: object
    }
  | {
      type: typeof CREATE_FILE
      data: object
    }
  | {
      type: typeof CREATE_FOLDER
      data: object
    }
  | {
      type: typeof PASTE_FILES
      data: object
    }
  | {
      type: typeof DELETE_ITEMS
      data: object
    }
  | {
      type: typeof DUPLICATE_ITEM
      data: object
    }
  | {
      type: typeof UNZIP_FILE
      data: object
    }
  | {
      type: typeof ARCHIVE_FILES
      data: object
    }
  | {
      type: typeof SAVE_IMAGE
      data: object
    }
  | {
      type: typeof UPLOAD_FILES
      data: object
    }
// 通用 action
export type CommonActionTypes =
  | { type: typeof SET_MESSAGES; message: Messages }
  | { type: typeof SET_MESSAGES_ADD; message: Messages }
  | { type: typeof SET_MESSAGES_DELETE; message: Messages }
// 所有的action请求type
export type ActionTypes = LocalActionTypes | APIActionTypes | CommonActionTypes
