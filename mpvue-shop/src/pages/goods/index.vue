<template>
  <div class="goods">
    <!--  -->
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
        <blok v-for="(item, index) in gallery" :key="index">
          <swiper-item class="swiper-item">
            <img :src="item.img_url" alt="" class="slide-image" />
          </swiper-item>
        </blok>
      </swiper>
      <button class="share" hover-class="none" open-type="share" value="">分享商品</button>
    </div>
    <!--商品保障  -->
    <div class="swiper-b">
      <div class="item">30天无忧退货</div>
      <div class="item">48小时快速退款</div>
      <div class="item">满88元免邮费</div>
    </div>
    <!-- 商品描述 -->
    <div class="goods-info">
      <div class="c">
        <p>{{info.name}}</p>
        <p>{{info.goods_brief}}</p>
        <p>¥{{info.retail_price}}</p>
        <div class="brand" v-if="brand.name">
          <p>{{brand.name}}</p>
        </div>
      </div>
    </div>
    <!--规格数量  -->
    <div class="section-nav" @click="showType">
      <div>请选择规格数量</div>
      <div></div>
    </div>

    <!-- 商品参数 -->
    <div class="attribute">
      <div class="head">
        商品参数
      </div>
      <div class="item" v-for="(item, index) in attribute" :key="index">
        <div>{{item.name}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>

    <!-- 图片展示 -->
    <div class="detail" v-if="goods_desc">
      <!-- wxparse，mpvue组件,解析富文本插件 -->
      <wxParse :content="goods_desc" />
    </div>

    <!-- 常见问题 -->
    <div class="common-problem">
      <div class="h">
        <text class="title">常见问题</text>
      </div>
      <div class="b">
        <div class="item" v-for="(item, index) in issueList" :key="index">
          <div class="question-box">
            <text class="spot"></text>
            <text class="question">{{item.question}}</text>
          </div>
          <div class="answer">{{item.answer}}</div>
        </div>
      </div>
    </div>

    <!-- 大家都在看 -->
    <div class="common-problem">
      <div class="h">
        <text class="title">大家都在看</text>
      </div>
      <div class="sublist">
        <div v-for="(subitem, index) in productList" :key="index">
          <img :src="subitem.list_pic_url" alt="">
          <p>{{subitem.name}}</p>
          <p>¥{{subitem.retail_price}}</p>
        </div>
      </div>
    </div>

    <!-- footer -->
    <div class="bottom-fixed">
      <!-- 收藏图标 -->
      <div class="collect-box" @click="collect">
        <!-- 点击收藏，同时存入后端 -->
        <div class="collect" :class="[collectFlag ? 'active' : '']"></div>
      </div>
      <!-- 购物车图标 -->
      <div class="car-box" @click="toCart">
        <div class="car" >
          <span>{{allnumber}}</span>
          <img src="/static/images/ic_menu_shoping_nor.png" alt="">
        </div>
      </div>
      <div @click="buy">立即购买</div>
      <div @click="addCart">加入购物车</div>
    </div>

    <!-- 选择规格的弹出层 -->
    <!-- 蒙层 -->
    <div class="pop" v-show="showpop" @click="showType"></div>
    <!-- 弹出的规格层 -->
    <div class="attr-pop" :class="[showpop ? 'fadeup' : 'fadedown']">
      <!-- 商品和价格 -->
      <div class="top">
        <div class="left">
          <img :src="info.primary_pic_url" alt="">
        </div>
        <div class="right">
          <div>
            <p>价格¥{{info.retail_price}}</p>
            <p>请选择数量</p> 
          </div>
        </div>
        <div class="close" @click="showType">✖️</div>
      </div>
      <!-- 数量b和加减框 -->
      <div class="b">
        <p>数量</p> 
        <div class="count">
          <div class="cut" @click="reduce">-</div>
          <!-- 禁用输入框输入 -->
          <input type="text" class="number" v-model="number" disabled="false">
          <div class="add" @click="add">+</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { get, post } from '../../utils'
// 引入mpvue-wxparse
import wxParse from 'mpvue-wxparse'
export default {
  data () {
    return {
      gallery: [],  // banner图
      id: '',       //商品id
      openId: '',   //openid
      info: {},     //商品描述
      brand: {},    //制造商
      showpop: false, // 是否弹出规格层
      number: 0,      // 购物数量
      attribute: [], //商品参数
      goods_desc: '', // 图片列表（微信组件）
      issueList: [], // 常见问题
      productList: [], // 大家都在看
      collectFlag: false, // 是否收藏，默认没有
      goodsId: '',    //商品ID
      allnumber: 0,   //消息图标
      allPrice: ''    // 商品总价
    }
  },
  // 引入组件
  components: {
    wxParse
  },
  // 商品分享
  onShareAppMessage() {
    console.log('this.info.name是,',this.info.name)
    return {
      title: this.info.name,
      path: '/pages/goods/main?id' + this.info.id,
      imageUrl: this.gallery[0].img_url
    }
  },
  // mounted，生命周期
  mounted () {
    this.openId = wx.getStorageSync('openId') || '';
    // mpvue获取上一个页面url中传递的值
    // vue获取上一个页面url中传递的值this.$root.query.id
    this.id = this.$root.$mp.query.id
    console.log(this.id, '------')
    this.goodsDetail()
  },
  methods: {
    // 获取详情数据
    async goodsDetail () {
      const data = await get('/goods/detailaction', {
        id: this.id,
        openId: this.openId
      })
      console.log('goodsDetail,详情数据：',data)
      this.info = data.info
      this.gallery = data.gallery
      this.attribute = data.attribute
      this.goods_desc = data.info.goods_desc
      this.issueList = data.issue
      this.productList = data.productList
      this.goodsId = data.info.id
      this.collectFlag = data.collected
      this.allnumber = data.allnumber
      this.allPrice = data.info.retail_price
    },
    // 弹出规格层
    showType () {
      this.showpop = !this.showpop
    },
    // 加法
    add () {
      this.number += 1
    },
    // 减法
    reduce () {
      if (this.number > 1) {
        this.number -= 1
      } else {
        // 结束
        return false
      }
    },
    // 收藏
    async collect () {
      this.collectFlag = !this.collectFlag
      const data = await post('/collect/addcollect', {
        openId: this.openId,
        goodsId: this.goodsId
      })
    },
    // 去往购物车
    toCart () {
      wx.switchTab({
        url: '/pages/cart/main'
      });  
    },
    // 立即购买
    async buy () {
      if (this.showpop) {
        if (this.number === 0) {
          wx.showToast({
            title: '请选择商品数量',
            duration: 2000,
            icon: 'none',
            // mask为true，显示遮罩层
            mask: true,
            success: res => {}
          })
          // 停止
          return false
        }
        const data = await post('/order/submitAction', {
          goodsId: this.goodsId,
          openId: this.openId,
          allPrice: this.allPrice
        })
        if (data) {
          wx.navigateTo({
            url: '/pages/order/main'
          });
            
        }
      } else {
        // 弹出规格层
        this.showpop = true
      }
    },
    // 加入购物车
    async addCart () {
      if (this.showpop) {
        if (this.number == 0) {
          wx.showToast({
            title: '请选择商品数量',
            duration: 2000,
            icon: 'none',
            mask: true,
            success: res => {}
          })
          return false
        }
        // 后端更新数量
        const data = await post('cart/addCart', {
          openId: this.openId,
          goodsId: this.goodsId,
          number: this.number
        })
        // 前端更新数量
        if (data) {
          this.allnumber = this.allnumber + this.number
          wx.showToast({
            title: '添加购物车成功',
            icon: 'success',
            duration: 1500
          })
        }
      } else {
        this.showpop = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 引入mpvue的wxParse组件的样式
@import url('~mpvue-wxparse/src/wxParse.css');
@import './style.less';
</style>