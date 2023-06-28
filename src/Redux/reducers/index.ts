import { combineReducers } from 'redux'
import filemanagerReducers from './filemanager'

const reducer = combineReducers({
  filemanager: filemanagerReducers
})

export default reducer
