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
    index:'',
    taskId:'',
    taskName:'',
    siteList: [],
    total: [],
    searchText: ''
  },
  //输入框事件
  inputChange(e) {
    var that=this
    var str=e.detail.value
    var list=that.data.siteList
    var list2=[]
    if(str!=null&&str!=""){
      list.forEach(item=>{
        if(item.name.indexOf(str)!= -1||item.address.indexOf(str)!= -1){
          list2.push(item)
        }
      })
      this.setData({
        siteList: list2
      })
    }else{
      that.reset()
    } 
  },
  //重置输入框
  reset() {
    var that=this
    var old=that.data.total
    this.setData({
      siteList: old
    })
  },
  //点击搜索事件
  search() {
    this.inputChange()
  },
  toDetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/situationStatus/situationStatus?id='+id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.index != "empty") {
      that.data.index=options.index//设置传入的参数
      var index= parseInt(options.index)
      switch (index) {
        case 0:
          wx.setNavigationBarTitle({
            title:'全部场所列表'
          });
          break;
        case 1:
          wx.setNavigationBarTitle({
            title:'仓库场所列表'
          });
          break;
        case 2:
          wx.setNavigationBarTitle({
            title:'店铺场所列表'
          });
          break;
        case 3:
          wx.setNavigationBarTitle({
            title:'古大厝场所列表'
          });
          break;
        case 4:
          wx.setNavigationBarTitle({
            title: '综合厂房场所列表'
          });
          break;
        case 5:
          wx.setNavigationBarTitle({
            title: '商住楼场所列表'
          });
          break;
        case 6:
          wx.setNavigationBarTitle({
            title: '居民住宅场所列表'
          });
          break;
        case 7:
          wx.setNavigationBarTitle({
            title: '出租房场所列表'
          });
          break;
      }
    }else{
      that.data.taskId=options.taskId
      that.data.taskName = options.taskName
      wx.setNavigationBarTitle({
        title: that.data.taskName+'场所列表'
      });
    }
    
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
    if (that.data.index !='') {
      Http.request({
        url: api.getSiteListByType,
        method: 'post',
        data: {
          orgId: app.globalData.userInfo.orgId,
          index: parseInt(that.data.index)
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              siteList: res.data.data,
              total: res.data.data
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
    } else {
      Http.request({
        url: api.getSiteListByTask,
        method: 'post',
        data: {
          taskId:that.data.taskId
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              siteList: res.data.data,
              total: res.data.data
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
    }

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