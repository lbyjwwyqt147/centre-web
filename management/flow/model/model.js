/***
 * 流程模型设计管理
 * @type {{init}}
 */
var SnippetMainPageFlowModel = function() {
    var serverUrl = BaseUtils.serverAddress;
    var flowModelMainPageTable;
    var flowModelMainPageMark = 1;
    var flowModelMainPageModuleCode = 1050;
    var flowModelMainPageFormModal = $('#flowModel_mainPage_dataSubmit_form_modal');
    var flowModelMainPageSubmitForm = $("#flowModel_mainPage_dataSubmit_form");
    var flowModelMainPageSubmitFormId = "#flowModel_mainPage_dataSubmit_form";
    
    /**
     * 初始化 功能按钮
     */
    var flowModelMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(flowModelMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#flowModel-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#flowModel_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新建流程模型">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="flowModel_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);


                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title="修改流程模型" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

                var deploy_btn_html = '<a href="javascript:;" class="btn btn-outline-success m-btn m-btn--icon m-btn--icon-only" data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title="部署发布流程模型" lay-event="deploy">\n'
                deploy_btn_html += '<i class="la la-hand-o-right"></i>\n';
                deploy_btn_html += '</a>\n';
                tableToolbarHtml.append(deploy_btn_html);
            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除流程模型">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="flowModel_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title=" 删除流程模型" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);

            }

            var table_look_btn_html = '<a href="javascript:;" class="btn btn-outline-accent m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title="查看流程图" lay-event="look">\n'
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
    var flowModelMainPageInitDataGrid = function () {
        layui.use('table', function(){
            var layuiForm = layui.form;
            flowModelMainPageTable =  $initEncrypDataGrid({
                elem: '#flowModel_mainPage_grid',
                url: serverUrl + 'v1/table/flow/model/g',
                method:"get",
                where: {   //传递额外参数

                },
                headers: BaseUtils.serverHeaders(),
                title: '流程模型列表',
                initSort: {
                    field: 'createTime', //排序字段，对应 cols 设定的各字段名
                    type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'name', title:'模型名称'},
                    {field:'key', title:'标识Key'},
                    {field:'categoryName', title:'类型'},
                    {field:'description', title:'备注描述'},
                    {field:'version', title:'版本', width:60},
                    {field:'status', title:'状态', align: 'center',  unresize:true,
                        templet : function (row) {
                            var value = row.status;
                            var curText = "已部署";
                            var spanCss = "m-badge--success";
                            if (value == 1)  {
                                spanCss = "m-badge--warning";
                                curText = "未部署";
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + curText + '</span>';
                            return spanHtml;
                        }
                    },
                    {field:'deploymentId', title:'部署ID'},
                    {field:'createTime', title:'创建时间', sort:true, width:160},
                    {field:'lastUpdateTime', title:'更新时间', sort:true, width:160},
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#flowModel_mainPage_table_toolbar', align: 'center', width:150}
                ]],
                limit: 20,
                limits: [20,30,40,50]
            }, function(res, curr, count){
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                BaseUtils.checkIsLoginTimeOut(res.status);
            });

            //监听行工具事件
            flowModelMainPageTable.on('tool(flowModel_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    flowModelMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    flowModelMainPageSubmitForm.setForm(obj.data);
                    $("#flow-model-id").val(obj.data.id);
                    $("#flow-model-name").val(obj.data.name);
                    $("#flow-model-key").val(obj.data.key);
                    $("#flow-model-key-history").val(obj.data.key);
                    flowModelMainPageMark = 2;
                    // 显示 dialog
                   // flowModelMainPageFormModal.modal('show');
                    var curFormJson = flowModelMainPageSubmitForm.serializeJSON();
                    var windowParams = BaseUtils.jsonConvertUrlParams(curFormJson);
                    openDiagramWindow(windowParams);
                } else if (obj.event === 'deploy')  {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    flowModelMainPageDeploy(obj)
                } else if (obj.event === 'look')  {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    lookflowModelParticulars(obj);
                }
            });

            //监听行双击事件
            flowModelMainPageTable.on('rowDouble(flowModel_mainPage_grid)', function(obj){
                flowModelMainPageMark = 3;
                lookflowModelParticulars(obj);
            });
        });
    };

    /**
     * 刷新grid
     */
    var flowModelMainPageRefreshGrid = function () {
        var searchSondition = $("#flowModel-page-grid-query-form").serializeJSON();
        flowModelMainPageTable.reload('flowModel_mainPage_grid', {
            where: searchSondition,
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
    };

    /**
     * 重置查询条件
     */
    var flowModelMainPageRefreshGridQueryCondition = function () {
        $("#flowModel-page-grid-query-form")[0].reset();
    };


    /**
     * 初始化 select 组件
     */
    var initFlowModelSelectpicker = function () {
        var selectUrl = serverUrl + "v1/table/category/info/select";
        var selectParams = {
            categoryType : 10,
            categoryStatus : 0
        }
        BaseUtils.dropDownDataSelect(selectUrl, selectParams, BaseUtils.serverHeaders, function (data) {
            var $flowModelCategory = $("#flow-model-category");
            Object.keys(data).forEach(function(key){
                $flowModelCategory.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            $flowModelCategory .selectpicker('refresh');
        });
    }

    /**
     * 初始化表单提交
     */
    var flowModelMainPageFormSubmitHandle = function() {
        $('#flowModel_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            BaseUtils.formInputTrim(flowModelMainPageSubmitFormId);
            flowModelMainPageSubmitForm.validate({
                rules: {
                    flowModelName: {
                        required: true,
                        chcharacterNum:true,
                        maxlength: 255
                    },
                    flowModelKey: {
                        required: true,
                        alnumCode:true,
                        maxlength: 255,
                        remote:{
                            url: serverUrl + "v1/table/flow/model/verify/key",     //后台处理程序
                            type: "get",               //数据发送方式
                            dataType: "json",           //接受数据格式
                            data: {                     //要传递的数据
                                history: function() {
                                    return $("#flow-model-key-history").val();
                                }
                            }
                        }
                    },
                    flowModelCategory: {
                        required: true,
                        maxlength: 255
                    },
                    description: {
                        required: false,
                        maxlength: 255
                    }
                },
                messages: { //提示
                    flowModelKey: {
                        remote: "标识key重复,请重新输入."
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
            if (!flowModelMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var curFormJson = flowModelMainPageSubmitForm.serializeJSON();
            var windowParams = BaseUtils.jsonConvertUrlParams(curFormJson);
            openDiagramWindow(windowParams);
            return false;
        });
    };


    /**
     * 查看流程模型
     * @param obj
     */
    var  lookflowModelParticulars = function (obj) {
        BaseUtils.pageMsgBlock("数据加载中.....");
        $getAjax({
            url: serverUrl + "v1/table/flow/model/image",
            data: {
                deploymentId : obj.data.id,
                type : 'model'
            },
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                $("#flow-model-image-el").attr("src", response.data);
                layer.open({
                    type: 1,
                    title: "流程图",
                    closeBtn: 0,
                    area: ['auto'],
                    skin: 'layui-layer-nobg', //没有背景色
                    shadeClose: true,
                    content: $('#flow-model-image-content')
                });
            }
        },function (response) {

        });
    }



    /**
     * 删除
     */
    var flowModelMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxDelUrl = serverUrl + "v1/verify/flow/model/d/b";
        var idsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
        } else {
            // 获取选中的数据对象
            var checkRows = flowModelMainPageTable.checkStatus('flowModel_mainPage_grid');
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
                    BaseUtils.htmPageUnblock();
                    if (response.success) {
                        if (obj != null) {
                            obj.del();
                        } else {
                            flowModelMainPageRefreshGrid();
                        }
                    }
                }, function (data) {
                    BaseUtils.htmPageUnblock();
                });
            }, function () {  //按钮【按钮二】的回调

            });
        }
    };

    /**
     *  流程部署
     */
    var flowModelMainPageDeploy = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var paramsData = {};
        var ajaxPutUrl = serverUrl + "v1/verify/flow/model/deploy";
        if (obj != null) {
            paramsData.modelId = obj.data.id;
        }
        if (paramsData != null) {
            //询问框
            layer.confirm('您确认要部署发布模型【'+obj.data.name+'】?', {
                shade: [0.3, 'rgb(230, 230, 230)'],
                btn: ['确定','取消'] //按钮
            }, function(index, layero){
                layer.close(index);
                BaseUtils.pageMsgBlock();
                $postAjax({
                    url: ajaxPutUrl,
                    data: paramsData,
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    BaseUtils.htmPageUnblock();
                    if (response.success) {
                        toastr.success(response.message);
                        flowModelMainPageRefreshGrid();
                    } else if (response.status == 409) {
                        flowModelMainPageRefreshGrid();
                    }
                }, function (data) {
                    BaseUtils.htmPageUnblock();
                });
            }, function () {  //按钮【按钮二】的回调

            });
        }
    };


    var flowModelMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#flowModel_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            var modalDialogTitle = "创建流程模型";
            if (flowModelMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(flowModelMainPageSubmitFormId);
            }
            if (flowModelMainPageMark == 2) {
                modalDialogTitle = "修改流程模型";
                BaseUtils.cleanFormReadonly(flowModelMainPageSubmitFormId);
            }
            $(".has-danger-error").show();
            $("#flowModel_mainPage_dataSubmit_form_submit").show();

            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
            // 居中显示
            $(this).css('display', 'block');
            var modalHeight = $(window).height() / 2 - $('#flowModel_mainPage_dataSubmit_form_modal .modal-dialog').height();
            $(this).find('.modal-dialog').css({
                'margin-top': modalHeight
            });
        });

        // 当调用 hide 实例方法时触发。
        $('#flowModel_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            BaseUtils.cleanFormData(flowModelMainPageSubmitForm);
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#flowModel_mainPage_dataSubmit_form_modal");
        });

    };

    /**
     * 打开流程设计窗口
     */
    var openDiagramWindow = function(params) {
        var layerArea = ['100%', '100%'];
        var flowModelContent = layer.open({
            type: 2,
            title: '流程模型设计',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            area: layerArea,
            content: '../../management/flow/new-diagram.html?'+params,
            end : function () {
                flowModelMainPageFormModal.modal('hide');
                // 清空form 表单数据
                BaseUtils.cleanFormData(flowModelMainPageSubmitForm);
                flowModelMainPageRefreshGridQueryCondition();
                flowModelMainPageRefreshGrid();
            }
        });
        // 窗口全屏打开
        layer.full(flowModelContent);
    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            flowModelMainPageInitFunctionButtonGroup();
            flowModelMainPageInitDataGrid();
            initFlowModelSelectpicker();
            flowModelMainPageInitModalDialog();
            flowModelMainPageFormSubmitHandle();
            $('#flowModel_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                flowModelMainPageDeleteData(null);
                return false;
            });
            $('#flowModel_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                flowModelMainPageMark = 1;
                // 显示 dialog
                flowModelMainPageFormModal.modal('show');
                return false;
            });


            $('#flowModel-page-grid-query-btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                flowModelMainPageRefreshGrid();
                return false;
            });

            $('#flowModel-page-grid-query-rotate-btn').click(function(e) {
                e.preventDefault();
                flowModelMainPageRefreshGridQueryCondition();
                return false;
            });

            window.onresize = function(){
                flowModelMainPageTable.resize("flowModel_mainPage_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageFlowModel.init();
});