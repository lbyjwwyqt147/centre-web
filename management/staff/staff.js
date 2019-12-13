/***
 * 员工管理
 * @type {{init}}
 */
var SnippetMainPageStaff = function() {
    var serverUrl = BaseUtils.serverAddress;
    var staffMainPageTable;
    var staffMainPageFormModal = $('#staff_mainPage_dataSubmit_form_modal');
    var staffMainPageSubmitForm = $("#staff_mainPage_dataSubmit_form");
    var staffMainPageSubmitFormId = "#staff_mainPage_dataSubmit_form";
    var staffMainPageMark = 1;
    var staffMainPageModuleCode = '10031';

    /**
     * 部门 ztree 基础属性
     * @type {{onClick: callback.onClick, onAstaffMainPageSyncDataSuccess: callback.onAstaffMainPageSyncDataSuccess}}
     */
    var staffOrgZtreeSetting = BaseUtils.ztree.settingZtreeProperty({
        "selectedMulti":false,
        "enable":false,
        "url":serverUrl + "v1/tree/organization/z",
        "headers":BaseUtils.serverHeaders()
    });
    staffOrgZtreeSetting.view = {
            selectedMulti:false,
            fontCss: zTreeHighlightFontCss,
            expandSpeed: "slow", //节点展开动画速度
    };
    staffOrgZtreeSetting.callback = {
        onClick: function (event, treeId, treeNode) {   //点击节点执行事件
            var otherAttributes = treeNode.otherAttributes;
            if (otherAttributes.fullParent != 0) {
                var staffOrgObj = $("#staffOrgName");
                staffOrgObj.attr("value", treeNode.name);
                $("#staffOrgId").attr("value", treeNode.id);
                $("#staff_full_parent").attr("value", otherAttributes.fullParent);
                $("#staff_org_number").attr("value", otherAttributes.orgNumber);
            }
        },
        onAsyncSuccess:function(event, treeId, treeNode, msg){ //异步加载完成后执行
            if ("undefined" == $("#staffOrgTree_1_a").attr("title")) {
                $("#staffOrgTree_1").remove();
            };
            zTreeOnAsyncSuccess(event, treeId, treeNode, msg);
        },
        onAsyncError:function(){ //异步加载出现异常执行

        },
        beforeAsync:function () { //异步加载之前执行
           if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
        }
    };


    /**
     * 职位 ztree 基础属性
     * @type {{onClick: callback.onClick, onAstaffMainPageSyncDataSuccess: callback.onAstaffMainPageSyncDataSuccess}}
     */
    var staffPositionZtreeSetting = BaseUtils.ztree.settingZtreeProperty({
        "selectedMulti":false,
        "enable":false,
        "url":serverUrl + "v1/tree/position/z",
        "headers":BaseUtils.serverHeaders()
    });
    staffPositionZtreeSetting.view = {
        selectedMulti:false,
        fontCss: zTreeHighlightFontCss,
        expandSpeed: "slow", //节点展开动画速度
    };
    staffPositionZtreeSetting.callback = {
        onClick: function (event, treeId, treeNode) {   //点击节点执行事件
            var otherAttributes = treeNode.otherAttributes;
            if (otherAttributes.fullParent != 0) {
                var $userPositionName = $("#userPositionName");
                $userPositionName.attr("value", treeNode.name);
                $("#staffPosition").attr("value", treeNode.id);
            }
        },
        onAsyncSuccess:function(event, treeId, treeNode, msg){ //异步加载完成后执行
            if ("undefined" == $("#staffPositionTreeForm_1_a").attr("title")) {
                $("#staffPositionTreeForm_1").remove();
            }
            zTreeOnAsyncSuccess(event, treeId, treeNode, msg);
        },
        onAsyncError:function(){ //异步加载出现异常执行

        },
        beforeAsync:function () { //异步加载之前执行
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
        }
    };

    //用于捕获异步加载正常结束的事件回调函数
    function zTreeOnAsyncSuccess(event, treeId, treeNode, msg){
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        var nodes = treeObj.getNodes();
        if (nodes.length>0) {
            for(var i=0;i<nodes.length;i++){
                treeObj.expandNode(nodes[i], true, false, false);//默认展开第一级节点
            }
        }
    }

    /**
     * 初始化ztree 组件
     */
    var staffOrgMainPageInitTree = function() {
        $.fn.zTree.init($("#staffOrgTree"), staffOrgZtreeSetting);
        $.fn.zTree.init($("#staffPositionTreeForm"), staffPositionZtreeSetting);
    };



    /**
     * 设置 ztree 高亮时的css
     * @param treeId
     * @param treeNode
     * @returns {*}
     */
     function zTreeHighlightFontCss(treeId, treeNode) {
       return BaseUtils.ztree.getZtreeHighlightFontCss(treeId, treeNode)
    };

    /**
     * 下拉树点击之前
     * @param treeId
     * @param treeNode
     * @returns {*|boolean}
     */
    function beforeClick(treeId, treeNode) {
        var check = (treeNode && !treeNode.isParent);
        if (!check) alert("Do not select province...");
        return check;
    }

    /**
     * 显示部门下拉树
     */
    function showDeptMenu() {
        var staffOrgObj = $("#staffOrgName");
        var staffOrgOffset = staffOrgObj.offset();
        var errorHeight = $(".form-control-feedback").height();
        if (errorHeight == undefined) {
            errorHeight = 0;
        } else {
            errorHeight = errorHeight + 12;
        }
        $("#orgTreeContent").css({left: staffOrgObj.outerWidth() - $(".col-lg-2").width()+30 + "px", top:staffOrgOffset.top /2 + 40 + errorHeight + "px", width:staffOrgObj.outerWidth() + "px"}).slideDown("fast");

        $("body").bind("mousedown", onBodyDeptDown);
    }
    /**
     * 显示职位下拉树
     */
    function showPositionMenu() {
        var userPositionNameObj = $("#userPositionName");
        var userPositionOffset = userPositionNameObj.offset();
        var errorHeight = $(".form-control-feedback").height();
        if (errorHeight == undefined) {
            errorHeight = 0;
        } else {
            errorHeight = errorHeight + 12;
        }
        $("#positionTreeFormContent").css({left: userPositionNameObj.outerWidth() + $(".col-lg-2").width()*2 -15 + "px", top:userPositionOffset.top /2 + 40 + errorHeight + "px", width:userPositionNameObj.outerWidth() + "px"}).slideDown("fast");

        $("body").bind("mousedown", onBodyPositionDown);
    }
    /**
     * 隐藏下拉树
     */
    function hidePositionMenu() {
        $("#positionTreeFormContent").fadeOut("fast");
        $("body").unbind("mousedown", onBodyPositionDown);
    }

    /**
     * 隐藏下拉树
     */
    function hideDeptMenu() {
        $("#orgTreeContent").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDeptDown);
    }

    function onBodyDeptDown(event) {
       if (!(event.target.id == "menuBtn" || event.target.id == "orgTreeContent" || $(event.target).parents("#orgTreeContent").length>0)) {
           hideDeptMenu();
        }
    }

    function onBodyPositionDown(event) {
        if (!(event.target.id == "menuBtn" || event.target.id == "positionTreeFormContent" || $(event.target).parents("#positionTreeFormContent").length>0)) {
            hidePositionMenu();
        }
    }

    /**
     * 初始化 功能按钮
     */
    var staffMainPageInitFunctionButtonGroup = function () {
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(staffMainPageModuleCode);
        if (functionButtonGroup != null) {
            var gridHeadToolsHtml = $("#staff-mainPage-grid-head-tools");
            var tableToolbarHtml = $("#staff_mainPage_table_toolbar");

            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {
                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="新增员工信息">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="staff_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);

                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" data-placement="top" title="修改员工信息" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-edit"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);

            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="删除员工信息">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="staff_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" data-placement="top" title=" 删除员工信息" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableToolbarHtml.append(table_del_btn_html);

            }
            var sync_index = $.inArray("10", buttonGroup);
            if (sync_index != -1) {
                var sync_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="同步数据">\n';
                sync_btn_html += '<a href="javascript:;" class="btn btn-accent m-btn m-btn--icon btn-sm m-btn--icon-only" id="staff_mainPage_sync_btn">\n';
                sync_btn_html += '<i class="la la-rotate-right"></i>\n';
                sync_btn_html += '</a>\n';
                sync_btn_html += '</li>\n';
                gridHeadToolsHtml.append(sync_btn_html);
            }

            var table_look_btn_html = '<a href="javascript:;" class="btn btn-outline-accent m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" data-placement="top" title=" 查看员工信息" lay-event="look">\n'
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
    var staffMainPageInitDataGrid = function () {
        layui.use('table', function(){
            var layuiForm = layui.form;
            staffMainPageTable =  $initEncrypDataGrid({
                elem: '#staff_mainPage_grid',
                url: serverUrl + 'v1/table/staff/g',
                method:"get",
                where: {   //传递额外参数
                    userStatus : 0,
                    userCategory: 2
                },
                headers: BaseUtils.serverHeaders(),
                title: '员工信息列表',
                initSort: {
                    field: 'userNumber', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'userNumber', title:'工号'},
                    {field:'userFullName', title:'姓名'},
                    {field:'userPortrait', title:'照片', unresize:true,  align: 'center', width:60,
                        templet : function (row) {
                            var value = row.userPortrait;
                            if (value == null || value == '' ) {
                                value = "../../assets/custom/images/user/user_0.png";
                            }
                            var spanHtml = '<a href="' + value + '" data-fancybox>';
                            spanHtml += '<img style="display: inline-block; width: 100%; height: 100%;" src="' + value + '"/>';
                            spanHtml += '</a>';
                            return spanHtml;
                        }
                    },
                    {field:'userNickName', title:'昵称'},
                    {field:'mobilePhone', title:'手机号'},
                    {field:'userSex', title:'性别',
                        templet : function (row) {
                            var value = row.userSex;
                            var curSexText = "男";
                            switch (value) {
                                case 1:
                                    curSexText = "女";
                                    break;
                                default:
                                    break;
                            }
                            return curSexText;
                        }
                    },
                    {field:'userEmail', title:'电子邮箱'},
                    {field:'staffOrgName', title:'所属部门'},
                    {field:'userPositionText', title:'职位'},
                    {field:'entryDate', title:'入职日期', sort:true},
                    {field:'workingYears', title:'在职年限', sort:true, unresize:true},
                    {field:'userStatus', title:'状态', align: 'center',  unresize:true,
                        templet : function (row) {
                            var value = row.userStatus;
                            var spanCss = "m-badge--success";
                            var curStatusText = "在职";
                            switch (value) {
                                case 1:
                                    curStatusText = "禁用";
                                    spanCss = "m-badge--warning";
                                    break;
                                case 2:
                                    curStatusText = "离职";
                                    spanCss = "m-badge--danger";
                                    break;
                                default:
                                    break;
                            }
                            var spanHtml =  '<span class="m-badge ' + spanCss + ' m-badge--wide">' + curStatusText + '</span>';
                            return spanHtml;
                        }
                    },
                    {fixed: 'right', title:'操作', unresize:true, toolbar: '#staff_mainPage_table_toolbar', align: 'center', width:210}
                ]],
                limit: 20,
                limits: [20,30,40,50]
            }, function(res, curr, count){
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(staffMainPageModuleCode);
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
            staffMainPageTable.on('tool(staff_mainPage_grid)', function(obj){
                if(obj.event === 'del'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    staffMainPageDeleteData(obj);
                } else if(obj.event === 'edit'){
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    staffMainPageSubmitForm.setForm(obj.data);
                    initStaffSelected(obj.data);
                    staffMainPageMark = 2;
                    // 显示 dialog
                    staffMainPageFormModal.modal('show');
                } else if (obj.event === 'ejection')  {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                } else if (obj.event === 'look')  {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    lookStaffParticulars(obj);
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
                staffMainPageUpdateDataStatus(obj, statusValue);
            });

            //监听行双击事件
            staffMainPageTable.on('rowDouble(staff_mainPage_grid)', function(obj){
                staffMainPageMark = 3;
                staffMainPageSubmitForm.setForm(obj.data);
                initStaffSelected(obj.data);
                BaseUtils.readonlyForm(staffMainPageSubmitFormId);
                staffMainPageFormModal.modal('show');
            });
        });
    };

    /**
     * 刷新grid
     */
    var staffMainPageRefreshGrid = function () {
        var searchSondition = $("#staff-page-grid-query-form").serializeJSON();
        staffMainPageTable.reload('staff_mainPage_grid', {
            where: searchSondition,
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
    };

    /**
     * 重置查询条件
     */
    var staffMainPageRefreshGridQueryCondition = function () {
        $("#staff-page-grid-query-form")[0].reset();
        $("#query_staffPosition").selectpicker('refresh');
        $("#query-staffStatus").selectpicker('refresh');
    };


    /**
     * 初始化 select 组件
     */
    var initSelectpicker = function () {
        $('.m_selectpicker').selectpicker({
            noneSelectedText : '请选择'//默认显示内容
        });
        var laydate
        layui.use('laydate', function() {
            laydate = layui.laydate;
            //入职日期控件
            laydate.render({
                elem: '#entryDate'
            });
            //出生日期控件
            laydate.render({
                elem: '#birthday'
            });
        });

        // 省市区 select
        BaseUtils.distDataSelect("510000", function (data) {
            var $city = $("#city");
            Object.keys(data).forEach(function(key){
                $city.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $city .selectpicker('refresh');
        });
        BaseUtils.distDataSelect("510100", function (data) {
            var $district = $("#district");
            Object.keys(data).forEach(function(key){
                var curId = data[key].id;
                $district.append("<option value=" + curId + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $district .selectpicker('refresh');
        });
        // 城市绑定监听选择事件
        $("#city").on('changed.bs.select',function(e){
            BaseUtils.distDataSelect(e.target.value, function (data) {
                var $district = $("#district");
                $district.html("");
                Object.keys(data).forEach(function(key){
                    var curId = data[key].id;
                    $district.append("<option value=" + curId + ">" + data[key].text + "</option>");
                });
                //必须加，刷新select
                $district .selectpicker('refresh');
            });
        });

        $("#staffIdentiyCard").blur(function() {
            var staffIdentiyCard = $("#staffIdentiyCard").val();
            if ($.trim(staffIdentiyCard) != "") {
                var curCardObj = BaseUtils.birthdayCard(staffIdentiyCard);
                if (curCardObj != null) {
                    //初始赋值
                    laydate.render({
                        elem: '#birthday',
                        value: curCardObj.birthday,
                        isInitValue: true
                    });
                    $("input:radio[name=\"tempStaffSex\"][value='"+curCardObj.sex+"']").click();
                } else {
                    $("#staffIdentiyCard").val('');
                }
            }
        });
        
        $("#staffOrgName").click(function() {
            showDeptMenu();
            return false;
        });
        $("#userPositionName").click(function() {
            showPositionMenu();
            return false;
        });
        $("#query-staffStatus").change(function () {
            queryStaffStatusSelectOnchang();
        });

    }

    /**
     *  查询条件 职务选择事件
     * @param obj
     */
    var queryStaffPositionSelectOnchang = function (obj) {
        staffMainPageRefreshGrid();
    }

    /**
     *  查询条件 状态选择事件
     * @param obj
     */
    var queryStaffStatusSelectOnchang = function (obj) {
        staffMainPageRefreshGrid();
    }


    /**
     * select 控件回显值
     */
    var initStaffSelected = function (obj) {
        $('#probationStatus').selectpicker('val', obj.probationStatus);
        $('#staffPosition').selectpicker('val', obj.userPosition);
        $('#province').selectpicker('val', obj.province);
        $('#city').selectpicker('val', obj.city);
        $('#district').selectpicker('val', obj.district);
        $('#dimissionReason').selectpicker('val', obj.dimissionReason);
        $("input:radio[name=\"tempStaffSex\"][value='"+obj.userSex+"']").click();
        $("#staffIntro-text").val(BaseUtils.toTextarea(obj.userIntro));
    };

    /**
     * 查看员工详情信息
     * @param obj
     */
    var  lookStaffParticulars = function (obj) {
        layer.open({
            type: 2,
            title: '员工个人信息',
            offset: 'auto',
            resize: false,
            shadeClose : true,
            content:  ['../../management/staff/particulars.html?businessId='+ obj.data.id, 'no'], //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content:
            area: ['95%', '90%']
        });
    }

    /**
     * 初始化表单提交
     */
    var staffMainPageFormSubmitHandle = function() {
        $('#staff_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            var curSex = $("input:radio[name=\"tempStaffSex\"]:checked").val();
            $("#staffIntro-text").val(BaseUtils.textareaTo( $("#staffIntro-text").val()));
            BaseUtils.formInputTrim(staffMainPageSubmitFormId);
            $("#staff-sex").val(curSex);
            staffMainPageSubmitForm.validate({
                rules: {
                    userNumber: {
                        required: true,
                        alnum:true,
                        maxlength: 20
                    },
                    userFullName: {
                        required: true,
                        chcharacterNum:true,
                        maxlength: 32
                    },
                    userNickName: {
                        required: true,
                        alnumName:true,
                        maxlength: 32
                    },
                    mobilePhone: {
                        required: true,
                        isMobile:true
                    },
                    userPositionName: {
                        required: true
                    },
                    staffOrgName: {
                        required: true
                    },
                    userIdentiyCard: {
                        required: false,
                        idCardNo:true
                    },
                    userEmail: {
                        required: true,
                        email:true,
                        maxlength: 65
                    },
                    entryDate: {
                        required: true
                    },
                    street: {
                        chcharacterNum:true,
                        maxlength: 50
                    },
                    userIntro: {
                        maxlength: 500
                    },
                    birthday : {
                        required: true,
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
            if (!staffMainPageSubmitForm.valid()) {
                return;
            }
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            BaseUtils.modalBlock("#staff_mainPage_dataSubmit_form_modal");
            $postAjax({
                url:serverUrl + "v1/verify/staff/s",
                data:staffMainPageSubmitForm.serializeJSON(),
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.modalUnblock("#staff_mainPage_dataSubmit_form_modal");
                if (response.success) {
                    // toastr.success(BaseUtils.saveSuccessMsg);
                    // 关闭 dialog
                    staffMainPageFormModal.modal('hide');

                    if ( $("#staffPortraitId").val() == '') {
                        //询问框
                        layer.confirm('是否需要上传'+ $("#staff-name").val() +'的照片信息?', {
                            shade: [0.3, 'rgb(230, 230, 230)'],
                            btn: ['确定','取消'] //按钮
                        }, function(index, layero){   //按钮【按钮一】的回调
                            layer.close(index);
                            layer.open({
                                type: 2,
                                title: '上传照片',
                                offset: '90px',
                                resize: false,
                                content:  ['portrait.html?businessId='+ response.data +'&businessType=1', 'no'], //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content:
                                area: ['1010px', '650px'],
                                btn: ['跳过'],
                                yes: function(index, layero){  // 确定按钮回调方法
                                    // 刷新表格
                                    staffMainPageRefreshGrid();
                                    layer.close(index);
                                },
                                cancel: function(index, layero){  // 右上角关闭按钮触发的回调
                                    staffMainPageRefreshGrid();
                                    layer.close(index);
                                    return false;
                                },
                                end : function () {
                                    staffMainPageRefreshGrid();
                                }
                            });
                        }, function () {  //按钮【按钮二】的回调
                            staffMainPageRefreshGrid();
                        });
                    }
                } else if (response.status == 409) {
                    staffMainPageRefreshGrid();
                }
            }, function (data) {
                BaseUtils.modalUnblock("#staff_mainPage_dataSubmit_form_modal");
            });
            return false;
        });
    };

    /**
     *  清空表单数据和样式
     */
    var staffMainPageCleanForm = function () {
        BaseUtils.cleanFormData(staffMainPageSubmitForm);
    };

    /**
     * 删除
     */
    var staffMainPageDeleteData = function(obj) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxDelUrl = serverUrl + "v1/verify/staff/d/b";
        var delData = null;
        var idsArray = [];
        var userIdsArray = [];
        if (obj != null) {
            idsArray.push(obj.data.id);
            userIdsArray.push(obj.data.userId);
        } else {
            // 获取选中的数据对象
            var checkRows = staffMainPageTable.checkStatus('staff_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                    userIdsArray.push(element.userId);
                });
            }
        }
        delData = {
            'ids' : JSON.stringify(idsArray),
            'otherIds': JSON.stringify(userIdsArray)
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
                    data: delData,
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    if (response.success) {
                        if (obj != null) {
                            obj.del();
                        } else {
                            staffMainPageRefreshGrid();
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
    var staffMainPageUpdateDataStatus = function(obj,status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/staff/p/b";
        var putData = null;
        var userIdsArray = [];
        var idsArray = [];
        var putParams = [];
        if (obj != null) {
            var dataVersion = $(obj.elem.outerHTML).attr("dataversion");
            var userId = $(obj.elem.outerHTML).attr("userid");
            var curDataParam = {
                "id" : userId,
                "dataVersion" : dataVersion
            }
            putParams.push(curDataParam);
            userIdsArray.push(userId);
            idsArray.push(obj.value)
        } else {
            // 获取选中的数据对象
            var checkRows = staffMainPageTable.checkStatus('staff_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    var curDataParam = {
                        "id" : element.userId,
                        "dataVersion" : element.dataVersion
                    }
                    putParams.push(curDataParam);
                    idsArray.push(element.id);
                    userIdsArray.push(element.userId);
                });
            }
        }
        putData = {
            'ids': JSON.stringify(idsArray),
            'status' : status,
            'putParams' : JSON.stringify(putParams),
            'otherIds':JSON.stringify(userIdsArray)
        }
        if (putData != null) {
            BaseUtils.pageMsgBlock();
            $putAjax({
                url: ajaxPutUrl,
                data: putData,
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                  if (response.success) {
                      staffMainPageRefreshGrid();
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
                      staffMainPageRefreshGrid();
                  } else {
                     if (status == 1) {
                        obj.othis.removeClass("layui-form-checked");
                        $(obj.elem).removeAttr("checked");
                     } else {
                        obj.othis.addClass("layui-form-checked");
                     }
                     if (response.status == 504 || response.status == 401 ) {
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
    var staffMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/staff/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                staffMainPageRefreshGrid();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };


    var staffMainPageInitModalDialog = function() {
        // 在调用 show 方法后触发。
        $('#staff_mainPage_dataSubmit_form_modal').on('show.bs.modal', function (event) {
            var modalDialogTitle = "新增员工信息";
            var orgzTree = $.fn.zTree.getZTreeObj("staffOrgTree");
            // 取消当前所有被选中节点的选中状态
            orgzTree.cancelSelectedNode();
            var positionzTree = $.fn.zTree.getZTreeObj("staffPositionTreeForm");
            // 取消当前所有被选中节点的选中状态
            positionzTree.cancelSelectedNode();
            var deptZtreeNode = null;
            var positionNode = null;
            if (staffMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(staffMainPageSubmitFormId);
                $("#userCategory").val(2);
                $(".glyphicon.glyphicon-remove.form-control-feedback").show();
                $("input:radio[name=\"tempStaffSex\"][value='0']").click();
            }
            if (staffMainPageMark == 2) {
                deptZtreeNode = orgzTree.getNodeByParam("id",$("#staffOrgId").val());
                positionNode = positionzTree.getNodeByParam("id",$("#staffPosition").val());
                modalDialogTitle = "修改员工信息";
                BaseUtils.cleanFormReadonly(staffMainPageSubmitFormId);
                $("#staff_mainPage_dataSubmit_form_staff_number").addClass("m-input--solid");
                $("#staff_mainPage_dataSubmit_form_staff_number").attr("readonly", "readonly");
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
            }
            $(".has-danger-error").show();
            $("#staff_mainPage_dataSubmit_form_submit").show();
            $("#staff_mainPage_dataSubmit_form_parent_name").addClass("m-input--solid");
            $("#staff_mainPage_dataSubmit_form_parent_name").attr("readonly", "readonly");
            if (staffMainPageMark == 3) {
                modalDialogTitle = "员工信息";
                $(".glyphicon.glyphicon-remove.form-control-feedback").hide();
                $(".has-danger-error").hide();
                $("#staff_mainPage_dataSubmit_form_submit").hide();
            }
            if (deptZtreeNode != null) {
                orgzTree.selectNode(deptZtreeNode);
                // 选中的节点
                var selectedNodes = orgzTree.getSelectedNodes();
                if (selectedNodes.length > 0) {
                    var selectedNode = selectedNodes[0];
                    var staffOrgObj = $("#staffOrgName");
                    staffOrgObj.attr("value", selectedNode.name);
                    $("#staffOrgId").attr("value", selectedNode.id);
                    var otherAttributes = selectedNode.otherAttributes;
                    $("#staff_full_parent").attr("value", otherAttributes.fullParent);
                    $("#staff_org_number").attr("value", otherAttributes.orgNumber);
                }
            }
            if (positionNode != null) {
                positionzTree.selectNode(positionNode);
                // 选中的节点
                var selectedNodes = positionzTree.getSelectedNodes();
                if (selectedNodes.length > 0) {
                    var selectedNode = selectedNodes[0];
                    $("#userPositionName").attr("value", selectedNode.name);
                    $("#staffPosition").attr("value", selectedNode.id);
                }
            }
            var modalDialog = $(this);
            modalDialog.find('.modal-title').text(modalDialogTitle);
            // 居中显示
            $(this).css('display', 'block');
            var modalHeight = $(window).height() / 2 - $('#staff_mainPage_dataSubmit_form_modal .modal-dialog').height() / 2;
            $(this).find('.modal-dialog').css({
                'margin-top': modalHeight
            });
        });

        // 当调用 hide 实例方法时触发。
        $('#staff_mainPage_dataSubmit_form_modal').on('hide.bs.modal', function (event) {
            // 清空form 表单数据
            staffMainPageCleanForm();
            $(".modal-backdrop").remove();
            BaseUtils.modalUnblock("#staff_mainPage_dataSubmit_form_modal");
        });

    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            staffMainPageInitFunctionButtonGroup();
            staffOrgMainPageInitTree();
            staffMainPageInitDataGrid();
            staffMainPageInitModalDialog();
            staffMainPageFormSubmitHandle();
            initSelectpicker();
            $('#staff_mainPage_delete_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                staffMainPageDeleteData(null);
                return false;
            });
            $('#staff_mainPage_add_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                staffMainPageMark = 1;
                // 显示 dialog
                staffMainPageFormModal.modal('show');
                return false;
            });

            $('#staff_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                staffMainPageSyncData();
                return false;
            });

            $('#staff-page-grid-query-btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                staffMainPageRefreshGrid();
                return false;
            });

            $('#staff-page-grid-query-rotate-btn').click(function(e) {
                e.preventDefault();
                staffMainPageRefreshGridQueryCondition();
                return false;
            });

            window.onresize = function(){
                staffMainPageTable.resize("staff_mainPage_grid");
            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageStaff.init();
});