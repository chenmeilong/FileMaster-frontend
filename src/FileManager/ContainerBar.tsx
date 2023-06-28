import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Menu, MenuItem, Divider, Box } from '@material-ui/core'
import { DragDropContext } from 'react-beautiful-dnd'
import { uploadFile } from '../Redux/actions'
import useStyles from './Elements/Styles'
import InfoBoxes from './Elements/InfoBoxes'
import Dropzone from './Elements/Dropzone'

import ViewItems from './ViewItems'
import { Store, Item } from '@/types'
import { Messages, ButtonType, AviableButtons, Operations } from './types'

interface ContextMenuInitial {
  mouseX: number | null
  mouseY: number | null
}
const contextMenuInital: ContextMenuInitial = {
  mouseX: null,
  mouseY: null
}

type Props = {
  messages: Messages[]
  operations: Operations
  isloading: boolean
  uploadBox: boolean
  buttons: AviableButtons
  selectedFolder: string
  uploadFile: any
}

const ContainerBar: React.FC<Props> = ({
  messages,
  operations,
  isloading,
  selectedFolder,
  uploadBox,
  buttons
}) => {
  // messages：提示信息配置
  // operations：所有操作的大集合
  // isloading：加载中
  // buttons：右键菜单
  const classes = useStyles()
  // item上的右键菜单信息
  const [itemContext, itemContexSet] = useState(contextMenuInital)
  // 空白区域的右键菜单信息
  const [contentContex, contentContexSet] = useState(contextMenuInital)
  // 选择取消选择 value：文件对象
  const handleAddSelected = (item: Item) => {
    operations.handleAddSelected(item)
  }
  // item上右键回调
  const handleItemContextClick = (event: {
    stopPropagation: () => void
    preventDefault: () => void
    clientX: number
    clientY: number
  }) => {
    event.stopPropagation()
    // 防止浏览器的默认菜单
    event.preventDefault()
    contentContexSet(contextMenuInital)
    itemContexSet({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4
    })
  }
  // 空白区域右键回调
  const handleContentContextClick = (event: {
    stopPropagation: () => void
    preventDefault: () => void
    clientX: number
    clientY: number
  }) => {
    event.stopPropagation()
    // 防止浏览器的默认菜单
    event.preventDefault()
    itemContexSet(contextMenuInital)
    contentContexSet({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4
    })
  }
  // 关闭菜单
  const handleContextClose = () => {
    itemContexSet(contextMenuInital)
    contentContexSet(contextMenuInital)
  }

  return (
    <Box className={classes.root}>
      {/* 消息提示窗体 多条提示消息就一条条显示 目前来看还是有些小问题todo  */}
      <div className={classes.messagesBox}>
        {messages.map(
          (alert: Messages, index: React.Key | null | undefined) => (
            <InfoBoxes key={index} alert={alert} />
          )
        )}
      </div>
      {/* 提示加载中的遮罩层 */}
      {isloading && (
        <Box className={classes.loadingBlock}>
          <div className="opaOverlaw"></div>
        </Box>
      )}
      {/* 上传文件窗体 */}
      {uploadBox && (
        <Dropzone
          currentFolder={selectedFolder}
          handleReload={operations.handleReload}
          uploadFile={uploadFile}
          handleCancel={operations.handleUpload}
        />
      )}
      {/* onContextMenu:空白区域右键单击菜单 */}
      <div
        className={classes.container}
        onContextMenu={handleContentContextClick}
      >
        {/* 拖放交互功能 */}
        <DragDropContext onDragEnd={operations.handleDragEnd}>
          <ViewItems
            onContextMenuClick={handleItemContextClick}
            doubleClick={operations.handleSetMainFolder}
            addSelect={handleAddSelected}
          />
        </DragDropContext>
      </div>

      {/* item上的右键菜单 */}
      <Menu
        keepMounted
        open={itemContext.mouseY !== null}
        className={classes.menu}
        onContextMenu={handleContextClose}
        onClose={handleContextClose}
        anchorReference="anchorPosition"
        anchorPosition={
          itemContext.mouseY !== null && itemContext.mouseX !== null
            ? { top: itemContext.mouseY, left: itemContext.mouseX }
            : undefined
        }
      >
        {buttons.file.map((buttonGroup: ButtonType[]) => [
          buttonGroup.map((button, index) => (
            <MenuItem
              key={index}
              disabled={button.disable}
              className={classes.menuItem}
              onClick={button.onClick}
            >
              <span className={`${button.icon}`}></span>
              {button.title}
            </MenuItem>
          )),
          <Divider />
        ])}
      </Menu>
      {/* 空白区域上的右键菜单 */}
      <Menu
        keepMounted
        open={contentContex.mouseY !== null}
        className={classes.menu}
        onContextMenu={handleContextClose}
        onClose={handleContextClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contentContex.mouseY !== null && contentContex.mouseX !== null
            ? { top: contentContex.mouseY, left: contentContex.mouseX }
            : undefined
        }
      >
        {buttons.container.map((buttonGroup: ButtonType[]) => [
          buttonGroup.map((button, index) => (
            <MenuItem
              key={index}
              disabled={button.disable}
              className={classes.menuItem}
              onClick={button.onClick}
            >
              <span className={`${button.icon}`}></span>
              {button.title}
            </MenuItem>
          )),
          <Divider />
        ])}
      </Menu>
    </Box>
  )
}

const ContainerBarConnect = connect(
  (store: Store) => ({
    selectedFolder: store.filemanager.selectedFolder
  }),
  {
    uploadFile
  }
)(ContainerBar)

export default ContainerBarConnect
