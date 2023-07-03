/**
 * @author MilesChen
 * @description 文件夹内容显示组件
 * @createDate 2023-01-30 17:34:04
 */

import React from 'react'
import { connect } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
  // 选择反选
  addSelect: (item: Item) => void
  bufferedItems: BufferedItems
  doubleClick: (value: string, history?: boolean) => void
  filesList: Item[]
  itemsView: 'list' | 'grid'
  // 右键点击事件 todo 与浏览器冲突
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
      // 没找到则显示搜索图标
      return config.icons.broken
    }
  }

  function getIcon(
    item: Item,
    combineTargetFor: string | null | undefined
  ): string {
    if (item.type === 'folder') {
      return combineTargetFor ? config.icons.folderopen : config.icons.folder
    } else {
      return getThumb(item)
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

  // 网格布局文件夹渲染
  const GridItem: React.FC<ItemProps> = ({ item, index }) => {
    const fileCuted = isCuted(item)
    const isSelected = checkIsSelected(item)
    return (
      <Draggable
        draggableId={item.id}
        index={index}
        isDragDisabled={item.private}
      >
        {(provided, snapshot) => (
          <div
            onContextMenu={(event) => handleContextMenuClick(item, event)}
            className={clsx(classes.itemFile, {
              selected: selectedFiles.includes(item),
              selectmode: selectedFiles.length > 0,
              notDragging: !snapshot.isDragging,
              fileCuted: fileCuted
            })}
            ref={provided.innerRef}
            onDoubleClick={
              item.type === 'folder' ? () => doubleClick(item.path) : undefined
            }
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <div>
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
                <img src={getIcon(item, snapshot.combineTargetFor)} />
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
            </div>
          </div>
        )}
      </Draggable>
    )
  }
  // list文件渲染
  const ListItem: React.FC<ItemProps> = ({ item, index }) => {
    // todo 保护文件不可拖动
    const fileCuted = isCuted(item)
    const isSelected = checkIsSelected(item)

    return (
      <Draggable
        draggableId={item.id}
        index={index}
        isDragDisabled={item.private}
        // shouldRespectForcePress={false}
      >
        {(provided, snapshot) => (
          <TableRow
            onContextMenu={(event) => handleContextMenuClick(item, event)}
            // 动态处理className
            className={clsx(classes.tableListRow, {
              selected: selectedFiles.includes(item),
              dragging: snapshot.isDragging,
              fileCuted: fileCuted,
              selectmodeTable: selectedFiles.length > 0
            })}
            ref={provided.innerRef}
            onDoubleClick={
              item.type === 'folder' ? () => doubleClick(item.path) : undefined
            }
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <>
              <TableCell className={classes.checkBoxTableCell}>
                <Checkbox
                  checked={isSelected}
                  onChange={() => addSelect(item)}
                  value={item.id}
                />
              </TableCell>
              <TableCell className={classes.icoTableCell}>
                <img
                  style={{ width: '20px' }}
                  src={getIcon(item, snapshot.combineTargetFor)}
                />
              </TableCell>
              <TableCell className={classes.tableCell} align="left">
                <div>{item.name}</div>
              </TableCell>
              <TableCell className={classes.sizeTableCell} align="left">
                {formatBytes(item.size)}
              </TableCell>
              <TableCell className={classes.createTimeTableCell} align="left">
                {convertDate(item.created)}
              </TableCell>
            </>
          </TableRow>
        )}
      </Draggable>
    )
  }

  // List布局
  const ListView = () => {
    return (
      // TableContainer component={Paper} 在挖层包裹一层Paper其实并没没什么用
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow className={classes.tableHead}>
              <TableCell style={{ width: '20px' }}></TableCell>
              <TableCell style={{ width: '35px' }} align="left"></TableCell>
              <TableCell align="left">名称</TableCell>
              <TableCell style={{ width: '100px' }} align="left">
                大小
              </TableCell>
              <TableCell style={{ width: '150px' }} align="left">
                创建时间
              </TableCell>
            </TableRow>
          </TableHead>
          <Droppable
            droppableId="listDroppablContainer"
            type="CONTAINERITEM"
            isCombineEnabled
          >
            {(provided) => (
              <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                {filesList.map((item, index) => (
                  <ListItem key={index} index={index} item={item} />
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </TableContainer>
    )
  }

  // Grid布局
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
              {filesList.map((item, index) => (
                <GridItem key={index} index={index} item={item} />
              ))}
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
