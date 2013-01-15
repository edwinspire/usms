require({cache:{
'url:gridx/templates/QuickFilter.html':"<div class=\"gridxQuickFilter ${_hasFilterBar}\"\n\t><span class=\"gridxQuickFilterInputContainer\"\n\t\t><input type=\"text\" data-dojo-type=\"${textBoxClass}\"\n\t\t\tclass=\"gridxQuickFilterInput\"\n\t\t\tdata-dojo-attach-point=\"textBox\"\n\t\t\tdata-dojo-props=\"placeHolder: '${filterLabel}'\"\n\t\t/><span class=\"gridxQuickFilterClear\"\n\t\t\ttabindex='0'\n\t\t\tdata-dojo-attach-event=\"onclick: _clear\"\n\t\t\ttitle=\"${clearButtonTitle}\"\n\t\t\t><span class=\"gridxQuickFilterClearInner\">x</span\n\t\t></span\n\t></span\n\t><button data-dojo-type=\"${buttonClass}\"\n\t\tclass=\"gridxQuickFilterButton\"\n\t\tdata-dojo-props=\"\n\t\t\tshowLabel: false,\n\t\t\ttitle: '${filterLabel}',\n\t\t\ticonClass: 'gridxQuickFilterIcon'\"\n\t\tdata-dojo-attach-event=\"onClick: _filter\"\n\t></button\n\t><button data-dojo-type=\"${comboButtonClass}\"\n\t\tclass=\"gridxQuickFilterComboButton\"\n\t\tdata-dojo-props=\"\n\t\t\tshowLabel: false,\n\t\t\ttitle: '${filterLabel}',\n\t\t\ticonClass: 'gridxQuickFilterIcon'\"\n\t\tdata-dojo-attach-event=\"onClick: _filter\"\n\t\t><span data-dojo-type=\"${menuClass}\">\n\t\t\t<span data-dojo-type=\"${menuItemClass}\"\n\t\t\t\tdata-dojo-attach-event=\"onClick: _filter\"\n\t\t\t>${filterLabel}</span\n\t\t\t><span data-dojo-type=\"${menuItemClass}\"\n\t\t\t\tdata-dojo-attach-event=\"onClick: _showFilterBar\"\n\t\t\t>${buildFilterMenuLabel}</span\n\t\t></span\n\t></button\n></div>\n"}});
define("gridx/modules/barPlugins/QuickFilter", [
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/dom-class',
	'dojo/keys',
	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	'dijit/form/TextBox',
	'dijit/form/Button',
	'dijit/form/ComboButton',
	'dijit/Menu',
	'dijit/MenuItem',
	'../filter/Filter',
	'dojo/i18n!../../nls/QuickFilter',
	'dojo/text!../../templates/QuickFilter.html'
], function(declare, lang, array, domClass, keys,
	_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin,
	TextBox, Button, ComboButton, Menu, MenuItem,
	F, nls, template){

	return declare(/*===== "gridx.modules.barPlugins.QuickFilter", =====*/[_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
		templateString: template,

		postMixInProperties: function(){
			lang.mixin(this, nls);
			this._hasFilterBar = this.grid.filterBar ? 'gridxQuickFilterHasFilterBar' : 'gridxQuickFilterNoFilterBar';
		},

		postCreate: function(){
			if(this.autoApply){
				this.connect(this.textBox, 'onInput', '_onInput');
			}
		},

		//grid: gridx.Grid
		//		The grid widget this plugin works for.
		grid: null,

		textBoxClass: TextBox.prototype.declaredClass,

		buttonClass: Button.prototype.declaredClass,

		comboButtonClass: ComboButton.prototype.declaredClass,

		menuClass: Menu.prototype.declaredClass,

		menuItemClass: MenuItem.prototype.declaredClass,

		//Public-------------------------------------------------------------------
		// autoApply: Boolean
		//		If true, the filter will be applied to grid during typing in the filter box.
		autoApply: true,

		// delay: Integer
		//		The time (in ms) delay before applying the filter after each key stroke in the filter box.
		//		Only effective when autoApply is true, 
		delay: 700,

		//Private--------------------------------------------------------------------
		_onInput: function(evt){
			var t = this,
				dn = t.domNode,
				tb = t.textBox,
				key = evt.keyCode;
			setTimeout(function(){
				domClass.toggle(dn, 'gridxQuickFilterActive', tb.get('value'));
			}, 0);
			if(key != keys.TAB){
				clearTimeout(t._handle);
				t._handle = setTimeout(function(){
					t._filter();
				}, key == keys.ENTER ? 0 : t.delay);
			}
		},

		_clear: function(){
			this.textBox.set('value', '');
			domClass.remove(this.domNode, 'gridxQuickFilterActive');
			this._filter();
		},

		_filter: function(){
			var t = this,
				g = t.grid,
				v = t.textBox.get('value'),
				cols = array.filter(g.columns(), function(col){
					return col.filterable !== false;
				});
			clearTimeout(t._handle);
			if(g.filterBar){
				//TODO: is there a better way communicate with FilterBar?
				if(v === ''){
					g.filterBar.clearFilter(true);
				}else{
					g.filterBar.applyFilter({
						conditions: [{
							condition: 'contain',
							value: v
						}]
					});
				}
			}else{
				g.filter.setFilter(v === '' ? 0 : F.or.apply(0, array.map(cols, function(col){
					return F.contain(F.column(col.id), F.value(v));
				})));
			}
		},

		_showFilterBar: function(){
			var fb = this.grid.filterBar;
			fb.show();
			fb.showFilterDialog();
		}
	});
});
