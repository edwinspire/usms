//>>built
define("clipart/_deviceclipart",["dojo/_base/declare","./_clipart"],function(_1,_2){
return _1("clipart._deviceclipart",[_2],{orientation:"portrait",preserveAspectRatio:true,DeviceClipart:true,postCreate:function(){
var _3=this.domNode.style.visibility;
this.domNode.style.visibility="hidden";
var _4=this.declaredClass.lastIndexOf(".");
if(_4<0){
_4=0;
}
var dj=this.domNode.ownerDocument.defaultView.dojo;
this._url=this.declaredClass.substr(_4+1)+"_"+this.orientation+".svg";
this.url=dj.moduleUrl("clipart",this._url);
this.UpdateStyle();
this.domNode.style.visibility=_3;
},UpdateStyle:function(){
this.domNode.style.backgroundImage="url('"+this.url+"')";
this.domNode.style.backgroundRepeat="no-repeat";
this.domNode.style.backgroundPosition="center center";
var _5=this.domNode.offsetWidth;
var _6=this.domNode.offsetHeight;
var _7;
if(_5&&_6&&this.defaultWidth&&this.defaultHeight&&this.preserveAspectRatio){
var w,h,dw,dh;
if(this.orientation=="landscape"){
dw=this.defaultHeight;
dh=this.defaultWidth;
}else{
dw=this.defaultWidth;
dh=this.defaultHeight;
}
var _8=_5/dw;
var _9=_6/dh;
if(_8<_9){
w=100;
h=100*(dh/dw)*(_5/_6);
}else{
h=100;
w=100*(dw/dh)*(_6/_5);
}
_7=w+"% "+h+"%";
}else{
_7="100% 100%";
}
this._setCSS3Property(this.domNode,"backgroundSize",_7);
},_setCSS3Property:function(_a,_b,_c){
var _d=_a.style;
var _e=_b.charAt(0).toUpperCase()+_b.slice(1);
_d["webkit"+_e]=_c;
_d["Moz"+_e]=_c;
_d["ms"+_e]=_c;
_d["o"+_e]=_c;
_d[_b]=_c;
}});
});
