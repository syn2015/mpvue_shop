<template>
  <div class="addaddress">
    <!-- 姓名 -->
    <div class="item">
      <input type="text" placeholder="姓名" v-model="userName">
    </div>
    <!-- 电话 -->
    <div class="item">
      <input type="text" placeholder="手机号码" v-model="telNumber">
    </div>
    <!-- 地址  mode="region" 级联组件；：custom-item="customItem" 自定义项-->
    <div class="item">
      <picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
        <input type="text" placeholder="身份、城市、区县" v-model="address">
      </picker>
    </div>
    <!-- 详细地址 -->
    <div class="item">
      <input type="text" placeholder="详细地址，如楼道、楼盘号等" v-model="detailaddress">
    </div>
    <!-- 设为默认地址 -->
    <div class="item itemend">
      <checkbox-group @change="checkboxChange">
        <label class="checkbox">
          <checkbox class="box" value="true" :checked="checked" color="#b4282d"></checkbox>
          设置为默认地址
        </label>
      </checkbox-group>
      <div @click="wxaddress">一键导入微信</div>
    </div>
    <!-- 保存按钮 -->
    <div class="bottom" @click="saveAddress">保存</div>
  </div>
</template>

<script>
import { get, post, getStorageOpenid } from "../../utils";
export default {
  data () {
    return {
      userName: '',
      telNumber: '',
      region: [],  //picker 地址
      customItem: '全部',// 自定义项，
      address: '',  //收货地址
      detailaddress: '', //收获详细地址
      checked: false,
      openId: '',
      res: '',
      id: ''
    }
  },
  // mounted()请求数据
  mounted() {
    this.openId = getStorageOpenid()
    // 上一页面是否带有参数res（是否从一键导入而来）
    if (this.$root.$mp.query.res) {
      // decodeURIComponent解码
      console.log('解码前的参数------',this.$root.$mp.query.res)
      this.res = JSON.parse(decodeURIComponent(this.$root.$mp.query.res))
      console.log('解码后的参数------',this.res)
      this.userName = this.res.userName
      this.telNumber = this.res.telNumber
      // 字符串拼接
      this.address = `${this.res.provinceName} ${this.res.cityName} ${this.res.countyName}`
      this.detailaddress = this.res.detailInfo
    }
    // 上一页面是否带有参数id（是否从编辑地址而来）
    if (this.$root.$mp.query.id) {
      this.id = this.$root.$mp.query.id
      this.getDetail()
    }
  },
  methods: {
    // 请求详细地址数据
    async getDetail () {
      const data = await get('/address/detailAction', {
        id: this.id
      })
      console.log('请求详细地址数据,',data)
      // 渲染待编辑的数据
      let detail = data.data
      this.userName = detail.name
      this.telNumber = detail.mobile
      this.address = detail.address
      this.detailaddress = detail.address_detail
      this.checked = detail.is_default === 1 ? true : false
    },
    // checkbox的change事件
    checkboxChange (e) {
      // 获取checked的值,e.mp.detail.value[0]
      this.checked = e.mp.detail.value[0]
    },
    // pick级联地址的change事件,e.mp.detail.value
    bindRegionChange (e) {
      console.log('mpvue中的picker组件的change事件:',e)
      let value = e.mp.detail.value
      this.address = `${value[0]} ${value[1]} ${value[2]}`
    },
    // 一键导入微信
    wxaddress () {
      wx.chooseAddress({
        success: (result) => {
          console.log(' wx.chooseAddress,',result)
          this.userName = result.userName
          this.telNumber = result.telNumber
          this.address = `${result.provinceName} ${result.cityName} ${result.countyName}`
          this.detailaddress = result.detailInfo
        },
        fail: () => {},
        complete: () => {}
      });
        
    },
    // 保存按钮
    async saveAddress () {
      const data = await post('/address/saveAction', {
        userName: this.userName,
        // 需要添加电话格式校验
        telNumber: this.telNumber,
        address: this.address,
        detailaddress: this.detailaddress,
        checked: this.checked,
        openId: this.openId,
        addressId: this.id
      })
      console.log('保存按钮，结果：',data)
      if (data.data) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          success: (result) => {
            // 延迟跳转页面，setTimeout需要修改为箭头函数
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)
          },
          fail: () => {},
          complete: () => {}
        });
          
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>