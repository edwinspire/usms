
require(["dojo/ready"], function(ready){
     ready(function(){

dijit.byId("idfieldparity").options= [
                { label: "None", value: 0, selected: true },
                { label: "Odd", value: 1},
                { label: "Even", value: 2},
                { label: "Mark", value: 3},
                { label: "Space", value: 4}
            ]

dijit.byId("idfieldstb").options= [
                { label: "None", value: 0, selected: true },
                { label: "One", value: 1},
                { label: "Two", value: 2}
            ]

dijit.byId("idfieldhsk").options= [
                { label: "None", value: 0, selected: true },
                { label: "RTS_CTS", value: 1},
                { label: "XOnXOff", value: 2},
                { label: "DTR_DSR", value: 3}
            ]


//  var formpg = dojo.byId("idformrowsend");
  dojo.connect(dojo.byId("idformrowsend"), "onsubmit", 'SubmitFormRowSend');
  dojo.connect(dojo.byId("idfielddel"), "onclick", 'DeleteRow');

	var myGridX = dijit.byId("idtableserialport");
	if (myGridX) {

dojo.connect(myGridX, 'onCellClick', function(evt){
//     var cell = myGridX.cell(evt.rowId, evt.columnId, true); //get cell by row id and column id
//     var cellData = cell.data();
//alert(evt.rowId+': '+evt);
dijit.byId("idfieldid").set("value", myGridX.cell(evt.rowId, 1, true).data());
dijit.byId("idfieldenable").set("value", StringToBool(myGridX.cell(evt.rowId, 2, true).data()));
dijit.byId("idfieldport").set("value", myGridX.cell(evt.rowId, 3, true).data());
dijit.byId("idfieldbr").set("value", myGridX.cell(evt.rowId, 4, true).data());
dijit.byId("idfielddb").set("value", myGridX.cell(evt.rowId, 5, true).data());
dijit.byId("idfieldparity").setValue(myGridX.cell(evt.rowId, 6, true).data());
dijit.byId("idfieldstb").setValue(myGridX.cell(evt.rowId, 7, true).data());
dijit.byId("idfieldhsk").setValue(myGridX.cell(evt.rowId, 8, true).data());
dijit.byId("idfieldnote").set("value", myGridX.cell(evt.rowId, 9, true).data());
//dijit.byId("idfieldnote").set("value", myGridX.cell(evt.rowId, 10, true).data());

});


		// Optionally change column structure on the grid
		myGridX.setColumns([

			{field:"idport", name: "id", width: '20px'},
			{field:"enable", name: "enable", width: '40px'},
			{field:"port", name: "port", width: '75px'},
			{field:"baudrate", name: "baudrate", width: '60px'},
			{field:"databits", name: "databits", width: '60px'},
			{field:"parity", name: "parity", width: '60px'},
			{field:"stopbits", name: "stopbits", width: '60px'},
			{field:"handshake", name: "handshake", width: '60px'},
			{field:"note", name: "note"}
		]);
myGridX.startup();


}
// Carga la tabla junto con la pagina
LoadTableSerialPort();


     });
});




function XmlToStore(xmldata){

	var store = ItemFileReadStore_1;

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var i = 0;
var rowscount = xmldata.length;
//alert(rowscount);
while(i<rowscount){

myData.items[i] = {
unique_id:i, 
idport: xmldata[i].getAttribute("idport"), 
enable: xmldata[i].getAttribute("enable"),
port: Base64.decode(xmldata[i].getAttribute("port")),
baudrate: xmldata[i].getAttribute("baudrate"),
databits: xmldata[i].getAttribute("databits"),
parity: xmldata[i].getAttribute("parity"),
stopbits: xmldata[i].getAttribute("stopbits"),
handshake: xmldata[i].getAttribute("handshake"),
note: Base64.decode(xmldata[i].getAttribute("note"))
};
i++;
}

	// Set new data on data store (the store has jsId set, so there's
	// a global variable we can reference)
	store.clearOnClose = true;
	store.data = myData;
	store.close();

return store;
}




// Envia el formulario de PostgreSQL
function SubmitFormRowSend(event){
    // Stop the submit event since we want to control form submission.
    dojo.stopEvent(event);
InsertUpdateRow();
}

function DeleteRow(){
var idport = dijit.byId("idfieldid").attr("value");
if(idport > 0){
// Hacemos negativo el valor de idport para que en el servidor eso lo tome como borrar el registro
dijit.byId("idfieldid").set("value", idport*-1);
InsertUpdateRow();
}
dijit.byId("idformrowsend").reset();
}

// Envia el formulario de PostgreSQL
function InsertUpdateRow(){
    // Stop the submit event since we want to control form submission.

    var xhrArgs = {
      form: dojo.byId("idformrowsend"),
      handleAs: "text",
      load: function(data){
LoadTableSerialPort();
//alert('Enviado');

      },
      error: function(error){
alert(error);
      }
    }
    // Call the asynchronous xhrPost
    var deferred = dojo.xhrPost(xhrArgs);
//  return false;
}



// Carga el formulario de PostgreSQL
function LoadTableSerialPort(){
 // Look up the node we'll stick the text under.
//alert('Hola');
  // The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
  var xhrArgs = {
    url: "gettableserialport",
    handleAs: "text",
    load: function(datass){

  var datar = dojox.xml.DomParser.parse(datass);
//alert(datar);
var DataStore = XmlToStore(datar.byName('row'));
//alert(datar);
	// Get reference to our grid object. I set the id to "GridX" using
	// the Maqetta properties palette.
	var myGridX = dijit.byId("idtableserialport");
	if (myGridX) {
		// Tell our grid to reset itself
		myGridX.store = null;
		myGridX.setStore(DataStore);
	}

 
    },
    error: function(error){
//      targetNode.innerHTML = "An unexpected error occurred: " + error;
alert(error);

    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrGet(xhrArgs);
}
