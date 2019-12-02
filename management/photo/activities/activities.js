/***
 * 最新活动
 * @type {{init}}
 */
var SnippetMainPageActivities = function() {
    var serverUrl = BaseUtils.serverAddress;
    var activitiesMainPageMark = 1;
    var activitiesMainPageModuleCode = '1040';
    var activitiesGridPageSize = 20;

    /**
     * 初始化 功能按钮
     */
    var activitiesMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(activitiesMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#activities-mainPage-grid-head-tools");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增图册信息">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="activities_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);
            }

            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="activities_mainPage_sync_btn">\n';
                sync_btn_html += '<i class="la la-rotate-right"></i>\n';
                sync_btn_html += '</a>\n';
                sync_btn_html += '</li>\n';
                gridHeadToolsHtml.append(sync_btn_html);
            }

        }
        // Tooltip
        $('[data-toggle="m-tooltip"]').tooltip();
    };



    /**
     *  初始化 dataGrid 组件
     */
    var activitiesMainPageInitDataGrid = function (params) {
        if (params == null) {
            params = {
                'pageSize' : activitiesGridPageSize,
                'maturity' : 0
            }
        }
        layui.use('flow', function(){
            var flow = layui.flow;
            flow.load({
                elem: '#activities_mainPage_grid', //流加载容器
                done: function(page, next){ //执行下一页的回调
                    params.pageNumber = page;
                    BaseUtils.htmPageBlock();
                    // 追加数据
                    setTimeout(function(){
                        $getAjax({
                            url:serverUrl + "v1/table/activities/g",
                            data : params,
                            headers: BaseUtils.serverHeaders()
                        }, function (response) {
                            BaseUtils.htmPageUnblock();
                            var datas =  response.data;
                            var activitiesImagesArray = [];
                            $.each(datas, function(i, v){
                                var col_div = ActivitiesView.activitiesListHtmlAppend("activities_mainPage_grid", v);
                                activitiesImagesArray.push(col_div);
                            });
                            //执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
                            //curPageNumber总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
                            var rowCount = response.total;
                            var curPageNumber = 1;
                            if (rowCount != 0 ) {
                                 curPageNumber =  (rowCount + activitiesGridPageSize - 1) / activitiesGridPageSize;
                            }
                            next(activitiesImagesArray.join(""), page < curPageNumber);
                            //绑定事件
                            initactivitiesImageEventBinding();
                        });

                    }, 500);
                }
            });
        });
    };


    /**
     * 刷新grid
     */
    var activitiesMainPageRefreshGrid = function () {
        var  params = $("#activities-page-grid-query-form").serializeJSON();
        params.pageSize = activitiesGridPageSize;
        $("#activities_mainPage_grid").html('');
        activitiesMainPageInitDataGrid(params);
    };

    /**
     * 初始化 select 组件
     */
    var activitiesMainPageInitSelectpicker = function () {
        var laydate;
        layui.use('laydate', function() {
            laydate = layui.laydate;
            //开始日期控件
            laydate.render({
                elem: '#startDateTime'
            });
            //结束日期控件
            laydate.render({
                elem: '#endDateTime'
            });
        });
        var $activityStatus = $("#activity-status-query")
        $activityStatus .selectpicker('refresh');
        var $maturityQuery = $("#maturity-query")
        $maturityQuery .selectpicker('refresh');
        // 状态选择事件绑定
        $activityStatus.on("changed.bs.select",function(e){
            // e 的话就是一个对象 然后需要什么就 “e.参数” 形式 进行获取
           // var curSelectedValue = e.target.value;
            activitiesMainPageRefreshGrid();
        });
        // 是否到期选择事件绑定
        $maturityQuery.on("changed.bs.select",function(e){
            // e 的话就是一个对象 然后需要什么就 “e.参数” 形式 进行获取
            // var curSelectedValue = e.target.value;
            activitiesMainPageRefreshGrid();
        });
    }

    /**
     * 重置查询条件
     */
    var activitiesMainPageRefreshGridQueryCondition = function () {
        $("#activities-page-grid-query-form")[0].reset();
        $("#albumClassification").selectpicker('refresh');
        $("#album-status-query").selectpicker('refresh');
        $("#image_style").val(null).trigger("change");
        $("#image_style").select2("val", "");
        $("#image_style").val("");
        $("#image_style .select2-selection__choice").remove();
    };

    /**
     * 查看图片信息
     * @param dataId
     */
    var lookPortaitImages = function (dataId) {
        $getAjax({
            url: serverUrl + 'v1/table/activities/picture',
            data:{id: dataId},
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            var datas = response.data;
            if (datas != null ) {
                var fancyboxItems = [];
                $.each(datas, function(index,item){
                   var curImageItem = {
                        src  : item.pictureLocation,
                        opts : {
                            caption : '',
                            thumb   : item.pictureLocation
                        }
                    };
                    fancyboxItems.push(curImageItem);
                });
                $.fancybox.open(fancyboxItems, {
                    loop : true,
                    thumbs : {
                        autoStart : true,    //打开时显示缩略图  值为： true    false
                        axis: 'y',          // 缩略图展示  垂直(y)或水平(x)滚动
                        width  : '230px',
                        height : '230px'
                    }
                });
            }
        });
    };

    /**
     * 删除
     */
    var activitiesMainPageDeleteData = function(dataId) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxDelUrl = serverUrl + "v1/verify/activities/d";
        var delData = {
            'id' : dataId
        };
        //询问框
        layer.confirm('你确定要删除?', {
            shade: [0.3, 'rgb(230, 230, 230)'],
            btn: ['确定','取消'] //按钮
        }, function(index, layero){   //按钮【按钮一】的回调
            layer.close(index);
            BaseUtils.pageMsgBlock();
            $deleteAjax({
                url:ajaxDelUrl,
                data: delData,
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                if (response.success) {
                    activitiesMainPageRefreshGrid();
                }
            }, function (data) {

            });
        }, function () {  //按钮【按钮二】的回调

        });

    };

    /**
     *  修改状态
     */
    var activitiesMainPageUpdateDataStatus = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        };
        var ajaxPutUrl = serverUrl + "v1/verify/activities/p";
        var curDataParam = {
            "id" : obj.id,
            "dataVersion" : obj.dataVersion,
            'status' : obj.status
        };
        BaseUtils.pageMsgBlock();
        $putAjax({
            url: ajaxPutUrl,
            data: curDataParam,
            headers: BaseUtils.serverHeaders()
        }, function (response) {
              if (response.success) {
                  activitiesMainPageRefreshGrid();
              }  else if (response.status == 202) {

              } else if (response.status == 409) {
                  activitiesMainPageRefreshGrid();
              } else if (response.status == 504) {
                  BaseUtils.LoginTimeOutHandler();
              }
        }, function (data) {

        });
    };


    /**
     *  同步数据
     */
    var activitiesMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/activities/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                activitiesMainPageRefreshGrid();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };

    /**
     * 事件绑定
     */
    var initactivitiesImageEventBinding = function () {
        // 编辑按钮
        $('.activities_mainPage_grid_edit_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var layerArea = ['100%', '100%'];
            /*if ($(window).width() > 1920 && $(window).height() > 937) {
                layerArea = ['2000px', '950px']
            }*/
            var dataId = $(this).attr("value");
            var activitiesIframContent = layer.open({
                type: 2,
                title: '最新活动',
                shadeClose: true,
                shade: false,
                maxmin: true, //开启最大化最小化按钮
                area: layerArea,
                content: '../../management/photo/activities/activities-uploading.html?dataId='+dataId+'&albumClassify=1',
                end : function () {
                    activitiesMainPageRefreshGridQueryCondition();
                    activitiesMainPageRefreshGrid();
                }
            });
            // 窗口全屏打开
            layer.full(activitiesIframContent);
            return false;
        });

        // 发布按钮
        $('.activities_mainPage_grid_star_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var params = {
                "id" : $(this).attr("value"),
                "status" : 0,
                "dataVersion" : $(this).attr("dataVersion")
            };
            activitiesMainPageUpdateDataStatus(params);
            return false;
        });

        // 下架按钮
        $('.activities_mainPage_grid_slash_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var params = {
                "id" : $(this).attr("value"),
                "status" : 2,
                "dataVersion" : $(this).attr("dataVersion")
            };
            activitiesMainPageUpdateDataStatus(params);
            return false;
        });

        // 删除按钮
        $('.activities_mainPage_grid_trash_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            activitiesMainPageDeleteData($(this).attr("value"));
            return false;
        });

        // 查看图片
        $('.activities_mainPage_grid_fancybox_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            window.open("../../exhibition/home/index.html?"+$(this).attr("value") + "&10");
            //lookPortaitImages($(this).attr("value"));
            return false;
        });

    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            activitiesMainPageInitSelectpicker();
            activitiesMainPageInitFunctionButtonGroup();
            activitiesMainPageInitDataGrid();

            $('#activities-page-grid-query-btn').click(function(e) {
                e.preventDefault();
                activitiesMainPageRefreshGrid();
                return false;
            });
            $('#activities-page-grid-query-rotate-btn').click(function(e) {
                e.preventDefault();
                activitiesMainPageRefreshGridQueryCondition();
                return false;
            });
            $('#activities_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                activitiesMainPageMark = 1;
               // console.log($(window).height());
               // console.log($(window).width());
                var layerArea = ['100%', '100%'];
                /*if ($(window).width() > 1920 && $(window).height() > 937) {
                    layerArea = ['2000px', '950px']
                }*/
                var activitiesUploadContent = layer.open({
                    type: 2,
                    title: '最新活动',
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: layerArea,
                    content: '../../management/photo/activities/activities-uploading.html?dataId=0&albumClassify=1',
                    end : function () {
                        activitiesMainPageRefreshGridQueryCondition();
                        activitiesMainPageRefreshGrid();
                    }
                });
                // 窗口全屏打开
                layer.full(activitiesUploadContent);
                return false;
            });


            $('#activities_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                activitiesMainPageSyncData();
                return false;
            });

            window.onresize = function(){

            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageActivities.init();
});