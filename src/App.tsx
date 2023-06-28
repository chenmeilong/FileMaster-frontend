import React from 'react'
import FileManager from './FileManager/FileManager'
import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
  createStyles({
    root: {}
  })
)

const App: React.FC = () => {
  // props上有五个属性和方法，其由Redux-react添加上去的 这里没写出来
  const classes = useStyles()

  // 自定义回调 暂未使用  todo考虑是否改为selectCallback用于调试
  const handleCallBack = (filePath: string) => {
    console.log('自定义回调 用于debug', filePath)
  }

  return (
    <div className={classes.root}>
      <FileManager height="580" selectCallback={handleCallBack} />
    </div>
  )
}

export default App
