// pages/check/check.js
const app = getApp()
import { api } from "../../utils/api";
import { Http } from "../../utils/http";
var http = new Http();
Page({
  data: {
    showMask:false,//图片预览遮罩层
    imgSrc:'',//预览图片的路径
    siteName:'',
    status:0,
    showReCheckButton: false,
    change:false,
    showChangeButton:false,
    siteAddress:'',
    siteId:'',
    taskId:'',
    checkLogId:'',
    form:[],
    src:'../../image/camera.png',
    srcList:[],//现场拍照数组
    sign_img:[],//签字拍照数组
    my_photo:false,//打开相机状态
    placeImgStatus:false,//判断现场拍照状态码
    signImgStatus: false,//判断签字拍照状态码
    array: [{
      txt1: '',
      txt2: ''
    }],
    imagesNumber:0,
    signImgNumber:0,
    siteTypeList:[
      {value:1,name:'第1类，将员工集体宿舍设置在车间或者仓库同一建筑内的工业场所'},
      {value:2,name:'第2类，利用住宅或出租房屋从事生产加工，住宿与生产混为一体的作坊式生产加工场所'},
      {value:3,name:'第3类，分布在临街商业用房或住宅内，住宿与经营混设在同一连接空间内的经营性场所'},
      {value:4,name:'第4类，集中在城乡结合部、城中村，连片生产、经营和住宿的区域性“三合一”场所等'}
    ],
    haveBusinessLicenseList:[
      {value:0,name:'否'},
      {value:1,name:'是'}
    ],
    isThreeInOneList:[
      {value:0,name:'否'},
      {value:1,name:'是'}
    ],
    reachFireStandarList:[
      {value:0,name:'否'},
      {value:1,name:'是'}
    ],
    factoryStatusList:[
      {value:0,name:'自有'},
      {value:1,name:'租赁'}
    ],
    fireFacilityStatusList:[
      {value:0,name:'无'},
      {value:1,name:'有'},
      {value:2,name:'不足'},
      {value:3,name:'损坏'}
    ],
    evacuationExitList:[
      {value:0,name:'畅通'},
      {value:1,name:'堵塞'},
      {value:2,name:'锁闭'}
    ],
    gasUsageList:[
      {value:0,name:'无'},
      {value:1,name:'有'}
    ]
  },
  // 表单提交
  formSubmit(e){
    var that=this
    var eData=e.detail.value
    var siteId=that.data.siteId 
    for (var key in eData) {
      if (!eData[key]){
        wx.showToast({
          title: '请把表单填写完整！',
          icon: 'none',
          duration: 1500
        })
        return
      }
    }
    if (that.data.array == ''|| that.data.srcList == '' || that.data.sign_img == ''){
      wx.showToast({
        title: '请把表单填写完整！',
        icon: 'none',
        duration: 1500
      })
      return
    }else{
      Http.request({
        url: api.saveCheckLog,
        method: 'post',
        data: {
          checkLogId: that.data.checkLogId,
          createUserId: app.globalData.userInfo.userId,
          modifyUserId: app.globalData.userInfo.userId,
          taskId: that.data.taskId,
          siteId: siteId,
          siteType: parseInt(eData.siteType),
          haveBusinessLicense: parseInt(eData.haveBusinessLicense),
          isThreeInOne: parseInt(eData.isThreeInOne),
          reachFireStandar: parseInt(eData.reachFireStandar),
          floor: parseInt(eData.floor),
          area: parseFloat(eData.area),
          liveNumber: parseInt(eData.liveNumber),
          factoryStatus: parseInt(eData.factoryStatus),
          fireFacilityStatus: parseInt(eData.fireFacilityStatus),
          evacuationExit: parseInt(eData.evacuationExit),
          gasUsage: parseInt(eData.gasUsage),
          list: that.data.array
        },
        success(res) {
          if (res.data.code == 200) {
            that.setData({
              checkLogId: res.data.data
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
              duration: 1500,
            })
            wx.redirectTo({
              url: '/pages/situationStatus/situationStatus?id=' + that.data.siteId
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
        source: 'images',
        id:that.data.checkLogId   
      },
      success: (resp) => {
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
              source: 'signImg',
              id:that.data.checkLogId
            }            
          })
        }        
      })
    }   
  },
  reset(){
    if(this.data.change){
      this.setData({
        change:false
      })
    }else{
      this.setData({
        change:true
      })
    }    
  },
  inputtext(e){
    var that=this
    var index=e.target.dataset.index-1
    var name=e.target.dataset.name
    var conent=e.detail.value
    var arr=that.data.array
    if(name=="txt1"){
      arr[index]['txt1']=conent
    }else{
      arr[index]['txt2']=conent
    }
    that.setData({
      array:arr
    })
  },  
  addLine(){
    var that=this;
    var list={
      txt1: '',
      txt2: ''
    }
    var array1=that.data.array    
    array1=array1.concat(list)
    that.setData({
      array: array1
    })
  },
  subLine(){
    var that = this;
    var arr1=that.data.array    
    if (arr1.length > 0){
      var index=arr1.length-1
      if(arr1[index]['txt1']!="" || arr1[index]['txt2']!=""){
        wx.showModal({
          title: '提示',
          content: '行中有内容存在是否确认删除！',
          success (res) {
            if (res.confirm) {
              arr1.pop()
              that.setData({
                array:arr1
              })
            } 
          }
        })
      }else{
        arr1.pop()
        that.setData({
          array:arr1
        })
      }     
    }
  },
  // 开始现场拍照
  startPhoto(){
     this.setData({
      my_photo: true,
      showMask:true,
      placeImgStatus:true
    })
  },
  // 开始签字拍照
  startSign_img() {
    this.setData({
      my_photo: true,
      showMask: true,
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
        showMask: false,
        placeImgStatus:false
      })
    }
    if (this.data.signImgStatus){
      this.setData({
        my_photo: false,
        showMask: false,
        signImgStatus: false
      })
    }    
  },
  //删除现场照片
  delImg(e){
    var that=this  
    var number=that.data.imagesNumber
    var status=that.data.status
    var change=that.data.change
    if(!change||status==0){
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
                url:api.deletePhoto,
                method:'post',
                data:{
                  src:str,
                  checkLogId:that.data.checkLogId
                }                
              })
            }
          } 
        }
      })
    }    
  },
  //删除签字照片
  delsign_Img(e) {
    var that=this
    var number=that.data.signImgNumber
    var status=that.data.status
    var change=that.data.change
    if(!change||status==0){
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
                url:api.deletePhoto,
                method:'post',
                data:{
                  src:str,
                  checkLogId:that.data.checkLogId
                }
              })
            }
          }        
        }
      })
    }       
  }, 
  //预览图片事件
  prevImg(e){
    var that=this
    that.setData({
      showMask:!that.data.showMask,
      imgSrc:e.currentTarget.dataset.imgSrc
    })
    console.log(that.data.imgSrc,"that.data.imgSrc")
  },

  toReCheck(e){
    var taskId=this.data.taskId
    var siteId=this.data.siteId
    var checkLogId=this.data.checkLogId
    var name=this.data.siteName
    var address=this.data.siteAddress
    var status=this.data.status
    wx.navigateTo({
      url: '/pages/reCheck/reCheck?taskId='+taskId+'&siteId='+siteId+'&checkLogId='+checkLogId+'&siteName='+name+'&siteAddress='+address+'&status='+status
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.setData({
      siteId: options.siteId,
      status: options.status,
      taskId: options.taskId,
      siteName:options.siteName,
      siteAddress:options.siteAddress
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
    var status=that.data.status
    var taskId=that.data.taskId
    var siteId=that.data.siteId    
    if(status>0){
      Http.request({
        url:api.getCheckLog2,
        method:'post',
        data:{
          taskId:taskId,
          siteId:siteId
        },
        success(res){
          if(res.data.code==200){
            var resData=res.data.data 
            var siteTypeList1 = that.data.siteTypeList
            var haveBusinessLicenseList1 = that.data.haveBusinessLicenseList
            var isThreeInOneList1=that.data.isThreeInOneList
            var reachFireStandarList1=that.data.reachFireStandarList
            var factoryStatusList1=that.data.factoryStatusList
            var fireFacilityStatusList1=that.data.fireFacilityStatusList
            var evacuationExitList1=that.data.evacuationExitList
            var gasUsageList1=that.data.gasUsageList
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
            siteTypeList1.forEach(item=>{
              if (resData.siteType === item.value){
                item.checked=true
              }
            })
            haveBusinessLicenseList1.forEach(item=>{
              if (resData.haveBusinessLicense === item.value){
                item.checked=true
              }
            })
            isThreeInOneList1.forEach(item=>{
              if (resData.isThreeInOne === item.value){
                item.checked=true
              }
            })
            reachFireStandarList1.forEach(item=>{
              if (resData.reachFireStandar === item.value){
                item.checked=true
              }
            })
            factoryStatusList1.forEach(item=>{
              if (resData.factoryStatus === item.value){
                item.checked=true
              }
            })
            fireFacilityStatusList1.forEach(item=>{
              if (resData.fireFacilityStatus === item.value){
                item.checked=true
              }
            })
            evacuationExitList1.forEach(item=>{
              if (resData.evacuationExit === item.value){
                item.checked=true
              }
            })
            gasUsageList1.forEach(item=>{
              if (resData.gasUsage === item.value){
                item.checked=true
              }
            })
            that.setData({
              siteTypeList: siteTypeList1,
              haveBusinessLicenseList:haveBusinessLicenseList1,
              isThreeInOneList:isThreeInOneList1,
              reachFireStandarList:reachFireStandarList1,
              factoryStatusList:factoryStatusList1,
              fireFacilityStatusList:fireFacilityStatusList1,
              evacuationExitList:evacuationExitList1,
              gasUsageList:gasUsageList1,
              form:resData,
              array:resData.array,
              checkLogId:resData.id              
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
    if(status==3||status==4){
      that.setData({
        showReCheckButton:true,
        change:true
      })
    }
    if(status==1){
      that.setData({
        showChangeButton:true,
        change:true
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