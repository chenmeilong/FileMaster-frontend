import React from 'react'
import { connect } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Checkbox,
  Tooltip
} from '@material-ui/core'
import { Droppable, Draggable } from 'react-beautiful-dnd'
// 于处理条件性的类名或多个类名组合成一个字符串的情况
import clsx from 'clsx'

import { convertDate, formatBytes } from '../Utils/Utils'
import mainconfig from '@/Data/Config'
import config from '@/Data/FilesConfig'

import useStyles from './Elements/Styles'
import { Store, Item, BufferedItems } from '@/types'

type ItemProps = {
  item: Item
  index: number
}

type Props = {
  addSelect: (item: Item) => void
  bufferedItems: BufferedItems
  doubleClick: (value: string, history?: boolean) => void
  filesList: Item[]
  itemsView: 'list' | 'grid'
  onContextMenuClick: (event: {
    stopPropagation: () => void
    preventDefault: () => void
    clientX: number
    clientY: number
  }) => void
  selectedFiles: Item[]
  showImages: 'icons' | 'thumbs'
}

const ViewItems: React.FC<Props> = ({
  addSelect,
  bufferedItems,
  doubleClick,
  filesList,
  itemsView,
  onContextMenuClick,
  selectedFiles,
  showImages
}) => {
  // onContextMenuClick：右键菜单 addSelect：选择反选 其他三个都是store上的属性
  const classes = useStyles()
  // 获取图标，小图标
  const getThumb = (item: Item) => {
    try {
      // thumbs表示缩略图 注意图片才有缩略图
      if (
        showImages === 'thumbs' &&
        item.extension &&
        config.imageFiles.includes(item.extension)
      ) {
        return `${mainconfig.serverPath}${item.path}`
      } else {
        // 显示对应的图标
        if (item.extension === undefined) {
          throw new Error('no item.extension')
        } else {
          return item.extension in config.icons
            ? config.icons[item.extension]
            : config.icons.broken
        }
      }
    } catch (error) {
      // 没找到对应的下图标显示搜索图标
      return config.icons.broken
    }
  }
  // 右键菜单
  const handleContextMenuClick = async (
    item: Item,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    addSelect(item)
    onContextMenuClick(event)
  }
  // 是否选择当前文件或者文件夹
  const checkIsSelected = (item: Item) => {
    return selectedFiles.includes(item)
  }
  // 当前文件或者文件夹是否在剪切板还存在
  const isCuted = (item: Item) => {
    if (bufferedItems.type === 'cut') {
      return (
        bufferedItems.files.filter((file) => file.id === item.id).length > 0
      )
    }
    return false
  }

  function getStyle() {
    return {
      background: '#f00 !important'
    }
  }

  // 网格布局文件渲染
  const FileItem: React.FC<ItemProps> = ({ item, index }) => {
    const fileCuted = isCuted(item)
    const isSelected = checkIsSelected(item)

    return (
      <Draggable
        draggableId={item.id}
        index={index}
        isDragDisabled={item.private}
      >
        {(provided, snapshot) => (
          <Box
            // 使用div代替可以解决 todo 目前先注释
            // ref={provided.innerRef}
            onContextMenu={(event) => handleContextMenuClick(item, event)}
            className={clsx(classes.itemFile, {
              selected: selectedFiles.includes(item),
              selectmode: selectedFiles.length > 0,
              notDragging: !snapshot.isDragging,
              fileCuted: fileCuted
            })}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {/* true保护状态 不可拖动且会显示一把锁 且可选 */}
            {/* false非保护状态 可拖动，正常选择 */}
            {(item.private && (
              <span className={`icon-lock ${classes.locked}`} />
            )) || (
              <Checkbox
                className={classes.checkbox}
                checked={isSelected}
                onChange={() => addSelect(item)}
                value={item.id}
              />
            )}
            <span className={classes.extension}>{item.extension}</span>

            <div className={classes.infoBox}>
              <img src={getThumb(item)} />
            </div>
            {/* 鼠标放上显示tooltip全名 */}
            <Tooltip title={item.name}>
              <div className={classes.itemTitle}>
                <span>{item.name}</span>
              </div>
            </Tooltip>
          </Box>
        )}
      </Draggable>
    )
  }

  // 网格布局文件夹渲染
  const FolderItem: React.FC<ItemProps> = ({ item, index }) => {
    const fileCuted = isCuted(item)
    const isSelected = checkIsSelected(item)
    return (
      <Draggable
        index={index}
        draggableId={item.id}
        isDragDisabled={item.private}
      >
        {(provided, snapshot) => (
          <Box
            // 使用div代替可以解决 todo 目前先注释
            // ref={provided.innerRef}
            className={clsx(classes.itemFile, {
              selected: selectedFiles.includes(item),
              selectmode: selectedFiles.length > 0,
              notDragging: !snapshot.isDragging,
              fileCuted: fileCuted
            })}
            onDoubleClick={() => doubleClick(item.path)}
            onContextMenu={(event) => handleContextMenuClick(item, event)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Droppable
              droppableId={item.id}
              type="CONTAINERITEM"
              isCombineEnabled
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={getStyle()}
                >
                  {(item.private && (
                    <span className={`icon-lock ${classes.locked}`} />
                  )) || (
                    <Checkbox
                      className={classes.checkbox}
                      checked={isSelected}
                      onChange={() => addSelect(item)}
                      value={item.id}
                    />
                  )}
                  <div className={classes.infoBox}>
                    <img
                      src={
                        snapshot.isDraggingOver
                          ? config.icons.folderopen
                          : config.icons.folder
                      }
                    />
                  </div>
                  <Tooltip
                    title={
                      <>
                        <b>Name :</b> {item.name} <br />
                        <b>Created :</b> {convertDate(item.created)}
                      </>
                    }
                  >
                    <div className={classes.itemTitle}>
                      <span>{item.name}</span>
                    </div>
                  </Tooltip>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Box>
        )}
      </Draggable>
    )
  }
  // list文件夹渲染
  const ListFolderItem: React.FC<ItemProps> = ({ item, index }) => {
    // 实现剪切变透明，todo
    const fileCuted = isCuted(item)
    const isSelected = checkIsSelected(item)

    return (
      // 固定写法
      <Draggable index={index} draggableId={item.id}>
        {(provided) => (
          <TableRow
            ref={provided.innerRef}
            // 动态处理className
            className={clsx(classes.tableListRow, {
              selected: selectedFiles.includes(item),
              fileCuted: fileCuted,
              // 启动选择模式
              selectmodeTable: selectedFiles.length > 0
            })}
            onDoubleClick={() => doubleClick(item.path)}
            onContextMenu={(event) => handleContextMenuClick(item, event)}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Droppable
              droppableId={item.id}
              type="CONTAINERITEM"
              isCombineEnabled
            >
              {/* 用于获取拖动对象，因为要拖动时候实现图标转换，目前有些问题 todo 这里应该想文件一样不用嵌套这层内容*/}
              {(provided, snapshot) => (
                <>
                  <TableCell className={classes.tableCell}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => addSelect(item)}
                      value={item.id}
                    />
                  </TableCell>
                  <TableCell className={classes.tableCell}>
                    <img
                      style={{ width: '20px' }}
                      src={
                        snapshot.isDraggingOver
                          ? config.icons.folderopen
                          : config.icons.folder
                      }
                    />
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={getStyle()}
                    >
                      {item.name}
                      {provided.placeholder}
                    </div>
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    {formatBytes(item.size)}
                  </TableCell>
                  <TableCell className={classes.tableCell} align="left">
                    {convertDate(item.created)}
                  </TableCell>
                </>
              )}
            </Droppable>
          </TableRow>
        )}
      </Draggable>
    )
  }
  // list文件渲染
  const ListFileItem: React.FC<ItemProps> = ({ item, index }) => {
    const fileCuted = isCuted(item)
    const isSelected = checkIsSelected(item)

    return (
      <Draggable draggableId={item.id} index={index}>
        {(provided) => (
          <TableRow
            onContextMenu={(event) => handleContextMenuClick(item, event)}
            className={clsx(classes.tableListRow, {
              selected: selectedFiles.includes(item),
              fileCuted: fileCuted,
              selectmodeTable: selectedFiles.length > 0
            })}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <TableCell className={classes.tableCell}>
              <Checkbox
                checked={isSelected}
                onChange={() => addSelect(item)}
                value={item.id}
              />
            </TableCell>
            <TableCell className={classes.tableCell}>
              <img
                style={{ width: '20px', maxHeight: '30px' }}
                src={getThumb(item)}
              />
            </TableCell>
            <TableCell className={classes.tableCell} align="left">
              {item.name}
            </TableCell>
            <TableCell className={classes.tableCell} align="left">
              {formatBytes(item.size)}
            </TableCell>
            <TableCell className={classes.tableCell} align="left">
              {convertDate(item.created)}
            </TableCell>
          </TableRow>
        )}
      </Draggable>
    )
  }

  const ListView = () => {
    return (
      // TableContainer component={Box} 这样组合在一起为便于写css
      <TableContainer component={Box}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow className={classes.tableHead}>
              <TableCell style={{ width: '20px' }}></TableCell>
              <TableCell style={{ width: '35px' }} align="left"></TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell style={{ width: '100px' }} align="left">
                Size
              </TableCell>
              <TableCell style={{ width: '150px' }} align="left">
                Created
              </TableCell>
            </TableRow>
          </TableHead>
          {/* Droppable Draggable、ref={provided.innerRef} {...provided.droppableProps}这是固定写法 */}
          <Droppable
            droppableId="listDroppablContainer"
            type="CONTAINERITEM"
            isCombineEnabled
          >
            {(provided) => (
              <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                {/* 先渲染文件夹 */}
                {filesList.map(
                  (item, index) =>
                    item.type === 'folder' && (
                      <ListFolderItem key={index} index={index} item={item} />
                    )
                )}
                {/* 后渲染文件  */}
                {filesList.map(
                  (item, index) =>
                    item.type === 'file' && (
                      <ListFileItem key={index} index={index} item={item} />
                    )
                )}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </TableContainer>
    )
  }

  const GridView = () => {
    return (
      <div>
        <Droppable
          droppableId="mainDroppablContainer"
          type="CONTAINERITEM"
          isCombineEnabled
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {/* 先渲染文件夹 */}
              {filesList.map(
                (item, index) =>
                  item.type === 'folder' && (
                    <FolderItem key={index} index={index} item={item} />
                  )
              )}
              {/* 后渲染文件  */}
              {filesList.map(
                (item, index) =>
                  item.type === 'file' && (
                    <FileItem key={index} index={index} item={item} />
                  )
              )}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    )
  }
  return itemsView === 'grid' ? <GridView /> : <ListView />
}

const ViewItemsConnect = connect(
  (store: Store) => ({
    selectedFiles: store.filemanager.selectedFiles,
    bufferedItems: store.filemanager.bufferedItems,
    showImages: store.filemanager.showImages,
    itemsView: store.filemanager.itemsView,
    filesList: store.filemanager.filesList
  }),
  {}
)(ViewItems)
export default ViewItemsConnect
