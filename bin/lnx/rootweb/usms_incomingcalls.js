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
"dojox/xml/DomParser",
'dojo/store/Memory',
"dojo/Evented",
"dojo/data/ItemFileReadStore",
"dojo/data/ItemFileWriteStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async",
	'gridx/modules/Focus',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
  "dijit/form/NumberTextBox",
"gridx/modules/VirtualVScroller",
"dojox/grid/cells/dijit",
"dojox/data/XmlStore"
], function(ready, on, request, RXml, jsDTb, DomParser, Memory, Evented, ItemFileReadStore, ItemFileWriteStore, Grid, Async, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here

/////////////////
///// BASIC /////
// Account basic elements
jsDTb.addGetDateFunction(dijit.byId('datestart'));
jsDTb.addGetDateFunction(dijit.byId('dateend'));

var GridCalls = dijit.byId('gridxcallin');

dojo.connect(dijit.byId('buttonsend'), 'onClick', function(e){
GridCalls.Load();
});

	if (GridCalls) {
/*
// Captura el evento cuando se hace click en una fila
dojo.connect(GridCalls, 'onRowClick', function(event){
//alert(this.cell(event.rowId, 2, true).data());
CP.IdPhone = this.cell(event.rowId, 2, true).data();
});
*/
		// Optionally change column structure on the grid
		GridCalls.setColumns([
			{field:"idincall", name: "id", width: '20px'},
			{field:"datecall", name: "datecall"},
			{field:"idport", name: "idport", width: '20px'},
			{field:"idphone", name: "idphone"},
			{field:"callaction", name: "callaction"},
			{field:"phone", name: "phone"},
			{field:"idmodem", name: "idmodem"},
			{field:"flag1", name: "f1"},
			{field:"flag2", name: "f2"},
			{field:"flag3", name: "f3"},
			{field:"flag4", name: "f4"},
			{field:"flag5", name: "f5"},
			{field:"note", name: "note"}
		]);
GridCalls.startup();
}




GridCalls.Load= function(){
//GridCalls.selected = [];
            // Request the text file
            request.get("view_incomingcalls_xml.usms", {
	query: {datestart: dijit.byId('datestart')._getDate(), dateend: dijit.byId('dateend')._getDate()},
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
idincall: d.getNumber(i, "idincall"),
datecall: d.getString(i, "datecall"),
idport: d.getNumber(i, "idport"),
idphone: d.getNumber(i, "idphone"),
idmodem: d.getNumber(i, "idmodem"),
callaction: d.getNumber(i, "callaction"),
phone: d.getStringFromB64(i, "phone"),
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

		GridCalls.store = null;
		GridCalls.setStore(ItemFileReadStore_1);

//GridCalls.emit('onnotify', {msg: 'Se han cargado los datos'});

                },
                function(error){
                    // Display the error returned
GridCalls.emit('onnotify', {msg: error});
                }
            );


}



     });
});
