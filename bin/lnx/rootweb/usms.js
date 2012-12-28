/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready"], function(ready){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here
//alert("Hola");
//  dijit.byId('pqconx').set('Note','Esta partzzzzzzzzzzzzzzzze falla');
//PageStatus();
// Aqui llamamos a todas las funciones que requieran que dojo se haya cargado antes de funcionar.

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


function ShowLoading(){
var Contenedor = dojo.byId("loading_img");
Contenedor.show();
}

function HideLoading(){
var Contenedor = dojo.byId("loading_img");
Contenedor.hide();
}


function DialogNoImplemented(){
alert('No implementado');
}

function SetContentMaster(page){
alert(page);
//var Loading = dojo.byId("loading_img");
var Contenedor = dojo.byId("MasterContent");

dojo.style(Contenedor, "display", "none");
//dojo.style(Loading, "display", "block");

dojo.attr(Contenedor, "data", page);

dojo.style(Contenedor, "display", "block");
dojo.style(Contenedor, "width", "100%");

// Ajustamos al alto de la pagina
var espacio_iframe = 478;
var sizeheader = 78;
if (window.innerHeight){ 
   //navegadores basados en mozilla 
   espacio_iframe = window.innerHeight - sizeheader; 
}else{ 
   if (document.body.clientHeight){ 
      	//Navegadores basados en IExplorer, es que no tengo innerheight 
      	espacio_iframe = document.body.clientHeight - sizeheader;
   }
}
dojo.style(Contenedor, "height", espacio_iframe+'px');
//propiedadesPantalla();
//dojo.style(Contenedor, "height", "auto");
//dojo.style(Loading, "display", "none");
}

function PageSMSOut(){
SetContentMaster('usms_smsout.html');

}


function PageStatus(){
SetContentMaster('usms_status.html');
/*
var Loading = dojo.byId("loading_img");

//var content = dijit.byId("MasterContent");
//content.setContent('<embed style= "width: 100%; height: 90%;" src="usms_status.html"></embed>');
var Contenedor = dojo.byId("MasterContent");
dojo.style(Contenedor, "display", "none");
dojo.style(Loading, "display", "block");
dojo.attr(Contenedor, "src", "usms_status.html");
dojo.style(Contenedor, "display", "block");
dojo.style(Loading, "display", "none");
*/
}

function PagePorts(){
SetContentMaster('usms_serialport.html');
}

function PageContacts(){
SetContentMaster('usms_contacts.html');
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

