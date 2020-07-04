// pages/situationList/situationList.js
const app = getApp()
import { api } from "../../utils/api";
import { Http } from "../../utils/http";
var http = new Http();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '',
    content: [
      {
        comName: "新丰机械制造有限公司",
        addr: "常泰路180号"

      },

    ]
  },
  //输入框事件
  inputChange(e) {
    this.setData({
      searchText: e.detail.value
    })
  },
  //重置输入框
  reset() {
    console.log(this.data.searchText)
    this.setData({
      searchText: ''
    })
  },
  //点击搜索事件
  search() {
    var searchText = this.data.searchText
    console.log(this.data.searchText)
  },
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/situationStatus/situationStatus'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id, "id=====")
    // var index = parseInt(options.id)
    var that = this
    Http.request({
      url: api.getSiteListByTask,
      method: 'post',
      data: {
        taskId: options.id
      },
      success(res) {
        console.log(res,"list1==========")
        if (res.data.code == 200) {
          that.setData({
            content: res.data.data
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