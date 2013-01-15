//>>built
define("shapes/_Shape",["dojo/_base/declare","dijit/_WidgetBase"],function(_1,_2){
return _1("shapes._Shape",[_2],{buildRendering:function(){
this.inherited(arguments);
this.domNode=this.srcNodeRef;
var _3=dojo.style(this.domNode,"display");
if(_3!="none"&&_3!="block"&&_3!="inline-block"){
this.domNode.style.display="inline-block";
}
this.domNode.style.pointerEvents="none";
this.domNode.style.lineHeight="0px";
this._header="<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" shape-rendering=\"geometric-precision\">";
this._header+="<g class=\"shapeg\" pointer-events=\"all\">";
this._footer="</g></svg>";
this.subscribe("/maqetta/appstates/state/changed",function(){
this.resize();
}.bind(this));
},_uniqueId:function(_4,_5){
var _6=0;
var id;
while(1){
id=_5+"_"+_6;
if(!_4.getElementById(id)){
break;
}else{
_6++;
}
}
return id;
},startup:function(){
if(this.domNode){
this.resize();
this._bboxStartup=this._bbox;
}
var _7=this;
setTimeout(function(){
if(_7.domNode&&_7.domNode.ownerDocument){
_7.resize();
_7._bboxStartup=_7._bbox;
}
},1000);
},resize:function(){
this._resize();
},_resize:function(){
if(!this.domNode){
return;
}
dojo.addClass(this.domNode,"shape");
this.domNode.style.pointerEvents="none";
this.domNode.style.lineHeight="0px";
this.createGraphics();
if(!this._isDisplayed(this._g)){
return;
}
var _8=this._g.getBBox();
if(this.adjustBBox_Widget){
this.adjustBBox_Widget(_8);
}
var _9=this._bbox;
var x=_8.x,y=_8.y,w=_8.width,h=_8.height;
this._bbox=_8;
var _a=dojo.style(this.domNode,"stroke-width");
if(_a<1){
_a=1;
}
this._xoffset=this._yoffset=_a;
var _b=_a*2;
x-=this._xoffset;
w+=_b;
y-=this._yoffset;
h+=_b;
this._svgroot.setAttribute("viewBox",x+" "+y+" "+w+" "+h);
this._svgroot.style.width=w+"px";
this._svgroot.style.height=h+"px";
this.domNode.style.width=w+"px";
this.domNode.style.height=h+"px";
var _c=dojo.style(this.domNode,"display");
if(_c!="none"&&_c!="block"&&_c!="inline-block"){
this.domNode.style.display="inline-block";
}
},_isDisplayed:function(_d){
if(!_d||!_d.ownerDocument||!_d.ownerDocument.defaultView){
return false;
}
var _e=_d.ownerDocument.defaultView;
var n=_d;
while(n&&n.tagName!="BODY"){
var _f=_e.getComputedStyle(n,"");
if(_f.display=="none"){
return false;
}
n=n.parentNode;
}
return true;
}});
});
