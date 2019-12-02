/***
 * 图册上传
 * @type {{init}}
 */
var SnippetMainPageUploading= function() {
    var serverUrl = BaseUtils.serverAddress;
    var cloudServerUrl = BaseUtils.cloudServerAddress;
    var uploadingMainPageSubmitForm = $("#photo_uploading_mainPage_dataSubmit_form");
    var uploadingMainPageSubmitFormId = "#photo_uploading_mainPage_dataSubmit_form";
    var photoUploadingMainPageWebuploader;
    var businessId = 0;
    var businessType = 0;
    var albumClassify = 1;
    /**
     * 初始化上传组件
     */
    var uploadingMainPageInitWebuploader = function () {
        $("#photo_uploading_form_body").css("height", $(window).height() - 10);
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
            removeUrl: serverUrl + 'v1/verify/album/picture/d',
            //初始化客户端上传文件，从后台获取文件的地址, 可选，当此参数为空时，默认已上传的文件为空
            initServerFileUrl:  serverUrl + 'v1/table/album/picture',
            businessId : businessId,
            formData: {
                'systemCode' : BaseUtils.systemCode,
                'businessCode' : 10,
                'uploaderId' : curUser.id,
                'uploaderName': curUser.name,
                'lesseeId' : BaseUtils.lessee,
                'lesseeName' : '青橙摄影工作室',
                'description' : '相册展示图片'
            },
            headers : BaseUtils.cloudHeaders()
        });

        // 封面上传组件
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
                    'businessCode' : 11,
                    'uploaderId' : curUser.id,
                    'uploaderName': curUser.name,
                    'lesseeId' : BaseUtils.lessee,
                    'lesseeName' : '青橙摄影工作室',
                    'description' : '相冊封面图片'
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
     * 初始化 form 数据
     */
    var initFormData = function () {
        if (businessId != 0) {
            $getAjax({
                url:serverUrl + "v1/table/album/" + businessId,
                headers: BaseUtils.serverHeaders()
            }, function (response) {
                uploadingMainPageSubmitForm.setForm(response.data);
                initPhotoUploadingSelected(response.data);
            });
        }
    }

    /**
     * select 控件回显值
     */
    var initPhotoUploadingSelected = function (obj) {
        $('#albumClassification').selectpicker('val', obj.albumClassification);
        $('#albumStyle').selectpicker('val', obj.albumStyle);
        $('#spotForPhotography').selectpicker('val', obj.spotForPhotography);
        $("#albumPhotographyAuthor").val(obj.albumPhotographyAuthor.split(",")).trigger("change");
        $("#albumAnaphasisAuthor").val(obj.albumAnaphasisAuthor.split(",")).trigger("change");
        $("#albumDresser").val(obj.albumDresser.split(",")).trigger("change");
        if (obj.display != null) {
            $("input:radio[name=\"display\"][value='"+obj.display+"']").click();
        }
        $("#photo_uploading_mainPage_dataSubmit_form_uploading_seq").val(obj.albumPriority);
        // $("#albumDescription").val(BaseUtils.toTextarea( obj.albumDescription));
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
        var $albumClassification = $("#albumClassification");
        $albumClassification .selectpicker('refresh');
        var $display = $("#display");
        $display .selectpicker('refresh');
        $("#albumClassify").val(albumClassify);
        $albumClassification.on('changed.bs.select', function (clickedIndex,newValue,oldValue) {
            newValue = $albumClassification.val();
            if (newValue == "1") {
              $("#home-show-option").attr("disabled", 'disabled');
            } else {
                $("#home-show-option").removeAttr("disabled");
            }
        });
        var $albumDresser = $("#albumDresser");
        $albumDresser.select2({
            placeholder: "化妆师",
            allowClear: true
        });
        var $albumAnaphasisAuthor = $("#albumAnaphasisAuthor");
        $albumAnaphasisAuthor.select2({
            placeholder: "后期设计",
            allowClear: true
        });
        var $albumPhotographyAuthor = $("#albumPhotographyAuthor");
        $albumPhotographyAuthor.select2({
            placeholder: "摄影师",
            allowClear: true
        });
        //初始化 优先级 控件
        BootstrapTouchspin.initByteTouchSpin("#photo_uploading_mainPage_dataSubmit_form_uploading_seq");
        $('.m_selectpicker').selectpicker({
            noneSelectedText : '请选择' //默认显示内容
        });
        var laydate;
        layui.use('laydate', function() {
            laydate = layui.laydate;
            //拍摄日期控件
            laydate.render({
                elem: '#shootingsDate'
            });
        });
        // 拍摄地点 select
        BaseUtils.dictDataSelect("image_site", function (data) {
            var $spotForPhotography = $("#spotForPhotography");
            $spotForPhotography.append("<option value=''>--请选择--</option>");
            Object.keys(data).forEach(function(key){
                $spotForPhotography.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            //必须加，刷新select
            $spotForPhotography .selectpicker('refresh');
        });
        // 化妆师 multi select
        BaseUtils.staffDataSelect({"staffPosition" : 3 }, function (data) {
            Object.keys(data).forEach(function(key){
                $albumDresser.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });

        });
        // 后期 multi select
        BaseUtils.staffDataSelect({"staffPosition" :  2}, function (data) {
            Object.keys(data).forEach(function(key){
                $albumAnaphasisAuthor.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
        });
        // 摄影师 multi select
        BaseUtils.staffDataSelect({"staffPosition" : 1 }, function (data) {
            Object.keys(data).forEach(function(key){
                $albumPhotographyAuthor.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
        });
        // 风格 multi select
        BaseUtils.dictDataSelect("image_style", function (data) {
            var $albumStyle = $("#albumStyle");
            Object.keys(data).forEach(function(key){
                $albumStyle.append("<option value=" + data[key].id + ">" + data[key].text + "</option>");
            });
            $albumStyle .selectpicker('refresh');
        });

    }

    /**
     * 初始化表单提交
     */
    var uploadingMainPageFormSubmitHandle = function() {
        BaseUtils.formInputTrim(uploadingMainPageSubmitFormId);
        if ($("#surface-plot").val() == "") {
            toastr.error("请上传封面图.");
            BaseUtils.scrollTo("#surfacePlot", 1000);
            return;
        }
        uploadingMainPageSubmitForm.validate({
            rules: {
                albumName: {
                    required: true,
                    maxlength: 32
                },
                albumClassification: {
                    required: true
                },
                albumStyle: {
                    required: true
                },
                albumLabel: {
                    maxlength: 32
                },
                albumPriority: {
                    required: true,
                    range: [0,127]
                },
                albumMusicAddress: {
                    required: false,
                    url:true,
                    maxlength: 255
                },
                albumPhotographyAuthor: {
                    required: false,
                    maxlength: 40
                },
                albumAnaphasisAuthor: {
                    required: false,
                    maxlength: 40
                },
                albumDresser: {
                    required: false,
                    maxlength: 40
                },
                spotForPhotography: {
                    required: false,
                    maxlength: 10
                },

                albumDescription: {
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
                $("#album_title").val($("#album-name").val());
                var albumPhotographyAuthorOptions = $("#albumPhotographyAuthor").select2("val");
                $("#album-photography-author").val(albumPhotographyAuthorOptions.join(','));
                var albumDresserOptions = $("#albumDresser").select2("val");
                $("#album-dresser").val(albumDresserOptions.join(','));
                var albumAnaphasisAuthorOptions = $("#albumAnaphasisAuthor").select2("val");
                $("#album-anaphasi-author").val(albumAnaphasisAuthorOptions.join(','));
                // 保存数据
                $postAjax({
                    url:serverUrl + "v1/verify/album/s",
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
            $('#photo_uploading_mainPage_dataSubmit_form_close').click(function (e) {
                e.preventDefault();
                closeOpenLayer();
                return false;
            });
            $('#photo_uploading_mainPage_dataSubmit_form_submit').click(function (e) {
                e.preventDefault();
                $("#album-status").val(2);
                uploadingMainPageFormSubmitHandle();
                return false;
            });
            $('#photo_uploading_mainPage_dataSubmit_form_publish').click(function (e) {
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
    SnippetMainPageUploading.init();
});