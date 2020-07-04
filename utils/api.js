var _api_root1 = 'https://plataq.aite.net.cn/'
var _api_root = 'https://plataq.aite.net.cn/wxApi/'
var api = {
    root: _api_root,
    sendCode: _api_root+'wxCode',
    login: _api_root1 + "login",   
    wxlogin: _api_root1 + "login/wx", 
    getOrgSiteCount: _api_root+'getOrgSiteCount',
    getSiteListByType: _api_root + 'getSiteListByType',
    getSiteListByTask: _api_root +'getSiteListByTask',
    getSiteInfoById: _api_root +'getSiteInfoById' ,
    updateSite: _api_root + 'updateSite',
    changePwd:_api_root + 'changePwd',
    saveCheckLog: _api_root+'saveCheckLog',
    uploadPhoto:_api_root+'uploadPhoto',
    getCheckLogById:_api_root+'getCheckLogById/',
    deletePhoto:_api_root+'deletePhoto',
    saveOrUpdateReCheck:_api_root+'saveOrUpdateReCheck',
    getReCheckById:_api_root+'getReCheckById/',
    updateReCheckImg:_api_root+'updateReCheckImg',
    getCheckLog2:_api_root+ 'findCLByTaskAndSite',
    getReCheckByCLId:_api_root+'getReCheckByCLId/',   
}
export {
    _api_root,
    api
}