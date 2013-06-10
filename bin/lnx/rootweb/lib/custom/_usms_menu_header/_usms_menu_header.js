define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usms_menu_header/_usms_menu_header.html'
],function(declare,_Widget,_Templated,templateString){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
postCreate: function(){

var t = this;

t.menu_system_loging.on('Click', function(){
window.open("usms.html", '_self');
});

t.menu_system_logout.on('Click', function(){
window.open("usms.html", '_self');
});

t.menu_system_status.on('Click', function(){
window.open("usms_status.html", '_self');
});

t.menu_config_postgresql.on('Click', function(){
window.open("usms_pg_conf.html", '_self');
});

t.menu_config_ports.on('Click', function(){
window.open("usms_ports_conf.html", '_self');
});

t.menu_config_location.on('Click', function(){
window.open("usms_locations.html", '_self');
});

t.menu_config_providers.on('Click', function(){
window.open("usms_providers.html", '_self');
});

t.menu_call_in.on('Click', function(){
window.open("usms_incomingcalls.html", '_self');
});

t.menu_sms_in.on('Click', function(){
window.open("usms_smsin.html", '_self');
});

t.menu_sms_out.on('Click', function(){
window.open("usms_smsout.html", '_self');
});

t.menu_contacts_edit.on('Click', function(){
window.open("usms_contacts.html", '_self');
});

t.menu_config_sim.on('Click', function(){
window.open("usms_sim_conf.html", '_self');
});



/*
t.menu_providers.on('Click', function(){
window.open("usms_providers.html", '_self');
});

t.menu_whitelist.on('Click', function(){
window.open("usms_whitelist.html", '_self');
});

t.menu_blacklist.on('Click', function(){
window.open("usms_blacklist.html", '_self');
});



t.menu_sms_send.on('Click', function(){
window.open("usms_send.html", '_self');
});

t.menu_sms_sendm.on('Click', function(){
window.open("usms_sendm.html", '_self');
});



t.menu_about.on('Click', function(){
window.open("usms_acercade.html", '_self');
});
*/



}   





   
});
});
