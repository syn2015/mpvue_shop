<template>
  <div class="mappage">
    <!-- 搜索框 -->
    <div class="section">
      <input type="text" placeholder="搜索" focus="true" v-model="keywords" @input="bindInput">
    </div>
    <!-- scroll-view 显示搜索补全的地址 -->
    <scroll-view :scroll-y="true" class="addcont" style="height: 500rpx;">
      <!-- @touchStart -->
      <div class="result" @touchstart="bindSearch(item.name)" v-for="(item, index) in tips" :key="index">
        {{item.name}}
      </div>
    </scroll-view>
    <!-- 实时位置 -->
    <div class="map_container">
      <div class="title">显示当前位置:</div>
      <!-- 小程序map标签 -->
      <map class="map" id="map" scale="16" :longitude="longitude" :latitude="latitude" :markers="markers"></map>
    </div>
  </div>
</template>

<script>
import amapFile from '../../utils/amap-wx'
// 引入vuex
import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 高德返回的搜索补全的地址
      tips: [],
      longitude: 0,
      latitude: 0,
      // 标记点
      markers: [],
      // 搜索框的值
      keywords: ''
    }
  },
  // mounted life 
  mounted() {
    this.getMapaddress()
  },
  methods: {
    ...mapMutations(['update']),
    // 获取地理位置
    getMapaddress () {
      let _this = this
      var myAmapFun = new amapFile.AMapWX({key:'33c20afb72594bbe7c04c613e1055085'})
      myAmapFun.getRegeo({
        iconPath: "/static/images/marker.png",
        iconWidth: 22,
        iconHeight: 32,
        success(data) {
          console.log('amapFile.AMapWX.getRegeo()',data)
          let marker = [
            {
              id: data[0].id,
              latitude: data[0].latitude,
              longitude: data[0].longitude,
              width: data[0].width,
              height: data[0].height
            }
          ]
          _this.markers = marker
          _this.longitude = data[0].longitude
          _this.latitude = data[0].latitude
        },
        fail (info) {
          console.log('amapFile.AMapWX.getRegeo(),error:',info)
        }
      })
    },
    // 输入框输入
    bindInput(e) {
      // console.log(e)
      let _this = this
      let keywords = _this.keywords
      var myAmapFun = new amapFile.AMapWX({key:'33c20afb72594bbe7c04c613e1055085'})
      // myAmapFun.getInputtips()搜索补全
      myAmapFun.getInputtips({
        keywords: keywords,
        location: '',
        success: function(data) {
          console.log('tip[],搜索补全：',data)
          if (data && data.tips) {
            _this.tips = data.tips
          }
        }
      })
    },
    // 选则地址并返回上一页面
    bindSearch (cityName) {
      this.update({cityName: cityName})
      wx.navigateBack({
        delta: 1
      });
    }
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>