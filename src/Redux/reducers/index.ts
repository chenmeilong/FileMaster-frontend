/**
 * @author MilesChen
 * @description export reducer
 * @createDate 2023-01-23 15:23:18
 */

import { combineReducers } from 'redux'
import filemanagerReducers from './filemanager'

const reducer = combineReducers({
  filemanager: filemanagerReducers
})

export default reducer
