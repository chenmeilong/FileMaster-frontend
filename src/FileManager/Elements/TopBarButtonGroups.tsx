/**
 * @author MilesChen
 * @description Topbar 按钮组
 * @createDate 2023-02-03 14:18:45
 */

import React from 'react'
import { Tooltip, Button, ButtonGroup } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ButtonType } from '../types'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  button: {
    fontSize: '14px',
    padding: '10px 5px',
    minWidth: '35px',
    background: '#fff',
    '& span': {}
  }
}))

type Props = {
  buttons: ButtonType[]
  index: number
}

const ButtonGroupSimple: React.FC<Props> = ({ buttons, index }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <ButtonGroup
        key={index}
        color="primary"
        aria-label="outlined primary button group"
      >
        {buttons.map((button, index) => {
          return button.disable ? (
            <Button
              key={index}
              className={classes.button}
              disabled={true}
              aria-haspopup="true"
            >
              {button.icon && <span className={`${button.icon}`}></span>}
            </Button>
          ) : (
            <Tooltip key={index} title={button.title} aria-label={button.title}>
              <Button
                className={classes.button}
                onClick={button.onClick}
                disabled={button.disable}
                aria-haspopup="true"
              >
                {button.icon && <span className={`${button.icon}`}></span>}
              </Button>
            </Tooltip>
          )
        })}
      </ButtonGroup>
    </div>
  )
}
export default ButtonGroupSimple
