define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!./usms_header.html'
],function(declare,_Widget,_Templated,templateString){

 return declare('usms.usms_header',[ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
postCreate: function(){

var t = this;

t.menu_config.on('Click', function(){
window.open("usms_configure.html", '_self');
});

t.menu_ports.on('Click', function(){
window.open("usms_serialport.html", '_self');
});

t.menu_system_status.on('Click', function(){
window.open("usms_status.html", '_self');
});

t.menu_contacts_edit.on('Click', function(){
window.open("usms_contacts.html", '_self');
});

t.menu_call_in.on('Click', function(){
window.open("usms_incomingcalls.html", '_self');
});

t.menu_locations.on('Click', function(){
window.open("usms_locations.html", '_self');
});

t.menu_providers.on('Click', function(){
window.open("usms_providers.html", '_self');
});

t.menu_whitelist.on('Click', function(){
window.open("usms_whitelist.html", '_self');
});

t.menu_blacklist.on('Click', function(){
window.open("usms_blacklist.html", '_self');
});

t.menu_sms_in.on('Click', function(){
window.open("usms_smsin.html", '_self');
});

t.menu_sms_send.on('Click', function(){
window.open("usms_send.html", '_self');
});

t.menu_sms_sendm.on('Click', function(){
window.open("usms_sendm.html", '_self');
});

t.menu_sms_out.on('Click', function(){
window.open("usms_smsout.html", '_self');
});

t.menu_about.on('Click', function(){
window.open("usms_acercade.html", '_self');
});




}   













});
});
