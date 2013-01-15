/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready"], function(ready){
     ready(function(){

var ContentPage = dijit.byId("idContentPageMaster");

function AdjustheightContentPage(){
var h = dojo.window.getBox().h-dojo.style('idHeader', 'height')-dojo.style('idmenubar', 'height')-5;
ContentPage.size("100%", h+"px");
}

dojo.connect(dojo.byId('menu_contacts_edit'), 'onclick', function(){
ContentPage.url('usms_contacts.html');
});

dojo.connect(dojo.byId('menu_ports'), 'onclick', function(){
ContentPage.url('usms_serialport.html');
});

dojo.connect(dojo.byId('menu_sms_out'), 'onclick', function(){
ContentPage.url('usms_smsout.html');
});

dojo.connect(dojo.byId('menu_system_status'), 'onclick', function(){
ContentPage.url('usms_status.html');
});

dojo.connect(dojo.byId('menu_call_in'), 'onclick', function(){
ContentPage.url('usms_incomingcalls.html');
});

dojo.connect(dojo.global, 'onresize', function(){
AdjustheightContentPage();
});






AdjustheightContentPage();
ContentPage.start().url("usms_status.html");

     });
});



function dialog_postgres_cnx(){

// Create a new instance of dijit.Dialog
var myDialog = new dijit.Dialog({
    // The dialog's title
    title: "PostgreSQL",
    // The dialog's content
    content: '<object style= "width: 300px; height: 300px;" data="usms_postgres_cnx.html"></object>'
    // Hard-code the dialog width
//    style: "width: auto; height: 300px;"
});
myDialog.startup();
myDialog.show();

}


function DialogNoImplemented(){
alert('No implementado');
}

function DialogAbout(){
// Create a new instance of dijit.Dialog
var myDialog = new dijit.Dialog({
    // The dialog's title
    title: "Acerca de",
    // The dialog's content
    content: ' <object style= "width: 150px; height: 150px;" data="acercade.html"></object>'
    // Hard-code the dialog width
//    style: "width: 250px; height: 100px;"
});
myDialog.startup();
myDialog.show();
}

