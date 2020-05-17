<template>
  <div class="topic">
  
    <ui class="list">
      <li v-for="(item, index) in topicList" :key="index" @click="topicDetail(item.id)">
        <!-- 图片 -->
        <div class="t-img">
          <img :src="item.scene_pic_url" alt="">
        </div>
        <!-- 描述 -->
        <div class="info">
          <p>{{item.title}}</p>
          <p>{{item.subtitle}}</p>
          <p>{{item.price_info}}元起</p>
        </div>
      </li>
    </ui>
  </div>
</template>

<script>
import { get } from '../../utils'
export default {
  data () {
    return {
      page: 1,
      topicList: [],
      total: ''
    }
  },
  // 下拉刷新，"enablePullDownRefresh": true 在app.json配置window字段
  onPullDownRefresh () {
    this.page = 1
    this.getListData()
    // 手动停止下拉刷新，避免卡住
    wx.stopPullDownRefresh()
  },
  // 上拉加载更多
  onReachBottom () {
    this.page = this.page + 1
    // 
    if (this.page > this.total) {
      return false
    }
    this.getListData()
  },
  // mounted()
  mounted () {
    this.getListData(true)
  },
  methods: {
    // 获取数据
    async getListData (first) {
      const data = await get ('/topic/listaction', {
        page: this.page
      })
      console.log('获取数据getListData:',data)
      this.total = data.total
      // 第一次请求
      if (first) {
        this.topicList = data.data
      } else {
        // 非第一次请求，需要与本地数据进行合并
        this.topicList = this.topicList.concat(data.data)
      }
    },
    // 跳转专题商品详情页
    topicDetail (id) {
      wx.navigateTo({
        url: '/pages/topicdetail/main?id=' + id
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>