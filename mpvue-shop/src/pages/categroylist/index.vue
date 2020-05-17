<template>
  <div class="categoryList">
    <!-- scroll-view scroll-x 横向滚动 scroll-left，滚动到右侧的属性 -->
    <scroll-view scroll-x="true" class="head" :scroll-left="scrollLeft">
      <div @click="changeTab(index, item.id)" v-for="(item, index) in navData" :key="index" :class="[nowIndex == index ? 'active' : '']">
        {{item.name}}
      </div>
    </scroll-view>
    <!-- 商品列表表头 -->
    <div class="info">
      <p>{{currentNav.name}}</p>
      <p>{{currentNav.front_desc}}</p>
    </div>
    <!-- v-if 商品列表 -->
    <div class="list" v-if="goodsList.length !== 0">
      <div class="item" v-for="(item, index) in goodsList" :key="index" @click="goodsDetail(item.id)">
        <img :src="item.list_pic_url" alt="">
        <p class="name">{{item.name}}</p>
        <p class="price">¥ {{item.retail_price}}</p>
      </div>
    </div>
    <!-- v-else 暂无数据 -->
    <div class="none" v-else>数据库暂无数据...</div>
  </div>
</template>

<script>
import { get } from '../../utils'
export default {
  data () {
    return {
      scrollLeft: 0,
      navData: [],
      categoryId: '',
      currentNav: {},
      nowIndex: 0,
      goodsList: []
    }
  },
  // mounted()请求数据
  mounted () {
    // 获取页面传递的参数id,商品类别
    this.categoryId = this.$root.$mp.query.id
    this.getAllData()
  },
  methods: {
    // 获取对应类型的商品
    async getAllData () {
      const data = await get('/category/categoryNav', {
        id: this.categoryId
      })
      console.log('商品类别对应的商品列表',data)
      this.navData = data.navData
      this.currentNav = data.currentNav
      for (let i = 0; i < this.navData.length; i++) {
        const id = this.navData[i].id
        if (id == this.currentNav.id) {
          this.nowIndex = i
        }
      }
      // 获取商品
      const listData = await get('/goods/goodsList', {
        categoryId: this.categoryId
      })
      console.log("获取商品listData:",listData)
      this.goodsList = listData.data
    },
    // 切换tabbar
    async changeTab (index, id) {
      this.nowIndex = index
      const listData = await get('/goods/goodsList', {
        categoryId: id
      })
      console.log('tabbar切换数据：',listData)
      this.goodsList = listData.data
      this.currentNav = listData.currentNav
      // 让导航栏滚动到可见区域
      if (this.nowIndex > 4) {
        // 向右边滑动
        this.scrollLeft = this.nowIndex * 60
      } else {
        // 向左边滑动
        this.scrollLeft = 0
      }
    },
    // 跳转商品详情页面
    goodsDetail (id) {
      console.log(id)
      wx.navigateTo({
        url: '/pages/goods/main?id=' + id
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>