/**
 * Created by Designer on 2018/2/5.
 */
$(function () {
    //jQuery请求公共方法
    function sendRequest(url, method, data, callback, contentType, async) {
        var options = {
            url:  url,
            type: method,
            dataType:'json',
            data: data,
            success: function (result) {
                try{
                    result.message=JSON.parse(result.message);
                }catch(e){

                }
                if(result.code=='430000'){

                }else{
                   /* alert(result.message);*/
                }
                callback&&callback(result);
            },
            timeout: 20000,
            error: function (xhr, textStatus) {

            }
        };
        if (typeof async != 'undefined') {
            options.async = async;
        }
        if ((method.toUpperCase() == 'PUT' || method.toUpperCase() == 'POST') && contentType == "json") {
            options.data = JSON.stringify(data);
            options.dataType = 'json';
            options.contentType = 'application/json';
        } else {
            options.data = data;
        }
        $.ajax(options);
    }

    /*数据接口定义*/
    var basicUrl='http://www.zjaja.cn/zppwxs/hm/';
    window.api={
        //公共基础数据获取
        getBasicData:function (data,callback) {
            sendRequest(basicUrl+'base/info/gets','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //展会信息分页查询
        getShowList:function (data,callback) {
            sendRequest(basicUrl+'exh/info/srch','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //展馆信息分页查询
        getPavilionList:function (data,callback) {
            sendRequest(basicUrl+'pav/info/srch','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //主办信息分页查询
        getHostList:function (data,callback) {
            sendRequest(basicUrl+'spn/info/srch','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //获取会展详情
        getShowDetail:function (data,callback) {
            sendRequest(basicUrl+'exh/info/view','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //获取会展重要时间节点
        getShowTimeInfo:function (data,callback) {
            sendRequest(basicUrl+'exh/info/vimp','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //展会审图报电须知查看
        getShowKnow:function (data,callback) {
            sendRequest(basicUrl+'exh/info/vpae','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //展会展馆技术手册查看
        getShowManual:function (data,callback) {
            sendRequest(basicUrl+'exh/info/vnb','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //展馆信息单个查看
        getPavilionDetail:function (data,callback) {
            sendRequest(basicUrl+'pav/info/view','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //展馆介绍信息查看
        getPavilionIntroduce:function (data,callback) {
            sendRequest(basicUrl+'pav/info/vint','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //展馆已办展会查询
        getPavilionShowList:function (data,callback) {
            sendRequest(basicUrl+'pav/info/gdones','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //展馆平面图查看
        getPavilionGallery:function (data,callback) {
            sendRequest(basicUrl+'pav/info/vmap','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //主办信息单个查看
        getHostDetail:function (data,callback) {
            sendRequest(basicUrl+'spn/info/view','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //主办介绍信息查看
        getHostIntroduce:function (data,callback) {
            sendRequest(basicUrl+'spn/info/vint','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //主办已办展会查询
        getHostShowList:function (data,callback) {
            sendRequest(basicUrl+'spn/info/gdones','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //招展信息分页查询
        getFlauntList:function (data,callback) {
            sendRequest(basicUrl+'agent/info/srch','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //招展信息单个查看
        getFlauntDetail:function (data,callback) {
            sendRequest(basicUrl+'agent/info/view','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //招展介绍信息查看
        getFlauntIntroduce:function (data,callback) {
            sendRequest(basicUrl+'agent/info/vint','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
        //招展已办展会查询
        getFlauntShowList:function (data,callback) {
            sendRequest(basicUrl+'agent/info/gdones','POST',data,function (resp) {
                callback&&callback(resp);
            });
        },
    }
})