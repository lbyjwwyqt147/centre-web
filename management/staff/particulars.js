/***
 * 员工个人档案详情
 * @type {{init}}
 */
var SnippetMainPageStaffParticulars = function() {
    var serverUrl = BaseUtils.serverAddress;

    /**
     * 初始化数据
     */
    var initStaffParticularsData = function() {
        var businessId = 0;
        var curUrl = location.search; //获取url中"?"符后的字串
        if (curUrl.indexOf("?") != -1) {    //判断是否有参数
            var param = curUrl.substr(1); //从第一个字符开始 因为第0个是?号 获取所有除问号的所有符串
            var businessIdParams = param.split("=");
            businessId = businessIdParams[1];
        }
        $getAjax({
            url:serverUrl + "v1/table/staff/" + businessId,
            headers: BaseUtils.serverHeaders()
        }, function (response) {
            if (response.success) {
                var obj = response.data;
                $("#staff-name").html(obj.staffName);
                $("#staff-position-c").html(obj.staffPositionText)
                $("#staff-la-mobile-phone").attr("title", obj.mobilePhone);
                $("#staff-la-qq").attr("title", obj.staffQq);
                $("#staff-la-weixin").attr("title", obj.staffWechat);
                $("#staff-la-weibo").attr("title", obj.staffWeiBo);
                $("#staff-la-envelope").attr("title", obj.staffEmail);
                var staffSkillContent = "";
                var skillArray = obj.skillText.split(",");
                $.each(skillArray, function(index,element){
                    staffSkillContent += '<span class="m-badge m-badge--success m-badge--wide">'+element+'</span>\n';
                });
                $("#staff-skill-content").html(staffSkillContent);
                $("#staff-number").html(obj.staffNumber);
                $("#staff-name-b").html(obj.staffName);
                $("#staff-nickName").html(obj.staffNickName);
                $("#mobile-phone-b").html(obj.mobilePhone);
                $("#staff-email-b").html(obj.staffEmail);
                $("#staff-qq-b").html(obj.staffQq);
                $("#staff-wechat-b").val(obj.staffWechat);
                $("#staff-staffWeiBo-b").val(obj.staffWeiBo);
                $("#entry-date").html(obj.entryDate);
                $("#staff-orgName").html(obj.staffOrgName);
                var probationStatus = "已转正";
                if (obj.probationStatus == 1) {
                    probationStatus = "试用期";
                }
                $("#probation-status").html(probationStatus);
                $("#staff-position-b").html(obj.staffPositionText);
                $("#staff-identiy-card").html(obj.staffIdentiyCard);
                $("#staff-birthday").html(obj.birthday);
                $("#staff-age").html(obj.staffAge);
                var tempStaffSex = "男";
                if (obj.probationStatus == 1) {
                    tempStaffSex = "女";
                }
                $("#staff-sex").html(tempStaffSex);
                $("#staff-district").html(obj.addressText);
                $("#staff-equipment").html(obj.staffEquipment);
                $("#staff-intro").html(obj.staffIntro);
                $("#self-introduction").html(obj.staffIntro);
                $("#staff-working-years").html(obj.workingYears);
            }
        }, function (data) {

        });
    };






    //== Public Functions
    return {
        // public functions
        init: function() {
            // Tooltip
            $('[data-toggle="m-tooltip"]').tooltip();
            initStaffParticularsData();
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetMainPageStaffParticulars.init();
});