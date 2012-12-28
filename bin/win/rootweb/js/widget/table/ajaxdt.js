// Funciones para trabajar con tablas dinamicas

var enumRequestAction = {"None": 0, "Load":1, "CreateRow": 2, "UpdateRow": 3, "CopyRow": 4, "InsertRow": 5, "DeleteRow": 6, "DeleteAllRow":7};
var enumResponseAction = {"None": 0, "Load":1, "CreatedRow": 2, "UpdatedRow": 3, "CopiedRow":4, "InsertedRow": 5, "DeletedRow":6, "DeletedAllRow": 7};

function DataTable(nametable, nametrlabel, nametbody, stringnewrow, urltable){
this.Table = nametable;
this.TRHeadLabel = nametrlabel;
this.TBody = nametbody;
this.urltable = urltable;
this.CodeRow = stringnewrow;
} 

DataTable.prototype.TriggerHeadContextMenu = function (event){
$(this).trigger('headcontextmenu', [event]);
}

// Crea una fila con los datos desde xml
DataTable.prototype.BuildRowFromXmlData = function (xmldatarow){
var $Fila = $(this.CodeRow);
return this.SetRowFromXmlData($Fila, xmldatarow);
}

// Setea una fila con los valores desde datos xml y funciones que tienen las demas filas
DataTable.prototype.SetRowFromXmlData = function (row, xmldatarow){
var $Fila = $(row);
var $xmld = $(xmldatarow);
var $elementos = $Fila.find('*');
$elementos.each(function(k, v){
var $nombre = $(v).attr('name');
if(jQuery.type($nombre) !== 'undefined'){
$(v).val($xmld.attr($nombre));
}
});

return this.SetPropertyRow($Fila);
}

DataTable.prototype.HideBody = function (){
var options = {};
$("#"+this.TBody).hide('fold', options, 1000);
}

DataTable.prototype.ShowBody = function (){
var options = {};
$("#"+this.TBody).show('fold', options, 1000);
}


// Desace el ultimo cambio realizado
DataTable.prototype.UnDoCellChange = function (cell){
var $celda = $(cell);
if($celda.is(':checkbox')){
$celda.attr('checked', !$celda.is(':checked'));
}else{
$celda.val($celda.data('last'));
}
}

// Crea una nueva fila con valores de fabrica y propiedades predefinidas
DataTable.prototype.Row = function (){
var $NuevaRow = $(this.CodeRow);
return this.SetPropertyRow($NuevaRow);
}
// Limpia la tabla
DataTable.prototype.Empty = function (){
var $Cuerp = $("#"+this.TBody)
$Cuerp.empty();
}

// Elimina todos los registros de la tabla
DataTable.prototype.RequestDeleteAll = function (){
this.ActionRow (enumRequestAction.DeleteAll, {})
}

// Copia un registro de la tabla
DataTable.prototype.RequestCopyRow = function (row){
this.ActionRow (enumRequestAction.CopyRow, row)
}

// setea las propiedades con las cuales debe funcionar la fila
DataTable.prototype.SetPropertyRow = function (row){

var este = this;
var $tabla = $(this);
var $RowSet = $(row).css({'vertical-align':'top', 'text-align':'center'});
var $Cuerp = $("#"+this.TBody);



$RowSet.hover(function() {
$RowSet.addClass("ui-state-hover");
}, function(){
$RowSet.removeClass("ui-state-hover");
});

//-----------------------------------------
// Dispara un menu contextual cuando se hace click derecho en la fila
	$RowSet.contextmenu(function(event){
$tabla.data('rowcontextmenu', $RowSet);
// Evento dispara un evento rowcontextmenu
$tabla.trigger('rowcontextmenu', [event, $RowSet]);
return false;
	});

//-----------------------------------------
// Obtenemos todos los input, textarea y select de la fila y las ponemos de fabrica
$('input, select, textarea', $RowSet).each(function(k, v){

$cell = $(v);
//$cell.css({'margin':'0', 'padding': '0'});

if($cell.is(":checkbox")){
//$cell.toggle();
if($cell.val() != 'false'){
$cell.attr('checked', true);
}
$cell.data('last', $cell.is(':checked'));
$cell.val($cell.is(':checked'));
}else{
$cell.data('last', $cell.val());
}

//-----------------------------------------
// Evento dispara cuando el campo tiene el foco, almacenando el dato actual
$cell.focus(function(){
$(this).data('last', $(this).val());
});

//-----------------------------------------
// Evento que se disparara cuando el valor del campo cambia
$cell.change(function(){

if($(this).is(":checkbox")){
$(this).data('last', !$(this).is(':checked'));
$(this).val($(this).is(':checked'));
}
// Verifica si los datos son validos para el campo
var valido = true;

if(jQuery.type(this.validity) !== 'undefined'){
valido = this.validity.valid;
}
//alert('ha cambiado');
if(valido){
$RowSet.data('cell_changed', $(this));
este.ActionRow(enumRequestAction.UpdateRow, $RowSet);
}else{
$(this).effect('pulsate');
este.UnDoCellChange($(this));
}

});

});
return $RowSet;
}

// Fila que dispar el menu contextual
DataTable.prototype.RowTriggerContextMenu = function (){
return $(this).data('rowcontextmenu');
}


// Inserta una fila
DataTable.prototype.InsertRow = function (row){
var $Cuerpo = $("#"+this.TBody);
$Cuerpo.append(row);
}

// Envia solicitud de insertar nueva fila
DataTable.prototype.RequestCreateRow = function (row){
//alert($(row).val());
this.ActionRow (enumRequestAction.CreateRow, row)
}

// Envia solicitud de insertar nueva fila
DataTable.prototype.NewRow = function (){
this.ActionRow (enumRequestAction.NewRow, {})
//var $Cuerpo = $("#"+this.TBody);
//$Cuerpo.append(this.Row());
}

DataTable.prototype.Load = function (){
this.ActionRow(enumRequestAction.Load);
}

// Objeto JQuery de un form
DataTable.prototype.FormCheckValidity = function (form){
var Retorno = true;
$(form).attr('id', function(){
if(jQuery.type(this.checkValidity) !== 'undefined'){
Retorno = this.checkValidity;
}
});
return Retorno;
}

// Construye un formulario con los datos 
DataTable.prototype.BuildFormFromRow = function (row, action){
var $Formulario = $('<form style="display: none;"><input name="send" type="submit" value="ok"></form>');
$Formulario.append($('<input name="ata" type="hide" value="'+action+'">'));
//$Formulario.append($('<input name="no-cache" type="hide" value="'+Math.random()+'">'));
$('input, select, textarea', $(row)).each(function(k, v){
// Clonamos cada input
var $celda = $(v).clone(true);
$celda.val($(v).val());

if($celda.is('select')){
//alert($(v).val());
//$cell.combobox();
$celda.attr('disabled', false)
}

// Insertamos esa celda al formulario
$Formulario.append($celda);
});
$Formulario.data('isvalid', this.FormCheckValidity($Formulario));
return $Formulario;
}


// las aciones pueden ser: copiar, eliminar, actualizar
DataTable.prototype.ActionRow = function (actionrequest, row){
//alert('Action row '+actionrequest);
var este = this;

if(actionrequest == enumRequestAction.DeleteRow){

var $dialogo = $('<div id="dialog-confirm" title="Precaucion"><p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>La fila se eliminara permanentemente. Está seguro que desea eliminarla?</p></div>');

		$dialogo.dialog({
			resizable: false,
			modal: true,
			buttons: {
				"Eliminar": function() {
					$( this ).dialog( "close" );
este.InternalActionRow(actionrequest, row);
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});

}else{
este.InternalActionRow(actionrequest, row);
}

}

DataTable.prototype.OnErrorAction = function(action_rep, row){
var dt = this;
var $fila = $(row);

$fila.effect('pulsate');
switch(action_rep){
case enumRequestAction.DeleteRow:
$fila.show();
break;
case enumRequestAction.UpdateRow:
// Fila NO actualizada
if($fila.data('cell_changed') != 'undefined'){
dt.UnDoCellChange($fila.data('cell_changed'));
}
break;
case enumRequestAction.Load:
// La tbla no se carga
break;
}

}


// 
DataTable.prototype.InternalActionRow = function (actionrequest, row){

var dt = this;
var $fila = $(row);
var $Formulario = this.BuildFormFromRow(row, actionrequest);
var Valido = $Formulario.data('isvalid');
if(actionrequest == enumRequestAction.DeleteRow){
Valido = true;
$fila.hide();
}

if(Valido){
$.ajax({
            type: 'POST',
            url: this.urltable,
            data: $Formulario.serialize(),
		dataType: "xml",
            success: function(data) {

var $datos = $(data);
var accionresp = $datos.find('root').attr('actionresponse');

//alert(accionresp+" => "+actionrequest);
/*
var netxurlproccess = $datos.find('root').attr('netxurlproccess');

if(jQuery.type(netxurlproccess) !== 'undefined'){
dt.urltable = netxurlproccess;
}
*/
//alert('Llegan datos');
if(accionresp == enumResponseAction.Load && actionrequest == enumRequestAction.Load){
//alert('Carga la tabla');
dt.Empty();
$datos.find('row').each(function(){
dt.InsertRow(dt.BuildRowFromXmlData($(this)));
});

}else if(accionresp == enumResponseAction.UpdatedRow && actionrequest == enumRequestAction.UpdateRow){
//alert('Actualiza la fila');
$datos.find('row').each(function(){
$fila.replaceWith(dt.BuildRowFromXmlData($(this)));
});

}else if(accionresp == enumResponseAction.CreatedRow && actionrequest == enumRequestAction.CreateRow){
//alert('Crea nueva la fila');
$datos.find('row').each(function(){
dt.InsertRow(dt.BuildRowFromXmlData($(this)));
});

}else if(accionresp == enumResponseAction.DeletedRow && actionrequest == enumRequestAction.DeleteRow){
alert('Elimina la fila');
$fila.remove();
}else{
dt.OnErrorAction(actionrequest, $fila);
}



            },
            error: function(xhhr, status, htmlerror) {
dt.OnErrorAction(actionrequest, $fila);
            }
        });
}else{
dt.OnErrorAction(actionrequest, $fila);
}
}




