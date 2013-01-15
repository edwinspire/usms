require(["dojo/ready"], function(ready){
     ready(function(){

// Aqui llamamos a todas las funciones que requieran que dojo se haya cargado antes de funcionar.
sendFormPostgreSQLCnx();
loadFormPostgreSQLCnx();
     });
});

// Envia el formulario de PostgreSQL
function sendFormPostgreSQLCnx(){
  var formpg = dojo.byId("FormPostgreSQLCnx");

  dojo.connect(formpg, "onsubmit", function(event){
    // Stop the submit event since we want to control form submission.
    dojo.stopEvent(event);

    // The parameters to pass to xhrPost, the form, how to handle it, and the callbacks.
    // Note that there isn't a url passed.  xhrPost will extract the url to call from the form's
    //'action' attribute.  You could also leave off the action attribute and set the url of the xhrPost object
    // either should work.
    var xhrArgs = {
      form: formpg,
      handleAs: "text",
      load: function(data){
alert("Enviado");
///        dojo.byId("response").innerHTML = "Form posted.";
      },
      error: function(error){
        // We'll 404 in the demo, but that's okay.  We don't have a 'postIt' service on the
        // docs server.
alert(error);
   //     dojo.byId("response").innerHTML = "Form posted.";
      }
    }
    // Call the asynchronous xhrPost
    var deferred = dojo.xhrPost(xhrArgs);
  });
}


// Carga el formulario de PostgreSQL
function loadFormPostgreSQLCnx(){
 // Look up the node we'll stick the text under.
//alert('Hola');
  // The parameters to pass to xhrGet, the url, how to handle it, and the callbacks.
  var xhrArgs = {
    url: "getpostgresconf",
    handleAs: "text",
    load: function(datass){

  var data = dojox.xml.DomParser.parse(datass);
// documentElement always represents the root node
x=data.byName('postgres');

   dijit.byId('tbxpgPwd').set('value', Base64.decode(x[0].getAttribute("pwd")));
   dijit.byId('tbxpgUser').set('value', Base64.decode(x[0].getAttribute("user")));
   dijit.byId('tbxpgHost').set('value', Base64.decode(x[0].getAttribute("host")));  
   dijit.byId('tbxpgPort').set('value', x[0].getAttribute("port"));  

if(x[0].getAttribute("ssl") == 'true'){
   dijit.byId('cbxpgSSL').set('checked', true);
}else{
   dijit.byId('cbxpgSSL').set('checked', false);
}


   dijit.byId('tbxpgDataBase').set('value', Base64.decode(x[0].getAttribute("db")));  
//   dijit.byId('tbxpgTimeOut').set('value',x[0].getAttribute("timeout"));    
   dijit.byId('stapgNote').set('value', Base64.decode(x[0].getAttribute("note")));
 
    },
    error: function(error){
//      targetNode.innerHTML = "An unexpected error occurred: " + error;
alert(error);

    }
  }

  // Call the asynchronous xhrGet
  var deferred = dojo.xhrGet(xhrArgs);
}