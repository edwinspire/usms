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
require({cache:{"dijit/_editor/plugins/FontChoice":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dom-construct","dojo/i18n","dojo/_base/lang","dojo/store/Memory","../../registry","../../_Widget","../../_TemplatedMixin","../../_WidgetsInTemplateMixin","../../form/FilteringSelect","../_Plugin","../range","dojo/i18n!../nls/FontChoice"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){
var _e=_2("dijit._editor.plugins._FontDropDown",[_8,_9,_a],{label:"",plainText:false,templateString:"<span style='white-space: nowrap' class='dijit dijitReset dijitInline'>"+"<label class='dijitLeft dijitInline' for='${selectId}'>${label}</label>"+"<input data-dojo-type='dijit.form.FilteringSelect' required='false' "+"data-dojo-props='labelType:\"html\", labelAttr:\"label\", searchAttr:\"name\"' "+"tabIndex='-1' id='${selectId}' data-dojo-attach-point='select' value=''/>"+"</span>",postMixInProperties:function(){
this.inherited(arguments);
this.strings=_4.getLocalization("dijit._editor","FontChoice");
this.label=this.strings[this.command];
this.id=_7.getUniqueId(this.declaredClass.replace(/\./g,"_"));
this.selectId=this.id+"_select";
this.inherited(arguments);
},postCreate:function(){
this.select.set("store",new _6({idProperty:"value",data:_1.map(this.values,function(_f){
var _10=this.strings[_f]||_f;
return {label:this.getLabel(_f,_10),name:_10,value:_f};
},this)}));
this.select.set("value","",false);
this.disabled=this.select.get("disabled");
},_setValueAttr:function(_11,_12){
_12=_12!==false;
this.select.set("value",_1.indexOf(this.values,_11)<0?"":_11,_12);
if(!_12){
this.select._lastValueReported=null;
}
},_getValueAttr:function(){
return this.select.get("value");
},focus:function(){
this.select.focus();
},_setDisabledAttr:function(_13){
this.disabled=_13;
this.select.set("disabled",_13);
}});
var _14=_2("dijit._editor.plugins._FontNameDropDown",_e,{generic:false,command:"fontName",postMixInProperties:function(){
if(!this.values){
this.values=this.generic?["serif","sans-serif","monospace","cursive","fantasy"]:["Arial","Times New Roman","Comic Sans MS","Courier New"];
}
this.inherited(arguments);
},getLabel:function(_15,_16){
if(this.plainText){
return _16;
}else{
return "<div style='font-family: "+_15+"'>"+_16+"</div>";
}
},_setValueAttr:function(_17,_18){
_18=_18!==false;
if(this.generic){
var map={"Arial":"sans-serif","Helvetica":"sans-serif","Myriad":"sans-serif","Times":"serif","Times New Roman":"serif","Comic Sans MS":"cursive","Apple Chancery":"cursive","Courier":"monospace","Courier New":"monospace","Papyrus":"fantasy","Estrangelo Edessa":"cursive","Gabriola":"fantasy"};
_17=map[_17]||_17;
}
this.inherited(arguments,[_17,_18]);
}});
var _19=_2("dijit._editor.plugins._FontSizeDropDown",_e,{command:"fontSize",values:[1,2,3,4,5,6,7],getLabel:function(_1a,_1b){
if(this.plainText){
return _1b;
}else{
return "<font size="+_1a+"'>"+_1b+"</font>";
}
},_setValueAttr:function(_1c,_1d){
_1d=_1d!==false;
if(_1c.indexOf&&_1c.indexOf("px")!=-1){
var _1e=parseInt(_1c,10);
_1c={10:1,13:2,16:3,18:4,24:5,32:6,48:7}[_1e]||_1c;
}
this.inherited(arguments,[_1c,_1d]);
}});
var _1f=_2("dijit._editor.plugins._FormatBlockDropDown",_e,{command:"formatBlock",values:["noFormat","p","h1","h2","h3","pre"],postCreate:function(){
this.inherited(arguments);
this.set("value","noFormat",false);
},getLabel:function(_20,_21){
if(this.plainText||_20=="noFormat"){
return _21;
}else{
return "<"+_20+">"+_21+"</"+_20+">";
}
},_execCommand:function(_22,_23,_24){
if(_24==="noFormat"){
var _25;
var end;
var sel=_d.getSelection(_22.window);
if(sel&&sel.rangeCount>0){
var _26=sel.getRangeAt(0);
var _27,tag;
if(_26){
_25=_26.startContainer;
end=_26.endContainer;
while(_25&&_25!==_22.editNode&&_25!==_22.document.body&&_25.nodeType!==1){
_25=_25.parentNode;
}
while(end&&end!==_22.editNode&&end!==_22.document.body&&end.nodeType!==1){
end=end.parentNode;
}
var _28=_5.hitch(this,function(_29,ary){
if(_29.childNodes&&_29.childNodes.length){
var i;
for(i=0;i<_29.childNodes.length;i++){
var c=_29.childNodes[i];
if(c.nodeType==1){
if(_22._sCall("inSelection",[c])){
var tag=c.tagName?c.tagName.toLowerCase():"";
if(_1.indexOf(this.values,tag)!==-1){
ary.push(c);
}
_28(c,ary);
}
}
}
}
});
var _2a=_5.hitch(this,function(_2b){
if(_2b&&_2b.length){
_22.beginEditing();
while(_2b.length){
this._removeFormat(_22,_2b.pop());
}
_22.endEditing();
}
});
var _2c=[];
if(_25==end){
var _2d;
_27=_25;
while(_27&&_27!==_22.editNode&&_27!==_22.document.body){
if(_27.nodeType==1){
tag=_27.tagName?_27.tagName.toLowerCase():"";
if(_1.indexOf(this.values,tag)!==-1){
_2d=_27;
break;
}
}
_27=_27.parentNode;
}
_28(_25,_2c);
if(_2d){
_2c=[_2d].concat(_2c);
}
_2a(_2c);
}else{
_27=_25;
while(_22._sCall("inSelection",[_27])){
if(_27.nodeType==1){
tag=_27.tagName?_27.tagName.toLowerCase():"";
if(_1.indexOf(this.values,tag)!==-1){
_2c.push(_27);
}
_28(_27,_2c);
}
_27=_27.nextSibling;
}
_2a(_2c);
}
_22.onDisplayChanged();
}
}
}else{
_22.execCommand(_23,_24);
}
},_removeFormat:function(_2e,_2f){
if(_2e.customUndo){
while(_2f.firstChild){
_3.place(_2f.firstChild,_2f,"before");
}
_2f.parentNode.removeChild(_2f);
}else{
_2e._sCall("selectElementChildren",[_2f]);
var _30=_2e._sCall("getSelectedHtml",[]);
_2e._sCall("selectElement",[_2f]);
_2e.execCommand("inserthtml",_30||"");
}
}});
var _31=_2("dijit._editor.plugins.FontChoice",_c,{useDefaultCommand:false,_initButton:function(){
var _32={fontName:_14,fontSize:_19,formatBlock:_1f}[this.command],_33=this.params;
if(this.params.custom){
_33.values=this.params.custom;
}
var _34=this.editor;
this.button=new _32(_5.delegate({dir:_34.dir,lang:_34.lang},_33));
this.connect(this.button.select,"onChange",function(_35){
this.editor.focus();
if(this.command=="fontName"&&_35.indexOf(" ")!=-1){
_35="'"+_35+"'";
}
if(this.button._execCommand){
this.button._execCommand(this.editor,this.command,_35);
}else{
this.editor.execCommand(this.command,_35);
}
});
},updateState:function(){
var _36=this.editor;
var _37=this.command;
if(!_36||!_36.isLoaded||!_37.length){
return;
}
if(this.button){
var _38=this.get("disabled");
this.button.set("disabled",_38);
if(_38){
return;
}
var _39;
try{
_39=_36.queryCommandValue(_37)||"";
}
catch(e){
_39="";
}
var _3a=_5.isString(_39)&&_39.match(/'([^']*)'/);
if(_3a){
_39=_3a[1];
}
if(_37==="formatBlock"){
if(!_39||_39=="p"){
_39=null;
var _3b;
var sel=_d.getSelection(this.editor.window);
if(sel&&sel.rangeCount>0){
var _3c=sel.getRangeAt(0);
if(_3c){
_3b=_3c.endContainer;
}
}
while(_3b&&_3b!==_36.editNode&&_3b!==_36.document){
var tg=_3b.tagName?_3b.tagName.toLowerCase():"";
if(tg&&_1.indexOf(this.button.values,tg)>-1){
_39=tg;
break;
}
_3b=_3b.parentNode;
}
if(!_39){
_39="noFormat";
}
}else{
if(_1.indexOf(this.button.values,_39)<0){
_39="noFormat";
}
}
}
if(_39!==this.button.get("value")){
this.button.set("value",_39,false);
}
}
}});
_1.forEach(["fontName","fontSize","formatBlock"],function(_3d){
_c.registry[_3d]=function(_3e){
return new _31({command:_3d,plainText:_3e.plainText});
};
});
_31._FontDropDown=_e;
_31._FontNameDropDown=_14;
_31._FontSizeDropDown=_19;
_31._FormatBlockDropDown=_1f;
return _31;
});
},"url:dijit/templates/CheckedMenuItem.html":"<tr class=\"dijitReset dijitMenuItem\" data-dojo-attach-point=\"focusNode\" role=\"menuitemcheckbox\" tabIndex=\"-1\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuItemIcon dijitCheckedMenuItemIcon\" data-dojo-attach-point=\"iconNode\"/>\n\t\t<span class=\"dijitCheckedMenuItemIconChar\">&#10003;</span>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" data-dojo-attach-point=\"containerNode,labelNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" data-dojo-attach-point=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">&#160;</td>\n</tr>\n","dijit/form/TextBox":function(){
define(["dojo/_base/declare","dojo/dom-construct","dojo/dom-style","dojo/_base/kernel","dojo/_base/lang","dojo/sniff","./_FormValueWidget","./_TextBoxMixin","dojo/text!./templates/TextBox.html","../main"],function(_3f,_40,_41,_42,_43,has,_44,_45,_46,_47){
var _48=_3f("dijit.form.TextBox",[_44,_45],{templateString:_46,_singleNodeTemplate:"<input class=\"dijit dijitReset dijitLeft dijitInputField\" data-dojo-attach-point=\"textbox,focusNode\" autocomplete=\"off\" type=\"${type}\" ${!nameAttrSetting} />",_buttonInputDisabled:has("ie")?"disabled":"",baseClass:"dijitTextBox",postMixInProperties:function(){
var _49=this.type.toLowerCase();
if(this.templateString&&this.templateString.toLowerCase()=="input"||((_49=="hidden"||_49=="file")&&this.templateString==this.constructor.prototype.templateString)){
this.templateString=this._singleNodeTemplate;
}
this.inherited(arguments);
},postCreate:function(){
this.inherited(arguments);
if(has("ie")<9){
this.defer(function(){
try{
var s=_41.getComputedStyle(this.domNode);
if(s){
var ff=s.fontFamily;
if(ff){
var _4a=this.domNode.getElementsByTagName("INPUT");
if(_4a){
for(var i=0;i<_4a.length;i++){
_4a[i].style.fontFamily=ff;
}
}
}
}
}
catch(e){
}
});
}
},_onInput:function(e){
this.inherited(arguments);
if(this.intermediateChanges){
this.defer(function(){
this._handleOnChange(this.get("value"),false);
});
}
},_setPlaceHolderAttr:function(v){
this._set("placeHolder",v);
if(!this._phspan){
this._attachPoints.push("_phspan");
this._phspan=_40.create("span",{onmousedown:function(e){
e.preventDefault();
},className:"dijitPlaceHolder dijitInputField"},this.textbox,"after");
}
this._phspan.innerHTML="";
this._phspan.appendChild(this._phspan.ownerDocument.createTextNode(v));
this._updatePlaceHolder();
},_updatePlaceHolder:function(){
if(this._phspan){
this._phspan.style.display=(this.placeHolder&&!this.focused&&!this.textbox.value)?"":"none";
}
},_setValueAttr:function(_4b,_4c,_4d){
this.inherited(arguments);
this._updatePlaceHolder();
},getDisplayedValue:function(){
_42.deprecated(this.declaredClass+"::getDisplayedValue() is deprecated. Use get('displayedValue') instead.","","2.0");
return this.get("displayedValue");
},setDisplayedValue:function(_4e){
_42.deprecated(this.declaredClass+"::setDisplayedValue() is deprecated. Use set('displayedValue', ...) instead.","","2.0");
this.set("displayedValue",_4e);
},_onBlur:function(e){
if(this.disabled){
return;
}
this.inherited(arguments);
this._updatePlaceHolder();
if(has("mozilla")){
if(this.selectOnClick){
this.textbox.selectionStart=this.textbox.selectionEnd=undefined;
}
}
},_onFocus:function(by){
if(this.disabled||this.readOnly){
return;
}
this.inherited(arguments);
this._updatePlaceHolder();
}});
if(has("ie")){
_48.prototype._isTextSelected=function(){
var _4f=this.ownerDocument.selection.createRange();
var _50=_4f.parentElement();
return _50==this.textbox&&_4f.text.length>0;
};
_47._setSelectionRange=_45._setSelectionRange=function(_51,_52,_53){
if(_51.createTextRange){
var r=_51.createTextRange();
r.collapse(true);
r.moveStart("character",-99999);
r.moveStart("character",_52);
r.moveEnd("character",_53-_52);
r.select();
}
};
}
return _48;
});
},"dojo/currency":function(){
define(["./_base/array","./_base/lang","./number","./i18n","./i18n!./cldr/nls/currency","./cldr/monetary"],function(_54,_55,_56,_57,_58,_59){
var _5a={};
_55.setObject("dojo.currency",_5a);
_5a._mixInDefaults=function(_5b){
_5b=_5b||{};
_5b.type="currency";
var _5c=_57.getLocalization("dojo.cldr","currency",_5b.locale)||{};
var iso=_5b.currency;
var _5d=_59.getData(iso);
_54.forEach(["displayName","symbol","group","decimal"],function(_5e){
_5d[_5e]=_5c[iso+"_"+_5e];
});
_5d.fractional=[true,false];
return _55.mixin(_5d,_5b);
};
_5a.format=function(_5f,_60){
return _56.format(_5f,_5a._mixInDefaults(_60));
};
_5a.regexp=function(_61){
return _56.regexp(_5a._mixInDefaults(_61));
};
_5a.parse=function(_62,_63){
return _56.parse(_62,_5a._mixInDefaults(_63));
};
return _5a;
});
},"dijit/layout/ScrollingTabController":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dom-class","dojo/dom-geometry","dojo/dom-style","dojo/_base/fx","dojo/_base/lang","dojo/on","dojo/query","dojo/sniff","../registry","dojo/text!./templates/ScrollingTabController.html","dojo/text!./templates/_ScrollingTabControllerButton.html","./TabController","./utils","../_WidgetsInTemplateMixin","../Menu","../MenuItem","../form/Button","../_HasDropDown","dojo/NodeList-dom"],function(_64,_65,_66,_67,_68,fx,_69,on,_6a,has,_6b,_6c,_6d,_6e,_6f,_70,_71,_72,_73,_74){
var _75=_65("dijit.layout.ScrollingTabController",[_6e,_70],{baseClass:"dijitTabController dijitScrollingTabController",templateString:_6c,useMenu:true,useSlider:true,tabStripClass:"",widgetsInTemplate:true,_minScroll:5,_setClassAttr:{node:"containerNode",type:"class"},buildRendering:function(){
this.inherited(arguments);
var n=this.domNode;
this.scrollNode=this.tablistWrapper;
this._initButtons();
if(!this.tabStripClass){
this.tabStripClass="dijitTabContainer"+this.tabPosition.charAt(0).toUpperCase()+this.tabPosition.substr(1).replace(/-.*/,"")+"None";
_66.add(n,"tabStrip-disabled");
}
_66.add(this.tablistWrapper,this.tabStripClass);
},onStartup:function(){
this.inherited(arguments);
_68.set(this.domNode,"visibility","");
this._postStartup=true;
this.own(on(this.containerNode,"attrmodified-label, attrmodified-iconclass",_69.hitch(this,function(evt){
if(this._dim){
this.resize(this._dim);
}
})));
},onAddChild:function(_76,_77){
this.inherited(arguments);
_68.set(this.containerNode,"width",(_68.get(this.containerNode,"width")+200)+"px");
},onRemoveChild:function(_78,_79){
var _7a=this.pane2button[_78.id];
if(this._selectedTab===_7a.domNode){
this._selectedTab=null;
}
this.inherited(arguments);
},_initButtons:function(){
this._btnWidth=0;
this._buttons=_6a("> .tabStripButton",this.domNode).filter(function(btn){
if((this.useMenu&&btn==this._menuBtn.domNode)||(this.useSlider&&(btn==this._rightBtn.domNode||btn==this._leftBtn.domNode))){
this._btnWidth+=_67.getMarginSize(btn).w;
return true;
}else{
_68.set(btn,"display","none");
return false;
}
},this);
},_getTabsWidth:function(){
var _7b=this.getChildren();
if(_7b.length){
var _7c=_7b[this.isLeftToRight()?0:_7b.length-1].domNode,_7d=_7b[this.isLeftToRight()?_7b.length-1:0].domNode;
return _7d.offsetLeft+_7d.offsetWidth-_7c.offsetLeft;
}else{
return 0;
}
},_enableBtn:function(_7e){
var _7f=this._getTabsWidth();
_7e=_7e||_68.get(this.scrollNode,"width");
return _7f>0&&_7e<_7f;
},resize:function(dim){
this._dim=dim;
this.scrollNode.style.height="auto";
var cb=this._contentBox=_6f.marginBox2contentBox(this.domNode,{h:0,w:dim.w});
cb.h=this.scrollNode.offsetHeight;
_67.setContentSize(this.domNode,cb);
var _80=this._enableBtn(this._contentBox.w);
this._buttons.style("display",_80?"":"none");
this._leftBtn.layoutAlign="left";
this._rightBtn.layoutAlign="right";
this._menuBtn.layoutAlign=this.isLeftToRight()?"right":"left";
_6f.layoutChildren(this.domNode,this._contentBox,[this._menuBtn,this._leftBtn,this._rightBtn,{domNode:this.scrollNode,layoutAlign:"client"}]);
if(this._selectedTab){
if(this._anim&&this._anim.status()=="playing"){
this._anim.stop();
}
this.scrollNode.scrollLeft=this._convertToScrollLeft(this._getScrollForSelectedTab());
}
this._setButtonClass(this._getScroll());
this._postResize=true;
return {h:this._contentBox.h,w:dim.w};
},_getScroll:function(){
return (this.isLeftToRight()||has("ie")<8||(has("ie")&&has("quirks"))||has("webkit"))?this.scrollNode.scrollLeft:_68.get(this.containerNode,"width")-_68.get(this.scrollNode,"width")+(has("ie")>=8?-1:1)*this.scrollNode.scrollLeft;
},_convertToScrollLeft:function(val){
if(this.isLeftToRight()||has("ie")<8||(has("ie")&&has("quirks"))||has("webkit")){
return val;
}else{
var _81=_68.get(this.containerNode,"width")-_68.get(this.scrollNode,"width");
return (has("ie")>=8?-1:1)*(val-_81);
}
},onSelectChild:function(_82){
var tab=this.pane2button[_82.id];
if(!tab||!_82){
return;
}
var _83=tab.domNode;
if(_83!=this._selectedTab){
this._selectedTab=_83;
if(this._postResize){
var sl=this._getScroll();
if(sl>_83.offsetLeft||sl+_68.get(this.scrollNode,"width")<_83.offsetLeft+_68.get(_83,"width")){
this.createSmoothScroll().play();
}
}
}
this.inherited(arguments);
},_getScrollBounds:function(){
var _84=this.getChildren(),_85=_68.get(this.scrollNode,"width"),_86=_68.get(this.containerNode,"width"),_87=_86-_85,_88=this._getTabsWidth();
if(_84.length&&_88>_85){
return {min:this.isLeftToRight()?0:_84[_84.length-1].domNode.offsetLeft,max:this.isLeftToRight()?(_84[_84.length-1].domNode.offsetLeft+_84[_84.length-1].domNode.offsetWidth)-_85:_87};
}else{
var _89=this.isLeftToRight()?0:_87;
return {min:_89,max:_89};
}
},_getScrollForSelectedTab:function(){
var w=this.scrollNode,n=this._selectedTab,_8a=_68.get(this.scrollNode,"width"),_8b=this._getScrollBounds();
var pos=(n.offsetLeft+_68.get(n,"width")/2)-_8a/2;
pos=Math.min(Math.max(pos,_8b.min),_8b.max);
return pos;
},createSmoothScroll:function(x){
if(arguments.length>0){
var _8c=this._getScrollBounds();
x=Math.min(Math.max(x,_8c.min),_8c.max);
}else{
x=this._getScrollForSelectedTab();
}
if(this._anim&&this._anim.status()=="playing"){
this._anim.stop();
}
var _8d=this,w=this.scrollNode,_8e=new fx.Animation({beforeBegin:function(){
if(this.curve){
delete this.curve;
}
var _8f=w.scrollLeft,_90=_8d._convertToScrollLeft(x);
_8e.curve=new fx._Line(_8f,_90);
},onAnimate:function(val){
w.scrollLeft=val;
}});
this._anim=_8e;
this._setButtonClass(x);
return _8e;
},_getBtnNode:function(e){
var n=e.target;
while(n&&!_66.contains(n,"tabStripButton")){
n=n.parentNode;
}
return n;
},doSlideRight:function(e){
this.doSlide(1,this._getBtnNode(e));
},doSlideLeft:function(e){
this.doSlide(-1,this._getBtnNode(e));
},doSlide:function(_91,_92){
if(_92&&_66.contains(_92,"dijitTabDisabled")){
return;
}
var _93=_68.get(this.scrollNode,"width");
var d=(_93*0.75)*_91;
var to=this._getScroll()+d;
this._setButtonClass(to);
this.createSmoothScroll(to).play();
},_setButtonClass:function(_94){
var _95=this._getScrollBounds();
this._leftBtn.set("disabled",_94<=_95.min);
this._rightBtn.set("disabled",_94>=_95.max);
}});
var _96=_65("dijit.layout._ScrollingTabControllerButtonMixin",null,{baseClass:"dijitTab tabStripButton",templateString:_6d,tabIndex:"",isFocusable:function(){
return false;
}});
_65("dijit.layout._ScrollingTabControllerButton",[_73,_96]);
_65("dijit.layout._ScrollingTabControllerMenuButton",[_73,_74,_96],{containerId:"",tabIndex:"-1",isLoaded:function(){
return false;
},loadDropDown:function(_97){
this.dropDown=new _71({id:this.containerId+"_menu",ownerDocument:this.ownerDocument,dir:this.dir,lang:this.lang,textDir:this.textDir});
var _98=_6b.byId(this.containerId);
_64.forEach(_98.getChildren(),function(_99){
var _9a=new _72({id:_99.id+"_stcMi",label:_99.title,iconClass:_99.iconClass,disabled:_99.disabled,ownerDocument:this.ownerDocument,dir:_99.dir,lang:_99.lang,textDir:_99.textDir,onClick:function(){
_98.selectChild(_99);
}});
this.dropDown.addChild(_9a);
},this);
_97();
},closeDropDown:function(_9b){
this.inherited(arguments);
if(this.dropDown){
this.dropDown.destroyRecursive();
delete this.dropDown;
}
}});
return _75;
});
},"url:dijit/form/templates/ComboButton.html":"<table class=\"dijit dijitReset dijitInline dijitLeft\"\n\tcellspacing='0' cellpadding='0' role=\"presentation\"\n\t><tbody role=\"presentation\"><tr role=\"presentation\"\n\t\t><td class=\"dijitReset dijitStretch dijitButtonNode\" data-dojo-attach-point=\"buttonNode\" data-dojo-attach-event=\"ondijitclick:_onClick,onkeypress:_onButtonKeyPress\"\n\t\t><div id=\"${id}_button\" class=\"dijitReset dijitButtonContents\"\n\t\t\tdata-dojo-attach-point=\"titleNode\"\n\t\t\trole=\"button\" aria-labelledby=\"${id}_label\"\n\t\t\t><div class=\"dijitReset dijitInline dijitIcon\" data-dojo-attach-point=\"iconNode\" role=\"presentation\"></div\n\t\t\t><div class=\"dijitReset dijitInline dijitButtonText\" id=\"${id}_label\" data-dojo-attach-point=\"containerNode\" role=\"presentation\"></div\n\t\t></div\n\t\t></td\n\t\t><td id=\"${id}_arrow\" class='dijitReset dijitRight dijitButtonNode dijitArrowButton'\n\t\t\tdata-dojo-attach-point=\"_popupStateNode,focusNode,_buttonNode\"\n\t\t\tdata-dojo-attach-event=\"onkeypress:_onArrowKeyPress\"\n\t\t\ttitle=\"${optionsTitle}\"\n\t\t\trole=\"button\" aria-haspopup=\"true\"\n\t\t\t><div class=\"dijitReset dijitArrowButtonInner\" role=\"presentation\"></div\n\t\t\t><div class=\"dijitReset dijitArrowButtonChar\" role=\"presentation\">&#9660;</div\n\t\t></td\n\t\t><td style=\"display:none !important;\"\n\t\t\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" data-dojo-attach-point=\"valueNode\" role=\"presentation\"\n\t\t/></td></tr></tbody\n></table>\n","dijit/DialogUnderlay":function(){
define(["dojo/_base/declare","dojo/dom-attr","dojo/window","./_Widget","./_TemplatedMixin","./BackgroundIframe"],function(_9c,_9d,_9e,_9f,_a0,_a1){
return _9c("dijit.DialogUnderlay",[_9f,_a0],{templateString:"<div class='dijitDialogUnderlayWrapper'><div class='dijitDialogUnderlay' data-dojo-attach-point='node'></div></div>",dialogId:"","class":"",_setDialogIdAttr:function(id){
_9d.set(this.node,"id",id+"_underlay");
this._set("dialogId",id);
},_setClassAttr:function(_a2){
this.node.className="dijitDialogUnderlay "+_a2;
this._set("class",_a2);
},postCreate:function(){
this.ownerDocumentBody.appendChild(this.domNode);
},layout:function(){
var is=this.node.style,os=this.domNode.style;
os.display="none";
var _a3=_9e.getBox(this.ownerDocument);
os.top=_a3.t+"px";
os.left=_a3.l+"px";
is.width=_a3.w+"px";
is.height=_a3.h+"px";
os.display="block";
},show:function(){
this.domNode.style.display="block";
this.layout();
this.bgIframe=new _a1(this.domNode);
},hide:function(){
this.bgIframe.destroy();
delete this.bgIframe;
this.domNode.style.display="none";
}});
});
},"dijit/_editor/html":function(){
define(["dojo/_base/array","dojo/_base/lang","dojo/sniff"],function(_a4,_a5,has){
var _a6={};
_a5.setObject("dijit._editor.html",_a6);
var _a7=_a6.escapeXml=function(str,_a8){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_a8){
str=str.replace(/'/gm,"&#39;");
}
return str;
};
_a6.getNodeHtml=function(_a9){
var _aa=[];
_a6.getNodeHtmlHelper(_a9,_aa);
return _aa.join("");
};
_a6.getNodeHtmlHelper=function(_ab,_ac){
switch(_ab.nodeType){
case 1:
var _ad=_ab.nodeName.toLowerCase();
if(!_ad||_ad.charAt(0)=="/"){
return "";
}
_ac.push("<",_ad);
var _ae=[],_af={};
var _b0;
if(has("dom-attributes-explicit")||has("dom-attributes-specified-flag")){
var i=0;
while((_b0=_ab.attributes[i++])){
var n=_b0.name;
if(n.substr(0,3)!=="_dj"&&(!has("dom-attributes-specified-flag")||_b0.specified)&&!(n in _af)){
var v=_b0.value;
if(n=="src"||n=="href"){
if(_ab.getAttribute("_djrealurl")){
v=_ab.getAttribute("_djrealurl");
}
}
if(has("ie")===8&&n==="style"){
v=v.replace("HEIGHT:","height:").replace("WIDTH:","width:");
}
_ae.push([n,v]);
_af[n]=v;
}
}
}else{
var _b1=/^input$|^img$/i.test(_ab.nodeName)?_ab:_ab.cloneNode(false);
var s=_b1.outerHTML;
var _b2=/[\w-]+=("[^"]*"|'[^']*'|\S*)/gi;
var _b3=s.match(_b2);
s=s.substr(0,s.indexOf(">"));
_a4.forEach(_b3,function(_b4){
if(_b4){
var idx=_b4.indexOf("=");
if(idx>0){
var key=_b4.substring(0,idx);
if(key.substr(0,3)!="_dj"){
if(key=="src"||key=="href"){
if(_ab.getAttribute("_djrealurl")){
_ae.push([key,_ab.getAttribute("_djrealurl")]);
return;
}
}
var val,_b5;
switch(key){
case "style":
val=_ab.style.cssText.toLowerCase();
break;
case "class":
val=_ab.className;
break;
case "width":
if(_ad==="img"){
_b5=/width=(\S+)/i.exec(s);
if(_b5){
val=_b5[1];
}
break;
}
case "height":
if(_ad==="img"){
_b5=/height=(\S+)/i.exec(s);
if(_b5){
val=_b5[1];
}
break;
}
default:
val=_ab.getAttribute(key);
}
if(val!=null){
_ae.push([key,val.toString()]);
}
}
}
}
},this);
}
_ae.sort(function(a,b){
return a[0]<b[0]?-1:(a[0]==b[0]?0:1);
});
var j=0;
while((_b0=_ae[j++])){
_ac.push(" ",_b0[0],"=\"",(typeof _b0[1]==="string"?_a7(_b0[1],true):_b0[1]),"\"");
}
switch(_ad){
case "br":
case "hr":
case "img":
case "input":
case "base":
case "meta":
case "area":
case "basefont":
_ac.push(" />");
break;
case "script":
_ac.push(">",_ab.innerHTML,"</",_ad,">");
break;
default:
_ac.push(">");
if(_ab.hasChildNodes()){
_a6.getChildrenHtmlHelper(_ab,_ac);
}
_ac.push("</",_ad,">");
}
break;
case 4:
case 3:
_ac.push(_a7(_ab.nodeValue,true));
break;
case 8:
_ac.push("<!--",_a7(_ab.nodeValue,true),"-->");
break;
default:
_ac.push("<!-- Element not recognized - Type: ",_ab.nodeType," Name: ",_ab.nodeName,"-->");
}
};
_a6.getChildrenHtml=function(_b6){
var _b7=[];
_a6.getChildrenHtmlHelper(_b6,_b7);
return _b7.join("");
};
_a6.getChildrenHtmlHelper=function(dom,_b8){
if(!dom){
return;
}
var _b9=dom["childNodes"]||dom;
var _ba=!has("ie")||_b9!==dom;
var _bb,i=0;
while((_bb=_b9[i++])){
if(!_ba||_bb.parentNode==dom){
_a6.getNodeHtmlHelper(_bb,_b8);
}
}
};
return _a6;
});
},"dijit/_HasDropDown":function(){
define(["dojo/_base/declare","dojo/_base/Deferred","dojo/_base/event","dojo/dom","dojo/dom-attr","dojo/dom-class","dojo/dom-geometry","dojo/dom-style","dojo/has","dojo/keys","dojo/_base/lang","dojo/on","dojo/window","./registry","./focus","./popup","./_FocusMixin"],function(_bc,_bd,_be,dom,_bf,_c0,_c1,_c2,has,_c3,_c4,on,_c5,_c6,_c7,_c8,_c9){
return _bc("dijit._HasDropDown",_c9,{_buttonNode:null,_arrowWrapperNode:null,_popupStateNode:null,_aroundNode:null,dropDown:null,autoWidth:true,forceWidth:false,maxHeight:0,dropDownPosition:["below","above"],_stopClickEvents:true,_onDropDownMouseDown:function(e){
if(this.disabled||this.readOnly){
return;
}
e.preventDefault();
this._docHandler=this.connect(this.ownerDocument,"mouseup","_onDropDownMouseUp");
this.toggleDropDown();
},_onDropDownMouseUp:function(e){
if(e&&this._docHandler){
this.disconnect(this._docHandler);
}
var _ca=this.dropDown,_cb=false;
if(e&&this._opened){
var c=_c1.position(this._buttonNode,true);
if(!(e.pageX>=c.x&&e.pageX<=c.x+c.w)||!(e.pageY>=c.y&&e.pageY<=c.y+c.h)){
var t=e.target;
while(t&&!_cb){
if(_c0.contains(t,"dijitPopup")){
_cb=true;
}else{
t=t.parentNode;
}
}
if(_cb){
t=e.target;
if(_ca.onItemClick){
var _cc;
while(t&&!(_cc=_c6.byNode(t))){
t=t.parentNode;
}
if(_cc&&_cc.onClick&&_cc.getParent){
_cc.getParent().onItemClick(_cc,e);
}
}
return;
}
}
}
if(this._opened){
if(_ca.focus&&_ca.autoFocus!==false){
this._focusDropDownTimer=this.defer(function(){
_ca.focus();
delete this._focusDropDownTimer;
});
}
}else{
this.defer("focus");
}
if(has("ios")){
this._justGotMouseUp=true;
this.defer(function(){
this._justGotMouseUp=false;
});
}
},_onDropDownClick:function(e){
if(has("touch")&&!this._justGotMouseUp){
this._onDropDownMouseDown(e);
this._onDropDownMouseUp(e);
}
if(this._stopClickEvents){
_be.stop(e);
}
},buildRendering:function(){
this.inherited(arguments);
this._buttonNode=this._buttonNode||this.focusNode||this.domNode;
this._popupStateNode=this._popupStateNode||this.focusNode||this._buttonNode;
var _cd={"after":this.isLeftToRight()?"Right":"Left","before":this.isLeftToRight()?"Left":"Right","above":"Up","below":"Down","left":"Left","right":"Right"}[this.dropDownPosition[0]]||this.dropDownPosition[0]||"Down";
_c0.add(this._arrowWrapperNode||this._buttonNode,"dijit"+_cd+"ArrowButton");
},postCreate:function(){
this.inherited(arguments);
this.own(on(this._buttonNode,"mousedown",_c4.hitch(this,"_onDropDownMouseDown")),on(this._buttonNode,"click",_c4.hitch(this,"_onDropDownClick")),on(this.focusNode,"keydown",_c4.hitch(this,"_onKey")),on(this.focusNode,"keyup",_c4.hitch(this,"_onKeyUp")));
},destroy:function(){
if(this.dropDown){
if(!this.dropDown._destroyed){
this.dropDown.destroyRecursive();
}
delete this.dropDown;
}
this.inherited(arguments);
},_onKey:function(e){
if(this.disabled||this.readOnly){
return;
}
var d=this.dropDown,_ce=e.target;
if(d&&this._opened&&d.handleKey){
if(d.handleKey(e)===false){
_be.stop(e);
return;
}
}
if(d&&this._opened&&e.keyCode==_c3.ESCAPE){
this.closeDropDown();
_be.stop(e);
}else{
if(!this._opened&&(e.keyCode==_c3.DOWN_ARROW||((e.keyCode==_c3.ENTER||e.keyCode==_c3.SPACE)&&((_ce.tagName||"").toLowerCase()!=="input"||(_ce.type&&_ce.type.toLowerCase()!=="text"))))){
this._toggleOnKeyUp=true;
_be.stop(e);
}
}
},_onKeyUp:function(){
if(this._toggleOnKeyUp){
delete this._toggleOnKeyUp;
this.toggleDropDown();
var d=this.dropDown;
if(d&&d.focus){
this.defer(_c4.hitch(d,"focus"),1);
}
}
},_onBlur:function(){
var _cf=_c7.curNode&&this.dropDown&&dom.isDescendant(_c7.curNode,this.dropDown.domNode);
this.closeDropDown(_cf);
this.inherited(arguments);
},isLoaded:function(){
return true;
},loadDropDown:function(_d0){
_d0();
},loadAndOpenDropDown:function(){
var d=new _bd(),_d1=_c4.hitch(this,function(){
this.openDropDown();
d.resolve(this.dropDown);
});
if(!this.isLoaded()){
this.loadDropDown(_d1);
}else{
_d1();
}
return d;
},toggleDropDown:function(){
if(this.disabled||this.readOnly){
return;
}
if(!this._opened){
this.loadAndOpenDropDown();
}else{
this.closeDropDown();
}
},openDropDown:function(){
var _d2=this.dropDown,_d3=_d2.domNode,_d4=this._aroundNode||this.domNode,_d5=this;
if(!this._preparedNode){
this._preparedNode=true;
if(_d3.style.width){
this._explicitDDWidth=true;
}
if(_d3.style.height){
this._explicitDDHeight=true;
}
}
if(this.maxHeight||this.forceWidth||this.autoWidth){
var _d6={display:"",visibility:"hidden"};
if(!this._explicitDDWidth){
_d6.width="";
}
if(!this._explicitDDHeight){
_d6.height="";
}
_c2.set(_d3,_d6);
var _d7=this.maxHeight;
if(_d7==-1){
var _d8=_c5.getBox(this.ownerDocument),_d9=_c1.position(_d4,false);
_d7=Math.floor(Math.max(_d9.y,_d8.h-(_d9.y+_d9.h)));
}
_c8.moveOffScreen(_d2);
if(_d2.startup&&!_d2._started){
_d2.startup();
}
var mb=_c1.getMarginSize(_d3);
var _da=(_d7&&mb.h>_d7);
_c2.set(_d3,{overflowX:"visible",overflowY:_da?"auto":"visible"});
if(_da){
mb.h=_d7;
if("w" in mb){
mb.w+=16;
}
}else{
delete mb.h;
}
if(this.forceWidth){
mb.w=_d4.offsetWidth;
}else{
if(this.autoWidth){
mb.w=Math.max(mb.w,_d4.offsetWidth);
}else{
delete mb.w;
}
}
if(_c4.isFunction(_d2.resize)){
_d2.resize(mb);
}else{
_c1.setMarginBox(_d3,mb);
}
}
var _db=_c8.open({parent:this,popup:_d2,around:_d4,orient:this.dropDownPosition,onExecute:function(){
_d5.closeDropDown(true);
},onCancel:function(){
_d5.closeDropDown(true);
},onClose:function(){
_bf.set(_d5._popupStateNode,"popupActive",false);
_c0.remove(_d5._popupStateNode,"dijitHasDropDownOpen");
_d5._set("_opened",false);
}});
_bf.set(this._popupStateNode,"popupActive","true");
_c0.add(this._popupStateNode,"dijitHasDropDownOpen");
this._set("_opened",true);
this.domNode.setAttribute("aria-expanded","true");
return _db;
},closeDropDown:function(_dc){
if(this._focusDropDownTimer){
this._focusDropDownTimer.remove();
delete this._focusDropDownTimer;
}
if(this._opened){
this.domNode.setAttribute("aria-expanded","false");
if(_dc){
this.focus();
}
_c8.close(this.dropDown);
this._opened=false;
}
}});
});
},"dijit/tree/TreeStoreModel":function(){
define(["dojo/_base/array","dojo/aspect","dojo/_base/declare","dojo/_base/lang"],function(_dd,_de,_df,_e0){
return _df("dijit.tree.TreeStoreModel",null,{store:null,childrenAttrs:["children"],newItemIdAttr:"id",labelAttr:"",root:null,query:null,deferItemLoadingUntilExpand:false,constructor:function(_e1){
_e0.mixin(this,_e1);
this.connects=[];
var _e2=this.store;
if(!_e2.getFeatures()["dojo.data.api.Identity"]){
throw new Error("dijit.tree.TreeStoreModel: store must support dojo.data.Identity");
}
if(_e2.getFeatures()["dojo.data.api.Notification"]){
this.connects=this.connects.concat([_de.after(_e2,"onNew",_e0.hitch(this,"onNewItem"),true),_de.after(_e2,"onDelete",_e0.hitch(this,"onDeleteItem"),true),_de.after(_e2,"onSet",_e0.hitch(this,"onSetItem"),true)]);
}
},destroy:function(){
var h;
while(h=this.connects.pop()){
h.remove();
}
},getRoot:function(_e3,_e4){
if(this.root){
_e3(this.root);
}else{
this.store.fetch({query:this.query,onComplete:_e0.hitch(this,function(_e5){
if(_e5.length!=1){
throw new Error("dijit.tree.TreeStoreModel: root query returned "+_e5.length+" items, but must return exactly one");
}
this.root=_e5[0];
_e3(this.root);
}),onError:_e4});
}
},mayHaveChildren:function(_e6){
return _dd.some(this.childrenAttrs,function(_e7){
return this.store.hasAttribute(_e6,_e7);
},this);
},getChildren:function(_e8,_e9,_ea){
var _eb=this.store;
if(!_eb.isItemLoaded(_e8)){
var _ec=_e0.hitch(this,arguments.callee);
_eb.loadItem({item:_e8,onItem:function(_ed){
_ec(_ed,_e9,_ea);
},onError:_ea});
return;
}
var _ee=[];
for(var i=0;i<this.childrenAttrs.length;i++){
var _ef=_eb.getValues(_e8,this.childrenAttrs[i]);
_ee=_ee.concat(_ef);
}
var _f0=0;
if(!this.deferItemLoadingUntilExpand){
_dd.forEach(_ee,function(_f1){
if(!_eb.isItemLoaded(_f1)){
_f0++;
}
});
}
if(_f0==0){
_e9(_ee);
}else{
_dd.forEach(_ee,function(_f2,idx){
if(!_eb.isItemLoaded(_f2)){
_eb.loadItem({item:_f2,onItem:function(_f3){
_ee[idx]=_f3;
if(--_f0==0){
_e9(_ee);
}
},onError:_ea});
}
});
}
},isItem:function(_f4){
return this.store.isItem(_f4);
},fetchItemByIdentity:function(_f5){
this.store.fetchItemByIdentity(_f5);
},getIdentity:function(_f6){
return this.store.getIdentity(_f6);
},getLabel:function(_f7){
if(this.labelAttr){
return this.store.getValue(_f7,this.labelAttr);
}else{
return this.store.getLabel(_f7);
}
},newItem:function(_f8,_f9,_fa){
var _fb={parent:_f9,attribute:this.childrenAttrs[0]},_fc;
if(this.newItemIdAttr&&_f8[this.newItemIdAttr]){
this.fetchItemByIdentity({identity:_f8[this.newItemIdAttr],scope:this,onItem:function(_fd){
if(_fd){
this.pasteItem(_fd,null,_f9,true,_fa);
}else{
_fc=this.store.newItem(_f8,_fb);
if(_fc&&(_fa!=undefined)){
this.pasteItem(_fc,_f9,_f9,false,_fa);
}
}
}});
}else{
_fc=this.store.newItem(_f8,_fb);
if(_fc&&(_fa!=undefined)){
this.pasteItem(_fc,_f9,_f9,false,_fa);
}
}
},pasteItem:function(_fe,_ff,_100,_101,_102){
var _103=this.store,_104=this.childrenAttrs[0];
if(_ff){
_dd.forEach(this.childrenAttrs,function(attr){
if(_103.containsValue(_ff,attr,_fe)){
if(!_101){
var _105=_dd.filter(_103.getValues(_ff,attr),function(x){
return x!=_fe;
});
_103.setValues(_ff,attr,_105);
}
_104=attr;
}
});
}
if(_100){
if(typeof _102=="number"){
var _106=_103.getValues(_100,_104).slice();
_106.splice(_102,0,_fe);
_103.setValues(_100,_104,_106);
}else{
_103.setValues(_100,_104,_103.getValues(_100,_104).concat(_fe));
}
}
},onChange:function(){
},onChildrenChange:function(){
},onDelete:function(){
},onNewItem:function(item,_107){
if(!_107){
return;
}
this.getChildren(_107.item,_e0.hitch(this,function(_108){
this.onChildrenChange(_107.item,_108);
}));
},onDeleteItem:function(item){
this.onDelete(item);
},onSetItem:function(item,_109){
if(_dd.indexOf(this.childrenAttrs,_109)!=-1){
this.getChildren(item,_e0.hitch(this,function(_10a){
this.onChildrenChange(item,_10a);
}));
}else{
this.onChange(item);
}
}});
});
},"dijit/_editor/plugins/EnterKeyHandling":function(){
define(["dojo/_base/declare","dojo/dom-construct","dojo/_base/event","dojo/keys","dojo/_base/lang","dojo/sniff","dojo/_base/window","dojo/window","../_Plugin","../RichText","../range","../../_base/focus"],function(_10b,_10c,_10d,keys,lang,has,win,_10e,_10f,_110,_111,_112){
return _10b("dijit._editor.plugins.EnterKeyHandling",_10f,{blockNodeForEnter:"BR",constructor:function(args){
if(args){
if("blockNodeForEnter" in args){
args.blockNodeForEnter=args.blockNodeForEnter.toUpperCase();
}
lang.mixin(this,args);
}
},setEditor:function(_113){
if(this.editor===_113){
return;
}
this.editor=_113;
if(this.blockNodeForEnter=="BR"){
this.editor.customUndo=true;
_113.onLoadDeferred.then(lang.hitch(this,function(d){
this.connect(_113.document,"onkeypress",function(e){
if(e.charOrCode==keys.ENTER){
var ne=lang.mixin({},e);
ne.shiftKey=true;
if(!this.handleEnterKey(ne)){
_10d.stop(e);
}
}
});
if(has("ie")==9){
this.connect(_113.document,"onpaste",function(e){
setTimeout(dojo.hitch(this,function(){
var r=this.editor.document.selection.createRange();
r.move("character",-1);
r.select();
r.move("character",1);
r.select();
}),0);
});
}
return d;
}));
}else{
if(this.blockNodeForEnter){
var h=lang.hitch(this,this.handleEnterKey);
_113.addKeyHandler(13,0,0,h);
_113.addKeyHandler(13,0,1,h);
this.connect(this.editor,"onKeyPressed","onKeyPressed");
}
}
},onKeyPressed:function(){
if(this._checkListLater){
if(win.withGlobal(this.editor.window,"isCollapsed",_112)){
var _114=this.editor._sCall("getAncestorElement",["LI"]);
if(!_114){
_110.prototype.execCommand.call(this.editor,"formatblock",this.blockNodeForEnter);
var _115=this.editor._sCall("getAncestorElement",[this.blockNodeForEnter]);
if(_115){
_115.innerHTML=this.bogusHtmlContent;
if(has("ie")){
var r=this.editor.document.selection.createRange();
r.move("character",-1);
r.select();
}
}else{
console.error("onKeyPressed: Cannot find the new block node");
}
}else{
if(has("mozilla")){
if(_114.parentNode.parentNode.nodeName=="LI"){
_114=_114.parentNode.parentNode;
}
}
var fc=_114.firstChild;
if(fc&&fc.nodeType==1&&(fc.nodeName=="UL"||fc.nodeName=="OL")){
_114.insertBefore(fc.ownerDocument.createTextNode(" "),fc);
var _116=_111.create(this.editor.window);
_116.setStart(_114.firstChild,0);
var _117=_111.getSelection(this.editor.window,true);
_117.removeAllRanges();
_117.addRange(_116);
}
}
}
this._checkListLater=false;
}
if(this._pressedEnterInBlock){
if(this._pressedEnterInBlock.previousSibling){
this.removeTrailingBr(this._pressedEnterInBlock.previousSibling);
}
delete this._pressedEnterInBlock;
}
},bogusHtmlContent:"&#160;",blockNodes:/^(?:P|H1|H2|H3|H4|H5|H6|LI)$/,handleEnterKey:function(e){
var _118,_119,_11a,_11b,_11c,_11d,doc=this.editor.document,br,rs,txt;
if(e.shiftKey){
var _11e=this.editor._sCall("getParentElement",[]);
var _11f=_111.getAncestor(_11e,this.blockNodes);
if(_11f){
if(_11f.tagName=="LI"){
return true;
}
_118=_111.getSelection(this.editor.window);
_119=_118.getRangeAt(0);
if(!_119.collapsed){
_119.deleteContents();
_118=_111.getSelection(this.editor.window);
_119=_118.getRangeAt(0);
}
if(_111.atBeginningOfContainer(_11f,_119.startContainer,_119.startOffset)){
br=doc.createElement("br");
_11a=_111.create(this.editor.window);
_11f.insertBefore(br,_11f.firstChild);
_11a.setStartAfter(br);
_118.removeAllRanges();
_118.addRange(_11a);
}else{
if(_111.atEndOfContainer(_11f,_119.startContainer,_119.startOffset)){
_11a=_111.create(this.editor.window);
br=doc.createElement("br");
_11f.appendChild(br);
_11f.appendChild(doc.createTextNode(" "));
_11a.setStart(_11f.lastChild,0);
_118.removeAllRanges();
_118.addRange(_11a);
}else{
rs=_119.startContainer;
if(rs&&rs.nodeType==3){
txt=rs.nodeValue;
_11b=doc.createTextNode(txt.substring(0,_119.startOffset));
_11c=doc.createTextNode(txt.substring(_119.startOffset));
_11d=doc.createElement("br");
if(_11c.nodeValue==""&&has("webkit")){
_11c=doc.createTextNode(" ");
}
_10c.place(_11b,rs,"after");
_10c.place(_11d,_11b,"after");
_10c.place(_11c,_11d,"after");
_10c.destroy(rs);
_11a=_111.create(this.editor.window);
_11a.setStart(_11c,0);
_118.removeAllRanges();
_118.addRange(_11a);
return false;
}
return true;
}
}
}else{
_118=_111.getSelection(this.editor.window);
if(_118.rangeCount){
_119=_118.getRangeAt(0);
if(_119&&_119.startContainer){
if(!_119.collapsed){
_119.deleteContents();
_118=_111.getSelection(this.editor.window);
_119=_118.getRangeAt(0);
}
rs=_119.startContainer;
if(rs&&rs.nodeType==3){
var _120=false;
var _121=_119.startOffset;
if(rs.length<_121){
ret=this._adjustNodeAndOffset(rs,_121);
rs=ret.node;
_121=ret.offset;
}
txt=rs.nodeValue;
_11b=doc.createTextNode(txt.substring(0,_121));
_11c=doc.createTextNode(txt.substring(_121));
_11d=doc.createElement("br");
if(!_11c.length){
_11c=doc.createTextNode(" ");
_120=true;
}
if(_11b.length){
_10c.place(_11b,rs,"after");
}else{
_11b=rs;
}
_10c.place(_11d,_11b,"after");
_10c.place(_11c,_11d,"after");
_10c.destroy(rs);
_11a=_111.create(this.editor.window);
_11a.setStart(_11c,0);
_11a.setEnd(_11c,_11c.length);
_118.removeAllRanges();
_118.addRange(_11a);
if(_120&&!has("webkit")){
this.editor._sCall("remove",[]);
}else{
this.editor._sCall("collapse",[true]);
}
}else{
var _122;
if(_119.startOffset>=0){
_122=rs.childNodes[_119.startOffset];
}
var _11d=doc.createElement("br");
var _11c=doc.createTextNode(" ");
if(!_122){
rs.appendChild(_11d);
rs.appendChild(_11c);
}else{
_10c.place(_11d,_122,"before");
_10c.place(_11c,_11d,"after");
}
_11a=_111.create(this.editor.window);
_11a.setStart(_11c,0);
_11a.setEnd(_11c,_11c.length);
_118.removeAllRanges();
_118.addRange(_11a);
this.editor._sCall("collapse",[true]);
}
}
}else{
_110.prototype.execCommand.call(this.editor,"inserthtml","<br>");
}
}
return false;
}
var _123=true;
_118=_111.getSelection(this.editor.window);
_119=_118.getRangeAt(0);
if(!_119.collapsed){
_119.deleteContents();
_118=_111.getSelection(this.editor.window);
_119=_118.getRangeAt(0);
}
var _124=_111.getBlockAncestor(_119.endContainer,null,this.editor.editNode);
var _125=_124.blockNode;
if((this._checkListLater=(_125&&(_125.nodeName=="LI"||_125.parentNode.nodeName=="LI")))){
if(has("mozilla")){
this._pressedEnterInBlock=_125;
}
if(/^(\s|&nbsp;|&#160;|\xA0|<span\b[^>]*\bclass=['"]Apple-style-span['"][^>]*>(\s|&nbsp;|&#160;|\xA0)<\/span>)?(<br>)?$/.test(_125.innerHTML)){
_125.innerHTML="";
if(has("webkit")){
_11a=_111.create(this.editor.window);
_11a.setStart(_125,0);
_118.removeAllRanges();
_118.addRange(_11a);
}
this._checkListLater=false;
}
return true;
}
if(!_124.blockNode||_124.blockNode===this.editor.editNode){
try{
_110.prototype.execCommand.call(this.editor,"formatblock",this.blockNodeForEnter);
}
catch(e2){
}
_124={blockNode:this.editor._sCall("getAncestorElement",[this.blockNodeForEnter]),blockContainer:this.editor.editNode};
if(_124.blockNode){
if(_124.blockNode!=this.editor.editNode&&(!(_124.blockNode.textContent||_124.blockNode.innerHTML).replace(/^\s+|\s+$/g,"").length)){
this.removeTrailingBr(_124.blockNode);
return false;
}
}else{
_124.blockNode=this.editor.editNode;
}
_118=_111.getSelection(this.editor.window);
_119=_118.getRangeAt(0);
}
var _126=doc.createElement(this.blockNodeForEnter);
_126.innerHTML=this.bogusHtmlContent;
this.removeTrailingBr(_124.blockNode);
var _127=_119.endOffset;
var node=_119.endContainer;
if(node.length<_127){
var ret=this._adjustNodeAndOffset(node,_127);
node=ret.node;
_127=ret.offset;
}
if(_111.atEndOfContainer(_124.blockNode,node,_127)){
if(_124.blockNode===_124.blockContainer){
_124.blockNode.appendChild(_126);
}else{
_10c.place(_126,_124.blockNode,"after");
}
_123=false;
_11a=_111.create(this.editor.window);
_11a.setStart(_126,0);
_118.removeAllRanges();
_118.addRange(_11a);
if(this.editor.height){
_10e.scrollIntoView(_126);
}
}else{
if(_111.atBeginningOfContainer(_124.blockNode,_119.startContainer,_119.startOffset)){
_10c.place(_126,_124.blockNode,_124.blockNode===_124.blockContainer?"first":"before");
if(_126.nextSibling&&this.editor.height){
_11a=_111.create(this.editor.window);
_11a.setStart(_126.nextSibling,0);
_118.removeAllRanges();
_118.addRange(_11a);
_10e.scrollIntoView(_126.nextSibling);
}
_123=false;
}else{
if(_124.blockNode===_124.blockContainer){
_124.blockNode.appendChild(_126);
}else{
_10c.place(_126,_124.blockNode,"after");
}
_123=false;
if(_124.blockNode.style){
if(_126.style){
if(_124.blockNode.style.cssText){
_126.style.cssText=_124.blockNode.style.cssText;
}
}
}
rs=_119.startContainer;
var _128;
if(rs&&rs.nodeType==3){
var _129,_12a;
_127=_119.endOffset;
if(rs.length<_127){
ret=this._adjustNodeAndOffset(rs,_127);
rs=ret.node;
_127=ret.offset;
}
txt=rs.nodeValue;
_11b=doc.createTextNode(txt.substring(0,_127));
_11c=doc.createTextNode(txt.substring(_127,txt.length));
_10c.place(_11b,rs,"before");
_10c.place(_11c,rs,"after");
_10c.destroy(rs);
var _12b=_11b.parentNode;
while(_12b!==_124.blockNode){
var tg=_12b.tagName;
var _12c=doc.createElement(tg);
if(_12b.style){
if(_12c.style){
if(_12b.style.cssText){
_12c.style.cssText=_12b.style.cssText;
}
}
}
if(_12b.tagName==="FONT"){
if(_12b.color){
_12c.color=_12b.color;
}
if(_12b.face){
_12c.face=_12b.face;
}
if(_12b.size){
_12c.size=_12b.size;
}
}
_129=_11c;
while(_129){
_12a=_129.nextSibling;
_12c.appendChild(_129);
_129=_12a;
}
_10c.place(_12c,_12b,"after");
_11b=_12b;
_11c=_12c;
_12b=_12b.parentNode;
}
_129=_11c;
if(_129.nodeType==1||(_129.nodeType==3&&_129.nodeValue)){
_126.innerHTML="";
}
_128=_129;
while(_129){
_12a=_129.nextSibling;
_126.appendChild(_129);
_129=_12a;
}
}
_11a=_111.create(this.editor.window);
var _12d;
var _12e=_128;
if(this.blockNodeForEnter!=="BR"){
while(_12e){
_12d=_12e;
_12a=_12e.firstChild;
_12e=_12a;
}
if(_12d&&_12d.parentNode){
_126=_12d.parentNode;
_11a.setStart(_126,0);
_118.removeAllRanges();
_118.addRange(_11a);
if(this.editor.height){
_10e.scrollIntoView(_126);
}
if(has("mozilla")){
this._pressedEnterInBlock=_124.blockNode;
}
}else{
_123=true;
}
}else{
_11a.setStart(_126,0);
_118.removeAllRanges();
_118.addRange(_11a);
if(this.editor.height){
_10e.scrollIntoView(_126);
}
if(has("mozilla")){
this._pressedEnterInBlock=_124.blockNode;
}
}
}
}
return _123;
},_adjustNodeAndOffset:function(node,_12f){
while(node.length<_12f&&node.nextSibling&&node.nextSibling.nodeType==3){
_12f=_12f-node.length;
node=node.nextSibling;
}
return {"node":node,"offset":_12f};
},removeTrailingBr:function(_130){
var para=/P|DIV|LI/i.test(_130.tagName)?_130:this.editor._sCall("getParentOfType",[_130,["P","DIV","LI"]]);
if(!para){
return;
}
if(para.lastChild){
if((para.childNodes.length>1&&para.lastChild.nodeType==3&&/^[\s\xAD]*$/.test(para.lastChild.nodeValue))||para.lastChild.tagName=="BR"){
_10c.destroy(para.lastChild);
}
}
if(!para.childNodes.length){
para.innerHTML=this.bogusHtmlContent;
}
}});
});
},"dijit/_MenuBase":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-class","dojo/_base/lang","dojo/mouse","dojo/on","dojo/window","./a11yclick","./popup","./registry","./_Widget","./_KeyNavContainer","./_TemplatedMixin"],function(_131,_132,dom,_133,_134,lang,_135,on,_136,_137,pm,_138,_139,_13a,_13b){
return _132("dijit._MenuBase",[_139,_13b,_13a],{parentMenu:null,popupDelay:500,autoFocus:false,postCreate:function(){
var self=this,_13c=function(node){
return _134.contains(node,"dijitMenuItem");
};
this.own(on(this.containerNode,on.selector(_13c,_135.enter),function(){
self.onItemHover(_138.byNode(this));
}),on(this.containerNode,on.selector(_13c,_135.leave),function(){
self.onItemUnhover(_138.byNode(this));
}),on(this.containerNode,on.selector(_13c,_137),function(evt){
self.onItemClick(_138.byNode(this),evt);
evt.stopPropagation();
evt.preventDefault();
}));
this.inherited(arguments);
},onExecute:function(){
},onCancel:function(){
},_moveToPopup:function(evt){
if(this.focusedChild&&this.focusedChild.popup&&!this.focusedChild.disabled){
this.onItemClick(this.focusedChild,evt);
}else{
var _13d=this._getTopMenu();
if(_13d&&_13d._isMenuBar){
_13d.focusNext();
}
}
},_onPopupHover:function(){
if(this.currentPopup&&this.currentPopup._pendingClose_timer){
var _13e=this.currentPopup.parentMenu;
if(_13e.focusedChild){
_13e.focusedChild._setSelected(false);
}
_13e.focusedChild=this.currentPopup.from_item;
_13e.focusedChild._setSelected(true);
this._stopPendingCloseTimer(this.currentPopup);
}
},onItemHover:function(item){
if(this.isActive){
this.focusChild(item);
if(this.focusedChild.popup&&!this.focusedChild.disabled&&!this.hover_timer){
this.hover_timer=this.defer("_openPopup",this.popupDelay);
}
}
if(this.focusedChild){
this.focusChild(item);
}
this._hoveredChild=item;
item._set("hovering",true);
},_onChildBlur:function(item){
this._stopPopupTimer();
item._setSelected(false);
var _13f=item.popup;
if(_13f){
this._stopPendingCloseTimer(_13f);
_13f._pendingClose_timer=this.defer(function(){
_13f._pendingClose_timer=null;
if(_13f.parentMenu){
_13f.parentMenu.currentPopup=null;
}
pm.close(_13f);
},this.popupDelay);
}
},onItemUnhover:function(item){
if(this.isActive){
this._stopPopupTimer();
}
if(this._hoveredChild==item){
this._hoveredChild=null;
}
item._set("hovering",false);
},_stopPopupTimer:function(){
if(this.hover_timer){
this.hover_timer=this.hover_timer.remove();
}
},_stopPendingCloseTimer:function(_140){
if(_140._pendingClose_timer){
_140._pendingClose_timer=_140._pendingClose_timer.remove();
}
},_stopFocusTimer:function(){
if(this._focus_timer){
this._focus_timer=this._focus_timer.remove();
}
},_getTopMenu:function(){
for(var top=this;top.parentMenu;top=top.parentMenu){
}
return top;
},onItemClick:function(item,evt){
if(typeof this.isShowingNow=="undefined"){
this._markActive();
}
this.focusChild(item);
if(item.disabled){
return false;
}
if(item.popup){
this._openPopup(evt.type=="keypress");
}else{
this.onExecute();
item._onClick?item._onClick(evt):item.onClick(evt);
}
},_openPopup:function(_141){
this._stopPopupTimer();
var _142=this.focusedChild;
if(!_142){
return;
}
var _143=_142.popup;
if(!_143.isShowingNow){
if(this.currentPopup){
this._stopPendingCloseTimer(this.currentPopup);
pm.close(this.currentPopup);
}
_143.parentMenu=this;
_143.from_item=_142;
var self=this;
pm.open({parent:this,popup:_143,around:_142.domNode,orient:this._orient||["after","before"],onCancel:function(){
self.focusChild(_142);
self._cleanUp();
_142._setSelected(true);
self.focusedChild=_142;
},onExecute:lang.hitch(this,"_cleanUp")});
this.currentPopup=_143;
_143.connect(_143.domNode,"onmouseenter",lang.hitch(self,"_onPopupHover"));
}
if(_141&&_143.focus){
_143._focus_timer=this.defer(lang.hitch(_143,function(){
this._focus_timer=null;
this.focus();
}));
}
},_markActive:function(){
this.isActive=true;
_134.replace(this.domNode,"dijitMenuActive","dijitMenuPassive");
},onOpen:function(){
this.isShowingNow=true;
this._markActive();
},_markInactive:function(){
this.isActive=false;
_134.replace(this.domNode,"dijitMenuPassive","dijitMenuActive");
},onClose:function(){
this._stopFocusTimer();
this._markInactive();
this.isShowingNow=false;
this.parentMenu=null;
},_closeChild:function(){
this._stopPopupTimer();
if(this.currentPopup){
if(_131.indexOf(this._focusManager.activeStack,this.id)>=0){
_133.set(this.focusedChild.focusNode,"tabIndex",this.tabIndex);
this.focusedChild.focusNode.focus();
}
pm.close(this.currentPopup);
this.currentPopup=null;
}
if(this.focusedChild){
this.focusedChild._setSelected(false);
this.onItemUnhover(this.focusedChild);
this.focusedChild=null;
}
},_onItemFocus:function(item){
if(this._hoveredChild&&this._hoveredChild!=item){
this.onItemUnhover(this._hoveredChild);
}
},_onBlur:function(){
this._cleanUp();
this.inherited(arguments);
},_cleanUp:function(){
this._closeChild();
if(typeof this.isShowingNow=="undefined"){
this._markInactive();
}
}});
});
},"dijit/tree/ForestStoreModel":function(){
define("dijit/tree/ForestStoreModel",["dojo/_base/array","dojo/_base/declare","dojo/_base/kernel","dojo/_base/lang","./TreeStoreModel"],function(_144,_145,_146,lang,_147){
return _145("dijit.tree.ForestStoreModel",_147,{rootId:"$root$",rootLabel:"ROOT",query:null,constructor:function(_148){
this.root={store:this,root:true,id:_148.rootId,label:_148.rootLabel,children:_148.rootChildren};
},mayHaveChildren:function(item){
return item===this.root||this.inherited(arguments);
},getChildren:function(_149,_14a,_14b){
if(_149===this.root){
if(this.root.children){
_14a(this.root.children);
}else{
this.store.fetch({query:this.query,onComplete:lang.hitch(this,function(_14c){
this.root.children=_14c;
_14a(_14c);
}),onError:_14b});
}
}else{
this.inherited(arguments);
}
},isItem:function(_14d){
return (_14d===this.root)?true:this.inherited(arguments);
},fetchItemByIdentity:function(_14e){
if(_14e.identity==this.root.id){
var _14f=_14e.scope||_146.global;
if(_14e.onItem){
_14e.onItem.call(_14f,this.root);
}
}else{
this.inherited(arguments);
}
},getIdentity:function(item){
return (item===this.root)?this.root.id:this.inherited(arguments);
},getLabel:function(item){
return (item===this.root)?this.root.label:this.inherited(arguments);
},newItem:function(args,_150,_151){
if(_150===this.root){
this.onNewRootItem(args);
return this.store.newItem(args);
}else{
return this.inherited(arguments);
}
},onNewRootItem:function(){
},pasteItem:function(_152,_153,_154,_155,_156){
if(_153===this.root){
if(!_155){
this.onLeaveRoot(_152);
}
}
this.inherited(arguments,[_152,_153===this.root?null:_153,_154===this.root?null:_154,_155,_156]);
if(_154===this.root){
this.onAddToRoot(_152);
}
},onAddToRoot:function(item){
},onLeaveRoot:function(item){
},_requeryTop:function(){
var _157=this.root.children||[];
this.store.fetch({query:this.query,onComplete:lang.hitch(this,function(_158){
this.root.children=_158;
if(_157.length!=_158.length||_144.some(_157,function(item,idx){
return _158[idx]!=item;
})){
this.onChildrenChange(this.root,_158);
}
})});
},onNewItem:function(item,_159){
this._requeryTop();
this.inherited(arguments);
},onDeleteItem:function(item){
if(_144.indexOf(this.root.children,item)!=-1){
this._requeryTop();
}
this.inherited(arguments);
},onSetItem:function(item,_15a,_15b,_15c){
this._requeryTop();
this.inherited(arguments);
}});
});
},"dijit/PopupMenuBarItem":function(){
define(["dojo/_base/declare","./PopupMenuItem","./MenuBarItem"],function(_15d,_15e,_15f){
var _160=_15f._MenuBarItemMixin;
return _15d("dijit.PopupMenuBarItem",[_15e,_160],{});
});
},"url:dijit/layout/templates/AccordionButton.html":"<div data-dojo-attach-event='onclick:_onTitleClick' class='dijitAccordionTitle' role=\"presentation\">\n\t<div data-dojo-attach-point='titleNode,focusNode' data-dojo-attach-event='onkeypress:_onTitleKeyPress'\n\t\t\tclass='dijitAccordionTitleFocus' role=\"tab\" aria-expanded=\"false\"\n\t\t><span class='dijitInline dijitAccordionArrow' role=\"presentation\"></span\n\t\t><span class='arrowTextUp' role=\"presentation\">+</span\n\t\t><span class='arrowTextDown' role=\"presentation\">-</span\n\t\t><img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon\" data-dojo-attach-point='iconNode' style=\"vertical-align: middle\" role=\"presentation\"/>\n\t\t<span role=\"presentation\" data-dojo-attach-point='titleTextNode' class='dijitAccordionText'></span>\n\t</div>\n</div>\n","dijit/TitlePane":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-class","dojo/dom-geometry","dojo/_base/event","dojo/fx","dojo/_base/kernel","dojo/keys","./_CssStateMixin","./_TemplatedMixin","./layout/ContentPane","dojo/text!./templates/TitlePane.html","./_base/manager"],function(_161,_162,dom,_163,_164,_165,_166,_167,_168,keys,_169,_16a,_16b,_16c,_16d){
return _162("dijit.TitlePane",[_16b,_16a,_169],{title:"",_setTitleAttr:{node:"titleNode",type:"innerHTML"},open:true,toggleable:true,tabIndex:"0",duration:_16d.defaultDuration,baseClass:"dijitTitlePane",templateString:_16c,doLayout:false,_setTooltipAttr:{node:"focusNode",type:"attribute",attribute:"title"},buildRendering:function(){
this.inherited(arguments);
dom.setSelectable(this.titleNode,false);
},postCreate:function(){
this.inherited(arguments);
if(this.toggleable){
this._trackMouseState(this.titleBarNode,"dijitTitlePaneTitle");
}
var _16e=this.hideNode,_16f=this.wipeNode;
this._wipeIn=_167.wipeIn({node:_16f,duration:this.duration,beforeBegin:function(){
_16e.style.display="";
}});
this._wipeOut=_167.wipeOut({node:_16f,duration:this.duration,onEnd:function(){
_16e.style.display="none";
}});
},_setOpenAttr:function(open,_170){
_161.forEach([this._wipeIn,this._wipeOut],function(_171){
if(_171&&_171.status()=="playing"){
_171.stop();
}
});
if(_170){
var anim=this[open?"_wipeIn":"_wipeOut"];
anim.play();
}else{
this.hideNode.style.display=this.wipeNode.style.display=open?"":"none";
}
if(this._started){
if(open){
this._onShow();
}else{
this.onHide();
}
}
this.containerNode.setAttribute("aria-hidden",open?"false":"true");
this.focusNode.setAttribute("aria-pressed",open?"true":"false");
this._set("open",open);
this._setCss();
},_setToggleableAttr:function(_172){
this.focusNode.setAttribute("role",_172?"button":"heading");
if(_172){
this.focusNode.setAttribute("aria-controls",this.id+"_pane");
this.focusNode.setAttribute("tabIndex",this.tabIndex);
this.focusNode.setAttribute("aria-pressed",this.open);
}else{
_163.remove(this.focusNode,"aria-controls");
_163.remove(this.focusNode,"tabIndex");
_163.remove(this.focusNode,"aria-pressed");
}
this._set("toggleable",_172);
this._setCss();
},_setContentAttr:function(_173){
if(!this.open||!this._wipeOut||this._wipeOut.status()=="playing"){
this.inherited(arguments);
}else{
if(this._wipeIn&&this._wipeIn.status()=="playing"){
this._wipeIn.stop();
}
_165.setMarginBox(this.wipeNode,{h:_165.getMarginBox(this.wipeNode).h});
this.inherited(arguments);
if(this._wipeIn){
this._wipeIn.play();
}else{
this.hideNode.style.display="";
}
}
},toggle:function(){
this._setOpenAttr(!this.open,true);
},_setCss:function(){
var node=this.titleBarNode||this.focusNode;
var _174=this._titleBarClass;
this._titleBarClass="dijit"+(this.toggleable?"":"Fixed")+(this.open?"Open":"Closed");
_164.replace(node,this._titleBarClass,_174||"");
this.arrowNodeInner.innerHTML=this.open?"-":"+";
},_onTitleKey:function(e){
if(e.keyCode==keys.ENTER||e.keyCode==keys.SPACE){
if(this.toggleable){
this.toggle();
_166.stop(e);
}
}else{
if(e.keyCode==keys.DOWN_ARROW&&this.open){
this.containerNode.focus();
e.preventDefault();
}
}
},_onTitleClick:function(){
if(this.toggleable){
this.toggle();
}
},setTitle:function(_175){
_168.deprecated("dijit.TitlePane.setTitle() is deprecated.  Use set('title', ...) instead.","","2.0");
this.set("title",_175);
}});
});
},"dijit/form/_ComboBoxMenuMixin":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dom-attr","dojo/i18n","dojo/i18n!./nls/ComboBox"],function(_176,_177,_178,i18n){
return _177("dijit.form._ComboBoxMenuMixin",null,{_messages:null,postMixInProperties:function(){
this.inherited(arguments);
this._messages=i18n.getLocalization("dijit.form","ComboBox",this.lang);
},buildRendering:function(){
this.inherited(arguments);
this.previousButton.innerHTML=this._messages["previousMessage"];
this.nextButton.innerHTML=this._messages["nextMessage"];
},_setValueAttr:function(_179){
this.value=_179;
this.onChange(_179);
},onClick:function(node){
if(node==this.previousButton){
this._setSelectedAttr(null);
this.onPage(-1);
}else{
if(node==this.nextButton){
this._setSelectedAttr(null);
this.onPage(1);
}else{
this.onChange(node);
}
}
},onChange:function(){
},onPage:function(){
},onClose:function(){
this._setSelectedAttr(null);
},_createOption:function(item,_17a){
var _17b=this._createMenuItem();
var _17c=_17a(item);
if(_17c.html){
_17b.innerHTML=_17c.label;
}else{
_17b.appendChild(_17b.ownerDocument.createTextNode(_17c.label));
}
if(_17b.innerHTML==""){
_17b.innerHTML="&#160;";
}
this.applyTextDir(_17b,(_17b.innerText||_17b.textContent||""));
return _17b;
},createOptions:function(_17d,_17e,_17f){
this.items=_17d;
this.previousButton.style.display=(_17e.start==0)?"none":"";
_178.set(this.previousButton,"id",this.id+"_prev");
_176.forEach(_17d,function(item,i){
var _180=this._createOption(item,_17f);
_180.setAttribute("item",i);
_178.set(_180,"id",this.id+i);
this.nextButton.parentNode.insertBefore(_180,this.nextButton);
},this);
var _181=false;
if(_17d.total&&!_17d.total.then&&_17d.total!=-1){
if((_17e.start+_17e.count)<_17d.total){
_181=true;
}else{
if((_17e.start+_17e.count)>_17d.total&&_17e.count==_17d.length){
_181=true;
}
}
}else{
if(_17e.count==_17d.length){
_181=true;
}
}
this.nextButton.style.display=_181?"":"none";
_178.set(this.nextButton,"id",this.id+"_next");
},clearResultList:function(){
var _182=this.containerNode;
while(_182.childNodes.length>2){
_182.removeChild(_182.childNodes[_182.childNodes.length-2]);
}
this._setSelectedAttr(null);
},highlightFirstOption:function(){
this.selectFirstNode();
},highlightLastOption:function(){
this.selectLastNode();
},selectFirstNode:function(){
this.inherited(arguments);
if(this.getHighlightedOption()==this.previousButton){
this.selectNextNode();
}
},selectLastNode:function(){
this.inherited(arguments);
if(this.getHighlightedOption()==this.nextButton){
this.selectPreviousNode();
}
},getHighlightedOption:function(){
return this.selected;
}});
});
},"dijit/form/_SearchMixin":function(){
define("dijit/form/_SearchMixin",["dojo/data/util/filter","dojo/_base/declare","dojo/_base/event","dojo/keys","dojo/_base/lang","dojo/query","dojo/sniff","dojo/string","dojo/when","../registry"],function(_183,_184,_185,keys,lang,_186,has,_187,when,_188){
return _184("dijit.form._SearchMixin",null,{pageSize:Infinity,store:null,fetchProperties:{},query:{},searchDelay:200,searchAttr:"name",queryExpr:"${0}*",ignoreCase:true,_abortQuery:function(){
if(this.searchTimer){
this.searchTimer=this.searchTimer.remove();
}
if(this._queryDeferHandle){
this._queryDeferHandle=this._queryDeferHandle.remove();
}
if(this._fetchHandle){
if(this._fetchHandle.abort){
this._cancelingQuery=true;
this._fetchHandle.abort();
this._cancelingQuery=false;
}
if(this._fetchHandle.cancel){
this._cancelingQuery=true;
this._fetchHandle.cancel();
this._cancelingQuery=false;
}
this._fetchHandle=null;
}
},_processInput:function(evt){
if(this.disabled||this.readOnly){
return;
}
var key=evt.charOrCode;
if(evt.altKey||((evt.ctrlKey||evt.metaKey)&&(key!="x"&&key!="v"))||key==keys.SHIFT){
return;
}
var _189=false;
this._prev_key_backspace=false;
switch(key){
case keys.DELETE:
case keys.BACKSPACE:
this._prev_key_backspace=true;
this._maskValidSubsetError=true;
_189=true;
break;
default:
_189=typeof key=="string"||key==229;
}
if(_189){
if(!this.store){
this.onSearch();
}else{
this.searchTimer=this.defer("_startSearchFromInput",1);
}
}
},onSearch:function(){
},_startSearchFromInput:function(){
this._startSearch(this.focusNode.value.replace(/([\\\*\?])/g,"\\$1"));
},_startSearch:function(text){
this._abortQuery();
var _18a=this,_186=lang.clone(this.query),_18b={start:0,count:this.pageSize,queryOptions:{ignoreCase:this.ignoreCase,deep:true}},qs=_187.substitute(this.queryExpr,[text]),q,_18c=function(){
var _18d=_18a._fetchHandle=_18a.store.query(_186,_18b);
if(_18a.disabled||_18a.readOnly||(q!==_18a._lastQuery)){
return;
}
when(_18d,function(res){
_18a._fetchHandle=null;
if(!_18a.disabled&&!_18a.readOnly&&(q===_18a._lastQuery)){
when(_18d.total,function(_18e){
res.total=_18e;
var _18f=_18a.pageSize;
if(isNaN(_18f)||_18f>res.total){
_18f=res.total;
}
res.nextPage=function(_190){
_18b.direction=_190=_190!==false;
_18b.count=_18f;
if(_190){
_18b.start+=res.length;
if(_18b.start>=res.total){
_18b.count=0;
}
}else{
_18b.start-=_18f;
if(_18b.start<0){
_18b.count=Math.max(_18f+_18b.start,0);
_18b.start=0;
}
}
if(_18b.count<=0){
res.length=0;
_18a.onSearch(res,_186,_18b);
}else{
_18c();
}
};
_18a.onSearch(res,_186,_18b);
});
}
},function(err){
_18a._fetchHandle=null;
if(!_18a._cancelingQuery){
console.error(_18a.declaredClass+" "+err.toString());
}
});
};
lang.mixin(_18b,this.fetchProperties);
if(this.store._oldAPI){
q=qs;
}else{
q=_183.patternToRegExp(qs,this.ignoreCase);
q.toString=function(){
return qs;
};
}
this._lastQuery=_186[this.searchAttr]=q;
this._queryDeferHandle=this.defer(_18c,this.searchDelay);
},constructor:function(){
this.query={};
this.fetchProperties={};
},postMixInProperties:function(){
if(!this.store){
var list=this.list;
if(list){
this.store=_188.byId(list);
}
}
this.inherited(arguments);
}});
});
},"url:dijit/form/templates/DropDownButton.html":"<span class=\"dijit dijitReset dijitInline\"\n\t><span class='dijitReset dijitInline dijitButtonNode'\n\t\tdata-dojo-attach-event=\"ondijitclick:_onClick\" data-dojo-attach-point=\"_buttonNode\"\n\t\t><span class=\"dijitReset dijitStretch dijitButtonContents\"\n\t\t\tdata-dojo-attach-point=\"focusNode,titleNode,_arrowWrapperNode\"\n\t\t\trole=\"button\" aria-haspopup=\"true\" aria-labelledby=\"${id}_label\"\n\t\t\t><span class=\"dijitReset dijitInline dijitIcon\"\n\t\t\t\tdata-dojo-attach-point=\"iconNode\"\n\t\t\t></span\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"\n\t\t\t\tdata-dojo-attach-point=\"containerNode,_popupStateNode\"\n\t\t\t\tid=\"${id}_label\"\n\t\t\t></span\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonInner\"></span\n\t\t\t><span class=\"dijitReset dijitInline dijitArrowButtonChar\">&#9660;</span\n\t\t></span\n\t></span\n\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" class=\"dijitOffScreen\" tabIndex=\"-1\"\n\t\tdata-dojo-attach-point=\"valueNode\"\n/></span>\n","dijit/form/ToggleButton":function(){
define("dijit/form/ToggleButton",["dojo/_base/declare","dojo/_base/kernel","./Button","./_ToggleButtonMixin"],function(_191,_192,_193,_194){
return _191("dijit.form.ToggleButton",[_193,_194],{baseClass:"dijitToggleButton",setChecked:function(_195){
_192.deprecated("setChecked("+_195+") is deprecated. Use set('checked',"+_195+") instead.","","2.0");
this.set("checked",_195);
}});
});
},"dijit/form/NumberSpinner":function(){
define(["dojo/_base/declare","dojo/_base/event","dojo/keys","./_Spinner","./NumberTextBox"],function(_196,_197,keys,_198,_199){
return _196("dijit.form.NumberSpinner",[_198,_199.Mixin],{adjust:function(val,_19a){
var tc=this.constraints,v=isNaN(val),_19b=!isNaN(tc.max),_19c=!isNaN(tc.min);
if(v&&_19a!=0){
val=(_19a>0)?_19c?tc.min:_19b?tc.max:0:_19b?this.constraints.max:_19c?tc.min:0;
}
var _19d=val+_19a;
if(v||isNaN(_19d)){
return val;
}
if(_19b&&(_19d>tc.max)){
_19d=tc.max;
}
if(_19c&&(_19d<tc.min)){
_19d=tc.min;
}
return _19d;
},_onKeyPress:function(e){
if((e.charOrCode==keys.HOME||e.charOrCode==keys.END)&&!(e.ctrlKey||e.altKey||e.metaKey)&&typeof this.get("value")!="undefined"){
var _19e=this.constraints[(e.charOrCode==keys.HOME?"min":"max")];
if(typeof _19e=="number"){
this._setValueAttr(_19e,false);
}
_197.stop(e);
}
}});
});
},"dijit/form/Textarea":function(){
define(["dojo/_base/declare","dojo/dom-style","./_ExpandingTextAreaMixin","./SimpleTextarea"],function(_19f,_1a0,_1a1,_1a2){
return _19f("dijit.form.Textarea",[_1a2,_1a1],{baseClass:"dijitTextBox dijitTextArea dijitExpandingTextArea",cols:"",buildRendering:function(){
this.inherited(arguments);
_1a0.set(this.textbox,{overflowY:"hidden",overflowX:"auto",boxSizing:"border-box",MsBoxSizing:"border-box",WebkitBoxSizing:"border-box",MozBoxSizing:"border-box"});
}});
});
},"dijit/form/DateTextBox":function(){
define(["dojo/_base/declare","../Calendar","./_DateTimeTextBox"],function(_1a3,_1a4,_1a5){
return _1a3("dijit.form.DateTextBox",_1a5,{baseClass:"dijitTextBox dijitComboBox dijitDateTextBox",popupClass:_1a4,_selector:"date",value:new Date("")});
});
},"dijit/layout/AccordionContainer":function(){
require({cache:{"url:dijit/layout/templates/AccordionButton.html":"<div data-dojo-attach-event='onclick:_onTitleClick' class='dijitAccordionTitle' role=\"presentation\">\n\t<div data-dojo-attach-point='titleNode,focusNode' data-dojo-attach-event='onkeypress:_onTitleKeyPress'\n\t\t\tclass='dijitAccordionTitleFocus' role=\"tab\" aria-expanded=\"false\"\n\t\t><span class='dijitInline dijitAccordionArrow' role=\"presentation\"></span\n\t\t><span class='arrowTextUp' role=\"presentation\">+</span\n\t\t><span class='arrowTextDown' role=\"presentation\">-</span\n\t\t><img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon\" data-dojo-attach-point='iconNode' style=\"vertical-align: middle\" role=\"presentation\"/>\n\t\t<span role=\"presentation\" data-dojo-attach-point='titleTextNode' class='dijitAccordionText'></span>\n\t</div>\n</div>\n"}});
define("dijit/layout/AccordionContainer",["require","dojo/_base/array","dojo/_base/declare","dojo/_base/event","dojo/_base/fx","dojo/dom","dojo/dom-attr","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/keys","dojo/_base/lang","dojo/sniff","dojo/topic","../focus","../_base/manager","dojo/ready","../_Widget","../_Container","../_TemplatedMixin","../_CssStateMixin","./StackContainer","./ContentPane","dojo/text!./templates/AccordionButton.html"],function(_1a6,_1a7,_1a8,_1a9,fx,dom,_1aa,_1ab,_1ac,_1ad,keys,lang,has,_1ae,_1af,_1b0,_1b1,_1b2,_1b3,_1b4,_1b5,_1b6,_1b7,_1b8){
var _1b9=_1a8("dijit.layout._AccordionButton",[_1b2,_1b4,_1b5],{templateString:_1b8,label:"",_setLabelAttr:{node:"titleTextNode",type:"innerHTML"},title:"",_setTitleAttr:{node:"titleTextNode",type:"attribute",attribute:"title"},iconClassAttr:"",_setIconClassAttr:{node:"iconNode",type:"class"},baseClass:"dijitAccordionTitle",getParent:function(){
return this.parent;
},buildRendering:function(){
this.inherited(arguments);
var _1ba=this.id.replace(" ","_");
_1aa.set(this.titleTextNode,"id",_1ba+"_title");
this.focusNode.setAttribute("aria-labelledby",_1aa.get(this.titleTextNode,"id"));
dom.setSelectable(this.domNode,false);
},getTitleHeight:function(){
return _1ad.getMarginSize(this.domNode).h;
},_onTitleClick:function(){
var _1bb=this.getParent();
_1bb.selectChild(this.contentWidget,true);
_1af.focus(this.focusNode);
},_onTitleKeyPress:function(evt){
return this.getParent()._onKeyPress(evt,this.contentWidget);
},_setSelectedAttr:function(_1bc){
this._set("selected",_1bc);
this.focusNode.setAttribute("aria-expanded",_1bc?"true":"false");
this.focusNode.setAttribute("aria-selected",_1bc?"true":"false");
this.focusNode.setAttribute("tabIndex",_1bc?"0":"-1");
}});
var _1bd=_1a8("dijit.layout._AccordionInnerContainer",[_1b2,_1b5],{baseClass:"dijitAccordionInnerContainer",isLayoutContainer:true,buildRendering:function(){
this.domNode=_1ac.place("<div class='"+this.baseClass+"' role='presentation'>",this.contentWidget.domNode,"after");
var _1be=this.contentWidget,cls=lang.isString(this.buttonWidget)?lang.getObject(this.buttonWidget):this.buttonWidget;
this.button=_1be._buttonWidget=(new cls({contentWidget:_1be,label:_1be.title,title:_1be.tooltip,dir:_1be.dir,lang:_1be.lang,textDir:_1be.textDir,iconClass:_1be.iconClass,id:_1be.id+"_button",parent:this.parent})).placeAt(this.domNode);
this.containerNode=_1ac.place("<div class='dijitAccordionChildWrapper' style='display:none'>",this.domNode);
_1ac.place(this.contentWidget.domNode,this.containerNode);
},postCreate:function(){
this.inherited(arguments);
var _1bf=this.button;
this._contentWidgetWatches=[this.contentWidget.watch("title",lang.hitch(this,function(name,_1c0,_1c1){
_1bf.set("label",_1c1);
})),this.contentWidget.watch("tooltip",lang.hitch(this,function(name,_1c2,_1c3){
_1bf.set("title",_1c3);
})),this.contentWidget.watch("iconClass",lang.hitch(this,function(name,_1c4,_1c5){
_1bf.set("iconClass",_1c5);
}))];
},_setSelectedAttr:function(_1c6){
this._set("selected",_1c6);
this.button.set("selected",_1c6);
if(_1c6){
var cw=this.contentWidget;
if(cw.onSelected){
cw.onSelected();
}
}
},startup:function(){
this.contentWidget.startup();
},destroy:function(){
this.button.destroyRecursive();
_1a7.forEach(this._contentWidgetWatches||[],function(w){
w.unwatch();
});
delete this.contentWidget._buttonWidget;
delete this.contentWidget._wrapperWidget;
this.inherited(arguments);
},destroyDescendants:function(_1c7){
this.contentWidget.destroyRecursive(_1c7);
}});
var _1c8=_1a8("dijit.layout.AccordionContainer",_1b6,{duration:_1b0.defaultDuration,buttonWidget:_1b9,baseClass:"dijitAccordionContainer",buildRendering:function(){
this.inherited(arguments);
this.domNode.style.overflow="hidden";
this.domNode.setAttribute("role","tablist");
},startup:function(){
if(this._started){
return;
}
this.inherited(arguments);
if(this.selectedChildWidget){
this.selectedChildWidget._wrapperWidget.set("selected",true);
}
},layout:function(){
var _1c9=this.selectedChildWidget;
if(!_1c9){
return;
}
var _1ca=_1c9._wrapperWidget.domNode,_1cb=_1ad.getMarginExtents(_1ca),_1cc=_1ad.getPadBorderExtents(_1ca),_1cd=_1c9._wrapperWidget.containerNode,_1ce=_1ad.getMarginExtents(_1cd),_1cf=_1ad.getPadBorderExtents(_1cd),_1d0=this._contentBox;
var _1d1=0;
_1a7.forEach(this.getChildren(),function(_1d2){
if(_1d2!=_1c9){
_1d1+=_1ad.getMarginSize(_1d2._wrapperWidget.domNode).h;
}
});
this._verticalSpace=_1d0.h-_1d1-_1cb.h-_1cc.h-_1ce.h-_1cf.h-_1c9._buttonWidget.getTitleHeight();
this._containerContentBox={h:this._verticalSpace,w:this._contentBox.w-_1cb.w-_1cc.w-_1ce.w-_1cf.w};
if(_1c9){
_1c9.resize(this._containerContentBox);
}
},_setupChild:function(_1d3){
_1d3._wrapperWidget=_1bd({contentWidget:_1d3,buttonWidget:this.buttonWidget,id:_1d3.id+"_wrapper",dir:_1d3.dir,lang:_1d3.lang,textDir:_1d3.textDir,parent:this});
this.inherited(arguments);
},addChild:function(_1d4,_1d5){
if(this._started){
var _1d6=this.containerNode;
if(_1d5&&typeof _1d5=="number"){
var _1d7=_1b2.prototype.getChildren.call(this);
if(_1d7&&_1d7.length>=_1d5){
_1d6=_1d7[_1d5-1].domNode;
_1d5="after";
}
}
_1ac.place(_1d4.domNode,_1d6,_1d5);
if(!_1d4._started){
_1d4.startup();
}
this._setupChild(_1d4);
_1ae.publish(this.id+"-addChild",_1d4,_1d5);
this.layout();
if(!this.selectedChildWidget){
this.selectChild(_1d4);
}
}else{
this.inherited(arguments);
}
},removeChild:function(_1d8){
if(_1d8._wrapperWidget){
_1ac.place(_1d8.domNode,_1d8._wrapperWidget.domNode,"after");
_1d8._wrapperWidget.destroy();
delete _1d8._wrapperWidget;
}
_1ab.remove(_1d8.domNode,"dijitHidden");
this.inherited(arguments);
},getChildren:function(){
return _1a7.map(this.inherited(arguments),function(_1d9){
return _1d9.declaredClass=="dijit.layout._AccordionInnerContainer"?_1d9.contentWidget:_1d9;
},this);
},destroy:function(){
if(this._animation){
this._animation.stop();
}
_1a7.forEach(this.getChildren(),function(_1da){
if(_1da._wrapperWidget){
_1da._wrapperWidget.destroy();
}else{
_1da.destroyRecursive();
}
});
this.inherited(arguments);
},_showChild:function(_1db){
_1db._wrapperWidget.containerNode.style.display="block";
return this.inherited(arguments);
},_hideChild:function(_1dc){
_1dc._wrapperWidget.containerNode.style.display="none";
this.inherited(arguments);
},_transition:function(_1dd,_1de,_1df){
if(has("ie")<8){
_1df=false;
}
if(this._animation){
this._animation.stop(true);
delete this._animation;
}
var self=this;
if(_1dd){
_1dd._wrapperWidget.set("selected",true);
var d=this._showChild(_1dd);
if(this.doLayout&&_1dd.resize){
_1dd.resize(this._containerContentBox);
}
}
if(_1de){
_1de._wrapperWidget.set("selected",false);
if(!_1df){
this._hideChild(_1de);
}
}
if(_1df){
var _1e0=_1dd._wrapperWidget.containerNode,_1e1=_1de._wrapperWidget.containerNode;
var _1e2=_1dd._wrapperWidget.containerNode,_1e3=_1ad.getMarginExtents(_1e2),_1e4=_1ad.getPadBorderExtents(_1e2),_1e5=_1e3.h+_1e4.h;
_1e1.style.height=(self._verticalSpace-_1e5)+"px";
this._animation=new fx.Animation({node:_1e0,duration:this.duration,curve:[1,this._verticalSpace-_1e5-1],onAnimate:function(_1e6){
_1e6=Math.floor(_1e6);
_1e0.style.height=_1e6+"px";
_1e1.style.height=(self._verticalSpace-_1e5-_1e6)+"px";
},onEnd:function(){
delete self._animation;
_1e0.style.height="auto";
_1de._wrapperWidget.containerNode.style.display="none";
_1e1.style.height="auto";
self._hideChild(_1de);
}});
this._animation.onStop=this._animation.onEnd;
this._animation.play();
}
return d;
},_onKeyPress:function(e,_1e7){
if(this.disabled||e.altKey||!(_1e7||e.ctrlKey)){
return;
}
var c=e.charOrCode;
if((_1e7&&(c==keys.LEFT_ARROW||c==keys.UP_ARROW))||(e.ctrlKey&&c==keys.PAGE_UP)){
this._adjacent(false)._buttonWidget._onTitleClick();
_1a9.stop(e);
}else{
if((_1e7&&(c==keys.RIGHT_ARROW||c==keys.DOWN_ARROW))||(e.ctrlKey&&(c==keys.PAGE_DOWN||c==keys.TAB))){
this._adjacent(true)._buttonWidget._onTitleClick();
_1a9.stop(e);
}
}
}});
if(has("dijit-legacy-requires")){
_1b1(0,function(){
var _1e8=["dijit/layout/AccordionPane"];
_1a6(_1e8);
});
}
_1c8._InnerContainer=_1bd;
_1c8._Button=_1b9;
return _1c8;
});
},"dijit/form/ComboButton":function(){
define(["dojo/_base/declare","dojo/_base/event","dojo/keys","../focus","./DropDownButton","dojo/text!./templates/ComboButton.html"],function(_1e9,_1ea,keys,_1eb,_1ec,_1ed){
return _1e9("dijit.form.ComboButton",_1ec,{templateString:_1ed,_setIdAttr:"",_setTabIndexAttr:["focusNode","titleNode"],_setTitleAttr:"titleNode",optionsTitle:"",baseClass:"dijitComboButton",cssStateNodes:{"buttonNode":"dijitButtonNode","titleNode":"dijitButtonContents","_popupStateNode":"dijitDownArrowButton"},_focusedNode:null,_onButtonKeyPress:function(evt){
if(evt.charOrCode==keys[this.isLeftToRight()?"RIGHT_ARROW":"LEFT_ARROW"]){
_1eb.focus(this._popupStateNode);
_1ea.stop(evt);
}
},_onArrowKeyPress:function(evt){
if(evt.charOrCode==keys[this.isLeftToRight()?"LEFT_ARROW":"RIGHT_ARROW"]){
_1eb.focus(this.titleNode);
_1ea.stop(evt);
}
},focus:function(_1ee){
if(!this.disabled){
_1eb.focus(_1ee=="start"?this.titleNode:this._popupStateNode);
}
}});
});
},"dijit/layout/SplitContainer":function(){
define("dijit/layout/SplitContainer",["dojo/_base/array","dojo/cookie","dojo/_base/declare","dojo/dom","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/_base/event","dojo/_base/kernel","dojo/_base/lang","dojo/on","dojo/sniff","../registry","../_WidgetBase","./_LayoutWidget"],function(_1ef,_1f0,_1f1,dom,_1f2,_1f3,_1f4,_1f5,_1f6,_1f7,lang,on,has,_1f8,_1f9,_1fa){
var _1fb=_1f1("dijit.layout.SplitContainer",_1fa,{constructor:function(){
_1f7.deprecated("dijit.layout.SplitContainer is deprecated","use BorderContainer with splitter instead",2);
},activeSizing:false,sizerWidth:7,orientation:"horizontal",persist:true,baseClass:"dijitSplitContainer",postMixInProperties:function(){
this.inherited("postMixInProperties",arguments);
this.isHorizontal=(this.orientation=="horizontal");
},postCreate:function(){
this.inherited(arguments);
this.sizers=[];
if(has("mozilla")){
this.domNode.style.overflow="-moz-scrollbars-none";
}
if(typeof this.sizerWidth=="object"){
try{
this.sizerWidth=parseInt(this.sizerWidth.toString());
}
catch(e){
this.sizerWidth=7;
}
}
var _1fc=this.ownerDocument.createElement("div");
this.virtualSizer=_1fc;
_1fc.style.position="relative";
_1fc.style.zIndex=10;
_1fc.className=this.isHorizontal?"dijitSplitContainerVirtualSizerH":"dijitSplitContainerVirtualSizerV";
this.domNode.appendChild(_1fc);
dom.setSelectable(_1fc,false);
},destroy:function(){
delete this.virtualSizer;
if(this._ownconnects){
var h;
while(h=this._ownconnects.pop()){
h.remove();
}
}
this.inherited(arguments);
},startup:function(){
if(this._started){
return;
}
_1ef.forEach(this.getChildren(),function(_1fd,i,_1fe){
this._setupChild(_1fd);
if(i<_1fe.length-1){
this._addSizer();
}
},this);
if(this.persist){
this._restoreState();
}
this.inherited(arguments);
},_setupChild:function(_1ff){
this.inherited(arguments);
_1ff.domNode.style.position="absolute";
_1f2.add(_1ff.domNode,"dijitSplitPane");
},_onSizerMouseDown:function(e){
if(e.target.id){
for(var i=0;i<this.sizers.length;i++){
if(this.sizers[i].id==e.target.id){
break;
}
}
if(i<this.sizers.length){
this.beginSizing(e,i);
}
}
},_addSizer:function(_200){
_200=_200===undefined?this.sizers.length:_200;
var _201=this.ownerDocument.createElement("div");
_201.id=_1f8.getUniqueId("dijit_layout_SplitterContainer_Splitter");
this.sizers.splice(_200,0,_201);
this.domNode.appendChild(_201);
_201.className=this.isHorizontal?"dijitSplitContainerSizerH":"dijitSplitContainerSizerV";
var _202=this.ownerDocument.createElement("div");
_202.className="thumb";
_201.appendChild(_202);
this.connect(_201,"onmousedown","_onSizerMouseDown");
dom.setSelectable(_201,false);
},removeChild:function(_203){
if(this.sizers.length){
var i=_1ef.indexOf(this.getChildren(),_203);
if(i!=-1){
if(i==this.sizers.length){
i--;
}
_1f3.destroy(this.sizers[i]);
this.sizers.splice(i,1);
}
}
this.inherited(arguments);
if(this._started){
this.layout();
}
},addChild:function(_204,_205){
this.inherited(arguments);
if(this._started){
var _206=this.getChildren();
if(_206.length>1){
this._addSizer(_205);
}
this.layout();
}
},layout:function(){
this.paneWidth=this._contentBox.w;
this.paneHeight=this._contentBox.h;
var _207=this.getChildren();
if(!_207.length){
return;
}
var _208=this.isHorizontal?this.paneWidth:this.paneHeight;
if(_207.length>1){
_208-=this.sizerWidth*(_207.length-1);
}
var _209=0;
_1ef.forEach(_207,function(_20a){
_209+=_20a.sizeShare;
});
var _20b=_208/_209;
var _20c=0;
_1ef.forEach(_207.slice(0,_207.length-1),function(_20d){
var size=Math.round(_20b*_20d.sizeShare);
_20d.sizeActual=size;
_20c+=size;
});
_207[_207.length-1].sizeActual=_208-_20c;
this._checkSizes();
var pos=0;
var size=_207[0].sizeActual;
this._movePanel(_207[0],pos,size);
_207[0].position=pos;
pos+=size;
if(!this.sizers){
return;
}
_1ef.some(_207.slice(1),function(_20e,i){
if(!this.sizers[i]){
return true;
}
this._moveSlider(this.sizers[i],pos,this.sizerWidth);
this.sizers[i].position=pos;
pos+=this.sizerWidth;
size=_20e.sizeActual;
this._movePanel(_20e,pos,size);
_20e.position=pos;
pos+=size;
},this);
},_movePanel:function(_20f,pos,size){
var box;
if(this.isHorizontal){
_20f.domNode.style.left=pos+"px";
_20f.domNode.style.top=0;
box={w:size,h:this.paneHeight};
if(_20f.resize){
_20f.resize(box);
}else{
_1f4.setMarginBox(_20f.domNode,box);
}
}else{
_20f.domNode.style.left=0;
_20f.domNode.style.top=pos+"px";
box={w:this.paneWidth,h:size};
if(_20f.resize){
_20f.resize(box);
}else{
_1f4.setMarginBox(_20f.domNode,box);
}
}
},_moveSlider:function(_210,pos,size){
if(this.isHorizontal){
_210.style.left=pos+"px";
_210.style.top=0;
_1f4.setMarginBox(_210,{w:size,h:this.paneHeight});
}else{
_210.style.left=0;
_210.style.top=pos+"px";
_1f4.setMarginBox(_210,{w:this.paneWidth,h:size});
}
},_growPane:function(_211,pane){
if(_211>0){
if(pane.sizeActual>pane.sizeMin){
if((pane.sizeActual-pane.sizeMin)>_211){
pane.sizeActual=pane.sizeActual-_211;
_211=0;
}else{
_211-=pane.sizeActual-pane.sizeMin;
pane.sizeActual=pane.sizeMin;
}
}
}
return _211;
},_checkSizes:function(){
var _212=0;
var _213=0;
var _214=this.getChildren();
_1ef.forEach(_214,function(_215){
_213+=_215.sizeActual;
_212+=_215.sizeMin;
});
if(_212<=_213){
var _216=0;
_1ef.forEach(_214,function(_217){
if(_217.sizeActual<_217.sizeMin){
_216+=_217.sizeMin-_217.sizeActual;
_217.sizeActual=_217.sizeMin;
}
});
if(_216>0){
var list=this.isDraggingLeft?_214.reverse():_214;
_1ef.forEach(list,function(_218){
_216=this._growPane(_216,_218);
},this);
}
}else{
_1ef.forEach(_214,function(_219){
_219.sizeActual=Math.round(_213*(_219.sizeMin/_212));
});
}
},beginSizing:function(e,i){
var _21a=this.getChildren();
this.paneBefore=_21a[i];
this.paneAfter=_21a[i+1];
this.paneBefore.sizeBeforeDrag=this.paneBefore.sizeActual;
this.paneAfter.sizeBeforeDrag=this.paneAfter.sizeActual;
this.paneAfter.positionBeforeDrag=this.paneAfter.position;
this.isSizing=true;
this.sizingSplitter=this.sizers[i];
this.sizingSplitter.positionBeforeDrag=_1f5.get(this.sizingSplitter,(this.isHorizontal?"left":"top"));
if(!this.cover){
this.cover=_1f3.create("div",{style:{position:"absolute",zIndex:5,top:0,left:0,width:"100%",height:"100%"}},this.domNode);
}else{
this.cover.style.zIndex=5;
}
this.sizingSplitter.style.zIndex=6;
this.startPoint=this.lastPoint=(this.isHorizontal?e.pageX:e.pageY);
this.maxDelta=this.paneAfter.sizeActual-this.paneAfter.sizeMin;
this.minDelta=-1*(this.paneBefore.sizeActual-this.paneBefore.sizeMin);
if(!this.activeSizing){
this._showSizingLine();
}
this._ownconnects=[on(this.ownerDocument.documentElement,"mousemove",lang.hitch(this,"changeSizing")),on(this.ownerDocument.documentElement,"mouseup",lang.hitch(this,"endSizing"))];
_1f6.stop(e);
},changeSizing:function(e){
if(!this.isSizing){
return;
}
this.lastPoint=this.isHorizontal?e.pageX:e.pageY;
var _21b=Math.max(Math.min(this.lastPoint-this.startPoint,this.maxDelta),this.minDelta);
if(this.activeSizing){
this._updateSize(_21b);
}else{
this._moveSizingLine(_21b);
}
_1f6.stop(e);
},endSizing:function(){
if(!this.isSizing){
return;
}
if(this.cover){
this.cover.style.zIndex=-1;
}
if(!this.activeSizing){
this._hideSizingLine();
}
var _21c=Math.max(Math.min(this.lastPoint-this.startPoint,this.maxDelta),this.minDelta);
this._updateSize(_21c);
this.isSizing=false;
if(this.persist){
this._saveState(this);
}
var h;
while(h=this._ownconnects.pop()){
h.remove();
}
},_updateSize:function(_21d){
this.paneBefore.sizeActual=this.paneBefore.sizeBeforeDrag+_21d;
this.paneAfter.position=this.paneAfter.positionBeforeDrag+_21d;
this.paneAfter.sizeActual=this.paneAfter.sizeBeforeDrag-_21d;
_1ef.forEach(this.getChildren(),function(_21e){
_21e.sizeShare=_21e.sizeActual;
});
if(this._started){
this.layout();
}
},_showSizingLine:function(){
this._moveSizingLine(0);
_1f4.setMarginBox(this.virtualSizer,this.isHorizontal?{w:this.sizerWidth,h:this.paneHeight}:{w:this.paneWidth,h:this.sizerWidth});
this.virtualSizer.style.display="block";
},_hideSizingLine:function(){
this.virtualSizer.style.display="none";
},_moveSizingLine:function(_21f){
var pos=_21f+this.sizingSplitter.positionBeforeDrag;
_1f5.set(this.virtualSizer,(this.isHorizontal?"left":"top"),pos+"px");
},_getCookieName:function(i){
return this.id+"_"+i;
},_restoreState:function(){
_1ef.forEach(this.getChildren(),function(_220,i){
var _221=this._getCookieName(i);
var _222=_1f0(_221);
if(_222){
var pos=parseInt(_222);
if(typeof pos=="number"){
_220.sizeShare=pos;
}
}
},this);
},_saveState:function(){
if(!this.persist){
return;
}
_1ef.forEach(this.getChildren(),function(_223,i){
_1f0(this._getCookieName(i),_223.sizeShare,{expires:365});
},this);
}});
_1fb.ChildWidgetProperties={sizeMin:10,sizeShare:10};
lang.extend(_1f9,_1fb.ChildWidgetProperties);
return _1fb;
});
},"url:dijit/templates/Calendar.html":"<table cellspacing=\"0\" cellpadding=\"0\" class=\"dijitCalendarContainer\" role=\"grid\" aria-labelledby=\"${id}_mddb ${id}_year\">\n\t<thead>\n\t\t<tr class=\"dijitReset dijitCalendarMonthContainer\" valign=\"top\">\n\t\t\t<th class='dijitReset dijitCalendarArrow' data-dojo-attach-point=\"decrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarDecrease\" role=\"presentation\"/>\n\t\t\t\t<span data-dojo-attach-point=\"decreaseArrowNode\" class=\"dijitA11ySideArrow\">-</span>\n\t\t\t</th>\n\t\t\t<th class='dijitReset' colspan=\"5\">\n\t\t\t\t<div data-dojo-attach-point=\"monthNode\">\n\t\t\t\t</div>\n\t\t\t</th>\n\t\t\t<th class='dijitReset dijitCalendarArrow' data-dojo-attach-point=\"incrementMonth\">\n\t\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitCalendarIncrementControl dijitCalendarIncrease\" role=\"presentation\"/>\n\t\t\t\t<span data-dojo-attach-point=\"increaseArrowNode\" class=\"dijitA11ySideArrow\">+</span>\n\t\t\t</th>\n\t\t</tr>\n\t\t<tr role=\"row\">\n\t\t\t${!dayCellsHtml}\n\t\t</tr>\n\t</thead>\n\t<tbody data-dojo-attach-point=\"dateRowsNode\" data-dojo-attach-event=\"onclick: _onDayClick\" class=\"dijitReset dijitCalendarBodyContainer\">\n\t\t\t${!dateRowsHtml}\n\t</tbody>\n\t<tfoot class=\"dijitReset dijitCalendarYearContainer\">\n\t\t<tr>\n\t\t\t<td class='dijitReset' valign=\"top\" colspan=\"7\" role=\"presentation\">\n\t\t\t\t<div class=\"dijitCalendarYearLabel\">\n\t\t\t\t\t<span data-dojo-attach-point=\"previousYearLabelNode\" class=\"dijitInline dijitCalendarPreviousYear\" role=\"button\"></span>\n\t\t\t\t\t<span data-dojo-attach-point=\"currentYearLabelNode\" class=\"dijitInline dijitCalendarSelectedYear\" role=\"button\" id=\"${id}_year\"></span>\n\t\t\t\t\t<span data-dojo-attach-point=\"nextYearLabelNode\" class=\"dijitInline dijitCalendarNextYear\" role=\"button\"></span>\n\t\t\t\t</div>\n\t\t\t</td>\n\t\t</tr>\n\t</tfoot>\n</table>\n","dijit/form/_AutoCompleterMixin":function(){
define(["dojo/data/util/filter","dojo/_base/declare","dojo/dom-attr","dojo/_base/event","dojo/keys","dojo/_base/lang","dojo/query","dojo/regexp","dojo/sniff","dojo/string","./DataList","../registry","./_TextBoxMixin","./_SearchMixin"],function(_224,_225,_226,_227,keys,lang,_228,_229,has,_22a,_22b,_22c,_22d,_22e){
return _225("dijit.form._AutoCompleterMixin",_22e,{item:null,autoComplete:true,highlightMatch:"first",labelAttr:"",labelType:"text",maxHeight:-1,_stopClickEvents:false,_getCaretPos:function(_22f){
var pos=0;
if(typeof (_22f.selectionStart)=="number"){
pos=_22f.selectionStart;
}else{
if(has("ie")){
var tr=_22f.ownerDocument.selection.createRange().duplicate();
var ntr=_22f.createTextRange();
tr.move("character",0);
ntr.move("character",0);
try{
ntr.setEndPoint("EndToEnd",tr);
pos=String(ntr.text).replace(/\r/g,"").length;
}
catch(e){
}
}
}
return pos;
},_setCaretPos:function(_230,_231){
_231=parseInt(_231);
_22d.selectInputText(_230,_231,_231);
},_setDisabledAttr:function(_232){
this.inherited(arguments);
this.domNode.setAttribute("aria-disabled",_232?"true":"false");
},_onKey:function(evt){
if(evt.charCode>=32){
return;
}
var key=evt.charCode||evt.keyCode;
if(key==keys.ALT||key==keys.CTRL||key==keys.META||key==keys.SHIFT){
return;
}
var pw=this.dropDown;
var _233=null;
this._abortQuery();
this.inherited(arguments);
if(evt.altKey||evt.ctrlKey||evt.metaKey){
return;
}
if(this._opened){
_233=pw.getHighlightedOption();
}
switch(key){
case keys.PAGE_DOWN:
case keys.DOWN_ARROW:
case keys.PAGE_UP:
case keys.UP_ARROW:
if(this._opened){
this._announceOption(_233);
}
_227.stop(evt);
break;
case keys.ENTER:
if(_233){
if(_233==pw.nextButton){
this._nextSearch(1);
_227.stop(evt);
break;
}else{
if(_233==pw.previousButton){
this._nextSearch(-1);
_227.stop(evt);
break;
}
}
_227.stop(evt);
}else{
this._setBlurValue();
this._setCaretPos(this.focusNode,this.focusNode.value.length);
}
case keys.TAB:
var _234=this.get("displayedValue");
if(pw&&(_234==pw._messages["previousMessage"]||_234==pw._messages["nextMessage"])){
break;
}
if(_233){
this._selectOption(_233);
}
case keys.ESCAPE:
if(this._opened){
this._lastQuery=null;
this.closeDropDown();
}
break;
}
},_autoCompleteText:function(text){
var fn=this.focusNode;
_22d.selectInputText(fn,fn.value.length);
var _235=this.ignoreCase?"toLowerCase":"substr";
if(text[_235](0).indexOf(this.focusNode.value[_235](0))==0){
var cpos=this.autoComplete?this._getCaretPos(fn):fn.value.length;
if((cpos+1)>fn.value.length){
fn.value=text;
_22d.selectInputText(fn,cpos);
}
}else{
fn.value=text;
_22d.selectInputText(fn);
}
},_openResultList:function(_236,_237,_238){
var _239=this.dropDown.getHighlightedOption();
this.dropDown.clearResultList();
if(!_236.length&&_238.start==0){
this.closeDropDown();
return;
}
this._nextSearch=this.dropDown.onPage=lang.hitch(this,function(_23a){
_236.nextPage(_23a!==-1);
this.focus();
});
this.dropDown.createOptions(_236,_238,lang.hitch(this,"_getMenuLabelFromItem"));
this._showResultList();
if("direction" in _238){
if(_238.direction){
this.dropDown.highlightFirstOption();
}else{
if(!_238.direction){
this.dropDown.highlightLastOption();
}
}
if(_239){
this._announceOption(this.dropDown.getHighlightedOption());
}
}else{
if(this.autoComplete&&!this._prev_key_backspace&&!/^[*]+$/.test(_237[this.searchAttr].toString())){
this._announceOption(this.dropDown.containerNode.firstChild.nextSibling);
}
}
},_showResultList:function(){
this.closeDropDown(true);
this.openDropDown();
this.domNode.setAttribute("aria-expanded","true");
},loadDropDown:function(){
this._startSearchAll();
},isLoaded:function(){
return false;
},closeDropDown:function(){
this._abortQuery();
if(this._opened){
this.inherited(arguments);
this.domNode.setAttribute("aria-expanded","false");
this.focusNode.removeAttribute("aria-activedescendant");
}
},_setBlurValue:function(){
var _23b=this.get("displayedValue");
var pw=this.dropDown;
if(pw&&(_23b==pw._messages["previousMessage"]||_23b==pw._messages["nextMessage"])){
this._setValueAttr(this._lastValueReported,true);
}else{
if(typeof this.item=="undefined"){
this.item=null;
this.set("displayedValue",_23b);
}else{
if(this.value!=this._lastValueReported){
this._handleOnChange(this.value,true);
}
this._refreshState();
}
}
},_setItemAttr:function(item,_23c,_23d){
var _23e="";
if(item){
if(!_23d){
_23d=this.store._oldAPI?this.store.getValue(item,this.searchAttr):item[this.searchAttr];
}
_23e=this._getValueField()!=this.searchAttr?this.store.getIdentity(item):_23d;
}
this.set("value",_23e,_23c,_23d,item);
},_announceOption:function(node){
if(!node){
return;
}
var _23f;
if(node==this.dropDown.nextButton||node==this.dropDown.previousButton){
_23f=node.innerHTML;
this.item=undefined;
this.value="";
}else{
var item=this.dropDown.items[node.getAttribute("item")];
_23f=(this.store._oldAPI?this.store.getValue(item,this.searchAttr):item[this.searchAttr]).toString();
this.set("item",item,false,_23f);
}
this.focusNode.value=this.focusNode.value.substring(0,this._lastInput.length);
this.focusNode.setAttribute("aria-activedescendant",_226.get(node,"id"));
this._autoCompleteText(_23f);
},_selectOption:function(_240){
this.closeDropDown();
if(_240){
this._announceOption(_240);
}
this._setCaretPos(this.focusNode,this.focusNode.value.length);
this._handleOnChange(this.value,true);
},_startSearchAll:function(){
this._startSearch("");
},_startSearchFromInput:function(){
this.item=undefined;
this.inherited(arguments);
},_startSearch:function(key){
if(!this.dropDown){
var _241=this.id+"_popup",_242=lang.isString(this.dropDownClass)?lang.getObject(this.dropDownClass,false):this.dropDownClass;
this.dropDown=new _242({onChange:lang.hitch(this,this._selectOption),id:_241,dir:this.dir,textDir:this.textDir});
this.focusNode.removeAttribute("aria-activedescendant");
this.textbox.setAttribute("aria-owns",_241);
}
this._lastInput=key;
this.inherited(arguments);
},_getValueField:function(){
return this.searchAttr;
},postMixInProperties:function(){
this.inherited(arguments);
if(!this.store){
var _243=this.srcNodeRef;
this.store=new _22b({},_243);
if(!("value" in this.params)){
var item=(this.item=this.store.fetchSelectedItem());
if(item){
var _244=this._getValueField();
this.value=this.store._oldAPI?this.store.getValue(item,_244):item[_244];
}
}
}
},postCreate:function(){
var _245=_228("label[for=\""+this.id+"\"]");
if(_245.length){
if(!_245[0].id){
_245[0].id=this.id+"_label";
}
this.domNode.setAttribute("aria-labelledby",_245[0].id);
}
this.inherited(arguments);
this.connect(this,"onSearch","_openResultList");
},_getMenuLabelFromItem:function(item){
var _246=this.labelFunc(item,this.store),_247=this.labelType;
if(this.highlightMatch!="none"&&this.labelType=="text"&&this._lastInput){
_246=this.doHighlight(_246,this._lastInput);
_247="html";
}
return {html:_247=="html",label:_246};
},doHighlight:function(_248,find){
var _249=(this.ignoreCase?"i":"")+(this.highlightMatch=="all"?"g":""),i=this.queryExpr.indexOf("${0}");
find=_229.escapeString(find);
return this._escapeHtml(_248.replace(new RegExp((i==0?"^":"")+"("+find+")"+(i==(this.queryExpr.length-4)?"$":""),_249),"\uffff$1\uffff")).replace(/\uFFFF([^\uFFFF]+)\uFFFF/g,"<span class=\"dijitComboBoxHighlightMatch\">$1</span>");
},_escapeHtml:function(str){
str=String(str).replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
return str;
},reset:function(){
this.item=null;
this.inherited(arguments);
},labelFunc:function(item,_24a){
return (_24a._oldAPI?_24a.getValue(item,this.labelAttr||this.searchAttr):item[this.labelAttr||this.searchAttr]).toString();
},_setValueAttr:function(_24b,_24c,_24d,item){
this._set("item",item||null);
if(_24b==null){
_24b="";
}
this.inherited(arguments);
},_setTextDirAttr:function(_24e){
this.inherited(arguments);
if(this.dropDown){
this.dropDown._set("textDir",_24e);
}
}});
});
},"url:dijit/templates/ColorPalette.html":"<div class=\"dijitInline dijitColorPalette\">\n\t<table dojoAttachPoint=\"paletteTableNode\" class=\"dijitPaletteTable\" cellSpacing=\"0\" cellPadding=\"0\" role=\"grid\">\n\t\t<tbody data-dojo-attach-point=\"gridNode\"></tbody>\n\t</table>\n</div>\n","url:dijit/layout/templates/_ScrollingTabControllerButton.html":"<div data-dojo-attach-event=\"onclick:_onClick\" class=\"dijitTabInnerDiv dijitTabContent dijitButtonContents\"  data-dojo-attach-point=\"focusNode\">\n\t<img role=\"presentation\" alt=\"\" src=\"${_blankGif}\" class=\"dijitTabStripIcon\" data-dojo-attach-point=\"iconNode\"/>\n\t<span data-dojo-attach-point=\"containerNode,titleNode\" class=\"dijitButtonText\"></span>\n</div>","dijit/form/MappedTextBox":function(){
define(["dojo/_base/declare","dojo/dom-construct","./ValidationTextBox"],function(_24f,_250,_251){
return _24f("dijit.form.MappedTextBox",_251,{postMixInProperties:function(){
this.inherited(arguments);
this.nameAttrSetting="";
},_setNameAttr:null,serialize:function(val){
return val.toString?val.toString():"";
},toString:function(){
var val=this.filter(this.get("value"));
return val!=null?(typeof val=="string"?val:this.serialize(val,this.constraints)):"";
},validate:function(){
this.valueNode.value=this.toString();
return this.inherited(arguments);
},buildRendering:function(){
this.inherited(arguments);
this.valueNode=_250.place("<input type='hidden'"+(this.name?" name=\""+this.name.replace(/"/g,"&quot;")+"\"":"")+"/>",this.textbox,"after");
},reset:function(){
this.valueNode.value="";
this.inherited(arguments);
}});
});
},"dijit/form/ComboBoxMixin":function(){
define(["dojo/_base/declare","dojo/_base/Deferred","dojo/_base/kernel","dojo/_base/lang","dojo/store/util/QueryResults","./_AutoCompleterMixin","./_ComboBoxMenu","../_HasDropDown","dojo/text!./templates/DropDownBox.html"],function(_252,_253,_254,lang,_255,_256,_257,_258,_259){
return _252("dijit.form.ComboBoxMixin",[_258,_256],{dropDownClass:_257,hasDownArrow:true,templateString:_259,baseClass:"dijitTextBox dijitComboBox",cssStateNodes:{"_buttonNode":"dijitDownArrowButton"},_setHasDownArrowAttr:function(val){
this._set("hasDownArrow",val);
this._buttonNode.style.display=val?"":"none";
},_showResultList:function(){
this.displayMessage("");
this.inherited(arguments);
},_setStoreAttr:function(_25a){
if(!_25a.get){
lang.mixin(_25a,{_oldAPI:true,get:function(id){
var _25b=new _253();
this.fetchItemByIdentity({identity:id,onItem:function(_25c){
_25b.resolve(_25c);
},onError:function(_25d){
_25b.reject(_25d);
}});
return _25b.promise;
},query:function(_25e,_25f){
var _260=new _253(function(){
_261.abort&&_261.abort();
});
_260.total=new _253();
var _261=this.fetch(lang.mixin({query:_25e,onBegin:function(_262){
_260.total.resolve(_262);
},onComplete:function(_263){
_260.resolve(_263);
},onError:function(_264){
_260.reject(_264);
}},_25f));
return _255(_260);
}});
}
this._set("store",_25a);
},postMixInProperties:function(){
var _265=this.params.store||this.store;
if(_265){
this._setStoreAttr(_265);
}
this.inherited(arguments);
if(!this.params.store&&!this.store._oldAPI){
var _266=this.declaredClass;
lang.mixin(this.store,{getValue:function(item,attr){
_254.deprecated(_266+".store.getValue(item, attr) is deprecated for builtin store.  Use item.attr directly","","2.0");
return item[attr];
},getLabel:function(item){
_254.deprecated(_266+".store.getLabel(item) is deprecated for builtin store.  Use item.label directly","","2.0");
return item.name;
},fetch:function(args){
_254.deprecated(_266+".store.fetch() is deprecated for builtin store.","Use store.query()","2.0");
var shim=["dojo/data/ObjectStore"];
require(shim,lang.hitch(this,function(_267){
new _267({objectStore:this}).fetch(args);
}));
}});
}
}});
});
},"dojo/_base/query":function(){
define(["../query","./NodeList"],function(_268){
return _268;
});
},"dijit/form/_TextBoxMixin":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dom","dojo/_base/event","dojo/keys","dojo/_base/lang","dojo/on","../main"],function(_269,_26a,dom,_26b,keys,lang,on,_26c){
var _26d=_26a("dijit.form._TextBoxMixin",null,{trim:false,uppercase:false,lowercase:false,propercase:false,maxLength:"",selectOnClick:false,placeHolder:"",_getValueAttr:function(){
return this.parse(this.get("displayedValue"),this.constraints);
},_setValueAttr:function(_26e,_26f,_270){
var _271;
if(_26e!==undefined){
_271=this.filter(_26e);
if(typeof _270!="string"){
if(_271!==null&&((typeof _271!="number")||!isNaN(_271))){
_270=this.filter(this.format(_271,this.constraints));
}else{
_270="";
}
}
}
if(_270!=null&&((typeof _270)!="number"||!isNaN(_270))&&this.textbox.value!=_270){
this.textbox.value=_270;
this._set("displayedValue",this.get("displayedValue"));
}
if(this.textDir=="auto"){
this.applyTextDir(this.focusNode,_270);
}
this.inherited(arguments,[_271,_26f]);
},displayedValue:"",_getDisplayedValueAttr:function(){
return this.filter(this.textbox.value);
},_setDisplayedValueAttr:function(_272){
if(_272==null){
_272="";
}else{
if(typeof _272!="string"){
_272=String(_272);
}
}
this.textbox.value=_272;
this._setValueAttr(this.get("value"),undefined);
this._set("displayedValue",this.get("displayedValue"));
if(this.textDir=="auto"){
this.applyTextDir(this.focusNode,_272);
}
},format:function(_273){
return _273==null?"":(_273.toString?_273.toString():_273);
},parse:function(_274){
return _274;
},_refreshState:function(){
},onInput:function(){
},__skipInputEvent:false,_onInput:function(evt){
if(this.textDir=="auto"){
this.applyTextDir(this.focusNode,this.focusNode.value);
}
this._processInput(evt);
},_processInput:function(evt){
this._refreshState();
this._set("displayedValue",this.get("displayedValue"));
},postCreate:function(){
this.textbox.setAttribute("value",this.textbox.value);
this.inherited(arguments);
var _275=function(e){
var _276;
if(e.type=="keydown"){
_276=e.keyCode;
switch(_276){
case keys.SHIFT:
case keys.ALT:
case keys.CTRL:
case keys.META:
case keys.CAPS_LOCK:
case keys.NUM_LOCK:
case keys.SCROLL_LOCK:
return;
}
if(!e.ctrlKey&&!e.metaKey&&!e.altKey){
switch(_276){
case keys.NUMPAD_0:
case keys.NUMPAD_1:
case keys.NUMPAD_2:
case keys.NUMPAD_3:
case keys.NUMPAD_4:
case keys.NUMPAD_5:
case keys.NUMPAD_6:
case keys.NUMPAD_7:
case keys.NUMPAD_8:
case keys.NUMPAD_9:
case keys.NUMPAD_MULTIPLY:
case keys.NUMPAD_PLUS:
case keys.NUMPAD_ENTER:
case keys.NUMPAD_MINUS:
case keys.NUMPAD_PERIOD:
case keys.NUMPAD_DIVIDE:
return;
}
if((_276>=65&&_276<=90)||(_276>=48&&_276<=57)||_276==keys.SPACE){
return;
}
var _277=false;
for(var i in keys){
if(keys[i]===e.keyCode){
_277=true;
break;
}
}
if(!_277){
return;
}
}
}
_276=e.charCode>=32?String.fromCharCode(e.charCode):e.charCode;
if(!_276){
_276=(e.keyCode>=65&&e.keyCode<=90)||(e.keyCode>=48&&e.keyCode<=57)||e.keyCode==keys.SPACE?String.fromCharCode(e.keyCode):e.keyCode;
}
if(!_276){
_276=229;
}
if(e.type=="keypress"){
if(typeof _276!="string"){
return;
}
if((_276>="a"&&_276<="z")||(_276>="A"&&_276<="Z")||(_276>="0"&&_276<="9")||(_276===" ")){
if(e.ctrlKey||e.metaKey||e.altKey){
return;
}
}
}
if(e.type=="input"){
if(this.__skipInputEvent){
this.__skipInputEvent=false;
return;
}
}else{
this.__skipInputEvent=true;
}
var faux={faux:true},attr;
for(attr in e){
if(attr!="layerX"&&attr!="layerY"){
var v=e[attr];
if(typeof v!="function"&&typeof v!="undefined"){
faux[attr]=v;
}
}
}
lang.mixin(faux,{charOrCode:_276,_wasConsumed:false,preventDefault:function(){
faux._wasConsumed=true;
e.preventDefault();
},stopPropagation:function(){
e.stopPropagation();
}});
if(this.onInput(faux)===false){
faux.preventDefault();
faux.stopPropagation();
}
if(faux._wasConsumed){
return;
}
this.defer(function(){
this._onInput(faux);
});
};
this.own(on(this.textbox,"keydown, keypress, paste, cut, input, compositionend",lang.hitch(this,_275)));
},_blankValue:"",filter:function(val){
if(val===null){
return this._blankValue;
}
if(typeof val!="string"){
return val;
}
if(this.trim){
val=lang.trim(val);
}
if(this.uppercase){
val=val.toUpperCase();
}
if(this.lowercase){
val=val.toLowerCase();
}
if(this.propercase){
val=val.replace(/[^\s]+/g,function(word){
return word.substring(0,1).toUpperCase()+word.substring(1);
});
}
return val;
},_setBlurValue:function(){
this._setValueAttr(this.get("value"),true);
},_onBlur:function(e){
if(this.disabled){
return;
}
this._setBlurValue();
this.inherited(arguments);
},_isTextSelected:function(){
return this.textbox.selectionStart!=this.textbox.selectionEnd;
},_onFocus:function(by){
if(this.disabled||this.readOnly){
return;
}
if(this.selectOnClick&&by=="mouse"){
this._selectOnClickHandle=this.connect(this.domNode,"onmouseup",function(){
this.disconnect(this._selectOnClickHandle);
this._selectOnClickHandle=null;
if(!this._isTextSelected()){
_26d.selectInputText(this.textbox);
}
});
this.defer(function(){
if(this._selectOnClickHandle){
this.disconnect(this._selectOnClickHandle);
this._selectOnClickHandle=null;
}
},500);
}
this.inherited(arguments);
this._refreshState();
},reset:function(){
this.textbox.value="";
this.inherited(arguments);
},_setTextDirAttr:function(_278){
if(!this._created||this.textDir!=_278){
this._set("textDir",_278);
this.applyTextDir(this.focusNode,this.focusNode.value);
}
}});
_26d._setSelectionRange=_26c._setSelectionRange=function(_279,_27a,stop){
if(_279.setSelectionRange){
_279.setSelectionRange(_27a,stop);
}
};
_26d.selectInputText=_26c.selectInputText=function(_27b,_27c,stop){
_27b=dom.byId(_27b);
if(isNaN(_27c)){
_27c=0;
}
if(isNaN(stop)){
stop=_27b.value?_27b.value.length:0;
}
try{
_27b.focus();
_26d._setSelectionRange(_27b,_27c,stop);
}
catch(e){
}
};
return _26d;
});
},"dijit/form/SimpleTextarea":function(){
define("dijit/form/SimpleTextarea",["dojo/_base/declare","dojo/dom-class","dojo/sniff","./TextBox"],function(_27d,_27e,has,_27f){
return _27d("dijit.form.SimpleTextarea",_27f,{baseClass:"dijitTextBox dijitTextArea",rows:"3",cols:"20",templateString:"<textarea ${!nameAttrSetting} data-dojo-attach-point='focusNode,containerNode,textbox' autocomplete='off'></textarea>",postMixInProperties:function(){
if(!this.value&&this.srcNodeRef){
this.value=this.srcNodeRef.value;
}
this.inherited(arguments);
},buildRendering:function(){
this.inherited(arguments);
if(has("ie")&&this.cols){
_27e.add(this.textbox,"dijitTextAreaCols");
}
},filter:function(_280){
if(_280){
_280=_280.replace(/\r/g,"");
}
return this.inherited(arguments);
},_onInput:function(e){
if(this.maxLength){
var _281=parseInt(this.maxLength);
var _282=this.textbox.value.replace(/\r/g,"");
var _283=_282.length-_281;
if(_283>0){
var _284=this.textbox;
if(_284.selectionStart){
var pos=_284.selectionStart;
var cr=0;
if(has("opera")){
cr=(this.textbox.value.substring(0,pos).match(/\r/g)||[]).length;
}
this.textbox.value=_282.substring(0,pos-_283-cr)+_282.substring(pos-cr);
_284.setSelectionRange(pos-_283,pos-_283);
}else{
if(this.ownerDocument.selection){
_284.focus();
var _285=this.ownerDocument.selection.createRange();
_285.moveStart("character",-_283);
_285.text="";
_285.select();
}
}
}
}
this.inherited(arguments);
}});
});
},"url:dijit/layout/templates/_TabButton.html":"<div role=\"presentation\" data-dojo-attach-point=\"titleNode,innerDiv,tabContent\" class=\"dijitTabInner dijitTabContent\">\n\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon dijitTabButtonIcon\" data-dojo-attach-point='iconNode'/>\n\t<span data-dojo-attach-point='containerNode,focusNode' class='tabLabel'></span>\n\t<span class=\"dijitInline dijitTabCloseButton dijitTabCloseIcon\" data-dojo-attach-point='closeNode'\n\t\t  role=\"presentation\">\n\t\t<span data-dojo-attach-point='closeText' class='dijitTabCloseText'>[x]</span\n\t\t\t\t></span>\n</div>\n","dijit/PopupMenuItem":function(){
define(["dojo/_base/declare","dojo/dom-style","dojo/query","./registry","./MenuItem","./hccss"],function(_286,_287,_288,_289,_28a){
return _286("dijit.PopupMenuItem",_28a,{_fillContent:function(){
if(this.srcNodeRef){
var _28b=_288("*",this.srcNodeRef);
this.inherited(arguments,[_28b[0]]);
this.dropDownContainer=this.srcNodeRef;
}
},startup:function(){
if(this._started){
return;
}
this.inherited(arguments);
if(!this.popup){
var node=_288("[widgetId]",this.dropDownContainer)[0];
this.popup=_289.byNode(node);
}
this.ownerDocumentBody.appendChild(this.popup.domNode);
this.popup.startup();
this.popup.domNode.style.display="none";
if(this.arrowWrapper){
_287.set(this.arrowWrapper,"visibility","");
}
this.focusNode.setAttribute("aria-haspopup","true");
},destroyDescendants:function(_28c){
if(this.popup){
if(!this.popup._destroyed){
this.popup.destroyRecursive(_28c);
}
delete this.popup;
}
this.inherited(arguments);
}});
});
},"dijit/_TimePicker":function(){
define(["dojo/_base/array","dojo/date","dojo/date/locale","dojo/date/stamp","dojo/_base/declare","dojo/dom-class","dojo/dom-construct","dojo/_base/event","dojo/_base/kernel","dojo/keys","dojo/_base/lang","dojo/sniff","dojo/query","dojo/mouse","./typematic","./_Widget","./_TemplatedMixin","./form/_FormValueWidget","dojo/text!./templates/TimePicker.html"],function(_28d,_28e,_28f,_290,_291,_292,_293,_294,_295,keys,lang,has,_296,_297,_298,_299,_29a,_29b,_29c){
var _29d=_291("dijit._TimePicker",[_299,_29a],{templateString:_29c,baseClass:"dijitTimePicker",clickableIncrement:"T00:15:00",visibleIncrement:"T01:00:00",visibleRange:"T05:00:00",value:new Date(),_visibleIncrement:2,_clickableIncrement:1,_totalIncrements:10,constraints:{},serialize:_290.toISOString,setValue:function(_29e){
_295.deprecated("dijit._TimePicker:setValue() is deprecated.  Use set('value', ...) instead.","","2.0");
this.set("value",_29e);
},_setValueAttr:function(date){
this._set("value",date);
this._showText();
},_setFilterStringAttr:function(val){
this._set("filterString",val);
this._showText();
},isDisabledDate:function(){
return false;
},_getFilteredNodes:function(_29f,_2a0,_2a1,_2a2){
var _2a3=[],_2a4=_2a2?_2a2.date:this._refDate,n,i=_29f,max=this._maxIncrement+Math.abs(i),chk=_2a1?-1:1,dec=_2a1?1:0,inc=1-dec;
do{
i-=dec;
n=this._createOption(i);
if(n){
if((_2a1&&n.date>_2a4)||(!_2a1&&n.date<_2a4)){
break;
}
_2a3[_2a1?"unshift":"push"](n);
_2a4=n.date;
}
i+=inc;
}while(_2a3.length<_2a0&&(i*chk)<max);
return _2a3;
},_showText:function(){
var _2a5=_290.fromISOString;
this.timeMenu.innerHTML="";
this._clickableIncrementDate=_2a5(this.clickableIncrement);
this._visibleIncrementDate=_2a5(this.visibleIncrement);
this._visibleRangeDate=_2a5(this.visibleRange);
var _2a6=function(date){
return date.getHours()*60*60+date.getMinutes()*60+date.getSeconds();
},_2a7=_2a6(this._clickableIncrementDate),_2a8=_2a6(this._visibleIncrementDate),_2a9=_2a6(this._visibleRangeDate),time=(this.value||this.currentFocus).getTime();
this._refDate=new Date(time-time%(_2a7*1000));
this._refDate.setFullYear(1970,0,1);
this._clickableIncrement=1;
this._totalIncrements=_2a9/_2a7;
this._visibleIncrement=_2a8/_2a7;
this._maxIncrement=(60*60*24)/_2a7;
var _2aa=Math.min(this._totalIncrements,10),_2ab=this._getFilteredNodes(0,(_2aa>>1)+1,false),_2ac=[],_2ad=_2aa-_2ab.length,_2ae=this._getFilteredNodes(0,_2ad,true,_2ab[0]);
if(_2ae.length<_2ad&&_2ab.length>0){
_2ac=this._getFilteredNodes(_2ab.length,_2ad-_2ae.length,false,_2ab[_2ab.length-1]);
}
_28d.forEach(_2ae.concat(_2ab,_2ac),function(n){
this.timeMenu.appendChild(n);
},this);
},constructor:function(){
this.constraints={};
},postMixInProperties:function(){
this.inherited(arguments);
this._setConstraintsAttr(this.constraints);
},_setConstraintsAttr:function(_2af){
lang.mixin(this,_2af);
if(!_2af.locale){
_2af.locale=this.lang;
}
},postCreate:function(){
this.connect(this.timeMenu,_297.wheel,"_mouseWheeled");
this.own(_298.addMouseListener(this.upArrow,this,"_onArrowUp",33,250),_298.addMouseListener(this.downArrow,this,"_onArrowDown",33,250));
this.inherited(arguments);
},_buttonMouse:function(e){
_292.toggle(e.currentTarget,e.currentTarget==this.upArrow?"dijitUpArrowHover":"dijitDownArrowHover",e.type=="mouseenter"||e.type=="mouseover");
},_createOption:function(_2b0){
var date=new Date(this._refDate);
var _2b1=this._clickableIncrementDate;
date.setTime(date.getTime()+_2b1.getHours()*_2b0*3600000+_2b1.getMinutes()*_2b0*60000+_2b1.getSeconds()*_2b0*1000);
if(this.constraints.selector=="time"){
date.setFullYear(1970,0,1);
}
var _2b2=_28f.format(date,this.constraints);
if(this.filterString&&_2b2.toLowerCase().indexOf(this.filterString)!==0){
return null;
}
var div=this.ownerDocument.createElement("div");
div.className=this.baseClass+"Item";
div.date=date;
div.idx=_2b0;
_293.create("div",{"class":this.baseClass+"ItemInner",innerHTML:_2b2},div);
if(_2b0%this._visibleIncrement<1&&_2b0%this._visibleIncrement>-1){
_292.add(div,this.baseClass+"Marker");
}else{
if(!(_2b0%this._clickableIncrement)){
_292.add(div,this.baseClass+"Tick");
}
}
if(this.isDisabledDate(date)){
_292.add(div,this.baseClass+"ItemDisabled");
}
if(this.value&&!_28e.compare(this.value,date,this.constraints.selector)){
div.selected=true;
_292.add(div,this.baseClass+"ItemSelected");
if(_292.contains(div,this.baseClass+"Marker")){
_292.add(div,this.baseClass+"MarkerSelected");
}else{
_292.add(div,this.baseClass+"TickSelected");
}
this._highlightOption(div,true);
}
return div;
},_onOptionSelected:function(tgt){
var _2b3=tgt.target.date||tgt.target.parentNode.date;
if(!_2b3||this.isDisabledDate(_2b3)){
return;
}
this._highlighted_option=null;
this.set("value",_2b3);
this.onChange(_2b3);
},onChange:function(){
},_highlightOption:function(node,_2b4){
if(!node){
return;
}
if(_2b4){
if(this._highlighted_option){
this._highlightOption(this._highlighted_option,false);
}
this._highlighted_option=node;
}else{
if(this._highlighted_option!==node){
return;
}else{
this._highlighted_option=null;
}
}
_292.toggle(node,this.baseClass+"ItemHover",_2b4);
if(_292.contains(node,this.baseClass+"Marker")){
_292.toggle(node,this.baseClass+"MarkerHover",_2b4);
}else{
_292.toggle(node,this.baseClass+"TickHover",_2b4);
}
},onmouseover:function(e){
this._keyboardSelected=null;
var tgr=(e.target.parentNode===this.timeMenu)?e.target:e.target.parentNode;
if(!_292.contains(tgr,this.baseClass+"Item")){
return;
}
this._highlightOption(tgr,true);
},onmouseout:function(e){
this._keyboardSelected=null;
var tgr=(e.target.parentNode===this.timeMenu)?e.target:e.target.parentNode;
this._highlightOption(tgr,false);
},_mouseWheeled:function(e){
this._keyboardSelected=null;
_294.stop(e);
this[(e.wheelDelta>0?"_onArrowUp":"_onArrowDown")]();
},_onArrowUp:function(_2b5){
if(_2b5===-1){
_292.remove(this.upArrow,"dijitUpArrowActive");
return;
}else{
if(_2b5===0){
_292.add(this.upArrow,"dijitUpArrowActive");
}
}
if(!this.timeMenu.childNodes.length){
return;
}
var _2b6=this.timeMenu.childNodes[0].idx;
var divs=this._getFilteredNodes(_2b6,1,true,this.timeMenu.childNodes[0]);
if(divs.length){
this.timeMenu.removeChild(this.timeMenu.childNodes[this.timeMenu.childNodes.length-1]);
this.timeMenu.insertBefore(divs[0],this.timeMenu.childNodes[0]);
}
},_onArrowDown:function(_2b7){
if(_2b7===-1){
_292.remove(this.downArrow,"dijitDownArrowActive");
return;
}else{
if(_2b7===0){
_292.add(this.downArrow,"dijitDownArrowActive");
}
}
if(!this.timeMenu.childNodes.length){
return;
}
var _2b8=this.timeMenu.childNodes[this.timeMenu.childNodes.length-1].idx+1;
var divs=this._getFilteredNodes(_2b8,1,false,this.timeMenu.childNodes[this.timeMenu.childNodes.length-1]);
if(divs.length){
this.timeMenu.removeChild(this.timeMenu.childNodes[0]);
this.timeMenu.appendChild(divs[0]);
}
},handleKey:function(e){
if(e.keyCode==keys.DOWN_ARROW||e.keyCode==keys.UP_ARROW){
_294.stop(e);
if(this._highlighted_option&&!this._highlighted_option.parentNode){
this._highlighted_option=null;
}
var _2b9=this.timeMenu,tgt=this._highlighted_option||_296("."+this.baseClass+"ItemSelected",_2b9)[0];
if(!tgt){
tgt=_2b9.childNodes[0];
}else{
if(_2b9.childNodes.length){
if(e.keyCode==keys.DOWN_ARROW&&!tgt.nextSibling){
this._onArrowDown();
}else{
if(e.keyCode==keys.UP_ARROW&&!tgt.previousSibling){
this._onArrowUp();
}
}
if(e.keyCode==keys.DOWN_ARROW){
tgt=tgt.nextSibling;
}else{
tgt=tgt.previousSibling;
}
}
}
this._highlightOption(tgt,true);
this._keyboardSelected=tgt;
return false;
}else{
if(e.keyCode==keys.ENTER||e.keyCode===keys.TAB){
if(!this._keyboardSelected&&e.keyCode===keys.TAB){
return true;
}
if(this._highlighted_option){
this._onOptionSelected({target:this._highlighted_option});
}
return e.keyCode===keys.TAB;
}
}
return undefined;
}});
return _29d;
});
},"dijit/form/RadioButton":function(){
define("dijit/form/RadioButton",["dojo/_base/declare","./CheckBox","./_RadioButtonMixin"],function(_2ba,_2bb,_2bc){
return _2ba("dijit.form.RadioButton",[_2bb,_2bc],{baseClass:"dijitRadio"});
});
},"url:dijit/form/templates/HorizontalSlider.html":"<table class=\"dijit dijitReset dijitSlider dijitSliderH\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" rules=\"none\" data-dojo-attach-event=\"onkeypress:_onKeyPress,onkeyup:_onKeyUp\"\n\trole=\"presentation\"\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t\t><td data-dojo-attach-point=\"topDecoration\" class=\"dijitReset dijitSliderDecoration dijitSliderDecorationT dijitSliderDecorationH\"></td\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerH\"\n\t\t\t><div class=\"dijitSliderDecrementIconH\" style=\"display:none\" data-dojo-attach-point=\"decrementButton\"><span class=\"dijitSliderButtonInner\">-</span></div\n\t\t></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperH dijitSliderLeftBumper\" data-dojo-attach-event=\"press:_onClkDecBumper\"></div\n\t\t></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><input data-dojo-attach-point=\"valueNode\" type=\"hidden\" ${!nameAttrSetting}\n\t\t\t/><div class=\"dijitReset dijitSliderBarContainerH\" role=\"presentation\" data-dojo-attach-point=\"sliderBarContainer\"\n\t\t\t\t><div role=\"presentation\" data-dojo-attach-point=\"progressBar\" class=\"dijitSliderBar dijitSliderBarH dijitSliderProgressBar dijitSliderProgressBarH\" data-dojo-attach-event=\"press:_onBarClick\"\n\t\t\t\t\t><div class=\"dijitSliderMoveable dijitSliderMoveableH\"\n\t\t\t\t\t\t><div data-dojo-attach-point=\"sliderHandle,focusNode\" class=\"dijitSliderImageHandle dijitSliderImageHandleH\" data-dojo-attach-event=\"press:_onHandleClick\" role=\"slider\"></div\n\t\t\t\t\t></div\n\t\t\t\t></div\n\t\t\t\t><div role=\"presentation\" data-dojo-attach-point=\"remainingBar\" class=\"dijitSliderBar dijitSliderBarH dijitSliderRemainingBar dijitSliderRemainingBarH\" data-dojo-attach-event=\"press:_onBarClick\"></div\n\t\t\t></div\n\t\t></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperH dijitSliderRightBumper\" data-dojo-attach-event=\"press:_onClkIncBumper\"></div\n\t\t></td\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerH\"\n\t\t\t><div class=\"dijitSliderIncrementIconH\" style=\"display:none\" data-dojo-attach-point=\"incrementButton\"><span class=\"dijitSliderButtonInner\">+</span></div\n\t\t></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t\t><td data-dojo-attach-point=\"containerNode,bottomDecoration\" class=\"dijitReset dijitSliderDecoration dijitSliderDecorationB dijitSliderDecorationH\"></td\n\t\t><td class=\"dijitReset\" colspan=\"2\"></td\n\t></tr\n></table>\n","url:dijit/templates/TimePicker.html":"<div id=\"widget_${id}\" class=\"dijitMenu\"\n    ><div data-dojo-attach-point=\"upArrow\" class=\"dijitButtonNode dijitUpArrowButton\" data-dojo-attach-event=\"onmouseenter:_buttonMouse,onmouseleave:_buttonMouse\"\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonInner\" role=\"presentation\">&#160;</div\n\t\t><div class=\"dijitArrowButtonChar\">&#9650;</div></div\n    ><div data-dojo-attach-point=\"timeMenu,focusNode\" data-dojo-attach-event=\"onclick:_onOptionSelected,onmouseover,onmouseout\"></div\n    ><div data-dojo-attach-point=\"downArrow\" class=\"dijitButtonNode dijitDownArrowButton\" data-dojo-attach-event=\"onmouseenter:_buttonMouse,onmouseleave:_buttonMouse\"\n\t\t><div class=\"dijitReset dijitInline dijitArrowButtonInner\" role=\"presentation\">&#160;</div\n\t\t><div class=\"dijitArrowButtonChar\">&#9660;</div></div\n></div>\n","dijit/InlineEditBox":function(){
define(["require","dojo/_base/array","dojo/_base/declare","dojo/dom-attr","dojo/dom-class","dojo/dom-construct","dojo/dom-style","dojo/_base/event","dojo/i18n","dojo/_base/kernel","dojo/keys","dojo/_base/lang","dojo/sniff","dojo/when","./focus","./_Widget","./_TemplatedMixin","./_WidgetsInTemplateMixin","./_Container","./form/Button","./form/_TextBoxMixin","./form/TextBox","dojo/text!./templates/InlineEditBox.html","dojo/i18n!./nls/common"],function(_2bd,_2be,_2bf,_2c0,_2c1,_2c2,_2c3,_2c4,i18n,_2c5,keys,lang,has,when,fm,_2c6,_2c7,_2c8,_2c9,_2ca,_2cb,_2cc,_2cd){
var _2ce=_2bf("dijit._InlineEditor",[_2c6,_2c7,_2c8],{templateString:_2cd,postMixInProperties:function(){
this.inherited(arguments);
this.messages=i18n.getLocalization("dijit","common",this.lang);
_2be.forEach(["buttonSave","buttonCancel"],function(prop){
if(!this[prop]){
this[prop]=this.messages[prop];
}
},this);
},buildRendering:function(){
this.inherited(arguments);
var Cls=typeof this.editor=="string"?(lang.getObject(this.editor)||_2bd(this.editor)):this.editor;
var _2cf=this.sourceStyle,_2d0="line-height:"+_2cf.lineHeight+";",_2d1=_2c3.getComputedStyle(this.domNode);
_2be.forEach(["Weight","Family","Size","Style"],function(prop){
var _2d2=_2cf["font"+prop],_2d3=_2d1["font"+prop];
if(_2d3!=_2d2){
_2d0+="font-"+prop+":"+_2cf["font"+prop]+";";
}
},this);
_2be.forEach(["marginTop","marginBottom","marginLeft","marginRight","position","left","top","right","bottom","float","clear","display"],function(prop){
this.domNode.style[prop]=_2cf[prop];
},this);
var _2d4=this.inlineEditBox.width;
if(_2d4=="100%"){
_2d0+="width:100%;";
this.domNode.style.display="block";
}else{
_2d0+="width:"+(_2d4+(Number(_2d4)==_2d4?"px":""))+";";
}
var _2d5=lang.delegate(this.inlineEditBox.editorParams,{style:_2d0,dir:this.dir,lang:this.lang,textDir:this.textDir});
_2d5["displayedValue" in Cls.prototype?"displayedValue":"value"]=this.value;
this.editWidget=new Cls(_2d5,this.editorPlaceholder);
if(this.inlineEditBox.autoSave){
_2c2.destroy(this.buttonContainer);
}
},postCreate:function(){
this.inherited(arguments);
var ew=this.editWidget;
if(this.inlineEditBox.autoSave){
this.connect(ew,"onChange","_onChange");
this.connect(ew,"onKeyPress","_onKeyPress");
}else{
if("intermediateChanges" in ew){
ew.set("intermediateChanges",true);
this.connect(ew,"onChange","_onIntermediateChange");
this.saveButton.set("disabled",true);
}
}
},startup:function(){
this.editWidget.startup();
this.inherited(arguments);
},_onIntermediateChange:function(){
this.saveButton.set("disabled",(this.getValue()==this._resetValue)||!this.enableSave());
},destroy:function(){
this.editWidget.destroy(true);
this.inherited(arguments);
},getValue:function(){
var ew=this.editWidget;
return String(ew.get("displayedValue" in ew?"displayedValue":"value"));
},_onKeyPress:function(e){
if(this.inlineEditBox.autoSave&&this.inlineEditBox.editing){
if(e.altKey||e.ctrlKey){
return;
}
if(e.charOrCode==keys.ESCAPE){
_2c4.stop(e);
this.cancel(true);
}else{
if(e.charOrCode==keys.ENTER&&e.target.tagName=="INPUT"){
_2c4.stop(e);
this._onChange();
}
}
}
},_onBlur:function(){
this.inherited(arguments);
if(this.inlineEditBox.autoSave&&this.inlineEditBox.editing){
if(this.getValue()==this._resetValue){
this.cancel(false);
}else{
if(this.enableSave()){
this.save(false);
}
}
}
},_onChange:function(){
if(this.inlineEditBox.autoSave&&this.inlineEditBox.editing&&this.enableSave()){
fm.focus(this.inlineEditBox.displayNode);
}
},enableSave:function(){
return this.editWidget.isValid?this.editWidget.isValid():true;
},focus:function(){
this.editWidget.focus();
if(this.editWidget.focusNode){
fm._onFocusNode(this.editWidget.focusNode);
if(this.editWidget.focusNode.tagName=="INPUT"){
this.defer(function(){
_2cb.selectInputText(this.editWidget.focusNode);
});
}
}
}});
var _2d6=_2bf("dijit.InlineEditBox",_2c6,{editing:false,autoSave:true,buttonSave:"",buttonCancel:"",renderAsHtml:false,editor:_2cc,editorWrapper:_2ce,editorParams:{},disabled:false,onChange:function(){
},onCancel:function(){
},width:"100%",value:"",noValueIndicator:has("ie")<=6?"<span style='font-family: wingdings; text-decoration: underline;'>&#160;&#160;&#160;&#160;&#x270d;&#160;&#160;&#160;&#160;</span>":"<span style='text-decoration: underline;'>&#160;&#160;&#160;&#160;&#x270d;&#160;&#160;&#160;&#160;</span>",constructor:function(){
this.editorParams={};
},postMixInProperties:function(){
this.inherited(arguments);
this.displayNode=this.srcNodeRef;
var _2d7={ondijitclick:"_onClick",onmouseover:"_onMouseOver",onmouseout:"_onMouseOut",onfocus:"_onMouseOver",onblur:"_onMouseOut"};
for(var name in _2d7){
this.connect(this.displayNode,name,_2d7[name]);
}
this.displayNode.setAttribute("role","button");
if(!this.displayNode.getAttribute("tabIndex")){
this.displayNode.setAttribute("tabIndex",0);
}
if(!this.value&&!("value" in this.params)){
this.value=lang.trim(this.renderAsHtml?this.displayNode.innerHTML:(this.displayNode.innerText||this.displayNode.textContent||""));
}
if(!this.value){
this.displayNode.innerHTML=this.noValueIndicator;
}
_2c1.add(this.displayNode,"dijitInlineEditBoxDisplayMode");
},setDisabled:function(_2d8){
_2c5.deprecated("dijit.InlineEditBox.setDisabled() is deprecated.  Use set('disabled', bool) instead.","","2.0");
this.set("disabled",_2d8);
},_setDisabledAttr:function(_2d9){
this.domNode.setAttribute("aria-disabled",_2d9?"true":"false");
if(_2d9){
this.displayNode.removeAttribute("tabIndex");
}else{
this.displayNode.setAttribute("tabIndex",0);
}
_2c1.toggle(this.displayNode,"dijitInlineEditBoxDisplayModeDisabled",_2d9);
this._set("disabled",_2d9);
},_onMouseOver:function(){
if(!this.disabled){
_2c1.add(this.displayNode,"dijitInlineEditBoxDisplayModeHover");
}
},_onMouseOut:function(){
_2c1.remove(this.displayNode,"dijitInlineEditBoxDisplayModeHover");
},_onClick:function(e){
if(this.disabled){
return;
}
if(e){
_2c4.stop(e);
}
this._onMouseOut();
this.defer("edit");
},edit:function(){
if(this.disabled||this.editing){
return;
}
this._set("editing",true);
this._savedTabIndex=_2c0.get(this.displayNode,"tabIndex")||"0";
if(this.wrapperWidget){
var ew=this.wrapperWidget.editWidget;
ew.set("displayedValue" in ew?"displayedValue":"value",this.value);
}else{
var _2da=_2c2.create("span",null,this.domNode,"before");
var Ewc=typeof this.editorWrapper=="string"?lang.getObject(this.editorWrapper):this.editorWrapper;
this.wrapperWidget=new Ewc({value:this.value,buttonSave:this.buttonSave,buttonCancel:this.buttonCancel,dir:this.dir,lang:this.lang,tabIndex:this._savedTabIndex,editor:this.editor,inlineEditBox:this,sourceStyle:_2c3.getComputedStyle(this.displayNode),save:lang.hitch(this,"save"),cancel:lang.hitch(this,"cancel"),textDir:this.textDir},_2da);
if(!this.wrapperWidget._started){
this.wrapperWidget.startup();
}
if(!this._started){
this.startup();
}
}
var ww=this.wrapperWidget;
_2c1.add(this.displayNode,"dijitOffScreen");
_2c1.remove(ww.domNode,"dijitOffScreen");
_2c3.set(ww.domNode,{visibility:"visible"});
_2c0.set(this.displayNode,"tabIndex","-1");
when(ww.editWidget.onLoadDeferred,lang.hitch(ww,function(){
this.defer(function(){
this.focus();
this._resetValue=this.getValue();
});
}));
},_onBlur:function(){
this.inherited(arguments);
if(!this.editing){
}
},destroy:function(){
if(this.wrapperWidget&&!this.wrapperWidget._destroyed){
this.wrapperWidget.destroy();
delete this.wrapperWidget;
}
this.inherited(arguments);
},_showText:function(_2db){
var ww=this.wrapperWidget;
_2c3.set(ww.domNode,{visibility:"hidden"});
_2c1.add(ww.domNode,"dijitOffScreen");
_2c1.remove(this.displayNode,"dijitOffScreen");
_2c0.set(this.displayNode,"tabIndex",this._savedTabIndex);
if(_2db){
fm.focus(this.displayNode);
}
},save:function(_2dc){
if(this.disabled||!this.editing){
return;
}
this._set("editing",false);
var ww=this.wrapperWidget;
var _2dd=ww.getValue();
this.set("value",_2dd);
this._showText(_2dc);
},setValue:function(val){
_2c5.deprecated("dijit.InlineEditBox.setValue() is deprecated.  Use set('value', ...) instead.","","2.0");
return this.set("value",val);
},_setValueAttr:function(val){
val=lang.trim(val);
var _2de=this.renderAsHtml?val:val.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;").replace(/\n/g,"<br>");
this.displayNode.innerHTML=_2de||this.noValueIndicator;
this._set("value",val);
if(this._started){
this.defer(function(){
this.onChange(val);
});
}
if(this.textDir=="auto"){
this.applyTextDir(this.displayNode,this.displayNode.innerText);
}
},getValue:function(){
_2c5.deprecated("dijit.InlineEditBox.getValue() is deprecated.  Use get('value') instead.","","2.0");
return this.get("value");
},cancel:function(_2df){
if(this.disabled||!this.editing){
return;
}
this._set("editing",false);
this.defer("onCancel");
this._showText(_2df);
},_setTextDirAttr:function(_2e0){
if(!this._created||this.textDir!=_2e0){
this._set("textDir",_2e0);
this.applyTextDir(this.displayNode,this.displayNode.innerText);
this.displayNode.align=this.dir=="rtl"?"right":"left";
}
}});
_2d6._InlineEditor=_2ce;
return _2d6;
});
},"dojo/dnd/autoscroll":function(){
define(["../_base/lang","../sniff","../_base/window","../dom-geometry","../dom-style","../window"],function(lang,has,win,_2e1,_2e2,_2e3){
var _2e4={};
lang.setObject("dojo.dnd.autoscroll",_2e4);
_2e4.getViewport=_2e3.getBox;
_2e4.V_TRIGGER_AUTOSCROLL=32;
_2e4.H_TRIGGER_AUTOSCROLL=32;
_2e4.V_AUTOSCROLL_VALUE=16;
_2e4.H_AUTOSCROLL_VALUE=16;
var _2e5,doc=win.doc,_2e6=Infinity,_2e7=Infinity;
_2e4.autoScrollStart=function(d){
doc=d;
_2e5=_2e3.getBox(doc);
var html=win.body(doc).parentNode;
_2e6=Math.max(html.scrollHeight-_2e5.h,0);
_2e7=Math.max(html.scrollWidth-_2e5.w,0);
};
_2e4.autoScroll=function(e){
var v=_2e5||_2e3.getBox(doc),html=win.body(doc).parentNode,dx=0,dy=0;
if(e.clientX<_2e4.H_TRIGGER_AUTOSCROLL){
dx=-_2e4.H_AUTOSCROLL_VALUE;
}else{
if(e.clientX>v.w-_2e4.H_TRIGGER_AUTOSCROLL){
dx=Math.min(_2e4.H_AUTOSCROLL_VALUE,_2e7-html.scrollLeft);
}
}
if(e.clientY<_2e4.V_TRIGGER_AUTOSCROLL){
dy=-_2e4.V_AUTOSCROLL_VALUE;
}else{
if(e.clientY>v.h-_2e4.V_TRIGGER_AUTOSCROLL){
dy=Math.min(_2e4.V_AUTOSCROLL_VALUE,_2e6-html.scrollTop);
}
}
window.scrollBy(dx,dy);
};
_2e4._validNodes={"div":1,"p":1,"td":1};
_2e4._validOverflow={"auto":1,"scroll":1};
_2e4.autoScrollNodes=function(e){
var b,t,w,h,rx,ry,dx=0,dy=0,_2e8,_2e9;
for(var n=e.target;n;){
if(n.nodeType==1&&(n.tagName.toLowerCase() in _2e4._validNodes)){
var s=_2e2.getComputedStyle(n),_2ea=(s.overflow.toLowerCase() in _2e4._validOverflow),_2eb=(s.overflowX.toLowerCase() in _2e4._validOverflow),_2ec=(s.overflowY.toLowerCase() in _2e4._validOverflow);
if(_2ea||_2eb||_2ec){
b=_2e1.getContentBox(n,s);
t=_2e1.position(n,true);
}
if(_2ea||_2eb){
w=Math.min(_2e4.H_TRIGGER_AUTOSCROLL,b.w/2);
rx=e.pageX-t.x;
if(has("webkit")||has("opera")){
rx+=win.body().scrollLeft;
}
dx=0;
if(rx>0&&rx<b.w){
if(rx<w){
dx=-w;
}else{
if(rx>b.w-w){
dx=w;
}
}
_2e8=n.scrollLeft;
n.scrollLeft=n.scrollLeft+dx;
}
}
if(_2ea||_2ec){
h=Math.min(_2e4.V_TRIGGER_AUTOSCROLL,b.h/2);
ry=e.pageY-t.y;
if(has("webkit")||has("opera")){
ry+=win.body().scrollTop;
}
dy=0;
if(ry>0&&ry<b.h){
if(ry<h){
dy=-h;
}else{
if(ry>b.h-h){
dy=h;
}
}
_2e9=n.scrollTop;
n.scrollTop=n.scrollTop+dy;
}
}
if(dx||dy){
return;
}
}
try{
n=n.parentNode;
}
catch(x){
n=null;
}
}
_2e4.autoScroll(e);
};
return _2e4;
});
},"dijit/form/_RadioButtonMixin":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dom-attr","dojo/_base/event","dojo/_base/lang","dojo/query","../registry"],function(_2ed,_2ee,_2ef,_2f0,lang,_2f1,_2f2){
return _2ee("dijit.form._RadioButtonMixin",null,{type:"radio",_getRelatedWidgets:function(){
var ary=[];
_2f1("input[type=radio]",this.focusNode.form||this.ownerDocument).forEach(lang.hitch(this,function(_2f3){
if(_2f3.name==this.name&&_2f3.form==this.focusNode.form){
var _2f4=_2f2.getEnclosingWidget(_2f3);
if(_2f4){
ary.push(_2f4);
}
}
}));
return ary;
},_setCheckedAttr:function(_2f5){
this.inherited(arguments);
if(!this._created){
return;
}
if(_2f5){
_2ed.forEach(this._getRelatedWidgets(),lang.hitch(this,function(_2f6){
if(_2f6!=this&&_2f6.checked){
_2f6.set("checked",false);
}
}));
}
},_getSubmitValue:function(_2f7){
return _2f7===null?"on":_2f7;
},_onClick:function(e){
if(this.checked||this.disabled){
_2f0.stop(e);
return false;
}
if(this.readOnly){
_2f0.stop(e);
_2ed.forEach(this._getRelatedWidgets(),lang.hitch(this,function(_2f8){
_2ef.set(this.focusNode||this.domNode,"checked",_2f8.checked);
}));
return false;
}
return this.inherited(arguments);
}});
});
},"url:dijit/templates/TreeNode.html":"<div class=\"dijitTreeNode\" role=\"presentation\"\n\t><div data-dojo-attach-point=\"rowNode\" class=\"dijitTreeRow dijitInline\" role=\"presentation\"\n\t\t><div data-dojo-attach-point=\"indentNode\" class=\"dijitInline\"></div\n\t\t><img src=\"${_blankGif}\" alt=\"\" data-dojo-attach-point=\"expandoNode\" class=\"dijitTreeExpando\" role=\"presentation\"\n\t\t/><span data-dojo-attach-point=\"expandoNodeText\" class=\"dijitExpandoText\" role=\"presentation\"\n\t\t></span\n\t\t><span data-dojo-attach-point=\"contentNode\"\n\t\t\tclass=\"dijitTreeContent\" role=\"presentation\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" data-dojo-attach-point=\"iconNode\" class=\"dijitIcon dijitTreeIcon\" role=\"presentation\"\n\t\t\t/><span data-dojo-attach-point=\"labelNode\" class=\"dijitTreeLabel\" role=\"treeitem\" tabindex=\"-1\" aria-selected=\"false\"></span>\n\t\t</span\n\t></div>\n\t<div data-dojo-attach-point=\"containerNode\" class=\"dijitTreeContainer\" role=\"presentation\" style=\"display: none;\"></div>\n</div>\n","dojo/dnd/TimedMoveable":function(){
define(["../_base/declare","./Moveable"],function(_2f9,_2fa){
var _2fb=_2fa.prototype.onMove;
return _2f9("dojo.dnd.TimedMoveable",_2fa,{timeout:40,constructor:function(node,_2fc){
if(!_2fc){
_2fc={};
}
if(_2fc.timeout&&typeof _2fc.timeout=="number"&&_2fc.timeout>=0){
this.timeout=_2fc.timeout;
}
},onMoveStop:function(_2fd){
if(_2fd._timer){
clearTimeout(_2fd._timer);
_2fb.call(this,_2fd,_2fd._leftTop);
}
_2fa.prototype.onMoveStop.apply(this,arguments);
},onMove:function(_2fe,_2ff){
_2fe._leftTop=_2ff;
if(!_2fe._timer){
var _300=this;
_2fe._timer=setTimeout(function(){
_2fe._timer=null;
_2fb.call(_300,_2fe,_2fe._leftTop);
},this.timeout);
}
}});
});
},"dijit/layout/LinkPane":function(){
define(["./ContentPane","../_TemplatedMixin","dojo/_base/declare"],function(_301,_302,_303){
return _303("dijit.layout.LinkPane",[_301,_302],{templateString:"<div class=\"dijitLinkPane\" data-dojo-attach-point=\"containerNode\"></div>",postMixInProperties:function(){
if(this.srcNodeRef){
this.title+=this.srcNodeRef.innerHTML;
}
this.inherited(arguments);
},_fillContent:function(){
}});
});
},"dijit/form/_ListMouseMixin":function(){
define(["dojo/_base/declare","dojo/mouse","dojo/on","dojo/touch","./_ListBase"],function(_304,_305,on,_306,_307){
return _304("dijit.form._ListMouseMixin",_307,{postCreate:function(){
this.inherited(arguments);
this.own(on(this.domNode,_306.press,function(evt){
evt.preventDefault();
}));
this._listConnect(_306.press,"_onMouseDown");
this._listConnect(_306.release,"_onMouseUp");
this._listConnect(_305.enter,"_onMouseOver");
this._listConnect(_305.leave,"_onMouseOut");
},_onMouseDown:function(evt,_308){
if(this._hoveredNode){
this.onUnhover(this._hoveredNode);
this._hoveredNode=null;
}
this._isDragging=true;
this._setSelectedAttr(_308);
},_onMouseUp:function(evt,_309){
this._isDragging=false;
var _30a=this.selected;
var _30b=this._hoveredNode;
if(_30a&&_309==_30a){
this.onClick(_30a);
}else{
if(_30b&&_309==_30b){
this._setSelectedAttr(_30b);
this.onClick(_30b);
}
}
},_onMouseOut:function(evt,_30c){
if(this._hoveredNode){
this.onUnhover(this._hoveredNode);
this._hoveredNode=null;
}
if(this._isDragging){
this._cancelDrag=(new Date()).getTime()+1000;
}
},_onMouseOver:function(evt,_30d){
if(this._cancelDrag){
var time=(new Date()).getTime();
if(time>this._cancelDrag){
this._isDragging=false;
}
this._cancelDrag=null;
}
this._hoveredNode=_30d;
this.onHover(_30d);
if(this._isDragging){
this._setSelectedAttr(_30d);
}
}});
});
},"url:dijit/templates/Tree.html":"<div class=\"dijitTree dijitTreeContainer\" role=\"tree\">\n\t<div class=\"dijitInline dijitTreeIndent\" style=\"position: absolute; top: -9999px\" data-dojo-attach-point=\"indentDetector\"></div>\n</div>\n","dojo/cldr/monetary":function(){
define(["../_base/kernel","../_base/lang"],function(dojo,lang){
var _30e={};
lang.setObject("dojo.cldr.monetary",_30e);
_30e.getData=function(code){
var _30f={ADP:0,AFN:0,ALL:0,AMD:0,BHD:3,BIF:0,BYR:0,CLF:0,CLP:0,COP:0,CRC:0,DJF:0,ESP:0,GNF:0,GYD:0,HUF:0,IDR:0,IQD:0,IRR:3,ISK:0,ITL:0,JOD:3,JPY:0,KMF:0,KPW:0,KRW:0,KWD:3,LAK:0,LBP:0,LUF:0,LYD:3,MGA:0,MGF:0,MMK:0,MNT:0,MRO:0,MUR:0,OMR:3,PKR:0,PYG:0,RSD:0,RWF:0,SLL:0,SOS:0,STD:0,SYP:0,TMM:0,TND:3,TRL:0,TZS:0,UGX:0,UZS:0,VND:0,VUV:0,XAF:0,XOF:0,XPF:0,YER:0,ZMK:0,ZWD:0};
var _310={CHF:5};
var _311=_30f[code],_312=_310[code];
if(typeof _311=="undefined"){
_311=2;
}
if(typeof _312=="undefined"){
_312=0;
}
return {places:_311,round:_312};
};
return _30e;
});
},"dojo/cookie":function(){
define(["./_base/kernel","./regexp"],function(dojo,_313){
dojo.cookie=function(name,_314,_315){
var c=document.cookie,ret;
if(arguments.length==1){
var _316=c.match(new RegExp("(?:^|; )"+_313.escapeString(name)+"=([^;]*)"));
ret=_316?decodeURIComponent(_316[1]):undefined;
}else{
_315=_315||{};
var exp=_315.expires;
if(typeof exp=="number"){
var d=new Date();
d.setTime(d.getTime()+exp*24*60*60*1000);
exp=_315.expires=d;
}
if(exp&&exp.toUTCString){
_315.expires=exp.toUTCString();
}
_314=encodeURIComponent(_314);
var _317=name+"="+_314,_318;
for(_318 in _315){
_317+="; "+_318;
var _319=_315[_318];
if(_319!==true){
_317+="="+_319;
}
}
document.cookie=_317;
}
return ret;
};
dojo.cookie.isSupported=function(){
if(!("cookieEnabled" in navigator)){
this("__djCookieTest__","CookiesAllowed");
navigator.cookieEnabled=this("__djCookieTest__")=="CookiesAllowed";
if(navigator.cookieEnabled){
this("__djCookieTest__","",{expires:-1});
}
}
return navigator.cookieEnabled;
};
return dojo.cookie;
});
},"url:dijit/form/templates/DropDownBox.html":"<div class=\"dijit dijitReset dijitInline dijitLeft\"\n\tid=\"widget_${id}\"\n\trole=\"combobox\"\n\t><div class='dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer'\n\t\tdata-dojo-attach-point=\"_buttonNode, _popupStateNode\" role=\"presentation\"\n\t\t><input class=\"dijitReset dijitInputField dijitArrowButtonInner\" value=\"&#9660; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t${_buttonInputDisabled}\n\t/></div\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class='dijitReset dijitInputInner' ${!nameAttrSetting} type=\"text\" autocomplete=\"off\"\n\t\t\tdata-dojo-attach-point=\"textbox,focusNode\" role=\"textbox\" aria-haspopup=\"true\"\n\t/></div\n></div>\n","dijit/ProgressBar":function(){
define(["require","dojo/_base/declare","dojo/dom-class","dojo/_base/lang","dojo/number","./_Widget","./_TemplatedMixin","dojo/text!./templates/ProgressBar.html"],function(_31a,_31b,_31c,lang,_31d,_31e,_31f,_320){
return _31b("dijit.ProgressBar",[_31e,_31f],{progress:"0",value:"",maximum:100,places:0,indeterminate:false,label:"",name:"",templateString:_320,_indeterminateHighContrastImagePath:_31a.toUrl("./themes/a11y/indeterminate_progress.gif"),postMixInProperties:function(){
this.inherited(arguments);
if(!(this.params&&"value" in this.params)){
this.value=this.indeterminate?Infinity:this.progress;
}
},buildRendering:function(){
this.inherited(arguments);
this.indeterminateHighContrastImage.setAttribute("src",this._indeterminateHighContrastImagePath.toString());
this.update();
},update:function(_321){
lang.mixin(this,_321||{});
var tip=this.internalProgress,ap=this.domNode;
var _322=1;
if(this.indeterminate){
ap.removeAttribute("aria-valuenow");
ap.removeAttribute("aria-valuemin");
ap.removeAttribute("aria-valuemax");
}else{
if(String(this.progress).indexOf("%")!=-1){
_322=Math.min(parseFloat(this.progress)/100,1);
this.progress=_322*this.maximum;
}else{
this.progress=Math.min(this.progress,this.maximum);
_322=this.maximum?this.progress/this.maximum:0;
}
ap.setAttribute("aria-describedby",this.labelNode.id);
ap.setAttribute("aria-valuenow",this.progress);
ap.setAttribute("aria-valuemin",0);
ap.setAttribute("aria-valuemax",this.maximum);
}
this.labelNode.innerHTML=this.report(_322);
_31c.toggle(this.domNode,"dijitProgressBarIndeterminate",this.indeterminate);
tip.style.width=(_322*100)+"%";
this.onChange();
},_setValueAttr:function(v){
this._set("value",v);
if(v==Infinity){
this.update({indeterminate:true});
}else{
this.update({indeterminate:false,progress:v});
}
},_setLabelAttr:function(_323){
this._set("label",_323);
this.update();
},_setIndeterminateAttr:function(_324){
this.indeterminate=_324;
this.update();
},report:function(_325){
return this.label?this.label:(this.indeterminate?"&#160;":_31d.format(_325,{type:"percent",places:this.places,locale:this.lang}));
},onChange:function(){
}});
});
},"dijit/form/NumberTextBox":function(){
define(["dojo/_base/declare","dojo/_base/lang","dojo/number","./RangeBoundTextBox"],function(_326,lang,_327,_328){
var _329=_326("dijit.form.NumberTextBoxMixin",null,{pattern:_327.regexp,value:NaN,editOptions:{pattern:"#.######"},_formatter:_327.format,postMixInProperties:function(){
this.inherited(arguments);
this._set("type","text");
},_setConstraintsAttr:function(_32a){
var _32b=typeof _32a.places=="number"?_32a.places:0;
if(_32b){
_32b++;
}
if(typeof _32a.max!="number"){
_32a.max=9*Math.pow(10,15-_32b);
}
if(typeof _32a.min!="number"){
_32a.min=-9*Math.pow(10,15-_32b);
}
this.inherited(arguments,[_32a]);
if(this.focusNode&&this.focusNode.value&&!isNaN(this.value)){
this.set("value",this.value);
}
},_onFocus:function(){
if(this.disabled){
return;
}
var val=this.get("value");
if(typeof val=="number"&&!isNaN(val)){
var _32c=this.format(val,this.constraints);
if(_32c!==undefined){
this.textbox.value=_32c;
}
}
this.inherited(arguments);
},format:function(_32d,_32e){
var _32f=String(_32d);
if(typeof _32d!="number"){
return _32f;
}
if(isNaN(_32d)){
return "";
}
if(!("rangeCheck" in this&&this.rangeCheck(_32d,_32e))&&_32e.exponent!==false&&/\de[-+]?\d/i.test(_32f)){
return _32f;
}
if(this.editOptions&&this.focused){
_32e=lang.mixin({},_32e,this.editOptions);
}
return this._formatter(_32d,_32e);
},_parser:_327.parse,parse:function(_330,_331){
var v=this._parser(_330,lang.mixin({},_331,(this.editOptions&&this.focused)?this.editOptions:{}));
if(this.editOptions&&this.focused&&isNaN(v)){
v=this._parser(_330,_331);
}
return v;
},_getDisplayedValueAttr:function(){
var v=this.inherited(arguments);
return isNaN(v)?this.textbox.value:v;
},filter:function(_332){
return (_332==null||_332==="")?NaN:this.inherited(arguments);
},serialize:function(_333,_334){
return (typeof _333!="number"||isNaN(_333))?"":this.inherited(arguments);
},_setBlurValue:function(){
var val=lang.hitch(lang.mixin({},this,{focused:true}),"get")("value");
this._setValueAttr(val,true);
},_setValueAttr:function(_335,_336,_337){
if(_335!==undefined&&_337===undefined){
_337=String(_335);
if(typeof _335=="number"){
if(isNaN(_335)){
_337="";
}else{
if(("rangeCheck" in this&&this.rangeCheck(_335,this.constraints))||this.constraints.exponent===false||!/\de[-+]?\d/i.test(_337)){
_337=undefined;
}
}
}else{
if(!_335){
_337="";
_335=NaN;
}else{
_335=undefined;
}
}
}
this.inherited(arguments,[_335,_336,_337]);
},_getValueAttr:function(){
var v=this.inherited(arguments);
if(isNaN(v)&&this.textbox.value!==""){
if(this.constraints.exponent!==false&&/\de[-+]?\d/i.test(this.textbox.value)&&(new RegExp("^"+_327._realNumberRegexp(lang.mixin({},this.constraints))+"$").test(this.textbox.value))){
var n=Number(this.textbox.value);
return isNaN(n)?undefined:n;
}else{
return undefined;
}
}else{
return v;
}
},isValid:function(_338){
if(!this.focused||this._isEmpty(this.textbox.value)){
return this.inherited(arguments);
}else{
var v=this.get("value");
if(!isNaN(v)&&this.rangeCheck(v,this.constraints)){
if(this.constraints.exponent!==false&&/\de[-+]?\d/i.test(this.textbox.value)){
return true;
}else{
return this.inherited(arguments);
}
}else{
return false;
}
}
}});
var _339=_326("dijit.form.NumberTextBox",[_328,_329],{baseClass:"dijitTextBox dijitNumberTextBox"});
_339.Mixin=_329;
return _339;
});
},"dijit/form/TimeTextBox":function(){
define("dijit/form/TimeTextBox",["dojo/_base/declare","dojo/keys","dojo/_base/lang","../_TimePicker","./_DateTimeTextBox"],function(_33a,keys,lang,_33b,_33c){
return _33a("dijit.form.TimeTextBox",_33c,{baseClass:"dijitTextBox dijitComboBox dijitTimeTextBox",popupClass:_33b,_selector:"time",value:new Date(""),_onKey:function(evt){
if(this.disabled||this.readOnly){
return;
}
this.inherited(arguments);
switch(evt.keyCode){
case keys.ENTER:
case keys.TAB:
case keys.ESCAPE:
case keys.DOWN_ARROW:
case keys.UP_ARROW:
break;
default:
this.defer(function(){
var val=this.get("displayedValue");
this.filterString=(val&&!this.parse(val,this.constraints))?val.toLowerCase():"";
if(this._opened){
this.closeDropDown();
}
this.openDropDown();
});
}
}});
});
},"dijit/ColorPalette":function(){
define(["require","dojo/text!./templates/ColorPalette.html","./_Widget","./_TemplatedMixin","./_PaletteMixin","./hccss","dojo/i18n","dojo/_base/Color","dojo/_base/declare","dojo/dom-construct","dojo/string","dojo/i18n!dojo/nls/colors","dojo/colors"],function(_33d,_33e,_33f,_340,_341,has,i18n,_342,_343,_344,_345){
var _346=_343("dijit.ColorPalette",[_33f,_340,_341],{palette:"7x10",_palettes:{"7x10":[["white","seashell","cornsilk","lemonchiffon","lightyellow","palegreen","paleturquoise","lightcyan","lavender","plum"],["lightgray","pink","bisque","moccasin","khaki","lightgreen","lightseagreen","lightskyblue","cornflowerblue","violet"],["silver","lightcoral","sandybrown","orange","palegoldenrod","chartreuse","mediumturquoise","skyblue","mediumslateblue","orchid"],["gray","red","orangered","darkorange","yellow","limegreen","darkseagreen","royalblue","slateblue","mediumorchid"],["dimgray","crimson","chocolate","coral","gold","forestgreen","seagreen","blue","blueviolet","darkorchid"],["darkslategray","firebrick","saddlebrown","sienna","olive","green","darkcyan","mediumblue","darkslateblue","darkmagenta"],["black","darkred","maroon","brown","darkolivegreen","darkgreen","midnightblue","navy","indigo","purple"]],"3x4":[["white","lime","green","blue"],["silver","yellow","fuchsia","navy"],["gray","red","purple","black"]]},templateString:_33e,baseClass:"dijitColorPalette",_dyeFactory:function(_347,row,col,_348){
return new this._dyeClass(_347,row,col,_348);
},buildRendering:function(){
this.inherited(arguments);
this._dyeClass=_343(_346._Color,{palette:this.palette});
this._preparePalette(this._palettes[this.palette],i18n.getLocalization("dojo","colors",this.lang));
}});
_346._Color=_343("dijit._Color",_342,{template:"<span class='dijitInline dijitPaletteImg'>"+"<img src='${blankGif}' alt='${alt}' title='${title}' class='dijitColorPaletteSwatch' style='background-color: ${color}'/>"+"</span>",hcTemplate:"<span class='dijitInline dijitPaletteImg' style='position: relative; overflow: hidden; height: 12px; width: 14px;'>"+"<img src='${image}' alt='${alt}' title='${title}' style='position: absolute; left: ${left}px; top: ${top}px; ${size}'/>"+"</span>",_imagePaths:{"7x10":_33d.toUrl("./themes/a11y/colors7x10.png"),"3x4":_33d.toUrl("./themes/a11y/colors3x4.png")},constructor:function(_349,row,col,_34a){
this._title=_34a;
this._row=row;
this._col=col;
this.setColor(_342.named[_349]);
},getValue:function(){
return this.toHex();
},fillCell:function(cell,_34b){
var html=_345.substitute(has("highcontrast")?this.hcTemplate:this.template,{color:this.toHex(),blankGif:_34b,alt:this._title,title:this._title,image:this._imagePaths[this.palette].toString(),left:this._col*-20-5,top:this._row*-20-5,size:this.palette=="7x10"?"height: 145px; width: 206px":"height: 64px; width: 86px"});
_344.place(html,cell);
}});
return _346;
});
},"url:dijit/form/templates/Button.html":"<span class=\"dijit dijitReset dijitInline\" role=\"presentation\"\n\t><span class=\"dijitReset dijitInline dijitButtonNode\"\n\t\tdata-dojo-attach-event=\"ondijitclick:_onClick\" role=\"presentation\"\n\t\t><span class=\"dijitReset dijitStretch dijitButtonContents\"\n\t\t\tdata-dojo-attach-point=\"titleNode,focusNode\"\n\t\t\trole=\"button\" aria-labelledby=\"${id}_label\"\n\t\t\t><span class=\"dijitReset dijitInline dijitIcon\" data-dojo-attach-point=\"iconNode\"></span\n\t\t\t><span class=\"dijitReset dijitToggleButtonIconChar\">&#x25CF;</span\n\t\t\t><span class=\"dijitReset dijitInline dijitButtonText\"\n\t\t\t\tid=\"${id}_label\"\n\t\t\t\tdata-dojo-attach-point=\"containerNode\"\n\t\t\t></span\n\t\t></span\n\t></span\n\t><input ${!nameAttrSetting} type=\"${type}\" value=\"${value}\" class=\"dijitOffScreen\"\n\t\ttabIndex=\"-1\" role=\"presentation\" data-dojo-attach-point=\"valueNode\"\n/></span>\n","dijit/form/CurrencyTextBox":function(){
define(["dojo/currency","dojo/_base/declare","dojo/_base/lang","./NumberTextBox"],function(_34c,_34d,lang,_34e){
return _34d("dijit.form.CurrencyTextBox",_34e,{currency:"",baseClass:"dijitTextBox dijitCurrencyTextBox",pattern:function(_34f){
return "("+(this.focused?this.inherited(arguments,[lang.mixin({},_34f,this.editOptions)])+"|":"")+_34c.regexp(_34f)+")";
},_formatter:_34c.format,_parser:_34c.parse,parse:function(_350,_351){
var v=this.inherited(arguments);
if(isNaN(v)&&/\d+/.test(_350)){
v=lang.hitch(lang.mixin({},this,{_parser:_34e.prototype._parser}),"inherited")(arguments);
}
return v;
},_setConstraintsAttr:function(_352){
if(!_352.currency&&this.currency){
_352.currency=this.currency;
}
this.inherited(arguments,[_34c._mixInDefaults(lang.mixin(_352,{exponent:false}))]);
}});
});
},"url:dijit/templates/MenuItem.html":"<tr class=\"dijitReset dijitMenuItem\" data-dojo-attach-point=\"focusNode\" role=\"menuitem\" tabIndex=\"-1\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitIcon dijitMenuItemIcon\" data-dojo-attach-point=\"iconNode\"/>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" data-dojo-attach-point=\"containerNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" data-dojo-attach-point=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">\n\t\t<div data-dojo-attach-point=\"arrowWrapper\" style=\"visibility: hidden\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuExpand\"/>\n\t\t\t<span class=\"dijitMenuExpandA11y\">+</span>\n\t\t</div>\n\t</td>\n</tr>\n","url:dijit/form/templates/CheckBox.html":"<div class=\"dijit dijitReset dijitInline\" role=\"presentation\"\n\t><input\n\t \t${!nameAttrSetting} type=\"${type}\" ${checkedAttrSetting}\n\t\tclass=\"dijitReset dijitCheckBoxInput\"\n\t\tdata-dojo-attach-point=\"focusNode\"\n\t \tdata-dojo-attach-event=\"onclick:_onClick\"\n/></div>\n","url:dijit/form/templates/VerticalSlider.html":"<table class=\"dijit dijitReset dijitSlider dijitSliderV\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" rules=\"none\" data-dojo-attach-event=\"onkeypress:_onKeyPress,onkeyup:_onKeyUp\"\n\trole=\"presentation\"\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerV\"\n\t\t\t><div class=\"dijitSliderIncrementIconV\" style=\"display:none\" data-dojo-attach-point=\"decrementButton\"><span class=\"dijitSliderButtonInner\">+</span></div\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><center><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperV dijitSliderTopBumper\" data-dojo-attach-event=\"press:_onClkIncBumper\"></div></center\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td data-dojo-attach-point=\"leftDecoration\" class=\"dijitReset dijitSliderDecoration dijitSliderDecorationL dijitSliderDecorationV\"></td\n\t\t><td class=\"dijitReset dijitSliderDecorationC\" style=\"height:100%;\"\n\t\t\t><input data-dojo-attach-point=\"valueNode\" type=\"hidden\" ${!nameAttrSetting}\n\t\t\t/><center class=\"dijitReset dijitSliderBarContainerV\" role=\"presentation\" data-dojo-attach-point=\"sliderBarContainer\"\n\t\t\t\t><div role=\"presentation\" data-dojo-attach-point=\"remainingBar\" class=\"dijitSliderBar dijitSliderBarV dijitSliderRemainingBar dijitSliderRemainingBarV\" data-dojo-attach-event=\"press:_onBarClick\"><!--#5629--></div\n\t\t\t\t><div role=\"presentation\" data-dojo-attach-point=\"progressBar\" class=\"dijitSliderBar dijitSliderBarV dijitSliderProgressBar dijitSliderProgressBarV\" data-dojo-attach-event=\"press:_onBarClick\"\n\t\t\t\t\t><div class=\"dijitSliderMoveable dijitSliderMoveableV\" style=\"vertical-align:top;\"\n\t\t\t\t\t\t><div data-dojo-attach-point=\"sliderHandle,focusNode\" class=\"dijitSliderImageHandle dijitSliderImageHandleV\" data-dojo-attach-event=\"press:_onHandleClick\" role=\"slider\"></div\n\t\t\t\t\t></div\n\t\t\t\t></div\n\t\t\t></center\n\t\t></td\n\t\t><td data-dojo-attach-point=\"containerNode,rightDecoration\" class=\"dijitReset dijitSliderDecoration dijitSliderDecorationR dijitSliderDecorationV\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset\"\n\t\t\t><center><div class=\"dijitSliderBar dijitSliderBumper dijitSliderBumperV dijitSliderBottomBumper\" data-dojo-attach-event=\"press:_onClkDecBumper\"></div></center\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n\t><tr class=\"dijitReset\"\n\t\t><td class=\"dijitReset\"></td\n\t\t><td class=\"dijitReset dijitSliderButtonContainer dijitSliderButtonContainerV\"\n\t\t\t><div class=\"dijitSliderDecrementIconV\" style=\"display:none\" data-dojo-attach-point=\"incrementButton\"><span class=\"dijitSliderButtonInner\">-</span></div\n\t\t></td\n\t\t><td class=\"dijitReset\"></td\n\t></tr\n></table>\n","dijit/layout/LayoutContainer":function(){
define(["dojo/_base/kernel","dojo/_base/lang","dojo/_base/declare","../_WidgetBase","./_LayoutWidget","./utils"],function(_353,lang,_354,_355,_356,_357){
var _358=_354("dijit.layout.LayoutContainer",_356,{baseClass:"dijitLayoutContainer",constructor:function(){
_353.deprecated("dijit.layout.LayoutContainer is deprecated","use BorderContainer instead",2);
},layout:function(){
_357.layoutChildren(this.domNode,this._contentBox,this.getChildren());
},addChild:function(_359,_35a){
this.inherited(arguments);
if(this._started){
_357.layoutChildren(this.domNode,this._contentBox,this.getChildren());
}
},removeChild:function(_35b){
this.inherited(arguments);
if(this._started){
_357.layoutChildren(this.domNode,this._contentBox,this.getChildren());
}
}});
_358.ChildWidgetProperties={layoutAlign:"none"};
lang.extend(_355,_358.ChildWidgetProperties);
return _358;
});
},"dijit/Tooltip":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/_base/fx","dojo/dom","dojo/dom-class","dojo/dom-geometry","dojo/dom-style","dojo/_base/lang","dojo/mouse","dojo/on","dojo/sniff","./_base/manager","./place","./_Widget","./_TemplatedMixin","./BackgroundIframe","dojo/text!./templates/Tooltip.html","./main"],function(_35c,_35d,fx,dom,_35e,_35f,_360,lang,_361,on,has,_362,_363,_364,_365,_366,_367,_368){
var _369=_35d("dijit._MasterTooltip",[_364,_365],{duration:_362.defaultDuration,templateString:_367,postCreate:function(){
this.ownerDocumentBody.appendChild(this.domNode);
this.bgIframe=new _366(this.domNode);
this.fadeIn=fx.fadeIn({node:this.domNode,duration:this.duration,onEnd:lang.hitch(this,"_onShow")});
this.fadeOut=fx.fadeOut({node:this.domNode,duration:this.duration,onEnd:lang.hitch(this,"_onHide")});
},show:function(_36a,_36b,_36c,rtl,_36d){
if(this.aroundNode&&this.aroundNode===_36b&&this.containerNode.innerHTML==_36a){
return;
}
if(this.fadeOut.status()=="playing"){
this._onDeck=arguments;
return;
}
this.containerNode.innerHTML=_36a;
if(_36d){
this.set("textDir",_36d);
}
this.containerNode.align=rtl?"right":"left";
var pos=_363.around(this.domNode,_36b,_36c&&_36c.length?_36c:_36e.defaultPosition,!rtl,lang.hitch(this,"orient"));
var _36f=pos.aroundNodePos;
if(pos.corner.charAt(0)=="M"&&pos.aroundCorner.charAt(0)=="M"){
this.connectorNode.style.top=_36f.y+((_36f.h-this.connectorNode.offsetHeight)>>1)-pos.y+"px";
this.connectorNode.style.left="";
}else{
if(pos.corner.charAt(1)=="M"&&pos.aroundCorner.charAt(1)=="M"){
this.connectorNode.style.left=_36f.x+((_36f.w-this.connectorNode.offsetWidth)>>1)-pos.x+"px";
}else{
this.connectorNode.style.left="";
this.connectorNode.style.top="";
}
}
_360.set(this.domNode,"opacity",0);
this.fadeIn.play();
this.isShowingNow=true;
this.aroundNode=_36b;
},orient:function(node,_370,_371,_372,_373){
this.connectorNode.style.top="";
var _374=_372.h,_375=_372.w;
node.className="dijitTooltip "+{"MR-ML":"dijitTooltipRight","ML-MR":"dijitTooltipLeft","TM-BM":"dijitTooltipAbove","BM-TM":"dijitTooltipBelow","BL-TL":"dijitTooltipBelow dijitTooltipABLeft","TL-BL":"dijitTooltipAbove dijitTooltipABLeft","BR-TR":"dijitTooltipBelow dijitTooltipABRight","TR-BR":"dijitTooltipAbove dijitTooltipABRight","BR-BL":"dijitTooltipRight","BL-BR":"dijitTooltipLeft"}[_370+"-"+_371];
this.domNode.style.width="auto";
var size=_35f.position(this.domNode);
if(has("ie")==9){
size.w+=2;
}
var _376=Math.min((Math.max(_375,1)),size.w);
_35f.setMarginBox(this.domNode,{w:_376});
if(_371.charAt(0)=="B"&&_370.charAt(0)=="B"){
var bb=_35f.position(node);
var _377=this.connectorNode.offsetHeight;
if(bb.h>_374){
var _378=_374-((_373.h+_377)>>1);
this.connectorNode.style.top=_378+"px";
this.connectorNode.style.bottom="";
}else{
this.connectorNode.style.bottom=Math.min(Math.max(_373.h/2-_377/2,0),bb.h-_377)+"px";
this.connectorNode.style.top="";
}
}else{
this.connectorNode.style.top="";
this.connectorNode.style.bottom="";
}
return Math.max(0,size.w-_375);
},_onShow:function(){
if(has("ie")){
this.domNode.style.filter="";
}
},hide:function(_379){
if(this._onDeck&&this._onDeck[1]==_379){
this._onDeck=null;
}else{
if(this.aroundNode===_379){
this.fadeIn.stop();
this.isShowingNow=false;
this.aroundNode=null;
this.fadeOut.play();
}else{
}
}
},_onHide:function(){
this.domNode.style.cssText="";
this.containerNode.innerHTML="";
if(this._onDeck){
this.show.apply(this,this._onDeck);
this._onDeck=null;
}
},_setAutoTextDir:function(node){
this.applyTextDir(node,has("ie")?node.outerText:node.textContent);
_35c.forEach(node.children,function(_37a){
this._setAutoTextDir(_37a);
},this);
},_setTextDirAttr:function(_37b){
this._set("textDir",_37b);
if(_37b=="auto"){
this._setAutoTextDir(this.containerNode);
}else{
this.containerNode.dir=this.textDir;
}
}});
_368.showTooltip=function(_37c,_37d,_37e,rtl,_37f){
if(_37e){
_37e=_35c.map(_37e,function(val){
return {after:"after-centered",before:"before-centered"}[val]||val;
});
}
if(!_36e._masterTT){
_368._masterTT=_36e._masterTT=new _369();
}
return _36e._masterTT.show(_37c,_37d,_37e,rtl,_37f);
};
_368.hideTooltip=function(_380){
return _36e._masterTT&&_36e._masterTT.hide(_380);
};
var _36e=_35d("dijit.Tooltip",_364,{label:"",showDelay:400,connectId:[],position:[],selector:"",_setConnectIdAttr:function(_381){
_35c.forEach(this._connections||[],function(_382){
_35c.forEach(_382,function(_383){
_383.remove();
});
},this);
this._connectIds=_35c.filter(lang.isArrayLike(_381)?_381:(_381?[_381]:[]),function(id){
return dom.byId(id,this.ownerDocument);
},this);
this._connections=_35c.map(this._connectIds,function(id){
var node=dom.byId(id,this.ownerDocument),_384=this.selector,_385=_384?function(_386){
return on.selector(_384,_386);
}:function(_387){
return _387;
},self=this;
return [on(node,_385(_361.enter),function(){
self._onHover(this);
}),on(node,_385("focusin"),function(){
self._onHover(this);
}),on(node,_385(_361.leave),lang.hitch(self,"_onUnHover")),on(node,_385("focusout"),lang.hitch(self,"_onUnHover"))];
},this);
this._set("connectId",_381);
},addTarget:function(node){
var id=node.id||node;
if(_35c.indexOf(this._connectIds,id)==-1){
this.set("connectId",this._connectIds.concat(id));
}
},removeTarget:function(node){
var id=node.id||node,idx=_35c.indexOf(this._connectIds,id);
if(idx>=0){
this._connectIds.splice(idx,1);
this.set("connectId",this._connectIds);
}
},buildRendering:function(){
this.inherited(arguments);
_35e.add(this.domNode,"dijitTooltipData");
},startup:function(){
this.inherited(arguments);
var ids=this.connectId;
_35c.forEach(lang.isArrayLike(ids)?ids:[ids],this.addTarget,this);
},getContent:function(node){
return this.label||this.domNode.innerHTML;
},_onHover:function(_388){
if(!this._showTimer){
this._showTimer=this.defer(function(){
this.open(_388);
},this.showDelay);
}
},_onUnHover:function(){
if(this._showTimer){
this._showTimer.remove();
delete this._showTimer;
}
this.close();
},open:function(_389){
if(this._showTimer){
this._showTimer.remove();
delete this._showTimer;
}
var _38a=this.getContent(_389);
if(!_38a){
return;
}
_36e.show(_38a,_389,this.position,!this.isLeftToRight(),this.textDir);
this._connectNode=_389;
this.onShow(_389,this.position);
},close:function(){
if(this._connectNode){
_36e.hide(this._connectNode);
delete this._connectNode;
this.onHide();
}
if(this._showTimer){
this._showTimer.remove();
delete this._showTimer;
}
},onShow:function(){
},onHide:function(){
},destroy:function(){
this.close();
_35c.forEach(this._connections||[],function(_38b){
_35c.forEach(_38b,function(_38c){
_38c.remove();
});
},this);
this.inherited(arguments);
}});
_36e._MasterTooltip=_369;
_36e.show=_368.showTooltip;
_36e.hide=_368.hideTooltip;
_36e.defaultPosition=["after-centered","before-centered"];
return _36e;
});
},"url:dijit/templates/MenuSeparator.html":"<tr class=\"dijitMenuSeparator\">\n\t<td class=\"dijitMenuSeparatorIconCell\">\n\t\t<div class=\"dijitMenuSeparatorTop\"></div>\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\n\t</td>\n\t<td colspan=\"3\" class=\"dijitMenuSeparatorLabelCell\">\n\t\t<div class=\"dijitMenuSeparatorTop dijitMenuSeparatorLabel\"></div>\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\n\t</td>\n</tr>","dijit/form/VerticalSlider":function(){
define(["dojo/_base/declare","./HorizontalSlider","dojo/text!./templates/VerticalSlider.html"],function(_38d,_38e,_38f){
return _38d("dijit.form.VerticalSlider",_38e,{templateString:_38f,_mousePixelCoord:"pageY",_pixelCount:"h",_startingPixelCoord:"y",_handleOffsetCoord:"top",_progressPixelSize:"height",_descending:true,_isReversed:function(){
return this._descending;
}});
});
},"dijit/form/DropDownButton":function(){
define(["dojo/_base/declare","dojo/_base/lang","dojo/query","../registry","../popup","./Button","../_Container","../_HasDropDown","dojo/text!./templates/DropDownButton.html"],function(_390,lang,_391,_392,_393,_394,_395,_396,_397){
return _390("dijit.form.DropDownButton",[_394,_395,_396],{baseClass:"dijitDropDownButton",templateString:_397,_fillContent:function(){
if(this.srcNodeRef){
var _398=_391("*",this.srcNodeRef);
this.inherited(arguments,[_398[0]]);
this.dropDownContainer=this.srcNodeRef;
}
},startup:function(){
if(this._started){
return;
}
if(!this.dropDown&&this.dropDownContainer){
var _399=_391("[widgetId]",this.dropDownContainer)[0];
this.dropDown=_392.byNode(_399);
delete this.dropDownContainer;
}
if(this.dropDown){
_393.hide(this.dropDown);
}
this.inherited(arguments);
},isLoaded:function(){
var _39a=this.dropDown;
return (!!_39a&&(!_39a.href||_39a.isLoaded));
},loadDropDown:function(_39b){
var _39c=this.dropDown;
var _39d=_39c.on("load",lang.hitch(this,function(){
_39d.remove();
_39b();
}));
_39c.refresh();
},isFocusable:function(){
return this.inherited(arguments)&&!this._mouseDown;
}});
});
},"url:dijit/templates/ProgressBar.html":"<div class=\"dijitProgressBar dijitProgressBarEmpty\" role=\"progressbar\"\n\t><div  data-dojo-attach-point=\"internalProgress\" class=\"dijitProgressBarFull\"\n\t\t><div class=\"dijitProgressBarTile\" role=\"presentation\"></div\n\t\t><span style=\"visibility:hidden\">&#160;</span\n\t></div\n\t><div data-dojo-attach-point=\"labelNode\" class=\"dijitProgressBarLabel\" id=\"${id}_label\"></div\n\t><img data-dojo-attach-point=\"indeterminateHighContrastImage\" class=\"dijitProgressBarIndeterminateHighContrastImage\" alt=\"\"\n/></div>\n","dojo/date":function(){
define(["./has","./_base/lang"],function(has,lang){
var date={};
date.getDaysInMonth=function(_39e){
var _39f=_39e.getMonth();
var days=[31,28,31,30,31,30,31,31,30,31,30,31];
if(_39f==1&&date.isLeapYear(_39e)){
return 29;
}
return days[_39f];
};
date.isLeapYear=function(_3a0){
var year=_3a0.getFullYear();
return !(year%400)||(!(year%4)&&!!(year%100));
};
date.getTimezoneName=function(_3a1){
var str=_3a1.toString();
var tz="";
var _3a2;
var pos=str.indexOf("(");
if(pos>-1){
tz=str.substring(++pos,str.indexOf(")"));
}else{
var pat=/([A-Z\/]+) \d{4}$/;
if((_3a2=str.match(pat))){
tz=_3a2[1];
}else{
str=_3a1.toLocaleString();
pat=/ ([A-Z\/]+)$/;
if((_3a2=str.match(pat))){
tz=_3a2[1];
}
}
}
return (tz=="AM"||tz=="PM")?"":tz;
};
date.compare=function(_3a3,_3a4,_3a5){
_3a3=new Date(+_3a3);
_3a4=new Date(+(_3a4||new Date()));
if(_3a5=="date"){
_3a3.setHours(0,0,0,0);
_3a4.setHours(0,0,0,0);
}else{
if(_3a5=="time"){
_3a3.setFullYear(0,0,0);
_3a4.setFullYear(0,0,0);
}
}
if(_3a3>_3a4){
return 1;
}
if(_3a3<_3a4){
return -1;
}
return 0;
};
date.add=function(date,_3a6,_3a7){
var sum=new Date(+date);
var _3a8=false;
var _3a9="Date";
switch(_3a6){
case "day":
break;
case "weekday":
var days,_3aa;
var mod=_3a7%5;
if(!mod){
days=(_3a7>0)?5:-5;
_3aa=(_3a7>0)?((_3a7-5)/5):((_3a7+5)/5);
}else{
days=mod;
_3aa=parseInt(_3a7/5);
}
var strt=date.getDay();
var adj=0;
if(strt==6&&_3a7>0){
adj=1;
}else{
if(strt==0&&_3a7<0){
adj=-1;
}
}
var trgt=strt+days;
if(trgt==0||trgt==6){
adj=(_3a7>0)?2:-2;
}
_3a7=(7*_3aa)+days+adj;
break;
case "year":
_3a9="FullYear";
_3a8=true;
break;
case "week":
_3a7*=7;
break;
case "quarter":
_3a7*=3;
case "month":
_3a8=true;
_3a9="Month";
break;
default:
_3a9="UTC"+_3a6.charAt(0).toUpperCase()+_3a6.substring(1)+"s";
}
if(_3a9){
sum["set"+_3a9](sum["get"+_3a9]()+_3a7);
}
if(_3a8&&(sum.getDate()<date.getDate())){
sum.setDate(0);
}
return sum;
};
date.difference=function(_3ab,_3ac,_3ad){
_3ac=_3ac||new Date();
_3ad=_3ad||"day";
var _3ae=_3ac.getFullYear()-_3ab.getFullYear();
var _3af=1;
switch(_3ad){
case "quarter":
var m1=_3ab.getMonth();
var m2=_3ac.getMonth();
var q1=Math.floor(m1/3)+1;
var q2=Math.floor(m2/3)+1;
q2+=(_3ae*4);
_3af=q2-q1;
break;
case "weekday":
var days=Math.round(date.difference(_3ab,_3ac,"day"));
var _3b0=parseInt(date.difference(_3ab,_3ac,"week"));
var mod=days%7;
if(mod==0){
days=_3b0*5;
}else{
var adj=0;
var aDay=_3ab.getDay();
var bDay=_3ac.getDay();
_3b0=parseInt(days/7);
mod=days%7;
var _3b1=new Date(_3ab);
_3b1.setDate(_3b1.getDate()+(_3b0*7));
var _3b2=_3b1.getDay();
if(days>0){
switch(true){
case aDay==6:
adj=-1;
break;
case aDay==0:
adj=0;
break;
case bDay==6:
adj=-1;
break;
case bDay==0:
adj=-2;
break;
case (_3b2+mod)>5:
adj=-2;
}
}else{
if(days<0){
switch(true){
case aDay==6:
adj=0;
break;
case aDay==0:
adj=1;
break;
case bDay==6:
adj=2;
break;
case bDay==0:
adj=1;
break;
case (_3b2+mod)<0:
adj=2;
}
}
}
days+=adj;
days-=(_3b0*2);
}
_3af=days;
break;
case "year":
_3af=_3ae;
break;
case "month":
_3af=(_3ac.getMonth()-_3ab.getMonth())+(_3ae*12);
break;
case "week":
_3af=parseInt(date.difference(_3ab,_3ac,"day")/7);
break;
case "day":
_3af/=24;
case "hour":
_3af/=60;
case "minute":
_3af/=60;
case "second":
_3af/=1000;
case "millisecond":
_3af*=_3ac.getTime()-_3ab.getTime();
}
return Math.round(_3af);
};
1&&lang.mixin(lang.getObject("dojo.date",true),date);
return date;
});
},"dijit/layout/_ContentPaneResizeMixin":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dom-class","dojo/dom-geometry","dojo/dom-style","dojo/_base/lang","dojo/query","dojo/sniff","../registry","../Viewport","./utils"],function(_3b3,_3b4,_3b5,_3b6,_3b7,lang,_3b8,has,_3b9,_3ba,_3bb){
return _3b4("dijit.layout._ContentPaneResizeMixin",null,{doLayout:true,isLayoutContainer:true,startup:function(){
if(this._started){
return;
}
var _3bc=this.getParent();
this._childOfLayoutWidget=_3bc&&_3bc.isLayoutContainer;
this._needLayout=!this._childOfLayoutWidget;
this.inherited(arguments);
if(this._isShown()){
this._onShow();
}
if(!this._childOfLayoutWidget){
this.own(_3ba.on("resize",lang.hitch(this,"resize")));
}
},_checkIfSingleChild:function(){
var _3bd=[],_3be=false;
_3b8("> *",this.containerNode).some(function(node){
var _3bf=_3b9.byNode(node);
if(_3bf&&_3bf.resize){
_3bd.push(_3bf);
}else{
if(node.offsetHeight){
_3be=true;
}
}
});
this._singleChild=_3bd.length==1&&!_3be?_3bd[0]:null;
_3b5.toggle(this.containerNode,this.baseClass+"SingleChild",!!this._singleChild);
},resize:function(_3c0,_3c1){
this._resizeCalled=true;
this._scheduleLayout(_3c0,_3c1);
},_scheduleLayout:function(_3c2,_3c3){
if(this._isShown()){
this._layout(_3c2,_3c3);
}else{
this._needLayout=true;
this._changeSize=_3c2;
this._resultSize=_3c3;
}
},_layout:function(_3c4,_3c5){
delete this._needLayout;
if(!this._wasShown&&this.open!==false){
this._onShow();
}
if(_3c4){
_3b6.setMarginBox(this.domNode,_3c4);
}
var cn=this.containerNode;
if(cn===this.domNode){
var mb=_3c5||{};
lang.mixin(mb,_3c4||{});
if(!("h" in mb)||!("w" in mb)){
mb=lang.mixin(_3b6.getMarginBox(cn),mb);
}
this._contentBox=_3bb.marginBox2contentBox(cn,mb);
}else{
this._contentBox=_3b6.getContentBox(cn);
}
this._layoutChildren();
},_layoutChildren:function(){
if(this.doLayout){
this._checkIfSingleChild();
}
if(this._singleChild&&this._singleChild.resize){
var cb=this._contentBox||_3b6.getContentBox(this.containerNode);
this._singleChild.resize({w:cb.w,h:cb.h});
}else{
_3b3.forEach(this.getChildren(),function(_3c6){
if(_3c6.resize){
_3c6.resize();
}
});
}
},_isShown:function(){
if(this._childOfLayoutWidget){
if(this._resizeCalled&&"open" in this){
return this.open;
}
return this._resizeCalled;
}else{
if("open" in this){
return this.open;
}else{
var node=this.domNode,_3c7=this.domNode.parentNode;
return (node.style.display!="none")&&(node.style.visibility!="hidden")&&!_3b5.contains(node,"dijitHidden")&&_3c7&&_3c7.style&&(_3c7.style.display!="none");
}
}
},_onShow:function(){
this._wasShown=true;
if(this._needLayout){
this._layout(this._changeSize,this._resultSize);
}
this.inherited(arguments);
}});
});
},"dijit/form/RangeBoundTextBox":function(){
define(["dojo/_base/declare","dojo/i18n","./MappedTextBox"],function(_3c8,i18n,_3c9){
var _3ca=_3c8("dijit.form.RangeBoundTextBox",_3c9,{rangeMessage:"",rangeCheck:function(_3cb,_3cc){
return ("min" in _3cc?(this.compare(_3cb,_3cc.min)>=0):true)&&("max" in _3cc?(this.compare(_3cb,_3cc.max)<=0):true);
},isInRange:function(){
return this.rangeCheck(this.get("value"),this.constraints);
},_isDefinitelyOutOfRange:function(){
var val=this.get("value");
if(val==null){
return false;
}
var _3cd=false;
if("min" in this.constraints){
var min=this.constraints.min;
_3cd=this.compare(val,((typeof min=="number")&&min>=0&&val!=0)?0:min)<0;
}
if(!_3cd&&("max" in this.constraints)){
var max=this.constraints.max;
_3cd=this.compare(val,((typeof max!="number")||max>0)?max:0)>0;
}
return _3cd;
},_isValidSubset:function(){
return this.inherited(arguments)&&!this._isDefinitelyOutOfRange();
},isValid:function(_3ce){
return this.inherited(arguments)&&((this._isEmpty(this.textbox.value)&&!this.required)||this.isInRange(_3ce));
},getErrorMessage:function(_3cf){
var v=this.get("value");
if(v!=null&&v!==""&&(typeof v!="number"||!isNaN(v))&&!this.isInRange(_3cf)){
return this.rangeMessage;
}
return this.inherited(arguments);
},postMixInProperties:function(){
this.inherited(arguments);
if(!this.rangeMessage){
this.messages=i18n.getLocalization("dijit.form","validate",this.lang);
this.rangeMessage=this.messages.rangeMessage;
}
},_setConstraintsAttr:function(_3d0){
this.inherited(arguments);
if(this.focusNode){
if(this.constraints.min!==undefined){
this.focusNode.setAttribute("aria-valuemin",this.constraints.min);
}else{
this.focusNode.removeAttribute("aria-valuemin");
}
if(this.constraints.max!==undefined){
this.focusNode.setAttribute("aria-valuemax",this.constraints.max);
}else{
this.focusNode.removeAttribute("aria-valuemax");
}
}
},_setValueAttr:function(_3d1,_3d2){
this.focusNode.setAttribute("aria-valuenow",_3d1);
this.inherited(arguments);
},applyTextDir:function(){
}});
return _3ca;
});
},"dijit/_editor/RichText":function(){
define("dijit/_editor/RichText",["dojo/_base/array","dojo/_base/config","dojo/_base/declare","dojo/_base/Deferred","dojo/dom","dojo/dom-attr","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/_base/event","dojo/_base/kernel","dojo/keys","dojo/_base/lang","dojo/on","dojo/query","dojo/ready","dojo/sniff","dojo/topic","dojo/_base/unload","dojo/_base/url","dojo/_base/window","../_Widget","../_CssStateMixin","./selection","./range","./html","../focus","../main"],function(_3d3,_3d4,_3d5,_3d6,dom,_3d7,_3d8,_3d9,_3da,_3db,_3dc,_3dd,keys,lang,on,_3de,_3df,has,_3e0,_3e1,_3e2,win,_3e3,_3e4,_3e5,_3e6,_3e7,_3e8,_3e9){
var _3ea=_3d5("dijit._editor.RichText",[_3e3,_3e4],{constructor:function(_3eb){
this.contentPreFilters=[];
this.contentPostFilters=[];
this.contentDomPreFilters=[];
this.contentDomPostFilters=[];
this.editingAreaStyleSheets=[];
this.events=[].concat(this.events);
this._keyHandlers={};
if(_3eb&&lang.isString(_3eb.value)){
this.value=_3eb.value;
}
this.onLoadDeferred=new _3d6();
},baseClass:"dijitEditor",inheritWidth:false,focusOnLoad:false,name:"",styleSheets:"",height:"300px",minHeight:"1em",isClosed:true,isLoaded:false,_SEPARATOR:"@@**%%__RICHTEXTBOUNDRY__%%**@@",_NAME_CONTENT_SEP:"@@**%%:%%**@@",onLoadDeferred:null,isTabIndent:false,disableSpellCheck:false,postCreate:function(){
if("textarea"===this.domNode.tagName.toLowerCase()){
console.warn("RichText should not be used with the TEXTAREA tag.  See dijit._editor.RichText docs.");
}
this.contentPreFilters=[lang.hitch(this,"_preFixUrlAttributes")].concat(this.contentPreFilters);
if(has("mozilla")){
this.contentPreFilters=[this._normalizeFontStyle].concat(this.contentPreFilters);
this.contentPostFilters=[this._removeMozBogus].concat(this.contentPostFilters);
}
if(has("webkit")){
this.contentPreFilters=[this._removeWebkitBogus].concat(this.contentPreFilters);
this.contentPostFilters=[this._removeWebkitBogus].concat(this.contentPostFilters);
}
if(has("ie")){
this.contentPostFilters=[this._normalizeFontStyle].concat(this.contentPostFilters);
this.contentDomPostFilters=[lang.hitch(this,this._stripBreakerNodes)].concat(this.contentDomPostFilters);
}
this.inherited(arguments);
_3e0.publish(_3e9._scopeName+"._editor.RichText::init",this);
this.open();
this.setupDefaultShortcuts();
},setupDefaultShortcuts:function(){
var exec=lang.hitch(this,function(cmd,arg){
return function(){
return !this.execCommand(cmd,arg);
};
});
var _3ec={b:exec("bold"),i:exec("italic"),u:exec("underline"),a:exec("selectall"),s:function(){
this.save(true);
},m:function(){
this.isTabIndent=!this.isTabIndent;
},"1":exec("formatblock","h1"),"2":exec("formatblock","h2"),"3":exec("formatblock","h3"),"4":exec("formatblock","h4"),"\\":exec("insertunorderedlist")};
if(!has("ie")){
_3ec.Z=exec("redo");
}
var key;
for(key in _3ec){
this.addKeyHandler(key,true,false,_3ec[key]);
}
},events:["onKeyPress","onKeyDown","onKeyUp"],captureEvents:[],_editorCommandsLocalized:false,_localizeEditorCommands:function(){
if(_3ea._editorCommandsLocalized){
this._local2NativeFormatNames=_3ea._local2NativeFormatNames;
this._native2LocalFormatNames=_3ea._native2LocalFormatNames;
return;
}
_3ea._editorCommandsLocalized=true;
_3ea._local2NativeFormatNames={};
_3ea._native2LocalFormatNames={};
this._local2NativeFormatNames=_3ea._local2NativeFormatNames;
this._native2LocalFormatNames=_3ea._native2LocalFormatNames;
var _3ed=["div","p","pre","h1","h2","h3","h4","h5","h6","ol","ul","address"];
var _3ee="",_3ef,i=0;
while((_3ef=_3ed[i++])){
if(_3ef.charAt(1)!=="l"){
_3ee+="<"+_3ef+"><span>content</span></"+_3ef+"><br/>";
}else{
_3ee+="<"+_3ef+"><li>content</li></"+_3ef+"><br/>";
}
}
var _3f0={position:"absolute",top:"0px",zIndex:10,opacity:0.01};
var div=_3d9.create("div",{style:_3f0,innerHTML:_3ee});
this.ownerDocumentBody.appendChild(div);
var _3f1=lang.hitch(this,function(){
var node=div.firstChild;
while(node){
try{
this._sCall("selectElement",[node.firstChild]);
var _3f2=node.tagName.toLowerCase();
this._local2NativeFormatNames[_3f2]=document.queryCommandValue("formatblock");
this._native2LocalFormatNames[this._local2NativeFormatNames[_3f2]]=_3f2;
node=node.nextSibling.nextSibling;
}
catch(e){
}
}
_3d9.destroy(div);
});
this.defer(_3f1);
},open:function(_3f3){
if(!this.onLoadDeferred||this.onLoadDeferred.fired>=0){
this.onLoadDeferred=new _3d6();
}
if(!this.isClosed){
this.close();
}
_3e0.publish(_3e9._scopeName+"._editor.RichText::open",this);
if(arguments.length===1&&_3f3.nodeName){
this.domNode=_3f3;
}
var dn=this.domNode;
var html;
if(lang.isString(this.value)){
html=this.value;
delete this.value;
dn.innerHTML="";
}else{
if(dn.nodeName&&dn.nodeName.toLowerCase()=="textarea"){
var ta=(this.textarea=dn);
this.name=ta.name;
html=ta.value;
dn=this.domNode=this.ownerDocument.createElement("div");
dn.setAttribute("widgetId",this.id);
ta.removeAttribute("widgetId");
dn.cssText=ta.cssText;
dn.className+=" "+ta.className;
_3d9.place(dn,ta,"before");
var _3f4=lang.hitch(this,function(){
_3db.set(ta,{display:"block",position:"absolute",top:"-1000px"});
if(has("ie")){
var s=ta.style;
this.__overflow=s.overflow;
s.overflow="hidden";
}
});
if(has("ie")){
this.defer(_3f4,10);
}else{
_3f4();
}
if(ta.form){
var _3f5=ta.value;
this.reset=function(){
var _3f6=this.getValue();
if(_3f6!==_3f5){
this.replaceValue(_3f5);
}
};
on(ta.form,"submit",lang.hitch(this,function(){
_3d7.set(ta,"disabled",this.disabled);
ta.value=this.getValue();
}));
}
}else{
html=_3e7.getChildrenHtml(dn);
dn.innerHTML="";
}
}
this.value=html;
if(dn.nodeName&&dn.nodeName==="LI"){
dn.innerHTML=" <br>";
}
this.header=dn.ownerDocument.createElement("div");
dn.appendChild(this.header);
this.editingArea=dn.ownerDocument.createElement("div");
dn.appendChild(this.editingArea);
this.footer=dn.ownerDocument.createElement("div");
dn.appendChild(this.footer);
if(!this.name){
this.name=this.id+"_AUTOGEN";
}
if(this.name!==""&&(!_3d4["useXDomain"]||_3d4["allowXdRichTextSave"])){
var _3f7=dom.byId(_3e9._scopeName+"._editor.RichText.value");
if(_3f7&&_3f7.value!==""){
var _3f8=_3f7.value.split(this._SEPARATOR),i=0,dat;
while((dat=_3f8[i++])){
var data=dat.split(this._NAME_CONTENT_SEP);
if(data[0]===this.name){
html=data[1];
_3f8=_3f8.splice(i,1);
_3f7.value=_3f8.join(this._SEPARATOR);
break;
}
}
}
if(!_3ea._globalSaveHandler){
_3ea._globalSaveHandler={};
_3e1.addOnUnload(function(){
var id;
for(id in _3ea._globalSaveHandler){
var f=_3ea._globalSaveHandler[id];
if(lang.isFunction(f)){
f();
}
}
});
}
_3ea._globalSaveHandler[this.id]=lang.hitch(this,"_saveContent");
}
this.isClosed=false;
var ifr=(this.editorObject=this.iframe=this.ownerDocument.createElement("iframe"));
ifr.id=this.id+"_iframe";
ifr.style.border="none";
ifr.style.width="100%";
if(this._layoutMode){
ifr.style.height="100%";
}else{
if(has("ie")>=7){
if(this.height){
ifr.style.height=this.height;
}
if(this.minHeight){
ifr.style.minHeight=this.minHeight;
}
}else{
ifr.style.height=this.height?this.height:this.minHeight;
}
}
ifr.frameBorder=0;
ifr._loadFunc=lang.hitch(this,function(w){
this.window=w;
this.document=this.window.document;
if(has("ie")){
this._localizeEditorCommands();
}
this.onLoad(html);
});
var src=this._getIframeDocTxt(),s="javascript: '"+src.replace(/\\/g,"\\\\").replace(/'/g,"\\'")+"'";
ifr.setAttribute("src",s);
this.editingArea.appendChild(ifr);
if(has("safari")<=4){
src=ifr.getAttribute("src");
if(!src||src.indexOf("javascript")===-1){
this.defer(function(){
ifr.setAttribute("src",s);
});
}
}
if(dn.nodeName==="LI"){
dn.lastChild.style.marginTop="-1.2em";
}
_3d8.add(this.domNode,this.baseClass);
},_local2NativeFormatNames:{},_native2LocalFormatNames:{},_getIframeDocTxt:function(){
var _3f9=_3db.getComputedStyle(this.domNode);
var html="";
var _3fa=true;
if(has("ie")||has("webkit")||(!this.height&&!has("mozilla"))){
html="<div id='dijitEditorBody'></div>";
_3fa=false;
}else{
if(has("mozilla")){
this._cursorToStart=true;
html="&#160;";
}
}
var font=[_3f9.fontWeight,_3f9.fontSize,_3f9.fontFamily].join(" ");
var _3fb=_3f9.lineHeight;
if(_3fb.indexOf("px")>=0){
_3fb=parseFloat(_3fb)/parseFloat(_3f9.fontSize);
}else{
if(_3fb.indexOf("em")>=0){
_3fb=parseFloat(_3fb);
}else{
_3fb="normal";
}
}
var _3fc="";
var self=this;
this.style.replace(/(^|;)\s*(line-|font-?)[^;]+/ig,function(_3fd){
_3fd=_3fd.replace(/^;/ig,"")+";";
var s=_3fd.split(":")[0];
if(s){
s=lang.trim(s);
s=s.toLowerCase();
var i;
var sC="";
for(i=0;i<s.length;i++){
var c=s.charAt(i);
switch(c){
case "-":
i++;
c=s.charAt(i).toUpperCase();
default:
sC+=c;
}
}
_3db.set(self.domNode,sC,"");
}
_3fc+=_3fd+";";
});
var _3fe=_3de("label[for=\""+this.id+"\"]");
return [this.isLeftToRight()?"<html>\n<head>\n":"<html dir='rtl'>\n<head>\n",(has("mozilla")&&_3fe.length?"<title>"+_3fe[0].innerHTML+"</title>\n":""),"<meta http-equiv='Content-Type' content='text/html'>\n","<style>\n","\tbody,html {\n","\t\tbackground:transparent;\n","\t\tpadding: 1px 0 0 0;\n","\t\tmargin: -1px 0 0 0;\n",((has("webkit"))?"\t\twidth: 100%;\n":""),((has("webkit"))?"\t\theight: 100%;\n":""),"\t}\n","\tbody{\n","\t\ttop:0px;\n","\t\tleft:0px;\n","\t\tright:0px;\n","\t\tfont:",font,";\n",((this.height||has("opera"))?"":"\t\tposition: fixed;\n"),"\t\tmin-height:",this.minHeight,";\n","\t\tline-height:",_3fb,";\n","\t}\n","\tp{ margin: 1em 0; }\n",(!_3fa&&!this.height?"\tbody,html {overflow-y: hidden;}\n":""),"\t#dijitEditorBody{overflow-x: auto; overflow-y:"+(this.height?"auto;":"hidden;")+" outline: 0px;}\n","\tli > ul:-moz-first-node, li > ol:-moz-first-node{ padding-top: 1.2em; }\n",(!has("ie")?"\tli{ min-height:1.2em; }\n":""),"</style>\n",this._applyEditingAreaStyleSheets(),"\n","</head>\n<body ",(_3fa?"id='dijitEditorBody' ":""),"onload='frameElement && frameElement._loadFunc(window,document)' ","style='"+_3fc+"'>",html,"</body>\n</html>"].join("");
},_applyEditingAreaStyleSheets:function(){
var _3ff=[];
if(this.styleSheets){
_3ff=this.styleSheets.split(";");
this.styleSheets="";
}
_3ff=_3ff.concat(this.editingAreaStyleSheets);
this.editingAreaStyleSheets=[];
var text="",i=0,url;
while((url=_3ff[i++])){
var _400=(new _3e2(win.global.location,url)).toString();
this.editingAreaStyleSheets.push(_400);
text+="<link rel=\"stylesheet\" type=\"text/css\" href=\""+_400+"\"/>";
}
return text;
},addStyleSheet:function(uri){
var url=uri.toString();
if(url.charAt(0)==="."||(url.charAt(0)!=="/"&&!uri.host)){
url=(new _3e2(win.global.location,url)).toString();
}
if(_3d3.indexOf(this.editingAreaStyleSheets,url)>-1){
return;
}
this.editingAreaStyleSheets.push(url);
this.onLoadDeferred.then(lang.hitch(this,function(){
if(this.document.createStyleSheet){
this.document.createStyleSheet(url);
}else{
var head=this.document.getElementsByTagName("head")[0];
var _401=this.document.createElement("link");
_401.rel="stylesheet";
_401.type="text/css";
_401.href=url;
head.appendChild(_401);
}
}));
},removeStyleSheet:function(uri){
var url=uri.toString();
if(url.charAt(0)==="."||(url.charAt(0)!=="/"&&!uri.host)){
url=(new _3e2(win.global.location,url)).toString();
}
var _402=_3d3.indexOf(this.editingAreaStyleSheets,url);
if(_402===-1){
return;
}
delete this.editingAreaStyleSheets[_402];
_3de("link:[href=\""+url+"\"]",this.window.document).orphan();
},disabled:false,_mozSettingProps:{"styleWithCSS":false},_setDisabledAttr:function(_403){
_403=!!_403;
this._set("disabled",_403);
if(!this.isLoaded){
return;
}
if(has("ie")||has("webkit")||has("opera")){
var _404=has("ie")&&(this.isLoaded||!this.focusOnLoad);
if(_404){
this.editNode.unselectable="on";
}
this.editNode.contentEditable=!_403;
if(_404){
this.defer(function(){
if(this.editNode){
this.editNode.unselectable="off";
}
});
}
}else{
try{
this.document.designMode=(_403?"off":"on");
}
catch(e){
return;
}
if(!_403&&this._mozSettingProps){
var ps=this._mozSettingProps;
var n;
for(n in ps){
if(ps.hasOwnProperty(n)){
try{
this.document.execCommand(n,false,ps[n]);
}
catch(e2){
}
}
}
}
}
this._disabledOK=true;
},onLoad:function(html){
if(!this.window.__registeredWindow){
this.window.__registeredWindow=true;
this._iframeRegHandle=_3e8.registerIframe(this.iframe);
}
if(!has("ie")&&!has("webkit")&&(this.height||has("mozilla"))){
this.editNode=this.document.body;
}else{
this.editNode=this.document.body.firstChild;
var _405=this;
if(has("ie")){
this.tabStop=_3d9.create("div",{tabIndex:-1},this.editingArea);
this.iframe.onfocus=function(){
_405.editNode.setActive();
};
}
}
this.focusNode=this.editNode;
var _406=this.events.concat(this.captureEvents);
var ap=this.iframe?this.document:this.editNode;
_3d3.forEach(_406,function(item){
this.connect(ap,item.toLowerCase(),item);
},this);
this.connect(ap,"onmouseup","onClick");
if(has("ie")){
this.connect(this.document,"onmousedown","_onIEMouseDown");
this.editNode.style.zoom=1;
}else{
this.connect(this.document,"onmousedown",function(){
delete this._cursorToStart;
});
}
if(has("webkit")){
this._webkitListener=this.connect(this.document,"onmouseup","onDisplayChanged");
this.connect(this.document,"onmousedown",function(e){
var t=e.target;
if(t&&(t===this.document.body||t===this.document)){
this.defer("placeCursorAtEnd");
}
});
}
if(has("ie")){
try{
this.document.execCommand("RespectVisibilityInDesign",true,null);
}
catch(e){
}
}
this.isLoaded=true;
this.set("disabled",this.disabled);
var _407=lang.hitch(this,function(){
this.setValue(html);
if(this.onLoadDeferred){
this.onLoadDeferred.resolve(true);
}
this.onDisplayChanged();
if(this.focusOnLoad){
_3df(lang.hitch(this,"defer","focus",this.updateInterval));
}
this.value=this.getValue(true);
});
if(this.setValueDeferred){
this.setValueDeferred.then(_407);
}else{
_407();
}
},onKeyDown:function(e){
if(e.keyCode===keys.TAB&&this.isTabIndent){
_3dc.stop(e);
if(this.queryCommandEnabled((e.shiftKey?"outdent":"indent"))){
this.execCommand((e.shiftKey?"outdent":"indent"));
}
}
if(has("ie")){
if(e.keyCode==keys.TAB&&!this.isTabIndent){
if(e.shiftKey&&!e.ctrlKey&&!e.altKey){
this.iframe.focus();
}else{
if(!e.shiftKey&&!e.ctrlKey&&!e.altKey){
this.tabStop.focus();
}
}
}else{
if(e.keyCode===keys.BACKSPACE&&this.document.selection.type==="Control"){
_3dc.stop(e);
this.execCommand("delete");
}else{
if((65<=e.keyCode&&e.keyCode<=90)||(e.keyCode>=37&&e.keyCode<=40)){
e.charCode=e.keyCode;
this.onKeyPress(e);
}
}
}
}
if(has("ff")){
if(e.keyCode===keys.PAGE_UP||e.keyCode===keys.PAGE_DOWN){
if(this.editNode.clientHeight>=this.editNode.scrollHeight){
e.preventDefault();
}
}
}
return true;
},onKeyUp:function(){
},setDisabled:function(_408){
_3dd.deprecated("dijit.Editor::setDisabled is deprecated","use dijit.Editor::attr(\"disabled\",boolean) instead",2);
this.set("disabled",_408);
},_setValueAttr:function(_409){
this.setValue(_409);
},_setDisableSpellCheckAttr:function(_40a){
if(this.document){
_3d7.set(this.document.body,"spellcheck",!_40a);
}else{
this.onLoadDeferred.then(lang.hitch(this,function(){
_3d7.set(this.document.body,"spellcheck",!_40a);
}));
}
this._set("disableSpellCheck",_40a);
},onKeyPress:function(e){
var c=(e.keyChar&&e.keyChar.toLowerCase())||e.keyCode,_40b=this._keyHandlers[c],args=arguments;
if(_40b&&!e.altKey){
_3d3.some(_40b,function(h){
if(!(h.shift^e.shiftKey)&&!(h.ctrl^(e.ctrlKey||e.metaKey))){
if(!h.handler.apply(this,args)){
e.preventDefault();
}
return true;
}
},this);
}
if(!this._onKeyHitch){
this._onKeyHitch=lang.hitch(this,"onKeyPressed");
}
this.defer("_onKeyHitch",1);
return true;
},addKeyHandler:function(key,ctrl,_40c,_40d){
if(!lang.isArray(this._keyHandlers[key])){
this._keyHandlers[key]=[];
}
this._keyHandlers[key].push({shift:_40c||false,ctrl:ctrl||false,handler:_40d});
},onKeyPressed:function(){
this.onDisplayChanged();
},onClick:function(e){
this.onDisplayChanged(e);
},_onIEMouseDown:function(){
if(!this.focused&&!this.disabled){
this.focus();
}
},_onBlur:function(e){
this.inherited(arguments);
var _40e=this.getValue(true);
if(_40e!==this.value){
this.onChange(_40e);
}
this._set("value",_40e);
},_onFocus:function(e){
if(!this.disabled){
if(!this._disabledOK){
this.set("disabled",false);
}
this.inherited(arguments);
}
},blur:function(){
if(!has("ie")&&this.window.document.documentElement&&this.window.document.documentElement.focus){
this.window.document.documentElement.focus();
}else{
if(this.ownerDocumentBody.focus){
this.ownerDocumentBody.focus();
}
}
},focus:function(){
if(!this.isLoaded){
this.focusOnLoad=true;
return;
}
if(this._cursorToStart){
delete this._cursorToStart;
if(this.editNode.childNodes){
this.placeCursorAtStart();
return;
}
}
if(!has("ie")){
_3e8.focus(this.iframe);
}else{
if(this.editNode&&this.editNode.focus){
this.iframe.fireEvent("onfocus",document.createEventObject());
}
}
},updateInterval:200,_updateTimer:null,onDisplayChanged:function(){
if(this._updateTimer){
this._updateTimer.remove();
}
this._updateTimer=this.defer("onNormalizedDisplayChanged",this.updateInterval);
},onNormalizedDisplayChanged:function(){
delete this._updateTimer;
},onChange:function(){
},_normalizeCommand:function(cmd,_40f){
var _410=cmd.toLowerCase();
if(_410==="formatblock"){
if(has("safari")&&_40f===undefined){
_410="heading";
}
}else{
if(_410==="hilitecolor"&&!has("mozilla")){
_410="backcolor";
}
}
return _410;
},_qcaCache:{},queryCommandAvailable:function(_411){
var ca=this._qcaCache[_411];
if(ca!==undefined){
return ca;
}
return (this._qcaCache[_411]=this._queryCommandAvailable(_411));
},_queryCommandAvailable:function(_412){
var ie=1;
var _413=1<<1;
var _414=1<<2;
var _415=1<<3;
function _416(_417){
return {ie:Boolean(_417&ie),mozilla:Boolean(_417&_413),webkit:Boolean(_417&_414),opera:Boolean(_417&_415)};
};
var _418=null;
switch(_412.toLowerCase()){
case "bold":
case "italic":
case "underline":
case "subscript":
case "superscript":
case "fontname":
case "fontsize":
case "forecolor":
case "hilitecolor":
case "justifycenter":
case "justifyfull":
case "justifyleft":
case "justifyright":
case "delete":
case "selectall":
case "toggledir":
_418=_416(_413|ie|_414|_415);
break;
case "createlink":
case "unlink":
case "removeformat":
case "inserthorizontalrule":
case "insertimage":
case "insertorderedlist":
case "insertunorderedlist":
case "indent":
case "outdent":
case "formatblock":
case "inserthtml":
case "undo":
case "redo":
case "strikethrough":
case "tabindent":
_418=_416(_413|ie|_415|_414);
break;
case "blockdirltr":
case "blockdirrtl":
case "dirltr":
case "dirrtl":
case "inlinedirltr":
case "inlinedirrtl":
_418=_416(ie);
break;
case "cut":
case "copy":
case "paste":
_418=_416(ie|_413|_414|_415);
break;
case "inserttable":
_418=_416(_413|ie);
break;
case "insertcell":
case "insertcol":
case "insertrow":
case "deletecells":
case "deletecols":
case "deleterows":
case "mergecells":
case "splitcell":
_418=_416(ie|_413);
break;
default:
return false;
}
return (has("ie")&&_418.ie)||(has("mozilla")&&_418.mozilla)||(has("webkit")&&_418.webkit)||(has("opera")&&_418.opera);
},execCommand:function(_419,_41a){
var _41b;
this.focus();
_419=this._normalizeCommand(_419,_41a);
if(_41a!==undefined){
if(_419==="heading"){
throw new Error("unimplemented");
}else{
if((_419==="formatblock")&&has("ie")){
_41a="<"+_41a+">";
}
}
}
var _41c="_"+_419+"Impl";
if(this[_41c]){
_41b=this[_41c](_41a);
}else{
_41a=arguments.length>1?_41a:null;
if(_41a||_419!=="createlink"){
_41b=this.document.execCommand(_419,false,_41a);
}
}
this.onDisplayChanged();
return _41b;
},queryCommandEnabled:function(_41d){
if(this.disabled||!this._disabledOK){
return false;
}
_41d=this._normalizeCommand(_41d);
var _41e="_"+_41d+"EnabledImpl";
if(this[_41e]){
return this[_41e](_41d);
}else{
return this._browserQueryCommandEnabled(_41d);
}
},queryCommandState:function(_41f){
if(this.disabled||!this._disabledOK){
return false;
}
_41f=this._normalizeCommand(_41f);
try{
return this.document.queryCommandState(_41f);
}
catch(e){
return false;
}
},queryCommandValue:function(_420){
if(this.disabled||!this._disabledOK){
return false;
}
var r;
_420=this._normalizeCommand(_420);
if(has("ie")&&_420==="formatblock"){
r=this._native2LocalFormatNames[this.document.queryCommandValue(_420)];
}else{
if(has("mozilla")&&_420==="hilitecolor"){
var _421;
try{
_421=this.document.queryCommandValue("styleWithCSS");
}
catch(e){
_421=false;
}
this.document.execCommand("styleWithCSS",false,true);
r=this.document.queryCommandValue(_420);
this.document.execCommand("styleWithCSS",false,_421);
}else{
r=this.document.queryCommandValue(_420);
}
}
return r;
},_sCall:function(name,args){
return win.withGlobal(this.window,name,_3e5,args);
},placeCursorAtStart:function(){
this.focus();
var _422=false;
if(has("mozilla")){
var _423=this.editNode.firstChild;
while(_423){
if(_423.nodeType===3){
if(_423.nodeValue.replace(/^\s+|\s+$/g,"").length>0){
_422=true;
this._sCall("selectElement",[_423]);
break;
}
}else{
if(_423.nodeType===1){
_422=true;
var tg=_423.tagName?_423.tagName.toLowerCase():"";
if(/br|input|img|base|meta|area|basefont|hr|link/.test(tg)){
this._sCall("selectElement",[_423]);
}else{
this._sCall("selectElementChildren",[_423]);
}
break;
}
}
_423=_423.nextSibling;
}
}else{
_422=true;
this._sCall("selectElementChildren",[this.editNode]);
}
if(_422){
this._sCall("collapse",[true]);
}
},placeCursorAtEnd:function(){
this.focus();
var _424=false;
if(has("mozilla")){
var last=this.editNode.lastChild;
while(last){
if(last.nodeType===3){
if(last.nodeValue.replace(/^\s+|\s+$/g,"").length>0){
_424=true;
this._sCall("selectElement",[last]);
break;
}
}else{
if(last.nodeType===1){
_424=true;
this._sCall("selectElement",[last.lastChild||last]);
break;
}
}
last=last.previousSibling;
}
}else{
_424=true;
this._sCall("selectElementChildren",[this.editNode]);
}
if(_424){
this._sCall("collapse",[false]);
}
},getValue:function(_425){
if(this.textarea){
if(this.isClosed||!this.isLoaded){
return this.textarea.value;
}
}
return this._postFilterContent(null,_425);
},_getValueAttr:function(){
return this.getValue(true);
},setValue:function(html){
if(!this.isLoaded){
this.onLoadDeferred.then(lang.hitch(this,function(){
this.setValue(html);
}));
return;
}
this._cursorToStart=true;
if(this.textarea&&(this.isClosed||!this.isLoaded)){
this.textarea.value=html;
}else{
html=this._preFilterContent(html);
var node=this.isClosed?this.domNode:this.editNode;
if(html&&has("mozilla")&&html.toLowerCase()==="<p></p>"){
html="<p>&#160;</p>";
}
if(!html&&has("webkit")){
html="&#160;";
}
node.innerHTML=html;
this._preDomFilterContent(node);
}
this.onDisplayChanged();
this._set("value",this.getValue(true));
},replaceValue:function(html){
if(this.isClosed){
this.setValue(html);
}else{
if(this.window&&this.window.getSelection&&!has("mozilla")){
this.setValue(html);
}else{
if(this.window&&this.window.getSelection){
html=this._preFilterContent(html);
this.execCommand("selectall");
if(!html){
this._cursorToStart=true;
html="&#160;";
}
this.execCommand("inserthtml",html);
this._preDomFilterContent(this.editNode);
}else{
if(this.document&&this.document.selection){
this.setValue(html);
}
}
}
}
this._set("value",this.getValue(true));
},_preFilterContent:function(html){
var ec=html;
_3d3.forEach(this.contentPreFilters,function(ef){
if(ef){
ec=ef(ec);
}
});
return ec;
},_preDomFilterContent:function(dom){
dom=dom||this.editNode;
_3d3.forEach(this.contentDomPreFilters,function(ef){
if(ef&&lang.isFunction(ef)){
ef(dom);
}
},this);
},_postFilterContent:function(dom,_426){
var ec;
if(!lang.isString(dom)){
dom=dom||this.editNode;
if(this.contentDomPostFilters.length){
if(_426){
dom=lang.clone(dom);
}
_3d3.forEach(this.contentDomPostFilters,function(ef){
dom=ef(dom);
});
}
ec=_3e7.getChildrenHtml(dom);
}else{
ec=dom;
}
if(!lang.trim(ec.replace(/^\xA0\xA0*/,"").replace(/\xA0\xA0*$/,"")).length){
ec="";
}
_3d3.forEach(this.contentPostFilters,function(ef){
ec=ef(ec);
});
return ec;
},_saveContent:function(){
var _427=dom.byId(_3e9._scopeName+"._editor.RichText.value");
if(_427){
if(_427.value){
_427.value+=this._SEPARATOR;
}
_427.value+=this.name+this._NAME_CONTENT_SEP+this.getValue(true);
}
},escapeXml:function(str,_428){
str=str.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/"/gm,"&quot;");
if(!_428){
str=str.replace(/'/gm,"&#39;");
}
return str;
},getNodeHtml:function(node){
_3dd.deprecated("dijit.Editor::getNodeHtml is deprecated","use dijit/_editor/html::getNodeHtml instead",2);
return _3e7.getNodeHtml(node);
},getNodeChildrenHtml:function(dom){
_3dd.deprecated("dijit.Editor::getNodeChildrenHtml is deprecated","use dijit/_editor/html::getChildrenHtml instead",2);
return _3e7.getChildrenHtml(dom);
},close:function(save){
if(this.isClosed){
return;
}
if(!arguments.length){
save=true;
}
if(save){
this._set("value",this.getValue(true));
}
if(this.interval){
clearInterval(this.interval);
}
if(this._webkitListener){
this.disconnect(this._webkitListener);
delete this._webkitListener;
}
if(has("ie")){
this.iframe.onfocus=null;
}
this.iframe._loadFunc=null;
if(this._iframeRegHandle){
this._iframeRegHandle.remove();
delete this._iframeRegHandle;
}
if(this.textarea){
var s=this.textarea.style;
s.position="";
s.left=s.top="";
if(has("ie")){
s.overflow=this.__overflow;
this.__overflow=null;
}
this.textarea.value=this.value;
_3d9.destroy(this.domNode);
this.domNode=this.textarea;
}else{
this.domNode.innerHTML=this.value;
}
delete this.iframe;
_3d8.remove(this.domNode,this.baseClass);
this.isClosed=true;
this.isLoaded=false;
delete this.editNode;
delete this.focusNode;
if(this.window&&this.window._frameElement){
this.window._frameElement=null;
}
this.window=null;
this.document=null;
this.editingArea=null;
this.editorObject=null;
},destroy:function(){
if(!this.isClosed){
this.close(false);
}
if(this._updateTimer){
this._updateTimer.remove();
}
this.inherited(arguments);
if(_3ea._globalSaveHandler){
delete _3ea._globalSaveHandler[this.id];
}
},_removeMozBogus:function(html){
return html.replace(/\stype="_moz"/gi,"").replace(/\s_moz_dirty=""/gi,"").replace(/_moz_resizing="(true|false)"/gi,"");
},_removeWebkitBogus:function(html){
html=html.replace(/\sclass="webkit-block-placeholder"/gi,"");
html=html.replace(/\sclass="apple-style-span"/gi,"");
html=html.replace(/<meta charset=\"utf-8\" \/>/gi,"");
return html;
},_normalizeFontStyle:function(html){
return html.replace(/<(\/)?strong([ \>])/gi,"<$1b$2").replace(/<(\/)?em([ \>])/gi,"<$1i$2");
},_preFixUrlAttributes:function(html){
return html.replace(/(?:(<a(?=\s).*?\shref=)("|')(.*?)\2)|(?:(<a\s.*?href=)([^"'][^ >]+))/gi,"$1$4$2$3$5$2 _djrealurl=$2$3$5$2").replace(/(?:(<img(?=\s).*?\ssrc=)("|')(.*?)\2)|(?:(<img\s.*?src=)([^"'][^ >]+))/gi,"$1$4$2$3$5$2 _djrealurl=$2$3$5$2");
},_browserQueryCommandEnabled:function(_429){
if(!_429){
return false;
}
var elem=has("ie")?this.document.selection.createRange():this.document;
try{
return elem.queryCommandEnabled(_429);
}
catch(e){
return false;
}
},_createlinkEnabledImpl:function(){
var _42a=true;
if(has("opera")){
var sel=this.window.getSelection();
if(sel.isCollapsed){
_42a=true;
}else{
_42a=this.document.queryCommandEnabled("createlink");
}
}else{
_42a=this._browserQueryCommandEnabled("createlink");
}
return _42a;
},_unlinkEnabledImpl:function(){
var _42b=true;
if(has("mozilla")||has("webkit")){
_42b=this._sCall("hasAncestorElement",["a"]);
}else{
_42b=this._browserQueryCommandEnabled("unlink");
}
return _42b;
},_inserttableEnabledImpl:function(){
var _42c=true;
if(has("mozilla")||has("webkit")){
_42c=true;
}else{
_42c=this._browserQueryCommandEnabled("inserttable");
}
return _42c;
},_cutEnabledImpl:function(){
var _42d=true;
if(has("webkit")){
var sel=this.window.getSelection();
if(sel){
sel=sel.toString();
}
_42d=!!sel;
}else{
_42d=this._browserQueryCommandEnabled("cut");
}
return _42d;
},_copyEnabledImpl:function(){
var _42e=true;
if(has("webkit")){
var sel=this.window.getSelection();
if(sel){
sel=sel.toString();
}
_42e=!!sel;
}else{
_42e=this._browserQueryCommandEnabled("copy");
}
return _42e;
},_pasteEnabledImpl:function(){
var _42f=true;
if(has("webkit")){
return true;
}else{
_42f=this._browserQueryCommandEnabled("paste");
}
return _42f;
},_inserthorizontalruleImpl:function(_430){
if(has("ie")){
return this._inserthtmlImpl("<hr>");
}
return this.document.execCommand("inserthorizontalrule",false,_430);
},_unlinkImpl:function(_431){
if((this.queryCommandEnabled("unlink"))&&(has("mozilla")||has("webkit"))){
var a=this._sCall("getAncestorElement",["a"]);
this._sCall("selectElement",[a]);
return this.document.execCommand("unlink",false,null);
}
return this.document.execCommand("unlink",false,_431);
},_hilitecolorImpl:function(_432){
var _433;
var _434=this._handleTextColorOrProperties("hilitecolor",_432);
if(!_434){
if(has("mozilla")){
this.document.execCommand("styleWithCSS",false,true);
_433=this.document.execCommand("hilitecolor",false,_432);
this.document.execCommand("styleWithCSS",false,false);
}else{
_433=this.document.execCommand("hilitecolor",false,_432);
}
}
return _433;
},_backcolorImpl:function(_435){
if(has("ie")){
_435=_435?_435:null;
}
var _436=this._handleTextColorOrProperties("backcolor",_435);
if(!_436){
_436=this.document.execCommand("backcolor",false,_435);
}
return _436;
},_forecolorImpl:function(_437){
if(has("ie")){
_437=_437?_437:null;
}
var _438=false;
_438=this._handleTextColorOrProperties("forecolor",_437);
if(!_438){
_438=this.document.execCommand("forecolor",false,_437);
}
return _438;
},_inserthtmlImpl:function(_439){
_439=this._preFilterContent(_439);
var rv=true;
if(has("ie")){
var _43a=this.document.selection.createRange();
if(this.document.selection.type.toUpperCase()==="CONTROL"){
var n=_43a.item(0);
while(_43a.length){
_43a.remove(_43a.item(0));
}
n.outerHTML=_439;
}else{
_43a.pasteHTML(_439);
}
_43a.select();
}else{
if(has("mozilla")&&!_439.length){
this._sCall("remove");
}else{
rv=this.document.execCommand("inserthtml",false,_439);
}
}
return rv;
},_boldImpl:function(_43b){
var _43c=false;
if(has("ie")){
this._adaptIESelection();
_43c=this._adaptIEFormatAreaAndExec("bold");
}
if(!_43c){
_43c=this.document.execCommand("bold",false,_43b);
}
return _43c;
},_italicImpl:function(_43d){
var _43e=false;
if(has("ie")){
this._adaptIESelection();
_43e=this._adaptIEFormatAreaAndExec("italic");
}
if(!_43e){
_43e=this.document.execCommand("italic",false,_43d);
}
return _43e;
},_underlineImpl:function(_43f){
var _440=false;
if(has("ie")){
this._adaptIESelection();
_440=this._adaptIEFormatAreaAndExec("underline");
}
if(!_440){
_440=this.document.execCommand("underline",false,_43f);
}
return _440;
},_strikethroughImpl:function(_441){
var _442=false;
if(has("ie")){
this._adaptIESelection();
_442=this._adaptIEFormatAreaAndExec("strikethrough");
}
if(!_442){
_442=this.document.execCommand("strikethrough",false,_441);
}
return _442;
},_superscriptImpl:function(_443){
var _444=false;
if(has("ie")){
this._adaptIESelection();
_444=this._adaptIEFormatAreaAndExec("superscript");
}
if(!_444){
_444=this.document.execCommand("superscript",false,_443);
}
return _444;
},_subscriptImpl:function(_445){
var _446=false;
if(has("ie")){
this._adaptIESelection();
_446=this._adaptIEFormatAreaAndExec("subscript");
}
if(!_446){
_446=this.document.execCommand("subscript",false,_445);
}
return _446;
},_fontnameImpl:function(_447){
var _448;
if(has("ie")){
_448=this._handleTextColorOrProperties("fontname",_447);
}
if(!_448){
_448=this.document.execCommand("fontname",false,_447);
}
return _448;
},_fontsizeImpl:function(_449){
var _44a;
if(has("ie")){
_44a=this._handleTextColorOrProperties("fontsize",_449);
}
if(!_44a){
_44a=this.document.execCommand("fontsize",false,_449);
}
return _44a;
},_insertorderedlistImpl:function(_44b){
var _44c=false;
if(has("ie")){
_44c=this._adaptIEList("insertorderedlist",_44b);
}
if(!_44c){
_44c=this.document.execCommand("insertorderedlist",false,_44b);
}
return _44c;
},_insertunorderedlistImpl:function(_44d){
var _44e=false;
if(has("ie")){
_44e=this._adaptIEList("insertunorderedlist",_44d);
}
if(!_44e){
_44e=this.document.execCommand("insertunorderedlist",false,_44d);
}
return _44e;
},getHeaderHeight:function(){
return this._getNodeChildrenHeight(this.header);
},getFooterHeight:function(){
return this._getNodeChildrenHeight(this.footer);
},_getNodeChildrenHeight:function(node){
var h=0;
if(node&&node.childNodes){
var i;
for(i=0;i<node.childNodes.length;i++){
var size=_3da.position(node.childNodes[i]);
h+=size.h;
}
}
return h;
},_isNodeEmpty:function(node,_44f){
if(node.nodeType===1){
if(node.childNodes.length>0){
return this._isNodeEmpty(node.childNodes[0],_44f);
}
return true;
}else{
if(node.nodeType===3){
return (node.nodeValue.substring(_44f)==="");
}
}
return false;
},_removeStartingRangeFromRange:function(node,_450){
if(node.nextSibling){
_450.setStart(node.nextSibling,0);
}else{
var _451=node.parentNode;
while(_451&&_451.nextSibling==null){
_451=_451.parentNode;
}
if(_451){
_450.setStart(_451.nextSibling,0);
}
}
return _450;
},_adaptIESelection:function(){
var _452=_3e6.getSelection(this.window);
if(_452&&_452.rangeCount&&!_452.isCollapsed){
var _453=_452.getRangeAt(0);
var _454=_453.startContainer;
var _455=_453.startOffset;
while(_454.nodeType===3&&_455>=_454.length&&_454.nextSibling){
_455=_455-_454.length;
_454=_454.nextSibling;
}
var _456=null;
while(this._isNodeEmpty(_454,_455)&&_454!==_456){
_456=_454;
_453=this._removeStartingRangeFromRange(_454,_453);
_454=_453.startContainer;
_455=0;
}
_452.removeAllRanges();
_452.addRange(_453);
}
},_adaptIEFormatAreaAndExec:function(_457){
var _458=_3e6.getSelection(this.window);
var doc=this.document;
var rs,ret,_459,txt,_45a,_45b,_45c,_45d;
if(_457&&_458&&_458.isCollapsed){
var _45e=this.queryCommandValue(_457);
if(_45e){
var _45f=this._tagNamesForCommand(_457);
_459=_458.getRangeAt(0);
var fs=_459.startContainer;
if(fs.nodeType===3){
var _460=_459.endOffset;
if(fs.length<_460){
ret=this._adjustNodeAndOffset(rs,_460);
fs=ret.node;
_460=ret.offset;
}
}
var _461;
while(fs&&fs!==this.editNode){
var _462=fs.tagName?fs.tagName.toLowerCase():"";
if(_3d3.indexOf(_45f,_462)>-1){
_461=fs;
break;
}
fs=fs.parentNode;
}
if(_461){
rs=_459.startContainer;
var _463=doc.createElement(_461.tagName);
_3d9.place(_463,_461,"after");
if(rs&&rs.nodeType===3){
var _464,_465;
var _466=_459.endOffset;
if(rs.length<_466){
ret=this._adjustNodeAndOffset(rs,_466);
rs=ret.node;
_466=ret.offset;
}
txt=rs.nodeValue;
_45a=doc.createTextNode(txt.substring(0,_466));
var _467=txt.substring(_466,txt.length);
if(_467){
_45b=doc.createTextNode(_467);
}
_3d9.place(_45a,rs,"before");
if(_45b){
_45c=doc.createElement("span");
_45c.className="ieFormatBreakerSpan";
_3d9.place(_45c,rs,"after");
_3d9.place(_45b,_45c,"after");
_45b=_45c;
}
_3d9.destroy(rs);
var _468=_45a.parentNode;
var _469=[];
var _46a;
while(_468!==_461){
var tg=_468.tagName;
_46a={tagName:tg};
_469.push(_46a);
var _46b=doc.createElement(tg);
if(_468.style){
if(_46b.style){
if(_468.style.cssText){
_46b.style.cssText=_468.style.cssText;
_46a.cssText=_468.style.cssText;
}
}
}
if(_468.tagName==="FONT"){
if(_468.color){
_46b.color=_468.color;
_46a.color=_468.color;
}
if(_468.face){
_46b.face=_468.face;
_46a.face=_468.face;
}
if(_468.size){
_46b.size=_468.size;
_46a.size=_468.size;
}
}
if(_468.className){
_46b.className=_468.className;
_46a.className=_468.className;
}
if(_45b){
_464=_45b;
while(_464){
_465=_464.nextSibling;
_46b.appendChild(_464);
_464=_465;
}
}
if(_46b.tagName==_468.tagName){
_45c=doc.createElement("span");
_45c.className="ieFormatBreakerSpan";
_3d9.place(_45c,_468,"after");
_3d9.place(_46b,_45c,"after");
}else{
_3d9.place(_46b,_468,"after");
}
_45a=_468;
_45b=_46b;
_468=_468.parentNode;
}
if(_45b){
_464=_45b;
if(_464.nodeType===1||(_464.nodeType===3&&_464.nodeValue)){
_463.innerHTML="";
}
while(_464){
_465=_464.nextSibling;
_463.appendChild(_464);
_464=_465;
}
}
var _46c;
if(_469.length){
_46a=_469.pop();
var _46d=doc.createElement(_46a.tagName);
if(_46a.cssText&&_46d.style){
_46d.style.cssText=_46a.cssText;
}
if(_46a.className){
_46d.className=_46a.className;
}
if(_46a.tagName==="FONT"){
if(_46a.color){
_46d.color=_46a.color;
}
if(_46a.face){
_46d.face=_46a.face;
}
if(_46a.size){
_46d.size=_46a.size;
}
}
_3d9.place(_46d,_463,"before");
while(_469.length){
_46a=_469.pop();
var _46e=doc.createElement(_46a.tagName);
if(_46a.cssText&&_46e.style){
_46e.style.cssText=_46a.cssText;
}
if(_46a.className){
_46e.className=_46a.className;
}
if(_46a.tagName==="FONT"){
if(_46a.color){
_46e.color=_46a.color;
}
if(_46a.face){
_46e.face=_46a.face;
}
if(_46a.size){
_46e.size=_46a.size;
}
}
_46d.appendChild(_46e);
_46d=_46e;
}
_45d=doc.createTextNode(".");
_45c.appendChild(_45d);
_46d.appendChild(_45d);
_46c=_3e6.create(this.window);
_46c.setStart(_45d,0);
_46c.setEnd(_45d,_45d.length);
_458.removeAllRanges();
_458.addRange(_46c);
this._sCall("collapse",[false]);
_45d.parentNode.innerHTML="";
}else{
_45c=doc.createElement("span");
_45c.className="ieFormatBreakerSpan";
_45d=doc.createTextNode(".");
_45c.appendChild(_45d);
_3d9.place(_45c,_463,"before");
_46c=_3e6.create(this.window);
_46c.setStart(_45d,0);
_46c.setEnd(_45d,_45d.length);
_458.removeAllRanges();
_458.addRange(_46c);
this._sCall("collapse",[false]);
_45d.parentNode.innerHTML="";
}
if(!_463.firstChild){
_3d9.destroy(_463);
}
return true;
}
}
return false;
}else{
_459=_458.getRangeAt(0);
rs=_459.startContainer;
if(rs&&rs.nodeType===3){
var _460=_459.startOffset;
if(rs.length<_460){
ret=this._adjustNodeAndOffset(rs,_460);
rs=ret.node;
_460=ret.offset;
}
txt=rs.nodeValue;
_45a=doc.createTextNode(txt.substring(0,_460));
var _467=txt.substring(_460);
if(_467!==""){
_45b=doc.createTextNode(txt.substring(_460));
}
_45c=doc.createElement("span");
_45d=doc.createTextNode(".");
_45c.appendChild(_45d);
if(_45a.length){
_3d9.place(_45a,rs,"after");
}else{
_45a=rs;
}
_3d9.place(_45c,_45a,"after");
if(_45b){
_3d9.place(_45b,_45c,"after");
}
_3d9.destroy(rs);
var _46c=_3e6.create(this.window);
_46c.setStart(_45d,0);
_46c.setEnd(_45d,_45d.length);
_458.removeAllRanges();
_458.addRange(_46c);
doc.execCommand(_457);
_3d9.place(_45c.firstChild,_45c,"before");
_3d9.destroy(_45c);
_46c.setStart(_45d,0);
_46c.setEnd(_45d,_45d.length);
_458.removeAllRanges();
_458.addRange(_46c);
this._sCall("collapse",[false]);
_45d.parentNode.innerHTML="";
return true;
}
}
}else{
return false;
}
},_adaptIEList:function(_46f){
var _470=_3e6.getSelection(this.window);
if(_470.isCollapsed){
if(_470.rangeCount&&!this.queryCommandValue(_46f)){
var _471=_470.getRangeAt(0);
var sc=_471.startContainer;
if(sc&&sc.nodeType==3){
if(!_471.startOffset){
var _472="ul";
if(_46f==="insertorderedlist"){
_472="ol";
}
var list=this.document.createElement(_472);
var li=_3d9.create("li",null,list);
_3d9.place(list,sc,"before");
li.appendChild(sc);
_3d9.create("br",null,list,"after");
var _473=_3e6.create(this.window);
_473.setStart(sc,0);
_473.setEnd(sc,sc.length);
_470.removeAllRanges();
_470.addRange(_473);
this._sCall("collapse",[true]);
return true;
}
}
}
}
return false;
},_handleTextColorOrProperties:function(_474,_475){
var _476=_3e6.getSelection(this.window);
var doc=this.document;
var rs,ret,_477,txt,_478,_479,_47a,_47b;
_475=_475||null;
if(_474&&_476&&_476.isCollapsed){
if(_476.rangeCount){
_477=_476.getRangeAt(0);
rs=_477.startContainer;
if(rs&&rs.nodeType===3){
var _47c=_477.startOffset;
if(rs.length<_47c){
ret=this._adjustNodeAndOffset(rs,_47c);
rs=ret.node;
_47c=ret.offset;
}
txt=rs.nodeValue;
_478=doc.createTextNode(txt.substring(0,_47c));
var _47d=txt.substring(_47c);
if(_47d!==""){
_479=doc.createTextNode(txt.substring(_47c));
}
_47a=doc.createElement("span");
_47b=doc.createTextNode(".");
_47a.appendChild(_47b);
var _47e=doc.createElement("span");
_47a.appendChild(_47e);
if(_478.length){
_3d9.place(_478,rs,"after");
}else{
_478=rs;
}
_3d9.place(_47a,_478,"after");
if(_479){
_3d9.place(_479,_47a,"after");
}
_3d9.destroy(rs);
var _47f=_3e6.create(this.window);
_47f.setStart(_47b,0);
_47f.setEnd(_47b,_47b.length);
_476.removeAllRanges();
_476.addRange(_47f);
if(has("webkit")){
var _480="color";
if(_474==="hilitecolor"||_474==="backcolor"){
_480="backgroundColor";
}
_3db.set(_47a,_480,_475);
this._sCall("remove",[]);
_3d9.destroy(_47e);
_47a.innerHTML="&#160;";
this._sCall("selectElement",[_47a]);
this.focus();
}else{
this.execCommand(_474,_475);
_3d9.place(_47a.firstChild,_47a,"before");
_3d9.destroy(_47a);
_47f.setStart(_47b,0);
_47f.setEnd(_47b,_47b.length);
_476.removeAllRanges();
_476.addRange(_47f);
this._sCall("collapse",[false]);
_47b.parentNode.removeChild(_47b);
}
return true;
}
}
}
return false;
},_adjustNodeAndOffset:function(node,_481){
while(node.length<_481&&node.nextSibling&&node.nextSibling.nodeType===3){
_481=_481-node.length;
node=node.nextSibling;
}
return {"node":node,"offset":_481};
},_tagNamesForCommand:function(_482){
if(_482==="bold"){
return ["b","strong"];
}else{
if(_482==="italic"){
return ["i","em"];
}else{
if(_482==="strikethrough"){
return ["s","strike"];
}else{
if(_482==="superscript"){
return ["sup"];
}else{
if(_482==="subscript"){
return ["sub"];
}else{
if(_482==="underline"){
return ["u"];
}
}
}
}
}
}
return [];
},_stripBreakerNodes:function(node){
if(!this.isLoaded){
return;
}
_3de(".ieFormatBreakerSpan",node).forEach(function(b){
while(b.firstChild){
_3d9.place(b.firstChild,b,"before");
}
_3d9.destroy(b);
});
return node;
}});
return _3ea;
});
},"dojo/dnd/Moveable":function(){
define(["../_base/array","../_base/declare","../_base/event","../_base/lang","../dom","../dom-class","../Evented","../on","../topic","../touch","./common","./Mover","../_base/window"],function(_483,_484,_485,lang,dom,_486,_487,on,_488,_489,dnd,_48a,win){
var _48b=_484("dojo.dnd.Moveable",[_487],{handle:"",delay:0,skip:false,constructor:function(node,_48c){
this.node=dom.byId(node);
if(!_48c){
_48c={};
}
this.handle=_48c.handle?dom.byId(_48c.handle):null;
if(!this.handle){
this.handle=this.node;
}
this.delay=_48c.delay>0?_48c.delay:0;
this.skip=_48c.skip;
this.mover=_48c.mover?_48c.mover:_48a;
this.events=[on(this.handle,_489.press,lang.hitch(this,"onMouseDown")),on(this.handle,"dragstart",lang.hitch(this,"onSelectStart")),on(this.handle,"selectstart",lang.hitch(this,"onSelectStart"))];
},markupFactory:function(_48d,node,Ctor){
return new Ctor(node,_48d);
},destroy:function(){
_483.forEach(this.events,function(_48e){
_48e.remove();
});
this.events=this.node=this.handle=null;
},onMouseDown:function(e){
if(this.skip&&dnd.isFormElement(e)){
return;
}
if(this.delay){
this.events.push(on(this.handle,_489.move,lang.hitch(this,"onMouseMove")),on(this.handle,_489.release,lang.hitch(this,"onMouseUp")));
this._lastX=e.pageX;
this._lastY=e.pageY;
}else{
this.onDragDetected(e);
}
_485.stop(e);
},onMouseMove:function(e){
if(Math.abs(e.pageX-this._lastX)>this.delay||Math.abs(e.pageY-this._lastY)>this.delay){
this.onMouseUp(e);
this.onDragDetected(e);
}
_485.stop(e);
},onMouseUp:function(e){
for(var i=0;i<2;++i){
this.events.pop().remove();
}
_485.stop(e);
},onSelectStart:function(e){
if(!this.skip||!dnd.isFormElement(e)){
_485.stop(e);
}
},onDragDetected:function(e){
new this.mover(this.node,e,this);
},onMoveStart:function(_48f){
_488.publish("/dnd/move/start",_48f);
_486.add(win.body(),"dojoMove");
_486.add(this.node,"dojoMoveItem");
},onMoveStop:function(_490){
_488.publish("/dnd/move/stop",_490);
_486.remove(win.body(),"dojoMove");
_486.remove(this.node,"dojoMoveItem");
},onFirstMove:function(){
},onMove:function(_491,_492){
this.onMoving(_491,_492);
var s=_491.node.style;
s.left=_492.l+"px";
s.top=_492.t+"px";
this.onMoved(_491,_492);
},onMoving:function(){
},onMoved:function(){
}});
return _48b;
});
},"dijit/TooltipDialog":function(){
define(["dojo/_base/declare","dojo/dom-class","dojo/_base/event","dojo/keys","dojo/_base/lang","./focus","./layout/ContentPane","./_DialogMixin","./form/_FormMixin","./_TemplatedMixin","dojo/text!./templates/TooltipDialog.html","./main"],function(_493,_494,_495,keys,lang,_496,_497,_498,_499,_49a,_49b,_49c){
return _493("dijit.TooltipDialog",[_497,_49a,_499,_498],{title:"",doLayout:false,autofocus:true,baseClass:"dijitTooltipDialog",_firstFocusItem:null,_lastFocusItem:null,templateString:_49b,_setTitleAttr:function(_49d){
this.containerNode.title=_49d;
this._set("title",_49d);
},postCreate:function(){
this.inherited(arguments);
this.connect(this.containerNode,"onkeypress","_onKey");
},orient:function(node,_49e,_49f){
var newC={"MR-ML":"dijitTooltipRight","ML-MR":"dijitTooltipLeft","TM-BM":"dijitTooltipAbove","BM-TM":"dijitTooltipBelow","BL-TL":"dijitTooltipBelow dijitTooltipABLeft","TL-BL":"dijitTooltipAbove dijitTooltipABLeft","BR-TR":"dijitTooltipBelow dijitTooltipABRight","TR-BR":"dijitTooltipAbove dijitTooltipABRight","BR-BL":"dijitTooltipRight","BL-BR":"dijitTooltipLeft"}[_49e+"-"+_49f];
_494.replace(this.domNode,newC,this._currentOrientClass||"");
this._currentOrientClass=newC;
},focus:function(){
this._getFocusItems(this.containerNode);
_496.focus(this._firstFocusItem);
},onOpen:function(pos){
this.orient(this.domNode,pos.aroundCorner,pos.corner);
var _4a0=pos.aroundNodePos;
if(pos.corner.charAt(0)=="M"&&pos.aroundCorner.charAt(0)=="M"){
this.connectorNode.style.top=_4a0.y+((_4a0.h-this.connectorNode.offsetHeight)>>1)-pos.y+"px";
this.connectorNode.style.left="";
}else{
if(pos.corner.charAt(1)=="M"&&pos.aroundCorner.charAt(1)=="M"){
this.connectorNode.style.left=_4a0.x+((_4a0.w-this.connectorNode.offsetWidth)>>1)-pos.x+"px";
}
}
this._onShow();
},onClose:function(){
this.onHide();
},_onKey:function(evt){
var node=evt.target;
if(evt.charOrCode===keys.TAB){
this._getFocusItems(this.containerNode);
}
var _4a1=(this._firstFocusItem==this._lastFocusItem);
if(evt.charOrCode==keys.ESCAPE){
this.defer("onCancel");
_495.stop(evt);
}else{
if(node==this._firstFocusItem&&evt.shiftKey&&evt.charOrCode===keys.TAB){
if(!_4a1){
_496.focus(this._lastFocusItem);
}
_495.stop(evt);
}else{
if(node==this._lastFocusItem&&evt.charOrCode===keys.TAB&&!evt.shiftKey){
if(!_4a1){
_496.focus(this._firstFocusItem);
}
_495.stop(evt);
}else{
if(evt.charOrCode===keys.TAB){
evt.stopPropagation();
}
}
}
}
}});
});
},"dojo/store/util/SimpleQueryEngine":function(){
define(["../../_base/array"],function(_4a2){
return function(_4a3,_4a4){
switch(typeof _4a3){
default:
throw new Error("Can not query with a "+typeof _4a3);
case "object":
case "undefined":
var _4a5=_4a3;
_4a3=function(_4a6){
for(var key in _4a5){
var _4a7=_4a5[key];
if(_4a7&&_4a7.test){
if(!_4a7.test(_4a6[key],_4a6)){
return false;
}
}else{
if(_4a7!=_4a6[key]){
return false;
}
}
}
return true;
};
break;
case "string":
if(!this[_4a3]){
throw new Error("No filter function "+_4a3+" was found in store");
}
_4a3=this[_4a3];
case "function":
}
function _4a8(_4a9){
var _4aa=_4a2.filter(_4a9,_4a3);
var _4ab=_4a4&&_4a4.sort;
if(_4ab){
_4aa.sort(typeof _4ab=="function"?_4ab:function(a,b){
for(var sort,i=0;sort=_4ab[i];i++){
var _4ac=a[sort.attribute];
var _4ad=b[sort.attribute];
if(_4ac!=_4ad){
return !!sort.descending==(_4ac==null||_4ac>_4ad)?-1:1;
}
}
return 0;
});
}
if(_4a4&&(_4a4.start||_4a4.count)){
var _4ae=_4aa.length;
_4aa=_4aa.slice(_4a4.start||0,(_4a4.start||0)+(_4a4.count||Infinity));
_4aa.total=_4ae;
}
return _4aa;
};
_4a8.matches=_4a3;
return _4a8;
};
});
},"dijit/form/_ExpandingTextAreaMixin":function(){
define(["dojo/_base/declare","dojo/dom-construct","dojo/has","dojo/_base/lang","dojo/on","dojo/_base/window","../Viewport"],function(_4af,_4b0,has,lang,on,win,_4b1){
has.add("textarea-needs-help-shrinking",function(){
var body=win.body(),te=_4b0.create("textarea",{rows:"5",cols:"20",value:" ",style:{zoom:1,overflow:"hidden",visibility:"hidden",position:"absolute",border:"0px solid black",padding:"0px"}},body,"last");
var _4b2=te.scrollHeight>=te.clientHeight;
body.removeChild(te);
return _4b2;
});
return _4af("dijit.form._ExpandingTextAreaMixin",null,{_setValueAttr:function(){
this.inherited(arguments);
this.resize();
},postCreate:function(){
this.inherited(arguments);
var _4b3=this.textbox;
this.own(on(_4b3,"scroll, focus",lang.hitch(this,"_resizeLater")));
_4b3.style.overflowY="hidden";
this._estimateHeight();
},startup:function(){
this.inherited(arguments);
this.own(_4b1.on("resize",lang.hitch(this,"_resizeLater")));
this._resizeLater();
},_onInput:function(e){
this.inherited(arguments);
this.resize();
},_estimateHeight:function(){
var _4b4=this.textbox;
_4b4.style.height="auto";
_4b4.rows=(_4b4.value.match(/\n/g)||[]).length+2;
},_resizeLater:function(){
this.defer("resize");
},resize:function(){
var _4b5=this.textbox;
function _4b6(){
var _4b7=false;
if(_4b5.value===""){
_4b5.value=" ";
_4b7=true;
}
var sh=_4b5.scrollHeight;
if(_4b7){
_4b5.value="";
}
return sh;
};
if(_4b5.style.overflowY=="hidden"){
_4b5.scrollTop=0;
}
if(this.busyResizing){
return;
}
this.busyResizing=true;
if(_4b6()||_4b5.offsetHeight){
var _4b8=_4b5.style.height;
if(!(/px/.test(_4b8))){
_4b8=_4b6();
_4b5.rows=1;
_4b5.style.height=_4b8+"px";
}
var newH=Math.max(Math.max(_4b5.offsetHeight,parseInt(_4b8))-_4b5.clientHeight,0)+_4b6();
var _4b9=newH+"px";
if(_4b9!=_4b5.style.height){
_4b5.rows=1;
_4b5.style.height=_4b9;
}
if(has("textarea-needs-help-shrinking")){
var _4ba=_4b6(),_4bb=_4ba,_4bc=_4b5.style.minHeight,_4bd=4,_4be;
_4b5.style.minHeight=_4b9;
_4b5.style.height="auto";
while(newH>0){
_4b5.style.minHeight=Math.max(newH-_4bd,4)+"px";
_4be=_4b6();
var _4bf=_4bb-_4be;
newH-=_4bf;
if(_4bf<_4bd){
break;
}
_4bb=_4be;
_4bd<<=1;
}
_4b5.style.height=newH+"px";
_4b5.style.minHeight=_4bc;
}
_4b5.style.overflowY=_4b6()>_4b5.clientHeight?"auto":"hidden";
}else{
this._estimateHeight();
}
this.busyResizing=false;
}});
});
},"dijit/MenuItem":function(){
define(["dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-class","dojo/_base/kernel","dojo/sniff","./_Widget","./_TemplatedMixin","./_Contained","./_CssStateMixin","dojo/text!./templates/MenuItem.html"],function(_4c0,dom,_4c1,_4c2,_4c3,has,_4c4,_4c5,_4c6,_4c7,_4c8){
return _4c0("dijit.MenuItem",[_4c4,_4c5,_4c6,_4c7],{templateString:_4c8,baseClass:"dijitMenuItem",label:"",_setLabelAttr:function(val){
this.containerNode.innerHTML=val;
this._set("label",val);
if(this.textDir==="auto"){
this.applyTextDir(this.focusNode,this.label);
}
},iconClass:"dijitNoIcon",_setIconClassAttr:{node:"iconNode",type:"class"},accelKey:"",disabled:false,_fillContent:function(_4c9){
if(_4c9&&!("label" in this.params)){
this.set("label",_4c9.innerHTML);
}
},buildRendering:function(){
this.inherited(arguments);
var _4ca=this.id+"_text";
_4c1.set(this.containerNode,"id",_4ca);
if(this.accelKeyNode){
_4c1.set(this.accelKeyNode,"id",this.id+"_accel");
_4ca+=" "+this.id+"_accel";
}
this.domNode.setAttribute("aria-labelledby",_4ca);
dom.setSelectable(this.domNode,false);
},onClick:function(){
},focus:function(){
try{
if(has("ie")==8){
this.containerNode.focus();
}
this.focusNode.focus();
}
catch(e){
}
},_onFocus:function(){
this._setSelected(true);
this.getParent()._onItemFocus(this);
this.inherited(arguments);
},_setSelected:function(_4cb){
_4c2.toggle(this.domNode,"dijitMenuItemSelected",_4cb);
},setLabel:function(_4cc){
_4c3.deprecated("dijit.MenuItem.setLabel() is deprecated.  Use set('label', ...) instead.","","2.0");
this.set("label",_4cc);
},setDisabled:function(_4cd){
_4c3.deprecated("dijit.Menu.setDisabled() is deprecated.  Use set('disabled', bool) instead.","","2.0");
this.set("disabled",_4cd);
},_setDisabledAttr:function(_4ce){
this.focusNode.setAttribute("aria-disabled",_4ce?"true":"false");
this._set("disabled",_4ce);
},_setAccelKeyAttr:function(_4cf){
this.accelKeyNode.style.display=_4cf?"":"none";
this.accelKeyNode.innerHTML=_4cf;
_4c1.set(this.containerNode,"colSpan",_4cf?"1":"2");
this._set("accelKey",_4cf);
},_setTextDirAttr:function(_4d0){
if(!this._created||this.textDir!=_4d0){
this._set("textDir",_4d0);
this.applyTextDir(this.focusNode,this.label);
}
}});
});
},"dijit/MenuBarItem":function(){
define(["dojo/_base/declare","./MenuItem","dojo/text!./templates/MenuBarItem.html"],function(_4d1,_4d2,_4d3){
var _4d4=_4d1("dijit._MenuBarItemMixin",null,{templateString:_4d3,_setIconClassAttr:null});
var _4d5=_4d1("dijit.MenuBarItem",[_4d2,_4d4],{});
_4d5._MenuBarItemMixin=_4d4;
return _4d5;
});
},"dijit/layout/TabController":function(){
define(["dojo/_base/declare","dojo/dom","dojo/dom-attr","dojo/dom-class","dojo/i18n","dojo/_base/lang","./StackController","../registry","../Menu","../MenuItem","dojo/text!./templates/_TabButton.html","dojo/i18n!../nls/common"],function(_4d6,dom,_4d7,_4d8,i18n,lang,_4d9,_4da,Menu,_4db,_4dc){
var _4dd=_4d6("dijit.layout._TabButton",_4d9.StackButton,{baseClass:"dijitTab",cssStateNodes:{closeNode:"dijitTabCloseButton"},templateString:_4dc,scrollOnFocus:false,buildRendering:function(){
this.inherited(arguments);
dom.setSelectable(this.containerNode,false);
},startup:function(){
this.inherited(arguments);
var n=this.domNode;
this.defer(function(){
n.className=n.className;
},1);
},_setCloseButtonAttr:function(disp){
this._set("closeButton",disp);
_4d8.toggle(this.domNode,"dijitClosable",disp);
this.closeNode.style.display=disp?"":"none";
if(disp){
var _4de=i18n.getLocalization("dijit","common");
if(this.closeNode){
_4d7.set(this.closeNode,"title",_4de.itemClose);
}
}
},_setDisabledAttr:function(_4df){
this.inherited(arguments);
if(this.closeNode){
if(_4df){
_4d7.remove(this.closeNode,"title");
}else{
var _4e0=i18n.getLocalization("dijit","common");
_4d7.set(this.closeNode,"title",_4e0.itemClose);
}
}
},_setLabelAttr:function(_4e1){
this.inherited(arguments);
if(!this.showLabel&&!this.params.title){
this.iconNode.alt=lang.trim(this.containerNode.innerText||this.containerNode.textContent||"");
}
}});
var _4e2=_4d6("dijit.layout.TabController",_4d9,{baseClass:"dijitTabController",templateString:"<div role='tablist' data-dojo-attach-event='onkeypress:onkeypress'></div>",tabPosition:"top",buttonWidget:_4dd,buttonWidgetCloseClass:"dijitTabCloseButton",postCreate:function(){
this.inherited(arguments);
var _4e3=new Menu({id:this.id+"_Menu",ownerDocument:this.ownerDocument,dir:this.dir,lang:this.lang,textDir:this.textDir,targetNodeIds:[this.domNode],selector:function(node){
return _4d8.contains(node,"dijitClosable")&&!_4d8.contains(node,"dijitTabDisabled");
}});
this.own(_4e3);
var _4e4=i18n.getLocalization("dijit","common"),_4e5=this;
_4e3.addChild(new _4db({label:_4e4.itemClose,ownerDocument:this.ownerDocument,dir:this.dir,lang:this.lang,textDir:this.textDir,onClick:function(evt){
var _4e6=_4da.byNode(this.getParent().currentTarget);
_4e5.onCloseButtonClick(_4e6.page);
}}));
}});
_4e2.TabButton=_4dd;
return _4e2;
});
},"dojo/cldr/supplemental":function(){
define(["../_base/lang","../i18n"],function(lang,i18n){
var _4e7={};
lang.setObject("dojo.cldr.supplemental",_4e7);
_4e7.getFirstDayOfWeek=function(_4e8){
var _4e9={bd:5,mv:5,ae:6,af:6,bh:6,dj:6,dz:6,eg:6,iq:6,ir:6,jo:6,kw:6,ly:6,ma:6,om:6,qa:6,sa:6,sd:6,sy:6,ye:6,ag:0,ar:0,as:0,au:0,br:0,bs:0,bt:0,bw:0,by:0,bz:0,ca:0,cn:0,co:0,dm:0,"do":0,et:0,gt:0,gu:0,hk:0,hn:0,id:0,ie:0,il:0,"in":0,jm:0,jp:0,ke:0,kh:0,kr:0,la:0,mh:0,mm:0,mo:0,mt:0,mx:0,mz:0,ni:0,np:0,nz:0,pa:0,pe:0,ph:0,pk:0,pr:0,py:0,sg:0,sv:0,th:0,tn:0,tt:0,tw:0,um:0,us:0,ve:0,vi:0,ws:0,za:0,zw:0};
var _4ea=_4e7._region(_4e8);
var dow=_4e9[_4ea];
return (dow===undefined)?1:dow;
};
_4e7._region=function(_4eb){
_4eb=i18n.normalizeLocale(_4eb);
var tags=_4eb.split("-");
var _4ec=tags[1];
if(!_4ec){
_4ec={de:"de",en:"us",es:"es",fi:"fi",fr:"fr",he:"il",hu:"hu",it:"it",ja:"jp",ko:"kr",nl:"nl",pt:"br",sv:"se",zh:"cn"}[tags[0]];
}else{
if(_4ec.length==4){
_4ec=tags[2];
}
}
return _4ec;
};
_4e7.getWeekend=function(_4ed){
var _4ee={"in":0,af:4,dz:4,ir:4,om:4,sa:4,ye:4,ae:5,bh:5,eg:5,il:5,iq:5,jo:5,kw:5,ly:5,ma:5,qa:5,sd:5,sy:5,tn:5},_4ef={af:5,dz:5,ir:5,om:5,sa:5,ye:5,ae:6,bh:5,eg:6,il:6,iq:6,jo:6,kw:6,ly:6,ma:6,qa:6,sd:6,sy:6,tn:6},_4f0=_4e7._region(_4ed),_4f1=_4ee[_4f0],end=_4ef[_4f0];
if(_4f1===undefined){
_4f1=6;
}
if(end===undefined){
end=0;
}
return {start:_4f1,end:end};
};
return _4e7;
});
},"dijit/MenuBar":function(){
require({cache:{"url:dijit/templates/MenuBar.html":"<div class=\"dijitMenuBar dijitMenuPassive\" data-dojo-attach-point=\"containerNode\"  role=\"menubar\" tabIndex=\"${tabIndex}\" data-dojo-attach-event=\"onkeypress: _onKeyPress\"></div>\n"}});
define("dijit/MenuBar",["dojo/_base/declare","dojo/_base/event","dojo/keys","./_MenuBase","dojo/text!./templates/MenuBar.html"],function(_4f2,_4f3,keys,_4f4,_4f5){
return _4f2("dijit.MenuBar",_4f4,{templateString:_4f5,baseClass:"dijitMenuBar",_isMenuBar:true,postCreate:function(){
this.inherited(arguments);
var l=this.isLeftToRight();
this.connectKeyNavHandlers(l?[keys.LEFT_ARROW]:[keys.RIGHT_ARROW],l?[keys.RIGHT_ARROW]:[keys.LEFT_ARROW]);
this._orient=["below"];
},_moveToPopup:function(evt){
if(this.focusedChild&&this.focusedChild.popup&&!this.focusedChild.disabled){
this.onItemClick(this.focusedChild,evt);
}
},focusChild:function(item){
var _4f6=this.focusedChild,_4f7=_4f6&&_4f6.popup&&_4f6.popup.isShowingNow;
this.inherited(arguments);
if(_4f7&&item.popup&&!item.disabled){
this._openPopup(true);
}
},_onKeyPress:function(evt){
if(evt.ctrlKey||evt.altKey){
return;
}
switch(evt.charOrCode){
case keys.DOWN_ARROW:
this._moveToPopup(evt);
_4f3.stop(evt);
}
},onItemClick:function(item,evt){
if(item.popup&&item.popup.isShowingNow&&(evt.type!=="keypress"||evt.keyCode!==keys.DOWN_ARROW)){
item.popup.onCancel();
}else{
this.inherited(arguments);
}
}});
});
},"dijit/ToolbarSeparator":function(){
define("dijit/ToolbarSeparator",["dojo/_base/declare","dojo/dom","./_Widget","./_TemplatedMixin"],function(_4f8,dom,_4f9,_4fa){
return _4f8("dijit.ToolbarSeparator",[_4f9,_4fa],{templateString:"<div class=\"dijitToolbarSeparator dijitInline\" role=\"presentation\"></div>",buildRendering:function(){
this.inherited(arguments);
dom.setSelectable(this.domNode,false);
},isFocusable:function(){
return false;
}});
});
},"dijit/layout/StackController":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dom-class","dojo/_base/event","dojo/keys","dojo/_base/lang","dojo/on","../focus","../registry","../_Widget","../_TemplatedMixin","../_Container","../form/ToggleButton","dojo/i18n!../nls/common"],function(_4fb,_4fc,_4fd,_4fe,keys,lang,on,_4ff,_500,_501,_502,_503,_504){
var _505=_4fc("dijit.layout._StackButton",_504,{tabIndex:"-1",closeButton:false,_aria_attr:"aria-selected",buildRendering:function(evt){
this.inherited(arguments);
(this.focusNode||this.domNode).setAttribute("role","tab");
}});
var _506=_4fc("dijit.layout.StackController",[_501,_502,_503],{baseClass:"dijitStackController",templateString:"<span role='tablist' data-dojo-attach-event='onkeypress'></span>",containerId:"",buttonWidget:_505,buttonWidgetCloseClass:"dijitStackCloseButton",constructor:function(_507){
this.pane2button={};
},postCreate:function(){
this.inherited(arguments);
this.subscribe(this.containerId+"-startup","onStartup");
this.subscribe(this.containerId+"-addChild","onAddChild");
this.subscribe(this.containerId+"-removeChild","onRemoveChild");
this.subscribe(this.containerId+"-selectChild","onSelectChild");
this.subscribe(this.containerId+"-containerKeyPress","onContainerKeyPress");
this.connect(this.containerNode,"click",function(evt){
var _508=_500.getEnclosingWidget(evt.target);
if(_508!=this.containerNode&&!_508.disabled&&_508.page){
for(var _509=evt.target;_509!==this.containerNode;_509=_509.parentNode){
if(_4fd.contains(_509,this.buttonWidgetCloseClass)){
this.onCloseButtonClick(_508.page);
break;
}else{
if(_509==_508.domNode){
this.onButtonClick(_508.page);
break;
}
}
}
}
});
},onStartup:function(info){
_4fb.forEach(info.children,this.onAddChild,this);
if(info.selected){
this.onSelectChild(info.selected);
}
var _50a=_500.byId(this.containerId).containerNode,_50b=this.pane2button,_50c={"title":"label","showtitle":"showLabel","iconclass":"iconClass","closable":"closeButton","tooltip":"title","disabled":"disabled"},_50d=function(attr,_50e){
return on(_50a,"attrmodified-"+attr,function(evt){
var _50f=_50b[evt.detail&&evt.detail.widget&&evt.detail.widget.id];
if(_50f){
_50f.set(_50e,evt.detail.newValue);
}
});
};
for(var attr in _50c){
this.own(_50d(attr,_50c[attr]));
}
},destroy:function(){
for(var pane in this.pane2button){
this.onRemoveChild(_500.byId(pane));
}
this.inherited(arguments);
},onAddChild:function(page,_510){
var Cls=lang.isString(this.buttonWidget)?lang.getObject(this.buttonWidget):this.buttonWidget;
var _511=new Cls({id:this.id+"_"+page.id,name:this.id+"_"+page.id,label:page.title,disabled:page.disabled,ownerDocument:this.ownerDocument,dir:page.dir,lang:page.lang,textDir:page.textDir,showLabel:page.showTitle,iconClass:page.iconClass,closeButton:page.closable,title:page.tooltip,page:page});
this.addChild(_511,_510);
this.pane2button[page.id]=_511;
page.controlButton=_511;
if(!this._currentChild){
this.onSelectChild(page);
}
},onRemoveChild:function(page){
if(this._currentChild===page){
this._currentChild=null;
}
var _512=this.pane2button[page.id];
if(_512){
this.removeChild(_512);
delete this.pane2button[page.id];
_512.destroy();
}
delete page.controlButton;
},onSelectChild:function(page){
if(!page){
return;
}
if(this._currentChild){
var _513=this.pane2button[this._currentChild.id];
_513.set("checked",false);
_513.focusNode.setAttribute("tabIndex","-1");
}
var _514=this.pane2button[page.id];
_514.set("checked",true);
this._currentChild=page;
_514.focusNode.setAttribute("tabIndex","0");
var _515=_500.byId(this.containerId);
_515.containerNode.setAttribute("aria-labelledby",_514.id);
},onButtonClick:function(page){
var _516=this.pane2button[page.id];
_4ff.focus(_516.focusNode);
if(this._currentChild&&this._currentChild.id===page.id){
_516.set("checked",true);
}
var _517=_500.byId(this.containerId);
_517.selectChild(page);
},onCloseButtonClick:function(page){
var _518=_500.byId(this.containerId);
_518.closeChild(page);
if(this._currentChild){
var b=this.pane2button[this._currentChild.id];
if(b){
_4ff.focus(b.focusNode||b.domNode);
}
}
},adjacent:function(_519){
if(!this.isLeftToRight()&&(!this.tabPosition||/top|bottom/.test(this.tabPosition))){
_519=!_519;
}
var _51a=this.getChildren();
var idx=_4fb.indexOf(_51a,this.pane2button[this._currentChild.id]),_51b=_51a[idx];
var _51c;
do{
idx=(idx+(_519?1:_51a.length-1))%_51a.length;
_51c=_51a[idx];
}while(_51c.disabled&&_51c!=_51b);
return _51c;
},onkeypress:function(e){
if(this.disabled||e.altKey){
return;
}
var _51d=null;
if(e.ctrlKey||!e._djpage){
switch(e.charOrCode){
case keys.LEFT_ARROW:
case keys.UP_ARROW:
if(!e._djpage){
_51d=false;
}
break;
case keys.PAGE_UP:
if(e.ctrlKey){
_51d=false;
}
break;
case keys.RIGHT_ARROW:
case keys.DOWN_ARROW:
if(!e._djpage){
_51d=true;
}
break;
case keys.PAGE_DOWN:
if(e.ctrlKey){
_51d=true;
}
break;
case keys.HOME:
var _51e=this.getChildren();
for(var idx=0;idx<_51e.length;idx++){
var _51f=_51e[idx];
if(!_51f.disabled){
this.onButtonClick(_51f.page);
break;
}
}
_4fe.stop(e);
break;
case keys.END:
var _51e=this.getChildren();
for(var idx=_51e.length-1;idx>=0;idx--){
var _51f=_51e[idx];
if(!_51f.disabled){
this.onButtonClick(_51f.page);
break;
}
}
_4fe.stop(e);
break;
case keys.DELETE:
if(this._currentChild.closable){
this.onCloseButtonClick(this._currentChild);
}
_4fe.stop(e);
break;
default:
if(e.ctrlKey){
if(e.charOrCode===keys.TAB){
this.onButtonClick(this.adjacent(!e.shiftKey).page);
_4fe.stop(e);
}else{
if(e.charOrCode=="w"){
if(this._currentChild.closable){
this.onCloseButtonClick(this._currentChild);
}
_4fe.stop(e);
}
}
}
}
if(_51d!==null){
this.onButtonClick(this.adjacent(_51d).page);
_4fe.stop(e);
}
}
},onContainerKeyPress:function(info){
info.e._djpage=info.page;
this.onkeypress(info.e);
}});
_506.StackButton=_505;
return _506;
});
},"url:dijit/templates/TooltipDialog.html":"<div role=\"presentation\" tabIndex=\"-1\">\n\t<div class=\"dijitTooltipContainer\" role=\"presentation\">\n\t\t<div class =\"dijitTooltipContents dijitTooltipFocusNode\" data-dojo-attach-point=\"containerNode\" role=\"dialog\"></div>\n\t</div>\n\t<div class=\"dijitTooltipConnector\" role=\"presentation\" data-dojo-attach-point=\"connectorNode\"></div>\n</div>\n","dojo/dnd/Mover":function(){
define(["../_base/array","../_base/declare","../_base/event","../_base/lang","../sniff","../_base/window","../dom","../dom-geometry","../dom-style","../Evented","../on","../touch","./common","./autoscroll"],function(_520,_521,_522,lang,has,win,dom,_523,_524,_525,on,_526,dnd,_527){
return _521("dojo.dnd.Mover",[_525],{constructor:function(node,e,host){
this.node=dom.byId(node);
this.marginBox={l:e.pageX,t:e.pageY};
this.mouseButton=e.button;
var h=(this.host=host),d=node.ownerDocument;
this.events=[on(d,_526.move,lang.hitch(this,"onFirstMove")),on(d,_526.move,lang.hitch(this,"onMouseMove")),on(d,_526.release,lang.hitch(this,"onMouseUp")),on(d,"dragstart",_522.stop),on(d.body,"selectstart",_522.stop)];
_527.autoScrollStart(d);
if(h&&h.onMoveStart){
h.onMoveStart(this);
}
},onMouseMove:function(e){
_527.autoScroll(e);
var m=this.marginBox;
this.host.onMove(this,{l:m.l+e.pageX,t:m.t+e.pageY},e);
_522.stop(e);
},onMouseUp:function(e){
if(has("webkit")&&has("mac")&&this.mouseButton==2?e.button==0:this.mouseButton==e.button){
this.destroy();
}
_522.stop(e);
},onFirstMove:function(e){
var s=this.node.style,l,t,h=this.host;
switch(s.position){
case "relative":
case "absolute":
l=Math.round(parseFloat(s.left))||0;
t=Math.round(parseFloat(s.top))||0;
break;
default:
s.position="absolute";
var m=_523.getMarginBox(this.node);
var b=win.doc.body;
var bs=_524.getComputedStyle(b);
var bm=_523.getMarginBox(b,bs);
var bc=_523.getContentBox(b,bs);
l=m.l-(bc.l-bm.l);
t=m.t-(bc.t-bm.t);
break;
}
this.marginBox.l=l-this.marginBox.l;
this.marginBox.t=t-this.marginBox.t;
if(h&&h.onFirstMove){
h.onFirstMove(this,e);
}
this.events.shift().remove();
},destroy:function(){
_520.forEach(this.events,function(_528){
_528.remove();
});
var h=this.host;
if(h&&h.onMoveStop){
h.onMoveStop(this);
}
this.events=this.node=this.host=null;
}});
});
},"dijit/form/HorizontalRule":function(){
define(["dojo/_base/declare","../_Widget","../_TemplatedMixin"],function(_529,_52a,_52b){
return _529("dijit.form.HorizontalRule",[_52a,_52b],{templateString:"<div class=\"dijitRuleContainer dijitRuleContainerH\"></div>",count:3,container:"containerNode",ruleStyle:"",_positionPrefix:"<div class=\"dijitRuleMark dijitRuleMarkH\" style=\"left:",_positionSuffix:"%;",_suffix:"\"></div>",_genHTML:function(pos){
return this._positionPrefix+pos+this._positionSuffix+this.ruleStyle+this._suffix;
},_isHorizontal:true,buildRendering:function(){
this.inherited(arguments);
var _52c;
if(this.count==1){
_52c=this._genHTML(50,0);
}else{
var i;
var _52d=100/(this.count-1);
if(!this._isHorizontal||this.isLeftToRight()){
_52c=this._genHTML(0,0);
for(i=1;i<this.count-1;i++){
_52c+=this._genHTML(_52d*i,i);
}
_52c+=this._genHTML(100,this.count-1);
}else{
_52c=this._genHTML(100,0);
for(i=1;i<this.count-1;i++){
_52c+=this._genHTML(100-_52d*i,i);
}
_52c+=this._genHTML(0,this.count-1);
}
}
this.domNode.innerHTML=_52c;
}});
});
},"dijit/layout/TabContainer":function(){
define(["dojo/_base/lang","dojo/_base/declare","./_TabContainerBase","./TabController","./ScrollingTabController"],function(lang,_52e,_52f,_530,_531){
return _52e("dijit.layout.TabContainer",_52f,{useMenu:true,useSlider:true,controllerWidget:"",_makeController:function(_532){
var cls=this.baseClass+"-tabs"+(this.doLayout?"":" dijitTabNoLayout"),_530=typeof this.controllerWidget=="string"?lang.getObject(this.controllerWidget):this.controllerWidget;
return new _530({id:this.id+"_tablist",ownerDocument:this.ownerDocument,dir:this.dir,lang:this.lang,textDir:this.textDir,tabPosition:this.tabPosition,doLayout:this.doLayout,containerId:this.id,"class":cls,nested:this.nested,useMenu:this.useMenu,useSlider:this.useSlider,tabStripClass:this.tabStrip?this.baseClass+(this.tabStrip?"":"No")+"Strip":null},_532);
},postMixInProperties:function(){
this.inherited(arguments);
if(!this.controllerWidget){
this.controllerWidget=(this.tabPosition=="top"||this.tabPosition=="bottom")&&!this.nested?_531:_530;
}
}});
});
},"url:dijit/templates/Menu.html":"<table class=\"dijit dijitMenu dijitMenuPassive dijitReset dijitMenuTable\" role=\"menu\" tabIndex=\"${tabIndex}\"\n\t   data-dojo-attach-event=\"onkeypress:_onKeyPress\" cellspacing=\"0\">\n\t<tbody class=\"dijitReset\" data-dojo-attach-point=\"containerNode\"></tbody>\n</table>\n","dijit/form/_Spinner":function(){
define(["dojo/_base/declare","dojo/_base/event","dojo/keys","dojo/_base/lang","dojo/sniff","dojo/mouse","../typematic","./RangeBoundTextBox","dojo/text!./templates/Spinner.html","./_TextBoxMixin"],function(_533,_534,keys,lang,has,_535,_536,_537,_538,_539){
return _533("dijit.form._Spinner",_537,{defaultTimeout:500,minimumTimeout:10,timeoutChangeRate:0.9,smallDelta:1,largeDelta:10,templateString:_538,baseClass:"dijitTextBox dijitSpinner",cssStateNodes:{"upArrowNode":"dijitUpArrowButton","downArrowNode":"dijitDownArrowButton"},adjust:function(val){
return val;
},_arrowPressed:function(_53a,_53b,_53c){
if(this.disabled||this.readOnly){
return;
}
this._setValueAttr(this.adjust(this.get("value"),_53b*_53c),false);
_539.selectInputText(this.textbox,this.textbox.value.length);
},_arrowReleased:function(){
this._wheelTimer=null;
},_typematicCallback:function(_53d,node,evt){
var inc=this.smallDelta;
if(node==this.textbox){
var key=evt.charOrCode;
inc=(key==keys.PAGE_UP||key==keys.PAGE_DOWN)?this.largeDelta:this.smallDelta;
node=(key==keys.UP_ARROW||key==keys.PAGE_UP)?this.upArrowNode:this.downArrowNode;
}
if(_53d==-1){
this._arrowReleased(node);
}else{
this._arrowPressed(node,(node==this.upArrowNode)?1:-1,inc);
}
},_wheelTimer:null,_mouseWheeled:function(evt){
_534.stop(evt);
var _53e=evt.wheelDelta/120;
if(Math.floor(_53e)!=_53e){
_53e=evt.wheelDelta>0?1:-1;
}
var _53f=evt.detail?(evt.detail*-1):_53e;
if(_53f!==0){
var node=this[(_53f>0?"upArrowNode":"downArrowNode")];
this._arrowPressed(node,_53f,this.smallDelta);
if(this._wheelTimer){
this._wheelTimer.remove();
}
this._wheelTimer=this.defer(function(){
this._arrowReleased(node);
},50);
}
},postCreate:function(){
this.inherited(arguments);
this.connect(this.domNode,_535.wheel,"_mouseWheeled");
this.own(_536.addListener(this.upArrowNode,this.textbox,{charOrCode:keys.UP_ARROW,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false},this,"_typematicCallback",this.timeoutChangeRate,this.defaultTimeout,this.minimumTimeout),_536.addListener(this.downArrowNode,this.textbox,{charOrCode:keys.DOWN_ARROW,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false},this,"_typematicCallback",this.timeoutChangeRate,this.defaultTimeout,this.minimumTimeout),_536.addListener(this.upArrowNode,this.textbox,{charOrCode:keys.PAGE_UP,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false},this,"_typematicCallback",this.timeoutChangeRate,this.defaultTimeout,this.minimumTimeout),_536.addListener(this.downArrowNode,this.textbox,{charOrCode:keys.PAGE_DOWN,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false},this,"_typematicCallback",this.timeoutChangeRate,this.defaultTimeout,this.minimumTimeout));
}});
});
},"dijit/form/Button":function(){
define(["require","dojo/_base/declare","dojo/dom-class","dojo/has","dojo/_base/kernel","dojo/_base/lang","dojo/ready","./_FormWidget","./_ButtonMixin","dojo/text!./templates/Button.html"],function(_540,_541,_542,has,_543,lang,_544,_545,_546,_547){
if(has("dijit-legacy-requires")){
_544(0,function(){
var _548=["dijit/form/DropDownButton","dijit/form/ComboButton","dijit/form/ToggleButton"];
_540(_548);
});
}
return _541("dijit.form.Button",[_545,_546],{showLabel:true,iconClass:"dijitNoIcon",_setIconClassAttr:{node:"iconNode",type:"class"},baseClass:"dijitButton",templateString:_547,_setValueAttr:"valueNode",_onClick:function(e){
var ok=this.inherited(arguments);
if(ok){
if(this.valueNode){
this.valueNode.click();
e.preventDefault();
e.stopPropagation();
}
}
return ok;
},_fillContent:function(_549){
if(_549&&(!this.params||!("label" in this.params))){
var _54a=lang.trim(_549.innerHTML);
if(_54a){
this.label=_54a;
}
}
},_setShowLabelAttr:function(val){
if(this.containerNode){
_542.toggle(this.containerNode,"dijitDisplayNone",!val);
}
this._set("showLabel",val);
},setLabel:function(_54b){
_543.deprecated("dijit.form.Button.setLabel() is deprecated.  Use set('label', ...) instead.","","2.0");
this.set("label",_54b);
},_setLabelAttr:function(_54c){
this.inherited(arguments);
if(!this.showLabel&&!("title" in this.params)){
this.titleNode.title=lang.trim(this.containerNode.innerText||this.containerNode.textContent||"");
}
}});
});
},"url:dijit/layout/templates/TabContainer.html":"<div class=\"dijitTabContainer\">\n\t<div class=\"dijitTabListWrapper\" data-dojo-attach-point=\"tablistNode\"></div>\n\t<div data-dojo-attach-point=\"tablistSpacer\" class=\"dijitTabSpacer ${baseClass}-spacer\"></div>\n\t<div class=\"dijitTabPaneWrapper ${baseClass}-container\" data-dojo-attach-point=\"containerNode\"></div>\n</div>\n","dojo/dnd/move":function(){
define(["../_base/declare","../dom-geometry","../dom-style","./common","./Mover","./Moveable"],function(_54d,_54e,_54f,dnd,_550,_551){
var _552=_54d("dojo.dnd.move.constrainedMoveable",_551,{constraints:function(){
},within:false,constructor:function(node,_553){
if(!_553){
_553={};
}
this.constraints=_553.constraints;
this.within=_553.within;
},onFirstMove:function(_554){
var c=this.constraintBox=this.constraints.call(this,_554);
c.r=c.l+c.w;
c.b=c.t+c.h;
if(this.within){
var mb=_54e.getMarginSize(_554.node);
c.r-=mb.w;
c.b-=mb.h;
}
},onMove:function(_555,_556){
var c=this.constraintBox,s=_555.node.style;
this.onMoving(_555,_556);
_556.l=_556.l<c.l?c.l:c.r<_556.l?c.r:_556.l;
_556.t=_556.t<c.t?c.t:c.b<_556.t?c.b:_556.t;
s.left=_556.l+"px";
s.top=_556.t+"px";
this.onMoved(_555,_556);
}});
var _557=_54d("dojo.dnd.move.boxConstrainedMoveable",_552,{box:{},constructor:function(node,_558){
var box=_558&&_558.box;
this.constraints=function(){
return box;
};
}});
var _559=_54d("dojo.dnd.move.parentConstrainedMoveable",_552,{area:"content",constructor:function(node,_55a){
var area=_55a&&_55a.area;
this.constraints=function(){
var n=this.node.parentNode,s=_54f.getComputedStyle(n),mb=_54e.getMarginBox(n,s);
if(area=="margin"){
return mb;
}
var t=_54e.getMarginExtents(n,s);
mb.l+=t.l,mb.t+=t.t,mb.w-=t.w,mb.h-=t.h;
if(area=="border"){
return mb;
}
t=_54e.getBorderExtents(n,s);
mb.l+=t.l,mb.t+=t.t,mb.w-=t.w,mb.h-=t.h;
if(area=="padding"){
return mb;
}
t=_54e.getPadExtents(n,s);
mb.l+=t.l,mb.t+=t.t,mb.w-=t.w,mb.h-=t.h;
return mb;
};
}});
return {constrainedMoveable:_552,boxConstrainedMoveable:_557,parentConstrainedMoveable:_559};
});
},"dijit/layout/_TabContainerBase":function(){
define(["dojo/text!./templates/TabContainer.html","./StackContainer","./utils","../_TemplatedMixin","dojo/_base/declare","dojo/dom-class","dojo/dom-geometry","dojo/dom-style"],function(_55b,_55c,_55d,_55e,_55f,_560,_561,_562){
return _55f("dijit.layout._TabContainerBase",[_55c,_55e],{tabPosition:"top",baseClass:"dijitTabContainer",tabStrip:false,nested:false,templateString:_55b,postMixInProperties:function(){
this.baseClass+=this.tabPosition.charAt(0).toUpperCase()+this.tabPosition.substr(1).replace(/-.*/,"");
this.srcNodeRef&&_562.set(this.srcNodeRef,"visibility","hidden");
this.inherited(arguments);
},buildRendering:function(){
this.inherited(arguments);
this.tablist=this._makeController(this.tablistNode);
if(!this.doLayout){
_560.add(this.domNode,"dijitTabContainerNoLayout");
}
if(this.nested){
_560.add(this.domNode,"dijitTabContainerNested");
_560.add(this.tablist.containerNode,"dijitTabContainerTabListNested");
_560.add(this.tablistSpacer,"dijitTabContainerSpacerNested");
_560.add(this.containerNode,"dijitTabPaneWrapperNested");
}else{
_560.add(this.domNode,"tabStrip-"+(this.tabStrip?"enabled":"disabled"));
}
},_setupChild:function(tab){
_560.add(tab.domNode,"dijitTabPane");
this.inherited(arguments);
},startup:function(){
if(this._started){
return;
}
this.tablist.startup();
this.inherited(arguments);
},layout:function(){
if(!this._contentBox||typeof (this._contentBox.l)=="undefined"){
return;
}
var sc=this.selectedChildWidget;
if(this.doLayout){
var _563=this.tabPosition.replace(/-h/,"");
this.tablist.layoutAlign=_563;
var _564=[this.tablist,{domNode:this.tablistSpacer,layoutAlign:_563},{domNode:this.containerNode,layoutAlign:"client"}];
_55d.layoutChildren(this.domNode,this._contentBox,_564);
this._containerContentBox=_55d.marginBox2contentBox(this.containerNode,_564[2]);
if(sc&&sc.resize){
sc.resize(this._containerContentBox);
}
}else{
if(this.tablist.resize){
var s=this.tablist.domNode.style;
s.width="0";
var _565=_561.getContentBox(this.domNode).w;
s.width="";
this.tablist.resize({w:_565});
}
if(sc&&sc.resize){
sc.resize();
}
}
},destroy:function(){
if(this.tablist){
this.tablist.destroy();
}
this.inherited(arguments);
}});
});
},"dijit/form/Form":function(){
define(["dojo/_base/declare","dojo/dom-attr","dojo/_base/event","dojo/_base/kernel","dojo/sniff","../_Widget","../_TemplatedMixin","./_FormMixin","../layout/_ContentPaneResizeMixin"],function(_566,_567,_568,_569,has,_56a,_56b,_56c,_56d){
return _566("dijit.form.Form",[_56a,_56b,_56c,_56d],{name:"",action:"",method:"",encType:"","accept-charset":"",accept:"",target:"",templateString:"<form data-dojo-attach-point='containerNode' data-dojo-attach-event='onreset:_onReset,onsubmit:_onSubmit' ${!nameAttrSetting}></form>",postMixInProperties:function(){
this.nameAttrSetting=this.name?("name='"+this.name+"'"):"";
this.inherited(arguments);
},execute:function(){
},onExecute:function(){
},_setEncTypeAttr:function(_56e){
this.encType=_56e;
_567.set(this.domNode,"encType",_56e);
if(has("ie")){
this.domNode.encoding=_56e;
}
},reset:function(e){
var faux={returnValue:true,preventDefault:function(){
this.returnValue=false;
},stopPropagation:function(){
},currentTarget:e?e.target:this.domNode,target:e?e.target:this.domNode};
if(!(this.onReset(faux)===false)&&faux.returnValue){
this.inherited(arguments,[]);
}
},onReset:function(){
return true;
},_onReset:function(e){
this.reset(e);
_568.stop(e);
return false;
},_onSubmit:function(e){
var fp=this.constructor.prototype;
if(this.execute!=fp.execute||this.onExecute!=fp.onExecute){
_569.deprecated("dijit.form.Form:execute()/onExecute() are deprecated. Use onSubmit() instead.","","2.0");
this.onExecute();
this.execute(this.getValues());
}
if(this.onSubmit(e)===false){
_568.stop(e);
}
},onSubmit:function(){
return this.isValid();
},submit:function(){
if(!(this.onSubmit()===false)){
this.containerNode.submit();
}
}});
});
},"dojo/store/Memory":function(){
define(["../_base/declare","./util/QueryResults","./util/SimpleQueryEngine"],function(_56f,_570,_571){
var base=null;
return _56f("dojo.store.Memory",base,{constructor:function(_572){
for(var i in _572){
this[i]=_572[i];
}
this.setData(this.data||[]);
},data:null,idProperty:"id",index:null,queryEngine:_571,get:function(id){
return this.data[this.index[id]];
},getIdentity:function(_573){
return _573[this.idProperty];
},put:function(_574,_575){
var data=this.data,_576=this.index,_577=this.idProperty;
var id=_574[_577]=(_575&&"id" in _575)?_575.id:_577 in _574?_574[_577]:Math.random();
if(id in _576){
if(_575&&_575.overwrite===false){
throw new Error("Object already exists");
}
data[_576[id]]=_574;
}else{
_576[id]=data.push(_574)-1;
}
return id;
},add:function(_578,_579){
(_579=_579||{}).overwrite=false;
return this.put(_578,_579);
},remove:function(id){
var _57a=this.index;
var data=this.data;
if(id in _57a){
data.splice(_57a[id],1);
this.setData(data);
return true;
}
},query:function(_57b,_57c){
return _570(this.queryEngine(_57b,_57c)(this.data));
},setData:function(data){
if(data.items){
this.idProperty=data.identifier;
data=this.data=data.items;
}else{
this.data=data;
}
this.index={};
for(var i=0,l=data.length;i<l;i++){
this.index[data[i][this.idProperty]]=i;
}
}});
});
},"url:dijit/templates/Tooltip.html":"<div class=\"dijitTooltip dijitTooltipLeft\" id=\"dojoTooltip\"\n\t><div class=\"dijitTooltipContainer dijitTooltipContents\" data-dojo-attach-point=\"containerNode\" role='alert'></div\n\t><div class=\"dijitTooltipConnector\" data-dojo-attach-point=\"connectorNode\"></div\n></div>\n","dijit/Editor":function(){
define(["require","dojo/_base/array","dojo/_base/declare","dojo/_base/Deferred","dojo/i18n","dojo/dom-attr","dojo/dom-class","dojo/dom-geometry","dojo/dom-style","dojo/_base/event","dojo/keys","dojo/_base/lang","dojo/sniff","dojo/string","dojo/topic","dojo/_base/window","./_base/focus","./_Container","./Toolbar","./ToolbarSeparator","./layout/_LayoutWidget","./form/ToggleButton","./_editor/_Plugin","./_editor/plugins/EnterKeyHandling","./_editor/html","./_editor/range","./_editor/RichText","./main","dojo/i18n!./_editor/nls/commands"],function(_57d,_57e,_57f,_580,i18n,_581,_582,_583,_584,_585,keys,lang,has,_586,_587,win,_588,_589,_58a,_58b,_58c,_58d,_58e,_58f,html,_590,_591,_592){
var _593=_57f("dijit.Editor",_591,{plugins:null,extraPlugins:null,constructor:function(){
if(!lang.isArray(this.plugins)){
this.plugins=["undo","redo","|","cut","copy","paste","|","bold","italic","underline","strikethrough","|","insertOrderedList","insertUnorderedList","indent","outdent","|","justifyLeft","justifyRight","justifyCenter","justifyFull",_58f];
}
this._plugins=[];
this._editInterval=this.editActionInterval*1000;
if(has("ie")){
this.events.push("onBeforeDeactivate");
this.events.push("onBeforeActivate");
}
},postMixInProperties:function(){
this.setValueDeferred=new _580();
this.inherited(arguments);
},postCreate:function(){
this._steps=this._steps.slice(0);
this._undoedSteps=this._undoedSteps.slice(0);
if(lang.isArray(this.extraPlugins)){
this.plugins=this.plugins.concat(this.extraPlugins);
}
this.inherited(arguments);
this.commands=i18n.getLocalization("dijit._editor","commands",this.lang);
if(!this.toolbar){
this.toolbar=new _58a({ownerDocument:this.ownerDocument,dir:this.dir,lang:this.lang});
this.header.appendChild(this.toolbar.domNode);
}
_57e.forEach(this.plugins,this.addPlugin,this);
this.setValueDeferred.resolve(true);
_582.add(this.iframe.parentNode,"dijitEditorIFrameContainer");
_582.add(this.iframe,"dijitEditorIFrame");
_581.set(this.iframe,"allowTransparency",true);
if(has("webkit")){
_584.set(this.domNode,"KhtmlUserSelect","none");
}
this.toolbar.startup();
this.onNormalizedDisplayChanged();
},destroy:function(){
_57e.forEach(this._plugins,function(p){
if(p&&p.destroy){
p.destroy();
}
});
this._plugins=[];
this.toolbar.destroyRecursive();
delete this.toolbar;
this.inherited(arguments);
},addPlugin:function(_594,_595){
var args=lang.isString(_594)?{name:_594}:lang.isFunction(_594)?{ctor:_594}:_594;
if(!args.setEditor){
var o={"args":args,"plugin":null,"editor":this};
if(args.name){
if(_58e.registry[args.name]){
o.plugin=_58e.registry[args.name](args);
}else{
_587.publish(_592._scopeName+".Editor.getPlugin",o);
}
}
if(!o.plugin){
try{
var pc=args.ctor||lang.getObject(args.name)||_57d(args.name);
if(pc){
o.plugin=new pc(args);
}
}
catch(e){
throw new Error(this.id+": cannot find plugin ["+args.name+"]");
}
}
if(!o.plugin){
throw new Error(this.id+": cannot find plugin ["+args.name+"]");
}
_594=o.plugin;
}
if(arguments.length>1){
this._plugins[_595]=_594;
}else{
this._plugins.push(_594);
}
_594.setEditor(this);
if(lang.isFunction(_594.setToolbar)){
_594.setToolbar(this.toolbar);
}
},resize:function(size){
if(size){
_58c.prototype.resize.apply(this,arguments);
}
},layout:function(){
var _596=(this._contentBox.h-(this.getHeaderHeight()+this.getFooterHeight()+_583.getPadBorderExtents(this.iframe.parentNode).h+_583.getMarginExtents(this.iframe.parentNode).h));
this.editingArea.style.height=_596+"px";
if(this.iframe){
this.iframe.style.height="100%";
}
this._layoutMode=true;
},_onIEMouseDown:function(e){
var _597;
var b=this.document.body;
var _598=b.clientWidth;
var _599=b.clientHeight;
var _59a=b.clientLeft;
var _59b=b.offsetWidth;
var _59c=b.offsetHeight;
var _59d=b.offsetLeft;
if(/^rtl$/i.test(b.dir||"")){
if(_598<_59b&&e.x>_598&&e.x<_59b){
_597=true;
}
}else{
if(e.x<_59a&&e.x>_59d){
_597=true;
}
}
if(!_597){
if(_599<_59c&&e.y>_599&&e.y<_59c){
_597=true;
}
}
if(!_597){
delete this._cursorToStart;
delete this._savedSelection;
if(e.target.tagName=="BODY"){
this.defer("placeCursorAtEnd");
}
this.inherited(arguments);
}
},onBeforeActivate:function(){
this._restoreSelection();
},onBeforeDeactivate:function(e){
if(this.customUndo){
this.endEditing(true);
}
if(e.target.tagName!="BODY"){
this._saveSelection();
}
},customUndo:true,editActionInterval:3,beginEditing:function(cmd){
if(!this._inEditing){
this._inEditing=true;
this._beginEditing(cmd);
}
if(this.editActionInterval>0){
if(this._editTimer){
this._editTimer.remove();
}
this._editTimer=this.defer("endEditing",this._editInterval);
}
},_steps:[],_undoedSteps:[],execCommand:function(cmd){
if(this.customUndo&&(cmd=="undo"||cmd=="redo")){
return this[cmd]();
}else{
if(this.customUndo){
this.endEditing();
this._beginEditing();
}
var r=this.inherited(arguments);
if(this.customUndo){
this._endEditing();
}
return r;
}
},_pasteImpl:function(){
return this._clipboardCommand("paste");
},_cutImpl:function(){
return this._clipboardCommand("cut");
},_copyImpl:function(){
return this._clipboardCommand("copy");
},_clipboardCommand:function(cmd){
var r;
try{
r=this.document.execCommand(cmd,false,null);
if(has("webkit")&&!r){
throw {code:1011};
}
}
catch(e){
if(e.code==1011||(e.code==9&&has("opera"))){
var sub=_586.substitute,_59e={cut:"X",copy:"C",paste:"V"};
alert(sub(this.commands.systemShortcut,[this.commands[cmd],sub(this.commands[has("mac")?"appleKey":"ctrlKey"],[_59e[cmd]])]));
}
r=false;
}
return r;
},queryCommandEnabled:function(cmd){
if(this.customUndo&&(cmd=="undo"||cmd=="redo")){
return cmd=="undo"?(this._steps.length>1):(this._undoedSteps.length>0);
}else{
return this.inherited(arguments);
}
},_moveToBookmark:function(b){
var _59f=b.mark;
var mark=b.mark;
var col=b.isCollapsed;
var r,_5a0,_5a1,sel;
if(mark){
if(has("ie")<9){
if(lang.isArray(mark)){
_59f=[];
_57e.forEach(mark,function(n){
_59f.push(_590.getNode(n,this.editNode));
},this);
win.withGlobal(this.window,"moveToBookmark",_588,[{mark:_59f,isCollapsed:col}]);
}else{
if(mark.startContainer&&mark.endContainer){
sel=_590.getSelection(this.window);
if(sel&&sel.removeAllRanges){
sel.removeAllRanges();
r=_590.create(this.window);
_5a0=_590.getNode(mark.startContainer,this.editNode);
_5a1=_590.getNode(mark.endContainer,this.editNode);
if(_5a0&&_5a1){
r.setStart(_5a0,mark.startOffset);
r.setEnd(_5a1,mark.endOffset);
sel.addRange(r);
}
}
}
}
}else{
sel=_590.getSelection(this.window);
if(sel&&sel.removeAllRanges){
sel.removeAllRanges();
r=_590.create(this.window);
_5a0=_590.getNode(mark.startContainer,this.editNode);
_5a1=_590.getNode(mark.endContainer,this.editNode);
if(_5a0&&_5a1){
r.setStart(_5a0,mark.startOffset);
r.setEnd(_5a1,mark.endOffset);
sel.addRange(r);
}
}
}
}
},_changeToStep:function(from,to){
this.setValue(to.text);
var b=to.bookmark;
if(!b){
return;
}
this._moveToBookmark(b);
},undo:function(){
var ret=false;
if(!this._undoRedoActive){
this._undoRedoActive=true;
this.endEditing(true);
var s=this._steps.pop();
if(s&&this._steps.length>0){
this.focus();
this._changeToStep(s,this._steps[this._steps.length-1]);
this._undoedSteps.push(s);
this.onDisplayChanged();
delete this._undoRedoActive;
ret=true;
}
delete this._undoRedoActive;
}
return ret;
},redo:function(){
var ret=false;
if(!this._undoRedoActive){
this._undoRedoActive=true;
this.endEditing(true);
var s=this._undoedSteps.pop();
if(s&&this._steps.length>0){
this.focus();
this._changeToStep(this._steps[this._steps.length-1],s);
this._steps.push(s);
this.onDisplayChanged();
ret=true;
}
delete this._undoRedoActive;
}
return ret;
},endEditing:function(_5a2){
if(this._editTimer){
this._editTimer=this._editTimer.remove();
}
if(this._inEditing){
this._endEditing(_5a2);
this._inEditing=false;
}
},_getBookmark:function(){
var b=win.withGlobal(this.window,_588.getBookmark);
var tmp=[];
if(b&&b.mark){
var mark=b.mark;
if(has("ie")<9){
var sel=_590.getSelection(this.window);
if(!lang.isArray(mark)){
if(sel){
var _5a3;
if(sel.rangeCount){
_5a3=sel.getRangeAt(0);
}
if(_5a3){
b.mark=_5a3.cloneRange();
}else{
b.mark=win.withGlobal(this.window,_588.getBookmark);
}
}
}else{
_57e.forEach(b.mark,function(n){
tmp.push(_590.getIndex(n,this.editNode).o);
},this);
b.mark=tmp;
}
}
try{
if(b.mark&&b.mark.startContainer){
tmp=_590.getIndex(b.mark.startContainer,this.editNode).o;
b.mark={startContainer:tmp,startOffset:b.mark.startOffset,endContainer:b.mark.endContainer===b.mark.startContainer?tmp:_590.getIndex(b.mark.endContainer,this.editNode).o,endOffset:b.mark.endOffset};
}
}
catch(e){
b.mark=null;
}
}
return b;
},_beginEditing:function(){
if(this._steps.length===0){
this._steps.push({"text":html.getChildrenHtml(this.editNode),"bookmark":this._getBookmark()});
}
},_endEditing:function(){
var v=html.getChildrenHtml(this.editNode);
this._undoedSteps=[];
this._steps.push({text:v,bookmark:this._getBookmark()});
},onKeyDown:function(e){
if(!has("ie")&&!this.iframe&&e.keyCode==keys.TAB&&!this.tabIndent){
this._saveSelection();
}
if(!this.customUndo){
this.inherited(arguments);
return;
}
var k=e.keyCode;
if(e.ctrlKey&&!e.altKey){
if(k==90||k==122){
_585.stop(e);
this.undo();
return;
}else{
if(k==89||k==121){
_585.stop(e);
this.redo();
return;
}
}
}
this.inherited(arguments);
switch(k){
case keys.ENTER:
case keys.BACKSPACE:
case keys.DELETE:
this.beginEditing();
break;
case 88:
case 86:
if(e.ctrlKey&&!e.altKey&&!e.metaKey){
this.endEditing();
if(e.keyCode==88){
this.beginEditing("cut");
}else{
this.beginEditing("paste");
}
this.defer("endEditing",1);
break;
}
default:
if(!e.ctrlKey&&!e.altKey&&!e.metaKey&&(e.keyCode<keys.F1||e.keyCode>keys.F15)){
this.beginEditing();
break;
}
case keys.ALT:
this.endEditing();
break;
case keys.UP_ARROW:
case keys.DOWN_ARROW:
case keys.LEFT_ARROW:
case keys.RIGHT_ARROW:
case keys.HOME:
case keys.END:
case keys.PAGE_UP:
case keys.PAGE_DOWN:
this.endEditing(true);
break;
case keys.CTRL:
case keys.SHIFT:
case keys.TAB:
break;
}
},_onBlur:function(){
this.inherited(arguments);
this.endEditing(true);
},_saveSelection:function(){
try{
this._savedSelection=this._getBookmark();
}
catch(e){
}
},_restoreSelection:function(){
if(this._savedSelection){
delete this._cursorToStart;
if(win.withGlobal(this.window,"isCollapsed",_588)){
this._moveToBookmark(this._savedSelection);
}
delete this._savedSelection;
}
},onClick:function(){
this.endEditing(true);
this.inherited(arguments);
},replaceValue:function(html){
if(!this.customUndo){
this.inherited(arguments);
}else{
if(this.isClosed){
this.setValue(html);
}else{
this.beginEditing();
if(!html){
html="&#160;";
}
this.setValue(html);
this.endEditing();
}
}
},_setDisabledAttr:function(_5a4){
this.setValueDeferred.then(lang.hitch(this,function(){
if((!this.disabled&&_5a4)||(!this._buttonEnabledPlugins&&_5a4)){
_57e.forEach(this._plugins,function(p){
p.set("disabled",true);
});
}else{
if(this.disabled&&!_5a4){
_57e.forEach(this._plugins,function(p){
p.set("disabled",false);
});
}
}
}));
this.inherited(arguments);
},_setStateClass:function(){
try{
this.inherited(arguments);
if(this.document&&this.document.body){
_584.set(this.document.body,"color",_584.get(this.iframe,"color"));
}
}
catch(e){
}
}});
function _5a5(args){
return new _58e({command:args.name});
};
function _5a6(args){
return new _58e({buttonClass:_58d,command:args.name});
};
lang.mixin(_58e.registry,{"undo":_5a5,"redo":_5a5,"cut":_5a5,"copy":_5a5,"paste":_5a5,"insertOrderedList":_5a5,"insertUnorderedList":_5a5,"indent":_5a5,"outdent":_5a5,"justifyCenter":_5a5,"justifyFull":_5a5,"justifyLeft":_5a5,"justifyRight":_5a5,"delete":_5a5,"selectAll":_5a5,"removeFormat":_5a5,"unlink":_5a5,"insertHorizontalRule":_5a5,"bold":_5a6,"italic":_5a6,"underline":_5a6,"strikethrough":_5a6,"subscript":_5a6,"superscript":_5a6,"|":function(){
return new _58e({setEditor:function(_5a7){
this.editor=_5a7;
this.button=new _58b({ownerDocument:_5a7.ownerDocument});
}});
}});
return _593;
});
},"dijit/Toolbar":function(){
define(["require","dojo/_base/declare","dojo/has","dojo/keys","dojo/ready","./_Widget","./_KeyNavContainer","./_TemplatedMixin"],function(_5a8,_5a9,has,keys,_5aa,_5ab,_5ac,_5ad){
if(has("dijit-legacy-requires")){
_5aa(0,function(){
var _5ae=["dijit/ToolbarSeparator"];
_5a8(_5ae);
});
}
return _5a9("dijit.Toolbar",[_5ab,_5ad,_5ac],{templateString:"<div class=\"dijit\" role=\"toolbar\" tabIndex=\"${tabIndex}\" data-dojo-attach-point=\"containerNode\">"+"</div>",baseClass:"dijitToolbar",postCreate:function(){
this.inherited(arguments);
this.connectKeyNavHandlers(this.isLeftToRight()?[keys.LEFT_ARROW]:[keys.RIGHT_ARROW],this.isLeftToRight()?[keys.RIGHT_ARROW]:[keys.LEFT_ARROW]);
}});
});
},"dijit/layout/StackContainer":function(){
define(["dojo/_base/array","dojo/cookie","dojo/_base/declare","dojo/dom-class","dojo/has","dojo/_base/lang","dojo/ready","dojo/topic","../registry","../_WidgetBase","./_LayoutWidget","dojo/i18n!../nls/common"],function(_5af,_5b0,_5b1,_5b2,has,lang,_5b3,_5b4,_5b5,_5b6,_5b7){
if(has("dijit-legacy-requires")){
_5b3(0,function(){
var _5b8=["dijit/layout/StackController"];
require(_5b8);
});
}
var _5b9=_5b1("dijit.layout.StackContainer",_5b7,{doLayout:true,persist:false,baseClass:"dijitStackContainer",buildRendering:function(){
this.inherited(arguments);
_5b2.add(this.domNode,"dijitLayoutContainer");
this.containerNode.setAttribute("role","tabpanel");
},postCreate:function(){
this.inherited(arguments);
this.connect(this.domNode,"onkeypress",this._onKeyPress);
},startup:function(){
if(this._started){
return;
}
var _5ba=this.getChildren();
_5af.forEach(_5ba,this._setupChild,this);
if(this.persist){
this.selectedChildWidget=_5b5.byId(_5b0(this.id+"_selectedChild"));
}else{
_5af.some(_5ba,function(_5bb){
if(_5bb.selected){
this.selectedChildWidget=_5bb;
}
return _5bb.selected;
},this);
}
var _5bc=this.selectedChildWidget;
if(!_5bc&&_5ba[0]){
_5bc=this.selectedChildWidget=_5ba[0];
_5bc.selected=true;
}
_5b4.publish(this.id+"-startup",{children:_5ba,selected:_5bc});
this.inherited(arguments);
},resize:function(){
if(!this._hasBeenShown){
this._hasBeenShown=true;
var _5bd=this.selectedChildWidget;
if(_5bd){
this._showChild(_5bd);
}
}
this.inherited(arguments);
},_setupChild:function(_5be){
this.inherited(arguments);
_5b2.replace(_5be.domNode,"dijitHidden","dijitVisible");
_5be.domNode.title="";
},addChild:function(_5bf,_5c0){
this.inherited(arguments);
if(this._started){
_5b4.publish(this.id+"-addChild",_5bf,_5c0);
this.layout();
if(!this.selectedChildWidget){
this.selectChild(_5bf);
}
}
},removeChild:function(page){
this.inherited(arguments);
if(this._started){
_5b4.publish(this.id+"-removeChild",page);
}
if(this._descendantsBeingDestroyed){
return;
}
if(this.selectedChildWidget===page){
this.selectedChildWidget=undefined;
if(this._started){
var _5c1=this.getChildren();
if(_5c1.length){
this.selectChild(_5c1[0]);
}
}
}
if(this._started){
this.layout();
}
},selectChild:function(page,_5c2){
page=_5b5.byId(page);
if(this.selectedChildWidget!=page){
var d=this._transition(page,this.selectedChildWidget,_5c2);
this._set("selectedChildWidget",page);
_5b4.publish(this.id+"-selectChild",page);
if(this.persist){
_5b0(this.id+"_selectedChild",this.selectedChildWidget.id);
}
}
return d;
},_transition:function(_5c3,_5c4){
if(_5c4){
this._hideChild(_5c4);
}
var d=this._showChild(_5c3);
if(_5c3.resize){
if(this.doLayout){
_5c3.resize(this._containerContentBox||this._contentBox);
}else{
_5c3.resize();
}
}
return d;
},_adjacent:function(_5c5){
var _5c6=this.getChildren();
var _5c7=_5af.indexOf(_5c6,this.selectedChildWidget);
_5c7+=_5c5?1:_5c6.length-1;
return _5c6[_5c7%_5c6.length];
},forward:function(){
return this.selectChild(this._adjacent(true),true);
},back:function(){
return this.selectChild(this._adjacent(false),true);
},_onKeyPress:function(e){
_5b4.publish(this.id+"-containerKeyPress",{e:e,page:this});
},layout:function(){
var _5c8=this.selectedChildWidget;
if(_5c8&&_5c8.resize){
if(this.doLayout){
_5c8.resize(this._containerContentBox||this._contentBox);
}else{
_5c8.resize();
}
}
},_showChild:function(page){
var _5c9=this.getChildren();
page.isFirstChild=(page==_5c9[0]);
page.isLastChild=(page==_5c9[_5c9.length-1]);
page._set("selected",true);
_5b2.replace(page.domNode,"dijitVisible","dijitHidden");
return (page._onShow&&page._onShow())||true;
},_hideChild:function(page){
page._set("selected",false);
_5b2.replace(page.domNode,"dijitHidden","dijitVisible");
page.onHide&&page.onHide();
},closeChild:function(page){
var _5ca=page.onClose(this,page);
if(_5ca){
this.removeChild(page);
page.destroyRecursive();
}
},destroyDescendants:function(_5cb){
this._descendantsBeingDestroyed=true;
this.selectedChildWidget=undefined;
_5af.forEach(this.getChildren(),function(_5cc){
if(!_5cb){
this.removeChild(_5cc);
}
_5cc.destroyRecursive(_5cb);
},this);
this._descendantsBeingDestroyed=false;
}});
_5b9.ChildWidgetProperties={selected:false,disabled:false,closable:false,iconClass:"dijitNoIcon",showTitle:true};
lang.extend(_5b6,_5b9.ChildWidgetProperties);
return _5b9;
});
},"dojo/regexp":function(){
define(["./_base/kernel","./_base/lang"],function(dojo,lang){
var _5cd={};
lang.setObject("dojo.regexp",_5cd);
_5cd.escapeString=function(str,_5ce){
return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,function(ch){
if(_5ce&&_5ce.indexOf(ch)!=-1){
return ch;
}
return "\\"+ch;
});
};
_5cd.buildGroupRE=function(arr,re,_5cf){
if(!(arr instanceof Array)){
return re(arr);
}
var b=[];
for(var i=0;i<arr.length;i++){
b.push(re(arr[i]));
}
return _5cd.group(b.join("|"),_5cf);
};
_5cd.group=function(_5d0,_5d1){
return "("+(_5d1?"?:":"")+_5d0+")";
};
return _5cd;
});
},"dijit/form/ComboBox":function(){
define(["dojo/_base/declare","./ValidationTextBox","./ComboBoxMixin"],function(_5d2,_5d3,_5d4){
return _5d2("dijit.form.ComboBox",[_5d3,_5d4],{});
});
},"dijit/_editor/plugins/LinkDialog":function(){
define(["require","dojo/_base/declare","dojo/dom-attr","dojo/keys","dojo/_base/lang","dojo/sniff","dojo/_base/query","dojo/string","../../_Widget","../_Plugin","../../form/DropDownButton","../range"],function(_5d5,_5d6,_5d7,keys,lang,has,_5d8,_5d9,_5da,_5db,_5dc,_5dd){
var _5de=_5d6("dijit._editor.plugins.LinkDialog",_5db,{buttonClass:_5dc,useDefaultCommand:false,urlRegExp:"((https?|ftps?|file)\\://|./|../|/|)(/[a-zA-Z]{1,1}:/|)(((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)*(?:[a-zA-Z](?:[-\\da-zA-Z]{0,80}[\\da-zA-Z])?)\\.?)|(((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])|(0[xX]0*[\\da-fA-F]?[\\da-fA-F]\\.){3}0[xX]0*[\\da-fA-F]?[\\da-fA-F]|(0+[0-3][0-7][0-7]\\.){3}0+[0-3][0-7][0-7]|(0|[1-9]\\d{0,8}|[1-3]\\d{9}|4[01]\\d{8}|42[0-8]\\d{7}|429[0-3]\\d{6}|4294[0-8]\\d{5}|42949[0-5]\\d{4}|429496[0-6]\\d{3}|4294967[01]\\d{2}|42949672[0-8]\\d|429496729[0-5])|0[xX]0*[\\da-fA-F]{1,8}|([\\da-fA-F]{1,4}\\:){7}[\\da-fA-F]{1,4}|([\\da-fA-F]{1,4}\\:){6}((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])))(\\:\\d+)?(/(?:[^?#\\s/]+/)*(?:[^?#\\s/]{0,}(?:\\?[^?#\\s/]*)?(?:#.*)?)?)?",emailRegExp:"<?(mailto\\:)([!#-'*+\\-\\/-9=?A-Z^-~]+[.])*[!#-'*+\\-\\/-9=?A-Z^-~]+"+"@"+"((?:(?:[\\da-zA-Z](?:[-\\da-zA-Z]{0,61}[\\da-zA-Z])?)\\.)+(?:[a-zA-Z](?:[-\\da-zA-Z]{0,6}[\\da-zA-Z])?)\\.?)|localhost|^[^-][a-zA-Z0-9_-]*>?",htmlTemplate:"<a href=\"${urlInput}\" _djrealurl=\"${urlInput}\""+" target=\"${targetSelect}\""+">${textInput}</a>",tag:"a",_hostRxp:/^((([^\[:]+):)?([^@]+)@)?(\[([^\]]+)\]|([^\[:]*))(:([0-9]+))?$/,_userAtRxp:/^([!#-'*+\-\/-9=?A-Z^-~]+[.])*[!#-'*+\-\/-9=?A-Z^-~]+@/i,linkDialogTemplate:["<table role='presentation'><tr><td>","<label for='${id}_urlInput'>${url}</label>","</td><td>","<input data-dojo-type='dijit.form.ValidationTextBox' required='true' "+"id='${id}_urlInput' name='urlInput' data-dojo-props='intermediateChanges:true'/>","</td></tr><tr><td>","<label for='${id}_textInput'>${text}</label>","</td><td>","<input data-dojo-type='dijit.form.ValidationTextBox' required='true' id='${id}_textInput' "+"name='textInput' data-dojo-props='intermediateChanges:true'/>","</td></tr><tr><td>","<label for='${id}_targetSelect'>${target}</label>","</td><td>","<select id='${id}_targetSelect' name='targetSelect' data-dojo-type='dijit.form.Select'>","<option selected='selected' value='_self'>${currentWindow}</option>","<option value='_blank'>${newWindow}</option>","<option value='_top'>${topWindow}</option>","<option value='_parent'>${parentWindow}</option>","</select>","</td></tr><tr><td colspan='2'>","<button data-dojo-type='dijit.form.Button' type='submit' id='${id}_setButton'>${set}</button>","<button data-dojo-type='dijit.form.Button' type='button' id='${id}_cancelButton'>${buttonCancel}</button>","</td></tr></table>"].join(""),_initButton:function(){
this.inherited(arguments);
this.button.loadDropDown=lang.hitch(this,"_loadDropDown");
this._connectTagEvents();
},_loadDropDown:function(_5df){
_5d5(["dojo/i18n","../../TooltipDialog","../../registry","../../form/Button","../../form/Select","../../form/ValidationTextBox","dojo/i18n!../../nls/common","dojo/i18n!../nls/LinkDialog"],lang.hitch(this,function(i18n,_5e0,_5e1){
var _5e2=this;
this.tag=this.command=="insertImage"?"img":"a";
var _5e3=lang.delegate(i18n.getLocalization("dijit","common",this.lang),i18n.getLocalization("dijit._editor","LinkDialog",this.lang));
var _5e4=(this.dropDown=this.button.dropDown=new _5e0({title:_5e3[this.command+"Title"],ownerDocument:this.editor.ownerDocument,dir:this.editor.dir,execute:lang.hitch(this,"setValue"),onOpen:function(){
_5e2._onOpenDialog();
_5e0.prototype.onOpen.apply(this,arguments);
},onCancel:function(){
setTimeout(lang.hitch(_5e2,"_onCloseDialog"),0);
}}));
_5e3.urlRegExp=this.urlRegExp;
_5e3.id=_5e1.getUniqueId(this.editor.id);
this._uniqueId=_5e3.id;
this._setContent(_5e4.title+"<div style='border-bottom: 1px black solid;padding-bottom:2pt;margin-bottom:4pt'></div>"+_5d9.substitute(this.linkDialogTemplate,_5e3));
_5e4.startup();
this._urlInput=_5e1.byId(this._uniqueId+"_urlInput");
this._textInput=_5e1.byId(this._uniqueId+"_textInput");
this._setButton=_5e1.byId(this._uniqueId+"_setButton");
this.connect(_5e1.byId(this._uniqueId+"_cancelButton"),"onClick",function(){
this.dropDown.onCancel();
});
if(this._urlInput){
this.connect(this._urlInput,"onChange","_checkAndFixInput");
}
if(this._textInput){
this.connect(this._textInput,"onChange","_checkAndFixInput");
}
this._urlRegExp=new RegExp("^"+this.urlRegExp+"$","i");
this._emailRegExp=new RegExp("^"+this.emailRegExp+"$","i");
this._urlInput.isValid=lang.hitch(this,function(){
var _5e5=this._urlInput.get("value");
return this._urlRegExp.test(_5e5)||this._emailRegExp.test(_5e5);
});
this.connect(_5e4.domNode,"onkeypress",function(e){
if(e&&e.charOrCode==keys.ENTER&&!e.shiftKey&&!e.metaKey&&!e.ctrlKey&&!e.altKey){
if(!this._setButton.get("disabled")){
_5e4.onExecute();
_5e4.execute(_5e4.get("value"));
}
}
});
_5df();
}));
},_checkAndFixInput:function(){
var self=this;
var url=this._urlInput.get("value");
var _5e6=function(url){
var _5e7=false;
var _5e8=false;
if(url&&url.length>1){
url=lang.trim(url);
if(url.indexOf("mailto:")!==0){
if(url.indexOf("/")>0){
if(url.indexOf("://")===-1){
if(url.charAt(0)!=="/"&&url.indexOf("./")&&url.indexOf("../")!==0){
if(self._hostRxp.test(url)){
_5e7=true;
}
}
}
}else{
if(self._userAtRxp.test(url)){
_5e8=true;
}
}
}
}
if(_5e7){
self._urlInput.set("value","http://"+url);
}
if(_5e8){
self._urlInput.set("value","mailto:"+url);
}
self._setButton.set("disabled",!self._isValid());
};
if(this._delayedCheck){
clearTimeout(this._delayedCheck);
this._delayedCheck=null;
}
this._delayedCheck=setTimeout(function(){
_5e6(url);
},250);
},_connectTagEvents:function(){
this.editor.onLoadDeferred.then(lang.hitch(this,function(){
this.connect(this.editor.editNode,"ondblclick",this._onDblClick);
}));
},_isValid:function(){
return this._urlInput.isValid()&&this._textInput.isValid();
},_setContent:function(_5e9){
this.dropDown.set({parserScope:"dojo",content:_5e9});
},_checkValues:function(args){
if(args&&args.urlInput){
args.urlInput=args.urlInput.replace(/"/g,"&quot;");
}
return args;
},setValue:function(args){
this._onCloseDialog();
if(has("ie")<9){
var sel=_5dd.getSelection(this.editor.window);
var _5ea=sel.getRangeAt(0);
var a=_5ea.endContainer;
if(a.nodeType===3){
a=a.parentNode;
}
if(a&&(a.nodeName&&a.nodeName.toLowerCase()!==this.tag)){
a=this.editor._sCall("getSelectedElement",[this.tag]);
}
if(a&&(a.nodeName&&a.nodeName.toLowerCase()===this.tag)){
if(this.editor.queryCommandEnabled("unlink")){
this.editor._sCall("selectElementChildren",[a]);
this.editor.execCommand("unlink");
}
}
}
args=this._checkValues(args);
this.editor.execCommand("inserthtml",_5d9.substitute(this.htmlTemplate,args));
_5d8("a",this.editor.document).forEach(function(a){
if(!a.innerHTML&&!_5d7.has(a,"name")){
a.parentNode.removeChild(a);
}
},this);
},_onCloseDialog:function(){
this.editor.focus();
},_getCurrentValues:function(a){
var url,text,_5eb;
if(a&&a.tagName.toLowerCase()===this.tag){
url=a.getAttribute("_djrealurl")||a.getAttribute("href");
_5eb=a.getAttribute("target")||"_self";
text=a.textContent||a.innerText;
this.editor._sCall("selectElement",[a,true]);
}else{
text=this.editor._sCall("getSelectedText");
}
return {urlInput:url||"",textInput:text||"",targetSelect:_5eb||""};
},_onOpenDialog:function(){
var a,b,fc;
if(has("ie")){
var sel=_5dd.getSelection(this.editor.window);
var _5ec=sel.getRangeAt(0);
a=_5ec.endContainer;
if(a.nodeType===3){
a=a.parentNode;
}
if(a&&(a.nodeName&&a.nodeName.toLowerCase()!==this.tag)){
a=this.editor._sCall("getSelectedElement",[this.tag]);
}
if(!a||(a.nodeName&&a.nodeName.toLowerCase()!==this.tag)){
b=this.editor._sCall("getAncestorElement",[this.tag]);
if(b&&(b.nodeName&&b.nodeName.toLowerCase()==this.tag)){
a=b;
this.editor._sCall("selectElement",[a]);
}else{
if(_5ec.startContainer===_5ec.endContainer){
fc=_5ec.startContainer.firstChild;
if(fc&&(fc.nodeName&&fc.nodeName.toLowerCase()==this.tag)){
a=fc;
this.editor._sCall("selectElement",[a]);
}
}
}
}
}else{
a=this.editor._sCall("getAncestorElement",[this.tag]);
}
this.dropDown.reset();
this._setButton.set("disabled",true);
this.dropDown.set("value",this._getCurrentValues(a));
},_onDblClick:function(e){
if(e&&e.target){
var t=e.target;
var tg=t.tagName?t.tagName.toLowerCase():"";
if(tg===this.tag&&_5d7.get(t,"href")){
var _5ed=this.editor;
this.editor._sCall("selectElement",[t]);
_5ed.onDisplayChanged();
if(_5ed._updateTimer){
_5ed._updateTimer.remove();
delete _5ed._updateTimer;
}
_5ed.onNormalizedDisplayChanged();
var _5ee=this.button;
setTimeout(function(){
_5ee.set("disabled",false);
_5ee.loadAndOpenDropDown().then(function(){
if(_5ee.dropDown.focus){
_5ee.dropDown.focus();
}
});
},10);
}
}
}});
var _5ef=_5d6("dijit._editor.plugins.ImgLinkDialog",[_5de],{linkDialogTemplate:["<table role='presentation'><tr><td>","<label for='${id}_urlInput'>${url}</label>","</td><td>","<input dojoType='dijit.form.ValidationTextBox' regExp='${urlRegExp}' "+"required='true' id='${id}_urlInput' name='urlInput' data-dojo-props='intermediateChanges:true'/>","</td></tr><tr><td>","<label for='${id}_textInput'>${text}</label>","</td><td>","<input data-dojo-type='dijit.form.ValidationTextBox' required='false' id='${id}_textInput' "+"name='textInput' data-dojo-props='intermediateChanges:true'/>","</td></tr><tr><td>","</td><td>","</td></tr><tr><td colspan='2'>","<button data-dojo-type='dijit.form.Button' type='submit' id='${id}_setButton'>${set}</button>","<button data-dojo-type='dijit.form.Button' type='button' id='${id}_cancelButton'>${buttonCancel}</button>","</td></tr></table>"].join(""),htmlTemplate:"<img src=\"${urlInput}\" _djrealurl=\"${urlInput}\" alt=\"${textInput}\" />",tag:"img",_getCurrentValues:function(img){
var url,text;
if(img&&img.tagName.toLowerCase()===this.tag){
url=img.getAttribute("_djrealurl")||img.getAttribute("src");
text=img.getAttribute("alt");
this.editor._sCall("selectElement",[img,true]);
}else{
text=this.editor._sCall("getSelectedText",[]);
}
return {urlInput:url||"",textInput:text||""};
},_isValid:function(){
return this._urlInput.isValid();
},_connectTagEvents:function(){
this.inherited(arguments);
this.editor.onLoadDeferred.then(lang.hitch(this,function(){
this.connect(this.editor.editNode,"onmousedown",this._selectTag);
}));
},_selectTag:function(e){
if(e&&e.target){
var t=e.target;
var tg=t.tagName?t.tagName.toLowerCase():"";
if(tg===this.tag){
this.editor._sCall("selectElement",[t]);
}
}
},_checkValues:function(args){
if(args&&args.urlInput){
args.urlInput=args.urlInput.replace(/"/g,"&quot;");
}
if(args&&args.textInput){
args.textInput=args.textInput.replace(/"/g,"&quot;");
}
return args;
},_onDblClick:function(e){
if(e&&e.target){
var t=e.target;
var tg=t.tagName?t.tagName.toLowerCase():"";
if(tg===this.tag&&_5d7.get(t,"src")){
var _5f0=this.editor;
this.editor._sCall("selectElement",[t]);
_5f0.onDisplayChanged();
if(_5f0._updateTimer){
_5f0._updateTimer.remove();
delete _5f0._updateTimer;
}
_5f0.onNormalizedDisplayChanged();
var _5f1=this.button;
setTimeout(function(){
_5f1.set("disabled",false);
_5f1.loadAndOpenDropDown().then(function(){
if(_5f1.dropDown.focus){
_5f1.dropDown.focus();
}
});
},10);
}
}
}});
_5db.registry["createLink"]=function(){
return new _5de({command:"createLink"});
};
_5db.registry["insertImage"]=function(){
return new _5ef({command:"insertImage"});
};
_5de.ImgLinkDialog=_5ef;
return _5de;
});
},"dijit/DropDownMenu":function(){
define(["dojo/_base/declare","dojo/_base/event","dojo/keys","dojo/text!./templates/Menu.html","./_OnDijitClickMixin","./_MenuBase"],function(_5f2,_5f3,keys,_5f4,_5f5,_5f6){
return _5f2("dijit.DropDownMenu",[_5f6,_5f5],{templateString:_5f4,baseClass:"dijitMenu",postCreate:function(){
this.inherited(arguments);
var l=this.isLeftToRight();
this._openSubMenuKey=l?keys.RIGHT_ARROW:keys.LEFT_ARROW;
this._closeSubMenuKey=l?keys.LEFT_ARROW:keys.RIGHT_ARROW;
this.connectKeyNavHandlers([keys.UP_ARROW],[keys.DOWN_ARROW]);
},_onKeyPress:function(evt){
if(evt.ctrlKey||evt.altKey){
return;
}
switch(evt.charOrCode){
case this._openSubMenuKey:
this._moveToPopup(evt);
_5f3.stop(evt);
break;
case this._closeSubMenuKey:
if(this.parentMenu){
if(this.parentMenu._isMenuBar){
this.parentMenu.focusPrev();
}else{
this.onCancel(false);
}
}else{
_5f3.stop(evt);
}
break;
}
}});
});
},"dijit/form/_FormMixin":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/_base/kernel","dojo/_base/lang","dojo/on","dojo/window"],function(_5f7,_5f8,_5f9,lang,on,_5fa){
return _5f8("dijit.form._FormMixin",null,{state:"",_getDescendantFormWidgets:function(_5fb){
var res=[];
_5f7.forEach(_5fb||this.getChildren(),function(_5fc){
if("value" in _5fc){
res.push(_5fc);
}else{
res=res.concat(this._getDescendantFormWidgets(_5fc.getChildren()));
}
},this);
return res;
},reset:function(){
_5f7.forEach(this._getDescendantFormWidgets(),function(_5fd){
if(_5fd.reset){
_5fd.reset();
}
});
},validate:function(){
var _5fe=false;
return _5f7.every(_5f7.map(this._getDescendantFormWidgets(),function(_5ff){
_5ff._hasBeenBlurred=true;
var _600=_5ff.disabled||!_5ff.validate||_5ff.validate();
if(!_600&&!_5fe){
_5fa.scrollIntoView(_5ff.containerNode||_5ff.domNode);
_5ff.focus();
_5fe=true;
}
return _600;
}),function(item){
return item;
});
},setValues:function(val){
_5f9.deprecated(this.declaredClass+"::setValues() is deprecated. Use set('value', val) instead.","","2.0");
return this.set("value",val);
},_setValueAttr:function(obj){
var map={};
_5f7.forEach(this._getDescendantFormWidgets(),function(_601){
if(!_601.name){
return;
}
var _602=map[_601.name]||(map[_601.name]=[]);
_602.push(_601);
});
for(var name in map){
if(!map.hasOwnProperty(name)){
continue;
}
var _603=map[name],_604=lang.getObject(name,false,obj);
if(_604===undefined){
continue;
}
if(!lang.isArray(_604)){
_604=[_604];
}
if(typeof _603[0].checked=="boolean"){
_5f7.forEach(_603,function(w){
w.set("value",_5f7.indexOf(_604,w.value)!=-1);
});
}else{
if(_603[0].multiple){
_603[0].set("value",_604);
}else{
_5f7.forEach(_603,function(w,i){
w.set("value",_604[i]);
});
}
}
}
},getValues:function(){
_5f9.deprecated(this.declaredClass+"::getValues() is deprecated. Use get('value') instead.","","2.0");
return this.get("value");
},_getValueAttr:function(){
var obj={};
_5f7.forEach(this._getDescendantFormWidgets(),function(_605){
var name=_605.name;
if(!name||_605.disabled){
return;
}
var _606=_605.get("value");
if(typeof _605.checked=="boolean"){
if(/Radio/.test(_605.declaredClass)){
if(_606!==false){
lang.setObject(name,_606,obj);
}else{
_606=lang.getObject(name,false,obj);
if(_606===undefined){
lang.setObject(name,null,obj);
}
}
}else{
var ary=lang.getObject(name,false,obj);
if(!ary){
ary=[];
lang.setObject(name,ary,obj);
}
if(_606!==false){
ary.push(_606);
}
}
}else{
var prev=lang.getObject(name,false,obj);
if(typeof prev!="undefined"){
if(lang.isArray(prev)){
prev.push(_606);
}else{
lang.setObject(name,[prev,_606],obj);
}
}else{
lang.setObject(name,_606,obj);
}
}
});
return obj;
},isValid:function(){
return this.state=="";
},onValidStateChange:function(){
},_getState:function(){
var _607=_5f7.map(this._descendants,function(w){
return w.get("state")||"";
});
return _5f7.indexOf(_607,"Error")>=0?"Error":_5f7.indexOf(_607,"Incomplete")>=0?"Incomplete":"";
},disconnectChildren:function(){
},connectChildren:function(_608){
this._descendants=this._getDescendantFormWidgets();
_5f7.forEach(this._descendants,function(_609){
if(!_609._started){
_609.startup();
}
});
if(!_608){
this._onChildChange();
}
},_onChildChange:function(attr){
if(!attr||attr=="state"||attr=="disabled"){
this._set("state",this._getState());
}
if(!attr||attr=="value"||attr=="disabled"||attr=="checked"){
if(this._onChangeDelayTimer){
this._onChangeDelayTimer.remove();
}
this._onChangeDelayTimer=this.defer(function(){
delete this._onChangeDelayTimer;
this._set("value",this.get("value"));
},10);
}
},startup:function(){
this.inherited(arguments);
this._descendants=this._getDescendantFormWidgets();
this.value=this.get("value");
this.state=this._getState();
var self=this;
this.own(on(this.containerNode,"attrmodified-state, attrmodified-disabled, attrmodified-value, attrmodified-checked",function(evt){
if(evt.target==self.domNode){
return;
}
self._onChildChange(evt.type.replace("attrmodified-",""));
}));
this.watch("state",function(attr,_60a,_60b){
this.onValidStateChange(_60b=="");
});
},destroy:function(){
this.inherited(arguments);
}});
});
},"dijit/Menu":function(){
define("dijit/Menu",["require","dojo/_base/array","dojo/_base/declare","dojo/_base/event","dojo/dom","dojo/dom-attr","dojo/dom-geometry","dojo/dom-style","dojo/keys","dojo/_base/lang","dojo/on","dojo/sniff","dojo/_base/window","dojo/window","./popup","./DropDownMenu","dojo/ready"],function(_60c,_60d,_60e,_60f,dom,_610,_611,_612,keys,lang,on,has,win,_613,pm,_614,_615){
if(has("dijit-legacy-requires")){
_615(0,function(){
var _616=["dijit/MenuItem","dijit/PopupMenuItem","dijit/CheckedMenuItem","dijit/MenuSeparator"];
_60c(_616);
});
}
return _60e("dijit.Menu",_614,{constructor:function(){
this._bindings=[];
},targetNodeIds:[],selector:"",contextMenuForWindow:false,leftClickToOpen:false,refocus:true,postCreate:function(){
if(this.contextMenuForWindow){
this.bindDomNode(this.ownerDocumentBody);
}else{
_60d.forEach(this.targetNodeIds,this.bindDomNode,this);
}
this.inherited(arguments);
},_iframeContentWindow:function(_617){
return _613.get(this._iframeContentDocument(_617))||this._iframeContentDocument(_617)["__parent__"]||(_617.name&&win.doc.frames[_617.name])||null;
},_iframeContentDocument:function(_618){
return _618.contentDocument||(_618.contentWindow&&_618.contentWindow.document)||(_618.name&&win.doc.frames[_618.name]&&win.doc.frames[_618.name].document)||null;
},bindDomNode:function(node){
node=dom.byId(node,this.ownerDocument);
var cn;
if(node.tagName.toLowerCase()=="iframe"){
var _619=node,_61a=this._iframeContentWindow(_619);
cn=win.body(_61a.document);
}else{
cn=(node==win.body(this.ownerDocument)?this.ownerDocument.documentElement:node);
}
var _61b={node:node,iframe:_619};
_610.set(node,"_dijitMenu"+this.id,this._bindings.push(_61b));
var _61c=lang.hitch(this,function(cn){
var _61d=this.selector,_61e=_61d?function(_61f){
return on.selector(_61d,_61f);
}:function(_620){
return _620;
},self=this;
return [on(cn,_61e(this.leftClickToOpen?"click":"contextmenu"),function(evt){
_60f.stop(evt);
self._scheduleOpen(this,_619,{x:evt.pageX,y:evt.pageY});
}),on(cn,_61e("keydown"),function(evt){
if(evt.shiftKey&&evt.keyCode==keys.F10){
_60f.stop(evt);
self._scheduleOpen(this,_619);
}
})];
});
_61b.connects=cn?_61c(cn):[];
if(_619){
_61b.onloadHandler=lang.hitch(this,function(){
var _621=this._iframeContentWindow(_619);
cn=win.body(_621.document);
_61b.connects=_61c(cn);
});
if(_619.addEventListener){
_619.addEventListener("load",_61b.onloadHandler,false);
}else{
_619.attachEvent("onload",_61b.onloadHandler);
}
}
},unBindDomNode:function(_622){
var node;
try{
node=dom.byId(_622,this.ownerDocument);
}
catch(e){
return;
}
var _623="_dijitMenu"+this.id;
if(node&&_610.has(node,_623)){
var bid=_610.get(node,_623)-1,b=this._bindings[bid],h;
while((h=b.connects.pop())){
h.remove();
}
var _624=b.iframe;
if(_624){
if(_624.removeEventListener){
_624.removeEventListener("load",b.onloadHandler,false);
}else{
_624.detachEvent("onload",b.onloadHandler);
}
}
_610.remove(node,_623);
delete this._bindings[bid];
}
},_scheduleOpen:function(_625,_626,_627){
if(!this._openTimer){
this._openTimer=this.defer(function(){
delete this._openTimer;
this._openMyself({target:_625,iframe:_626,coords:_627});
},1);
}
},_openMyself:function(args){
var _628=args.target,_629=args.iframe,_62a=args.coords;
this.currentTarget=_628;
if(_62a){
if(_629){
var ifc=_611.position(_629,true),_62b=this._iframeContentWindow(_629),_62c=_611.docScroll(_62b.document);
var cs=_612.getComputedStyle(_629),tp=_612.toPixelValue,left=(has("ie")&&has("quirks")?0:tp(_629,cs.paddingLeft))+(has("ie")&&has("quirks")?tp(_629,cs.borderLeftWidth):0),top=(has("ie")&&has("quirks")?0:tp(_629,cs.paddingTop))+(has("ie")&&has("quirks")?tp(_629,cs.borderTopWidth):0);
_62a.x+=ifc.x+left-_62c.x;
_62a.y+=ifc.y+top-_62c.y;
}
}else{
_62a=_611.position(_628,true);
_62a.x+=10;
_62a.y+=10;
}
var self=this;
var _62d=this._focusManager.get("prevNode");
var _62e=this._focusManager.get("curNode");
var _62f=!_62e||(dom.isDescendant(_62e,this.domNode))?_62d:_62e;
function _630(){
if(self.refocus&&_62f){
_62f.focus();
}
pm.close(self);
};
pm.open({popup:this,x:_62a.x,y:_62a.y,onExecute:_630,onCancel:_630,orient:this.isLeftToRight()?"L":"R"});
this.focus();
this._onBlur=function(){
this.inherited("_onBlur",arguments);
pm.close(this);
};
},destroy:function(){
_60d.forEach(this._bindings,function(b){
if(b){
this.unBindDomNode(b.node);
}
},this);
this.inherited(arguments);
}});
});
},"dijit/form/_CheckBoxMixin":function(){
define(["dojo/_base/declare","dojo/dom-attr","dojo/_base/event"],function(_631,_632,_633){
return _631("dijit.form._CheckBoxMixin",null,{type:"checkbox",value:"on",readOnly:false,_aria_attr:"aria-checked",_setReadOnlyAttr:function(_634){
this._set("readOnly",_634);
_632.set(this.focusNode,"readOnly",_634);
this.focusNode.setAttribute("aria-readonly",_634);
},_setLabelAttr:undefined,_getSubmitValue:function(_635){
return !_635&&_635!==0?"on":_635;
},_setValueAttr:function(_636){
_636=this._getSubmitValue(_636);
this._set("value",_636);
_632.set(this.focusNode,"value",_636);
},reset:function(){
this.inherited(arguments);
this._set("value",this.params.value||"on");
_632.set(this.focusNode,"value",this.value);
},_onClick:function(e){
if(this.readOnly){
_633.stop(e);
return false;
}
return this.inherited(arguments);
}});
});
},"dijit/layout/ContentPane":function(){
define(["dojo/_base/kernel","dojo/_base/lang","../_Widget","../_Container","./_ContentPaneResizeMixin","dojo/string","dojo/html","dojo/i18n!../nls/loading","dojo/_base/array","dojo/_base/declare","dojo/_base/Deferred","dojo/dom","dojo/dom-attr","dojo/_base/xhr","dojo/i18n","dojo/when"],function(_637,lang,_638,_639,_63a,_63b,html,_63c,_63d,_63e,_63f,dom,_640,xhr,i18n,when){
return _63e("dijit.layout.ContentPane",[_638,_639,_63a],{href:"",content:"",extractContent:false,parseOnLoad:true,parserScope:_637._scopeName,preventCache:false,preload:false,refreshOnShow:false,loadingMessage:"<span class='dijitContentPaneLoading'><span class='dijitInline dijitIconLoading'></span>${loadingState}</span>",errorMessage:"<span class='dijitContentPaneError'><span class='dijitInline dijitIconError'></span>${errorState}</span>",isLoaded:false,baseClass:"dijitContentPane",ioArgs:{},onLoadDeferred:null,_setTitleAttr:null,stopParser:true,template:false,create:function(_641,_642){
if((!_641||!_641.template)&&_642&&!("href" in _641)&&!("content" in _641)){
_642=dom.byId(_642);
var df=_642.ownerDocument.createDocumentFragment();
while(_642.firstChild){
df.appendChild(_642.firstChild);
}
_641=lang.delegate(_641,{content:df});
}
this.inherited(arguments,[_641,_642]);
},postMixInProperties:function(){
this.inherited(arguments);
var _643=i18n.getLocalization("dijit","loading",this.lang);
this.loadingMessage=_63b.substitute(this.loadingMessage,_643);
this.errorMessage=_63b.substitute(this.errorMessage,_643);
},buildRendering:function(){
this.inherited(arguments);
if(!this.containerNode){
this.containerNode=this.domNode;
}
this.domNode.title="";
if(!_640.get(this.domNode,"role")){
this.domNode.setAttribute("role","group");
}
},startup:function(){
this.inherited(arguments);
if(this._contentSetter){
_63d.forEach(this._contentSetter.parseResults,function(obj){
if(!obj._started&&!obj._destroyed&&lang.isFunction(obj.startup)){
obj.startup();
obj._started=true;
}
},this);
}
},_startChildren:function(){
_63d.forEach(this.getChildren(),function(obj){
if(!obj._started&&!obj._destroyed&&lang.isFunction(obj.startup)){
obj.startup();
obj._started=true;
}
});
if(this._contentSetter){
_63d.forEach(this._contentSetter.parseResults,function(obj){
if(!obj._started&&!obj._destroyed&&lang.isFunction(obj.startup)){
obj.startup();
obj._started=true;
}
},this);
}
},setHref:function(href){
_637.deprecated("dijit.layout.ContentPane.setHref() is deprecated. Use set('href', ...) instead.","","2.0");
return this.set("href",href);
},_setHrefAttr:function(href){
this.cancel();
this.onLoadDeferred=new _63f(lang.hitch(this,"cancel"));
this.onLoadDeferred.then(lang.hitch(this,"onLoad"));
this._set("href",href);
if(this.preload||(this._created&&this._isShown())){
this._load();
}else{
this._hrefChanged=true;
}
return this.onLoadDeferred;
},setContent:function(data){
_637.deprecated("dijit.layout.ContentPane.setContent() is deprecated.  Use set('content', ...) instead.","","2.0");
this.set("content",data);
},_setContentAttr:function(data){
this._set("href","");
this.cancel();
this.onLoadDeferred=new _63f(lang.hitch(this,"cancel"));
if(this._created){
this.onLoadDeferred.then(lang.hitch(this,"onLoad"));
}
this._setContent(data||"");
this._isDownloaded=false;
return this.onLoadDeferred;
},_getContentAttr:function(){
return this.containerNode.innerHTML;
},cancel:function(){
if(this._xhrDfd&&(this._xhrDfd.fired==-1)){
this._xhrDfd.cancel();
}
delete this._xhrDfd;
this.onLoadDeferred=null;
},destroy:function(){
this.cancel();
this.inherited(arguments);
},destroyRecursive:function(_644){
if(this._beingDestroyed){
return;
}
this.inherited(arguments);
},_onShow:function(){
this.inherited(arguments);
if(this.href){
if(!this._xhrDfd&&(!this.isLoaded||this._hrefChanged||this.refreshOnShow)){
return this.refresh();
}
}
},refresh:function(){
this.cancel();
this.onLoadDeferred=new _63f(lang.hitch(this,"cancel"));
this.onLoadDeferred.then(lang.hitch(this,"onLoad"));
this._load();
return this.onLoadDeferred;
},_load:function(){
this._setContent(this.onDownloadStart(),true);
var self=this;
var _645={preventCache:(this.preventCache||this.refreshOnShow),url:this.href,handleAs:"text"};
if(lang.isObject(this.ioArgs)){
lang.mixin(_645,this.ioArgs);
}
var hand=(this._xhrDfd=(this.ioMethod||xhr.get)(_645)),_646;
hand.then(function(html){
_646=html;
try{
self._isDownloaded=true;
return self._setContent(html,false);
}
catch(err){
self._onError("Content",err);
}
},function(err){
if(!hand.canceled){
self._onError("Download",err);
}
delete self._xhrDfd;
return err;
}).then(function(){
self.onDownloadEnd();
delete self._xhrDfd;
return _646;
});
delete this._hrefChanged;
},_onLoadHandler:function(data){
this._set("isLoaded",true);
try{
this.onLoadDeferred.resolve(data);
}
catch(e){
console.error("Error "+this.widgetId+" running custom onLoad code: "+e.message);
}
},_onUnloadHandler:function(){
this._set("isLoaded",false);
try{
this.onUnload();
}
catch(e){
console.error("Error "+this.widgetId+" running custom onUnload code: "+e.message);
}
},destroyDescendants:function(_647){
if(this.isLoaded){
this._onUnloadHandler();
}
var _648=this._contentSetter;
_63d.forEach(this.getChildren(),function(_649){
if(_649.destroyRecursive){
_649.destroyRecursive(_647);
}else{
if(_649.destroy){
_649.destroy(_647);
}
}
_649._destroyed=true;
});
if(_648){
_63d.forEach(_648.parseResults,function(_64a){
if(!_64a._destroyed){
if(_64a.destroyRecursive){
_64a.destroyRecursive(_647);
}else{
if(_64a.destroy){
_64a.destroy(_647);
}
}
_64a._destroyed=true;
}
});
delete _648.parseResults;
}
if(!_647){
html._emptyNode(this.containerNode);
}
delete this._singleChild;
},_setContent:function(cont,_64b){
this.destroyDescendants();
var _64c=this._contentSetter;
if(!(_64c&&_64c instanceof html._ContentSetter)){
_64c=this._contentSetter=new html._ContentSetter({node:this.containerNode,_onError:lang.hitch(this,this._onError),onContentError:lang.hitch(this,function(e){
var _64d=this.onContentError(e);
try{
this.containerNode.innerHTML=_64d;
}
catch(e){
console.error("Fatal "+this.id+" could not change content due to "+e.message,e);
}
})});
}
var _64e=lang.mixin({cleanContent:this.cleanContent,extractContent:this.extractContent,parseContent:!cont.domNode&&this.parseOnLoad,parserScope:this.parserScope,startup:false,dir:this.dir,lang:this.lang,textDir:this.textDir},this._contentSetterParams||{});
var p=_64c.set((lang.isObject(cont)&&cont.domNode)?cont.domNode:cont,_64e);
var self=this;
return when(p&&p.then?p:_64c.parseDeferred,function(){
delete self._contentSetterParams;
if(!_64b){
if(self._started){
self._startChildren();
self._scheduleLayout();
}
self._onLoadHandler(cont);
}
});
},_onError:function(type,err,_64f){
this.onLoadDeferred.reject(err);
var _650=this["on"+type+"Error"].call(this,err);
if(_64f){
console.error(_64f,err);
}else{
if(_650){
this._setContent(_650,true);
}
}
},onLoad:function(){
},onUnload:function(){
},onDownloadStart:function(){
return this.loadingMessage;
},onContentError:function(){
},onDownloadError:function(){
return this.errorMessage;
},onDownloadEnd:function(){
}});
});
},"url:dijit/form/templates/ValidationTextBox.html":"<div class=\"dijit dijitReset dijitInline dijitLeft\"\n\tid=\"widget_${id}\" role=\"presentation\"\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class=\"dijitReset dijitInputInner\" data-dojo-attach-point='textbox,focusNode' autocomplete=\"off\"\n\t\t\t${!nameAttrSetting} type='${type}'\n\t/></div\n></div>\n","url:dijit/form/templates/TextBox.html":"<div class=\"dijit dijitReset dijitInline dijitLeft\" id=\"widget_${id}\" role=\"presentation\"\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class=\"dijitReset dijitInputInner\" data-dojo-attach-point='textbox,focusNode' autocomplete=\"off\"\n\t\t\t${!nameAttrSetting} type='${type}'\n\t/></div\n></div>\n","dijit/_KeyNavContainer":function(){
define(["dojo/_base/kernel","./_Container","./_FocusMixin","dojo/_base/array","dojo/keys","dojo/_base/declare","dojo/_base/event","dojo/dom-attr","dojo/_base/lang"],function(_651,_652,_653,_654,keys,_655,_656,_657,lang){
return _655("dijit._KeyNavContainer",[_653,_652],{tabIndex:"0",connectKeyNavHandlers:function(_658,_659){
var _65a=(this._keyNavCodes={});
var prev=lang.hitch(this,"focusPrev");
var next=lang.hitch(this,"focusNext");
_654.forEach(_658,function(code){
_65a[code]=prev;
});
_654.forEach(_659,function(code){
_65a[code]=next;
});
_65a[keys.HOME]=lang.hitch(this,"focusFirstChild");
_65a[keys.END]=lang.hitch(this,"focusLastChild");
this.connect(this.domNode,"onkeypress","_onContainerKeypress");
this.connect(this.domNode,"onfocus","_onContainerFocus");
},startupKeyNavChildren:function(){
_651.deprecated("startupKeyNavChildren() call no longer needed","","2.0");
},startup:function(){
this.inherited(arguments);
_654.forEach(this.getChildren(),lang.hitch(this,"_startupChild"));
},addChild:function(_65b,_65c){
this.inherited(arguments);
this._startupChild(_65b);
},focus:function(){
this.focusFirstChild();
},focusFirstChild:function(){
this.focusChild(this._getFirstFocusableChild());
},focusLastChild:function(){
this.focusChild(this._getLastFocusableChild());
},focusNext:function(){
this.focusChild(this._getNextFocusableChild(this.focusedChild,1));
},focusPrev:function(){
this.focusChild(this._getNextFocusableChild(this.focusedChild,-1),true);
},focusChild:function(_65d,last){
if(!_65d){
return;
}
if(this.focusedChild&&_65d!==this.focusedChild){
this._onChildBlur(this.focusedChild);
}
_65d.set("tabIndex",this.tabIndex);
_65d.focus(last?"end":"start");
this._set("focusedChild",_65d);
},_startupChild:function(_65e){
_65e.set("tabIndex","-1");
this.connect(_65e,"_onFocus",function(){
_65e.set("tabIndex",this.tabIndex);
});
this.connect(_65e,"_onBlur",function(){
_65e.set("tabIndex","-1");
});
},_onContainerFocus:function(evt){
if(evt.target!==this.domNode||this.focusedChild){
return;
}
this.focusFirstChild();
_657.set(this.domNode,"tabIndex","-1");
},_onBlur:function(evt){
if(this.tabIndex){
_657.set(this.domNode,"tabIndex",this.tabIndex);
}
this.focusedChild=null;
this.inherited(arguments);
},_onContainerKeypress:function(evt){
if(evt.ctrlKey||evt.altKey){
return;
}
var func=this._keyNavCodes[evt.charOrCode];
if(func){
func();
_656.stop(evt);
}
},_onChildBlur:function(){
},_getFirstFocusableChild:function(){
return this._getNextFocusableChild(null,1);
},_getLastFocusableChild:function(){
return this._getNextFocusableChild(null,-1);
},_getNextFocusableChild:function(_65f,dir){
if(_65f){
_65f=this._getSiblingOfChild(_65f,dir);
}
var _660=this.getChildren();
for(var i=0;i<_660.length;i++){
if(!_65f){
_65f=_660[(dir>0)?0:(_660.length-1)];
}
if(_65f.isFocusable()){
return _65f;
}
_65f=this._getSiblingOfChild(_65f,dir);
}
return null;
}});
});
},"dijit/layout/utils":function(){
define(["dojo/_base/array","dojo/dom-class","dojo/dom-geometry","dojo/dom-style","dojo/_base/lang","../main"],function(_661,_662,_663,_664,lang,_665){
var _666=lang.getObject("layout",true,_665);
_666.marginBox2contentBox=function(node,mb){
var cs=_664.getComputedStyle(node);
var me=_663.getMarginExtents(node,cs);
var pb=_663.getPadBorderExtents(node,cs);
return {l:_664.toPixelValue(node,cs.paddingLeft),t:_664.toPixelValue(node,cs.paddingTop),w:mb.w-(me.w+pb.w),h:mb.h-(me.h+pb.h)};
};
function _667(word){
return word.substring(0,1).toUpperCase()+word.substring(1);
};
function size(_668,dim){
var _669=_668.resize?_668.resize(dim):_663.setMarginBox(_668.domNode,dim);
if(_669){
lang.mixin(_668,_669);
}else{
lang.mixin(_668,_663.getMarginBox(_668.domNode));
lang.mixin(_668,dim);
}
};
_666.layoutChildren=function(_66a,dim,_66b,_66c,_66d){
dim=lang.mixin({},dim);
_662.add(_66a,"dijitLayoutContainer");
_66b=_661.filter(_66b,function(item){
return item.region!="center"&&item.layoutAlign!="client";
}).concat(_661.filter(_66b,function(item){
return item.region=="center"||item.layoutAlign=="client";
}));
_661.forEach(_66b,function(_66e){
var elm=_66e.domNode,pos=(_66e.region||_66e.layoutAlign);
if(!pos){
throw new Error("No region setting for "+_66e.id);
}
var _66f=elm.style;
_66f.left=dim.l+"px";
_66f.top=dim.t+"px";
_66f.position="absolute";
_662.add(elm,"dijitAlign"+_667(pos));
var _670={};
if(_66c&&_66c==_66e.id){
_670[_66e.region=="top"||_66e.region=="bottom"?"h":"w"]=_66d;
}
if(pos=="top"||pos=="bottom"){
_670.w=dim.w;
size(_66e,_670);
dim.h-=_66e.h;
if(pos=="top"){
dim.t+=_66e.h;
}else{
_66f.top=dim.t+dim.h+"px";
}
}else{
if(pos=="left"||pos=="right"){
_670.h=dim.h;
size(_66e,_670);
dim.w-=_66e.w;
if(pos=="left"){
dim.l+=_66e.w;
}else{
_66f.left=dim.l+dim.w+"px";
}
}else{
if(pos=="client"||pos=="center"){
size(_66e,dim);
}
}
}
});
};
return {marginBox2contentBox:_666.marginBox2contentBox,layoutChildren:_666.layoutChildren};
});
},"dijit/form/DataList":function(){
define(["dojo/_base/declare","dojo/dom","dojo/_base/lang","dojo/query","dojo/store/Memory","../registry"],function(_671,dom,lang,_672,_673,_674){
function _675(_676){
return {id:_676.value,value:_676.value,name:lang.trim(_676.innerText||_676.textContent||"")};
};
return _671("dijit.form.DataList",_673,{constructor:function(_677,_678){
this.domNode=dom.byId(_678);
lang.mixin(this,_677);
if(this.id){
_674.add(this);
}
this.domNode.style.display="none";
this.inherited(arguments,[{data:_672("option",this.domNode).map(_675)}]);
},destroy:function(){
_674.remove(this.id);
},fetchSelectedItem:function(){
var _679=_672("> option[selected]",this.domNode)[0]||_672("> option",this.domNode)[0];
return _679&&_675(_679);
}});
});
},"url:dijit/templates/Dialog.html":"<div class=\"dijitDialog\" role=\"dialog\" aria-labelledby=\"${id}_title\">\n\t<div data-dojo-attach-point=\"titleBar\" class=\"dijitDialogTitleBar\">\n\t\t<span data-dojo-attach-point=\"titleNode\" class=\"dijitDialogTitle\" id=\"${id}_title\"\n\t\t\t\trole=\"header\" level=\"1\"></span>\n\t\t<span data-dojo-attach-point=\"closeButtonNode\" class=\"dijitDialogCloseIcon\" data-dojo-attach-event=\"ondijitclick: onCancel\" title=\"${buttonCancel}\" role=\"button\" tabIndex=\"-1\">\n\t\t\t<span data-dojo-attach-point=\"closeText\" class=\"closeText\" title=\"${buttonCancel}\">x</span>\n\t\t</span>\n\t</div>\n\t<div data-dojo-attach-point=\"containerNode\" class=\"dijitDialogPaneContent\"></div>\n</div>\n","dijit/form/CheckBox":function(){
define(["require","dojo/_base/declare","dojo/dom-attr","dojo/has","dojo/query","dojo/ready","./ToggleButton","./_CheckBoxMixin","dojo/text!./templates/CheckBox.html","dojo/NodeList-dom"],function(_67a,_67b,_67c,has,_67d,_67e,_67f,_680,_681){
if(has("dijit-legacy-requires")){
_67e(0,function(){
var _682=["dijit/form/RadioButton"];
_67a(_682);
});
}
return _67b("dijit.form.CheckBox",[_67f,_680],{templateString:_681,baseClass:"dijitCheckBox",_setValueAttr:function(_683,_684){
if(typeof _683=="string"){
this.inherited(arguments);
_683=true;
}
if(this._created){
this.set("checked",_683,_684);
}
},_getValueAttr:function(){
return (this.checked?this.value:false);
},_setIconClassAttr:null,postMixInProperties:function(){
this.inherited(arguments);
this.checkedAttrSetting=this.checked?"checked":"";
},_fillContent:function(){
},_onFocus:function(){
if(this.id){
_67d("label[for='"+this.id+"']").addClass("dijitFocusedLabel");
}
this.inherited(arguments);
},_onBlur:function(){
if(this.id){
_67d("label[for='"+this.id+"']").removeClass("dijitFocusedLabel");
}
this.inherited(arguments);
}});
});
},"dijit/_editor/_Plugin":function(){
define(["dojo/_base/connect","dojo/_base/declare","dojo/_base/lang","../form/Button"],function(_685,_686,lang,_687){
var _688=_686("dijit._editor._Plugin",null,{constructor:function(args){
this.params=args||{};
lang.mixin(this,this.params);
this._connects=[];
this._attrPairNames={};
},editor:null,iconClassPrefix:"dijitEditorIcon",button:null,command:"",useDefaultCommand:true,buttonClass:_687,disabled:false,getLabel:function(key){
return this.editor.commands[key];
},_initButton:function(){
if(this.command.length){
var _689=this.getLabel(this.command),_68a=this.editor,_68b=this.iconClassPrefix+" "+this.iconClassPrefix+this.command.charAt(0).toUpperCase()+this.command.substr(1);
if(!this.button){
var _68c=lang.mixin({label:_689,ownerDocument:_68a.ownerDocument,dir:_68a.dir,lang:_68a.lang,showLabel:false,iconClass:_68b,dropDown:this.dropDown,tabIndex:"-1"},this.params||{});
this.button=new this.buttonClass(_68c);
}
}
if(this.get("disabled")&&this.button){
this.button.set("disabled",this.get("disabled"));
}
},destroy:function(){
var h;
while(h=this._connects.pop()){
h.remove();
}
if(this.dropDown){
this.dropDown.destroyRecursive();
}
},connect:function(o,f,tf){
this._connects.push(_685.connect(o,f,this,tf));
},updateState:function(){
var e=this.editor,c=this.command,_68d,_68e;
if(!e||!e.isLoaded||!c.length){
return;
}
var _68f=this.get("disabled");
if(this.button){
try{
_68e=!_68f&&e.queryCommandEnabled(c);
if(this.enabled!==_68e){
this.enabled=_68e;
this.button.set("disabled",!_68e);
}
if(_68e){
if(typeof this.button.checked=="boolean"){
_68d=e.queryCommandState(c);
if(this.checked!==_68d){
this.checked=_68d;
this.button.set("checked",e.queryCommandState(c));
}
}
}
}
catch(e){
}
}
},setEditor:function(_690){
this.editor=_690;
this._initButton();
if(this.button&&this.useDefaultCommand){
if(this.editor.queryCommandAvailable(this.command)){
this.connect(this.button,"onClick",lang.hitch(this.editor,"execCommand",this.command,this.commandArg));
}else{
this.button.domNode.style.display="none";
}
}
this.connect(this.editor,"onNormalizedDisplayChanged","updateState");
},setToolbar:function(_691){
if(this.button){
_691.addChild(this.button);
}
},set:function(name,_692){
if(typeof name==="object"){
for(var x in name){
this.set(x,name[x]);
}
return this;
}
var _693=this._getAttrNames(name);
if(this[_693.s]){
var _694=this[_693.s].apply(this,Array.prototype.slice.call(arguments,1));
}else{
this._set(name,_692);
}
return _694||this;
},get:function(name){
var _695=this._getAttrNames(name);
return this[_695.g]?this[_695.g]():this[name];
},_setDisabledAttr:function(_696){
this.disabled=_696;
this.updateState();
},_getAttrNames:function(name){
var apn=this._attrPairNames;
if(apn[name]){
return apn[name];
}
var uc=name.charAt(0).toUpperCase()+name.substr(1);
return (apn[name]={s:"_set"+uc+"Attr",g:"_get"+uc+"Attr"});
},_set:function(name,_697){
this[name]=_697;
}});
_688.registry={};
return _688;
});
},"url:dijit/templates/MenuBar.html":"<div class=\"dijitMenuBar dijitMenuPassive\" data-dojo-attach-point=\"containerNode\"  role=\"menubar\" tabIndex=\"${tabIndex}\" data-dojo-attach-event=\"onkeypress: _onKeyPress\"></div>\n","dijit/tree/_dndSelector":function(){
define(["dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/_base/Deferred","dojo/_base/kernel","dojo/_base/lang","dojo/cookie","dojo/mouse","dojo/on","dojo/touch","./_dndContainer"],function(_698,_699,_69a,_69b,_69c,lang,_69d,_69e,on,_69f,_6a0){
return _69a("dijit.tree._dndSelector",_6a0,{constructor:function(){
this.selection={};
this.anchor=null;
if(!this.cookieName&&this.tree.id){
this.cookieName=this.tree.id+"SaveSelectedCookie";
}
this.events.push(on(this.tree.domNode,_69f.press,lang.hitch(this,"onMouseDown")),on(this.tree.domNode,_69f.release,lang.hitch(this,"onMouseUp")),on(this.tree.domNode,_69f.move,lang.hitch(this,"onMouseMove")));
},singular:false,getSelectedTreeNodes:function(){
var _6a1=[],sel=this.selection;
for(var i in sel){
_6a1.push(sel[i]);
}
return _6a1;
},selectNone:function(){
this.setSelection([]);
return this;
},destroy:function(){
this.inherited(arguments);
this.selection=this.anchor=null;
},addTreeNode:function(node,_6a2){
this.setSelection(this.getSelectedTreeNodes().concat([node]));
if(_6a2){
this.anchor=node;
}
return node;
},removeTreeNode:function(node){
this.setSelection(this._setDifference(this.getSelectedTreeNodes(),[node]));
return node;
},isTreeNodeSelected:function(node){
return node.id&&!!this.selection[node.id];
},setSelection:function(_6a3){
var _6a4=this.getSelectedTreeNodes();
_698.forEach(this._setDifference(_6a4,_6a3),lang.hitch(this,function(node){
node.setSelected(false);
if(this.anchor==node){
delete this.anchor;
}
delete this.selection[node.id];
}));
_698.forEach(this._setDifference(_6a3,_6a4),lang.hitch(this,function(node){
node.setSelected(true);
this.selection[node.id]=node;
}));
this._updateSelectionProperties();
},_setDifference:function(xs,ys){
_698.forEach(ys,function(y){
y.__exclude__=true;
});
var ret=_698.filter(xs,function(x){
return !x.__exclude__;
});
_698.forEach(ys,function(y){
delete y["__exclude__"];
});
return ret;
},_updateSelectionProperties:function(){
var _6a5=this.getSelectedTreeNodes();
var _6a6=[],_6a7=[],_6a8=[];
_698.forEach(_6a5,function(node){
var ary=node.getTreePath(),_6a9=this.tree.model;
_6a7.push(node);
_6a6.push(ary);
ary=_698.map(ary,function(item){
return _6a9.getIdentity(item);
},this);
_6a8.push(ary.join("/"));
},this);
var _6aa=_698.map(_6a7,function(node){
return node.item;
});
this.tree._set("paths",_6a6);
this.tree._set("path",_6a6[0]||[]);
this.tree._set("selectedNodes",_6a7);
this.tree._set("selectedNode",_6a7[0]||null);
this.tree._set("selectedItems",_6aa);
this.tree._set("selectedItem",_6aa[0]||null);
if(this.tree.persist&&_6a8.length>0){
_69d(this.cookieName,_6a8.join(","),{expires:365});
}
},_getSavedPaths:function(){
var tree=this.tree;
if(tree.persist&&tree.dndController.cookieName){
var oreo,_6ab=[];
oreo=_69d(tree.dndController.cookieName);
if(oreo){
_6ab=_698.map(oreo.split(","),function(path){
return path.split("/");
});
}
return _6ab;
}
},onMouseDown:function(e){
if(!this.current||this.tree.isExpandoNode(e.target,this.current)){
return;
}
if(e.type!="touchstart"&&!_69e.isLeft(e)){
return;
}
var _6ac=this.current,copy=_699.isCopyKey(e),id=_6ac.id;
if(!this.singular&&!e.shiftKey&&this.selection[id]){
this._doDeselect=true;
return;
}else{
this._doDeselect=false;
}
this.userSelect(_6ac,copy,e.shiftKey);
},onMouseUp:function(e){
if(!this._doDeselect){
return;
}
this._doDeselect=false;
this.userSelect(this.current,_699.isCopyKey(e),e.shiftKey);
},onMouseMove:function(){
this._doDeselect=false;
},_compareNodes:function(n1,n2){
if(n1===n2){
return 0;
}
if("sourceIndex" in document.documentElement){
return n1.sourceIndex-n2.sourceIndex;
}else{
if("compareDocumentPosition" in document.documentElement){
return n1.compareDocumentPosition(n2)&2?1:-1;
}else{
if(document.createRange){
var r1=doc.createRange();
r1.setStartBefore(n1);
var r2=doc.createRange();
r2.setStartBefore(n2);
return r1.compareBoundaryPoints(r1.END_TO_END,r2);
}else{
throw Error("dijit.tree._compareNodes don't know how to compare two different nodes in this browser");
}
}
}
},userSelect:function(node,_6ad,_6ae){
if(this.singular){
if(this.anchor==node&&_6ad){
this.selectNone();
}else{
this.setSelection([node]);
this.anchor=node;
}
}else{
if(_6ae&&this.anchor){
var cr=this._compareNodes(this.anchor.rowNode,node.rowNode),_6af,end,_6b0=this.anchor;
if(cr<0){
_6af=_6b0;
end=node;
}else{
_6af=node;
end=_6b0;
}
var _6b1=[];
while(_6af!=end){
_6b1.push(_6af);
_6af=this.tree._getNextNode(_6af);
}
_6b1.push(end);
this.setSelection(_6b1);
}else{
if(this.selection[node.id]&&_6ad){
this.removeTreeNode(node);
}else{
if(_6ad){
this.addTreeNode(node,true);
}else{
this.setSelection([node]);
this.anchor=node;
}
}
}
}
},getItem:function(key){
var _6b2=this.selection[key];
return {data:_6b2,type:["treeNode"]};
},forInSelectedItems:function(f,o){
o=o||_69c.global;
for(var id in this.selection){
f.call(o,this.getItem(id),id,this);
}
}});
});
},"dojo/html":function(){
define(["./_base/kernel","./_base/lang","./_base/array","./_base/declare","./dom","./dom-construct","./parser"],function(_6b3,lang,_6b4,_6b5,dom,_6b6,_6b7){
var html={};
lang.setObject("dojo.html",html);
var _6b8=0;
html._secureForInnerHtml=function(cont){
return cont.replace(/(?:\s*<!DOCTYPE\s[^>]+>|<title[^>]*>[\s\S]*?<\/title>)/ig,"");
};
html._emptyNode=_6b6.empty;
html._setNodeContent=function(node,cont){
_6b6.empty(node);
if(cont){
if(typeof cont=="string"){
cont=_6b6.toDom(cont,node.ownerDocument);
}
if(!cont.nodeType&&lang.isArrayLike(cont)){
for(var _6b9=cont.length,i=0;i<cont.length;i=_6b9==cont.length?i+1:0){
_6b6.place(cont[i],node,"last");
}
}else{
_6b6.place(cont,node,"last");
}
}
return node;
};
html._ContentSetter=_6b5("dojo.html._ContentSetter",null,{node:"",content:"",id:"",cleanContent:false,extractContent:false,parseContent:false,parserScope:_6b3._scopeName,startup:true,constructor:function(_6ba,node){
lang.mixin(this,_6ba||{});
node=this.node=dom.byId(this.node||node);
if(!this.id){
this.id=["Setter",(node)?node.id||node.tagName:"",_6b8++].join("_");
}
},set:function(cont,_6bb){
if(undefined!==cont){
this.content=cont;
}
if(_6bb){
this._mixin(_6bb);
}
this.onBegin();
this.setContent();
var ret=this.onEnd();
if(ret&&ret.then){
return ret;
}else{
return this.node;
}
},setContent:function(){
var node=this.node;
if(!node){
throw new Error(this.declaredClass+": setContent given no node");
}
try{
node=html._setNodeContent(node,this.content);
}
catch(e){
var _6bc=this.onContentError(e);
try{
node.innerHTML=_6bc;
}
catch(e){
console.error("Fatal "+this.declaredClass+".setContent could not change content due to "+e.message,e);
}
}
this.node=node;
},empty:function(){
if(this.parseDeferred){
if(!this.parseDeferred.isResolved()){
this.parseDeferred.cancel();
}
delete this.parseDeferred;
}
if(this.parseResults&&this.parseResults.length){
_6b4.forEach(this.parseResults,function(w){
if(w.destroy){
w.destroy();
}
});
delete this.parseResults;
}
html._emptyNode(this.node);
},onBegin:function(){
var cont=this.content;
if(lang.isString(cont)){
if(this.cleanContent){
cont=html._secureForInnerHtml(cont);
}
if(this.extractContent){
var _6bd=cont.match(/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im);
if(_6bd){
cont=_6bd[1];
}
}
}
this.empty();
this.content=cont;
return this.node;
},onEnd:function(){
if(this.parseContent){
this._parse();
}
return this.node;
},tearDown:function(){
delete this.parseResults;
delete this.parseDeferred;
delete this.node;
delete this.content;
},onContentError:function(err){
return "Error occurred setting content: "+err;
},onExecError:function(err){
return "Error occurred executing scripts: "+err;
},_mixin:function(_6be){
var _6bf={},key;
for(key in _6be){
if(key in _6bf){
continue;
}
this[key]=_6be[key];
}
},_parse:function(){
var _6c0=this.node;
try{
var _6c1={};
_6b4.forEach(["dir","lang","textDir"],function(name){
if(this[name]){
_6c1[name]=this[name];
}
},this);
var self=this;
this.parseDeferred=_6b7.parse({rootNode:_6c0,noStart:!this.startup,inherited:_6c1,scope:this.parserScope}).then(function(_6c2){
return self.parseResults=_6c2;
});
}
catch(e){
this._onError("Content",e,"Error parsing in _ContentSetter#"+this.id);
}
},_onError:function(type,err,_6c3){
var _6c4=this["on"+type+"Error"].call(this,err);
if(_6c3){
console.error(_6c3,err);
}else{
if(_6c4){
html._setNodeContent(this.node,_6c4,true);
}
}
}});
html.set=function(node,cont,_6c5){
if(undefined==cont){
console.warn("dojo.html.set: no cont argument provided, using empty string");
cont="";
}
if(!_6c5){
return html._setNodeContent(node,cont,true);
}else{
var op=new html._ContentSetter(lang.mixin(_6c5,{content:cont,node:node}));
return op.set();
}
};
return html;
});
},"dijit/_PaletteMixin":function(){
define(["dojo/_base/declare","dojo/dom-attr","dojo/dom-class","dojo/dom-construct","dojo/_base/event","dojo/keys","dojo/_base/lang","./_CssStateMixin","./focus","./typematic"],function(_6c6,_6c7,_6c8,_6c9,_6ca,keys,lang,_6cb,_6cc,_6cd){
return _6c6("dijit._PaletteMixin",[_6cb],{defaultTimeout:500,timeoutChangeRate:0.9,value:"",_selectedCell:-1,tabIndex:"0",cellClass:"dijitPaletteCell",dyeClass:null,summary:"",_setSummaryAttr:"paletteTableNode",_dyeFactory:function(_6ce){
var _6cf=typeof this.dyeClass=="string"?lang.getObject(this.dyeClass):this.dyeClass;
return new _6cf(_6ce);
},_preparePalette:function(_6d0,_6d1){
this._cells=[];
var url=this._blankGif;
this.connect(this.gridNode,"ondijitclick","_onCellClick");
for(var row=0;row<_6d0.length;row++){
var _6d2=_6c9.create("tr",{tabIndex:"-1"},this.gridNode);
for(var col=0;col<_6d0[row].length;col++){
var _6d3=_6d0[row][col];
if(_6d3){
var _6d4=this._dyeFactory(_6d3,row,col,_6d1[_6d3]);
var _6d5=_6c9.create("td",{"class":this.cellClass,tabIndex:"-1",title:_6d1[_6d3],role:"gridcell"},_6d2);
_6d4.fillCell(_6d5,url);
_6d5.idx=this._cells.length;
this._cells.push({node:_6d5,dye:_6d4});
}
}
}
this._xDim=_6d0[0].length;
this._yDim=_6d0.length;
var _6d6={UP_ARROW:-this._xDim,DOWN_ARROW:this._xDim,RIGHT_ARROW:this.isLeftToRight()?1:-1,LEFT_ARROW:this.isLeftToRight()?-1:1};
for(var key in _6d6){
this.own(_6cd.addKeyListener(this.domNode,{charOrCode:keys[key],ctrlKey:false,altKey:false,shiftKey:false},this,function(){
var _6d7=_6d6[key];
return function(_6d8){
this._navigateByKey(_6d7,_6d8);
};
}(),this.timeoutChangeRate,this.defaultTimeout));
}
},postCreate:function(){
this.inherited(arguments);
this._setCurrent(this._cells[0].node);
},focus:function(){
_6cc.focus(this._currentFocus);
},_onCellClick:function(evt){
var _6d9=evt.target;
while(_6d9.tagName!="TD"){
if(!_6d9.parentNode||_6d9==this.gridNode){
return;
}
_6d9=_6d9.parentNode;
}
var _6da=this._getDye(_6d9).getValue();
this._setCurrent(_6d9);
_6cc.focus(_6d9);
this._setValueAttr(_6da,true);
_6ca.stop(evt);
},_setCurrent:function(node){
if("_currentFocus" in this){
_6c7.set(this._currentFocus,"tabIndex","-1");
}
this._currentFocus=node;
if(node){
_6c7.set(node,"tabIndex",this.tabIndex);
}
},_setValueAttr:function(_6db,_6dc){
if(this._selectedCell>=0){
_6c8.remove(this._cells[this._selectedCell].node,this.cellClass+"Selected");
}
this._selectedCell=-1;
if(_6db){
for(var i=0;i<this._cells.length;i++){
if(_6db==this._cells[i].dye.getValue()){
this._selectedCell=i;
_6c8.add(this._cells[i].node,this.cellClass+"Selected");
break;
}
}
}
this._set("value",this._selectedCell>=0?_6db:null);
if(_6dc||_6dc===undefined){
this.onChange(_6db);
}
},onChange:function(){
},_navigateByKey:function(_6dd,_6de){
if(_6de==-1){
return;
}
var _6df=this._currentFocus.idx+_6dd;
if(_6df<this._cells.length&&_6df>-1){
var _6e0=this._cells[_6df].node;
this._setCurrent(_6e0);
this.defer(lang.hitch(_6cc,"focus",_6e0));
}
},_getDye:function(cell){
return this._cells[cell.idx].dye;
}});
});
},"url:dijit/templates/TitlePane.html":"<div>\n\t<div data-dojo-attach-event=\"onclick:_onTitleClick, onkeydown:_onTitleKey\"\n\t\t\tclass=\"dijitTitlePaneTitle\" data-dojo-attach-point=\"titleBarNode\" id=\"${id}_titleBarNode\">\n\t\t<div class=\"dijitTitlePaneTitleFocus\" data-dojo-attach-point=\"focusNode\">\n\t\t\t<img src=\"${_blankGif}\" alt=\"\" data-dojo-attach-point=\"arrowNode\" class=\"dijitArrowNode\" role=\"presentation\"\n\t\t\t/><span data-dojo-attach-point=\"arrowNodeInner\" class=\"dijitArrowNodeInner\"></span\n\t\t\t><span data-dojo-attach-point=\"titleNode\" class=\"dijitTitlePaneTextNode\"></span>\n\t\t</div>\n\t</div>\n\t<div class=\"dijitTitlePaneContentOuter\" data-dojo-attach-point=\"hideNode\" role=\"presentation\">\n\t\t<div class=\"dijitReset\" data-dojo-attach-point=\"wipeNode\" role=\"presentation\">\n\t\t\t<div class=\"dijitTitlePaneContentInner\" data-dojo-attach-point=\"containerNode\" role=\"region\" id=\"${id}_pane\" aria-labelledby=\"${id}_titleBarNode\">\n\t\t\t\t<!-- nested divs because wipeIn()/wipeOut() doesn't work right on node w/padding etc.  Put padding on inner div. -->\n\t\t\t</div>\n\t\t</div>\n\t</div>\n</div>\n","dijit/form/ValidationTextBox":function(){
define(["dojo/_base/declare","dojo/_base/kernel","dojo/i18n","./TextBox","../Tooltip","dojo/text!./templates/ValidationTextBox.html","dojo/i18n!./nls/validate"],function(_6e1,_6e2,i18n,_6e3,_6e4,_6e5){
var _6e6;
return _6e6=_6e1("dijit.form.ValidationTextBox",_6e3,{templateString:_6e5,required:false,promptMessage:"",invalidMessage:"$_unset_$",missingMessage:"$_unset_$",message:"",constraints:{},pattern:".*",regExp:"",regExpGen:function(){
},state:"",tooltipPosition:[],_deprecateRegExp:function(attr,_6e7){
if(_6e7!=_6e6.prototype[attr]){
_6e2.deprecated("ValidationTextBox id="+this.id+", set('"+attr+"', ...) is deprecated.  Use set('pattern', ...) instead.","","2.0");
this.set("pattern",_6e7);
}
},_setRegExpGenAttr:function(_6e8){
this._deprecateRegExp("regExpGen",_6e8);
this.regExpGen=this._getPatternAttr;
},_setRegExpAttr:function(_6e9){
this._deprecateRegExp("regExp",_6e9);
},_setValueAttr:function(){
this.inherited(arguments);
this.validate(this.focused);
},validator:function(_6ea,_6eb){
return (new RegExp("^(?:"+this._getPatternAttr(_6eb)+")"+(this.required?"":"?")+"$")).test(_6ea)&&(!this.required||!this._isEmpty(_6ea))&&(this._isEmpty(_6ea)||this.parse(_6ea,_6eb)!==undefined);
},_isValidSubset:function(){
return this.textbox.value.search(this._partialre)==0;
},isValid:function(){
return this.validator(this.textbox.value,this.constraints);
},_isEmpty:function(_6ec){
return (this.trim?/^\s*$/:/^$/).test(_6ec);
},getErrorMessage:function(){
var _6ed=this.invalidMessage=="$_unset_$"?this.messages.invalidMessage:!this.invalidMessage?this.promptMessage:this.invalidMessage;
var _6ee=this.missingMessage=="$_unset_$"?this.messages.missingMessage:!this.missingMessage?_6ed:this.missingMessage;
return (this.required&&this._isEmpty(this.textbox.value))?_6ee:_6ed;
},getPromptMessage:function(){
return this.promptMessage;
},_maskValidSubsetError:true,validate:function(_6ef){
var _6f0="";
var _6f1=this.disabled||this.isValid(_6ef);
if(_6f1){
this._maskValidSubsetError=true;
}
var _6f2=this._isEmpty(this.textbox.value);
var _6f3=!_6f1&&_6ef&&this._isValidSubset();
this._set("state",_6f1?"":(((((!this._hasBeenBlurred||_6ef)&&_6f2)||_6f3)&&this._maskValidSubsetError)?"Incomplete":"Error"));
this.focusNode.setAttribute("aria-invalid",_6f1?"false":"true");
if(this.state=="Error"){
this._maskValidSubsetError=_6ef&&_6f3;
_6f0=this.getErrorMessage(_6ef);
}else{
if(this.state=="Incomplete"){
_6f0=this.getPromptMessage(_6ef);
this._maskValidSubsetError=!this._hasBeenBlurred||_6ef;
}else{
if(_6f2){
_6f0=this.getPromptMessage(_6ef);
}
}
}
this.set("message",_6f0);
return _6f1;
},displayMessage:function(_6f4){
if(_6f4&&this.focused){
_6e4.show(_6f4,this.domNode,this.tooltipPosition,!this.isLeftToRight());
}else{
_6e4.hide(this.domNode);
}
},_refreshState:function(){
if(this._created){
this.validate(this.focused);
}
this.inherited(arguments);
},constructor:function(_6f5){
this.constraints={};
this.baseClass+=" dijitValidationTextBox";
},startup:function(){
this.inherited(arguments);
this._refreshState();
},_setConstraintsAttr:function(_6f6){
if(!_6f6.locale&&this.lang){
_6f6.locale=this.lang;
}
this._set("constraints",_6f6);
this._refreshState();
},_setPatternAttr:function(_6f7){
this._set("pattern",_6f7);
},_getPatternAttr:function(_6f8){
var p=this.pattern;
var type=(typeof p).toLowerCase();
if(type=="function"){
p=this.pattern(_6f8||this.constraints);
}
if(p!=this._lastRegExp){
var _6f9="";
this._lastRegExp=p;
if(p!=".*"){
p.replace(/\\.|\[\]|\[.*?[^\\]{1}\]|\{.*?\}|\(\?[=:!]|./g,function(re){
switch(re.charAt(0)){
case "{":
case "+":
case "?":
case "*":
case "^":
case "$":
case "|":
case "(":
_6f9+=re;
break;
case ")":
_6f9+="|$)";
break;
default:
_6f9+="(?:"+re+"|$)";
break;
}
});
}
try{
"".search(_6f9);
}
catch(e){
_6f9=this.pattern;
console.warn("RegExp error in "+this.declaredClass+": "+this.pattern);
}
this._partialre="^(?:"+_6f9+")$";
}
return p;
},postMixInProperties:function(){
this.inherited(arguments);
this.messages=i18n.getLocalization("dijit.form","validate",this.lang);
this._setConstraintsAttr(this.constraints);
},_setDisabledAttr:function(_6fa){
this.inherited(arguments);
this._refreshState();
},_setRequiredAttr:function(_6fb){
this._set("required",_6fb);
this.focusNode.setAttribute("aria-required",_6fb);
this._refreshState();
},_setMessageAttr:function(_6fc){
this._set("message",_6fc);
this.displayMessage(_6fc);
},reset:function(){
this._maskValidSubsetError=true;
this.inherited(arguments);
},_onBlur:function(){
this.displayMessage("");
this.inherited(arguments);
}});
});
},"dijit/layout/BorderContainer":function(){
define(["dojo/_base/array","dojo/cookie","dojo/_base/declare","dojo/dom-class","dojo/dom-construct","dojo/dom-geometry","dojo/dom-style","dojo/_base/event","dojo/keys","dojo/_base/lang","dojo/on","dojo/touch","../_WidgetBase","../_Widget","../_TemplatedMixin","./_LayoutWidget","./utils"],function(_6fd,_6fe,_6ff,_700,_701,_702,_703,_704,keys,lang,on,_705,_706,_707,_708,_709,_70a){
var _70b=_6ff("dijit.layout._Splitter",[_707,_708],{live:true,templateString:"<div class=\"dijitSplitter\" data-dojo-attach-event=\"onkeypress:_onKeyPress,press:_startDrag,onmouseenter:_onMouse,onmouseleave:_onMouse\" tabIndex=\"0\" role=\"separator\"><div class=\"dijitSplitterThumb\"></div></div>",constructor:function(){
this._handlers=[];
},postMixInProperties:function(){
this.inherited(arguments);
this.horizontal=/top|bottom/.test(this.region);
this._factor=/top|left/.test(this.region)?1:-1;
this._cookieName=this.container.id+"_"+this.region;
},buildRendering:function(){
this.inherited(arguments);
_700.add(this.domNode,"dijitSplitter"+(this.horizontal?"H":"V"));
if(this.container.persist){
var _70c=_6fe(this._cookieName);
if(_70c){
this.child.domNode.style[this.horizontal?"height":"width"]=_70c;
}
}
},_computeMaxSize:function(){
var dim=this.horizontal?"h":"w",_70d=_702.getMarginBox(this.child.domNode)[dim],_70e=_6fd.filter(this.container.getChildren(),function(_70f){
return _70f.region=="center";
})[0],_710=_702.getMarginBox(_70e.domNode)[dim];
return Math.min(this.child.maxSize,_70d+_710);
},_startDrag:function(e){
if(!this.cover){
this.cover=_701.place("<div class=dijitSplitterCover></div>",this.child.domNode,"after");
}
_700.add(this.cover,"dijitSplitterCoverActive");
if(this.fake){
_701.destroy(this.fake);
}
if(!(this._resize=this.live)){
(this.fake=this.domNode.cloneNode(true)).removeAttribute("id");
_700.add(this.domNode,"dijitSplitterShadow");
_701.place(this.fake,this.domNode,"after");
}
_700.add(this.domNode,"dijitSplitterActive dijitSplitter"+(this.horizontal?"H":"V")+"Active");
if(this.fake){
_700.remove(this.fake,"dijitSplitterHover dijitSplitter"+(this.horizontal?"H":"V")+"Hover");
}
var _711=this._factor,_712=this.horizontal,axis=_712?"pageY":"pageX",_713=e[axis],_714=this.domNode.style,dim=_712?"h":"w",_715=_702.getMarginBox(this.child.domNode)[dim],max=this._computeMaxSize(),min=this.child.minSize||20,_716=this.region,_717=_716=="top"||_716=="bottom"?"top":"left",_718=parseInt(_714[_717],10),_719=this._resize,_71a=lang.hitch(this.container,"_layoutChildren",this.child.id),de=this.ownerDocument;
this._handlers=this._handlers.concat([on(de,_705.move,this._drag=function(e,_71b){
var _71c=e[axis]-_713,_71d=_711*_71c+_715,_71e=Math.max(Math.min(_71d,max),min);
if(_719||_71b){
_71a(_71e);
}
_714[_717]=_71c+_718+_711*(_71e-_71d)+"px";
}),on(de,"dragstart",_704.stop),on(this.ownerDocumentBody,"selectstart",_704.stop),on(de,_705.release,lang.hitch(this,"_stopDrag"))]);
_704.stop(e);
},_onMouse:function(e){
var o=(e.type=="mouseover"||e.type=="mouseenter");
_700.toggle(this.domNode,"dijitSplitterHover",o);
_700.toggle(this.domNode,"dijitSplitter"+(this.horizontal?"H":"V")+"Hover",o);
},_stopDrag:function(e){
try{
if(this.cover){
_700.remove(this.cover,"dijitSplitterCoverActive");
}
if(this.fake){
_701.destroy(this.fake);
}
_700.remove(this.domNode,"dijitSplitterActive dijitSplitter"+(this.horizontal?"H":"V")+"Active dijitSplitterShadow");
this._drag(e);
this._drag(e,true);
}
finally{
this._cleanupHandlers();
delete this._drag;
}
if(this.container.persist){
_6fe(this._cookieName,this.child.domNode.style[this.horizontal?"height":"width"],{expires:365});
}
},_cleanupHandlers:function(){
var h;
while(h=this._handlers.pop()){
h.remove();
}
},_onKeyPress:function(e){
this._resize=true;
var _71f=this.horizontal;
var tick=1;
switch(e.charOrCode){
case _71f?keys.UP_ARROW:keys.LEFT_ARROW:
tick*=-1;
case _71f?keys.DOWN_ARROW:keys.RIGHT_ARROW:
break;
default:
return;
}
var _720=_702.getMarginSize(this.child.domNode)[_71f?"h":"w"]+this._factor*tick;
this.container._layoutChildren(this.child.id,Math.max(Math.min(_720,this._computeMaxSize()),this.child.minSize));
_704.stop(e);
},destroy:function(){
this._cleanupHandlers();
delete this.child;
delete this.container;
delete this.cover;
delete this.fake;
this.inherited(arguments);
}});
var _721=_6ff("dijit.layout._Gutter",[_707,_708],{templateString:"<div class=\"dijitGutter\" role=\"presentation\"></div>",postMixInProperties:function(){
this.inherited(arguments);
this.horizontal=/top|bottom/.test(this.region);
},buildRendering:function(){
this.inherited(arguments);
_700.add(this.domNode,"dijitGutter"+(this.horizontal?"H":"V"));
}});
var _722=_6ff("dijit.layout.BorderContainer",_709,{design:"headline",gutters:true,liveSplitters:true,persist:false,baseClass:"dijitBorderContainer",_splitterClass:_70b,postMixInProperties:function(){
if(!this.gutters){
this.baseClass+="NoGutter";
}
this.inherited(arguments);
},startup:function(){
if(this._started){
return;
}
_6fd.forEach(this.getChildren(),this._setupChild,this);
this.inherited(arguments);
},_setupChild:function(_723){
var _724=_723.region;
if(_724){
this.inherited(arguments);
_700.add(_723.domNode,this.baseClass+"Pane");
var ltr=this.isLeftToRight();
if(_724=="leading"){
_724=ltr?"left":"right";
}
if(_724=="trailing"){
_724=ltr?"right":"left";
}
if(_724!="center"&&(_723.splitter||this.gutters)&&!_723._splitterWidget){
var _725=_723.splitter?this._splitterClass:_721;
if(lang.isString(_725)){
_725=lang.getObject(_725);
}
var _726=new _725({id:_723.id+"_splitter",container:this,child:_723,region:_724,live:this.liveSplitters});
_726.isSplitter=true;
_723._splitterWidget=_726;
_701.place(_726.domNode,_723.domNode,"after");
_726.startup();
}
_723.region=_724;
}
},layout:function(){
this._layoutChildren();
},addChild:function(_727,_728){
this.inherited(arguments);
if(this._started){
this.layout();
}
},removeChild:function(_729){
var _72a=_729.region;
var _72b=_729._splitterWidget;
if(_72b){
_72b.destroy();
delete _729._splitterWidget;
}
this.inherited(arguments);
if(this._started){
this._layoutChildren();
}
_700.remove(_729.domNode,this.baseClass+"Pane");
_703.set(_729.domNode,{top:"auto",bottom:"auto",left:"auto",right:"auto",position:"static"});
_703.set(_729.domNode,_72a=="top"||_72a=="bottom"?"width":"height","auto");
},getChildren:function(){
return _6fd.filter(this.inherited(arguments),function(_72c){
return !_72c.isSplitter;
});
},getSplitter:function(_72d){
return _6fd.filter(this.getChildren(),function(_72e){
return _72e.region==_72d;
})[0]._splitterWidget;
},resize:function(_72f,_730){
if(!this.cs||!this.pe){
var node=this.domNode;
this.cs=_703.getComputedStyle(node);
this.pe=_702.getPadExtents(node,this.cs);
this.pe.r=_703.toPixelValue(node,this.cs.paddingRight);
this.pe.b=_703.toPixelValue(node,this.cs.paddingBottom);
_703.set(node,"padding","0px");
}
this.inherited(arguments);
},_layoutChildren:function(_731,_732){
if(!this._borderBox||!this._borderBox.h){
return;
}
var _733=_6fd.map(this.getChildren(),function(_734,idx){
return {pane:_734,weight:[_734.region=="center"?Infinity:0,_734.layoutPriority,(this.design=="sidebar"?1:-1)*(/top|bottom/.test(_734.region)?1:-1),idx]};
},this);
_733.sort(function(a,b){
var aw=a.weight,bw=b.weight;
for(var i=0;i<aw.length;i++){
if(aw[i]!=bw[i]){
return aw[i]-bw[i];
}
}
return 0;
});
var _735=[];
_6fd.forEach(_733,function(_736){
var pane=_736.pane;
_735.push(pane);
if(pane._splitterWidget){
_735.push(pane._splitterWidget);
}
});
var dim={l:this.pe.l,t:this.pe.t,w:this._borderBox.w-this.pe.w,h:this._borderBox.h-this.pe.h};
_70a.layoutChildren(this.domNode,dim,_735,_731,_732);
},destroyRecursive:function(){
_6fd.forEach(this.getChildren(),function(_737){
var _738=_737._splitterWidget;
if(_738){
_738.destroy();
}
delete _737._splitterWidget;
});
this.inherited(arguments);
}});
_722.ChildWidgetProperties={region:"",layoutPriority:0,splitter:false,minSize:0,maxSize:Infinity};
lang.extend(_706,_722.ChildWidgetProperties);
_722._Splitter=_70b;
_722._Gutter=_721;
return _722;
});
},"dojo/number":function(){
define(["./_base/lang","./i18n","./i18n!./cldr/nls/number","./string","./regexp"],function(lang,i18n,_739,_73a,_73b){
var _73c={};
lang.setObject("dojo.number",_73c);
_73c.format=function(_73d,_73e){
_73e=lang.mixin({},_73e||{});
var _73f=i18n.normalizeLocale(_73e.locale),_740=i18n.getLocalization("dojo.cldr","number",_73f);
_73e.customs=_740;
var _741=_73e.pattern||_740[(_73e.type||"decimal")+"Format"];
if(isNaN(_73d)||Math.abs(_73d)==Infinity){
return null;
}
return _73c._applyPattern(_73d,_741,_73e);
};
_73c._numberPatternRE=/[#0,]*[#0](?:\.0*#*)?/;
_73c._applyPattern=function(_742,_743,_744){
_744=_744||{};
var _745=_744.customs.group,_746=_744.customs.decimal,_747=_743.split(";"),_748=_747[0];
_743=_747[(_742<0)?1:0]||("-"+_748);
if(_743.indexOf("%")!=-1){
_742*=100;
}else{
if(_743.indexOf("‰")!=-1){
_742*=1000;
}else{
if(_743.indexOf("¤")!=-1){
_745=_744.customs.currencyGroup||_745;
_746=_744.customs.currencyDecimal||_746;
_743=_743.replace(/\u00a4{1,3}/,function(_749){
var prop=["symbol","currency","displayName"][_749.length-1];
return _744[prop]||_744.currency||"";
});
}else{
if(_743.indexOf("E")!=-1){
throw new Error("exponential notation not supported");
}
}
}
}
var _74a=_73c._numberPatternRE;
var _74b=_748.match(_74a);
if(!_74b){
throw new Error("unable to find a number expression in pattern: "+_743);
}
if(_744.fractional===false){
_744.places=0;
}
return _743.replace(_74a,_73c._formatAbsolute(_742,_74b[0],{decimal:_746,group:_745,places:_744.places,round:_744.round}));
};
_73c.round=function(_74c,_74d,_74e){
var _74f=10/(_74e||10);
return (_74f*+_74c).toFixed(_74d)/_74f;
};
if((0.9).toFixed()==0){
var _750=_73c.round;
_73c.round=function(v,p,m){
var d=Math.pow(10,-p||0),a=Math.abs(v);
if(!v||a>=d||a*Math.pow(10,p+1)<5){
d=0;
}
return _750(v,p,m)+(v>0?d:-d);
};
}
_73c._formatAbsolute=function(_751,_752,_753){
_753=_753||{};
if(_753.places===true){
_753.places=0;
}
if(_753.places===Infinity){
_753.places=6;
}
var _754=_752.split("."),_755=typeof _753.places=="string"&&_753.places.indexOf(","),_756=_753.places;
if(_755){
_756=_753.places.substring(_755+1);
}else{
if(!(_756>=0)){
_756=(_754[1]||[]).length;
}
}
if(!(_753.round<0)){
_751=_73c.round(_751,_756,_753.round);
}
var _757=String(Math.abs(_751)).split("."),_758=_757[1]||"";
if(_754[1]||_753.places){
if(_755){
_753.places=_753.places.substring(0,_755);
}
var pad=_753.places!==undefined?_753.places:(_754[1]&&_754[1].lastIndexOf("0")+1);
if(pad>_758.length){
_757[1]=_73a.pad(_758,pad,"0",true);
}
if(_756<_758.length){
_757[1]=_758.substr(0,_756);
}
}else{
if(_757[1]){
_757.pop();
}
}
var _759=_754[0].replace(",","");
pad=_759.indexOf("0");
if(pad!=-1){
pad=_759.length-pad;
if(pad>_757[0].length){
_757[0]=_73a.pad(_757[0],pad);
}
if(_759.indexOf("#")==-1){
_757[0]=_757[0].substr(_757[0].length-pad);
}
}
var _75a=_754[0].lastIndexOf(","),_75b,_75c;
if(_75a!=-1){
_75b=_754[0].length-_75a-1;
var _75d=_754[0].substr(0,_75a);
_75a=_75d.lastIndexOf(",");
if(_75a!=-1){
_75c=_75d.length-_75a-1;
}
}
var _75e=[];
for(var _75f=_757[0];_75f;){
var off=_75f.length-_75b;
_75e.push((off>0)?_75f.substr(off):_75f);
_75f=(off>0)?_75f.slice(0,off):"";
if(_75c){
_75b=_75c;
delete _75c;
}
}
_757[0]=_75e.reverse().join(_753.group||",");
return _757.join(_753.decimal||".");
};
_73c.regexp=function(_760){
return _73c._parseInfo(_760).regexp;
};
_73c._parseInfo=function(_761){
_761=_761||{};
var _762=i18n.normalizeLocale(_761.locale),_763=i18n.getLocalization("dojo.cldr","number",_762),_764=_761.pattern||_763[(_761.type||"decimal")+"Format"],_765=_763.group,_766=_763.decimal,_767=1;
if(_764.indexOf("%")!=-1){
_767/=100;
}else{
if(_764.indexOf("‰")!=-1){
_767/=1000;
}else{
var _768=_764.indexOf("¤")!=-1;
if(_768){
_765=_763.currencyGroup||_765;
_766=_763.currencyDecimal||_766;
}
}
}
var _769=_764.split(";");
if(_769.length==1){
_769.push("-"+_769[0]);
}
var re=_73b.buildGroupRE(_769,function(_76a){
_76a="(?:"+_73b.escapeString(_76a,".")+")";
return _76a.replace(_73c._numberPatternRE,function(_76b){
var _76c={signed:false,separator:_761.strict?_765:[_765,""],fractional:_761.fractional,decimal:_766,exponent:false},_76d=_76b.split("."),_76e=_761.places;
if(_76d.length==1&&_767!=1){
_76d[1]="###";
}
if(_76d.length==1||_76e===0){
_76c.fractional=false;
}else{
if(_76e===undefined){
_76e=_761.pattern?_76d[1].lastIndexOf("0")+1:Infinity;
}
if(_76e&&_761.fractional==undefined){
_76c.fractional=true;
}
if(!_761.places&&(_76e<_76d[1].length)){
_76e+=","+_76d[1].length;
}
_76c.places=_76e;
}
var _76f=_76d[0].split(",");
if(_76f.length>1){
_76c.groupSize=_76f.pop().length;
if(_76f.length>1){
_76c.groupSize2=_76f.pop().length;
}
}
return "("+_73c._realNumberRegexp(_76c)+")";
});
},true);
if(_768){
re=re.replace(/([\s\xa0]*)(\u00a4{1,3})([\s\xa0]*)/g,function(_770,_771,_772,_773){
var prop=["symbol","currency","displayName"][_772.length-1],_774=_73b.escapeString(_761[prop]||_761.currency||"");
_771=_771?"[\\s\\xa0]":"";
_773=_773?"[\\s\\xa0]":"";
if(!_761.strict){
if(_771){
_771+="*";
}
if(_773){
_773+="*";
}
return "(?:"+_771+_774+_773+")?";
}
return _771+_774+_773;
});
}
return {regexp:re.replace(/[\xa0 ]/g,"[\\s\\xa0]"),group:_765,decimal:_766,factor:_767};
};
_73c.parse=function(_775,_776){
var info=_73c._parseInfo(_776),_777=(new RegExp("^"+info.regexp+"$")).exec(_775);
if(!_777){
return NaN;
}
var _778=_777[1];
if(!_777[1]){
if(!_777[2]){
return NaN;
}
_778=_777[2];
info.factor*=-1;
}
_778=_778.replace(new RegExp("["+info.group+"\\s\\xa0"+"]","g"),"").replace(info.decimal,".");
return _778*info.factor;
};
_73c._realNumberRegexp=function(_779){
_779=_779||{};
if(!("places" in _779)){
_779.places=Infinity;
}
if(typeof _779.decimal!="string"){
_779.decimal=".";
}
if(!("fractional" in _779)||/^0/.test(_779.places)){
_779.fractional=[true,false];
}
if(!("exponent" in _779)){
_779.exponent=[true,false];
}
if(!("eSigned" in _779)){
_779.eSigned=[true,false];
}
var _77a=_73c._integerRegexp(_779),_77b=_73b.buildGroupRE(_779.fractional,function(q){
var re="";
if(q&&(_779.places!==0)){
re="\\"+_779.decimal;
if(_779.places==Infinity){
re="(?:"+re+"\\d+)?";
}else{
re+="\\d{"+_779.places+"}";
}
}
return re;
},true);
var _77c=_73b.buildGroupRE(_779.exponent,function(q){
if(q){
return "([eE]"+_73c._integerRegexp({signed:_779.eSigned})+")";
}
return "";
});
var _77d=_77a+_77b;
if(_77b){
_77d="(?:(?:"+_77d+")|(?:"+_77b+"))";
}
return _77d+_77c;
};
_73c._integerRegexp=function(_77e){
_77e=_77e||{};
if(!("signed" in _77e)){
_77e.signed=[true,false];
}
if(!("separator" in _77e)){
_77e.separator="";
}else{
if(!("groupSize" in _77e)){
_77e.groupSize=3;
}
}
var _77f=_73b.buildGroupRE(_77e.signed,function(q){
return q?"[-+]":"";
},true);
var _780=_73b.buildGroupRE(_77e.separator,function(sep){
if(!sep){
return "(?:\\d+)";
}
sep=_73b.escapeString(sep);
if(sep==" "){
sep="\\s";
}else{
if(sep==" "){
sep="\\s\\xa0";
}
}
var grp=_77e.groupSize,grp2=_77e.groupSize2;
if(grp2){
var _781="(?:0|[1-9]\\d{0,"+(grp2-1)+"}(?:["+sep+"]\\d{"+grp2+"})*["+sep+"]\\d{"+grp+"})";
return ((grp-grp2)>0)?"(?:"+_781+"|(?:0|[1-9]\\d{0,"+(grp-1)+"}))":_781;
}
return "(?:0|[1-9]\\d{0,"+(grp-1)+"}(?:["+sep+"]\\d{"+grp+"})*)";
},true);
return _77f+_780;
};
return _73c;
});
},"dojo/data/util/filter":function(){
define(["../../_base/lang"],function(lang){
var _782={};
lang.setObject("dojo.data.util.filter",_782);
_782.patternToRegExp=function(_783,_784){
var rxp="^";
var c=null;
for(var i=0;i<_783.length;i++){
c=_783.charAt(i);
switch(c){
case "\\":
rxp+=c;
i++;
rxp+=_783.charAt(i);
break;
case "*":
rxp+=".*";
break;
case "?":
rxp+=".";
break;
case "$":
case "^":
case "/":
case "+":
case ".":
case "|":
case "(":
case ")":
case "{":
case "}":
case "[":
case "]":
rxp+="\\";
default:
rxp+=c;
}
}
rxp+="$";
if(_784){
return new RegExp(rxp,"mi");
}else{
return new RegExp(rxp,"m");
}
};
return _782;
});
},"dijit/_WidgetsInTemplateMixin":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/parser"],function(_785,_786,_787){
return _786("dijit._WidgetsInTemplateMixin",null,{_earlyTemplatedStartup:false,widgetsInTemplate:true,_beforeFillContent:function(){
if(this.widgetsInTemplate){
var node=this.domNode;
var cw=(this._startupWidgets=_787.parse(node,{noStart:!this._earlyTemplatedStartup,template:true,inherited:{dir:this.dir,lang:this.lang,textDir:this.textDir},propsThis:this,scope:"dojo"}));
if(!cw.isFulfilled()){
throw new Error(this.declaredClass+": parser returned unfilled promise (probably waiting for module auto-load), "+"unsupported by _WidgetsInTemplateMixin.   Must pre-load all supporting widgets before instantiation.");
}
this._attachTemplateNodes(cw,function(n,p){
return n[p];
});
}
},startup:function(){
_785.forEach(this._startupWidgets,function(w){
if(w&&!w._started&&w.startup){
w.startup();
}
});
this.inherited(arguments);
}});
});
},"dijit/form/HorizontalRuleLabels":function(){
define(["dojo/_base/declare","dojo/number","dojo/query","./HorizontalRule"],function(_788,_789,_78a,_78b){
return _788("dijit.form.HorizontalRuleLabels",_78b,{templateString:"<div class=\"dijitRuleContainer dijitRuleContainerH dijitRuleLabelsContainer dijitRuleLabelsContainerH\"></div>",labelStyle:"",labels:[],numericMargin:0,minimum:0,maximum:1,constraints:{pattern:"#%"},_positionPrefix:"<div class=\"dijitRuleLabelContainer dijitRuleLabelContainerH\" style=\"left:",_labelPrefix:"\"><div class=\"dijitRuleLabel dijitRuleLabelH\">",_suffix:"</div></div>",_calcPosition:function(pos){
return pos;
},_genHTML:function(pos,ndx){
return this._positionPrefix+this._calcPosition(pos)+this._positionSuffix+this.labelStyle+this._labelPrefix+this.labels[ndx]+this._suffix;
},getLabels:function(){
var _78c=this.labels;
if(!_78c.length&&this.srcNodeRef){
_78c=_78a("> li",this.srcNodeRef).map(function(node){
return String(node.innerHTML);
});
}
if(!_78c.length&&this.count>1){
var _78d=this.minimum;
var inc=(this.maximum-_78d)/(this.count-1);
for(var i=0;i<this.count;i++){
_78c.push((i<this.numericMargin||i>=(this.count-this.numericMargin))?"":_789.format(_78d,this.constraints));
_78d+=inc;
}
}
return _78c;
},postMixInProperties:function(){
this.inherited(arguments);
this.labels=this.getLabels();
this.count=this.labels.length;
}});
});
},"url:dijit/templates/MenuBarItem.html":"<div class=\"dijitReset dijitInline dijitMenuItem dijitMenuItemLabel\" data-dojo-attach-point=\"focusNode\"\n\t \trole=\"menuitem\" tabIndex=\"-1\">\n\t<span data-dojo-attach-point=\"containerNode\"></span>\n</div>\n","dijit/form/FilteringSelect":function(){
define(["dojo/data/util/filter","dojo/_base/declare","dojo/_base/lang","dojo/when","./MappedTextBox","./ComboBoxMixin"],function(_78e,_78f,lang,when,_790,_791){
return _78f("dijit.form.FilteringSelect",[_790,_791],{required:true,_lastDisplayedValue:"",_isValidSubset:function(){
return this._opened;
},isValid:function(){
return !!this.item||(!this.required&&this.get("displayedValue")=="");
},_refreshState:function(){
if(!this.searchTimer){
this.inherited(arguments);
}
},_callbackSetLabel:function(_792,_793,_794,_795){
if((_793&&_793[this.searchAttr]!==this._lastQuery)||(!_793&&_792.length&&this.store.getIdentity(_792[0])!=this._lastQuery)){
return;
}
if(!_792.length){
this.set("value","",_795||(_795===undefined&&!this.focused),this.textbox.value,null);
}else{
this.set("item",_792[0],_795);
}
},_openResultList:function(_796,_797,_798){
if(_797[this.searchAttr]!==this._lastQuery){
return;
}
this.inherited(arguments);
if(this.item===undefined){
this.validate(true);
}
},_getValueAttr:function(){
return this.valueNode.value;
},_getValueField:function(){
return "value";
},_setValueAttr:function(_799,_79a,_79b,item){
if(!this._onChangeActive){
_79a=null;
}
if(item===undefined){
if(_799===null||_799===""){
_799="";
if(!lang.isString(_79b)){
this._setDisplayedValueAttr(_79b||"",_79a);
return;
}
}
var self=this;
this._lastQuery=_799;
when(this.store.get(_799),function(item){
self._callbackSetLabel(item?[item]:[],undefined,undefined,_79a);
});
}else{
this.valueNode.value=_799;
this.inherited(arguments);
}
},_setItemAttr:function(item,_79c,_79d){
this.inherited(arguments);
this._lastDisplayedValue=this.textbox.value;
},_getDisplayQueryString:function(text){
return text.replace(/([\\\*\?])/g,"\\$1");
},_setDisplayedValueAttr:function(_79e,_79f){
if(_79e==null){
_79e="";
}
if(!this._created){
if(!("displayedValue" in this.params)){
return;
}
_79f=false;
}
if(this.store){
this.closeDropDown();
var _7a0=lang.clone(this.query);
var qs=this._getDisplayQueryString(_79e),q;
if(this.store._oldAPI){
q=qs;
}else{
q=_78e.patternToRegExp(qs,this.ignoreCase);
q.toString=function(){
return qs;
};
}
this._lastQuery=_7a0[this.searchAttr]=q;
this.textbox.value=_79e;
this._lastDisplayedValue=_79e;
this._set("displayedValue",_79e);
var _7a1=this;
var _7a2={ignoreCase:this.ignoreCase,deep:true};
lang.mixin(_7a2,this.fetchProperties);
this._fetchHandle=this.store.query(_7a0,_7a2);
when(this._fetchHandle,function(_7a3){
_7a1._fetchHandle=null;
_7a1._callbackSetLabel(_7a3||[],_7a0,_7a2,_79f);
},function(err){
_7a1._fetchHandle=null;
if(!_7a1._cancelingQuery){
console.error("dijit.form.FilteringSelect: "+err.toString());
}
});
}
},undo:function(){
this.set("displayedValue",this._lastDisplayedValue);
}});
});
},"dojo/data/util/sorter":function(){
define(["../../_base/lang"],function(lang){
var _7a4={};
lang.setObject("dojo.data.util.sorter",_7a4);
_7a4.basicComparator=function(a,b){
var r=-1;
if(a===null){
a=undefined;
}
if(b===null){
b=undefined;
}
if(a==b){
r=0;
}else{
if(a>b||a==null){
r=1;
}
}
return r;
};
_7a4.createSortFunction=function(_7a5,_7a6){
var _7a7=[];
function _7a8(attr,dir,comp,s){
return function(_7a9,_7aa){
var a=s.getValue(_7a9,attr);
var b=s.getValue(_7aa,attr);
return dir*comp(a,b);
};
};
var _7ab;
var map=_7a6.comparatorMap;
var bc=_7a4.basicComparator;
for(var i=0;i<_7a5.length;i++){
_7ab=_7a5[i];
var attr=_7ab.attribute;
if(attr){
var dir=(_7ab.descending)?-1:1;
var comp=bc;
if(map){
if(typeof attr!=="string"&&("toString" in attr)){
attr=attr.toString();
}
comp=map[attr]||bc;
}
_7a7.push(_7a8(attr,dir,comp,_7a6));
}
}
return function(rowA,rowB){
var i=0;
while(i<_7a7.length){
var ret=_7a7[i++](rowA,rowB);
if(ret!==0){
return ret;
}
}
return 0;
};
};
return _7a4;
});
},"dijit/form/_ButtonMixin":function(){
define(["dojo/_base/declare","dojo/dom","dojo/_base/event","../registry"],function(_7ac,dom,_7ad,_7ae){
return _7ac("dijit.form._ButtonMixin",null,{label:"",type:"button",_onClick:function(e){
if(this.disabled){
_7ad.stop(e);
return false;
}
var _7af=this.onClick(e)===false;
if(!_7af&&this.type=="submit"&&!(this.valueNode||this.focusNode).form){
for(var node=this.domNode;node.parentNode;node=node.parentNode){
var _7b0=_7ae.byNode(node);
if(_7b0&&typeof _7b0._onSubmit=="function"){
_7b0._onSubmit(e);
_7af=true;
break;
}
}
}
if(_7af){
e.preventDefault();
}
return !_7af;
},postCreate:function(){
this.inherited(arguments);
dom.setSelectable(this.focusNode,false);
},onClick:function(){
return true;
},_setLabelAttr:function(_7b1){
this._set("label",_7b1);
(this.containerNode||this.focusNode).innerHTML=_7b1;
}});
});
},"dojo/colors":function(){
define(["./_base/kernel","./_base/lang","./_base/Color","./_base/array"],function(dojo,lang,_7b2,_7b3){
var _7b4={};
lang.setObject("dojo.colors",_7b4);
var _7b5=function(m1,m2,h){
if(h<0){
++h;
}
if(h>1){
--h;
}
var h6=6*h;
if(h6<1){
return m1+(m2-m1)*h6;
}
if(2*h<1){
return m2;
}
if(3*h<2){
return m1+(m2-m1)*(2/3-h)*6;
}
return m1;
};
dojo.colorFromRgb=_7b2.fromRgb=function(_7b6,obj){
var m=_7b6.toLowerCase().match(/^(rgba?|hsla?)\(([\s\.\-,%0-9]+)\)/);
if(m){
var c=m[2].split(/\s*,\s*/),l=c.length,t=m[1],a;
if((t=="rgb"&&l==3)||(t=="rgba"&&l==4)){
var r=c[0];
if(r.charAt(r.length-1)=="%"){
a=_7b3.map(c,function(x){
return parseFloat(x)*2.56;
});
if(l==4){
a[3]=c[3];
}
return _7b2.fromArray(a,obj);
}
return _7b2.fromArray(c,obj);
}
if((t=="hsl"&&l==3)||(t=="hsla"&&l==4)){
var H=((parseFloat(c[0])%360)+360)%360/360,S=parseFloat(c[1])/100,L=parseFloat(c[2])/100,m2=L<=0.5?L*(S+1):L+S-L*S,m1=2*L-m2;
a=[_7b5(m1,m2,H+1/3)*256,_7b5(m1,m2,H)*256,_7b5(m1,m2,H-1/3)*256,1];
if(l==4){
a[3]=c[3];
}
return _7b2.fromArray(a,obj);
}
}
return null;
};
var _7b7=function(c,low,high){
c=Number(c);
return isNaN(c)?high:c<low?low:c>high?high:c;
};
_7b2.prototype.sanitize=function(){
var t=this;
t.r=Math.round(_7b7(t.r,0,255));
t.g=Math.round(_7b7(t.g,0,255));
t.b=Math.round(_7b7(t.b,0,255));
t.a=_7b7(t.a,0,1);
return this;
};
_7b4.makeGrey=_7b2.makeGrey=function(g,a){
return _7b2.fromArray([g,g,g,a]);
};
lang.mixin(_7b2.named,{"aliceblue":[240,248,255],"antiquewhite":[250,235,215],"aquamarine":[127,255,212],"azure":[240,255,255],"beige":[245,245,220],"bisque":[255,228,196],"blanchedalmond":[255,235,205],"blueviolet":[138,43,226],"brown":[165,42,42],"burlywood":[222,184,135],"cadetblue":[95,158,160],"chartreuse":[127,255,0],"chocolate":[210,105,30],"coral":[255,127,80],"cornflowerblue":[100,149,237],"cornsilk":[255,248,220],"crimson":[220,20,60],"cyan":[0,255,255],"darkblue":[0,0,139],"darkcyan":[0,139,139],"darkgoldenrod":[184,134,11],"darkgray":[169,169,169],"darkgreen":[0,100,0],"darkgrey":[169,169,169],"darkkhaki":[189,183,107],"darkmagenta":[139,0,139],"darkolivegreen":[85,107,47],"darkorange":[255,140,0],"darkorchid":[153,50,204],"darkred":[139,0,0],"darksalmon":[233,150,122],"darkseagreen":[143,188,143],"darkslateblue":[72,61,139],"darkslategray":[47,79,79],"darkslategrey":[47,79,79],"darkturquoise":[0,206,209],"darkviolet":[148,0,211],"deeppink":[255,20,147],"deepskyblue":[0,191,255],"dimgray":[105,105,105],"dimgrey":[105,105,105],"dodgerblue":[30,144,255],"firebrick":[178,34,34],"floralwhite":[255,250,240],"forestgreen":[34,139,34],"gainsboro":[220,220,220],"ghostwhite":[248,248,255],"gold":[255,215,0],"goldenrod":[218,165,32],"greenyellow":[173,255,47],"grey":[128,128,128],"honeydew":[240,255,240],"hotpink":[255,105,180],"indianred":[205,92,92],"indigo":[75,0,130],"ivory":[255,255,240],"khaki":[240,230,140],"lavender":[230,230,250],"lavenderblush":[255,240,245],"lawngreen":[124,252,0],"lemonchiffon":[255,250,205],"lightblue":[173,216,230],"lightcoral":[240,128,128],"lightcyan":[224,255,255],"lightgoldenrodyellow":[250,250,210],"lightgray":[211,211,211],"lightgreen":[144,238,144],"lightgrey":[211,211,211],"lightpink":[255,182,193],"lightsalmon":[255,160,122],"lightseagreen":[32,178,170],"lightskyblue":[135,206,250],"lightslategray":[119,136,153],"lightslategrey":[119,136,153],"lightsteelblue":[176,196,222],"lightyellow":[255,255,224],"limegreen":[50,205,50],"linen":[250,240,230],"magenta":[255,0,255],"mediumaquamarine":[102,205,170],"mediumblue":[0,0,205],"mediumorchid":[186,85,211],"mediumpurple":[147,112,219],"mediumseagreen":[60,179,113],"mediumslateblue":[123,104,238],"mediumspringgreen":[0,250,154],"mediumturquoise":[72,209,204],"mediumvioletred":[199,21,133],"midnightblue":[25,25,112],"mintcream":[245,255,250],"mistyrose":[255,228,225],"moccasin":[255,228,181],"navajowhite":[255,222,173],"oldlace":[253,245,230],"olivedrab":[107,142,35],"orange":[255,165,0],"orangered":[255,69,0],"orchid":[218,112,214],"palegoldenrod":[238,232,170],"palegreen":[152,251,152],"paleturquoise":[175,238,238],"palevioletred":[219,112,147],"papayawhip":[255,239,213],"peachpuff":[255,218,185],"peru":[205,133,63],"pink":[255,192,203],"plum":[221,160,221],"powderblue":[176,224,230],"rosybrown":[188,143,143],"royalblue":[65,105,225],"saddlebrown":[139,69,19],"salmon":[250,128,114],"sandybrown":[244,164,96],"seagreen":[46,139,87],"seashell":[255,245,238],"sienna":[160,82,45],"skyblue":[135,206,235],"slateblue":[106,90,205],"slategray":[112,128,144],"slategrey":[112,128,144],"snow":[255,250,250],"springgreen":[0,255,127],"steelblue":[70,130,180],"tan":[210,180,140],"thistle":[216,191,216],"tomato":[255,99,71],"turquoise":[64,224,208],"violet":[238,130,238],"wheat":[245,222,179],"whitesmoke":[245,245,245],"yellowgreen":[154,205,50]});
return _7b2;
});
},"url:dijit/form/templates/Spinner.html":"<div class=\"dijit dijitReset dijitInline dijitLeft\"\n\tid=\"widget_${id}\" role=\"presentation\"\n\t><div class=\"dijitReset dijitButtonNode dijitSpinnerButtonContainer\"\n\t\t><input class=\"dijitReset dijitInputField dijitSpinnerButtonInner\" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t/><div class=\"dijitReset dijitLeft dijitButtonNode dijitArrowButton dijitUpArrowButton\"\n\t\t\tdata-dojo-attach-point=\"upArrowNode\"\n\t\t\t><div class=\"dijitArrowButtonInner\"\n\t\t\t\t><input class=\"dijitReset dijitInputField\" value=\"&#9650; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t\t\t${_buttonInputDisabled}\n\t\t\t/></div\n\t\t></div\n\t\t><div class=\"dijitReset dijitLeft dijitButtonNode dijitArrowButton dijitDownArrowButton\"\n\t\t\tdata-dojo-attach-point=\"downArrowNode\"\n\t\t\t><div class=\"dijitArrowButtonInner\"\n\t\t\t\t><input class=\"dijitReset dijitInputField\" value=\"&#9660; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t\t\t${_buttonInputDisabled}\n\t\t\t/></div\n\t\t></div\n\t></div\n\t><div class='dijitReset dijitValidationContainer'\n\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t/></div\n\t><div class=\"dijitReset dijitInputField dijitInputContainer\"\n\t\t><input class='dijitReset dijitInputInner' data-dojo-attach-point=\"textbox,focusNode\" type=\"${type}\" data-dojo-attach-event=\"onkeypress:_onKeyPress\"\n\t\t\trole=\"spinbutton\" autocomplete=\"off\" ${!nameAttrSetting}\n\t/></div\n></div>\n","dijit/tree/_dndContainer":function(){
define(["dojo/aspect","dojo/_base/declare","dojo/dom-class","dojo/_base/event","dojo/_base/lang","dojo/on","dojo/touch"],function(_7b8,_7b9,_7ba,_7bb,lang,on,_7bc){
return _7b9("dijit.tree._dndContainer",null,{constructor:function(tree,_7bd){
this.tree=tree;
this.node=tree.domNode;
lang.mixin(this,_7bd);
this.current=null;
this.containerState="";
_7ba.add(this.node,"dojoDndContainer");
this.events=[on(this.node,_7bc.enter,lang.hitch(this,"onOverEvent")),on(this.node,_7bc.leave,lang.hitch(this,"onOutEvent")),_7b8.after(this.tree,"_onNodeMouseEnter",lang.hitch(this,"onMouseOver"),true),_7b8.after(this.tree,"_onNodeMouseLeave",lang.hitch(this,"onMouseOut"),true),on(this.node,"dragstart",lang.hitch(_7bb,"stop")),on(this.node,"selectstart",lang.hitch(_7bb,"stop"))];
},destroy:function(){
var h;
while(h=this.events.pop()){
h.remove();
}
this.node=this.parent=null;
},onMouseOver:function(_7be){
this.current=_7be;
},onMouseOut:function(){
this.current=null;
},_changeState:function(type,_7bf){
var _7c0="dojoDnd"+type;
var _7c1=type.toLowerCase()+"State";
_7ba.replace(this.node,_7c0+_7bf,_7c0+this[_7c1]);
this[_7c1]=_7bf;
},_addItemClass:function(node,type){
_7ba.add(node,"dojoDndItem"+type);
},_removeItemClass:function(node,type){
_7ba.remove(node,"dojoDndItem"+type);
},onOverEvent:function(){
this._changeState("Container","Over");
},onOutEvent:function(){
this._changeState("Container","");
}});
});
},"dojo/date/locale":function(){
define(["../_base/lang","../_base/array","../date","../cldr/supplemental","../i18n","../regexp","../string","../i18n!../cldr/nls/gregorian","module"],function(lang,_7c2,date,_7c3,i18n,_7c4,_7c5,_7c6,_7c7){
var _7c8={};
lang.setObject(_7c7.id.replace(/\//g,"."),_7c8);
function _7c9(_7ca,_7cb,_7cc,_7cd){
return _7cd.replace(/([a-z])\1*/ig,function(_7ce){
var s,pad,c=_7ce.charAt(0),l=_7ce.length,_7cf=["abbr","wide","narrow"];
switch(c){
case "G":
s=_7cb[(l<4)?"eraAbbr":"eraNames"][_7ca.getFullYear()<0?0:1];
break;
case "y":
s=_7ca.getFullYear();
switch(l){
case 1:
break;
case 2:
if(!_7cc.fullYear){
s=String(s);
s=s.substr(s.length-2);
break;
}
default:
pad=true;
}
break;
case "Q":
case "q":
s=Math.ceil((_7ca.getMonth()+1)/3);
pad=true;
break;
case "M":
case "L":
var m=_7ca.getMonth();
if(l<3){
s=m+1;
pad=true;
}else{
var _7d0=["months",c=="L"?"standAlone":"format",_7cf[l-3]].join("-");
s=_7cb[_7d0][m];
}
break;
case "w":
var _7d1=0;
s=_7c8._getWeekOfYear(_7ca,_7d1);
pad=true;
break;
case "d":
s=_7ca.getDate();
pad=true;
break;
case "D":
s=_7c8._getDayOfYear(_7ca);
pad=true;
break;
case "e":
case "c":
var d=_7ca.getDay();
if(l<2){
s=(d-_7c3.getFirstDayOfWeek(_7cc.locale)+8)%7;
break;
}
case "E":
d=_7ca.getDay();
if(l<3){
s=d+1;
pad=true;
}else{
var _7d2=["days",c=="c"?"standAlone":"format",_7cf[l-3]].join("-");
s=_7cb[_7d2][d];
}
break;
case "a":
var _7d3=_7ca.getHours()<12?"am":"pm";
s=_7cc[_7d3]||_7cb["dayPeriods-format-wide-"+_7d3];
break;
case "h":
case "H":
case "K":
case "k":
var h=_7ca.getHours();
switch(c){
case "h":
s=(h%12)||12;
break;
case "H":
s=h;
break;
case "K":
s=(h%12);
break;
case "k":
s=h||24;
break;
}
pad=true;
break;
case "m":
s=_7ca.getMinutes();
pad=true;
break;
case "s":
s=_7ca.getSeconds();
pad=true;
break;
case "S":
s=Math.round(_7ca.getMilliseconds()*Math.pow(10,l-3));
pad=true;
break;
case "v":
case "z":
s=_7c8._getZone(_7ca,true,_7cc);
if(s){
break;
}
l=4;
case "Z":
var _7d4=_7c8._getZone(_7ca,false,_7cc);
var tz=[(_7d4<=0?"+":"-"),_7c5.pad(Math.floor(Math.abs(_7d4)/60),2),_7c5.pad(Math.abs(_7d4)%60,2)];
if(l==4){
tz.splice(0,0,"GMT");
tz.splice(3,0,":");
}
s=tz.join("");
break;
default:
throw new Error("dojo.date.locale.format: invalid pattern char: "+_7cd);
}
if(pad){
s=_7c5.pad(s,l);
}
return s;
});
};
_7c8._getZone=function(_7d5,_7d6,_7d7){
if(_7d6){
return date.getTimezoneName(_7d5);
}else{
return _7d5.getTimezoneOffset();
}
};
_7c8.format=function(_7d8,_7d9){
_7d9=_7d9||{};
var _7da=i18n.normalizeLocale(_7d9.locale),_7db=_7d9.formatLength||"short",_7dc=_7c8._getGregorianBundle(_7da),str=[],_7dd=lang.hitch(this,_7c9,_7d8,_7dc,_7d9);
if(_7d9.selector=="year"){
return _7de(_7dc["dateFormatItem-yyyy"]||"yyyy",_7dd);
}
var _7df;
if(_7d9.selector!="date"){
_7df=_7d9.timePattern||_7dc["timeFormat-"+_7db];
if(_7df){
str.push(_7de(_7df,_7dd));
}
}
if(_7d9.selector!="time"){
_7df=_7d9.datePattern||_7dc["dateFormat-"+_7db];
if(_7df){
str.push(_7de(_7df,_7dd));
}
}
return str.length==1?str[0]:_7dc["dateTimeFormat-"+_7db].replace(/\{(\d+)\}/g,function(_7e0,key){
return str[key];
});
};
_7c8.regexp=function(_7e1){
return _7c8._parseInfo(_7e1).regexp;
};
_7c8._parseInfo=function(_7e2){
_7e2=_7e2||{};
var _7e3=i18n.normalizeLocale(_7e2.locale),_7e4=_7c8._getGregorianBundle(_7e3),_7e5=_7e2.formatLength||"short",_7e6=_7e2.datePattern||_7e4["dateFormat-"+_7e5],_7e7=_7e2.timePattern||_7e4["timeFormat-"+_7e5],_7e8;
if(_7e2.selector=="date"){
_7e8=_7e6;
}else{
if(_7e2.selector=="time"){
_7e8=_7e7;
}else{
_7e8=_7e4["dateTimeFormat-"+_7e5].replace(/\{(\d+)\}/g,function(_7e9,key){
return [_7e7,_7e6][key];
});
}
}
var _7ea=[],re=_7de(_7e8,lang.hitch(this,_7eb,_7ea,_7e4,_7e2));
return {regexp:re,tokens:_7ea,bundle:_7e4};
};
_7c8.parse=function(_7ec,_7ed){
var _7ee=/[\u200E\u200F\u202A\u202E]/g,info=_7c8._parseInfo(_7ed),_7ef=info.tokens,_7f0=info.bundle,re=new RegExp("^"+info.regexp.replace(_7ee,"")+"$",info.strict?"":"i"),_7f1=re.exec(_7ec&&_7ec.replace(_7ee,""));
if(!_7f1){
return null;
}
var _7f2=["abbr","wide","narrow"],_7f3=[1970,0,1,0,0,0,0],amPm="",_7f4=_7c2.every(_7f1,function(v,i){
if(!i){
return true;
}
var _7f5=_7ef[i-1],l=_7f5.length,c=_7f5.charAt(0);
switch(c){
case "y":
if(l!=2&&_7ed.strict){
_7f3[0]=v;
}else{
if(v<100){
v=Number(v);
var year=""+new Date().getFullYear(),_7f6=year.substring(0,2)*100,_7f7=Math.min(Number(year.substring(2,4))+20,99);
_7f3[0]=(v<_7f7)?_7f6+v:_7f6-100+v;
}else{
if(_7ed.strict){
return false;
}
_7f3[0]=v;
}
}
break;
case "M":
case "L":
if(l>2){
var _7f8=_7f0["months-"+(c=="L"?"standAlone":"format")+"-"+_7f2[l-3]].concat();
if(!_7ed.strict){
v=v.replace(".","").toLowerCase();
_7f8=_7c2.map(_7f8,function(s){
return s.replace(".","").toLowerCase();
});
}
v=_7c2.indexOf(_7f8,v);
if(v==-1){
return false;
}
}else{
v--;
}
_7f3[1]=v;
break;
case "E":
case "e":
case "c":
var days=_7f0["days-"+(c=="c"?"standAlone":"format")+"-"+_7f2[l-3]].concat();
if(!_7ed.strict){
v=v.toLowerCase();
days=_7c2.map(days,function(d){
return d.toLowerCase();
});
}
v=_7c2.indexOf(days,v);
if(v==-1){
return false;
}
break;
case "D":
_7f3[1]=0;
case "d":
_7f3[2]=v;
break;
case "a":
var am=_7ed.am||_7f0["dayPeriods-format-wide-am"],pm=_7ed.pm||_7f0["dayPeriods-format-wide-pm"];
if(!_7ed.strict){
var _7f9=/\./g;
v=v.replace(_7f9,"").toLowerCase();
am=am.replace(_7f9,"").toLowerCase();
pm=pm.replace(_7f9,"").toLowerCase();
}
if(_7ed.strict&&v!=am&&v!=pm){
return false;
}
amPm=(v==pm)?"p":(v==am)?"a":"";
break;
case "K":
if(v==24){
v=0;
}
case "h":
case "H":
case "k":
if(v>23){
return false;
}
_7f3[3]=v;
break;
case "m":
_7f3[4]=v;
break;
case "s":
_7f3[5]=v;
break;
case "S":
_7f3[6]=v;
}
return true;
});
var _7fa=+_7f3[3];
if(amPm==="p"&&_7fa<12){
_7f3[3]=_7fa+12;
}else{
if(amPm==="a"&&_7fa==12){
_7f3[3]=0;
}
}
var _7fb=new Date(_7f3[0],_7f3[1],_7f3[2],_7f3[3],_7f3[4],_7f3[5],_7f3[6]);
if(_7ed.strict){
_7fb.setFullYear(_7f3[0]);
}
var _7fc=_7ef.join(""),_7fd=_7fc.indexOf("d")!=-1,_7fe=_7fc.indexOf("M")!=-1;
if(!_7f4||(_7fe&&_7fb.getMonth()>_7f3[1])||(_7fd&&_7fb.getDate()>_7f3[2])){
return null;
}
if((_7fe&&_7fb.getMonth()<_7f3[1])||(_7fd&&_7fb.getDate()<_7f3[2])){
_7fb=date.add(_7fb,"hour",1);
}
return _7fb;
};
function _7de(_7ff,_800,_801,_802){
var _803=function(x){
return x;
};
_800=_800||_803;
_801=_801||_803;
_802=_802||_803;
var _804=_7ff.match(/(''|[^'])+/g),_805=_7ff.charAt(0)=="'";
_7c2.forEach(_804,function(_806,i){
if(!_806){
_804[i]="";
}else{
_804[i]=(_805?_801:_800)(_806.replace(/''/g,"'"));
_805=!_805;
}
});
return _802(_804.join(""));
};
function _7eb(_807,_808,_809,_80a){
_80a=_7c4.escapeString(_80a);
if(!_809.strict){
_80a=_80a.replace(" a"," ?a");
}
return _80a.replace(/([a-z])\1*/ig,function(_80b){
var s,c=_80b.charAt(0),l=_80b.length,p2="",p3="";
if(_809.strict){
if(l>1){
p2="0"+"{"+(l-1)+"}";
}
if(l>2){
p3="0"+"{"+(l-2)+"}";
}
}else{
p2="0?";
p3="0{0,2}";
}
switch(c){
case "y":
s="\\d{2,4}";
break;
case "M":
case "L":
s=(l>2)?"\\S+?":"1[0-2]|"+p2+"[1-9]";
break;
case "D":
s="[12][0-9][0-9]|3[0-5][0-9]|36[0-6]|"+p2+"[1-9][0-9]|"+p3+"[1-9]";
break;
case "d":
s="3[01]|[12]\\d|"+p2+"[1-9]";
break;
case "w":
s="[1-4][0-9]|5[0-3]|"+p2+"[1-9]";
break;
case "E":
case "e":
case "c":
s="\\S+";
break;
case "h":
s="1[0-2]|"+p2+"[1-9]";
break;
case "k":
s="1[01]|"+p2+"\\d";
break;
case "H":
s="1\\d|2[0-3]|"+p2+"\\d";
break;
case "K":
s="1\\d|2[0-4]|"+p2+"[1-9]";
break;
case "m":
case "s":
s="[0-5]\\d";
break;
case "S":
s="\\d{"+l+"}";
break;
case "a":
var am=_809.am||_808["dayPeriods-format-wide-am"],pm=_809.pm||_808["dayPeriods-format-wide-pm"];
s=am+"|"+pm;
if(!_809.strict){
if(am!=am.toLowerCase()){
s+="|"+am.toLowerCase();
}
if(pm!=pm.toLowerCase()){
s+="|"+pm.toLowerCase();
}
if(s.indexOf(".")!=-1){
s+="|"+s.replace(/\./g,"");
}
}
s=s.replace(/\./g,"\\.");
break;
default:
s=".*";
}
if(_807){
_807.push(_80b);
}
return "("+s+")";
}).replace(/[\xa0 ]/g,"[\\s\\xa0]");
};
var _80c=[];
_7c8.addCustomFormats=function(_80d,_80e){
_80c.push({pkg:_80d,name:_80e});
};
_7c8._getGregorianBundle=function(_80f){
var _810={};
_7c2.forEach(_80c,function(desc){
var _811=i18n.getLocalization(desc.pkg,desc.name,_80f);
_810=lang.mixin(_810,_811);
},this);
return _810;
};
_7c8.addCustomFormats(_7c7.id.replace(/\/date\/locale$/,".cldr"),"gregorian");
_7c8.getNames=function(item,type,_812,_813){
var _814,_815=_7c8._getGregorianBundle(_813),_816=[item,_812,type];
if(_812=="standAlone"){
var key=_816.join("-");
_814=_815[key];
if(_814[0]==1){
_814=undefined;
}
}
_816[1]="format";
return (_814||_815[_816.join("-")]).concat();
};
_7c8.isWeekend=function(_817,_818){
var _819=_7c3.getWeekend(_818),day=(_817||new Date()).getDay();
if(_819.end<_819.start){
_819.end+=7;
if(day<_819.start){
day+=7;
}
}
return day>=_819.start&&day<=_819.end;
};
_7c8._getDayOfYear=function(_81a){
return date.difference(new Date(_81a.getFullYear(),0,1,_81a.getHours()),_81a)+1;
};
_7c8._getWeekOfYear=function(_81b,_81c){
if(arguments.length==1){
_81c=0;
}
var _81d=new Date(_81b.getFullYear(),0,1).getDay(),adj=(_81d-_81c+7)%7,week=Math.floor((_7c8._getDayOfYear(_81b)+adj-1)/7);
if(_81d==_81c){
week++;
}
return week;
};
return _7c8;
});
},"url:dijit/templates/InlineEditBox.html":"<span data-dojo-attach-point=\"editNode\" role=\"presentation\" class=\"dijitReset dijitInline dijitOffScreen\"\n\tdata-dojo-attach-event=\"onkeypress: _onKeyPress\"\n\t><span data-dojo-attach-point=\"editorPlaceholder\"></span\n\t><span data-dojo-attach-point=\"buttonContainer\"\n\t\t><button data-dojo-type=\"dijit/form/Button\" data-dojo-props=\"label: '${buttonSave}', 'class': 'saveButton'\"\n\t\t\tdata-dojo-attach-point=\"saveButton\" data-dojo-attach-event=\"onClick:save\"></button\n\t\t><button data-dojo-type=\"dijit/form/Button\"  data-dojo-props=\"label: '${buttonCancel}', 'class': 'cancelButton'\"\n\t\t\tdata-dojo-attach-point=\"cancelButton\" data-dojo-attach-event=\"onClick:cancel\"></button\n\t></span\n></span>\n","dijit/form/VerticalRule":function(){
define(["dojo/_base/declare","./HorizontalRule"],function(_81e,_81f){
return _81e("dijit.form.VerticalRule",_81f,{templateString:"<div class=\"dijitRuleContainer dijitRuleContainerV\"></div>",_positionPrefix:"<div class=\"dijitRuleMark dijitRuleMarkV\" style=\"top:",_isHorizontal:false});
});
},"dijit/form/_FormSelectWidget":function(){
define(["dojo/_base/array","dojo/_base/Deferred","dojo/aspect","dojo/data/util/sorter","dojo/_base/declare","dojo/dom","dojo/dom-class","dojo/_base/kernel","dojo/_base/lang","dojo/query","dojo/when","dojo/store/util/QueryResults","./_FormValueWidget"],function(_820,_821,_822,_823,_824,dom,_825,_826,lang,_827,when,_828,_829){
var _82a=_824("dijit.form._FormSelectWidget",_829,{multiple:false,options:null,store:null,query:null,queryOptions:null,labelAttr:"",onFetch:null,sortByLabel:true,loadChildrenOnOpen:false,onLoadDeferred:null,getOptions:function(_82b){
var _82c=_82b,opts=this.options||[],l=opts.length;
if(_82c===undefined){
return opts;
}
if(lang.isArray(_82c)){
return _820.map(_82c,"return this.getOptions(item);",this);
}
if(lang.isObject(_82b)){
if(!_820.some(this.options,function(o,idx){
if(o===_82c||(o.value&&o.value===_82c.value)){
_82c=idx;
return true;
}
return false;
})){
_82c=-1;
}
}
if(typeof _82c=="string"){
for(var i=0;i<l;i++){
if(opts[i].value===_82c){
_82c=i;
break;
}
}
}
if(typeof _82c=="number"&&_82c>=0&&_82c<l){
return this.options[_82c];
}
return null;
},addOption:function(_82d){
if(!lang.isArray(_82d)){
_82d=[_82d];
}
_820.forEach(_82d,function(i){
if(i&&lang.isObject(i)){
this.options.push(i);
}
},this);
this._loadChildren();
},removeOption:function(_82e){
if(!lang.isArray(_82e)){
_82e=[_82e];
}
var _82f=this.getOptions(_82e);
_820.forEach(_82f,function(i){
if(i){
this.options=_820.filter(this.options,function(node){
return (node.value!==i.value||node.label!==i.label);
});
this._removeOptionItem(i);
}
},this);
this._loadChildren();
},updateOption:function(_830){
if(!lang.isArray(_830)){
_830=[_830];
}
_820.forEach(_830,function(i){
var _831=this.getOptions(i),k;
if(_831){
for(k in i){
_831[k]=i[k];
}
}
},this);
this._loadChildren();
},setStore:function(_832,_833,_834){
var _835=this.store;
_834=_834||{};
if(_835!==_832){
var h;
while((h=this._notifyConnections.pop())){
h.remove();
}
if(!_832.get){
lang.mixin(_832,{_oldAPI:true,get:function(id){
var _836=new _821();
this.fetchItemByIdentity({identity:id,onItem:function(_837){
_836.resolve(_837);
},onError:function(_838){
_836.reject(_838);
}});
return _836.promise;
},query:function(_839,_83a){
var _83b=new _821(function(){
if(_83c.abort){
_83c.abort();
}
});
_83b.total=new _821();
var _83c=this.fetch(lang.mixin({query:_839,onBegin:function(_83d){
_83b.total.resolve(_83d);
},onComplete:function(_83e){
_83b.resolve(_83e);
},onError:function(_83f){
_83b.reject(_83f);
}},_83a));
return new _828(_83b);
}});
if(_832.getFeatures()["dojo.data.api.Notification"]){
this._notifyConnections=[_822.after(_832,"onNew",lang.hitch(this,"_onNewItem"),true),_822.after(_832,"onDelete",lang.hitch(this,"_onDeleteItem"),true),_822.after(_832,"onSet",lang.hitch(this,"_onSetItem"),true)];
}
}
this._set("store",_832);
}
if(this.options&&this.options.length){
this.removeOption(this.options);
}
if(this._queryRes&&this._queryRes.close){
this._queryRes.close();
}
if(_834.query){
this._set("query",_834.query);
this._set("queryOptions",_834.queryOptions);
}
if(_832){
this._loadingStore=true;
this.onLoadDeferred=new _821();
this._queryRes=_832.query(this.query,this.queryOptions);
when(this._queryRes,lang.hitch(this,function(_840){
if(this.sortByLabel&&!_834.sort&&_840.length){
if(_840[0].getValue){
_840.sort(_823.createSortFunction([{attribute:_832.getLabelAttributes(_840[0])[0]}],_832));
}else{
var _841=this.labelAttr;
_840.sort(function(a,b){
return a[_841]>b[_841]?1:b[_841]>a[_841]?-1:0;
});
}
}
if(_834.onFetch){
_840=_834.onFetch.call(this,_840,_834);
}
_820.forEach(_840,function(i){
this._addOptionForItem(i);
},this);
if(this._queryRes.observe){
this._queryRes.observe(lang.hitch(this,function(_842,_843,_844){
if(_843==_844){
this._onSetItem(_842);
}else{
if(_843!=-1){
this._onDeleteItem(_842);
}
if(_844!=-1){
this._onNewItem(_842);
}
}
}),true);
}
this._loadingStore=false;
this.set("value","_pendingValue" in this?this._pendingValue:_833);
delete this._pendingValue;
if(!this.loadChildrenOnOpen){
this._loadChildren();
}else{
this._pseudoLoadChildren(_840);
}
this.onLoadDeferred.resolve(true);
this.onSetStore();
}),function(err){
console.error("dijit.form.Select: "+err.toString());
this.onLoadDeferred.reject(err);
});
}
return _835;
},_setValueAttr:function(_845,_846){
if(!this._onChangeActive){
_846=null;
}
if(this._loadingStore){
this._pendingValue=_845;
return;
}
var opts=this.getOptions()||[];
if(!lang.isArray(_845)){
_845=[_845];
}
_820.forEach(_845,function(i,idx){
if(!lang.isObject(i)){
i=i+"";
}
if(typeof i==="string"){
_845[idx]=_820.filter(opts,function(node){
return node.value===i;
})[0]||{value:"",label:""};
}
},this);
_845=_820.filter(_845,function(i){
return i&&i.value;
});
if(!this.multiple&&(!_845[0]||!_845[0].value)&&opts.length){
_845[0]=opts[0];
}
_820.forEach(opts,function(i){
i.selected=_820.some(_845,function(v){
return v.value===i.value;
});
});
var val=_820.map(_845,function(i){
return i.value;
}),disp=_820.map(_845,function(i){
return i.label;
});
if(typeof val=="undefined"||typeof val[0]=="undefined"){
return;
}
this._setDisplay(this.multiple?disp:disp[0]);
this.inherited(arguments,[this.multiple?val:val[0],_846]);
this._updateSelection();
},_getDisplayedValueAttr:function(){
var val=this.get("value");
if(!lang.isArray(val)){
val=[val];
}
var ret=_820.map(this.getOptions(val),function(v){
if(v&&"label" in v){
return v.label;
}else{
if(v){
return v.value;
}
}
return null;
},this);
return this.multiple?ret:ret[0];
},_loadChildren:function(){
if(this._loadingStore){
return;
}
_820.forEach(this._getChildren(),function(_847){
_847.destroyRecursive();
});
_820.forEach(this.options,this._addOptionItem,this);
this._updateSelection();
},_updateSelection:function(){
this._set("value",this._getValueFromOpts());
var val=this.value;
if(!lang.isArray(val)){
val=[val];
}
if(val&&val[0]){
_820.forEach(this._getChildren(),function(_848){
var _849=_820.some(val,function(v){
return _848.option&&(v===_848.option.value);
});
_825.toggle(_848.domNode,this.baseClass.replace(/\s+|$/g,"SelectedOption "),_849);
_848.domNode.setAttribute("aria-selected",_849?"true":"false");
},this);
}
},_getValueFromOpts:function(){
var opts=this.getOptions()||[];
if(!this.multiple&&opts.length){
var opt=_820.filter(opts,function(i){
return i.selected;
})[0];
if(opt&&opt.value){
return opt.value;
}else{
opts[0].selected=true;
return opts[0].value;
}
}else{
if(this.multiple){
return _820.map(_820.filter(opts,function(i){
return i.selected;
}),function(i){
return i.value;
})||[];
}
}
return "";
},_onNewItem:function(item,_84a){
if(!_84a||!_84a.parent){
this._addOptionForItem(item);
}
},_onDeleteItem:function(item){
var _84b=this.store;
this.removeOption(_84b.getIdentity(item));
},_onSetItem:function(item){
this.updateOption(this._getOptionObjForItem(item));
},_getOptionObjForItem:function(item){
var _84c=this.store,_84d=(this.labelAttr&&this.labelAttr in item)?item[this.labelAttr]:_84c.getLabel(item),_84e=(_84d?_84c.getIdentity(item):null);
return {value:_84e,label:_84d,item:item};
},_addOptionForItem:function(item){
var _84f=this.store;
if(_84f.isItemLoaded&&!_84f.isItemLoaded(item)){
_84f.loadItem({item:item,onItem:function(i){
this._addOptionForItem(i);
},scope:this});
return;
}
var _850=this._getOptionObjForItem(item);
this.addOption(_850);
},constructor:function(_851){
this._oValue=(_851||{}).value||null;
this._notifyConnections=[];
},buildRendering:function(){
this.inherited(arguments);
dom.setSelectable(this.focusNode,false);
},_fillContent:function(){
if(!this.options){
this.options=this.srcNodeRef?_827("> *",this.srcNodeRef).map(function(node){
if(node.getAttribute("type")==="separator"){
return {value:"",label:"",selected:false,disabled:false};
}
return {value:(node.getAttribute("data-"+_826._scopeName+"-value")||node.getAttribute("value")),label:String(node.innerHTML),selected:node.getAttribute("selected")||false,disabled:node.getAttribute("disabled")||false};
},this):[];
}
if(!this.value){
this._set("value",this._getValueFromOpts());
}else{
if(this.multiple&&typeof this.value=="string"){
this._set("value",this.value.split(","));
}
}
},postCreate:function(){
this.inherited(arguments);
this.connect(this,"onChange","_updateSelection");
var _852=this.store;
if(_852&&(_852.getIdentity||_852.getFeatures()["dojo.data.api.Identity"])){
this.store=null;
this.setStore(_852,this._oValue);
}
},startup:function(){
this._loadChildren();
this.inherited(arguments);
},destroy:function(){
var h;
while((h=this._notifyConnections.pop())){
h.remove();
}
if(this._queryRes&&this._queryRes.close){
this._queryRes.close();
}
this.inherited(arguments);
},_addOptionItem:function(){
},_removeOptionItem:function(){
},_setDisplay:function(){
},_getChildren:function(){
return [];
},_getSelectedOptionsAttr:function(){
return this.getOptions(this.get("value"));
},_pseudoLoadChildren:function(){
},onSetStore:function(){
}});
return _82a;
});
},"dijit/form/Select":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dom-attr","dojo/dom-class","dojo/dom-geometry","dojo/_base/event","dojo/i18n","dojo/_base/lang","dojo/sniff","./_FormSelectWidget","../_HasDropDown","../Menu","../MenuItem","../MenuSeparator","../Tooltip","dojo/text!./templates/Select.html","dojo/i18n!./nls/validate"],function(_853,_854,_855,_856,_857,_858,i18n,lang,has,_859,_85a,Menu,_85b,_85c,_85d,_85e){
var _85f=_854("dijit.form._SelectMenu",Menu,{autoFocus:true,buildRendering:function(){
this.inherited(arguments);
var o=(this.menuTableNode=this.domNode);
var n=(this.domNode=this.ownerDocument.createElement("div"));
n.style.cssText="overflow-x: hidden; overflow-y: scroll";
if(o.parentNode){
o.parentNode.replaceChild(n,o);
}
_856.remove(o,"dijitMenuTable");
n.className=o.className+" dijitSelectMenu";
o.className="dijitReset dijitMenuTable";
o.setAttribute("role","listbox");
n.setAttribute("role","presentation");
n.appendChild(o);
},postCreate:function(){
this.inherited(arguments);
this.connect(this.domNode,"onselectstart",_858.stop);
},focus:function(){
var _860=false,val=this.parentWidget.value;
if(lang.isArray(val)){
val=val[val.length-1];
}
if(val){
_853.forEach(this.parentWidget._getChildren(),function(_861){
if(_861.option&&(val===_861.option.value)){
_860=true;
this.focusChild(_861,false);
}
},this);
}
if(!_860){
this.inherited(arguments);
}
},resize:function(mb){
if(mb){
_857.setMarginBox(this.domNode,mb);
if("w" in mb){
this.menuTableNode.style.width="100%";
}
}
}});
var _862=_854("dijit.form.Select",[_859,_85a],{baseClass:"dijitSelect dijitValidationTextBox",templateString:_85e,_buttonInputDisabled:has("ie")?"disabled":"",required:false,state:"",message:"",tooltipPosition:[],emptyLabel:"&#160;",_isLoaded:false,_childrenLoaded:false,_fillContent:function(){
this.inherited(arguments);
if(this.options.length&&!this.value&&this.srcNodeRef){
var si=this.srcNodeRef.selectedIndex||0;
this.value=this.options[si>=0?si:0].value;
}
this.dropDown=new _85f({id:this.id+"_menu",parentWidget:this});
_856.add(this.dropDown.domNode,this.baseClass.replace(/\s+|$/g,"Menu "));
},_getMenuItemForOption:function(_863){
if(!_863.value&&!_863.label){
return new _85c({ownerDocument:this.ownerDocument});
}else{
var _864=lang.hitch(this,"_setValueAttr",_863);
var item=new _85b({option:_863,label:_863.label||this.emptyLabel,onClick:_864,ownerDocument:this.ownerDocument,dir:this.dir,disabled:_863.disabled||false});
item.focusNode.setAttribute("role","option");
return item;
}
},_addOptionItem:function(_865){
if(this.dropDown){
this.dropDown.addChild(this._getMenuItemForOption(_865));
}
},_getChildren:function(){
if(!this.dropDown){
return [];
}
return this.dropDown.getChildren();
},_loadChildren:function(_866){
if(_866===true){
if(this.dropDown){
delete this.dropDown.focusedChild;
}
if(this.options.length){
this.inherited(arguments);
}else{
_853.forEach(this._getChildren(),function(_867){
_867.destroyRecursive();
});
var item=new _85b({ownerDocument:this.ownerDocument,label:this.emptyLabel});
this.dropDown.addChild(item);
}
}else{
this._updateSelection();
}
this._isLoaded=false;
this._childrenLoaded=true;
if(!this._loadingStore){
this._setValueAttr(this.value,false);
}
},_refreshState:function(){
if(this._started){
this.validate(this.focused);
}
},startup:function(){
this.inherited(arguments);
this._refreshState();
},_setValueAttr:function(_868){
this.inherited(arguments);
_855.set(this.valueNode,"value",this.get("value"));
this._refreshState();
},_setDisabledAttr:function(_869){
this.inherited(arguments);
this._refreshState();
},_setRequiredAttr:function(_86a){
this._set("required",_86a);
this.focusNode.setAttribute("aria-required",_86a);
this._refreshState();
},_setOptionsAttr:function(_86b){
this._isLoaded=false;
this._set("options",_86b);
},_setDisplay:function(_86c){
var lbl=_86c||this.emptyLabel;
this.containerNode.innerHTML="<span role=\"option\" class=\"dijitReset dijitInline "+this.baseClass.replace(/\s+|$/g,"Label ")+"\">"+lbl+"</span>";
},validate:function(_86d){
var _86e=this.disabled||this.isValid(_86d);
this._set("state",_86e?"":(this._hasBeenBlurred?"Error":"Incomplete"));
this.focusNode.setAttribute("aria-invalid",_86e?"false":"true");
var _86f=_86e?"":this._missingMsg;
if(_86f&&this.focused&&this._hasBeenBlurred){
_85d.show(_86f,this.domNode,this.tooltipPosition,!this.isLeftToRight());
}else{
_85d.hide(this.domNode);
}
this._set("message",_86f);
return _86e;
},isValid:function(){
return (!this.required||this.value===0||!(/^\s*$/.test(this.value||"")));
},reset:function(){
this.inherited(arguments);
_85d.hide(this.domNode);
this._refreshState();
},postMixInProperties:function(){
this.inherited(arguments);
this._missingMsg=i18n.getLocalization("dijit.form","validate",this.lang).missingMessage;
},postCreate:function(){
this.inherited(arguments);
this.connect(this.domNode,"onselectstart",_858.stop);
this.domNode.setAttribute("aria-expanded","false");
if(has("ie")<9){
this.defer(function(){
try{
var s=domStyle.getComputedStyle(this.domNode);
if(s){
var ff=s.fontFamily;
if(ff){
var _870=this.domNode.getElementsByTagName("INPUT");
if(_870){
for(var i=0;i<_870.length;i++){
_870[i].style.fontFamily=ff;
}
}
}
}
}
catch(e){
}
});
}
},_setStyleAttr:function(_871){
this.inherited(arguments);
_856.toggle(this.domNode,this.baseClass.replace(/\s+|$/g,"FixedWidth "),!!this.domNode.style.width);
},isLoaded:function(){
return this._isLoaded;
},loadDropDown:function(_872){
this._loadChildren(true);
this._isLoaded=true;
_872();
},closeDropDown:function(){
this.inherited(arguments);
if(this.dropDown&&this.dropDown.menuTableNode){
this.dropDown.menuTableNode.style.width="";
}
},destroy:function(_873){
if(this.dropDown&&!this.dropDown._destroyed){
this.dropDown.destroyRecursive(_873);
delete this.dropDown;
}
this.inherited(arguments);
},_onFocus:function(){
this.validate(true);
this.inherited(arguments);
},_onBlur:function(){
_85d.hide(this.domNode);
this.inherited(arguments);
this.validate(false);
}});
_862._Menu=_85f;
return _862;
});
},"dijit/_editor/range":function(){
define("dijit/_editor/range",["dojo/_base/array","dojo/_base/declare","dojo/_base/lang","dojo/_base/window","../main"],function(_874,_875,lang,win,_876){
_876.range={};
_876.range.getIndex=function(node,_877){
var ret=[],retR=[];
var _878=node;
var _879,n;
while(node!=_877){
var i=0;
_879=node.parentNode;
while((n=_879.childNodes[i++])){
if(n===node){
--i;
break;
}
}
ret.unshift(i);
retR.unshift(i-_879.childNodes.length);
node=_879;
}
if(ret.length>0&&_878.nodeType==3){
n=_878.previousSibling;
while(n&&n.nodeType==3){
ret[ret.length-1]--;
n=n.previousSibling;
}
n=_878.nextSibling;
while(n&&n.nodeType==3){
retR[retR.length-1]++;
n=n.nextSibling;
}
}
return {o:ret,r:retR};
};
_876.range.getNode=function(_87a,_87b){
if(!lang.isArray(_87a)||_87a.length==0){
return _87b;
}
var node=_87b;
_874.every(_87a,function(i){
if(i>=0&&i<node.childNodes.length){
node=node.childNodes[i];
}else{
node=null;
return false;
}
return true;
});
return node;
};
_876.range.getCommonAncestor=function(n1,n2,root){
root=root||n1.ownerDocument.body;
var _87c=function(n){
var as=[];
while(n){
as.unshift(n);
if(n!==root){
n=n.parentNode;
}else{
break;
}
}
return as;
};
var n1as=_87c(n1);
var n2as=_87c(n2);
var m=Math.min(n1as.length,n2as.length);
var com=n1as[0];
for(var i=1;i<m;i++){
if(n1as[i]===n2as[i]){
com=n1as[i];
}else{
break;
}
}
return com;
};
_876.range.getAncestor=function(node,_87d,root){
root=root||node.ownerDocument.body;
while(node&&node!==root){
var name=node.nodeName.toUpperCase();
if(_87d.test(name)){
return node;
}
node=node.parentNode;
}
return null;
};
_876.range.BlockTagNames=/^(?:P|DIV|H1|H2|H3|H4|H5|H6|ADDRESS|PRE|OL|UL|LI|DT|DE)$/;
_876.range.getBlockAncestor=function(node,_87e,root){
root=root||node.ownerDocument.body;
_87e=_87e||_876.range.BlockTagNames;
var _87f=null,_880;
while(node&&node!==root){
var name=node.nodeName.toUpperCase();
if(!_87f&&_87e.test(name)){
_87f=node;
}
if(!_880&&(/^(?:BODY|TD|TH|CAPTION)$/).test(name)){
_880=node;
}
node=node.parentNode;
}
return {blockNode:_87f,blockContainer:_880||node.ownerDocument.body};
};
_876.range.atBeginningOfContainer=function(_881,node,_882){
var _883=false;
var _884=(_882==0);
if(!_884&&node.nodeType==3){
if(/^[\s\xA0]+$/.test(node.nodeValue.substr(0,_882))){
_884=true;
}
}
if(_884){
var _885=node;
_883=true;
while(_885&&_885!==_881){
if(_885.previousSibling){
_883=false;
break;
}
_885=_885.parentNode;
}
}
return _883;
};
_876.range.atEndOfContainer=function(_886,node,_887){
var _888=false;
var _889=(_887==(node.length||node.childNodes.length));
if(!_889&&node.nodeType==3){
if(/^[\s\xA0]+$/.test(node.nodeValue.substr(_887))){
_889=true;
}
}
if(_889){
var _88a=node;
_888=true;
while(_88a&&_88a!==_886){
if(_88a.nextSibling){
_888=false;
break;
}
_88a=_88a.parentNode;
}
}
return _888;
};
_876.range.adjacentNoneTextNode=function(_88b,next){
var node=_88b;
var len=(0-_88b.length)||0;
var prop=next?"nextSibling":"previousSibling";
while(node){
if(node.nodeType!=3){
break;
}
len+=node.length;
node=node[prop];
}
return [node,len];
};
_876.range.create=function(win){
win=win||window;
if(win.getSelection){
return win.document.createRange();
}else{
return new _876.range.W3CRange();
}
};
_876.range.getSelection=function(_88c,_88d){
if(_88c.getSelection){
return _88c.getSelection();
}else{
var s=new _876.range.ie.selection(_88c);
if(!_88d){
s._getCurrentSelection();
}
return s;
}
};
if(!window.getSelection){
_876.range.ie={cachedSelection:{},selection:function(_88e){
this._ranges=[];
this.addRange=function(r,_88f){
this._ranges.push(r);
if(!_88f){
r._select();
}
this.rangeCount=this._ranges.length;
};
this.removeAllRanges=function(){
this._ranges=[];
this.rangeCount=0;
};
var _890=function(){
var r=_88e.document.selection.createRange();
var type=_88e.document.selection.type.toUpperCase();
if(type=="CONTROL"){
return new _876.range.W3CRange(_876.range.ie.decomposeControlRange(r));
}else{
return new _876.range.W3CRange(_876.range.ie.decomposeTextRange(r));
}
};
this.getRangeAt=function(i){
return this._ranges[i];
};
this._getCurrentSelection=function(){
this.removeAllRanges();
var r=_890();
if(r){
this.addRange(r,true);
this.isCollapsed=r.collapsed;
}else{
this.isCollapsed=true;
}
};
},decomposeControlRange:function(_891){
var _892=_891.item(0),_893=_891.item(_891.length-1);
var _894=_892.parentNode,_895=_893.parentNode;
var _896=_876.range.getIndex(_892,_894).o[0];
var _897=_876.range.getIndex(_893,_895).o[0]+1;
return [_894,_896,_895,_897];
},getEndPoint:function(_898,end){
var _899=_898.duplicate();
_899.collapse(!end);
var _89a="EndTo"+(end?"End":"Start");
var _89b=_899.parentElement();
var _89c,_89d,_89e;
if(_89b.childNodes.length>0){
_874.every(_89b.childNodes,function(node,i){
var _89f;
if(node.nodeType!=3){
_899.moveToElementText(node);
if(_899.compareEndPoints(_89a,_898)>0){
if(_89e&&_89e.nodeType==3){
_89c=_89e;
_89f=true;
}else{
_89c=_89b;
_89d=i;
return false;
}
}else{
if(i==_89b.childNodes.length-1){
_89c=_89b;
_89d=_89b.childNodes.length;
return false;
}
}
}else{
if(i==_89b.childNodes.length-1){
_89c=node;
_89f=true;
}
}
if(_89f&&_89c){
var _8a0=_876.range.adjacentNoneTextNode(_89c)[0];
if(_8a0){
_89c=_8a0.nextSibling;
}else{
_89c=_89b.firstChild;
}
var _8a1=_876.range.adjacentNoneTextNode(_89c);
_8a0=_8a1[0];
var _8a2=_8a1[1];
if(_8a0){
_899.moveToElementText(_8a0);
_899.collapse(false);
}else{
_899.moveToElementText(_89b);
}
_899.setEndPoint(_89a,_898);
_89d=_899.text.length-_8a2;
return false;
}
_89e=node;
return true;
});
}else{
_89c=_89b;
_89d=0;
}
if(!end&&_89c.nodeType==1&&_89d==_89c.childNodes.length){
var _8a3=_89c.nextSibling;
if(_8a3&&_8a3.nodeType==3){
_89c=_8a3;
_89d=0;
}
}
return [_89c,_89d];
},setEndPoint:function(_8a4,_8a5,_8a6){
var _8a7=_8a4.duplicate(),node,len;
if(_8a5.nodeType!=3){
if(_8a6>0){
node=_8a5.childNodes[_8a6-1];
if(node){
if(node.nodeType==3){
_8a5=node;
_8a6=node.length;
}else{
if(node.nextSibling&&node.nextSibling.nodeType==3){
_8a5=node.nextSibling;
_8a6=0;
}else{
_8a7.moveToElementText(node.nextSibling?node:_8a5);
var _8a8=node.parentNode;
var _8a9=_8a8.insertBefore(node.ownerDocument.createTextNode(" "),node.nextSibling);
_8a7.collapse(false);
_8a8.removeChild(_8a9);
}
}
}
}else{
_8a7.moveToElementText(_8a5);
_8a7.collapse(true);
}
}
if(_8a5.nodeType==3){
var _8aa=_876.range.adjacentNoneTextNode(_8a5);
var _8ab=_8aa[0];
len=_8aa[1];
if(_8ab){
_8a7.moveToElementText(_8ab);
_8a7.collapse(false);
if(_8ab.contentEditable!="inherit"){
len++;
}
}else{
_8a7.moveToElementText(_8a5.parentNode);
_8a7.collapse(true);
_8a7.move("character",1);
_8a7.move("character",-1);
}
_8a6+=len;
if(_8a6>0){
if(_8a7.move("character",_8a6)!=_8a6){
console.error("Error when moving!");
}
}
}
return _8a7;
},decomposeTextRange:function(_8ac){
var _8ad=_876.range.ie.getEndPoint(_8ac);
var _8ae=_8ad[0],_8af=_8ad[1];
var _8b0=_8ad[0],_8b1=_8ad[1];
if(_8ac.htmlText.length){
if(_8ac.htmlText==_8ac.text){
_8b1=_8af+_8ac.text.length;
}else{
_8ad=_876.range.ie.getEndPoint(_8ac,true);
_8b0=_8ad[0],_8b1=_8ad[1];
}
}
return [_8ae,_8af,_8b0,_8b1];
},setRange:function(_8b2,_8b3,_8b4,_8b5,_8b6,_8b7){
var _8b8=_876.range.ie.setEndPoint(_8b2,_8b3,_8b4);
_8b2.setEndPoint("StartToStart",_8b8);
if(!_8b7){
var end=_876.range.ie.setEndPoint(_8b2,_8b5,_8b6);
}
_8b2.setEndPoint("EndToEnd",end||_8b8);
return _8b2;
}};
_875("dijit.range.W3CRange",null,{constructor:function(){
if(arguments.length>0){
this.setStart(arguments[0][0],arguments[0][1]);
this.setEnd(arguments[0][2],arguments[0][3]);
}else{
this.commonAncestorContainer=null;
this.startContainer=null;
this.startOffset=0;
this.endContainer=null;
this.endOffset=0;
this.collapsed=true;
}
},_updateInternal:function(){
if(this.startContainer!==this.endContainer){
this.commonAncestorContainer=_876.range.getCommonAncestor(this.startContainer,this.endContainer);
}else{
this.commonAncestorContainer=this.startContainer;
}
this.collapsed=(this.startContainer===this.endContainer)&&(this.startOffset==this.endOffset);
},setStart:function(node,_8b9){
_8b9=parseInt(_8b9);
if(this.startContainer===node&&this.startOffset==_8b9){
return;
}
delete this._cachedBookmark;
this.startContainer=node;
this.startOffset=_8b9;
if(!this.endContainer){
this.setEnd(node,_8b9);
}else{
this._updateInternal();
}
},setEnd:function(node,_8ba){
_8ba=parseInt(_8ba);
if(this.endContainer===node&&this.endOffset==_8ba){
return;
}
delete this._cachedBookmark;
this.endContainer=node;
this.endOffset=_8ba;
if(!this.startContainer){
this.setStart(node,_8ba);
}else{
this._updateInternal();
}
},setStartAfter:function(node,_8bb){
this._setPoint("setStart",node,_8bb,1);
},setStartBefore:function(node,_8bc){
this._setPoint("setStart",node,_8bc,0);
},setEndAfter:function(node,_8bd){
this._setPoint("setEnd",node,_8bd,1);
},setEndBefore:function(node,_8be){
this._setPoint("setEnd",node,_8be,0);
},_setPoint:function(what,node,_8bf,ext){
var _8c0=_876.range.getIndex(node,node.parentNode).o;
this[what](node.parentNode,_8c0.pop()+ext);
},_getIERange:function(){
var r=(this._body||this.endContainer.ownerDocument.body).createTextRange();
_876.range.ie.setRange(r,this.startContainer,this.startOffset,this.endContainer,this.endOffset,this.collapsed);
return r;
},getBookmark:function(){
this._getIERange();
return this._cachedBookmark;
},_select:function(){
var r=this._getIERange();
r.select();
},deleteContents:function(){
var s=this.startContainer,r=this._getIERange();
if(s.nodeType===3&&!this.startOffset){
this.setStartBefore(s);
}
r.pasteHTML("");
this.endContainer=this.startContainer;
this.endOffset=this.startOffset;
this.collapsed=true;
},cloneRange:function(){
var r=new _876.range.W3CRange([this.startContainer,this.startOffset,this.endContainer,this.endOffset]);
r._body=this._body;
return r;
},detach:function(){
this._body=null;
this.commonAncestorContainer=null;
this.startContainer=null;
this.startOffset=0;
this.endContainer=null;
this.endOffset=0;
this.collapsed=true;
}});
}
return _876.range;
});
},"dojo/store/util/QueryResults":function(){
define(["../../_base/array","../../_base/lang","../../_base/Deferred"],function(_8c1,lang,_8c2){
var _8c3=function(_8c4){
if(!_8c4){
return _8c4;
}
if(_8c4.then){
_8c4=lang.delegate(_8c4);
}
function _8c5(_8c6){
if(!_8c4[_8c6]){
_8c4[_8c6]=function(){
var args=arguments;
return _8c2.when(_8c4,function(_8c7){
Array.prototype.unshift.call(args,_8c7);
return _8c3(_8c1[_8c6].apply(_8c1,args));
});
};
}
};
_8c5("forEach");
_8c5("filter");
_8c5("map");
if(!_8c4.total){
_8c4.total=_8c2.when(_8c4,function(_8c8){
return _8c8.length;
});
}
return _8c4;
};
lang.setObject("dojo.store.util.QueryResults",_8c3);
return _8c3;
});
},"dijit/form/_ListBase":function(){
define(["dojo/_base/declare","dojo/on","dojo/window"],function(_8c9,on,_8ca){
return _8c9("dijit.form._ListBase",null,{selected:null,_listConnect:function(_8cb,_8cc){
var self=this;
return self.own(on(self.containerNode,on.selector(function(_8cd,_8ce,_8cf){
return _8cd.parentNode==_8cf;
},_8cb),function(evt){
evt.preventDefault();
self[_8cc](evt,this);
}));
},selectFirstNode:function(){
var _8d0=this.containerNode.firstChild;
while(_8d0&&_8d0.style.display=="none"){
_8d0=_8d0.nextSibling;
}
this._setSelectedAttr(_8d0);
},selectLastNode:function(){
var last=this.containerNode.lastChild;
while(last&&last.style.display=="none"){
last=last.previousSibling;
}
this._setSelectedAttr(last);
},selectNextNode:function(){
var _8d1=this.selected;
if(!_8d1){
this.selectFirstNode();
}else{
var next=_8d1.nextSibling;
while(next&&next.style.display=="none"){
next=next.nextSibling;
}
if(!next){
this.selectFirstNode();
}else{
this._setSelectedAttr(next);
}
}
},selectPreviousNode:function(){
var _8d2=this.selected;
if(!_8d2){
this.selectLastNode();
}else{
var prev=_8d2.previousSibling;
while(prev&&prev.style.display=="none"){
prev=prev.previousSibling;
}
if(!prev){
this.selectLastNode();
}else{
this._setSelectedAttr(prev);
}
}
},_setSelectedAttr:function(node){
if(this.selected!=node){
var _8d3=this.selected;
if(_8d3){
this.onDeselect(_8d3);
this.selected=null;
}
if(node){
this.selected=node;
_8ca.scrollIntoView(node);
this.onSelect(node);
}
}else{
if(node){
this.onSelect(node);
}
}
}});
});
},"dojo/DeferredList":function(){
define(["./_base/kernel","./_base/Deferred","./_base/array"],function(dojo,_8d4,_8d5){
dojo.DeferredList=function(list,_8d6,_8d7,_8d8,_8d9){
var _8da=[];
_8d4.call(this);
var self=this;
if(list.length===0&&!_8d6){
this.resolve([0,[]]);
}
var _8db=0;
_8d5.forEach(list,function(item,i){
item.then(function(_8dc){
if(_8d6){
self.resolve([i,_8dc]);
}else{
_8dd(true,_8dc);
}
},function(_8de){
if(_8d7){
self.reject(_8de);
}else{
_8dd(false,_8de);
}
if(_8d8){
return null;
}
throw _8de;
});
function _8dd(_8df,_8e0){
_8da[i]=[_8df,_8e0];
_8db++;
if(_8db===list.length){
self.resolve(_8da);
}
};
});
};
dojo.DeferredList.prototype=new _8d4();
dojo.DeferredList.prototype.gatherResults=function(_8e1){
var d=new dojo.DeferredList(_8e1,false,true,false);
d.addCallback(function(_8e2){
var ret=[];
_8d5.forEach(_8e2,function(_8e3){
ret.push(_8e3[1]);
});
return ret;
});
return d;
};
return dojo.DeferredList;
});
},"dojo/dnd/common":function(){
define(["../_base/connect","../_base/kernel","../_base/lang","../dom"],function(_8e4,_8e5,lang,dom){
var _8e6={};
_8e6.getCopyKeyState=_8e4.isCopyKey;
_8e6._uniqueId=0;
_8e6.getUniqueId=function(){
var id;
do{
id=_8e5._scopeName+"Unique"+(++_8e6._uniqueId);
}while(dom.byId(id));
return id;
};
_8e6._empty={};
_8e6.isFormElement=function(e){
var t=e.target;
if(t.nodeType==3){
t=t.parentNode;
}
return " button textarea input select option ".indexOf(" "+t.tagName.toLowerCase()+" ")>=0;
};
lang.mixin(lang.getObject("dojo.dnd",true),_8e6);
return _8e6;
});
},"dijit/CalendarLite":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/cldr/supplemental","dojo/date","dojo/date/locale","dojo/date/stamp","dojo/dom","dojo/dom-class","dojo/_base/event","dojo/_base/lang","dojo/sniff","dojo/string","./_WidgetBase","./_TemplatedMixin","dojo/text!./templates/Calendar.html","./hccss"],function(_8e7,_8e8,_8e9,date,_8ea,_8eb,dom,_8ec,_8ed,lang,has,_8ee,_8ef,_8f0,_8f1){
var _8f2=_8e8("dijit.CalendarLite",[_8ef,_8f0],{templateString:_8f1,dowTemplateString:"<th class=\"dijitReset dijitCalendarDayLabelTemplate\" role=\"columnheader\"><span class=\"dijitCalendarDayLabel\">${d}</span></th>",dateTemplateString:"<td class=\"dijitReset\" role=\"gridcell\" data-dojo-attach-point=\"dateCells\"><span class=\"dijitCalendarDateLabel\" data-dojo-attach-point=\"dateLabels\"></span></td>",weekTemplateString:"<tr class=\"dijitReset dijitCalendarWeekTemplate\" role=\"row\">${d}${d}${d}${d}${d}${d}${d}</tr>",value:new Date(""),datePackage:"",dayWidth:"narrow",tabIndex:"0",currentFocus:new Date(),baseClass:"dijitCalendar",_isValidDate:function(_8f3){
return _8f3&&!isNaN(_8f3)&&typeof _8f3=="object"&&_8f3.toString()!=this.constructor.prototype.value.toString();
},_getValueAttr:function(){
if(this.value&&!isNaN(this.value)){
var _8f4=new this.dateClassObj(this.value);
_8f4.setHours(0,0,0,0);
if(_8f4.getDate()<this.value.getDate()){
_8f4=this.dateModule.add(_8f4,"hour",1);
}
return _8f4;
}else{
return null;
}
},_setValueAttr:function(_8f5,_8f6){
if(typeof _8f5=="string"){
_8f5=_8eb.fromISOString(_8f5);
}
_8f5=this._patchDate(_8f5);
if(this._isValidDate(_8f5)&&!this.isDisabledDate(_8f5,this.lang)){
this._set("value",_8f5);
this.set("currentFocus",_8f5);
this._markSelectedDates([_8f5]);
if(this._created&&(_8f6||typeof _8f6=="undefined")){
this.onChange(this.get("value"));
}
}else{
this._set("value",null);
this._markSelectedDates([]);
}
},_patchDate:function(_8f7){
if(_8f7){
_8f7=new this.dateClassObj(_8f7);
_8f7.setHours(1,0,0,0);
}
return _8f7;
},_setText:function(node,text){
while(node.firstChild){
node.removeChild(node.firstChild);
}
node.appendChild(node.ownerDocument.createTextNode(text));
},_populateGrid:function(){
var _8f8=new this.dateClassObj(this.currentFocus);
_8f8.setDate(1);
var _8f9=_8f8.getDay(),_8fa=this.dateModule.getDaysInMonth(_8f8),_8fb=this.dateModule.getDaysInMonth(this.dateModule.add(_8f8,"month",-1)),_8fc=new this.dateClassObj(),_8fd=_8e9.getFirstDayOfWeek(this.lang);
if(_8fd>_8f9){
_8fd-=7;
}
this._date2cell={};
_8e7.forEach(this.dateCells,function(_8fe,idx){
var i=idx+_8fd;
var date=new this.dateClassObj(_8f8),_8ff,_900="dijitCalendar",adj=0;
if(i<_8f9){
_8ff=_8fb-_8f9+i+1;
adj=-1;
_900+="Previous";
}else{
if(i>=(_8f9+_8fa)){
_8ff=i-_8f9-_8fa+1;
adj=1;
_900+="Next";
}else{
_8ff=i-_8f9+1;
_900+="Current";
}
}
if(adj){
date=this.dateModule.add(date,"month",adj);
}
date.setDate(_8ff);
if(!this.dateModule.compare(date,_8fc,"date")){
_900="dijitCalendarCurrentDate "+_900;
}
if(this.isDisabledDate(date,this.lang)){
_900="dijitCalendarDisabledDate "+_900;
_8fe.setAttribute("aria-disabled","true");
}else{
_900="dijitCalendarEnabledDate "+_900;
_8fe.removeAttribute("aria-disabled");
_8fe.setAttribute("aria-selected","false");
}
var _901=this.getClassForDate(date,this.lang);
if(_901){
_900=_901+" "+_900;
}
_8fe.className=_900+"Month dijitCalendarDateTemplate";
var _902=date.valueOf();
this._date2cell[_902]=_8fe;
_8fe.dijitDateValue=_902;
this._setText(this.dateLabels[idx],date.getDateLocalized?date.getDateLocalized(this.lang):date.getDate());
},this);
},_populateControls:function(){
var _903=new this.dateClassObj(this.currentFocus);
_903.setDate(1);
this.monthWidget.set("month",_903);
var y=_903.getFullYear()-1;
var d=new this.dateClassObj();
_8e7.forEach(["previous","current","next"],function(name){
d.setFullYear(y++);
this._setText(this[name+"YearLabelNode"],this.dateLocaleModule.format(d,{selector:"year",locale:this.lang}));
},this);
},goToToday:function(){
this.set("value",new this.dateClassObj());
},constructor:function(_904){
this.dateModule=_904.datePackage?lang.getObject(_904.datePackage,false):date;
this.dateClassObj=this.dateModule.Date||Date;
this.dateLocaleModule=_904.datePackage?lang.getObject(_904.datePackage+".locale",false):_8ea;
},_createMonthWidget:function(){
return _8f2._MonthWidget({id:this.id+"_mw",lang:this.lang,dateLocaleModule:this.dateLocaleModule},this.monthNode);
},buildRendering:function(){
var d=this.dowTemplateString,_905=this.dateLocaleModule.getNames("days",this.dayWidth,"standAlone",this.lang),_906=_8e9.getFirstDayOfWeek(this.lang);
this.dayCellsHtml=_8ee.substitute([d,d,d,d,d,d,d].join(""),{d:""},function(){
return _905[_906++%7];
});
var r=_8ee.substitute(this.weekTemplateString,{d:this.dateTemplateString});
this.dateRowsHtml=[r,r,r,r,r,r].join("");
this.dateCells=[];
this.dateLabels=[];
this.inherited(arguments);
dom.setSelectable(this.domNode,false);
var _907=new this.dateClassObj(this.currentFocus);
this.monthWidget=this._createMonthWidget();
this.set("currentFocus",_907,false);
},postCreate:function(){
this.inherited(arguments);
this._connectControls();
},_connectControls:function(){
var _908=lang.hitch(this,function(_909,part,_90a){
this.connect(this[_909],"onclick",function(){
this._setCurrentFocusAttr(this.dateModule.add(this.currentFocus,part,_90a));
});
});
_908("incrementMonth","month",1);
_908("decrementMonth","month",-1);
_908("nextYearLabelNode","year",1);
_908("previousYearLabelNode","year",-1);
},_setCurrentFocusAttr:function(date,_90b){
var _90c=this.currentFocus,_90d=this._getNodeByDate(_90c);
date=this._patchDate(date);
this._set("currentFocus",date);
if(!this._date2cell||this.dateModule.difference(_90c,date,"month")!=0){
this._populateGrid();
this._populateControls();
this._markSelectedDates([this.value]);
}
var _90e=this._getNodeByDate(date);
_90e.setAttribute("tabIndex",this.tabIndex);
if(this.focused||_90b){
_90e.focus();
}
if(_90d&&_90d!=_90e){
if(has("webkit")){
_90d.setAttribute("tabIndex","-1");
}else{
_90d.removeAttribute("tabIndex");
}
}
},focus:function(){
this._setCurrentFocusAttr(this.currentFocus,true);
},_onDayClick:function(evt){
_8ed.stop(evt);
for(var node=evt.target;node&&!node.dijitDateValue;node=node.parentNode){
}
if(node&&!_8ec.contains(node,"dijitCalendarDisabledDate")){
this.set("value",node.dijitDateValue);
}
},_getNodeByDate:function(_90f){
_90f=this._patchDate(_90f);
return _90f&&this._date2cell?this._date2cell[_90f.valueOf()]:null;
},_markSelectedDates:function(_910){
function mark(_911,cell){
_8ec.toggle(cell,"dijitCalendarSelectedDate",_911);
cell.setAttribute("aria-selected",_911?"true":"false");
};
_8e7.forEach(this._selectedCells||[],lang.partial(mark,false));
this._selectedCells=_8e7.filter(_8e7.map(_910,this._getNodeByDate,this),function(n){
return n;
});
_8e7.forEach(this._selectedCells,lang.partial(mark,true));
},onChange:function(){
},isDisabledDate:function(){
},getClassForDate:function(){
}});
_8f2._MonthWidget=_8e8("dijit.CalendarLite._MonthWidget",_8ef,{_setMonthAttr:function(_912){
var _913=this.dateLocaleModule.getNames("months","wide","standAlone",this.lang,_912),_914=(has("ie")==6?"":"<div class='dijitSpacer'>"+_8e7.map(_913,function(s){
return "<div>"+s+"</div>";
}).join("")+"</div>");
this.domNode.innerHTML=_914+"<div class='dijitCalendarMonthLabel dijitCalendarCurrentMonthLabel'>"+_913[_912.getMonth()]+"</div>";
}});
return _8f2;
});
},"dijit/CheckedMenuItem":function(){
require({cache:{"url:dijit/templates/CheckedMenuItem.html":"<tr class=\"dijitReset dijitMenuItem\" data-dojo-attach-point=\"focusNode\" role=\"menuitemcheckbox\" tabIndex=\"-1\">\n\t<td class=\"dijitReset dijitMenuItemIconCell\" role=\"presentation\">\n\t\t<img src=\"${_blankGif}\" alt=\"\" class=\"dijitMenuItemIcon dijitCheckedMenuItemIcon\" data-dojo-attach-point=\"iconNode\"/>\n\t\t<span class=\"dijitCheckedMenuItemIconChar\">&#10003;</span>\n\t</td>\n\t<td class=\"dijitReset dijitMenuItemLabel\" colspan=\"2\" data-dojo-attach-point=\"containerNode,labelNode\"></td>\n\t<td class=\"dijitReset dijitMenuItemAccelKey\" style=\"display: none\" data-dojo-attach-point=\"accelKeyNode\"></td>\n\t<td class=\"dijitReset dijitMenuArrowCell\" role=\"presentation\">&#160;</td>\n</tr>\n"}});
define("dijit/CheckedMenuItem",["dojo/_base/declare","dojo/dom-class","./MenuItem","dojo/text!./templates/CheckedMenuItem.html","./hccss"],function(_915,_916,_917,_918){
return _915("dijit.CheckedMenuItem",_917,{templateString:_918,checked:false,_setCheckedAttr:function(_919){
_916.toggle(this.domNode,"dijitCheckedMenuItemChecked",_919);
this.domNode.setAttribute("aria-checked",_919?"true":"false");
this._set("checked",_919);
},iconClass:"",onChange:function(){
},_onClick:function(evt){
if(!this.disabled){
this.set("checked",!this.checked);
this.onChange(this.checked);
}
this.onClick(evt);
}});
});
},"dijit/form/VerticalRuleLabels":function(){
define(["dojo/_base/declare","./HorizontalRuleLabels"],function(_91a,_91b){
return _91a("dijit.form.VerticalRuleLabels",_91b,{templateString:"<div class=\"dijitRuleContainer dijitRuleContainerV dijitRuleLabelsContainer dijitRuleLabelsContainerV\"></div>",_positionPrefix:"<div class=\"dijitRuleLabelContainer dijitRuleLabelContainerV\" style=\"top:",_labelPrefix:"\"><span class=\"dijitRuleLabel dijitRuleLabelV\">",_calcPosition:function(pos){
return 100-pos;
},_isHorizontal:false});
});
},"dijit/Declaration":function(){
define(["dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/_base/lang","dojo/parser","dojo/query","./_Widget","./_TemplatedMixin","./_WidgetsInTemplateMixin","dojo/NodeList-dom"],function(_91c,_91d,_91e,lang,_91f,_920,_921,_922,_923){
return _91e("dijit.Declaration",_921,{_noScript:true,stopParser:true,widgetClass:"",defaults:null,mixins:[],buildRendering:function(){
var src=this.srcNodeRef.parentNode.removeChild(this.srcNodeRef),_924=_920("> script[type^='dojo/method']",src).orphan(),_925=_920("> script[type^='dojo/connect']",src).orphan(),_926=src.nodeName;
var _927=this.defaults||{};
_91c.forEach(_924,function(s){
var evt=s.getAttribute("event")||s.getAttribute("data-dojo-event"),func=_91f._functionFromScript(s);
if(evt){
_927[evt]=func;
}else{
_925.push(s);
}
});
if(this.mixins.length){
this.mixins=_91c.map(this.mixins,function(name){
return lang.getObject(name);
});
}else{
this.mixins=[_921,_922,_923];
}
_927._skipNodeCache=true;
_927.templateString="<"+_926+" class='"+src.className+"'"+" data-dojo-attach-point='"+(src.getAttribute("data-dojo-attach-point")||src.getAttribute("dojoAttachPoint")||"")+"' data-dojo-attach-event='"+(src.getAttribute("data-dojo-attach-event")||src.getAttribute("dojoAttachEvent")||"")+"' >"+src.innerHTML.replace(/\%7B/g,"{").replace(/\%7D/g,"}")+"</"+_926+">";
var wc=_91e(this.widgetClass,this.mixins,_927);
_91c.forEach(_925,function(s){
var evt=s.getAttribute("event")||s.getAttribute("data-dojo-event")||"postscript",func=_91f._functionFromScript(s);
_91d.connect(wc.prototype,evt,func);
});
}});
});
},"dijit/MenuSeparator":function(){
require({cache:{"url:dijit/templates/MenuSeparator.html":"<tr class=\"dijitMenuSeparator\">\n\t<td class=\"dijitMenuSeparatorIconCell\">\n\t\t<div class=\"dijitMenuSeparatorTop\"></div>\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\n\t</td>\n\t<td colspan=\"3\" class=\"dijitMenuSeparatorLabelCell\">\n\t\t<div class=\"dijitMenuSeparatorTop dijitMenuSeparatorLabel\"></div>\n\t\t<div class=\"dijitMenuSeparatorBottom\"></div>\n\t</td>\n</tr>"}});
define("dijit/MenuSeparator",["dojo/_base/declare","dojo/dom","./_WidgetBase","./_TemplatedMixin","./_Contained","dojo/text!./templates/MenuSeparator.html"],function(_928,dom,_929,_92a,_92b,_92c){
return _928("dijit.MenuSeparator",[_929,_92a,_92b],{templateString:_92c,buildRendering:function(){
this.inherited(arguments);
dom.setSelectable(this.domNode,false);
},isFocusable:function(){
return false;
}});
});
},"dijit/form/_ComboBoxMenu":function(){
define(["dojo/_base/declare","dojo/dom-class","dojo/dom-style","dojo/keys","../_WidgetBase","../_TemplatedMixin","./_ComboBoxMenuMixin","./_ListMouseMixin"],function(_92d,_92e,_92f,keys,_930,_931,_932,_933){
return _92d("dijit.form._ComboBoxMenu",[_930,_931,_933,_932],{templateString:"<div class='dijitReset dijitMenu' data-dojo-attach-point='containerNode' style='overflow: auto; overflow-x: hidden;'>"+"<div class='dijitMenuItem dijitMenuPreviousButton' data-dojo-attach-point='previousButton' role='option'></div>"+"<div class='dijitMenuItem dijitMenuNextButton' data-dojo-attach-point='nextButton' role='option'></div>"+"</div>",baseClass:"dijitComboBoxMenu",postCreate:function(){
this.inherited(arguments);
if(!this.isLeftToRight()){
_92e.add(this.previousButton,"dijitMenuItemRtl");
_92e.add(this.nextButton,"dijitMenuItemRtl");
}
},_createMenuItem:function(){
var item=this.ownerDocument.createElement("div");
item.className="dijitReset dijitMenuItem"+(this.isLeftToRight()?"":" dijitMenuItemRtl");
item.setAttribute("role","option");
return item;
},onHover:function(node){
_92e.add(node,"dijitMenuItemHover");
},onUnhover:function(node){
_92e.remove(node,"dijitMenuItemHover");
},onSelect:function(node){
_92e.add(node,"dijitMenuItemSelected");
},onDeselect:function(node){
_92e.remove(node,"dijitMenuItemSelected");
},_page:function(up){
var _934=0;
var _935=this.domNode.scrollTop;
var _936=_92f.get(this.domNode,"height");
if(!this.getHighlightedOption()){
this.selectNextNode();
}
while(_934<_936){
var _937=this.getHighlightedOption();
if(up){
if(!_937.previousSibling||_937.previousSibling.style.display=="none"){
break;
}
this.selectPreviousNode();
}else{
if(!_937.nextSibling||_937.nextSibling.style.display=="none"){
break;
}
this.selectNextNode();
}
var _938=this.domNode.scrollTop;
_934+=(_938-_935)*(up?-1:1);
_935=_938;
}
},handleKey:function(evt){
switch(evt.keyCode){
case keys.DOWN_ARROW:
this.selectNextNode();
return false;
case keys.PAGE_DOWN:
this._page(false);
return false;
case keys.UP_ARROW:
this.selectPreviousNode();
return false;
case keys.PAGE_UP:
this._page(true);
return false;
default:
return true;
}
}});
});
},"url:dijit/layout/templates/ScrollingTabController.html":"<div class=\"dijitTabListContainer-${tabPosition}\" style=\"visibility:hidden\">\n\t<div data-dojo-type=\"dijit.layout._ScrollingTabControllerMenuButton\"\n\t\t\tclass=\"tabStripButton-${tabPosition}\"\n\t\t\tid=\"${id}_menuBtn\"\n\t\t\tdata-dojo-props=\"containerId: '${containerId}', iconClass: 'dijitTabStripMenuIcon',\n\t\t\t\t\tdropDownPosition: ['below-alt', 'above-alt']\"\n\t\t\tdata-dojo-attach-point=\"_menuBtn\" showLabel=\"false\" title=\"\">&#9660;</div>\n\t<div data-dojo-type=\"dijit.layout._ScrollingTabControllerButton\"\n\t\t\tclass=\"tabStripButton-${tabPosition}\"\n\t\t\tid=\"${id}_leftBtn\"\n\t\t\tdata-dojo-props=\"iconClass:'dijitTabStripSlideLeftIcon', showLabel:false, title:''\"\n\t\t\tdata-dojo-attach-point=\"_leftBtn\" data-dojo-attach-event=\"onClick: doSlideLeft\">&#9664;</div>\n\t<div data-dojo-type=\"dijit.layout._ScrollingTabControllerButton\"\n\t\t\tclass=\"tabStripButton-${tabPosition}\"\n\t\t\tid=\"${id}_rightBtn\"\n\t\t\tdata-dojo-props=\"iconClass:'dijitTabStripSlideRightIcon', showLabel:false, title:''\"\n\t\t\tdata-dojo-attach-point=\"_rightBtn\" data-dojo-attach-event=\"onClick: doSlideRight\">&#9654;</div>\n\t<div class='dijitTabListWrapper' data-dojo-attach-point='tablistWrapper'>\n\t\t<div role='tablist' data-dojo-attach-event='onkeypress:onkeypress'\n\t\t\t\tdata-dojo-attach-point='containerNode' class='nowrapTabStrip'></div>\n\t</div>\n</div>","dijit/Dialog":function(){
require({cache:{"url:dijit/templates/Dialog.html":"<div class=\"dijitDialog\" role=\"dialog\" aria-labelledby=\"${id}_title\">\n\t<div data-dojo-attach-point=\"titleBar\" class=\"dijitDialogTitleBar\">\n\t\t<span data-dojo-attach-point=\"titleNode\" class=\"dijitDialogTitle\" id=\"${id}_title\"\n\t\t\t\trole=\"header\" level=\"1\"></span>\n\t\t<span data-dojo-attach-point=\"closeButtonNode\" class=\"dijitDialogCloseIcon\" data-dojo-attach-event=\"ondijitclick: onCancel\" title=\"${buttonCancel}\" role=\"button\" tabIndex=\"-1\">\n\t\t\t<span data-dojo-attach-point=\"closeText\" class=\"closeText\" title=\"${buttonCancel}\">x</span>\n\t\t</span>\n\t</div>\n\t<div data-dojo-attach-point=\"containerNode\" class=\"dijitDialogPaneContent\"></div>\n</div>\n"}});
define("dijit/Dialog",["require","dojo/_base/array","dojo/_base/connect","dojo/_base/declare","dojo/_base/Deferred","dojo/dom","dojo/dom-class","dojo/dom-geometry","dojo/dom-style","dojo/_base/event","dojo/_base/fx","dojo/i18n","dojo/keys","dojo/_base/lang","dojo/on","dojo/ready","dojo/sniff","dojo/window","dojo/dnd/Moveable","dojo/dnd/TimedMoveable","./focus","./_base/manager","./_Widget","./_TemplatedMixin","./_CssStateMixin","./form/_FormMixin","./_DialogMixin","./DialogUnderlay","./layout/ContentPane","dojo/text!./templates/Dialog.html","./main","dojo/i18n!./nls/common"],function(_939,_93a,_93b,_93c,_93d,dom,_93e,_93f,_940,_941,fx,i18n,keys,lang,on,_942,has,_943,_944,_945,_946,_947,_948,_949,_94a,_94b,_94c,_94d,_94e,_94f,_950){
var _951=_93c("dijit._DialogBase",[_949,_94b,_94c,_94a],{templateString:_94f,baseClass:"dijitDialog",cssStateNodes:{closeButtonNode:"dijitDialogCloseIcon"},_setTitleAttr:[{node:"titleNode",type:"innerHTML"},{node:"titleBar",type:"attribute"}],open:false,duration:_947.defaultDuration,refocus:true,autofocus:true,_firstFocusItem:null,_lastFocusItem:null,doLayout:false,draggable:true,_setDraggableAttr:function(val){
this._set("draggable",val);
},"aria-describedby":"",maxRatio:0.9,postMixInProperties:function(){
var _952=i18n.getLocalization("dijit","common");
lang.mixin(this,_952);
this.inherited(arguments);
},postCreate:function(){
_940.set(this.domNode,{display:"none",position:"absolute"});
this.ownerDocumentBody.appendChild(this.domNode);
this.inherited(arguments);
this.connect(this,"onExecute","hide");
this.connect(this,"onCancel","hide");
this._modalconnects=[];
},onLoad:function(){
this._position();
if(this.autofocus&&_953.isTop(this)){
this._getFocusItems(this.domNode);
_946.focus(this._firstFocusItem);
}
this.inherited(arguments);
},_endDrag:function(){
var _954=_93f.position(this.domNode),_955=_943.getBox(this.ownerDocument);
_954.y=Math.min(Math.max(_954.y,0),(_955.h-_954.h));
_954.x=Math.min(Math.max(_954.x,0),(_955.w-_954.w));
this._relativePosition=_954;
this._position();
},_setup:function(){
var node=this.domNode;
if(this.titleBar&&this.draggable){
this._moveable=new ((has("ie")==6)?_945:_944)(node,{handle:this.titleBar});
this.connect(this._moveable,"onMoveStop","_endDrag");
}else{
_93e.add(node,"dijitDialogFixed");
}
this.underlayAttrs={dialogId:this.id,"class":_93a.map(this["class"].split(/\s/),function(s){
return s+"_underlay";
}).join(" "),ownerDocument:this.ownerDocument};
},_size:function(){
this._checkIfSingleChild();
if(this._singleChild){
if(typeof this._singleChildOriginalStyle!="undefined"){
this._singleChild.domNode.style.cssText=this._singleChildOriginalStyle;
delete this._singleChildOriginalStyle;
}
}else{
_940.set(this.containerNode,{width:"auto",height:"auto"});
}
var bb=_93f.position(this.domNode);
var _956=_943.getBox(this.ownerDocument);
_956.w*=this.maxRatio;
_956.h*=this.maxRatio;
if(bb.w>=_956.w||bb.h>=_956.h){
var _957=_93f.position(this.containerNode),w=Math.min(bb.w,_956.w)-(bb.w-_957.w),h=Math.min(bb.h,_956.h)-(bb.h-_957.h);
if(this._singleChild&&this._singleChild.resize){
if(typeof this._singleChildOriginalStyle=="undefined"){
this._singleChildOriginalStyle=this._singleChild.domNode.style.cssText;
}
this._singleChild.resize({w:w,h:h});
}else{
_940.set(this.containerNode,{width:w+"px",height:h+"px",overflow:"auto",position:"relative"});
}
}else{
if(this._singleChild&&this._singleChild.resize){
this._singleChild.resize();
}
}
},_position:function(){
if(!_93e.contains(this.ownerDocumentBody,"dojoMove")){
var node=this.domNode,_958=_943.getBox(this.ownerDocument),p=this._relativePosition,bb=p?null:_93f.position(node),l=Math.floor(_958.l+(p?p.x:(_958.w-bb.w)/2)),t=Math.floor(_958.t+(p?p.y:(_958.h-bb.h)/2));
_940.set(node,{left:l+"px",top:t+"px"});
}
},_onKey:function(evt){
if(evt.charOrCode){
var node=evt.target;
if(evt.charOrCode===keys.TAB){
this._getFocusItems(this.domNode);
}
var _959=(this._firstFocusItem==this._lastFocusItem);
if(node==this._firstFocusItem&&evt.shiftKey&&evt.charOrCode===keys.TAB){
if(!_959){
_946.focus(this._lastFocusItem);
}
_941.stop(evt);
}else{
if(node==this._lastFocusItem&&evt.charOrCode===keys.TAB&&!evt.shiftKey){
if(!_959){
_946.focus(this._firstFocusItem);
}
_941.stop(evt);
}else{
while(node){
if(node==this.domNode||_93e.contains(node,"dijitPopup")){
if(evt.charOrCode==keys.ESCAPE){
this.onCancel();
}else{
return;
}
}
node=node.parentNode;
}
if(evt.charOrCode!==keys.TAB){
_941.stop(evt);
}else{
if(!has("opera")){
try{
this._firstFocusItem.focus();
}
catch(e){
}
}
}
}
}
}
},show:function(){
if(this.open){
return;
}
if(!this._started){
this.startup();
}
if(!this._alreadyInitialized){
this._setup();
this._alreadyInitialized=true;
}
if(this._fadeOutDeferred){
this._fadeOutDeferred.cancel();
}
var win=_943.get(this.ownerDocument);
this._modalconnects.push(on(win,"scroll",lang.hitch(this,"resize")));
this._modalconnects.push(on(this.domNode,_93b._keypress,lang.hitch(this,"_onKey")));
_940.set(this.domNode,{opacity:0,display:""});
this._set("open",true);
this._onShow();
this._size();
this._position();
var _95a;
this._fadeInDeferred=new _93d(lang.hitch(this,function(){
_95a.stop();
delete this._fadeInDeferred;
}));
_95a=fx.fadeIn({node:this.domNode,duration:this.duration,beforeBegin:lang.hitch(this,function(){
_953.show(this,this.underlayAttrs);
}),onEnd:lang.hitch(this,function(){
if(this.autofocus&&_953.isTop(this)){
this._getFocusItems(this.domNode);
_946.focus(this._firstFocusItem);
}
this._fadeInDeferred.resolve(true);
delete this._fadeInDeferred;
})}).play();
return this._fadeInDeferred;
},hide:function(){
if(!this._alreadyInitialized||!this.open){
return;
}
if(this._fadeInDeferred){
this._fadeInDeferred.cancel();
}
var _95b;
this._fadeOutDeferred=new _93d(lang.hitch(this,function(){
_95b.stop();
delete this._fadeOutDeferred;
}));
this._fadeOutDeferred.then(lang.hitch(this,"onHide"));
_95b=fx.fadeOut({node:this.domNode,duration:this.duration,onEnd:lang.hitch(this,function(){
this.domNode.style.display="none";
_953.hide(this);
this._fadeOutDeferred.resolve(true);
delete this._fadeOutDeferred;
})}).play();
if(this._scrollConnected){
this._scrollConnected=false;
}
var h;
while(h=this._modalconnects.pop()){
h.remove();
}
if(this._relativePosition){
delete this._relativePosition;
}
this._set("open",false);
return this._fadeOutDeferred;
},resize:function(){
if(this.domNode.style.display!="none"){
if(_94d._singleton){
_94d._singleton.layout();
}
this._position();
this._size();
}
},destroy:function(){
if(this._fadeInDeferred){
this._fadeInDeferred.cancel();
}
if(this._fadeOutDeferred){
this._fadeOutDeferred.cancel();
}
if(this._moveable){
this._moveable.destroy();
}
var h;
while(h=this._modalconnects.pop()){
h.remove();
}
_953.hide(this);
this.inherited(arguments);
}});
var _95c=_93c("dijit.Dialog",[_94e,_951],{});
_95c._DialogBase=_951;
var _953=_95c._DialogLevelManager={_beginZIndex:950,show:function(_95d,_95e){
ds[ds.length-1].focus=_946.curNode;
var _95f=_94d._singleton;
if(!_95f||_95f._destroyed){
_95f=_950._underlay=_94d._singleton=new _94d(_95e);
}else{
_95f.set(_95d.underlayAttrs);
}
var _960=ds[ds.length-1].dialog?ds[ds.length-1].zIndex+2:_95c._DialogLevelManager._beginZIndex;
if(ds.length==1){
_95f.show();
}
_940.set(_94d._singleton.domNode,"zIndex",_960-1);
_940.set(_95d.domNode,"zIndex",_960);
ds.push({dialog:_95d,underlayAttrs:_95e,zIndex:_960});
},hide:function(_961){
if(ds[ds.length-1].dialog==_961){
ds.pop();
var pd=ds[ds.length-1];
if(!_94d._singleton._destroyed){
if(ds.length==1){
_94d._singleton.hide();
}else{
_940.set(_94d._singleton.domNode,"zIndex",pd.zIndex-1);
_94d._singleton.set(pd.underlayAttrs);
}
}
if(_961.refocus){
var _962=pd.focus;
if(pd.dialog&&(!_962||!dom.isDescendant(_962,pd.dialog.domNode))){
pd.dialog._getFocusItems(pd.dialog.domNode);
_962=pd.dialog._firstFocusItem;
}
if(_962){
try{
_962.focus();
}
catch(e){
}
}
}
}else{
var idx=_93a.indexOf(_93a.map(ds,function(elem){
return elem.dialog;
}),_961);
if(idx!=-1){
ds.splice(idx,1);
}
}
},isTop:function(_963){
return ds[ds.length-1].dialog==_963;
}};
var ds=_95c._dialogStack=[{dialog:null,focus:null,underlayAttrs:null}];
if(has("dijit-legacy-requires")){
_942(0,function(){
var _964=["dijit/TooltipDialog"];
_939(_964);
});
}
return _95c;
});
},"dijit/form/MultiSelect":function(){
define("dijit/form/MultiSelect",["dojo/_base/array","dojo/_base/declare","dojo/dom-geometry","dojo/query","./_FormValueWidget"],function(_965,_966,_967,_968,_969){
return _966("dijit.form.MultiSelect",_969,{size:7,templateString:"<select multiple='true' ${!nameAttrSetting} data-dojo-attach-point='containerNode,focusNode' data-dojo-attach-event='onchange: _onChange'></select>",addSelected:function(_96a){
_96a.getSelected().forEach(function(n){
if(this.restoreOriginalText){
n.text=this.enforceTextDirWithUcc(this.restoreOriginalText(n),n.text);
}
this.containerNode.appendChild(n);
this.domNode.scrollTop=this.domNode.offsetHeight;
var _96b=_96a.domNode.scrollTop;
_96a.domNode.scrollTop=0;
_96a.domNode.scrollTop=_96b;
},this);
this._set("value",this.get("value"));
},getSelected:function(){
return _968("option",this.containerNode).filter(function(n){
return n.selected;
});
},_getValueAttr:function(){
return _965.map(this.getSelected(),function(n){
return n.value;
});
},multiple:true,_setValueAttr:function(_96c,_96d){
_968("option",this.containerNode).forEach(function(n){
n.selected=(_965.indexOf(_96c,n.value)!=-1);
});
this.inherited(arguments);
},invertSelection:function(_96e){
var val=[];
_968("option",this.containerNode).forEach(function(n){
if(!n.selected){
val.push(n.value);
}
});
this._setValueAttr(val,!(_96e===false||_96e==null));
},_onChange:function(){
this._handleOnChange(this.get("value"),true);
},resize:function(size){
if(size){
_967.setMarginBox(this.domNode,size);
}
},postCreate:function(){
this._set("value",this.get("value"));
this.inherited(arguments);
},_setTextDirAttr:function(_96f){
if((this.textDir!=_96f||!this._created)&&this.enforceTextDirWithUcc){
this._set("textDir",_96f);
_968("option",this.containerNode).forEach(function(_970){
if(!this._created&&_970.value===_970.text){
_970.value=_970.text;
}
_970.text=this.enforceTextDirWithUcc(_970,_970.originalText||_970.text);
},this);
}
}});
});
},"dijit/form/_DateTimeTextBox":function(){
define(["dojo/date","dojo/date/locale","dojo/date/stamp","dojo/_base/declare","dojo/_base/lang","./RangeBoundTextBox","../_HasDropDown","dojo/text!./templates/DropDownBox.html"],function(date,_971,_972,_973,lang,_974,_975,_976){
new Date("X");
var _977=_973("dijit.form._DateTimeTextBox",[_974,_975],{templateString:_976,hasDownArrow:true,cssStateNodes:{"_buttonNode":"dijitDownArrowButton"},pattern:_971.regexp,datePackage:"",postMixInProperties:function(){
this.inherited(arguments);
this._set("type","text");
},compare:function(val1,val2){
var _978=this._isInvalidDate(val1);
var _979=this._isInvalidDate(val2);
return _978?(_979?0:-1):(_979?1:date.compare(val1,val2,this._selector));
},forceWidth:true,format:function(_97a,_97b){
if(!_97a){
return "";
}
return this.dateLocaleModule.format(_97a,_97b);
},"parse":function(_97c,_97d){
return this.dateLocaleModule.parse(_97c,_97d)||(this._isEmpty(_97c)?null:undefined);
},serialize:function(val,_97e){
if(val.toGregorian){
val=val.toGregorian();
}
return _972.toISOString(val,_97e);
},dropDownDefaultValue:new Date(),value:new Date(""),_blankValue:null,popupClass:"",_selector:"",constructor:function(_97f){
this.dateModule=_97f.datePackage?lang.getObject(_97f.datePackage,false):date;
this.dateClassObj=this.dateModule.Date||Date;
this.dateLocaleModule=_97f.datePackage?lang.getObject(_97f.datePackage+".locale",false):_971;
this._set("pattern",this.dateLocaleModule.regexp);
this._invalidDate=this.constructor.prototype.value.toString();
},buildRendering:function(){
this.inherited(arguments);
if(!this.hasDownArrow){
this._buttonNode.style.display="none";
}
if(!this.hasDownArrow){
this._buttonNode=this.domNode;
this.baseClass+=" dijitComboBoxOpenOnClick";
}
},_setConstraintsAttr:function(_980){
_980.selector=this._selector;
_980.fullYear=true;
var _981=_972.fromISOString;
if(typeof _980.min=="string"){
_980.min=_981(_980.min);
}
if(typeof _980.max=="string"){
_980.max=_981(_980.max);
}
this.inherited(arguments);
},_isInvalidDate:function(_982){
return !_982||isNaN(_982)||typeof _982!="object"||_982.toString()==this._invalidDate;
},_setValueAttr:function(_983,_984,_985){
if(_983!==undefined){
if(typeof _983=="string"){
_983=_972.fromISOString(_983);
}
if(this._isInvalidDate(_983)){
_983=null;
}
if(_983 instanceof Date&&!(this.dateClassObj instanceof Date)){
_983=new this.dateClassObj(_983);
}
}
this.inherited(arguments);
if(this.value instanceof Date){
this.filterString="";
}
if(this.dropDown){
this.dropDown.set("value",_983,false);
}
},_set:function(attr,_986){
if(attr=="value"&&this.value instanceof Date&&this.compare(_986,this.value)==0){
return;
}
this.inherited(arguments);
},_setDropDownDefaultValueAttr:function(val){
if(this._isInvalidDate(val)){
val=new this.dateClassObj();
}
this.dropDownDefaultValue=val;
},openDropDown:function(_987){
if(this.dropDown){
this.dropDown.destroy();
}
var _988=lang.isString(this.popupClass)?lang.getObject(this.popupClass,false):this.popupClass,_989=this,_98a=this.get("value");
this.dropDown=new _988({onChange:function(_98b){
_989.set("value",_98b,true);
},id:this.id+"_popup",dir:_989.dir,lang:_989.lang,value:_98a,currentFocus:!this._isInvalidDate(_98a)?_98a:this.dropDownDefaultValue,constraints:_989.constraints,filterString:_989.filterString,datePackage:_989.params.datePackage,isDisabledDate:function(date){
return !_989.rangeCheck(date,_989.constraints);
}});
this.inherited(arguments);
},_getDisplayedValueAttr:function(){
return this.textbox.value;
},_setDisplayedValueAttr:function(_98c,_98d){
this._setValueAttr(this.parse(_98c,this.constraints),_98d,_98c);
}});
return _977;
});
},"dijit/form/_ToggleButtonMixin":function(){
define(["dojo/_base/declare","dojo/dom-attr"],function(_98e,_98f){
return _98e("dijit.form._ToggleButtonMixin",null,{checked:false,_aria_attr:"aria-pressed",_onClick:function(evt){
var _990=this.checked;
this._set("checked",!_990);
var ret=this.inherited(arguments);
this.set("checked",ret?this.checked:_990);
return ret;
},_setCheckedAttr:function(_991,_992){
this._set("checked",_991);
_98f.set(this.focusNode||this.domNode,"checked",_991);
(this.focusNode||this.domNode).setAttribute(this._aria_attr,_991?"true":"false");
this._handleOnChange(_991,_992);
},reset:function(){
this._hasBeenBlurred=false;
this.set("checked",this.params.checked||false);
}});
});
},"dijit/Calendar":function(){
define(["dojo/_base/array","dojo/date","dojo/date/locale","dojo/_base/declare","dojo/dom-attr","dojo/dom-class","dojo/_base/event","dojo/_base/kernel","dojo/keys","dojo/_base/lang","dojo/sniff","./CalendarLite","./_Widget","./_CssStateMixin","./_TemplatedMixin","./form/DropDownButton"],function(_993,date,_994,_995,_996,_997,_998,_999,keys,lang,has,_99a,_99b,_99c,_99d,_99e){
var _99f=_995("dijit.Calendar",[_99a,_99b,_99c],{cssStateNodes:{"decrementMonth":"dijitCalendarArrow","incrementMonth":"dijitCalendarArrow","previousYearLabelNode":"dijitCalendarPreviousYear","nextYearLabelNode":"dijitCalendarNextYear"},setValue:function(_9a0){
_999.deprecated("dijit.Calendar:setValue() is deprecated.  Use set('value', ...) instead.","","2.0");
this.set("value",_9a0);
},_createMonthWidget:function(){
return new _99f._MonthDropDownButton({id:this.id+"_mddb",tabIndex:-1,onMonthSelect:lang.hitch(this,"_onMonthSelect"),lang:this.lang,dateLocaleModule:this.dateLocaleModule},this.monthNode);
},postCreate:function(){
this.inherited(arguments);
this.connect(this.domNode,"onkeydown","_onKeyDown");
this.connect(this.dateRowsNode,"onmouseover","_onDayMouseOver");
this.connect(this.dateRowsNode,"onmouseout","_onDayMouseOut");
this.connect(this.dateRowsNode,"onmousedown","_onDayMouseDown");
this.connect(this.dateRowsNode,"onmouseup","_onDayMouseUp");
},_onMonthSelect:function(_9a1){
var date=new this.dateClassObj(this.currentFocus);
date.setDate(1);
date.setMonth(_9a1);
var _9a2=this.dateModule.getDaysInMonth(date);
var _9a3=this.currentFocus.getDate();
date.setDate(Math.min(_9a3,_9a2));
this._setCurrentFocusAttr(date);
},_onDayMouseOver:function(evt){
var node=_997.contains(evt.target,"dijitCalendarDateLabel")?evt.target.parentNode:evt.target;
if(node&&((node.dijitDateValue&&!_997.contains(node,"dijitCalendarDisabledDate"))||node==this.previousYearLabelNode||node==this.nextYearLabelNode)){
_997.add(node,"dijitCalendarHoveredDate");
this._currentNode=node;
}
},_onDayMouseOut:function(evt){
if(!this._currentNode){
return;
}
if(evt.relatedTarget&&evt.relatedTarget.parentNode==this._currentNode){
return;
}
var cls="dijitCalendarHoveredDate";
if(_997.contains(this._currentNode,"dijitCalendarActiveDate")){
cls+=" dijitCalendarActiveDate";
}
_997.remove(this._currentNode,cls);
this._currentNode=null;
},_onDayMouseDown:function(evt){
var node=evt.target.parentNode;
if(node&&node.dijitDateValue&&!_997.contains(node,"dijitCalendarDisabledDate")){
_997.add(node,"dijitCalendarActiveDate");
this._currentNode=node;
}
},_onDayMouseUp:function(evt){
var node=evt.target.parentNode;
if(node&&node.dijitDateValue){
_997.remove(node,"dijitCalendarActiveDate");
}
},handleKey:function(evt){
var _9a4=-1,_9a5,_9a6=this.currentFocus;
switch(evt.keyCode){
case keys.RIGHT_ARROW:
_9a4=1;
case keys.LEFT_ARROW:
_9a5="day";
if(!this.isLeftToRight()){
_9a4*=-1;
}
break;
case keys.DOWN_ARROW:
_9a4=1;
case keys.UP_ARROW:
_9a5="week";
break;
case keys.PAGE_DOWN:
_9a4=1;
case keys.PAGE_UP:
_9a5=evt.ctrlKey||evt.altKey?"year":"month";
break;
case keys.END:
_9a6=this.dateModule.add(_9a6,"month",1);
_9a5="day";
case keys.HOME:
_9a6=new this.dateClassObj(_9a6);
_9a6.setDate(1);
break;
case keys.ENTER:
case keys.SPACE:
this.set("value",this.currentFocus);
break;
default:
return true;
}
if(_9a5){
_9a6=this.dateModule.add(_9a6,_9a5,_9a4);
}
this._setCurrentFocusAttr(_9a6);
return false;
},_onKeyDown:function(evt){
if(!this.handleKey(evt)){
_998.stop(evt);
}
},onValueSelected:function(){
},onChange:function(_9a7){
this.onValueSelected(_9a7);
},getClassForDate:function(){
}});
_99f._MonthDropDownButton=_995("dijit.Calendar._MonthDropDownButton",_99e,{onMonthSelect:function(){
},postCreate:function(){
this.inherited(arguments);
this.dropDown=new _99f._MonthDropDown({id:this.id+"_mdd",onChange:this.onMonthSelect});
},_setMonthAttr:function(_9a8){
var _9a9=this.dateLocaleModule.getNames("months","wide","standAlone",this.lang,_9a8);
this.dropDown.set("months",_9a9);
this.containerNode.innerHTML=(has("ie")==6?"":"<div class='dijitSpacer'>"+this.dropDown.domNode.innerHTML+"</div>")+"<div class='dijitCalendarMonthLabel dijitCalendarCurrentMonthLabel'>"+_9a9[_9a8.getMonth()]+"</div>";
}});
_99f._MonthDropDown=_995("dijit.Calendar._MonthDropDown",[_99b,_99d],{months:[],templateString:"<div class='dijitCalendarMonthMenu dijitMenu' "+"data-dojo-attach-event='onclick:_onClick,onmouseover:_onMenuHover,onmouseout:_onMenuHover'></div>",_setMonthsAttr:function(_9aa){
this.domNode.innerHTML=_993.map(_9aa,function(_9ab,idx){
return _9ab?"<div class='dijitCalendarMonthLabel' month='"+idx+"'>"+_9ab+"</div>":"";
}).join("");
},_onClick:function(evt){
this.onChange(_996.get(evt.target,"month"));
},onChange:function(){
},_onMenuHover:function(evt){
_997.toggle(evt.target,"dijitCalendarMonthLabelHover",evt.type=="mouseover");
}});
return _99f;
});
},"url:dijit/form/templates/Select.html":"<table class=\"dijit dijitReset dijitInline dijitLeft\"\n\tdata-dojo-attach-point=\"_buttonNode,tableNode,focusNode\" cellspacing='0' cellpadding='0'\n\trole=\"listbox\" aria-haspopup=\"true\"\n\t><tbody role=\"presentation\"><tr role=\"presentation\"\n\t\t><td class=\"dijitReset dijitStretch dijitButtonContents\" role=\"presentation\"\n\t\t\t><div class=\"dijitReset dijitInputField dijitButtonText\"  data-dojo-attach-point=\"containerNode,_popupStateNode\" role=\"presentation\"></div\n\t\t\t><div class=\"dijitReset dijitValidationContainer\"\n\t\t\t\t><input class=\"dijitReset dijitInputField dijitValidationIcon dijitValidationInner\" value=\"&#935; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t/></div\n\t\t\t><input type=\"hidden\" ${!nameAttrSetting} data-dojo-attach-point=\"valueNode\" value=\"${value}\" aria-hidden=\"true\"\n\t\t/></td\n\t\t><td class=\"dijitReset dijitRight dijitButtonNode dijitArrowButton dijitDownArrowButton dijitArrowButtonContainer\"\n\t\t\tdata-dojo-attach-point=\"titleNode\" role=\"presentation\"\n\t\t\t><input class=\"dijitReset dijitInputField dijitArrowButtonInner\" value=\"&#9660; \" type=\"text\" tabIndex=\"-1\" readonly=\"readonly\" role=\"presentation\"\n\t\t\t\t${_buttonInputDisabled}\n\t\t/></td\n\t></tr></tbody\n></table>\n","dijit/_editor/selection":function(){
define(["dojo/dom","dojo/_base/lang","dojo/sniff","dojo/_base/window","../main"],function(dom,lang,has,win,_9ac){
var _9ad={getType:function(){
if(win.doc.getSelection){
var _9ae="text";
var oSel;
try{
oSel=win.global.getSelection();
}
catch(e){
}
if(oSel&&oSel.rangeCount==1){
var _9af=oSel.getRangeAt(0);
if((_9af.startContainer==_9af.endContainer)&&((_9af.endOffset-_9af.startOffset)==1)&&(_9af.startContainer.nodeType!=3)){
_9ae="control";
}
}
return _9ae;
}else{
return win.doc.selection.type.toLowerCase();
}
},getSelectedText:function(){
if(win.doc.getSelection){
var _9b0=win.global.getSelection();
return _9b0?_9b0.toString():"";
}else{
if(_9ac._editor.selection.getType()=="control"){
return null;
}
return win.doc.selection.createRange().text;
}
},getSelectedHtml:function(){
if(win.doc.getSelection){
var _9b1=win.global.getSelection();
if(_9b1&&_9b1.rangeCount){
var i;
var html="";
for(i=0;i<_9b1.rangeCount;i++){
var frag=_9b1.getRangeAt(i).cloneContents();
var div=win.doc.createElement("div");
div.appendChild(frag);
html+=div.innerHTML;
}
return html;
}
return null;
}else{
if(_9ac._editor.selection.getType()=="control"){
return null;
}
return win.doc.selection.createRange().htmlText;
}
},getSelectedElement:function(){
if(_9ac._editor.selection.getType()=="control"){
if(win.doc.getSelection){
var _9b2=win.global.getSelection();
return _9b2.anchorNode.childNodes[_9b2.anchorOffset];
}else{
var _9b3=win.doc.selection.createRange();
if(_9b3&&_9b3.item){
return win.doc.selection.createRange().item(0);
}
}
}
return null;
},getParentElement:function(){
if(_9ac._editor.selection.getType()=="control"){
var p=this.getSelectedElement();
if(p){
return p.parentNode;
}
}else{
if(win.doc.getSelection){
var _9b4=win.global.getSelection();
if(_9b4){
var node=_9b4.anchorNode;
while(node&&(node.nodeType!=1)){
node=node.parentNode;
}
return node;
}
}else{
var r=win.doc.selection.createRange();
r.collapse(true);
return r.parentElement();
}
}
return null;
},hasAncestorElement:function(_9b5){
return this.getAncestorElement.apply(this,arguments)!=null;
},getAncestorElement:function(_9b6){
var node=this.getSelectedElement()||this.getParentElement();
return this.getParentOfType(node,arguments);
},isTag:function(node,tags){
if(node&&node.tagName){
var _9b7=node.tagName.toLowerCase();
for(var i=0;i<tags.length;i++){
var _9b8=String(tags[i]).toLowerCase();
if(_9b7==_9b8){
return _9b8;
}
}
}
return "";
},getParentOfType:function(node,tags){
while(node){
if(this.isTag(node,tags).length){
return node;
}
node=node.parentNode;
}
return null;
},collapse:function(_9b9){
if(win.doc.getSelection){
var _9ba=win.global.getSelection();
if(_9ba.removeAllRanges){
if(_9b9){
_9ba.collapseToStart();
}else{
_9ba.collapseToEnd();
}
}else{
_9ba.collapse(_9b9);
}
}else{
var _9bb=win.doc.selection.createRange();
_9bb.collapse(_9b9);
_9bb.select();
}
},remove:function(){
var sel=win.doc.selection;
if(win.doc.getSelection){
sel=win.global.getSelection();
sel.deleteFromDocument();
return sel;
}else{
if(sel.type.toLowerCase()!="none"){
sel.clear();
}
return sel;
}
},selectElementChildren:function(_9bc,_9bd){
var doc=win.doc;
var _9be;
_9bc=dom.byId(_9bc);
if(win.doc.getSelection){
var _9bf=win.global.getSelection();
if(has("opera")){
if(_9bf.rangeCount){
_9be=_9bf.getRangeAt(0);
}else{
_9be=doc.createRange();
}
_9be.setStart(_9bc,0);
_9be.setEnd(_9bc,(_9bc.nodeType==3)?_9bc.length:_9bc.childNodes.length);
_9bf.addRange(_9be);
}else{
_9bf.selectAllChildren(_9bc);
}
}else{
_9be=_9bc.ownerDocument.body.createTextRange();
_9be.moveToElementText(_9bc);
if(!_9bd){
try{
_9be.select();
}
catch(e){
}
}
}
},selectElement:function(_9c0,_9c1){
var _9c2;
_9c0=dom.byId(_9c0);
var doc=_9c0.ownerDocument;
var _9c3=win.global;
if(doc.getSelection){
var _9c4=_9c3.getSelection();
_9c2=doc.createRange();
if(_9c4.removeAllRanges){
if(has("opera")){
if(_9c4.getRangeAt(0)){
_9c2=_9c4.getRangeAt(0);
}
}
_9c2.selectNode(_9c0);
_9c4.removeAllRanges();
_9c4.addRange(_9c2);
}
}else{
try{
var tg=_9c0.tagName?_9c0.tagName.toLowerCase():"";
if(tg==="img"||tg==="table"){
_9c2=win.body(doc).createControlRange();
}else{
_9c2=win.body(doc).createRange();
}
_9c2.addElement(_9c0);
if(!_9c1){
_9c2.select();
}
}
catch(e){
this.selectElementChildren(_9c0,_9c1);
}
}
},inSelection:function(node){
if(node){
var _9c5;
var doc=win.doc;
var _9c6;
if(win.doc.getSelection){
var sel=win.global.getSelection();
if(sel&&sel.rangeCount>0){
_9c6=sel.getRangeAt(0);
}
if(_9c6&&_9c6.compareBoundaryPoints&&doc.createRange){
try{
_9c5=doc.createRange();
_9c5.setStart(node,0);
if(_9c6.compareBoundaryPoints(_9c6.START_TO_END,_9c5)===1){
return true;
}
}
catch(e){
}
}
}else{
_9c6=doc.selection.createRange();
try{
_9c5=node.ownerDocument.body.createControlRange();
if(_9c5){
_9c5.addElement(node);
}
}
catch(e1){
try{
_9c5=node.ownerDocument.body.createTextRange();
_9c5.moveToElementText(node);
}
catch(e2){
}
}
if(_9c6&&_9c5){
if(_9c6.compareEndPoints("EndToStart",_9c5)===1){
return true;
}
}
}
}
return false;
}};
lang.setObject("dijit._editor.selection",_9ad);
return _9ad;
});
},"dojo/fx":function(){
define(["./_base/lang","./Evented","./_base/kernel","./_base/array","./_base/connect","./_base/fx","./dom","./dom-style","./dom-geometry","./ready","require"],function(lang,_9c7,dojo,_9c8,_9c9,_9ca,dom,_9cb,geom,_9cc,_9cd){
if(!dojo.isAsync){
_9cc(0,function(){
var _9ce=["./fx/Toggler"];
_9cd(_9ce);
});
}
var _9cf=dojo.fx={};
var _9d0={_fire:function(evt,args){
if(this[evt]){
this[evt].apply(this,args||[]);
}
return this;
}};
var _9d1=function(_9d2){
this._index=-1;
this._animations=_9d2||[];
this._current=this._onAnimateCtx=this._onEndCtx=null;
this.duration=0;
_9c8.forEach(this._animations,function(a){
this.duration+=a.duration;
if(a.delay){
this.duration+=a.delay;
}
},this);
};
_9d1.prototype=new _9c7();
lang.extend(_9d1,{_onAnimate:function(){
this._fire("onAnimate",arguments);
},_onEnd:function(){
_9c9.disconnect(this._onAnimateCtx);
_9c9.disconnect(this._onEndCtx);
this._onAnimateCtx=this._onEndCtx=null;
if(this._index+1==this._animations.length){
this._fire("onEnd");
}else{
this._current=this._animations[++this._index];
this._onAnimateCtx=_9c9.connect(this._current,"onAnimate",this,"_onAnimate");
this._onEndCtx=_9c9.connect(this._current,"onEnd",this,"_onEnd");
this._current.play(0,true);
}
},play:function(_9d3,_9d4){
if(!this._current){
this._current=this._animations[this._index=0];
}
if(!_9d4&&this._current.status()=="playing"){
return this;
}
var _9d5=_9c9.connect(this._current,"beforeBegin",this,function(){
this._fire("beforeBegin");
}),_9d6=_9c9.connect(this._current,"onBegin",this,function(arg){
this._fire("onBegin",arguments);
}),_9d7=_9c9.connect(this._current,"onPlay",this,function(arg){
this._fire("onPlay",arguments);
_9c9.disconnect(_9d5);
_9c9.disconnect(_9d6);
_9c9.disconnect(_9d7);
});
if(this._onAnimateCtx){
_9c9.disconnect(this._onAnimateCtx);
}
this._onAnimateCtx=_9c9.connect(this._current,"onAnimate",this,"_onAnimate");
if(this._onEndCtx){
_9c9.disconnect(this._onEndCtx);
}
this._onEndCtx=_9c9.connect(this._current,"onEnd",this,"_onEnd");
this._current.play.apply(this._current,arguments);
return this;
},pause:function(){
if(this._current){
var e=_9c9.connect(this._current,"onPause",this,function(arg){
this._fire("onPause",arguments);
_9c9.disconnect(e);
});
this._current.pause();
}
return this;
},gotoPercent:function(_9d8,_9d9){
this.pause();
var _9da=this.duration*_9d8;
this._current=null;
_9c8.some(this._animations,function(a){
if(a.duration<=_9da){
this._current=a;
return true;
}
_9da-=a.duration;
return false;
});
if(this._current){
this._current.gotoPercent(_9da/this._current.duration,_9d9);
}
return this;
},stop:function(_9db){
if(this._current){
if(_9db){
for(;this._index+1<this._animations.length;++this._index){
this._animations[this._index].stop(true);
}
this._current=this._animations[this._index];
}
var e=_9c9.connect(this._current,"onStop",this,function(arg){
this._fire("onStop",arguments);
_9c9.disconnect(e);
});
this._current.stop();
}
return this;
},status:function(){
return this._current?this._current.status():"stopped";
},destroy:function(){
if(this._onAnimateCtx){
_9c9.disconnect(this._onAnimateCtx);
}
if(this._onEndCtx){
_9c9.disconnect(this._onEndCtx);
}
}});
lang.extend(_9d1,_9d0);
_9cf.chain=function(_9dc){
return new _9d1(_9dc);
};
var _9dd=function(_9de){
this._animations=_9de||[];
this._connects=[];
this._finished=0;
this.duration=0;
_9c8.forEach(_9de,function(a){
var _9df=a.duration;
if(a.delay){
_9df+=a.delay;
}
if(this.duration<_9df){
this.duration=_9df;
}
this._connects.push(_9c9.connect(a,"onEnd",this,"_onEnd"));
},this);
this._pseudoAnimation=new _9ca.Animation({curve:[0,1],duration:this.duration});
var self=this;
_9c8.forEach(["beforeBegin","onBegin","onPlay","onAnimate","onPause","onStop","onEnd"],function(evt){
self._connects.push(_9c9.connect(self._pseudoAnimation,evt,function(){
self._fire(evt,arguments);
}));
});
};
lang.extend(_9dd,{_doAction:function(_9e0,args){
_9c8.forEach(this._animations,function(a){
a[_9e0].apply(a,args);
});
return this;
},_onEnd:function(){
if(++this._finished>this._animations.length){
this._fire("onEnd");
}
},_call:function(_9e1,args){
var t=this._pseudoAnimation;
t[_9e1].apply(t,args);
},play:function(_9e2,_9e3){
this._finished=0;
this._doAction("play",arguments);
this._call("play",arguments);
return this;
},pause:function(){
this._doAction("pause",arguments);
this._call("pause",arguments);
return this;
},gotoPercent:function(_9e4,_9e5){
var ms=this.duration*_9e4;
_9c8.forEach(this._animations,function(a){
a.gotoPercent(a.duration<ms?1:(ms/a.duration),_9e5);
});
this._call("gotoPercent",arguments);
return this;
},stop:function(_9e6){
this._doAction("stop",arguments);
this._call("stop",arguments);
return this;
},status:function(){
return this._pseudoAnimation.status();
},destroy:function(){
_9c8.forEach(this._connects,_9c9.disconnect);
}});
lang.extend(_9dd,_9d0);
_9cf.combine=function(_9e7){
return new _9dd(_9e7);
};
_9cf.wipeIn=function(args){
var node=args.node=dom.byId(args.node),s=node.style,o;
var anim=_9ca.animateProperty(lang.mixin({properties:{height:{start:function(){
o=s.overflow;
s.overflow="hidden";
if(s.visibility=="hidden"||s.display=="none"){
s.height="1px";
s.display="";
s.visibility="";
return 1;
}else{
var _9e8=_9cb.get(node,"height");
return Math.max(_9e8,1);
}
},end:function(){
return node.scrollHeight;
}}}},args));
var fini=function(){
s.height="auto";
s.overflow=o;
};
_9c9.connect(anim,"onStop",fini);
_9c9.connect(anim,"onEnd",fini);
return anim;
};
_9cf.wipeOut=function(args){
var node=args.node=dom.byId(args.node),s=node.style,o;
var anim=_9ca.animateProperty(lang.mixin({properties:{height:{end:1}}},args));
_9c9.connect(anim,"beforeBegin",function(){
o=s.overflow;
s.overflow="hidden";
s.display="";
});
var fini=function(){
s.overflow=o;
s.height="auto";
s.display="none";
};
_9c9.connect(anim,"onStop",fini);
_9c9.connect(anim,"onEnd",fini);
return anim;
};
_9cf.slideTo=function(args){
var node=args.node=dom.byId(args.node),top=null,left=null;
var init=(function(n){
return function(){
var cs=_9cb.getComputedStyle(n);
var pos=cs.position;
top=(pos=="absolute"?n.offsetTop:parseInt(cs.top)||0);
left=(pos=="absolute"?n.offsetLeft:parseInt(cs.left)||0);
if(pos!="absolute"&&pos!="relative"){
var ret=geom.position(n,true);
top=ret.y;
left=ret.x;
n.style.position="absolute";
n.style.top=top+"px";
n.style.left=left+"px";
}
};
})(node);
init();
var anim=_9ca.animateProperty(lang.mixin({properties:{top:args.top||0,left:args.left||0}},args));
_9c9.connect(anim,"beforeBegin",anim,init);
return anim;
};
return _9cf;
});
},"dijit/_DialogMixin":function(){
define("dijit/_DialogMixin",["dojo/_base/declare","./a11y"],function(_9e9,a11y){
return _9e9("dijit._DialogMixin",null,{execute:function(){
},onCancel:function(){
},onExecute:function(){
},_onSubmit:function(){
this.onExecute();
this.execute(this.get("value"));
},_getFocusItems:function(){
var _9ea=a11y._getTabNavigable(this.containerNode);
this._firstFocusItem=_9ea.lowest||_9ea.first||this.closeButtonNode||this.domNode;
this._lastFocusItem=_9ea.last||_9ea.highest||this._firstFocusItem;
}});
});
},"dijit/Tree":function(){
define(["dojo/_base/array","dojo/_base/connect","dojo/cookie","dojo/_base/declare","dojo/Deferred","dojo/DeferredList","dojo/dom","dojo/dom-class","dojo/dom-geometry","dojo/dom-style","dojo/_base/event","dojo/errors/create","dojo/fx","dojo/_base/kernel","dojo/keys","dojo/_base/lang","dojo/on","dojo/topic","dojo/touch","dojo/when","./focus","./registry","./_base/manager","./_Widget","./_TemplatedMixin","./_Container","./_Contained","./_CssStateMixin","dojo/text!./templates/TreeNode.html","dojo/text!./templates/Tree.html","./tree/TreeStoreModel","./tree/ForestStoreModel","./tree/_dndSelector"],function(_9eb,_9ec,_9ed,_9ee,_9ef,_9f0,dom,_9f1,_9f2,_9f3,_9f4,_9f5,_9f6,_9f7,keys,lang,on,_9f8,_9f9,when,_9fa,_9fb,_9fc,_9fd,_9fe,_9ff,_a00,_a01,_a02,_a03,_a04,_a05,_a06){
_9ef=_9ee(_9ef,{addCallback:function(_a07){
this.then(_a07);
},addErrback:function(_a08){
this.then(null,_a08);
}});
var _a09=_9ee("dijit._TreeNode",[_9fd,_9fe,_9ff,_a00,_a01],{item:null,isTreeNode:true,label:"",_setLabelAttr:{node:"labelNode",type:"innerText"},isExpandable:null,isExpanded:false,state:"UNCHECKED",templateString:_a02,baseClass:"dijitTreeNode",cssStateNodes:{rowNode:"dijitTreeRow"},_setTooltipAttr:{node:"rowNode",type:"attribute",attribute:"title"},buildRendering:function(){
this.inherited(arguments);
this._setExpando();
this._updateItemClasses(this.item);
if(this.isExpandable){
this.labelNode.setAttribute("aria-expanded",this.isExpanded);
}
this.setSelected(false);
},_setIndentAttr:function(_a0a){
var _a0b=(Math.max(_a0a,0)*this.tree._nodePixelIndent)+"px";
_9f3.set(this.domNode,"backgroundPosition",_a0b+" 0px");
_9f3.set(this.indentNode,this.isLeftToRight()?"paddingLeft":"paddingRight",_a0b);
_9eb.forEach(this.getChildren(),function(_a0c){
_a0c.set("indent",_a0a+1);
});
this._set("indent",_a0a);
},markProcessing:function(){
this.state="LOADING";
this._setExpando(true);
},unmarkProcessing:function(){
this._setExpando(false);
},_updateItemClasses:function(item){
var tree=this.tree,_a0d=tree.model;
if(tree._v10Compat&&item===_a0d.root){
item=null;
}
this._applyClassAndStyle(item,"icon","Icon");
this._applyClassAndStyle(item,"label","Label");
this._applyClassAndStyle(item,"row","Row");
this.tree._startPaint(true);
},_applyClassAndStyle:function(item,_a0e,_a0f){
var _a10="_"+_a0e+"Class";
var _a11=_a0e+"Node";
var _a12=this[_a10];
this[_a10]=this.tree["get"+_a0f+"Class"](item,this.isExpanded);
_9f1.replace(this[_a11],this[_a10]||"",_a12||"");
_9f3.set(this[_a11],this.tree["get"+_a0f+"Style"](item,this.isExpanded)||{});
},_updateLayout:function(){
var _a13=this.getParent();
if(!_a13||!_a13.rowNode||_a13.rowNode.style.display=="none"){
_9f1.add(this.domNode,"dijitTreeIsRoot");
}else{
_9f1.toggle(this.domNode,"dijitTreeIsLast",!this.getNextSibling());
}
},_setExpando:function(_a14){
var _a15=["dijitTreeExpandoLoading","dijitTreeExpandoOpened","dijitTreeExpandoClosed","dijitTreeExpandoLeaf"],_a16=["*","-","+","*"],idx=_a14?0:(this.isExpandable?(this.isExpanded?1:2):3);
_9f1.replace(this.expandoNode,_a15[idx],_a15);
this.expandoNodeText.innerHTML=_a16[idx];
},expand:function(){
if(this._expandDeferred){
return this._expandDeferred;
}
if(this._collapseDeferred){
this._collapseDeferred.cancel();
delete this._collapseDeferred;
}
this.isExpanded=true;
this.labelNode.setAttribute("aria-expanded","true");
if(this.tree.showRoot||this!==this.tree.rootNode){
this.containerNode.setAttribute("role","group");
}
_9f1.add(this.contentNode,"dijitTreeContentExpanded");
this._setExpando();
this._updateItemClasses(this.item);
if(this==this.tree.rootNode&&this.tree.showRoot){
this.tree.domNode.setAttribute("aria-expanded","true");
}
var def,_a17=_9f6.wipeIn({node:this.containerNode,duration:_9fc.defaultDuration,onEnd:function(){
def.resolve(true);
}});
def=(this._expandDeferred=new _9ef(function(){
_a17.stop();
}));
_a17.play();
return def;
},collapse:function(){
if(this._collapseDeferred){
return this._collapseDeferred;
}
if(this._expandDeferred){
this._expandDeferred.cancel();
delete this._expandDeferred;
}
this.isExpanded=false;
this.labelNode.setAttribute("aria-expanded","false");
if(this==this.tree.rootNode&&this.tree.showRoot){
this.tree.domNode.setAttribute("aria-expanded","false");
}
_9f1.remove(this.contentNode,"dijitTreeContentExpanded");
this._setExpando();
this._updateItemClasses(this.item);
var def,_a18=_9f6.wipeOut({node:this.containerNode,duration:_9fc.defaultDuration,onEnd:function(){
def.resolve(true);
}});
def=(this._collapseDeferred=new _9ef(function(){
_a18.stop();
}));
_a18.play();
return def;
},indent:0,setChildItems:function(_a19){
var tree=this.tree,_a1a=tree.model,defs=[];
var _a1b=this.getChildren();
_9eb.forEach(_a1b,function(_a1c){
_9ff.prototype.removeChild.call(this,_a1c);
},this);
this.defer(function(){
_9eb.forEach(_a1b,function(node){
if(!node._destroyed&&!node.getParent()){
tree.dndController.removeTreeNode(node);
var id=_a1a.getIdentity(node.item),ary=tree._itemNodesMap[id];
if(ary.length==1){
delete tree._itemNodesMap[id];
}else{
var _a1d=_9eb.indexOf(ary,node);
if(_a1d!=-1){
ary.splice(_a1d,1);
}
}
node.destroyRecursive();
}
});
});
this.state="LOADED";
if(_a19&&_a19.length>0){
this.isExpandable=true;
_9eb.forEach(_a19,function(item){
var id=_a1a.getIdentity(item),_a1e=tree._itemNodesMap[id],node;
if(_a1e){
for(var i=0;i<_a1e.length;i++){
if(_a1e[i]&&!_a1e[i].getParent()){
node=_a1e[i];
node.set("indent",this.indent+1);
break;
}
}
}
if(!node){
node=this.tree._createTreeNode({item:item,tree:tree,isExpandable:_a1a.mayHaveChildren(item),label:tree.getLabel(item),tooltip:tree.getTooltip(item),ownerDocument:tree.ownerDocument,dir:tree.dir,lang:tree.lang,textDir:tree.textDir,indent:this.indent+1});
if(_a1e){
_a1e.push(node);
}else{
tree._itemNodesMap[id]=[node];
}
}
this.addChild(node);
if(this.tree.autoExpand||this.tree._state(node)){
defs.push(tree._expandNode(node));
}
},this);
_9eb.forEach(this.getChildren(),function(_a1f){
_a1f._updateLayout();
});
}else{
this.isExpandable=false;
}
if(this._setExpando){
this._setExpando(false);
}
this._updateItemClasses(this.item);
if(this==tree.rootNode){
var fc=this.tree.showRoot?this:this.getChildren()[0];
if(fc){
fc.setFocusable(true);
tree.lastFocused=fc;
}else{
tree.domNode.setAttribute("tabIndex","0");
}
}
var def=new _9f0(defs);
this.tree._startPaint(def);
return def;
},getTreePath:function(){
var node=this;
var path=[];
while(node&&node!==this.tree.rootNode){
path.unshift(node.item);
node=node.getParent();
}
path.unshift(this.tree.rootNode.item);
return path;
},getIdentity:function(){
return this.tree.model.getIdentity(this.item);
},removeChild:function(node){
this.inherited(arguments);
var _a20=this.getChildren();
if(_a20.length==0){
this.isExpandable=false;
this.collapse();
}
_9eb.forEach(_a20,function(_a21){
_a21._updateLayout();
});
},makeExpandable:function(){
this.isExpandable=true;
this._setExpando(false);
},setSelected:function(_a22){
this.labelNode.setAttribute("aria-selected",_a22?"true":"false");
_9f1.toggle(this.rowNode,"dijitTreeRowSelected",_a22);
},setFocusable:function(_a23){
this.labelNode.setAttribute("tabIndex",_a23?"0":"-1");
},_setTextDirAttr:function(_a24){
if(_a24&&((this.textDir!=_a24)||!this._created)){
this._set("textDir",_a24);
this.applyTextDir(this.labelNode,this.labelNode.innerText||this.labelNode.textContent||"");
_9eb.forEach(this.getChildren(),function(_a25){
_a25.set("textDir",_a24);
},this);
}
}});
var Tree=_9ee("dijit.Tree",[_9fd,_9fe],{store:null,model:null,query:null,label:"",showRoot:true,childrenAttr:["children"],paths:[],path:[],selectedItems:null,selectedItem:null,openOnClick:false,openOnDblClick:false,templateString:_a03,persist:true,autoExpand:false,dndController:_a06,dndParams:["onDndDrop","itemCreator","onDndCancel","checkAcceptance","checkItemAcceptance","dragThreshold","betweenThreshold"],onDndDrop:null,itemCreator:null,onDndCancel:null,checkAcceptance:null,checkItemAcceptance:null,dragThreshold:5,betweenThreshold:0,_nodePixelIndent:19,_publish:function(_a26,_a27){
_9f8.publish(this.id,lang.mixin({tree:this,event:_a26},_a27||{}));
},postMixInProperties:function(){
this.tree=this;
if(this.autoExpand){
this.persist=false;
}
this._itemNodesMap={};
if(!this.cookieName&&this.id){
this.cookieName=this.id+"SaveStateCookie";
}
this.expandChildrenDeferred=new _9ef();
this.pendingCommandsDeferred=this.expandChildrenDeferred;
this.inherited(arguments);
},postCreate:function(){
this._initState();
var self=this;
this.own(on(this.domNode,on.selector(".dijitTreeNode",_9f9.enter),function(evt){
self._onNodeMouseEnter(_9fb.byNode(this),evt);
}),on(this.domNode,on.selector(".dijitTreeNode",_9f9.leave),function(evt){
self._onNodeMouseLeave(_9fb.byNode(this),evt);
}),on(this.domNode,on.selector(".dijitTreeNode","click"),function(evt){
self._onClick(_9fb.byNode(this),evt);
}),on(this.domNode,on.selector(".dijitTreeNode","dblclick"),function(evt){
self._onDblClick(_9fb.byNode(this),evt);
}),on(this.domNode,on.selector(".dijitTreeNode","keypress"),function(evt){
self._onKeyPress(_9fb.byNode(this),evt);
}),on(this.domNode,on.selector(".dijitTreeNode","keydown"),function(evt){
self._onKeyDown(_9fb.byNode(this),evt);
}),on(this.domNode,on.selector(".dijitTreeRow","focusin"),function(evt){
self._onNodeFocus(_9fb.getEnclosingWidget(this),evt);
}));
if(!this.model){
this._store2model();
}
this.connect(this.model,"onChange","_onItemChange");
this.connect(this.model,"onChildrenChange","_onItemChildrenChange");
this.connect(this.model,"onDelete","_onItemDelete");
this.inherited(arguments);
if(this.dndController){
if(lang.isString(this.dndController)){
this.dndController=lang.getObject(this.dndController);
}
var _a28={};
for(var i=0;i<this.dndParams.length;i++){
if(this[this.dndParams[i]]){
_a28[this.dndParams[i]]=this[this.dndParams[i]];
}
}
this.dndController=new this.dndController(this,_a28);
}
this._load();
if(!this.params.path&&!this.params.paths&&this.persist){
this.set("paths",this.dndController._getSavedPaths());
}
this.onLoadDeferred=this.pendingCommandsDeferred;
this.onLoadDeferred.then(lang.hitch(this,"onLoad"));
},_store2model:function(){
this._v10Compat=true;
_9f7.deprecated("Tree: from version 2.0, should specify a model object rather than a store/query");
var _a29={id:this.id+"_ForestStoreModel",store:this.store,query:this.query,childrenAttrs:this.childrenAttr};
if(this.params.mayHaveChildren){
_a29.mayHaveChildren=lang.hitch(this,"mayHaveChildren");
}
if(this.params.getItemChildren){
_a29.getChildren=lang.hitch(this,function(item,_a2a,_a2b){
this.getItemChildren((this._v10Compat&&item===this.model.root)?null:item,_a2a,_a2b);
});
}
this.model=new _a05(_a29);
this.showRoot=Boolean(this.label);
},onLoad:function(){
},_load:function(){
this.model.getRoot(lang.hitch(this,function(item){
var rn=(this.rootNode=this.tree._createTreeNode({item:item,tree:this,isExpandable:true,label:this.label||this.getLabel(item),textDir:this.textDir,indent:this.showRoot?0:-1}));
if(!this.showRoot){
rn.rowNode.style.display="none";
this.domNode.setAttribute("role","presentation");
this.domNode.removeAttribute("aria-expanded");
this.domNode.removeAttribute("aria-multiselectable");
rn.labelNode.setAttribute("role","presentation");
rn.containerNode.setAttribute("role","tree");
rn.containerNode.setAttribute("aria-expanded","true");
rn.containerNode.setAttribute("aria-multiselectable",!this.dndController.singular);
}else{
this.domNode.setAttribute("aria-multiselectable",!this.dndController.singular);
}
this.domNode.appendChild(rn.domNode);
var _a2c=this.model.getIdentity(item);
if(this._itemNodesMap[_a2c]){
this._itemNodesMap[_a2c].push(rn);
}else{
this._itemNodesMap[_a2c]=[rn];
}
rn._updateLayout();
this._expandNode(rn).then(lang.hitch(this,function(){
this.expandChildrenDeferred.resolve(true);
}));
}),lang.hitch(this,function(err){
console.error(this,": error loading root: ",err);
}));
},getNodesByItem:function(item){
if(!item){
return [];
}
var _a2d=lang.isString(item)?item:this.model.getIdentity(item);
return [].concat(this._itemNodesMap[_a2d]);
},_setSelectedItemAttr:function(item){
this.set("selectedItems",[item]);
},_setSelectedItemsAttr:function(_a2e){
var tree=this;
return this.pendingCommandsDeferred=this.pendingCommandsDeferred.then(lang.hitch(this,function(){
var _a2f=_9eb.map(_a2e,function(item){
return (!item||lang.isString(item))?item:tree.model.getIdentity(item);
});
var _a30=[];
_9eb.forEach(_a2f,function(id){
_a30=_a30.concat(tree._itemNodesMap[id]||[]);
});
this.set("selectedNodes",_a30);
}));
},_setPathAttr:function(path){
if(path.length){
return this.set("paths",[path]);
}else{
return this.set("paths",[]);
}
},_setPathsAttr:function(_a31){
var tree=this;
return this.pendingCommandsDeferred=this.pendingCommandsDeferred.then(function(){
return new _9f0(_9eb.map(_a31,function(path){
var d=new _9ef();
path=_9eb.map(path,function(item){
return lang.isString(item)?item:tree.model.getIdentity(item);
});
if(path.length){
_a32(path,[tree.rootNode],d);
}else{
d.reject(new Tree.PathError("Empty path"));
}
return d;
}));
}).then(_a33);
function _a32(path,_a34,def){
var _a35=path.shift();
var _a36=_9eb.filter(_a34,function(node){
return node.getIdentity()==_a35;
})[0];
if(!!_a36){
if(path.length){
tree._expandNode(_a36).then(function(){
_a32(path,_a36.getChildren(),def);
});
}else{
def.resolve(_a36);
}
}else{
def.reject(new Tree.PathError("Could not expand path at "+_a35));
}
};
function _a33(_a37){
tree.set("selectedNodes",_9eb.map(_9eb.filter(_a37,function(x){
return x[0];
}),function(x){
return x[1];
}));
};
},_setSelectedNodeAttr:function(node){
this.set("selectedNodes",[node]);
},_setSelectedNodesAttr:function(_a38){
this.dndController.setSelection(_a38);
},expandAll:function(){
var _a39=this;
function _a3a(node){
var def=new dojo.Deferred();
_a39._expandNode(node).then(function(){
var _a3b=_9eb.filter(node.getChildren()||[],function(node){
return node.isExpandable;
}),defs=_9eb.map(_a3b,_a3a);
new dojo.DeferredList(defs).then(function(){
def.resolve(true);
});
});
return def;
};
return _a3a(this.rootNode);
},collapseAll:function(){
var _a3c=this;
function _a3d(node){
var def=new dojo.Deferred();
def.label="collapseAllDeferred";
var _a3e=_9eb.filter(node.getChildren()||[],function(node){
return node.isExpandable;
}),defs=_9eb.map(_a3e,_a3d);
new dojo.DeferredList(defs).then(function(){
if(!node.isExpanded||(node==_a3c.rootNode&&!_a3c.showRoot)){
def.resolve(true);
}else{
_a3c._collapseNode(node).then(function(){
def.resolve(true);
});
}
});
return def;
};
return _a3d(this.rootNode);
},mayHaveChildren:function(){
},getItemChildren:function(){
},getLabel:function(item){
return this.model.getLabel(item);
},getIconClass:function(item,_a3f){
return (!item||this.model.mayHaveChildren(item))?(_a3f?"dijitFolderOpened":"dijitFolderClosed"):"dijitLeaf";
},getLabelClass:function(){
},getRowClass:function(){
},getIconStyle:function(){
},getLabelStyle:function(){
},getRowStyle:function(){
},getTooltip:function(){
return "";
},_onKeyPress:function(_a40,e){
if(e.charCode<=32){
return;
}
if(!e.altKey&&!e.ctrlKey&&!e.shiftKey&&!e.metaKey){
var c=String.fromCharCode(e.charCode);
this._onLetterKeyNav({node:_a40,key:c.toLowerCase()});
_9f4.stop(e);
}
},_onKeyDown:function(_a41,e){
var key=e.keyCode;
var map=this._keyHandlerMap;
if(!map){
map={};
map[keys.ENTER]=map[keys.SPACE]=map[" "]="_onEnterKey";
map[this.isLeftToRight()?keys.LEFT_ARROW:keys.RIGHT_ARROW]="_onLeftArrow";
map[this.isLeftToRight()?keys.RIGHT_ARROW:keys.LEFT_ARROW]="_onRightArrow";
map[keys.UP_ARROW]="_onUpArrow";
map[keys.DOWN_ARROW]="_onDownArrow";
map[keys.HOME]="_onHomeKey";
map[keys.END]="_onEndKey";
this._keyHandlerMap=map;
}
if(this._keyHandlerMap[key]){
if(this._curSearch){
this._curSearch.timer.remove();
delete this._curSearch;
}
this[this._keyHandlerMap[key]]({node:_a41,item:_a41.item,evt:e});
_9f4.stop(e);
}
},_onEnterKey:function(_a42){
this._publish("execute",{item:_a42.item,node:_a42.node});
this.dndController.userSelect(_a42.node,_9ec.isCopyKey(_a42.evt),_a42.evt.shiftKey);
this.onClick(_a42.item,_a42.node,_a42.evt);
},_onDownArrow:function(_a43){
var node=this._getNextNode(_a43.node);
if(node&&node.isTreeNode){
this.focusNode(node);
}
},_onUpArrow:function(_a44){
var node=_a44.node;
var _a45=node.getPreviousSibling();
if(_a45){
node=_a45;
while(node.isExpandable&&node.isExpanded&&node.hasChildren()){
var _a46=node.getChildren();
node=_a46[_a46.length-1];
}
}else{
var _a47=node.getParent();
if(!(!this.showRoot&&_a47===this.rootNode)){
node=_a47;
}
}
if(node&&node.isTreeNode){
this.focusNode(node);
}
},_onRightArrow:function(_a48){
var node=_a48.node;
if(node.isExpandable&&!node.isExpanded){
this._expandNode(node);
}else{
if(node.hasChildren()){
node=node.getChildren()[0];
if(node&&node.isTreeNode){
this.focusNode(node);
}
}
}
},_onLeftArrow:function(_a49){
var node=_a49.node;
if(node.isExpandable&&node.isExpanded){
this._collapseNode(node);
}else{
var _a4a=node.getParent();
if(_a4a&&_a4a.isTreeNode&&!(!this.showRoot&&_a4a===this.rootNode)){
this.focusNode(_a4a);
}
}
},_onHomeKey:function(){
var node=this._getRootOrFirstNode();
if(node){
this.focusNode(node);
}
},_onEndKey:function(){
var node=this.rootNode;
while(node.isExpanded){
var c=node.getChildren();
node=c[c.length-1];
}
if(node&&node.isTreeNode){
this.focusNode(node);
}
},multiCharSearchDuration:250,_onLetterKeyNav:function(_a4b){
var cs=this._curSearch;
if(cs){
cs.pattern=cs.pattern+_a4b.key;
cs.timer.remove();
}else{
cs=this._curSearch={pattern:_a4b.key,startNode:_a4b.node};
}
cs.timer=this.defer(function(){
delete this._curSearch;
},this.multiCharSearchDuration);
var node=cs.startNode;
do{
node=this._getNextNode(node);
if(!node){
node=this._getRootOrFirstNode();
}
}while(node!==cs.startNode&&(node.label.toLowerCase().substr(0,cs.pattern.length)!=cs.pattern));
if(node&&node.isTreeNode){
if(node!==cs.startNode){
this.focusNode(node);
}
}
},isExpandoNode:function(node,_a4c){
return dom.isDescendant(node,_a4c.expandoNode);
},_onClick:function(_a4d,e){
var _a4e=e.target,_a4f=this.isExpandoNode(_a4e,_a4d);
if((this.openOnClick&&_a4d.isExpandable)||_a4f){
if(_a4d.isExpandable){
this._onExpandoClick({node:_a4d});
}
}else{
this._publish("execute",{item:_a4d.item,node:_a4d,evt:e});
this.onClick(_a4d.item,_a4d,e);
this.focusNode(_a4d);
}
_9f4.stop(e);
},_onDblClick:function(_a50,e){
var _a51=e.target,_a52=(_a51==_a50.expandoNode||_a51==_a50.expandoNodeText);
if((this.openOnDblClick&&_a50.isExpandable)||_a52){
if(_a50.isExpandable){
this._onExpandoClick({node:_a50});
}
}else{
this._publish("execute",{item:_a50.item,node:_a50,evt:e});
this.onDblClick(_a50.item,_a50,e);
this.focusNode(_a50);
}
_9f4.stop(e);
},_onExpandoClick:function(_a53){
var node=_a53.node;
this.focusNode(node);
if(node.isExpanded){
this._collapseNode(node);
}else{
this._expandNode(node);
}
},onClick:function(){
},onDblClick:function(){
},onOpen:function(){
},onClose:function(){
},_getNextNode:function(node){
if(node.isExpandable&&node.isExpanded&&node.hasChildren()){
return node.getChildren()[0];
}else{
while(node&&node.isTreeNode){
var _a54=node.getNextSibling();
if(_a54){
return _a54;
}
node=node.getParent();
}
return null;
}
},_getRootOrFirstNode:function(){
return this.showRoot?this.rootNode:this.rootNode.getChildren()[0];
},_collapseNode:function(node){
if(node._expandNodeDeferred){
delete node._expandNodeDeferred;
}
if(node.state=="LOADING"){
return;
}
if(node.isExpanded){
var ret=node.collapse();
this.onClose(node.item,node);
this._state(node,false);
this._startPaint(ret);
return ret;
}
},_expandNode:function(node){
var def=new _9ef();
if(node._expandNodeDeferred){
return node._expandNodeDeferred;
}
var _a55=this.model,item=node.item,_a56=this;
if(!node._loadDeferred){
node.markProcessing();
node._loadDeferred=new _9ef();
_a55.getChildren(item,function(_a57){
node.unmarkProcessing();
node.setChildItems(_a57).then(function(){
node._loadDeferred.resolve(_a57);
});
},function(err){
console.error(_a56,": error loading "+node.label+" children: ",err);
node._loadDeferred.reject(err);
});
}
node._loadDeferred.then(lang.hitch(this,function(){
node.expand().then(function(){
def.resolve(true);
});
this.onOpen(node.item,node);
this._state(node,true);
}));
this._startPaint(def);
return def;
},focusNode:function(node){
_9fa.focus(node.labelNode);
},_onNodeFocus:function(node){
if(node&&node!=this.lastFocused){
if(this.lastFocused&&!this.lastFocused._destroyed){
this.lastFocused.setFocusable(false);
}
node.setFocusable(true);
this.lastFocused=node;
}
},_onNodeMouseEnter:function(){
},_onNodeMouseLeave:function(){
},_onItemChange:function(item){
var _a58=this.model,_a59=_a58.getIdentity(item),_a5a=this._itemNodesMap[_a59];
if(_a5a){
var _a5b=this.getLabel(item),_a5c=this.getTooltip(item);
_9eb.forEach(_a5a,function(node){
node.set({item:item,label:_a5b,tooltip:_a5c});
node._updateItemClasses(item);
});
}
},_onItemChildrenChange:function(_a5d,_a5e){
var _a5f=this.model,_a60=_a5f.getIdentity(_a5d),_a61=this._itemNodesMap[_a60];
if(_a61){
_9eb.forEach(_a61,function(_a62){
_a62.setChildItems(_a5e);
});
}
},_onItemDelete:function(item){
var _a63=this.model,_a64=_a63.getIdentity(item),_a65=this._itemNodesMap[_a64];
if(_a65){
_9eb.forEach(_a65,function(node){
this.dndController.removeTreeNode(node);
var _a66=node.getParent();
if(_a66){
_a66.removeChild(node);
}
node.destroyRecursive();
},this);
delete this._itemNodesMap[_a64];
}
},_initState:function(){
this._openedNodes={};
if(this.persist&&this.cookieName){
var oreo=_9ed(this.cookieName);
if(oreo){
_9eb.forEach(oreo.split(","),function(item){
this._openedNodes[item]=true;
},this);
}
}
},_state:function(node,_a67){
if(!this.persist){
return false;
}
var path=_9eb.map(node.getTreePath(),function(item){
return this.model.getIdentity(item);
},this).join("/");
if(arguments.length===1){
return this._openedNodes[path];
}else{
if(_a67){
this._openedNodes[path]=true;
}else{
delete this._openedNodes[path];
}
if(this.persist&&this.cookieName){
var ary=[];
for(var id in this._openedNodes){
ary.push(id);
}
_9ed(this.cookieName,ary.join(","),{expires:365});
}
}
},destroy:function(){
if(this._curSearch){
this._curSearch.timer.remove();
delete this._curSearch;
}
if(this.rootNode){
this.rootNode.destroyRecursive();
}
if(this.dndController&&!lang.isString(this.dndController)){
this.dndController.destroy();
}
this.rootNode=null;
this.inherited(arguments);
},destroyRecursive:function(){
this.destroy();
},resize:function(_a68){
if(_a68){
_9f2.setMarginBox(this.domNode,_a68);
}
this._nodePixelIndent=_9f2.position(this.tree.indentDetector).w||this._nodePixelIndent;
this.expandChildrenDeferred.then(lang.hitch(this,function(){
this.rootNode.set("indent",this.showRoot?0:-1);
this._adjustWidths();
}));
},_outstandingPaintOperations:0,_startPaint:function(p){
this._outstandingPaintOperations++;
if(this._adjustWidthsTimer){
this._adjustWidthsTimer.remove();
delete this._adjustWidthsTimer;
}
var oc=lang.hitch(this,function(){
this._outstandingPaintOperations--;
if(this._outstandingPaintOperations<=0&&!this._adjustWidthsTimer&&this._started){
this._adjustWidthsTimer=this.defer("_adjustWidths");
}
});
when(p,oc,oc);
},_adjustWidths:function(){
if(this._adjustWidthsTimer){
this._adjustWidthsTimer.remove();
delete this._adjustWidthsTimer;
}
var _a69=0,_a6a=[];
function _a6b(_a6c){
var node=_a6c.rowNode;
node.style.width="auto";
_a69=Math.max(_a69,node.clientWidth);
_a6a.push(node);
if(_a6c.isExpanded){
_9eb.forEach(_a6c.getChildren(),_a6b);
}
};
_a6b(this.rootNode);
_a69=Math.max(_a69,_9f2.getContentBox(this.domNode).w);
_9eb.forEach(_a6a,function(node){
node.style.width=_a69+"px";
});
},_createTreeNode:function(args){
return new _a09(args);
},_setTextDirAttr:function(_a6d){
if(_a6d&&this.textDir!=_a6d){
this._set("textDir",_a6d);
this.rootNode.set("textDir",_a6d);
}
}});
Tree.PathError=_9f5("TreePathError");
Tree._TreeNode=_a09;
return Tree;
});
},"dijit/form/HorizontalSlider":function(){
define(["dojo/_base/array","dojo/_base/declare","dojo/dnd/move","dojo/_base/event","dojo/_base/fx","dojo/dom-geometry","dojo/dom-style","dojo/keys","dojo/_base/lang","dojo/sniff","dojo/dnd/Moveable","dojo/dnd/Mover","dojo/query","dojo/mouse","../registry","../focus","../typematic","./Button","./_FormValueWidget","../_Container","dojo/text!./templates/HorizontalSlider.html"],function(_a6e,_a6f,move,_a70,fx,_a71,_a72,keys,lang,has,_a73,_a74,_a75,_a76,_a77,_a78,_a79,_a7a,_a7b,_a7c,_a7d){
var _a7e=_a6f("dijit.form._SliderMover",_a74,{onMouseMove:function(e){
var _a7f=this.widget;
var _a80=_a7f._abspos;
if(!_a80){
_a80=_a7f._abspos=_a71.position(_a7f.sliderBarContainer,true);
_a7f._setPixelValue_=lang.hitch(_a7f,"_setPixelValue");
_a7f._isReversed_=_a7f._isReversed();
}
var _a81=e[_a7f._mousePixelCoord]-_a80[_a7f._startingPixelCoord];
_a7f._setPixelValue_(_a7f._isReversed_?(_a80[_a7f._pixelCount]-_a81):_a81,_a80[_a7f._pixelCount],false);
},destroy:function(e){
_a74.prototype.destroy.apply(this,arguments);
var _a82=this.widget;
_a82._abspos=null;
_a82._setValueAttr(_a82.value,true);
}});
var _a83=_a6f("dijit.form.HorizontalSlider",[_a7b,_a7c],{templateString:_a7d,value:0,showButtons:true,minimum:0,maximum:100,discreteValues:Infinity,pageIncrement:2,clickSelect:true,slideDuration:_a77.defaultDuration,_setIdAttr:"",baseClass:"dijitSlider",cssStateNodes:{incrementButton:"dijitSliderIncrementButton",decrementButton:"dijitSliderDecrementButton",focusNode:"dijitSliderThumb"},_mousePixelCoord:"pageX",_pixelCount:"w",_startingPixelCoord:"x",_handleOffsetCoord:"left",_progressPixelSize:"width",_onKeyUp:function(e){
if(this.disabled||this.readOnly||e.altKey||e.ctrlKey||e.metaKey){
return;
}
this._setValueAttr(this.value,true);
},_onKeyPress:function(e){
if(this.disabled||this.readOnly||e.altKey||e.ctrlKey||e.metaKey){
return;
}
switch(e.charOrCode){
case keys.HOME:
this._setValueAttr(this.minimum,false);
break;
case keys.END:
this._setValueAttr(this.maximum,false);
break;
case ((this._descending||this.isLeftToRight())?keys.RIGHT_ARROW:keys.LEFT_ARROW):
case (this._descending===false?keys.DOWN_ARROW:keys.UP_ARROW):
case (this._descending===false?keys.PAGE_DOWN:keys.PAGE_UP):
this.increment(e);
break;
case ((this._descending||this.isLeftToRight())?keys.LEFT_ARROW:keys.RIGHT_ARROW):
case (this._descending===false?keys.UP_ARROW:keys.DOWN_ARROW):
case (this._descending===false?keys.PAGE_UP:keys.PAGE_DOWN):
this.decrement(e);
break;
default:
return;
}
_a70.stop(e);
},_onHandleClick:function(e){
if(this.disabled||this.readOnly){
return;
}
if(!has("ie")){
_a78.focus(this.sliderHandle);
}
_a70.stop(e);
},_isReversed:function(){
return !this.isLeftToRight();
},_onBarClick:function(e){
if(this.disabled||this.readOnly||!this.clickSelect){
return;
}
_a78.focus(this.sliderHandle);
_a70.stop(e);
var _a84=_a71.position(this.sliderBarContainer,true);
var _a85=e[this._mousePixelCoord]-_a84[this._startingPixelCoord];
this._setPixelValue(this._isReversed()?(_a84[this._pixelCount]-_a85):_a85,_a84[this._pixelCount],true);
this._movable.onMouseDown(e);
},_setPixelValue:function(_a86,_a87,_a88){
if(this.disabled||this.readOnly){
return;
}
var _a89=this.discreteValues;
if(_a89<=1||_a89==Infinity){
_a89=_a87;
}
_a89--;
var _a8a=_a87/_a89;
var _a8b=Math.round(_a86/_a8a);
this._setValueAttr(Math.max(Math.min((this.maximum-this.minimum)*_a8b/_a89+this.minimum,this.maximum),this.minimum),_a88);
},_setValueAttr:function(_a8c,_a8d){
this._set("value",_a8c);
this.valueNode.value=_a8c;
this.focusNode.setAttribute("aria-valuenow",_a8c);
this.inherited(arguments);
var _a8e=(_a8c-this.minimum)/(this.maximum-this.minimum);
var _a8f=(this._descending===false)?this.remainingBar:this.progressBar;
var _a90=(this._descending===false)?this.progressBar:this.remainingBar;
if(this._inProgressAnim&&this._inProgressAnim.status!="stopped"){
this._inProgressAnim.stop(true);
}
if(_a8d&&this.slideDuration>0&&_a8f.style[this._progressPixelSize]){
var _a91=this;
var _a92={};
var _a93=parseFloat(_a8f.style[this._progressPixelSize]);
var _a94=this.slideDuration*(_a8e-_a93/100);
if(_a94==0){
return;
}
if(_a94<0){
_a94=0-_a94;
}
_a92[this._progressPixelSize]={start:_a93,end:_a8e*100,units:"%"};
this._inProgressAnim=fx.animateProperty({node:_a8f,duration:_a94,onAnimate:function(v){
_a90.style[_a91._progressPixelSize]=(100-parseFloat(v[_a91._progressPixelSize]))+"%";
},onEnd:function(){
delete _a91._inProgressAnim;
},properties:_a92});
this._inProgressAnim.play();
}else{
_a8f.style[this._progressPixelSize]=(_a8e*100)+"%";
_a90.style[this._progressPixelSize]=((1-_a8e)*100)+"%";
}
},_bumpValue:function(_a95,_a96){
if(this.disabled||this.readOnly){
return;
}
var s=_a72.getComputedStyle(this.sliderBarContainer);
var c=_a71.getContentBox(this.sliderBarContainer,s);
var _a97=this.discreteValues;
if(_a97<=1||_a97==Infinity){
_a97=c[this._pixelCount];
}
_a97--;
var _a98=(this.value-this.minimum)*_a97/(this.maximum-this.minimum)+_a95;
if(_a98<0){
_a98=0;
}
if(_a98>_a97){
_a98=_a97;
}
_a98=_a98*(this.maximum-this.minimum)/_a97+this.minimum;
this._setValueAttr(_a98,_a96);
},_onClkBumper:function(val){
if(this.disabled||this.readOnly||!this.clickSelect){
return;
}
this._setValueAttr(val,true);
},_onClkIncBumper:function(){
this._onClkBumper(this._descending===false?this.minimum:this.maximum);
},_onClkDecBumper:function(){
this._onClkBumper(this._descending===false?this.maximum:this.minimum);
},decrement:function(e){
this._bumpValue(e.charOrCode==keys.PAGE_DOWN?-this.pageIncrement:-1);
},increment:function(e){
this._bumpValue(e.charOrCode==keys.PAGE_UP?this.pageIncrement:1);
},_mouseWheeled:function(evt){
_a70.stop(evt);
this._bumpValue(evt.wheelDelta<0?-1:1,true);
},startup:function(){
if(this._started){
return;
}
_a6e.forEach(this.getChildren(),function(_a99){
if(this[_a99.container]!=this.containerNode){
this[_a99.container].appendChild(_a99.domNode);
}
},this);
this.inherited(arguments);
},_typematicCallback:function(_a9a,_a9b,e){
if(_a9a==-1){
this._setValueAttr(this.value,true);
}else{
this[(_a9b==(this._descending?this.incrementButton:this.decrementButton))?"decrement":"increment"](e);
}
},buildRendering:function(){
this.inherited(arguments);
if(this.showButtons){
this.incrementButton.style.display="";
this.decrementButton.style.display="";
}
var _a9c=_a75("label[for=\""+this.id+"\"]");
if(_a9c.length){
if(!_a9c[0].id){
_a9c[0].id=this.id+"_label";
}
this.focusNode.setAttribute("aria-labelledby",_a9c[0].id);
}
this.focusNode.setAttribute("aria-valuemin",this.minimum);
this.focusNode.setAttribute("aria-valuemax",this.maximum);
},postCreate:function(){
this.inherited(arguments);
if(this.showButtons){
this.own(_a79.addMouseListener(this.decrementButton,this,"_typematicCallback",25,500),_a79.addMouseListener(this.incrementButton,this,"_typematicCallback",25,500));
}
this.connect(this.domNode,_a76.wheel,"_mouseWheeled");
var _a9d=_a6f(_a7e,{widget:this});
this._movable=new _a73(this.sliderHandle,{mover:_a9d});
this._layoutHackIE7();
},destroy:function(){
this._movable.destroy();
if(this._inProgressAnim&&this._inProgressAnim.status!="stopped"){
this._inProgressAnim.stop(true);
}
this.inherited(arguments);
}});
_a83._Mover=_a7e;
return _a83;
});
},"*now":function(r){
r(["dojo/i18n!*preload*dijit/nls/dijit-all*[\"ar\",\"ca\",\"cs\",\"da\",\"de\",\"el\",\"en-gb\",\"en-us\",\"es-es\",\"fi-fi\",\"fr-fr\",\"he-il\",\"hu\",\"it-it\",\"ja-jp\",\"ko-kr\",\"nl-nl\",\"nb\",\"pl\",\"pt-br\",\"pt-pt\",\"ru\",\"sk\",\"sl\",\"sv\",\"th\",\"tr\",\"zh-tw\",\"zh-cn\",\"ROOT\"]"]);
}}});
define("dijit/dijit-all",["./main","./dijit","./ColorPalette","./Declaration","./Dialog","./DialogUnderlay","./TooltipDialog","./Editor","./_editor/plugins/FontChoice","./_editor/plugins/LinkDialog","./Menu","./MenuItem","./PopupMenuItem","./CheckedMenuItem","./MenuBar","./MenuBarItem","./PopupMenuBarItem","./MenuSeparator","./ProgressBar","./TitlePane","./Toolbar","./Tooltip","./Tree","./InlineEditBox","./form/Form","./form/Button","./form/DropDownButton","./form/ComboButton","./form/ToggleButton","./form/CheckBox","./form/RadioButton","./form/TextBox","./form/ValidationTextBox","./form/CurrencyTextBox","./form/DateTextBox","./form/TimeTextBox","./form/NumberSpinner","./form/NumberTextBox","./form/ComboBox","./form/FilteringSelect","./form/MultiSelect","./form/Select","./form/HorizontalSlider","./form/VerticalSlider","./form/HorizontalRule","./form/VerticalRule","./form/HorizontalRuleLabels","./form/VerticalRuleLabels","./form/SimpleTextarea","./form/Textarea","./layout/AccordionContainer","./layout/ContentPane","./layout/BorderContainer","./layout/LayoutContainer","./layout/LinkPane","./layout/SplitContainer","./layout/StackContainer","./layout/TabContainer"],function(_a9e){
console.warn("dijit-all may include much more code than your application actually requires. We strongly recommend that you investigate a custom build or the web build tool");
return _a9e;
});
