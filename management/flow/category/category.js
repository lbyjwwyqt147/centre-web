/***
 * 流程分类管理
 * @type {{init}}
 */
var SnippetMainPageFlowCategory = function() {
    var serverUrl = BaseUtils.serverAddress;
    var flowCategoryMainPageTable;
    var flowCategoryMainPageMark = 1;
    var flowCategoryMainPageModuleCode = 1050;
    var flowCategoryMainPageFormModal = $('#flow_category_mainPage_dataSubmit_form_modal');
    var flowCategoryMainPageSubmitForm = $("#flow_category_mainPage_dataSubmit_form");
    var flowCategoryMainPageSubmitFormId = "#flow_category_mainPage_dataSubmit_form";

    /**
     * 初始化 功能按钮
     */
    var flow_categoryMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(flowCategoryMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#flow_category-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#flow_category_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增流程分类">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="flow_category_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);


                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title="修改流程分类" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

            }


            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除流程分类">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="flow_category_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title=" 删除流程分类" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);

            }

            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="flow_category_mainPage_sync_btn">\n';
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
    var flow_categoryMainPageInitDataGrid = function () {
        layui.use('table', function(){
            var layuiForm = layui.form;
            flowCategoryMainPageTable =  $initEncrypDataGrid({
                elem: '#flow_category_mainPage_grid',
                url: serverUrl + 'v1/table/category/info/g',
                method:"get",
                where: {   //传递额外参数
                    categoryType: 10
                },
                headers: BaseUtils.serverHeaders(),
                title: '流程分类列表',
                initSort: {
                    field: 'createTime', //排序字段，对应 cols 设定的各字段名
                    type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'categoryName', title:'名称'},
                    {field:'sequenceNumber', title:'排序'},
                    {field:'description', title:'备注描述'},
                    {field:'categoryStatus', title:'状态', align: 'center',  unresize:true,
                        templet : function (row) {
                            var value = row.categoryStatus;
                            var spanCss = "m-badge--success";
                            if (value == 1)  {
                                spanCss = "m-badge--warning";
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + BaseUtils.statusText(value) + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#flow_category_mainPage_table_toolbar', align: 'center', width:190}
                ]],
                limit: 20,
                limits: [20,30,40,50]
            }, function(res, curr, count){
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(flowCategoryMainPageModuleCode);
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
            flowCategoryMainPageTable.on('tool(flow_category_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    flowCategoryMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    flowCategoryMainPageSubmitForm.setForm(obj.data);
                    $("#flow-category-name-history").val(obj.data.categoryName);
                    $("#flow-category-sequence").val(obj.data.sequenceNumber);
                    flowCategoryMainPageMark = 2;
                    // 显示 dialog
                    flowCategoryMainPageFormModal.modal('show');
                }
            });

            //监听锁定操作
            layuiForm.on('checkbox(lock)', function(obj){
                var statusValue = 0;
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
                flowCategoryMainPageUpdateDataStatus(obj, statusValue);
            });

            //监听行双击事件
            flowCategoryMainPageTable.on('rowDouble(flow_category_mainPage_grid)', function(obj){
                flowCategoryMainPageMark = 3;
                flowCategoryMainPageSubmitForm.setForm(obj.data);
                $("#flow-category-sequence").val(obj.data.sequenceNumber);
                BaseUtils.readonlyForm(flowCategoryMainPageSubmitFormId);
                flowCategoryMainPageFormModal.modal('show');
            });
        });
    };

    /**
     * 刷新grid
     */
    var flowCategoryMainPageRefreshGrid = function () {
        var searchSondition = $("#flow_category-page-grid-query-form").serializeJSON();
        flowCategoryMainPageTable.reload('flow_category_mainPage_grid', {
            where: searchSondition,
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    };

    /**
     * 重置查询条件
     */
    var flowCategoryMainPageRefreshGridQueryCondition = function () {
        $("#flow_category-page-grid-query-form")[0].reset();
        $("#category-status").selectpicker('refresh');
    };


    /**
     * 初始化 select 组件
     */
    var initflowCategorySelectpicker = function () {
        $('.m_selectpicker').selectpicker({
            noneSelectedText : '--请选择--'
        });
        BootstrapTouchspin.initByteTouchSpin("#flow-category-sequence");
    }

    /**
     * 初始化表单提交
     */
    var flowCategoryMainPageFormSubmitHandle = function() {
        $('#flow_category_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim(flowCategoryMainPageSubmitFormId);
            flowCategoryMainPageSubmitForm.validate({
                rules: {
                    priority: {
                        range: [0,999]
                    },
                    categoryName: {
                        required: true,
                        alnumName:true,
                        maxlength: 32,
                        remote:{
                            url: serverUrl + "v1/table/category/info/verify/name",     //后台处理程序
                            type: "get",               //数据发送方式
                            dataType: "json",           //接受数据格式
                            data: {                     //要传递的数据
                                categoryType: function() {
                                    return 10;
                                },
                                history: function() {
                                    return $("#flow-category-name-history").val();
                                }
                            }
                        }
                    },
                    description: {
                        required: false,
                        maxlength: 100
                    }
                },
                messages: { //提示
                    categoryName: {
                        remote: "名称重复,请重新输入."
                    }
                },
                errorElement: "div",                  // 验证失败时在元素后增加em标签，用来放错误提示
                errorPlacement: function (error, element) {   // 验证失败调用的函数
                    error.addClass( "form-control-feedback" );   // 提示信息增加样式
                    element.parent("div").parent("div").addClass( "has-danger" );
                    if ( element.prop( "type" ) === "checkbox" ) {
                        error.insertAfter(element.parent("label"));  // 待验证的元素如果是checkbox，错误提示放到label中
                    } else {
                        error.insertAfter(element);
                    }
                },
                highlight: function (element, errorClass, validClass) {
                    $(element).parent("div").parent("div").addClass( "has-danger" );
                    $(element).addClass("has-danger");     // 验证失败时给元素增加样式
                },
                unhighlight: function (element, errorClass, validClass) {
                    $(element).parent("div").parent("div").removeClass( "has-danger" );
                    $(element).removeClass("has-danger");  // 验证成功时去掉元素的样式

                },

                //display error alert on form submit
                invalidHandler: function(event, validator) {

                },
            });
            if (!flowCategoryMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            BaseUtils.modalBlock("#flow_category_mainPage_dataSubmit_form_modal");
            $postAjax({
                url:serverUrl + "v1/verify/category/info/s",
                data:flowCategoryMainPageSubmitForm.serializeJSON(),
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.modalUnblock("#flow_category_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    flowCategoryMainPageRefreshGrid();
                    // 关闭 dialog
                    flowCategoryMainPageFormModal.modal('hide');
                } else if (response.status == 409) {
                    flowCategoryMainPageRefreshGrid();
                }
            }, function (data) {
                BaseUtils.modalUnblock("#flow_category_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };

    /**
     * 删除
     */
    var flowCategoryMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxDelUrl = serverUrl + "v1/verify/category/info/d/b";
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
        } else {
            // 获取选中的数据对象
            var checkRows = flowCategoryMainPageTable.checkStatus('flow_category_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                });
            }
        }
        if (idsArray.length > 0) {
            //询问框
            layer.confirm('你确定要删除?', {
                shade: [0.3, 'rgb(230, 230, 230)'],
                btn: ['确定','取消'] //按钮
            }, function(index, layero){   //按钮【按钮一】的回调
                layer.close(index);
                BaseUtils.pageMsgBlock();
                $deleteAjax({
                    url:ajaxDelUrl,
                    data: {
                        ids: idsArray.join(",")
                    },
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    if (response.success) {
                        if (obj != null) {
                            obj.del();
                        } else {
                            flowCategoryMainPageRefreshGrid();
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
    var flowCategoryMainPageUpdateDataStatus = function(obj, status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/category/info/p";
        var putData = null;
        if (obj != null) {
            putData = {
                'ids' : obj.value,
                'status' : status
            }
        } else {
            var idsArray = [];
            // 获取选中的数据对象
            var checkRows = flowCategoryMainPageTable.checkStatus('flow_category_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                });
                putData = {
                    'ids': JSON.stringify(idsArray),
                    'status' : status
                }
            }
        }
        if (putData != null) {
            BaseUtils.pageMsgBlock();
            $putAjax({
                url: ajaxPutUrl,
                data: putData,
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                if (response.success) {
                    flowCategoryMainPageRefreshGrid();
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
                    flowCategoryMainPageRefreshGrid();
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
    var flowCategoryMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/category/info/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                flowCategoryMainPageRefreshGrid();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };

    var flowCategoryMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#flow_category_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            var modalDialogTitle = "新增流程分类";
            if (flowCategoryMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(flowCategoryMainPageSubmitFormId);
            }
            if (flowCategoryMainPageMark == 2) {
                modalDialogTitle = "修改流程分类";
                BaseUtils.cleanFormReadonly(flowCategoryMainPageSubmitFormId);
            }
            $(".has-danger-error").show();
            $("#flow_category_mainPage_dataSubmit_form_submit").show();
            if (flowCategoryMainPageMark == 3) {
                modalDialogTitle = "流程分类信息";
                $(".has-danger-error").hide();
                $("#flow_category_mainPage_dataSubmit_form_submit").hide();
            }
            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
            // 居中显示
            $(this).css('display', 'block');
            var modalHeight = $(window).height() / 2 - $('#flow_category_mainPage_dataSubmit_form_modal .modal-dialog').height();
            $(this).find('.modal-dialog').css({
                'margin-top': modalHeight
            });
        });

        // 当调用 hide 实例方法时触发。
        $('#flow_category_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            BaseUtils.cleanFormData(flowCategoryMainPageSubmitForm);
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#flow_category_mainPage_dataSubmit_form_modal");
        });

    };


    //== Public Functions
    return {
        // public functions
        init: function() {
            flow_categoryMainPageInitFunctionButtonGroup();
            flow_categoryMainPageInitDataGrid();
            initflowCategorySelectpicker();
            flowCategoryMainPageInitModalDialog();
            flowCategoryMainPageFormSubmitHandle();
            $('#flow_category_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                flowCategoryMainPageDeleteData(null);
                return false;
            });
            $('#flow_category_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                flowCategoryMainPageMark = 1;
                // 显示 dialog
                flowCategoryMainPageFormModal.modal('show');
                return false;
            });


            $('#flow_category-page-grid-query-btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                flowCategoryMainPageRefreshGrid();
                return false;
            });

            $('#flow_category-page-grid-query-rotate-btn').click(function(e) {
                e.preventDefault();
                flowCategoryMainPageRefreshGridQueryCondition();
                return false;
            });

            $('#flow_category_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                flowCategoryMainPageSyncData();
                return false;
            });

            window.onresize = function(){
                flowCategoryMainPageTable.resize("flow_category_mainPage_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageFlowCategory.init();
});