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
require({cache:{"dojox/mobile/EdgeToEdgeList":function(){
define(["dojo/_base/declare","./RoundRectList"],function(_1,_2){
return _1("dojox.mobile.EdgeToEdgeList",_2,{buildRendering:function(){
this.inherited(arguments);
this.domNode.className="mblEdgeToEdgeList";
}});
});
},"dojo/touch":function(){
define(["./_base/kernel","./_base/lang","./aspect","./dom","./on","./has","./mouse","./ready","./_base/window"],function(_3,_4,_5,_6,on,_7,_8,_9,_a){
var _b=_7("touch");
var _c=false;
if(_7("ios")){
var ua=navigator.userAgent;
var v=ua.match(/OS ([\d_]+)/)?RegExp.$1:"1";
var os=parseFloat(v.replace(/_/,".").replace(/_/g,""));
_c=os<5;
}
var _d,_e;
if(_b){
_9(function(){
_e=_a.body();
_a.doc.addEventListener("touchstart",function(_f){
var _10=_e;
_e=_f.target;
on.emit(_10,"dojotouchout",{target:_10,relatedTarget:_e,bubbles:true});
on.emit(_e,"dojotouchover",{target:_e,relatedTarget:_10,bubbles:true});
},true);
on(_a.doc,"touchmove",function(evt){
var _11=_a.doc.elementFromPoint(evt.pageX-(_c?0:_a.global.pageXOffset),evt.pageY-(_c?0:_a.global.pageYOffset));
if(_11&&_e!==_11){
on.emit(_e,"dojotouchout",{target:_e,relatedTarget:_11,bubbles:true});
on.emit(_11,"dojotouchover",{target:_11,relatedTarget:_e,bubbles:true});
_e=_11;
}
});
});
_d=function(_12,_13){
return on(_a.doc,"touchmove",function(evt){
if(_12===_a.doc||_6.isDescendant(_e,_12)){
_13.call(this,_4.mixin({},evt,{target:_e,touches:evt.touches,preventDefault:function(){
evt.preventDefault();
},stopPropagation:function(){
evt.stopPropagation();
}}));
}
});
};
}
function _14(_15){
return function(_16,_17){
return on(_16,_15,_17);
};
};
var _18={press:_14(_b?"touchstart":"mousedown"),move:_b?_d:_14("mousemove"),release:_14(_b?"touchend":"mouseup"),cancel:_b?_14("touchcancel"):_8.leave,over:_14(_b?"dojotouchover":"mouseover"),out:_14(_b?"dojotouchout":"mouseout"),enter:_8._eventHandler(_b?"dojotouchover":"mouseover"),leave:_8._eventHandler(_b?"dojotouchout":"mouseout")};
1&&(_3.touch=_18);
return _18;
});
},"dojox/mobile/iconUtils":function(){
define(["dojo/_base/array","dojo/_base/config","dojo/_base/connect","dojo/_base/event","dojo/_base/lang","dojo/_base/window","dojo/dom-class","dojo/dom-construct","dojo/dom-style","./sniff"],function(_19,_1a,_1b,_1c,_1d,win,_1e,_1f,_20,has){
var dm=_1d.getObject("dojox.mobile",true);
var _21=function(){
this.setupSpriteIcon=function(_22,_23){
if(_22&&_23){
var arr=_19.map(_23.split(/[ ,]/),function(_24){
return _24-0;
});
var t=arr[0];
var r=arr[1]+arr[2];
var b=arr[0]+arr[3];
var l=arr[1];
_20.set(_22,{clip:"rect("+t+"px "+r+"px "+b+"px "+l+"px)",top:(_22.parentNode?_20.get(_22,"top"):0)-t+"px",left:-l+"px"});
_1e.add(_22,"mblSpriteIcon");
}
};
this.createDomButton=function(_25,_26,_27){
if(!this._domButtons){
if(has("webkit")){
var _28=function(_29,dic){
var i,j;
if(!_29){
var _2a={};
var ss=win.doc.styleSheets;
for(i=0;i<ss.length;i++){
ss[i]&&_28(ss[i],_2a);
}
return _2a;
}
var _2b=_29.cssRules||[];
for(i=0;i<_2b.length;i++){
var _2c=_2b[i];
if(_2c.href&&_2c.styleSheet){
_28(_2c.styleSheet,dic);
}else{
if(_2c.selectorText){
var _2d=_2c.selectorText.split(/,/);
for(j=0;j<_2d.length;j++){
var sel=_2d[j];
var n=sel.split(/>/).length-1;
if(sel.match(/(mblDomButton\w+)/)){
var cls=RegExp.$1;
if(!dic[cls]||n>dic[cls]){
dic[cls]=n;
}
}
}
}
}
}
return dic;
};
this._domButtons=_28();
}else{
this._domButtons={};
}
}
var s=_25.className;
var _2e=_27||_25;
if(s.match(/(mblDomButton\w+)/)&&s.indexOf("/")===-1){
var _2f=RegExp.$1;
var _30=4;
if(s.match(/(mblDomButton\w+_(\d+))/)){
_30=RegExp.$2-0;
}else{
if(this._domButtons[_2f]!==undefined){
_30=this._domButtons[_2f];
}
}
var _31=null;
if(has("bb")&&_1a["mblBBBoxShadowWorkaround"]!==false){
_31={style:"-webkit-box-shadow:none"};
}
for(var i=0,p=_2e;i<_30;i++){
p=p.firstChild||_1f.create("div",_31,p);
}
if(_27){
setTimeout(function(){
_1e.remove(_25,_2f);
},0);
_1e.add(_27,_2f);
}
}else{
if(s.indexOf(".")!==-1){
_1f.create("img",{src:s},_2e);
}else{
return null;
}
}
_1e.add(_2e,"mblDomButton");
!!_26&&_20.set(_2e,_26);
return _2e;
};
this.createIcon=function(_32,_33,_34,_35,_36,_37,pos){
_35=_35||"";
if(_32&&_32.indexOf("mblDomButton")===0){
if(!_34){
_34=_1f.create("div",null,_37||_36,pos);
}else{
if(_34.className.match(/(mblDomButton\w+)/)){
_1e.remove(_34,RegExp.$1);
}
}
_34.title=_35;
_1e.add(_34,_32);
this.createDomButton(_34);
}else{
if(_32&&_32!=="none"){
if(!_34||_34.nodeName!=="IMG"){
_34=_1f.create("img",{alt:_35},_37||_36,pos);
}
_34.src=(_32||"").replace("${theme}",dm.currentTheme);
this.setupSpriteIcon(_34,_33);
if(_33&&_36){
var arr=_33.split(/[ ,]/);
_20.set(_36,{width:arr[2]+"px",height:arr[3]+"px"});
_1e.add(_36,"mblSpriteIconParent");
}
_1b.connect(_34,"ondragstart",_1c,"stop");
}
}
return _34;
};
this.iconWrapper=false;
this.setIcon=function(_38,_39,_3a,alt,_3b,_3c,pos){
if(!_3b||!_38&&!_3a){
return null;
}
if(_38&&_38!=="none"){
if(!this.iconWrapper&&_38.indexOf("mblDomButton")!==0&&!_39){
if(_3a&&_3a.tagName==="DIV"){
_1f.destroy(_3a);
_3a=null;
}
_3a=this.createIcon(_38,null,_3a,alt,_3b,_3c,pos);
_1e.add(_3a,"mblImageIcon");
}else{
if(_3a&&_3a.tagName==="IMG"){
_1f.destroy(_3a);
_3a=null;
}
_3a&&_1f.empty(_3a);
if(!_3a){
_3a=_1f.create("div",null,_3c||_3b,pos);
}
this.createIcon(_38,_39,null,null,_3a);
if(alt){
_3a.title=alt;
}
}
_1e.remove(_3b,"mblNoIcon");
return _3a;
}else{
_1f.destroy(_3a);
_1e.add(_3b,"mblNoIcon");
return null;
}
};
};
return new _21();
});
},"dojox/mobile/uacss":function(){
define("dojox/mobile/uacss",["dojo/_base/kernel","dojo/_base/lang","dojo/_base/window","./sniff"],function(_3d,_3e,win,has){
var _3f=win.doc.documentElement;
_3f.className=_3e.trim(_3f.className+" "+[has("bb")?"dj_bb":"",has("android")?"dj_android":"",has("iphone")?"dj_iphone":"",has("ipod")?"dj_ipod":"",has("ipad")?"dj_ipad":""].join(" ").replace(/ +/g," "));
return _3d;
});
},"dojox/mobile/Pane":function(){
define(["dojo/_base/array","dojo/_base/declare","dijit/_Contained","dijit/_WidgetBase"],function(_40,_41,_42,_43){
return _41("dojox.mobile.Pane",[_43,_42],{baseClass:"mblPane",buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
},resize:function(){
_40.forEach(this.getChildren(),function(_44){
if(_44.resize){
_44.resize();
}
});
}});
});
},"dojox/mobile/RoundRect":function(){
define(["dojo/_base/declare","dojo/dom-class","./Container"],function(_45,_46,_47){
return _45("dojox.mobile.RoundRect",_47,{shadow:false,baseClass:"mblRoundRect",buildRendering:function(){
this.inherited(arguments);
if(this.shadow){
_46.add(this.domNode,"mblShadow");
}
}});
});
},"dojox/mobile/ListItem":function(){
define("dojox/mobile/ListItem",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/dom-class","dojo/dom-construct","dojo/dom-style","dijit/registry","dijit/_WidgetBase","./iconUtils","./_ItemBase","./ProgressIndicator"],function(_48,_49,_4a,_4b,_4c,_4d,_4e,_4f,_50,_51,_52){
var _53=_49("dojox.mobile.ListItem",_51,{rightText:"",rightIcon:"",rightIcon2:"",deleteIcon:"",anchorLabel:false,noArrow:false,checked:false,arrowClass:"",checkClass:"",uncheckClass:"",variableHeight:false,rightIconTitle:"",rightIcon2Title:"",header:false,tag:"li",busy:false,progStyle:"",paramsToInherit:"variableHeight,transition,deleteIcon,icon,rightIcon,rightIcon2,uncheckIcon,arrowClass,checkClass,uncheckClass,deleteIconTitle,deleteIconRole",baseClass:"mblListItem",_selStartMethod:"touch",_selEndMethod:"timer",_delayedSelection:true,_selClass:"mblListItemSelected",buildRendering:function(){
this.domNode=this.containerNode=this.srcNodeRef||_4c.create(this.tag);
this.inherited(arguments);
if(this.selected){
_4b.add(this.domNode,this._selClass);
}
if(this.header){
_4b.replace(this.domNode,"mblEdgeToEdgeCategory",this.baseClass);
}
this.labelNode=_4c.create("div",{className:"mblListItemLabel"});
var ref=this.srcNodeRef;
if(ref&&ref.childNodes.length===1&&ref.firstChild.nodeType===3){
this.labelNode.appendChild(ref.firstChild);
}
this.domNode.appendChild(this.labelNode);
if(this.anchorLabel){
this.labelNode.style.display="inline";
this.labelNode.style.cursor="pointer";
this._anchorClickHandle=this.connect(this.labelNode,"onclick","_onClick");
this.onTouchStart=function(e){
return (e.target!==this.labelNode);
};
}
this._layoutChildren=[];
},startup:function(){
if(this._started){
return;
}
var _54=this.getParent();
var _55=this.getTransOpts();
if(_55.moveTo||_55.href||_55.url||this.clickable||(_54&&_54.select)){
this._keydownHandle=this.connect(this.domNode,"onkeydown","_onClick");
}else{
this._handleClick=false;
}
this.inherited(arguments);
if(_4b.contains(this.domNode,"mblVariableHeight")){
this.variableHeight=true;
}
if(this.variableHeight){
_4b.add(this.domNode,"mblVariableHeight");
this.defer(_4a.hitch(this,"layoutVariableHeight"),0);
}
if(!this._isOnLine){
this._isOnLine=true;
this.set({icon:this.icon,deleteIcon:this.deleteIcon,rightIcon:this.rightIcon,rightIcon2:this.rightIcon2});
}
if(_54&&_54.select){
this.set("checked",this.checked);
}
this.setArrow();
this.layoutChildren();
},layoutChildren:function(){
var _56;
_48.forEach(this.domNode.childNodes,function(n){
if(n.nodeType!==1){
return;
}
var _57=n.getAttribute("layout")||(_4e.byNode(n)||{}).layout;
if(_57){
_4b.add(n,"mblListItemLayout"+_57.charAt(0).toUpperCase()+_57.substring(1));
this._layoutChildren.push(n);
if(_57==="center"){
_56=n;
}
}
},this);
if(_56){
this.domNode.insertBefore(_56,this.domNode.firstChild);
}
},resize:function(){
if(this.variableHeight){
this.layoutVariableHeight();
}
this.labelNode.style.display=this.labelNode.firstChild?"block":"inline";
},_onTouchStart:function(e){
if(e.target.getAttribute("preventTouch")||(_4e.getEnclosingWidget(e.target)||{}).preventTouch){
return;
}
this.inherited(arguments);
},_onClick:function(e){
if(this.getParent().isEditing||e&&e.type==="keydown"&&e.keyCode!==13){
return;
}
if(this.onClick(e)===false){
return;
}
var n=this.labelNode;
if(this.anchorLabel&&e.currentTarget===n){
_4b.add(n,"mblListItemLabelSelected");
setTimeout(function(){
_4b.remove(n,"mblListItemLabelSelected");
},this._duration);
this.onAnchorLabelClicked(e);
return;
}
var _58=this.getParent();
if(_58.select){
if(_58.select==="single"){
if(!this.checked){
this.set("checked",true);
}
}else{
if(_58.select==="multiple"){
this.set("checked",!this.checked);
}
}
}
this.defaultClickAction(e);
},onClick:function(){
},onAnchorLabelClicked:function(e){
},layoutVariableHeight:function(){
var h=this.domNode.offsetHeight;
if(h===this.domNodeHeight){
return;
}
this.domNodeHeight=h;
_48.forEach(this._layoutChildren.concat([this.rightTextNode,this.rightIcon2Node,this.rightIconNode,this.uncheckIconNode,this.iconNode,this.deleteIconNode,this.knobIconNode]),function(n){
if(n){
var _59=this.domNode;
var f=function(){
var t=Math.round((_59.offsetHeight-n.offsetHeight)/2)-_4d.get(_59,"paddingTop");
n.style.marginTop=t+"px";
};
if(n.offsetHeight===0&&n.tagName==="IMG"){
n.onload=f;
}else{
f();
}
}
},this);
},setArrow:function(){
if(this.checked){
return;
}
var c="";
var _5a=this.getParent();
var _5b=this.getTransOpts();
if(_5b.moveTo||_5b.href||_5b.url||this.clickable){
if(!this.noArrow&&!(_5a&&_5a.selectOne)){
c=this.arrowClass||"mblDomButtonArrow";
}
}
if(c){
this._setRightIconAttr(c);
}
},_findRef:function(_5c){
var i,_5d,_5e=["deleteIcon","icon","rightIcon","uncheckIcon","rightIcon2","rightText"];
for(i=_48.indexOf(_5e,_5c)+1;i<_5e.length;i++){
_5d=this[_5e[i]+"Node"];
if(_5d){
return _5d;
}
}
for(i=_5e.length-1;i>=0;i--){
_5d=this[_5e[i]+"Node"];
if(_5d){
return _5d.nextSibling;
}
}
return this.domNode.firstChild;
},_setIcon:function(_5f,_60){
if(!this._isOnLine){
return;
}
this._set(_60,_5f);
this[_60+"Node"]=_50.setIcon(_5f,this[_60+"Pos"],this[_60+"Node"],this[_60+"Title"]||this.alt,this.domNode,this._findRef(_60),"before");
if(this[_60+"Node"]){
var cap=_60.charAt(0).toUpperCase()+_60.substring(1);
_4b.add(this[_60+"Node"],"mblListItem"+cap);
}
var _61=this[_60+"Role"];
if(_61){
this[_60+"Node"].setAttribute("role",_61);
}
},_setDeleteIconAttr:function(_62){
this._setIcon(_62,"deleteIcon");
},_setIconAttr:function(_63){
this._setIcon(_63,"icon");
},_setRightTextAttr:function(_64){
if(!this.rightTextNode){
this.rightTextNode=_4c.create("div",{className:"mblListItemRightText"},this.labelNode,"before");
}
this.rightText=_64;
this.rightTextNode.innerHTML=this._cv?this._cv(_64):_64;
},_setRightIconAttr:function(_65){
this._setIcon(_65,"rightIcon");
},_setUncheckIconAttr:function(_66){
this._setIcon(_66,"uncheckIcon");
},_setRightIcon2Attr:function(_67){
this._setIcon(_67,"rightIcon2");
},_setCheckedAttr:function(_68){
if(!this._isOnLine){
return;
}
var _69=this.getParent();
if(_69&&_69.select==="single"&&_68){
_48.forEach(_69.getChildren(),function(_6a){
_6a!==this&&_6a.checked&&_6a.set("checked",false);
},this);
}
this._setRightIconAttr(this.checkClass||"mblDomButtonCheck");
this._setUncheckIconAttr(this.uncheckClass);
_4b.toggle(this.domNode,"mblListItemChecked",_68);
_4b.toggle(this.domNode,"mblListItemUnchecked",!_68);
_4b.toggle(this.domNode,"mblListItemHasUncheck",!!this.uncheckIconNode);
this.rightIconNode.style.position=(this.uncheckIconNode&&!_68)?"absolute":"";
if(_69&&this.checked!==_68){
_69.onCheckStateChanged(this,_68);
}
this._set("checked",_68);
},_setBusyAttr:function(_6b){
var _6c=this._prog;
if(_6b){
if(!this._progNode){
this._progNode=_4c.create("div",{className:"mblListItemIcon"});
_6c=this._prog=new _52({size:25,center:false});
_4b.add(_6c.domNode,this.progStyle);
this._progNode.appendChild(_6c.domNode);
}
if(this.iconNode){
this.domNode.replaceChild(this._progNode,this.iconNode);
}else{
_4c.place(this._progNode,this._findRef("icon"),"before");
}
_6c.start();
}else{
if(this.iconNode){
this.domNode.replaceChild(this.iconNode,this._progNode);
}else{
this.domNode.removeChild(this._progNode);
}
_6c.stop();
}
this._set("busy",_6b);
},_setSelectedAttr:function(_6d){
this.inherited(arguments);
_4b.toggle(this.domNode,this._selClass,_6d);
}});
_53.ChildWidgetProperties={layout:"",preventTouch:false};
_4a.extend(_4f,_53.ChildWidgetProperties);
return _53;
});
},"dojox/mobile/TransitionEvent":function(){
define(["dojo/_base/declare","dojo/_base/Deferred","dojo/_base/lang","dojo/on","./transition"],function(_6e,_6f,_70,on,_71){
return _6e("dojox.mobile.TransitionEvent",null,{constructor:function(_72,_73,_74){
this.transitionOptions=_73;
this.target=_72;
this.triggerEvent=_74||null;
},dispatch:function(){
var _75={bubbles:true,cancelable:true,detail:this.transitionOptions,triggerEvent:this.triggerEvent};
var evt=on.emit(this.target,"startTransition",_75);
if(evt){
_6f.when(_71,_70.hitch(this,function(_76){
_6f.when(_76.call(this,evt),_70.hitch(this,function(_77){
this.endTransition(_77);
}));
}));
}
},endTransition:function(_78){
on.emit(this.target,"endTransition",{detail:_78.transitionOptions});
}});
});
},"dijit/_Contained":function(){
define(["dojo/_base/declare","./registry"],function(_79,_7a){
return _79("dijit._Contained",null,{_getSibling:function(_7b){
var _7c=this.domNode;
do{
_7c=_7c[_7b+"Sibling"];
}while(_7c&&_7c.nodeType!=1);
return _7c&&_7a.byNode(_7c);
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
},"dojox/mobile/sniff":function(){
define(["dojo/_base/window","dojo/_base/sniff"],function(win,has){
var ua=navigator.userAgent;
has.add("bb",ua.indexOf("BlackBerry")>=0&&parseFloat(ua.split("Version/")[1])||undefined,undefined,true);
has.add("android",parseFloat(ua.split("Android ")[1])||undefined,undefined,true);
if(ua.match(/(iPhone|iPod|iPad)/)){
var p=RegExp.$1.replace(/P/,"p");
var v=ua.match(/OS ([\d_]+)/)?RegExp.$1:"1";
var os=parseFloat(v.replace(/_/,".").replace(/_/g,""));
has.add(p,os,undefined,true);
has.add("iphone",os,undefined,true);
}
if(has("webkit")){
has.add("touch",(typeof win.doc.documentElement.ontouchstart!="undefined"&&navigator.appVersion.indexOf("Mobile")!=-1)||!!has("android"),undefined,true);
}
return has;
});
},"dojox/mobile/_ItemBase":function(){
define("dojox/mobile/_ItemBase",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/_base/window","dojo/dom-class","dojo/touch","dijit/registry","dijit/_Contained","dijit/_Container","dijit/_WidgetBase","./TransitionEvent","./iconUtils"],function(_7d,_7e,_7f,win,_80,_81,_82,_83,_84,_85,_86,_87){
return _7e("dojox.mobile._ItemBase",[_85,_84,_83],{icon:"",iconPos:"",alt:"",href:"",hrefTarget:"",moveTo:"",scene:"",clickable:false,url:"",urlTarget:"",back:false,transition:"",transitionDir:1,transitionOptions:null,callback:null,label:"",toggle:false,selected:false,tabIndex:"0",_setTabIndexAttr:"",paramsToInherit:"transition,icon",_selStartMethod:"none",_selEndMethod:"none",_delayedSelection:false,_duration:800,_handleClick:true,buildRendering:function(){
this.inherited(arguments);
this._isOnLine=this.inheritParams();
},startup:function(){
if(this._started){
return;
}
if(!this._isOnLine){
this.inheritParams();
}
if(this._handleClick&&this._selStartMethod==="touch"){
this._onTouchStartHandle=this.connect(this.domNode,_81.press,"_onTouchStart");
}
this.inherited(arguments);
},inheritParams:function(){
var _88=this.getParent();
if(_88){
_7d.forEach(this.paramsToInherit.split(/,/),function(p){
if(p.match(/icon/i)){
var _89=p+"Base",pos=p+"Pos";
if(this[p]&&_88[_89]&&_88[_89].charAt(_88[_89].length-1)==="/"){
this[p]=_88[_89]+this[p];
}
if(!this[p]){
this[p]=_88[_89];
}
if(!this[pos]){
this[pos]=_88[pos];
}
}
if(!this[p]){
this[p]=_88[p];
}
},this);
}
return !!_88;
},getTransOpts:function(){
var _8a=this.transitionOptions||{};
_7d.forEach(["moveTo","href","hrefTarget","url","target","urlTarget","scene","transition","transitionDir"],function(p){
_8a[p]=_8a[p]||this[p];
},this);
return _8a;
},userClickAction:function(){
},defaultClickAction:function(e){
this.handleSelection(e);
if(this.userClickAction(e)===false){
return;
}
this.makeTransition(e);
},handleSelection:function(e){
if(this._delayedSelection){
this.set("selected",true);
}
if(this._onTouchEndHandle){
this.disconnect(this._onTouchEndHandle);
this._onTouchEndHandle=null;
}
var p=this.getParent();
if(this.toggle){
this.set("selected",!this._currentSel);
}else{
if(p&&p.selectOne){
this.set("selected",true);
}else{
if(this._selEndMethod==="touch"){
this.set("selected",false);
}else{
if(this._selEndMethod==="timer"){
var _8b=this;
this.defer(function(){
_8b.set("selected",false);
},this._duration);
}
}
}
}
},makeTransition:function(e){
if(this.back&&history){
history.back();
return;
}
if(this.href&&this.hrefTarget){
win.global.open(this.href,this.hrefTarget||"_blank");
this._onNewWindowOpened(e);
return;
}
var _8c=this.getTransOpts();
var _8d=!!(_8c.moveTo||_8c.href||_8c.url||_8c.target||_8c.scene);
if(this._prepareForTransition(e,_8d?_8c:null)===false){
return;
}
if(_8d){
this.setTransitionPos(e);
new _86(this.domNode,_8c,e).dispatch();
}
},_onNewWindowOpened:function(){
},_prepareForTransition:function(e,_8e){
},_onTouchStart:function(e){
if(this.getParent().isEditing||this.onTouchStart(e)===false){
return;
}
if(!this._onTouchEndHandle&&this._selStartMethod==="touch"){
this._onTouchMoveHandle=this.connect(win.body(),_81.move,"_onTouchMove");
this._onTouchEndHandle=this.connect(win.body(),_81.release,"_onTouchEnd");
}
this.touchStartX=e.touches?e.touches[0].pageX:e.clientX;
this.touchStartY=e.touches?e.touches[0].pageY:e.clientY;
this._currentSel=this.selected;
if(this._delayedSelection){
this._selTimer=setTimeout(_7f.hitch(this,function(){
this.set("selected",true);
}),100);
}else{
this.set("selected",true);
}
},onTouchStart:function(){
},_onTouchMove:function(e){
var x=e.touches?e.touches[0].pageX:e.clientX;
var y=e.touches?e.touches[0].pageY:e.clientY;
if(Math.abs(x-this.touchStartX)>=4||Math.abs(y-this.touchStartY)>=4){
this.cancel();
var p=this.getParent();
if(p&&p.selectOne){
this._prevSel&&this._prevSel.set("selected",true);
}else{
this.set("selected",false);
}
}
},_disconnect:function(){
this.disconnect(this._onTouchMoveHandle);
this.disconnect(this._onTouchEndHandle);
this._onTouchMoveHandle=this._onTouchEndHandle=null;
},cancel:function(){
if(this._selTimer){
clearTimeout(this._selTimer);
this._selTimer=null;
}
this._disconnect();
},_onTouchEnd:function(e){
if(!this._selTimer&&this._delayedSelection){
return;
}
this.cancel();
this._onClick(e);
},setTransitionPos:function(e){
var w=this;
while(true){
w=w.getParent();
if(!w||_80.contains(w.domNode,"mblView")){
break;
}
}
if(w){
w.clickedPosX=e.clientX;
w.clickedPosY=e.clientY;
}
},transitionTo:function(_8f,_90,url,_91){
var _92=(_8f&&typeof (_8f)==="object")?_8f:{moveTo:_8f,href:_90,url:url,scene:_91,transition:this.transition,transitionDir:this.transitionDir};
new _86(this.domNode,_92).dispatch();
},_setIconAttr:function(_93){
if(!this._isOnLine){
return;
}
this._set("icon",_93);
this.iconNode=_87.setIcon(_93,this.iconPos,this.iconNode,this.alt,this.iconParentNode,this.refNode,this.position);
},_setLabelAttr:function(_94){
this._set("label",_94);
this.labelNode.innerHTML=this._cv?this._cv(_94):_94;
},_setSelectedAttr:function(_95){
if(_95){
var p=this.getParent();
if(p&&p.selectOne){
var arr=_7d.filter(p.getChildren(),function(w){
return w.selected;
});
_7d.forEach(arr,function(c){
this._prevSel=c;
c.set("selected",false);
},this);
}
}
this._set("selected",_95);
}});
});
},"dijit/Destroyable":function(){
define(["dojo/_base/array","dojo/aspect","dojo/_base/declare"],function(_96,_97,_98){
return _98("dijit.Destroyable",null,{destroy:function(_99){
this._destroyed=true;
},own:function(){
_96.forEach(arguments,function(_9a){
var _9b="destroyRecursive" in _9a?"destroyRecursive":"destroy" in _9a?"destroy":"remove";
var odh=_97.before(this,"destroy",function(_9c){
_9a[_9b](_9c);
});
_97.after(_9a,_9b,function(){
odh.remove();
},true);
},this);
return arguments;
}});
});
},"dojox/mobile/View":function(){
define("dojox/mobile/View",["dojo/_base/array","dojo/_base/config","dojo/_base/connect","dojo/_base/declare","dojo/_base/lang","dojo/_base/sniff","dojo/_base/window","dojo/_base/Deferred","dojo/dom","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dijit/registry","dijit/_Contained","dijit/_Container","dijit/_WidgetBase","./ViewController","./common","./transition","./viewRegistry"],function(_9d,_9e,_9f,_a0,_a1,has,win,_a2,dom,_a3,_a4,_a5,_a6,_a7,_a8,_a9,_aa,_ab,_ac,_ad,_ae){
var dm=_a1.getObject("dojox.mobile",true);
return _a0("dojox.mobile.View",[_aa,_a9,_a8],{selected:false,keepScrollPos:true,tag:"div",baseClass:"mblView",constructor:function(_af,_b0){
if(_b0){
dom.byId(_b0).style.visibility="hidden";
}
},destroy:function(){
_ae.remove(this.id);
this.inherited(arguments);
},buildRendering:function(){
this.domNode=this.containerNode=this.srcNodeRef||_a4.create(this.tag);
this._animEndHandle=this.connect(this.domNode,"webkitAnimationEnd","onAnimationEnd");
this._animStartHandle=this.connect(this.domNode,"webkitAnimationStart","onAnimationStart");
if(!_9e["mblCSS3Transition"]){
this._transEndHandle=this.connect(this.domNode,"webkitTransitionEnd","onAnimationEnd");
}
if(has("mblAndroid3Workaround")){
_a6.set(this.domNode,"webkitTransformStyle","preserve-3d");
}
_ae.add(this);
this.inherited(arguments);
},startup:function(){
if(this._started){
return;
}
if(this._visible===undefined){
var _b1=this.getSiblingViews();
var ids=location.hash&&location.hash.substring(1).split(/,/);
var _b2,_b3,_b4;
_9d.forEach(_b1,function(v,i){
if(_9d.indexOf(ids,v.id)!==-1){
_b2=v;
}
if(i==0){
_b4=v;
}
if(v.selected){
_b3=v;
}
v._visible=false;
},this);
(_b2||_b3||_b4)._visible=true;
}
if(this._visible){
this.show(true,true);
this.defer(function(){
this.onStartView();
_9f.publish("/dojox/mobile/startView",[this]);
});
}
if(this.domNode.style.visibility!="visible"){
this.domNode.style.visibility="visible";
}
this.inherited(arguments);
var _b5=this.getParent();
if(!_b5||!_b5.resize){
this.resize();
}
if(!this._visible){
this.hide();
}
},resize:function(){
_9d.forEach(this.getChildren(),function(_b6){
if(_b6.resize){
_b6.resize();
}
});
},onStartView:function(){
},onBeforeTransitionIn:function(_b7,dir,_b8,_b9,_ba){
},onAfterTransitionIn:function(_bb,dir,_bc,_bd,_be){
},onBeforeTransitionOut:function(_bf,dir,_c0,_c1,_c2){
},onAfterTransitionOut:function(_c3,dir,_c4,_c5,_c6){
},_clearClasses:function(_c7){
if(!_c7){
return;
}
var _c8=[];
_9d.forEach(_a1.trim(_c7.className||"").split(/\s+/),function(c){
if(c.match(/^mbl\w*View$/)||c.indexOf("mbl")===-1){
_c8.push(c);
}
},this);
_c7.className=_c8.join(" ");
},_fixViewState:function(_c9){
var _ca=this.domNode.parentNode.childNodes;
for(var i=0;i<_ca.length;i++){
var n=_ca[i];
if(n.nodeType===1&&_a3.contains(n,"mblView")){
this._clearClasses(n);
}
}
this._clearClasses(_c9);
},convertToId:function(_cb){
if(typeof (_cb)=="string"){
return _cb.replace(/^#?([^&?]+).*/,"$1");
}
return _cb;
},_isBookmarkable:function(_cc){
return _cc.moveTo&&(_9e["mblForceBookmarkable"]||_cc.moveTo.charAt(0)==="#")&&!_cc.hashchange;
},performTransition:function(_cd,_ce,_cf,_d0,_d1){
var _d2,_d3;
if(_cd&&typeof (_cd)==="object"){
_d2=_cd;
_d3=_ce;
}else{
_d2={moveTo:_cd,transitionDir:_ce,transition:_cf,context:_d0,method:_d1};
_d3=[];
for(var i=5;i<arguments.length;i++){
_d3.push(arguments[i]);
}
}
this._detail=_d2;
this._optArgs=_d3;
this._arguments=[_d2.moveTo,_d2.transitionDir,_d2.transition,_d2.context,_d2.method];
if(_d2.moveTo==="#"){
return;
}
var _d4;
if(_d2.moveTo){
_d4=this.convertToId(_d2.moveTo);
}else{
if(!this._dummyNode){
this._dummyNode=win.doc.createElement("div");
win.body().appendChild(this._dummyNode);
}
_d4=this._dummyNode;
}
if(this.addTransitionInfo&&typeof (_d2.moveTo)=="string"&&this._isBookmarkable(_d2)){
this.addTransitionInfo(this.id,_d2.moveTo,{transitionDir:_d2.transitionDir,transition:_d2.transition});
}
var _d5=this.domNode;
var _d6=_d5.offsetTop;
_d4=this.toNode=dom.byId(_d4);
if(!_d4){
return;
}
_d4.style.visibility="hidden";
_d4.style.display="";
this._fixViewState(_d4);
var _d7=_a7.byNode(_d4);
if(_d7){
if(_9e["mblAlwaysResizeOnTransition"]||!_d7._resized){
_ac.resizeAll(null,_d7);
_d7._resized=true;
}
if(_d2.transition&&_d2.transition!="none"){
_d7.containerNode.style.paddingTop=_d6+"px";
}
_d7.load&&_d7.load();
_d7.movedFrom=_d5.id;
}
if(has("mblAndroidWorkaround")&&!_9e["mblCSS3Transition"]&&_d2.transition&&_d2.transition!="none"){
_a6.set(_d4,"webkitTransformStyle","preserve-3d");
_a6.set(_d5,"webkitTransformStyle","preserve-3d");
_a3.add(_d4,"mblAndroidWorkaround");
}
this.onBeforeTransitionOut.apply(this,this._arguments);
_9f.publish("/dojox/mobile/beforeTransitionOut",[this].concat(_a1._toArray(this._arguments)));
if(_d7){
if(this.keepScrollPos&&!this.getParent()){
var _d8=win.body().scrollTop||win.doc.documentElement.scrollTop||win.global.pageYOffset||0;
_d5._scrollTop=_d8;
var _d9=(_d2.transitionDir==1)?0:(_d4._scrollTop||0);
_d4.style.top="0px";
if(_d8>1||_d9!==0){
_d5.style.top=_d9-_d8+"px";
if(_9e["mblHideAddressBar"]!==false){
setTimeout(function(){
win.global.scrollTo(0,(_d9||1));
},0);
}
}
}else{
_d4.style.top="0px";
}
_d7.onBeforeTransitionIn.apply(_d7,this._arguments);
_9f.publish("/dojox/mobile/beforeTransitionIn",[_d7].concat(_a1._toArray(this._arguments)));
}
_d4.style.display="none";
_d4.style.visibility="visible";
_ac.fromView=this;
_ac.toView=_d7;
this._doTransition(_d5,_d4,_d2.transition,_d2.transitionDir);
},_toCls:function(s){
return "mbl"+s.charAt(0).toUpperCase()+s.substring(1);
},_doTransition:function(_da,_db,_dc,_dd){
var rev=(_dd==-1)?" mblReverse":"";
_db.style.display="";
if(!_dc||_dc=="none"){
this.domNode.style.display="none";
this.invokeCallback();
}else{
if(_9e["mblCSS3Transition"]){
_a2.when(_ad,_a1.hitch(this,function(_de){
var _df=_a6.get(_db,"position");
_a6.set(_db,"position","absolute");
_a2.when(_de(_da,_db,{transition:_dc,reverse:(_dd===-1)?true:false}),_a1.hitch(this,function(){
_a6.set(_db,"position",_df);
this.invokeCallback();
}));
}));
}else{
if(_dc.indexOf("cube")!=-1){
if(has("ipad")){
_a6.set(_db.parentNode,{webkitPerspective:1600});
}else{
if(has("iphone")){
_a6.set(_db.parentNode,{webkitPerspective:800});
}
}
}
var s=this._toCls(_dc);
if(has("mblAndroidWorkaround")){
setTimeout(function(){
_a3.add(_da,s+" mblOut"+rev);
_a3.add(_db,s+" mblIn"+rev);
_a3.remove(_db,"mblAndroidWorkaround");
setTimeout(function(){
_a3.add(_da,"mblTransition");
_a3.add(_db,"mblTransition");
},30);
},70);
}else{
_a3.add(_da,s+" mblOut"+rev);
_a3.add(_db,s+" mblIn"+rev);
setTimeout(function(){
_a3.add(_da,"mblTransition");
_a3.add(_db,"mblTransition");
},100);
}
var _e0="50% 50%";
var _e1="50% 50%";
var _e2,_e3,_e4;
if(_dc.indexOf("swirl")!=-1||_dc.indexOf("zoom")!=-1){
if(this.keepScrollPos&&!this.getParent()){
_e2=win.body().scrollTop||win.doc.documentElement.scrollTop||win.global.pageYOffset||0;
}else{
_e2=-_a5.position(_da,true).y;
}
_e4=win.global.innerHeight/2+_e2;
_e0="50% "+_e4+"px";
_e1="50% "+_e4+"px";
}else{
if(_dc.indexOf("scale")!=-1){
var _e5=_a5.position(_da,true);
_e3=((this.clickedPosX!==undefined)?this.clickedPosX:win.global.innerWidth/2)-_e5.x;
if(this.keepScrollPos&&!this.getParent()){
_e2=win.body().scrollTop||win.doc.documentElement.scrollTop||win.global.pageYOffset||0;
}else{
_e2=-_e5.y;
}
_e4=((this.clickedPosY!==undefined)?this.clickedPosY:win.global.innerHeight/2)+_e2;
_e0=_e3+"px "+_e4+"px";
_e1=_e3+"px "+_e4+"px";
}
}
_a6.set(_da,{webkitTransformOrigin:_e0});
_a6.set(_db,{webkitTransformOrigin:_e1});
}
}
},onAnimationStart:function(e){
},onAnimationEnd:function(e){
var _e6=e.animationName||e.target.className;
if(_e6.indexOf("Out")===-1&&_e6.indexOf("In")===-1&&_e6.indexOf("Shrink")===-1){
return;
}
var _e7=false;
if(_a3.contains(this.domNode,"mblOut")){
_e7=true;
this.domNode.style.display="none";
_a3.remove(this.domNode,[this._toCls(this._detail.transition),"mblIn","mblOut","mblReverse"]);
}else{
this.containerNode.style.paddingTop="";
}
_a6.set(this.domNode,{webkitTransformOrigin:""});
if(_e6.indexOf("Shrink")!==-1){
var li=e.target;
li.style.display="none";
_a3.remove(li,"mblCloseContent");
var p=_ae.getEnclosingScrollable(this.domNode);
p&&p.onTouchEnd();
}
if(_e7){
this.invokeCallback();
}
this._clearClasses(this.domNode);
this.clickedPosX=this.clickedPosY=undefined;
if(_e6.indexOf("Cube")!==-1&&_e6.indexOf("In")!==-1&&has("iphone")){
this.domNode.parentNode.style.webkitPerspective="";
}
},invokeCallback:function(){
this.onAfterTransitionOut.apply(this,this._arguments);
_9f.publish("/dojox/mobile/afterTransitionOut",[this].concat(this._arguments));
var _e8=_a7.byNode(this.toNode);
if(_e8){
_e8.onAfterTransitionIn.apply(_e8,this._arguments);
_9f.publish("/dojox/mobile/afterTransitionIn",[_e8].concat(this._arguments));
_e8.movedFrom=undefined;
if(this.setFragIds&&this._isBookmarkable(this._detail)){
this.setFragIds(_e8);
}
}
if(has("mblAndroidWorkaround")){
setTimeout(_a1.hitch(this,function(){
if(_e8){
_a6.set(this.toNode,"webkitTransformStyle","");
}
_a6.set(this.domNode,"webkitTransformStyle","");
}),0);
}
var c=this._detail.context,m=this._detail.method;
if(!c&&!m){
return;
}
if(!m){
m=c;
c=null;
}
c=c||win.global;
if(typeof (m)=="string"){
c[m].apply(c,this._optArgs);
}else{
if(typeof (m)=="function"){
m.apply(c,this._optArgs);
}
}
},isVisible:function(_e9){
var _ea=function(_eb){
return _a6.get(_eb,"display")!=="none";
};
if(_e9){
for(var n=this.domNode;n.tagName!=="BODY";n=n.parentNode){
if(!_ea(n)){
return false;
}
}
return true;
}else{
return _ea(this.domNode);
}
},getShowingView:function(){
var _ec=this.domNode.parentNode.childNodes;
for(var i=0;i<_ec.length;i++){
var n=_ec[i];
if(n.nodeType===1&&_a3.contains(n,"mblView")&&n.style.display!=="none"){
return _a7.byNode(n);
}
}
return null;
},getSiblingViews:function(){
if(!this.domNode.parentNode){
return [this];
}
return _9d.map(_9d.filter(this.domNode.parentNode.childNodes,function(n){
return n.nodeType===1&&_a3.contains(n,"mblView");
}),function(n){
return _a7.byNode(n);
});
},show:function(_ed,_ee){
var out=this.getShowingView();
if(!_ed){
if(out){
out.onBeforeTransitionOut(out.id);
_9f.publish("/dojox/mobile/beforeTransitionOut",[out,out.id]);
}
this.onBeforeTransitionIn(this.id);
_9f.publish("/dojox/mobile/beforeTransitionIn",[this,this.id]);
}
if(_ee){
this.domNode.style.display="";
}else{
_9d.forEach(this.getSiblingViews(),function(v){
v.domNode.style.display=(v===this)?"":"none";
},this);
}
this.load&&this.load();
if(!_ed){
if(out){
out.onAfterTransitionOut(out.id);
_9f.publish("/dojox/mobile/afterTransitionOut",[out,out.id]);
}
this.onAfterTransitionIn(this.id);
_9f.publish("/dojox/mobile/afterTransitionIn",[this,this.id]);
}
},hide:function(){
this.domNode.style.display="none";
}});
});
},"dojox/mobile/_base":function(){
define(["./common","./View","./Heading","./RoundRect","./RoundRectCategory","./EdgeToEdgeCategory","./RoundRectList","./EdgeToEdgeList","./ListItem","./Container","./Pane","./Switch","./ToolBarButton","./ProgressIndicator"],function(_ef,_f0,_f1,_f2,_f3,_f4,_f5,_f6,_f7,_f8,_f9,_fa){
return _ef;
});
},"dijit/main":function(){
define(["dojo/_base/kernel"],function(_fb){
return _fb.dijit;
});
},"dijit/registry":function(){
define(["dojo/_base/array","dojo/sniff","dojo/_base/unload","dojo/_base/window","./main"],function(_fc,has,_fd,win,_fe){
var _ff={},hash={};
var _100={length:0,add:function(_101){
if(hash[_101.id]){
throw new Error("Tried to register widget with id=="+_101.id+" but that id is already registered");
}
hash[_101.id]=_101;
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
},getUniqueId:function(_102){
var id;
do{
id=_102+"_"+(_102 in _ff?++_ff[_102]:_ff[_102]=0);
}while(hash[id]);
return _fe._scopeName=="dijit"?id:_fe._scopeName+"_"+id;
},findWidgets:function(root,_103){
var _104=[];
function _105(root){
for(var node=root.firstChild;node;node=node.nextSibling){
if(node.nodeType==1){
var _106=node.getAttribute("widgetId");
if(_106){
var _107=hash[_106];
if(_107){
_104.push(_107);
}
}else{
if(node!==_103){
_105(node);
}
}
}
}
};
_105(root);
return _104;
},_destroyAll:function(){
_fe._curFocus=null;
_fe._prevFocus=null;
_fe._activeStack=[];
_fc.forEach(_100.findWidgets(win.body()),function(_108){
if(!_108._destroyed){
if(_108.destroyRecursive){
_108.destroyRecursive();
}else{
if(_108.destroy){
_108.destroy();
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
_fe.registry=_100;
return _100;
});
},"dojox/mobile/viewRegistry":function(){
define(["dojo/_base/array","dojo/dom-class","dijit/registry"],function(_109,_10a,_10b){
var _10c={length:0,hash:{},initialView:null,add:function(view){
this.hash[view.id]=view;
this.length++;
},remove:function(id){
if(this.hash[id]){
delete this.hash[id];
this.length--;
}
},getViews:function(){
var arr=[];
for(var i in this.hash){
arr.push(this.hash[i]);
}
return arr;
},getParentView:function(view){
for(var v=view.getParent();v;v=v.getParent()){
if(_10a.contains(v.domNode,"mblView")){
return v;
}
}
return null;
},getChildViews:function(_10d){
return _109.filter(this.getViews(),function(v){
return this.getParentView(v)===_10d;
},this);
},getEnclosingView:function(node){
for(var n=node;n&&n.tagName!=="BODY";n=n.parentNode){
if(n.nodeType===1&&_10a.contains(n,"mblView")){
return _10b.byNode(n);
}
}
return null;
},getEnclosingScrollable:function(node){
for(var w=_10b.getEnclosingWidget(node);w;w=w.getParent()){
if(w.scrollableParams&&w._v){
return w;
}
}
return null;
}};
return _10c;
});
},"dojox/mobile/Heading":function(){
define(["dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/_base/lang","dojo/_base/window","dojo/dom","dojo/dom-class","dojo/dom-construct","dojo/dom-style","dijit/registry","dijit/_Contained","dijit/_Container","dijit/_WidgetBase","./ProgressIndicator","./ToolBarButton","./View"],function(_10e,_10f,_110,lang,win,dom,_111,_112,_113,_114,_115,_116,_117,_118,_119,View){
var dm=lang.getObject("dojox.mobile",true);
return _110("dojox.mobile.Heading",[_117,_116,_115],{back:"",href:"",moveTo:"",transition:"slide",label:"",iconBase:"",tag:"h1",busy:false,progStyle:"mblProgWhite",baseClass:"mblHeading",buildRendering:function(){
this.domNode=this.containerNode=this.srcNodeRef||win.doc.createElement(this.tag);
this.inherited(arguments);
if(!this.label){
_10e.forEach(this.domNode.childNodes,function(n){
if(n.nodeType==3){
var v=lang.trim(n.nodeValue);
if(v){
this.label=v;
this.labelNode=_112.create("span",{innerHTML:v},n,"replace");
}
}
},this);
}
if(!this.labelNode){
this.labelNode=_112.create("span",null,this.domNode);
}
this.labelNode.className="mblHeadingSpanTitle";
this.labelDivNode=_112.create("div",{className:"mblHeadingDivTitle",innerHTML:this.labelNode.innerHTML},this.domNode);
dom.setSelectable(this.domNode,false);
},startup:function(){
if(this._started){
return;
}
var _11a=this.getParent&&this.getParent();
if(!_11a||!_11a.resize){
var _11b=this;
setTimeout(function(){
_11b.resize();
},0);
}
this.inherited(arguments);
},resize:function(){
if(this.labelNode){
var _11c,_11d;
var _11e=this.containerNode.childNodes;
for(var i=_11e.length-1;i>=0;i--){
var c=_11e[i];
if(c.nodeType===1&&_113.get(c,"display")!=="none"){
if(!_11d&&_113.get(c,"float")==="right"){
_11d=c;
}
if(!_11c&&_113.get(c,"float")==="left"){
_11c=c;
}
}
}
if(!this.labelNodeLen&&this.label){
this.labelNode.style.display="inline";
this.labelNodeLen=this.labelNode.offsetWidth;
this.labelNode.style.display="";
}
var bw=this.domNode.offsetWidth;
var rw=_11d?bw-_11d.offsetLeft+5:0;
var lw=_11c?_11c.offsetLeft+_11c.offsetWidth+5:0;
var tw=this.labelNodeLen||0;
_111[bw-Math.max(rw,lw)*2>tw?"add":"remove"](this.domNode,"mblHeadingCenterTitle");
}
_10e.forEach(this.getChildren(),function(_11f){
if(_11f.resize){
_11f.resize();
}
});
},_setBackAttr:function(back){
this._set("back",back);
if(!this.backButton){
this.backButton=new _119({arrow:"left",label:back,moveTo:this.moveTo,back:!this.moveTo,href:this.href,transition:this.transition,transitionDir:-1});
this.backButton.placeAt(this.domNode,"first");
}else{
this.backButton.set("label",back);
}
this.resize();
},_setLabelAttr:function(_120){
this._set("label",_120);
this.labelNode.innerHTML=this.labelDivNode.innerHTML=this._cv?this._cv(_120):_120;
},_setBusyAttr:function(busy){
var prog=this._prog;
if(busy){
if(!prog){
prog=this._prog=new _118({size:30,center:false});
_111.add(prog.domNode,this.progStyle);
}
_112.place(prog.domNode,this.domNode,"first");
prog.start();
}else{
prog.stop();
}
this._set("busy",busy);
}});
});
},"dojox/mobile/ProgressIndicator":function(){
define(["dojo/_base/config","dojo/_base/declare","dojo/_base/lang","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/has","dijit/_Contained","dijit/_WidgetBase"],function(_121,_122,lang,_123,_124,_125,_126,has,_127,_128){
var cls=_122("dojox.mobile.ProgressIndicator",[_128,_127],{interval:100,size:40,removeOnStop:true,startSpinning:false,center:true,colors:null,baseClass:"mblProgressIndicator",constructor:function(){
this.colors=[];
this._bars=[];
},buildRendering:function(){
this.inherited(arguments);
if(this.center){
_123.add(this.domNode,"mblProgressIndicatorCenter");
}
this.containerNode=_124.create("div",{className:"mblProgContainer"},this.domNode);
this.spinnerNode=_124.create("div",null,this.containerNode);
for(var i=0;i<12;i++){
var div=_124.create("div",{className:"mblProg mblProg"+i},this.spinnerNode);
this._bars.push(div);
}
this.scale(this.size);
if(this.startSpinning){
this.start();
}
},scale:function(size){
var _129=size/40;
_126.set(this.containerNode,{webkitTransform:"scale("+_129+")",webkitTransformOrigin:"0 0"});
_125.setMarginBox(this.domNode,{w:size,h:size});
_125.setMarginBox(this.containerNode,{w:size/_129,h:size/_129});
},start:function(){
if(this.imageNode){
var img=this.imageNode;
var l=Math.round((this.containerNode.offsetWidth-img.offsetWidth)/2);
var t=Math.round((this.containerNode.offsetHeight-img.offsetHeight)/2);
img.style.margin=t+"px "+l+"px";
return;
}
var cntr=0;
var _12a=this;
var n=12;
this.timer=setInterval(function(){
cntr--;
cntr=cntr<0?n-1:cntr;
var c=_12a.colors;
for(var i=0;i<n;i++){
var idx=(cntr+i)%n;
if(c[idx]){
_12a._bars[i].style.backgroundColor=c[idx];
}else{
_123.replace(_12a._bars[i],"mblProg"+idx+"Color","mblProg"+(idx===n-1?0:idx+1)+"Color");
}
}
},this.interval);
},stop:function(){
if(this.timer){
clearInterval(this.timer);
}
this.timer=null;
if(this.removeOnStop&&this.domNode&&this.domNode.parentNode){
this.domNode.parentNode.removeChild(this.domNode);
}
},setImage:function(file){
if(file){
this.imageNode=_124.create("img",{src:file},this.containerNode);
this.spinnerNode.style.display="none";
}else{
if(this.imageNode){
this.containerNode.removeChild(this.imageNode);
this.imageNode=null;
}
this.spinnerNode.style.display="";
}
},destroy:function(){
this.inherited(arguments);
if(this===cls._instance){
cls._instance=null;
}
}});
cls._instance=null;
cls.getInstance=function(_12b){
if(!cls._instance){
cls._instance=new cls(_12b);
}
return cls._instance;
};
return cls;
});
},"dojox/mobile/Container":function(){
define(["dojo/_base/declare","dijit/_Container","./Pane"],function(_12c,_12d,Pane){
return _12c("dojox.mobile.Container",[Pane,_12d],{baseClass:"mblContainer"});
});
},"dojox/mobile/RoundRectList":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/_base/event","dojo/_base/lang","dojo/_base/window","dojo/dom-construct","dijit/_Contained","dijit/_Container","dijit/_WidgetBase"],function(_12e,_12f,_130,lang,win,_131,_132,_133,_134){
return _12f("dojox.mobile.RoundRectList",[_134,_133,_132],{transition:"slide",iconBase:"",iconPos:"",select:"",stateful:false,syncWithViews:false,editable:false,tag:"ul",editableMixinClass:"dojox/mobile/_EditableListMixin",baseClass:"mblRoundRectList",buildRendering:function(){
this.domNode=this.srcNodeRef||_131.create(this.tag);
this.inherited(arguments);
},postCreate:function(){
if(this.editable){
require([this.editableMixinClass],lang.hitch(this,function(_135){
lang.mixin(this,new _135());
}));
}
this.connect(this.domNode,"onselectstart",_130.stop);
if(this.syncWithViews){
var f=function(view,_136,dir,_137,_138,_139){
var _13a=_12e.filter(this.getChildren(),function(w){
return w.moveTo==="#"+view.id||w.moveTo===view.id;
})[0];
if(_13a){
_13a.set("selected",true);
}
};
this.subscribe("/dojox/mobile/afterTransitionIn",f);
this.subscribe("/dojox/mobile/startView",f);
}
},resize:function(){
_12e.forEach(this.getChildren(),function(_13b){
if(_13b.resize){
_13b.resize();
}
});
},onCheckStateChanged:function(){
},_setStatefulAttr:function(_13c){
this._set("stateful",_13c);
this.selectOne=_13c;
_12e.forEach(this.getChildren(),function(_13d){
_13d.setArrow&&_13d.setArrow();
});
},deselectItem:function(item){
item.set("selected",false);
},deselectAll:function(){
_12e.forEach(this.getChildren(),function(_13e){
_13e.set("selected",false);
});
},selectItem:function(item){
item.set("selected",true);
}});
});
},"dijit/_Container":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dom-construct"],function(_13f,_140,_141){
return _140("dijit._Container",null,{buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
},addChild:function(_142,_143){
var _144=this.containerNode;
if(_143&&typeof _143=="number"){
var _145=this.getChildren();
if(_145&&_145.length>=_143){
_144=_145[_143-1].domNode;
_143="after";
}
}
_141.place(_142.domNode,_144,_143);
if(this._started&&!_142._started){
_142.startup();
}
},removeChild:function(_146){
if(typeof _146=="number"){
_146=this.getChildren()[_146];
}
if(_146){
var node=_146.domNode;
if(node&&node.parentNode){
node.parentNode.removeChild(node);
}
}
},hasChildren:function(){
return this.getChildren().length>0;
},_getSiblingOfChild:function(_147,dir){
var _148=this.getChildren(),idx=_13f.indexOf(this.getChildren(),_147);
return _148[idx+dir];
},getIndexOfChild:function(_149){
return _13f.indexOf(this.getChildren(),_149);
}});
});
},"dojox/mobile/Switch":function(){
define(["dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/_base/event","dojo/_base/window","dojo/dom-class","dojo/dom-construct","dojo/dom-style","dojo/touch","dijit/_Contained","dijit/_WidgetBase","./sniff"],function(_14a,_14b,_14c,_14d,win,_14e,_14f,_150,_151,_152,_153,has){
return _14c("dojox.mobile.Switch",[_153,_152],{value:"on",name:"",leftLabel:"ON",rightLabel:"OFF",shape:"mblSwDefaultShape",tabIndex:"0",_setTabIndexAttr:"",baseClass:"mblSwitch",role:"",_createdMasks:[],buildRendering:function(){
this.domNode=(this.srcNodeRef&&this.srcNodeRef.tagName==="SPAN")?this.srcNodeRef:_14f.create("span");
this.inherited(arguments);
var c=(this.srcNodeRef&&this.srcNodeRef.className)||this.className||this["class"];
if((c=c.match(/mblSw.*Shape\d*/))){
this.shape=c;
}
_14e.add(this.domNode,this.shape);
var _154=this.name?" name=\""+this.name+"\"":"";
this.domNode.innerHTML="<div class=\"mblSwitchInner\">"+"<div class=\"mblSwitchBg mblSwitchBgLeft\">"+"<div class=\"mblSwitchText mblSwitchTextLeft\"></div>"+"</div>"+"<div class=\"mblSwitchBg mblSwitchBgRight\">"+"<div class=\"mblSwitchText mblSwitchTextRight\"></div>"+"</div>"+"<div class=\"mblSwitchKnob\"></div>"+"<input type=\"hidden\""+_154+"></div>"+"</div>";
var n=this.inner=this.domNode.firstChild;
this.left=n.childNodes[0];
this.right=n.childNodes[1];
this.knob=n.childNodes[2];
this.input=n.childNodes[3];
},postCreate:function(){
this._clickHandle=this.connect(this.domNode,"onclick","_onClick");
this._keydownHandle=this.connect(this.domNode,"onkeydown","_onClick");
this._startHandle=this.connect(this.domNode,_151.press,"onTouchStart");
this._initialValue=this.value;
},_changeState:function(_155,anim){
var on=(_155==="on");
this.left.style.display="";
this.right.style.display="";
this.inner.style.left="";
if(anim){
_14e.add(this.domNode,"mblSwitchAnimation");
}
_14e.remove(this.domNode,on?"mblSwitchOff":"mblSwitchOn");
_14e.add(this.domNode,on?"mblSwitchOn":"mblSwitchOff");
var _156=this;
setTimeout(function(){
_156.left.style.display=on?"":"none";
_156.right.style.display=!on?"":"none";
_14e.remove(_156.domNode,"mblSwitchAnimation");
},anim?300:0);
},_createMaskImage:function(){
if(this._hasMaskImage){
return;
}
this._width=this.domNode.offsetWidth-this.knob.offsetWidth;
this._hasMaskImage=true;
if(!has("webkit")){
return;
}
var rDef=_150.get(this.left,"borderTopLeftRadius");
if(rDef=="0px"){
return;
}
var _157=rDef.split(" ");
var rx=parseFloat(_157[0]),ry=(_157.length==1)?rx:parseFloat(_157[1]);
var w=this.domNode.offsetWidth,h=this.domNode.offsetHeight;
var id=(this.shape+"Mask"+w+h+rx+ry).replace(/\./,"_");
if(!this._createdMasks[id]){
this._createdMasks[id]=1;
var ctx=win.doc.getCSSCanvasContext("2d",id,w,h);
ctx.fillStyle="#000000";
ctx.beginPath();
if(rx==ry){
ctx.moveTo(rx,0);
ctx.arcTo(0,0,0,rx,rx);
ctx.lineTo(0,h-rx);
ctx.arcTo(0,h,rx,h,rx);
ctx.lineTo(w-rx,h);
ctx.arcTo(w,h,w,rx,rx);
ctx.lineTo(w,rx);
ctx.arcTo(w,0,w-rx,0,rx);
}else{
var pi=Math.PI;
ctx.scale(1,ry/rx);
ctx.moveTo(rx,0);
ctx.arc(rx,rx,rx,1.5*pi,0.5*pi,true);
ctx.lineTo(w-rx,2*rx);
ctx.arc(w-rx,rx,rx,0.5*pi,1.5*pi,true);
}
ctx.closePath();
ctx.fill();
}
this.domNode.style.webkitMaskImage="-webkit-canvas("+id+")";
},_onClick:function(e){
if(e&&e.type==="keydown"&&e.keyCode!==13){
return;
}
if(this.onClick(e)===false){
return;
}
if(this._moved){
return;
}
this.value=this.input.value=(this.value=="on")?"off":"on";
this._changeState(this.value,true);
this.onStateChanged(this.value);
},onClick:function(){
},onTouchStart:function(e){
this._moved=false;
this.innerStartX=this.inner.offsetLeft;
if(!this._conn){
this._conn=[this.connect(this.inner,_151.move,"onTouchMove"),this.connect(this.inner,_151.release,"onTouchEnd")];
}
this.touchStartX=e.touches?e.touches[0].pageX:e.clientX;
this.left.style.display="";
this.right.style.display="";
_14d.stop(e);
this._createMaskImage();
},onTouchMove:function(e){
e.preventDefault();
var dx;
if(e.targetTouches){
if(e.targetTouches.length!=1){
return;
}
dx=e.targetTouches[0].clientX-this.touchStartX;
}else{
dx=e.clientX-this.touchStartX;
}
var pos=this.innerStartX+dx;
var d=10;
if(pos<=-(this._width-d)){
pos=-this._width;
}
if(pos>=-d){
pos=0;
}
this.inner.style.left=pos+"px";
if(Math.abs(dx)>d){
this._moved=true;
}
},onTouchEnd:function(e){
_14a.forEach(this._conn,_14b.disconnect);
this._conn=null;
if(this.innerStartX==this.inner.offsetLeft){
if(has("touch")&&!(has("android")>=4.1)){
var ev=win.doc.createEvent("MouseEvents");
ev.initEvent("click",true,true);
this.inner.dispatchEvent(ev);
}
return;
}
var _158=(this.inner.offsetLeft<-(this._width/2))?"off":"on";
this._changeState(_158,true);
if(_158!=this.value){
this.value=this.input.value=_158;
this.onStateChanged(_158);
}
},onStateChanged:function(_159){
},_setValueAttr:function(_15a){
this._changeState(_15a,false);
if(this.value!=_15a){
this.onStateChanged(_15a);
}
this.value=this.input.value=_15a;
},_setLeftLabelAttr:function(_15b){
this.leftLabel=_15b;
this.left.firstChild.innerHTML=this._cv?this._cv(_15b):_15b;
},_setRightLabelAttr:function(_15c){
this.rightLabel=_15c;
this.right.firstChild.innerHTML=this._cv?this._cv(_15c):_15c;
},reset:function(){
this.set("value",this._initialValue);
}});
});
},"dojox/mobile/EdgeToEdgeCategory":function(){
define(["dojo/_base/declare","./RoundRectCategory"],function(_15d,_15e){
return _15d("dojox.mobile.EdgeToEdgeCategory",_15e,{buildRendering:function(){
this.inherited(arguments);
this.domNode.className="mblEdgeToEdgeCategory";
}});
});
},"dojox/mobile/transition":function(){
define(["dojo/_base/Deferred","dojo/_base/config"],function(_15f,_160){
if(_160["mblCSS3Transition"]){
var _161=new _15f();
require([_160["mblCSS3Transition"]],function(_162){
_161.resolve(_162);
});
return _161;
}
return null;
});
},"dijit/_WidgetBase":function(){
define(["require","dojo/_base/array","dojo/aspect","dojo/_base/config","dojo/_base/connect","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/has","dojo/_base/kernel","dojo/_base/lang","dojo/on","dojo/ready","dojo/Stateful","dojo/topic","dojo/_base/window","./Destroyable","./registry"],function(_163,_164,_165,_166,_167,_168,dom,_169,_16a,_16b,_16c,_16d,has,_16e,lang,on,_16f,_170,_171,win,_172,_173){
has.add("dijit-legacy-requires",!_16e.isAsync);
if(has("dijit-legacy-requires")){
_16f(0,function(){
var _174=["dijit/_base/manager"];
_163(_174);
});
}
var _175={};
function _176(obj){
var ret={};
for(var attr in obj){
ret[attr.toLowerCase()]=true;
}
return ret;
};
function _177(attr){
return function(val){
_169[val?"set":"remove"](this.domNode,attr,val);
this._set(attr,val);
};
};
return _168("dijit._WidgetBase",[_170,_172],{id:"",_setIdAttr:"domNode",lang:"",_setLangAttr:_177("lang"),dir:"",_setDirAttr:_177("dir"),textDir:"","class":"",_setClassAttr:{node:"domNode",type:"class"},style:"",title:"",tooltip:"",baseClass:"",srcNodeRef:null,domNode:null,containerNode:null,ownerDocument:null,_setOwnerDocumentAttr:function(val){
this._set("ownerDocument",val);
},attributeMap:{},_blankGif:_166.blankGif||_163.toUrl("dojo/resources/blank.gif"),postscript:function(_178,_179){
this.create(_178,_179);
},create:function(_17a,_17b){
this.srcNodeRef=dom.byId(_17b);
this._connects=[];
this._supportingWidgets=[];
if(this.srcNodeRef&&(typeof this.srcNodeRef.id=="string")){
this.id=this.srcNodeRef.id;
}
if(_17a){
this.params=_17a;
lang.mixin(this,_17a);
}
this.postMixInProperties();
if(!this.id){
this.id=_173.getUniqueId(this.declaredClass.replace(/\./g,"_"));
if(this.params){
delete this.params.id;
}
}
this.ownerDocument=this.ownerDocument||(this.srcNodeRef?this.srcNodeRef.ownerDocument:win.doc);
this.ownerDocumentBody=win.body(this.ownerDocument);
_173.add(this);
this.buildRendering();
var _17c;
if(this.domNode){
this._applyAttributes();
var _17d=this.srcNodeRef;
if(_17d&&_17d.parentNode&&this.domNode!==_17d){
_17d.parentNode.replaceChild(this.domNode,_17d);
_17c=true;
}
this.domNode.setAttribute("widgetId",this.id);
}
this.postCreate();
if(_17c){
delete this.srcNodeRef;
}
this._created=true;
},_applyAttributes:function(){
var ctor=this.constructor,list=ctor._setterAttrs;
if(!list){
list=(ctor._setterAttrs=[]);
for(var attr in this.attributeMap){
list.push(attr);
}
var _17e=ctor.prototype;
for(var _17f in _17e){
if(_17f in this.attributeMap){
continue;
}
var _180="_set"+_17f.replace(/^[a-z]|-[a-zA-Z]/g,function(c){
return c.charAt(c.length-1).toUpperCase();
})+"Attr";
if(_180 in _17e){
list.push(_17f);
}
}
}
var _181={};
for(var key in this.params||{}){
_181[key]=this[key];
}
_164.forEach(list,function(attr){
if(attr in _181){
}else{
if(this[attr]){
this.set(attr,this[attr]);
}
}
},this);
for(key in _181){
this.set(key,_181[key]);
}
},postMixInProperties:function(){
},buildRendering:function(){
if(!this.domNode){
this.domNode=this.srcNodeRef||this.ownerDocument.createElement("div");
}
if(this.baseClass){
var _182=this.baseClass.split(" ");
if(!this.isLeftToRight()){
_182=_182.concat(_164.map(_182,function(name){
return name+"Rtl";
}));
}
_16a.add(this.domNode,_182);
}
},postCreate:function(){
},startup:function(){
if(this._started){
return;
}
this._started=true;
_164.forEach(this.getChildren(),function(obj){
if(!obj._started&&!obj._destroyed&&lang.isFunction(obj.startup)){
obj.startup();
obj._started=true;
}
});
},destroyRecursive:function(_183){
this._beingDestroyed=true;
this.destroyDescendants(_183);
this.destroy(_183);
},destroy:function(_184){
this._beingDestroyed=true;
this.uninitialize();
function _185(w){
if(w.destroyRecursive){
w.destroyRecursive(_184);
}else{
if(w.destroy){
w.destroy(_184);
}
}
};
_164.forEach(this._connects,lang.hitch(this,"disconnect"));
_164.forEach(this._supportingWidgets,_185);
if(this.domNode){
_164.forEach(_173.findWidgets(this.domNode,this.containerNode),_185);
}
this.destroyRendering(_184);
_173.remove(this.id);
this._destroyed=true;
},destroyRendering:function(_186){
if(this.bgIframe){
this.bgIframe.destroy(_186);
delete this.bgIframe;
}
if(this.domNode){
if(_186){
_169.remove(this.domNode,"widgetId");
}else{
_16b.destroy(this.domNode);
}
delete this.domNode;
}
if(this.srcNodeRef){
if(!_186){
_16b.destroy(this.srcNodeRef);
}
delete this.srcNodeRef;
}
},destroyDescendants:function(_187){
_164.forEach(this.getChildren(),function(_188){
if(_188.destroyRecursive){
_188.destroyRecursive(_187);
}
});
},uninitialize:function(){
return false;
},_setStyleAttr:function(_189){
var _18a=this.domNode;
if(lang.isObject(_189)){
_16d.set(_18a,_189);
}else{
if(_18a.style.cssText){
_18a.style.cssText+="; "+_189;
}else{
_18a.style.cssText=_189;
}
}
this._set("style",_189);
},_attrToDom:function(attr,_18b,_18c){
_18c=arguments.length>=3?_18c:this.attributeMap[attr];
_164.forEach(lang.isArray(_18c)?_18c:[_18c],function(_18d){
var _18e=this[_18d.node||_18d||"domNode"];
var type=_18d.type||"attribute";
switch(type){
case "attribute":
if(lang.isFunction(_18b)){
_18b=lang.hitch(this,_18b);
}
var _18f=_18d.attribute?_18d.attribute:(/^on[A-Z][a-zA-Z]*$/.test(attr)?attr.toLowerCase():attr);
if(_18e.tagName){
_169.set(_18e,_18f,_18b);
}else{
_18e.set(_18f,_18b);
}
break;
case "innerText":
_18e.innerHTML="";
_18e.appendChild(this.ownerDocument.createTextNode(_18b));
break;
case "innerHTML":
_18e.innerHTML=_18b;
break;
case "class":
_16a.replace(_18e,_18b,this[attr]);
break;
}
},this);
},get:function(name){
var _190=this._getAttrNames(name);
return this[_190.g]?this[_190.g]():this[name];
},set:function(name,_191){
if(typeof name==="object"){
for(var x in name){
this.set(x,name[x]);
}
return this;
}
var _192=this._getAttrNames(name),_193=this[_192.s];
if(lang.isFunction(_193)){
var _194=_193.apply(this,Array.prototype.slice.call(arguments,1));
}else{
var _195=this.focusNode&&!lang.isFunction(this.focusNode)?"focusNode":"domNode",tag=this[_195].tagName,_196=_175[tag]||(_175[tag]=_176(this[_195])),map=name in this.attributeMap?this.attributeMap[name]:_192.s in this?this[_192.s]:((_192.l in _196&&typeof _191!="function")||/^aria-|^data-|^role$/.test(name))?_195:null;
if(map!=null){
this._attrToDom(name,_191,map);
}
this._set(name,_191);
}
return _194||this;
},_attrPairNames:{},_getAttrNames:function(name){
var apn=this._attrPairNames;
if(apn[name]){
return apn[name];
}
var uc=name.replace(/^[a-z]|-[a-zA-Z]/g,function(c){
return c.charAt(c.length-1).toUpperCase();
});
return (apn[name]={n:name+"Node",s:"_set"+uc+"Attr",g:"_get"+uc+"Attr",l:uc.toLowerCase()});
},_set:function(name,_197){
var _198=this[name];
this[name]=_197;
if(this._created&&_197!==_198){
if(this._watchCallbacks){
this._watchCallbacks(name,_198,_197);
}
this.emit("attrmodified-"+name,{detail:{prevValue:_198,newValue:_197}});
}
},emit:function(type,_199,_19a){
_199=_199||{};
if(_199.bubbles===undefined){
_199.bubbles=true;
}
if(_199.cancelable===undefined){
_199.cancelable=true;
}
if(!_199.detail){
_199.detail={};
}
_199.detail.widget=this;
var ret,_19b=this["on"+type];
if(_19b){
ret=_19b.apply(this,_19a?_19a:[_199]);
}
if(this._started&&!this._beingDestroyed){
on.emit(this.domNode,type.toLowerCase(),_199);
}
return ret;
},on:function(type,func){
var _19c=this._onMap(type);
if(_19c){
return _165.after(this,_19c,func,true);
}
return this.own(on(this.domNode,type,func))[0];
},_onMap:function(type){
var ctor=this.constructor,map=ctor._onMap;
if(!map){
map=(ctor._onMap={});
for(var attr in ctor.prototype){
if(/^on/.test(attr)){
map[attr.replace(/^on/,"").toLowerCase()]=attr;
}
}
}
return map[typeof type=="string"&&type.toLowerCase()];
},toString:function(){
return "[Widget "+this.declaredClass+", "+(this.id||"NO ID")+"]";
},getChildren:function(){
return this.containerNode?_173.findWidgets(this.containerNode):[];
},getParent:function(){
return _173.getEnclosingWidget(this.domNode.parentNode);
},connect:function(obj,_19d,_19e){
return this.own(_167.connect(obj,_19d,this,_19e))[0];
},disconnect:function(_19f){
_19f.remove();
},subscribe:function(t,_1a0){
return this.own(_171.subscribe(t,lang.hitch(this,_1a0)))[0];
},unsubscribe:function(_1a1){
_1a1.remove();
},isLeftToRight:function(){
return this.dir?(this.dir=="ltr"):_16c.isBodyLtr(this.ownerDocument);
},isFocusable:function(){
return this.focus&&(_16d.get(this.domNode,"display")!="none");
},placeAt:function(_1a2,_1a3){
var _1a4=!_1a2.tagName&&_173.byId(_1a2);
if(_1a4&&_1a4.addChild&&(!_1a3||typeof _1a3==="number")){
_1a4.addChild(this,_1a3);
}else{
var ref=_1a4?(_1a4.containerNode&&!/after|before|replace/.test(_1a3||"")?_1a4.containerNode:_1a4.domNode):dom.byId(_1a2,this.ownerDocument);
_16b.place(this.domNode,ref,_1a3);
if(!this._started&&(this.getParent()||{})._started){
this.startup();
}
}
return this;
},getTextDir:function(text,_1a5){
return _1a5;
},applyTextDir:function(){
},defer:function(fcn,_1a6){
var _1a7=setTimeout(lang.hitch(this,function(){
_1a7=null;
if(!this._destroyed){
lang.hitch(this,fcn)();
}
}),_1a6||0);
return {remove:function(){
if(_1a7){
clearTimeout(_1a7);
_1a7=null;
}
return null;
}};
}});
});
},"dojox/main":function(){
define(["dojo/_base/kernel"],function(dojo){
return dojo.dojox;
});
},"dojox/mobile/common":function(){
define(["dojo/_base/array","dojo/_base/config","dojo/_base/connect","dojo/_base/lang","dojo/_base/window","dojo/dom-class","dojo/dom-construct","dojo/ready","dijit/registry","./sniff","./uacss"],function(_1a8,_1a9,_1aa,lang,win,_1ab,_1ac,_1ad,_1ae,has){
var dm=lang.getObject("dojox.mobile",true);
dm.getScreenSize=function(){
return {h:win.global.innerHeight||win.doc.documentElement.clientHeight,w:win.global.innerWidth||win.doc.documentElement.clientWidth};
};
dm.updateOrient=function(){
var dim=dm.getScreenSize();
_1ab.replace(win.doc.documentElement,dim.h>dim.w?"dj_portrait":"dj_landscape",dim.h>dim.w?"dj_landscape":"dj_portrait");
};
dm.updateOrient();
dm.tabletSize=500;
dm.detectScreenSize=function(_1af){
var dim=dm.getScreenSize();
var sz=Math.min(dim.w,dim.h);
var from,to;
if(sz>=dm.tabletSize&&(_1af||(!this._sz||this._sz<dm.tabletSize))){
from="phone";
to="tablet";
}else{
if(sz<dm.tabletSize&&(_1af||(!this._sz||this._sz>=dm.tabletSize))){
from="tablet";
to="phone";
}
}
if(to){
_1ab.replace(win.doc.documentElement,"dj_"+to,"dj_"+from);
_1aa.publish("/dojox/mobile/screenSize/"+to,[dim]);
}
this._sz=sz;
};
dm.detectScreenSize();
dm.hideAddressBarWait=typeof (_1a9["mblHideAddressBarWait"])==="number"?_1a9["mblHideAddressBarWait"]:1500;
dm.hide_1=function(){
scrollTo(0,1);
dm._hidingTimer=(dm._hidingTimer==0)?200:dm._hidingTimer*2;
setTimeout(function(){
if(dm.isAddressBarHidden()||dm._hidingTimer>dm.hideAddressBarWait){
dm.resizeAll();
dm._hiding=false;
}else{
setTimeout(dm.hide_1,dm._hidingTimer);
}
},50);
};
dm.hideAddressBar=function(evt){
if(dm.disableHideAddressBar||dm._hiding){
return;
}
dm._hiding=true;
dm._hidingTimer=has("iphone")?200:0;
var minH=screen.availHeight;
if(has("android")){
minH=outerHeight/devicePixelRatio;
if(minH==0){
dm._hiding=false;
setTimeout(function(){
dm.hideAddressBar();
},200);
}
if(minH<=innerHeight){
minH=outerHeight;
}
if(has("android")<3){
win.doc.documentElement.style.overflow=win.body().style.overflow="visible";
}
}
if(win.body().offsetHeight<minH){
win.body().style.minHeight=minH+"px";
dm._resetMinHeight=true;
}
setTimeout(dm.hide_1,dm._hidingTimer);
};
dm.isAddressBarHidden=function(){
return pageYOffset===1;
};
dm.resizeAll=function(evt,root){
if(dm.disableResizeAll){
return;
}
_1aa.publish("/dojox/mobile/resizeAll",[evt,root]);
_1aa.publish("/dojox/mobile/beforeResizeAll",[evt,root]);
if(dm._resetMinHeight){
win.body().style.minHeight=dm.getScreenSize().h+"px";
}
dm.updateOrient();
dm.detectScreenSize();
var _1b0=function(w){
var _1b1=w.getParent&&w.getParent();
return !!((!_1b1||!_1b1.resize)&&w.resize);
};
var _1b2=function(w){
_1a8.forEach(w.getChildren(),function(_1b3){
if(_1b0(_1b3)){
_1b3.resize();
}
_1b2(_1b3);
});
};
if(root){
if(root.resize){
root.resize();
}
_1b2(root);
}else{
_1a8.forEach(_1a8.filter(_1ae.toArray(),_1b0),function(w){
w.resize();
});
}
_1aa.publish("/dojox/mobile/afterResizeAll",[evt,root]);
};
dm.openWindow=function(url,_1b4){
win.global.open(url,_1b4||"_blank");
};
if(_1a9["mblApplyPageStyles"]!==false){
_1ab.add(win.doc.documentElement,"mobile");
}
if(has("chrome")){
_1ab.add(win.doc.documentElement,"dj_chrome");
}
if(win.global._no_dojo_dm){
var _1b5=win.global._no_dojo_dm;
for(var i in _1b5){
dm[i]=_1b5[i];
}
dm.deviceTheme.setDm(dm);
}
has.add("mblAndroidWorkaround",_1a9["mblAndroidWorkaround"]!==false&&has("android")<3,undefined,true);
has.add("mblAndroid3Workaround",_1a9["mblAndroid3Workaround"]!==false&&has("android")>=3,undefined,true);
_1ad(function(){
dm.detectScreenSize(true);
if(_1a9["mblAndroidWorkaroundButtonStyle"]!==false&&has("android")){
_1ac.create("style",{innerHTML:"BUTTON,INPUT[type='button'],INPUT[type='submit'],INPUT[type='reset'],INPUT[type='file']::-webkit-file-upload-button{-webkit-appearance:none;}"},win.doc.head,"first");
}
if(has("mblAndroidWorkaround")){
_1ac.create("style",{innerHTML:".mblView.mblAndroidWorkaround{position:absolute;top:-9999px !important;left:-9999px !important;}"},win.doc.head,"last");
}
var f=dm.resizeAll;
if(_1a9["mblHideAddressBar"]!==false&&navigator.appVersion.indexOf("Mobile")!=-1||_1a9["mblForceHideAddressBar"]===true){
dm.hideAddressBar();
if(_1a9["mblAlwaysHideAddressBar"]===true){
f=dm.hideAddressBar;
}
}
if((has("android")||has("iphone")>=6)&&win.global.onorientationchange!==undefined){
var _1b6=f;
f=function(evt){
var _1b7=_1aa.connect(null,"onresize",null,function(e){
_1aa.disconnect(_1b7);
_1b6(e);
});
};
var _1b8=dm.getScreenSize();
var _1b9=has("android")?100:20;
_1aa.connect(null,"onresize",null,function(e){
var _1ba=dm.getScreenSize();
if(_1ba.w==_1b8.w&&Math.abs(_1ba.h-_1b8.h)>=_1b9){
_1b6(e);
}
_1b8=_1ba;
});
}
_1aa.connect(null,win.global.onorientationchange!==undefined?"onorientationchange":"onresize",null,f);
win.body().style.visibility="visible";
});
return dm;
});
},"dojox/mobile/ViewController":function(){
define(["dojo/_base/kernel","dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/_base/lang","dojo/_base/window","dojo/_base/Deferred","dojo/dom","dojo/dom-class","dojo/dom-construct","dojo/on","dojo/ready","dijit/registry","./ProgressIndicator","./TransitionEvent","./viewRegistry"],function(dojo,_1bb,_1bc,_1bd,lang,win,_1be,dom,_1bf,_1c0,on,_1c1,_1c2,_1c3,_1c4,_1c5){
var _1c6=_1bd("dojox.mobile.ViewController",null,{dataHandlerClass:"dojox/mobile/dh/DataHandler",dataSourceClass:"dojox/mobile/dh/UrlDataSource",fileTypeMapClass:"dojox/mobile/dh/SuffixFileTypeMap",constructor:function(){
this.viewMap={};
_1c1(lang.hitch(this,function(){
on(win.body(),"startTransition",lang.hitch(this,"onStartTransition"));
}));
},findTransitionViews:function(_1c7){
if(!_1c7){
return [];
}
_1c7.match(/^#?([^&?]+)(.*)/);
var _1c8=RegExp.$2;
var view=_1c2.byId(RegExp.$1);
if(!view){
return [];
}
for(var v=view.getParent();v;v=v.getParent()){
if(v.isVisible&&!v.isVisible()){
var sv=view.getShowingView();
if(sv&&sv.id!==view.id){
view.show();
}
view=v;
}
}
return [view.getShowingView(),view,_1c8];
},openExternalView:function(_1c9,_1ca){
var d=new _1be();
var id=this.viewMap[_1c9.url];
if(id){
_1c9.moveTo=id;
if(_1c9.noTransition){
_1c2.byId(id).hide();
}else{
new _1c4(win.body(),_1c9).dispatch();
}
d.resolve(true);
return d;
}
var _1cb=null;
for(var i=_1ca.childNodes.length-1;i>=0;i--){
var c=_1ca.childNodes[i];
if(c.nodeType===1){
var _1cc=c.getAttribute("fixed")||(_1c2.byNode(c)&&_1c2.byNode(c).fixed);
if(_1cc==="bottom"){
_1cb=c;
break;
}
}
}
var dh=_1c9.dataHandlerClass||this.dataHandlerClass;
var ds=_1c9.dataSourceClass||this.dataSourceClass;
var ft=_1c9.fileTypeMapClass||this.fileTypeMapClass;
require([dh,ds,ft],lang.hitch(this,function(_1cd,_1ce,_1cf){
var _1d0=new _1cd(new _1ce(_1c9.data||_1c9.url),_1ca,_1cb);
var _1d1=_1c9.contentType||_1cf.getContentType(_1c9.url)||"html";
_1d0.processData(_1d1,lang.hitch(this,function(id){
if(id){
this.viewMap[_1c9.url]=_1c9.moveTo=id;
if(_1c9.noTransition){
_1c2.byId(id).hide();
}else{
new _1c4(win.body(),_1c9).dispatch();
}
d.resolve(true);
}else{
d.reject("Failed to load "+_1c9.url);
}
}));
}));
return d;
},onStartTransition:function(evt){
evt.preventDefault();
if(!evt.detail){
return;
}
var _1d2=evt.detail;
if(!_1d2.moveTo&&!_1d2.href&&!_1d2.url&&!_1d2.scene){
return;
}
if(_1d2.url&&!_1d2.moveTo){
var _1d3=_1d2.urlTarget;
var w=_1c2.byId(_1d3);
var _1d4=w&&w.containerNode||dom.byId(_1d3);
if(!_1d4){
w=_1c5.getEnclosingView(evt.target);
_1d4=w&&w.domNode.parentNode||win.body();
}
this.openExternalView(_1d2,_1d4);
return;
}else{
if(_1d2.href){
if(_1d2.hrefTarget){
win.global.open(_1d2.href,_1d2.hrefTarget);
}else{
var view;
for(var v=_1c5.getEnclosingView(evt.target);v;v=_1c5.getParentView(v)){
view=v;
}
if(view){
view.performTransition(null,_1d2.transitionDir,_1d2.transition,evt.target,function(){
location.href=_1d2.href;
});
}
}
return;
}else{
if(_1d2.scene){
_1bc.publish("/dojox/mobile/app/pushScene",[_1d2.scene]);
return;
}
}
}
var arr=this.findTransitionViews(_1d2.moveTo),_1d5=arr[0],_1d6=arr[1],_1d7=arr[2];
if(!location.hash&&!_1d2.hashchange){
_1c5.initialView=_1d5;
}
if(_1d2.moveTo&&_1d6){
_1d2.moveTo=(_1d2.moveTo.charAt(0)==="#"?"#"+_1d6.id:_1d6.id)+_1d7;
}
if(!_1d5||(_1d2.moveTo&&_1d5===_1c2.byId(_1d2.moveTo.replace(/^#?([^&?]+).*/,"$1")))){
return;
}
var src=_1c2.getEnclosingWidget(evt.target);
if(src&&src.callback){
_1d2.context=src;
_1d2.method=src.callback;
}
_1d5.performTransition(_1d2);
}});
_1c6._instance=new _1c6();
_1c6.getInstance=function(){
return _1c6._instance;
};
return _1c6;
});
},"dojo/Stateful":function(){
define(["./_base/declare","./_base/lang","./_base/array","dojo/when"],function(_1d8,lang,_1d9,when){
return _1d8("dojo.Stateful",null,{_attrPairNames:{},_getAttrNames:function(name){
var apn=this._attrPairNames;
if(apn[name]){
return apn[name];
}
return (apn[name]={s:"_"+name+"Setter",g:"_"+name+"Getter"});
},postscript:function(_1da){
if(_1da){
this.set(_1da);
}
},_get:function(name,_1db){
return typeof this[_1db.g]==="function"?this[_1db.g]():this[name];
},get:function(name){
return this._get(name,this._getAttrNames(name));
},set:function(name,_1dc){
if(typeof name==="object"){
for(var x in name){
if(name.hasOwnProperty(x)&&x!="_watchCallbacks"){
this.set(x,name[x]);
}
}
return this;
}
var _1dd=this._getAttrNames(name),_1de=this._get(name,_1dd),_1df=this[_1dd.s],_1e0;
if(typeof _1df==="function"){
_1e0=_1df.apply(this,Array.prototype.slice.call(arguments,1));
}else{
this[name]=_1dc;
}
if(this._watchCallbacks){
var self=this;
when(_1e0,function(){
self._watchCallbacks(name,_1de,_1dc);
});
}
return this;
},_changeAttrValue:function(name,_1e1){
var _1e2=this.get(name);
this[name]=_1e1;
if(this._watchCallbacks){
this._watchCallbacks(name,_1e2,_1e1);
}
return this;
},watch:function(name,_1e3){
var _1e4=this._watchCallbacks;
if(!_1e4){
var self=this;
_1e4=this._watchCallbacks=function(name,_1e5,_1e6,_1e7){
var _1e8=function(_1e9){
if(_1e9){
_1e9=_1e9.slice();
for(var i=0,l=_1e9.length;i<l;i++){
_1e9[i].call(self,name,_1e5,_1e6);
}
}
};
_1e8(_1e4["_"+name]);
if(!_1e7){
_1e8(_1e4["*"]);
}
};
}
if(!_1e3&&typeof name==="function"){
_1e3=name;
name="*";
}else{
name="_"+name;
}
var _1ea=_1e4[name];
if(typeof _1ea!=="object"){
_1ea=_1e4[name]=[];
}
_1ea.push(_1e3);
var _1eb={};
_1eb.unwatch=_1eb.remove=function(){
var _1ec=_1d9.indexOf(_1ea,_1e3);
if(_1ec>-1){
_1ea.splice(_1ec,1);
}
};
return _1eb;
}});
});
},"dojox/mobile/RoundRectCategory":function(){
define(["dojo/_base/declare","dojo/_base/window","dojo/dom-construct","dijit/_Contained","dijit/_WidgetBase"],function(_1ed,win,_1ee,_1ef,_1f0){
return _1ed("dojox.mobile.RoundRectCategory",[_1f0,_1ef],{label:"",tag:"h2",baseClass:"mblRoundRectCategory",buildRendering:function(){
var _1f1=this.domNode=this.containerNode=this.srcNodeRef||_1ee.create(this.tag);
this.inherited(arguments);
if(!this.label&&_1f1.childNodes.length===1&&_1f1.firstChild.nodeType===3){
this.label=_1f1.firstChild.nodeValue;
}
},_setLabelAttr:function(_1f2){
this.label=_1f2;
this.domNode.innerHTML=this._cv?this._cv(_1f2):_1f2;
}});
});
},"dojox/mobile/ToolBarButton":function(){
define(["dojo/_base/declare","dojo/_base/lang","dojo/_base/window","dojo/dom-class","dojo/dom-construct","dojo/dom-style","./sniff","./_ItemBase"],function(_1f3,lang,win,_1f4,_1f5,_1f6,has,_1f7){
return _1f3("dojox.mobile.ToolBarButton",_1f7,{selected:false,arrow:"",light:true,defaultColor:"mblColorDefault",selColor:"mblColorDefaultSel",baseClass:"mblToolBarButton",_selStartMethod:"touch",_selEndMethod:"touch",buildRendering:function(){
if(!this.label&&this.srcNodeRef){
this.label=this.srcNodeRef.innerHTML;
}
this.label=lang.trim(this.label);
this.domNode=(this.srcNodeRef&&this.srcNodeRef.tagName==="SPAN")?this.srcNodeRef:_1f5.create("span");
this.inherited(arguments);
if(this.light&&!this.arrow&&(!this.icon||!this.label)){
this.labelNode=this.tableNode=this.bodyNode=this.iconParentNode=this.domNode;
_1f4.add(this.domNode,this.defaultColor+" mblToolBarButtonBody"+(this.icon?" mblToolBarButtonLightIcon":" mblToolBarButtonLightText"));
return;
}
this.domNode.innerHTML="";
if(this.arrow==="left"||this.arrow==="right"){
this.arrowNode=_1f5.create("span",{className:"mblToolBarButtonArrow mblToolBarButton"+(this.arrow==="left"?"Left":"Right")+"Arrow "+(has("ie")?"":(this.defaultColor+" "+this.defaultColor+"45"))},this.domNode);
_1f4.add(this.domNode,"mblToolBarButtonHas"+(this.arrow==="left"?"Left":"Right")+"Arrow");
}
this.bodyNode=_1f5.create("span",{className:"mblToolBarButtonBody"},this.domNode);
this.tableNode=_1f5.create("table",{cellPadding:"0",cellSpacing:"0",border:"0"},this.bodyNode);
var row=this.tableNode.insertRow(-1);
this.iconParentNode=row.insertCell(-1);
this.labelNode=row.insertCell(-1);
this.iconParentNode.className="mblToolBarButtonIcon";
this.labelNode.className="mblToolBarButtonLabel";
if(this.icon&&this.icon!=="none"&&this.label){
_1f4.add(this.domNode,"mblToolBarButtonHasIcon");
_1f4.add(this.bodyNode,"mblToolBarButtonLabeledIcon");
}
_1f4.add(this.bodyNode,this.defaultColor);
},startup:function(){
if(this._started){
return;
}
this._keydownHandle=this.connect(this.domNode,"onkeydown","_onClick");
this.inherited(arguments);
if(!this._isOnLine){
this._isOnLine=true;
this.set("icon",this.icon);
}
},_onClick:function(e){
if(e&&e.type==="keydown"&&e.keyCode!==13){
return;
}
if(this.onClick(e)===false){
return;
}
this.defaultClickAction(e);
},onClick:function(){
},_setLabelAttr:function(text){
this.inherited(arguments);
_1f4.toggle(this.tableNode,"mblToolBarButtonText",text);
},_setSelectedAttr:function(_1f8){
var _1f9=function(node,a,b){
_1f4.replace(node,a+" "+a+"45",b+" "+b+"45");
};
this.inherited(arguments);
if(_1f8){
_1f4.replace(this.bodyNode,this.selColor,this.defaultColor);
if(!has("ie")&&this.arrowNode){
_1f9(this.arrowNode,this.selColor,this.defaultColor);
}
}else{
_1f4.replace(this.bodyNode,this.defaultColor,this.selColor);
if(!has("ie")&&this.arrowNode){
_1f9(this.arrowNode,this.defaultColor,this.selColor);
}
}
_1f4.toggle(this.domNode,"mblToolBarButtonSelected",_1f8);
_1f4.toggle(this.bodyNode,"mblToolBarButtonBodySelected",_1f8);
}});
});
}}});
define("dojox/mobile",[".","dojo/_base/lang","dojox/mobile/_base"],function(_1fa,lang,base){
lang.getObject("mobile",true,_1fa);
return _1fa.mobile;
});