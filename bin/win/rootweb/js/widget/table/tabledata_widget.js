// Funciones para trabajar con tablas dinamicas
// Valida los campos (Funcional con Html5)
// Valida tambian los datos en el servidor

// Valida los datos de cada campo cuando este cambia.
// Ejecutar esta funcion como evento de Onchange de cada campo.
// Ver documentacion de JQuery-UI Dialog modal

//var DataTableAction = {"None": 0, "Update": 1, "Empty": 2, "InsertRow": 2, "UpdateRow": 3, "DeleteRow": 4, };



// OnChangeVerifyValidityDataCell = ocvvdc
function ocvvdc(fieldcell){

if(!ValidityCellDataTable(fieldcell)){
MessageInvalidField();
// Si el valor nuevo es invalido se inserta nuevamente el anterior
UnDoLastChange(fieldcell);
}else{
// Enviamso los cambios al servidor
SendDataChanged(fieldcell);
}
}

// ValidityCellDataTable = vcdt
function ValidityCellDataTable(cell){
var Retorno = true;
// Verificamos que sea un input
if(cell == '[object HTMLInputElement]'){
// Para el input seteamos el valor anterior en esta fase ya que no es aplicable capturar el evento onfocus para el tipo checkbox
if($(cell).attr('type') == 'checkbox'){
cell.value = cell.checked;
}
Retorno = cell.validity.valid;
}
return Retorno;
}


// Funcion setea el valor de los checkbox de una fila SetValueCheckBoxFromAjax = SVCBFAjax
function SVCBFAjax(row){
$('input', row).each(function(k, v){
$cell = $(v);
if($cell.attr('type') == 'checkbox'){
//alert("Check box "+$cell.attr('value'));
if($cell.attr('value')=="true"){
v.checked = true;
}else{
v.checked = false;
}
}
}
)
}

// Desea el ultimo cambio realizado
function UnDoLastChange(cell){
if($(cell).attr('type') == 'checkbox'){
cell.value = !cell.checked;
cell.checked = !cell.checked;
}else{
cell.value = $(cell).data('last');
}
}


// Cuando el objeto tiene el foco, se guarda el valor actual del campo
// necesario para usarlo cuando el valor se cambiado por uno incorrecto.
// OnFocusCaptureValueDataCell = ofcvdc
function ofcvdc(cell){
$(cell).data('last', cell.value);
}

// Funcion crea un segmento de codigo Html correspondiente al mensaje de error en un campo.
function MessageInvalidField(messagetxt){
var texto = 'El dato ingresado es invalido para este campo. Verifiquelo y vuelvalo a ingresar';
if(messagetxt){
texto = messagetxt;
}

var $dialogo = $('<div class="ui-widget" style="display: none;" title="Dato Incorrecto" ><p><span style="float:left; margin: 0, 15px 15px 0;" class="ui-icon ui-icon-alert" ></span>'+texto+'</p></div> ');
$dialogo.dialog({
resizable: false,
modal: true,
buttons:{
"Aceptar":function(){
$(this).dialog("close");
}
}
});
}

// Funcion crea un segmento de codigo Html correspondiente al mensaje de error en un campo en caso que el servidor no envie ningun mensaje
function MessageSendFieldFail(htmlcode, statusmessage){
var codigo = '<div class="ui-widget" style="display: none;" title="Cambio no realizado!" ><p><span style="float:left; margin: 0, 15px 15px 0;" class="ui-icon ui-icon-alert" ></span>Es posible que se haya perdido conexion con el servidor.<p>El sistema devuelve: '+statusmessage+'</p></div>';
if(htmlcode.length>0){
codigo = htmlcode;
}
$(codigo).dialog({
resizable: false,
modal: true,
buttons:{
"Aceptar":function(){
$(this).dialog("close");
}
}
});

}

// Funcion crea un segmento de codigo Html correspondiente al mensaje de error en un campo en caso que el servidor no envie ningun mensaje
function SimpleMessageDialog(title, statusmessage){
var codigo = '<div class="ui-widget" style="display: none;" title="'+title+'" ><p>'+statusmessage+'</p></div>';
if(title && statusmessage){

$(codigo).dialog({
resizable: false,
modal: true,
buttons:{
"Aceptar":function(){
$(this).dialog("close");
}
}
});

}

}



// Formulario encargado de enviar los cambios realizados en una fila de la tabla
function FormSendRowChanged(urlaction, deleterow){
var $Formulario = $('<form style="display: none;"><input type="submit" value="ok"></form>');
if(deleterow){
$Formulario.append('<input name="actionrow" type="text" value = "delete">');
}else{
$Formulario.append('<input name="actionrow" type="text" value = "update">');
}
$Formulario.attr('action', urlaction);
return $Formulario;
}


// Obtiene la fila de la celda ingresada
function GetRowOfCell(cell){

var $contenedor = $(cell);

if(!$contenedor.hasClass('datarowtable')){

// Inspecciona hasta 15 niveles arriba
var i = 0;
while(i<15){
$contenedor = $contenedor.parent();

if($contenedor.hasClass('datarowtable')){
//alert("ENCONTRADA FILA");
break;
}

i++;
}

}
return $contenedor;
}


// Obtiene el url action del tbody al que pertenece la celda
function GetUrlActionOfTBodyDataTable(cell){
var url = "";
var $elemento = $(cell);
// Inspecciona hasta 20 niveles arriba
var i = 0;
while(i<20){
if($elemento.data('ufa')){
url = $elemento.data('ufa');
break;
}else{
$elemento = $elemento.parent();
}
i++;
}

return url;
}

/*
enum ActionTable{
Load,
DeleteAll,
RowUpdate,
RowDelete
}
*/

// Envia los datos al servidor
function SendDataChanged(cell){

// Fila que contiene los datos
var $contenedor = GetRowOfCell(cell);

//var FormAction = $contenedor.attr('data-ufa');// NO BORRAR es para referencia
var FormAction = GetUrlActionOfTBodyDataTable(cell);

if(FormAction.length>0){

var TodosLosCamposValidos = true;
// Creamos un formulario para enviar los datos
var FormularioSend = FormSendRowChanged(FormAction, false);

// Obtenemos todos los input de la fila
$('input, select, textarea', $contenedor).each(function(k, v){

if(TodosLosCamposValidos){
TodosLosCamposValidos = ValidityCellDataTable(v);
}

// Clonamos cada input
var $celda = $(v).clone(true);
$celda.val($(v).val());
//alert($celda.val());
// Insertamos esa celda al formulario
FormularioSend.append($celda);
});

if(TodosLosCamposValidos){
//alert(FormularioSend.serialize());
// Enviamos el formulario via Ajax
$.ajax({
            type: 'POST',
            url: FormularioSend.attr('action'),
            data: FormularioSend.serialize(),
		dataType: "text",
            success: function(data) {
// Aqui hacemos algo con los datos devueltos
// Recibe como respuesta un mensaje en formao Json
// status es el estado
//alert(data);
var datos = jQuery.parseJSON(data);
//alert(datos.status);

if(datos.status != "ok"){
UnDoLastChange(cell);
SimpleMessageDialog("No se pudo eliminar", datos.msg);
}


            },
            error: function(xhhr, status, htmlerror) {
// Si los valores no pudieron ser enviados se vuelve el campo a su valor anterior.
UnDoLastChange(cell);
MessageSendFieldFail(xhhr.responseText, status);

            }
        });

}else{
MessageInvalidField('Algun campo de esta fila no es valido.');
UnDoLastChange(cell);
}

}

}



// Envia fila a borrar al servidor
function SendRowDataDelete(row){
$(row).hide();
// Creamos un formulario para enviar los datos
var $FormularioSend = FormSendRowChanged(GetUrlActionOfTBodyDataTable(row), true);
// Fila que contiene los datos
var $contenedor = $(row);
// Obtenemos todos los input de la fila
$('input, select, textarea', $contenedor).each(function(k, v){
//alert("celdax");
// Clonamos cada input
var $celda = $(v).clone(true);
$celda.val($(v).val());
// Insertamos esa celda al formulario
$FormularioSend.append($celda);
});
// Enviamos el formulario via Ajax
$.ajax({
            type: 'POST',
            url: $FormularioSend.attr('action'),
            data: $FormularioSend.serialize(),
		dataType: "text",
            success: function(data) {
// Aqui hacemos algo con los datos devueltos
$(row).remove();
            },

            error: function(xhhr, status, htmlerror) {
$(row).show();
MessageSendFieldFail(xhhr.responseText, status);
// Si los valores no pudieron ser enviados se vuelve el campo a su valor anterior.

            }


        });
}


// Envia los datos al servidor
function RowActions(cell){

// Fila que contiene los datos
var $contenedor = GetRowOfCell(cell);

//var FormAction = $contenedor.attr('data-ufa');// NO BORRAR es para referencia
var FormAction = GetUrlActionOfTBodyDataTable(cell);

if(FormAction.length>0){

var TodosLosCamposValidos = true;
// Creamos un formulario para enviar los datos
var FormularioSend = FormSendRowChanged(FormAction, false);

// Obtenemos todos los input de la fila
$('input, select, textarea', $contenedor).each(function(k, v){

if(TodosLosCamposValidos){
TodosLosCamposValidos = ValidityCellDataTable(v);
}

// Clonamos cada input
var $celda = $(v).clone(true);
$celda.val($(v).val());
//alert($celda.val());
// Insertamos esa celda al formulario
FormularioSend.append($celda);
});

if(TodosLosCamposValidos){
//alert(FormularioSend.serialize());
// Enviamos el formulario via Ajax
$.ajax({
            type: 'POST',
            url: FormularioSend.attr('action'),
            data: FormularioSend.serialize(),
		dataType: "text",
            success: function(data) {
// Aqui hacemos algo con los datos devueltos
// Recibe como respuesta un mensaje en formao Json
// status es el estado
//alert(data);
var datos = jQuery.parseJSON(data);
//alert(datos.status);

if(datos.status != "ok"){
UnDoLastChange(cell);
SimpleMessageDialog("No se pudo eliminar", datos.msg);
}


            },
            error: function(xhhr, status, htmlerror) {
// Si los valores no pudieron ser enviados se vuelve el campo a su valor anterior.
UnDoLastChange(cell);
MessageSendFieldFail(xhhr.responseText, status);

            }
        });

}else{
MessageInvalidField('Algun campo de esta fila no es valido.');
UnDoLastChange(cell);
}

}

}

// ContextMenuDataTable
function ctxtmdt(row){
$DialogoFila = $('<div class="ui-widget" title="Menu"></div>');

$DialogoFila.append('Presione ESC para salir.');
$DialogoFila.dialog({
modal: true,
resizable: false,
buttons:{
"Agregar Registro":function(){
$(this).dialog("close");
InsertNewRowOfDataTable(row);
},
/*
"Copiar Registro":function(){
$(this).dialog("close");
CopyRowOfDataTable(row);
},
*/
"Eliminar registro":function(){
$(this).dialog("close");
DeleteRowOfDataTable(row);
}
}


});

}


// ContextMenuHeadDataTable
function ctxtmhdt(row){
$DialogoFila = $('<div class="ui-widget" title="Tabla de datos"></div>');
$DialogoFila.append('Presione ESC para salir.');
$DialogoFila.dialog({
modal: true,
resizable: false,
buttons:{
"Mostrar Filtro":function(){
$(this).dialog("close");
InsertNewRowOfDataTable(row);
},
"Ocultar Filtro":function(){
$(this).dialog("close");
DeleteRowOfDataTable(row);
},
"Cargar":function(){
$(this).dialog("close");
DeleteRowOfDataTable(row);
}

}


});

}

function DeleteRowOfDataTable(row){
$DialogoDeleteFila = $('<div title="Eliminar" class="ui-widget"><span style="float:left; margin: 0, 15px 15px 0;" class="ui-icon ui-icon-alert" ></span>Esta seguro que desea eliminar el registro?</div>');
$DialogoDeleteFila.dialog({
modal: true,
resizable: false,
buttons:{
"Aceptar":function(){
$(this).dialog("close");
//$(row).remove();
SendRowDataDelete(row);
},
/*
"Copiar Registro":function(){
$(this).dialog("close");
CopyRowOfDataTable(row);
},
*/
"Cancelar":function(){
$(this).dialog("close");
}
}


});
}
/*
function CopyRowOfDataTable(row){
var $contenedor = $(row).parent();
$contenedor.append($(row).clone());
}
*/
// Inserta una nueva fila con valores de fabrica
function InsertNewRowOfDataTable(row){
var $tbody = $(row).parent();
var $newrow = $(row).clone();
// Obtenemos todos los input y select de la fila
$('input, select, textarea', $newrow).each(function(k, v){
$(v).val("");
});
$tbody.append($newrow);
}
 




