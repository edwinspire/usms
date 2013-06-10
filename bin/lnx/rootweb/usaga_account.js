/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready",
"dojo/dom-style",
"dojo/window",
"dojo/on",
"jspire/Gridx",
'dojo/request',
'jspire/request/Xml',
"jspire/form/DateTextBox",
	'gridx/modules/Focus',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
	"gridx/modules/RowHeader",
	"gridx/modules/select/Row",
	"gridx/modules/IndirectSelect",
	"gridx/modules/extendedSelect/Row",
	"gridx/modules/VirtualVScroller",
"dijit/form/CheckBox",
"dijit/popup"
], function(ready, domStyle, dojoWindow,dojoOn, jsGridx, R, RXml, jsDateTextBox){
     ready(function(){

function HtmlDialogNotifications(msg, idform, idcall, idsms, idtext){
return '<form id="'+idform+'" style="width: 250px;">   <label style="font-weight: bold;">'+msg+'</label>   <table border="0" style="border-collapse: collapse; table-layout: fixed; width: 100%; height: auto;">     <colgroup>       <col></col>       <col></col>     </colgroup>     <tbody>       <tr>         <td style="width: 75px;">           Llamar:</td>         <td>           <input type="checkbox" data-dojo-type="dijit/form/CheckBox" id="'+idcall+'" intermediateChanges="false" iconClass="dijitNoIcon"></input></td>       </tr>       <tr>         <td>           Enviar SMS:</td>         <td>           <input type="checkbox" data-dojo-type="dijit/form/CheckBox" id="'+idsms+'" intermediateChanges="false" iconClass="dijitNoIcon"></input></td>       </tr>       <tr>         <td>           Texto SMS:</td>         <td>           <textarea type="text" data-dojo-type="dijit/form/Textarea" id="'+idtext+'" intermediateChanges="false" rows="3" trim="false" uppercase="false" lowercase="false" propercase="false"></textarea></td>       </tr>     </tbody>   </table>   </form>';
}



 dijit.byId('id_account_titlebar').set('label', 'Abonados');
     
var NotifyArea = dijit.byId('id_notify_area');  
var Account = dijit.byId('id_account_basic_data');
var Location = dijit.byId('id_account_location_widget');
var LocationMB = dijit.byId('id_account_location_menubar');  
var GridxA = dijit.byId('id_account_contact_gridx');
var ContactW = dijit.byId('id_account_contact_widgetx'); 
var ContactMB = dijit.byId('id_account_contact_phonenotify_menubar'); 
dijit.byId('id_account_contact_titlebar_grid').set('label', 'Contactos a Notificar');
var GridxB = dijit.byId('id_account_contact_phonenotify_gridx');
dijit.byId('id_account_user_gridx_titlebar').set('label', 'Usuarios');
var GridxC = dijit.byId('id_account_user_gridx');
var UserW = dijit.byId('id_account_user_widget'); 
var UserMB = dijit.byId('id_account_user_menubar'); 
var GridxD = dijit.byId('id_account_ctrl_alarma_gridx');
var GridxE = dijit.byId('id_account_event_gridx');
dijit.byId('id_account_event_titlebar').set('label', 'Eventos');




Location.on('notify_message', function(m){
NotifyArea.notify({message: m.message});
});

var ButtonMap = LocationMB.addButton('OpenStreeMap', 'dijitNoIcon', true, false);
ButtonMap.on('Click', function(){
NotifyArea.notify({message: 'Para ver el mapa es necesario que tenga conexión a internet.'});
window.open(Location.address.values().geourl,'_blank');
});

LocationMB.on('onnew', function(){
Location.set('idaddress', 0);
});

LocationMB.on('ondelete', function(){
Location.address.delete();
});

LocationMB.on('onsave', function(){
if(Account.Id > 0){
Location.save();
}
});

Location.on('onsave', function(l){
Account.set('idaddress', l.idaddress);
});


var BodyApp = dojo.byId('myapp');
BodyApp.adjustElements = function(){
h = dojoWindow.getBox().h - domStyle.get('id_usaga_menu_header', 'height') - domStyle.get('id_account_titlebar', 'height');

domStyle.set('id_usaga_account', 'height', h+'px');
console.log('window on resize to: '+h);
dijit.byId('id_tagcontainer').resize();
}
         
dojoOn(window, "resize", function() { 
BodyApp.adjustElements();
 })

Account.on('notify_message', function(n){
NotifyArea.notify({message: n.message});
});
Account.on('onloadaccount', function(x){
if(x.idaccount > 0){
Account.DisabledContentPanes(false);
Location.set('idaddress', x.idaddress);
GridxA.Load();
ContactW.Load(x.idaccount, 0);
UserW.Load(x.idaccount, 0);
}else{
Account.DisabledContentPanes(true);
}

dojo.byId('id_locationmap').setAttribute('data', 'usaga_account_map.usaga?idaccount='+x.idaccount);

});

Account.DisabledContentPanes= function(disabled){

dijit.byId('ContentPaneTiempos').attr('disabled',  true);
dijit.byId('ContentPaneLocaliz').attr('disabled',  disabled);
dijit.byId('ContentPaneMapa').attr('disabled',  disabled);
dijit.byId('ContentPaneContactos').attr('disabled',  disabled);
dijit.byId('ContentPaneUsers').attr('disabled',  disabled);
dijit.byId('ContentPaneEventos').attr('disabled',  disabled);
}


// ### SECCION CONTACTOS ###
ContactW.on('notify_message', function(m){
NotifyArea.notify({message: m.message});
});

ContactW.on('onloadcontact', function(e){
GridxB.Load(e.idcontact);
GridxC.Load(e.idcontact);
});

ContactW.on('onsave', function(){
GridxA.Load();
});

ContactMB.on('onnew', function(){
ContactW.New(Account.Id);
});

ContactMB.on('onsave', function(){
ContactW.save();
});

ContactMB.on('ondelete', function(){
ContactW.delete();
});


var DialogContactNotifyContactsApplySelected = dijit.byId('id_contact_NotifyContactPhonesdialog');
DialogContactNotifyContactsApplySelected.byes.set('label', 'Aplicar');
DialogContactNotifyContactsApplySelected.bno.set('label', 'Cancelar');
DialogContactNotifyContactsApplySelected.innerHTML(HtmlDialogNotifications('Los cambios se aplicarán a todos los números telefónicos de los contactos que haya seleccionado. Esta acción REEMPLAZARÁ los datos existentes', 'GridxAForm', 'GridxACall', 'GridxASMS', 'GridxAMsgText'));

DialogContactNotifyContactsApplySelected.dijitOwner(dijit.byId('id_account_contact_notifygridx_popup'), 'Click').on('onok', function(){
GridxA.ApplyNotifyToSelection();
});


	if (GridxA) {

GridxA.ApplyNotifyToSelection = function(){
if(GridxA.selected.length>0){

   R.post('notifyeditselectedcontacts.usaga', {
		data: {idaccount: Account.Id, idcontacts: GridxA.selected.toString(), call: dijit.byId('GridxACall').get('checked'), sms: dijit.byId('GridxASMS').get('checked'), msg: dijit.byId('GridxAMsgText').get('value')},
            handleAs: "xml"
        }).then(
                function(response){

var d = new RXml.getFromXhr(response, 'row');

if(d.length > 0){
GridxA.emit('notify_message', {message: d.getStringFromB64(0, 'outpgmsg')}); 
}

GridxA.Load();
ContactW.Load(Account.Id, 0);
                },
                function(error){
                    // Display the error returned
GridxA.emit('notify_message', {message: error}); 
                }
            );

}else{
NotifyArea.notify({message: 'No hay contactos seleccionados para aplicar los cambios'});
}

}

dojo.connect(GridxA.select.row, 'onSelectionChange', function(selected){
GridxA.selected = [];
var numsel = selected.length;
i = 0;
while(i<numsel){
// Aqui buscamos los datos desde el store y no desde la celda, agregamos el idphone al array
GridxA.store.fetch({query: {unique_id: selected[i]}, onItem: function(item){
GridxA.selected[i] = GridxA.store.getValue(item, 'idcontact');
} 
});
i++;
}
});

GridxA.on('notify_message', function(m){
NotifyArea.notify({message: m.message});
});

// Captura el evento cuando se hace click en una fila
dojo.connect(GridxA, 'onRowClick', function(evt){
var t = GridxA;
d = t.cell(event.rowId, 1, true).data();
// Aqui buscamos los datos desde el store y no desde la celda.
t.store.fetch({query: {unique_id: d}, onItem: function(item){
ContactW.Load(t.store.getValue(item, 'idaccount'), t.store.getValue(item, 'idcontact'));
}
});

});
		GridxA.setColumns([
			{field:"unique_id", name: "#", width: '20px'},
			{field:"enable_as_contact", name: "*", width: '20px', editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBooleanDisabled, alwaysEditing: true},
			{field:"priority", name: "priority", width: '20px'},
			{field:"name", name: "nombre", width: '150px'},
			{field:"appointment", name: "Designacion"}
		]);
GridxA.startup();
}

GridxA.Clear= function(){
GridxA.selected = [];
GridxA._setData({identifier: "unique_id", items: []});
}

GridxA._setData = function(data){
	id_account_contact_store.clearOnClose = true;
	id_account_contact_store.data = data;
	id_account_contact_store.close();
		GridxA.store = null;
		GridxA.setStore(id_account_contact_store);
}

GridxA.Load = function(){
GridxA.selected = [];
if(Account.Id > 0){

   R.get('getaccountcontactsgrid.usaga', {
		query: {idaccount: Account.Id},
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');
numrows = d.length;

var myData = {identifier: "unique_id", items: []};


if(numrows > 0){

var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id: i+1,
idcontact: d.getNumber(i, "idcontact"), 
idaccount: d.getNumber(i, "idaccount"), 
enable_as_contact: d.getBool(i, "enable_as_contact"),
priority: d.getNumber(i, "prioritycontact"),    
name: d.getStringFromB64(i, "lastname")+' '+d.getStringFromB64(i, "firstname"),
appointment: d.getStringFromB64(i, "appointment")
};

i++;
}


}
GridxA._setData(myData);

                },
                function(error){
                    // Display the error returned
console.log(error);
t.emit('notify_message', {message: error}); 
                }
            );


}else{
GridxA.Clear();
}


return GridxA;
}


// ### SECCION TELEFONOS DE CONTACTOS ###
// Abre el dialogo
var DialogContactNotifyPhoneApplySelected = dijit.byId('id_contact_NotifyContactdialog');
DialogContactNotifyPhoneApplySelected.byes.set('label', 'Aplicar');
DialogContactNotifyPhoneApplySelected.bno.set('label', 'Cancelar');
DialogContactNotifyPhoneApplySelected.innerHTML(HtmlDialogNotifications('Los cambios se aplicarán a todos los números telefónicos que haya seleccionado. Esta acción REEMPLAZARÁ los datos existentes', 'GridxBForm', 'GridxBCall', 'GridxBSMS', 'GridxBMsgText'));

DialogContactNotifyPhoneApplySelected.dijitOwner(dijit.byId('id_account_contact_phonenotify_notifycations_popup'), 'Click').on('onok', function(){
GridxB.ApplyNotifyToSelection();
});


	if (GridxB) {

GridxB.ApplyNotifyToSelection = function(){

if(GridxB.selected.length>0){

   R.post('notifyeditselectedphones.usaga', {
		data: {idaccount: Account.Id, idphones: GridxB.selected.toString(), call: dijit.byId('GridxBCall').get('checked'), sms: dijit.byId('GridxBSMS').get('checked'), msg: dijit.byId('GridxBMsgText').get('value')},
            handleAs: "xml"
        }).then(
                function(response){

var d = new RXml.getFromXhr(response, 'row');

if(d.length > 0){
GridxB.emit('notify_message', {message: d.getStringFromB64(0, 'outpgmsg')}); 
}

GridxB.Load(ContactW.get('idcontact'));
                },
                function(error){
                    // Display the error returned
GridxB.emit('notify_message', {message: error}); 
                }
            );

}else{
NotifyArea.notify({message: 'No hay teléfonos seleccionados para aplicar los cambios'});
}

}

dojo.connect(GridxB.select.row, 'onSelectionChange', function(selected){
GridxB.selected = [];
var numsel = selected.length;
i = 0;
while(i<numsel){
// Aqui buscamos los datos desde el store y no desde la celda, agregamos el idphone al array
GridxB.store.fetch({query: {unique_id: selected[i]}, onItem: function(item){
GridxB.selected[i] = GridxB.store.getValue(item, 'idphone');
} 
});
i++;
}
});

GridxB.on('notify_message', function(m){
NotifyArea.notify({message: m.message});
});

GridxB.setColumns([
			{field:"unique_id", name: "#", width: '20px'},
//			{field:"idnotifaccount", name: "id", width: '0px'},
			{field:"idphone", name: "idp", width: '0px'},
			{field:"phone", name: "Teléfono", width: '100px'},
			{field:"idprovider", name: "idprovider"},
	                {field:"priority", name: "Prioridad", width: '30px', editable: true},
			{field:"call", name: "call", width: '20px', editable: true, editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},
			{field:"sms", name: "sms", width: '20px', editable: true, editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},
			{field:"smstext", name: "smstext", width: '150px', editable: true},
	                {field:"note", name: "Nota", editable: true}
		]);

GridxB.startup();

GridxB._setData = function(data){
	ItemFileWriteStore_B.clearOnClose = true;
	ItemFileWriteStore_B.data = data;
	ItemFileWriteStore_B.close();
GridxB.store = null;
GridxB.setStore(ItemFileWriteStore_B);
}

GridxB.Clear= function(){
GridxB.selected = [];
GridxB._setData({identifier: "unique_id", items: []});
}

GridxB.Load = function(idcontact){
GridxB.selected = [];
if(Account.Id > 0 && idcontact > 0){

   R.get('getaccountphonesnotifgrid.usaga', {
		query: {idaccount: Account.Id, idcontact: idcontact},
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');
numrows = d.length;

var myData = {identifier: "unique_id", items: []};


if(numrows > 0){

var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id:i+1,
idcontact: idcontact,
idnotifaccount: d.getNumber(i, "idnotifaccount"),
idphone: d.getNumber(i, "idphone"),
idprovider: d.getNumber(i, "idprovider"),
phone: d.getStringFromB64(i, "phone"),
idaccount: d.getNumber(i, "idaccount"),
priority: d.getNumber(i, "priority"),    
call: d.getBool(i, "call"),
sms: d.getBool(i, "sms"),
smstext: d.getStringFromB64(i, "smstext"),
note: d.getStringFromB64(i, "note")
};

i++;
}

}
GridxB._setData(myData);

                },
                function(error){
                    // Display the error returned
console.log(error);
GridxB.emit('notify_message', {message: error}); 
                }
            );


}else{
GridxB.Clear();
}


return GridxB;
}

GridxB.SaveItem = function(itemStore){

var t = GridxB;

   R.post('getaccountnotificationstable.usaga', {
		data: {idnotifaccount: 0, idaccount:Account.Id, idphone: itemStore.idphone, priority: itemStore.priority, sms: itemStore.sms, call: itemStore.call, smstext: itemStore.smstext, note: itemStore.note },
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){

var d = new RXml.getFromXhr(response, 'row');

if(d.length > 0){
t.emit('notify_message', {message: d.getStringFromB64(0, 'outpgmsg')}); 
}

t.Load(itemStore.idcontact);

                },
                function(error){
                    // Display the error returned
t.emit('notify_message', {message: error}); 
t.Load(itemStore.idcontact);
                }
            );

}


	dojo.connect(ItemFileWriteStore_B, 'onSet', function(item, attribute, oldValue, newValue){
GridxB.SaveItem(item);
});


}


//# SECCION USUARIOS #//
	if (GridxC) {

// Captura el evento cuando se hace click en una fila
dojo.connect(GridxC, 'onRowClick', function(event){
var t = GridxC;
d = t.cell(event.rowId, 1, true).data();

// Aqui buscamos los datos desde el store y no desde la celda.
t.store.fetch({query: {unique_id: d}, onItem: function(item){
UserW.Load(t.store.getValue(item, 'idaccount'), t.store.getValue(item, 'idcontact'));
}
});
});

		// Optionally change column structure on the grid
		GridxC.setColumns([
//			{field:"idcontact", name: "idcontact", width: '0px'},
			{field:"unique_id", name: "#", width: '20px'},
			{field:"enable_as_user", name: "*", width: '20px', editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBooleanDisabled, alwaysEditing: true},
			{field:"numuser", name: "NU", width: '20px', editor: "dijit/form/NumberTextBox"},
			{field:"name", name: "nombre"},
			{field:"appointment", name: "Designacion", width: '100px'}
		]);
GridxC.startup();
}

GridxC.Clear = function(){
GridxC._setData({identifier: "unique_id", items: []});
}

GridxC._setData = function(data){
	// Set new data on data store (the store has jsId set, so there's
	// a global variable we can reference)
	var store = ItemFileWriteStore_3;
	store.clearOnClose = true;
	store.data = data;
	store.close();

		// Tell our grid to reset itself
		GridxC.store = null;
		GridxC.setStore(store);
}

GridxC.Load = function(){
var G = GridxC;
if(Account.Id > 0){

R.get('fun_view_account_users_xml.usaga', {
   handleAs: "xml",
query:  {idaccount: Account.Id}
}).then(function(response){

var xmld = new RXml.getFromXhr(response, 'row');
var myData = {identifier: "unique_id", items: []};

if(xmld.length > 0){

var i = 0;
var rowscount = xmld.length;
while(i<rowscount){

myData.items[i] = {
unique_id:i+1,
idaccount: xmld.getNumber(i, "idaccount"), 
idcontact: xmld.getNumber(i, 'idcontact'), 
enable_as_user: xmld.getBool(i, 'enable_as_user'),
numuser: xmld.getNumber(i, 'numuser'),
name: xmld.getStringFromB64(i, 'lastname')+' '+xmld.getStringFromB64(i, 'firstname'),
appointment: xmld.getStringFromB64(i, 'appointment'),
};

i++;
}

}

GridxC._setData(myData);


}, function(error){
NotifyMSG.notify({message: error});
});

}else{
 GridxC.Clear();
}

}

UserW.on('notify_message', function(m){
NotifyArea.notify({message: m.message});
});

UserW.on('onloaduser', function(e){
GridxD.Load(e.idaccount, e.idcontact);
});

UserW.on('onsave', function(){
GridxC.Load();
});

UserMB.on('onnew', function(){
UserW.New(Account.Id);
});

UserMB.on('onsave', function(){
UserW.save();
});

UserMB.on('ondelete', function(){
UserW.delete();
});


//# SECCION CTRL ALARMA #//
GridxD.Clear = function(){
GridxD._setData({identifier: "unique_id", items: []});
}

GridxD._setData = function(data){
	var store = ItemFileWriteStore_4;
	store.clearOnClose = true;
	store.data = data;
	store.close();

		// Tell our grid to reset itself
		GridxD.store = null;
		GridxD.setStore(store);
}
/*
GridxD.setColumnsNew = function(){

            // Request the text file
   R.get('provider_listidname_xml.usms', {
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
//alert('sdjjasdhkas');
var d = new RXml.getFromXhr(response, 'row');
var Items = [];
numrows = d.length;
var i = 0;
while(i<numrows){
Items[i] =    {value: d.getStringFromB64(i, 'name'), id: d.getString(i, 'idprovider')};
i++;
}

  var store = new Memory({
    data: [
      { id: "1", value: "Foo" },
      { id: "13", value: "Bar" }
    ]
  });

  var os = new ObjectStore({ objectStore: store });


		GridxD.setColumns([
//			{field:"unique_id", name: "#", width: '20px'},
			{field:"enable", name: "*", width: '20px', editable: true, editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},
//			{field:"type", name: "type", width: '20px'}

			{field:"idprovider", name: "provider", editable: true, alwaysEditing: true,
					editor: "_usms_mappoint/_usms_mappoint"
},

			{field:"phone", name: "Teléfono", width: '150px'},
			{field:"fromsms", name: "sms", width: '20px', editable: true, editor: "dijit/form/CheckBox", 
			editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},

			{field:"fromcall", name: "call", width: '20px', editable: true, editor: "dijit/form/CheckBox", 
		editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true,
			},
			{field:"note", name: "Nota", width: '100px', editable: true}
		]);
GridxD.startup();
GridxD.Clear();

                },
                function(error){
NotifyMSG.notify({message: error});
                }
            );

}
*/

// Setea las columnas de la tabla
		GridxD.setColumns([
//			{field:"unique_id", name: "#", width: '20px'},
			{field:"enable", name: "*", width: '20px', editable: true, editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},
//			{field:"type", name: "type", width: '20px'}
/*
			{field:"idprovider", name: "provider", editable: true, alwaysEditing: true,
					editor: "_usms_mappoint/_usms_mappoint"
},
*/
			{field:"phone", name: "Teléfono", width: '150px'},
			{field:"fromsms", name: "sms", width: '20px', editable: true, editor: "dijit/form/CheckBox", 
			editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},

			{field:"fromcall", name: "call", width: '20px', editable: true, editor: "dijit/form/CheckBox", 
		editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true,
			},
			{field:"note", name: "Nota", width: '100px', editable: true}
		]);
GridxD.startup();
GridxD.Clear();

	dojo.connect(ItemFileWriteStore_4, 'onSet', function(item, attribute, oldValue, newValue){
GridxD.SaveItem(item);
});

GridxD.SaveItem = function(item){

if(item.idaccount > 0 && item.idcontact > 0 && GridxD){

R.post('fun_account_phones_trigger_alarm_table_from_hashmap.usaga', {
   handleAs: "xml",
data: {idaccount: item.idaccount, idphone: item.idphone, enable: item.enable, fromsms: item.fromsms, fromcall: item.fromcall, note: item.note}
}).then(function(response){

var xmld = new RXml.getFromXhr(response, 'row');

NotifyMSG.notify({message: xmld.getStringFromB64(0, 'outpgmsg')});

var idcontactuser = xmld.getNumber(0, 'outreturn');
GridxD.Load(Account.Id, idcontactuser);


}, function(error){
NotifyMSG.notify({message: error});
});

}else{
GridxD,Clear();
}

}

GridxD.Load = function(idaccount_, idcontact_){
var G = GridxD;
if(idaccount_ > 0 && idcontact_ > 0){

R.get('getaccountphonestriggerview.usaga', {
   handleAs: "xml",
query:  {idaccount: idaccount_, idcontact: idcontact_}
}).then(function(response){

var dataxml = new RXml.getFromXhr(response, 'row');
var myData = {identifier: "unique_id", items: []};

if(dataxml.length > 0){

var i = 0;
var rowscount = dataxml.length;
while(i<rowscount){

myData.items[i] = {
unique_id:i+1,
idaccount: dataxml.getNumber(i, "idaccount"),
idcontact: dataxml.getNumber(i, "idcontact"),  
idphone: dataxml.getNumber(i, "idphone"), 
enable: dataxml.getBool(i, "trigger_alarm"),
idprovider: dataxml.getNumber(i, "idprovider"),
type: dataxml.getNumber(i, "type"),
phone: dataxml.getStringFromB64(i, "phone"),
fromsms: dataxml.getBool(i, "fromsms"),    
fromcall: dataxml.getBool(i, "fromcall"),    
note: dataxml.getStringFromB64(i, "note")
};

i++;
}

}

GridxD._setData(myData);


}, function(error){
NotifyMSG.notify({message: error});
});

}else{
 GridxD.Clear();
}

}

//# SECCION EVENTOS #//
jsDateTextBox.addGetDateFunction(dijit.byId('id_account_event_ini'));
jsDateTextBox.addGetDateFunction(dijit.byId('id_account_event_fin'));

GridxE._setData = function(data){
	var store = ItemFileWriteStore_5;
	store.clearOnClose = true;
	store.data = data;
	store.close();

		// Tell our grid to reset itself
		GridxE.store = null;
		GridxE.setStore(store);
}

GridxE.Clear = function(){
GridxE._setData({identifier: "unique_id", items: []});
}



	if (GridxE) {


		// Optionally change column structure on the grid
		GridxE.setColumns([

			{field:"id", name: "id", width: '20px'},
			{field:"dateload", name: "dateload", width: '80px'},
			{field:"idaccount", name: "idaccount", width: '75px'},
			{field:"partition", name: "partition", width: '60px'},
			{field:"enable", name: "enable", width: '60px'},
			{field:"account", name: "account", width: '100px'},
			{field:"name", name: "name", width: '100px'},
			{field:"code", name: "code"},
			{field:"zu", name: "zu"},
			{field:"priority", name: "priority"},
			{field:"description", name: "description"},
			{field:"ideventtype", name: "ideventtype"},
			{field:"eventtype", name: "eventtype"}
		]);
GridxE.startup();
 GridxE.Clear();
}


GridxE.Load = function(){
var G = GridxE;
if(Account.Id > 0){

R.get('geteventsaccount.usaga', {
   handleAs: "xml",
query:  {idaccount: Account.Id, fstar: dijit.byId('id_account_event_ini')._getDate(), fend: dijit.byId('id_account_event_fin')._getDate()}
}).then(function(response){

var dataxml = new RXml.getFromXhr(response, 'row');
var myData = {identifier: "unique_id", items: []};

if(dataxml.length > 0){

var i = 0;
var rowscount = dataxml.length;
while(i<rowscount){

myData.items[i] = {
unique_id:i,
id: dataxml.getNumber(i, "idevent"), 
dateload: dataxml.getDate(i, "dateload"),
idaccount: dataxml.getNumber(i, "idaccount"),
partition: dataxml.getNumber(i, "partition"),
enable: dataxml.getBool(i, "enable"),
account: dataxml.getStringFromB64(i, "account"),
name: dataxml.getStringFromB64(i, "name"),
code: dataxml.getStringFromB64(i, "code"),
zu: dataxml.getNumber(i, "zu"),
priority: dataxml.getNumber(i, "priority"),
description: dataxml.getStringFromB64(i, "description"),
ideventtype: dataxml.getNumber(i, "ideventtype"),
eventtype: dataxml.getStringFromB64(i, "eventtype")
};

i++;
}

}

GridxE._setData(myData);


}, function(error){
NotifyMSG.notify({message: error});
});

}else{
 GridxE.Clear();
}

}

dojo.connect(dojo.byId('id_account_event_show'), 'onclick', function(){
GridxE.Load();
});






//# FUNCIONES QUE SE EJECUTAN CUANDO SE HA CARGADO LA PAGINA #//
NotifyArea.notify({message: 'uSAGA - Abonados'});
//Se ajusta al tamaño de la pantalla actual
BodyApp.adjustElements();
Account.DisabledContentPanes(true);



     });
});
