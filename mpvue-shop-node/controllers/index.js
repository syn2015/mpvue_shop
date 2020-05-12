// 本文件index.js自动读取本地文件的目录结构

// lodash，封装的js常用方法
const _ = require('lodash')
const fs = require('fs')
const path = require('path')

// 映射 d 文件夹下的文件为模块

const mapDir = d => {
  const tree = {}

  // 获取当前文件夹下的所有文件夹和文件，分成两组，文件夹一组，文件一组
  // partition，划分
  const [dirs, files] = _(fs.readdirSync(d)).partition(p => fs.statSync(path.join(d, p)).isDirectory())
  // 映射文件夹
  dirs.forEach(dir => {
    // 递归
    tree[dir] = mapDir(path.join(d, dir))
  });
  // 映射文件
  files.forEach(file => {
    // 获取文件后缀名字
    if (path.extname(file) === '.js') {
      tree[path.basename(file, '.js')] = require(path.join(d, file))
    }
  })

  return tree
}

// 默认导出当前文件夹下的映射
module.exports = mapDir(path.join(__dirname))