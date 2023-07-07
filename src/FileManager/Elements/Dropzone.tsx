/**
 * @author MilesChen
 * @description 文件上传窗口 拖放实现文件上传
 * @createDate 2023-02-13 20:37:09
 */

import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useDropzone } from 'react-dropzone'
import { uploadFile } from '@/Redux/actions'
import { makeStyles } from '@material-ui/core/styles'
import ButtonList from './ButtonGroupSimple'
import { formatBytes } from '@/Utils/Utils'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1
  },
  acceptedFiles: {
    fontSize: '12px',
    padding: '0px',
    margin: '0px'
  },
  container: {
    position: 'absolute',
    zIndex: 55,
    top: '-1px',
    background: '#f6f7fd',
    border: '1px solid #868DAA',
    borderTop: 'none',
    borderRadius: '0px 0px 5px 5px',
    padding: '20px 40px',
    margin: '0px 0px 0px 50px',
    '& .dropzone': {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '50px 20px',
      borderWidth: '2px',
      borderRadius: '2px',
      borderStyle: 'dashed',
      backgroundColor: '#fff',
      margin: '10px 0px',
      color: '#bdbdbd',
      cursor: 'pointer',
      outline: 'none',
      transition: 'border .24s ease-in-out',
      '&:focus': {
        borderColor: '#0492f2'
      },
      '& p': {
        padding: '0px',
        margin: '0px'
      }
    }
  }
}))

// 上传文件下方的按钮组件
type Props = {
  // 当前路径
  currentFolder: string
  // 重载当前目录文件和文件夹树
  handleReload: () => void
  // 文件上传回调
  uploadFile: any
  // 取消上传事件
  handleCancel: () => void
}

interface FileWithPreview extends File {
  preview: string
}
const UploadFiles: React.FC<Props> = ({
  currentFolder,
  handleReload,
  uploadFile,
  handleCancel
}) => {
  const classes = useStyles()

  // 存放当前选择的文件对象 blob 但是里面新增了个属性 preview
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const { getRootProps, getInputProps } = useDropzone({
    // 只接收指定类型文件
    accept: { 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] },
    // 当用户拖放或选择文件时触发此回调函数
    onDrop: (acceptedFiles) => {
      // preview 属性添加到file对象中  URL.createObjectURL创建的一个临时 URL。这个 URL 可以作为文件预览（例如，显示图像）的来源
      const newfiles: FileWithPreview[] = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file)
        })
      )
      setFiles(newfiles)
    }
  })
  // 移除待上传文件
  const removeFile = (index: number) => {
    const newFiles: FileWithPreview[] = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)
  }
  // 待上传文件list显示
  const acceptedFiles = files.map((file: FileWithPreview, index: number) => (
    <li key={file.name}>
      {file.name} - {formatBytes(file.size)} ({' '}
      <a href="#" onClick={() => removeFile(index)}>
        <span>Remove</span>
      </a>
      )
    </li>
  ))
  // 上传提交事件
  const handleSubmitUpload = () => {
    const formData = new FormData()
    formData.append('path', currentFolder)
    files.map((file) => {
      // 如果第二个参数是文件对象，则有第三个可选参数为文件名
      formData.append('files', file, file.name)
    })

    uploadFile(formData).then(() => {
      handleReload()
      handleCancel()
    })
  }
  // 取消上传
  const handleCancelUpload = () => {
    handleCancel()
  }

  const buttons = [
    {
      name: 'submit',
      icon: 'icon-save',
      label: '上传',
      class: 'green',
      onClick: handleSubmitUpload,
      disabled: !(files.length > 0)
    },
    {
      name: 'submit',
      icon: 'icon-ban',
      label: '返回',
      type: 'link',
      onClick: handleCancelUpload
    }
  ]

  useEffect(
    () => () => {
      // 组件卸载或文件列表发生变化时释放所有 preview 属性中的临时 URL，以避免内存泄漏。
      files.forEach((file) => URL.revokeObjectURL(file.preview))
    },
    [files]
  )

  return (
    <section className={classes.container}>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>在这里拖放一些文件，或者单击以选择文件</p>
      </div>
      <ul className={classes.acceptedFiles}>{acceptedFiles}</ul>
      <ButtonList buttons={buttons} />
    </section>
  )
}

const UploadFilesConnect = connect(null, { uploadFile })(UploadFiles)

export default UploadFilesConnect
