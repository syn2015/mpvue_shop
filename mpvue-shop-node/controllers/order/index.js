const { mysql } = require('../../mysql')

// 提交订单
async function submitAction (ctx) {
  const { openId } = ctx.request.body
  let goodsId = ctx.request.body.goodsId
  let allPrice = ctx.request.body.allPrice
  // 是否存在订单
  const isOrder = await mysql('nideshop_order').where({
    'user_id': openId
  }).select()
  // 更新订单的总价，user_id,goods_id
  if (isOrder.length > 0) {
    const data = await mysql('nideshop_order').where({
      'user_id': openId
    }).update({
      user_id: openId,
      goods_id: goodsId,
      allprice: allPrice
    })
    // 
    if (data) {
      ctx.body = {
        data: true
      }
    } else {
      ctx.body = {
        data: false
      }
    }
  } else {
    // 插入新订单
    const data = await mysql('nideshop_order').insert({
      user_id: openId,
      goods_id: goodsId,
      allprice: allPrice
    })
    if (data) {
      ctx.body = {
        data: true
      }
    } else {
      ctx.body = {
        data: false
      }
    }
  }
}

// 订单详情
async function detailAction (ctx) {
  const openId = ctx.query.openId
  const addressId = ctx.query.addressId || ''
  const orderDetail = await mysql('nideshop_order').where({
    'user_id': openId
  }).select()
  var goodsIds = orderDetail[0].goods_id.split(',')
  console.log('goodsIds,split后：',goodsIds)
  // whereIn()
  const list = await mysql('nideshop_cart').andWhere({
    'user_id': openId
  }).whereIn('goods_id', goodsIds).select()
  console.log('list,根据goodsIds查询：',list)
  // 收货地址
  var addressList;
  // 传递来的地址存在
  if (addressId) {
    addressList = await mysql('nideshop_address').where({
      'user_id': openId,
      'id': addressId
    }).orderBy('is_default', 'desc').select()
  } else {
    addressList = await mysql('nideshop_address').where({
      'user_id': openId
    }).orderBy('is_default', 'desc').select()
  }
  ctx.body = {
    price: orderDetail[0].allprice,
    goodsList: list,
    address: addressList[0] || {}
  }
}

module.exports = {
  submitAction,
  detailAction
}