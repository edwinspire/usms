//>>built
define("shapes/Circle",["dojo/_base/declare","shapes/_Shape","shapes/_CircleMixin"],function(_1,_2,_3){
return _1("shapes.Circle",[_2,_3],{rx:null,defaultRx:"40",ry:null,defaultRy:"40",buildRendering:function(){
this.inherited(arguments);
this.createGraphics();
}});
});
