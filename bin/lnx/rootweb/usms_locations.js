	/*
 * This file is provided for custom JavaScript logic that your HTML files might need.
 * Maqetta includes this JavaScript file by default within HTML pages authored in Maqetta.
 */

require(["dojo/ready",  
"dojo/on",
"dojo/data/ItemFileWriteStore",
"dojo/request",
	"gridx/Grid",
	"gridx/core/model/cache/Async",
'gridx/modules/Focus',
'gridx/modules/CellWidget',
'gridx/modules/Edit',
"gridx/modules/VirtualVScroller",
"jspire/request/Xml",
"gridx/modules/RowHeader",
"gridx/modules/select/Row",
"gridx/modules/IndirectSelect",
"gridx/modules/extendedSelect/Row",
"dijit/form/TextBox"
], function(ready, on, ItemFileWriteStore, request, Grid, Async, Focus, CellWidget, Edit, VirtualVScroller, RXml){
     ready(function(){

var nameLevel = {
L1: 'Nivel 1: ',
L2: 'Nivel 2: ',
L3: 'Nivel 3: ',
L4: 'Nivel 4: ',
L5: 'Nivel 5: ',
L6: 'Nivel 6: '
}

 dijit.byId('id_titlebar').set('label', 'Localización');
var NotifyArea = dijit.byId('id_notify_area');  

//menuL1._addButtonLoad();

         // logic that requires that Dojo is fully initialized should go here
//dojo.parser.parse('myapp');
// Objeto base con funciones comunes
var ObjectBase = function(l, g, s, wt, wm){
this.wTitle = dijit.byId(wt);
this.wMenu = dijit.byId(wm),
this.id= 0,
this.fk = 0,
this.level = l,
this.to_delete= [],
this.Grid = dijit.byId(g),
this.Store = s,
this.title= 'Selección: ',
this.setHeaderLabel= function(label){
this.wTitle.set('label', this.title+'['+label+']'); 
},
this.setDataGrid = function(myData){
var t = this;
t.Store.clearOnClose = true;
	t.Store.data = myData;
	t.Store.close();

		t.Grid.store = null;
		t.Grid.setStore(t.Store);
},
this.clearDataGrid = function(){
var myData = {identifier: "unique_id", items: []};
this.setDataGrid(myData);
},
this.onLoad = function(){
NotifyArea.notify({message: 'onLoad: Función no implementada'});
},
this.connect_all = function(){
this.connect_onSelectionToDelete();
this.connect_onSet();
this.connect_onRowClick();
this.connect_Menu();
},
this.connect_Menu = function(){
var t = this;
t.wMenu.on('onclickdelete', function(e){
t.delete();
});

t.wMenu.on('onclicksave', function(e){
var item = e;
item.idfk = t.fk;
t.save(item);
});
},
this.connect_onSet = function(){
var t = this;
// Guarda los cambios
dojo.connect(t.Store, 'onSet', function(item, attribute, oldValue, newValue){
t.save(item);
});
},
this.connect_onSelectionToDelete = function(){
var t = this;
// Obtiene los ids de los registros que se van a eliminar y los guarda en una matriz
dojo.connect(t.Grid.select.row, 'onSelectionChange', function(selected){
t.to_delete = [];
numsel = selected.length;
i = 0;
while(i<numsel){
// Aqui buscamos los datos desde el store y no desde la celda.
t.Store.fetch({query: {unique_id: selected[i]}, onItem: function(item){
t.to_delete[i] = t.Store.getValue(item, 'idpk');
} 
});
i++;
}
});
},
this.onRowClick = function(){
NotifyArea.notify({message: 'onRowClick: Función no implementada'});
},
this.connect_onRowClick = function(){
var t = this;
dojo.connect(t.Grid, 'onRowClick', function(event){
d = this.cell(event.rowId, 1, true).data();
// Aqui buscamos los datos desde el store y no desde la celda.
t.Store.fetch({query: {unique_id: d}, onItem: function(item){
t.id = t.Store.getValue(item, 'idpk');
t.setHeaderLabel(t.Store.getValue(item, 'name'));
}
});
t.onRowClick();
});
},
this.save = function (item){
var t = this;
var d = {level: t.level, idpk:item.idpk, idfk: item.idfk, name: item.name, code: item.code, ts: item.ts};
request.post('fun_location_level_edit_xml_from_hashmap.usms', {
   handleAs: "xml",
data: d,
}).then(function(response){

var xmld = new RXml.getFromXhr(response, 'row');

if(xmld.length > 0){
NotifyArea.notify({message: xmld.getStringFromB64(0, 'outpgmsg')});
}
t.onLoad();
}, function(error){
t.onLoad();
NotifyArea.notify({message: error});
});

},
this.delete = function(){
var t = this;
request.post('fun_location_level_remove_selected_xml.usms', {
   handleAs: "xml",
data: {ids: t.to_delete.toString(), level: t.level},
}).then(function(response){

var xmld = new RXml.getFromXhr(response, 'row');

if(xmld.length > 0){
NotifyArea.notify({message: xmld.getStringFromB64(0, 'outpgmsg')});
}
t.onLoad();
}, function(error){
t.onLoad();
NotifyArea.notify({message: error});
});

}
}




//Construimos el objeto con todas las funciones necesarias

var L1 = new ObjectBase(1, 'GridL1', StoreL1, 'labL1', 'id_menu_L1');
if(L1.Grid){
		L1.Grid.setColumns([
			{field:"unique_id", name: "#", width: '20px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L1.Grid.startup();
}
L1.title = nameLevel.L1;
L1.connect_all();
L1.onRowClick = function(){
L2.onLoad();
}
L1.onLoad = function(){
var t = L1;
t.id = 0;
t.to_delete = [];
t.setHeaderLabel('---');
L2.onLoad();
            // Request the text file
            request.get("fun_view_location_level_xml.usms", {
	query: {level: t.level},
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
idpk: d.getNumber(i, "idl1"),
name: d.getStringFromB64(i, "name"),
code: d.getStringFromB64(i, "code"),
ts: d.getString(i, "ts")
};
i++;
}
t.setDataGrid(myData);

                },
                function(error){
                    // Display the error returned
NotifyArea.notify({message: error});
                }
            );

}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Construimos el objeto con todas las funciones necesarias 2
var L2 = new ObjectBase(2, 'GridL2', StoreL2, 'labL2', 'id_menu_L2');
if(L2.Grid){
		L2.Grid.setColumns([
			{field:"unique_id", name: "#", width: '20px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L2.Grid.startup();
}
L2.title = nameLevel.L2;
L2.connect_all();
L2.onRowClick = function(){
L3.onLoad();
}
L2.onLoad = function(){
var t = L2;
t.fk = L1.id;
t.id = 0;
t.to_delete = [];
t.setHeaderLabel('---');
L3.onLoad();
var myData = {identifier: "unique_id", items: []};

if(L1.id > 0){
            // Request the text file
            request.get("fun_view_location_level_xml.usms", {
	query: {idfk: t.fk, level: t.level},
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');

numrows = d.length;

var i = 0;
while(i<numrows){

myData.items[i] = {
unique_id:i+1,
idfk: d.getNumber(i, "idl1"),
idpk: d.getNumber(i, "idl2"),
name: d.getStringFromB64(i, "name"),
code: d.getStringFromB64(i, "code"),
ts: d.getString(i, "ts")
};
i++;
}
t.setDataGrid(myData);
                },
                function(error){
                    // Display the error returned
NotifyArea.notify({message: error});
                }
            );
}else{
t.setDataGrid(myData);
}
}





///////////////////////////////////////////////////////////////////////////////////////

//Construimos el objeto con todas las funciones necesarias 3
var L3 = new ObjectBase(3, 'GridL3', StoreL3, 'labL3', 'id_menu_L3');
if(L3.Grid){
		L3.Grid.setColumns([
			{field:"unique_id", name: "#", width: '15px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L3.Grid.startup();
}
L3.title = nameLevel.L3;
L3.connect_all();
L3.onRowClick = function(){
L4.onLoad();
}
L3.onLoad = function(){
var t = L3;
t.fk = L2.id;
t.id = 0;
t.to_delete = [];
t.setHeaderLabel('---');
L4.onLoad();
var myData = {identifier: "unique_id", items: []};

if(L2.id > 0){
            // Request the text file
            request.get("fun_view_location_level_xml.usms", {
	query: {idfk: t.fk, level: t.level},
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');

numrows = d.length;

var i = 0;
while(i<numrows){

myData.items[i] = {
unique_id:i+1,
idfk: d.getNumber(i, "idl2"),
idpk: d.getNumber(i, "idl3"),
name: d.getStringFromB64(i, "name"),
code: d.getStringFromB64(i, "code"),
ts: d.getString(i, "ts")
};
i++;
}
t.setDataGrid(myData);
                },
                function(error){
                    // Display the error returned
NotifyArea.notify({message: error});
                }
            );
}else{
t.setDataGrid(myData);
}
}

////////////////////////////////////////////////////////////////////////

//Construimos el objeto con todas las funciones necesarias
var L4 = new ObjectBase(4, 'GridL4', StoreL4, 'labL4', 'id_menu_L4');
if(L4.Grid){
		L4.Grid.setColumns([
			{field:"unique_id", name: "#", width: '15px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L4.Grid.startup();
}

L4.title = nameLevel.L4;
L4.connect_all();
L4.onRowClick = function(){
L5.onLoad();
}
L4.onLoad = function(){
var t = L4;
t.fk = L3.id;
t.id = 0;
t.to_delete = [];
t.setHeaderLabel('---');
L5.onLoad();
var myData = {identifier: "unique_id", items: []};

if(L3.id > 0){
            // Request the text file
            request.get("fun_view_location_level_xml.usms", {
	query: {idfk: t.fk, level: t.level},
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');

numrows = d.length;

var i = 0;
while(i<numrows){

myData.items[i] = {
unique_id:i+1,
idfk: d.getNumber(i, "idl3"),
idpk: d.getNumber(i, "idl4"),
name: d.getStringFromB64(i, "name"),
code: d.getStringFromB64(i, "code"),
ts: d.getString(i, "ts")
};
i++;
}
t.setDataGrid(myData);
                },
                function(error){
                    // Display the error returned
NotifyArea.notify({message: error});
                }
            );
}else{
t.setDataGrid(myData);
}
}





////////////////////////////////////////////////////////////////////////

//Construimos el objeto con todas las funciones necesarias
var L5 = new ObjectBase(5, 'GridL5', StoreL5, 'labL5', 'id_menu_L5');
if(L5.Grid){
		L5.Grid.setColumns([
			{field:"unique_id", name: "#", width: '15px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L5.Grid.startup();
}
L5.title = nameLevel.L5;
L5.connect_all();
L5.onRowClick = function(){
L6.onLoad();
}
L5.onLoad = function(){
var t = L5;
t.fk = L4.id;
t.id = 0;
t.to_delete = [];
t.setHeaderLabel('---');
L6.onLoad();
var myData = {identifier: "unique_id", items: []};

if(L4.id > 0){
            // Request the text file
            request.get("fun_view_location_level_xml.usms", {
	query: {idfk: t.fk, level: t.level},
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');

numrows = d.length;

var i = 0;
while(i<numrows){

myData.items[i] = {
unique_id:i+1,
idfk: d.getNumber(i, "idl4"),
idpk: d.getNumber(i, "idl5"),
name: d.getStringFromB64(i, "name"),
code: d.getStringFromB64(i, "code"),
ts: d.getString(i, "ts")
};
i++;
}
t.setDataGrid(myData);
                },
                function(error){
                    // Display the error returned
NotifyArea.notify({message: error});
                }
            );
}else{
t.setDataGrid(myData);
}
}





////////////////////////////////////////////////////////////////////////

//Construimos el objeto con todas las funciones necesarias
var L6 = new ObjectBase(6, 'GridL6', StoreL6, 'labL6', 'id_menu_L6');
if(L6.Grid){
		L6.Grid.setColumns([
			{field:"unique_id", name: "#", width: '15px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L6.Grid.startup();
}
L6.title = nameLevel.L6;
L6.connect_all();
L6.onRowClick = function(){
}
L6.onLoad = function(){
var t = L6;
t.fk = L5.id;
t.id = 0;
t.to_delete = [];
t.setHeaderLabel('---');
var myData = {identifier: "unique_id", items: []};

if(L5.id > 0){
            // Request the text file
            request.get("fun_view_location_level_xml.usms", {
	query: {idfk: t.fk, level: t.level},
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');

numrows = d.length;

var i = 0;
while(i<numrows){

myData.items[i] = {
unique_id:i+1,
idfk: d.getNumber(i, "idl5"),
idpk: d.getNumber(i, "idl6"),
name: d.getStringFromB64(i, "name"),
code: d.getStringFromB64(i, "code"),
ts: d.getString(i, "ts")
};
i++;
}
t.setDataGrid(myData);
                },
                function(error){
                    // Display the error returned
NotifyArea.notify({message: error});
                }
            );
}else{
t.setDataGrid(myData);
}
}


setTimeout(L1.onLoad, 5000)




     });
});
