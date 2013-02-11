
jspire.dijit = {

gridx: {

// EditorArgs para una columna booleana de gridx editable, la columna debe usar como editor un checkbox y estar como alwaysEditing: true para que muestre el checkbox
EditorArgsToCellBoolean: {
props: 'value: true',
				fromEditor: function (d){
d1 = d+'';
		return d1.to_boolean();
	},
toEditor: function(storeData, gridData){
/*
r = true;
if(gridData == "false"){
r = false;
}else{
r = Boolean(gridData);
}
		return r;
*/
r = gridData+'';
return r.to_boolean();

				}
			},

// EditorArgs para una columna booleana de gridx editable, la columna debe usar como editor un checkbox y estar como alwaysEditing: true para que muestre el checkbox, pero no es editable
EditorArgsToCellBooleanDisabled: {
props: 'value: true, disabled: "true"',
				fromEditor: function (d){
d1 = d+'';
		return d1.to_boolean();
	},
toEditor: function(storeData, gridData){
/*
r = true;
if(gridData == "false"){
r = false;
}else{
r = Boolean(gridData);
}
*/
//		return r;
r = gridData+'';
return r.to_boolean();
				}
			}

}

}

// Da a dijit.form.DateTextBox la funcion de getDate de forma mas sencilla, el patron de fecha fabrica es yyyy-MM-dd
jspire.dijit.DateTextBox = function(DateTextBox_){
this.DateTextBox= DTB,
this.datePattern= "yyyy-MM-dd", 
this.selector= "date"
this.getDate = function(){
return dojo.date.locale.format(this.DateTextBox.get('value'), {datePattern: this.datePattern, selector: this.selector});
}
this.setDate() = function(date_){
this.DateTextBox.set('value', date_);
}
}



// Carga un dijit.form.FilteringSelect con datos obtenidos desde un xml usando dojox.data.XmlStore
jspire.dijit.FilteringSelect= {
FilteringSelectLoadFromXml: function(dijit_FilteringSelect, sq, urlxml, ri, lid, lname){
this.Url = urlxml,
this.SendQuery = sq,
this.RootItem = ri,
this.FilteringSelect = dijit_FilteringSelect,
this.Query = {},
this.TagId = lid,
this.TagName = lname,

// Carga Asincronamente los datos y setea el FilteringSelect
this.Load = function(){

var Objeto = this;
var store = new dojox.data.XmlStore({url: this.Url, sendQuery: this.SendQuery, rootItem: this.RootItem});
var request = store.fetch({query: this.Query, onComplete: function(itemsrow, r){
var dataxml = new jspireTableXmlStore(store, itemsrow);
numrows = itemsrow.length;
Items = [];
if(numrows > 0){
var i = 0;
while(i<numrows){
Items[i] =    {name: dataxml.getStringB64(i, Objeto.TagName), id: dataxml.getString(i, Objeto.TagId)};
i++;
}
}

Objeto.FilteringSelect.store = null;
Objeto.FilteringSelect.store = new dojo.store.Memory({data: Items});
Objeto.FilteringSelect.startup();

},
onError: function(e){
Objeto.isLoaded = true;
alert(e);
}
});

return this;
}
}
}




