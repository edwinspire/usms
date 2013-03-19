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

         // logic that requires that Dojo is fully initialized should go here
//dojo.parser.parse('myapp');
// Objeto base con funciones comunes
var ObjectBase = function(l, g, s, dd, od){
this.id= 0,
this.level = l,
this.to_delete= [],
this.label= '',
this.Grid = dijit.byId(g),
this.Store = s,
this.iddialogdel = dd,
this.idownerdel = od,
this.title= 'Selección: ',
this.setHeaderLabel= function(label){
this.label.innerHTML = this.title+'['+label+']';
},
this.setDataGrid = function(myData){
var t = this;
t.Store.clearOnClose = true;
	t.Store.data = myData;
	t.Store.close();

		t.Grid.store = null;
		t.Grid.setStore(t.Store);
},
this.onLoad = function(){
alert('No implementado');
},
this.connect_all = function(){
this.connect_onSelectionToDelete();
this.connect_onSet();
this.connect_onDelete();
this.connect_onRowClick();
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
alert('onRowClick no implementado');
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
this.connect_onDelete = function(){
// Elimina los registros seleccionados
var t = this;
        var dialogdel = dijit.byId(t.iddialogdel);
dialogdel.setowner(t.idownerdel, 'onclick').on('onok', function(){
t.delete();
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
alert(xmld.getStringFromB64(0, 'outpgmsg'));
}
t.onLoad();
}, function(error){
t.onLoad();
alert(error);
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
alert(xmld.getStringFromB64(0, 'outpgmsg'));
}
t.onLoad();
}, function(error){
t.onLoad();
alert(error);
});

}
}

//Construimos el objeto con todas las funciones necesarias


var L1 = new ObjectBase(1, 'GridL1', StoreL1, 'L1dialogdel', 'delL1');
L1.title = nameLevel.L1;
L1.label = dojo.byId('labL1');
L1.connect_all();
L1.onRowClick = function(){
L2.onLoad();
}
L1.onLoad = function(){
var t = this;
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
alert(error);
                }
            );

}


        var dL1dialognew = dijit.byId('L1dialognew');
dL1dialognew.setowner('newL1', 'onclick').innerHTML('<form id="L1form">  <table border="0" style="border-collapse: collapse; table-layout: auto; width: 100%; height: 100%;">    <colgroup>      <col></col>      <col></col>    </colgroup>    <tbody>      <tr>       <td>          <label style="margin-right: 3px;">            Nombre:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L1name" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="nombre"></input>       </td>      </tr>      <tr>        <td>          <label style="margin-right: 3px;">            Código:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L1code" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="Código de área"></input>       </td>      </tr>    </tbody>  </table></form>').on('onok', function(){

L1.save({name: dijit.byId('L1name').get('value'), code: dijit.byId('L1code').get('value')});

dojo.byId('L1form').reset();
});

// Carga los datos al hacer click
dijit.byId('loadL1').on('Click', function(){
L1.onLoad();
});

if(L1.Grid){
		L1.Grid.setColumns([
			{field:"unique_id", name: "#", width: '20px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L1.Grid.startup();
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Construimos el objeto con todas las funciones necesarias
var L2 = new ObjectBase(2, 'GridL2', StoreL2, 'L2dialogdel', 'delL2');
L2.title = nameLevel.L2;
L2.label = dojo.byId('labL2');
L2.connect_all();
L2.onRowClick = function(){
L3.onLoad();
}
L2.onLoad = function(){
var t = this;
t.id = 0;
t.to_delete = [];
t.setHeaderLabel('---');
L3.onLoad();
var myData = {identifier: "unique_id", items: []};

if(L1.id > 0){
            // Request the text file
            request.get("fun_view_location_level_xml.usms", {
	query: {idfk: L1.id, level: t.level},
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
alert(error);
                }
            );
}else{
t.setDataGrid(myData);
}
}


        var dL2dialognew = dijit.byId('L2dialognew');
dL2dialognew.setowner('newL2', 'onclick').innerHTML('<form id="L2form">  <table border="0" style="border-collapse: collapse; table-layout: auto; width: 100%; height: 100%;">    <colgroup>      <col></col>      <col></col>    </colgroup>    <tbody>      <tr>        <td>          <label style="margin-right: 3px;">            Nombre:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L2name" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="Estado / Provincia"></input>       </td>      </tr>      <tr>        <td>          <label style="margin-right: 3px;">            Código:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L2code" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="Código de área"></input>       </td>      </tr>    </tbody>  </table></form>').on('onok', function(){
if(L1.id > 0){
L2.save({idfk: L1.id, name: dijit.byId('L2name').get('value'), code: dijit.byId('L2code').get('value')});
}else{
alert('No hay un nivel superior seleccionado');
}
dojo.byId('L2form').reset();
});



if(L2.Grid){
		L2.Grid.setColumns([
			{field:"unique_id", name: "#", width: '20px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L2.Grid.startup();
}



///////////////////////////////////////////////////////////////////////////////////////

//Construimos el objeto con todas las funciones necesarias
var L3 = new ObjectBase(3, 'GridL3', StoreL3, 'L3dialogdel', 'delL3');
L3.title = nameLevel.L3;
L3.label = dojo.byId('labL3');
L3.connect_all();
L3.onRowClick = function(){
L4.onLoad();
}
L3.onLoad = function(){
var t = this;
t.id = 0;
t.to_delete = [];
t.setHeaderLabel('---');
L4.onLoad();
var myData = {identifier: "unique_id", items: []};

if(L2.id > 0){
            // Request the text file
            request.get("fun_view_location_level_xml.usms", {
	query: {idfk: L2.id, level: t.level},
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
alert(error);
                }
            );
}else{
t.setDataGrid(myData);
}
}


        var dL3dialognew = dijit.byId('L3dialognew');
dL3dialognew.setowner('newL3', 'onclick').innerHTML('<form id="L3form">  <table border="0" style="border-collapse: collapse; table-layout: auto; width: 100%; height: 100%;">    <colgroup>      <col></col>      <col></col>    </colgroup>    <tbody>      <tr>        <td>          <label style="margin-right: 3px;">            Nombre:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L3name" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="Ciudad"></input>       </td>      </tr>      <tr>        <td>          <label style="margin-right: 3px;">            Código:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L3code" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="Código de área"></input>       </td>      </tr>    </tbody>  </table></form>').on('onok', function(){
if(L2.id > 0){
L3.save({idfk: L2.id, name: dijit.byId('L3name').get('value'), code: dijit.byId('L3code').get('value')});
}else{
alert('No hay un nivel superior seleccionado');
}

dojo.byId('L3form').reset();
});

if(L3.Grid){
		L3.Grid.setColumns([
			{field:"unique_id", name: "#", width: '15px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L3.Grid.startup();
}


////////////////////////////////////////////////////////////////////////

//Construimos el objeto con todas las funciones necesarias
var L4 = new ObjectBase(4, 'GridL4', StoreL4, 'L4dialogdel', 'delL4');
L4.title = nameLevel.L4;
L4.label = dojo.byId('labL4');
L4.connect_all();
L4.onRowClick = function(){
L5.onLoad();
}
L4.onLoad = function(){
var t = this;
t.id = 0;
t.to_delete = [];
t.setHeaderLabel('---');
L5.onLoad();
var myData = {identifier: "unique_id", items: []};

if(L3.id > 0){
            // Request the text file
            request.get("fun_view_location_level_xml.usms", {
	query: {idfk: L3.id, level: t.level},
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
alert(error);
                }
            );
}else{
t.setDataGrid(myData);
}
}

        var dL4dialognew = dijit.byId('L4dialognew');
dL4dialognew.setowner('newL4', 'onclick').innerHTML('<form id="L4form">  <table border="0" style="border-collapse: collapse; table-layout: auto; width: 100%; height: 100%;">    <colgroup>      <col></col>      <col></col>    </colgroup>    <tbody>      <tr>        <td>          <label style="margin-right: 3px;">            Nombre:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L4name" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="Ciudad"></input>       </td>      </tr>      <tr>        <td>          <label style="margin-right: 3px;">            Código:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L4code" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="Código de área"></input>       </td>      </tr>    </tbody>  </table></form>').on('onok', function(){
if(L3.id > 0){
L4.save({idfk: L3.id, name: dijit.byId('L4name').get('value'), code: dijit.byId('L4code').get('value')});
}else{
alert('No hay un nivel superior seleccionado');
}

dojo.byId('L4form').reset();
});
       


if(L4.Grid){
		L4.Grid.setColumns([
			{field:"unique_id", name: "#", width: '15px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L4.Grid.startup();
}

////////////////////////////////////////////////////////////////////////

//Construimos el objeto con todas las funciones necesarias
var L5 = new ObjectBase(5, 'GridL5', StoreL5, 'L5dialogdel', 'delL5');
L5.title = nameLevel.L5;
L5.label = dojo.byId('labL5');
L5.connect_all();
L5.onRowClick = function(){
L6.onLoad();
}
L5.onLoad = function(){
var t = this;
t.id = 0;
t.to_delete = [];
t.setHeaderLabel('---');
L6.onLoad();
var myData = {identifier: "unique_id", items: []};

if(L4.id > 0){
            // Request the text file
            request.get("fun_view_location_level_xml.usms", {
	query: {idfk: L4.id, level: t.level},
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
alert(error);
                }
            );
}else{
t.setDataGrid(myData);
}
}

        var dL5dialognew = dijit.byId('L5dialognew');
dL5dialognew.setowner('newL5', 'onclick').innerHTML('<form id="L5form">  <table border="0" style="border-collapse: collapse; table-layout: auto; width: 100%; height: 100%;">    <colgroup>      <col></col>      <col></col>    </colgroup>    <tbody>      <tr>        <td>          <label style="margin-right: 3px;">            Nombre:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L5name" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="Ciudad"></input>       </td>      </tr>      <tr>        <td>          <label style="margin-right: 3px;">            Código:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L5code" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="Código de área"></input>       </td>      </tr>    </tbody>  </table></form>').on('onok', function(){
if(L4.id > 0){
L5.save({idfk: L4.id, name: dijit.byId('L5name').get('value'), code: dijit.byId('L5code').get('value')});
}else{
alert('No hay un nivel superior seleccionado');
}

dojo.byId('L5form').reset();
});
       


if(L5.Grid){
		L5.Grid.setColumns([
			{field:"unique_id", name: "#", width: '15px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L5.Grid.startup();
}



////////////////////////////////////////////////////////////////////////

//Construimos el objeto con todas las funciones necesarias
var L6 = new ObjectBase(6, 'GridL6', StoreL6, 'L6dialogdel', 'delL6');
L6.title = nameLevel.L6;
L6.label = dojo.byId('labL6');
L6.connect_all();
L6.onRowClick = function(){
}
L6.onLoad = function(){
var t = this;
t.id = 0;
t.to_delete = [];
t.setHeaderLabel('---');
var myData = {identifier: "unique_id", items: []};

if(L5.id > 0){
            // Request the text file
            request.get("fun_view_location_level_xml.usms", {
	query: {idfk: L5.id, level: t.level},
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
alert(error);
                }
            );
}else{
t.setDataGrid(myData);
}
}

        var dL6dialognew = dijit.byId('L6dialognew');
dL6dialognew.setowner('newL6', 'onclick').innerHTML('<form id="L6form">  <table border="0" style="border-collapse: collapse; table-layout: auto; width: 100%; height: 100%;">    <colgroup>      <col></col>      <col></col>    </colgroup>    <tbody>      <tr>        <td>          <label style="margin-right: 3px;">            Nombre:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L6name" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="nombre"></input>       </td>      </tr>      <tr>        <td>          <label style="margin-right: 3px;">            Código:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="L6code" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="Código de área"></input>       </td>      </tr>    </tbody>  </table></form>').on('onok', function(){
if(L5.id > 0){
L6.save({idfk: L5.id, name: dijit.byId('L6name').get('value'), code: dijit.byId('L6code').get('value')});
}else{
alert('No hay un nivel superior seleccionado');
}

dojo.byId('L6form').reset();
});
       


if(L6.Grid){
		L6.Grid.setColumns([
			{field:"unique_id", name: "#", width: '15px'},
			{field:"name", name: "Nombre", editable: true},
     			{field:"code", name: "Código", editable: true}
		]);
L6.Grid.startup();
}












     });
});
