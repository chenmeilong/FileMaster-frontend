import React, { useState } from 'react'
import { ListItem, List } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { Item } from '@/types'

type Props = {
  foldersList: Item
  onFolderClick: (value: string, history?: boolean) => void
  selectedFolder: string
}

const ContainerBar: React.FC<Props> = ({
  foldersList,
  onFolderClick,
  selectedFolder
}) => {
  const useStyles = makeStyles(() => ({
    root: {
      padding: '10px 0px',
      '& .folderItem': {
        display: 'block !important',
        width: '100%',
        margin: '0px !important',
        padding: '0px',
        fontSize: '13px',

        '& .folderTitle': {
          position: 'relative',
          '& .iconArrow': {
            position: 'absolute',
            left: '0px',
            top: '0px',
            fontSize: '10px',
            lineHeight: '17px',
            padding: '6px 5px'
          },
          '& .titleWrap': {
            display: 'block',
            width: '100%',
            padding: '5px 0px'
          },
          '& .title': {
            padding: '0px 0px 0px 7px'
          }
        },
        '& .MuiButtonBase-root': {
          padding: '0px 0px 0px 20px',
          borderRadius: '3px'
        },
        '& .folderSubmenu': {
          display: 'none',
          width: '100%',
          padding: '0px 0px 0px 10px !important',
          margin: '0px !important'
        },
        '&.active > .MuiButtonBase-root': {
          background: '#0492f2',
          color: '#fff'
        },
        '&.open > .folderSubmenu': {
          display: 'block'
        },
        '&.open > .MuiButtonBase-root .iconArrow': {
          transform: 'rotate(90deg)'
        }
      }
    }
  }))

  const classes = useStyles()
  return (
    <div className={classes.root} key={`folderRoot`}>
      {foldersList.name && (
        <MenuItem
          item={foldersList}
          onFolderClick={onFolderClick}
          currentUrl={selectedFolder}
        />
      )}
    </div>
  )
}

type MenuSubmenuProps = {
  item: Item
  currentUrl: string
  onFolderClick: (value: string, history?: boolean) => void
  parentItem?: Item
}
const MenuSubmenu: React.FC<MenuSubmenuProps> = ({
  currentUrl,
  item,
  onFolderClick
}) => {
  return (
    <List className="folderSubmenu">
      {item.children &&
        item.children.map((child, index) => (
          <React.Fragment key={index}>
            {child.name && (
              <MenuItem
                item={child}
                onFolderClick={onFolderClick}
                parentItem={item}
                currentUrl={currentUrl}
              />
            )}
          </React.Fragment>
        ))}
    </List>
  )
}

type MenuItemProps = {
  item: Item
  currentUrl: string
  onFolderClick: (value: string, history?: boolean) => void
  parentItem?: Item
}
const MenuItem: React.FC<MenuItemProps> = ({
  item,
  currentUrl,
  onFolderClick
}) => {
  const asideLeftLIRef = React.useRef<HTMLLIElement | null>(null)
  // item:根目录下的所有文件夹(这里的根目录是相对的，用到了递归)，
  // currentUrl：当前选择的目录，onFolderClick：点击文件夹的回调函数
  const [expand, setExpand] = useState(false) //当前目录是否已激活
  const mouseClick = () => {
    onFolderClick(item.path)
  }
  const handleExpand = () => {
    setExpand(!expand)
  }

  const isMenuItemIsActive = (item: Item) => {
    return currentUrl.indexOf(item.path) !== -1
  }

  // 检查当前文件夹是否激活，用于设置打开关闭文件夹ico
  const isActive = isMenuItemIsActive(item)

  return (
    <ListItem
      ref={asideLeftLIRef}
      className={clsx('folderItem', {
        open: (isActive && item.children) || expand,
        active: item.path === currentUrl
      })}
    >
      <ListItem button className="folderTitle">
        {/* 显示箭头号和点击箭头展开下拉 */}
        {item.children && item.children.length > 0 && (
          <i className="icon-next iconArrow" onClick={handleExpand} />
        )}
        <span className="titleWrap" onClick={mouseClick}>
          {isActive && item.children ? (
            <i className="icon-folder" />
          ) : (
            <i className="icon-folder-1" />
          )}
          <span className="title">{item.name}</span>
        </span>
      </ListItem>

      {item.children && item.children.length > 0 && (
        <MenuSubmenu
          item={item}
          onFolderClick={onFolderClick}
          parentItem={item}
          currentUrl={currentUrl}
        />
      )}
    </ListItem>
  )
}

export default ContainerBar
