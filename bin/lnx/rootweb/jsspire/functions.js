var jsspire = {
StringToBool: function(value){
//alert(value);
var Return = false;
if(value == "false"){
Return = false;
}else{
Return = Boolean(value);
}
return Return;
},
Base64: {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (inputinbase64) {
		var input = String(inputinbase64);
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
},
Xml :{
GetData: function(xmldatarow, tagname){
return xmldatarow.getElementsByTagName(tagname).item(0).firstChild.data;
},
GetDataFromBase64: function(xmldatarow, tagname){
return jsspire.Base64.decode(this.GetData(xmldatarow, tagname));
}
},
XmlStore: {
GetValue: function(store, item, tagname){
return store.getValue(item, tagname)
},
GetValueFromBase64: function(store, item, tagname){
return jsspire.Base64.decode(this.GetValue(store, item, tagname));
},
GetNumber:function(store, item, tagname){
return Number(this.GetValue(store, item, tagname));
}, 
GetBoolean:function(store, item, tagname){
return StringToBool(this.GetValue(store, item, tagname));
}, 
GetString:function(store, item, tagname){
return String(this.GetValue(store, item, tagname));
}
}

}

// Objeto que representa una tabla de datos (filas y columnas) en formato xml obtenido desde dojo.xhrPost o dojo.xhrGet (handleAs: 'xml')
var jspireTableXmlDoc = function (xmldoc, getElementsByTagName){
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

// Se tuvo un problema al parsear las fechas ya que siempre devolvia un dia menos, con esto se soluciona
var f = new Date(this.getString(i, field));
f.setDate(f.getDate()+1); 
return f;
},
this.getStringB64 = function(i, field){
return jsspire.Base64.decode(this.getValue(i, field));
}
}

// Objeto que representa una tabla de datos (filas y columnas) en formato xml obtenido desde un dojox.data.XmlStore
var jspireTableXmlStore = function (xmlstore, xmlitems){
this.store = xmlstore,
this.items = xmlitems,
this.lengthItems = this.items.length,
this.getValue = function(i, field){
return this.store.getValue(this.items[i], field);
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

// Se tuvo un problema al parsear las fechas ya que siempre devolvia un dia menos, con esto se soluciona
var f = new Date(this.getString(i, field));
f.setDate(f.getDate()+1); 
return f;
},
this.getStringB64 = function(i, field){
return jsspire.Base64.decode(this.getValue(i, field));
}
}

// Carga una matriz de datos (Items) con campos id y value desde una tabla xml usando dojox.data.XmlStore
// Requiere tambien de dojo.store.Memory
var jspireMemoryIdValueFromXmlStore = function(sq, urlxml, ri, lid, lvalue){
this.Url = urlxml,
this.SendQuery = sq,
this.RootItem = ri,
this.Query = {},
this.TagId = lid,
this.TagValue = lvalue,
this.Items = [],
this.isLoaded = false,
this.Memory = function(){
return new dojo.store.Memory({data: this.Items});
},
// La carga es asincrona por lo que existe la propiedad isLoaded que se pone en true cuando los datos estan cargados
this.Load = function(){
this.isLoaded = false;
this.Items = [];
var Objeto = this;
var store = new dojox.data.XmlStore({url: this.Url, sendQuery: this.SendQuery, rootItem: this.RootItem});

var request = store.fetch({query: this.Query, onComplete: function(itemsrow, r){

var dataxml = new jspireTableXmlStore(store, itemsrow);

numrows = itemsrow.length;

if(numrows > 0){
var i = 0;
while(i<numrows){
Objeto.Items[i] =    {value: dataxml.getStringB64(i, Objeto.TagValue), id: dataxml.getString(i, Objeto.TagId)};
i++;
}
}
Objeto.isLoaded = true;
},
onError: function(e){
Objeto.isLoaded = true;
alert(e);
}
});

return this;
}

}

// Carga un FilteringSelect con datos desde una tabla xml usando dojox.data.XmlStore
var jspireLoadFilteringSelectFromTableXmlStore = function(dijit_FilteringSelect, sq, urlxml, ri, lid, lname){
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



function StringToBool(value){
//alert(value);
var Return = false;
if(value == "false"){
Return = false;
}else{
Return = Boolean(value);
}
return Return;
}


/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
 
var Base64 = {
 
	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
 
	// public method for encoding
	encode : function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = Base64._utf8_encode(input);
 
		while (i < input.length) {
 
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);
 
			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;
 
			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}
 
			output = output +
			this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
			this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
 
		}
 
		return output;
	},
 
	// public method for decoding
	decode : function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;
 
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
 
		while (i < input.length) {
 
			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));
 
			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
 
			output = output + String.fromCharCode(chr1);
 
			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}
 
		}
 
		output = Base64._utf8_decode(output);
 
		return output;
 
	},
 
	// private method for UTF-8 encoding
	_utf8_encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// private method for UTF-8 decoding
	_utf8_decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}
