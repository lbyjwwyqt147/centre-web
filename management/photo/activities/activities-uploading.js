/***
 * 图册上传
 * @type {{init}}
 */
var SnippetMainActivitiesPageUploading= function() {
    var serverUrl = BaseUtils.serverAddress;
    var cloudServerUrl = BaseUtils.cloudServerAddress;
    var uploadingMainPageSubmitForm = $("#activities_uploading_mainPage_dataSubmit_form");
    var uploadingMainPageSubmitFormId = "#activities_uploading_mainPage_dataSubmit_form";
    var activitiesUploadingMainPageWebuploader;
    var businessId = 0;
    var businessType = 0;
    var albumClassify = 1;
    var uploadInst;
    /**
     * 初始化上传组件
     */
    var uploadingMainPageInitWebuploader = function () {
        $("#activities_uploading_form_body").css("height", $(window).height() - 10);
        var curUrl = location.search; //获取url中"?"符后的字串
        if (curUrl.indexOf("?") != -1) {    //判断是否有参数
            var param = curUrl.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
            var params = param.split("&");   //用&进行分隔 （如果只有一个参数 直接用等号进分隔； 如果有多个参数 要用&号分隔 再用等号进行分隔）
            var businessIdParams = params[0].split("=");
            businessId = businessIdParams[1];
            var businessTypeParams = params[1].split("=");
            businessType = businessTypeParams[1];
            albumClassify = businessTypeParams[1];
        }
        var curUser = BaseUtils.getCurrentUser();
        activitiesUploadingMainPageWebuploader = window.webuploaderUtils.init({
            thumbWidth: 230, //缩略图宽度，可省略，默认为110
            thumbHeight: 230, //缩略图高度，可省略，默认为110
            wrapId: 'uploading-uploader', //必填
            selectFileId:'uploading-filePicker',
            continueSelectFileId:'#uploading-filePicker2',
            selectFileMultiple : true, // 多选
            fileNumLimit: 30, // 总图片数量
            fileSizeLimit: 30*1024*1024*25,  // 总文件大小
            fileSingleSizeLimit: 1024*1024*25, // 单个文件大小
            //处理客户端新文件上传时，需要调用后台处理的地址, 必填
            uploadUrl: cloudServerUrl + 'v1/verify/file/upload/batch',
            //处理客户端原有文件更新时的后台处理地址，必填
            updateUrl: 'http://127.0.0.1:18080/api/v1/verify/file/upload/batch',
            //当客户端原有文件删除时的后台处理地址，必填
            removeUrl: serverUrl + 'v1/verify/activities/picture/d',
            //初始化客户端上传文件，从后台获取文件的地址, 可选，当此参数为空时，默认已上传的文件为空
            initServerFileUrl:  serverUrl + 'v1/table/activities/picture',
            businessId : businessId,
            formData: {
                'systemCode' : BaseUtils.systemCode,
                'businessCode' : 50,
                'uploaderId' : curUser.id,
                'uploaderName': curUser.name,
                'lesseeId' : BaseUtils.lessee,
                'lesseeName' : '青橙摄影工作室',
                'description' : '最新活动宣传图片'
            },
            headers : BaseUtils.cloudHeaders()
        });
    };

    /**
     * 初始化 form 数据
     */
    var initFormData = function () {
        if (businessId != 0) {
            $getAjax({
                url:serverUrl + "v1/table/activities/" + businessId,
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                uploadingMainPageSubmitForm.setForm(response.data);
                initactivitiesUploadingSelected(response.data);
            });
        }
    };

    /**
     * select 控件回显值
     */
    var initactivitiesUploadingSelected = function (obj) {
        $("#activity-description").val(BaseUtils.toTextarea( obj.activityDescription));
        $('#discount').selectpicker('val', obj.discount);
        $("input[name='activityPrice']").val(obj.activityPrice);
        $("input[name='originalPrice']").val(obj.originalPrice);
        $("input[name='activityPriority']").val(obj.activityPriority);
        if (obj.surfacePlot != null) {
            $('#surface-plot-image').attr('src', obj.surfacePlot); //图片链接
            $('#surface-plot-image').attr("onload", "BaseUtils.imageAutoSize(this,150,75)");
            $('#surface-plot-image').show();
            $('#surface-plot-image-href').attr('href', obj.surfacePlot);
        }
    };

    /**
     * 初始化 select 组件
     */
    var initSelectpicker = function () {
        var $discount = $("#discount")
        $discount.selectpicker('refresh');
        $discount.on('changed.bs.select', function (clickedIndex,newValue,oldValue) {
            calculatePrice();
        });
        //初始化 优先级 控件
        BootstrapTouchspin.initByteTouchSpin("#activities_uploading_mainPage_dataSubmit_form_uploading_seq");
        BootstrapTouchspin.initDecimalsTouchSpin("input[name='originalPrice']");
        BootstrapTouchspin.initDecimalsTouchSpin("input[name='activityPrice']");
        $("input[name='activityPrice']").on('change', function () {
            calculatePrice();
        });
        $("input[name='originalPrice']").on('change', function () {
            calculatePrice();
        });
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
        layui.use('upload', function(){
            var $ = layui.jquery
                ,layuiUpload = layui.upload;
            var curUser = BaseUtils.getCurrentUser();
            //拖拽上传
            uploadInst =  layuiUpload.render({
                elem: '#surfacePlot',
                auto: true, //选择文件后自动上传
                drag: false,
                accept: 'images', //只允许上传图片
                acceptMime: 'image/*', //只筛选图片
                size: 20*1024*1024, //限制文件大小，单位 KB
                url: 'http://127.0.0.1:18080/api/v1/verify/file/upload/batch',
                data: {
                    'systemCode' : BaseUtils.systemCode,
                    'businessCode' : 51,
                    'uploaderId' : curUser.id,
                    'uploaderName': curUser.name,
                    'lesseeId' : BaseUtils.lessee,
                    'lesseeName' : '青橙摄影工作室',
                    'description' : '最新活动封面图片'
                },
                headers: BaseUtils.cloudHeaders(),
                before: function(obj){
                    //预读本地文件示例，不支持ie8
                    obj.preview(function(index, file, result){
                        $('#surface-plot-image').attr('src', result); //图片链接（base64）
                        $('#surface-plot-image').attr("onload", "BaseUtils.imageAutoSize(this,150,75)");
                        $('#surface-plot-image').show();
                        $('#surface-plot-image-href').attr('href', result);
                    });
                },
                error: function(index, upload){
                    //当上传失败时，你可以生成一个“重新上传”的按钮，点击该按钮时，执行 upload() 方法即可实现重新上传
                },
                done: function(res){
                    // 上传完毕回调
                    if (res.success) {
                        var imageObj = res.data[0];
                        $("#surface-plot").val(imageObj.fileCallAddress);
                        $("#surface-plot-id").val(imageObj.id);
                    }
                }
            });
        });
    };

    /**
     * 计算价格
     */
    var calculatePrice = function (newValue) {
        newValue = $("#discount").val();
        var originalPriceVal = $("#originalPrice").val();
        var activityPriceVal = $("#activityPrice").val();
        if (originalPriceVal != ""  ) {
            $("#activityPrice").val(originalPriceVal*(newValue/10));
        }
        if (activityPriceVal != '' && originalPriceVal == "") {
            $("#originalPrice").val(activityPriceVal/(newValue/10));
        }
    };

    /**
     * 初始化表单提交
     */
    var uploadingMainPageFormSubmitHandle = function() {
        $("#activity-description").val(BaseUtils.textareaTo( $("#activity-description").val()));
        BaseUtils.formInputTrim(uploadingMainPageSubmitFormId);
        if ($("#surface-plot").val() == "") {
            toastr.error("请上传封面图.");
            BaseUtils.scrollTo("#surfacePlot", 1000);
            return;
        }
        uploadingMainPageSubmitForm.validate({
            rules: {
                activityTheme: {
                    required: true,
                    maxlength: 50
                },
                startDateTime: {
                    required: true
                },
                endDateTime: {
                    required: true
                },
                originalPrice: {
                    required:true
                },
                discount: {
                    required: true
                },
                activityPrice: {
                    required: true
                },
                activityPriority: {
                    required: true,
                    range: [0,127]
                },
                activityDescription: {
                    maxlength: 255
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
        if (!uploadingMainPageSubmitForm.valid()) {
            return;
        }
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }

        var curactivitiesFlies = activitiesUploadingMainPageWebuploader.getFiles();
        // 验证是否有图片
        var  hasImage = curactivitiesFlies.length == 0 ? true : false
        if (hasImage) {
            $(".uploader_wrap .placeholder").css("border","1px dashed #ff0b5a");
            $("#image-has-danger").show();
            return;
        } else {
            BaseUtils.pageMsgBlock();
            $(".uploader_wrap .placeholder").css("border","1px dashed #e6e6e6");
            $("#image-has-danger").hide();
            activitiesUploadingMainPageWebuploader.upload();
            var curactivitiesImageList = [];
            var firstVertex = 0;
            $.each(curactivitiesFlies, function (index, item) {
               var itemSource = item.source;
                var fileSource = itemSource.source;
                var nowFileId = fileSource.fileId;
                if (nowFileId == undefined || typeof (nowFileId) == undefined) {

                } else {
                    if (itemSource.del != 1) {
                        if (fileSource.cover == 0) {
                            firstVertex = 1;
                        }
                        var curactivitiesImage = {
                            "id" : nowFileId,
                            "fileCallAddress" : fileSource.srcUrl,
                            "fileName" : item.name,
                            "fileCategory" : fileSource.fileCategory,
                            "fileSize" : item.size,
                            "fileSuffix" :  fileSource.fileSuffix
                        };
                        curactivitiesImageList.push(curactivitiesImage);
                    }
                }
            });
            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            activitiesUploadingMainPageWebuploader.on('uploadSuccess', function (file, response) {
                if (response.success) {
                    var curImageWidth = file._info.width;
                    var curImageHeight = file._info.height;
                    var curImageObj = response.data[0];
                    var curFirstVertex = 0;
                    if (firstVertex === 0 && (curImageWidth != null || curImageWidth != undefined )) {
                        curFirstVertex = curImageWidth > curImageHeight ? 0 : 1;
                    }
                    var curactivitiesImage = {
                        "id" : curImageObj.id,
                        "fileCallAddress" : curImageObj.fileCallAddress,
                        "fileName" : curImageObj.fileName,
                        "fileCategory" : curImageObj.fileCategory,
                        "fileSize" : parseInt(curImageObj.fileSize/1024),
                        "fileSuffix" : curImageObj.fileSuffix
                    };
                    if (curFirstVertex === 1 && firstVertex === 0) {
                        firstVertex = 1;
                        curactivitiesImageList.splice(0, 0, curactivitiesImage);
                    } else {
                        curactivitiesImageList.push(curactivitiesImage);
                    }
                }
            });
            //所有文件上传完毕
            activitiesUploadingMainPageWebuploader.on("uploadFinished", function () {
                //提交表单
                $("#activities-file-list").val(JSON.stringify(curactivitiesImageList));
                // 保存数据
                $postAjax({
                    url:serverUrl + "v1/verify/activities/s",
                    data:uploadingMainPageSubmitForm.serializeJSON(),
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    BaseUtils.htmPageUnblock();
                    if (response.success) {
                         //清空队列
                         activitiesUploadingMainPageWebuploader.reset();
                        // toastr.success(BaseUtils.saveSuccessMsg);
                        // 关闭 dialog
                        closeOpenLayer();
                        $("#id").val(response.data);
                    } else if (response.status == 409) {

                    }
                }, function (data) {
                    BaseUtils.htmPageUnblock();
                });

            });
        }
    };




    /**
     * 关闭弹出框
     */
    var closeOpenLayer = function () {
        //获取窗口索引
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    };

    //== Public Functions
    return {
        // public functions
        init: function() {
            initSelectpicker();
            uploadingMainPageInitWebuploader();
            // 解决 点击选择图片按钮 无反应 问题
            $('#uploading-filePicker div:eq(1)').attr('style', 'position: absolute; top: 20px; left: 612.5px; width: 168px; height: 44px; overflow: hidden; bottom: auto; right: auto;');
            initFormData();
            $('#activities_uploading_mainPage_dataSubmit_form_close').click(function (e) {
                e.preventDefault();
                closeOpenLayer();
                return false;
            });
            $('#activities_uploading_mainPage_dataSubmit_form_submit').click(function (e) {
                e.preventDefault();
                $("#activity-status").val(1);
                uploadingMainPageFormSubmitHandle();
                return false;
            });
            $('#activities_uploading_mainPage_dataSubmit_form_publish').click(function (e) {
                e.preventDefault();
                $("#activitystatus").val(0);
                uploadingMainPageFormSubmitHandle();
                return false;
            });
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainActivitiesPageUploading.init();
});