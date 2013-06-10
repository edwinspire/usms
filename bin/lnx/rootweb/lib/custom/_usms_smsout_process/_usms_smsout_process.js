define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usms_smsout_process/_usms_smsout_process.html'
],function(declare,_Widget,_Templated,templateString){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
postCreate: function(){
var t = this;
t.process.on('Change', function(){
t.emit('Change', {});
});
},
_setValueAttr: function(v){
this.process.set('value', String(v));
},
_getValueAttr: function(){
r = this.process.get('value');
//console.log(r);
return r;
}

   
});
});
