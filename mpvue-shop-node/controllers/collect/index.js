const { mysql } = require('../../mysql')

// 添加收藏
async function addCollect(ctx) {
  const { openId, goodsId } = ctx.request.body
  // 判断是否已经收藏 nideshop_collect
  const iscollect = await mysql('nideshop_collect').where({
    'user_id': openId,
    'value_id': goodsId
  }).select()
  if (iscollect.length == 0) {
    // 添加收藏
    await mysql('nideshop_collect').insert({
      'user_id': openId,
      'value_id': goodsId
    })
    // 返回已收藏
    ctx.body = {
      data: 'collected'
    }
  } else {
    // 取消收藏
    await mysql('nideshop_collect').where({
      'user_id': openId,
      'value_id': goodsId
    }).del()
    // 返回已取消收藏
    ctx.body = {
      data: 'uncollect'
    }
  }
}

module.exports = {
  addCollect
}