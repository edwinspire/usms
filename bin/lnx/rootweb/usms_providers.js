	/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */

// modules:['gridx/modules/Focus', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/VirtualVScroller']

require(["dojo/ready",  
"dojo/on",
'dojo/request', 
'jspire/request/Xml',
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
], function(ready, on, request, RXml, ItemFileWriteStore, Grid, Async, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here

var NotifyMSG = dijit.byId('notify');

var gridxprovider = dijit.byId('gridxprovider');
gridxprovider.selected = [];

dijit.byId('id_dialog_delete').dijitOwner(dijit.byId('delete'), 'Click').on('onok', function(){
gridxprovider.delete();
});

var dNew = dijit.byId('id_dialog_new');
dNew.byes.set('label', 'Aplicar');
dNew.bno.set('label', 'Cancelar');
dNew.innerHTML('jjjjjjjjjjjjjjjjjjjj');


dNew.dijitOwner(dijit.byId('new'), 'Click').on('onok', function(){
//gridxprovider.ApplyNotifyToSelection();
});

gridxprovider.on('onnotify', function(m){
NotifyMSG.notify({message: m.msg});
});

	if (gridxprovider) {

		// Optionally change column structure on the grid
		gridxprovider.setColumns([
			{field:"unique_id", name: "#", width: '20px'},
			{field:"enable", name: "*", width: '20px', editable: 'true'},
			{field:"cimi", name: "cimi", editable: 'true'},
			{field:"name", name: "Proveedor", editable: 'true'},
			{field:"note", name: "Nota" , editable: 'true'}
		]);
gridxprovider.startup();
}

gridxprovider.delete = function(){
if(gridxprovider.selected.length>0){

   request.post('provider_delete.usms', {
		data: {idproviders: gridxprovider.selected.toString()},
            handleAs: "xml"
        }).then(
                function(response){

var d = new RXml.getFromXhr(response, 'row');

if(d.length > 0){
gridxprovider.emit('notify_message', {message: d.getStringFromB64(0, 'outpgmsg')}); 
}

gridxprovider._Load();
                },
                function(error){
                    // Display the error returned
gridxprovider.emit('notify_message', {message: error}); 
                }
            );

}else{
NotifyArea.notify({message: 'No hay teléfonos seleccionados para aplicar los cambios'});
}
}

dijit.byId('getdata').on('Click', function(){
gridxprovider._Load();
});

dojo.connect(gridxprovider.select.row, 'onSelectionChange', function(selected){
gridxprovider.selected = [];
var numsel = selected.length;
i = 0;
while(i<numsel){
// Aqui buscamos los datos desde el store y no desde la celda, agregamos el idphone al array
gridxprovider.store.fetch({query: {unique_id: selected[i]}, onItem: function(item){
gridxprovider.selected[i] = gridxprovider.store.getValue(item, 'idprovider');
} 
});
i++;
}
});


	dojo.connect(ItemFileWriteStore_1, 'onSet', function(item, attribute, oldValue, newValue){
gridxprovider._Save(item);
});


gridxprovider._Load= function(){
gridxprovider.selected = [];
            // Request the text file
            request.get("viewprovidertable_xml.usms", {
            // Parse data from xml
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
idprovider: d.getNumber(i, "idprovider"),
cimi: d.getStringFromB64(i, "cimi"),
enable: d.getBool(i, "enable"),
name: d.getStringFromB64(i, "name"),
note: d.getStringFromB64(i, "note"),
ts: d.getString(i, "ts")
};
i++;
}
}

/*
myData.items[i] = {
unique_id:i+1,
idprovider: 0,
cimi: '',
enable: true,
name: '',
note: '',
ts: '1990-01-01'
};
*/

ItemFileWriteStore_1.clearOnClose = true;
	ItemFileWriteStore_1.data = myData;
	ItemFileWriteStore_1.close();

		gridxprovider.store = null;
		gridxprovider.setStore(ItemFileWriteStore_1);

//gridxprovider.emit('onnotify', {msg: 'Se han cargado los datos'});

                },
                function(error){
                    // Display the error returned
gridxprovider.emit('onnotify', {msg: error});
                }
            );


}

gridxprovider._Save= function(item){

            // Request the text file
            request.post("providereditxml.usms", {
            // Parse data from xml
	data: item,
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');
var myData = {identifier: "unique_id", items: []};
var i = 0;
numrows = d.length;
if(numrows > 0){

gridxprovider.emit('onnotify', {msg: d.getStringFromB64(0, "outpgmsg")});

}

gridxprovider._Load();
                },
                function(error){
                    // Display the error returned
gridxprovider.emit('onnotify', {msg: error});
                }
            );


}

// Se hace este timeout porque la pagina demora en crearse y al cargar no muestra nada.
setTimeout(gridxprovider._Load, 2000);


     });
});
