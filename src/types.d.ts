/**
 * @author MilesChen
 * @description global type definition
 * @createDate 2023-06-25 14:23:04
 */

import { AxiosError } from 'axios'

// 文件或文件夹详细信息
export interface Item {
  path: string
  name: string
  created: string
  modified: string
  type: string
  id: string
  premissions: {
    others: string
    group: string
    owner: string
  }
  size?: number
  extension?: string
  children?: Item[]
  private?: boolean
}
// 排序
export type Order = {
  field: 'name' | 'size' | 'date'
  orderBy: 'asc' | 'desc'
}
// 路径跳转
export interface Steps {
  action: string
  path: string
}
// 剪切板缓存
export interface BufferedItems {
  type: string
  files: Item[]
}
// 浏览路径记录缓存
export interface History {
  currentIndex: number
  steps: Steps[]
}

export interface FilemanagerStore {
  selectedFiles: Item[]
  selectedFolder: string
  bufferedItems: BufferedItems
  foldersList: Item | null
  history: History
  filesList: Item[]
  showImages: 'icons' | 'thumbs'
  orderFiles: Order
  itemsView: 'list' | 'grid'
}

export interface AxiosError {
  message?: string
  type: string
  error: object | string
}

// 提示消息Messages
export interface Messages {
  title: string
  type: 'success' | 'info' | 'warning' | 'error'
  message: string

  progress?: boolean
  disableClose?: boolean
  timer?: number
}

export interface CommonStore {
  messages: Messages[]
}

export interface Store {
  filemanager: FilemanagerStore
  common: CommonStore
}
