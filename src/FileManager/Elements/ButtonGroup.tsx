import React from 'react'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

// todo 修复any 让点击事件的回调函数，添加类型定义
type Props = {
  buttons: {
    name: string
    icon: string
    label: string
    class: string
    onClick: () => void
  }[]
}

const InputField: React.FC<Props> = ({ buttons }) => {
  const buttonsComponents = buttons.map((button, i) => (
    <Button
      className={`customIconButton ${button.class}`}
      key={i}
      variant={'contained'}
      color={'primary'}
      startIcon={<Icon className={button.icon}></Icon>}
      onClick={() => button.onClick()}
    >
      {button.label}
    </Button>
  ))
  return (
    <ButtonGroup variant="text" color="primary">
      {buttonsComponents}
    </ButtonGroup>
  )
}

export default InputField
