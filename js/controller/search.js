/**
 * Created by Administrator on 2018/2/4 0004.
 */
$(function () {
    var curDate=new Date();
    var pageType=null;
    var pageName=null;
    var selectedIndustry=null;
    var selectedCountry=null;
    var selectedYear=null;
    var selectedMonth=null;
    var $industryRow=$('#industry-row');
    var $countryRow=$('#country-row');
    var $yearRow=$('#year-row');
    var pRequest=utils.getRequest();
    var initPage=false;
    var keyword=null;

    /**
     *
     */
    if(pRequest.keyword){
        keyword=pRequest.keyword;
        $('#keyword').val(keyword);
    }

    /**
     * 切换页面类型,show:会展,pavilion:展馆,host:主办,flaunt:招展
     */
    window.setPageType=function (value) {
        pageType=value;
        $('.tab-list li').removeClass('active');
        $('[tab='+value+']').addClass('active');
        if(pageType=='show'){
            pageName='会展';
            $industryRow.removeClass('cm-hidden');
            $yearRow.removeClass('cm-hidden')
        }else{
            $industryRow.addClass('cm-hidden');
            $yearRow.addClass('cm-hidden')
            if(pageType=='pavilion'){
                pageName='展馆';
            }else if(pageType=='host'){
                pageName='主办';
            }
        }
        $('.page-name').html(pageName);
        //
        if(initPage){
            keyword=null;
            selectedIndustry=null;
            selectedCountry=null;
            selectedYear=null;
            selectedMonth=null;
        }
        renderFilterList();
        initPage=true;
    }

    /**
     * 获取基础数据配置
     */
    var industryList=[];
    var countryList=[];
    var curCountryList=[];
    api.getBasicData({timestamp:utils.genTimestamp(),types:'CommonIndustry,AreaCountry,CommonServePhone,CommonServeTime'},function (data) {
        console.log('data:',data);
        if(data.status=='success'){
            data=data.message;
            if(data.CommonIndustry){
                data.CommonIndustry.forEach(function (item,i) {
                     var tem={
                         id:'industry-'+item.value,
                         type:'industry',
                         label:item.label,
                         value:item.value,
                     }
                    if(pRequest.industry&&pRequest.industry==tem.id){
                        selectedIndustry=tem;
                    }
                    industryList.push(tem);
                });
                renderIndustryList(industryList);
            }
            if(data.AreaCountry){
                data.AreaCountry.forEach(function (item,i) {
                    countryList.push({
                        id:item.id,
                        type:'country',
                        label:item.name,
                        value:item.id,
                        letter:pinyinUtil.getFirstLetter(item.name.substring(0,1))
                    })
                });
                curCountryList=countryList;
                renderRegionList(curCountryList);
            }
            //
            var tel=data.CommonServePhone[0];
            var workTime=data.CommonServeTime[0];
            $('#tel').html(tel.value);
            $('#work-time').html(workTime.value);

            //
            setPageType(pRequest.pageType?pRequest.pageType:'show');
        }
    })

    /**
     * 渲染行业列表
     */
    var $industryList=$('#industry-list');
    function renderIndustryList(list) {
        var listDomStr='';
        list.forEach(function (item,i) {
            listDomStr+=' <li class="cm-btn" id="'+item.id+'" onclick="selectIndustry(\''+item.id+'\')">'+item.label+'</li>';
        });
        $industryList.html(listDomStr);
    }

    /**
     * 渲染字母列表
     */
    var letterList='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var $countryFiler=$('#country-filer');
    function renderLetterList(list) {
        var listDomStr='';
        list.forEach(function (item,i) {
            listDomStr+=' <li class="cm-btn"  onclick="selectLetter(\''+item+'\')">'+item+'</li>';
        });
        $countryFiler.append(listDomStr);
    }
    renderLetterList(letterList);

    /**
     * 渲染国家地区列表
     */
    var $countryList=$('#country-list');
    function renderRegionList(list) {
        var listDomStr='';
        list.forEach(function (item,i) {
            listDomStr+=' <li class="cm-btn" id="'+item.id+'"  onclick="selectCountry(\''+item.id+'\')">'+item.label+'</li>';
        });
        $countryList.html(listDomStr);
    }

    /**
     * 渲染年份列表
     */
    var yearList=[];
    var nowYear=curDate.getFullYear();
    for(var i=0;i<10;i++){
        var tem=nowYear+i;
        yearList.push({
            id:'year-'+tem,
            value:tem,
            label:tem+''
        })
    }
    var $yearList=$('#year-list');
    function renderYearList(list) {
        var listDomStr='';
        list.forEach(function (item,i) {
            listDomStr+=' <li class="cm-btn" id="'+item.id+'"  onclick="selectYear(\''+item.id+'\')">'+item.label+'</li>';
        });
        $yearList.append(listDomStr);
    }
    renderYearList(yearList);

    /**
     * 渲染月份列表
     */
    var monthList=[];
    for(var i=0;i<12;i++){
        var tem=1+i;
        monthList.push({
            id:'month-'+tem,
            value:tem,
            label:tem+'月'
        })
    }
    var $monthList=$('#month-list');
    function renderMonthList(list) {
        if(selectedYear){
            var listDomStr='';
            list.forEach(function (item,i) {
                listDomStr+=' <li class="cm-btn" id="'+item.id+'"  onclick="selectMonth(\''+item.id+'\')">'+item.label+'</li>';
            });
            $monthList.html(listDomStr).css('display','block');
        }else{
            $monthList.html('').css('display','none');;
        }
    }
    renderMonthList(monthList);

    /**
     * 渲染过滤条件
     */
    var $filterList=$('#filter-list');
    function renderFilterList() {
        console.log('2342:',selectedCountry);
        var listDomStr='';
        if(keyword){
            listDomStr+=' <li class="cm-btn" id="selected-'+keyword+'" onclick="handleFilter(\''+keyword+'\',\'keyword\')">'+keyword+'<i class="cm-btn icon del-icon"></i></li>';
        }else{
            $('#keyword').val('');
        }
        if(selectedIndustry){
            listDomStr+=' <li class="cm-btn" id="selected-'+selectedIndustry.id+'" onclick="handleFilter(\''+selectedIndustry.id+'\',\'industry\')">'+selectedIndustry.label+'<i class="cm-btn icon del-icon"></i></li>';
        }
        if(selectedCountry){
            listDomStr+=' <li class="cm-btn" id="selected-'+selectedCountry.id+'" onclick="handleFilter(\''+selectedCountry.id+'\',\'country\')">'+selectedCountry.label+'<i class="cm-btn icon del-icon"></i></li>';
        }
        if(selectedYear&&selectedMonth){
            listDomStr+=' <li class="cm-btn" id="selected-'+selectedMonth.id+'" onclick="handleFilter(\''+selectedMonth.id+'\',\'year\')">'+selectedYear.value+'年'+selectedMonth.label+'<i class="cm-btn icon del-icon"></i></li>';
        }
        $filterList.html(listDomStr);
        getList();
    }

    /**
     * 增加、删减过滤条件
     */
    window.handleFilter=function (id,type) {
       $('#selected-'+id).remove();
        if(type=='keyword'){
            $('#keyword').val('');
        }else if(type=='industry'){
            selectIndustry('');
        }else if(type=='country'){
            selectCountry('');
        }else if(type=='year'){
            selectYear('');
        }
    }


    /**
     * 选择行业
     */
    window.selectIndustry=function (id) {
        if(id){
            var $item=$('#'+id);
            if($item.hasClass('active')){
                selectedIndustry=null;
                $item.removeClass('active');
            }else{
                selectedIndustry=industryList.find(function (item,i) {
                    return id==item.id;
                });
                $industryList.find('li').removeClass('active');
                $item.addClass('active');
            }
        }else{
            $industryList.find('li').removeClass('active');
            selectedIndustry=null;
        }
        console.log('selectedIndustry:',selectedIndustry);
        renderFilterList();
    }

    /**
     * 选择地区过滤字母
     */
    window.selectLetter=function (letter) {
        curCountryList=[];
        if(letter){
            countryList.forEach(function (item,i) {
                if(item.letter==letter){
                    curCountryList.push(item);
                }
            });
        }else{
            curCountryList=countryList
        }
        renderRegionList(curCountryList);
    }

    /**
     * 选择地区
     */
    window.selectCountry=function (id) {
        if(id){
            var $item=$('#'+id);
            if($item.hasClass('active')){
                selectedCountry=null;
                $item.removeClass('active');
            }else{
                selectedCountry=curCountryList.find(function (item,i) {
                    return id==item.id;
                });
                $countryList.find('li').removeClass('active');
                $item.addClass('active');
            }
        }else{
            selectLetter('');
            selectedCountry=null;
        }
        renderFilterList();
    }

    /**
     * 选择年份
     */
    window.selectYear=function (id) {
        selectedMonth=null;
        if(id){
            var $item=$('#'+id);
            if($item.hasClass('active')){
                $item.removeClass('active');
            }else{
                $yearList.find('li').removeClass('active');
                $item.addClass('active');
            }
            selectedYear=yearList.find(function (item,i) {
                return item.id==id;
            });
        }else{
            $yearList.find('li').removeClass('active');
            selectedYear=null;
        }
        renderMonthList(monthList);
        renderFilterList();
    }


    /**
     * 选择月份
     */
    window.selectMonth=function (id) {
        if(id){
            var $item=$('#'+id);
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
        renderFilterList();
    }


    /**
     * 渲染总数量
     */
    function renderTotal() {
        $('#total').html(pager.totalRecordCount);
    }

    /**
     * 
     */
    function initPaper() {
        renderTotal();
        //渲染化页面切换
        renderPageSwitch();
        if(pager){
            //初始化分页
            $('#pager').jqPaginator({
                totalPages: pager.totalPageCount?pager.totalPageCount:1,
                visiblePages: 5,
                currentPage: pager.pageNumber,
                onPageChange: function (num, type) {
                    console.log('type:',type);
                    if(type=='change'){
                        pager.pageNumber=num;
                        getList();
                    }
                }
            });
        }
    }

    /**
     * 请求列表
     */
    var params={

    }
    var $entryList=$('.entry-list');
    var entryList=[];
    var pager={
        pageSize:10,
        pageNumber:1
    };
    var $loadingTips=$('.loading-tips');
    window.getList=function (isInit) {
        if(isInit){
            pager={
                pageSize:10,
                pageNumber:1,
            };
            entryList=[];
            $entryList.html('');
        }
        if(pageType=='show'){
            params={
                timestamp:utils.genTimestamp(),
                industry:selectedIndustry?selectedIndustry.value:null,
                areaid:selectedCountry?selectedCountry.value:null,
                month:selectedYear&&selectedMonth?selectedYear.value+'-'+selectedMonth.value:null,
                keyword:keyword,
                'pager.pageSize':pager.pageSize,
                'pager.pageNumber':pager.pageNumber
            }
            api.getShowList(params,function (data) {
                if(data.status=='success'){
                    data=data.message;
                    entryList=data.result;
                    var listDomStr='';
                    entryList.forEach(function (item,i) {
                        listDomStr+=' <li><a href="detail.html?pageType=show&id='+item.id+'">' +
                            '<img src="'+item.logopic+'">' +
                            '<div class="text-info">' +
                            '<p class="row title">'+item.name+'</p>' +
                            '<p class="row desc strong">'+item.descr+'</p>' +
                            '<ul class="row item-list"> <li>举办地点：<span class="strong">'+item.areaname+'</span></li> <li>行业：<span class="strong">'+item.industryLabel+'</span></li> <li>周期：'+item.period+'</li> </ul>' +
                            '<p class="row">会展时间：'+item.date+'</p>' +
                            '</div>' +
                            '</a> </li>';
                    });
                    $entryList.html(listDomStr);
                    //
                    if(entryList.length>0){
                        $loadingTips.addClass('cm-hidden');
                    }else{
                        $loadingTips.removeClass('cm-hidden');
                    }
                    //
                    pager=data.pager;
                    initPaper();
                }
                console.log('list:',data);
            });
        }else if(pageType=='pavilion'){
            params={
                timestamp:utils.genTimestamp(),
                areaid:selectedCountry?selectedCountry.value:null,
                keyword:keyword,
                'pager.pageSize':pager.pageSize,
                'pager.pageNumber':pager.pageNumber
            }
            api.getPavilionList(params,function (data) {
                if(data.status=='success'){
                    data=data.message;
                    entryList=data.result;
                    var listDomStr='';
                    entryList.forEach(function (item,i) {
                        listDomStr+=' <li><a href="detail.html?pageType=pavilion&id='+item.id+'">' +
                            '<img src="'+item.logopic+'">' +
                            '<div class="text-info">' +
                            '<p class="row title">'+item.pavchnname+'</p>' +
                            '<p class="row desc">'+item.pavenname+'</p>' +
                            '<p class="row">'+item.content+'</p>' +
                            '</div>' +
                            '</a> </li>';
                    });
                    $entryList.html(listDomStr);
                    //
                    if(entryList.length>0){
                        $loadingTips.addClass('cm-hidden');
                    }else{
                        $loadingTips.removeClass('cm-hidden');
                    }
                    //
                    pager=data.pager;
                    initPaper();
                }
                console.log('list:',data);
            });
        }else if(pageType=='host'){
            params={
                timestamp:utils.genTimestamp(),
                areaid:selectedCountry?selectedCountry.value:null,
                keyword:keyword,
                'pager.pageSize':pager.pageSize,
                'pager.pageNumber':pager.pageNumber
            }
            api.getHostList(params,function (data) {
                if(data.status=='success'){
                    data=data.message;
                    entryList=data.result;
                    var listDomStr='';
                    entryList.forEach(function (item,i) {
                        listDomStr+=' <li><a href="detail.html?pageType=host&id='+item.id+'">' +
                            '<img src="'+item.pic1+'">' +
                            '<div class="text-info">' +
                            '<p class="row title">'+item.name+'</p>' +
                            '<p class="row desc">'+item.nameen+'</p>' +
                            '<p class="row">'+item.remark+'</p>' +
                            '</div>' +
                            '</a> </li>';
                    });
                    $entryList.html(listDomStr);
                    //
                    if(entryList.length>0){
                        $loadingTips.addClass('cm-hidden');
                    }else{
                        $loadingTips.removeClass('cm-hidden');
                    }
                    //
                    pager=data.pager;
                    initPaper();
                }
                console.log('list:',data);
            });
        }
    }

    /**
     * 渲染页面切换
     */
    window.renderPageSwitch=function () {
        $('.page-info .cur-page').html(pager.pageNumber);
        $('.page-info .total-page').html(pager.totalPageCount);
    }
    /**
     * 页面切换
     */
    window.pageSwitch=function (type) {
        if(type=='add'&&pager.pageNumber+1<=pager.totalPageCount){
            pager.pageNumber++;
        }else if(pager.pageNumber-1>=1){
            pager.pageNumber--;
        }
        getList(true);
    }

    /**
     * 关键字搜索
     */
    window.search=function () {
        keyword=$('#keyword').val();
        renderFilterList();
    }

    /**
     *展开隐藏的条件
     */
    window.toggleRow=function (id) {
        var $target=$('#'+id);
        if($target.hasClass('active')){
            $target.removeClass('active')
        }else{
            $target.addClass('active')
        }
    }

    /**
     * 右侧菜单控制
     */
    window.showRightMenu=function (type,event) {
        event.stopPropagation();
        var $detailBlock=$('.detail-block');
        if(type){
            if(type!=$detailBlock.attr('cur-type')){
                $detailBlock.attr('cur-type',type);
                $detailBlock.addClass('active');
            }else{
                $detailBlock.attr('cur-type','');
                $detailBlock.removeClass('active');
            }
            $detailBlock.find('>div').addClass('cm-hidden');
            $detailBlock.find(type).removeClass('cm-hidden');
        }else{
            $detailBlock.removeClass('active');
        }
    }

})