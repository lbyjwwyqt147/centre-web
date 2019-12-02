/***
 * 轮播图片上传
 * @type {{init}}
 */
var SnippetMainPageCarouselUploading= function() {
    var serverUrl = BaseUtils.serverAddress;
    var cloudServerUrl = BaseUtils.cloudServerAddress;
    var uploadingMainPageSubmitForm = $("#carousel_uploading_mainPage_dataSubmit_form");
    var uploadingMainPageSubmitFormId = "#carousel_uploading_mainPage_dataSubmit_form";
    var photoUploadingMainPageWebuploader;
    var businessId = 0;
    /**
     * 初始化上传组件
     */
    var uploadingMainPageInitWebuploader = function () {
        $("#carousel_uploading_form_body").css("height", $(window).height() - 10);
        var curUrl = location.search; //获取url中"?"符后的字串
        if (curUrl.indexOf("?") != -1) {    //判断是否有参数
            var param = curUrl.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
            var params = param.split("&");   //用&进行分隔 （如果只有一个参数 直接用等号进分隔； 如果有多个参数 要用&号分隔 再用等号进行分隔）
            var businessIdParams = params[0].split("=");
            businessId = businessIdParams[1];

        }
        var curUser = BaseUtils.getCurrentUser();
        photoUploadingMainPageWebuploader = window.webuploaderUtils.init({
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
            removeUrl: serverUrl + 'v1/verify/carousel/picture/d',
            //初始化客户端上传文件，从后台获取文件的地址, 可选，当此参数为空时，默认已上传的文件为空
            initServerFileUrl:  serverUrl + 'v1/table/carousel/picture',
            businessId : businessId,
            formData: {
                'systemCode' : BaseUtils.systemCode,
                'businessCode' : 20,
                'uploaderId' : curUser.id,
                'uploaderName': curUser.name,
                'lesseeId' : BaseUtils.lessee,
                'lesseeName' : '青橙摄影工作室',
                'description' : '轮播图片'
            },
            headers : BaseUtils.cloudHeaders()
        });
    };



    /**
     * 初始化 select 组件
     */
    var initSelectpicker = function () {
        BootstrapTouchspin.initByteTouchSpin("#priority_form_uploading_seq");
        var  $variety = $("#variety");
        $variety.selectpicker('refresh');
        $("#maniyerizm").selectpicker('refresh');

        // 页面 select
        BaseUtils.dictDataSelect("image_page", function (data) {
            var $pageBusinessCode = $("#businessCode");
            Object.keys(data).forEach(function(key){
                if (data[key].id == "2") {
                    $pageBusinessCode.append("<option value=" + data[key].id + " selected>" + data[key].text + "</option>");
                } else {
                    $pageBusinessCode.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
                }
            });
            //必须加，刷新select
            $pageBusinessCode .selectpicker('refresh');

            $pageBusinessCode.on('changed.bs.select', function (clickedIndex,newValue,oldValue) {
                newValue = $pageBusinessCode.val();
                if (newValue == "1") {
                    $variety.selectpicker('val', '4');
                } else if (newValue == "2") {
                    $variety.selectpicker('val', '1');
                } else if (newValue == "3") {
                    $variety.selectpicker('val', '2');
                } else if (newValue == "4") {
                    $variety.selectpicker('val', '3');
                } else if (newValue == "5") {
                    $variety.selectpicker('val', '2');
                }
            });
        });

        var businessDataUrl = serverUrl + 'v1/table/activities/comboBox';
        var businessDataParams = {};
        var $businessSelect = $("#business-select");
        // 图片信息
        BaseUtils.dropDownDataSelect(businessDataUrl, businessDataParams, BaseUtils.serverHeaders(), function (data) {
            $businessSelect.html("");
            Object.keys(data).forEach(function(key){
                $businessSelect.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $businessSelect .selectpicker('refresh');
        });
        $variety.on('changed.bs.select', function (clickedIndex,newValue,oldValue) {
            newValue = $variety.val();
            if (newValue == "1") {
                businessDataUrl = serverUrl + 'v1/table/activities/comboBox'
            } else if (newValue  == "2") {
                businessDataUrl = serverUrl + 'v1/table/album/comboBox';
                businessDataParams.albumClassification = 1;
                businessDataParams.albumClassify = 1;
            } else if (newValue  == "3") {
                businessDataUrl = serverUrl + 'v1/table/album/comboBox';
                businessDataParams.albumClassification = 1;
                businessDataParams.albumClassify = 2;
            } else if (newValue  == "3") {
                businessDataUrl = serverUrl + 'v1/table/album/comboBox';
                businessDataParams.albumClassification = 2;
                businessDataParams.albumClassify = 2;
            }
            // 图片信息
            BaseUtils.dropDownDataSelect(businessDataUrl, businessDataParams,  BaseUtils.serverHeaders(), function (data) {
                $businessSelect.html("");
                Object.keys(data).forEach(function(key){
                    $businessSelect.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
                });
                //必须加，刷新select
                $businessSelect .selectpicker('refresh');
            });
        });




        // 位置 select
        BaseUtils.dictDataSelect("page_position", function (data) {
            var $pagePosition = $("#position");
            Object.keys(data).forEach(function(key){
                $pagePosition.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $pagePosition .selectpicker('refresh');
        });

    }

    /**
     * 初始化表单提交
     */
    var uploadingMainPageFormSubmitHandle = function() {
        BaseUtils.formInputTrim(uploadingMainPageSubmitFormId);
        uploadingMainPageSubmitForm.validate({
            rules: {
                businessCode: {
                    required: true,
                    maxlength: 10
                },
                position: {
                    required: true,
                    maxlength: 10
                },
                hrefLink: {
                    required: false,
                    maxlength: 255
                },
                priority: {
                    required: true,
                    range: [0,127]
                },
                description: {
                    required: false,
                    maxlength: 100
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
        var curPhotoFlies = photoUploadingMainPageWebuploader.getFiles();
        // 验证是否有图片
        var  hasImage = curPhotoFlies.length == 0 ? true : false
        if (hasImage) {
            $(".uploader_wrap .placeholder").css("border","1px dashed #ff0b5a");
            $("#image-has-danger").show();
            return;
        } else {
            BaseUtils.pageMsgBlock();
            $(".uploader_wrap .placeholder").css("border","1px dashed #e6e6e6");
            $("#image-has-danger").hide();
            photoUploadingMainPageWebuploader.upload();
            var curPhotoImageList = [];
            var firstVertex = 0;
            $.each(curPhotoFlies, function (index, item) {
               var itemSource = item.source;
                var fileSource = itemSource.source;
                var nowFileId = fileSource.fileId;
                if (nowFileId == undefined || typeof (nowFileId) == undefined) {

                } else {
                    if (itemSource.del != 1) {
                        if (fileSource.cover == 0) {
                            firstVertex = 1;
                        }
                        var curPhotoImage = {
                            "id" : nowFileId,
                            "fileCallAddress" : fileSource.srcUrl,
                            "fileName" : item.name,
                            "fileCategory" : fileSource.fileCategory,
                            "fileSize" : item.size,
                            "fileSuffix" :  fileSource.fileSuffix
                        };
                        curPhotoImageList.push(curPhotoImage);
                    }
                }
            });
            // 文件上传成功，给item添加成功class, 用样式标记上传成功。
            photoUploadingMainPageWebuploader.on('uploadSuccess', function (file, response) {
                if (response.success) {
                    var curImageWidth = file._info.width;
                    var curImageHeight = file._info.height;
                    var curImageObj = response.data[0];
                    var curFirstVertex = 0;
                    if (firstVertex === 0 && (curImageWidth != null || curImageWidth != undefined )) {
                        curFirstVertex = curImageWidth > curImageHeight ? 0 : 1;
                    }
                    var curPhotoImage = {
                        "id" : curImageObj.id,
                        "fileCallAddress" : curImageObj.fileCallAddress,
                        "fileName" : curImageObj.fileName,
                        "fileCategory" : curImageObj.fileCategory,
                        "fileSize" : parseInt(curImageObj.fileSize/1024),
                        "fileSuffix" : curImageObj.fileSuffix
                    };
                    if (curFirstVertex === 1 && firstVertex === 0) {
                        firstVertex = 1;
                        curPhotoImageList.splice(0, 0, curPhotoImage);
                    } else {
                        curPhotoImageList.push(curPhotoImage);
                    }
                }
            });
            //所有文件上传完毕
            photoUploadingMainPageWebuploader.on("uploadFinished", function () {
                //提交表单
                $("#photo-file-list").val(JSON.stringify(curPhotoImageList));
                // 保存数据
                $postAjax({
                    url:serverUrl + "v1/verify/carousel/s",
                    data:uploadingMainPageSubmitForm.serializeJSON(),
                    headers: BaseUtils.serverHeaders()
                }, function (response) {
                    BaseUtils.htmPageUnblock();
                    if (response.success) {
                         //清空队列
                         photoUploadingMainPageWebuploader.reset();
                        // toastr.success(BaseUtils.saveSuccessMsg);
                        // 关闭 dialog
                        closeOpenLayer();
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
            $('#carousel_uploading_mainPage_dataSubmit_form_close').click(function (e) {
                e.preventDefault();
                closeOpenLayer();
                return false;
            });
            $('#carousel_uploading_mainPage_dataSubmit_form_submit').click(function (e) {
                e.preventDefault();
                $("#album-status").val(2);
                uploadingMainPageFormSubmitHandle();
                return false;
            });
            $('#carousel_uploading_mainPage_dataSubmit_form_publish').click(function (e) {
                e.preventDefault();
                $("#album-status").val(0);
                uploadingMainPageFormSubmitHandle();
                return false;
            });
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageCarouselUploading.init();
});