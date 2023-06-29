/**
 * @author MilesChen
 * @description initial filemanager state
 * @createDate 2023-01-28 13:23:17
 */

import { FilemanagerStore } from '@/types.ts'

const filemanagerInitState: FilemanagerStore = {
  // 已勾选 文件或文件夹
  selectedFiles: [],
  // 当前打开的文件夹
  selectedFolder: '',
  // 复制、剪切缓存内容
  bufferedItems: {
    type: '',
    files: []
  },
  // 从根路径开始的所有文件夹信息（不包含文件）
  foldersList: null,
  // 记录历史访问路径用于前进后退
  history: {
    currentIndex: 0,
    steps: []
  },
  // 当前文件夹中的所有文件和文件夹
  filesList: [],
  // 图片以图标、缩略图展示
  showImages: 'icons',
  // 排序方式
  orderFiles: {
    field: 'name',
    orderBy: 'asc'
  },
  // 文件陈列方式
  itemsView: 'list'
}

export default filemanagerInitState
