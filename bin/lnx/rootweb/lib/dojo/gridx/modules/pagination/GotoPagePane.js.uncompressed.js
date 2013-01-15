require({cache:{
'url:gridx/templates/GotoPagePane.html':"<div class='gridxGotoPage'\n\t><table><tbody\n\t\t><tr><td id='${id}-pageInputLabel' class='gridxGotoPageMainMsg'>\n\t\t${gotoDialogMainMsg}\n\t\t</td></tr\n\t\t><tr><td class='gridxGotoPageInput'\n\t\t\t><input data-dojo-type='${numberTextBoxClass}'\n\t\t\t\tdata-dojo-props='\"aria-labelledby\": \"${id}-pageInputLabel\"'\n\t\t\t\tclass='gridxGotoPageInputBox'\n\t\t\t\tdata-dojo-attach-point='pageInputBox'\n\t\t\t\tdata-dojo-attach-event='onKeyUp: _updateStatus, onKeyDown: _onKeyDown'></input\n\t\t\t><span\n\t\t\t\tclass='gridxPageCountMsg'\n\t\t\t\tdata-dojo-attach-point='pageCountMsgNode'></span\n\t\t></td></tr\n\t\t><tr><td class='gridxGotoPageBtns'\n\t\t\t><button data-dojo-type='${buttonClass}' \n\t\t\t\tdata-dojo-attach-point='okBtn'\n\t\t\t\tdata-dojo-attach-event='onClick: _onOK'>\n\t\t\t\t${gotoDialogOKBtn}\n\t\t\t</button\n\t\t\t><button data-dojo-type='${buttonClass}'\n\t\t\t\tdata-dojo-attach-event='onClick: _onCancel'>\n\t\t\t\t${gotoDialogCancelBtn}\n\t\t\t</button\n\t\t></td></tr\n\t></tbody></table\n></div>\n"}});
define("gridx/modules/pagination/GotoPagePane", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/event",
	"dojo/keys",
	"dijit/_WidgetBase",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dojo/text!../../templates/GotoPagePane.html"
], function(declare, lang, event, keys, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, goToTemplate){

	return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: goToTemplate,
	
		pager: null,

		postMixInProperties: function(){
			var t = this,
				p = t.pager,
				mod = p.module;
			lang.mixin(t, p._nls);
			t.numberTextBoxClass = mod.arg('numberTextBoxClass').prototype.declaredClass;
			t.buttonClass = mod.arg('buttonClass').prototype.declaredClass;
		},
	
		postCreate: function(){
			this._updateStatus();
		},
	
		_updateStatus: function(){
			var b = this.pageInputBox;
			this.okBtn.set('disabled', !b.isValid() || b.get('displayedValue') === "");
		},
	
		_onOK: function(){
			var p = this.pager;
			p.pagination.gotoPage(this.pageInputBox.get('value') - 1);
			p._gotoDialog.hide();
		},
	
		_onCancel: function(){
			this.pager._gotoDialog.hide();
		},
		
		_onKeyDown: function(evt){
			if(!this.okBtn.get('disabled') && keys.ENTER == evt.keyCode){
				this._onOK();
				event.stop(evt);
			}
		}
	});
});
