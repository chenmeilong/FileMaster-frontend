export default {
  serverPath:
    process.env.NODE_ENV === 'production'
      ? 'http://apifm.mileschen.cn'
      : 'http://localhost:3131'
}
