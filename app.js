//app.js
import { Http } from "./utils/http";
App({
  onLaunch: function () {  
    Http.sendCode()   
  },
  globalData: {
    userInfo: null
  }
})