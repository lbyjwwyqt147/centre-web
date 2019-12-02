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
    var staffMainPageZtreeNodeList = [];
    var staffMainPageModuleCode = '1030';

    /**
     * ztree 基础属性
     * @type {{onClick: callback.onClick, onAstaffMainPageSyncDataSuccess: callback.onAstaffMainPageSyncDataSuccess}}
     */
    var staffOrgZtreeSetting = BaseUtils.ztree.settingZtreeProperty({
        "selectedMulti":false,
        "enable":false,
        "url":serverUrl + "v1/tree/organization/all/z",
        "headers":BaseUtils.serverHeaders()
    });
    staffOrgZtreeSetting.view = {
            selectedMulti:false,
            fontCss: zTreeHighlightFontCss,
            expandSpeed: "slow", //节点展开动画速度
    };
    staffOrgZtreeSetting.callback = {
        onClick: function (event, treeId, treeNode) {   //点击节点执行事件
            var staffOrgObj = $("#staffOrgName");
            staffOrgObj.attr("value", treeNode.name);
            $("#staffOrgId").attr("value", treeNode.id);
            var otherAttributes = treeNode.otherAttributes;
            $("#staff_full_parent").attr("value", otherAttributes.fullParent);
            $("#staff_org_number").attr("value", otherAttributes.orgNumber);
        },
        onAsyncSuccess:function(event, treeId, msg){ //异步加载完成后执行
            if ("undefined" == $("#staffOrgTree_1_a").attr("title")) {
                $("#staffOrgTree_1").remove();
            }
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
     * 初始化ztree 组件
     */
    var staffOrgMainPageInitTree = function() {
        $.fn.zTree.init($("#staffOrgTree"), staffOrgZtreeSetting);
    };




    /**
     *  搜索节点
     */
    function staffMainPageSearchZtreeNode() {
        var searchZtreeValue = $.trim($("#staff-mainPage-nodeName-search").val());
       staffMainPageZtreeUpdateNodes(staffMainPageZtreeNodeList,false);
        if (searchZtreeValue == "") {
            return;
        }
        var zTree = $.fn.zTree.getZTreeObj("staffOrgTree");
        var keyType = "name";
       staffMainPageZtreeNodeList = zTree.getNodesByParamFuzzy(keyType, searchZtreeValue);
        staffMainPageZtreeUpdateNodes(staffMainPageZtreeNodeList, true);
    };

    /**
     *  更新节点
     * @param staffMainPageZtreeNodeList
     * @param highlight
     */
    function staffMainPageZtreeUpdateNodes(staffMainPageZtreeNodeList, highlight) {
        var zTree = $.fn.zTree.getZTreeObj("staffOrgTree");
        for (var i = 0, l = staffMainPageZtreeNodeList.length; i < l; i++) {
            staffMainPageZtreeNodeList[i].highlight = highlight;
            //定位到节点并展开
            zTree.expandNode(staffMainPageZtreeNodeList[i]);
            zTree.updateNode(staffMainPageZtreeNodeList[i]);
        }
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
     * 下拉树节点点击事件
     * @param treeId
     * @param treeNode
     * @returns {*|boolean}
     */
    function onClick(e, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("staffOrgTree"),
            nodes = zTree.getSelectedNodes(),
            v = "";
        nodes.sort(function compare(a,b){return a.id-b.id;});
        for (var i=0, l=nodes.length; i<l; i++) {
            v += nodes[i].name + ",";
        }
        if (v.length > 0 ) v = v.substring(0, v.length-1);
        var staffOrgObj = $("#staffOrgName");
        staffOrgObj.attr("value", v);
    }

    /**
     * 显示下拉树
     */
    function showMenu() {
        var staffOrgObj = $("#staffOrgName");
        var staffOrgOffset = $("#staffOrgName").offset();
        $("#orgTreeContent").css({left: staffOrgObj.outerWidth() - $(".col-lg-2").width()+30 + "px", top:staffOrgOffset.top - staffOrgObj.outerHeight() - 1 + "px", width:staffOrgObj.outerWidth() + "px"}).slideDown("fast");

        $("body").bind("mousedown", onBodyDown);
    }

    /**
     * 隐藏下拉树
     */
    function hideMenu() {
        $("#orgTreeContent").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown);
    }


    function onBodyDown(event) {
        if (!(event.target.id == "menuBtn" || event.target.id == "orgTreeContent" || $(event.target).parents("#orgTreeContent").length>0)) {
            hideMenu();
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


                var show_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="展示员工在官网">\n';
                show_btn_html += '<a href="javascript:;" class="btn btn-primary m-btn m-btn--icon btn-sm m-btn--icon-only" id="staff_mainPage_show_btn">\n';
                show_btn_html += '<i class="la la-bookmark"></i>\n';
                show_btn_html += '</a>\n';
                show_btn_html += '</li>\n';
                gridHeadToolsHtml.append(show_btn_html);


                var hiden_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="取消员工展示在官网">\n';
                hiden_btn_html += '<a href="javascript:;" class="btn btn-warning m-btn m-btn--icon btn-sm m-btn--icon-only" id="staff_mainPage_hiden_btn">\n';
                hiden_btn_html += '<i class="la la-eye-slash"></i>\n';
                hiden_btn_html += '</a>\n';
                hiden_btn_html += '</li>\n';
                gridHeadToolsHtml.append(hiden_btn_html);

                /*var table_ejection_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="m-tooltip" data-placement="top" title=" 员工离职操作" lay-event="ejection">\n'
                table_ejection_btn_html += '<i class="la la-user-times"></i>\n';
                table_ejection_btn_html += '</a>\n';
                tableToolbarHtml.append(table_ejection_btn_html);*/


                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title="修改员工信息" lay-event="edit">\n'
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



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title=" 删除员工信息" lay-event="del">\n'
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

            var table_look_btn_html = '<a href="javascript:;" class="btn btn-outline-accent m-btn m-btn--icon m-btn--icon-only"  data-offset="-20px -20px" data-container="body" data-toggle="tooltip" data-placement="top" title=" 查看员工信息" lay-event="look">\n'
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
                    staffStatus : 0
                },
                headers: BaseUtils.serverHeaders(),
                title: '员工信息列表',
                initSort: {
                    field: 'entryDate', //排序字段，对应 cols 设定的各字段名
                    type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'staffNumber', title:'工号'},
                    {field:'staffName', title:'姓名'},
                    {field:'staffPortrait', title:'照片', unresize:true,  align: 'center', width:60,
                        templet : function (row) {
                            var value = row.staffPortrait;
                            if (value == null || value == '' ) {
                                value = "../../assets/custom/images/user/user_0.png";
                            }
                            var spanHtml = '<a href="' + value + '" data-fancybox>';
                            spanHtml += '<img style="display: inline-block; width: 100%; height: 100%;" src="' + value + '"/>';
                            spanHtml += '</a>';
                            return spanHtml;
                        }
                    },
                    {field:'staffNickName', title:'昵称'},
                    {field:'mobilePhone', title:'手机号'},
                    {field:'staffPositionText', title:'职务'},
                    {field:'entryDate', title:'入职日期', sort:true},
                    {field:'staffSex', title:'性别',
                        templet : function (row) {
                            var value = row.staffSex;
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
                    {field:'staffEmail', title:'电子邮箱'},
                    {field:'staffOrgName', title:'组织机构'},
                    {field:'workingYears', title:'在职年限', sort:true, unresize:true},
                    {field:'staffStatus', title:'状态', align: 'center',  unresize:true,
                        templet : function (row) {
                            var value = row.staffStatus;
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
                    {field:'display', title:'是否展示在官网', align: 'center',  fixed: 'right', unresize:true,
                        templet : function (row) {
                            var value = row.display;
                            var spanCss = "m-badge--warning";
                            var curStatusText = "否";
                            switch (value) {
                                case 0:
                                    curStatusText = "是";
                                    spanCss = "m-badge--success";
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
            //离职日期控件
            laydate.render({
                elem: '#dimissionDate'
            });
        });
        $('#dimissionReason').selectpicker('refresh');
        // 职务 select
        BaseUtils.dictDataSelect("staff_position", function (data) {
            var $staffPosition = $("#staffPosition");
            var $queryStaffPosition = $("#query_staffPosition");
            $queryStaffPosition.append("<option value=''>--请选择--</option>");
            Object.keys(data).forEach(function(key){
                $staffPosition.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
                $queryStaffPosition.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $staffPosition .selectpicker('refresh');
            $queryStaffPosition.selectpicker('refresh');
            $queryStaffPosition.change(function () {
               queryStaffPositionSelectOnchang();
            });
        });
        // 技能(特长)  multi select
        BaseUtils.dictDataSelect("staff_skill", function (data) {
            var $skill = $("#skill");
            Object.keys(data).forEach(function(key){
                var curId = data[key].id;
                if (curId == 0 || curId == 1)  {
                    $skill.append("<option value=" + curId + " selected>" + data[key].text + "</option>");
                } else {
                    $skill.append("<option value=" + curId + ">" + data[key].text + "</option>");
                }
            });
            $skill.select2({
                placeholder: "技能(特长)",
            });
        });
        // 职务选择事件绑定
        $("#staffPosition").on("changed.bs.select",function(e){
            // e 的话就是一个对象 然后需要什么就 “e.参数” 形式 进行获取
            var curSelectedValue = e.target.value;
            if (curSelectedValue == 1 || curSelectedValue == 2)  {
                $('#skill').val([0,1]).trigger("change");
            } else if (curSelectedValue == 3) {
                $('#skill').val([2]).trigger("change");
            }
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
            showMenu();
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
        $('#staffPosition').selectpicker('val', obj.staffPosition);
        $('#province').selectpicker('val', obj.province);
        $('#city').selectpicker('val', obj.city);
        $('#district').selectpicker('val', obj.district);
        $('#dimissionReason').selectpicker('val', obj.dimissionReason);
        $("#skill").val(obj.skill.split(",")).trigger("change");
        $("input:radio[name=\"tempStaffSex\"][value='"+obj.staffSex+"']").click();
        $("#staffIntro-text").val(BaseUtils.toTextarea(obj.staffIntro));
        $("#staffEquipment-text").val(BaseUtils.toTextarea( obj.staffEquipment));
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
            $("#staffEquipment-text").val(BaseUtils.textareaTo( $("#staffEquipment-text").val()));
            BaseUtils.formInputTrim(staffMainPageSubmitFormId);
            $("#staff-sex").val(curSex);
            $("#staff-lessee").val(BaseUtils.lessee);
            staffMainPageSubmitForm.validate({
                rules: {
                    staffNumber: {
                        required: true,
                        alnum:true,
                        maxlength: 20
                    },
                    staffName: {
                        required: true,
                        chcharacterNum:true,
                        maxlength: 32
                    },
                    staffNickName: {
                        required: true,
                        alnumName:true,
                        maxlength: 32
                    },
                    mobilePhone: {
                        required: true,
                        isMobile:true
                    },
                    staffIdentiyCard: {
                        required: false,
                        idCardNo:true
                    },
                    staffEmail: {
                        required: true,
                        email:true,
                        maxlength: 60
                    },
                    entryDate: {
                        required: true
                    },
                    staffQq: {
                        required: false,
                        isQq:true,
                        maxlength: 13
                    },
                    staffWechat: {
                        required: false,
                        alnum:true,
                        maxlength: 20
                    },
                    staffWeiBo: {
                        required: false,
                        url:true,
                        maxlength: 200
                    },
                    street: {
                        chcharacterNum:true,
                        maxlength: 50
                    },
                    staffEquipment: {
                        maxlength: 200
                    },
                    staffIntro: {
                        maxlength: 350
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
            var skillOptions = $("#skill").select2("val");
            $("#staff-skill").val(skillOptions.join(','));
            if ($("#staff-id").val() == null || $("#staff-id").val() == "") {
                $("#staffCategory").val(1);
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
        var ajaxDelUrl = serverUrl + "v1/verify/staff/d";
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
            var checkRows = staffMainPageTable.checkStatus('staff_mainPage_grid');
            //获取选中行的数据
            var checkData = checkRows.data;
            if (checkData.length > 0) {
                $.each(checkData, function(index,element){
                    idsArray.push(element.id);
                    userIdsArray.push(element.userId);
                });
                ajaxDelUrl = serverUrl + "v1/verify/staff/d/b";
                delData = {
                    'ids' : JSON.stringify(idsArray),
                    'otherIds': JSON.stringify(userIdsArray)
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
        var ajaxPutUrl = serverUrl + "v1/verify/staff/p";
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
     *  修改数据是否在官网展示字段
     */
    var staffMainPageUpdateDataShowStatus = function(status) {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        var ajaxPutUrl = serverUrl + "v1/verify/staff/show/p";
        var putData = null;
        var idsArray = [];
        var putParams = [];
        // 获取选中的数据对象
        var checkRows = staffMainPageTable.checkStatus('staff_mainPage_grid');
        //获取选中行的数据
        var checkData = checkRows.data;
        if (checkData.length > 0) {
            $.each(checkData, function(index,element){
                idsArray.push(element.id);
            });
            putData = {
                'ids': JSON.stringify(idsArray),
                'status' : status,
            }
        }
        if (putData != null) {
            var title = "你确定要将员工信息展示在官网吗?";
            if (status == 1) {
                title = "你确定要将员工信息在官网取消展示吗?";
            }
            //询问框
            layer.confirm(title, {
                shade: [0.3, 'rgb(230, 230, 230)'],
                btn: ['确定','取消'] //按钮
            }, function(index, layero){   //按钮【按钮一】的回调
                layer.close(index);
                BaseUtils.pageMsgBlock();
                $putAjax({
                    url: ajaxPutUrl,
                    data: putData,
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    if (response.success) {
                        staffMainPageRefreshGrid();
                    }
                }, function (data) {
                    BaseUtils.htmPageUnblock();
                });
            }, function () {  //按钮【按钮二】的回调

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
            var ztreeNode = null;
            if (staffMainPageMark == 1) {
                BaseUtils.cleanFormReadonly(staffMainPageSubmitFormId);
                $(".glyphicon.glyphicon-remove.form-control-feedback").show();
                var ztreeNodes = orgzTree.getNodes();
                if (ztreeNodes.length > 0) {
                    ztreeNode = ztreeNodes[0]; //注：只有当树的根节点只有一个时，才可以这样取，否则会获取到多个节点
                }
                $('#skill').val([0,1]).trigger("change");
                $("input:radio[name=\"tempStaffSex\"][value='0']").click();
            }
            if (staffMainPageMark == 2) {
                ztreeNode = orgzTree.getNodeByParam("id",$("#staffOrgId").val());
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
            if (ztreeNode != null) {
                orgzTree.selectNode(ztreeNode);
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
            $('#staff_mainPage_show_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                staffMainPageUpdateDataShowStatus(0);
                return false;
            });
            $('#staff_mainPage_hiden_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                staffMainPageUpdateDataShowStatus(1);
                return false;
            });
            $('#staff_mainPage_searchNode_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                staffMainPageSearchZtreeNode();
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