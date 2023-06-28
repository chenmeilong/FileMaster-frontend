import { FilemanagerStore } from '@/types.ts'

const filemanagerInitState: FilemanagerStore = {
  selectedFiles: [],
  selectedFolder: '',
  bufferedItems: {
    type: '',
    files: []
  },
  // 从根路径开始的所有文件夹信息（不包括文件）
  foldersList: null,
  // 记录历史访问路径用于前进后退
  history: {
    currentIndex: 0,
    steps: []
  },
  // 当前文件夹中的所有文件包括文件夹
  filesList: [],
  showImages: 'icons',
  orderFiles: {
    field: 'name',
    orderBy: 'asc'
  },
  itemsView: 'list'
}

export default filemanagerInitState
