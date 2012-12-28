
function LoadInformationContent(urlcontent){
//alert('Solicita carga de '+urlcontent);
//alert($(window).width());   // returns width of browser viewport
//alert($(document).width()); // returns width of HTML document

//$divshowloading = $('#divshowloading');
$inforcon = $('#inforcontainer');
$inforcon.fadeOut(Cargar);
AutoSizeElements();
//$inforcon.css({'font-size': '90%', 'width': $(window).width()-5, 'height': $(window).height()-40});

function Cargar(){
//setTimeout(OnLoadObjectContainer, 30000);
//$divshowloading.fadeIn();
//var objectcontainerurl = '<OBJECT id="objectontainer" style="display:none;" onload="OnLoadObjectContainer();" class="objectontainer ui-widget ui-widget-content">El contenido no se pudo cargar</OBJECT>';
//	$(this).html(objectcontainerurl);
$('#objectontainer').attr('data', urlcontent);
/*
var objectcontainerurl = '<OBJECT id="objectontainer" style="display:none;" onload="OnLoadObjectContainer();" class="objectontainer ui-widget ui-widget-content" data ="'+urlcontent+'">El contenido no se pudo cargar</OBJECT>';
*/
$('#objectontainer').css({'display': 'block'});

//$('#objectontainer').bind('load', OnLoadObjectContainer());
// Esta linea permite cargar el contenido 3 seg. despues, es utilizado para navegadores que no detectan onload de OBJECT como CROME
//$('#inforcontainer').css({'display': 'none'});
//$('#inforcontainer').fadeIn(1);
//$('#inforcontainer').fadeOut(1);
//$('#inforcontainer').css({'width': $(document).width()-100, 'height': $(document).height()-30});
//$('#inforcontainer').css({'font-size': '90%', 'width': $(document).width()-20, 'height': $(document).height()-35});
$('#objectontainer').css({'font-size': '90%', 'width': $("#inforcontainer").width()-1, 'height': $("#inforcontainer").height()-1});
}

}

function OnLoadObjectContainer(){
$('#objectontainer').show();
$('#inforcontainer').fadeIn(1000);
/*
$('#divshowloading').fadeOut(function(){
$('#objectontainer').show();
$('#inforcontainer').fadeIn(1000);
});
*/
}

function AutoSizeElements(){
$('#inforcontainer').css({'font-size': '90%', 'width': $(window).width()-5, 'height': $(window).height()-40});
//$('#divshowloading').css({'font-size': '90%', 'width': $("#inforcontainer").width()-50, 'height': $("#inforcontainer").height()-10});
}


$(document).ready(function(){
AutoSizeElements();
//$('#body').css({'margin': 0, 'padding': 0, 'font-size': '90%'});
//$('#inforcontainer').css({'font-size': '90%', 'width': $(window).width()-5, 'height': $(window).height()-40});
//$('#divshowloading').css({'text-align': 'center', 'width': $(document).width()-50, 'height': $(document).height()-50});
//$('#divshowloading').css({'font-size': '90%', 'width': $("#inforcontainer").width()-50, 'height': $("#inforcontainer").height()-10});
//alert('Se ha cargado');
//$("#html").css({'margin': 0, 'padding': 0, 'font-size': '90%'});
});





