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

//  todo 是否每个都添加 LocalActionTypes
export function setSelectedFiles(item: Item): LocalActionTypes {
  return {
    item,
    type: SET_SELECTED_FILES
  }
}
// 修改itemView的值修改为list还是grid
export function listViewChange(view: string) {
  return {
    view,
    type: SET_ITEM_VIEW
  }
}

export function setSorting(orderBy: string, field: string) {
  return {
    orderBy,
    field,
    type: SET_SORT_ORDER_BY
  }
}

export function filterSorting() {
  return {
    type: RUN_SORTING_FILTER
  }
}

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

export function selectAllFiles() {
  return {
    type: SELECT_ALL_FILES
  }
}

export function inverseSelectedFiles() {
  return {
    type: INVERSE_SELECTED_FILES
  }
}

export function copyToBufferFiles() {
  return {
    type: COPY_FILES_TOBUFFER
  }
}

export function cutToBufferFiles() {
  return {
    type: CUT_FILES_TOBUFFER
  }
}

export function clearBufferFiles() {
  return {
    type: CLEAR_FILES_TOBUFFER
  }
}
// 修改当前选择的文件夹和history访问记录
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

export function getFoldersList() {
  return {
    type: GET_FOLDERS_LIST,
    request: {
      method: 'post',
      url: '/fm/foldertree'
    }
  }
}
// 修改history的index
export function setHistoryIndex(index: number) {
  return {
    type: SET_HISTORY_INDEX,
    index
  }
}

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
// items由文件路径组成的数组
// type 是cut or copy
// 当前操作路径
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
// 提交修改后的图片保存下来 todo  file是一个超级长的字符串
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
// body{path:string;files:二进制文件}
export function uploadFile(body: object) {
  return {
    type: UPLOAD_FILES,
    request: {
      method: 'post',
      url: '/fm/upload'
    },
    body
  }
}
