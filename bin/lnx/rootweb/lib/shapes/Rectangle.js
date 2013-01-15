//>>built
define("shapes/Rectangle",["dojo/_base/declare","shapes/_Shape","shapes/_RectMixin"],function(_1,_2,_3){
return _1("shapes.Rectangle",[_2,_3],{width:null,defaultWidth:"80",height:null,defaultHeight:"80",cornerRadius:"0",buildRendering:function(){
this.inherited(arguments);
this.createGraphics();
}});
});
