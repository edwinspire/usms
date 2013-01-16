//>>built
define("shapes/_TextMixin",["dojo/_base/declare",],function(_1){
return _1("shapes._TextMixin",[],{createGraphics:function(){
dojo.addClass(this.domNode,"draw");
dojo.addClass(this.domNode,"drawText");
var _2="<text>"+this.content+"</text>";
this.domNode.innerHTML=this._header+_2+this._footer;
this._shape=dojo.query("text",this.domNode)[0];
this._g=dojo.query("g.shapeg",this.domNode)[0];
this._svgroot=dojo.query("svg",this.domNode)[0];
this._svgroot.style.verticalAlign="top";
this._svgroot.style.overflow="visible";
this._svgroot.style.fill="currentColor";
},resize:function(){
this.inherited(arguments);
var _3=this.domNode.style;
if(_3.width.length==0||_3.height.length==0){
if(this._bbox){
var _4=this._svgroot.style;
var w=this._bbox.width+"px";
var h=this._bbox.height+"px";
_3.width=_4.width=w;
_3.height=_4.height=h;
}
}
}});
});
