define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usaga_account_contact/_usaga_account_contact.html',
'dojo/request',
'jspire/form/FilteringSelect',
'jspire/request/Xml',
'dojo/dom-style'
],function(declare,_Widget,_Templated,templateString, R, jsFS, RXml, domStyle){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
postCreate: function(){
var t = this;
t.listcontactsnew.set('invalidMessage', 'Debe seleccionar un contacto de la lista');
jsFS.addXmlLoader(t.listcontactsnew, 'fun_view_account_unregistered_contacts_xml.usaga', 'row', {}, 'idcontact', 'name');
},
_idaccount: 0,
_idcontact: 0,
_getIdcontactAttr: function(){
return this._idcontact;
},
New: function(idaccount_){
var t = this;
t.reset();
t._idaccount = idaccount_;
t.listcontactsnew._Query.idaccount = t._idaccount;
t._changeLabelToSelect(true);
t.listcontactsnew.set('value', '0');
t.emit('notify_message', {message: 'Seleccione un contacto de la lista'}); 
t.listcontactsnew.Load();
},
_empty: function(){
var t = this;
t._idaccount = 0;
t.reset();
},    
reset: function(){
var t = this;
t.Formulario.reset();
t._idcontact = 0;
t.name.innerHTML = 'Ningún contacto seleccionado';
t._changeLabelToSelect(false);
},
_changeLabelToSelect: function(change){
var t = this;
if(change){
domStyle.set(t.listcontactsnew.domNode, "display", "block");
domStyle.set(t.divname, "display", "none");
}else{
domStyle.set(t.listcontactsnew.domNode, "display", "none");
domStyle.set(t.divname, "display", "block");
}
},  
Load: function(idaccount_, idcontact_){

var t = this;
//t.reset();
t._idaccount = idaccount_;
t._idcontact = idcontact_;
t._changeLabelToSelect(false);

if(t._idaccount > 0 && t._idcontact > 0){

   R.get('getaccountcontact.usaga', {
		query: {idaccount: t._idaccount, idcontact: t._idcontact},
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');
numrows = d.length;
if(numrows > 0){
t._idcontact = d.getNumber(0, "idcontact");
t.name.innerHTML = d.getStringFromB64(0, "lastname")+' '+d.getStringFromB64(0, "firstname");
t.enable.set('checked', d.getBool(0, "enable")); 
t.priority.set('value', d.getNumber(0, "prioritycontact")); 
t.appointment.set('value', d.getStringFromB64(0, "appointment")); 
t.note.set('value', d.getStringFromB64(0, "note"));

}else{
t.reset();
}
t.emit('onloadcontact', {idaccount: t._idaccount, idcontact: t._idcontact}); 
                },
                function(error){
                    // Display the error returned
console.log(error);
t.emit('onloadcontact', {idaccount: 0, idcontact: 0}); 
t.emit('notify_message', {message: error}); 
                }
            );

}else{
t._empty();
t.emit('onloadcontact', {idaccount: 0, idcontact: 0}); 
}



},

delete: function(){
var t = this;
if(t._idaccount > 0 && t._idcontact > 0){
t._actionsave({idaccount: t._idaccount, idcontact: t._idcontact*-1});
}else{
t.emit('notify_message', {message: 'No ha seleccionado un registro para ser eliminado.'}); 
}

},
_dataContact: function(){
var t = this;
var datos = {};
datos.valid = false;
datos.idcontact = t._idcontact;
datos.idaccount = t._idaccount;
datos.priority = t.priority.get('value');
datos.appointment = t.appointment.get('value');
datos.enable = t.enable.get('checked'); 
datos.note = t.note.get('value');

// Esto se ejecuta cuando se va insertar un nuevo usuario
if(t._idcontact == 0){
if(t.listcontactsnew.state == 'Error' || t.listcontactsnew.state == 'Incomplete'){
t.emit('notify_message', {message: 'Debe seleccionar un contacto de la lista para poderlo agregar. Si no hay elementos en la lista significa que todos los posibles contactos ya han sido agregados.'}); 
}else{
datos.idcontact = t.listcontactsnew.get('value'); 
} 
}

// Verificamos que los datos sean correctos
if(datos.idaccount > 0 && datos.idcontact > 0){
datos.valid = true;
}else{
datos.valid = false;
t.emit('notify_message', {message: 'Los datos ingresados no son correctos. Imposible guardarlos.'}); 
}
return datos;
},


save: function(){

var t = this;
var datos = t._dataContact();

if(datos.valid){
t._actionsave(datos);
}

},
// Guarda los datos en el servidor
_actionsave: function(_data){
var t = this;

   R.post('fun_account_contacts_table.usaga', {
		data: _data,
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){

var d = new RXml.getFromXhr(response, 'row');

if(d.length > 0){

t.emit('notify_message', {message: d.getStringFromB64(0, 'outpgmsg')}); 

var id = d.getInt(0, "outreturn");
if(id>0){
t._idcontact = id;
}else{
t.reset();
}

}

t.emit('onsave', {idaccount: t._idaccount, idcontact: t._idcontact}); 
t.Load(t._idaccount, t._idcontact);

                },
                function(error){
                    // Display the error returned
t.reset();
t.emit('notify_message', {message: error}); 
                }
            );


}










});
});
