<template>
  <div class="address">
    <!-- scroll-view y轴滚动 -->
    <scroll-view scroll-y="true" class="addcont" style="height: 100%">
      <!-- v-if 每一项地址 -->
      <div class="item" v-if="listData.length !== 0">
        <div class="list" v-for="(item, index) in listData" :key="index">
          <div class="addresslist">
            <!-- 收货人名称 -->
            <div>
              <span>{{item.name}}</span>
              <div class="moren" v-if="item.is_default">默认</div>
            </div>
            <!-- 电话和地址信息 -->
            <div class="info" @click="selAddress(item.id)">
              <p>{{item.mobile}}</p>
              <p>{{item.address+item.address_detail}}</p>
            </div>
            <!-- 编辑图标 -->
            <div @click="toDetail(item.id)"></div>
          </div>
        </div>
      </div>
      <!-- v-else 在哪里 -->
      <div class="center" v-else>
        <p>收货地址在哪里?</p>
      </div>
    </scroll-view>
    <!-- 新建和导入 -->
    <div class="bottom">
      <div @click="wxaddress(1)">+新建地址</div>
      <div @click="wxaddress">一键导入微信地址</div>
    </div>
  </div>
</template>

<script>
import { get, getStorageOpenid } from "../../utils";
export default {
  data() {
    return {
      listData: [],
      openId: ""
    };
  },
  // onShow()获取数据
  onShow() {
    this.openId = getStorageOpenid();
    this.getAddressList();
  },
  methods: {
    // 跳转保存地址页面同时编辑
    toDetail(id) {
      // 
      wx.navigateTo({
        url: "/pages/addaddress/main?id=" + id
      });
    },
    // 新建还是导入？
    wxaddress(index) {
      // 跳转到保存地址页面
      if (index === 1) {
        wx.navigateTo({
          url: "/pages/addaddress/main"
        });
      } else {
        // 微信一键导入
        wx.chooseAddress({
          success: function(res) {
            // js全局对象，encodeURIComponent,把字符串作为url组件进行编码
            let result = encodeURIComponent(JSON.stringify(res));
            console.log('JSON.stringify(res),',JSON.stringify(res))
            console.log('encodeURIComponent编码后,',result);
            // 跳转到保存地址页面
            wx.navigateTo({
              url: "/pages/addaddress/main?res=" + result
            });
          }
        });
      }
    },
    // 请求数据
    async getAddressList() {
      let _this = this;
      const data = await get("/address/getListAction", {
        openId: _this.openId
      });
      console.log('getAddressList,获取地址信息：',data);
      _this.listData = data.data;
    },
    // 选择收货地址传递地址ID并返回支付页面
    selAddress (id) {
      // 存入本地地址ID
      wx.setStorageSync('addressId', id)
      wx.navigateBack({
        delta: 1
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>