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
  CLEAR_FILES_TOBUFFER
} from '../actions'

//  todo 从action中引入过来给这类型定义
export default function reducer(state = filemanager, action: ActionTypes) {
  let bufferedItems: BufferedItems
  switch (action.type) {
    case SET_IMAGE_SETTINGS:
      // 使用 ...state 将原始状态对象的所有属性复制到新对象中。
      // 这样做的好处是我们没有直接修改原始状态对象，而是遵循了 Redux 的不可变性原则。这有助于确保状态管理更加高效且可预测。
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
        /* true私有保护状态 不可拖动且会显示一把锁 且可选 
                       false非私有保护状态 可拖动，正常选择
                       这里文件如果是私有的的，就不能全选他
                    */
        if (file.private !== true) {
          result.push(file)
        }
        return result
      },
      [])
      return { ...state, selectedFiles: newSelected }

    // 反选
    case INVERSE_SELECTED_FILES:
      // 这里是原来是 on^2时间复杂度，可以优化成on的时间负责度（算法的应用）
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
    // 清空缓存,目前只接收一次粘贴
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
      let filesList = Array.isArray(action.data.children ?? 0)
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

    default:
      return state
  }
}

// 更加文件名、大小、创建日期(时间戳)，升序或者降序
// 返回排序好的数组
function sortFilter(filesList: Item[], order: Order): Item[] {
  let sortedFiles: Item[] = []
  switch (order.field) {
    case 'name':
      sortedFiles = filesList.sort(function (a: Item, b: Item) {
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
      sortedFiles = filesList.sort(function (a: Item, b: Item) {
        // 访问可选属性 如果是undefined则给与默认值0
        return (a.size ?? 0) - (b.size ?? 0)
      })
      break

    case 'date':
      sortedFiles = filesList.sort(function (a: Item, b: Item) {
        return new Date(a.created).getTime() - new Date(b.created).getTime()
      })
      break

    default:
      sortedFiles = filesList
      break
  }
  return order.orderBy === 'asc' ? sortedFiles : sortedFiles.reverse()
}
