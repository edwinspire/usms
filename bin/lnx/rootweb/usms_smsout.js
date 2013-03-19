	/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */

// modules:['gridx/modules/Focus', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/VirtualVScroller']

require(["dojo/ready",  
"dojo/on",
'dojo/store/Memory',
"dojo/Evented",
"dojo/data/ItemFileReadStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async",
	'gridx/modules/Focus',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
  "dijit/form/NumberTextBox",
"gridx/modules/VirtualVScroller",
"dojox/grid/cells/dijit",
"dojox/data/XmlStore"
], function(ready, on, Memory, Evented, ItemFileReadStore, Grid, Async, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here

dojo.connect(dojo.byId('send'), 'onclick', function(){
LoadGrid();
});


var ObjectTable = {
RowSeleted: 0 
} 


	var myGridX = dijit.byId("idgridxtable");
	if (myGridX) {


		// Optionally change column structure on the grid
		myGridX.setColumns([

			{field:"idsmsout", name: "id"},
			{field:"dateload", name: "dateload", width: "5%"},
			{field:"idprovider", name: "idprovider"},
			{field:"idsmstype", name: "idsmstype"},
			{field:"idphone", name: "idphone"},
			{field:"phone", name: "phone"},
			{field:"datetosend", name: "datetosend", width: "5%"},
			{field:"message", name: "message", width: "15%"},
			{field:"dateprocess", name: "dateprocess", width: "5%"},
			{field:"process", name: "process"},
			{field:"priority", name: "priority"},
			{field:"attempts", name: "attempts"},
			{field:"idprovidersent", name: "idprovidersent"},
			{field:"slices", name: "slices"},
			{field:"slicessent", name: "slicessent"},
			{field:"messageclass", name: "messageclass"},
			{field:"report", name: "report"},
			{field:"maxslices", name: "maxslices"},
			{field:"enablemessageclass", name: "enablemessageclass"},
			{field:"idport", name: "idport"},
			{field:"flag1", name: "flag1"},
			{field:"flag2", name: "flag2"},
			{field:"flag3", name: "flag3"},
			{field:"flag4", name: "flag4"},
			{field:"flag5", name: "flag5"},
			{field:"retryonfail", name: "retryonfail"},
			{field:"maxtimelive", name: "maxtimelive"},
			{field:"note", name: "note", width: "10%"}
		]);

myGridX.startup();


}


function LoadGrid(){

var store = new dojox.data.XmlStore({url: "usms_smsoutviewtablefilter", sendQuery: true, rootItem: 'row'});

var request = store.fetch({query: {fstart: getdate('fstart'), fend: getdate('fend'), nrows: dijit.byId('nrows').get('value')}, onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};

var i = 0;
while(i<numrows){

myData.items[i] = {
unique_id:i, 
idsmsout: dataxml.getNumber(i, "idsmsout"), 
dateload: dataxml.getString(i, "dateload"),
idprovider: dataxml.getNumber(i, "idprovider"),
idsmstype: dataxml.getNumber(i, "idsmstype"),
idphone: dataxml.getNumber(i, "idphone"),
phone: dataxml.getStringB64(i, "phone"),
datetosend: dataxml.getString(i, "datetosend"),
message: dataxml.getStringB64(i, "message"),
dateprocess: dataxml.getString(i, "dateprocess"),
process: dataxml.getNumber(i, "process"),
priority: dataxml.getNumber(i, "priority"),
attempts: dataxml.getNumber(i, "attempts"),
idprovidersent: dataxml.getNumber(i, "idprovidersent"),
slices: dataxml.getNumber(i, "slices"),
slicessent: dataxml.getNumber(i, "slicessent"),
messageclass: dataxml.getNumber(i, "messageclass"),
report: dataxml.getBool(i, "report"),
maxslices: dataxml.getNumber(i, "maxslices"),
enablemessageclass: dataxml.getBool(i, "enablemessageclass"),
idport: dataxml.getNumber(i, "idport"),
flag1: dataxml.getNumber(i, "flag1"),
flag2: dataxml.getNumber(i, "flag2"),
flag3: dataxml.getNumber(i, "flag3"),
flag4: dataxml.getNumber(i, "flag4"),
flag5: dataxml.getNumber(i, "flag5"),
retryonfail: dataxml.getNumber(i, "retryonfail"),
maxtimelive: dataxml.getNumber(i, "maxtimelive"),
note: dataxml.getStringB64(i, "note")
};
i++;
}

	// Set new data on data store (the store has jsId set, so there's
	// a global variable we can reference)
	ItemFileReadStore_1.clearOnClose = true;
	ItemFileReadStore_1.data = myData;
	ItemFileReadStore_1.close();

		myGridX.store = null;
		myGridX.setStore(ItemFileReadStore_1);
},
onError: function(e){
alert(e);
}
});

}

// Se hace este timeout porque la pagina demora en crearse y al cargar no muestra nada.
//setTimeout(LoadGrid, 5000);



function getdate(iddijit){
return dojo.date.locale.format(dijit.byId(iddijit).get('value'), {datePattern: "yyyy-MM-dd", selector: "date"});
}









     });
});


