
//页面第一次加载的时候处理
$j(document).ready(function () {


    //    user_code=  "TGT-4033-bAnUrOwkLchPLmAbcpvubMne2iG409GbBJxbp4EmT1Gd7mnT3F-cas";
    document.onkeydown = function (event) {

        //停止时钟
        //showtime_stop();
        var code = Event(event);
        //grabEvent(code);


        //无第三方事件，同时在某个区域的时候处理事件。
        if (menu_exists() && objarea_isselect("#area_select")) {

            switch (code) {
            
                case key.Back:
                    var backurl = "index.html?1=1" + _gp.__debug;
                    var _common_return = go_task.domain("electronic_sports").pop(4);

                    var _return_url = go_task.domain("electronic_sports").hncatv_return_check();

                    if (_common_return) {

                        backurl = _common_return;
                    }
                    else if (_return_url) {
                        backurl = _return_url;
                    }

                    window.location.href = backurl;
                    return false;
                    break;
                default:

                    cm.event(code, { area_id: "#area_select", point_id: "#point" });
                    break;
            }
        }
    }
});