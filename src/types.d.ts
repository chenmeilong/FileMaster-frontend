// 表示文件或文件夹的基本信息
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

export type Order = {
  field: 'name' | 'size' | 'date'
  orderBy: 'asc' | 'desc'
}

export interface Steps {
  action: string
  path: string
}

export interface BufferedItems {
  type: string
  files: Item[]
}
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

export interface Store {
  filemanager: FilemanagerStore
}
