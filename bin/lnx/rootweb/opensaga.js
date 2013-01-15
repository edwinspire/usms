/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready", "dojo/window"], function(ready){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here
var ContentPage = dijit.byId("idContentPageMaster");

function AdjustheightContentPage(){
var h = dojo.window.getBox().h-dojo.style('idHeader', 'height')-dojo.style('idmenubar', 'height')-5;
ContentPage.size("100%", h+"px");
}

dojo.connect(dojo.byId('opensaga_menuitem_login'), 'onclick', function(){
ContentPage.url("opensagalogin.html");
});

dojo.connect(dojo.byId('opensaga_menuitem_logout'), 'onclick', function(){
ContentPage.url("opensagalogout.html");
});

dojo.connect(dojo.byId('opensaga_menuitem_eventmonitor'), 'onclick', function(){
ContentPage.url("opensagaeventmonitor.html");
});

dojo.connect(dojo.byId('opensaga_menuitem_accounts'), 'onclick', function(){
ContentPage.url("opensaga_account.html");
});

dojo.connect(dojo.byId('opensaga_menuitem_maintenance'), 'onclick', function(){
ContentPage.url("opensaga_maintenance.html");
});



dojo.connect(dojo.byId('opensaga_menuitem_admins'), 'onclick', function(){
alert('En construccion');
});

dojo.connect(dojo.byId('opensaga_menuitem_groups'), 'onclick', function(){
ContentPage.url("opensaga_groups.html");
});

dojo.connect(dojo.byId('opensaga_menuitem_formatNotif'), 'onclick', function(){
ContentPage.url("opensaga_FormatNotif.html");
});

dojo.connect(dojo.byId('opensaga_menuitem_modelpanel'), 'onclick', function(){
ContentPage.url("opensaga_panelmodel.html");
});

dojo.connect(dojo.byId('opensaga_menuitem_eventTypes'), 'onclick', function(){
ContentPage.url("opensaga_eventtypes.html");
});

dojo.connect(dojo.byId('opensaga_menuitem_keywords'), 'onclick', function(){
ContentPage.url("opensaga_keywords.html");
});

dojo.connect(dojo.byId('opensaga_menuitem_usms'), 'onclick', function(){
window.open('usms.html','_blank');
});

dojo.connect(dojo.byId('opensaga_menuitem_aboutopensaga'), 'onclick', function(){
alert('En construccion');
});

dojo.connect(dojo.byId('opensaga_menuitem_tutoOpenSAGA'), 'onclick', function(){
alert('En construccion');
});

dojo.connect(dojo.byId('opensaga_menuitem_tutouSMS'), 'onclick', function(){
alert('En construccion');
});

//

dojo.connect(dojo.global, 'onresize', function(){
AdjustheightContentPage();
});


AdjustheightContentPage();
ContentPage.start().url("opensagaeventmonitor.html");


     });
});
