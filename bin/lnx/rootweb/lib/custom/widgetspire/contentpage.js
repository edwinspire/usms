define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!./contentpage.html'
],function(declare,_Widget,_Templated,templateString){

 return declare('widgetspire.contentpage',[ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
url : function(url_) {

var Contenedor = dojo.byId('edwinspire.contentpage.objectcontent');
var Loading = dojo.byId('edwinspire.contentpage.divloading');

dojo.style(Loading, "display", "block");
dojo.style(Contenedor, "display", "none");
dojo.attr(Contenedor, "data", url_);
dojo.style(Contenedor, {width: "100%", height:"100%", display:"block"});
},
resize: function(){
this.size(this.width, this.height);
},
width: "100%",
height: "100%",
size: function(w, h){
this.width = w;
this.height = h;
dojo.style(dojo.byId('edwinspire.contentpage.objectcontent'), {width: w, height: h, position: "relative",  top: "0", left: "0", display: "block"});
//alert('> '+this.height);
return this;
},
start:function(){
var Loading = dojo.byId('edwinspire.contentpage.divloading');
var Contenedor = dojo.byId('edwinspire.contentpage.objectcontent');
var este  = this;
dojo.connect(Contenedor, 'onload', function(){
setTimeout(function(){
este.resize();
dojo.style(Loading, "display", "none");
},2000);
});

dojo.connect(Contenedor, 'onerror', function(){
alert('error');
dojo.style(Loading, "display", "none");
});

dojo.connect(Contenedor, 'onresize', function(){
alert('onresize');
});

dojo.connect(Contenedor, 'onunload', function(){
dojo.style(Loading, "display", "none");
alert('onunload');
});

return this;
}


   
});
});
