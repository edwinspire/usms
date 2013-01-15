//>>built
define("shapes/_RectMixin",["dojo/_base/declare",],function(_1){
return _1("shapes._RectMixin",[],{buildRendering:function(){
this.inherited(arguments);
this._x=0;
this._y=0;
this._width=(this.width?this.width:this.defaultWidth)-0;
this._height=(this.height?this.height:this.defaultHeight)-0;
this._cornerRadius=this.cornerRadius-0;
},resize:function(){
this._resize();
},createGraphics:function(){
var _2="<rect"+" x=\""+this._x+"\""+" y=\""+this._y+"\""+" width=\""+this._width+"\""+" height=\""+this._height+"\""+" rx=\""+this._cornerRadius+"\"/>";
this.domNode.innerHTML=this._header+_2+this._footer;
this._shape=dojo.query("rect",this.domNode)[0];
this._g=dojo.query("g.shapeg",this.domNode)[0];
this._svgroot=dojo.query("svg",this.domNode)[0];
this._svgroot.style.verticalAlign="top";
this._svgroot.style.overflow="visible";
}});
});
