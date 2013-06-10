	/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */

// modules:['gridx/modules/Focus', 'gridx/modules/Edit', 'gridx/modules/CellWidget', 'gridx/modules/VirtualVScroller']

require(["dojo/ready",  
"dojo/on",
'dojo/request', 
'jspire/request/Xml',
'jspire/form/DateTextBox',
"dojo/data/ItemFileReadStore",
  "gridx/Grid",
  "gridx/core/model/cache/Async",
	'gridx/modules/Focus',
	'gridx/modules/CellWidget',
	'gridx/modules/Edit',
  "dijit/form/NumberTextBox",
"gridx/modules/VirtualVScroller",
  "_usms_smsout_process/_usms_smsout_process",
"dojox/grid/cells/dijit"
], function(ready, on, request, RXml, jsDTb, ItemFileReadStore, Grid, Async, Focus, CellWidget, Edit, NumberTextBox, VirtualVScroller, wJProcess){
     ready(function(){
         // logic that requires that Dojo is fully initialized should go here

dojo.connect(dojo.byId('send'), 'onclick', function(){
myGridX.Load();
});

jsDTb.addGetDateFunction(dijit.byId('fstart'));
jsDTb.addGetDateFunction(dijit.byId('fend'));

	var myGridX = dijit.byId("idgridxtable");
	if (myGridX) {


		// Optionally change column structure on the grid
		myGridX.setColumns([

			{field:"idsmsout", name: "id", width:"30px"},
			{field:"idowner", name: "idowner", width:"30px"},
			{field:"dateload", name: "dateload", width:"80px"},
			{field:"idsmstype", name: "idsmstype", width:"20px"},
			{field:"enable", name: "enable-phone", width:"20px"},
			{field:"datetosend", name: "datetosend", width:"80px"},
			{field:"idphone", name: "idphone", width:"50px"},
			{field:"phone", name: "phone", width:"80px"},
			{field:"idprovider", name: "idprovider", width:"50px"},
			{field:"message", name: "message", width: "200px"},
			//{field:"process", name: "process", width:"80px", editor: "_usms_smsout_process/_usms_smsout_process", editable: true, alwaysEditing: true},
			{field:"priority", name: "priority", width:"30px"},
			{field:"report", name: "report", width:"30px"},
			{field:"enablemessageclass", name: "enablemessageclass", width:"30px"},
			{field:"messageclass", name: "messageclass", width:"30px"},
			{field:"status", name: "status"},
			{field:"note", name: "note"}

		]);

myGridX.startup();


}

myGridX.Load= function(){
            // Request the text file
            request.get("view_sms_outgoing_datefilter.usms", {
	query: {fstart: dijit.byId('fstart')._getDate(), fend: dijit.byId('fend')._getDate(), nrows: dijit.byId('nrows').get('value')},
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
idsmsout: d.getNumber(i, "idsmsout"),
idowner: d.getNumber(i, "idowner"),  
enable: d.getBool(i, "enable"),
dateload: d.getString(i, "dateload"),
idprovider: d.getNumber(i, "idprovider"),
idsmstype: d.getNumber(i, "idsmstype"),
idphone: d.getNumber(i, "idphone"),
phone: d.getStringFromB64(i, "phone"),
datetosend: d.getString(i, "datetosend"),
message: d.getStringFromB64(i, "message"),
status: d.getNumber(i, "status"),
priority: d.getNumber(i, "priority"),
report: d.getBool(i, "report"),
messageclass: d.getNumber(i, "messageclass"),
enablemessageclass: d.getBool(i, "enablemessageclass"),
note: d.getStringFromB64(i, "note")
};
i++;
}
}
	ItemFileReadStore_1.clearOnClose = true;
	ItemFileReadStore_1.data = myData;
	ItemFileReadStore_1.close();

		myGridX.store = null;
		myGridX.setStore(ItemFileReadStore_1);

//myGridX.emit('onnotify', {msg: 'Se han cargado los datos'});

                },
                function(error){
                    // Display the error returned
myGridX.emit('onnotify', {msg: error});
                }
            );


}










     });
});


