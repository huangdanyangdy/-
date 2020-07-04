// pages/checkHis/checkHis.js
const app = getApp()
import { api } from "../../utils/api";
import { Http } from "../../utils/http";
var http = new Http();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showMask: false,//图片预览遮罩层
    imgSrc: '',//预览图片的路径
	  siteName: '',
    siteAddress: '',
    siteId: '',
    taskId: '',
    checkLogId: ''
  },
  //预览图片事件
  prevImg(e) {
    var that = this
    that.setData({
      showMask: !that.data.showMask,
      imgSrc: e.currentTarget.dataset.imgSrc
    })
    console.log(that.data.imgSrc, "that.data.imgSrc")
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	console.log(options,"options====")
    var that = this
    that.setData({
      checkLogId: options.checkLogId,
      siteName: options.siteName,
      siteAddress: options.siteAddress
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
    var checkLogId = that.data.checkLogId
    if (checkLogId != "empty") {
      Http.request({
        url: api.getCheckLogById + checkLogId,
        method: 'get',
        success(res) {
          var res = res.data.data
          that.setData({
            area: res.area,
            array: res.array,
            evacuationExit: res.evacuationExit,
            factoryStatus: res.factoryStatus,
            fireFacilityStatus: res.fireFacilityStatus,
            gasUsage: res.gasUsage,
            haveBusinessLicense: res.haveBusinessLicense,
            isThreeInOne: res.isThreeInOne,
            liveNumber: res.liveNumber,
            reachFireStandar: res.reachFireStandar,
            sign_img: res.sign_img,
            siteType: res.siteType,
            srcList: res.srcList,
            floor: res.floor
          })
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