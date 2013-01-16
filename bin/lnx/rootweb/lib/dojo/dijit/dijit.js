/*
	Copyright (c) 2004-2012, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

/*
	This is an optimized version of Dojo, built for deployment and not for
	development. To get sources and documentation, please visit:

		http://dojotoolkit.org
*/

//>>built
require({cache:{"dijit/popup":function(){
define("dijit/popup",["dojo/_base/array","dojo/aspect","dojo/_base/connect","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/_base/event","dojo/keys","dojo/_base/lang","dojo/on","dojo/sniff","./place","./BackgroundIframe","./main"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,on,_d,_e,_f,_10){
function _11(){
if(this._popupWrapper){
_7.destroy(this._popupWrapper);
delete this._popupWrapper;
}
};
var _12=_4(null,{_stack:[],_beginZIndex:1000,_idGen:1,_createWrapper:function(_13){
var _14=_13._popupWrapper,_15=_13.domNode;
if(!_14){
_14=_7.create("div",{"class":"dijitPopup",style:{display:"none"},role:"presentation"},_13.ownerDocumentBody);
_14.appendChild(_15);
var s=_15.style;
s.display="";
s.visibility="";
s.position="";
s.top="0px";
_13._popupWrapper=_14;
_2.after(_13,"destroy",_11,true);
}
return _14;
},moveOffScreen:function(_16){
var _17=this._createWrapper(_16);
_9.set(_17,{visibility:"hidden",top:"-9999px",display:""});
},hide:function(_18){
var _19=this._createWrapper(_18);
_9.set(_19,"display","none");
},getTopPopup:function(){
var _1a=this._stack;
for(var pi=_1a.length-1;pi>0&&_1a[pi].parent===_1a[pi-1].widget;pi--){
}
return _1a[pi];
},open:function(_1b){
var _1c=this._stack,_1d=_1b.popup,_1e=_1b.orient||["below","below-alt","above","above-alt"],ltr=_1b.parent?_1b.parent.isLeftToRight():_8.isBodyLtr(_1d.ownerDocument),_1f=_1b.around,id=(_1b.around&&_1b.around.id)?(_1b.around.id+"_dropdown"):("popup_"+this._idGen++);
while(_1c.length&&(!_1b.parent||!_5.isDescendant(_1b.parent.domNode,_1c[_1c.length-1].widget.domNode))){
this.close(_1c[_1c.length-1].widget);
}
var _20=this._createWrapper(_1d);
_6.set(_20,{id:id,style:{zIndex:this._beginZIndex+_1c.length},"class":"dijitPopup "+(_1d.baseClass||_1d["class"]||"").split(" ")[0]+"Popup",dijitPopupParent:_1b.parent?_1b.parent.id:""});
if(_d("ie")||_d("mozilla")){
if(!_1d.bgIframe){
_1d.bgIframe=new _f(_20);
}
}
var _21=_1f?_e.around(_20,_1f,_1e,ltr,_1d.orient?_c.hitch(_1d,"orient"):null):_e.at(_20,_1b,_1e=="R"?["TR","BR","TL","BL"]:["TL","BL","TR","BR"],_1b.padding);
_20.style.display="";
_20.style.visibility="visible";
_1d.domNode.style.visibility="visible";
var _22=[];
_22.push(on(_20,_3._keypress,_c.hitch(this,function(evt){
if(evt.charOrCode==_b.ESCAPE&&_1b.onCancel){
_a.stop(evt);
_1b.onCancel();
}else{
if(evt.charOrCode===_b.TAB){
_a.stop(evt);
var _23=this.getTopPopup();
if(_23&&_23.onCancel){
_23.onCancel();
}
}
}
})));
if(_1d.onCancel&&_1b.onCancel){
_22.push(_1d.on("cancel",_1b.onCancel));
}
_22.push(_1d.on(_1d.onExecute?"execute":"change",_c.hitch(this,function(){
var _24=this.getTopPopup();
if(_24&&_24.onExecute){
_24.onExecute();
}
})));
_1c.push({widget:_1d,parent:_1b.parent,onExecute:_1b.onExecute,onCancel:_1b.onCancel,onClose:_1b.onClose,handlers:_22});
if(_1d.onOpen){
_1d.onOpen(_21);
}
return _21;
},close:function(_25){
var _26=this._stack;
while((_25&&_1.some(_26,function(_27){
return _27.widget==_25;
}))||(!_25&&_26.length)){
var top=_26.pop(),_28=top.widget,_29=top.onClose;
if(_28.onClose){
_28.onClose();
}
var h;
while(h=top.handlers.pop()){
h.remove();
}
if(_28&&_28.domNode){
this.hide(_28);
}
if(_29){
_29();
}
}
}});
return (_10.popup=new _12());
});
},"dojo/string":function(){
define(["./_base/kernel","./_base/lang"],function(_2a,_2b){
var _2c={};
_2b.setObject("dojo.string",_2c);
_2c.rep=function(str,num){
if(num<=0||!str){
return "";
}
var buf=[];
for(;;){
if(num&1){
buf.push(str);
}
if(!(num>>=1)){
break;
}
str+=str;
}
return buf.join("");
};
_2c.pad=function(_2d,_2e,ch,end){
if(!ch){
ch="0";
}
var out=String(_2d),pad=_2c.rep(ch,Math.ceil((_2e-out.length)/ch.length));
return end?out+pad:pad+out;
};
_2c.substitute=function(_2f,map,_30,_31){
_31=_31||_2a.global;
_30=_30?_2b.hitch(_31,_30):function(v){
return v;
};
return _2f.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,function(_32,key,_33){
var _34=_2b.getObject(key,false,map);
if(_33){
_34=_2b.getObject(_33,false,_31).call(_31,_34,key);
}
return _30(_34,key).toString();
});
};
_2c.trim=String.prototype.trim?_2b.trim:function(str){
str=str.replace(/^\s+/,"");
for(var i=str.length-1;i>=0;i--){
if(/\S/.test(str.charAt(i))){
str=str.substring(0,i+1);
break;
}
}
return str;
};
return _2c;
});
},"dijit/a11y":function(){
define("dijit/a11y",["dojo/_base/array","dojo/_base/config","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-style","dojo/sniff","./main"],function(_35,_36,_37,dom,_38,_39,has,_3a){
var _3b=(_3a._isElementShown=function(_3c){
var s=_39.get(_3c);
return (s.visibility!="hidden")&&(s.visibility!="collapsed")&&(s.display!="none")&&(_38.get(_3c,"type")!="hidden");
});
_3a.hasDefaultTabStop=function(_3d){
switch(_3d.nodeName.toLowerCase()){
case "a":
return _38.has(_3d,"href");
case "area":
case "button":
case "input":
case "object":
case "select":
case "textarea":
return true;
case "iframe":
var _3e;
try{
var _3f=_3d.contentDocument;
if("designMode" in _3f&&_3f.designMode=="on"){
return true;
}
_3e=_3f.body;
}
catch(e1){
try{
_3e=_3d.contentWindow.document.body;
}
catch(e2){
return false;
}
}
return _3e&&(_3e.contentEditable=="true"||(_3e.firstChild&&_3e.firstChild.contentEditable=="true"));
default:
return _3d.contentEditable=="true";
}
};
var _40=(_3a.isTabNavigable=function(_41){
if(_38.get(_41,"disabled")){
return false;
}else{
if(_38.has(_41,"tabIndex")){
return _38.get(_41,"tabIndex")>=0;
}else{
return _3a.hasDefaultTabStop(_41);
}
}
});
_3a._getTabNavigable=function(_42){
var _43,_44,_45,_46,_47,_48,_49={};
function _4a(_4b){
return _4b&&_4b.tagName.toLowerCase()=="input"&&_4b.type&&_4b.type.toLowerCase()=="radio"&&_4b.name&&_4b.name.toLowerCase();
};
var _4c=function(_4d){
for(var _4e=_4d.firstChild;_4e;_4e=_4e.nextSibling){
if(_4e.nodeType!=1||(has("ie")&&_4e.scopeName!=="HTML")||!_3b(_4e)){
continue;
}
if(_40(_4e)){
var _4f=+_38.get(_4e,"tabIndex");
if(!_38.has(_4e,"tabIndex")||_4f==0){
if(!_43){
_43=_4e;
}
_44=_4e;
}else{
if(_4f>0){
if(!_45||_4f<_46){
_46=_4f;
_45=_4e;
}
if(!_47||_4f>=_48){
_48=_4f;
_47=_4e;
}
}
}
var rn=_4a(_4e);
if(_38.get(_4e,"checked")&&rn){
_49[rn]=_4e;
}
}
if(_4e.nodeName.toUpperCase()!="SELECT"){
_4c(_4e);
}
}
};
if(_3b(_42)){
_4c(_42);
}
function rs(_50){
return _49[_4a(_50)]||_50;
};
return {first:rs(_43),last:rs(_44),lowest:rs(_45),highest:rs(_47)};
};
_3a.getFirstInTabbingOrder=function(_51,doc){
var _52=_3a._getTabNavigable(dom.byId(_51,doc));
return _52.lowest?_52.lowest:_52.first;
};
_3a.getLastInTabbingOrder=function(_53,doc){
var _54=_3a._getTabNavigable(dom.byId(_53,doc));
return _54.last?_54.last:_54.highest;
};
return {hasDefaultTabStop:_3a.hasDefaultTabStop,isTabNavigable:_3a.isTabNavigable,_getTabNavigable:_3a._getTabNavigable,getFirstInTabbingOrder:_3a.getFirstInTabbingOrder,getLastInTabbingOrder:_3a.getLastInTabbingOrder};
});
},"dijit/WidgetSet":function(){
define("dijit/WidgetSet",["dojo/_base/array","dojo/_base/declare","dojo/_base/kernel","./registry"],function(_55,_56,_57,_58){
var _59=_56("dijit.WidgetSet",null,{constructor:function(){
this._hash={};
this.length=0;
},add:function(_5a){
if(this._hash[_5a.id]){
throw new Error("Tried to register widget with id=="+_5a.id+" but that id is already registered");
}
this._hash[_5a.id]=_5a;
this.length++;
},remove:function(id){
if(this._hash[id]){
delete this._hash[id];
this.length--;
}
},forEach:function(_5b,_5c){
_5c=_5c||_57.global;
var i=0,id;
for(id in this._hash){
_5b.call(_5c,this._hash[id],i++,this._hash);
}
return this;
},filter:function(_5d,_5e){
_5e=_5e||_57.global;
var res=new _59(),i=0,id;
for(id in this._hash){
var w=this._hash[id];
if(_5d.call(_5e,w,i++,this._hash)){
res.add(w);
}
}
return res;
},byId:function(id){
return this._hash[id];
},byClass:function(cls){
var res=new _59(),id,_5f;
for(id in this._hash){
_5f=this._hash[id];
if(_5f.declaredClass==cls){
res.add(_5f);
}
}
return res;
},toArray:function(){
var ar=[];
for(var id in this._hash){
ar.push(this._hash[id]);
}
return ar;
},map:function(_60,_61){
return _55.map(this.toArray(),_60,_61);
},every:function(_62,_63){
_63=_63||_57.global;
var x=0,i;
for(i in this._hash){
if(!_62.call(_63,this._hash[i],x++,this._hash)){
return false;
}
}
return true;
},some:function(_64,_65){
_65=_65||_57.global;
var x=0,i;
for(i in this._hash){
if(_64.call(_65,this._hash[i],x++,this._hash)){
return true;
}
}
return false;
}});
_55.forEach(["forEach","filter","byClass","map","every","some"],function(_66){
_58[_66]=_59.prototype[_66];
});
return _59;
});
},"dijit/_base/wai":function(){
define("dijit/_base/wai",["dojo/dom-attr","dojo/_base/lang","../main","../hccss"],function(_67,_68,_69){
var _6a={hasWaiRole:function(_6b,_6c){
var _6d=this.getWaiRole(_6b);
return _6c?(_6d.indexOf(_6c)>-1):(_6d.length>0);
},getWaiRole:function(_6e){
return _68.trim((_67.get(_6e,"role")||"").replace("wairole:",""));
},setWaiRole:function(_6f,_70){
_67.set(_6f,"role",_70);
},removeWaiRole:function(_71,_72){
var _73=_67.get(_71,"role");
if(!_73){
return;
}
if(_72){
var t=_68.trim((" "+_73+" ").replace(" "+_72+" "," "));
_67.set(_71,"role",t);
}else{
_71.removeAttribute("role");
}
},hasWaiState:function(_74,_75){
return _74.hasAttribute?_74.hasAttribute("aria-"+_75):!!_74.getAttribute("aria-"+_75);
},getWaiState:function(_76,_77){
return _76.getAttribute("aria-"+_77)||"";
},setWaiState:function(_78,_79,_7a){
_78.setAttribute("aria-"+_79,_7a);
},removeWaiState:function(_7b,_7c){
_7b.removeAttribute("aria-"+_7c);
}};
_68.mixin(_69,_6a);
return _69;
});
},"dijit/Viewport":function(){
define("dijit/Viewport",["dojo/Evented","dojo/on","dojo/ready","dojo/sniff","dojo/_base/window","dojo/window"],function(_7d,on,_7e,has,win,_7f){
var _80=new _7d();
_7e(200,function(){
var _81=_7f.getBox();
_80._rlh=on(win.global,"resize",function(){
var _82=_7f.getBox();
if(_81.h==_82.h&&_81.w==_82.w){
return;
}
_81=_82;
_80.emit("resize");
});
if(has("ie")==8){
var _83=screen.deviceXDPI;
setInterval(function(){
if(screen.deviceXDPI!=_83){
_83=screen.deviceXDPI;
_80.emit("resize");
}
},500);
}
});
return _80;
});
},"dojo/hccss":function(){
define(["require","./_base/config","./dom-class","./dom-construct","./dom-style","./has","./ready","./_base/window"],function(_84,_85,_86,_87,_88,has,_89,win){
has.add("highcontrast",function(){
var div=win.doc.createElement("div");
div.style.cssText="border: 1px solid; border-color:red green; position: absolute; height: 5px; top: -999px;"+"background-image: url("+(_85.blankGif||_84.toUrl("./resources/blank.gif"))+");";
win.body().appendChild(div);
var cs=_88.getComputedStyle(div),_8a=cs.backgroundImage,hc=(cs.borderTopColor==cs.borderRightColor)||(_8a&&(_8a=="none"||_8a=="url(invalid-url:)"));
_87.destroy(div);
return hc;
});
_89(90,function(){
if(has("highcontrast")){
_86.add(win.body(),"dj_a11y");
}
});
return has;
});
},"dijit/_WidgetBase":function(){
define("dijit/_WidgetBase",["require","dojo/_base/array","dojo/aspect","dojo/_base/config","dojo/_base/connect","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/has","dojo/_base/kernel","dojo/_base/lang","dojo/on","dojo/ready","dojo/Stateful","dojo/topic","dojo/_base/window","./Destroyable","./registry"],function(_8b,_8c,_8d,_8e,_8f,_90,dom,_91,_92,_93,_94,_95,has,_96,_97,on,_98,_99,_9a,win,_9b,_9c){
has.add("dijit-legacy-requires",!_96.isAsync);
if(has("dijit-legacy-requires")){
_98(0,function(){
var _9d=["dijit/_base/manager"];
_8b(_9d);
});
}
var _9e={};
function _9f(obj){
var ret={};
for(var _a0 in obj){
ret[_a0.toLowerCase()]=true;
}
return ret;
};
function _a1(_a2){
return function(val){
_91[val?"set":"remove"](this.domNode,_a2,val);
this._set(_a2,val);
};
};
return _90("dijit._WidgetBase",[_99,_9b],{id:"",_setIdAttr:"domNode",lang:"",_setLangAttr:_a1("lang"),dir:"",_setDirAttr:_a1("dir"),textDir:"","class":"",_setClassAttr:{node:"domNode",type:"class"},style:"",title:"",tooltip:"",baseClass:"",srcNodeRef:null,domNode:null,containerNode:null,ownerDocument:null,_setOwnerDocumentAttr:function(val){
this._set("ownerDocument",val);
},attributeMap:{},_blankGif:_8e.blankGif||_8b.toUrl("dojo/resources/blank.gif"),postscript:function(_a3,_a4){
this.create(_a3,_a4);
},create:function(_a5,_a6){
this.srcNodeRef=dom.byId(_a6);
this._connects=[];
this._supportingWidgets=[];
if(this.srcNodeRef&&(typeof this.srcNodeRef.id=="string")){
this.id=this.srcNodeRef.id;
}
if(_a5){
this.params=_a5;
_97.mixin(this,_a5);
}
this.postMixInProperties();
if(!this.id){
this.id=_9c.getUniqueId(this.declaredClass.replace(/\./g,"_"));
if(this.params){
delete this.params.id;
}
}
this.ownerDocument=this.ownerDocument||(this.srcNodeRef?this.srcNodeRef.ownerDocument:win.doc);
this.ownerDocumentBody=win.body(this.ownerDocument);
_9c.add(this);
this.buildRendering();
var _a7;
if(this.domNode){
this._applyAttributes();
var _a8=this.srcNodeRef;
if(_a8&&_a8.parentNode&&this.domNode!==_a8){
_a8.parentNode.replaceChild(this.domNode,_a8);
_a7=true;
}
this.domNode.setAttribute("widgetId",this.id);
}
this.postCreate();
if(_a7){
delete this.srcNodeRef;
}
this._created=true;
},_applyAttributes:function(){
var _a9=this.constructor,_aa=_a9._setterAttrs;
if(!_aa){
_aa=(_a9._setterAttrs=[]);
for(var _ab in this.attributeMap){
_aa.push(_ab);
}
var _ac=_a9.prototype;
for(var _ad in _ac){
if(_ad in this.attributeMap){
continue;
}
var _ae="_set"+_ad.replace(/^[a-z]|-[a-zA-Z]/g,function(c){
return c.charAt(c.length-1).toUpperCase();
})+"Attr";
if(_ae in _ac){
_aa.push(_ad);
}
}
}
var _af={};
for(var key in this.params||{}){
_af[key]=this[key];
}
_8c.forEach(_aa,function(_b0){
if(_b0 in _af){
}else{
if(this[_b0]){
this.set(_b0,this[_b0]);
}
}
},this);
for(key in _af){
this.set(key,_af[key]);
}
},postMixInProperties:function(){
},buildRendering:function(){
if(!this.domNode){
this.domNode=this.srcNodeRef||this.ownerDocument.createElement("div");
}
if(this.baseClass){
var _b1=this.baseClass.split(" ");
if(!this.isLeftToRight()){
_b1=_b1.concat(_8c.map(_b1,function(_b2){
return _b2+"Rtl";
}));
}
_92.add(this.domNode,_b1);
}
},postCreate:function(){
},startup:function(){
if(this._started){
return;
}
this._started=true;
_8c.forEach(this.getChildren(),function(obj){
if(!obj._started&&!obj._destroyed&&_97.isFunction(obj.startup)){
obj.startup();
obj._started=true;
}
});
},destroyRecursive:function(_b3){
this._beingDestroyed=true;
this.destroyDescendants(_b3);
this.destroy(_b3);
},destroy:function(_b4){
this._beingDestroyed=true;
this.uninitialize();
function _b5(w){
if(w.destroyRecursive){
w.destroyRecursive(_b4);
}else{
if(w.destroy){
w.destroy(_b4);
}
}
};
_8c.forEach(this._connects,_97.hitch(this,"disconnect"));
_8c.forEach(this._supportingWidgets,_b5);
if(this.domNode){
_8c.forEach(_9c.findWidgets(this.domNode,this.containerNode),_b5);
}
this.destroyRendering(_b4);
_9c.remove(this.id);
this._destroyed=true;
},destroyRendering:function(_b6){
if(this.bgIframe){
this.bgIframe.destroy(_b6);
delete this.bgIframe;
}
if(this.domNode){
if(_b6){
_91.remove(this.domNode,"widgetId");
}else{
_93.destroy(this.domNode);
}
delete this.domNode;
}
if(this.srcNodeRef){
if(!_b6){
_93.destroy(this.srcNodeRef);
}
delete this.srcNodeRef;
}
},destroyDescendants:function(_b7){
_8c.forEach(this.getChildren(),function(_b8){
if(_b8.destroyRecursive){
_b8.destroyRecursive(_b7);
}
});
},uninitialize:function(){
return false;
},_setStyleAttr:function(_b9){
var _ba=this.domNode;
if(_97.isObject(_b9)){
_95.set(_ba,_b9);
}else{
if(_ba.style.cssText){
_ba.style.cssText+="; "+_b9;
}else{
_ba.style.cssText=_b9;
}
}
this._set("style",_b9);
},_attrToDom:function(_bb,_bc,_bd){
_bd=arguments.length>=3?_bd:this.attributeMap[_bb];
_8c.forEach(_97.isArray(_bd)?_bd:[_bd],function(_be){
var _bf=this[_be.node||_be||"domNode"];
var _c0=_be.type||"attribute";
switch(_c0){
case "attribute":
if(_97.isFunction(_bc)){
_bc=_97.hitch(this,_bc);
}
var _c1=_be.attribute?_be.attribute:(/^on[A-Z][a-zA-Z]*$/.test(_bb)?_bb.toLowerCase():_bb);
if(_bf.tagName){
_91.set(_bf,_c1,_bc);
}else{
_bf.set(_c1,_bc);
}
break;
case "innerText":
_bf.innerHTML="";
_bf.appendChild(this.ownerDocument.createTextNode(_bc));
break;
case "innerHTML":
_bf.innerHTML=_bc;
break;
case "class":
_92.replace(_bf,_bc,this[_bb]);
break;
}
},this);
},get:function(_c2){
var _c3=this._getAttrNames(_c2);
return this[_c3.g]?this[_c3.g]():this[_c2];
},set:function(_c4,_c5){
if(typeof _c4==="object"){
for(var x in _c4){
this.set(x,_c4[x]);
}
return this;
}
var _c6=this._getAttrNames(_c4),_c7=this[_c6.s];
if(_97.isFunction(_c7)){
var _c8=_c7.apply(this,Array.prototype.slice.call(arguments,1));
}else{
var _c9=this.focusNode&&!_97.isFunction(this.focusNode)?"focusNode":"domNode",tag=this[_c9].tagName,_ca=_9e[tag]||(_9e[tag]=_9f(this[_c9])),map=_c4 in this.attributeMap?this.attributeMap[_c4]:_c6.s in this?this[_c6.s]:((_c6.l in _ca&&typeof _c5!="function")||/^aria-|^data-|^role$/.test(_c4))?_c9:null;
if(map!=null){
this._attrToDom(_c4,_c5,map);
}
this._set(_c4,_c5);
}
return _c8||this;
},_attrPairNames:{},_getAttrNames:function(_cb){
var apn=this._attrPairNames;
if(apn[_cb]){
return apn[_cb];
}
var uc=_cb.replace(/^[a-z]|-[a-zA-Z]/g,function(c){
return c.charAt(c.length-1).toUpperCase();
});
return (apn[_cb]={n:_cb+"Node",s:"_set"+uc+"Attr",g:"_get"+uc+"Attr",l:uc.toLowerCase()});
},_set:function(_cc,_cd){
var _ce=this[_cc];
this[_cc]=_cd;
if(this._created&&_cd!==_ce){
if(this._watchCallbacks){
this._watchCallbacks(_cc,_ce,_cd);
}
this.emit("attrmodified-"+_cc,{detail:{prevValue:_ce,newValue:_cd}});
}
},emit:function(_cf,_d0,_d1){
_d0=_d0||{};
if(_d0.bubbles===undefined){
_d0.bubbles=true;
}
if(_d0.cancelable===undefined){
_d0.cancelable=true;
}
if(!_d0.detail){
_d0.detail={};
}
_d0.detail.widget=this;
var ret,_d2=this["on"+_cf];
if(_d2){
ret=_d2.apply(this,_d1?_d1:[_d0]);
}
if(this._started&&!this._beingDestroyed){
on.emit(this.domNode,_cf.toLowerCase(),_d0);
}
return ret;
},on:function(_d3,_d4){
var _d5=this._onMap(_d3);
if(_d5){
return _8d.after(this,_d5,_d4,true);
}
return this.own(on(this.domNode,_d3,_d4))[0];
},_onMap:function(_d6){
var _d7=this.constructor,map=_d7._onMap;
if(!map){
map=(_d7._onMap={});
for(var _d8 in _d7.prototype){
if(/^on/.test(_d8)){
map[_d8.replace(/^on/,"").toLowerCase()]=_d8;
}
}
}
return map[typeof _d6=="string"&&_d6.toLowerCase()];
},toString:function(){
return "[Widget "+this.declaredClass+", "+(this.id||"NO ID")+"]";
},getChildren:function(){
return this.containerNode?_9c.findWidgets(this.containerNode):[];
},getParent:function(){
return _9c.getEnclosingWidget(this.domNode.parentNode);
},connect:function(obj,_d9,_da){
return this.own(_8f.connect(obj,_d9,this,_da))[0];
},disconnect:function(_db){
_db.remove();
},subscribe:function(t,_dc){
return this.own(_9a.subscribe(t,_97.hitch(this,_dc)))[0];
},unsubscribe:function(_dd){
_dd.remove();
},isLeftToRight:function(){
return this.dir?(this.dir=="ltr"):_94.isBodyLtr(this.ownerDocument);
},isFocusable:function(){
return this.focus&&(_95.get(this.domNode,"display")!="none");
},placeAt:function(_de,_df){
var _e0=!_de.tagName&&_9c.byId(_de);
if(_e0&&_e0.addChild&&(!_df||typeof _df==="number")){
_e0.addChild(this,_df);
}else{
var ref=_e0?(_e0.containerNode&&!/after|before|replace/.test(_df||"")?_e0.containerNode:_e0.domNode):dom.byId(_de,this.ownerDocument);
_93.place(this.domNode,ref,_df);
if(!this._started&&(this.getParent()||{})._started){
this.startup();
}
}
return this;
},getTextDir:function(_e1,_e2){
return _e2;
},applyTextDir:function(){
},defer:function(fcn,_e3){
var _e4=setTimeout(_97.hitch(this,function(){
_e4=null;
if(!this._destroyed){
_97.hitch(this,fcn)();
}
}),_e3||0);
return {remove:function(){
if(_e4){
clearTimeout(_e4);
_e4=null;
}
return null;
}};
}});
});
},"dijit/_base":function(){
define("dijit/_base",["./main","./a11y","./WidgetSet","./_base/focus","./_base/manager","./_base/place","./_base/popup","./_base/scroll","./_base/sniff","./_base/typematic","./_base/wai","./_base/window"],function(_e5){
return _e5._base;
});
},"dojo/touch":function(){
define(["./_base/kernel","./_base/lang","./aspect","./dom","./on","./has","./mouse","./ready","./_base/window"],function(_e6,_e7,_e8,dom,on,has,_e9,_ea,win){
var _eb=has("touch");
var _ec=false;
if(has("ios")){
var ua=navigator.userAgent;
var v=ua.match(/OS ([\d_]+)/)?RegExp.$1:"1";
var os=parseFloat(v.replace(/_/,".").replace(/_/g,""));
_ec=os<5;
}
var _ed,_ee;
if(_eb){
_ea(function(){
_ee=win.body();
win.doc.addEventListener("touchstart",function(evt){
var _ef=_ee;
_ee=evt.target;
on.emit(_ef,"dojotouchout",{target:_ef,relatedTarget:_ee,bubbles:true});
on.emit(_ee,"dojotouchover",{target:_ee,relatedTarget:_ef,bubbles:true});
},true);
on(win.doc,"touchmove",function(evt){
var _f0=win.doc.elementFromPoint(evt.pageX-(_ec?0:win.global.pageXOffset),evt.pageY-(_ec?0:win.global.pageYOffset));
if(_f0&&_ee!==_f0){
on.emit(_ee,"dojotouchout",{target:_ee,relatedTarget:_f0,bubbles:true});
on.emit(_f0,"dojotouchover",{target:_f0,relatedTarget:_ee,bubbles:true});
_ee=_f0;
}
});
});
_ed=function(_f1,_f2){
return on(win.doc,"touchmove",function(evt){
if(_f1===win.doc||dom.isDescendant(_ee,_f1)){
_f2.call(this,_e7.mixin({},evt,{target:_ee,touches:evt.touches,preventDefault:function(){
evt.preventDefault();
},stopPropagation:function(){
evt.stopPropagation();
}}));
}
});
};
}
function _f3(_f4){
return function(_f5,_f6){
return on(_f5,_f4,_f6);
};
};
var _f7={press:_f3(_eb?"touchstart":"mousedown"),move:_eb?_ed:_f3("mousemove"),release:_f3(_eb?"touchend":"mouseup"),cancel:_eb?_f3("touchcancel"):_e9.leave,over:_f3(_eb?"dojotouchover":"mouseover"),out:_f3(_eb?"dojotouchout":"mouseout"),enter:_e9._eventHandler(_eb?"dojotouchover":"mouseover"),leave:_e9._eventHandler(_eb?"dojotouchout":"mouseout")};
1&&(_e6.touch=_f7);
return _f7;
});
},"dijit/form/_FormValueMixin":function(){
define("dijit/form/_FormValueMixin",["dojo/_base/declare","dojo/dom-attr","dojo/keys","dojo/sniff","./_FormWidgetMixin"],function(_f8,_f9,_fa,has,_fb){
return _f8("dijit.form._FormValueMixin",_fb,{readOnly:false,_setReadOnlyAttr:function(_fc){
_f9.set(this.focusNode,"readOnly",_fc);
this.focusNode.setAttribute("aria-readonly",_fc);
this._set("readOnly",_fc);
},postCreate:function(){
this.inherited(arguments);
if(has("ie")){
this.connect(this.focusNode||this.domNode,"onkeydown",this._onKeyDown);
}
if(this._resetValue===undefined){
this._lastValueReported=this._resetValue=this.value;
}
},_setValueAttr:function(_fd,_fe){
this._handleOnChange(_fd,_fe);
},_handleOnChange:function(_ff,_100){
this._set("value",_ff);
this.inherited(arguments);
},undo:function(){
this._setValueAttr(this._lastValueReported,false);
},reset:function(){
this._hasBeenBlurred=false;
this._setValueAttr(this._resetValue,true);
},_onKeyDown:function(e){
if(e.keyCode==_fa.ESCAPE&&!(e.ctrlKey||e.altKey||e.metaKey)){
if(has("ie")<9||(has("ie")&&has("quirks"))){
e.preventDefault();
var node=e.srcElement,te=node.ownerDocument.createEventObject();
te.keyCode=_fa.ESCAPE;
te.shiftKey=e.shiftKey;
node.fireEvent("onkeypress",te);
}
}
}});
});
},"dojo/Stateful":function(){
define(["./_base/declare","./_base/lang","./_base/array","dojo/when"],function(_101,lang,_102,when){
return _101("dojo.Stateful",null,{_attrPairNames:{},_getAttrNames:function(name){
var apn=this._attrPairNames;
if(apn[name]){
return apn[name];
}
return (apn[name]={s:"_"+name+"Setter",g:"_"+name+"Getter"});
},postscript:function(_103){
if(_103){
this.set(_103);
}
},_get:function(name,_104){
return typeof this[_104.g]==="function"?this[_104.g]():this[name];
},get:function(name){
return this._get(name,this._getAttrNames(name));
},set:function(name,_105){
if(typeof name==="object"){
for(var x in name){
if(name.hasOwnProperty(x)&&x!="_watchCallbacks"){
this.set(x,name[x]);
}
}
return this;
}
var _106=this._getAttrNames(name),_107=this._get(name,_106),_108=this[_106.s],_109;
if(typeof _108==="function"){
_109=_108.apply(this,Array.prototype.slice.call(arguments,1));
}else{
this[name]=_105;
}
if(this._watchCallbacks){
var self=this;
when(_109,function(){
self._watchCallbacks(name,_107,_105);
});
}
return this;
},_changeAttrValue:function(name,_10a){
var _10b=this.get(name);
this[name]=_10a;
if(this._watchCallbacks){
this._watchCallbacks(name,_10b,_10a);
}
return this;
},watch:function(name,_10c){
var _10d=this._watchCallbacks;
if(!_10d){
var self=this;
_10d=this._watchCallbacks=function(name,_10e,_10f,_110){
var _111=function(_112){
if(_112){
_112=_112.slice();
for(var i=0,l=_112.length;i<l;i++){
_112[i].call(self,name,_10e,_10f);
}
}
};
_111(_10d["_"+name]);
if(!_110){
_111(_10d["*"]);
}
};
}
if(!_10c&&typeof name==="function"){
_10c=name;
name="*";
}else{
name="_"+name;
}
var _113=_10d[name];
if(typeof _113!=="object"){
_113=_10d[name]=[];
}
_113.push(_10c);
var _114={};
_114.unwatch=_114.remove=function(){
var _115=_102.indexOf(_113,_10c);
if(_115>-1){
_113.splice(_115,1);
}
};
return _114;
}});
});
},"dijit/_CssStateMixin":function(){
define("dijit/_CssStateMixin",["dojo/_base/array","dojo/_base/declare","dojo/dom","dojo/dom-class","dojo/has","dojo/_base/lang","dojo/on","dojo/ready","dojo/_base/window","./registry"],function(_116,_117,dom,_118,has,lang,on,_119,win,_11a){
var _11b=_117("dijit._CssStateMixin",[],{cssStateNodes:{},hovering:false,active:false,_applyAttributes:function(){
this.inherited(arguments);
_116.forEach(["disabled","readOnly","checked","selected","focused","state","hovering","active","_opened"],function(attr){
this.watch(attr,lang.hitch(this,"_setStateClass"));
},this);
for(var ap in this.cssStateNodes){
this._trackMouseState(this[ap],this.cssStateNodes[ap]);
}
this._trackMouseState(this.domNode,this.baseClass);
this._setStateClass();
},_cssMouseEvent:function(_11c){
if(!this.disabled){
switch(_11c.type){
case "mouseover":
this._set("hovering",true);
this._set("active",this._mouseDown);
break;
case "mouseout":
this._set("hovering",false);
this._set("active",false);
break;
case "mousedown":
case "touchstart":
this._set("active",true);
break;
case "mouseup":
case "touchend":
this._set("active",false);
break;
}
}
},_setStateClass:function(){
var _11d=this.baseClass.split(" ");
function _11e(_11f){
_11d=_11d.concat(_116.map(_11d,function(c){
return c+_11f;
}),"dijit"+_11f);
};
if(!this.isLeftToRight()){
_11e("Rtl");
}
var _120=this.checked=="mixed"?"Mixed":(this.checked?"Checked":"");
if(this.checked){
_11e(_120);
}
if(this.state){
_11e(this.state);
}
if(this.selected){
_11e("Selected");
}
if(this._opened){
_11e("Opened");
}
if(this.disabled){
_11e("Disabled");
}else{
if(this.readOnly){
_11e("ReadOnly");
}else{
if(this.active){
_11e("Active");
}else{
if(this.hovering){
_11e("Hover");
}
}
}
}
if(this.focused){
_11e("Focused");
}
var tn=this.stateNode||this.domNode,_121={};
_116.forEach(tn.className.split(" "),function(c){
_121[c]=true;
});
if("_stateClasses" in this){
_116.forEach(this._stateClasses,function(c){
delete _121[c];
});
}
_116.forEach(_11d,function(c){
_121[c]=true;
});
var _122=[];
for(var c in _121){
_122.push(c);
}
tn.className=_122.join(" ");
this._stateClasses=_11d;
},_subnodeCssMouseEvent:function(node,_123,evt){
if(this.disabled||this.readOnly){
return;
}
function _124(_125){
_118.toggle(node,_123+"Hover",_125);
};
function _126(_127){
_118.toggle(node,_123+"Active",_127);
};
function _128(_129){
_118.toggle(node,_123+"Focused",_129);
};
switch(evt.type){
case "mouseover":
_124(true);
break;
case "mouseout":
_124(false);
_126(false);
break;
case "mousedown":
case "touchstart":
_126(true);
break;
case "mouseup":
case "touchend":
_126(false);
break;
case "focus":
case "focusin":
_128(true);
break;
case "blur":
case "focusout":
_128(false);
break;
}
},_trackMouseState:function(node,_12a){
node._cssState=_12a;
}});
_119(function(){
function _12b(evt){
if(!dom.isDescendant(evt.relatedTarget,evt.target)){
for(var node=evt.target;node&&node!=evt.relatedTarget;node=node.parentNode){
if(node._cssState){
var _12c=_11a.getEnclosingWidget(node);
if(_12c){
if(node==_12c.domNode){
_12c._cssMouseEvent(evt);
}else{
_12c._subnodeCssMouseEvent(node,node._cssState,evt);
}
}
}
}
}
};
function _12d(evt){
evt.target=evt.srcElement;
_12b(evt);
};
var body=win.body(),_12e=(has("touch")?[]:["mouseover","mouseout"]).concat(["mousedown","touchstart","mouseup","touchend"]);
_116.forEach(_12e,function(type){
if(body.addEventListener){
body.addEventListener(type,_12b,true);
}else{
body.attachEvent("on"+type,_12d);
}
});
on(body,"focusin, focusout",function(evt){
var node=evt.target;
if(node._cssState&&!node.getAttribute("widgetId")){
var _12f=_11a.getEnclosingWidget(node);
_12f._subnodeCssMouseEvent(node,node._cssState,evt);
}
});
});
return _11b;
});
},"dijit/_base/manager":function(){
define("dijit/_base/manager",["dojo/_base/array","dojo/_base/config","dojo/_base/lang","../registry","../main"],function(_130,_131,lang,_132,_133){
var _134={};
_130.forEach(["byId","getUniqueId","findWidgets","_destroyAll","byNode","getEnclosingWidget"],function(name){
_134[name]=_132[name];
});
lang.mixin(_134,{defaultDuration:_131["defaultDuration"]||200});
lang.mixin(_133,_134);
return _133;
});
},"dijit/_base/sniff":function(){
define("dijit/_base/sniff",["dojo/uacss"],function(){
});
},"dijit/BackgroundIframe":function(){
define("dijit/BackgroundIframe",["require","./main","dojo/_base/config","dojo/dom-construct","dojo/dom-style","dojo/_base/lang","dojo/on","dojo/sniff","dojo/_base/window"],function(_135,_136,_137,_138,_139,lang,on,has,win){
var _13a=new function(){
var _13b=[];
this.pop=function(){
var _13c;
if(_13b.length){
_13c=_13b.pop();
_13c.style.display="";
}else{
if(has("ie")<9){
var burl=_137["dojoBlankHtmlUrl"]||_135.toUrl("dojo/resources/blank.html")||"javascript:\"\"";
var html="<iframe src='"+burl+"' role='presentation'"+" style='position: absolute; left: 0px; top: 0px;"+"z-index: -1; filter:Alpha(Opacity=\"0\");'>";
_13c=win.doc.createElement(html);
}else{
_13c=_138.create("iframe");
_13c.src="javascript:\"\"";
_13c.className="dijitBackgroundIframe";
_13c.setAttribute("role","presentation");
_139.set(_13c,"opacity",0.1);
}
_13c.tabIndex=-1;
}
return _13c;
};
this.push=function(_13d){
_13d.style.display="none";
_13b.push(_13d);
};
}();
_136.BackgroundIframe=function(node){
if(!node.id){
throw new Error("no id");
}
if(has("ie")||has("mozilla")){
var _13e=(this.iframe=_13a.pop());
node.appendChild(_13e);
if(has("ie")<7||has("quirks")){
this.resize(node);
this._conn=on(node,"resize",lang.hitch(this,function(){
this.resize(node);
}));
}else{
_139.set(_13e,{width:"100%",height:"100%"});
}
}
};
lang.extend(_136.BackgroundIframe,{resize:function(node){
if(this.iframe){
_139.set(this.iframe,{width:node.offsetWidth+"px",height:node.offsetHeight+"px"});
}
},destroy:function(){
if(this._conn){
this._conn.remove();
this._conn=null;
}
if(this.iframe){
_13a.push(this.iframe);
delete this.iframe;
}
}});
return _136.BackgroundIframe;
});
},"dijit/typematic":function(){
define(["dojo/_base/array","dojo/_base/connect","dojo/_base/event","dojo/_base/kernel","dojo/_base/lang","dojo/on","dojo/sniff","./main"],function(_13f,_140,_141,_142,lang,on,has,_143){
var _144=(_143.typematic={_fireEventAndReload:function(){
this._timer=null;
this._callback(++this._count,this._node,this._evt);
this._currentTimeout=Math.max(this._currentTimeout<0?this._initialDelay:(this._subsequentDelay>1?this._subsequentDelay:Math.round(this._currentTimeout*this._subsequentDelay)),this._minDelay);
this._timer=setTimeout(lang.hitch(this,"_fireEventAndReload"),this._currentTimeout);
},trigger:function(evt,_145,node,_146,obj,_147,_148,_149){
if(obj!=this._obj){
this.stop();
this._initialDelay=_148||500;
this._subsequentDelay=_147||0.9;
this._minDelay=_149||10;
this._obj=obj;
this._node=node;
this._currentTimeout=-1;
this._count=-1;
this._callback=lang.hitch(_145,_146);
this._evt={faux:true};
for(var attr in evt){
if(attr!="layerX"&&attr!="layerY"){
var v=evt[attr];
if(typeof v!="function"&&typeof v!="undefined"){
this._evt[attr]=v;
}
}
}
this._fireEventAndReload();
}
},stop:function(){
if(this._timer){
clearTimeout(this._timer);
this._timer=null;
}
if(this._obj){
this._callback(-1,this._node,this._evt);
this._obj=null;
}
},addKeyListener:function(node,_14a,_14b,_14c,_14d,_14e,_14f){
if(_14a.keyCode){
_14a.charOrCode=_14a.keyCode;
_142.deprecated("keyCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.","","2.0");
}else{
if(_14a.charCode){
_14a.charOrCode=String.fromCharCode(_14a.charCode);
_142.deprecated("charCode attribute parameter for dijit.typematic.addKeyListener is deprecated. Use charOrCode instead.","","2.0");
}
}
var _150=[on(node,_140._keypress,lang.hitch(this,function(evt){
if(evt.charOrCode==_14a.charOrCode&&(_14a.ctrlKey===undefined||_14a.ctrlKey==evt.ctrlKey)&&(_14a.altKey===undefined||_14a.altKey==evt.altKey)&&(_14a.metaKey===undefined||_14a.metaKey==(evt.metaKey||false))&&(_14a.shiftKey===undefined||_14a.shiftKey==evt.shiftKey)){
_141.stop(evt);
_144.trigger(evt,_14b,node,_14c,_14a,_14d,_14e,_14f);
}else{
if(_144._obj==_14a){
_144.stop();
}
}
})),on(node,"keyup",lang.hitch(this,function(){
if(_144._obj==_14a){
_144.stop();
}
}))];
return {remove:function(){
_13f.forEach(_150,function(h){
h.remove();
});
}};
},addMouseListener:function(node,_151,_152,_153,_154,_155){
var _156=[on(node,"mousedown",lang.hitch(this,function(evt){
evt.preventDefault();
_144.trigger(evt,_151,node,_152,node,_153,_154,_155);
})),on(node,"mouseup",lang.hitch(this,function(evt){
if(this._obj){
evt.preventDefault();
}
_144.stop();
})),on(node,"mouseout",lang.hitch(this,function(evt){
if(this._obj){
evt.preventDefault();
}
_144.stop();
})),on(node,"dblclick",lang.hitch(this,function(evt){
evt.preventDefault();
if(has("ie")<9){
_144.trigger(evt,_151,node,_152,node,_153,_154,_155);
setTimeout(lang.hitch(this,_144.stop),50);
}
}))];
return {remove:function(){
_13f.forEach(_156,function(h){
h.remove();
});
}};
},addListener:function(_157,_158,_159,_15a,_15b,_15c,_15d,_15e){
var _15f=[this.addKeyListener(_158,_159,_15a,_15b,_15c,_15d,_15e),this.addMouseListener(_157,_15a,_15b,_15c,_15d,_15e)];
return {remove:function(){
_13f.forEach(_15f,function(h){
h.remove();
});
}};
}});
return _144;
});
},"dojo/_base/url":function(){
define(["./kernel"],function(dojo){
var ore=new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?$"),ire=new RegExp("^((([^\\[:]+):)?([^@]+)@)?(\\[([^\\]]+)\\]|([^\\[:]*))(:([0-9]+))?$"),_160=function(){
var n=null,_161=arguments,uri=[_161[0]];
for(var i=1;i<_161.length;i++){
if(!_161[i]){
continue;
}
var _162=new _160(_161[i]+""),_163=new _160(uri[0]+"");
if(_162.path==""&&!_162.scheme&&!_162.authority&&!_162.query){
if(_162.fragment!=n){
_163.fragment=_162.fragment;
}
_162=_163;
}else{
if(!_162.scheme){
_162.scheme=_163.scheme;
if(!_162.authority){
_162.authority=_163.authority;
if(_162.path.charAt(0)!="/"){
var path=_163.path.substring(0,_163.path.lastIndexOf("/")+1)+_162.path;
var segs=path.split("/");
for(var j=0;j<segs.length;j++){
if(segs[j]=="."){
if(j==segs.length-1){
segs[j]="";
}else{
segs.splice(j,1);
j--;
}
}else{
if(j>0&&!(j==1&&segs[0]=="")&&segs[j]==".."&&segs[j-1]!=".."){
if(j==(segs.length-1)){
segs.splice(j,1);
segs[j-1]="";
}else{
segs.splice(j-1,2);
j-=2;
}
}
}
}
_162.path=segs.join("/");
}
}
}
}
uri=[];
if(_162.scheme){
uri.push(_162.scheme,":");
}
if(_162.authority){
uri.push("//",_162.authority);
}
uri.push(_162.path);
if(_162.query){
uri.push("?",_162.query);
}
if(_162.fragment){
uri.push("#",_162.fragment);
}
}
this.uri=uri.join("");
var r=this.uri.match(ore);
this.scheme=r[2]||(r[1]?"":n);
this.authority=r[4]||(r[3]?"":n);
this.path=r[5];
this.query=r[7]||(r[6]?"":n);
this.fragment=r[9]||(r[8]?"":n);
if(this.authority!=n){
r=this.authority.match(ire);
this.user=r[3]||n;
this.password=r[4]||n;
this.host=r[6]||r[7];
this.port=r[9]||n;
}
};
_160.prototype.toString=function(){
return this.uri;
};
return dojo._Url=_160;
});
},"dojo/date/stamp":function(){
define(["../_base/lang","../_base/array"],function(lang,_164){
var _165={};
lang.setObject("dojo.date.stamp",_165);
_165.fromISOString=function(_166,_167){
if(!_165._isoRegExp){
_165._isoRegExp=/^(?:(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(.\d+)?)?((?:[+-](\d{2}):(\d{2}))|Z)?)?$/;
}
var _168=_165._isoRegExp.exec(_166),_169=null;
if(_168){
_168.shift();
if(_168[1]){
_168[1]--;
}
if(_168[6]){
_168[6]*=1000;
}
if(_167){
_167=new Date(_167);
_164.forEach(_164.map(["FullYear","Month","Date","Hours","Minutes","Seconds","Milliseconds"],function(prop){
return _167["get"+prop]();
}),function(_16a,_16b){
_168[_16b]=_168[_16b]||_16a;
});
}
_169=new Date(_168[0]||1970,_168[1]||0,_168[2]||1,_168[3]||0,_168[4]||0,_168[5]||0,_168[6]||0);
if(_168[0]<100){
_169.setFullYear(_168[0]||1970);
}
var _16c=0,_16d=_168[7]&&_168[7].charAt(0);
if(_16d!="Z"){
_16c=((_168[8]||0)*60)+(Number(_168[9])||0);
if(_16d!="-"){
_16c*=-1;
}
}
if(_16d){
_16c-=_169.getTimezoneOffset();
}
if(_16c){
_169.setTime(_169.getTime()+_16c*60000);
}
}
return _169;
};
_165.toISOString=function(_16e,_16f){
var _170=function(n){
return (n<10)?"0"+n:n;
};
_16f=_16f||{};
var _171=[],_172=_16f.zulu?"getUTC":"get",date="";
if(_16f.selector!="time"){
var year=_16e[_172+"FullYear"]();
date=["0000".substr((year+"").length)+year,_170(_16e[_172+"Month"]()+1),_170(_16e[_172+"Date"]())].join("-");
}
_171.push(date);
if(_16f.selector!="date"){
var time=[_170(_16e[_172+"Hours"]()),_170(_16e[_172+"Minutes"]()),_170(_16e[_172+"Seconds"]())].join(":");
var _173=_16e[_172+"Milliseconds"]();
if(_16f.milliseconds){
time+="."+(_173<100?"0":"")+_170(_173);
}
if(_16f.zulu){
time+="Z";
}else{
if(_16f.selector!="time"){
var _174=_16e.getTimezoneOffset();
var _175=Math.abs(_174);
time+=(_174>0?"-":"+")+_170(Math.floor(_175/60))+":"+_170(_175%60);
}
}
_171.push(time);
}
return _171.join("T");
};
return _165;
});
},"dijit/_base/place":function(){
define("dijit/_base/place",["dojo/_base/array","dojo/_base/lang","dojo/window","../place","../main"],function(_176,lang,_177,_178,_179){
var _17a={};
_17a.getViewport=function(){
return _177.getBox();
};
_17a.placeOnScreen=_178.at;
_17a.placeOnScreenAroundElement=function(node,_17b,_17c,_17d){
var _17e;
if(lang.isArray(_17c)){
_17e=_17c;
}else{
_17e=[];
for(var key in _17c){
_17e.push({aroundCorner:key,corner:_17c[key]});
}
}
return _178.around(node,_17b,_17e,true,_17d);
};
_17a.placeOnScreenAroundNode=_17a.placeOnScreenAroundElement;
_17a.placeOnScreenAroundRectangle=_17a.placeOnScreenAroundElement;
_17a.getPopupAroundAlignment=function(_17f,_180){
var _181={};
_176.forEach(_17f,function(pos){
var ltr=_180;
switch(pos){
case "after":
_181[_180?"BR":"BL"]=_180?"BL":"BR";
break;
case "before":
_181[_180?"BL":"BR"]=_180?"BR":"BL";
break;
case "below-alt":
ltr=!ltr;
case "below":
_181[ltr?"BL":"BR"]=ltr?"TL":"TR";
_181[ltr?"BR":"BL"]=ltr?"TR":"TL";
break;
case "above-alt":
ltr=!ltr;
case "above":
default:
_181[ltr?"TL":"TR"]=ltr?"BL":"BR";
_181[ltr?"TR":"TL"]=ltr?"BR":"BL";
break;
}
});
return _181;
};
lang.mixin(_179,_17a);
return _179;
});
},"dijit/registry":function(){
define("dijit/registry",["dojo/_base/array","dojo/sniff","dojo/_base/unload","dojo/_base/window","./main"],function(_182,has,_183,win,_184){
var _185={},hash={};
var _186={length:0,add:function(_187){
if(hash[_187.id]){
throw new Error("Tried to register widget with id=="+_187.id+" but that id is already registered");
}
hash[_187.id]=_187;
this.length++;
},remove:function(id){
if(hash[id]){
delete hash[id];
this.length--;
}
},byId:function(id){
return typeof id=="string"?hash[id]:id;
},byNode:function(node){
return hash[node.getAttribute("widgetId")];
},toArray:function(){
var ar=[];
for(var id in hash){
ar.push(hash[id]);
}
return ar;
},getUniqueId:function(_188){
var id;
do{
id=_188+"_"+(_188 in _185?++_185[_188]:_185[_188]=0);
}while(hash[id]);
return _184._scopeName=="dijit"?id:_184._scopeName+"_"+id;
},findWidgets:function(root,_189){
var _18a=[];
function _18b(root){
for(var node=root.firstChild;node;node=node.nextSibling){
if(node.nodeType==1){
var _18c=node.getAttribute("widgetId");
if(_18c){
var _18d=hash[_18c];
if(_18d){
_18a.push(_18d);
}
}else{
if(node!==_189){
_18b(node);
}
}
}
}
};
_18b(root);
return _18a;
},_destroyAll:function(){
_184._curFocus=null;
_184._prevFocus=null;
_184._activeStack=[];
_182.forEach(_186.findWidgets(win.body()),function(_18e){
if(!_18e._destroyed){
if(_18e.destroyRecursive){
_18e.destroyRecursive();
}else{
if(_18e.destroy){
_18e.destroy();
}
}
}
});
},getEnclosingWidget:function(node){
while(node){
var id=node.getAttribute&&node.getAttribute("widgetId");
if(id){
return hash[id];
}
node=node.parentNode;
}
return null;
},_hash:hash};
_184.registry=_186;
return _186;
});
},"dijit/form/_FormWidgetMixin":function(){
define("dijit/form/_FormWidgetMixin",["dojo/_base/array","dojo/_base/declare","dojo/dom-attr","dojo/dom-style","dojo/_base/lang","dojo/mouse","dojo/sniff","dojo/window","../a11y"],function(_18f,_190,_191,_192,lang,_193,has,_194,a11y){
return _190("dijit.form._FormWidgetMixin",null,{name:"",alt:"",value:"",type:"text",tabIndex:"0",_setTabIndexAttr:"focusNode",disabled:false,intermediateChanges:false,scrollOnFocus:true,_setIdAttr:"focusNode",_setDisabledAttr:function(_195){
this._set("disabled",_195);
_191.set(this.focusNode,"disabled",_195);
if(this.valueNode){
_191.set(this.valueNode,"disabled",_195);
}
this.focusNode.setAttribute("aria-disabled",_195?"true":"false");
if(_195){
this._set("hovering",false);
this._set("active",false);
var _196="tabIndex" in this.attributeMap?this.attributeMap.tabIndex:("_setTabIndexAttr" in this)?this._setTabIndexAttr:"focusNode";
_18f.forEach(lang.isArray(_196)?_196:[_196],function(_197){
var node=this[_197];
if(has("webkit")||a11y.hasDefaultTabStop(node)){
node.setAttribute("tabIndex","-1");
}else{
node.removeAttribute("tabIndex");
}
},this);
}else{
if(this.tabIndex!=""){
this.set("tabIndex",this.tabIndex);
}
}
},_onFocus:function(by){
if(by=="mouse"&&this.isFocusable()){
var _198=this.connect(this.focusNode,"onfocus",function(){
this.disconnect(_199);
this.disconnect(_198);
});
var _199=this.connect(this.ownerDocumentBody,"onmouseup",function(){
this.disconnect(_199);
this.disconnect(_198);
if(this.focused){
this.focus();
}
});
}
if(this.scrollOnFocus){
this.defer(function(){
_194.scrollIntoView(this.domNode);
});
}
this.inherited(arguments);
},isFocusable:function(){
return !this.disabled&&this.focusNode&&(_192.get(this.domNode,"display")!="none");
},focus:function(){
if(!this.disabled&&this.focusNode.focus){
try{
this.focusNode.focus();
}
catch(e){
}
}
},compare:function(val1,val2){
if(typeof val1=="number"&&typeof val2=="number"){
return (isNaN(val1)&&isNaN(val2))?0:val1-val2;
}else{
if(val1>val2){
return 1;
}else{
if(val1<val2){
return -1;
}else{
return 0;
}
}
}
},onChange:function(){
},_onChangeActive:false,_handleOnChange:function(_19a,_19b){
if(this._lastValueReported==undefined&&(_19b===null||!this._onChangeActive)){
this._resetValue=this._lastValueReported=_19a;
}
this._pendingOnChange=this._pendingOnChange||(typeof _19a!=typeof this._lastValueReported)||(this.compare(_19a,this._lastValueReported)!=0);
if((this.intermediateChanges||_19b||_19b===undefined)&&this._pendingOnChange){
this._lastValueReported=_19a;
this._pendingOnChange=false;
if(this._onChangeActive){
if(this._onChangeHandle){
this._onChangeHandle.remove();
}
this._onChangeHandle=this.defer(function(){
this._onChangeHandle=null;
this.onChange(_19a);
});
}
}
},create:function(){
this.inherited(arguments);
this._onChangeActive=true;
},destroy:function(){
if(this._onChangeHandle){
this._onChangeHandle.remove();
this.onChange(this._lastValueReported);
}
this.inherited(arguments);
}});
});
},"dojo/uacss":function(){
define(["./dom-geometry","./_base/lang","./ready","./sniff","./_base/window"],function(_19c,lang,_19d,has,_19e){
var html=_19e.doc.documentElement,ie=has("ie"),_19f=has("opera"),maj=Math.floor,ff=has("ff"),_1a0=_19c.boxModel.replace(/-/,""),_1a1={"dj_ie":ie,"dj_ie6":maj(ie)==6,"dj_ie7":maj(ie)==7,"dj_ie8":maj(ie)==8,"dj_ie9":maj(ie)==9,"dj_quirks":has("quirks"),"dj_iequirks":ie&&has("quirks"),"dj_opera":_19f,"dj_khtml":has("khtml"),"dj_webkit":has("webkit"),"dj_safari":has("safari"),"dj_chrome":has("chrome"),"dj_gecko":has("mozilla"),"dj_ff3":maj(ff)==3};
_1a1["dj_"+_1a0]=true;
var _1a2="";
for(var clz in _1a1){
if(_1a1[clz]){
_1a2+=clz+" ";
}
}
html.className=lang.trim(html.className+" "+_1a2);
_19d(90,function(){
if(!_19c.isBodyLtr()){
var _1a3="dj_rtl dijitRtl "+_1a2.replace(/ /g,"-rtl ");
html.className=lang.trim(html.className+" "+_1a3+"dj_rtl dijitRtl "+_1a2.replace(/ /g,"-rtl "));
}
});
return has;
});
},"dijit/place":function(){
define("dijit/place",["dojo/_base/array","dojo/dom-geometry","dojo/dom-style","dojo/_base/kernel","dojo/_base/window","dojo/window","./main"],function(_1a4,_1a5,_1a6,_1a7,win,_1a8,_1a9){
function _1aa(node,_1ab,_1ac,_1ad){
var view=_1a8.getBox(node.ownerDocument);
if(!node.parentNode||String(node.parentNode.tagName).toLowerCase()!="body"){
win.body(node.ownerDocument).appendChild(node);
}
var best=null;
_1a4.some(_1ab,function(_1ae){
var _1af=_1ae.corner;
var pos=_1ae.pos;
var _1b0=0;
var _1b1={w:{"L":view.l+view.w-pos.x,"R":pos.x-view.l,"M":view.w}[_1af.charAt(1)],h:{"T":view.t+view.h-pos.y,"B":pos.y-view.t,"M":view.h}[_1af.charAt(0)]};
var s=node.style;
s.left=s.right="auto";
if(_1ac){
var res=_1ac(node,_1ae.aroundCorner,_1af,_1b1,_1ad);
_1b0=typeof res=="undefined"?0:res;
}
var _1b2=node.style;
var _1b3=_1b2.display;
var _1b4=_1b2.visibility;
if(_1b2.display=="none"){
_1b2.visibility="hidden";
_1b2.display="";
}
var bb=_1a5.position(node);
_1b2.display=_1b3;
_1b2.visibility=_1b4;
var _1b5={"L":pos.x,"R":pos.x-bb.w,"M":Math.max(view.l,Math.min(view.l+view.w,pos.x+(bb.w>>1))-bb.w)}[_1af.charAt(1)],_1b6={"T":pos.y,"B":pos.y-bb.h,"M":Math.max(view.t,Math.min(view.t+view.h,pos.y+(bb.h>>1))-bb.h)}[_1af.charAt(0)],_1b7=Math.max(view.l,_1b5),_1b8=Math.max(view.t,_1b6),endX=Math.min(view.l+view.w,_1b5+bb.w),endY=Math.min(view.t+view.h,_1b6+bb.h),_1b9=endX-_1b7,_1ba=endY-_1b8;
_1b0+=(bb.w-_1b9)+(bb.h-_1ba);
if(best==null||_1b0<best.overflow){
best={corner:_1af,aroundCorner:_1ae.aroundCorner,x:_1b7,y:_1b8,w:_1b9,h:_1ba,overflow:_1b0,spaceAvailable:_1b1};
}
return !_1b0;
});
if(best.overflow&&_1ac){
_1ac(node,best.aroundCorner,best.corner,best.spaceAvailable,_1ad);
}
var l=_1a5.isBodyLtr(node.ownerDocument),s=node.style;
s.top=best.y+"px";
s[l?"left":"right"]=(l?best.x:view.w-best.x-best.w)+"px";
s[l?"right":"left"]="auto";
return best;
};
var _1bb={at:function(node,pos,_1bc,_1bd){
var _1be=_1a4.map(_1bc,function(_1bf){
var c={corner:_1bf,pos:{x:pos.x,y:pos.y}};
if(_1bd){
c.pos.x+=_1bf.charAt(1)=="L"?_1bd.x:-_1bd.x;
c.pos.y+=_1bf.charAt(0)=="T"?_1bd.y:-_1bd.y;
}
return c;
});
return _1aa(node,_1be);
},around:function(node,_1c0,_1c1,_1c2,_1c3){
var _1c4=(typeof _1c0=="string"||"offsetWidth" in _1c0)?_1a5.position(_1c0,true):_1c0;
if(_1c0.parentNode){
var _1c5=_1a6.getComputedStyle(_1c0).position=="absolute";
var _1c6=_1c0.parentNode;
while(_1c6&&_1c6.nodeType==1&&_1c6.nodeName!="BODY"){
var _1c7=_1a5.position(_1c6,true),pcs=_1a6.getComputedStyle(_1c6);
if(/relative|absolute/.test(pcs.position)){
_1c5=false;
}
if(!_1c5&&/hidden|auto|scroll/.test(pcs.overflow)){
var _1c8=Math.min(_1c4.y+_1c4.h,_1c7.y+_1c7.h);
var _1c9=Math.min(_1c4.x+_1c4.w,_1c7.x+_1c7.w);
_1c4.x=Math.max(_1c4.x,_1c7.x);
_1c4.y=Math.max(_1c4.y,_1c7.y);
_1c4.h=_1c8-_1c4.y;
_1c4.w=_1c9-_1c4.x;
}
if(pcs.position=="absolute"){
_1c5=true;
}
_1c6=_1c6.parentNode;
}
}
var x=_1c4.x,y=_1c4.y,_1ca="w" in _1c4?_1c4.w:(_1c4.w=_1c4.width),_1cb="h" in _1c4?_1c4.h:(_1a7.deprecated("place.around: dijit/place.__Rectangle: { x:"+x+", y:"+y+", height:"+_1c4.height+", width:"+_1ca+" } has been deprecated.  Please use { x:"+x+", y:"+y+", h:"+_1c4.height+", w:"+_1ca+" }","","2.0"),_1c4.h=_1c4.height);
var _1cc=[];
function push(_1cd,_1ce){
_1cc.push({aroundCorner:_1cd,corner:_1ce,pos:{x:{"L":x,"R":x+_1ca,"M":x+(_1ca>>1)}[_1cd.charAt(1)],y:{"T":y,"B":y+_1cb,"M":y+(_1cb>>1)}[_1cd.charAt(0)]}});
};
_1a4.forEach(_1c1,function(pos){
var ltr=_1c2;
switch(pos){
case "above-centered":
push("TM","BM");
break;
case "below-centered":
push("BM","TM");
break;
case "after-centered":
ltr=!ltr;
case "before-centered":
push(ltr?"ML":"MR",ltr?"MR":"ML");
break;
case "after":
ltr=!ltr;
case "before":
push(ltr?"TL":"TR",ltr?"TR":"TL");
push(ltr?"BL":"BR",ltr?"BR":"BL");
break;
case "below-alt":
ltr=!ltr;
case "below":
push(ltr?"BL":"BR",ltr?"TL":"TR");
push(ltr?"BR":"BL",ltr?"TR":"TL");
break;
case "above-alt":
ltr=!ltr;
case "above":
push(ltr?"TL":"TR",ltr?"BL":"BR");
push(ltr?"TR":"TL",ltr?"BR":"BL");
break;
default:
push(pos.aroundCorner,pos.corner);
}
});
var _1cf=_1aa(node,_1cc,_1c3,{w:_1ca,h:_1cb});
_1cf.aroundNodePos=_1c4;
return _1cf;
}};
return _1a9.place=_1bb;
});
},"dojo/window":function(){
define(["./_base/lang","./sniff","./_base/window","./dom","./dom-geometry","./dom-style"],function(lang,has,_1d0,dom,geom,_1d1){
var _1d2={getBox:function(doc){
doc=doc||_1d0.doc;
var _1d3=(doc.compatMode=="BackCompat")?_1d0.body(doc):doc.documentElement,_1d4=geom.docScroll(doc),w,h;
if(has("touch")){
var _1d5=_1d2.get(doc);
w=_1d5.innerWidth||_1d3.clientWidth;
h=_1d5.innerHeight||_1d3.clientHeight;
}else{
w=_1d3.clientWidth;
h=_1d3.clientHeight;
}
return {l:_1d4.x,t:_1d4.y,w:w,h:h};
},get:function(doc){
if(has("ie")&&_1d2!==document.parentWindow){
doc.parentWindow.execScript("document._parentWindow = window;","Javascript");
var win=doc._parentWindow;
doc._parentWindow=null;
return win;
}
return doc.parentWindow||doc.defaultView;
},scrollIntoView:function(node,pos){
try{
node=dom.byId(node);
var doc=node.ownerDocument||_1d0.doc,body=_1d0.body(doc),html=doc.documentElement||body.parentNode,isIE=has("ie"),isWK=has("webkit");
if((!(has("mozilla")||isIE||isWK||has("opera"))||node==body||node==html)&&(typeof node.scrollIntoView!="undefined")){
node.scrollIntoView(false);
return;
}
var _1d6=doc.compatMode=="BackCompat",_1d7=(isIE>=9&&"frameElement" in node.ownerDocument.parentWindow)?((html.clientHeight>0&&html.clientWidth>0&&(body.clientHeight==0||body.clientWidth==0||body.clientHeight>html.clientHeight||body.clientWidth>html.clientWidth))?html:body):(_1d6?body:html),_1d8=isWK?body:_1d7,_1d9=_1d7.clientWidth,_1da=_1d7.clientHeight,rtl=!geom.isBodyLtr(doc),_1db=pos||geom.position(node),el=node.parentNode,_1dc=function(el){
return ((isIE<=6||(isIE&&_1d6))?false:(_1d1.get(el,"position").toLowerCase()=="fixed"));
};
if(_1dc(node)){
return;
}
while(el){
if(el==body){
el=_1d8;
}
var _1dd=geom.position(el),_1de=_1dc(el);
if(el==_1d8){
_1dd.w=_1d9;
_1dd.h=_1da;
if(_1d8==html&&isIE&&rtl){
_1dd.x+=_1d8.offsetWidth-_1dd.w;
}
if(_1dd.x<0||!isIE){
_1dd.x=0;
}
if(_1dd.y<0||!isIE){
_1dd.y=0;
}
}else{
var pb=geom.getPadBorderExtents(el);
_1dd.w-=pb.w;
_1dd.h-=pb.h;
_1dd.x+=pb.l;
_1dd.y+=pb.t;
var _1df=el.clientWidth,_1e0=_1dd.w-_1df;
if(_1df>0&&_1e0>0){
_1dd.w=_1df;
_1dd.x+=(rtl&&(isIE||el.clientLeft>pb.l))?_1e0:0;
}
_1df=el.clientHeight;
_1e0=_1dd.h-_1df;
if(_1df>0&&_1e0>0){
_1dd.h=_1df;
}
}
if(_1de){
if(_1dd.y<0){
_1dd.h+=_1dd.y;
_1dd.y=0;
}
if(_1dd.x<0){
_1dd.w+=_1dd.x;
_1dd.x=0;
}
if(_1dd.y+_1dd.h>_1da){
_1dd.h=_1da-_1dd.y;
}
if(_1dd.x+_1dd.w>_1d9){
_1dd.w=_1d9-_1dd.x;
}
}
var l=_1db.x-_1dd.x,t=_1db.y-Math.max(_1dd.y,0),r=l+_1db.w-_1dd.w,bot=t+_1db.h-_1dd.h;
if(r*l>0){
var s=Math[l<0?"max":"min"](l,r);
if(rtl&&((isIE==8&&!_1d6)||isIE>=9)){
s=-s;
}
_1db.x+=el.scrollLeft;
el.scrollLeft+=s;
_1db.x-=el.scrollLeft;
}
if(bot*t>0){
_1db.y+=el.scrollTop;
el.scrollTop+=Math[t<0?"max":"min"](t,bot);
_1db.y-=el.scrollTop;
}
el=(el!=_1d8)&&!_1de&&el.parentNode;
}
}
catch(error){
console.error("scrollIntoView: "+error);
node.scrollIntoView(false);
}
}};
1&&lang.setObject("dojo.window",_1d2);
return _1d2;
});
},"dijit/form/_FormValueWidget":function(){
define("dijit/form/_FormValueWidget",["dojo/_base/declare","dojo/sniff","./_FormWidget","./_FormValueMixin"],function(_1e1,has,_1e2,_1e3){
return _1e1("dijit.form._FormValueWidget",[_1e2,_1e3],{_layoutHackIE7:function(){
if(has("ie")==7){
var _1e4=this.domNode;
var _1e5=_1e4.parentNode;
var _1e6=_1e4.firstChild||_1e4;
var _1e7=_1e6.style.filter;
var _1e8=this;
while(_1e5&&_1e5.clientHeight==0){
(function ping(){
var _1e9=_1e8.connect(_1e5,"onscroll",function(){
_1e8.disconnect(_1e9);
_1e6.style.filter=(new Date()).getMilliseconds();
_1e8.defer(function(){
_1e6.style.filter=_1e7;
});
});
})();
_1e5=_1e5.parentNode;
}
}
}});
});
},"dijit/_OnDijitClickMixin":function(){
define("dijit/_OnDijitClickMixin",["dojo/on","dojo/_base/array","dojo/keys","dojo/_base/declare","dojo/has","dojo/_base/unload","dojo/_base/window","./a11yclick"],function(on,_1ea,keys,_1eb,has,_1ec,win,_1ed){
var ret=_1eb("dijit._OnDijitClickMixin",null,{connect:function(obj,_1ee,_1ef){
return this.inherited(arguments,[obj,_1ee=="ondijitclick"?_1ed:_1ee,_1ef]);
}});
ret.a11yclick=_1ed;
return ret;
});
},"dijit/a11yclick":function(){
define("dijit/a11yclick",["dojo/on","dojo/_base/array","dojo/keys","dojo/_base/declare","dojo/has","dojo/_base/unload","dojo/_base/window"],function(on,_1f0,keys,_1f1,has,_1f2,win){
var _1f3=null;
if(has("dom-addeventlistener")){
win.doc.addEventListener("keydown",function(evt){
_1f3=evt.target;
},true);
}else{
(function(){
var _1f4=function(evt){
_1f3=evt.srcElement;
};
win.doc.attachEvent("onkeydown",_1f4);
_1f2.addOnWindowUnload(function(){
win.doc.detachEvent("onkeydown",_1f4);
});
})();
}
function _1f5(e){
return (e.keyCode===keys.ENTER||e.keyCode===keys.SPACE)&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&!e.metaKey;
};
return function(node,_1f6){
if(/input|button/i.test(node.nodeName)){
return on(node,"click",_1f6);
}else{
var _1f7=[on(node,"keydown",function(e){
if(_1f5(e)){
_1f3=e.target;
e.preventDefault();
}
}),on(node,"keyup",function(e){
if(_1f5(e)&&e.target==_1f3){
_1f3=null;
on.emit(e.target,"click",{cancelable:true,bubbles:true});
}
}),on(node,"click",function(e){
_1f6.call(this,e);
})];
if(has("touch")){
var _1f8;
_1f7.push(on(node,"touchend",function(e){
var _1f9=e.target;
_1f8=setTimeout(function(){
_1f8=null;
on.emit(_1f9,"click",{cancelable:true,bubbles:true});
},600);
}),on(node,"click",function(e){
if(_1f8){
clearTimeout(_1f8);
}
}));
}
return {remove:function(){
_1f0.forEach(_1f7,function(h){
h.remove();
});
if(_1f8){
clearTimeout(_1f8);
_1f8=null;
}
}};
}
};
return ret;
});
},"dijit/hccss":function(){
define("dijit/hccss",["dojo/dom-class","dojo/hccss","dojo/ready","dojo/_base/window"],function(_1fa,has,_1fb,win){
_1fb(90,function(){
if(has("highcontrast")){
_1fa.add(win.body(),"dijit_a11y");
}
});
return has;
});
},"dijit/_TemplatedMixin":function(){
define("dijit/_TemplatedMixin",["dojo/_base/lang","dojo/touch","./_WidgetBase","dojo/string","dojo/cache","dojo/_base/array","dojo/_base/declare","dojo/dom-construct","dojo/sniff","dojo/_base/unload"],function(lang,_1fc,_1fd,_1fe,_1ff,_200,_201,_202,has,_203){
var _204=_201("dijit._TemplatedMixin",null,{templateString:null,templatePath:null,_skipNodeCache:false,_earlyTemplatedStartup:false,constructor:function(){
this._attachPoints=[];
this._attachEvents=[];
},_stringRepl:function(tmpl){
var _205=this.declaredClass,_206=this;
return _1fe.substitute(tmpl,this,function(_207,key){
if(key.charAt(0)=="!"){
_207=lang.getObject(key.substr(1),false,_206);
}
if(typeof _207=="undefined"){
throw new Error(_205+" template:"+key);
}
if(_207==null){
return "";
}
return key.charAt(0)=="!"?_207:_207.toString().replace(/"/g,"&quot;");
},this);
},buildRendering:function(){
if(!this.templateString){
this.templateString=_1ff(this.templatePath,{sanitize:true});
}
var _208=_204.getCachedTemplate(this.templateString,this._skipNodeCache,this.ownerDocument);
var node;
if(lang.isString(_208)){
node=_202.toDom(this._stringRepl(_208),this.ownerDocument);
if(node.nodeType!=1){
throw new Error("Invalid template: "+_208);
}
}else{
node=_208.cloneNode(true);
}
this.domNode=node;
this.inherited(arguments);
this._attachTemplateNodes(node,function(n,p){
return n.getAttribute(p);
});
this._beforeFillContent();
this._fillContent(this.srcNodeRef);
},_beforeFillContent:function(){
},_fillContent:function(_209){
var dest=this.containerNode;
if(_209&&dest){
while(_209.hasChildNodes()){
dest.appendChild(_209.firstChild);
}
}
},_attachTemplateNodes:function(_20a,_20b){
var _20c=lang.isArray(_20a)?_20a:(_20a.all||_20a.getElementsByTagName("*"));
var x=lang.isArray(_20a)?0:-1;
for(;x<0||_20c[x];x++){
var _20d=(x==-1)?_20a:_20c[x];
if(this.widgetsInTemplate&&(_20b(_20d,"dojoType")||_20b(_20d,"data-dojo-type"))){
continue;
}
var _20e=_20b(_20d,"dojoAttachPoint")||_20b(_20d,"data-dojo-attach-point");
if(_20e){
var _20f,_210=_20e.split(/\s*,\s*/);
while((_20f=_210.shift())){
if(lang.isArray(this[_20f])){
this[_20f].push(_20d);
}else{
this[_20f]=_20d;
}
this._attachPoints.push(_20f);
}
}
var _211=_20b(_20d,"dojoAttachEvent")||_20b(_20d,"data-dojo-attach-event");
if(_211){
var _212,_213=_211.split(/\s*,\s*/);
var trim=lang.trim;
while((_212=_213.shift())){
if(_212){
var _214=null;
if(_212.indexOf(":")!=-1){
var _215=_212.split(":");
_212=trim(_215[0]);
_214=trim(_215[1]);
}else{
_212=trim(_212);
}
if(!_214){
_214=_212;
}
this._attachEvents.push(this.connect(_20d,_1fc[_212]||_212,_214));
}
}
}
}
},destroyRendering:function(){
_200.forEach(this._attachPoints,function(_216){
delete this[_216];
},this);
this._attachPoints=[];
_200.forEach(this._attachEvents,this.disconnect,this);
this._attachEvents=[];
this.inherited(arguments);
}});
_204._templateCache={};
_204.getCachedTemplate=function(_217,_218,doc){
var _219=_204._templateCache;
var key=_217;
var _21a=_219[key];
if(_21a){
try{
if(!_21a.ownerDocument||_21a.ownerDocument==(doc||document)){
return _21a;
}
}
catch(e){
}
_202.destroy(_21a);
}
_217=_1fe.trim(_217);
if(_218||_217.match(/\$\{([^\}]+)\}/g)){
return (_219[key]=_217);
}else{
var node=_202.toDom(_217,doc);
if(node.nodeType!=1){
throw new Error("Invalid template: "+_217);
}
return (_219[key]=node);
}
};
if(has("ie")){
_203.addOnWindowUnload(function(){
var _21b=_204._templateCache;
for(var key in _21b){
var _21c=_21b[key];
if(typeof _21c=="object"){
_202.destroy(_21c);
}
delete _21b[key];
}
});
}
lang.extend(_1fd,{dojoAttachEvent:"",dojoAttachPoint:""});
return _204;
});
},"dijit/form/_FormWidget":function(){
define("dijit/form/_FormWidget",["dojo/_base/declare","dojo/has","dojo/_base/kernel","dojo/ready","../_Widget","../_CssStateMixin","../_TemplatedMixin","./_FormWidgetMixin"],function(_21d,has,_21e,_21f,_220,_221,_222,_223){
if(has("dijit-legacy-requires")){
_21f(0,function(){
var _224=["dijit/form/_FormValueWidget"];
require(_224);
});
}
return _21d("dijit.form._FormWidget",[_220,_222,_221,_223],{setDisabled:function(_225){
_21e.deprecated("setDisabled("+_225+") is deprecated. Use set('disabled',"+_225+") instead.","","2.0");
this.set("disabled",_225);
},setValue:function(_226){
_21e.deprecated("dijit.form._FormWidget:setValue("+_226+") is deprecated.  Use set('value',"+_226+") instead.","","2.0");
this.set("value",_226);
},getValue:function(){
_21e.deprecated(this.declaredClass+"::getValue() is deprecated. Use get('value') instead.","","2.0");
return this.get("value");
},postMixInProperties:function(){
this.nameAttrSetting=this.name?("name=\""+this.name.replace(/"/g,"&quot;")+"\""):"";
this.inherited(arguments);
},_setTypeAttr:null});
});
},"dijit/_base/focus":function(){
define("dijit/_base/focus",["dojo/_base/array","dojo/dom","dojo/_base/lang","dojo/topic","dojo/_base/window","../focus","../main"],function(_227,dom,lang,_228,win,_229,_22a){
var _22b={_curFocus:null,_prevFocus:null,isCollapsed:function(){
return _22a.getBookmark().isCollapsed;
},getBookmark:function(){
var bm,rg,tg,sel=win.doc.selection,cf=_229.curNode;
if(win.global.getSelection){
sel=win.global.getSelection();
if(sel){
if(sel.isCollapsed){
tg=cf?cf.tagName:"";
if(tg){
tg=tg.toLowerCase();
if(tg=="textarea"||(tg=="input"&&(!cf.type||cf.type.toLowerCase()=="text"))){
sel={start:cf.selectionStart,end:cf.selectionEnd,node:cf,pRange:true};
return {isCollapsed:(sel.end<=sel.start),mark:sel};
}
}
bm={isCollapsed:true};
if(sel.rangeCount){
bm.mark=sel.getRangeAt(0).cloneRange();
}
}else{
rg=sel.getRangeAt(0);
bm={isCollapsed:false,mark:rg.cloneRange()};
}
}
}else{
if(sel){
tg=cf?cf.tagName:"";
tg=tg.toLowerCase();
if(cf&&tg&&(tg=="button"||tg=="textarea"||tg=="input")){
if(sel.type&&sel.type.toLowerCase()=="none"){
return {isCollapsed:true,mark:null};
}else{
rg=sel.createRange();
return {isCollapsed:rg.text&&rg.text.length?false:true,mark:{range:rg,pRange:true}};
}
}
bm={};
try{
rg=sel.createRange();
bm.isCollapsed=!(sel.type=="Text"?rg.htmlText.length:rg.length);
}
catch(e){
bm.isCollapsed=true;
return bm;
}
if(sel.type.toUpperCase()=="CONTROL"){
if(rg.length){
bm.mark=[];
var i=0,len=rg.length;
while(i<len){
bm.mark.push(rg.item(i++));
}
}else{
bm.isCollapsed=true;
bm.mark=null;
}
}else{
bm.mark=rg.getBookmark();
}
}else{
console.warn("No idea how to store the current selection for this browser!");
}
}
return bm;
},moveToBookmark:function(_22c){
var _22d=win.doc,mark=_22c.mark;
if(mark){
if(win.global.getSelection){
var sel=win.global.getSelection();
if(sel&&sel.removeAllRanges){
if(mark.pRange){
var n=mark.node;
n.selectionStart=mark.start;
n.selectionEnd=mark.end;
}else{
sel.removeAllRanges();
sel.addRange(mark);
}
}else{
console.warn("No idea how to restore selection for this browser!");
}
}else{
if(_22d.selection&&mark){
var rg;
if(mark.pRange){
rg=mark.range;
}else{
if(lang.isArray(mark)){
rg=_22d.body.createControlRange();
_227.forEach(mark,function(n){
rg.addElement(n);
});
}else{
rg=_22d.body.createTextRange();
rg.moveToBookmark(mark);
}
}
rg.select();
}
}
}
},getFocus:function(menu,_22e){
var node=!_229.curNode||(menu&&dom.isDescendant(_229.curNode,menu.domNode))?_22a._prevFocus:_229.curNode;
return {node:node,bookmark:node&&(node==_229.curNode)&&win.withGlobal(_22e||win.global,_22a.getBookmark),openedForWindow:_22e};
},_activeStack:[],registerIframe:function(_22f){
return _229.registerIframe(_22f);
},unregisterIframe:function(_230){
_230&&_230.remove();
},registerWin:function(_231,_232){
return _229.registerWin(_231,_232);
},unregisterWin:function(_233){
_233&&_233.remove();
}};
_229.focus=function(_234){
if(!_234){
return;
}
var node="node" in _234?_234.node:_234,_235=_234.bookmark,_236=_234.openedForWindow,_237=_235?_235.isCollapsed:false;
if(node){
var _238=(node.tagName.toLowerCase()=="iframe")?node.contentWindow:node;
if(_238&&_238.focus){
try{
_238.focus();
}
catch(e){
}
}
_229._onFocusNode(node);
}
if(_235&&win.withGlobal(_236||win.global,_22a.isCollapsed)&&!_237){
if(_236){
_236.focus();
}
try{
win.withGlobal(_236||win.global,_22a.moveToBookmark,null,[_235]);
}
catch(e2){
}
}
};
_229.watch("curNode",function(name,_239,_23a){
_22a._curFocus=_23a;
_22a._prevFocus=_239;
if(_23a){
_228.publish("focusNode",_23a);
}
});
_229.watch("activeStack",function(name,_23b,_23c){
_22a._activeStack=_23c;
});
_229.on("widget-blur",function(_23d,by){
_228.publish("widgetBlur",_23d,by);
});
_229.on("widget-focus",function(_23e,by){
_228.publish("widgetFocus",_23e,by);
});
lang.mixin(_22a,_22b);
return _22a;
});
},"dojo/parser":function(){
define(["require","./_base/kernel","./_base/lang","./_base/array","./_base/config","./_base/html","./_base/window","./_base/url","./_base/json","./aspect","./date/stamp","./Deferred","./has","./query","./on","./ready"],function(_23f,dojo,_240,_241,_242,_243,_244,_245,_246,_247,_248,_249,has,_24a,don,_24b){
new Date("X");
var _24c=0;
_247.after(_240,"extend",function(){
_24c++;
},true);
function _24d(ctor){
var map=ctor._nameCaseMap,_24e=ctor.prototype;
if(!map||map._extendCnt<_24c){
map=ctor._nameCaseMap={};
for(var name in _24e){
if(name.charAt(0)==="_"){
continue;
}
map[name.toLowerCase()]=name;
}
map._extendCnt=_24c;
}
return map;
};
var _24f={};
function _250(_251){
var ts=_251.join();
if(!_24f[ts]){
var _252=[];
for(var i=0,l=_251.length;i<l;i++){
var t=_251[i];
_252[_252.length]=(_24f[t]=_24f[t]||(_240.getObject(t)||(~t.indexOf("/")&&_23f(t))));
}
var ctor=_252.shift();
_24f[ts]=_252.length?(ctor.createSubclass?ctor.createSubclass(_252):ctor.extend.apply(ctor,_252)):ctor;
}
return _24f[ts];
};
var _253={_clearCache:function(){
_24c++;
_24f={};
},_functionFromScript:function(_254,_255){
var _256="",_257="",_258=(_254.getAttribute(_255+"args")||_254.getAttribute("args")),_259=_254.getAttribute("with");
var _25a=(_258||"").split(/\s*,\s*/);
if(_259&&_259.length){
_241.forEach(_259.split(/\s*,\s*/),function(part){
_256+="with("+part+"){";
_257+="}";
});
}
return new Function(_25a,_256+_254.innerHTML+_257);
},instantiate:function(_25b,_25c,_25d){
_25c=_25c||{};
_25d=_25d||{};
var _25e=(_25d.scope||dojo._scopeName)+"Type",_25f="data-"+(_25d.scope||dojo._scopeName)+"-",_260=_25f+"type",_261=_25f+"mixins";
var list=[];
_241.forEach(_25b,function(node){
var type=_25e in _25c?_25c[_25e]:node.getAttribute(_260)||node.getAttribute(_25e);
if(type){
var _262=node.getAttribute(_261),_263=_262?[type].concat(_262.split(/\s*,\s*/)):[type];
list.push({node:node,types:_263});
}
});
return this._instantiate(list,_25c,_25d);
},_instantiate:function(_264,_265,_266){
var _267=_241.map(_264,function(obj){
var ctor=obj.ctor||_250(obj.types);
if(!ctor){
throw new Error("Unable to resolve constructor for: '"+obj.types.join()+"'");
}
return this.construct(ctor,obj.node,_265,_266,obj.scripts,obj.inherited);
},this);
if(!_265._started&&!_266.noStart){
_241.forEach(_267,function(_268){
if(typeof _268.startup==="function"&&!_268._started){
_268.startup();
}
});
}
return _267;
},construct:function(ctor,node,_269,_26a,_26b,_26c){
var _26d=ctor&&ctor.prototype;
_26a=_26a||{};
var _26e={};
if(_26a.defaults){
_240.mixin(_26e,_26a.defaults);
}
if(_26c){
_240.mixin(_26e,_26c);
}
var _26f;
if(has("dom-attributes-explicit")){
_26f=node.attributes;
}else{
if(has("dom-attributes-specified-flag")){
_26f=_241.filter(node.attributes,function(a){
return a.specified;
});
}else{
var _270=/^input$|^img$/i.test(node.nodeName)?node:node.cloneNode(false),_271=_270.outerHTML.replace(/=[^\s"']+|="[^"]*"|='[^']*'/g,"").replace(/^\s*<[a-zA-Z0-9]*\s*/,"").replace(/\s*>.*$/,"");
_26f=_241.map(_271.split(/\s+/),function(name){
var _272=name.toLowerCase();
return {name:name,value:(node.nodeName=="LI"&&name=="value")||_272=="enctype"?node.getAttribute(_272):node.getAttributeNode(_272).value};
});
}
}
var _273=_26a.scope||dojo._scopeName,_274="data-"+_273+"-",hash={};
if(_273!=="dojo"){
hash[_274+"props"]="data-dojo-props";
hash[_274+"type"]="data-dojo-type";
hash[_274+"mixins"]="data-dojo-mixins";
hash[_273+"type"]="dojoType";
hash[_274+"id"]="data-dojo-id";
}
var i=0,item,_275=[],_276,_277;
while(item=_26f[i++]){
var name=item.name,_278=name.toLowerCase(),_279=item.value;
switch(hash[_278]||_278){
case "data-dojo-type":
case "dojotype":
case "data-dojo-mixins":
break;
case "data-dojo-props":
_277=_279;
break;
case "data-dojo-id":
case "jsid":
_276=_279;
break;
case "data-dojo-attach-point":
case "dojoattachpoint":
_26e.dojoAttachPoint=_279;
break;
case "data-dojo-attach-event":
case "dojoattachevent":
_26e.dojoAttachEvent=_279;
break;
case "class":
_26e["class"]=node.className;
break;
case "style":
_26e["style"]=node.style&&node.style.cssText;
break;
default:
if(!(name in _26d)){
var map=_24d(ctor);
name=map[_278]||name;
}
if(name in _26d){
switch(typeof _26d[name]){
case "string":
_26e[name]=_279;
break;
case "number":
_26e[name]=_279.length?Number(_279):NaN;
break;
case "boolean":
_26e[name]=_279.toLowerCase()!="false";
break;
case "function":
if(_279===""||_279.search(/[^\w\.]+/i)!=-1){
_26e[name]=new Function(_279);
}else{
_26e[name]=_240.getObject(_279,false)||new Function(_279);
}
_275.push(name);
break;
default:
var pVal=_26d[name];
_26e[name]=(pVal&&"length" in pVal)?(_279?_279.split(/\s*,\s*/):[]):(pVal instanceof Date)?(_279==""?new Date(""):_279=="now"?new Date():_248.fromISOString(_279)):(pVal instanceof _245)?(dojo.baseUrl+_279):_246.fromJson(_279);
}
}else{
_26e[name]=_279;
}
}
}
for(var j=0;j<_275.length;j++){
var _27a=_275[j].toLowerCase();
node.removeAttribute(_27a);
node[_27a]=null;
}
if(_277){
try{
_277=_246.fromJson.call(_26a.propsThis,"{"+_277+"}");
_240.mixin(_26e,_277);
}
catch(e){
throw new Error(e.toString()+" in data-dojo-props='"+_277+"'");
}
}
_240.mixin(_26e,_269);
if(!_26b){
_26b=(ctor&&(ctor._noScript||_26d._noScript)?[]:_24a("> script[type^='dojo/']",node));
}
var _27b=[],_27c=[],_27d=[],ons=[];
if(_26b){
for(i=0;i<_26b.length;i++){
var _27e=_26b[i];
node.removeChild(_27e);
var _27f=(_27e.getAttribute(_274+"event")||_27e.getAttribute("event")),prop=_27e.getAttribute(_274+"prop"),_280=_27e.getAttribute(_274+"method"),_281=_27e.getAttribute(_274+"advice"),_282=_27e.getAttribute("type"),nf=this._functionFromScript(_27e,_274);
if(_27f){
if(_282=="dojo/connect"){
_27b.push({method:_27f,func:nf});
}else{
if(_282=="dojo/on"){
ons.push({event:_27f,func:nf});
}else{
_26e[_27f]=nf;
}
}
}else{
if(_282=="dojo/aspect"){
_27b.push({method:_280,advice:_281,func:nf});
}else{
if(_282=="dojo/watch"){
_27d.push({prop:prop,func:nf});
}else{
_27c.push(nf);
}
}
}
}
}
var _283=ctor.markupFactory||_26d.markupFactory;
var _284=_283?_283(_26e,node,ctor):new ctor(_26e,node);
if(_276){
_240.setObject(_276,_284);
}
for(i=0;i<_27b.length;i++){
_247[_27b[i].advice||"after"](_284,_27b[i].method,_240.hitch(_284,_27b[i].func),true);
}
for(i=0;i<_27c.length;i++){
_27c[i].call(_284);
}
for(i=0;i<_27d.length;i++){
_284.watch(_27d[i].prop,_27d[i].func);
}
for(i=0;i<ons.length;i++){
don(_284,ons[i].event,ons[i].func);
}
return _284;
},scan:function(root,_285){
var list=[],mids=[],_286={};
var _287=(_285.scope||dojo._scopeName)+"Type",_288="data-"+(_285.scope||dojo._scopeName)+"-",_289=_288+"type",_28a=_288+"textdir",_28b=_288+"mixins";
var node=root.firstChild;
var _28c=_285.inherited;
if(!_28c){
function _28d(node,attr){
return (node.getAttribute&&node.getAttribute(attr))||(node.parentNode&&_28d(node.parentNode,attr));
};
_28c={dir:_28d(root,"dir"),lang:_28d(root,"lang"),textDir:_28d(root,_28a)};
for(var key in _28c){
if(!_28c[key]){
delete _28c[key];
}
}
}
var _28e={inherited:_28c};
var _28f;
var _290;
function _291(_292){
if(!_292.inherited){
_292.inherited={};
var node=_292.node,_293=_291(_292.parent);
var _294={dir:node.getAttribute("dir")||_293.dir,lang:node.getAttribute("lang")||_293.lang,textDir:node.getAttribute(_28a)||_293.textDir};
for(var key in _294){
if(_294[key]){
_292.inherited[key]=_294[key];
}
}
}
return _292.inherited;
};
while(true){
if(!node){
if(!_28e||!_28e.node){
break;
}
node=_28e.node.nextSibling;
_290=false;
_28e=_28e.parent;
_28f=_28e.scripts;
continue;
}
if(node.nodeType!=1){
node=node.nextSibling;
continue;
}
if(_28f&&node.nodeName.toLowerCase()=="script"){
type=node.getAttribute("type");
if(type&&/^dojo\/\w/i.test(type)){
_28f.push(node);
}
node=node.nextSibling;
continue;
}
if(_290){
node=node.nextSibling;
continue;
}
var type=node.getAttribute(_289)||node.getAttribute(_287);
var _295=node.firstChild;
if(!type&&(!_295||(_295.nodeType==3&&!_295.nextSibling))){
node=node.nextSibling;
continue;
}
var _296;
var ctor=null;
if(type){
var _297=node.getAttribute(_28b),_298=_297?[type].concat(_297.split(/\s*,\s*/)):[type];
try{
ctor=_250(_298);
}
catch(e){
}
if(!ctor){
_241.forEach(_298,function(t){
if(~t.indexOf("/")&&!_286[t]){
_286[t]=true;
mids[mids.length]=t;
}
});
}
var _299=ctor&&!ctor.prototype._noScript?[]:null;
_296={types:_298,ctor:ctor,parent:_28e,node:node,scripts:_299};
_296.inherited=_291(_296);
list.push(_296);
}else{
_296={node:node,scripts:_28f,parent:_28e};
}
node=_295;
_28f=_299;
_290=ctor&&ctor.prototype.stopParser&&!(_285.template);
_28e=_296;
}
var d=new _249();
if(mids.length){
if(has("dojo-debug-messages")){
console.warn("WARNING: Modules being Auto-Required: "+mids.join(", "));
}
_23f(mids,function(){
d.resolve(_241.filter(list,function(_29a){
if(!_29a.ctor){
try{
_29a.ctor=_250(_29a.types);
}
catch(e){
}
}
var _29b=_29a.parent;
while(_29b&&!_29b.types){
_29b=_29b.parent;
}
var _29c=_29a.ctor&&_29a.ctor.prototype;
_29a.instantiateChildren=!(_29c&&_29c.stopParser&&!(_285.template));
_29a.instantiate=!_29b||(_29b.instantiate&&_29b.instantiateChildren);
return _29a.instantiate;
}));
});
}else{
d.resolve(list);
}
return d.promise;
},_require:function(_29d){
var hash=_246.fromJson("{"+_29d.innerHTML+"}"),vars=[],mids=[],d=new _249();
for(var name in hash){
vars.push(name);
mids.push(hash[name]);
}
_23f(mids,function(){
for(var i=0;i<vars.length;i++){
_240.setObject(vars[i],arguments[i]);
}
d.resolve(arguments);
});
return d.promise;
},_scanAmd:function(root){
var _29e=new _249(),_29f=_29e.promise;
_29e.resolve(true);
var self=this;
_24a("script[type='dojo/require']",root).forEach(function(node){
_29f=_29f.then(function(){
return self._require(node);
});
node.parentNode.removeChild(node);
});
return _29f;
},parse:function(_2a0,_2a1){
var root;
if(!_2a1&&_2a0&&_2a0.rootNode){
_2a1=_2a0;
root=_2a1.rootNode;
}else{
if(_2a0&&_240.isObject(_2a0)&&!("nodeType" in _2a0)){
_2a1=_2a0;
}else{
root=_2a0;
}
}
root=root?_243.byId(root):_244.body();
_2a1=_2a1||{};
var _2a2=_2a1.template?{template:true}:{},_2a3=[],self=this;
var p=this._scanAmd(root,_2a1).then(function(){
return self.scan(root,_2a1);
}).then(function(_2a4){
return _2a3=_2a3.concat(self._instantiate(_2a4,_2a2,_2a1));
}).otherwise(function(e){
console.error("dojo/parser::parse() error",e);
throw e;
});
_240.mixin(_2a3,p);
return _2a3;
}};
if(1){
dojo.parser=_253;
}
if(_242.parseOnLoad){
_24b(100,_253,"parse");
}
return _253;
});
},"dijit/layout/_LayoutWidget":function(){
define("dijit/layout/_LayoutWidget",["dojo/_base/lang","../_Widget","../_Container","../_Contained","../Viewport","dojo/_base/declare","dojo/dom-class","dojo/dom-geometry","dojo/dom-style"],function(lang,_2a5,_2a6,_2a7,_2a8,_2a9,_2aa,_2ab,_2ac){
return _2a9("dijit.layout._LayoutWidget",[_2a5,_2a6,_2a7],{baseClass:"dijitLayoutContainer",isLayoutContainer:true,buildRendering:function(){
this.inherited(arguments);
_2aa.add(this.domNode,"dijitContainer");
},startup:function(){
if(this._started){
return;
}
this.inherited(arguments);
var _2ad=this.getParent&&this.getParent();
if(!(_2ad&&_2ad.isLayoutContainer)){
this.resize();
this.own(_2a8.on("resize",lang.hitch(this,"resize")));
}
},resize:function(_2ae,_2af){
var node=this.domNode;
if(_2ae){
_2ab.setMarginBox(node,_2ae);
}
var mb=_2af||{};
lang.mixin(mb,_2ae||{});
if(!("h" in mb)||!("w" in mb)){
mb=lang.mixin(_2ab.getMarginBox(node),mb);
}
var cs=_2ac.getComputedStyle(node);
var me=_2ab.getMarginExtents(node,cs);
var be=_2ab.getBorderExtents(node,cs);
var bb=(this._borderBox={w:mb.w-(me.w+be.w),h:mb.h-(me.h+be.h)});
var pe=_2ab.getPadExtents(node,cs);
this._contentBox={l:_2ac.toPixelValue(node,cs.paddingLeft),t:_2ac.toPixelValue(node,cs.paddingTop),w:bb.w-pe.w,h:bb.h-pe.h};
this.layout();
},layout:function(){
},_setupChild:function(_2b0){
var cls=this.baseClass+"-child "+(_2b0.baseClass?this.baseClass+"-"+_2b0.baseClass:"");
_2aa.add(_2b0.domNode,cls);
},addChild:function(_2b1,_2b2){
this.inherited(arguments);
if(this._started){
this._setupChild(_2b1);
}
},removeChild:function(_2b3){
var cls=this.baseClass+"-child"+(_2b3.baseClass?" "+this.baseClass+"-"+_2b3.baseClass:"");
_2aa.remove(_2b3.domNode,cls);
this.inherited(arguments);
}});
});
},"dijit/_Widget":function(){
define("dijit/_Widget",["dojo/aspect","dojo/_base/config","dojo/_base/connect","dojo/_base/declare","dojo/has","dojo/_base/kernel","dojo/_base/lang","dojo/query","dojo/ready","./registry","./_WidgetBase","./_OnDijitClickMixin","./_FocusMixin","dojo/uacss","./hccss"],function(_2b4,_2b5,_2b6,_2b7,has,_2b8,lang,_2b9,_2ba,_2bb,_2bc,_2bd,_2be){
function _2bf(){
};
function _2c0(_2c1){
return function(obj,_2c2,_2c3,_2c4){
if(obj&&typeof _2c2=="string"&&obj[_2c2]==_2bf){
return obj.on(_2c2.substring(2).toLowerCase(),lang.hitch(_2c3,_2c4));
}
return _2c1.apply(_2b6,arguments);
};
};
_2b4.around(_2b6,"connect",_2c0);
if(_2b8.connect){
_2b4.around(_2b8,"connect",_2c0);
}
var _2c5=_2b7("dijit._Widget",[_2bc,_2bd,_2be],{onClick:_2bf,onDblClick:_2bf,onKeyDown:_2bf,onKeyPress:_2bf,onKeyUp:_2bf,onMouseDown:_2bf,onMouseMove:_2bf,onMouseOut:_2bf,onMouseOver:_2bf,onMouseLeave:_2bf,onMouseEnter:_2bf,onMouseUp:_2bf,constructor:function(_2c6){
this._toConnect={};
for(var name in _2c6){
if(this[name]===_2bf){
this._toConnect[name.replace(/^on/,"").toLowerCase()]=_2c6[name];
delete _2c6[name];
}
}
},postCreate:function(){
this.inherited(arguments);
for(var name in this._toConnect){
this.on(name,this._toConnect[name]);
}
delete this._toConnect;
},on:function(type,func){
if(this[this._onMap(type)]===_2bf){
return _2b6.connect(this.domNode,type.toLowerCase(),this,func);
}
return this.inherited(arguments);
},_setFocusedAttr:function(val){
this._focused=val;
this._set("focused",val);
},setAttribute:function(attr,_2c7){
_2b8.deprecated(this.declaredClass+"::setAttribute(attr, value) is deprecated. Use set() instead.","","2.0");
this.set(attr,_2c7);
},attr:function(name,_2c8){
if(_2b5.isDebug){
var _2c9=arguments.callee._ach||(arguments.callee._ach={}),_2ca=(arguments.callee.caller||"unknown caller").toString();
if(!_2c9[_2ca]){
_2b8.deprecated(this.declaredClass+"::attr() is deprecated. Use get() or set() instead, called from "+_2ca,"","2.0");
_2c9[_2ca]=true;
}
}
var args=arguments.length;
if(args>=2||typeof name==="object"){
return this.set.apply(this,arguments);
}else{
return this.get(name);
}
},getDescendants:function(){
_2b8.deprecated(this.declaredClass+"::getDescendants() is deprecated. Use getChildren() instead.","","2.0");
return this.containerNode?_2b9("[widgetId]",this.containerNode).map(_2bb.byNode):[];
},_onShow:function(){
this.onShow();
},onShow:function(){
},onHide:function(){
},onClose:function(){
return true;
}});
if(has("dijit-legacy-requires")){
_2ba(0,function(){
var _2cb=["dijit/_base"];
require(_2cb);
});
}
return _2c5;
});
},"dijit/_FocusMixin":function(){
define(["./focus","./_WidgetBase","dojo/_base/declare","dojo/_base/lang"],function(_2cc,_2cd,_2ce,lang){
lang.extend(_2cd,{focused:false,onFocus:function(){
},onBlur:function(){
},_onFocus:function(){
this.onFocus();
},_onBlur:function(){
this.onBlur();
}});
return _2ce("dijit._FocusMixin",null,{_focusManager:_2cc});
});
},"dijit/focus":function(){
define("dijit/focus",["dojo/aspect","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-construct","dojo/Evented","dojo/_base/lang","dojo/on","dojo/ready","dojo/sniff","dojo/Stateful","dojo/_base/unload","dojo/_base/window","dojo/window","./a11y","./registry","./main"],function(_2cf,_2d0,dom,_2d1,_2d2,_2d3,lang,on,_2d4,has,_2d5,_2d6,win,_2d7,a11y,_2d8,_2d9){
var _2da=_2d0([_2d5,_2d3],{curNode:null,activeStack:[],constructor:function(){
var _2db=lang.hitch(this,function(node){
if(dom.isDescendant(this.curNode,node)){
this.set("curNode",null);
}
if(dom.isDescendant(this.prevNode,node)){
this.set("prevNode",null);
}
});
_2cf.before(_2d2,"empty",_2db);
_2cf.before(_2d2,"destroy",_2db);
},registerIframe:function(_2dc){
return this.registerWin(_2dc.contentWindow,_2dc);
},registerWin:function(_2dd,_2de){
var _2df=this;
var _2e0=function(evt){
_2df._justMouseDowned=true;
setTimeout(function(){
_2df._justMouseDowned=false;
},0);
if(has("ie")&&evt&&evt.srcElement&&evt.srcElement.parentNode==null){
return;
}
_2df._onTouchNode(_2de||evt.target||evt.srcElement,"mouse");
};
var doc=has("ie")?_2dd.document.documentElement:_2dd.document;
if(doc){
if(has("ie")){
_2dd.document.body.attachEvent("onmousedown",_2e0);
var _2e1=function(evt){
var tag=evt.srcElement.tagName.toLowerCase();
if(tag=="#document"||tag=="body"){
return;
}
if(a11y.isTabNavigable(evt.srcElement)){
_2df._onFocusNode(_2de||evt.srcElement);
}else{
_2df._onTouchNode(_2de||evt.srcElement);
}
};
doc.attachEvent("onfocusin",_2e1);
var _2e2=function(evt){
_2df._onBlurNode(_2de||evt.srcElement);
};
doc.attachEvent("onfocusout",_2e2);
return {remove:function(){
_2dd.document.detachEvent("onmousedown",_2e0);
doc.detachEvent("onfocusin",_2e1);
doc.detachEvent("onfocusout",_2e2);
doc=null;
}};
}else{
doc.body.addEventListener("mousedown",_2e0,true);
doc.body.addEventListener("touchstart",_2e0,true);
var _2e3=function(evt){
_2df._onFocusNode(_2de||evt.target);
};
doc.addEventListener("focus",_2e3,true);
var _2e4=function(evt){
_2df._onBlurNode(_2de||evt.target);
};
doc.addEventListener("blur",_2e4,true);
return {remove:function(){
doc.body.removeEventListener("mousedown",_2e0,true);
doc.body.removeEventListener("touchstart",_2e0,true);
doc.removeEventListener("focus",_2e3,true);
doc.removeEventListener("blur",_2e4,true);
doc=null;
}};
}
}
},_onBlurNode:function(node){
if(this._clearFocusTimer){
clearTimeout(this._clearFocusTimer);
}
this._clearFocusTimer=setTimeout(lang.hitch(this,function(){
this.set("prevNode",this.curNode);
this.set("curNode",null);
}),0);
if(this._justMouseDowned){
return;
}
if(this._clearActiveWidgetsTimer){
clearTimeout(this._clearActiveWidgetsTimer);
}
this._clearActiveWidgetsTimer=setTimeout(lang.hitch(this,function(){
delete this._clearActiveWidgetsTimer;
this._setStack([]);
}),0);
},_onTouchNode:function(node,by){
if(this._clearActiveWidgetsTimer){
clearTimeout(this._clearActiveWidgetsTimer);
delete this._clearActiveWidgetsTimer;
}
var _2e5=[];
try{
while(node){
var _2e6=_2d1.get(node,"dijitPopupParent");
if(_2e6){
node=_2d8.byId(_2e6).domNode;
}else{
if(node.tagName&&node.tagName.toLowerCase()=="body"){
if(node===win.body()){
break;
}
node=_2d7.get(node.ownerDocument).frameElement;
}else{
var id=node.getAttribute&&node.getAttribute("widgetId"),_2e7=id&&_2d8.byId(id);
if(_2e7&&!(by=="mouse"&&_2e7.get("disabled"))){
_2e5.unshift(id);
}
node=node.parentNode;
}
}
}
}
catch(e){
}
this._setStack(_2e5,by);
},_onFocusNode:function(node){
if(!node){
return;
}
if(node.nodeType==9){
return;
}
if(this._clearFocusTimer){
clearTimeout(this._clearFocusTimer);
delete this._clearFocusTimer;
}
this._onTouchNode(node);
if(node==this.curNode){
return;
}
this.set("prevNode",this.curNode);
this.set("curNode",node);
},_setStack:function(_2e8,by){
var _2e9=this.activeStack;
this.set("activeStack",_2e8);
for(var _2ea=0;_2ea<Math.min(_2e9.length,_2e8.length);_2ea++){
if(_2e9[_2ea]!=_2e8[_2ea]){
break;
}
}
var _2eb;
for(var i=_2e9.length-1;i>=_2ea;i--){
_2eb=_2d8.byId(_2e9[i]);
if(_2eb){
_2eb._hasBeenBlurred=true;
_2eb.set("focused",false);
if(_2eb._focusManager==this){
_2eb._onBlur(by);
}
this.emit("widget-blur",_2eb,by);
}
}
for(i=_2ea;i<_2e8.length;i++){
_2eb=_2d8.byId(_2e8[i]);
if(_2eb){
_2eb.set("focused",true);
if(_2eb._focusManager==this){
_2eb._onFocus(by);
}
this.emit("widget-focus",_2eb,by);
}
}
},focus:function(node){
if(node){
try{
node.focus();
}
catch(e){
}
}
}});
var _2ec=new _2da();
_2d4(function(){
var _2ed=_2ec.registerWin(_2d7.get(win.doc));
if(has("ie")){
_2d6.addOnWindowUnload(function(){
if(_2ed){
_2ed.remove();
_2ed=null;
}
});
}
});
_2d9.focus=function(node){
_2ec.focus(node);
};
for(var attr in _2ec){
if(!/^_/.test(attr)){
_2d9.focus[attr]=typeof _2ec[attr]=="function"?lang.hitch(_2ec,attr):_2ec[attr];
}
}
_2ec.watch(function(attr,_2ee,_2ef){
_2d9.focus[attr]=_2ef;
});
return _2ec;
});
},"dijit/_Contained":function(){
define("dijit/_Contained",["dojo/_base/declare","./registry"],function(_2f0,_2f1){
return _2f0("dijit._Contained",null,{_getSibling:function(_2f2){
var node=this.domNode;
do{
node=node[_2f2+"Sibling"];
}while(node&&node.nodeType!=1);
return node&&_2f1.byNode(node);
},getPreviousSibling:function(){
return this._getSibling("previous");
},getNextSibling:function(){
return this._getSibling("next");
},getIndexInParent:function(){
var p=this.getParent();
if(!p||!p.getIndexOfChild){
return -1;
}
return p.getIndexOfChild(this);
}});
});
},"dijit/_base/scroll":function(){
define("dijit/_base/scroll",["dojo/window","../main"],function(_2f3,_2f4){
_2f4.scrollIntoView=function(node,pos){
_2f3.scrollIntoView(node,pos);
};
});
},"dijit/main":function(){
define("dijit/main",["dojo/_base/kernel"],function(dojo){
return dojo.dijit;
});
},"dijit/Destroyable":function(){
define("dijit/Destroyable",["dojo/_base/array","dojo/aspect","dojo/_base/declare"],function(_2f5,_2f6,_2f7){
return _2f7("dijit.Destroyable",null,{destroy:function(_2f8){
this._destroyed=true;
},own:function(){
_2f5.forEach(arguments,function(_2f9){
var _2fa="destroyRecursive" in _2f9?"destroyRecursive":"destroy" in _2f9?"destroy":"remove";
var odh=_2f6.before(this,"destroy",function(_2fb){
_2f9[_2fa](_2fb);
});
_2f6.after(_2f9,_2fa,function(){
odh.remove();
},true);
},this);
return arguments;
}});
});
},"dojo/cache":function(){
define(["./_base/kernel","./text"],function(dojo){
return dojo.cache;
});
},"dijit/_base/window":function(){
define("dijit/_base/window",["dojo/window","../main"],function(_2fc,_2fd){
_2fd.getDocumentWindow=function(doc){
return _2fc.get(doc);
};
});
},"dijit/_base/typematic":function(){
define(["../typematic"],function(){
});
},"dijit/_base/popup":function(){
define("dijit/_base/popup",["dojo/dom-class","dojo/_base/window","../popup","../BackgroundIframe"],function(_2fe,win,_2ff){
var _300=_2ff._createWrapper;
_2ff._createWrapper=function(_301){
if(!_301.declaredClass){
_301={_popupWrapper:(_301.parentNode&&_2fe.contains(_301.parentNode,"dijitPopup"))?_301.parentNode:null,domNode:_301,destroy:function(){
},ownerDocument:_301.ownerDocument,ownerDocumentBody:win.body(_301.ownerDocument)};
}
return _300.call(this,_301);
};
var _302=_2ff.open;
_2ff.open=function(args){
if(args.orient&&typeof args.orient!="string"&&!("length" in args.orient)){
var ary=[];
for(var key in args.orient){
ary.push({aroundCorner:key,corner:args.orient[key]});
}
args.orient=ary;
}
return _302.call(this,args);
};
return _2ff;
});
},"dijit/_Container":function(){
define("dijit/_Container",["dojo/_base/array","dojo/_base/declare","dojo/dom-construct"],function(_303,_304,_305){
return _304("dijit._Container",null,{buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
},addChild:function(_306,_307){
var _308=this.containerNode;
if(_307&&typeof _307=="number"){
var _309=this.getChildren();
if(_309&&_309.length>=_307){
_308=_309[_307-1].domNode;
_307="after";
}
}
_305.place(_306.domNode,_308,_307);
if(this._started&&!_306._started){
_306.startup();
}
},removeChild:function(_30a){
if(typeof _30a=="number"){
_30a=this.getChildren()[_30a];
}
if(_30a){
var node=_30a.domNode;
if(node&&node.parentNode){
node.parentNode.removeChild(node);
}
}
},hasChildren:function(){
return this.getChildren().length>0;
},_getSiblingOfChild:function(_30b,dir){
var _30c=this.getChildren(),idx=_303.indexOf(this.getChildren(),_30b);
return _30c[idx+dir];
},getIndexOfChild:function(_30d){
return _303.indexOf(this.getChildren(),_30d);
}});
});
}}});
define("dijit/dijit",["./main","./_base","dojo/parser","./_Widget","./_TemplatedMixin","./_Container","./layout/_LayoutWidget","./form/_FormWidget","./form/_FormValueWidget"],function(_30e){
return _30e;
});
