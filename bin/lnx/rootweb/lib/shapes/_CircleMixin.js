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
define("shapes/_CircleMixin",["dojo/_base/declare",],function(_1){
return _1("shapes._CircleMixin",[],{buildRendering:function(){
this.inherited(arguments);
this._rx=(this.rx?this.rx:this.defaultRx)-0;
this._ry=(this.ry?this.ry:this.defaultRy)-0;
},resize:function(){
this._resize();
},createGraphics:function(){
var rx=(typeof this._rx!="undefined")?this._rx:this._r;
var ry=(typeof this._ry!="undefined")?this._ry:this._r;
var _2="<ellipse"+" rx=\""+rx+"\""+" ry=\""+ry+"\"/>";
this.domNode.innerHTML=this._header+_2+this._footer;
this._shape=dojo.query("ellipse",this.domNode)[0];
this._g=dojo.query("g.shapeg",this.domNode)[0];
this._svgroot=dojo.query("svg",this.domNode)[0];
this._svgroot.style.verticalAlign="top";
this._svgroot.style.overflow="visible";
}});
});
