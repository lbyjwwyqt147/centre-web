/***
 * 角色角色
 * @type {{init}}
 */
var SnippetMainPageRoleUser = function() {
    var serverUrl = BaseUtils.serverAddress;
    var roleUserMainPageTable;
    var roleUserMainPageModuleCode = '10025';
    var userId = 0;
    
    /**
     * 初始化 功能按钮
     */
    var roleUserMainPageInitFunctionButtonGroup = function () {
        $('.m_selectpicker').selectpicker({
            noneSelectedText : '请选择'//默认显示内容
        });
        var functionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(roleUserMainPageModuleCode);
        if (functionButtonGroup != null) {
            var tableToolbarHtml = $("#role-user_mainPage_table_toolbar");
            var gridHeadToolsHtml = $("#role-user-mainPage-grid-head-tools");
            var gridRoleHeadToolsHtml = $("#user-role-mainPage-grid-head-tools");
            var tableRoleToolbarHtml = $("#user-role_mainPage_table_toolbar");


            var buttonGroup = functionButtonGroup.split(';');
            //如果arry数组里面存在"指定字符" 这个字符串则返回该字符串的数组下标，否则返回(不包含在数组中) -1
            var save_index = $.inArray("1", buttonGroup);
            if (save_index != -1) {

                var save_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="分配角色">\n';
                save_btn_html += '<a href="javascript:;" class="btn btn-success m-btn m-btn--icon btn-sm m-btn--icon-only" id="staff_mainPage_add_btn">\n';
                save_btn_html += '<i class="la la-plus"></i>\n';
                save_btn_html += '</a>\n';
                save_btn_html += '</li>\n';
                gridHeadToolsHtml.append(save_btn_html);

                var edit_btn_html = '<a href="javascript:;" class="btn btn-outline-primary m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" title="分配角色" lay-event="edit">\n'
                edit_btn_html += '<i class="la la-star-half-full"></i>\n';
                edit_btn_html += '</a>\n';
                tableToolbarHtml.append(edit_btn_html);
            }
            var delete_index = $.inArray("2", buttonGroup);
            if (delete_index != -1) {
                var delete_btn_html = '<li class="nav-item m-tabs__item" data-container="body" data-toggle="m-tooltip" data-placement="top" title="移除角色">\n';
                delete_btn_html += '<a href="javascript:;" class="btn btn-danger m-btn m-btn--icon btn-sm m-btn--icon-only" id="staff_mainPage_delete_btn">\n';
                delete_btn_html += '<i class="la la-trash-o"></i>\n';
                delete_btn_html += '</a>\n';
                delete_btn_html += '</li>\n';
                gridRoleHeadToolsHtml.append(delete_btn_html);



                var table_del_btn_html = '<a href="javascript:;" class="btn btn-outline-danger m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" data-placement="top" title=" 移除角色" lay-event="del">\n'
                table_del_btn_html += '<i class="la la-trash-o"></i>\n';
                table_del_btn_html += '</a>\n';
                tableRoleToolbarHtml.append(table_del_btn_html);

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
            var table_look_btn_html = '<a href="javascript:;" class="btn btn-outline-accent m-btn m-btn--icon m-btn--icon-only" data-toggle="tooltip" data-placement="top" title=" 查看角色" lay-event="look">\n'
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
    var roleUserMainPageInitDataGrid = function () {
        layui.use('table', function() {
            // roleUserMainPageTable = layui.table;
            var layuiForm = layui.form;
            roleUserMainPageTable = $initDataGrid({
                elem: '#role-user_mainPage_grid',
                url: serverUrl + 'v1/table/staff/g',
                method: "get",
                where: {   //传递额外参数
                    userStatus : 0,
                },
                headers: BaseUtils.serverHeaders(),
                title: '人员列表',
                height: 'full-150',
                initSort: {
                    field: 'id', //排序字段，对应 cols 设定的各字段名
                    type: 'asc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
                },
                cols: [[
                    {checkbox: true},
                    {field:'id', title:'ID', unresize:true, hide:true },
                    {field:'userNumber', title:'工号'},
                    {field:'userFullName', title:'姓名'},
                    {field:'userNickName', title:'昵称'},
                    {field:'mobilePhone', title:'手机号'},
                    {field:'staffOrgName', title:'所属部门'},
                    {field:'userPositionText', title:'职位'},
                    {field:'userCategory', title:'类别', align: 'center',
                        templet : function (row) {
                            // 0：超级管理员 1：普通管理员 2：内部职工 3：普通用户
                            var value = row.userCategory;
                            var spanHtml = "";
                            if (value == 0)  {
                                spanHtml = "超级管理员";
                            } else if (value == 1)  {
                                spanHtml = "普通管理员";
                            }else if (value == 2)  {
                                spanHtml = "职工";
                            }else if (value == 3)  {
                                spanHtml = "普通用户";
                            }
                            return spanHtml;
                        }
                    },
                    {
                        fixed: 'right',
                        title: '操作',
                        unresize: true,
                        toolbar: '#role-user_mainPage_table_toolbar',
                        align: 'center',
                        width: 100
                    }
                ]],
                limit: 20,
                limits: [20, 30, 40, 50]
            }, function (res, curr, count) {
                var curFunctionButtonGroup = BaseUtils.getCurrentFunctionButtonGroup(roleUserMainPageModuleCode);
                var status_table_index = $.inArray("3", curFunctionButtonGroup);
                if (status_table_index != -1) {
                    $(".layui-unselect.layui-form-checkbox").show();
                } else {
                    $(".layui-unselect.layui-form-checkbox").hide();
                }
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
            });

            //监听行工具事件
            roleUserMainPageTable.on('tool(role-user_mainPage_grid)', function (obj) {
                if (obj.event === 'edit') {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    userId = obj.data.id;
                }
                if (obj.event === 'look') {
                    if (BaseUtils.checkLoginTimeoutStatus()) {
                        return;
                    }
                    userId = obj.data.id;
                }
            });

        });
    };

    /**
     * 刷新grid
     */
    var roleUserMainPageRefreshGrid = function () {
        var userSearchName = $("#role-user-mainPage-nodeName-search").val();
        roleUserMainPageTable.reload('role-user_mainPage_grid',{
            where: {   //传递额外参数
                'userFullName' : userSearchName
            },
            page: {
                 curr: 1 //重新从第 1 页开始
             }
        });
        userId = 0;
    };

    /**
     * 重置查询条件
     */
    var roleUserMainPageRefreshGridQueryCondition = function () {
        $("#role-user-page-grid-query-form")[0].reset();
        $("#query_userCategory").selectpicker('refresh');
    };


    /**
     * 初始化表单提交
     */
    var roleUserMainPageFormSubmitHandle = function() {
        $('#role-user_mainPage_dataSubmit_form_submit').click(function(e) {
            e.preventDefault();
            if (BaseUtils.checkLoginTimeoutStatus()) {
                return;
            }
            var resourceIds = [];
            // 获取所有选中的节点
            var nodes = roleUserPageLeffTree.getCheckedNodes(true);
            $.each(nodes, function (i, v) {
                resourceIds.push(v.id);
            });
            var formData = {
                userId: userId,
                resourceIds: resourceIds.join(",")
            };
            BaseUtils.pageMsgBlock();
            $postAjax({
                url:serverUrl + "v1/verify/role/resource/s",
                data:formData,
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                BaseUtils.htmPageUnblock();
                if (response.success) {

                } else if (response.status == 409) {

                }
            }, function (data) {
                BaseUtils.htmPageUnblock();
            });
            return false;
        });
    };

    /**
     *  同步数据
     */
    var roleUserMainPageSyncData = function() {
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        BaseUtils.pageMsgBlock();
        $postAjax({
            url: serverUrl + "v1/verify/role/user/sync",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                userId = 0;
                roleUserMainPageRefreshGrid();
            }
        },function (response) {
            BaseUtils.htmPageUnblock();
        });
    };


    //== Public Functions
    return {
        // public functions
        init: function() {
            roleUserMainPageInitFunctionButtonGroup();
            roleUserMainPageInitDataGrid();
          //  roleUserMainPageFormSubmitHandle();

            $('#role-user-page-grid-query-btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleUserMainPageRefreshGrid();
                return false;
            });

            $('#role-user-page-grid-query-rotate-btn').click(function(e) {
                e.preventDefault();
                roleUserMainPageRefreshGridQueryCondition();
                return false;
            });

            $('#role-user_mainPage_sync_btn').click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                roleUserMainPageSyncData();
                return false;
            });

            window.onresize = function(){
                roleUserMainPageTable.resize("role-user_mainPage_grid");
            }

        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageRoleUser.init();
});