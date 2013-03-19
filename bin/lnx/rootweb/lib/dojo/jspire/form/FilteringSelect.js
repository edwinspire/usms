//>>built
define("jspire/form/FilteringSelect",["dojo/_base/declare", "dojo/request", "dojo/store/Memory", "jspire/request/Xml"],function(_1, R, M, RXml){

return  {
addXmlLoader: function(filteringselect, url, ri, q, id, name, vep){

filteringselect._Url = url;
filteringselect._RootItem = ri;
filteringselect._Query = q;
filteringselect._TagId = id;
filteringselect._TagName = name;
filteringselect._ValueEverPresent = vep;


// Carga Asincronamente los datos y setea el FilteringSelect
filteringselect.Load = function(){
            // Request the text file
   R.get(url, {
		query: filteringselect._Query,
            // Parse data from xml
            handleAs: "xml"
        }).then(
                function(response){
var d = new RXml.getFromXhr(response, 'row');
numrows = d.length;
var Items = [];

var i = 0;
while(i<numrows){
Items[i] =    {name: d.getStringFromB64(i, filteringselect._TagName), id: d.getString(i, filteringselect._TagId)};
i++;
}

if(filteringselect._ValueEverPresent){
Items[i] =    {name: filteringselect._ValueEverPresent.name, id: filteringselect._ValueEverPresent.id};
}
filteringselect.store = null;
filteringselect.store = new M({data: Items});
filteringselect.startup();
filteringselect.emit('onloaddata', {});
                },
                function(error){
                    // Display the error returned
alert(error);
                }
            );

}
return filteringselect;
}
}



});
