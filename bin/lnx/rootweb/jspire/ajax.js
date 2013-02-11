// Objeto que representa una tabla de datos (filas y columnas) en formato xml obtenido desde dojo.xhrPost o dojo.xhrGet (handleAs: 'xml')
jspire.XmlDocFromXhr = function (xmldoc, getElementsByTagName){
this.xml = xmldoc,
this.ElementsByTagName = getElementsByTagName,
this.rows = this.xml.getElementsByTagName(this.ElementsByTagName),
this.length = this.rows.length,
this.getValue = function(i, field){
return this.rows[i].getElementsByTagName(field).item(0).firstChild.data;
},
this.getBool = function(i, field){
return jsspire.StringToBool(this.getValue(i, field));
},
this.getNumber = function(i, field){
return Number(this.getValue(i, field));
},
this.getInt = function(i, field){
return parseInt(this.getValue(i, field));
},
this.getFloat = function(i, field){
return parseFloat(this.getValue(i, field));
},
this.getString = function(i, field){
return String(this.getValue(i, field));
},
this.getDate = function(i, field){
return this.getString(i, field).to_date();
},
this.getStringFromB64 = function(i, field){
return this.getString(i, field).from_base64();
}
}


// Objeto que representa una tabla de datos (filas y columnas) en formato xml obtenido desde un dojox.data.XmlStore
jspire.XmlDocFromXmlStore = function (xmlstore, xmlitems){
this.store = xmlstore,
this.items = xmlitems,
this.lengthItems = this.items.length,
this.getValue = function(i, field){
return this.store.getValue(this.items[i], field);
},
this.getBool = function(i, field){
return this.getString(i, field).to_boolean();
},
this.getNumber = function(i, field){
return Number(this.getValue(i, field));
},
this.getInt = function(i, field){
return parseInt(this.getValue(i, field));
},
this.getFloat = function(i, field){
return parseFloat(this.getValue(i, field));
},
this.getString = function(i, field){
return String(this.getValue(i, field));
},
this.getDate = function(i, field){
return this.getString(i, field).to_date();
},
this.getStringFromB64 = function(i, field){
return this.getString(i, field).from_base64();
}
}

