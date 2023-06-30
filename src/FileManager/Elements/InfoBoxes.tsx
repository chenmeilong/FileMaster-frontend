/**
 * @author MilesChen
 * @description message 消息提示组件
 * @createDate 2023-06-30 20:23:15
 */

import React from 'react'
import { connect } from 'react-redux'
import { Store, Messages } from '@/types'
import Alert from '@material-ui/lab/Alert'
import AlertTitle from '@material-ui/lab/AlertTitle'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles } from '@material-ui/core/styles'
import { setMessages } from '@/Redux/actions'
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

type Props = {
  // 消息
  messages: Messages[]
  setMessages: (message: Messages) => void
}

const InfoBoxes: React.FC<Props> = ({ messages, setMessages }) => {
  const classes = useStyles()
  const alert = messages[0]
  console.log(messages)

  const clearMessages = () => {
    // 清空消息
    setMessages({
      title: '',
      type: 'info',
      message: ''
    })
  }

  return (
    (messages.length > 0 ? true : null) && (
      <Collapse in={messages.length > 0}>
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
                onClick={clearMessages}
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
    )
  )
}

const InfoBoxesConnect = connect(
  (store: Store) => ({
    messages: store.common.messages
  }),
  { setMessages }
)(InfoBoxes)

export default InfoBoxesConnect
