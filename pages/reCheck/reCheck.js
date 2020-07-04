// pages/reCheck/reCheck.js
const app = getApp()
import { api } from "../../utils/api";
import { Http } from "../../utils/http";
var http = new Http();
Page({
  data: {
    siteName:'',
    siteAddress:'',
    siteId:'',
    taskId:'',
    checkLogId:'',
    reCheckId:'',
    taskStatus:0,
    src: '../../image/camera.png',
    srcList: [],//现场拍照数组
    sign_img: [],//签字拍照数组
    my_photo: false,//打开相机状态
    placeImgStatus: false,//判断现场拍照状态码
    signImgStatus: false,//判断签字拍照状态码
    imagesNumber:0,
    signImgNumber:0
  },
  inputtext(e){
    var that = this
    var areaText = []
    var areaText1 = []
    areaText=e.detail.value
    areaText1 = that.data.form.status
    areaText.concat(areaText1)
    that.data.form.status = areaText
  },
  // 表单提交
  formSubmit(e) {
    // this.data.form = e.detail.value
    // this.data.form.sign_img = this.data.sign_img
    // this.data.form.srcList = this.data.srcList
    var that=this
    var eData=e.detail.value
    // that.data.form.status= eData.status
    for (var key in eData) {
      if (!eData[key]) {
        wx.showToast({
          title: '请把表单填写完整！',
          icon: 'none',
          duration: 1500
        })
        return
      }
    }
    if (that.data.srcList == '' || that.data.sign_img == '') {
      wx.showToast({
        title: '请拍照上传',
        icon: 'none',
        duration: 1500
      })
      return
    } else {
      Http.request({
        url: api.saveOrUpdateReCheck,
        method: 'post',
        data: {
          taskId: that.data.taskId,
          siteId: that.data.siteId,
          reCheckId: that.data.reCheckId,
          status: eData.status,
          checkLogId: that.data.checkLogId,
          createUserId: app.globalData.userInfo.userId,
          modifyUserId: app.globalData.userInfo.userId
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              reCheckId: res.data.data
            })
            if (that.data.srcList.length > 0) {
              var pics = that.data.srcList
              var pics2 = []
              pics.forEach(item => {
                if (item.indexOf("http") == -1) {
                  pics2.push(item)
                }
              })
              if (pics2.length > 0) {
                that.uploadimg({
                  url: api.uploadPhoto,
                  path: pics,
                })
              } else {
                that.uploadSignImg()
              }
            } else {
              that.uploadSignImg()
            }
            wx.showToast({
              title: '保存成功！',
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
    }
  },
  uploadimg(data) {    
    var that = this,
    i = data.i ? data.i : 0,
    success = data.success ? data.success : 0,
    fail = data.fail ? data.fail : 0;    
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',
      formData: {
        source: 'images2',
        id:that.data.reCheckId   
      },
      success: (res) => {
        success++;
      },
      fail: (res) => {
        fail++;
      },
      complete: () => {
        i++;
        if (i == data.path.length) {
          that.setData({
            srcList: []
          })
          that.uploadSignImg()           
        } else {
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
  uploadSignImg(){
    var that=this
    if(that.data.sign_img.length>0){
      that.data.sign_img.forEach(item=>{
        if(item.indexOf("http") == -1){
          wx.uploadFile({
            url:api.uploadPhoto,
            filePath:item,
            name:'file',
            formData:{
              source: 'signImg2',
              id:that.data.reCheckId
            }
          })
        }        
      })
    }    
  },
  // 开始现场拍照
  startPhoto() {
    this.setData({
      my_photo: true,
      placeImgStatus: true
    })
  },
  // 开始签字拍照
  startSign_img() {
    this.setData({
      my_photo: true,
      signImgStatus: true
    })
  },
  // 开始现场拍照
  startPhoto(){
    this.setData({
     my_photo: true,
     placeImgStatus:true
   })
 },
 // 开始签字拍照
 startSign_img() {
   this.setData({
     my_photo: true,
     signImgStatus: true
   })
 },
 // 拍照动作
 takePhoto() {  
   var that=this    
   if(that.data.placeImgStatus){
     var number=that.data.imagesNumber
     if(number<5){
       that.ctx = wx.createCameraContext()
       that.ctx.takePhoto({
         quality: 'high',
         success: (res) => {
           var srcItem = res.tempImagePath        
           that.setData({
             srcList: that.data.srcList.concat(srcItem),
             imagesNumber:number+1
           })        
         },
       })
     }else{
       wx.showToast({
         title: '只能上传5张现场图片',
         icon:'none',
         duration: 1500
       })
     }     
   }else if(that.data.signImgStatus){
     var number=that.data.signImgNumber
     if(number<1){
       this.ctx = wx.createCameraContext()
       this.ctx.takePhoto({
         quality: 'high',
         success: (res) => {
           var srcItem = res.tempImagePath
           this.setData({
             sign_img: this.data.sign_img.concat(srcItem),
             signImgNumber:number+1
           })        
         },
       })
     }else{
       wx.showToast({
         title: '只能上传一张签名图片',
         icon:'none',
         duration: 1500
       })
     } 
   }    
 },
 stopPhoto(){
   if(this.data.placeImgStatus){
     this.setData({
       my_photo: false,
       placeImgStatus:false
     })
   }
   if (this.data.signImgStatus){
     this.setData({
       my_photo: false,
       signImgStatus: false
     })
   }    
 },
 //删除现场照片
 delImg(e){
   var that=this   
   var number=that.data.imagesNumber
   wx.showModal({
     title: '提示',
     content: '确认删除图片？',
     success (res) {
       if (res.confirm) {
         var index = e.currentTarget.dataset.index
         var srcList=that.data.srcList;
         var str=srcList[index]
         srcList.splice(index,1)
         that.setData({
           srcList: srcList,
           imagesNumber: number-1
         })
         if(str.indexOf("http") != -1 ){
           Http.request({
             url:api.updateReCheckImg,
             method:'post',
             data:{
               src:str,
               reCheckId:that.data.reCheckId
             }
           })
         }
       } 
     }
   })    
 },
 //删除签字照片
 delsign_Img(e) {
   var that=this
   var number=that.data.signImgNumber
   wx.showModal({
     title: '提示',
     content: '确认删除图片？',
     success (res) {
       if (res.confirm) {
         var index = e.currentTarget.dataset.index
         var sign_img = that.data.sign_img;
         var str=sign_img[index]
         sign_img.splice(index,1)
         that.setData({
           sign_img: sign_img,
           signImgNumber: number-1
         })
         if(str.indexOf("http") != -1 ){
           Http.request({
             url:api.updateReCheckImg,
             method:'post',
             data:{
               src:str,
               reCheckId:that.data.reCheckId
             }
           })
         }
       }        
     }
   })    
 }, 
  prevImg(e) {
    var that = this
    that.setData({
      showMask:!that.data.showMask,
      imgSrc: e.currentTarget.dataset.imgSrc
    })
  },
  // //预览现场拍照图片
  // prevPlaceImg(e) {
  //   var index = e.currentTarget.dataset.index
  //   console.log(this.data.srcList,"this.data.srcList预览")
  //   wx.previewImage({
  //     current: this.data.srcList[index], // 当前显示图片的http链接
  //     urls: this.data.srcList // 需要预览的图片http链接列表
  //   })
  // },
  // //预览签字拍照图片
  // prevSignImg(e) {
  //   var index = e.currentTarget.dataset.index
  //   wx.previewImage({
  //     current: this.data.sign_img[index], // 当前显示图片的http链接
  //     urls: this.data.sign_img // 需要预览的图片http链接列表
  //   })
  // },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      siteId: options.siteId,
      checkLogId: options.checkLogId,
      taskId: options.taskId,
      siteName:options.siteName,
      siteAddress:options.siteAddress,
      taskStatus:options.status
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
    var that=this
    var taskStatus=that.data.taskStatus
    var checkLogId=that.data.checkLogId
    if(taskStatus==4){      
      Http.request({
        url:api.getReCheckByCLId+checkLogId,
        method:'get',
        success(res){
          if(res.data.code==200){
            var resData=res.data.data
            var imagesNumber1=0
          var signImgNumber1=0
          if(resData.srcList){
            imagesNumber1=resData.srcList.length
            that.setData({
              srcList:resData.srcList,
              imagesNumber:imagesNumber1
            })
          }
          if(resData.sign_img){
            signImgNumber1=resData.sign_img.length
            that.setData({
              sign_img:resData.sign_img, 
              signImgNumber:signImgNumber1
            })
          }    
            that.setData({                
              form:resData,
              array:resData.array,
              reCheckId:resData.id              
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              icon:'none',
              duration:1500
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
    wx.navigateBack({
      delta: 1
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