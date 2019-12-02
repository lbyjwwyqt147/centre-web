/***
 * 写真集图册
 * @type {{init}}
 */
var SnippetMainPageHumanPortrait = function() {
    var serverUrl = BaseUtils.serverAddress;
    var humanPortraitMainPageMark = 1;
    var humanPortraitMainPageModuleCode = '1020';
    var humanGridPageSize = 20;

    /**
     * 初始化 功能按钮
     */
    var humanPortraitMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(humanPortraitMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#human-portrait-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#human_portrait_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增图册信息">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="human_portrait_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);
            }

            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="human_portrait_mainPage_sync_btn">\n';
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
    var humanPortraitMainPageInitDataGrid = function (params) {
        if (params == null) {
            params = {
                'pageSize' : humanGridPageSize
            }
        }
        layui.use('flow', function(){
            var flow = layui.flow;
            flow.load({
                elem: '#human_portrait_mainPage_grid', //流加载容器
                done: function(page, next){ //执行下一页的回调
                    params.pageNumber = page;
                    BaseUtils.htmPageBlock();
                    // 追加数据
                    setTimeout(function(){
                        $getAjax({
                            url:serverUrl + "v1/table/album/g",
                            data : params,
                            headers: BaseUtils.serverHeaders()
                        }, function (response) {
                            BaseUtils.htmPageUnblock();
                            var datas =  response.data;
                            var humanImagesArray = [];
                            $.each(datas, function(i, v){
                                var col_div = ImagesView.imagesListHtmlAppend("human_portrait_mainPage_grid", v);
                                humanImagesArray.push(col_div);
                            });
                            //执行下一页渲染，第二参数为：满足“加载更多”的条件，即后面仍有分页
                            //curPageNumber总页数，只有当前页小于总页数的情况下，才会继续出现加载更多
                            var rowCount = response.total;
                            var curPageNumber = 1;
                            if (rowCount != 0 ) {
                                 curPageNumber =  (rowCount + humanGridPageSize - 1) / humanGridPageSize;
                            }
                            next(humanImagesArray.join(""), page < curPageNumber);
                            //绑定事件
                            initHumanPortraitImageEventBinding();
                        });

                    }, 500);
                }
            });
        });
    };


    /**
     * 刷新grid
     */
    var humanPortraitMainPageRefreshGrid = function () {
        var queryAlbumStyperOptions = $("#album-style").select2("val");
        $("#album-style-query").val(queryAlbumStyperOptions.join(','));
        var  params = $("#human-portrait-page-grid-query-form").serializeJSON();
        params.pageSize = humanGridPageSize;
        $("#human_portrait_mainPage_grid").html('');
        humanPortraitMainPageInitDataGrid(params);
    };

    /**
     * 初始化 select 组件
     */
    var humanPortraitMainPageInitSelectpicker = function () {
        var $albumClassification = $("#albumClassification");
        $albumClassification.selectpicker('refresh');
        var $albumStatusQuery = $("#album-status-query");
        $albumStatusQuery.selectpicker('refresh');
        var $albumDisplayQuery = $("#album-display-query");
        $albumDisplayQuery.selectpicker('refresh');
        var $albumStyle = $("#album-style");
        $albumStyle.select2({
            placeholder: "风格",
            allowClear: true
        });
        // 风格 multi select
        BaseUtils.dictDataSelect("image_style", function (data) {
            Object.keys(data).forEach(function(key){
                $albumStyle.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
        });
        // 类型选择事件绑定
        $albumClassification.on("changed.bs.select",function(e){
            // e 的话就是一个对象 然后需要什么就 “e.参数” 形式 进行获取
            // var curSelectedValue = e.target.value;
            humanPortraitMainPageRefreshGrid();
        });
        // 状态选择事件绑定
        $albumStatusQuery.on("changed.bs.select",function(e){
            // e 的话就是一个对象 然后需要什么就 “e.参数” 形式 进行获取
            // var curSelectedValue = e.target.value;
            humanPortraitMainPageRefreshGrid();
        });
        // 显示在首页选择事件绑定
        $albumDisplayQuery.on("changed.bs.select",function(e){
            // e 的话就是一个对象 然后需要什么就 “e.参数” 形式 进行获取
            // var curSelectedValue = e.target.value;
            humanPortraitMainPageRefreshGrid();
        });
    }

    /**
     * 重置查询条件
     */
    var humanPortraitMainPageRefreshGridQueryCondition = function () {
        $("#human-portrait-page-grid-query-form")[0].reset();
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
            url: serverUrl + 'v1/table/album/picture',
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
    var humanPortraitMainPageDeleteData = function(dataId) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxDelUrl = serverUrl + "v1/verify/album/d";
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
                    humanPortraitMainPageRefreshGrid();
                }
            }, function (data) {

            });
        }, function () {  //按钮【按钮二】的回调

        });

    };

    /**
     *  修改状态
     */
    var humanPortraitMainPageUpdateDataStatus = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        };
        var ajaxPutUrl = serverUrl + "v1/verify/album/p";
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
                  humanPortraitMainPageRefreshGrid();
              }  else if (response.status == 202) {

              } else if (response.status == 409) {
                  humanPortraitMainPageRefreshGrid();
              } else if (response.status == 504) {
                  BaseUtils.LoginTimeOutHandler();
              }
        }, function (data) {

        });
    };


    /**
     *  修改首页展示图片状态
     */
    var humanPortraitMainPageUpdateShowStatus = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        };
        var ajaxPutUrl = serverUrl + "v1/verify/album/p/show";
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
                humanPortraitMainPageRefreshGrid();
            }  else if (response.status == 202) {

            } else if (response.status == 409) {
                humanPortraitMainPageRefreshGrid();
            } else if (response.status == 504) {
                BaseUtils.LoginTimeOutHandler();
            }
        }, function (data) {

        });
    };

    /**
     *  同步数据
     */
    var humanPortraitMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/album/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                humanPortraitMainPageRefreshGrid();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };

    /**
     * 事件绑定
     */
    var initHumanPortraitImageEventBinding = function () {
        // 编辑按钮
        $('.human_portrait_mainPage_grid_edit_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var layerArea = ['100%', '100%'];
            /*if ($(window).width() > 1920 && $(window).height() > 937) {
                layerArea = ['2000px', '950px']
            }*/
            var dataId = $(this).attr("value");
            var photoIframContent = layer.open({
                type: 2,
                title: '写真图册',
                shadeClose: true,
                shade: false,
                maxmin: true, //开启最大化最小化按钮
                area: layerArea,
                content: '../../management/photo/album/photo-uploading.html?dataId='+dataId+'&albumClassify=1',
                end : function () {
                    humanPortraitMainPageRefreshGridQueryCondition();
                    humanPortraitMainPageRefreshGrid();
                }
            });
            // 窗口全屏打开
            layer.full(photoIframContent);
            return false;
        });

        // 发布按钮
        $('.human_portrait_mainPage_grid_publish_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var params = {
                "id" : $(this).attr("value"),
                "status" : 0,
                "dataVersion" : $(this).attr("dataVersion")
            };
            humanPortraitMainPageUpdateDataStatus(params);
            return false;
        });

        // 隐藏按钮
        $('.human_portrait_mainPage_grid_hide_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var params = {
                "id" : $(this).attr("value"),
                "status" : 1,
                "dataVersion" : $(this).attr("dataVersion")
            };
            humanPortraitMainPageUpdateDataStatus(params);
            return false;
        });

        // 删除按钮
        $('.human_portrait_mainPage_grid_del_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            humanPortraitMainPageDeleteData($(this).attr("value"));
            return false;
        });

        // 图片展示在官网按钮
        $('.human_portrait_mainPage_grid_show_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var params = {
                "id" : $(this).attr("value"),
                "status" : 0,
                "dataVersion" : $(this).attr("dataVersion")
            };
            humanPortraitMainPageUpdateShowStatus(params);
            return false;
        });


        // 取消在官网展示按钮
        $('.human_portrait_mainPage_grid_hiden_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var params = {
                "id" : $(this).attr("value"),
                "status" : 1,
                "dataVersion" : $(this).attr("dataVersion")
            };
            humanPortraitMainPageUpdateShowStatus(params);
            return false;
        });

        // 查看图片
        $('.human_portrait_mainPage_grid_fancybox_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            lookPortaitImages($(this).attr("value"));
            return false;
        });

        // 查看按钮
        $('.human_portrait_mainPage_grid_look_btn').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var layerArea = ['100%', '100%'];
            /*if ($(window).width() > 1920 && $(window).height() > 937) {
                layerArea = ['2000px', '950px']
            }*/
            var dataId = $(this).attr("value");
            var lookPhotoIframContent = layer.open({
                type: 2,
                title: '写真图册',
                shadeClose: true,
                shade: false,
                maxmin: true, //开启最大化最小化按钮
                area: layerArea,
                content: '../../management/photo/album/photo-uploading-look.html?dataId='+dataId+'&albumClassify=1',
                end : function () {

                }
            });
            // 窗口全屏打开
            layer.full(lookPhotoIframContent);
            return false;
        });


    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            humanPortraitMainPageInitSelectpicker();
            humanPortraitMainPageInitFunctionButtonGroup();
            humanPortraitMainPageInitDataGrid();

            $('#human-portrait-page-grid-query-btn').click(function(e) {
                e.preventDefault();
                humanPortraitMainPageRefreshGrid();
                return false;
            });
            $('#human-portrait-page-grid-query-rotate-btn').click(function(e) {
                e.preventDefault();
                humanPortraitMainPageRefreshGridQueryCondition();
                return false;
            });
            $('#human_portrait_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                humanPortraitMainPageMark = 1;
               // console.log($(window).height());
               // console.log($(window).width());
                var layerArea = ['100%', '100%'];
                /*if ($(window).width() > 1920 && $(window).height() > 937) {
                    layerArea = ['2000px', '950px']
                }*/
                var photoUploadContent = layer.open({
                    type: 2,
                    title: '写真图册',
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: layerArea,
                    content: '../../management/photo/album/photo-uploading.html?dataId=0&albumClassify=1',
                    end : function () {
                        humanPortraitMainPageRefreshGridQueryCondition();
                        humanPortraitMainPageRefreshGrid();
                    }
                });
                // 窗口全屏打开
                layer.full(photoUploadContent);
                return false;
            });


            $('#human_portrait_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                humanPortraitMainPageSyncData();
                return false;
            });

            window.onresize = function(){
               // humanPortraitMainPageTable.resize("human_portrait_mainPage_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageHumanPortrait.init();
});