/**
 * @author MilesChen
 * @description 文件配置
 * @createDate 2023-02-15 14:37:26
 */

interface Icons {
  '.png': string
  '.jpg': string
  '.jpeg': string
  '.doc': string
  '.docx': string
  '.xls': string
  '.pdf': string
  '.ppt': string
  '.svg': string
  '.xml': string
  '.psd': string
  '.ai': string
  '.mp4': string
  '.txt': string
  '.csv': string
  '.zip': string
  '.gif': string
  '.rar': string
  '.tar.gz': string
  broken: string
  folder: string
  folderopen: string
  folderfull: string
  [key: string]: string
}

const icons: Icons = {
  '.png': '/img/files/png.svg',
  '.jpg': '/img/files/jpg.svg',
  '.jpeg': '/img/files/jpeg.svg',
  '.doc': '/img/files/doc.svg',
  '.docx': '/img/files/doc.svg',
  '.xls': '/img/files/xls.svg',
  '.pdf': '/img/files/pdf.svg',
  '.ppt': '/img/files/ppt.svg',
  '.svg': '/img/files/svg.svg',
  '.xml': '/img/files/xml.svg',
  '.psd': '/img/files/psd.svg',
  '.ai': '/img/files/ai.svg',
  '.mp4': '/img/files/mp4.svg',
  '.txt': '/img/files/txt.svg',
  '.csv': '/img/files/csv.svg',
  '.zip': '/img/files/zip.svg',
  '.gif': '/img/files/gif.svg',
  '.rar': '/img/files/zip-1.svg',
  '.tar.gz': '/img/files/zip-1.svg',
  broken: '/img/files/search.svg',
  folder: '/img/files/folder.svg',
  folderopen: '/img/files/folderopen.svg',
  folderfull: '/img/files/folderfull.svg'
}

export default {
  icons: icons,
  textFiles: ['.txt'],
  imageFiles: ['.jpg', '.jpeg', '.png', '.svg', '.gif'],
  archiveFiles: ['.zip', '.tar.gz']
}
