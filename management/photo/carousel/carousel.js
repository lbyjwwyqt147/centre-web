/***
 * 轮播图管理
 * @type {{init}}
 */
var SnippetMainPageCarousel = function() {
    var serverUrl = BaseUtils.serverAddress;
    var carouselMainPageTable;
    var carouselMainPageMark = 1;
    var carouselMainPageModuleCode = '1022';


    /**
     * 初始化 功能按钮
     */
    var carouselMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(carouselMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#carousel-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#carousel_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增信息">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="carousel_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);


        /*        var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title="修改信息" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);*/

            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除图片">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="carousel_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title=" 删除图片" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);

            }
            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="carousel_mainPage_sync_btn">\n';
                sync_btn_html += '<i class="la la-rotate-right"></i>\n';
                sync_btn_html += '</a>\n';
                sync_btn_html += '</li>\n';
                gridHeadToolsHtml.append(sync_btn_html);
            }

            var table_look_btn_html = '<a href="javascript:;" class="btn btn-outline-accent m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-toggle="tooltip"  title=" 预览图片" lay-event="look">\n'
            table_look_btn_html += '<i class="la la-eye"></i>\n';
            table_look_btn_html += '</a>\n';
            tableToolbarHtml.append(table_look_btn_html);
        }
        // Tooltip
        $('[data-toggle="m-tooltip"]').tooltip();
    };

    /**
     *  初始化 dataGrid 组件
     */
    var carouselMainPageInitDataGrid = function () {
        layui.use('table', function(){
            var layuiForm = layui.form;
            carouselMainPageTable =  $initEncrypDataGrid({
                elem: '#carousel_mainPage_grid',
                url: serverUrl + 'v1/table/carousel/g',
                method:"get",
                where: {   //传递额外参数

                },
                headers: BaseUtils.serverHeaders(),
                title: '图片信息列表',
                initSort: {
                    field: 'status', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'pageText', title:'所属页面'},
                    {field:'positionText', title:'页面位置'},
                    {field:'variety', title:'图片类别',
                        templet : function (row) {
                            var value = row.variety;
                            var curVarietyText = "活动图片";
                            switch (value) {
                                case "1":
                                    curVarietyText = "活动图片";
                                    break;
                                case "2":
                                    curVarietyText = "写真图片";
                                    break;
                                case "3":
                                    curVarietyText = "婚纱图片";
                                    break;
                                case "4":
                                    curVarietyText = "其他图片";
                                    break;
                                default:
                                    break;
                            }
                            return curVarietyText;
                        }
                     },
                    {field:'pictureLocation', title:'照片', unresize:true,  align: 'center', width:120,
                        templet : function (row) {
                            var value = row.pictureLocation;
                            if (value == null || value == '' ) {
                                value = "../../assets/custom/images/user/user_0.png";
                            }
                            var spanHtml = '<a href="' + value + '" data-fancybox>';
                            spanHtml += '<img style="display: inline-block; width: 100%; height: 100%;" src="' + value + '"/>';
                            spanHtml += '</a>';
                            return spanHtml;
                        }
                    },

                    {field:'status', title:'状态', align: 'center',  fixed: 'right', unresize:true,
                        templet : function (row) {
                            var value = row.status;
                            var spanCss = "m-badge--success";
                            var curStatusText = "发布";
                            switch (value) {
                                case 1:
                                    curStatusText = "禁用";
                                    spanCss = "m-badge--warning";
                                    break;
                                default:
                                    break;
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + curStatusText + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#carousel_mainPage_table_toolbar', align: 'center', width:180}
                ]],
                limit: 20,
                limits: [20,30,40,50]
            }, function(res, curr, count){
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(carouselMainPageModuleCode);
                var status_table_index = $.inArray("3", curFunctionButtonGroup);
                if (status_table_index != -1) {
                    $(".layui-unselect.layui-form-checkbox").show();
                } else {
                    $(".layui-unselect.layui-form-checkbox").hide();
                }
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                BaseUtils.checkIsLoginTimeOut(res.status);
            });

            //监听行工具事件
            carouselMainPageTable.on('tool(carousel_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    carouselMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }

                    // 显示 dialog
                } else if (obj.event === 'ejection')  {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                } else if (obj.event === 'look')  {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    lookCarouselParticulars(obj);
                }
            });

            //监听锁定操作
            layuiForm.on('checkbox(lock)', function(obj){
                var statusValue = 0;
                // 选中返回 true  没有选中返回false
                var lockChecked = $(obj.elem).attr("checked");
                if (lockChecked == undefined || lockChecked == 'undefined' || typeof (lockChecked) == undefined) {
                    statusValue = 1;
                }
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    if (statusValue == 1) {
                        obj.othis.removeClass("layui-form-checked");
                        $(obj.elem).removeAttr("checked");
                    } else {
                        obj.othis.addClass("layui-form-checked");
                    }
                    return;
                }
                carouselMainPageUpdateDataStatus(obj, statusValue);
            });

            //监听行双击事件
            carouselMainPageTable.on('rowDouble(carousel_mainPage_grid)', function(obj){
                lookCarouselParticulars(obj);

            });
        });
    };

    /**
     * 刷新grid
     */
    var carouselMainPageRefreshGrid = function () {
        var searchSondition = $("#carousel-page-grid-query-form").serializeJSON();
        carouselMainPageTable.reload('carousel_mainPage_grid', {
            where: searchSondition,
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
    };

    /**
     * 重置查询条件
     */
    var carouselMainPageRefreshGridQueryCondition = function () {
        $("#carousel-page-grid-query-form")[0].reset();
        $("#page-businessCode").selectpicker('refresh');
        $("#page-position").selectpicker('refresh');
        $("#query-carouselStatus").selectpicker('refresh');
    };


    /**
     * 初始化 select 组件
     */
    var initSelectpicker = function () {
        $('.m_selectpicker').selectpicker({
            noneSelectedText : '请选择'//默认显示内容
        });

        $("#query-carouselStatus").selectpicker('refresh');
        // 页面 select
        BaseUtils.dictDataSelect("image_page", function (data) {
            var $pageBusinessCode = $("#page-businessCode");
            $pageBusinessCode.append("<option value=''>--请选择--</option>");
            Object.keys(data).forEach(function(key){
                $pageBusinessCode.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $pageBusinessCode .selectpicker('refresh');
            $pageBusinessCode.change(function () {
                carouselMainPageRefreshGrid();
            });
        });

        // 位置 select
        BaseUtils.dictDataSelect("page_position", function (data) {
            var $pagePosition = $("#page-position");
            $pagePosition.append("<option value=''>--请选择--</option>");
            Object.keys(data).forEach(function(key){
                $pagePosition.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $pagePosition .selectpicker('refresh');
            $pagePosition.change(function () {
                carouselMainPageRefreshGrid();
            });
        });

        $("#query-carouselStatus").change(function () {
            carouselMainPageRefreshGrid();
        });

    }


    /**
     * 查看图片信息
     * @param obj
     */
    var  lookCarouselParticulars = function (obj) {
        console.log(obj);
        var objData = obj.data;
        $getAjax({
            url: serverUrl + 'v1/table/carousel/picture',
            data:{
                businessCode: objData.businessCode,
                position: objData.position
            },
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

    }



    /**
     * 删除
     */
    var carouselMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxDelUrl = serverUrl + "v1/verify/carousel/d";
        var delData = null;
        if (obj != null) {
            delData = {
                'id' : obj.data.id,
                'userId' : obj.data.userId
            }
        } else {
            var idsArray = [];
            var userIdsArray = [];
            // 获取选中的数据对象
            var checkRows = carouselMainPageTable.checkStatus('carousel_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                });
                ajaxDelUrl = serverUrl + "v1/verify/carousel/d/b";
                delData = {
                    'ids' : JSON.stringify(idsArray)
                }
            }
        }
        if (delData != null) {
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
                        if (obj != null) {
                            obj.del();
                        } else {
                            carouselMainPageRefreshGrid();
                        }
                    }
                }, function (data) {

                });
            }, function () {  //按钮【按钮二】的回调

            });
        }
    };

    /**
     *  修改状态
     */
    var carouselMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/carousel/p";
        var putData = null;
        var curId = null;
        if (obj != null) {
            curId = obj.value;
        }
        putData = {
            'id': curId,
            'status' : status
        }
        if (putData != null) {
            BaseUtils.pageMsgBlock();
            $putAjax({
                url: ajaxPutUrl,
                data: putData,
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                  if (response.success) {
                      carouselMainPageRefreshGrid();
                  }  else if (response.status == 202) {
                    if (status == 1) {
                        obj.othis.removeClass("layui-form-checked");
                    } else {
                        obj.othis.addClass("layui-form-checked");
                    }
                    layer.tips(BaseUtils.updateMsg, obj.othis,  {
                        tips: [4, '#f4516c']
                    });
                  } else if (response.status == 409) {
                      carouselMainPageRefreshGrid();
                  } else {
                     if (status == 1) {
                        obj.othis.removeClass("layui-form-checked");
                        $(obj.elem).removeAttr("checked");
                     } else {
                        obj.othis.addClass("layui-form-checked");
                     }
                     if (response.status == 504) {
                         BaseUtils.LoginTimeOutHandler();
                     } else {
                         layer.tips(response.message, obj.othis,  {
                             tips: [4, '#f4516c']
                         });
                     }

                }
            }, function (data) {

            });
        }
    };

    /**
     *  同步数据
     */
    var carouselMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/carousel/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                carouselMainPageRefreshGrid();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            carouselMainPageInitFunctionButtonGroup();
            carouselMainPageInitDataGrid();
            initSelectpicker();
            $('#carousel_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                carouselMainPageDeleteData(null);
                return false;
            });
            $('#carousel_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                carouselMainPageMark = 1;
                var layerArea = ['100%', '100%'];
                /*if ($(window).width() > 1920 && $(window).height() > 937) {
                    layerArea = ['2000px', '950px']
                }*/
                var dataId = 0;
                var photoIframContent = layer.open({
                    type: 2,
                    title: '轮播图',
                    shadeClose: true,
                    shade: false,
                    maxmin: true, //开启最大化最小化按钮
                    area: layerArea,
                    content: '../../management/photo/carousel/carousel-uploading.html?dataId='+dataId,
                    end : function () {
                        carouselMainPageRefreshGridQueryCondition();
                         carouselMainPageRefreshGrid();
                    }
                });
                // 窗口全屏打开
                layer.full(photoIframContent);
                return false;
            });

            $('#carousel_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                carouselMainPageSyncData();
                return false;
            });

            $('#carousel-page-grid-query-btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                carouselMainPageRefreshGrid();
                return false;
            });

            $('#carousel-page-grid-query-rotate-btn').click(function(e) {
                e.preventDefault();
                carouselMainPageRefreshGridQueryCondition();
                return false;
            });

            window.onresize = function(){
                carouselMainPageTable.resize("carousel_mainPage_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageCarousel.init();
});