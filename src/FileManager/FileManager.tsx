import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Operations, Messages } from './types'
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
  clearBufferFiles
} from '../Redux/actions'
import { Paper, Grid, Box, Collapse } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import FolderBar from './FolderBar'
import TopBar from './TopBar'
import ContainerBar from './ContainerBar'
import PopupDialog from './Elements/PopupDialog'
import config from '@/Data/FilesConfig'
import mainconfig from '../Data/Config'
import { convertDate, formatBytes } from '../Utils/Utils'
import ImageEditor from './Elements/ImageEditor'
import PerfectScrollbar from 'react-perfect-scrollbar'
import './Assets/PerfectScroll.css'
import { Popup, EditImage } from './types'
import { Store, Item, BufferedItems, History, Steps } from '@/types'

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

const messagesListInital: Messages[] = []
const editImageInital: EditImage = {
  open: false,
  closeCallBack: undefined,
  submitCallback: undefined,
  name: '',
  path: '',
  extension: ''
}

type Props = {
  height: string
  selectCallback: (filePath: string) => void

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
}

const FileManager: React.FC<Props> = ({
  height,
  selectCallback,

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
  clearBufferFiles
}) => {
  const classes = useStyles()
  height = height !== undefined || height > 300 ? `${height}px` : '300px' //580px
  const bigHeight = `${window.innerHeight - 100}px` //622px
  // 提示信息的配置
  const [messagesList, setMessages] = useState(messagesListInital)
  // isloading是什么样的状态
  const [isloading, setLoading] = React.useState(false)
  // 通过状态后面控制启动
  const [uploadBox, setuploadBox] = React.useState(false)
  const [expand, setExpand] = React.useState(false)
  const selecMessages =
    selectedFiles.length > 0 || bufferedItems.files.length > 0 // false

  const [editImage, setEditImage] = React.useState(editImageInital)

  const [popupData, setPopup] = useState({
    open: false
  })

  // index需要跳转的位置
  // historyInfo跳转位置的值
  const handlingHistory = (historyInfo: Steps, index: number) => {
    setHistoryIndex(index) // 修改store中的history的当前选择的index
    unsetSelectedFiles() // 清除当前选择文件
    switch (
      historyInfo.action //明明就只有这一种可能还是添加了switch判断 ,方便以后扩展
    ) {
      case 'folderChange':
        operations.handleSetMainFolder(historyInfo.path, true)
        break
      default:
        break
    }
  }
  // 关闭弹窗
  const handleClose = () => {
    setPopup({
      open: false
    })
  }
  // 弹窗
  const handleClickPopupOpen = (data: Popup) => {
    setPopup({
      ...data,
      open: true
    })
  }

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
    // 复制文件名字到buffer
    handleCopy: () => {
      copyToBufferFiles()
      setMessages([
        {
          title: `File Successfully Copied`,
          type: 'info',
          message: 'You can paste it in any folder',
          timer: 3000
        }
      ])
    },
    // 剪切文件到buffer
    handleCut: () => {
      cutToBufferFiles()
      setMessages([
        {
          title: `File Successfully Cut`,
          type: 'info',
          message: 'You can paste it in any folder',
          timer: 3000
        }
      ])
    },
    // 粘贴
    handlePaste: () => {
      const files = bufferedItems.files.map((item) => item.path)

      pasteFiles(files, bufferedItems.type, selectedFolder)
        .then(() => {
          operations.handleReload()
          setMessages([
            {
              title: `File Successfully Pasted`,
              type: 'success',
              message: 'You can paste it in any folder',
              timer: 3000
            }
          ])
        })
        .catch((error: any) => {
          setMessages([
            {
              title: `Error happened while paste items`,
              type: 'error',
              message: error.message
            }
          ])
        })
    },
    // 跳转到指定路径
    // value路径名称,history是否需不包含当前跳转的路径 false包含当前路径  true不包含当前路径
    // todo可以简化去掉
    handleSetMainFolder: (value, history = false) => {
      unsetSelectedFiles()
      setSelectedFolder(value, history)
      getFilesList(value).then(() => {
        // 这里的result是api的then后的返回值  有些不理解，这里应该要强行记住或者看源码
        setMessages([
          {
            title: `File Successfully Loaded`,
            type: 'success',
            message: 'You can paste it in any folder',
            timer: 3000
          }
        ])
      })
    },
    // 删除选择文件或者文件夹
    handleDelete: () => {
      const files = selectedFiles.map((item) => item.path)
      const handleDeleteSubmit = () => {
        setPopup({
          open: false
        })
        deleteItems(files)
          .then(() => {
            unsetSelectedFiles()
            operations.handleReload()
            setMessages([
              {
                title: `Delete files and folders request`,
                type: 'success',
                message: 'All files and folders successfully deleted'
              }
            ])
          })
          .catch((error: any) => {
            setMessages([
              {
                title: `Error happened while removing`,
                type: 'error',
                message: error.message
              }
            ])
          })
      }

      handleClickPopupOpen({
        title: `Deleting selected files and folders: ${selectedFiles.length} items `,
        description: `All selected files and folder will remove without recover`,
        handleClose: handleClose,
        handleSubmit: handleDeleteSubmit,
        nameInputSets: {}
      })
    },
    // 清空当前文件夹
    handleEmptyFolder: () => {
      const path = selectedFolder

      const handleEmptySubmit = () => {
        setPopup({
          open: false
        })

        emptydir(path)
          .then(() => {
            unsetSelectedFiles()
            operations.handleReload()
            setMessages([
              {
                title: `Empty folder request`,
                type: 'success',
                message: 'All files and folders successfully removed'
              }
            ])
          })
          .catch((error: any) => {
            setMessages([
              {
                title: `Error happened while empty folder`,
                type: 'error',
                message: error.message
              }
            ])
          })
      }

      handleClickPopupOpen({
        title: `Deleting all files and folders in ${path}`,
        description: `All files and folder will remove without recover`,
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
        setPopup({
          open: false
        })
        createNewFile(selectedFolder, fileName)
          .then(() => {
            operations.handleReload()
          })
          .catch((error: any) => {
            setMessages([
              {
                title: `Error happened while creating file`,
                type: 'error',
                message: error.message
              }
            ])
          })
      }

      handleClickPopupOpen({
        title: `Creating new file`,
        description:
          'Only allowed file extensions can be created. Otherwise will be ignored by server.',
        handleClose: handleClose,
        handleSubmit: handleNewFileSubmit,
        nameInputSets: {
          label: 'File Name',
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
        setPopup({
          open: false
        })
        createNewFolder(selectedFolder, folderName)
          .then(() => {
            operations.handleReload()
          })
          .catch((error: any) => {
            setMessages([
              {
                title: `Error happened while creating folder`,
                type: 'error',
                message: error.message
              }
            ])
          })
      }

      handleClickPopupOpen({
        title: `Creating new folder`,
        description:
          'Dont use spaces, localised symbols or emojies. This can affect problems',
        handleClose: handleClose,
        handleSubmit: handleNewFolderSubmit,
        nameInputSets: {
          label: 'Folder Name',
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
        setPopup({
          open: false
        })
        renameFiles(item.path, renameTxt)
          .then(() => {
            unsetSelectedFiles()
            operations.handleReload()
          })
          .catch((error: any) => {
            setMessages([
              {
                title: `Error happened while rename`,
                type: 'error',
                message: error.message
              }
            ])
          })
      }

      handleClickPopupOpen({
        title: `Renaming of ${item.name}`,
        handleClose: handleClose,
        handleSubmit: handleRenameSubmit,
        nameInputSets: {
          label: 'Folder Name',
          value: renameTxt,
          callBack: handleRenameChange
        }
      })
    },
    // 重载 当前目录文件和文件夹树
    handleReload: () => {
      setLoading(true)
      setMessages([
        {
          title: `Wait While Reloading`,
          type: 'info',
          message: '',
          progress: true,
          disableClose: true
        }
      ])
      getFilesList(selectedFolder)
      getFoldersList().then(() => {
        setLoading(false)
        setMessages([])
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
        .catch((error: any) => {
          setMessages([
            {
              title: `Error happened while duplicate`,
              type: 'error',
              message: error.message
            }
          ])
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
        setPopup({
          open: false
        })
        archive(files, destination, name)
          .then(() => {
            operations.handleReload()
            unsetSelectedFiles()
          })
          .catch((error: any) => {
            setMessages([
              {
                title: `Error happened while creating archive`,
                type: 'error',
                message: error.message
              }
            ])
          })
      }

      handleClickPopupOpen({
        title: `Creating new archive`,
        description:
          'Create a new archive with all selected files. If there is already file with this name it will replace',
        handleClose: handleClose,
        handleSubmit: handleArchiveSubmit,
        nameInputSets: {
          label: 'Archive Name',
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
        setPopup({
          open: false
        })
        unzip(file, destination)
          .then(() => {
            operations.handleReload()
            unsetSelectedFiles()
          })
          .catch((error: any) => {
            setMessages([
              {
                title: `Error happened while extraction archive`,
                type: 'error',
                message: error.message
              }
            ])
          })
      }

      handleClickPopupOpen({
        title: `Extract all files from archive to ${destination}`,
        description:
          'All files will extracted. If they are existed in folder alreadt they will replaced.',
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
        title: `File: ${file.name}`,
        description: `<img src="${mainconfig.serverPath}${file.path}" />`,
        handleClose: handleClose,
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
        title: `File: ${file.name}`,
        description,
        handleClose: handleClose,
        nameInputSets: {}
      })
    },
    // 预留位置 暂无使用
    handleReturnCallBack: (item) => {
      if (selectCallback) {
        selectCallback(item)
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
                setMessages([
                  {
                    title: `Image successfully saved`,
                    type: 'info',
                    message:
                      'Changes may not be visible because of cache. Please update the page'
                  }
                ])
              })
              .catch((error: any) => {
                // console.log(error:any)
              })
          })
          .catch((error: any) => {
            setMessages([
              {
                title: `Error happened while saving image`,
                type: 'error',
                message: error.message
              }
            ])
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
    // 编辑文本文件 todo
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
    // 拖动事件,拖动结束触发，目前还有些问题todo 不稳定容易报错
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
        //todo这里添加更多的校检可以解决报错问题,比如文件不能拖入文件内,文件夹不能拖入文件内
        if (destination !== undefined && files.length !== 0) {
          pasteFiles(files, 'cut', destination)
            .then(() => {
              operations.handleReload()
              setMessages([
                {
                  title: `File Successfully Moved`,
                  type: 'success',
                  message: 'File that you dragged successfully moved',
                  timer: 3000
                }
              ])
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
      title: 'Copy',
      icon: 'icon-copy',
      onClick: operations.handleCopy,
      disable: !(selectedFiles.length > 0)
    },
    cut: {
      title: 'Cut',
      icon: 'icon-scissors',
      onClick: operations.handleCut,
      disable: !(selectedFiles.length > 0)
    },
    paste: {
      title: 'Paste',
      icon: 'icon-paste',
      onClick: operations.handlePaste,
      disable: !(bufferedItems.files.length > 0)
    },
    delete: {
      title: 'Delete',
      icon: 'icon-trash',
      onClick: operations.handleDelete,
      disable: !(selectedFiles.length > 0)
    },
    emptyFolder: {
      title: 'Empty Folder',
      icon: 'icon-delete-folder',
      onClick: operations.handleEmptyFolder
    },
    rename: {
      title: 'Rename',
      icon: 'icon-text',
      onClick: operations.handleRename,
      disable: !(selectedFiles.length === 1)
    },
    newFile: {
      title: 'Few File',
      icon: 'icon-add',
      onClick: operations.handleNewFile
    },
    newFolder: {
      title: 'New Folder',
      icon: 'icon-add-folder',
      onClick: operations.handleNewFolder
    },
    goForwad: {
      title: 'Forwad',
      icon: 'icon-forward',
      onClick: operations.handleGoForWard,
      disable: !(history.currentIndex + 1 < history.steps.length)
    },
    goParent: {
      title: 'Go to parent folder',
      icon: 'icon-backward',
      onClick: operations.handleGotoParent,
      disable: selectedFolder === foldersList?.path
    },
    goBack: {
      title: 'Back',
      icon: 'icon-backward',
      onClick: operations.handleGoBackWard,
      disable: !(history.currentIndex > 0)
    },
    selectAll: {
      title: 'Select all',
      icon: 'icon-add-3',
      onClick: operations.handleSelectAll,
      disable: !(selectedFiles.length !== filesList.length)
    },
    selectNone: {
      title: 'Select none',
      icon: 'icon-cursor',
      onClick: operations.handleUnsetSelected,
      disable: selectedFiles.length === 0
    },
    inverseSelected: {
      title: 'Invert selection',
      icon: 'icon-refresh',
      onClick: operations.handleInverseSelected,
      disable: !(
        selectedFiles.length !== filesList.length && selectedFiles.length > 0
      )
    },
    // 预留位置
    selectFile: {
      title: 'Select file',
      icon: 'icon-outbox',
      onClick: operations.handleReturnCallBack,
      disable: typeof selectCallback === 'undefined'
    },
    reload: {
      title: 'Reload',
      icon: 'icon-refresh',
      onClick: operations.handleReload
    },
    dubplicate: {
      title: 'Duplicate',
      icon: 'icon-layers',
      onClick: operations.handleDuplicate,
      disable: !(selectedFiles.length === 1)
    },
    // todo
    editFile: {
      title: 'Edit File',
      icon: 'icon-pencil',
      onClick: operations.handleEditText,
      disable: !(selectedFiles.length === 1 && checkSelectedFileType('text'))
    },

    editImage: {
      title: 'Resize & Rotate',
      icon: 'icon-paint-palette',
      onClick: operations.handleEditImage,
      disable: !(selectedFiles.length === 1 && checkSelectedFileType('image'))
    },
    createZip: {
      title: 'Create archive',
      icon: 'icon-zip',
      onClick: operations.handleCreateZip,
      disable: !(selectedFiles.length > 0)
    },
    extractZip: {
      title: 'Extract files from archive',
      icon: 'icon-zip-1',
      onClick: operations.handleExtractZip,
      disable: !(selectedFiles.length === 1 && checkSelectedFileType('archive'))
    },
    uploadFile: {
      title: 'Upload Files',
      icon: 'icon-cloud-computing',
      onClick: operations.handleUpload
    },
    // todo
    searchFile: {
      title: 'Search File',
      icon: 'icon-search'
      // onClick: operations.handleSearchFile
    },
    // todo
    saveFile: {
      title: 'Save Changes',
      icon: 'icon-save'
      // onClick: operations.handleSaveFileChanges
    },
    preview: {
      title: 'View',
      icon: 'icon-view',
      onClick: operations.handlePreview,
      disable: !(selectedFiles.length === 1 && checkSelectedFileType('image'))
    },
    getInfo: {
      title: 'Get Info',
      icon: 'icon-information',
      onClick: operations.handleGetInfo,
      disable: !(selectedFiles.length === 1)
    },
    download: {
      title: 'Download File',
      icon: 'icon-download-1',
      onClick: operations.handleDownload,
      disable: !(selectedFiles.length === 1 && checkSelectedFileType('file')) //文件才能下载文件夹不能下载
    },
    gridView: {
      title: 'Grid view',
      icon: 'icon-layout-1',
      // 这样写是因为这里不用调用operations.handleViewChange('grid')就直接调用了
      onClick: () => operations.handleViewChange('grid'),
      disable: itemsView === 'grid'
    },
    listView: {
      title: 'List View',
      icon: 'icon-layout-2',
      onClick: () => operations.handleViewChange('list'),
      disable: itemsView === 'list'
    },
    fullScreen: {
      title: 'Full Screen',
      icon: expand ? 'icon-minimize' : 'icon-resize',
      onClick: operations.handleFullExpand
    }
  }
  // 顶部菜单，item右键菜单，空白区域右键菜单
  const aviableButtons = {
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
  // render执行完后执行这个，用于初始化只执行一次
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
        {/* 通用对话框  ...popupData解构对象*/}
        {popupData.open && <PopupDialog {...popupData} />}
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
                  messages={messagesList}
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
                    <b>{selectedFiles.length}</b> items are selected
                  </div>
                )}
                {bufferedItems.files.length > 0 && (
                  <div className="text">
                    <b>{bufferedItems.files.length}</b>{' '}
                    {bufferedItems.type === 'cut' ? 'cuted' : 'copied'} items in
                    buffer
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        clearBufferFiles()
                      }}
                    >
                      Clear
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
    clearBufferFiles
  }
)(FileManager)

export default FileManagerConnect
