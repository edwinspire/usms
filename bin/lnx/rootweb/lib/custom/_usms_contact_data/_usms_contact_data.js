define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usms_contact_data/_usms_contact_data.html',
'dojo/request', 'jspire/request/Xml', 
'jspire/form/DateTextBox',
'jspire/form/FilteringSelect',
'dojo/dom-style',
"dojo/json"
],function(declare,_Widget,_Templated,templateString, request, RXml, DTBox, jsFS, domStyle, JSON){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
_id: 0,
_ts: "",
_idaddress: 0,
reset: function(){
t = this;
t._id = 0;
t._ts = "1990-01-01";
t._idaddress = 0;
t.Formulario.reset();
},
postCreate: function(){
var t = this;

DTBox.addGetDateFunction(t.Birthday);
jsFS.addXmlLoader(t.id_contact_search, "getcontactslistidcontactname_xml.usms", "row", {}, "idcontact", "name");

var bBuscar = t.menubar.addButton('Buscar', '');
bBuscar.on('Click', function(){
t._onSearch(true);
t._id = 0;
t._Load();
t.id_contact_search.reset();
t.id_contact_search.Load();
});

t.id_contact_search.on('Change', function(){
id = t.id_contact_search.get('value');
if(id>0){
t._onSearch(false);
t.set('idcontact', id);
}

});


t.menubar.on('ondelete', function(){
t._Delete();
});


t.menubar.on('onnew', function(){
t._id = 0;
t._Load();
});

t.menubar.on('onsave', function(){
t._Save();
});




},
_onSearch: function(show){
var t = this;
if(show){
domStyle.set(t.id_contact_search.domNode, "display", "block");
}else{
domStyle.set(t.id_contact_search.domNode, "display", "none");
}
},
_setIdcontactAttr: function(id){
this._id = id;
this._Load();
},
_getIdcontactAttr: function(){
return this._id;
},
_setIdaddressAttr: function(id){
this._idaddress = id;
// Al setear el idaddress debemos guardar ese seteo
this._Save();
},
_getIdaddressAttr: function(){
return this._idaddress;
},
_Load: function(){
var t = this;
if(t._id > 0){
            // Request the text file
            request.get("getcontactbyid_xml.usms", {
            // Parse data from xml
	query: {idcontact: t._id},
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');

numrows = d.length;
if(numrows > 0){
var i = 0;
t.Enable.set('checked', d.getBool(i, "enable"));
t.FirstName.set('value', d.getStringFromB64(i, "firstname"));
t.LastName.set('value', d.getStringFromB64(i, "lastname"));

t.Title.set('value', d.getStringFromB64(i, "title"));
t.Birthday.set('value', d.getDate(i, "birthday"));
t.Gender.set('value', d.getNumber(i, "gender"));
t.IdentificationType.set('value', d.getNumber(i, "typeofid"));
t.Identification.set('value', d.getStringFromB64(i, "identification"));
t.Web.set('value', d.getStringFromB64(i, "web"));
t.email1.set('value', d.getStringFromB64(i, "email1"));
t.email2.set('value', d.getStringFromB64(i, "email2"));
t.Note.set('value', d.getStringFromB64(i, "note"));
t._ts = d.getStringFromB64(i, "ts");
t._idaddress = d.getNumber(i, "idaddress");
t._id = d.getNumber(i, "idcontact");

}else{
t._id = 0;
t._idaddress = 0;
t.Formulario.reset();
}

t.emit('onloadcontact', {idcontact: t._id, idaddress: t._idaddress});

                },
                function(error){
                    // Display the error returned
t.Formulario.reset();
t.emit('onloadcontact',  {idcontact: 0, idaddress: 0});
t.emit('onnotify', {msg: error});
                }
            );
}else{
t.Formulario.reset();
t.emit('onloadcontact',  {idcontact: 0, idaddress: 0});
}

},

values: function(){
var t = this;
return {
idcontact: t._id, 
enable: t.Enable.get('checked'), 
title: t.Title.get('value'), 
firstname: t.FirstName.get('value'), 
lastname: t.LastName.get('value'), 
birthday: t.Birthday._getDate(),
gender: t.Gender.get('value'), 
typeofid: t.IdentificationType.get('value'), 
identification: t.Identification.get('value'), 
web: t.Web.get('value'), 
email1: t.email1.get('value'), 
email2: t.email2.get('value'), 
note: t.Note.get('value'), 
ts: t._ts,
idaddress: t._idaddress
}
},

_Save: function(){

var t = this;

if(t.Formulario.validate()){
            // Request the text file
            request.post("contacts_table_edit.usms", {
            // Parse data from xml
	data: t.values(),
            handleAs: "xml"
        }).then(
                function(response){

var xmld = new RXml.getFromXhr(response, 'row');

if(xmld.length > 0){

t._id = xmld.getInt(0, 'outreturn');
t.emit('onnotify', {msg: xmld.getStringFromB64(0, 'outpgmsg')});
}else{
t._id = 0;
}
t.emit('onsavecontact', {idcontact: t._id});
t._Load();

                },
                function(error){
                    // Display the error returned
t.emit('onnotify', {msg: error});
t._id = 0;
t._Load();
                }
            );

}else{
t.emit('onnotify', {msg: 'Los datos no han sido completados correctamente'});
}

//return Objeto;
},
_Delete: function(){
// Internamente postgres elimina automaticamente es idaddress
var t = this;

if(t._id > 0){
            // Request the text file
            request.post("contacts_table_edit.usms", {
            // Parse data from xml
	data: {idcontact: t._id*-1},
            handleAs: "xml"
        }).then(
                function(response){

var xmld = new RXml.getFromXhr(response, 'row');

if(xmld.length > 0){
if(0 == Math.abs(xmld.getInt(0, 'outreturn'))){
// Fue borrado correctamente
t.emit('ondeletecontact', {idcontact: t._id, idaddress: t._idaddress});
t.reset();
}
t.emit('onnotify', {msg: xmld.getStringFromB64(0, 'outpgmsg')});
}else{
t.reset();
}

t._Load();

                },
                function(error){
                    // Display the error returned
t.emit('onnotify', {msg: error});
t._id = 0;
t._Load();
                }
            );

}else{
t.emit('onnotify', {msg: 'No ha seleccionado un contacto para eliminar'});
}

//return Objeto;
}


   
});
});
