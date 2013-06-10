define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usms_parity/_usms_parity.html'
],function(declare,_Widget,_Templated,templateString){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
postCreate: function(){
var t = this;
t.parity.on('Change', function(){
t.emit('Change', {});
});
},
_setValueAttr: function(v){
this.parity.set('value', String(v));
},
_getValueAttr: function(){
r = this.parity.get('value');
//console.log(r);
return r;
}

   
});
});
