<template>
  <div class="index">
    <!-- 头部的搜索 -->
    <div class="search">
      <div @click="toMappage">{{cityName}}</div>
      <div @click="toSearch">
        <input type="text" placeholder="搜索商品" />
        <!-- 放大镜图标 -->
        <span class="icon"></span>
      </div>
    </div>
    <!-- 主页轮播 -->
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" circular="true" duration="500">
        <block v-for="(item, index) in banner" :key="index">
          <swiper-item class="swiper-item">
            <image class="slide-image" :src="item.image_url"/>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <!-- 频道 -->
    <div class="channel">
      <div v-for="(item, index) in channel" :key="index" @click="categroyList(item.id)">
        <img :src="item.icon_url" alt="">
        <p>{{item.name}}</p>
      </div>
    </div>
    <!-- 品牌区域 -->
    <div class="brand">
      <div class="head" @click="tobrandList">
        品牌制造商直供
      </div>
      <div class="content">
        <div v-for="(item, index) in brandList" :key="index" @click="branddetail(item.id)">
          <div>
            <p>{{item.name}}</p>
            <p class="price">{{item.floor_price}}元起</p>
          </div>
          <img :src="item.new_pic_url" alt="">
        </div>
      </div>
    </div>
    <!-- 新品首发 -->
    <div class="newgoods">
      <div class="newgoods-top" @click="goodsList('new')">
        <div class="top">
          <p>新品首发</p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li v-for="(item ,index) in newGoods" :key="index">
              <img :src="item.list_pic_url" alt="">
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>¥{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!-- 人气推荐 -->
    <div class="newgoods hotgoods">
      <div class="newgoods-top" @click="goodsList('hot')">
        <div class="top">
          <p>
            人气推荐
            <span></span>
            好物精选
          </p>
          <p>查看全部</p>
        </div>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li v-for="(item ,index) in hotGoods" :key="index">
              <img :src="item.list_pic_url" alt="">
              <p>{{item.name}}</p>
              <p>{{item.goods_brief}}</p>
              <p>¥{{item.retail_price}}</p>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!-- 专题精选 -->
    <div class="topicList">
      <div class="topicList-top">
        专题精选
        <span class="icon"></span>
      </div>
      <div class="list">
        <ul>
          <scroll-view class="scroll-view" :scroll-x="true">
            <li v-for="(item ,index) in topicList" :key="index" @click="topicdetail(item.id)">
              <img :src="item.item_pic_url" alt="">
              <div class="btom">
                <div>
                  <p>{{item.title}}</p>
                  <p>{{item.subtitle}}</p>
                </div>
                <div>{{item.price_info}}元起</div>
              </div>
            </li>
          </scroll-view>
        </ul>
      </div>
    </div>
    <!-- 居家好物等 -->
    <div class="newcategory">
      <div class="list" v-for="(item ,index) in newCategoryList" :key="index">
        <div class="head">{{item.name}}好物</div>
        <div class="sublist">
          <div v-for="(subitem, subindex) in item.goodsList" :key="subindex">
            <img :src="subitem.list_pic_url" alt="">
            <p>{{subitem.name}}</p>
            <p>{{subitem.retail_price}}</p>
          </div>
          <!-- 箭头 -->
          <div>
            <div class="last">
              <p>{{item.name}}好物</p>
              <span class="icon"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入高德的微信sdk
import amapFile from '../../utils/amap-wx.js'
import { mapState, mapMutations } from 'vuex'
import { get } from '../../utils'
export default {
  data () {
    return {
      banner: [],
      channel: [],
      brandList: [],
      newGoods: [],
      hotGoods: [],
      topicList: [],
      newCategoryList: []
    }
  },
  computed: {
    ...mapState(['cityName'])
  },
  // 获取数据并定位
  // mounted，
  // mpvue中，初始化请求尽量不放到create，created中。小程序中，所有页面的creat，created都会执行，造成卡顿
  mounted () {
    this.getData()
    this.getCityName()
  },
  methods: {
    ...mapMutations(['update']),
    // 地图定位
    toMappage () {
      // 通过 wx.getSetting 先查询一下用户是否授权 “scoped.record”
     
      let _this = this
      wx.getSetting({
        success: (res) => {
          // 如果没有同意授权，打开设置
          console.log('wx.getSetting,',res)
          if (!res.authSetting['scope.userLocation']) {
            wx.openSetting({
              success: res => {
                // 获取授权位置信息
                _this.getCityName()
              }
            })
          } else {
            wx.navigateTo({
              // 跳转地图页面
              url: '/pages/mappage/main',
            });
            // _this.getCityName()
          }
        },
        fail: (err) => {
          console.log(err)
        },
        complete: () => {}
      });
        
    },
    // 获取授权位置信息
    getCityName () {
      let _this = this
      var myAmapFun = new amapFile.AMapWX({key:'33c20afb72594bbe7c04c613e1055085'});
      // 获取
      myAmapFun.getRegeo({
        success: function (data) {
          // 成功回调
          console.log('amapFile.AmapWx.getRegeo(),',data)
          // ........
        },
        fail: function (info) {
          // 失败回调
          console.log('amapFile.AmapWx.getRegeo(),',info)
          // _this.cityName = '北京'
          _this.update({ cityName: '北京' })
        }
      })
    },
    // 获取数据使用封装的wx.request
    async getData() {
      // 后端定义的地址url:http://localhost:5757/lm/index/index
      const data = await get('/index/index') // http://localhost:5757/lm/index/index
      console.log('getData,',data)
      this.banner = data.banner
      this.channel = data.channel
      this.brandList = data.brandList
      this.newGoods = data.newGoods
      this.hotGoods = data.hotGoods
      this.topicList = data.topicList
      this.newCategoryList = data.newCategoryList
    },
    // 搜索商品，跳转页面
    toSearch () {
      wx.navigateTo({
        url: '/pages/search/main'
      })
    },
    // 频道跳转
    categroyList (id) {
      console.log('categroyList,跳转id:',id)
      wx.navigateTo({
        url: '/pages/categroylist/main?id=' + id
      })
    },
    // 品牌跳转
    branddetail (id) {
      console.log('brandetail品牌,id:',id)
      wx.navigateTo({
        url: '/pages/branddetail/main?id=' + id
      })
    },
    // 品牌制造商跳转
    tobrandList () {
      wx.navigateTo({
        url: '/pages/brandlist/main'
      })
    },
    // 人气推荐还是新品首发
    goodsList (info) {
      console.log('goodsList,新品首府阿还是人气推荐，',info)
      if (info == 'hot') {
        wx.navigateTo({
          url: '/pages/newgoods/main?isHot=' + 1
        })
      } else {
        wx.navigateTo({
          url: '/pages/newgoods/main?isNew=' + 1
        })
      }
    },
    // 专题精选
    topicdetail (id) {
      wx.navigateTo({
        url: '/pages/topicdetail/main?id=' + id
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>