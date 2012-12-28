//New file source
using GLib;
using Gee;
using edwinspire.UiWeb.Server;
using edwinspire.UiWeb.ui.Components.Tables.Ajax;
using edwinspire.UiWeb.ui.Components;
using edwinspire.UiWeb.ui.Widgets;
using edwinspire.UiWeb.ui;
using edwinspire.uSMS;
using edwinspire.Html;
using edwinspire.uHttp;
using edwinspire.UiWeb.ui.jQueryUI;


namespace edwinspire.uSMS{

[Description(nick = "Master Page", blurb = "Home uSMS server")]
public class Home:Window, IValaCompiledPage{

public Home(){
this.Title = "Home uSMS Server";
MenuDock();
Menu();
}

public string VirtualUrl{
get{
return "/";
}
}

private void MenuDock(){
this.addDockIcon("Logout", "js/widget/img/mundo_loading.gif", "/", "Loggout", false);
}


private void Menu(){
var ctrol = new TableControl();
this.addSubMenu("uSMS", "LOGOUT", "/", false);
this.addGroupToSubMenu("uSMS", "Configuracion");
this.addSimpleLink("uSMS", "Configuracion", "Servidor", "/");
this.addSimpleLink("uSMS", "Configuracion", "Control", ctrol.VirtualUrl);
}

}


public class ProccessTableControl: AjaxTable, ITableResponse{

public ArrayList<HashMap<string, string>> BufferRowsInternal{get; set; default = new ArrayList<HashMap<string, string>>();}

public ProccessTableControl(){

BufferRowsInternal = new ArrayList<HashMap<string, string>>();

this.Title = "CONTROL";
this.addColumnFromInputType("Id", "Id", TypeDataField.Number, "", false, true);
this.addColumnFromInputType("Date", "Date", TypeDataField.Date, "", false, true);
this.addColumnFromEnum("Control", "Control", typeof(ProcessCtrl), "", true, "0");

//var Note = new TextArea();
//Note.Name = "Note";
//Note.Cols = 10;
this.addColumnFromTextArea("Note", "Note");
}


public Response ResponseToAction(RequestAction action, uHttp.Request request, HashMap<string, string> params){
    Response Respuesta = new Response();
Respuesta.Header.Status = StatusCode.NOT_FOUND;

HashMap<string, string> Datas = request.Form;

switch(action){

case RequestAction.Load:
var Lista = TableProcessControl.All();

foreach(var evento in Lista){
int cont = (int)evento.Ctrl;

Datas.clear();
Datas["Id"] = evento.Id.to_string();
Datas["Date"] = evento.Date;
Datas["Control"] = cont.to_string();
Datas["Note"] = evento.Note;

this.AddRowToBufferRows(this.Columns, Datas);
Datas.clear();
}

Respuesta.Header.Status = StatusCode.OK;
    Respuesta.Header.ContentType = "text/xml";
Respuesta.Data = this.xmlResponseLoad().data;
break;

case RequestAction.UpdateRow:

var updatedFila = new ProcessControldb.from_string(Datas["Id"], Datas["Control"], Datas["Note"], Datas["Date"]);

if(updatedFila.Id>0){

if(TableProcessControl.Update(updatedFila)){

var filaActualizada = TableProcessControl.RowById(updatedFila.Id);
int control = (int)filaActualizada.Ctrl;

Datas.clear();
Datas["Id"] = filaActualizada.Id.to_string();
Datas["Date"] = filaActualizada.Date;
Datas["Control"] = control.to_string();
Datas["Note"] = filaActualizada.Note;

this.AddRowToBufferRows(this.Columns, Datas);
Respuesta.Header.Status = StatusCode.OK;
Respuesta.Data = this.xmlResponseRowUpdated().data;
}
Datas.clear();
}
break;

case RequestAction.CreateRow:
var updatedFila = new ProcessControldb.from_string("0", Datas["Control"], Datas["Note"], "");

int idnuevaFila = (int)TableProcessControl.Insert(updatedFila);
if(idnuevaFila>0){

var filaActualizada = TableProcessControl.RowById(idnuevaFila);
int control = (int)filaActualizada.Ctrl;

Datas.clear();
Datas["Id"] = filaActualizada.Id.to_string();
Datas["Date"] = filaActualizada.Date;
Datas["Control"] = control.to_string();
Datas["Note"] = filaActualizada.Note;

this.AddRowToBufferRows(this.Columns, Datas);
Respuesta.Header.Status = StatusCode.OK;
Respuesta.Data = this.xmlResponseRowCreated().data;
Datas.clear();
}
break;

}

return Respuesta;
}

}



//************************************
[Description(nick = "uSMS Control", blurb = "Show and control process")]
public class TableControl:Basic, IValaCompiledPage{

[Description(nick = "Table HTML to datas", blurb = "")]
public ProccessTableControl Table = new ProccessTableControl();
//private ContextualMenu MenuContextHead = new ContextualMenu();
//private ContextualMenu MenuContextRow = new ContextualMenu();


public TableControl(){
/*
MenuContextHead.addItem("'Cambiar Status'", "ChangeStatusuSMSServer();");
MenuContextHead.addItem("'Recargar'", Table.JsFunctionLoad());
Table.OnHeadContextMenu = MenuContextHead.JsFunctionShow("eventctxtm.pageX", "eventctxtm.pageY");

MenuContextRow.addItem("'Recargar'", Table.JsFunctionLoad());
MenuContextRow.addItem("'Eliminar'", Table.JsFunctionActionRow(RequestAction.DeleteRow, Table.JsFunctionRowTriggerContextMenu()));
MenuContextRow.addItem("'Cambiar Status'", "ChangeStatusuSMSServer();");

Table.OnRowContextMenu = MenuContextRow.JsFunctionShow("eventctxtm.pageX", "eventctxtm.pageY");
*/
Armador();
}

public string VirtualUrl{
get{
return "/usmsctrl";
}
}


private void Armador(){
Table.AutoRequestLoadOnLoad = true;
//Table.JsScript = JStabla();
SCRIPT Javascripttable = new SCRIPT();
Javascripttable.addElementText(FunJsDialogChangeStatus());
Table.addToHead(new ElementHead(5, Javascripttable));

this.addComponent(Table);
//this.addComponent(MenuContextHead);
//this.addComponent(MenuContextRow);
}

private string FunJsDialogChangeStatus(){

var Retorno = new StringBuilder();

var TestDialg = new Dialog();
TestDialg.title = "Servidor";
TestDialg.resizable = false;
TestDialg.modal = true;

var Formulario = new FORM();
Formulario.Style = "text-align=center;";

var Eti = new LABEL();
Eti.For = "Control";
Eti.addElementText("Control: ");
Formulario.addElement(Eti);

var combobx = new ComboBox.FromEnum(typeof(ProcessCtrl));
combobx.Name = "Control";
combobx.Title = "Cambia el estado actual del servidor";
Formulario.addElement(combobx);

TestDialg.Content = Formulario;

Retorno.append_printf("""function(){
%s;
$(this).dialog("close");
}
""", Table.JsFunctionRequestCreateRow("$(this)"));

TestDialg.addButton("Cerrar", """function(){
$(this).dialog("close");
}""");

TestDialg.addButton("Aceptar", Retorno.str);
Retorno.truncate();

Retorno.append_printf("""
function ChangeStatusuSMSServer(){
%s
}
""", TestDialg.JavaScriptCode());

return Retorno.str;
}
/*
private string JStabla(){
var Retorno = new StringBuilder();
Retorno.append_printf("""
%s.Load();
"""
, Table.JSObject);
return Retorno.str;
}
*/


}



}
