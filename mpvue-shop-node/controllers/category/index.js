const { mysql } = require('../../mysql')

// 获取分类列表,导航栏
async function categoryNav(ctx) {
  const categoryId = ctx.query.id
  // 获取分类
  const currentNav = await mysql('nideshop_category').where({
    'id': categoryId
  }).select()
  // 获取它的同类，currentNav[0].parent_id
  const navData = await mysql('nideshop_category').where({
    'parent_id': currentNav[0].parent_id
  }).select()

  ctx.body = {
    navData,
    currentNav: currentNav[0]
  }
}

// 分类页面
async function indexAction(ctx) {
  const { id: categoryId } = ctx.query
    // 取parent_id为0的数据
  const data = await mysql('nideshop_category').where({
    'parent_id': 0
  }).select()
  const currentCategory = []
  if (categoryId) {
    currentCategory = await mysql('nideshop_category').where({
      'parent_id': categoryId
    }).select()
  }

  ctx.body = {
    'categoryList': data
  }
}

// 点击左侧菜单获取的分类商品
async function currentAction(ctx) {
  const { id: categoryId } = ctx.query

  const data =  {}
  const currentOne = await mysql('nideshop_category').where({
    'id': categoryId 
  }).select()
  // 取parent_id相同的所有的数据
  const subList = await mysql('nideshop_category').where({
    'parent_id': currentOne[0].id
  }).select()
  // 
  data.currentOne = currentOne[0]
  data.currentOne.subList = subList

  ctx.body = {
    'data': data
  }
}

module.exports = {
  categoryNav,
  indexAction,
  currentAction
}