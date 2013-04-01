define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!./waddress.html',
"dojo/request", "jspire/request/Xml"
],function(declare,_Widget,_Templated,templateString, request, RXml){

 return declare('usms.waddress',[ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
reset: function(){
this.resetForm();
this.idaddress = 0;
this.idlocation = 0;
},   
resetForm: function(){
this.idform.reset();
},
idaddress: 0,
ts: '1990-01-01',
idlocation: '0',
_setLabels: function(l){
var t = this;
t.idf1.innerHTML = l.f1;
t.idf2.innerHTML = l.f2;
t.idf3.innerHTML = l.f3;
t.idf4.innerHTML = l.f4;
t.idf5.innerHTML = l.f5;
t.idf6.innerHTML = l.f6;
t.idf7.innerHTML = l.f7;
t.idf8.innerHTML = l.f8;
t.idf9.innerHTML = l.f9;
t.idf10.innerHTML = l.f10;
},
postCreate: function(){
this._setLabels({f1: 'Campo 1: ', f2: 'Campo 2:', f3: 'Campo 3:', f4: 'Campo 4:', f5: 'Campo 5:', f6: 'Campo 6:', f7: 'Campo 7:', f8: 'Campo 8:', f9: 'Campo 9:', f10: 'Campo 10:'});
this.reset();
    // Get a DOM node reference for the root of our widget
 //   var domNode = this.domNode;

},
values: function(){
var t = this;
return {
idaddress: t.idaddress,
geox: t.idgeox.get('value'),
geoy: t.idgeoy.get('value'),
f1: t.idf1.get('value'),
f2: t.idf2.get('value'),
f3: t.idf3.get('value'),
f4: t.idf4.get('value'),
f5: t.idf5.get('value'),
f6: t.idf6.get('value'),
f7: t.idf7.get('value'),
f8: t.idf8.get('value'),
f9: t.idf9.get('value'),
f10: t.idf10.get('value'),
ts: t.ts,
idlocation: t.idlocation,
geolocation: 'http://www.openstreetmap.org/?lat='+t.idgeox.get('value')+'&amp;lon='+t.idgeoy.get('value')+'&amp;zoom=17&amp;layers=M&amp;mlat='+t.idgeox.get('value')+'&amp;mlon='+t.idgeoy.get('value')
};

/*
Para Google-Maps
geolocation: 'http://maps.google.es/maps?ll='+t.idgeox.get('value')+','+t.idgeoy.get('value')+'&z=10'

Para OpenStreeMaps
<iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="http://www.openstreetmap.org/export/embed.html?bbox=-79.006022,-2.899094,-79.002938,-2.895729&amp;layer=mapnik&amp;marker=-2.89783,-79.00502" style="border: 1px solid black"></iframe><br /><small><a href="http://www.openstreetmap.org/?lat=-2.8974115&amp;lon=-79.00448&amp;zoom=17&amp;layers=M&amp;mlat=-2.89783&amp;mlon=-79.00502">View Larger Map</a></small>
*/

},
load: function(id){
var t = this;
t.idaddress = id;
if(t.idaddress > 0){
            // Request the text file
            request.get("fun_view_address_byid_xml.usms", {
            // Parse data from xml
	query: {idaddress: t.idaddress},
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');

numrows = d.length;
var myData = {identifier: "unique_id", items: []};

if(numrows > 0){
i = 0;
t.idaddress = d.getNumber(i, 'idaddress');

//_geox = d.getString(i, "geox");
t.idgeox.set('value',  d.getString(i, "geox"));
t.idgeoy.set('value',  d.getString(i, "geoy"));

t.idf1.set('value', d.getStringFromB64(i, 'field1'));
t.idf2.set('value', d.getStringFromB64(i, 'field2'));
t.idf3.set('value',d.getStringFromB64(i, 'field3'));
t.idf4.set('value',d.getStringFromB64(i, 'field4'));
t.idf5.set('value',d.getStringFromB64(i, 'field5'));
t.idf6.set('value', d.getStringFromB64(i, 'field6'));
t.idf7.set('value', d.getStringFromB64(i, 'field7'));
t.idf8.set('value', d.getStringFromB64(i, 'field8'));
t.idf9.set('value', d.getStringFromB64(i, 'field9'));
t.idf10.set('value', d.getStringFromB64(i, 'field10'));
t.ts = d.getString(i, 'ts');
t.idlocation = d.getInt(i, 'idlocation');
}else{
t.reset();
}
t.emit('onloaddata', t.values());
                },
                function(error){
                    // Display the error returned
t.reset();
t.emit('onloaddata', t.values());
console.log(error);
                }
            );
}else{
t.reset();
t.emit('onloaddata', t.values());
}

},
save: function(){
var t = this;
            // Request the text file
            request.post("fun_address_edit_xml.usms", {
            // Parse data from xml
	data: t.values(),
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');

numrows = d.length;

if(d.length > 0){
t.idaddress = d.getInt(0, 'outreturn');
t.load(t.idaddress);
console.log(d.getStringFromB64(0, 'outpgmsg'));
}else{
t.reset();
}

t.emit('onsavedata', t.values());
                },
                function(error){
                    // Display the error returned
t.reset();
//t.emit('onloaddata', t.values());
console.log(error);
                }
            );

},
delete: function(){
var t = this;
if(t.idaddress > 0){
            // Request the text file
            request.post("fun_address_edit_xml.usms", {
            // Parse data from xml
	data: {idaddress: t.idaddress*-1},
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');

numrows = d.length;

if(d.length > 0){
t.idaddress = d.getInt(0, 'outreturn');
t.load(t.idaddress);
console.log(d.getStringFromB64(0, 'outpgmsg'));
}else{
t.reset();
}

//t.emit('onloaddata', t.values());
                },
                function(error){
                    // Display the error returned
t.reset();
//t.emit('onloaddata', t.values());
console.log(error);
                }
            );
}else{
t.reset();
}
}




});
});
