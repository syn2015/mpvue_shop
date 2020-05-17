<template>
  <div class="category">
    <!-- 搜索 -->
    <div class="search" @click="tosearch">
      <div class="ser">
        <span class="icon"></span>
        <span>商品搜索，共239款好物</span>
      </div>
    </div>
      <!-- 主体内容 -->
    <div class="content">
      <!-- 左侧menu -->
      <scroll-view class="left" scroll-y="true">
        <div class="iconText" @click="selectItem(item.id, index)" v-for="(item, index) in listData" :key="index" :class="[index === nowIndex ? 'active' : '']">
          {{item.name}}
        </div>
      </scroll-view>
      <!-- 右侧列表 -->
      <scroll-view class="right" scroll-y="true">
        <div class="banner">
          <img :src="detailData.banner_url" alt="">
        </div>
        <div class="title">
          <span>-</span>
          <span>{{detailData.name}}分类</span>
          <span>-</span>
        </div>
        <div class="bottom">
          <div class="item" @click="categoryList(item.id)" v-for="(item, index) in detailData.subList" :key="index">
            <img :src="item.wap_banner_url" alt="">
            <span>{{item.name}}</span>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
import { get } from '../../utils'
export default {
  data () {
    return {
      listData: [],
      nowIndex: 0, //默认选中的商品类
      id: '1005000',
      detailData: {}
    }
  },
  // mounted()
  mounted () {
    this.getListData()
    this.selectItem(this.id, this.nowIndex)
  },
  methods: {
    // 搜索图标
    tosearch () {
      wx.navigateTo({
        url: '/pages/search/main'
      });  
    },
    // 获取数据
    async getListData () {
      const data = await get('/category/indexaction')
      console.log('商品类别数据:',data)
      this.listData = data.categoryList
    },
    // 获取选中的商品类别对应的数据
    async selectItem (id, index) {
      // 获取右边商品的数据
      this.nowIndex = index
      const data = await get('/category/currentaction', {
        id: id
      })
      console.log('指定商品类别数据:',data)
      this.detailData = data.data.currentOne
    },
    // 跳转商品详情页
    categoryList (id) {
      console.log(id)
      wx.navigateTo({
        url: '/pages/categroylist/main?id=' + id
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>