define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!./wlocation.html'
],function(declare,_Widget,_Templated,templateString){

 return declare('usms.wlocation',[ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString   
});
});