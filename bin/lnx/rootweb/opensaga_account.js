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


var GlobalObject = {
IdAccount: 0,
MasterDiv: dojo.byId('opensaga.account.divmaster'),
LoadItemsSelectAccount: function(){
var AccountSelectBox = dijit.byId('account.basic.accountselect');
  var xhrArgs = {
    url: "opensagagetvaluesselectbox",
    handleAs: "text",
    load: function(dataX){
  var datar = dojox.xml.DomParser.parse(dataX);
var xmldata = datar.byName('row');
if(xmldata.length > 0){
var Items = [{}];
var len = xmldata.length;
var i = 0;
var idaccount = 0;

while(i<len){
idaccount = xmldata[i].getAttribute("idaccount");
Items[i] =    {name: jsspire.Base64.decode(xmldata[i].getAttribute("name")), id: idaccount};
i++;
}

    var stateStore = new Memory({data: Items});
AccountSelectBox.store = stateStore;
AccountSelectBox.startup();
}

    },
    error: function(errorx){
alert(errorx);
    }
  }
  var deferred = dojo.xhrGet(xhrArgs);
return this;
},

LoadListIdContactName: function(){
var Objeto = this;
var store = new dojox.data.XmlStore({url: "usms_getcontactslistidcontactname_xml", sendQuery: true, rootItem: 'row'});

var request = store.fetch({onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";


if(numrows > 0){
var Items = [];

//var len = xmldata.length;
var i = 0;
while(i<numrows){
Items[i] =    {name: dataxml.getStringB64(i, 'name'), id: dataxml.getNumber(i, "idcontact")};
i++;
}
on.emit(Objeto.MasterDiv, "onListIdContactNameLoaded", {data: new Memory({data: Items})});
}

},
onError: function(e){
alert(e);
}
});
return Objeto;
}
}

// ACCOUNT BASIC ELEMENTS
var ABE = {
dijit:{
Partition: dijit.byId('account.basic.partition'), 
Enable: dijit.byId('account.basic.enable'),
Num: dijit.byId('account.basic.accountnum'),
Select: dijit.byId('account.basic.accountselect'),
Type: dijit.byId('account.basic.accountType'),
Note: dijit.byId('account.basic.note')
},
dojo: {
FormBasic: dojo.byId("os.account.form.basic"),
FormLocation: dojo.byId("account.location.form")
},
ResetForms: function(){
this.dojo.FormBasic.reset();
this.dojo.FormLocation.reset();
}
}

dojo.connect(ABE.dijit.Select, 'onChange', function(e){
AccountSelected();
});

dojo.connect(dijit.byId('account.basic.newaccount'), 'onClick', function(e){
GlobalObject.IdAccount = 0;
ABE.ResetForms();
AC.ResetAll();
});

dojo.connect(dijit.byId('account.basic.saveaccount'), 'onClick', function(e){
SaveAccount();
});

dojo.connect(dijit.byId('account.basic.deleteaccount'), 'onClick', function(e){
DeleteAccount();
});

dojo.connect(dijit.byId('account.contentpane.users'), 'onShow', function(e){
LoadAccountUsersGridx();
});



function DeleteAccount(){
//var id = dijit.byId('account.basic.id');
GlobalObject.IdAccount = GlobalObject.IdAccount*-1; //.set('value', id.get('value')*-1);
SaveAccount();
}

function SaveAccount(){
var formulario = dojo.byId("os.account.form.basic");
var datos = {};
//datos.idaccount = dijit.byId('account.basic.id').get('value'); 
datos.idaccount = GlobalObject.IdAccount; 
//datos.idgroup = ThisObject.get('idgroup');
datos.partition = dijit.byId('account.basic.partition').get('value');
datos.enable = dijit.byId('account.basic.enable').get('checked'); 
datos.account = dijit.byId('account.basic.accountnum').get('value'); 
datos.name = dijit.byId('account.basic.accountselect').get('displayedValue'); 
datos.type = dijit.byId('account.basic.accountType').get('value');
datos.note = dijit.byId('account.basic.note').get('value');

  // The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
  var xhrArgs = {
    url: "opensagasaveaccount",
    content: datos,
    handleAs: "text",
    load: function(dataX){
//alert(dataX);
  var datar = dojox.xml.DomParser.parse(dataX);
var xmldata = datar.byName('SQLFunReturn');

if(xmldata.length > 0){
GlobalObject.LoadItemsSelectAccount();
var id = xmldata[0].getAttribute("return");
alert(jsspire.Base64.decode(xmldata[0].getAttribute("msg")));
if(id>=0){
// Seteamos primero el id para que al ejecutar SaveAccountLocation no haya problema cuando se crea una cuenta nueva
//dijit.byId('account.basic.id').set('value', id); 
GlobalObject.IdAccount = id;
AjaxLoadAccount();
SaveAccountLocation();
}
}

    },
    error: function(errorx){
alert(errorx);
    }
  }
  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}



function XmlToFormAccountBasic(dataX){
  var datar = dojox.xml.DomParser.parse(dataX);
var xmldata = datar.byName('row');
if(xmldata.length > 0){
GlobalObject.IdAccount = xmldata[0].getAttribute("idaccount")
ABE.dijit.Partition.set('value', xmldata[0].getAttribute("partition"));
ABE.dijit.Enable.set('checked', StringToBool(xmldata[0].getAttribute("enable"))); 
ABE.dijit.Num.set('value', jsspire.Base64.decode(xmldata[0].getAttribute("account"))); 
ABE.dijit.Select.set('value', xmldata[0].getAttribute("idaccount")); 
ABE.dijit.Type.setValue(xmldata[0].getAttribute("type")); 
ABE.dijit.Note.set('value', jsspire.Base64.decode(xmldata[0].getAttribute("note"))); 
}
}

// Carga el formulario de PostgreSQL
function AjaxLoadAccount(){

var formulario = dojo.byId("os.account.form.basic");
if(GlobalObject.IdAccount>0){
  // The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
  var xhrArgs = {
    url: "opensagagetaccount",
 content: { idaccount: GlobalObject.IdAccount},
    handleAs: "text",
    load: function(dataX){
XmlToFormAccountBasic(dataX);
// Carga tambien la localizacion
AjaxLoadAccountLocation();
LoadAccountPhonesTriggerGridx(0);
    },
    error: function(errorx){
formulario.reset();
    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);

}else{
formulario.reset();
}

}

function AccountSelected(){
// Cargamos la cuenta solo si el registro existe
//var selector = dijit.byId('account.basic.accountselect');
if(ABE.dijit.Select.state != 'Error'){
GlobalObject.IdAccount = ABE.dijit.Select.get('value');
AjaxLoadAccount();
AC.LoadContactsGrid();
}
}




////////////////////////
///// LOCALIZACION /////
function AjaxLoadAccountLocation(){
var inidaccount = GlobalObject.IdAccount;
var formulario = dojo.byId("account.location.form");
if(inidaccount>0){
  // The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
  var xhrArgs = {
    url: "opensagagetaccountlocation",
 content: { idaccount: inidaccount},
    handleAs: "text",
    load: function(dataX){
  var datar = dojox.xml.DomParser.parse(dataX);

var xmldata = datar.byName('row');
if(xmldata.length > 0){

//	 dijit.byId('account.location.idaccount').set('value', xmldata[0].getAttribute("idaccount")); 
//	 dijit.byId('account.location.idaddress').set('value', xmldata[0].getAttribute("idaddress")); 
	 dijit.byId('account.location.geox').set('value', xmldata[0].getAttribute("geox")*1); 
	 dijit.byId('account.location.geoy').set('value', xmldata[0].getAttribute("geoy")*1); 
	 dijit.byId('account.location.address').set('value', jsspire.Base64.decode(xmldata[0].getAttribute("address"))); 
	 dijit.byId('account.location.note').set('value', jsspire.Base64.decode(xmldata[0].getAttribute("note"))); 
}
    },
    error: function(errorx){
formulario.reset();
    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);

}else{
formulario.reset();
}

}

function SaveAccountLocation(){
var formulario = dojo.byId("account.location.form");
var datos = {};
//datos.idaccount = dijit.byId('account.basic.id').get('value'); 
datos.idaccount = GlobalObject.IdAccount;
datos.geox = dijit.byId('account.location.geox').get('value');
datos.geoy = dijit.byId('account.location.geoy').get('value'); 
datos.address = dijit.byId('account.location.address').get('value'); 
//datos.name = dijit.byId('account.basic.accountselect').get('displayedValue'); 
datos.note = dijit.byId('account.location.note').get('value');

  // The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
  var xhrArgs = {
    url: "opensagasaveaccountlocation",
    content: datos,
    handleAs: "text",
    load: function(dataX){
//alert(dataX);
  var datar = dojox.xml.DomParser.parse(dataX);
var xmldata = datar.byName('SQLFunReturn');

if(xmldata.length > 0){
//LoadItemsSelectAccount();
var id = xmldata[0].getAttribute("return");
alert(jsspire.Base64.decode(xmldata[0].getAttribute("msg")));
if(id>=0){
AjaxLoadAccountLocation(id);
}
}

    },
    error: function(errorx){
alert(errorx);
    }
  }
  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}


////////////////////
///// USUARIOS /////

on(GlobalObject.MasterDiv, 'onListIdContactNameLoaded', function(d){
//alert(d.data);
var userSelectBox = dijit.byId('opensaga.account.users.form.idcontact');
userSelectBox.store = null;
userSelectBox.store = d.data;
userSelectBox.startup();
userSelectBox.readOnly = true;
});

dojo.connect(dijit.byId("opensaga.account.user.button.new"), 'onClick', function(){
			dojo.byId("opensaga.account.users.form").reset();
dijit.byId("opensaga.account.users.form.idcontact").readOnly = false;
});

dojo.connect(dijit.byId("opensaga.account.user.button.save"), 'onClick', SaveFormAccountUser);
dojo.connect(dijit.byId("opensaga.account.user.button.del"), 'onClick', DeleteFormAccountUser);
dojo.connect(dijit.byId("opensaga.account.user.button.contactdata"), 'onClick', function(){
alert('No implementado');
});


var myAccountUsersGridX = dijit.byId("opensaga.account.users.gridx");

	if (myAccountUsersGridX) {
// Captura el evento cuando se hace click en una fila
dojo.connect(myAccountUsersGridX, 'onRowClick', function(event){
LoadFormAccountUser(this.cell(event.rowId, 1, true).data());
});
		// Optionally change column structure on the grid
		myAccountUsersGridX.setColumns([
			{field:"idcontact", name: "idcontact", width: '0px'},
			{field:"enable_as_user", name: "*", width: '20px', editable: true, editor: CheckBox},
			{field:"numuser", name: "#", width: '20px', editable: true, editor: NumberTextBox},
			{field:"name", name: "nombre"},
			{field:"appointment", name: "Designacion", width: '100px', editable: true}
		]);
myAccountUsersGridX.startup();
}


function DeleteFormAccountUser(){
SaveFormAccountUser(true);
}

function SaveFormAccountUser(deleteuser){

//var inidaccount = dijit.byId('account.basic.id').get('value');

var formdata = { idaccount: GlobalObject.IdAccount};
formdata.idcontact = dijit.byId('opensaga.account.users.form.idcontact').get('value');

if(deleteuser == true){
formdata.idcontact = formdata.idcontact*-1;
}

formdata.enable = dijit.byId('opensaga.account.users.form.enable').get('checked');
formdata.appointment = dijit.byId('opensaga.account.users.form.appointment').get('value');
formdata.keyword = dijit.byId('opensaga.account.users.form.keyword').get('value');
formdata.pwd = dijit.byId('opensaga.account.users.form.pwd').get('value');
formdata.note = dijit.byId('opensaga.account.users.form.note').get('value');
formdata.numuser = dijit.byId('opensaga.account.users.form.numuser').get('value');

if(GlobalObject.IdAccount > 0){

  var xhrArgs = {
    url: "opensagasaveaccountuser",
 content: formdata,
    handleAs: "text",
    load: function(datass){

  var datar = dojox.xml.DomParser.parse(datass);
//alert(datass);
var xmldata = datar.byName('SQLFunReturn');
var idcontactuser = xmldata[0].getAttribute("return");

LoadAccountUsersGridx();

if(idcontactuser == formdata.idcontact){
LoadFormAccountUser(idcontactuser);
}else{
alert(jsspire. Base64.decode(xmldata[0].getAttribute("msg")));
			dojo.byId("opensaga.account.users.form").reset();
}

 
    },
    error: function(error){
//      targetNode.innerHTML = "An unexpected error occurred: " + error;
alert(error);
			dojo.byId("opensaga.account.users.form").reset();

    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}else{
			dojo.byId("opensaga.account.users.form").reset();
}
dijit.byId("opensaga.account.users.form.idcontact").readOnly = true;
}

function LoadFormAccountUser(iniidcontact){

var inidaccount = GlobalObject.IdAccount;

if(inidaccount > 0){

  var xhrArgs = {
    url: "opensagagetaccountuser",
 content: { idaccount: inidaccount, idcontact: iniidcontact},
    handleAs: "text",
    load: function(datass){

  var datar = dojox.xml.DomParser.parse(datass);
var xmldata = datar.byName('row');

dijit.byId('opensaga.account.users.form.idcontact').set('value', String(xmldata[0].getAttribute("idcontact"))); 
dijit.byId('opensaga.account.users.form.enable').set("checked", StringToBool(xmldata[0].getAttribute("enable")));
dijit.byId('opensaga.account.users.form.numuser').set("value", xmldata[0].getAttribute("numuser"));
dijit.byId('opensaga.account.users.form.appointment').set('value', jsspire.Base64.decode(xmldata[0].getAttribute("appointment")));
dijit.byId('opensaga.account.users.form.keyword').set('value', jsspire.Base64.decode(xmldata[0].getAttribute("keyword")));
dijit.byId('opensaga.account.users.form.pwd').set('value', jsspire.Base64.decode(xmldata[0].getAttribute("pwd")));
dijit.byId('opensaga.account.users.form.note').set('value', jsspire.Base64.decode(xmldata[0].getAttribute("note")));

    },
    error: function(error){
//      targetNode.innerHTML = "An unexpected error occurred: " + error;
alert(error);

    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);

LoadAccountPhonesTriggerGridx(iniidcontact);

}else{
			dojo.byId("opensaga.account.users.form").reset();
}
}

function LoadAccountUsersGridx(){

var inidaccount = GlobalObject.IdAccount;

if(inidaccount > 0){

  var xhrArgs = {
    url: "opensagagetaccountusersgrid",
 content: {idaccount: inidaccount},
    handleAs: "text",
    load: function(datass){

  var datar = dojox.xml.DomParser.parse(datass);
//alert(datass);
	// Get reference to our grid object. I set the id to "GridX" using
	// the Maqetta properties palette.
	var myGridX = dijit.byId("opensaga.account.users.gridx");
	if (myGridX) {

var xmldata = datar.byName('row');

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var i = 0;
var rowscount = xmldata.length;
while(i<rowscount){
//alert(i);
myData.items[i] = {
unique_id:i,
//s: false, 
idcontact: xmldata[i].getAttribute("idcontact"), 
enable_as_user: xmldata[i].getAttribute("enable_as_user"),
numuser: xmldata[i].getAttribute("numuser"),
//priority: xmldata[i].getAttribute("prioritycontact"),    
name: jsspire.Base64.decode(xmldata[i].getAttribute("lastname"))+' '+jsspire.Base64.decode(xmldata[i].getAttribute("firstname")),
appointment: jsspire.Base64.decode(xmldata[i].getAttribute("appointment")),
};

i++;
}


	// Set new data on data store (the store has jsId set, so there's
	// a global variable we can reference)
	var store = opensaga_account_users_ItemFileWriteStoreUsers;
	store.clearOnClose = true;
	store.data = myData;
	store.close();

		// Tell our grid to reset itself
		myGridX.store = null;
		myGridX.setStore(store);
	}

 
    },
    error: function(error){
//      targetNode.innerHTML = "An unexpected error occurred: " + error;
alert(error);

    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}else{
			dijit.byId("opensaga.account.users.gridx").store = null;
}
}


////////////////////////////
/////// CONTACTOS //////////
function LoadAccountContactsGridx(){

var inidaccount = GlobalObject.IdAccount;

if(inidaccount > 0){

  var xhrArgs = {
    url: "opensagagetaccountcontactsgrid",
 content: {idaccount: inidaccount},
    handleAs: "text",
    load: function(datass){

  var datar = dojox.xml.DomParser.parse(datass);
//alert(datass);
	// Get reference to our grid object. I set the id to "GridX" using
	// the Maqetta properties palette.
	var myGridX = dijit.byId("opensaga.account.contacts.gridx");
	if (myGridX) {

var xmldata = datar.byName('row');

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var i = 0;
var rowscount = xmldata.length;
while(i<rowscount){
//alert(i);
myData.items[i] = {
unique_id:i,
//s: false, 
idcontact: xmldata[i].getAttribute("idcontact"), 
enable_as_user: xmldata[i].getAttribute("enable_as_user"),
numuser: xmldata[i].getAttribute("numuser"),
//priority: xmldata[i].getAttribute("prioritycontact"),    
name: jsspire.Base64.decode(xmldata[i].getAttribute("lastname"))+' '+jsspire.Base64.decode(xmldata[i].getAttribute("firstname")),
appointment: jsspire.Base64.decode(xmldata[i].getAttribute("appointment")),
};

i++;
}


	// Set new data on data store (the store has jsId set, so there's
	// a global variable we can reference)
	var store = opensaga_account_users_ItemFileWriteStoreUsers;
	store.clearOnClose = true;
	store.data = myData;
	store.close();

		// Tell our grid to reset itself
		myGridX.store = null;
		myGridX.setStore(store);
	}

 
    },
    error: function(error){
//      targetNode.innerHTML = "An unexpected error occurred: " + error;
alert(error);

    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}else{
			dijit.byId("opensaga.account.contacts.gridx").store = null;
}
}




///////////////////////////////////////
///////////// PHONES TRIGGER //////////
// Phones Trigger Elements
var PTElements = {
dojo: {
GxPT: dojo.byId("opensaga.account.phonestrigger.gridx")
},
dijit: {
GxPT: dijit.byId("opensaga.account.phonestrigger.gridx")
},
GxPTClear: function(){
this.dijit.GxPT.store = null;
} 

}

	if (PTElements.dijit.GxPT) {

		// Optionally change column structure on the grid
		PTElements.dijit.GxPT.setColumns([
			{field:"idcontact", name: "idcontact", width: '0px'},
			{field:"idphone", name: "idphone", width: '0px'},
			{field:"enable", name: "*", width: '20px', editable: true, type: dojox.grid.cells.CheckBox},
			{field:"type", name: "type", width: '20px'},
			{field:"idprovider", name: "provider", width: '20px'},
			{field:"phone", name: "Teléfono", width: '150px'},
			{field:"address", name: "Dirección", width: '150px'},
			{field:"fromsms", name: "sms", width: '20px', editable: true,type: dojox.grid.cells.CheckBox },
			{field:"fromcall", name: "call", width: '20px', editable: true},
			{field:"note", name: "Nota", width: '100px', editable: true}
		]);
PTElements.dijit.GxPT.startup();
}

	dojo.connect(opensaga_account_users_ItemFileWriteStoreTriggerAlarm, 'onSet', function(item, attribute, oldValue, newValue){
AjaxSaveChangesPhonesTriggerGridx(item);
});

        function formatter(){
//alert(data);

            var w = new   dijit.form.CheckBox({
//                  name: "checkBox",
            value: "agreed",
            checked: false,
            });
            w._destroyOnRemove=true;

   return '<input id="mycheck" name="mycheck" data-dojo-type="dijit/form/CheckBox" value="true" checked="checked"/>';
//return 'checked';
        }


function AjaxSaveChangesPhonesTriggerGridx(item){

if(item.idaccount > 0 && item.idcontact > 0 && PTElements.dijit.GxPT){

  var xhrArgs = {
    url: "/opensagaaccountphonestriggerviewchanged",
 content: {idaccount: item.idaccount, idphone: item.idphone, enable: item.enable, fromsms: item.fromsms, fromcall: item.fromcall, note: item.note},
    handleAs: "text",
    load: function(datass){

  var datar = dojox.xml.DomParser.parse(datass);

var xmldata = datar.byName('SQLFunReturn');

if(xmldata.length > 0){
var id = xmldata[0].getAttribute("return");
alert(jsspire.Base64.decode(xmldata[0].getAttribute("msg")));
}
LoadAccountPhonesTriggerGridx(item.idcontact);

    },
    error: function(error){
LoadAccountPhonesTriggerGridx(item.idcontact);
alert(error);
    }
  }
  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}else{
LoadAccountPhonesTriggerGridx(item.idcontact);
}

}


function LoadAccountPhonesTriggerGridx(inidcontact){

var inidaccount = GlobalObject.IdAccount;

if(inidaccount > 0 && inidcontact > 0){

  var xhrArgs = {
    url: "opensagagetaccountphonestriggerview",
 content: {idaccount: inidaccount, idcontact: inidcontact},
    handleAs: "text",
    load: function(datass){

  var datar = dojox.xml.DomParser.parse(datass);

//	var myGridX = dijit.byId("opensaga.account.phonestrigger.gridx")
	if (PTElements.dijit.GxPT) {

var xmldata = datar.byName('row');

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var i = 0;
var rowscount = xmldata.length;
while(i<rowscount){
//alert(i);
myData.items[i] = {
unique_id:i,
//s: false, 
idaccount: xmldata[i].getAttribute("idaccount"), 
idphone: xmldata[i].getAttribute("idphone"), 
idcontact: xmldata[i].getAttribute("idcontact"), 
enable: xmldata[i].getAttribute("trigger_alarm"),
idprovider: xmldata[i].getAttribute("idprovider"),
type: xmldata[i].getAttribute("type"),
phone: jsspire.Base64.decode(xmldata[i].getAttribute("phone")),
address: jsspire.Base64.decode(xmldata[i].getAttribute("address")),
phone: jsspire.Base64.decode(xmldata[i].getAttribute("phone")),
fromsms: xmldata[i].getAttribute("fromsms"),    
fromcall: xmldata[i].getAttribute("fromcall"),    
note: jsspire.Base64.decode(xmldata[i].getAttribute("note")),
};

i++;
}


	// Set new data on data store (the store has jsId set, so there's
	opensaga_account_users_ItemFileWriteStoreTriggerAlarm.clearOnClose = true;
	opensaga_account_users_ItemFileWriteStoreTriggerAlarm.data = myData;
	opensaga_account_users_ItemFileWriteStoreTriggerAlarm.close();

		// Tell our grid to reset itself
		PTElements.dijit.GxPT.store = null;
		PTElements.dijit.GxPT.setStore(opensaga_account_users_ItemFileWriteStoreTriggerAlarm);
	}

 
    },
    error: function(error){
//      targetNode.innerHTML = "An unexpected error occurred: " + error;
alert(error);
			PTElements.GxPTClear();
    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);
}else{
			PTElements.GxPTClear();
}
}


/////////////////////////
/////// CONTACTOS ///////
// Account Contacts

dojo.connect(dijit.byId('opensaga.account.contacts.new'), 'onClick', function(){
//alert('Nuevo');
AC.ResetOnSelectContact();
AC.dijit.Select.readOnly = false;
});
dojo.connect(dijit.byId('opensaga.account.contacts.save'), 'onClick', function(){
//alert('save');
AC.SaveForm(false);
});
dojo.connect(dijit.byId('opensaga.account.contacts.del'), 'onClick', function(){
//alert('del');
AC.SaveForm(true);
});
dojo.connect(dijit.byId('opensaga.account.contacts.contactdata'), 'onClick', function(){
alert('contactdata en construccion');
});


// ACCOUNT CONTACTS
var AC = {
GxCStore: opensaga_account_contactsStore,
GxNPStore: opensaga_account_contact_notifphonesStore,
GxNETStore: opensaga_account_contact_notifeventtypeStore,
dijit: {
// Gridx Contacts
GxC: dijit.byId('opensaga.account.contacts.gridx'),
Select: dijit.byId('opensaga.account.contacts.id'),
Enable: dijit.byId('opensaga.account.contacts.enable'),
Priority: dijit.byId('opensaga.account.contacts.priority'),
Appointment: dijit.byId('opensaga.account.contacts.appointment'),
Note: dijit.byId('opensaga.account.contacts.note'),
TS: dijit.byId('opensaga.account.contacts.ts'),
GxNP: dijit.byId('opensaga.account.contacts.notifphonesgridx'),
GxNET: dijit.byId('opensaga.account.contacts.notifeventtypegridx'),
},
dojo:{
Form: dojo.byId('opensaga.account.contacts.form')
},
ResetAll: function(){
this.GxCClear();
this.ResetOnSelectContact();
},
GxCClear: function(){
	this.GxCStore.clearOnClose = true;
	this.GxCStore.data = {identifier: "unique_id", items: []};
	this.GxCStore.close();
this.dijit.GxC.store = null;
this.dijit.GxC.setStore(this.GxCStore);

},
GxNPClear: function(){
	this.GxNPStore.clearOnClose = true;
	this.GxNPStore.data = {identifier: "unique_id", items: []};
	this.GxNPStore.close();
this.dijit.GxNP.store = null;
this.dijit.GxNP.setStore(this.GxNPStore);
},
GxNETClear: function(){

	this.GxNETStore.clearOnClose = true;
	this.GxNETStore.data = {identifier: "unique_id", items: []};
	this.GxNETStore.close();

		this.dijit.GxNET.store = null;
		this.dijit.GxNET.setStore(this.GxNETStore);

},
ResetOnSelectContact: function(){
this.dijit.Select.readOnly = true;
this.dojo.Form.reset();
this.GxNPClear();
this.GxNETClear();
},
LoadContactsGrid: function(){
this.ResetOnSelectContact();
if(GlobalObject.IdAccount > 0){

var store = new dojox.data.XmlStore({url: "opensagagetaccountcontactsgrid", sendQuery: true, rootItem: 'row'});

var request = store.fetch({query: {idaccount: GlobalObject.IdAccount}, onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var i = 0;
while(i<numrows){
alert(dataxml.getString(i, "enable_as_contact"));
myData.items[i] = {
unique_id:i,
idcontact: dataxml.getNumber(i, "idcontact"), 
enable_as_contact: dataxml.getBool(i, "enable_as_contact"),
priority: dataxml.getNumber(i, "prioritycontact"),    
name: dataxml.getStringB64(i, "lastname")+' '+dataxml.getStringB64(i, "firstname"),
appointment: dataxml.getStringB64(i, "appointment"),
};

i++;
}

	AC.GxCStore.clearOnClose = true;
	AC.GxCStore.data = myData;
	AC.GxCStore.close();

		AC.dijit.GxC.store = null;
		AC.dijit.GxC.setStore(AC.GxCStore);
},
onError: function(e){
alert(e);
}
});

/*
  var xhrArgs = {
    url: "opensagagetaccountcontactsgrid",
 content: {idaccount: GlobalObject.IdAccount},
    handleAs: "text",
    load: function(datass){
  var datar = dojox.xml.DomParser.parse(datass);

	// Get reference to our grid object. I set the id to "GridX" using
	// the Maqetta properties palette.
	if (AC.dijit.GxC) {

var xmldata = datar.byName('row');
var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";
var i = 0;
var rowscount = xmldata.length;
while(i<rowscount){
myData.items[i] = {
unique_id:i,
idcontact: xmldata[i].getAttribute("idcontact"), 
enable_as_contact: xmldata[i].getAttribute("enable_as_contact"),
priority: xmldata[i].getAttribute("prioritycontact"),    
name: jsspire.Base64.decode(xmldata[i].getAttribute("lastname"))+' '+jsspire.Base64.decode(xmldata[i].getAttribute("firstname")),
appointment: jsspire.Base64.decode(xmldata[i].getAttribute("appointment")),
};

i++;
}

	AC.GxCStore.clearOnClose = true;
	AC.GxCStore.data = myData;
	AC.GxCStore.close();

		AC.dijit.GxC.store = null;
		AC.dijit.GxC.setStore(AC.GxCStore);
	}


 
    },
    error: function(error){
alert(error);
    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);

*/
}else{
AC.GxCClear();
}


return this;
},
SaveForm: function(deleteReg){

var Objeto = this;
if(AC.dijit.Select.get('value') > 0 && GlobalObject.IdAccount > 0){
idcontact = AC.dijit.Select.get('value');
if(deleteReg){
idcontact = idcontact*-1;
}

  var xhrArgs = {
    url: "opensagagetaccountcontactstable",
 content: {idaccount:GlobalObject.IdAccount, idcontact: idcontact, enable_as_contact: AC.dijit.Enable.get('checked'), priority: AC.dijit.Priority.get('value'), appointment: AC.dijit.Appointment.get('value'), note: AC.dijit.Note.get('value'), ts: AC.dijit.TS.get('value')},
    handleAs: "xml",
    load: function(datass){

var xmldata = datass.getElementsByTagName("row");

if(xmldata.length > 0){
//Objeto.dijit.Select.set('value', String(xmldata[0].getAttribute("idcontact"))); 

//if(xmldata[0].getElementsByTagName('outreturn').item(0).firstChild.data == Objeto.dijit.Select.get('value')){
if(jsspire.Xml.GetData(xmldata[0], 'outreturn') == Objeto.dijit.Select.get('value')){
//alert(Base64.decode(xmldata[0].getElementsByTagName('outpgmsg').item(0).firstChild.data));
alert(jsspire.Xml.GetDataFromBase64(xmldata[0], 'outpgmsg'));
Objeto.LoadFormContact(Objeto.dijit.Select.get('value'));
//Objeto.LoadFormContact(Objeto.dijit.Select.get('value'));
}else{
Objeto.ResetOnSelectContact();
}



}
Objeto.LoadContactsGrid();
    },

    error: function(error)
{
Objeto.LoadContactsGrid();
alert(error);
    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);

}
return Objeto;
},
LoadPhonesNotifEvenTypes: function(idphone){

if(idphone > 0){

var store = new dojox.data.XmlStore({url: "opensagagetaccountphonesnotifeventtypegrid", sendQuery: true, rootItem: 'row'});

var request = store.fetch({query: {idaccount:GlobalObject.IdAccount, idphone: idphone}, onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id:i,
idnotifaccount: dataxml.getNumber(i, "idnotifaccount"),
ideventtype: dataxml.getNumber(i, "ideventtype"),
enable: dataxml.getBool(i, "enable"),
label: dataxml.getStringB64(i, "label"),
ts: dataxml.getValue(i, "ts"),
};
i++;
}

AC.GxNETStore.clearOnClose = true;
	AC.GxNETStore.data = myData;
	AC.GxNETStore.close();

		AC.dijit.GxNET.store = null;
		AC.dijit.GxNET.setStore(AC.GxNETStore);

},
onError: function(e){
alert(e);
}
});

}else{
AC.GxCClear();
}
return this;
},
LoadPhones: function(idcontact){

if(idcontact > 0){

var store = new dojox.data.XmlStore({url: "opensagagetaccountphonesnotifgrid", sendQuery: true, rootItem: 'row'});

var request = store.fetch({query: {idaccount:GlobalObject.IdAccount, idcontact: idcontact}, onComplete: function(itemsrow, r){

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var dataxml = new jspireTableXmlStore(store, itemsrow);
var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id:i,
idcontact: idcontact,
idnotifaccount: dataxml.getNumber(i, "idnotifaccount"),
idphone: dataxml.getNumber(i, "idphone"),
idprovider: dataxml.getNumber(i, "idprovider"),
phone: dataxml.getStringB64(i, "phone"),
idaccount: dataxml.getNumber(i, "idaccount"),
priority: dataxml.getNumber(i, "priority"),    
call: dataxml.getBool(i, "call"),
sms: dataxml.getBool(i, "sms"),
smstext: dataxml.getStringB64(i, "smstext"),
address: dataxml.getStringB64(i, "address"),
note: dataxml.getStringB64(i, "note")
};

i++;
}

AC.GxNPStore.clearOnClose = true;
	AC.GxNPStore.data = myData;
	AC.GxNPStore.close();

		AC.dijit.GxNP.store = null;
		AC.dijit.GxNP.setStore(AC.GxNPStore);

},
onError: function(e){
alert(e);
}
});

}else{
AC.GxCClear();
}
return this;
},
LoadFormContact: function(iniidcontact){

var Objeto = this;
if(GlobalObject.IdAccount > 0){

  var xhrArgs = {
    url: "opensagagetaccountcontact",
 content: { idaccount: GlobalObject.IdAccount, idcontact: iniidcontact},
    handleAs: "text",
    load: function(datass){

  var datar = dojox.xml.DomParser.parse(datass);
var xmldata = datar.byName('row');
if(xmldata.length > 0){
Objeto.dijit.Select.set('value', String(xmldata[0].getAttribute("idcontact"))); 
Objeto.dijit.Enable.set("value", StringToBool(xmldata[0].getAttribute("enable")));
Objeto.dijit.Priority.set("value", xmldata[0].getAttribute("priority"));
Objeto.dijit.Appointment.set('value', jsspire.Base64.decode(xmldata[0].getAttribute("appointment")));
Objeto.dijit.Note.set('value', jsspire.Base64.decode(xmldata[0].getAttribute("note")));
Objeto.dijit.TS.set('value', xmldata[0].getAttribute("ts"));
}
Objeto.LoadPhones(iniidcontact);
    },

    error: function(error){
alert(error);
    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);

//LoadAccountPhonesTriggerGridx(iniidcontact);

}else{
			Objeto.Form.reset();
}
return Objeto;
} 


}

on(GlobalObject.MasterDiv, 'onListIdContactNameLoaded', function(d){
//alert(AC.dijit.Select);
AC.dijit.Select.store = null;
AC.dijit.Select.store = d.data;
AC.dijit.Select.startup();
AC.dijit.Select.readOnly = true;
});

	if (AC.dijit.GxC) {
// Captura el evento cuando se hace click en una fila
dojo.connect(AC.dijit.GxC, 'onRowClick', function(event){
AC.ResetOnSelectContact();
var id = this.cell(event.rowId, 1, true).data();
AC.LoadFormContact(id);
});
		AC.dijit.GxC.setColumns([
			{field:"idcontact", name: "idcontact", width: '0px'},
			{field:"enable_as_contact", name: "*", width: '20px'},
			{field:"priority", name: "priority", width: '20px'},
			{field:"name", name: "nombre"},
			{field:"appointment", name: "Designacion"}
		]);
AC.dijit.GxC.startup();
}

	if (AC.dijit.GxNP) {

AC.dijit.GxNP.setColumns([
			{field:"idnotifaccount", name: "id", width: '0px'},
			{field:"idphone", name: "idp", width: '0px'},
			{field:"phone", name: "Teléfono", width: '150px'},
			{field:"idprovider", name: "idprovider"},
	                {field:"priority", name: "Prioridad", width: '30px', editable: true},
			{field:"call", name: "call", width: '20px', editable: true},
			{field:"sms", name: "sms", width: '20px', editable: true},
			{field:"smstext", name: "smstext", width: '150px', editable: true},
			{field:"address", name: "Dirección", editable: false},
	                {field:"note", name: "Nota", editable: true}
		]);
AC.dijit.GxNP.startup();

// Captura el evento cuando se hace click en una fila
dojo.connect(AC.dijit.GxNP, 'onRowClick', function(event){
//var id = this.cell(event.rowId, 2, true).data();
//alert(id);
AC.LoadPhonesNotifEvenTypes(this.cell(event.rowId, 2, true).data());
});
		
}






	if (AC.dijit.GxNET) {

		AC.dijit.GxNET.setColumns([
			{field:"enable", name: "*", width: '20px'},
			{field:"ideventtype", name: "IdEventType", width: '0px'},
			{field:"label", name: "Evento"},
		]);
AC.dijit.GxNET.startup();
}


///////////////////////////////////////////////////
//// TELEFONOS PARA NOTIFICACIONES DE EVENTOS /////
var ANP = {
Save: function(itemStore){

var Objeto = this;

if(GlobalObject.IdAccount > 0 && itemStore.idcontact > 0){

  var xhrArgs = {
    url: "opensagagetaccountnotificationstable",
 content: {idnotifaccount: 0, idaccount:GlobalObject.IdAccount, idphone: itemStore.idphone, priority: itemStore.priority, sms: itemStore.sms, call: itemStore.call, smstext: itemStore.smstext, note: itemStore.note },
    handleAs: "xml",
    load: function(datass){

var xmld = new jspireTableXmlDoc(datass, 'row');

if(xmld.length > 0){

if(xmld.getInt(0, 'outreturn') > 0){
//alert('pasa');
alert(xmld.getStringB64(0, 'outpgmsg'));
}else{
//Objeto.ResetOnSelectContact();
}

}
//Objeto.LoadContactsGrid();
AC.LoadPhones(itemStore.idcontact);
    },

    error: function(error)
{
AC.LoadPhones(itemStore.idcontact);
alert(error);
    }
  }
	
  // Call the asynchronous xhrGet
  var deferred = dojo.xhrPost(xhrArgs);

//LoadAccountPhonesTriggerGridx(iniidcontact);

}else{
	AC.GxCClear();
}
return Objeto;
}

}

	dojo.connect(opensaga_account_contact_notifphonesStore, 'onSet', function(item, attribute, oldValue, newValue){
//alert('Edita '+ item.idcontact);
ANP.Save(item);
});	

////////////////// FUNCIONES CARGAN AL INICIO //////////////////////////
dijit.byId('account.location.geox').constraints = {pattern: '###.################'};
dijit.byId('account.location.geoy').constraints = {pattern: '###.################'};

GlobalObject.LoadItemsSelectAccount().LoadListIdContactName();
//GlobalObject.LoadListIdContactName();


//var userSelectBox = dijit.byId('opensaga.account.users.form.idcontact');
//StoreContactIdAndName(userSelectBox);

     });
});
