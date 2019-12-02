/***
 * 图册查看
 * @type {{init}}
 */
var SnippetMainPageUploadingLook= function() {
    var serverUrl = BaseUtils.serverAddress;
    var uploadingMainPageSubmitForm = $("#photo_uploading_mainPage_look_form");
    var uploadingMainPageSubmitFormId = "#photo_uploading_mainPage_look_form";
    var businessId = 0;
    var businessType = 0;
    var albumClassify = 1;


    /**
     * 初始化 form 数据
     */
    var initFormData = function () {
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
        };
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
        $("#spotForPhotography").val(obj.spotForPhotographyText);
        $("#albumDresser-name").val(obj.albumDresserText);
        $("#albumAnaphasisAuthor-name").val(obj.albumAnaphasisAuthorText);
        $("#albumPhotographyAuthor-name").val(obj.albumPhotographyAuthorText);
        $("#albumStyle-name").val(obj.albumStyleText);
        $("#albumClassification-name").val(obj.albumClassificationText);
        if (obj.surfacePlot != null) {
            $('#surface-plot-image').attr('src', obj.surfacePlot); //图片链接
            $('#surface-plot-image').attr("onload", "BaseUtils.imageAutoSize(this,150,75)");
            $('#surface-plot-image').show();
            $('#surface-plot-image-href').attr('href', obj.surfacePlot);
        }
    };

    /**
     * 初始化图片信息
     * @param dataId
     */
    var initLookImages = function () {
        var imageList = $("#look-images-list");
        $getAjax({
            url: serverUrl + 'v1/table/album/picture',
            data:{id: businessId},
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            var datas = response.data;
            if (datas != null ) {
                $.each(datas, function(index,item){
                    var  imageHtml = '<div class="col-xl-3" style="padding-top: 10px;">\n';
                    imageHtml += '<a href="'+ item.pictureLocation +'" data-fancybox="images" >\n';
                    imageHtml += '<img onload="BaseUtils.autoResizeImage(350,350,this)" src="'+item.pictureLocation+'" width="0" height="0" />\n';
                    imageHtml += '</a>\n';
                    imageHtml += '</div>\n';
                    imageList.append(imageHtml);
                });
                $('[data-fancybox="images"]').fancybox();
            }
        });
    }

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
            initFormData();
            initLookImages();
            $('#photo_uploading_mainPage_look_form_close').click(function (e) {
                e.preventDefault();
                closeOpenLayer();
                return false;
            });
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageUploadingLook.init();
});