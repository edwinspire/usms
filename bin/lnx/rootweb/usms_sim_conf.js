require(["dojo/ready",  
"dojo/on",
"dojo/data/ItemFileWriteStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async",
	'gridx/modules/Focus',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
  "dijit/form/NumberTextBox",
"gridx/modules/VirtualVScroller",
"dojo/request",
"jspire/request/Xml",
"jspire/Gridx",
"dojox/grid/cells/dijit",
"gridx/modules/RowHeader",
"gridx/modules/select/Row",
"gridx/modules/IndirectSelect",
"gridx/modules/extendedSelect/Row",
"dijit/TooltipDialog",
"dijit/popup",
"dijit/form/CheckBox",
"dijit/form/Select"
], function(ready, on, ItemFileWriteStore, Grid, Async, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller, request, RXml, jsGridx){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here
dijit.byId('id_titlebar').set('label', 'CHIP SIM GSM');
var NotifyArea = dijit.byId('id_notify_area');  

var GridxTable = dijit.byId('gridxt');
GridxTable.IdToDelete = [];

	if (GridxTable) {

		// Optionally change column structure on the grid
		GridxTable.setColumns([

			{field:"unique_id", name: "#", width: '20px'},
			{field:"enable", name: "*", width: '20px', editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},
			{field:"ts", name: "ts", editable: false},
			{field:"idprovider", name: "idprovider", width: '20%', editable: false},
			{field:"phone", name: "phone", editable: true},
			{field:"smsout_request_reports", name: "Report", width: '20px', editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},
			{field:"smsout_retryonfail", name: "RetryOnFail", editable: true},
			{field:"smsout_max_length", name: "MaxLengthSMS", editable: true},
			{field:"smsout_max_lifetime", name: "MaxLifeTime", editable: true},
			{field:"smsout_enabled_other_providers", name: "OtherProviders", width: '20px', editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},
			{field:"idmodem", name: "idmodem", editable: false},
			{field:"on_incommingcall", name: "on_incommingcall", editable: false},
			{field:"note", name: "note", editable: true, width: '25%'}
		]);
GridxTable.startup();
}

GridxTable.Clear= function(){
GridxTable.selected = [];
GridxTable._setData({identifier: "unique_id", items: []});
}

GridxTable._setData = function(data){
	ItemFileWriteStore_1.clearOnClose = true;
	ItemFileWriteStore_1.data = data;
	ItemFileWriteStore_1.close();
		GridxTable.store = null;
		GridxTable.setStore(ItemFileWriteStore_1);
}

GridxTable.Delete = function(){

var num = GridxTable.IdToDelete.length;
if(num > 0){

request.post('tableserialport_delete.usms', {
   handleAs: "xml",
data: {idports: GridxTable.IdToDelete.toString()}
}).then(function(response){

var xmld = new RXml.getFromXhr(response, 'row');
//alert(xmld.getStringFromB64(0, 'message'));
if(xmld.length > 0){
NotifyArea.notify({message: xmld.getStringFromB64(0, 'message')});
}
GridxTable.Load();
}, function(error){
NotifyArea.notify({message: error});
});

}else{
NotifyArea.notify({message: 'No hay registros seleccionados'});
}

}



GridxTable.Load = function(){
//NotifyArea.notify({message: 'Cargando datos. Por favor espere...'});
GridxTable.IdToDelete = [];

            // Request the text file
            request.get("fun_view_sim_xml.usms", {
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');

numrows = d.length;

var myData = {identifier: "unique_id", items: []};

var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id:i+1,
idsim: d.getNumber(i, "idsim"),
idprovider: d.getNumber(i, "idprovider"),
enable: d.getBool(i, "enable"),
phone: d.getStringFromB64(i, "phone"),
smsout_request_reports: d.getBool(i, "smsout_request_reports"),
smsout_retryonfail: d.getNumber(i, "smsout_retryonfail"),
smsout_max_length: d.getNumber(i, "smsout_max_length"),
smsout_max_lifetime: d.getNumber(i, "smsout_max_lifetime"),
smsout_enabled_other_providers: d.getBool(i, "smsout_enabled_other_providers"),
idmodem: d.getString(i, "idmodem"),
on_incommingcall: d.getNumber(i, "on_incommingcall"),
note: d.getStringFromB64(i, "note"),
ts: d.getString(i, "ts"),
};
i++;
}

GridxTable._setData(myData);

                },
                function(error){
                    // Display the error returned
NotifyArea.notify({message: error});
GridxTable.Clear();
                }
            );

}

// Guarda los datos
GridxTable.SaveItem = function(item){

request.post('fun_sim_table_edit_xml.usms', {
   handleAs: "xml",
data: item
}).then(function(response){

var xmld = new RXml.getFromXhr(response, 'row');
//alert(xmld.getStringFromB64(0, 'message'));
if(xmld.length > 0){
NotifyArea.notify({message: xmld.getStringFromB64(0, 'outpgmsg')});
}
GridxTable.Load();
}, function(error){
NotifyArea.notify({message: error});
});

}


        var myDialogNew = dijit.byId('idDialogNew');
myDialogNew.byes.set('label', 'Cerrar');
myDialogNew.bno.set('label', 'Cancelar');
myDialogNew.innerHTML('<div style="width: 200px;"><div>No puede crear manualmente un registro.</div><div>Estos registros se crean automáticamente al leer un contacto de la lista de contactos de la tajeta SIM cuyo nombre es "usms" y como número consta el número telefónico de esa SIM.</div></div>');
myDialogNew.dijitOwner(dijit.byId('new'), 'Click');


//--
        dojo.connect(dojo.byId('getdata'), 'onclick', function(){
GridxTable.Load();
});

//--
        var myDialogDelete = dijit.byId('iddialogdelete');
myDialogDelete.dijitOwner(dijit.byId('delete'), 'Click').on('onok', function(){

if(GridxTable.IdToDelete.length > 0){
GridxTable.Delete();
}else{
NotifyArea.notify({message: 'No hay registros seleccionados'});
}
});


	dojo.connect(ItemFileWriteStore_1, 'onSet', function(item, attribute, oldValue, newValue){
GridxTable.SaveItem(item);
});





// Capturamos el evento onSelectionChange de la gridx 
dojo.connect(GridxTable.select.row, 'onSelectionChange', function(selected){
GridxTable.IdToDelete = [];
numsel = selected.length;
var i = 0;
while(i<numsel){
GridxTable.store.fetch({query: {unique_id: selected[i]}, onItem: function(item){
GridxTable.IdToDelete[i] = GridxTable.store.getValue(item, 'idport');
} 
});
i++;
}
});





     });
});
