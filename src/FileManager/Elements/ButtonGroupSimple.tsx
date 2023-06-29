import React from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  iconStyle: {
    paddingRight: '10px'
  },
  button: {
    fontSize: '12px'
  }
}))

// 上传文件下方的按钮组件
type Props = {
  buttons: {
    name: string
    icon: string
    label: string
    class?: string
    type?: string
    disabled?: boolean
    onClick: () => void
  }[]
}
const ButtonGroupSimple: React.FC<Props> = ({ buttons }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        {buttons.map((button, index) => {
          return (
            <Button
              key={index}
              className={classes.button}
              onClick={button.onClick}
              disabled={Boolean(button.disabled)}
            >
              {button.icon && (
                <span className={`${button.icon} ${classes.iconStyle}`}></span>
              )}
              {button.label}
            </Button>
          )
        })}
      </ButtonGroup>
    </div>
  )
}

export default ButtonGroupSimple
