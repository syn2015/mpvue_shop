<template>
  <div class="topicdetail">
    <!--  -->
    <div class="content">
      <!-- 防止wxParse因为没有数据报错 -->
      <div class="detail" v-if="goods_desc">
        <wxParse :content="goods_desc" />
      </div>
    </div>
    <!-- 专题推荐 -->
    <div class="list">
      <p class="title">专题推荐</p>
      <div class="item" v-for="(item, index) in recommendList" :key="index">
        <img :src="item.scene_pic_url" alt="">
        <p>{{item.title}}</p>
      </div>
    </div>
  </div>
</template>

<script>
// wxParse 组件引入
import wxParse from 'mpvue-wxparse'
import { get } from '../../utils'
export default {
  components: {
    wxParse
  },
  data () {
    return {
      goods_desc: '',
      id: '',
      recommendList: []
    }
  },
  // mounted()
  mounted () {
    // this.$root.$mp.query.id 页面传递参数id
    this.id = this.$root.$mp.query.id
    this.getListData()
  },
  methods: {
    // 获取数据
    async getListData () {
      const data = await get('/topic/detailaction', {
        id: this.id
      })
      console.log('专题商品详情数据:',data)
      // data.data.content是富文本格式
      this.goods_desc = data.data.content
      this.recommendList = data.recommendList
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>