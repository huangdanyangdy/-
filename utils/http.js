import { api } from "./api";
class Http {
  static sendCode(param){
    wx.login({
      success: res => {
        wx.request({
          url: api.sendCode,
          method: 'POST',
          header: {
              'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
              code: res.code,              
          },
          success(res){
            if(res.data.code==200){
              wx.setStorage({key:'sessionId',data:res.data.data})
            }
          }
      })
      }
    })
  }
  static login(param) {
    var header = {
      'content-type': 'application/json'     
    }
    if (!param.method) {
      param.method = 'GET';
    }     
    if (!param.data) {
      param.data = {};
    }
    wx.request({
      url: param.url,
      data: param.data,
      header: header,
      method: param.method,
      success: (result) => {
        let code = result.statusCode.toString()
        if (code.startsWith('2')) {
          if (param.success) {
            param.success(result);
          }
        } else {
          if (param.fail) {
            param.fail(result);
          }
        }

      },
      fail: (err) => {
        if (param.fail) {
          param.fail(err);
        }
      }
    });
  }
  static request(param) {
    var header = {
      'content-type': 'application/json'  
    }
    if (!param.method) {
      param.method = 'GET';
    }     
    if (!param.data) {
      param.data = {};
    }
    wx.request({
      url: param.url,
      data: param.data,
      header: header,
      method: param.method,
      success: (result) => {
        let code = result.statusCode.toString()
        if (code.startsWith('2')) {
          if (param.success) {
            param.success(result);
          }
        } else {
          if (param.fail) {
            param.fail(result);
          }
        }
      },
      fail: (err) => {
        if (param.fail) {
          param.fail(err);
        }
      }
    });
  }
  static requestByIgnoreLogin(param) {
    let token = wx.getStorageSync("token");
    console.log(token);
    var header = {
      'content-type': 'application/json',
      'token': token
    }
    if (!param.method) {
      param.method = 'GET';
    } else {
      if (param.method.toUpperCase() != "GET") {
        header = {
          'content-type': 'application/x-www-form-urlencoded',
          // 'content-type': 'application/json',
          'token': token
        }
      }
    }
    if (!param.data) {
      param.data = {};
    }
    wx.request({
      url: param.url,
      data: param.data,
      header: header,
      method: param.method,
      success: (result) => {
        let code = result.statusCode.toString()
        if (code.startsWith('2')) {
          if (param.success) {
            param.success(result);
          }
        } else {
          if (param.fail) {
            param.fail(result);
          }
        }
      },
      fail: (err) => {
        if (param.fail) {
          param.fail(err);
        }
      }
    });
  }
  static requestByLogin(param) {
    let token = wx.getStorageSync("token");
    console.log(token);
    if (token != null && token != '') {
      var header = {
        'content-type': 'application/json',
        'token': token
      }
      if (!param.method) {
        param.method = 'GET';
      } else {
        if (param.method.toUpperCase() != "GET") {
          header = {
            'content-type': 'application/x-www-form-urlencoded',
            // 'content-type': 'application/json',
            'token': token
          }
        }
      }
      if (!param.data) {
        param.data = {};
      }
      wx.request({
        url: param.url,
        data: param.data,
        header: header,
        method: param.method,
        success: (result) => {
          let code = result.statusCode.toString()
          if (code.startsWith('2')) {
            if (result.data.status.toString() == "0") {
              if (param.success) {
                param.success(result);
              }
            } else if (result.data.status.toString() == "3") {
              wx.showModal({
                title: '提示',
                content: '登录授权后方可进行该操作,是否进行登录授权',
                success(res) {
                  if (res.confirm) {
                    if (param.path) {
                      wx.navigateTo({
                        url: '/pages/welcome/welcome?path=' + param.path
                      })
                    } else {
                      wx.navigateTo({
                        url: '/pages/welcome/welcome'
                      })
                    }
                  }
                }
              })
            } else {
              if (param.fail) {
                param.fail(result);
              }
            }
          } else {
            if (param.fail) {
              param.fail(result);
            }
          }
        },
        fail: (err) => {
          if (err.statusCode == 500) {
            console.log("errCode ?:", err.statusCode);
            wx.showModal({
              title: '提示',
              content: '登录授权后方可进行该操作,是否进行登录授权',
              success(res) {
                if (res.confirm) {
                  if (param.path) {
                    wx.navigateTo({
                      url: '/pages/login/login?path=' + param.path
                    })
                  } else {
                    wx.navigateTo({
                      url: '/pages/login/login'
                    })
                  }
                }
              }
            })
          }
          if (param.fail) {
            param.fail(err);
          }
        },
        complete(res) {
          if (param.complete) {
            param.complete(res)
          }
        }
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '登录授权后方可进行该操作,是否进行登录授权',
        success(res) {
          if (res.confirm) {
            if (param.path) {
              wx.navigateTo({
                url: '/pages/login/login?path=' + param.path
              })
            } else {
              wx.navigateTo({
                url: '/pages/login/login'
              })
            }
          }
        }
      })
    }
  }
}
export {
  Http
}