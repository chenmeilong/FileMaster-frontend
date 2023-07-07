/**
 * @author MilesChen
 * @description dialog会话框
 * @createDate 2023-02-05 10:23:15
 */

import React, { useState, forwardRef, Ref, ChangeEvent } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Zoom from '@material-ui/core/Zoom'
import { ZoomProps } from '@material-ui/core/Zoom'
import { Popup } from '../types'
import { TextField } from '@material-ui/core'
import useStyles from './Styles'
// 打开dialog 从小到大的动画效果
const Transition: any = forwardRef(function Transition(
  props: ZoomProps,
  ref: Ref<unknown>
) {
  return <Zoom in={true} ref={ref} {...props} />
})

const AlertDialogSlide: React.FC<Popup> = ({
  title,
  description,
  handleClose,
  handleSubmit,
  // 名称输入配置
  nameInputSets
}) => {
  const classes = useStyles()
  const nameValue =
    typeof nameInputSets.value !== undefined ? nameInputSets.value : ''
  // 文件名 状态 使用useState实现数据双向绑定
  const [renameText, setRenameText] = useState(nameValue)
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setRenameText(value)
    nameInputSets.callBack && nameInputSets.callBack(value)
  }
  return (
    handleClose && (
      <Dialog
        open={true}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        className="dialogBlock"
      >
        <DialogTitle className={classes.dialogTitle}>{title}</DialogTitle>
        <DialogContent>
          <div
            className={classes.dialogDescription}
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
          {nameInputSets.value && (
            <div className="form-group">
              <TextField
                fullWidth
                margin="none"
                onChange={handleNameChange}
                type="text"
                label={nameInputSets.label}
                value={renameText}
                variant="outlined"
              />
            </div>
          )}
        </DialogContent>

        <DialogActions className="dialogButtons">
          {handleClose && (
            <Button onClick={handleClose} variant="contained" color="primary">
              返回
            </Button>
          )}
          {handleSubmit && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="secondary"
            >
              确认
            </Button>
          )}
        </DialogActions>
      </Dialog>
    )
  )
}

export default AlertDialogSlide
