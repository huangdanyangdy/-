// pages/situationStatus/situationStatus.js
const app = getApp()
import { api } from "../../utils/api";
import { Http } from "../../utils/http";
var http = new Http();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    siteId:'',
    com_msg:
      {
        id: '',
        unitName: "新丰机械制造有限公司",
        phone: "13900000000",
        address: "泉州市常泰路180号",
        businessScope: "",
        notes: "",
        house_status: '',
        orgId: '',
        linkName: '林细化'
      },
    house_items: [
      { name: '出租房', value:1 },
      { name: '仓库', value:2, },
      { name: '古大厝', value:3 },
      { name: '综合厂房', value:4 },
      { name: '商住楼', value:5 },
      { name: '居民住宅', value:6 },
      { name: '店铺', value: 7 }
    ]
  },
  formSubmit(e) {
    var that = this
    var form= e.detail.value
    form.id = that.data.com_msg.id
    // form.orgId = that.data.com_msg.orgId
    Http.request({
      url: api.updateSite,
      method: 'post',
      data: form,
      success(res) {
        if (res.data.code == 200) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
            success: wx.redirectTo({
              url: '/pages/situationStatus/situationStatus?id=' + that.data.siteId
            })
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      }
    })   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, "options")
    
    var siteId = options.id
    var that = this
    that.data.siteId = options.id
    Http.request({
      url: api.getSiteInfoById,
      method: 'post',
      data: {
        userId: app.globalData.userInfo.userId,
        siteId: siteId
      },
      success(res) {
        if (res.data.code == 200) {
          console.log(res.data.data)
          that.setData({
            com_msg: res.data.data.siteInfo//
          })
          let hs = res.data.data.siteInfo.houseStatus
          var house_items1 = that.data.house_items
          house_items1.forEach(item=>{
            if (hs === item.value){
              item.checked=true
            }
          })
          that.setData({
            house_items: house_items1
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.navigateBack({
      delta:1
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})