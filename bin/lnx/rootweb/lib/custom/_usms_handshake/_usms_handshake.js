define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usms_handshake/_usms_handshake.html'
],function(declare,_Widget,_Templated,templateString){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
postCreate: function(){
var t = this;
t.handshake.on('Change', function(){
t.emit('Change', {});
});
},
_setValueAttr: function(v){
this.handshake.set('value', String(v));
},
_getValueAttr: function(){
r = this.handshake.get('value');
//console.log(r);
return r;
}


   
});
});
