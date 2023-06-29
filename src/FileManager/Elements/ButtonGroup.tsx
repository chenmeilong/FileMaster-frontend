/**
 * @author MilesChen
 * @description 图片编辑按钮组 todo 与 ButtonGroupSimple.tsx文件合并为一个组件
 * @createDate 2023-02-13 20:37:09
 */

import React from 'react'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

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
