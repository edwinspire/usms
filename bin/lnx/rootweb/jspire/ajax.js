// Objeto que representa una tabla de datos (filas y columnas) en formato xml obtenido desde dojo.xhrPost o dojo.xhrGet (handleAs: 'xml')
jspire.XmlDocFromXhr = function (xmldoc, getElementsByTagName){
this.xml = xmldoc,
this.ElementsByTagName = getElementsByTagName,
this.rows = this.xml.getElementsByTagName(this.ElementsByTagName),
this.length = this.rows.length,
this.getValue = function(i, field){
// Esto lo hacemos asi para evitar problemas cuando los datos no existen, si ese es el caso devuelve una cadena vacia en lugar de null
var x = this.rows[i].getElementsByTagName(field).item(0).firstChild;
if(x){
x = x.data;
}else{
console.log('jspire.XmlDocFromXhr: No existen datos para row '+i+' campo '+field+', se devuelve una cadena vacia en lugar de null.');
x = '';
}
return x;
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
