define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_usms_locations_toolbar_edit/_usms_locations_toolbar_edit.html',
"dojo/dom-construct",
'dijit/form/TextBox',
'_common_tooltipdialogconfirmation/_common_tooltipdialogconfirmation'
],function(declare,_Widget,_Templated,templateString, domConstruct){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
postCreate: function(){
var t = this;

var id_form = t.id+"_new_form"; 
var id_name = t.id+"_new_name"; 
var id_code = t.id+"_new_code"; 

t.dialog_new.byes.set('label', 'Guardar');
t.dialog_new.bno.set('label', 'Cancelar');
t.dialog_new.dijitOwner(t.new, 'Click').innerHTML('<form id="'+id_form+'">  <table border="0" style="border-collapse: collapse; table-layout: auto; width: 100%; height: 100%;">    <colgroup>      <col></col>      <col></col>    </colgroup>    <tbody>      <tr>       <td>          <label style="margin-right: 3px;">            Nombre:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="'+id_name+'" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="nombre"></input>       </td>      </tr>      <tr>        <td>          <label style="margin-right: 3px;">            Código:</label>        </td>        <td>         <input type="text" data-dojo-type="dijit.form.TextBox" id="'+id_code+'" intermediateChanges="false" trim="false" uppercase="false" lowercase="false" propercase="false" selectOnClick="false" placeHolder="Código de área"></input>       </td>      </tr>    </tbody>  </table></form>').on('onok', function(){
t.emit('onclicksave', {name: dijit.byId(id_name).get('value'), code: dijit.byId(id_code).get('value')});
//dojo.byId(id_form).reset();
});

t.dialog_delete.dijitOwner(t.delete, 'Click').on('onok', function(){
t.emit('onclickdelete', {});
});

}




   
});
});
