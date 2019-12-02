/***
 * 公司设置
 * @type {{init}}
 */
var SnippetMainPageCompany = function() {
    var serverUrl = BaseUtils.serverAddress;
    var compayMainPageSubmitForm = $("#company-form");
    var companySubmitBtn =  $('#company-submit-btn');
    var companyEditBtn =  $('#company-edit-btn');
    var companyRepealBtn = $("#company-repeal-btn");

    /**
     * 初始化 form 数据
     */
    var initCompanyFormData = function () {
        $getAjax({
            url:serverUrl + "v1/table/cmpany/details",
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            if (response.data != null) {
                var dataObj = response.data[0];
                compayMainPageSubmitForm.setForm(dataObj);
                $("#company-profile").val(BaseUtils.toTextarea( dataObj.companyProfile));
                $('#weixin-image').attr('src', dataObj.weixinImage);
                $('#weixin-image').show();
                $('#weixin-image-href').attr('href',  dataObj.weixinImage);
                $('#logo-image').attr('src',  dataObj.companyLogo);
                $('#logo-image').show();
                $('#logo-image-href').attr('href', dataObj.companyLogo);
                $('#qq-image').attr('src', dataObj.qqImage);
                $('#qq-image').show();
                $('#qq-image-href').attr('href',  dataObj.qqImage);
            }
        });
    };

    /**
     * 初始化上传按钮
     */
    var initLogoUpload = function () {
        BaseUtils.readonlyForm("#company-form");
        layui.use('upload', function(){
            var $ = layui.jquery
                ,layuiUpload = layui.upload;
            var curUser = BaseUtils.getCurrentUser();
            // logo上传
            logoUploadInst =  layuiUpload.render({
                elem: '#logo-image-btn',
                auto: true, //选择文件后自动上传
                drag: false,
                accept: 'images', //只允许上传图片
                acceptMime: 'image/*', //只筛选图片
                size: 20*1024*1024, //限制文件大小，单位 KB
                url: 'http://127.0.0.1:18080/api/v1/verify/file/upload/batch',
                data: {
                    'systemCode' : BaseUtils.systemCode,
                    'businessCode' : 61,
                    'uploaderId' : curUser.id,
                    'uploaderName': curUser.name,
                    'lesseeId' : BaseUtils.lessee,
                    'lesseeName' : '青橙摄影工作室',
                    'description' : '公司logo图片'
                },
                headers: BaseUtils.cloudHeaders(),
                before: function(obj){
                    //预读本地文件示例，不支持ie8
                    obj.preview(function(index, file, result){
                        $('#logo-image').attr('src', result); //图片链接（base64）
                        $('#logo-image').show();
                        $('#logo-image-href').attr('href', result);
                    });
                },
                error: function(index, upload){
                    //当上传失败时，你可以生成一个“重新上传”的按钮，点击该按钮时，执行 upload() 方法即可实现重新上传
                },
                done: function(res){
                    // 上传完毕回调
                    if (res.success) {
                        var imageObj = res.data[0];
                        $("#companyLogo").val(imageObj.fileCallAddress);
                    }
                }
            });

            // qq 二维码 上传
            qqImageUploadInst =  layuiUpload.render({
                elem: '#qq-image-btn',
                auto: true, //选择文件后自动上传
                drag: false,
                accept: 'images', //只允许上传图片
                acceptMime: 'image/*', //只筛选图片
                size: 20*1024*1024, //限制文件大小，单位 KB
                url: 'http://127.0.0.1:18080/api/v1/verify/file/upload/batch',
                data: {
                    'systemCode' : BaseUtils.systemCode,
                    'businessCode' : 62,
                    'uploaderId' : curUser.id,
                    'uploaderName': curUser.name,
                    'lesseeId' : BaseUtils.lessee,
                    'lesseeName' : '青橙摄影工作室',
                    'description' : 'QQ二维码图片'
                },
                headers: BaseUtils.cloudHeaders(),
                before: function(obj){
                    //预读本地文件示例，不支持ie8
                    obj.preview(function(index, file, result){
                        $('#qq-image').attr('src', result); //图片链接（base64）
                        $('#qq-image').show();
                        $('#qq-image-href').attr('href', result);
                    });
                },
                error: function(index, upload){
                    //当上传失败时，你可以生成一个“重新上传”的按钮，点击该按钮时，执行 upload() 方法即可实现重新上传
                },
                done: function(res){
                    // 上传完毕回调
                    if (res.success) {
                        var imageObj = res.data[0];
                        $("#qqImage").val(imageObj.fileCallAddress);
                    }
                }
            });


            // 微信二维码上传
            weixinIimageUploadInst =  layuiUpload.render({
                elem: '#weixin-image-btn',
                auto: true, //选择文件后自动上传
                drag: false,
                accept: 'images', //只允许上传图片
                acceptMime: 'image/*', //只筛选图片
                size: 20*1024*1024, //限制文件大小，单位 KB
                url: 'http://127.0.0.1:18080/api/v1/verify/file/upload/batch',
                data: {
                    'systemCode' : BaseUtils.systemCode,
                    'businessCode' : 61,
                    'uploaderId' : curUser.id,
                    'uploaderName': curUser.name,
                    'lesseeId' : BaseUtils.lessee,
                    'lesseeName' : '青橙摄影工作室',
                    'description' : '微信二维码图片'
                },
                headers: BaseUtils.cloudHeaders(),
                before: function(obj){
                    //预读本地文件示例，不支持ie8
                    obj.preview(function(index, file, result){
                        $('#weixin-image').attr('src', result); //图片链接（base64）
                        $('#weixin-image').show();
                        $('#weixin-image-href').attr('href', result);
                    });
                },
                error: function(index, upload){
                    //当上传失败时，你可以生成一个“重新上传”的按钮，点击该按钮时，执行 upload() 方法即可实现重新上传
                },
                done: function(res){
                    // 上传完毕回调
                    if (res.success) {
                        var imageObj = res.data[0];
                        $("#weixinImage").val(imageObj.fileCallAddress);
                    }
                }
            });
        });
    };

    /**
     * 初始化表单提交
     */
    var comparyMainPageFormSubmitHandle = function() {
        $("#company-profile").val(BaseUtils.textareaTo( $("#company-profile").val()));
        BaseUtils.formInputTrim("#company-form");
        compayMainPageSubmitForm.validate({
            rules: {
                companyName: {
                    required: true,
                    maxlength: 50
                },
                companyContact: {
                    required: true,
                    maxlength: 32
                },
                companyPhone: {
                    required: true,
                    isMobile: true
                },
                businessAddress: {
                    required:true,
                    maxlength: 100
                },
                businessHours: {
                    required: true,
                    maxlength: 50
                },
                filing: {
                    required: true,
                    maxlength: 50
                },
                companyProfile: {
                    maxlength: 500
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
        if (!compayMainPageSubmitForm.valid()) {
            return;
        }
        if (BaseUtils.checkLoginTimeoutStatus()) {
            return;
        }
        // 保存数据
        $postAjax({
            url:serverUrl + "v1/verify/cmpany/s",
            data:compayMainPageSubmitForm.serializeJSON(),
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            BaseUtils.htmPageUnblock();
            if (response.success) {
                toastr.success(BaseUtils.saveSuccessMsg);
                $("#company-id").val(response.data);
                BaseUtils.readonlyForm("#company-form");
                companySubmitBtn.hide();
                companyRepealBtn.hide();
                companyEditBtn.show();
            } else if (response.status == 409) {

            }
        }, function (data) {
            BaseUtils.htmPageUnblock();
        });
    };



    //== Public Functions
    return {
        // public functions
        init: function() {
            initLogoUpload();
            initCompanyFormData();
            companySubmitBtn.click(function(e) {
                e.preventDefault();
                if (BaseUtils.checkLoginTimeoutStatus()) {
                    return;
                }
                comparyMainPageFormSubmitHandle();
                return false;
            });

            companyEditBtn.click(function(e) {
                e.preventDefault();
                $("#company-form input").each(function () {
                    $(this).removeAttr("readonly");
                    $(this).removeClass("m-input--solid");
                });
                $("#company-form textarea").each(function () {
                    $(this).removeAttr("readonly");
                    $(this).removeClass("m-input--solid");
                });
                companyEditBtn.hide();
                companySubmitBtn.show();
                companyRepealBtn.show();
                return false;
            });

            companyRepealBtn.click(function(e) {
                e.preventDefault();
                BaseUtils.readonlyForm("#company-form");
                companySubmitBtn.hide();
                companyRepealBtn.hide();
                companyEditBtn.show();
                return false;
            });


            window.onresize = function(){

            }
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageCompany.init();
});