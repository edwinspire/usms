define(['dojo/_base/declare',
'dijit/_Widget',
'dijit/_Templated',
'dojo/text!_common_notification_area/_common_notification_area.html',
"dojo/dom-construct",
"dojo/dom-style"
],function(declare,_Widget,_Templated,templateString, domConstruct, domStyle){

 return declare([ _Widget, _Templated], {
       widgetsInTemplate:true,
       templateString:templateString,
baseUrl: '/lib/custom/_common_notification_area/media/',
postCreate: function(){

},
setText: function(t){
// TODO: Eliminar esta clase, se la mantiene solo por compatibilidad
 var node = domConstruct.create("span");
img = this.baseUrl+'dialog-information-3.png';
node.innerHTML = ' <div style="border: 1px solid #c9c9c9; border-radius: 3px; margin: 5px; -moz-box-shadow: 3px 4px 7px #000000; -webkit-box-shadow: 3px 4px 7px #000000; box-shadow: 3px 4px 7px #000000; width: 300px; background-color: white; opacity: 0.8;">  <div style="padding: 5px;">   <div style="margin: 5px; display: inline-block; clear: both; float: left;">    <img src="'+img+'" style="background-color: transparent;"></img>    <audio autoplay="true"> <source src="media/alert-1.ogg" type="audio/ogg"></source>    </audio>  </div>   <div style="padding: 5px;"><div>'+t+'</div>  </div> </div></div>';

  domConstruct.place(node, this.container, "first");

setTimeout(function(){
dojo.destroy(node);
}, 15000);

},
_args: function(a){

if(a.message === undefined || a.message.length < 1){
a.message = '';
}

if(a.title === undefined || a.title.length < 1){
a.title = '';
}

if(a.img === undefined || a.img.length < 5){
a.img = this.baseUrl+'dialog-information-3.png';
}

if(a.snd === undefined || a.snd.length < 5){
a.snd = this.baseUrl+'alert-1.ogg';
}

if(a.timeout === undefined || a.timeout < 2){
a.timeout = 15;
}
return a;
},
notify: function(args_){

var args = this._args(args_);

 var node = domConstruct.create("span");

node.innerHTML = ' <div style="border: 1px solid #c9c9c9; border-radius: 3px; margin: 5px; -moz-box-shadow: 3px 4px 7px #000000; -webkit-box-shadow: 3px 4px 7px #000000; box-shadow: 3px 4px 7px #000000; width: 300px; background-color: white; opacity: 0.8;"><div style="padding: 5px;"><table border="0" style="border-collapse:collapse;table-layout:inherit;width:100%;height:100%;"> <colgroup>   <col style="vertical-align: top; width: 5%;"></col>   <col style="width: auto;"></col> </colgroup> <tbody>   <tr>     <td>       <div style="margin: 5px; display: inline-block;">         <img src="'+args.img+'" style="background-color: transparent;"></img>         <audio autoplay="true">     <source src="'+args.snd+'" type="audio/ogg"></source>         </audio>       </div>     </td>     <td>       <div style="padding: 5px; width: 100%; height: 100%; display: inline-block;">         <div style="color: black; font-size: 1.5em; font-weight: bold;">'+args.title+'</div>         <div>'+args.message+'</div>       </div>     </td>   </tr> </tbody></table></div></div>';


  domConstruct.place(node, this.container, "first");

setTimeout(function(){
dojo.destroy(node);
}, args.timeout*1000);

} 







   
});
});
