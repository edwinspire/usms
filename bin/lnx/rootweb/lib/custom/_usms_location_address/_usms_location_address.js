define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usms_location_address/_usms_location_address.html',
'dojo/dom-style'
],function(declare,_Widget,_Templated,templateString, domStyle){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
postCreate: function(){

var t = this;

domStyle.set(t.menubar.new.domNode, "display", "none");
t.titleaddress.set('label', 'Dirección');
t.titlelocation.set('label', 'Localización');

t.menubar.on('ondelete', function(){
t.delete();
});


t.menubar.on('onsave', function(){
t.save();
});


t.address.on('onloaddata', function(l){
t.location.set('location', l.idlocation);
t.resize();
});

t.address.on('onsavedata', function(e){
t.emit('onsave', e);
});

t.address.on('notify_message', function(m){
t.emit('onnotify', m)
});
t.location.on('notify_message', function(m){
t.emit('onnotify', m)
});

t.location.set('location', 0);
t.tab.startup();
t.tab.resize();
t.tab.layout();
},
_setIdaddressAttr: function(id){
//this.resize();
this.address.set('idaddress', id);
this.map.setAttribute('data', 'usms_map.usms?idaddress='+id);
},
resize: function(){
this.tab.resize();
this.tab.layout();
},
save: function(){
this.address.idlocation = this.location.get('location');
this.address.save();
},
delete: function(){
this.address.delete();
}



   
});
});
