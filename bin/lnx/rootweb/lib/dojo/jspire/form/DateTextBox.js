//>>built
define("jspire/form/DateTextBox",["dojo/_base/declare", "dojo/date/locale"],function(_1, _2){

var _x = {
// Agrega la funcion _getDate a un dijit.form.DateTextBox  para obtener la fecha de forma mas sencilla, el patron de fecha fabrica es yyyy-MM-dd
addGetDateFunctionArgs: function(datetextbox, datePattern, selector){
datetextbox._datePattern = datePattern;
datetextbox._selector = selector;
datetextbox._getDate = function(){
return _2.format(datetextbox.get('value'), {datePattern: datetextbox._datePattern, selector: datetextbox._selector});
}
return datetextbox;
},


addGetDateFunction: function(datetextbox){
return this.addGetDateFunctionArgs(datetextbox, "yyyy-MM-dd", "date");
},


addSetDateFunction: function(datetextbox){
datetextbox._setDate = function(date_){
datetextbox.set('value', date_);
return datetextbox;
}

}


}

return _x;
});
