define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!./wlocation.html',
'jspire/form/FilteringSelect',
'dojo/store/Memory',
'dojo/dom-style',
'dojo/request',
'jspire/request/Xml'
],function(declare,_Widget,_Templated,templateString, jsFS, M, Style, request, RXml){

 return declare('usms.wlocation',[ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
_setLabels: function(l){
var r = 0;
var t = this;
t.labL1.innerHTML = l.L1;
if(r<l.L1.length){
r = l.L1.length;
}

t.labL2.innerHTML = l.L2;
if(r<l.L2.length){
r = l.L2.length;
}

t.labL3.innerHTML = l.L3;
if(r<l.L3.length){
r = l.L3.length;
}

t.labL4.innerHTML = l.L4;
if(r<l.L4.length){
r = l.L4.length;
}

t.labL5.innerHTML = l.L5;
if(r<l.L5.length){
r = l.L5.length;
}

t.labL6.innerHTML = l.L6;
if(r<l.L6.length){
r = l.L6.length;
}
t._setWidth((r*2));
},
_to_set_location: {idl1: '0', idl2: '0', idl3: '0', idl4: '0', idl5: '0', idl6: '0'},
_setWidth: function(w){
labs = [];
labs[0] = this.labL1;
labs[1] = this.labL2;
labs[2] = this.labL3;
labs[3] = this.labL4;
labs[4] = this.labL5;
labs[5] = this.labL6;

i = 0;
while(i<6){
//Style.set(labs[i], "margin-right", w+'px');
i++;
}

},
_addFSLFunctions: function(fsL, level_){

fsL.setLocation = function(v){
if(!v){
v = '0';
}
if(v >= 0){
this.set('value', v);
}

}


fsL.empty = function(){
Items = [];
Items[0] =  {name: 'Ninguno', id: '0'};
this.store = null;
this.store = new M({data: Items});
this.startup();
this.set('value', '0');
}


//level_ = level, fk = llave foranea
fsL.newLoad = function(fk){
if(fk > 0 && level_ > 0){
this._Query = {level: level_,  idfk: fk};
this.Load();
}else{
this.empty();
}

}

},
postCreate: function(){

var t = this;
t._setLabels({L1: 'Nivel 1: ', L2: 'Nivel 2:', L3: 'Nivel 3:', L4: 'Nivel 4:', L5: 'Nivel 5:', L6: 'Nivel 6:'});

jsFS.addXmlLoader(t.fsL1, 'fun_view_location_level_xml.usms', 'row', {level: 1}, 'idl1', 'name', {name: 'Ninguno', id: '0'});

jsFS.addXmlLoader(t.fsL2, 'fun_view_location_level_xml.usms', 'row', {}, 'idl2', 'name', {name: 'Ninguno', id: '0'});
t._addFSLFunctions(t.fsL2, 2);

jsFS.addXmlLoader(t.fsL3, 'fun_view_location_level_xml.usms', 'row', {}, 'idl3', 'name', {name: 'Ninguno', id: '0'});
t._addFSLFunctions(t.fsL3, 3);

jsFS.addXmlLoader(t.fsL4, 'fun_view_location_level_xml.usms', 'row', {}, 'idl4', 'name', {name: 'Ninguno', id: '0'});
t._addFSLFunctions(t.fsL4, 4);

jsFS.addXmlLoader(t.fsL5, 'fun_view_location_level_xml.usms', 'row', {}, 'idl5', 'name', {name: 'Ninguno', id: '0'});
t._addFSLFunctions(t.fsL5, 5);

jsFS.addXmlLoader(t.fsL6, 'fun_view_location_level_xml.usms', 'row', {}, 'idl6', 'name', {name: 'Ninguno', id: '0'});
t._addFSLFunctions(t.fsL6, 6);

t.fsL1.on('Change', function(e){
t.fsL2.newLoad(this.get('value'));
});
// Esto chequea si el objeto _to_set_location contiene algun dato para setear el select una vez sea han cargado los datos.
t.fsL1.on('onloaddata', function(){
t.fsL1.set('value', t._to_set_location.idl1);
t._to_set_location.idl1 = 0;
});


t.fsL2.on('Change', function(e){
t.fsL3.newLoad(this.get('value'));
});
// Esto chequea si el objeto _to_set_location contiene algun dato para setear el select una vez sea han cargado los datos.
t.fsL2.on('onloaddata', function(){
t.fsL2.setLocation(t._to_set_location.idl2);
t._to_set_location.idl2 = 0;
});


t.fsL3.on('Change', function(e){
t.fsL4.newLoad(this.get('value'));
});
// Esto chequea si el objeto _to_set_location contiene algun dato para setear el select una vez sea han cargado los datos.
t.fsL3.on('onloaddata', function(){
t.fsL3.setLocation(t._to_set_location.idl3);
t._to_set_location.idl3 = 0;
});



t.fsL4.on('Change', function(e){
t.fsL5.newLoad(this.get('value'));
});
// Esto chequea si el objeto _to_set_location contiene algun dato para setear el select una vez sea han cargado los datos.
t.fsL4.on('onloaddata', function(){
t.fsL4.setLocation(t._to_set_location.idl4);
t._to_set_location.idl4 = 0;
});



t.fsL5.on('Change', function(e){
t.fsL6.newLoad(this.get('value'));
});
// Esto chequea si el objeto _to_set_location contiene algun dato para setear el select una vez sea han cargado los datos.
t.fsL5.on('onloaddata', function(){
t.fsL5.setLocation(t._to_set_location.idl5);
t._to_set_location.idl5 = 0;
});


// Esto chequea si el objeto _to_set_location contiene algun dato para setear el select una vez sea han cargado los datos.
t.fsL6.on('onloaddata', function(){
t.fsL6.setLocation(t._to_set_location.idl6);
t._to_set_location.idl6 = 0;
});
},
values: function(){
var rv = {
idl1: this.fsL1.get('value'),
idl2: this.fsL2.get('value'),
idl3: this.fsL3.get('value'),
idl4: this.fsL4.get('value'),
idl5: this.fsL5.get('value'),
idl6: this.fsL6.get('value')
}
return rv;
},
getLocation: function(){
var rl = this.values();
rl = ''+rl.idl1+rl.idl2+rl.idl3+rl.idl4+rl.idl5+rl.idl6;
return rl;
},
setLocation: function(idlocation){
this.fsL1.Load();
this.getidslocations(idlocation);
},
getidslocations: function(id_){
var ids = {};
var t = this;
            // Request the text file
            request.get("fun_view_locations_ids_from_idlocation_xml.usms", {
            // Parse data from xml
	query: {idlocation: id_},
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');

if(d.length > 0){
t._to_set_location.idl1 = d.getString(0, 'idl1');
//console.log('1 '+t._to_set_location.idl1);
t._to_set_location.idl2 = d.getString(0, 'idl2');
//console.log('2 '+t._to_set_location.idl2);
t._to_set_location.idl3 = d.getString(0, 'idl3');
//console.log('3 '+t._to_set_location.idl3);
t._to_set_location.idl4 = d.getString(0, 'idl4');
//console.log('4 '+t._to_set_location.idl4);
t._to_set_location.idl5 = d.getString(0, 'idl5');
//console.log('5 '+t._to_set_location.idl5);
t._to_set_location.idl6 = d.getString(0, 'idl6');
//console.log('6 '+t._to_set_location.idl6);
}else{
t._to_set_location= {idl1: '0', idl2: '0', idl3: '0', idl4: '0', idl5: '0', idl6: '0'};
}
t.fsL1.Load();
//t.emit('onsavedata', t.values());
                },
                function(error){
                    // Display the error returned
t._to_set_location= {idl1: '0', idl2: '0', idl3: '0', idl4: '0', idl5: '0', idl6: '0'};
//t.emit('onloaddata', t.values());
console.log(error);
                }
            );
}








  
});
});
