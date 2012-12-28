
require(["dojo/ready"], function(ready){
     ready(function(){

  var formpg = dojo.byId("idformFiltro");
  dojo.connect(formpg, "onsubmit", 'GetSMSOutTable');

//	var myGridX = dijit.byId("idsmsouttable");
//myGridX.vScroller.buffSize = 2;
//myGridX.autoHeight = true;
//myGridX.column(1).sort(true);
//myGridX.sort.sort([{ colId: 'idsmsout', descending: true }, { colId: 'idphone', descending: false }]);
	var myGridX = dijit.byId("idsmsouttable");
	if (myGridX) {

/*
dojo.connect(myGridX, 'onCellClick', function(evt){
     var cell = myGridX.cell(evt.rowId, evt.columnId, true); //get cell by row id and column id
     var cellData = cell.data();
alert(evt.rowId+': '+evt);
});
*/

		// Optionally change column structure on the grid
		myGridX.setColumns([

			{field:"idsmsout", name: "id",  width: '25px'},
			{field:"dateload", name: "dateload",  width: '30px'},
			{field:"idprovider", name: "idprovider",  width: '40px'},
			{field:"idsmstype", name: "idsmstype",  width: '25px'},
			{field:"idphone", name: "idphone",  width: '25px'},
			{field:"phone", name: "phone", width: '75px'},
			{field:"datetosend", name: "datetosend",  width: '40px'},
			{field:"message", name: "message", width: '150px'},
			{field:"dateprocess", name: "dateprocess",  width: '40px'},
			{field:"process", name: "process",  width: '25px'},

			{field:"priority", name: "priority",  width: '25px'},
			{field:"attempts", name: "attempts",  width: '25px'},
			{field:"idprovidersent", name: "idprovidersent",  width: '25px'},
			{field:"slices", name: "slices",  width: '25px'},
			{field:"slicessent", name: "slicessent",  width: '25px'},
			{field:"messageclass", name: "messageclass",  width: '25px'},
			{field:"report", name: "report", dataType: "boolean",  width: '25px'},
			{field:"maxslices", name: "maxslices"},
			{field:"enablemessageclass", name: "enablemessageclass"},
			{field:"idport", name: "idport",  width: '25px'},
			{field:"flag1", name: "flag1",  width: '25px'},
			{field:"flag2", name: "flag2",  width: '25px'},
			{field:"flag3", name: "flag3",  width: '25px'},
			{field:"flag4", name: "flag4",  width: '25px'},
			{field:"flag5", name: "flag5",  width: '25px'},
			{field:"retryonfail", name: "retryonfail",  width: '25px'},
			{field:"maxtimelive", name: "maxtimelive",  width: '25px'},
			{field:"note", name: "note", width: '150px'}
		]);

myGridX.startup();


}

SizeContent();

     });
});



// Ajusta el tamaño de la tabla adecuadamente
function SizeContent(){
//alert(document.getElementById("idcontentgrid").offsetWidth+' '+document.getElementById("idcontentgrid").offsetHeight);
//alert(document.getElementById("idpaneFiltro").offsetWidth+' '+document.getElementById("idpaneFiltro").offsetHeight);
var Tabla = dojo.byId("idConGridx");
dojo.style(Tabla, "height", (document.getElementById("idcontentAll").offsetHeight-document.getElementById("idpaneFiltro").offsetHeight-5)+'px');
}

function XmlToStore(xmldata){

	var store = ItemFileReadStore_1;

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var i = 0;
var rowscount = xmldata.length;
//alert(rowscount);
while(i<rowscount){
/*
idsmsout 
  dateload 
  idprovider 
  idsmstype 
  idphone 
  phone 
  datetosend 
  message 
  dateprocess
  process 
  note 
  priority 
  attempts 
  idprovidersent 
  slices 
  slicessent 
  messageclass 
  report 
  maxslices 
  enablemessageclass 
  idport 
  flag1 
  flag2 
  flag3 
  flag4 
  flag5 
  retryonfail 
  maxtimelive 
 
*/
myData.items[i] = {
unique_id:i, 
idsmsout: xmldata[i].getAttribute("idsmsout"), 
dateload: xmldata[i].getAttribute("dateload"),
idprovider: xmldata[i].getAttribute("idprovider"),
idsmstype: xmldata[i].getAttribute("idsmstype"),
idphone: xmldata[i].getAttribute("idphone"),
phone: Base64.decode(xmldata[i].getAttribute("phone")),
datetosend: xmldata[i].getAttribute("datetosend"),
message: Base64.decode(xmldata[i].getAttribute("message")),
dateprocess: xmldata[i].getAttribute("dateprocess"),
process: xmldata[i].getAttribute("process"),
priority: xmldata[i].getAttribute("priority"),

attempts: xmldata[i].getAttribute("attempts"),
idprovidersent: xmldata[i].getAttribute("idprovidersent"),
slices: xmldata[i].getAttribute("slices"),
slicessent: xmldata[i].getAttribute("slicessent"),
messageclass: xmldata[i].getAttribute("messageclass"),
report: xmldata[i].getAttribute("report"),
maxslices: xmldata[i].getAttribute("maxslices"),
enablemessageclass: xmldata[i].getAttribute("enablemessageclass"),
idport: xmldata[i].getAttribute("idport"),
flag1: xmldata[i].getAttribute("flag1"),
flag2: xmldata[i].getAttribute("flag2"),
flag3: xmldata[i].getAttribute("flag3"),
flag4: xmldata[i].getAttribute("flag4"),
flag5: xmldata[i].getAttribute("flag5"),
retryonfail: xmldata[i].getAttribute("retryonfail"),
maxtimelive: xmldata[i].getAttribute("maxtimelive"),
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
function GetSMSOutTable(event){
    // Stop the submit event since we want to control form submission.
    dojo.stopEvent(event);
    // The parameters to pass to xhrPost, the form, how to handle it, and the callbacks.
    // Note that there isn't a url passed.  xhrPost will extract the url to call from the form's
    //'action' attribute.  You could also leave off the action attribute and set the url of the xhrPost object
    // either should work.
    var xhrArgs = {
      form: dojo.byId("idformFiltro"),
      handleAs: "text",
      load: function(data){

  var datar = dojox.xml.DomParser.parse(data);
//alert(datar);
var DataStore = XmlToStore(datar.byName('row'));
//alert(datar);
	// Get reference to our grid object. I set the id to "GridX" using
	// the Maqetta properties palette.
	var myGridX = dijit.byId("idsmsouttable");
	if (myGridX) {
		// Tell our grid to reset itself
		myGridX.store = null;
		myGridX.setStore(DataStore);
//myGridX.startup();
	}

///        dojo.byId("response").innerHTML = "Form posted.";
      },
      error: function(error){
        // We'll 404 in the demo, but that's okay.  We don't have a 'postIt' service on the
        // docs server.
	var myGridX = dijit.byId("idsmsouttable");
	if (myGridX) {
		// Tell our grid to reset itself
		myGridX.store = null;
	myGridX.setStore(null);
}
alert(error);
   //     dojo.byId("response").innerHTML = "Form posted.";
      }
    }
    // Call the asynchronous xhrPost
    var deferred = dojo.xhrPost(xhrArgs);
//  return false;
}

