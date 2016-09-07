!function(e,t,a){"use strict";function i(e,t,a){var i=t.x>e.x;return i&&"explode"===a||!i&&"implode"===a?"start":i&&"implode"===a||!i&&"explode"===a?"end":"middle"}function s(e){this.data=a.normalizeData(this.data);var t,s,l,n,o,c=[],d=e.startAngle,h=a.getDataArray(this.data,e.reverseData);this.svg=a.createSvg(this.container,e.width,e.height,e.donut?e.classNames.chartDonut:e.classNames.chartPie),s=a.createChartRect(this.svg,e,r.padding),l=Math.min(s.width()/2,s.height()/2),o=e.total||h.reduce(function(e,t){return e+t},0);var u=a.quantity(e.donutWidth);"%"===u.unit&&(u.value*=l/100),l-=e.donut?u.value/2:0,n="outside"===e.labelPosition||e.donut?l:"center"===e.labelPosition?0:l/2,n+=e.labelOffset;var m={x:s.x1+s.width()/2,y:s.y2+s.height()/2},v=1===this.data.series.filter(function(e){return e.hasOwnProperty("value")?0!==e.value:0!==e}).length;e.showLabel&&(t=this.svg.elem("g",null,null,!0));for(var g=0;g<this.data.series.length;g++)if(0!==h[g]||!e.ignoreEmptyValues){var p=this.data.series[g];c[g]=this.svg.elem("g",null,null,!0),c[g].attr({"ct:series-name":p.name}),c[g].addClass([e.classNames.series,p.className||e.classNames.series+"-"+a.alphaNumerate(g)].join(" "));var x=d+h[g]/o*360,y=Math.max(0,d-(0===g||v?0:.2));x-y>=359.99&&(x=y+359.99);var b=l*((x-d)/360*.5+.2),f=a.polarToCartesian(m.x,m.y,b,y),w=a.polarToCartesian(m.x,m.y,b,x),P=new a.Svg.Path((!e.donut)).move(w.x,w.y).arc(b,b,0,x-d>180,0,f.x,f.y);e.donut||P.line(m.x,m.y);var D=c[g].elem("path",{d:P.stringify()},e.donut?e.classNames.sliceDonut:e.classNames.slicePie);if(D.attr({"ct:value":h[g],"ct:meta":a.serialize(p.meta)}),e.donut&&D.attr({style:"stroke-width: "+u.value+"px"}),this.eventEmitter.emit("draw",{type:"slice",value:h[g],totalDataSum:o,index:g,meta:p.meta,series:p,group:c[g],element:D,path:P.clone(),center:m,radius:l,startAngle:d,endAngle:x}),e.showLabel){var N=a.polarToCartesian(m.x,m.y,n,d+(x-d)/2),C=e.labelInterpolationFnc(this.data.labels&&!a.isFalseyButZero(this.data.labels[g])?this.data.labels[g]:h[g],g);if(C||0===C){var A=t.elem("text",{dx:N.x,dy:N.y,"text-anchor":i(m,N,e.labelDirection)},e.classNames.label).text(""+C);this.eventEmitter.emit("draw",{type:"label",index:g,group:t,element:A,text:""+C,x:N.x,y:N.y})}}d=x}this.eventEmitter.emit("created",{chartRect:s,svg:this.svg,options:e})}function l(e,t,i,s){a.Pie.super.constructor.call(this,e,t,r,a.extend({},r,i),s)}var r={width:void 0,height:void 0,chartPadding:5,classNames:{chartPie:"ct-chart-pie",chartDonut:"ct-chart-donut",series:"ct-series",slicePie:"ct-slice-pie",sliceDonut:"ct-slice-donut",label:"ct-label"},startAngle:0,total:void 0,donut:!1,donutWidth:60,showLabel:!0,labelOffset:0,labelPosition:"inside",labelInterpolationFnc:a.noop,labelDirection:"neutral",reverseData:!1,ignoreEmptyValues:!1};a.CPie=a.Base.extend({constructor:l,createChart:s,determineAnchorPosition:i})}(window,document,Chartist);