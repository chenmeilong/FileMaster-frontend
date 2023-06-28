import React, { useEffect, useRef } from 'react'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles } from '@material-ui/core/styles'
import { Messages } from '../types'

const useStyles = makeStyles(() => ({
  root: {
    margin: '0px 0px 10px 0px'
  },
  title: {
    fontSize: '14px'
  },
  message: {
    fontSize: '12px',
    margin: '0',
    padding: '0'
  },
  progress: {
    width: '100%',
    marginTop: '-15px',
    marginBottom: '10px'
  }
}))

// 上次更新的的消息内容
function usePrevious(value: Messages) {
  const ref = useRef<Messages>()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

type Props = {
  alert: Messages
}

// 包含title、type、message、timer
const InfoBoxes: React.FC<Props> = ({ alert }) => {
  const [open, setOpen] = React.useState(true)
  const prevAlert = usePrevious(alert)
  const classes = useStyles()
  const timerRef = useRef<number>()

  useEffect(() => {
    if (prevAlert !== alert) {
      setOpen(true)
    }
  }, [alert, prevAlert])

  // 到时间自动关闭弹窗
  useEffect(() => {
    if (alert.timer) {
      timerRef.current = window.setTimeout(() => {
        setOpen(false)
      }, alert.timer)
    }
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [alert.timer])

  return (
    <>
      <Collapse in={open}>
        <Alert
          key={alert.type}
          className={classes.root}
          severity={alert.type}
          // 是否启用关闭按钮消息提示按钮
          action={
            !alert.disableClose && (
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false)
                }}
              >
                <span className="icon-cancel"></span>
              </IconButton>
            )
          }
        >
          <AlertTitle className={classes.title}>{alert.title}</AlertTitle>
          <p className={classes.message}>{alert.message}</p>
        </Alert>
        {alert.progress && <LinearProgress className={classes.progress} />}
      </Collapse>
    </>
  )
}

export default InfoBoxes
