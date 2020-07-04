// pages/login/login.js
const app = getApp()
import { api,_api_root } from "../../utils/api";
import { Http } from "../../utils/http";
var http = new Http();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName:'',
    password:''
  },
  userNameInput(e){
    this.setData({
      userName: e.detail.value
    })
  },
  pwd(e){
    this.setData({
      password: e.detail.value
    })
  },
  toHome(){
    var myreg = /^(((13[0-9])|(14[5-7])|(15[0-9])|(17[0-9])|(18[0-9])|(19[0-9]))+\d{8})$/;
    if (this.data.userName.length == 0) {
      wx.showToast({
        title: '请输入账号或手机号码',
        icon: 'none',
        duration: 1500
      })
      return false;
    }  else {
      if (this.data.password.length == 0) {
        wx.showToast({
          title: '密码不能为空',
          icon: 'none',
          duration: 1500
        })
        return false;
      }else{
        Http.request({
          url: api.login,
          method: 'post',
          data: this.data,
          success(res){
            if(res.data.code==200){
              app.globalData.userInfo = res.data.data.userInfo
              wx.setStorageSync('token', res.data.data.token)
              wx.reLaunch({
                url: '/pages/home/home',
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1500
              })
            }
          }
        })        
      }
    }
  },
  getPhoneNumber(e){           
    wx.checkSession({
      success(){
        wx.getStorage({
          key: 'sessionId',
          success (store) {
            Http.login({
              url: api.wxlogin,
              data: {
                "data": e.detail,
                "sessionId":store.data
              },
              method: 'Post',
              success(res){
                if(res.data.code===200){
                  app.globalData.userInfo = res.data.data.userInfo
                  wx.setStorageSync('token', res.data.data.token)
                  wx.reLaunch({
                    url: '/pages/home/home',
                  })
                }else{
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 1500
                  })
                }
              }
            })
          }
        })
      },
      fail(){
        Http.sendCode({
          success(res){
            wx.getStorage({
              key: 'sessionId',
              success (store) {
                Http.login({
                  url: api.wxlogin,
                  data: {
                    "data": e.detail,
                    "sessionId":store.data
                  },
                  method: 'Post',
                  success(res){
                    if(res.data.code===200){
                      app.globalData.userInfo = res.data.data.userInfo
                      wx.setStorageSync('token', res.data.data.token)
                      wx.reLaunch({
                        url: '/pages/home/home',
                      })
                    }else{
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1500
                      })
                    }
                  }
                })
              }
            })            
          }
        })
      }
    })      
  },
  reset(){
    this.setData({
      password:''
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