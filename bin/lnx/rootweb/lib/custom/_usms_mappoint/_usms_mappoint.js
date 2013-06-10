define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usms_mappoint/_usms_mappoint.html',
'dijit/Tooltip',
'dojo/dom-attr',
"dojo/dom-style"
],function(declare,_Widget,_Templated,templateString, Tooltip, domAttr, domStyle){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
baseUrl: '/lib/custom/_usms_mappoint/media/',
_image: 'flag-3.png',
_pathImage: function(){
return this.baseUrl+this._image;
},
_setImageAttr: function(img){
this._image = img;
domAttr.set(this.image_point, "src", this._pathImage());
},
_imgVisible: true,
postCreate: function(){
var t = this;
setInterval(function(){
if(t._imgVisible){
domStyle.set(t.image_point, "opacity", 0);
}else{
domStyle.set(t.image_point, "opacity", 1);
}
t._imgVisible = !t._imgVisible;
},500);
},
setTooltip: function(title, labeltitle, content){

if(!labeltitle){
labeltitle = '';
}

if(!content){
content = '';
}


var html = ' <div style="font-size: 0.8em;">  <label style="font-weight: bold;">'+title+'</label>  <div>   <div style="margin: 2px;">    <label style="float: left; clear: both; font-weight: bold; margin-right: 5px;">'+labeltitle+'</label>    <div style="margin: 3px;">'+content+'</div>  </div> </div></div>'

    new Tooltip({
        connectId: [this.image_point],
        label: html
    });
}





   
});
});
