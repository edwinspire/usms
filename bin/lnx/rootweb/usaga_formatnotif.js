	/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */

// modules:['gridx/modules/Focus', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/VirtualVScroller']

require(["dojo/ready",  
"dojo/on",
"dojo/Evented",
"dojo/data/ItemFileWriteStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async",
	'gridx/modules/Focus',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
  "dijit/form/NumberTextBox",
"gridx/modules/VirtualVScroller",
"jspire/request/Xml",
"dojox/grid/cells/dijit",
"dojox/data/XmlStore", 
"gridx/modules/RowHeader",
"gridx/modules/select/Row",
"gridx/modules/IndirectSelect",
"gridx/modules/extendedSelect/Row",
"dijit/TooltipDialog",
"dijit/popup"
], function(ready, on, Evented, ItemFileWriteStore, Grid, Async, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller, RXml){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here


var ObjectTable = {
IdToDelete: [] 
} 

var NotifyMSG = dijit.byId('id_notify_area');

//NotifyMSG.setText('Plantillas de notificaciones de alarma');




        var myDialog = dijit.byId('idDialogNew');

        dojo.connect(dojo.byId('new'), 'onclick', function(){
            dijit.popup.open({
                popup: myDialog,
                around: dojo.byId('new')
            });
        });

        dojo.connect(dojo.byId('newcancel'), 'onclick', function(){
dijit.popup.close(myDialog);
});

        dojo.connect(dojo.byId('newok'), 'onclick', function(){
dijit.popup.close(myDialog);
SaveData({idnotiftempl: 0, description: dijit.byId('newdescrip').get('value'), message: dijit.byId('newMsg').get('value'), ts: '1990-01-01'});
});

        dojo.connect(dojo.byId('getdata'), 'onclick', function(){
LoadGrid();
});

        var myDialogDelete = dijit.byId('iddialogdelete');
myDialogDelete.dijitOwner(dijit.byId('delete'), 'Click').on('onok', function(){

//TODO: Reimplementar esta funcion para que el borrado se lo haga en la base de datos y no enviando registro por registro ya que resulta ineficiente este procedimiento.
i = 0;
num = ObjectTable.IdToDelete.length;
if(num>0){
while(i<num){
SaveData({idnotiftempl: ObjectTable.IdToDelete[i]*-1, description: '', message: '', ts: '1990-01-01'});
i++;
}
}else{
NotifyMSG.notify({message: 'No hay registros seleccionados'});
}

});


/*
        var myDialogDelete = dijit.byId('idDialogDelete');

        dojo.connect(dijit.byId('delete'), 'Click', function(){
if(ObjectTable.IdToDelete.length>0){
            dijit.popup.open({
                popup: myDialogDelete,
                around: dojo.byId('delete')
            });
}
        });

        dojo.connect(dojo.byId('delcancel'), 'onclick', function(){
dijit.popup.close(myDialogDelete);
});

        dojo.connect(dojo.byId('delok'), 'onclick', function(){
dijit.popup.close(myDialogDelete);
//TODO: Reimplementar esta funcion para que el borrado se lo haga en la base de datos y no enviando registro por registro ya que resulta ineficiente este procedimiento.
i = 0;
num = ObjectTable.IdToDelete.length;
while(i<num){
SaveData({idnotiftempl: ObjectTable.IdToDelete[i]*-1, description: '', message: '', ts: '1990-01-01'});
i++;
}

});

*/

	dojo.connect(ItemFileWriteStore_1, 'onSet', function(item, attribute, oldValue, newValue){
//NotifyMSG.setText('Edita '+ item.idnotiftempl);
SaveData(item);
});

var GridCalls = dijit.byId('gridxnotif');

dojo.connect(GridCalls.select.row, 'onSelectionChange', function(selected){

ObjectTable.IdToDelete = [];
numsel = selected.length;

i = 0;
while(i<numsel){
ObjectTable.IdToDelete[i] = GridCalls.cell(selected[i], 1, true).data();
i++;
}

});

	if (GridCalls) {

		// Optionally change column structure on the grid
		GridCalls.setColumns([
			{field:"idnotiftempl", name: "id", width: '20px'},
			{field:"description", name: "Descripción", editable: 'true'},
			{field:"message", name: "Mensaje" , editable: 'true'}
		]);
GridCalls.startup();
}


function SaveData(item){

  // The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
  var xhrArgs = {
    url: "notificationtemplatesedit.usaga",
    content: {idnotiftempl: item.idnotiftempl, description: item.description, message: item.message, ts: item.ts},
    handleAs: "xml",
    load: function(dataX){

var xmld = new RXml.getFromXhr(dataX, 'row');

if(xmld.length > 0){

NotifyMSG.notify({message: xmld.getStringFromB64(0, 'outpgmsg')});


}

LoadGrid();

    },
    error: function(errorx){
NotifyMSG.notify({message: errorx}); 
    }
  }
  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}

function LoadGrid(){

ObjectTable.IdToDelete = [];

var store = new dojox.data.XmlStore({url: "getviewnotificationtemplates.usaga", sendQuery: true, rootItem: 'row'});

var request = store.fetch({onComplete: function(itemsrow, r){

var dataxml = new RXml.getFromXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};

var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id:i,
idnotiftempl: dataxml.getNumber(i, "idnotiftempl"),
description: dataxml.getStringFromB64(i, "description"),
message: dataxml.getStringFromB64(i, "message"),
ts: dataxml.getString(i, "ts")
};
i++;
}

ItemFileWriteStore_1.clearOnClose = true;
	ItemFileWriteStore_1.data = myData;
	ItemFileWriteStore_1.close();

		GridCalls.store = null;
		GridCalls.setStore(ItemFileWriteStore_1);

},
onError: function(e){
NotifyMSG.notify({message: e}); 
}
});

}

// Se hace este timeout porque la pagina demora en crearse y al cargar no muestra nada.
setTimeout(LoadGrid, 10000);













     });
});
