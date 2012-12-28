// Funciones para trabajar con tablas dinamicas

var enumActionRow = {"None": 0, "New": 1, "Copy": 2, "Update": 3, "Delete": 4, "UnDo": 5};

function DataTable(nametable, nametrlabel, nametbody, stringnewrow, urlaction, autoconnectajax){
this.Table = nametable;
this.TRHeadLabel = nametrlabel;
this.TBody = nametbody;
this.UrlAction = urlaction;
this.CodeRow = stringnewrow;
this.AutoConnectAjax = autoconnectajax;
} 




DataTable.prototype.TriggerHeadContextMenu = function (event){
$(this).trigger('headcontextmenu', [event]);
}

DataTable.prototype.BuildRowFromXmlData = function (xmldatarow){

var $Fila = $(this.CodeRow);
//alert($Fila.html());
var $xmld = $(xmldatarow);
var $elementos = $Fila.find('*');

$elementos.each(function(k, v){

var $nombre = $(v).attr('name');

if(jQuery.type($nombre) !== 'undefined'){
$(v).val($xmld.attr($nombre));
}

//alert($(v).attr('name'));
});
/*
$Fila.find(function(k, v){
alert(v.Name);
}
*/

//$(xmldatarow).attr("");
return $Fila;
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
$(this).trigger('undocell', $celda);
}

// Crea una nueva fila con valores de fabrica y propiedades predefinidas
DataTable.prototype.Row = function (){
var $NuevaRow = $(this.CodeRow);
return this.SetPropertyRow($NuevaRow);
}

DataTable.prototype.Empty = function (){
var $Cuerp = $("#"+this.TBody)
$Cuerp.empty();

var $tabla = $(this);
$tabla.trigger('empty');
}

// Inserta una nueva fila
DataTable.prototype.SetPropertyRow = function (row){

var este = this;
var $tabla = $(this);
var $RowSet = $(row);
var $Cuerp = $("#"+this.TBody);
var AutoAjax = this.AutoConnectAjax;

$RowSet.hover(function() {
//alert('pasa encima');
$RowSet.addClass("ui-state-hover");
}, function(){
$RowSet.removeClass("ui-state-hover");
});

//-----------------------------------------
// Dispara un menu contextual cuando se hace clkick derecho en la fila
	$RowSet.contextmenu(function(event){
//alert(event.pageY);
$tabla.data('rowcontextmenu', $RowSet);
// Evento dispara un evento rowcontextmenu
$tabla.trigger('rowcontextmenu', [event, $RowSet]);
return false;
	});

//-----------------------------------------
// Obtenemos todos los input, textarea y select de la fila y las ponemos de fabrica
$('input, select, textarea', $RowSet).each(function(k, v){

$cell = $(v);

if($cell.is(":checkbox")){
if($cell.val() != 'false'){
$cell.attr('checked', true);
}
$cell.data('last', $cell.is(':checked'));
$cell.val($cell.is(':checked'));
}else{
$cell.data('last', $cell.val());
}

//-----------------------------------------
// Evento que se disparara cuando el valor del campo cambia
$cell.change(function(){
//alert('Cambia');
if($(this).is(":checkbox")){
$(this).data('last', !$(this).is(':checked'));
$(this).val($(this).is(':checked'));
}
// Verifica si los datos son validos para el campo
var valido = true;
//alert(jQuery.type(this.validity));
if(jQuery.type(this.validity) !== 'undefined'){
valido = this.validity.valid;
}

if(valido){
//DataTable.prototype.SetAlreadyValCell($(this));
//var options = {};
$RowSet.data('cell_changed', $(this));
$tabla.trigger('cellchanged', [$RowSet, $(this)]);
if(AutoAjax){
este.ActionRow($RowSet, enumActionRow.Update);
}
}else{
$(this).effect('pulsate');
$tabla.trigger('invaliddatacell', [$(this)]);
este.UnDoCellChange($(this));
}

});


//-----------------------------------------
// Evento dispara cuando el campo tiene el foco, almacenando el dato actual
$cell.focus(function(){
$(this).data('last', $(this).val());
});



});
return $RowSet;
}

// Fila que dispar el menu contextual
DataTable.prototype.RowTriggerContextMenu = function (){
return $(this).data('rowcontextmenu');
}


DataTable.prototype.InsertRow = function (row){
var $Cuerpo = $("#"+this.TBody);
//alert(row.html());
$Cuerpo.append(this.SetPropertyRow(row));
}

// Inserta una nueva fila con valores de fabrica
DataTable.prototype.NewRow = function (){
var $Cuerpo = $("#"+this.TBody);
$Cuerpo.append(this.Row());

var $tabla = $(this);
$tabla.trigger('newrow');
//alert('Nueva fila');
}

DataTable.prototype.Load = function (filter){
//this.BuildRowWithData(filter);
// alert('load...');
var tabla = this;
var $Formulario = $('<form style="display: none;"><input name="send" type="submit" value="load"></form>');
// Data tabla action = dta
$Formulario.append($('<input name="dta" type="hide" value="load">'));

$Formulario.data('isvalid', true);
// Si el filtro esta definido lo usamos
if(jQuery.type(filter) !== 'undefined'){
//alert('Usa filtradco');
$('input, select, textarea', $(filter)).each(function(k, v){
// Clonamos cada input
var $celda = $(v).clone(true);
$celda.val($(v).val());
// Insertamos esa celda al formulario
$Formulario.append($celda);
});

}

if($Formulario.data('isvalid')){
$.ajax({
            type: 'POST',
            url: this.UrlAction,
            data: $Formulario.serialize(),
		dataType: "xml",
            success: function(data) {

if(data){
//alert(data);
tabla.Empty();
$(tabla).trigger('dataloadtable', [data]);
//alert(">"+data);
}


            },
            error: function(xhhr, status, htmlerror) {
$(tabla).trigger('faildataloadtable', [xhhr, status, htmlerror]);
            }
        });

}else{
alert('No es valido el filtro');
}
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

DataTable.prototype.BuildFormFromRow = function (row, action){
var $Formulario = $('<form style="display: none;"><input name="send" type="submit" value="ok"></form>');
$Formulario.append($('<input name="dta" type="hide" value="'+action+'">'));

$('input, select, textarea', $(row)).each(function(k, v){
// Clonamos cada input
var $celda = $(v).clone(true);
//$celda.val( Base64.encode($(v).val()));
$celda.val($(v).val());
// Insertamos esa celda al formulario
$Formulario.append($celda);
});

$Formulario.data('isvalid', this.FormCheckValidity($Formulario));

return $Formulario;
}


// las aciones pueden ser: copiar, eliminar, actualizar
DataTable.prototype.ActionRow = function (row, action){

var este = this;

if(action == enumActionRow.Delete){

var $dialogo = $('<div id="dialog-confirm" title="Alerta"><p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>La fila se eliminara permanentemente. Está seguro que desea eliminarla?</p></div>');

		$dialogo.dialog({
			resizable: false,
			modal: true,
			buttons: {
				"Eliminar": function() {
					$( this ).dialog( "close" );
este.InternalActionRow(row, action);
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				}
			}
		});

}else{
este.InternalActionRow(row, action);
}

}

// las aciones pueden ser: copiar, eliminar, actualizar
DataTable.prototype.InternalActionRow = function (row, action){
//var $tabla = $(this);
//alert('Action row');

var dt = this;
var $fila = $(row);
var $Formulario = this.BuildFormFromRow(row, action);
var Valido = $Formulario.data('isvalid');
if(action == enumActionRow.Delete){
Validar = true;
$fila.hide();
}

if(Valido){
$.ajax({
            type: 'POST',
            url: this.UrlAction,
            data: $Formulario.serialize(),
		dataType: "xml",
            success: function(data) {
//alert('sucess '+data);

//var $datos = jQuery.parseJSON(data);
var $datos = $(data);

var $retorno = $datos.find('AjaxReturn');

//alert($retorno.attr('status'));

if($retorno.attr('status') == 'ok'){
if($datos){
//alert('id datos');
switch(action){
case enumActionRow.Delete:
$fila.remove();
$(dt).trigger('serverrowdel', [$datos]);
break;
case enumActionRow.Update:
$(dt).trigger('serverrowupdated', [$datos, $fila]);
break;
}

}
}else{
//alert('Esto falla');
$fila.effect('pulsate');
$fila.show();
}




            },
            error: function(xhhr, status, htmlerror) {
//alert('error '+status);
$fila.effect('pulsate');
switch(action){
case enumActionRow.Delete:
$(dt).trigger('serverfailrowdel', [$fila, xhhr, status, htmlerror]);
$fila.show();
break;
case enumActionRow.Update:
$(dt).trigger('serverfailrowupdate', [$fila, xhhr, status, htmlerror]);
if($fila.data('cell_changed') != 'undefined'){
dt.UnDoCellChange($fila.data('cell_changed'));
}
break;
}

            }
        });
}else{
$fila.show();
if($fila.data('cell_changed') != 'undefined'){
dt.UnDoCellChange($fila.data('cell_changed'));
}
}
}




