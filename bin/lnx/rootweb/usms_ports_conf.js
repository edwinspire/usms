	/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */

// modules:['gridx/modules/Focus', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/VirtualVScroller']

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
"_usms_parity/_usms_parity",
"dojox/grid/cells/dijit",
"gridx/modules/RowHeader",
"gridx/modules/select/Row",
"gridx/modules/IndirectSelect",
"gridx/modules/extendedSelect/Row",
"dijit/TooltipDialog",
"dijit/popup",
"dijit/form/CheckBox",
"dijit/form/Select",
"_usms_stopbits/_usms_stopbits",
"_usms_handshake/_usms_handshake"
], function(ready, on, ItemFileWriteStore, Grid, Async, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller, request, RXml, jsGridx, wParity){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here
dijit.byId('id_titlebar').set('label', 'Puertos');
var NotifyArea = dijit.byId('id_notify_area');  


var GridxTable = dijit.byId('gridxt');
GridxTable.IdToDelete = [];

	if (GridxTable) {

		// Optionally change column structure on the grid
		GridxTable.setColumns([

			{field:"unique_id", name: "#", width: '20px'},
			{field:"enable", name: "*", width: '20px', editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},
			{field:"port", name: "port", width: '20%', editable: true},
			{field:"databits", name: "databits", editable: true},
			{field:"baudrate", name: "baudrate", editable: true},
			{field:"parity", name: "Paridad", editor: "_usms_parity/_usms_parity", editable: true, alwaysEditing: true},
			{field:"stopbits", name: "StopBits", editor: "_usms_stopbits/_usms_stopbits", editable: true, alwaysEditing: true},
			{field:"handshake", name: "HandShake", editor: "_usms_handshake/_usms_handshake", editable: true, alwaysEditing: true},
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
NotifyArea.notify({message: 'Cargando datos. Por favor espere...'});
GridxTable.IdToDelete = [];

            // Request the text file
            request.get("gettableserialport.usms", {
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
idport: d.getNumber(i, "idport"),
port: d.getStringFromB64(i, "port"),
parity: d.getString(i, "parity"),
baudrate: d.getNumber(i, "baudrate"),
databits: d.getNumber(i, "databits"),
stopbits: d.getString(i, "stopbits"),
handshake: d.getString(i, "handshake"),
enable: d.getBool(i, "enable"),
note: d.getStringFromB64(i, "note")
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

request.post('serialportedit.usms', {
   handleAs: "xml",
data: item
}).then(function(response){

var xmld = new RXml.getFromXhr(response, 'row');
//alert(xmld.getStringFromB64(0, 'message'));
if(xmld.length > 0){
NotifyArea.notify({message: xmld.getStringFromB64(0, 'message')});
}
dijit.byId('id_port_form').reset();
GridxTable.Load();
}, function(error){
NotifyArea.notify({message: error});
});

}


        var myDialogNew = dijit.byId('idDialogNew');
myDialogNew.byes.set('label', 'Guardar');
myDialogNew.bno.set('label', 'Cancelar');
myDialogNew.innerHTML(' <div data-dojo-type="dijit/form/Form" id="id_port_form" style="min-width: 1em; min-height: 1em; width: 300px; height: auto;">  <div style="margin: 3px; display: inline-block;">   <label style="margin-right: 3px;">   Habilitado:</label>   <input type="checkbox" data-dojo-type="dijit/form/CheckBox" id="id_port_enable" intermediateChanges="false" iconClass="dijitNoIcon"></input> </div>  <div style="margin: 3px; display: inline-block;">    <label style="margin-right: 3px;">    Puerto:</label>    <input type="text" data-dojo-type="dijit/form/TextBox" id="id_port_port" required="true" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false"></input>  </div>  <div style="margin: 3px; display: inline-block;">    <label style="margin-right: 3px;">DataBits:</label>    <input type="text" data-dojo-type="dijit/form/NumberSpinner" id="id_port_databits" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" invalidMessage="$_unset_$" rangeMessage="Este valor est&amp;aacute; fuera del intervalo." required="true" value="8" maxLength="1" style="width: 41.109375px;"></input>  </div>  <div style="margin: 3px; display: inline-block;">    <label style="margin-right: 3px;">  BaudRate:</label>    <input type="text" data-dojo-type="dijit/form/NumberSpinner" id="id_port_baudrate" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" maxLength="1" invalidMessage="$_unset_$" rangeMessage="Este valor est&amp;aacute; fuera del intervalo." style="width: 99.109375px;" required="true" value="0"></input>  </div>  <div style="margin: 3px; display: inline-block;">    <label style="margin-right: 3px;">      Parity:</label>    <div data-dojo-type="_usms_parity/_usms_parity" style="width: 80px;"></div>    </div>  <div style="margin: 3px; display: inline-block;">    <label style="margin-right: 3px;">StopBits:</label>    <div data-dojo-type="_usms_stopbits/_usms_stopbits" id="id_port_stopbits" style="width: 80px;">></div>  </div>  <div style="margin: 3px; display: inline-block;">    <label style="margin-right: 3px;">  Handshake:</label>    <div data-dojo-type="_usms_handshake/_usms_handshake" id="id_port_handshake" style="width: 80px;">></div>  </div>  <div>   <label>   Nota:</label>   <textarea type="text" data-dojo-type="dijit/form/Textarea" id="id_port_note" intermediateChanges="false" rows="3" trim="false" uppercase="false" lowercase="false" propercase="false" style="height: auto; display: block; width: 95%;"></textarea> </div></div>');


myDialogNew.dijitOwner(dijit.byId('new'), 'Click').on('onok', function(){

if(dijit.byId('id_port_form').validate()){
GridxTable.SaveItem({idport: 0, baudrate: dijit.byId('id_port_baudrate').get('value'), databits: dijit.byId('id_port_databits').get('value'), enable: dijit.byId('id_port_enable').get('checked'), handshake: dijit.byId('id_port_handshake').get('value'), note: dijit.byId('id_port_note').get('value'), port: dijit.byId('id_port_port').get('value'), stopbits: dijit.byId('id_port_stopbits').get('value')});

}else{
NotifyArea.notify({message: 'Los datos no han sido completados correctamente'});
}

});

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
