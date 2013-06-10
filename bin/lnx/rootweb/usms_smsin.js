	/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */

// modules:['gridx/modules/Focus', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/VirtualVScroller']

require(["dojo/ready",  
"dojo/on",
'dojo/request', 
'jspire/request/Xml',
'jspire/form/DateTextBox',
"dojo/data/ItemFileReadStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async",
	'gridx/modules/Focus',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
  "dijit/form/NumberTextBox",
"gridx/modules/VirtualVScroller",
"dojox/grid/cells/dijit"
], function(ready, on, request, RXml, jsDTb, ItemFileReadStore, Grid, Async, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here

dojo.connect(dojo.byId('send'), 'onclick', function(){
myGridX.Load();
});

jsDTb.addGetDateFunction(dijit.byId('fstart'));
jsDTb.addGetDateFunction(dijit.byId('fend'));




	var myGridX = dijit.byId("idgridxtable");
	if (myGridX) {


		// Optionally change column structure on the grid
		myGridX.setColumns([

			{field:"idsmsin", name: "id"},
			{field:"dateload", name: "dateload", width: "5%"},
			{field:"idprovider", name: "idprovider"},
			{field:"idphone", name: "idphone"},
			{field:"phone", name: "phone"},
			{field:"datesms", name: "datesms", width: "5%"},
			{field:"message", name: "message", width: "15%"},
			{field:"idport", name: "idport"},
			{field:"status", name: "status"},
			{field:"flag1", name: "flag1"},
			{field:"flag2", name: "flag2"},
			{field:"flag3", name: "flag3"},
			{field:"flag4", name: "flag4"},
			{field:"flag5", name: "flag5"},
			{field:"note", name: "note", width: "10%"}
		]);

myGridX.startup();


}

myGridX.Load= function(){
            // Request the text file
            request.get("view_smsin_datefilter.usms", {
	query: {fstart: dijit.byId('fstart')._getDate(), fend: dijit.byId('fend')._getDate(), nrows: dijit.byId('nrows').get('value')},
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');
var myData = {identifier: "unique_id", items: []};
var i = 0;
numrows = d.length;
if(numrows > 0){
while(i<numrows){
myData.items[i] = {
unique_id:i+1,
idsmsin: d.getNumber(i, "idsmsin"), 
dateload: d.getString(i, "dateload"),
idprovider: d.getNumber(i, "idprovider"),
idphone: d.getNumber(i, "idphone"),
phone: d.getStringFromB64(i, "phone"),
datesms: d.getString(i, "datesms"),
message: d.getStringFromB64(i, "message"),
idport: d.getNumber(i, "idport"),
status: d.getNumber(i, "status"),
flag1: d.getNumber(i, "flag1"),
flag2: d.getNumber(i, "flag2"),
flag3: d.getNumber(i, "flag3"),
flag4: d.getNumber(i, "flag4"),
flag5: d.getNumber(i, "flag5"),
note: d.getStringFromB64(i, "note")
};
i++;
}
}
	ItemFileReadStore_1.clearOnClose = true;
	ItemFileReadStore_1.data = myData;
	ItemFileReadStore_1.close();

		myGridX.store = null;
		myGridX.setStore(ItemFileReadStore_1);

//myGridX.emit('onnotify', {msg: 'Se han cargado los datos'});

                },
                function(error){
                    // Display the error returned
myGridX.emit('onnotify', {msg: error});
                }
            );


}



function LoadGrid(){

var store = new dojox.data.XmlStore({url: "view_smsin_datefilter.usms", sendQuery: true, rootItem: 'row'});

var request = store.fetch({query: {fstart: getdate('fstart'), fend: getdate('fend'), nrows: dijit.byId('nrows').get('value')}, onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};

var i = 0;
while(i<numrows){

myData.items[i] = {
unique_id:i, 
idsmsin: dataxml.getNumber(i, "idsmsin"), 
dateload: dataxml.getString(i, "dateload"),
idprovider: dataxml.getNumber(i, "idprovider"),
idphone: dataxml.getNumber(i, "idphone"),
phone: dataxml.getStringB64(i, "phone"),
datesms: dataxml.getString(i, "datesms"),
message: dataxml.getStringB64(i, "message"),
idport: dataxml.getNumber(i, "idport"),
status: dataxml.getNumber(i, "status"),
flag1: dataxml.getNumber(i, "flag1"),
flag2: dataxml.getNumber(i, "flag2"),
flag3: dataxml.getNumber(i, "flag3"),
flag4: dataxml.getNumber(i, "flag4"),
flag5: dataxml.getNumber(i, "flag5"),
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










     });
});


