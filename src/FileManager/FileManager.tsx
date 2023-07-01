/**
 * @author MilesChen
 * @description 集成所有 FileManager 组件
 * @createDate 2023-01-15 17:13:28
 */

import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import {
  setSelectedFiles,
  inverseSelectedFiles,
  selectAllFiles,
  unsetSelectedFiles,
  copyToBufferFiles,
  cutToBufferFiles,
  pasteFiles,
  setSelectedFolder,
  getFilesList,
  getFoldersList,
  setHistoryIndex,
  renameFiles,
  createNewFile,
  createNewFolder,
  emptydir,
  deleteItems,
  dublicateItem,
  archive,
  unzip,
  saveimage,
  listViewChange,
  clearBufferFiles,
  setMessages
} from '../Redux/actions'
import { Paper, Grid, Box, Collapse } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import FolderBar from './FolderBar'
import TopBar from './TopBar'
import ContainerBar from './ContainerBar'
import PopupDialog from './Elements/PopupDialog'
import mainconfig from '@/Data/Config'
import config from '@/Data/FilesConfig'
import { convertDate, formatBytes } from '../Utils/Utils'
import ImageEditor from './Elements/ImageEditor'
import PerfectScrollbar from 'react-perfect-scrollbar'
import './Assets/PerfectScroll.css'
import { Popup, EditImage, Operations } from './types'
import {
  Store,
  Item,
  BufferedItems,
  History,
  Messages,
  Steps,
  AxiosError
} from '@/types'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  folderSide: {
    flexGrow: 1,
    background: '#f9fafc',
    borderRight: '1px solid #E9eef9'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  fmMinimized: {},
  fmExpanded: {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '100%',
    width: '100%',
    zIndex: 999,
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.7)'
  },
  containerWrapper: {
    position: 'relative'
  },
  infoMessages: {
    position: 'absolute',
    width: '100%',
    bottom: '0',
    left: '0',
    padding: '10px 20px',
    fontSize: '13px',
    background: '#fff',
    textAlign: 'center',
    borderTop: '1px solid #E9eef9'
  }
}))

const editImageInital: EditImage = {
  open: false,
  closeCallBack: undefined,
  submitCallback: undefined,
  name: '',
  path: '',
  extension: ''
}
const popupDataInital: { open: boolean; popup: Popup } = {
  open: false,
  popup: {
    title: '',
    description: '',
    handleClose: null,
    handleSubmit: null,
    nameInputSets: {}
  }
}

type Props = {
  height: string
  debugCallBack: (filePath: string) => void

  selectedFiles: Item[]
  selectedFolder: string
  bufferedItems: BufferedItems
  foldersList: Item | null
  filesList: Item[]
  itemsView: 'list' | 'grid'
  history: History

  setSelectedFiles: (item: Item) => void
  unsetSelectedFiles: () => void
  inverseSelectedFiles: () => void
  selectAllFiles: () => void
  copyToBufferFiles: () => void
  cutToBufferFiles: () => void
  // todo Promise 返回值为Promise<any>下面会报错，暂时先any
  pasteFiles: (items: string[], type: string, destination: string) => any
  setSelectedFolder: (path: string, history: boolean) => any
  getFoldersList: () => any
  getFilesList: (path: string) => any
  setHistoryIndex: (index: number) => void
  renameFiles: (path: string, newname: string) => any
  createNewFile: (path: string, file: string) => any
  createNewFolder: (path: string, folder: string) => any
  emptydir: (path: string) => any
  deleteItems: (items: string[]) => any
  dublicateItem: (path: string) => any
  archive: (files: string[], destination: string, name: string) => any
  saveimage: (file: string, path: string, isnew: boolean) => any
  unzip: (file: string, destination: string) => any
  listViewChange: (view: string) => void
  clearBufferFiles: () => void
  setMessages: (message: Messages) => void
}

const FileManager: React.FC<Props> = ({
  height,
  debugCallBack,

  selectedFiles,
  selectedFolder,
  bufferedItems,
  foldersList,
  filesList,
  itemsView,
  history,

  setSelectedFiles,
  unsetSelectedFiles,
  inverseSelectedFiles,
  selectAllFiles,
  copyToBufferFiles,
  cutToBufferFiles,
  pasteFiles,
  setSelectedFolder,
  getFoldersList,
  getFilesList,
  setHistoryIndex,
  renameFiles,
  createNewFile,
  createNewFolder,
  emptydir,
  deleteItems,
  dublicateItem,
  archive,
  saveimage,
  unzip,
  listViewChange,
  clearBufferFiles,
  setMessages
}) => {
  const classes = useStyles()
  height = height !== undefined || height > 300 ? `${height}px` : '300px' //580px
  const bigHeight = `${window.innerHeight - 100}px` //622px
  // isloading状态 有白色遮罩层
  const [isloading, setLoading] = React.useState(false)
  // uploadBox状态 文件上传窗口状态, 通过状态后面控制启动
  const [uploadBox, setuploadBox] = React.useState(false)
  // 全屏 状态
  const [expand, setExpand] = React.useState(false)
  // 当前是否选着有文件或者缓存文件
  const selecMessages =
    selectedFiles.length > 0 || bufferedItems.files.length > 0
  // 图片编辑 状态管理
  const [editImage, setEditImage] = React.useState(editImageInital)
  // message 状态管理
  const [popupData, setPopup] = React.useState(popupDataInital)

  /**
   * 跳转到指定路径
   * @param historyInfo 跳转位置的值
   * @param index 需要跳转的位置
   * @return void
   */
  const handlingHistory = (historyInfo: Steps, index: number) => {
    setHistoryIndex(index) // 修改store中的history的当前选择的index
    unsetSelectedFiles() // 清除当前选择文件
    switch (historyInfo.action) {
      case 'folderChange':
        operations.handleSetMainFolder(historyInfo.path, true)
        break
      default:
        break
    }
  }
  // 关闭弹窗
  const handleClose = () => {
    setPopup((state) => {
      // 踩坑 深度copy才能响应
      state.open = false
      state = { ...state }
      return state
    })
  }
  // 设置弹窗内容
  const handleClickPopupOpen = (data: Popup) => {
    setPopup({
      popup: data,
      open: true
    })
  }
  // Operations操作大集合
  const operations: Operations = {
    // 文件对象
    handleAddSelected: (item) => {
      setSelectedFiles(item)
    },
    // 全不选
    handleUnsetSelected: () => {
      unsetSelectedFiles()
    },
    // 反选
    handleInverseSelected: () => {
      inverseSelectedFiles()
    },
    // 全选
    handleSelectAll: () => {
      selectAllFiles()
    },
    // 回到根路径 foldersList.path就是根路径
    handleGotoParent: () => {
      unsetSelectedFiles()
      operations.handleSetMainFolder(foldersList?.path || '/')
    },
    // 后退
    handleGoBackWard: () => {
      const historyIndex =
        history.currentIndex > 0 ? history.currentIndex - 1 : 0
      const historyInfo = history.steps[historyIndex]
      handlingHistory(historyInfo, historyIndex)
    },
    // 前进
    handleGoForWard: () => {
      const len = history.steps.length
      const historyIndex =
        history.currentIndex < len - 1 ? history.currentIndex + 1 : len - 1
      const historyInfo = history.steps[historyIndex]
      handlingHistory(historyInfo, historyIndex)
    },
    // 复制到buffer
    handleCopy: () => {
      copyToBufferFiles()
      setMessages({
        title: `文件复制成功`,
        type: 'info',
        message: '您可以把它粘贴到任何文件夹中',
        timer: 3000
      })
    },
    // 剪切到buffer
    handleCut: () => {
      cutToBufferFiles()
      setMessages({
        title: `文件剪切成功`,
        type: 'info',
        message: '您可以把它粘贴到任何文件夹中',
        timer: 3000
      })
    },
    // 粘贴
    handlePaste: () => {
      const files = bufferedItems.files.map((item) => item.path)

      pasteFiles(files, bufferedItems.type, selectedFolder)
        .then(() => {
          operations.handleReload()
          setMessages({
            title: `文件成功粘贴`,
            type: 'success',
            message: '',
            timer: 3000
          })
        })
        .catch((error: AxiosError) => {
          setMessages({
            title: `粘贴时发生了错误`,
            type: 'error',
            message: error.message || ''
          })
        })
    },

    /**
     * 跳转到指定路径
     * @param value value路径名称
     * @param history history是否需记录当前跳转的路径 false包含当前路径  true不包含当前路径
     * @return void
     */
    handleSetMainFolder: (value, history = false) => {
      unsetSelectedFiles()
      setSelectedFolder(value, history)
      getFilesList(value).then(() => {
        setMessages({
          title: `文件加载成功`,
          type: 'success',
          message: '',
          timer: 3000
        })
      })
    },
    // 删除选择文件或者文件夹
    handleDelete: () => {
      const files = selectedFiles.map((item) => item.path)
      const handleDeleteSubmit = () => {
        setPopup((state) => {
          state.open = false
          return state
        })
        deleteItems(files)
          .then(() => {
            unsetSelectedFiles()
            operations.handleReload()
            setMessages({
              title: `文件已删除`,
              type: 'success',
              message: ''
            })
          })
          .catch((error: AxiosError) => {
            setMessages({
              title: `删除时发生错误`,
              type: 'error',
              message: error.message || ''
            })
          })
      }

      handleClickPopupOpen({
        title: `删除选定内容`,
        description: `所有选定的文件和文件夹将被删除而无法恢复 `,
        handleClose: handleClose,
        handleSubmit: handleDeleteSubmit,
        nameInputSets: {}
      })
    },
    // 清空当前文件夹
    handleEmptyFolder: () => {
      const path = selectedFolder

      const handleEmptySubmit = () => {
        setPopup((state) => {
          state.open = false
          return state
        })

        emptydir(path)
          .then(() => {
            unsetSelectedFiles()
            operations.handleReload()
            setMessages({
              title: `已成功清空当前路径下的所有内容`,
              type: 'success',
              message: ''
            })
          })
          .catch((error: AxiosError) => {
            setMessages({
              title: `清空文件夹时发生错误`,
              type: 'error',
              message: error.message || ''
            })
          })
      }

      handleClickPopupOpen({
        title: `删除目录中的所有内容: ${path}`,
        description: `所有文件和文件夹将删除且不可恢复 `,
        handleClose: handleClose,
        handleSubmit: handleEmptySubmit,
        nameInputSets: {}
      })
    },
    // 新建txt文件
    handleNewFile: () => {
      let fileName = 'new_file.txt'
      const handleNewFileChange = (value: string) => {
        fileName = value
      }
      const handleNewFileSubmit = () => {
        setPopup((state) => {
          state.open = false
          return state
        })
        createNewFile(selectedFolder, fileName)
          .then(() => {
            operations.handleReload()
          })
          .catch((error: AxiosError) => {
            setMessages({
              title: `创建文件时发生错误`,
              type: 'error',
              message: error.message || ''
            })
          })
      }

      handleClickPopupOpen({
        title: `新建文件`,
        description: '只能创建允许的文件类型,否则将被服务器忽略.',
        handleClose: handleClose,
        handleSubmit: handleNewFileSubmit,
        nameInputSets: {
          label: '文件名',
          value: fileName,
          callBack: handleNewFileChange
        }
      })
    },
    // 新建文件夹
    handleNewFolder: () => {
      let folderName = 'newfolder'
      // 这里使用到了闭包特性。所以函数中能访问到这个folderName
      const handleNewFolderChange = (value: string) => {
        folderName = value
      }
      const handleNewFolderSubmit = () => {
        setPopup((state) => {
          state.open = false
          return state
        })
        createNewFolder(selectedFolder, folderName)
          .then(() => {
            operations.handleReload()
          })
          .catch((error: AxiosError) => {
            setMessages({
              title: `创建文件夹时发生错误`,
              type: 'error',
              message: error.message || ''
            })
          })
      }

      handleClickPopupOpen({
        title: `新建文件夹`,
        description: "不要使用'<>/\\|:\"*?.'等特殊字符",
        handleClose: handleClose,
        handleSubmit: handleNewFolderSubmit,
        nameInputSets: {
          label: '文件夹名',
          value: folderName,
          callBack: handleNewFolderChange
        }
      })
    },
    // 文件或者文件夹重命名
    handleRename: () => {
      const item = selectedFiles[0]
      let renameTxt = item.name
      // 这里使用到了闭包特性。所以函数中能访问到这个renameTxt
      const handleRenameChange = (value: string) => {
        renameTxt = value
      }
      const handleRenameSubmit = () => {
        setPopup((state) => {
          state.open = false
          return state
        })
        renameFiles(item.path, renameTxt)
          .then(() => {
            unsetSelectedFiles()
            operations.handleReload()
          })
          .catch((error: AxiosError) => {
            setMessages({
              title: `重命名时发生错误`,
              type: 'error',
              message: error.message || ''
            })
          })
      }
      // ?????
      handleClickPopupOpen({
        title: `重命名 ${item.name}`,
        description: '',
        handleClose: handleClose,
        handleSubmit: handleRenameSubmit,
        nameInputSets: {
          label: '文件名称',
          value: renameTxt,
          callBack: handleRenameChange
        }
      })
    },
    // 重载 当前目录文件和文件夹树
    handleReload: () => {
      setLoading(true)
      setMessages({
        title: `加载中...`,
        type: 'info',
        message: '',
        progress: true,
        disableClose: true
      })
      getFilesList(selectedFolder)
      getFoldersList().then(() => {
        setLoading(false)
      })
    },
    // 快速复制一个文件或文件夹
    handleDuplicate: () => {
      const item = selectedFiles[0]
      dublicateItem(item.path)
        .then(() => {
          unsetSelectedFiles()
          operations.handleReload()
        })
        .catch((error: AxiosError) => {
          setMessages({
            title: `复制时发生错误`,
            type: 'error',
            message: error.message || ''
          })
        })
    },
    // 创建压缩包
    handleCreateZip: () => {
      let name = 'archive_name'
      const files = selectedFiles.map((item) => item.path)
      const destination = selectedFolder
      const handleArchiveChange = (value: string) => {
        name = value
      }
      const handleArchiveSubmit = () => {
        setPopup((state) => {
          state.open = false
          return state
        })
        archive(files, destination, name)
          .then(() => {
            operations.handleReload()
            unsetSelectedFiles()
          })
          .catch((error: AxiosError) => {
            setMessages({
              title: `创建压缩包时发生错误`,
              type: 'error',
              message: error.message || ''
            })
          })
      }

      handleClickPopupOpen({
        title: `创建压缩文件`,
        description:
          '创建一个包含所有选定文件的压缩包。如果已存在同名文件，将进行替换。',
        handleClose: handleClose,
        handleSubmit: handleArchiveSubmit,
        nameInputSets: {
          label: '压缩包名称',
          value: name,
          callBack: handleArchiveChange
        }
      })
    },
    // 解压缩
    handleExtractZip: () => {
      const file = selectedFiles[0].path
      const destination = selectedFolder
      const handleArchiveSubmit = () => {
        setPopup((state) => {
          state.open = false
          return state
        })
        unzip(file, destination)
          .then(() => {
            operations.handleReload()
            unsetSelectedFiles()
          })
          .catch((error: AxiosError) => {
            setMessages({
              title: `解压时发生错误`,
              type: 'error',
              message: error.message || ''
            })
          })
      }

      handleClickPopupOpen({
        title: `解压缩 ${destination}`,
        description:
          '解压到当前文件夹。 如果它们已经存在于文件夹中，它们将被替换。 ',
        handleClose: handleClose,
        handleSubmit: handleArchiveSubmit,
        nameInputSets: {}
      })
    },
    // 图片预览
    handlePreview: () => {
      const file = selectedFiles[0]
      unsetSelectedFiles()
      handleClickPopupOpen({
        title: `图片: ${file.name}`,
        description: `<img src="${mainconfig.serverPath}${file.path}" />`,
        handleClose: handleClose,
        handleSubmit: null,
        nameInputSets: {}
      })
    },
    // 文件详情
    handleGetInfo: () => {
      const file = selectedFiles[0]
      const isImage = checkSelectedFileType('image')
      unsetSelectedFiles()
      const description = `
                <ul class="list">
                    <li><b>Name</b> : ${file.name}</li>
                    <li><b>Path</b> : ${file.path}</li>
                    ${
                      file.type === 'file'
                        ? `<li><b>Size</b> : ${formatBytes(
                            file?.size || 0
                          )}</li>
                    <li><b>Extension</b> : ${file.extension}</li>`
                        : ''
                    }
                    <li><b>Created</b> : ${convertDate(file.created)}</li>
                    <li><b>Modified</b> : ${convertDate(file.modified)}</li>
                    <li><b>Permissions</b> : Others - ${
                      file.premissions.others
                    }, Group - ${file.premissions.group}, Owner - ${
        file.premissions.owner
      }</li>
                </ul>
                ${
                  isImage
                    ? `<img src="${mainconfig.serverPath}${file.path}" />`
                    : ''
                }
            `
      handleClickPopupOpen({
        title: `文件: ${file.name}`,
        description,
        handleClose: handleClose,
        handleSubmit: null,
        nameInputSets: {}
      })
    },
    // 预留位置 暂无使用
    handleReturnCallBack: (item) => {
      if (debugCallBack) {
        debugCallBack(item)
      }
      return true
    },
    // 上传文件 就改变了状态
    handleUpload: () => {
      setuploadBox(!uploadBox)
      setLoading(!isloading)
    },
    // 编辑图片
    handleEditImage: () => {
      const item = selectedFiles[0]
      const fullpath = `${mainconfig.serverPath}${item.path}`
      const closeCallBack = () => {
        setEditImage({
          open: false,
          closeCallBack: undefined,
          submitCallback: undefined,
          name: '',
          path: '',
          extension: ''
        })
      }
      const submitCallback = (imageData: string, asNew: boolean) => {
        setEditImage({
          open: false,
          closeCallBack: undefined,
          submitCallback: undefined,
          name: '',
          path: '',
          extension: ''
        })
        saveimage(imageData, item.path, asNew)
          .then(() => {
            unsetSelectedFiles()
            getFilesList(selectedFolder)
              .then(() => {
                setMessages({
                  title: `图片保存成功`,
                  type: 'info',
                  message: '由于缓存,可能没及时更新,请更新页面 '
                })
              })
              .catch((error: AxiosError) => {
                console.log(error)
              })
          })
          .catch((error: AxiosError) => {
            setMessages({
              title: `保存图像时发生错误`,
              type: 'error',
              message: error.message || ''
            })
          })
      }
      setEditImage({
        open: true,
        closeCallBack,
        submitCallback,
        name: item.name,
        path: fullpath,
        extension: item.extension || ''
      })
    },
    // todo 编辑文本文件
    handleEditText: () => {
      console.log('text Edit todo')
    },
    // 下载文件
    // 某些浏览器可能会阻止通过 window.open() 打开的新窗口。所以使用 <a> 标签的 download 属性。创建一个看不见的a标签，再删掉他
    handleDownload: () => {
      const file = selectedFiles[0]
      const downloadLink = document.createElement('a')
      downloadLink.href = `${mainconfig.serverPath}${file.path}`
      downloadLink.target = '_blank'
      downloadLink.style.display = 'none'
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    },
    // 全屏
    handleFullExpand: () => {
      setExpand(!expand)
    },
    // 当前文件夹显示方式 网格还是列表
    handleViewChange: (type) => {
      listViewChange(type)
    },
    // 拖动事件,拖动结束触发，目前还有些问题 todo
    // result 由拖动模块提供
    handleDragEnd: (result) => {
      setLoading(!isloading)
      try {
        let files: string[] = []
        let destination
        filesList.forEach((file) => {
          // result.draggableId被拖动元素的唯一标识符（ID）
          if (file.id === result.draggableId) {
            files = [file.path]
          }
          // result.destination.droppableId  目标区域（容器）的唯一标识符。
          if (file.id === result.destination.droppableId) {
            destination = file.path
          }
        })
        //todo 这里添加更多的校检可以解决报错问题,比如文件不能拖入文件内,文件夹不能拖入文件内
        if (destination !== undefined && files.length !== 0) {
          pasteFiles(files, 'cut', destination)
            .then(() => {
              operations.handleReload()
              setMessages({
                title: `文件移动成功`,
                type: 'success',
                message: '您拖动的文件已成功移动',
                timer: 3000
              })
            })
            .catch(() => {
              console.log('#####################')
            })
        }
      } catch (error) {
        console.log('#####################')
      }
      setLoading(!isloading)
      console.log('Drag ended', result)
    }
  }

  // 检测文件类型
  const checkSelectedFileType = (type: string) => {
    try {
      switch (type) {
        case 'text':
          return config.textFiles.includes(selectedFiles[0].extension || '')
        case 'archive':
          return config.archiveFiles.includes(selectedFiles[0].extension || '')

        case 'image':
          return config.imageFiles.includes(selectedFiles[0].extension || '')

        case 'file':
          return selectedFiles[0].type === 'file'

        default:
          return false
      }
    } catch (error) {
      return false
    }
  }

  const allButtons = {
    copy: {
      title: '复制',
      icon: 'icon-copy',
      onClick: operations.handleCopy,
      disable: !(selectedFiles.length > 0)
    },
    cut: {
      title: '剪切',
      icon: 'icon-scissors',
      onClick: operations.handleCut,
      disable: !(selectedFiles.length > 0)
    },
    paste: {
      title: '粘贴',
      icon: 'icon-paste',
      onClick: operations.handlePaste,
      disable: !(bufferedItems.files.length > 0)
    },
    delete: {
      title: '删除',
      icon: 'icon-trash',
      onClick: operations.handleDelete,
      disable: !(selectedFiles.length > 0)
    },
    emptyFolder: {
      title: '清空',
      icon: 'icon-delete-folder',
      onClick: operations.handleEmptyFolder
    },
    rename: {
      title: '重命名',
      icon: 'icon-text',
      onClick: operations.handleRename,
      disable: !(selectedFiles.length === 1)
    },
    newFile: {
      title: '新建文件',
      icon: 'icon-add',
      onClick: operations.handleNewFile
    },
    newFolder: {
      title: '新建文件夹',
      icon: 'icon-add-folder',
      onClick: operations.handleNewFolder
    },
    goForwad: {
      title: '前进',
      icon: 'icon-forward',
      onClick: operations.handleGoForWard,
      disable: !(history.currentIndex + 1 < history.steps.length)
    },
    goParent: {
      title: '根目录',
      icon: 'icon-backward',
      onClick: operations.handleGotoParent,
      disable: selectedFolder === foldersList?.path
    },
    goBack: {
      title: '后退',
      icon: 'icon-backward',
      onClick: operations.handleGoBackWard,
      disable: !(history.currentIndex > 0)
    },
    selectAll: {
      title: '全选',
      icon: 'icon-add-3',
      onClick: operations.handleSelectAll,
      disable: !(selectedFiles.length !== filesList.length)
    },
    selectNone: {
      title: '取消',
      icon: 'icon-cursor',
      onClick: operations.handleUnsetSelected,
      disable: selectedFiles.length === 0
    },
    inverseSelected: {
      title: '反选',
      icon: 'icon-refresh',
      onClick: operations.handleInverseSelected,
      disable: !(
        selectedFiles.length !== filesList.length && selectedFiles.length > 0
      )
    },
    // 预留位置
    selectFile: {
      title: '选择',
      icon: 'icon-outbox',
      onClick: operations.handleReturnCallBack,
      disable: typeof debugCallBack === 'undefined'
    },
    reload: {
      title: '刷新',
      icon: 'icon-refresh',
      onClick: operations.handleReload
    },
    dubplicate: {
      title: '快速复制',
      icon: 'icon-layers',
      onClick: operations.handleDuplicate,
      disable: !(selectedFiles.length === 1)
    },
    // todo
    editFile: {
      title: '文本编辑',
      icon: 'icon-pencil',
      onClick: operations.handleEditText,
      disable: !(selectedFiles.length === 1 && checkSelectedFileType('text'))
    },

    editImage: {
      title: '图片编辑',
      icon: 'icon-paint-palette',
      onClick: operations.handleEditImage,
      disable: !(selectedFiles.length === 1 && checkSelectedFileType('image'))
    },
    createZip: {
      title: '压缩',
      icon: 'icon-zip',
      onClick: operations.handleCreateZip,
      disable: !(selectedFiles.length > 0)
    },
    extractZip: {
      title: '解压',
      icon: 'icon-zip-1',
      onClick: operations.handleExtractZip,
      disable: !(selectedFiles.length === 1 && checkSelectedFileType('archive'))
    },
    uploadFile: {
      title: '上传',
      icon: 'icon-cloud-computing',
      onClick: operations.handleUpload
    },
    // todo
    searchFile: {
      title: '搜索文件',
      icon: 'icon-search'
      // onClick: operations.handleSearchFile
    },
    // todo
    saveFile: {
      title: '保存',
      icon: 'icon-save'
      // onClick: operations.handleSaveFileChanges
    },
    preview: {
      title: '预览',
      icon: 'icon-view',
      onClick: operations.handlePreview,
      disable: !(selectedFiles.length === 1 && checkSelectedFileType('image'))
    },
    getInfo: {
      title: '详情',
      icon: 'icon-information',
      onClick: operations.handleGetInfo,
      disable: !(selectedFiles.length === 1)
    },
    download: {
      title: '下载',
      icon: 'icon-download-1',
      onClick: operations.handleDownload,
      disable: !(selectedFiles.length === 1 && checkSelectedFileType('file')) //文件才能下载文件夹不能下载
    },
    gridView: {
      title: '网格布局',
      icon: 'icon-layout-1',
      // 这样写是因为这里不用调用operations.handleViewChange('grid')就直接调用了
      onClick: () => operations.handleViewChange('grid'),
      disable: itemsView === 'grid'
    },
    listView: {
      title: '排列布局',
      icon: 'icon-layout-2',
      onClick: () => operations.handleViewChange('list'),
      disable: itemsView === 'list'
    },
    fullScreen: {
      title: '全屏',
      icon: expand ? 'icon-minimize' : 'icon-resize',
      onClick: operations.handleFullExpand
    }
  }
  const aviableButtons = {
    // 顶部菜单
    topbar: [
      [allButtons.goBack, allButtons.goForwad, allButtons.goParent],
      [
        allButtons.newFile,
        allButtons.newFolder,
        allButtons.uploadFile,
        allButtons.reload
      ],
      [
        allButtons.copy,
        allButtons.cut,
        allButtons.paste,
        allButtons.delete,
        allButtons.emptyFolder,
        allButtons.dubplicate
      ],
      [allButtons.rename, allButtons.editImage],
      [allButtons.inverseSelected, allButtons.selectNone, allButtons.selectAll],
      [allButtons.createZip, allButtons.extractZip],
      [
        allButtons.preview,
        allButtons.getInfo,
        allButtons.selectFile,
        allButtons.download
      ],
      [allButtons.gridView, allButtons.listView, allButtons.fullScreen]
    ],
    // item右键菜单
    file: [
      [
        allButtons.copy,
        allButtons.cut,
        allButtons.paste,
        allButtons.delete,
        allButtons.dubplicate
      ],
      [allButtons.rename, allButtons.editImage],
      [allButtons.createZip, allButtons.extractZip],
      [
        allButtons.preview,
        allButtons.getInfo,
        allButtons.selectFile,
        allButtons.download
      ]
    ],
    // 空白区域右键菜单
    container: [
      [allButtons.goBack, allButtons.goForwad, allButtons.goParent],
      [
        allButtons.newFile,
        allButtons.newFolder,
        allButtons.emptyFolder,
        allButtons.uploadFile,
        allButtons.reload
      ],
      [allButtons.inverseSelected, allButtons.selectNone, allButtons.selectAll],
      [allButtons.gridView, allButtons.listView, allButtons.fullScreen]
    ]
  }
  // 初始化只执行一次
  useEffect(() => {
    getFilesList('')
    getFoldersList().then((result: any) => {
      setSelectedFolder(result.data.path, true)
    })
  }, [getFilesList, getFoldersList, setSelectedFolder])
  return (
    <div className={expand ? classes.fmExpanded : classes.fmMinimized}>
      {/* 设置paper边框 */}
      <Paper>
        {/* 通用对话框 */}
        {popupData.open && <PopupDialog {...popupData.popup} />}
        {/* 图像编辑 */}
        {editImage.open && <ImageEditor {...editImage} />}
        <TopBar buttons={aviableButtons} />
        <Grid container>
          <Grid item xs={3} sm={2} className={classes.folderSide}>
            <PerfectScrollbar>
              <div style={{ maxHeight: expand ? bigHeight : height }}>
                {foldersList && (
                  <FolderBar
                    foldersList={foldersList}
                    onFolderClick={operations.handleSetMainFolder}
                    selectedFolder={selectedFolder}
                  />
                )}
              </div>
            </PerfectScrollbar>
          </Grid>
          <Grid className={classes.containerWrapper} item xs={9} sm={10}>
            <PerfectScrollbar>
              <div style={{ maxHeight: expand ? bigHeight : height }}>
                <ContainerBar
                  buttons={aviableButtons}
                  isloading={isloading}
                  uploadBox={uploadBox}
                  operations={operations}
                />
              </div>
            </PerfectScrollbar>
            {/* 底部消息显示 */}
            <Collapse in={selecMessages}>
              <Box className={classes.infoMessages}>
                {selectedFiles.length > 0 && (
                  <div className="text">
                    <b>{selectedFiles.length}</b> 个目标选择
                  </div>
                )}
                {bufferedItems.files.length > 0 && (
                  <div className="text">
                    <b>{bufferedItems.files.length}</b>{' '}
                    {bufferedItems.type === 'cut' ? '剪切' : '复制'}{' '}
                    个文件在缓存
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        clearBufferFiles()
                      }}
                    >
                      清除
                    </a>
                  </div>
                )}
              </Box>
            </Collapse>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}

const FileManagerConnect = connect(
  (store: Store) => ({
    selectedFiles: store.filemanager.selectedFiles,
    selectedFolder: store.filemanager.selectedFolder,
    bufferedItems: store.filemanager.bufferedItems,
    foldersList: store.filemanager.foldersList,
    filesList: store.filemanager.filesList,
    itemsView: store.filemanager.itemsView,
    history: store.filemanager.history
  }),
  {
    setSelectedFiles,
    unsetSelectedFiles,
    inverseSelectedFiles,
    selectAllFiles,
    copyToBufferFiles,
    cutToBufferFiles,
    pasteFiles,
    setSelectedFolder,
    getFoldersList,
    getFilesList,
    setHistoryIndex,
    renameFiles,
    createNewFile,
    createNewFolder,
    emptydir,
    deleteItems,
    dublicateItem,
    archive,
    saveimage,
    unzip,
    listViewChange,
    clearBufferFiles,
    setMessages
  }
)(FileManager)

export default FileManagerConnect
