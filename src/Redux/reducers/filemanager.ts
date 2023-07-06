/**
 * @author MilesChen
 * @description filemanager reducer
 * @createDate 2023-01-23 15:25:34
 */

import { Item, Order, BufferedItems } from '@/types'
import { ActionTypes } from '../store/types'
import filemanager from '../store/filemanager'

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
  MOVE_ITEM
} from '../actions'

// filemanager reducer
export default function reducer(state = filemanager, action: ActionTypes) {
  let bufferedItems: BufferedItems
  switch (action.type) {
    case SET_IMAGE_SETTINGS:
      // 使用 ...state 将原始状态对象的所有属性复制到新对象中。
      // 这样做的好处是没有直接修改原始状态对象，而是遵循了 Redux 的不可变性原则。这有助于确保状态管理更加高效且可预测。
      return { ...state, showImages: action.imagePreview }

    case RUN_SORTING_FILTER:
      // eslint-disable-next-line no-case-declarations
      const sortedFiles: Item[] = sortFilter(state.filesList, state.orderFiles)
      return { ...state, filesList: sortedFiles }

    case SET_SORT_ORDER_BY:
      return {
        ...state,
        orderFiles: {
          field: action.field,
          orderBy: action.orderBy
        }
      }

    case UNSET_SELECTED_FILES:
      return { ...state, selectedFiles: [] }
    //  选择或者取消选择当前文件
    case SET_SELECTED_FILES:
      // eslint-disable-next-line no-case-declarations
      let selectedFilesNew: Item[] = [...state.selectedFiles]
      // eslint-disable-next-line no-case-declarations
      const index: number = selectedFilesNew.indexOf(action.item)
      if (index !== -1) {
        selectedFilesNew.splice(index, 1)
      } else {
        selectedFilesNew = [...selectedFilesNew, action.item]
      }
      return { ...state, selectedFiles: selectedFilesNew }

    case SELECT_ALL_FILES:
      // eslint-disable-next-line no-case-declarations
      const newSelected: Item[] = state.filesList.reduce(function (
        result: Item[],
        file: Item
      ) {
        // 判断文件是否开启保护状态 保护状态的文件 不可拖动、不可选择
        if (file.private !== true) {
          result.push(file)
        }
        return result
      },
      [])
      return { ...state, selectedFiles: newSelected }

    // 反选
    case INVERSE_SELECTED_FILES:
      // 原来是 on^2时间复杂度，优化成on的时间复杂度（算法的应用）
      // eslint-disable-next-line no-case-declarations
      const set = new Set(
        state.selectedFiles.map((selectedFile) => selectedFile.id)
      )
      // eslint-disable-next-line no-case-declarations
      const inversedSelected: Item[] = state.filesList.reduce(
        (result: Item[], file: Item) => {
          if (!set.has(file.id)) {
            result.push(file)
          }
          return result
        },
        []
      )
      return { ...state, selectedFiles: inversedSelected }

    case COPY_FILES_TOBUFFER:
      bufferedItems = {
        type: 'copy',
        files: state.selectedFiles
      }
      return { ...state, bufferedItems, selectedFiles: [] }

    case CUT_FILES_TOBUFFER:
      bufferedItems = {
        type: 'cut',
        files: state.selectedFiles
      }
      return { ...state, bufferedItems, selectedFiles: [] }

    case CLEAR_FILES_TOBUFFER:
      bufferedItems = {
        type: '',
        files: []
      }
      return { ...state, bufferedItems }
    // 清空缓存,目前只接受一次粘贴
    case PASTE_FILES:
      bufferedItems = {
        type: '',
        files: []
      }
      return { ...state, bufferedItems }

    // 修改当前选择的文件夹和history访问记录
    case SET_SELECTED_FOLDER:
      // eslint-disable-next-line no-case-declarations
      const newHistory = { ...state.history }
      if (!action.history) {
        newHistory.steps.push({
          action: 'folderChange',
          path: action.path
        })
        newHistory.currentIndex =
          newHistory.steps.length === 0 ? 0 : newHistory.steps.length - 1
      }
      return { ...state, history: newHistory, selectedFolder: action.path }
    // 拿到API请求的当前路径下所有内容 更新到store
    case GET_FILES_LIST:
      // eslint-disable-next-line no-case-declarations
      let filesList = Array.isArray(action.data.children)
        ? action.data.children
        : []
      filesList = sortFilter(filesList, state.orderFiles)
      return { ...state, filesList }
    // 重新拿到文件夹tree
    case GET_FOLDERS_LIST:
      return { ...state, foldersList: action.data }
    // 修改history的index
    case SET_HISTORY_INDEX:
      // eslint-disable-next-line no-case-declarations
      const newHistoryIndex = { ...state.history }
      newHistoryIndex.currentIndex = action.index
      return { ...state, history: newHistoryIndex }

    case SET_ITEM_VIEW:
      return { ...state, itemsView: action.view }

    // 移动item
    case MOVE_ITEM:
      // eslint-disable-next-line no-case-declarations
      const item: Item = state.filesList[action.oldIndex]
      state.filesList.splice(action.oldIndex, 1)
      state.filesList.splice(action.newIndex, 0, item)
      return { ...state, filesList: [...state.filesList] }
    // 不做任何处理 需要loading 需要在此添加 case:xx_REQUEST 再做对应处理
    default:
      return state
  }
}

/**
 * 根据文件名、大小、创建日期(时间戳)，升序或者降序,文件夹始终在最前面
 * @param filesList 文件夹内的所有待排序的文件对象
 * @param forder 排序方式
 * @return 排序结果
 */
function sortFilter(filesList: Item[], order: Order): Item[] {
  switch (order.field) {
    case 'name':
      filesList.sort(function (a: Item, b: Item) {
        const x = a.name.toLowerCase()
        const y = b.name.toLowerCase()
        if (x < y) {
          return -1
        }
        if (x > y) {
          return 1
        }
        return 0
      })
      break
    case 'size':
      filesList.sort(function (a: Item, b: Item) {
        // 访问可选属性 如果是undefined则给与默认值0
        return (a.size ?? 0) - (b.size ?? 0)
      })
      break
    case 'date':
      filesList.sort(function (a: Item, b: Item) {
        return new Date(a.created).getTime() - new Date(b.created).getTime()
      })
      break
    default:
      break
  }
  filesList = order.orderBy === 'asc' ? filesList : filesList.reverse()
  // 文件夹放在最前
  const folder: Item[] = []
  const file: Item[] = []
  filesList.forEach((item) => {
    if (item.type === 'file') file.push(item)
    else folder.push(item)
  })
  return [...folder, ...file]
}
