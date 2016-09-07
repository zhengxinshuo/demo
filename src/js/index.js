/**
 * Created by Administrator on 2016/8/12.
 */
$(function () {
    var
      CODE_ERR_MOBI = 1,
      CODE_ERR_CODE = 3,

      MSG_ERR_NET = '网络连接出现问题，请重试',
      MSG_ERR_EMPTY_MOBI = '手机号码不能为空喔',
      MSG_ERR_NUMBER = '亲爱的号码输错啦！',
      MSG_ERR_EMPTY_CODE = '验证码不能为空喔';

    var reg1 = /^\d{11}$/;
    var btn1 = $(".button-getValid");
    var btn2 = $(".button-run");
    var inp1 = $(".eventInput");
    var inp2 = $(".validInput");
    var ul = $(".valid-list");

    var
      trim = $.trim,
      extend = $.extend,
      ajax = function(opts){
          $.ajax(extend({
              dataType:'json',
              timeout:60*1000,
              error:function(){
                 showMsg(MSG_ERR_NET);
             }
          }, opts));
      },

      //验证码倒计时
      oTimer;

    $(".button-cross").click(function () {
        $(".eventInput").val("");
        ul.find("li").hide();
    });
    inp1.focus(function () {
        liHide()
    });
    inp2.focus(function () {
        liHide()
    });
    btn1.click(function () {
        var mobi = trim(inp1.val());
        if(!mobi){
            showMsg(MSG_ERR_EMPTY_MOBI, CODE_ERR_MOBI);
        }
        else if (!reg1.test(mobi)) {
            showMsg(MSG_ERR_NUMBER, CODE_ERR_MOBI);
        } else {
            $(this).attr('disabled', 'disabled').html('发送中');
            liHide();
            ajax({
                url:'/h5/monkeyhorse/send_sms',
                type:'POST',
                data:{
                  mobi:mobi
                },
                success:function(res){
                  var code = res.code;
                  if (code == 0) {
                      var t = 60;
                      if(oTimer){
                          clearInterval(oTimer);
                      }
                      oTimer = setInterval(function () {
                          btn1.html('重新获取' + t);
                          t--;
                          if (!t) {
                              clearInterval(oTimer);
                              btn1.html('获取验证码').removeAttr('disabled');
                          }
                      }, 1000)
                  }
                  else{
                      onErr(res.msg, code);
                  }
              },
                error:function(){
                    onErr(MSG_ERR_NET, CODE_ERR_CODE);
                },
                complete:function(){
                    onComplete();
                }
            });
        }

        function onErr(msg, code){
            showMsg(msg || MSG_ERR_NET, code);
        }

        function onComplete(){
            btn1.removeAttr('disabled');
        }
    });
    btn2.click(function () {
        //如果号码更改得重新获取验证码
        var
          $this = $(this),
          mobi = trim(inp1.val()),
          code = trim(inp2.val());

        if(!$this.attr('disabled')){
            if(!mobi){
                showMsg(MSG_ERR_EMPTY_MOBI, CODE_ERR_MOBI);
            }
            else if (!reg1.test(mobi)) {
                showMsg(MSG_ERR_NUMBER, CODE_ERR_MOBI);
            }
            else if(!code){
                showMsg(MSG_ERR_EMPTY_CODE, CODE_ERR_CODE);
            }
            else {
                liHide();

                lockBtn();
                ajax({
                    url:'/h5/monkeyhorse/check_mobi',
                    type:'POST',
                    data:{
                        mobi:mobi,
                        code:code
                    },
                    success:function(res){
                        var code = res.code;
                        if(code == 0){
                            location.href = "bill"
                        }
                        else{
                            onErr(res.msg, code);
                        }
                    },
                    error:function(){
                        onErr(MSG_ERR_NET, CODE_ERR_CODE);
                    },
                    complete:function(){
                        onComplete();
                    }
                });
            }
        }

        function onErr(msg, code){
            showMsg(msg || MSG_ERR_NET, code);
        }

        function onComplete(){
            unlockBtn();
        }

        function lockBtn(){
            $this.attr('disabled', 'disabled').text('提交中');
        }

        function unlockBtn(){
            $this.removeAttr('disabled').text('开始');
        }
    });

//初始化页面;
    initHeight();
    function initHeight() {
        var bodyH = window.innerHeight + "px";
        $(".wrap-valid").height(bodyH);
    }

//元素隐藏
    function liHide() {
        ul.find("li").hide();
    }

    function liShow(code){
        return ul.find('li[data-st="' + (code || 1) +'"]').show();
    }

    function showMsg(msg, code){
        liShow(code)
          .text(msg);
    }


//ajax部分
    /*$.getJSON(
     url,
     {
     phoneNumber:inp1.val()
     },
     //后台返回状态码
     function(res){
     if(res.result==1){
     alert('验证码发送成功，请注意查收！');
     var t = 60;
     var oTimer = setInterval(function(){
     oBtn1.html('重新获取'+t);
     t--;
     if(!t){
     clearInterval(oTimer);
     oBtn1.html('获取验证码').removeAttr('disabled');
     }
     }, 1000)
     }else{
     $('#mask').attr('data-st',res.result==-1?'-2':'504');
     oBtn1.removeAttr('disabled');
     }
     }
     );*/
})
;