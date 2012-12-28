function CtxtMenu(idDivContainer, idUlmenu){
this.IdDiv = idDivContainer;
this.IdUL = idUlmenu;
}


CtxtMenu.prototype.AddItem = function (label, FunOnClick){
var $Item = $('<li></li>');
$Item.css({'margin': 0, 'padding': 0,  'list-style-type': 'none'});
$Item.append(label);
var este = this;
$Item.click(function(){
este.Hide();
FunOnClick();
});

$Item.hover(function() {
$Item.addClass("ui-state-active");
}, function(){
$Item.removeClass("ui-state-active");
});

$("#"+this.IdUL).append($Item);
}


CtxtMenu.prototype.Show = function (pageX, pageY){

var options = {};
$("#"+this.IdDiv).css({'left': pageX + 5, 'top': pageY + 5, 'position': 'absolute'});
$("#"+this.IdDiv).show('blind', options, 'fast');

}

CtxtMenu.prototype.Hide = function (){
if($("#"+this.IdDiv).is(':visible')){
var options = {};
$("#"+this.IdDiv).hide( 'blind', options, 'fast');
}
}

