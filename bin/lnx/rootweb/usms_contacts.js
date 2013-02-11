	/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */

// modules:['gridx/modules/Focus', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/VirtualVScroller']

require(["dojo/ready",  
"dojo/on",
"dojox/xml/DomParser",
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
"dojox/grid/cells/dijit",
"dojox/data/XmlStore"
], function(ready, on, DomParser, Memory, FilteringSelect, Evented, ItemFileReadStore, ItemFileWriteStore, Grid, Async, CheckBox, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here

/////////////////
///// BASIC /////
// Account basic elements

dojo.connect(dijit.byId('usms.contact.new'), 'onClick', function(e){
GlobalObject.IdContact = 0;
FormContact.dojo.Form.reset();
//TODO Limpiar el resto de datos
});

dojo.connect(dijit.byId('usms.contact.save'), 'onClick', function(e){
FormContact.SaveForm();
});



var GlobalObject = {
IdContact: 0,
GridStore: usms_contacts_ItemFileReadStore,
dijit: {
Grid: dijit.byId("usms.contacts.gridx")
},

LoadGrid: function(){

var store = new dojox.data.XmlStore({url: "usms_getcontactslistidcontactname_xml", sendQuery: true, rootItem: 'row'});

var request = store.fetch({onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id:i,
idcontact: dataxml.getNumber(i, "idcontact"),
enable: dataxml.getBool(i, "enable"),
name: dataxml.getStringB64(i, "name"),
};
i++;
}

GlobalObject.GridStore.clearOnClose = true;
	GlobalObject.GridStore.data = myData;
	GlobalObject.GridStore.close();

		GlobalObject.dijit.Grid.store = null;
		GlobalObject.dijit.Grid.setStore(GlobalObject.GridStore);

},
onError: function(e){
alert(e);
}
});
}
}


	if (GlobalObject.dijit.Grid) {
// Captura el evento cuando se hace click en una fila
dojo.connect(GlobalObject.dijit.Grid, 'onRowClick', function(event){
GlobalObject.IdContact = this.cell(event.rowId, 1, true).data();
FormContact.LoadContactSelected();
});
		// Optionally change column structure on the grid
		GlobalObject.dijit.Grid.setColumns([
			{field:"idcontact", name: "id", width: '0px'},
			{field:"enable", name: "*", width: '20px', editable: true, editor: "dijit.form.CheckBox", editorArgs: jspireEditorArgsToGridxCellBooleanDisabled, alwaysEditing: true},
			{field:"name", name: "Nombre"},
		]);
GlobalObject.dijit.Grid.startup();
GlobalObject.LoadGrid();
}


var FormContact = {
ts: '1990-001-01',
dojo: {
Form: dojo.byId('usms.contact.form')
},
dijit: {
Enable: dijit.byId('usms.contact.enable'),
Firstname: dijit.byId('usms.contact.firstname'),
Lastname: dijit.byId('usms.contact.lastname'),
Title: dijit.byId('usms.contact.title'),
Birthday: dijit.byId('usms.contact.birthday'),
Gender: dijit.byId('usms.contact.gender'),
IdentificationType: dijit.byId('usms.contact.typeidentification'),
Identification: dijit.byId('usms.contact.identification'),
Web: dijit.byId('usms.contact.web'),
email1: dijit.byId('usms.contact.email1'),
email2: dijit.byId('usms.contact.email2'),
Note: dijit.byId('usms.contact.note')
},
LoadContactSelected: function(){

if(GlobalObject.IdContact > 0){
var store = new dojox.data.XmlStore({url: "usms_getcontactbyid_xml", sendQuery: true, rootItem: 'row'});

var request = store.fetch({query: {idcontact: GlobalObject.IdContact}, onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

if(numrows > 0){
var i = 0;
FormContact.dijit.Enable.set('checked', dataxml.getBool(i, "enable"));
FormContact.dijit.Firstname.set('value', dataxml.getStringB64(i, "firstname"));
FormContact.dijit.Lastname.set('value', dataxml.getStringB64(i, "lastname"));
FormContact.dijit.Title.set('value', dataxml.getStringB64(i, "title"));
FormContact.dijit.Birthday.set('value', dataxml.getDate(i, "birthday"));
FormContact.dijit.Gender.set('value', dataxml.getNumber(i, "gender"));
FormContact.dijit.IdentificationType.set('value', dataxml.getNumber(i, "typeofid"));
FormContact.dijit.Identification.set('value', dataxml.getStringB64(i, "identification"));
FormContact.dijit.Web.set('value', dataxml.getStringB64(i, "web"));
FormContact.dijit.email1.set('value', dataxml.getStringB64(i, "email1"));
FormContact.dijit.email2.set('value', dataxml.getStringB64(i, "email2"));
FormContact.dijit.Note.set('value', dataxml.getStringB64(i, "note"));
FormContact.ts = dataxml.getStringB64(i, "ts");
CAddress.AddressW.idaddress = dataxml.getNumber(i, "idaddress");
GlobalObject.IdContact = dataxml.getNumber(i, "idcontact");
}else{
GlobalObject.IdContact = 0;
FormContact.dojo.Form.reset();
CAddress.AddressW.idaddress = 0;
}
GeneralLoadAddressForm(CAddress.AddressW);
CP.LoadGrid();
},
onError: function(e){
GlobalObject.IdContact = 0;
FormContact.dojo.Form.reset();
alert(e);
}
});
}else{
FormContact.dojo.Form.reset();
}
},
SaveForm: function(){

var Objeto = this;

  var xhrArgs = {
    url: "contacts_table_edit.usms",
 content: {idcontact: GlobalObject.IdContact, enable: FormContact.dijit.Enable.get('checked'), title: FormContact.dijit.Title.get('value'), firstname: FormContact.dijit.Firstname.get('value'), lastname: FormContact.dijit.Lastname.get('value'), birthday: dojo.date.locale.format(FormContact.dijit.Birthday.get('value'), {datePattern: "yyyy-MM-dd", selector: "date"}), gender: FormContact.dijit.Gender.get('value'), typeofid: FormContact.dijit.IdentificationType.get('value'), identification: FormContact.dijit.Identification.get('value'), web: FormContact.dijit.Web.get('value'), email1: FormContact.dijit.email1.get('value'), email2: FormContact.dijit.email2.get('value'), note: FormContact.dijit.Note.get('value'), ts: FormContact.ts},
    handleAs: "xml",
    load: function(datass){

var xmld = new jspireTableXmlDoc(datass, 'row');

if(xmld.length > 0){

GlobalObject.IdContact = xmld.getInt(0, 'outreturn');
alert(xmld.getStringB64(0, 'outpgmsg'));

}else{
GlobalObject.IdContact = 0;
}

Objeto.LoadContactSelected();
GlobalObject.LoadGrid();
    },

    error: function(error)
{
GlobalObject.LoadGrid();
alert(error);
    }
  }

  var deferred = dojo.xhrPost(xhrArgs);

//return Objeto;
}
}


dojo.connect(dijit.byId('usms.save.contact.newtelf'), 'onClick', function(e){
//CP.IdPhone = 0;
CP.resetForm();
//TODO Limpiar el resto de datos
});



dojo.connect(dijit.byId('usms.save.contact.savetelf'), 'onClick', function(e){
CP.SaveForm();
});

// Contact Phones
var CP = {
ts: '1990-01-01',
idaddress: '0',
resetForm: function(){
this.IdPhone = 0;
this.dijit.Enable.reset();
dojo.byId('usms.phones.formdata').reset();
//dojo.byId('usms.phones.formlocalization').reset();
},
dijit: {
Enable: dijit.byId('usms.phones.enable'),
Phone: dijit.byId('usms.phones.phone'),
Ext: dijit.byId('usms.phones.ext'),
Type: dijit.byId('usms.phones.typephone'),
Ubi: dijit.byId('usms.phones.ubiphone'),
Provider: dijit.byId('usms.phones.provider'),
Note: dijit.byId('usms.phones.note'),
Country: dijit.byId('usms.phones.local.country'),
State: dijit.byId('usms.phones.local.state'),
City: dijit.byId('usms.phones.local.city'),
Sector: dijit.byId('usms.phones.local.sector'),
Subsector: dijit.byId('usms.phones.local.subsector'),
Address: dijit.byId('usms.phones.address'),
GeoX: dijit.byId('usms.phones.geox'),
GeoY: dijit.byId('usms.phones.geoy')
},
IdPhone: 0,
Gridx: dijit.byId('usms.contact.phone.grid'),
GridxStore: ItemFileReadStore_contactphones,
LoadGrid: function(){
this.resetForm();
var store = new dojox.data.XmlStore({url: "usms_simplifiedviewofphonesbyidcontact_xml", sendQuery: true, rootItem: 'row'});

var request = store.fetch({query: {idcontact: GlobalObject.IdContact}, onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id:i,
idcontact: dataxml.getNumber(i, "idcontact"),
idphone: dataxml.getNumber(i, "idphone"),
enable: dataxml.getBool(i, "enable"),
phone: dataxml.getStringB64(i, "phone"),
};
i++;
}

CP.GridxStore.clearOnClose = true;
	CP.GridxStore.data = myData;
	CP.GridxStore.close();

		CP.Gridx.store = null;
		CP.Gridx.setStore(CP.GridxStore);

},
onError: function(e){
alert(e);
}
});
},
LoadPhone: function(){
var store = new dojox.data.XmlStore({url: "usms_getphonebyid_xml", sendQuery: true, rootItem: 'row'});

var request = store.fetch({query: {idphone: CP.IdPhone}, onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};

if(numrows>0){

var i = 0;

CP.dijit.Enable.set('checked', dataxml.getBool(i, "enable"));
CP.dijit.Phone.set('value', dataxml.getStringB64(i, "phone"));
CP.dijit.Ext.set('value', dataxml.getStringB64(i, "phone_ext"));
CP.dijit.Ubi.set('value', dataxml.getNumber(i, "ubiphone"));
CP.dijit.Provider.set('value', dataxml.getString(i, "idprovider"));
CP.dijit.Type.set('value', dataxml.getString(i, "typephone"));
CP.dijit.Note.set('value', dataxml.getStringB64(i, "note"));
PAddress.AddressW.idaddress = dataxml.getNumber(i, "idaddress");
}else{
PAddress.AddressW.reset();
CP.resetForm();
}
GeneralLoadAddressForm(PAddress.AddressW);

},
onError: function(e){
alert(e);
}
});
},
Delete: function(){
CP.IdPhone = CP.IdPhone*-1;
CP.SaveForm();
},
SaveForm: function(){

if(GlobalObject.IdContact > 0){

var Objeto = this;

  var xhrArgs = {
    url: "usms_phonetable_xml",
 content: {idcontact:GlobalObject.IdContact, idphone: CP.IdPhone, enable: CP.dijit.Enable.get('checked'), phone: CP.dijit.Phone.get('value'), phone_ext: CP.dijit.Ext.get('value'), typephone: CP.dijit.Type.get('value'), ubiphone: CP.dijit.Ubi.get('value'), idprovider: CP.dijit.Provider.get('value'), note: CP.dijit.Note.get('value'), ts: CP.ts},
    handleAs: "xml",
    load: function(datass){

var xmld = new jspireTableXmlDoc(datass, 'row');

CP.LoadGrid();

if(xmld.length > 0){

alert(xmld.getStringB64(0, 'outpgmsg'));
CP.IdPhone = xmld.getInt(0, 'outreturn');
CP.LoadPhone();

}

    },

    error: function(error)
{
CP.LoadGrid();
alert(error);
    }
  }

  var deferred = dojo.xhrPost(xhrArgs);

}

return Objeto;
}
}

	if (CP.Gridx) {
// Captura el evento cuando se hace click en una fila
dojo.connect(CP.Gridx, 'onRowClick', function(event){
//alert(this.cell(event.rowId, 2, true).data());
CP.IdPhone = this.cell(event.rowId, 2, true).data();
CP.LoadPhone();
});
		// Optionally change column structure on the grid
		CP.Gridx.setColumns([
			{field:"idcontact", name: "idc", width: '0px'},
			{field:"idphone", name: "idp", width: '0px'},
			{field:"enable", name: "*", width: '20px', editable: true, editor: "dijit.form.CheckBox", editorArgs: jspireEditorArgsToGridxCellBooleanDisabled, alwaysEditing: true},
			{field:"phone", name: "Teléfono"},
		]);
CP.Gridx.startup();
}



///////////////////////////
///// CONTACT ADDRESS /////


function GeneralLoadAddressForm(WidgetAddress){

var ObjectoW = WidgetAddress;
//alert('idaddress > '+ObjectoW.idaddress);

if(ObjectoW.idaddress > 0){

var store = new dojox.data.XmlStore({url: 'get_address_byid.usms', sendQuery: true, rootItem: 'row'});

var request = store.fetch({query: {idaddress: ObjectoW.idaddress}, onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

if(numrows > 0){
i = 0;
ObjectoW.set('idaddress', dataxml.getNumber(i, 'idaddress'));
ObjectoW.set('geox', dataxml.getFloat(i, 'geox'));
ObjectoW.set('geoy', dataxml.getFloat(i, 'geoy'));
ObjectoW.set('mainstreet', dataxml.getStringB64(i, 'main_street'));
ObjectoW.set('secundarystreet', dataxml.getStringB64(i, 'secundary_street'));
ObjectoW.set('other', dataxml.getStringB64(i, 'other'));
ObjectoW.set('note', dataxml.getStringB64(i, 'note'));
ObjectoW.set('ts', dataxml.getString(i, 'ts'));
ObjectoW.set('idlocation', dataxml.getString(i, 'idlocation'));
}else{
ObjectoW.reset();
}

},
onError: function(e){
ObjectoW.reset();
alert(e);
}
});

}else{
ObjectoW.reset();
}

}


var CAddress = {
AddressW : dijit.byId('idwaddresscontact'),
Delete: function(){
if(this.AddressW.idaddress > 0){
// Objeto Widget Address
var OWA = this.AddressW;
var Este = this;

  var xhrArgs = {
    url: "fun_contact_address_edit.usms",
 content: {idcontact: GlobalObject.IdContact*-1, ts: OWA.get('ts')},
    handleAs: "xml",
    load: function(datass){

var xmld = new jspireTableXmlDoc(datass, 'row');

if(xmld.length > 0){
OWA.idaddress = xmld.getInt(0, 'outreturn');
alert(xmld.getStringB64(0, 'outpgmsg'));
}else{
OWA.reset();
}
GeneralLoadAddressForm(OWA);
    },

    error: function(error)
{
OWA.reset();
alert(error);
    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}
},
Save: function(){
// Objeto Widget Address
var OWA = this.AddressW;
var Este = this;

  var xhrArgs = {
    url: "fun_contact_address_edit.usms",
 content: {idcontact: GlobalObject.IdContact, idlocation: OWA.get('idlocation'), geox: OWA.get('geox'), geoy: OWA.get('geoy'), main_street: OWA.get('mainstreet'), secundary_street: OWA.get('secundarystreet'), other: OWA.get('other'), note: OWA.get('note'), ts: OWA.get('ts')},
    handleAs: "xml",
    load: function(datass){

var xmld = new jspireTableXmlDoc(datass, 'row');

if(xmld.length > 0){
OWA.idaddress = xmld.getInt(0, 'outreturn');
alert(xmld.getStringB64(0, 'outpgmsg'));
}else{
OWA.reset();
}
//ABE.idaddress = OWA.idaddress;
GeneralLoadAddressForm(OWA);
    },

    error: function(error)
{
OWA.reset();
alert(error);
    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}
} 

dojo.connect(dojo.byId('usms.save.contact.address'), 'onclick', function(){
CAddress.Save();
});

///////////////////////////////////////////////////
// PHONE ADDRESS
var PAddress = {
AddressW : dijit.byId('idwaddresstelf'),
Delete: function(){
if(this.AddressW.idaddress > 0){
// Objeto Widget Address
var OWA = this.AddressW;
var Este = this;
//alert('eliminamos dir de '+CP.IdPhone);
  var xhrArgs = {
    url: "fun_phone_address_edit.usms",
 content: {idphone: CP.IdPhone*-1, ts: OWA.get('ts')},
    handleAs: "xml",
    load: function(datass){

var xmld = new jspireTableXmlDoc(datass, 'row');

if(xmld.length > 0){
OWA.idaddress = xmld.getInt(0, 'outreturn');
alert(xmld.getStringB64(0, 'outpgmsg'));
}else{
OWA.reset();
}
GeneralLoadAddressForm(OWA);
    },

    error: function(error)
{
OWA.reset();
alert(error);
    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}
},
Save: function(){
// Objeto Widget Address
var OWA = this.AddressW;
var Este = this;

  var xhrArgs = {
    url: "fun_phone_address_edit.usms",
 content: {idphone: CP.IdPhone, idlocation: OWA.get('idlocation'), geox: OWA.get('geox'), geoy: OWA.get('geoy'), main_street: OWA.get('mainstreet'), secundary_street: OWA.get('secundarystreet'), other: OWA.get('other'), note: OWA.get('note'), ts: OWA.get('ts')},
    handleAs: "xml",
    load: function(datass){

var xmld = new jspireTableXmlDoc(datass, 'row');

if(xmld.length > 0){
OWA.idaddress = xmld.getInt(0, 'outreturn');
alert(xmld.getStringB64(0, 'outpgmsg'));
}else{
OWA.reset();
}
//ABE.idaddress = OWA.idaddress;
GeneralLoadAddressForm(OWA);
    },

    error: function(error)
{
OWA.reset();
alert(error);
    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}
} 

dojo.connect(dojo.byId('usms.save.contact.saveaddresstelf'), 'onclick', function(){
PAddress.Save();
});




var loadProviderlist  = new jspireLoadFilteringSelectFromTableXmlStore(CP.dijit.Provider, true, "usms_provider_listidname_xml", "row", "idprovider", "name");

/*
dijit.byId('idwaddresscontact').on('onok', function(x){
alert(x.value);
});

*/

var dialogdeletc = dijit.byId('dialogconfirmdeletecontact');
dialogdeletc.setowner('usms.contact.del', 'onclick').on('onok', function(){
if(GlobalObject.IdContact>0){
GlobalObject.IdContact = GlobalObject.IdContact*-1;
FormContact.SaveForm();
}
});

var dialogdeletaddress = dijit.byId('dialogconfirmdeletecontactaddress');
dialogdeletaddress.setowner('usms.delete.contact.address', 'onclick').on('onok', function(){
CAddress.Delete();
});

var dialogdeletphone = dijit.byId('dialogconfirmdeletecontactphone');
dialogdeletphone.setowner('usms.save.contact.deltelf', 'onclick').on('onok', function(){
CP.Delete();
});

var dialogdeletphoneaddress = dijit.byId('dialogconfirmdeletecontactaddressphone');
dialogdeletphoneaddress.setowner('usms.save.contact.deladdresstelf', 'onclick').on('onok', function(){
PAddress.Delete();
});





////////////////// FUNCIONES CARGAN AL INICIO //////////////////////////
//dijit.byId('account.location.geox').constraints = {pattern: '###.################'};
//dijit.byId('account.location.geoy').constraints = {pattern: '###.################'};
loadProviderlist.Load();


     });
});
