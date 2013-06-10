/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */

require(["dojo/ready", 
'jspire/Gridx',
'jspire/request/Xml',
"dojo/data/ItemFileReadStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async",
 "dojox/data/XmlStore",
   "dijit/form/CheckBox",
'gridx/modules/VirtualVScroller',
 'gridx/modules/Edit',
 'gridx/modules/CellWidget'], function(ready, jsGridx, RXml){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here

var LastIdEvent = 0;
var NotifyArea = dijit.byId('id_notify_area');  

	var myGridX = dijit.byId("usaga.event.monitor");
	if (myGridX) {

		// Optionally change column structure on the grid
		myGridX.setColumns([

			{field:"id", name: "id", width: '25px'},
			{field:"dateload", name: "dateload", width: '85px'},
			{field:"idaccount", name: "idaccount", width: '50px'},
			{field:"partition", name: "partition", width: '40px'},
			{field:"enable", name: "enable", width: '40px', editable: true, editor: "dijit.form.CheckBox", editorArgs: jsGridx.EditorArgsToCellBooleanDisabled, alwaysEditing: true},
			{field:"account", name: "account", width: '50px'},
			{field:"name", name: "name", width: '150px'},
			{field:"code", name: "code", width: '25px'},
			{field:"zu", name: "zu", width: '15px'},
			{field:"priority", name: "priority", width: '30px'},
			{field:"description", name: "description"},
			{field:"ideventtype", name: "ideventtype", width: '40px'},
			{field:"eventtype", name: "eventtype"}
		]);

//myGridX.autoWidth = true;
//	myGridX.autoHeight = true;
myGridX.autoUpdate = true;

myGridX.startup();

}

function LoadMonitorEvents(){

var store = new dojox.data.XmlStore({url: "usaga_geteventsmonitor.usaga", sendQuery: true, rootItem: 'row'});

var request = store.fetch({onComplete: function(itemsrow, r){

var dataxml = new RXml.getFromXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};

var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id:i,
id: dataxml.getNumber(i, "idevent"), 
dateload: dataxml.getString(i, "dateload"),
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

ItemFileReadStore_1.clearOnClose = true;
	ItemFileReadStore_1.data = myData;
	ItemFileReadStore_1.close();

		myGridX.store = null;
		myGridX.setStore(ItemFileReadStore_1);
myGridX.resize();

NotifyArea.notify({message: 'Nuevos eventos encontrados'});

},
onError: function(e){
NotifyArea.notify({message: e});
}
});

}

function CheckLastIdEvent(){

var store = new dojox.data.XmlStore({url: "lastidevent.usaga", sendQuery: true, rootItem: 'row'});

var request = store.fetch({onComplete: function(itemsrow, r){

var dataxml = new RXml.getFromXmlStore(store, itemsrow);

numrows = itemsrow.length;
alreadylasidevent = 0; 

if(numrows > 0){
alreadylasidevent = dataxml.getNumber(0, "idevent");
}

if(alreadylasidevent > LastIdEvent){
LastIdEvent = alreadylasidevent;
LoadMonitorEvents();
}

},
onError: function(e){
NotifyArea.notify({message: e});
}
});

}

		
window.setInterval(CheckLastIdEvent, 4000);


     });
});
