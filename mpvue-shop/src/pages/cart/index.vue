<template>
  <div class="cart">
    <!-- 权益 -->
    <div class="top">
      <div>30天无忧退货</div>
      <div>48小时快速退款</div>
      <div>满88元免邮费</div>
    </div>
    <!-- 商品列表 -->
    <div class="cartlist">
      <div class="item" v-for="(item, index) in listData" :key="index">
        <div class="con">
          <!-- 选中图标和商品图片 -->
          <div class="left">
            <!-- 选中图标 同时切换选择背景图片-->
            <div class="icon" @click="changeColor(index, item.goods_id)" :class="[Listids[index] ? 'active' : '']"></div>
            <!-- 商品图片 -->
            <div class="img">
              <img :src="item.list_pic_url" alt="">
            </div>
            <!-- 商品名称和价钱 -->
            <div class="info">
              <p>{{item.goods_name}}</p>
              <p>¥{{item.retail_price}}</p>
            </div>

          </div>
          <!-- 商品数量 -->
          <div class="right">
            <div class="num">x {{item.number}}</div>
          </div>
        </div>
      </div>
    </div>
    <!--  -->
    <div class="fixed">
      <div class="left" @click="allCheck" :class="{'active': allcheck}">
        全选({{isCheckedNumber}})
      </div>
      <div class="right">
        <div>¥{{allPrice}}</div>
        <div @click="orderDown">下单</div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post, getStorageOpenid } from "../../utils"
export default {
  data () {
    return {
      openId: '',
      listData: [],// 购物车数据
      Listids: [],//存放所有商品ID
      allcheck: false
    }
  },
  // 请求数据onShow()
  onShow () {
    this.openId = getStorageOpenid()
    this.getListData()
  },
  methods: {
    // 请求购物车数据
    async getListData () {
      const data = await get('/cart/cartList', {
        openId: this.openId
      })
      console.log('购物车列表数据:',data)
      this.listData = data.data
    },
    // 单选
    changeColor (index, goodsid) {
      if (this.Listids[index]) {
        // vue中$set,动态修改数据源
        this.$set(this.Listids, index, false)
      } else {
        this.$set(this.Listids, index, goodsid)
      }
    },
    // 全选
    allCheck () {
      // 先清空选择
      this.Listids = []
      if (this.allcheck) {
        this.allcheck = false
      } else {
        this.allcheck = true
        // 全部选择，同时遍历所有商品项
        for (let i = 0; i < this.listData.length; i++) {
          const element = this.listData[i]
          // 收集所有商品的ID
          this.Listids.push(element.goods_id)
        }
      }
    },
    // 下单按钮
    async orderDown () {
      // 没选中商品
      if (this.Listids.length === 0) {
        wx.showToast({
          title: '请选择商品',
          icon: 'none',
          duration: 1500
        })
        return false
      }
      // 去除数组中空的false
      let newgoodsid = []
      for (let i = 0; i < this.Listids.length; i++) {
        const element = this.Listids[i]
        // 保险一些，除去数组元素为空的情况
        if (element) {
          newgoodsid.push(element)
        }
      }
      // 转为字符串
      let goodsId = newgoodsid.join(',')
      const data = await post('/order/submitAction', {
        goodsId: goodsId,
        openId: this.openId,
        allPrice: this.allPrice
      })
      // 跳转订单支付页面
      if (data) {
        wx.navigateTo({
          url: '/pages/order/main'
        });
      }
    }
  },
  computed: {
    // 计算属性：全选；同时用来做全选后的图标显示
    isCheckedNumber () {
      let number = 0
      for (let i = 0; i < this.Listids.length; i++) {
        if (this.Listids[i]) {
          number++
        }
      }
      // Listids数组中的所有元素的长度是否等于统计所有元素后的number
      if (number == this.listData.length && number !== 0) {
        // 全选图标亮起
        this.allcheck = true
      } else {
        this.allcheck = false
      }
      return number
    },
    // 计算属性：总价
    allPrice () {
      let Price = 0
      for (let i = 0; i < this.Listids.length; i++) {
        if (this.Listids[i]) {
          // 获取数据源中的价格和数量
          Price += this.listData[i].retail_price * this.listData[i].number
        }
      }
      return Price
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>