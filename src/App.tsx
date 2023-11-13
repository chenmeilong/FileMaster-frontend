/**
 * @author MilesChen
 * @description App.tsx
 * @createDate 2023-01-15 13:26:05
 */

import React from 'react'
import FileManager from './FileManager/FileManager'

const App: React.FC = () => {
  const debugCallBack = (filePath: string) => {
    console.log('debug callBack:', filePath)
  }
  return (
    <div>
      <FileManager height="580" debugCallBack={debugCallBack} />
    </div>
  )
}

export default App
