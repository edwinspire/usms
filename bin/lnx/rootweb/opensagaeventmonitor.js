/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */
require(["dojo/ready", "dojo/data/ItemFileReadStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async", "dojox/xml/DomParser", "dojox/data/XmlStore"], function(ready){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here

	var myGridX = dijit.byId("opensaga.event.monitor");
	if (myGridX) {


		// Optionally change column structure on the grid
		myGridX.setColumns([

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
myGridX.startup();


function LoadMonitorEvents(){

var store = new dojox.data.XmlStore({url: "opensagageteventsmonitor", sendQuery: true, rootItem: 'row'});

var request = store.fetch({onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

var myData = {identifier: "unique_id", items: []};
myData.identifier = "unique_id";

var i = 0;
while(i<numrows){
myData.items[i] = {
unique_id:i,
id: dataxml.getNumber(i, "idevent"), 
dateload: dataxml.getDate(i, "dateload"),
idaccount: dataxml.getNumber(i, "idaccount"),
partition: dataxml.getNumber(i, "partition"),
enable: dataxml.getBool(i, "enable"),
account: dataxml.getStringB64(i, "account"),
name: dataxml.getStringB64(i, "name"),
code: dataxml.getStringB64(i, "code"),
zu: dataxml.getNumber(i, "zu"),
priority: dataxml.getNumber(i, "priority"),
description: dataxml.getStringB64(i, "description"),
ideventtype: dataxml.getNumber(i, "ideventtype"),
eventtype: dataxml.getStringB64(i, "eventtype")
};
i++;
}

ItemFileReadStore_1.clearOnClose = true;
	ItemFileReadStore_1.data = myData;
	ItemFileReadStore_1.close();

		myGridX.store = null;
		myGridX.setStore(ItemFileReadStore_1);
//GridCalls.startup();
//alert('ok');
},
onError: function(e){
alert(e);
}
});

}


}





		
window.setInterval(LoadMonitorEvents, 4000);


     });
});
