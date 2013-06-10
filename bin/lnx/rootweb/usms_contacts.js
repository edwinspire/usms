	/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */

// modules:['gridx/modules/Focus', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/VirtualVScroller']

require(["dojo/ready",  
"dojo/on",
"dojo/request",
'dojo/store/Memory',
  "dijit/form/FilteringSelect", 
"dojo/Evented",
"dojo/data/ItemFileReadStore",
"dojo/data/ItemFileWriteStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async",
  "dijit/form/CheckBox",
	'gridx/modules/Focus',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
  "dijit/form/NumberTextBox",
"gridx/modules/VirtualVScroller",
"jspire/request/Xml",
"jspire/Gridx",
"jspire/form/FilteringSelect",
"dojox/grid/cells/dijit",
"dojox/data/XmlStore"
], function(ready, on, request, Memory, FilteringSelect, Evented, ItemFileReadStore, ItemFileWriteStore, Grid, Async, CheckBox, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller, RXml, jsGridx, jsFS){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here

var namesLabelsLocations = {L1: 'Nivel 1: ', L2: 'Nivel 2:', L3: 'Nivel 3:', L4: 'Nivel 4:', L5: 'Nivel 5:', L6: 'Nivel 6:'}

/////////////////
///// BASIC /////
// Account basic elements
var GridListContact = dijit.byId("usms.contacts.gridx");
var NotifyMSG = dijit.byId('notify');

var CLocation = dijit.byId('idwlocationcontact');
CLocation.on('onnotify', function(e){
NotifyMSG.notify({message: e.message});
});
CLocation.on('onsave', function(e){
if(e.idaddress != CDWidget.get('idaddress')){
CDWidget.set('idaddress', e.idaddress);
}
});

var CPLocation = dijit.byId('idwlocationtelf');
CPLocation.on('onnotify', function(e){
NotifyMSG.notify({message: e.message});
});
CPLocation.on('onsave', function(e){
if(e.idaddress != CPDWidget.get('idaddress')){
CPDWidget.set('idaddress', e.idaddress);
}
});


var CDWidget = dijit.byId('ContactData');
CDWidget.on('onloadcontact', function(data){
CLocation.set('idaddress', data.idaddress);
GridContactPhone.Load();
CPDWidget.Load(data.idcontact, 0);
});

CDWidget.on('onnotify', function(e){
NotifyMSG.notify({message: e.msg});
});

CDWidget.on('onsavecontact', function(data){
GridListContact.Load();
});

CDWidget.on('ondeletecontact', function(data){
GridListContact.Load();
});


var CPDWidget = dijit.byId('PhoneData');
CPDWidget.on('onnotify', function(e){
NotifyMSG.notify({message: e.msg});
});
CPDWidget.on('onloadphone', function(data){
CPLocation.set('idaddress', data.idaddress);
});
CPDWidget.on('onsavephone', function(data){
GridContactPhone.Load(true);
});

CPDWidget.on('ondeletecontact', function(data){
GridContactPhone.Load();
});



	if (GridListContact) {

		// Optionally change column structure on the grid
		GridListContact.setColumns([
			{field:"unique_id", name: "#", width: '25px'},
			{field:"enable", name: "*", width: '20px', editable: true, editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},
			{field:"name", name: "Nombre"},
		]);
GridListContact.startup();
}

// Captura el evento cuando se hace click en una fila
dojo.connect(GridListContact, 'onRowClick', function(event){
var t = GridListContact;
var d = this.cell(event.rowId, 1, true).data();
t.store.fetch({query: {unique_id: d}, onItem: function(item){
CDWidget.set("idcontact", t.store.getValue(item, 'idcontact'));
}});
});

GridListContact.Load = function(){
var t = GridListContact;
   request.get('getcontactslistidcontactname_xml.usms', {
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
enable: d.getBool(i, "enable"),
name: d.getStringFromB64(i, "name")
};

i++;
}

}

t._setData(myData);

                },
                function(error){
                    // Display the error returned
console.log(error);
t.emit('notify_message', {message: error}); 
                }
            );
return t;
}

GridListContact._setData = function(data){
usms_contacts_ItemFileReadStore.clearOnClose = true;
	usms_contacts_ItemFileReadStore.data = data;
	usms_contacts_ItemFileReadStore.close();
		GridListContact.store = null;
		GridListContact.setStore(usms_contacts_ItemFileReadStore);
}

GridListContact.Clear= function(){
GridListContact._setData({identifier: "unique_id", items: []});
}




var GridContactPhone = dijit.byId('usms.contact.phone.grid');

	if (GridContactPhone) {
// Captura el evento cuando se hace click en una fila
dojo.connect(GridContactPhone, 'onRowClick', function(event){
var t = GridContactPhone;
var d = this.cell(event.rowId, 1, true).data();
t.store.fetch({query: {unique_id: d}, onItem: function(item){
CPDWidget.Load(CDWidget.get("idcontact"), t.store.getValue(item, 'idphone'));
}});


});
		// Optionally change column structure on the grid
		GridContactPhone.setColumns([
			//{field:"idcontact", name: "idc", width: '0px'},
			{field:"unique_id", name: "#", width: '25px'},
			{field:"enable", name: "*", width: '20px', editable: true, editor: "dijit/form/CheckBox", editorArgs: jsGridx.EditorArgsToCellBoolean, alwaysEditing: true},
			{field:"phone", name: "Teléfono"},
		]);
GridContactPhone.startup();
}

GridContactPhone._setData = function(data){
ItemFileReadStore_contactphones.clearOnClose = true;
	ItemFileReadStore_contactphones.data = data;
	ItemFileReadStore_contactphones.close();
		GridContactPhone.store = null;
		GridContactPhone.setStore(ItemFileReadStore_contactphones);
}

GridContactPhone.Clear= function(){
GridContactPhone._setData({identifier: "unique_id", items: []});
}


GridContactPhone.Load = function(){
var t = GridContactPhone;
   request.get('simplifiedviewofphonesbyidcontact_xml.usms', {
	query: {idcontact: CDWidget.get("idcontact")},
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
idphone: d.getNumber(i, "idphone"),
enable: d.getBool(i, "enable"),
phone: d.getStringFromB64(i, "phone")
};

i++;
}

}

t._setData(myData);

                },
                function(error){
                    // Display the error returned
console.log(error);
t.emit('notify_message', {message: error}); 
                }
            );
return t;
}

setTimeout(GridListContact.Load, 2000);

     });
});
