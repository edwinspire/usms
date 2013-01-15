	/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */

// modules:['gridx/modules/Focus', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/VirtualVScroller']

require(["dojo/ready",  
"dojo/on",
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
], function(ready, on, DomParser, Memory, Evented, ItemFileReadStore, ItemFileWriteStore, Grid, Async, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here

/////////////////
///// BASIC /////
// Account basic elements

var GridCalls = dijit.byId('gridxnotif');

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
			{field:"idnotiftempl", name: "id", width: '20px'},
			{field:"description", name: "Descripción"},
			{field:"message", name: "Mensaje"}
		]);
GridCalls.startup();
}


function LoadGrid(){

var store = new dojox.data.XmlStore({url: "opensagagetviewnotificationtemplates", sendQuery: true, rootItem: 'row'});

var request = store.fetch({onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id:i,
idnotiftempl: dataxml.getNumber(i, "idnotiftempl"),
description: dataxml.getStringB64(i, "description"),
message: dataxml.getStringB64(i, "message"),
ts: dataxml.getString(i, "ts")
};
i++;
}

ItemFileWriteStore_1.clearOnClose = true;
	ItemFileWriteStore_1.data = myData;
	ItemFileWriteStore_1.close();

		GridCalls.store = null;
		GridCalls.setStore(ItemFileWriteStore_1);
//GridCalls.startup();
//alert('ok');
},
onError: function(e){
alert(e);
}
});

}

// Se hace este timeout porque la pagina demora en crearse y al cargar no muestra nada.
setTimeout(LoadGrid, 5000);













     });
});
