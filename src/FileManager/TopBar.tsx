import React from 'react'
import { connect } from 'react-redux'
import { setSorting, filterSorting, setImagesSettings } from '../Redux/actions'
import { makeStyles } from '@material-ui/core/styles'
import TopBarButtonGroups from './Elements/TopBarButtonGroups'
import { Grid, Radio, Divider, FormControlLabel } from '@material-ui/core/'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import { Store } from '@/types'
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  container: {
    padding: '5px',
    borderBottom: '1px solid #868DAA',
    background: '#f6f7fd'
  },
  menuItem: {
    padding: '0px',
    fontSize: '13px',
    width: '250px',
    display: 'block',
    '& span': {
      fontSize: '13px'
    },
    '& label': {
      margin: '0px'
    },
    '& svg': {
      width: '15px'
    }
  }
}))

import { Order } from '@/types'
import { AviableButtons, ButtonType } from './types'

type Props = {
  buttons: AviableButtons
  filterSorting: any
  orderFiles: Order
  setImagesSettings: (imagePreview: string) => object
  setSorting: any
  showImages: string
}

const TopBar: React.FC<Props> = ({ buttons, orderFiles, showImages }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  // todo 搜索功能
  const [open, setOpen] = React.useState({
    sorting: false,
    search: false,
    settings: false
  })

  const handleOpenMenu = (
    event: { currentTarget: React.SetStateAction<null> },
    name: string
  ) => {
    switch (name) {
      case 'sorting':
        setOpen({ sorting: true, search: false, settings: false })
        break
      case 'search':
        setOpen({ sorting: false, search: true, settings: false })
        break
      case 'settings':
        setOpen({ sorting: false, search: false, settings: true })
        break

      default:
        break
    }
    // 定位到当前按钮附件
    setAnchorEl(event.currentTarget)
  }
  // 文件排序 升序或降序（todo可以性能优化）
  const handleSetOrderBy = (orderBy: string) => {
    setSorting(orderBy, orderFiles.field)
    filterSorting()
  }
  // 文件排序方式修改 名字、大小、日期
  const handleSetOrderField = (field: string) => {
    setSorting(orderFiles.orderBy, field)
    // 给 store中的filesList 排序
    filterSorting()
  }
  // 关闭弹窗
  const handleClose = () => {
    setAnchorEl(null)
    setOpen({ sorting: false, search: false, settings: false })
  }
  // 改变图片显示方式 是小原图还是图标  就修改了store中的内容
  const handleSetSettings = (imagePreview: string) => {
    setImagesSettings(imagePreview)
  }

  const options = [
    {
      name: 'By Name',
      value: 'name'
    },
    {
      name: 'By Size',
      value: 'size'
    },
    {
      name: 'By Create Date',
      value: 'date'
    }
  ]
  // 排序与设置
  const additionalButtons: ButtonType[] = [
    {
      title: 'Sorting',
      icon: 'icon-settings',
      onClick: (e: { currentTarget: React.SetStateAction<null> }) =>
        handleOpenMenu(e, 'sorting'),
      disable: false
    },
    {
      title: 'Settings',
      icon: 'icon-settings-1',
      onClick: (e: { currentTarget: React.SetStateAction<null> }) =>
        handleOpenMenu(e, 'settings'),
      disable: false
    }
  ]

  return (
    <Grid container className={classes.container}>
      {buttons.topbar.map((groups, index) => (
        <Grid item key={index}>
          {/* TopBar上的小区域 */}
          <TopBarButtonGroups buttons={groups} index={index} />
        </Grid>
      ))}

      <Grid style={{ marginLeft: 'auto' }}>
        <TopBarButtonGroups buttons={additionalButtons} index={0} />
        <Menu
          id="sorting-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(open.sorting)}
          onClose={handleClose}
        >
          {options.map((option, index) => (
            <MenuItem
              key={index}
              className={classes.menuItem}
              selected={option.value === orderFiles.field}
            >
              <FormControlLabel
                value={option.value}
                control={
                  <Radio
                    name="orderField"
                    checked={option.value === orderFiles.field}
                    onChange={() => handleSetOrderField(option.value)}
                    value={option.value}
                  />
                }
                label={option.name}
              />
            </MenuItem>
          ))}
          {/* 分割线 */}
          <Divider />
          <MenuItem
            className={classes.menuItem}
            selected={'asc' === orderFiles.orderBy}
          >
            <FormControlLabel
              control={
                <Radio
                  name="orderby"
                  checked={'asc' === orderFiles.orderBy}
                  onChange={() => handleSetOrderBy('asc')}
                  value="asc"
                />
              }
              label="Ascending"
            />
          </MenuItem>
          <MenuItem
            className={classes.menuItem}
            selected={'desc' === orderFiles.orderBy}
          >
            <FormControlLabel
              control={
                <Radio
                  name="orderby"
                  checked={'desc' === orderFiles.orderBy}
                  onChange={() => handleSetOrderBy('desc')}
                  value="desc"
                />
              }
              label="Descending"
            />
          </MenuItem>
        </Menu>

        {/*keepMounted表示组件将保持挂载在 DOM 树中，即使未显示。  
                        anchorEl用于定位菜单位置
                    */}
        <Menu
          id="settings-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(open.settings)}
          onClose={handleClose}
        >
          <MenuItem
            className={classes.menuItem}
            selected={showImages === 'thumbs'}
          >
            <FormControlLabel
              control={
                <Radio
                  name="imageSettings"
                  checked={showImages === 'thumbs'}
                  onChange={() => {
                    handleSetSettings('thumbs')
                  }}
                  value="thumbs"
                />
              }
              label="Show Thumbs"
            />
          </MenuItem>
          <MenuItem
            className={classes.menuItem}
            selected={showImages === 'icons'}
          >
            <FormControlLabel
              control={
                <Radio
                  name="imageSettings"
                  checked={showImages === 'icons'}
                  onChange={() => {
                    handleSetSettings('icons')
                  }}
                  value="icons"
                />
              }
              label="Show Icons"
            />
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  )
}

const TopBarConnect = connect(
  (store: Store) => ({
    showImages: store.filemanager.showImages,
    orderFiles: store.filemanager.orderFiles
  }),
  {
    setSorting,
    filterSorting,
    setImagesSettings
  }
)(TopBar)
export default TopBarConnect
