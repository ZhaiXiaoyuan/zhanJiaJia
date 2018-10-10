/**
 * Created by Administrator on 2018/2/4 0004.
 */
$(function () {
    window.search=function () {
        var keyword=$('#keyword').val();
        console.log('test:',keyword);
        window.location.href='search.html?keyword='+(keyword?keyword:'');
    }
})