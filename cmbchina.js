/*
招商银行信用卡微信公众号：“领积分 - 🎁签到领积分” 获取 Cookie
[Script]
cron "* 9 * * *" debug=1,script-path=https://raw.githubusercontent.com/cyqlegend/Breaker/master/script/cmb/cmbchina.js,script-update-interval=0
http-request ^https:\/\/weclub\.ccc\.cmbchina.com\/SCRMCustomActivityFront\/checkin\/request\/get-home-data\.json\?activityCode=checkin debug=1,script-path=https://raw.githubusercontent.com/cyqlegend/Breaker/master/script/cmb/cmbchina.js,script-update-interval=0
https:\/\/weclub\.ccc\.cmbchina.com\/SCRMCustomActivityFront\/checkin\/request\/get-home-data\.json\?activityCode=checkin max-size=0,script-path=https://raw.githubusercontent.com/cyqlegend/Breaker/master/script/cmb/cmbchina.js,script-update-interval=0
[mitm]
hostname = weclub.ccc.cmbchina.com
*/

/******************** 转换器 ********************/
let isQuantumultX=$task!=undefined;let isSurge=$httpClient!=undefined;let isLoon=isSurge&&typeof $loon!=undefined;var $task=isQuantumultX?$task:{};var $httpClient=isSurge?$httpClient:{};var $prefs=isQuantumultX?$prefs:{};var $persistentStore=isSurge?$persistentStore:{};var $notify=isQuantumultX?$notify:{};var $notification=isSurge?$notification:{};if(isQuantumultX){var errorInfo={error:"",};$httpClient={get:(url,cb)=>{var urlObj;if(typeof url=="string"){urlObj={url:url,}}else{urlObj=url}
$task.fetch(urlObj).then((response)=>{cb(undefined,response,response.body)},(reason)=>{errorInfo.error=reason.error;cb(errorInfo,response,"")})},post:(url,cb)=>{var urlObj;if(typeof url=="string"){urlObj={url:url,}}else{urlObj=url}
url.method="POST";$task.fetch(urlObj).then((response)=>{cb(undefined,response,response.body)},(reason)=>{errorInfo.error=reason.error;cb(errorInfo,response,"")})},}}
if(isSurge){$task={fetch:(url)=>{return new Promise((resolve,reject)=>{if(url.method=="POST"){$httpClient.post(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error,})}else{resolve(null,{error:error,})}})}else{$httpClient.get(url,(error,response,data)=>{if(response){response.body=data;resolve(response,{error:error,})}else{resolve(null,{error:error,})}})}})},}}
if(isQuantumultX){$persistentStore={read:(key)=>{return $prefs.valueForKey(key)},write:(val,key)=>{return $prefs.setValueForKey(val,key)},}}
if(isSurge){$prefs={valueForKey:(key)=>{return $persistentStore.read(key)},setValueForKey:(val,key)=>{return $persistentStore.write(val,key)},}}
if(isQuantumultX){$notify=((notify)=>{return function(title,subTitle,detail,url=undefined){detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;notify(title,subTitle,detail)}})($notify);$notification={post:(title,subTitle,detail,url=undefined)=>{detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;$notify(title,subTitle,detail)},}}
if(isSurge&&!isLoon){$notification.post=((notify)=>{return function(title,subTitle,detail,url=undefined){detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;notify.call($notification,title,subTitle,detail)}})($notification.post);$notify=(title,subTitle,detail,url=undefined)=>{detail=url===undefined?detail:`${detail}\n点击链接跳转: ${url}`;$notification.post(title,subTitle,detail)}}
if(isLoon){$notify=(title,subTitle,detail,url=undefined)=>{$notification.post(title,subTitle,detail,url)}}
/******************** 转换器 ********************/

const checkinURL = 'https://weclub.ccc.cmbchina.com/SCRMCustomActivityFront/checkin/request/checkin.json';
const cookieKey = 'iNotificatioin_cmbchina_cookieKey';
const userAgentKey = 'iNotificatioin_cmbchina_userAgentKey';

let isGetCookie = typeof $request !== 'undefined';

if (isGetCookie) {
    // 获取 Cookie
    if ($request.headers['Cookie']) {
        var cookie = $request.headers['Cookie'];
        var userAgent = $request.headers['User-Agent'];
        $persistentStore.write(cookie, cookieKey);
        //$prefs.setValueForKey(cookie, cookieKey);
        $persistentStore.write(userAgent, userAgentKey);
        //$prefs.setValueForKey(userAgent, userAgentKey);
        $notification.post("成功获取招商银行信用卡 cookie 🎉", "", "");
    } else {
        $notification.post("获取招商银行信用卡 cookie 失败😭", "", "");
    }
    $done({});
} else {
    // 签到
    var request = {
        url: checkinURL,
        headers: {
            'Cookie': $persistentStore.read(cookieKey),
            'User-Agent': $persistentStore.read(userAgentKey),
            'Content-type' : 'application/json; charset=utf-8'
        },
        body: JSON.stringify({'activityCode' : 'checkin'})
    };

    $httpClient.post(request, function(error, response, data){
        if (error) {
            $notification.post("招商银行信用卡签到，请求失败", "", error);
        } else {
            const result = JSON.parse(data);
            if (result.respCode == 1000) {
                $notification.post("招商银行信用卡", "", "签到成功，获得 " + result.data.awardValue + " 积分🎁");
            } else if (result.respCode == 1452) {
                $notification.post("招商银行信用卡", "", "签到失败，请获取 cookie");
            } else if (result.respCode == 'custom_8500') {
                $notification.post("招商银行信用卡", "", "签到失败，" + result.respMsg);
            } else {
                $notification.post("招商银行信用卡", "", "签到失败，请查看日志");
                console.log(result);
            }
        }
    });
}
