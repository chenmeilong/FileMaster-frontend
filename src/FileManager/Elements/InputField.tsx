import React, { ChangeEvent } from 'react'
import { TextField, TextFieldProps } from '@material-ui/core'

type Props = {
  change: (value: string) => void
} & TextFieldProps

// 包含title、type、message、timer
const InputField: React.FC<Props> = ({ change, ...rest }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    change(event.target.value)
  }
  return <TextField fullWidth margin="none" onChange={handleChange} {...rest} />
}

export default InputField
