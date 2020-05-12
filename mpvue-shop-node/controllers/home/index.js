const { mysql } = require('../../mysql')

module.exports = async (ctx) => {
  // 轮播图数据
  const banner = await mysql('nideshop_ad').where({
    ad_position_id: 1
  }).select()

  // tab类型
  const channel = await mysql('nideshop_channel').select()

  // 品牌列表，最新产品的前四数据
  const brandList = await mysql('nideshop_brand').where({
    is_new: 1
  }).orderBy('new_sort_order', 'asc').limit(4).select()

  // 新品首发，包含在列举值中的数据，且是新品
  const newGoods = await mysql('nideshop_goods').whereIn('id', [1181000, 1135002, 1134030, 1134032]).andWhere('is_new', 1).select()

  // 人气推荐，列出指定字段的最新的前五条数据
  const hotGoods = await mysql('nideshop_goods').column('id', 'name', 'list_pic_url', 'retail_price', 'goods_brief').where({
    is_hot: 1
  }).limit(5).select()

  // 专题精选
  const topicList = await mysql('nideshop_topic').limit(3).select()

  // 类别列表 **好物
  // parent_id为0的代表是顶级，用作标题
  const categoryList = await mysql('nideshop_category').where({
    parent_id: 0
  }).select()
  const newCategoryList = []

  for (let i = 0; i < categoryList.length; i++) {
    let item = categoryList[i]
    let childCategoryIds = await mysql('nideshop_category').where({
      parent_id: item.id
    }).column('id').select()
    console.log('childCategoryIds前,',childCategoryIds)
    // 变成数组的形式 [1020000, 1036002]
    childCategoryIds = childCategoryIds.map((item) => {
      return item.id
    })
    console.log('childCategoryIds后,',childCategoryIds)
    // 在商品中找到在childCategoryIds里的7条数据
    const categoryGoods = await mysql('nideshop_goods').column('id', 'name', 'list_pic_url', 'retail_price').whereIn('category_id', childCategoryIds).limit(7).select()
    console.log('categoryGoods构造数据,',categoryGoods)
    newCategoryList.push({
      'id': item.id,
      'name': item.name,
      'goodsList': categoryGoods
    })
  }
  // 输出格式
  ctx.body = {
    'banner': banner,
    'channel': channel,
    'brandList': brandList,
    'newGoods': newGoods,
    'hotGoods': hotGoods,
    'topicList': topicList,
    'newCategoryList': newCategoryList
  }
}
