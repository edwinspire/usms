define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usms_stopbits/_usms_stopbits.html'
],function(declare,_Widget,_Templated,templateString){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
postCreate: function(){
var t = this;
t.stopbits.on('Change', function(){
t.emit('Change', {});
});
},
_setValueAttr: function(v){
this.stopbits.set('value', String(v));
},
_getValueAttr: function(){
r = this.stopbits.get('value');
//console.log(r);
return r;
}   
});
});
