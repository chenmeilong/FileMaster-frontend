/**
 * @author MilesChen
 * @description filemanager action
 * @createDate 2023-01-26 10:45:33
 */

import { Item } from '@/types'
import { LocalActionTypes } from '../store/types'

export const SET_SELECTED_FILES = 'SET_SELECTED_FILES'
export const INVERSE_SELECTED_FILES = 'REVERSE_SELECTED_FILES'
export const UNSET_SELECTED_FILES = 'UNSET_SELECTED_FILES'
export const SELECT_ALL_FILES = 'SELECT_ALL_FILES'

export const COPY_FILES_TOBUFFER = 'COPY_FILES_TOBUFFER'
export const CUT_FILES_TOBUFFER = 'CUT_FILES_TOBUFFER'
export const CLEAR_FILES_TOBUFFER = 'CLEAR_FILES_TOBUFFER'

export const PASTE_FILES = 'PASTE_FILES'

export const SET_SELECTED_FOLDER = 'SET_SELECTED_FOLDER'
export const GET_FILES_LIST = 'GET_FILES_LIST'
export const GET_FOLDERS_LIST = 'GET_FOLDERS_LIST'
export const SET_HISTORY_INDEX = 'SET_HISTORY_INDEX'
export const SET_ITEM_VIEW = 'SET_ITEM_VIEW'

export const RENAME_FILE = 'RENAME_FILE'
export const CREATE_FILE = 'CREATE_FILE'
export const CREATE_FOLDER = 'CREATE_FOLDER'

export const ARCHIVE_FILES = 'ARCHIVE_FILES'
export const UNZIP_FILE = 'UNZIP_FILE'
export const DELETE_ITEMS = 'DELETE_ITEMS'
export const EMPTY_DIR = 'EMPTY_DIR'
export const DUPLICATE_ITEM = 'DUPLICATE_ITEM'
export const SAVE_IMAGE = 'SAVE_IMAGE'
export const SET_SORT_ORDER_BY = 'SET_SORT_ORDER_BY'
export const RUN_SORTING_FILTER = 'RUN_SORTING_FILTER'
export const SET_IMAGE_SETTINGS = 'SET_IMAGE_SETTINGS'
export const UPLOAD_FILES = 'UPLOAD_FILES'

//  todo 因为使用中间件，实际的返回值可能不是这里的返回值，需要更加精准的类型定义
export function setSelectedFiles(item: Item): LocalActionTypes {
  return {
    item,
    type: SET_SELECTED_FILES
  }
}
// 修改布局方式
export function listViewChange(view: string) {
  return {
    view,
    type: SET_ITEM_VIEW
  }
}
// 修改排序方式
export function setSorting(orderBy: string, field: string) {
  return {
    orderBy,
    field,
    type: SET_SORT_ORDER_BY
  }
}
// 文件与文件夹排序
export function filterSorting() {
  return {
    type: RUN_SORTING_FILTER
  }
}
// 修改图标显示方式
export function setImagesSettings(imagePreview: string) {
  return {
    imagePreview,
    type: SET_IMAGE_SETTINGS
  }
}
// 清空选择文件或文件夹
export function unsetSelectedFiles() {
  return {
    type: UNSET_SELECTED_FILES
  }
}
// 全选
export function selectAllFiles() {
  return {
    type: SELECT_ALL_FILES
  }
}
// 反选
export function inverseSelectedFiles() {
  return {
    type: INVERSE_SELECTED_FILES
  }
}
// 复制
export function copyToBufferFiles() {
  return {
    type: COPY_FILES_TOBUFFER
  }
}
// 剪切
export function cutToBufferFiles() {
  return {
    type: CUT_FILES_TOBUFFER
  }
}
// 清空剪切板
export function clearBufferFiles() {
  return {
    type: CLEAR_FILES_TOBUFFER
  }
}
// 修改当前选择的文件夹，history是否添加到访问记录
export function setSelectedFolder(path: string, history: boolean) {
  return {
    type: SET_SELECTED_FOLDER,
    path,
    history
  }
}
// 获取当前路径中的所有内容
export function getFilesList(path: string) {
  return {
    type: GET_FILES_LIST,
    path: path,
    request: {
      method: 'post',
      url: '/fm/folder'
    },
    body: {
      path
    }
  }
}
// 获取根目录下的文件夹树
export function getFoldersList() {
  return {
    type: GET_FOLDERS_LIST,
    request: {
      method: 'post',
      url: '/fm/foldertree'
    }
  }
}
// 修改访问记录
export function setHistoryIndex(index: number) {
  return {
    type: SET_HISTORY_INDEX,
    index
  }
}
// 文件夹或文件夹重命名
export function renameFiles(path: string, newname: string) {
  return {
    type: RENAME_FILE,
    request: {
      method: 'post',
      url: '/fm/rename'
    },
    body: {
      path,
      newname
    }
  }
}
// 新建文件
export function createNewFile(path: string, file: string) {
  return {
    type: CREATE_FILE,
    request: {
      method: 'post',
      url: '/fm/createfile'
    },
    body: {
      path,
      file
    }
  }
}
// 新建文件夹
export function createNewFolder(path: string, folder: string) {
  return {
    type: CREATE_FOLDER,
    request: {
      method: 'post',
      url: '/fm/createfolder'
    },
    body: {
      path,
      folder
    }
  }
}

/**
 * 粘贴
 * @param items 由文件路径组成的数组
 * @param type cut or copy
 * @param destination 当前操作路径
 * @return request_obj
 */
export function pasteFiles(items: string[], type: string, destination: string) {
  return {
    type: PASTE_FILES,
    request: {
      method: 'post',
      url: type === 'cut' ? '/fm/move' : '/fm/copy'
    },
    body: {
      items,
      destination
    }
  }
}
// 清空指定路径所有内容
export function emptydir(path: string) {
  return {
    type: EMPTY_DIR,
    request: {
      method: 'post',
      url: '/fm/emptydir'
    },
    body: {
      path
    }
  }
}
// 删除items中的文件和文件夹
export function deleteItems(items: string[]) {
  return {
    type: DELETE_ITEMS,
    request: {
      method: 'post',
      url: '/fm/delete'
    },
    body: {
      items
    }
  }
}
// 快速复制
export function dublicateItem(path: string) {
  return {
    type: DUPLICATE_ITEM,
    request: {
      method: 'post',
      url: '/fm/duplicate'
    },
    body: {
      path
    }
  }
}
// 解压
export function unzip(file: string, destination: string) {
  return {
    type: UNZIP_FILE,
    request: {
      method: 'post',
      url: '/fm/unzip'
    },
    body: {
      file,
      destination
    }
  }
}
// 将files中的文件或者文件夹添加到name压缩包存放在destination
export function archive(files: string[], destination: string, name: string) {
  return {
    type: ARCHIVE_FILES,
    request: {
      method: 'post',
      url: '/fm/archive'
    },
    body: {
      files,
      destination,
      name
    }
  }
}

/**
 * 编辑图片时保存图片
 * @param file 字符串形式的图片
 * @param path 保存路径
 * @param isnew 是否另存为
 * @return request_obj
 */
export function saveimage(file: string, path: string, isnew: boolean) {
  return {
    type: SAVE_IMAGE,
    request: {
      method: 'post',
      url: '/fm/saveimage'
    },
    body: {
      file,
      path,
      isnew
    }
  }
}
// 上传文件 body {path:string;files:二进制文件}
export function uploadFile(body: FormData) {
  return {
    type: UPLOAD_FILES,
    request: {
      method: 'post',
      url: '/fm/upload'
    },
    body
  }
}
