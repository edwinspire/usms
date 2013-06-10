define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usaga_account_basic_data/_usaga_account_basic_data.html',
'dojo/request',
'jspire/form/FilteringSelect',
'jspire/request/Xml',
'_common_basic_menubar/_common_basic_menubar'
],function(declare,_Widget,_Templated,templateString, R, jsFS, RXml){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
Id: 0,
postCreate: function(){

var t = this;

t.idmenu.on('onnew', function(){
t.form_data.reset();
t.account_select.set('invalidMessage', 'El nombre de Abonado es permitido');
t.emit('onloadaccount', {idaccount: 0, idaddress: 0}); 
t.emit('notify_message', {message: 'Crear nuevo abonado'}); 
});

t.idmenu.on('ondelete', function(){
t._delete();
});

t.idmenu.on('onsave', function(){
t.account_select.set('invalidMessage', 'Debe seleccionar un abonado de la lista');
t._save();
});

t.account_select.on('Change', function(){
t._LoadAccountSelected();
});

jsFS.addXmlLoader(t.account_select, 'fun_view_idaccounts_names_xml.usaga', 'row', {}, 'idaccount', 'name');
jsFS.addXmlLoader(t.idgroup, 'fun_view_groups_xml.usaga', 'row', {}, 'idgroup', 'name');

t.account_select.Load();
t.idgroup.Load();


},
_resetall: function(){
this.form_data.reset();
this._idaddress = 0;
this.Id = 0;
},
_idaddress: 0,
_getIdaddressAttr: function(){
return this._idaddress;
},
_setIdaddressAttr: function(id_){
// Seteamos el nuevo idaddress (si fue modificado) y enviamos los datos para guardarlos.
if(id_ != this._idaddress){
this._idaddress = id_;
this._save();
}
},
idaccount: function(){
return this.account_select.get('value');
},
// Carga el account seleccionado
_LoadAccountSelected: function(){
var t = this;

if(t.account_select.state != 'Error'){
t.Id = t.account_select.get('value');

if(t.Id > 0){

   R.get('getaccount.usaga', {
		query: {idaccount: t.Id},
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');
numrows = d.length;

if(numrows > 0){
t.Id = d.getNumber(0, "idaccount");
t.partition.set('value', d.getNumber(0, "partition"));
t.enable.set('checked', d.getBool(0, "enable")); 

// Esto es para verificar que sea un numero valido ya que los valores nulos no son enviados desde postgres
_idgroup = d.getNumber(0, "idgroup");
if(isNaN(_idgroup) || _idgroup < 1){
t.idgroup.reset();
}else{
t.idgroup.set('value', _idgroup);
}

t.account.set('value', d.getStringFromB64(0, "account")); 
t.account_select.set('value', t.Id); 
t.idtype.setValue(d.getString(0, "type")); 
t.note.set('value', d.getStringFromB64(0, "note"));
t._idaddress = d.getNumber(0, "idaddress"); 

}else{
t._resetall();
}
t.emit('onloadaccount', {idaccount: t.Id, idaddress: t._idaddress}); 
t.emit('notify_message', {message: t.account_select.get('displayedValue')+' cargado'}); 
                },
                function(error){
                    // Display the error returned
console.log(error);
t.emit('onloadaccount', {idaccount: 0, idaddress: 0}); 
t.emit('notify_message', {message: error}); 
                }
            );

}else{
t._resetall();
}


}
},

_delete: function(){
idccountdelete = this.Id;
if(idccountdelete > 0){
var datos = {};
datos.idaccount = this.Id*-1; 
this._actionsave(datos);
}
},

_save: function(){
var t = this;

var datos = {};
if(t.Id >= 0){
datos.idaccount = t.Id;
datos.idaddress = t._idaddress;  
datos.idgroup = t.idgroup.get('value');
datos.partition = t.partition.get('value');
datos.enable = t.enable.get('checked'); 
datos.account = t.account.get('value'); 
datos.name = t.account_select.get('displayedValue'); 
datos.type = t.idtype.get('value');
datos.note = t.note.get('value');
t._actionsave(datos);
}

},
// Guarda los datos en el servidor
_actionsave: function(_data){
var t = this;

   R.post('saveaccount.usaga', {
		data: _data,
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){

var d = new RXml.getFromXhr(response, 'row');

if(d.length > 0){

console.log(d.getStringFromB64(0, 'outpgmsg'));
t.emit('notify_message', {message: d.getStringFromB64(0, 'outpgmsg')}); 

t.account_select.Load();
var id = d.getInt(0, "outreturn");
if(id>0){
t.account_select.set('value', id);
}else{
t._resetall();
}
t._LoadAccountSelected();
}




                },
                function(error){
                    // Display the error returned
t._resetall();
t._LoadAccountSelected();
//console.log(errorx);
t.emit('notify_message', {message: errorx}); 
                }
            );


}







   
});
});
