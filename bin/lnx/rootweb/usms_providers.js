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


	dojo.connect(ItemFileWriteStore_1, 'onSet', function(item, attribute, oldValue, newValue){
//alert('Edita '+ item.idnotiftempl);
SaveData(item);
});

var GridCalls = dijit.byId('gridxprovider');

	if (GridCalls) {

		// Optionally change column structure on the grid
		GridCalls.setColumns([
			{field:"enable", name: "*", width: '20px', editable: 'true'},
			{field:"idprovider", name: "id", width: '20px'},
			{field:"cimi", name: "cimi", editable: 'true'},
			{field:"name", name: "Proveedor", editable: 'true'},
			{field:"note", name: "Nota" , editable: 'true'}
		]);
GridCalls.startup();
}


function SaveData(item){

  // The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
  var xhrArgs = {
    url: "providereditxml.usms",
    content: item,
    handleAs: "xml",
    load: function(dataX){

var xmld = new jspireTableXmlDoc(dataX, 'row');

if(xmld.length > 0){

alert(xmld.getStringB64(0, 'outpgmsg'));


}

LoadGrid();

    },
    error: function(errorx){
alert(errorx);
    }
  }
  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}

function LoadGrid(){

var store = new dojox.data.XmlStore({url: "usms_viewprovidertable_xml", sendQuery: true, rootItem: 'row'});

var request = store.fetch({onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};

var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id:i,
idprovider: dataxml.getNumber(i, "idprovider"),
cimi: dataxml.getStringB64(i, "cimi"),
enable: dataxml.getBool(i, "enable"),
name: dataxml.getStringB64(i, "name"),
note: dataxml.getStringB64(i, "note"),
ts: dataxml.getString(i, "ts")
};
i++;
}


myData.items[i] = {
unique_id:i,
idprovider: 0,
cimi: '',
enable: true,
name: '',
note: '',
ts: '1990-01-01'
};

ItemFileWriteStore_1.clearOnClose = true;
	ItemFileWriteStore_1.data = myData;
	ItemFileWriteStore_1.close();

		GridCalls.store = null;
		GridCalls.setStore(ItemFileWriteStore_1);

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
