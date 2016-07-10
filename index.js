/**
 * Created by Administrator on 2015/11/15.
 */
var Crawler = require('crawler');
var child = require('child_process');


var urlHome = "http://www.6vhao.com/";
var urlDetailPreffix = "www.6vhao.com/dy";


var callDown = function (url) {
    //js bug 无法replace掉所有的|，只能replace第一个
    //var url = (url || "").replace("
    // |", "^|");
    var url = (url || "").split("|").join("^|");
    //console.log("spawn:", child.spawn);
    var down = child.exec("xlxz " + url);
    // 捕获标准输出并将其打印到控制台
    down.stdout.on('data', function (data) {
        console.log('标准输出：\n' + data);
    });

// 捕获标准错误输出并将其打印到控制台
    down.stderr.on('data', function (data) {
        console.log('标准错误输出：\n' + data);
    });
    down.on('exit', function (code, signal) {
        console.log('调用迅雷下载，代码：' + code);
    });
}


var parseDetail = function (result, $) {
    var isDetail = (result.uri || "").indexOf(urlDetailPreffix) != -1;
    if (isDetail) {
        var $as = $("table[bgcolor='#0099cc'] a");
        //console.log("解析详情页面下载链接：", $as.length);
        $as.each(function () {
            //console.log($(this).attr("href"));
        });
        var uri = $as.eq(0).attr("href");
        if (uri) {
            console.log("down url:", uri);
            callDown(uri);
        }
    }
    return isDetail;
}

var parseHome = function (result, $) {
    var isHome = result.uri == urlHome;
    if (isHome) {
        var $as = $("#main").eq(0).find(".col1 a");
        var c = this;
        $as.each(function () {
            var url = $(this).attr("href");
            var name = $(this).text();
            if (url) {
                console.log("解析到电影：", name);
                c.queue(url);
            } else {
            }
        });
    }
    return isHome;
}

var c = new Crawler({
    maxConnections: 10,
    onDrain: function () {
        //完成
        // console.log("onDrain");
    },
    forceUTF8: true,
    callback: function (error, result, $) {
        if (parseHome.call(c, result, $)) {
            //console.log("parseHome uri:", result.uri);
        } else if (parseDetail.call(c, result, $)) {
            //console.log("parseDetail uri:", result.uri);
        } else {
            //console.log("no home or detail");
        }
    }
})

c.queue(urlHome);
