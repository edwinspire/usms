// Funcion crea un simple dialogo offline
function jqdoffline(title, msg){
var codigo = '<div class="ui-widget" title="'+title+'" ><p>'+msg+'</p></div>';
if(title && msg){
$(codigo).dialog({
resizable: false,
modal: true,
buttons:{
"Cerrar":function(){
$(this).dialog("close");
}
}
});
}
}
