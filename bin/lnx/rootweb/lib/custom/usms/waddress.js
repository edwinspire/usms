define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!./waddress.html'
],function(declare,_Widget,_Templated,templateString, on){

 return declare('usms.waddress',[ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
reset: function(){
this.resetForm();
this.idaddress = 0;
},   
resetForm: function(){
this.idform.reset();
},
idaddress: 0,
ts: '1990-01-01',
idlocation: '0',
_setIdAddressAttr: function(id) {
        // Using our avatarNode attach point, set its value
this.idaddress = id;
return this;
},
_getIdAddressAttr: function() {
        // Using our avatarNode attach point, get its value
return this.idaddress;
},
_settsAttr: function(ts) {
        // Using our avatarNode attach point, set its value
this.ts = ts;
return this;
},
_gettsAttr: function() {
        // Using our avatarNode attach point, get its value
return this.ts;
},
_setMainstreetAttr: function(ms) {
        // Using our avatarNode attach point, set its value
this.idps.set('value', ms);
return this;
},
_getMainstreetAttr: function() {
        // Using our avatarNode attach point, get its value
return this.idps.get('value');
},
_setSecundarystreetAttr: function(ss) {
        // Using our avatarNode attach point, set its value
this.idss.set('value', ss);
return this;
},
_getSecundarystreetAttr: function() {
        // Using our avatarNode attach point, get its value
return this.idss.get('value');
},
_setOtherAttr: function(o) {
        // Using our avatarNode attach point, set its value
this.ido.set('value', o);
return this;
},
_getOtherAttr: function() {
        // Using our avatarNode attach point, get its value
return this.ido.get('value');
},
_setNoteAttr: function(n) {
        // Using our avatarNode attach point, set its value
this.idn.set('value', n);
return this;
},
_getNoteAttr: function() {
        // Using our avatarNode attach point, get its value
return this.idn.get('value');
},
_setGeoxAttr: function(x) {
        // Using our avatarNode attach point, set its value
this.idgeox.set('value', x);
return this;
},
_getGeoxAttr: function() {
        // Using our avatarNode attach point, get its value
return this.idgeox.get('value');
},
_setGeoyAttr: function(y) {
        // Using our avatarNode attach point, set its value
this.idgeoy.set('value', y);
return this;
},
_getGeoyAttr: function() {
        // Using our avatarNode attach point, get its value
return this.idgeoy.get('value');
}




});
});
