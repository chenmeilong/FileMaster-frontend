/**
 * @author MilesChen
 * @description 工具函数库
 * @createDate 2023-01-29 18:43:27
 */

// 日期格式转换
export const convertDate = (dateString: string): string => {
  const mydate = new Date(dateString)
  return `${mydate.toLocaleDateString('en-GB')} ${mydate.toLocaleTimeString(
    'en-GB'
  )}`
}

// 文件大小计算，能够自适应单位和大小在0-1000以内
export const formatBytes = (
  bytes: number | undefined,
  decimals = 2
): string => {
  if (bytes === 0) return '0 Bytes'
  if (bytes === undefined) return ''
  const k = 1024
  const dm = decimals <= 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
