// pages/pwd/pwd.js
const app = getApp()
import { api } from "../../utils/api";
import { Http } from "../../utils/http";
var http = new Http();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: [],
  },
  reset(e) {
    if (e.currentTarget.dataset.flag == 1) {
      this.setData({
        new_pwd: ''
      })
    } else {
      this.setData({
        comfirm_pwd: ''
      })
    }
  },
  formSubmit(e) {        
    var that = this
    that.data.form = e.detail.value
    if(e.detail.value.old_pwd==null||e.detail.value.old_pwd==""){
      wx.showToast({
        title: '请输入原密码',
        icon: 'none',
        duration: 1500
      })
    }else if(e.detail.value.new_pwd==null||e.detail.value.new_pwd==""){
      wx.showToast({
        title: '请输入新密码',
        icon: 'none',
        duration: 1500
      })
    }else if(e.detail.value.new_pwd!=e.detail.value.comfirm_pwd){
      wx.showToast({
        title: '两次输入的密码不一致',
        icon: 'none',
        duration: 1500
      })
    }else{
      console.log('=========')
      Http.request({
        url: api.changePwd,
        method: 'post',
        data: {
          oldPwd: e.detail.value.old_pwd,
          newPwd: e.detail.value.new_pwd,
          userId: app.globalData.userInfo.userId,
        },
        success(res) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      })
    } 

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