// pages/situationStatus/situationStatus.js
const app = getApp()
import { api } from "../../utils/api";
import { Http } from "../../utils/http";
var http = new Http();
Page({
  data: {
    com_msg:[],
    checkList:'',
    taskList:'',
    siteId: '',
    houseStatusStr:''
  },
  reset(e){
    var id=e.currentTarget.dataset.flag
    wx.navigateTo({
      url: '/pages/resetMsg/resetMsg?id='+id
    })
  },
  addSituation(){
    var id = e.currentTarget.dataset.flag
    wx.navigateTo({
      url: '/pages/addSituation/addSituation?id=' + id
    })
  },
  toCheck(e){
    var taskId = e.currentTarget.dataset.index
    var status=e.currentTarget.dataset.status
    var siteId = this.data.siteId
    var name=this.data.com_msg.unitName
    var address=this.data.com_msg.address
    wx.navigateTo({
      url: '/pages/check/check?taskId='+taskId+'&siteId='+siteId+'&status='+status+'&siteName='+name+'&siteAddress='+address
    })      
  },
  viewCheckLog(e){
    var id = e.currentTarget.dataset.index  
    var name = this.data.com_msg.unitName
    var address = this.data.com_msg.address
    wx.navigateTo({
      url: '/pages/checkHis/checkHis?checkLogId=' + id + '&siteName=' + name + '&siteAddress=' + address
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      siteId: options.id
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
    var that = this
    Http.request({
      url: api.getSiteInfoById,
      method: 'post',
      data: { 
        userId: app.globalData.userInfo.userId,
        siteId: that.data.siteId
      } ,
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            com_msg:res.data.data.siteInfo,
            checkList: res.data.data.checkList,
            taskList: res.data.data.taskList
          })
          var num=res.data.data.siteInfo.houseStatus
          var str=""
          switch(num){
            case 1: 
              str="出租房";
              break;
            case 2: 
              str="仓库";
              break;
            case 3: 
              str="古大厝";
              break;
            case 4: 
              str="综合厂房";
              break;
            case 5: 
              str="商住楼";
              break;
            case 6: 
              str="居民住宅";
              break;
            case 7: 
              str="店铺";
              break;
          }
          that.setData({
            houseStatusStr:str
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
    // wx.navigateBack({
    //   delta: 1
    // })
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