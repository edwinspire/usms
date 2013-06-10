define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usaga_menu_header/_usaga_menu_header.html'
],function(declare,_Widget,_Templated,templateString){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
postCreate: function(){

var t = this;

t.idmlogin.on('Click', function(){
window.open("usaga_login.html", '_self');
});

t.idmlogout.on('Click', function(){
window.open("/", '_self');
});

t.idmeventmonitor.on('Click', function(){
window.open('usaga_eventmonitor.html','_self');
});

t.idmaccountedit.on('Click', function(){
window.open("usaga_account.html",'_self');
});

t.idmaccountmante.on('Click', function(){
window.open("usaga_maintenance.html",'_self');
});

t.idmadm.on('Click', function(){
alert('En construccion');
});

t.idmgroups.on('Click', function(){
window.open("usaga_groups.html",'_self');
});

t.idmformatnotify.on('Click', function(){
window.open("usaga_FormatNotif.html",'_self');
});

t.idmpanelmodel.on('Click', function(){
window.open("usaga_panelmodel.html",'_self');
});

t.idmeventtypes.on('Click', function(){
window.open("usaga_eventtypes.html",'_self');
});

t.idmkeywords.on('Click', function(){
window.open("usaga_keywords.html",'_self');
});

t.idmusms.on('Click', function(){
window.open('usms.html','_blank');
});

t.idmaboutusaga.on('Click', function(){
alert('En construccion');
});

t.idmtutousaga.on('Click', function(){
alert('En construccion');
});

}   


   
});
});
