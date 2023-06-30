/**
 * @author MilesChen
 * @description fileManager type definition
 * @createDate 2023-06-26 13:55:18
 */

import { Item } from '@/types'

// fileManager回调函数
export interface Operations {
  handleAddSelected: (item: Item) => void
  handleUnsetSelected: () => void
  handleInverseSelected: () => void
  handleSelectAll: () => void
  handleGotoParent: () => void
  handleGoBackWard: () => void
  handleGoForWard: () => void
  handleCopy: () => void
  handleCut: () => void
  handlePaste: () => void
  handleSetMainFolder: (value: string, history?: boolean) => void
  handleDelete: () => void
  handleEmptyFolder: () => void
  handleNewFile: () => void
  handleNewFolder: () => void
  handleRename: () => void
  handleReload: () => void
  handleDuplicate: () => void
  handleCreateZip: () => void
  handleExtractZip: () => void
  handlePreview: () => void
  handleGetInfo: () => void
  handleReturnCallBack: (item: any) => boolean
  handleUpload: () => void
  handleEditImage: () => void
  handleEditText: () => void
  handleDownload: () => void
  handleFullExpand: () => void
  handleViewChange: (type: any) => void
  handleDragEnd: (result: any) => void
}

// dialog
export interface Popup {
  title: string
  description: string
  handleClose: null | (() => void)
  handleSubmit: null | (() => void)
  nameInputSets: {
    label?: string
    value?: string
    callBack?: (value: string) => void
  }
}

// 按钮
export interface ButtonType {
  title: string
  icon: string
  disable?: boolean

  // todo 这个多种多样 先用any代替
  onClick: any
}

// 由ButtonType组成的二维数组
export interface AviableButtons {
  topbar: Array<ButtonType[]>
  file: Array<ButtonType[]>
  container: Array<ButtonType[]>
}

// 图片编辑dialog
export interface EditImage {
  open: boolean
  closeCallBack: undefined | (() => void)
  submitCallback: undefined | ((imageData: string, asNew: boolean) => void)
  name: string
  path: string
  extension: string
}
