/**
 * Created by Administrator on 2016/8/13.
 */
$(function(){
    //init var
    var h=window.innerHeight+"px";
    var bodyH=$(document).height();
    var currentIndex=0;//默认第一屏
    var $swiper=$('.swiper-slide');
    var $wrapper=$('.swiper-wrapper');
    var len=$swiper.length;
    //分页
    $('.swiper-wrapper').fullpage({
        drag: true,
        page: '.swiper-slide',
        duration: 500,
        loop:true,
        afterChange: function (e) {
            currentIndex= e.cur||0;
            $swiper.removeClass('swiper-slide-active')
                .eq(currentIndex).addClass('swiper-slide-active');
        }
    });

    //页面加载渲染
    $.ajax({
        url: "../src/js/package.json",
        //url: "/h5/monkeyhorse/get_bill",
        dataType:'json',
        success:function(d){
            /*var code = d.code,
              data = d.data,
              msg = d.msg;*/
            var data= d,code= d.code,msg= d.msg;
            //if(code == 0){
            if(!code){
                page2Render(data.page2);
                page3Render(data.page3);
                page6Render(data.page6);
                page7Render(data.page7);
                page5Render(data.page5);
                page4Render(data.page4);
            }
            else{
                alert(msg);
            }
        }
    });

    //开始使用
    function page2Render(data) {
        var page2Scr = $("#page2Scr").html();
        var page2Show = $("#page2Show");
        var result = sodaRender(page2Scr, {
            data: [data]
        });
        page2Show.html(result.innerHTML);
        var $dataSpan=$(".data-interval");
        setTimeout(function(){
            var dataEnd=data.days;
            var dataInit=0;
            var speed=Math.ceil(dataEnd/700);
            $dataSpan.html(dataInit);
            var dataInterval=setInterval(function(){
                $dataSpan.html(dataInit);
                dataInit+=speed;
                if(dataInit>dataEnd){
                    clearInterval(dataInterval);
                    $dataSpan.html(dataEnd);
                }
            },1)
        },3000)
    }
    //第一个电话
    function page3Render(data){
        var page3Scr=$("#page3Scr").html();
        var page3Show=$("#page3Show");
        var result=sodaRender(page3Scr,{
            data:[data]
        });
        page3Show.html(result.innerHTML)
    }
    //流量动态
    function page5Render(data){
        var page5Scr = $("#page5Scr").html();
        var page5Show = $("#page5Show");
        var result = sodaRender(page5Scr, {
            data: [data]
        });
        page5Show.html(result.innerHTML);
        console.log(data.traffic_data)

        drawChartLine(data.traffic_data);
    }
    //渠道选择
    function page4Render(data){
        var page4Scr = $("#page4Scr").html();
        var page4Show = $("#page4Show");
        var result = sodaRender(page4Scr, {
            data: [data]
        });
        page4Show.html(result.innerHTML);
        showRatios(data)
        showSex(data)

        drawChartCPie(data.operator_ratios);
        //drawChartDonut('#chartDonutMale', data.male.ratio);线上
        drawChartDonut('#chartDonutMale', data.friend_male.ratio);
        //drawChartDonut('#chartDonutFemale', data.female.ratio);  线上
        drawChartDonut('#chartDonutFemale', data.friend_female.ratio);
    }
    //话费账单
    function page6Render(data) {
        var page6Scr = $("#page6Scr").html();
        var page6Show = $("#page6Show");
        var result = sodaRender(page6Scr, {
            data: [data]
        });
        page6Show.html(result.innerHTML);
    }
    //现在充值
    function page7Render(data){
        var page7Scr = $("#page7Scr").html();
        var page7Show = $("#page7Show");
        var result = sodaRender(page7Scr, {
            data: [data]   //item in 什么的那个什么是个数组
        });
        page7Show.html(result.innerHTML);
    }


    //显示渠道排名
    function showRatios(data){
        var operator_ratios=data.operator_ratios;
        operator_ratios.sort(compare)
        //console.log(operator_ratios[0].name);
        var result=operator_ratios[0].name;
        $("#ratios").html(result);
        //排序
        function compare(obj1,obj2){
            if(obj1.value>obj2.value){
                return -1
            }else{
                return 1
            }
        }
    }
    //显示男女排名
    function showSex(data){
        var male_avg=data.friend_male.ratio;
        var female_avg=data.friend_female.ratio;
        if(male_avg>female_avg){
            $("#male").show()
        }else{
            $("#female").show()
        }
    }

    //折线图
    function drawChartLine(series) {
        var labels = [],
          max = series.slice(0).sort(function (a, b) {
              return b - a;
          })[0],
          maxDrawn = false;
        for (var i = 0; i <= 24; i++) {
            labels.push(( i % 4 === 0 ) ? i + '时' : false);
        }

        var data = {
              labels: labels,
              series: [
                  series
              ]
          },
          opts = {
              showArea: true,
              lineSmooth: false,
              axisY: {
                  showGrid: false,
                  high: max * 1.2
              },
              axisX: {},
              width: (window.innerWidth) + 'px',
              plugins: [
                  ctPointLabels({
                      textAnchor: 'middle'
                  })
              ]
          };

        new Chartist.Line('#chartLineTraffic', data, opts);

        function ctPointLabels(options) {
            return function ctPointLabels(chart) {
                var defaultOptions = {
                    labelOffset: {
                        x: 0,
                        y: -30
                    },
                    labelInterpolationFnc: function (v) {
                        return v;
                    }
                };

                options = Chartist.extend({}, defaultOptions, options);

                if (chart instanceof Chartist.Line) {
                    chart.on('draw', function (data) {
                        if (data.type === 'point') {
                            var v = data.value.y;
                            if (v >= max && !maxDrawn) {
                                maxDrawn = true;
                                data.group.elem('circle', {
                                    cx: data.x,
                                    cy: data.y,
                                    r: 3
                                }, 'high-light-point');
                                data.group.foreignObject('<div class="point-label"><div class="point-label-block"><span>最高</span> <span class="text-blue">' + v + 'M</span></div></div>', {
                                    x: data.x + options.labelOffset.x,
                                    y: data.y + options.labelOffset.y
                                });
                            }
                        }
                    });
                }
            }
        }
    }

    //饼图
    function drawChartCPie(series) {
        var data = {
              series: series
          },
          opts = {
              showLabel: false,
              chartPadding: 0,
              labelOffset: 25,
              labelDirection: 'explode',
              width: '250px',
              height: '150px',
              labelInterpolationFnc: function (label, i) {
                  var o = series[i];
                  return o.name + '\n' + o.value + '%';
              }
          };

        new Chartist.CPie('#chartPieBig', data, opts)
    }

    //环形图
    function drawChartDonut(selector, value) {
        var series = [value, 100 - value],
          data = {
              series: series
          },
          ringDrawn = false,
          opts = {
              showLabel: false,
              donut: true,
              donutWidth: 7,
              width: 77,
              height: 77,
              startAngle: 240,
              plugins: [
                  drawRings()
              ]
          };

        new Chartist.Pie(selector, data, opts);
        $(selector).parent().find('.rate').text(value + '%');
        drawRings();

        function drawRings() {
            return function (chart) {
                if (chart instanceof Chartist.Pie) {
                    chart.on('draw', function (data) {
                        if (data.type == 'slice' && !ringDrawn) {
                            ringDrawn = true;
                            var radius = data.radius;
                            addRing(data, 65, 360, radius - 7);
                            addRing(data, -130, 176, radius + 7)
                        }
                    });
                }

                function addRing(data, startAngle, endAngle, radius) {
                    var center = data.center,
                      start = Chartist.polarToCartesian(center.x, center.y, radius, startAngle),
                      end = Chartist.polarToCartesian(center.x, center.y, radius, endAngle);

                    $(selector).find('svg').append(
                      makeSVG('path', {
                          d: new Chartist.Svg.Path(false)
                            .move(end.x, end.y)
                            .arc(radius, radius, 0, endAngle - startAngle > 180, 0, start.x, start.y)
                            .stringify(),
                          class: 'ring'
                      })
                    );

                }

                function makeSVG(tag, attrs) {
                    var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
                    for (var k in attrs)
                        el.setAttribute(k, attrs[k]);
                    return el;
                }
            }
        }
    }

    /*弹框显示影藏*/
    $(".shade").height(h);
    $(document).on('click','.showAlert',function(){
        $(".shade").show();
        $(".alert-msg").show();
    });
    $(document).on('click','.alert-button',function(){
        $(".shade").hide();
        $(".alert-msg").hide();
    });
    $(document).on('click',".clickInvite",function(){
        $(".shade").show();
        $(".share-img").show();
    });
    $(".shade").on("click",function(){
        $(".shade").hide();
        $(".share-img").hide();
        $(".alert-msg").hide();
    })
});