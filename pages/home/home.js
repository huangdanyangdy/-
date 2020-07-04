// pages/home/home.js
const app = getApp()
import { api } from "../../utils/api";
import { Http } from "../../utils/http";
var http = new Http();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalsite: 0,
    currList: [],
    hisList: [],
    btn_active: 1,
    func_list: [
      {
        index: 0,
        imageSrc: '../../image/icon-all.png',
        name: '全部'
      },
      {
        index: 1,
        imageSrc: '../../image/store.png',
        name: '仓库'
      },
      {
        index: 2,
        imageSrc: '../../image/shops.png',
        name: '店铺'
      },
      {
        index: 3,
        imageSrc: '../../image/old-house.png',
        name: '古大厝'
      },
      {
        index: 4,
        imageSrc: '../../image/workSpace.png',
        name: '综合厂房'
      },
      {
        index: 5,
        imageSrc: '../../image/buildings.png',
        name: '商住楼'
      },
      {
        index: 6,
        imageSrc: '../../image/house.png',
        name: '居民住宅'
      },
      {
        index: 7,
        imageSrc: '../../image/rend.png',
        name: '出租房'
      }

    ],
  },
  toCheck(e) {
    var index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/situationList/situationList?index=' + index,
    })
  },
  topwd() {
    wx.navigateTo({
      url: '/pages/pwd/pwd',
    })
  },
  checkout(e) {
    var btn_active = e.currentTarget.dataset.btn_active;
    this.setData({
      btn_active: btn_active
    })
  },
  viewTasks(e) {
    var taskId = e.currentTarget.dataset.index
    var taskName = e.currentTarget.dataset.taskName
    console.log(taskName,"e.currentTarget.dataset.taskName")
    wx.navigateTo({
      url: '/pages/situationList/situationList?taskId=' + taskId + '&index=empty' + '&taskName=' + taskName,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this
    Http.request({
      url: api.getOrgSiteCount,
      method: 'post',
      data: app.globalData.userInfo,
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            totalsite: res.data.data.count,
            currList: res.data.data.currList,
            hisList: res.data.data.hisList
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