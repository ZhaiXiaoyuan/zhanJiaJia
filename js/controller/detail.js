/**
 * Created by Administrator on 2018/10/10 0010.
 */
$(function () {
    var pRequest=utils.getRequest();
    var pageType=pRequest.pageType;
    var id=pRequest.id;
    var $content=$('#'+pageType+'-content');
    var detail=null;
    var $historyList=$('.history-list');
    var curDate=new Date();
    var selectedYear=null;
    var selectedMonth=null;

    //
    $content.removeClass('cm-hidden');

    /**
     * 会展详情模块
     */
    function getShowDetail() {
        api.getShowDetail({timestamp:utils.genTimestamp(),id:id},function (data) {
            if(data.status=='success'){
                detail=data.message;
                console.log('detail:',detail);
                $content.find('.info-panel .cm-container').html('<div class="entry">' +
                    '<img src="'+detail.logopic+'">' +
                    '<div class="text-info">' +
                    '<p class="row title">'+detail.name+'</p>' +
                    '<p class="row desc">'+detail.descr+'</p>' +
                    '<ul class="row item-list"> <li>举办地点：<span class="strong">'+detail.areaname+'</span></li> <li>行业：<span class="strong">'+detail.industryLabel+'</span></li> <li>周期：'+detail.period+'</li> </ul>' +
                    '<p class="row">会展时间：'+detail.date+'</p>' +
                    '<p class="row">官网：<a href="http://'+detail.website+'">'+detail.website+'</a></p>' +
                    '</div> </div>');
                //
                $historyList.html(' <li class="cm-btn home-btn"><a href="index.html"> <i class="icon home-icon"></i> </a> </li>' +
                    '<li class="cm-btn"> <a href="search.html?pageType=show">展会 <i class="icon right-icon"></i> </a> </li>' +
                    '<li class="cm-btn"> <a href="search.html?pageType=show&industry=industry-'+detail.industry+'">'+detail.industryLabel+' <i class="icon right-icon"></i> </a> </li>' +
                    '<li  class="cm-btn active"> <a href="#">'+detail.name+' </a> </li>');
            }
        });   
    }
    function getShowTimeInfo() {
        api.getShowTimeInfo({timestamp:utils.genTimestamp(),id:id},function (data) {
            if(data.status=='success'){
                data=data.message;
                $('#time').html(data);
            }
        });
    }
    function getShowKnow() {
        api.getShowKnow({timestamp:utils.genTimestamp(),id:id},function (data) {
            if(data.status=='success'){
                data=data.message;
                $('#know').html(data);
            }
        });
    }
    function getShowManual() {
        api.getShowManual({timestamp:utils.genTimestamp(),id:id},function (data) {
            if(data.status=='success'){
                data=data.message;
              /*  $('#manual').html(data);*/
              if(data&&data.length>0){
                  var listDomStr='';
                  data.forEach(function (item,i) {
                      listDomStr+='<li> <a href="'+item.path+'" target="_blank"> <i class="icon file-icon"></i> <p>'+item.srcname+'</p> </a> </li>';
                  })
                  $('#manual .file-list').html(listDomStr);
              }
            }
        });
    }

    /**
     * 展馆详情模块
     */
    function getPavilionDetail() {
        api.getPavilionDetail({timestamp:utils.genTimestamp(),id:id},function (data) {
            if(data.status=='success'){
                detail=data.message;
                console.log('detail:',detail);
                $content.find('.info-panel .cm-container').html('<div class="entry">' +
                    '<img src="'+detail.logopic+'">' +
                    '<div class="text-info">' +
                    '<p class="row title">'+detail.pavchnname+'</p>' +
                    '<p class="row">'+detail.pavenname+'</p>' +
                    '<p class="row">官网：<a href="http://'+detail.website+'">'+detail.website+'</a></p>' +
                    '<p class="row">展馆总面积：'+detail.area+'㎡</p>' +
                    '</div> </div>');
                //
                $historyList.html(' <li class="cm-btn home-btn"><a href="index.html"> <i class="icon home-icon"></i> </a> </li>' +
                    '<li class="cm-btn"> <a href="search.html?pageType=pavilion">展馆<i class="icon right-icon"></i> </a> </li>' +
                    '<li class="cm-btn"> <a href="search.html?pageType=pavilion&country='+detail.areaid+'">'+detail.areaname+' <i class="icon right-icon"></i> </a> </li>' +
                    '<li  class="cm-btn active"> <a href="#">'+detail.pavchnname+' </a> </li>');
            }
        });
    }
    function getPavilionIntroduce() {
        api.getPavilionIntroduce({timestamp:utils.genTimestamp(),id:id},function (data) {
            if(data.status=='success'){
                data=data.message;
                $('#introduce').html(data);
            }
        });
    }
    function getPavilionShowList() {
        var params={
            timestamp:utils.genTimestamp(),
            id:id,
            month:selectedYear&&selectedMonth?selectedYear.value+'-'+selectedMonth.value:null,
        }
        api.getPavilionShowList(params,function (data) {
            if(data.status=='success'){
                var list=data.message;
                var listDomStr='';
                list.forEach(function (item,i) {
                    listDomStr+='<li><a href="detail.html?pageType=show&id='+item.id+'" target="_blank"> <i class="icon"></i> <span class="time"></span> <span class="title">'+item.name+'</span> </a> </li>';
                });
                $('#shows .entry-list').html(listDomStr);
            }
        });
    }
    function getPavilionGallery() {
        api.getPavilionGallery({timestamp:utils.genTimestamp(),id:id},function (data) {
            if(data.status=='success'){
                data=data.message;
                if(data&&data.length>0){
                    var listDomStr='';
                    data.forEach(function (item,i) {
                        listDomStr+='<li> <a href="'+item.path+'" target="_blank"> <i class="icon file-icon"></i> <p>'+item.srcname+'</p> </a> </li>';
                    })
                    $('#gallery .file-list').html(listDomStr);
                }
            }
        });
    }
    //渲染年份列表
    var yearList=[{
        id:null,
        value:null,
        label:'全部'
    }];
    var nowYear=curDate.getFullYear();
    for(var i=0;i<10;i++){
        var tem=nowYear+i;
        yearList.push({
            id:'year-'+tem,
            value:tem,
            label:tem+''
        })
    }
    var $yearList=$content.find('.select-year');
    function renderYearList(list) {
        var listDomStr='';
        list.forEach(function (item,i) {
            listDomStr+='<option value="'+item.value+'">'+item.label+'</option>';
        });
        $yearList.html(listDomStr);
    }
    renderYearList(yearList);
    //渲染月份列表
    var monthList=[];
    for(var i=0;i<12;i++){
        var tem=1+i;
        monthList.push({
            id:'month-'+tem,
            value:tem,
            label:tem+'月'
        })
    }
    var $monthList=$('.month-list');
    function renderMonthList(list) {
        if(selectedYear){
            var listDomStr='';
            list.forEach(function (item,i) {
                listDomStr+=' <li class="cm-btn" idStr="'+item.id+'"  onclick="selectMonth(\''+item.id+'\')">'+item.label+'</li>';
            });
            $monthList.html(listDomStr).css('display','block');
        }else{
            $monthList.html('').css('display','none');
        }
    }
    //选择年份
    window.selectYear=function () {
        var value=parseInt($yearList.find('option:selected').val());
        console.log('value:',value);
        selectedMonth=null;
        if(value!='null'){
            selectedYear=yearList.find(function (item,i) {
                return item.value==value
            });
        }else{
            selectedYear=null;
        }
        renderMonthList(monthList);
        getPavilionShowList();
    }
    //选择月份
    window.selectMonth=function (id) {
        if(id){
            var $item=$('[idStr='+id+']');
            if($item.hasClass('active')){
                selectedMonth=null;
                $item.removeClass('active');
            }else{
                selectedMonth=monthList.find(function (item,i) {
                    return id==item.id;
                });
                $monthList.find('li').removeClass('active');
                $item.addClass('active');
            }
        }else{
            selectedMonth=null;
        }
        if(pageType=='pavilion'){
            getPavilionShowList();
        }else if(pageType=='host'){
            getHostShowList();
        }else if(pageType=='flaunt'){
            getFlauntShowList();
        }
    }

    /**
     * 主办详情模块
     */
    function getHostDetail() {
        api.getHostDetail({timestamp:utils.genTimestamp(),id:id},function (data) {
            if(data.status=='success'){
                detail=data.message;
                console.log('detail:',detail);
                $content.find('.info-panel .cm-container').html('<div class="entry">' +
                    '<img src="'+detail.pic1+'">' +
                    '<div class="text-info">' +
                    '<p class="row title">'+detail.name+'</p>' +
                    '<p class="row">'+detail.nameen+'</p>' +
                    '<p class="row">地址：'+detail.address+'</p>' +
                    '<p class="row">官网：<a href="http://'+detail.website+'">'+detail.website+'</a></p>' +
                    '</div> </div>');
                //
                $historyList.html(' <li class="cm-btn home-btn"><a href="index.html"> <i class="icon home-icon"></i> </a> </li>' +
                    '<li class="cm-btn"> <a href="search.html?pageType=host">主办<i class="icon right-icon"></i> </a> </li>' +
                    '<li class="cm-btn"> <a href="search.html?pageType=host&country='+detail.areaid+'">'+detail.areaname+' <i class="icon right-icon"></i> </a> </li>' +
                    '<li  class="cm-btn active"> <a href="#">'+detail.name+' </a> </li>');
            }
        });
    }
    function getHostIntroduce() {
        api.getHostIntroduce({timestamp:utils.genTimestamp(),id:id},function (data) {
            if(data.status=='success'){
                data=data.message;
                console.log('234234:',data);
                $('#hostIntroduce').html(data);
            }
        });
    }
    function getHostShowList() {
        var params={
            timestamp:utils.genTimestamp(),
            id:id,
            month:selectedYear&&selectedMonth?selectedYear.value+'-'+selectedMonth.value:null,
        }
        api.getHostShowList(params,function (data) {
            if(data.status=='success'){
                var list=data.message;
                var listDomStr='';
                list.forEach(function (item,i) {
                    listDomStr+='<li><a href="detail.html?pageType=show&id='+item.id+'" target="_blank"> <i class="icon"></i> <span class="time"></span> <span class="title">'+item.name+'</span> </a> </li>';
                });
                $('#hostShows .entry-list').html(listDomStr);
            }
        });
    }

    /**
     * 招展详情模块
     */
    function getFlauntDetail() {
        api.getFlauntDetail({timestamp:utils.genTimestamp(),id:id},function (data) {
            if(data.status=='success'){
                detail=data.message;
                console.log('detail:',detail);
                $content.find('.info-panel .cm-container').html('<div class="entry">' +
                    '<img src="'+detail.pic1+'">' +
                    '<div class="text-info">' +
                    '<p class="row title">'+detail.name+'</p>' +
                    '<p class="row">'+detail.nameen+'</p>' +
                    '<p class="row">地址：'+detail.address+'</p>' +
                    '<p class="row">官网：<a href="http://'+detail.website+'">'+detail.website+'</a></p>' +
                    '</div> </div>');
                //
                $historyList.html(' <li class="cm-btn home-btn"><a href="index.html"> <i class="icon home-icon"></i> </a> </li>' +
                    '<li class="cm-btn"> <a href="search.html?pageType=flaunt">招展<i class="icon right-icon"></i> </a> </li>' +
                    '<li class="cm-btn"> <a href="search.html?pageType=flaunt&country='+detail.areaid+'">'+detail.areaname+' <i class="icon right-icon"></i> </a> </li>' +
                    '<li  class="cm-btn active"> <a href="#">'+detail.name+' </a> </li>');
            }
        });
    }
    function getFlauntIntroduce() {
        api.getFlauntIntroduce({timestamp:utils.genTimestamp(),id:id},function (data) {
            if(data.status=='success'){
                data=data.message;
                $('#flauntIntroduce').html(data);
            }
        });
    }
    function getFlauntShowList() {
        var params={
            timestamp:utils.genTimestamp(),
            id:id,
            month:selectedYear&&selectedMonth?selectedYear.value+'-'+selectedMonth.value:null,
        }
        api.getFlauntShowList(params,function (data) {
            if(data.status=='success'){
                var list=data.message;
                var listDomStr='';
                list.forEach(function (item,i) {
                    listDomStr+='<li><a href="detail.html?pageType=flaunt&id='+item.id+'" target="_blank"> <i class="icon"></i> <span class="time"></span> <span class="title">'+item.name+'</span> </a> </li>';
                });
                $('#flauntShows .entry-list').html(listDomStr);
            }
        });
    }

    /**
     * tab控制
     */
    var $tabList=$('.tab-list li');
    var $tabContentList=$('.tab-content');
    $tabList.click(function (event) {
        var $this=$(event.currentTarget);
        $tabList.removeClass('active');
        $this.addClass('active');
        $tabContentList.addClass('cm-hidden');
        $('#'+$this.attr('tab')).removeClass('cm-hidden');
    });

    /**
     *
     */
    if(pageType=='show'){
        getShowDetail();
        getShowTimeInfo();
        getShowKnow();
        getShowManual();
    }else if(pageType=='pavilion'){
        getPavilionDetail();
        getPavilionIntroduce();
        getPavilionShowList();
        getPavilionGallery();
    }else if(pageType=='host'){
        getHostDetail();
        getHostIntroduce();
        getHostShowList();
    }else if(pageType=='flaunt'){
        getFlauntDetail();
        getFlauntIntroduce();
        getFlauntShowList();
    }

})