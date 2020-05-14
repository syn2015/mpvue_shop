<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="head">
      <div>
        <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/search2-2fb94833aa.png" alt="">
        <!-- confirm-type="search",键盘按钮为搜索；focus="true" ,光标聚焦；@confirm="",点击键盘按钮触发 -->
        <input type="text" confirm-type="search" focus="true" v-model="words" @focus="inputFocus" @input="tipsearch" @confirm="searchWords" placeholder="商品搜索">
        <img @click="clearInput" class="del" src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/clearIpt-f71b83e3c2.png" alt="">
      </div>
      <div @click="cancel">取消</div>
    </div>
    <!-- 搜索词语提示 -->
    <div class="searchtips" v-if="words">
      <div v-if="tipsData.length != 0">
        <div v-for="(item, index) in tipsData" :key="index" @click="searchWords" :data-value="item.name">
          {{item.name}}
        </div>
      </div>
      <div class="nogoods" v-else>数据库暂无此类商品...</div>
    </div>
    <!-- 搜索历史记录 -->
    <div class="history" v-if="historyData.length!==0">
      <!-- 删除 -->
      <div class="t">
        <div>历史记录</div>
        <div @click="clearHistory"></div>
      </div>
      <!-- 搜索词 -->
      <div class="cont">
        <div v-for="(item, index) in historyData" :key="index" @click="searchWords" :data-value="item.keyword">
          {{item.keyword}}
        </div>
      </div>
    </div>
    <!-- 热门搜索 -->
    <div class="history hotsearch">
      <div class="t">
        <div>热门搜索</div>
      </div>
      <div class="cont">
        <div v-for="(item, index) in hotData" :key="index" :class="{active: item.is_hot === 1}" @click="searchWords" :data-value="item.keyword">
          {{item.keyword}}
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="goodsList" v-if="listData.length!==0">
      <div class="sortnav">
        <div @click="changeTab(0)" :class="[0 === nowIndex ? 'active' : '']">综合</div>
        <div @click="changeTab(1)" :class="[1 === nowIndex ? 'active' : '']" class="price">价格</div>
        <div @click="changeTab(2)" :class="[2 === nowIndex ? 'active' : '']">分类</div>
      </div>
      <div class="sortlist">
        <div @click="goodsDetail(item.id)" class="item" v-for="(item, index) in listData" :key="index">
          <img :src="item.list_pic_url" alt="">
          <p class="name">{{item.name}}</p>
          <p class="price">¥{{item.retail_price}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入封装的get,post
import { get, post } from '../../utils'
export default {
  data () {
    return {
      words: '',
      openid: '',
      hotData: [],
      historyData: [],
      tipsData: [],
      order: '',
      listData: [],
      nowIndex: 0
    }
  },
  // mounted(),获取openid
  mounted () {
    this.openid = wx.getStorageSync('openId') || '';
    this.getHotData()
  },
  methods: {
    // 取消input框输入
    clearInput() {
      this.words = ''
      this.listData = []
    },
    // 取消按钮跳转
    cancel() {
      wx.navigateBack({
        delta: 1
      })
    },
    // 删除全部历史记录
    async clearHistory() {
      const data = await post('/search/clearhistoryAction', {
        openId: this.openid
      })
      if (data) {
        // 清除成功，页面数据清空
        this.historyData = []
      }
    },
    // 搜索关键词
    inputFocus() {
      // 商品清空
      this.listData = []
      // 展示搜索提示信息
      this.tipsearch()
    },
    //@input 搜索关键词跳转结果页面
    async tipsearch() {
      const data = await get('/search/helperaction', {
        keyword: this.words
      })
      // 
      this.tipsData = data.keywords
    },
    // @confirm
    async searchWords(e) {
      // 
      console.log('input小程序的值，',e.currentTarget.dataset.value);
      let value = e.currentTarget.dataset.value
      // vue双向绑定或者小程序的取值
      this.words = value || this.words
      const data = await post('/search/addhistoryaction', {
        openId: this.openid,
        keyword: value || this.words
      })
      console.log('data获取历史记录，',data)
      // 获取历史数据
      this.getHotData()
      this.getlistData()
    },
    // 
    async getHotData (first) {
      const data = await get('/search/indexaction?openId=' + this.openid)
      this.historyData = data.historyData
      this.hotData = data.hotKeywordList
      console.log("getHotData,",data)
    },
    // 
    async getlistData () {
      // 获取商品列表
      const data  = await get('/search/helperaction', {
        keyword: this.words,
        order: this.order
      })
      // 
      this.listData = data.keywords
      this.tipsData = []
      console.log(data)
    },
    // 
    changeTab(index) {
      this.nowIndex = index
      if (index === 1) {
        this.order = this.order == 'asc' ? 'desc' : 'asc'
      } else {
        this.order = ''
      }
      this.getlistData()
    },
    // 
    goodsDetail (id) {
      wx.navigateTo({
        url: '/pages/goods/main?id=' + id
      });
    }
  }
}
</script>

<style lang='less' scoped>
@import './style';
</style>