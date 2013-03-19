//>>built
define("jspire/Gridx",["dojo/_base/declare", "jspire/String"],function(_1){

return {

// EditorArgs para una columna booleana de gridx editable, la columna debe usar como editor un checkbox y estar como alwaysEditing: true para que muestre el checkbox
EditorArgsToCellBoolean: {
props: 'value: true',
				fromEditor: function (d){
d1 = d+'';
		return d1.to_boolean();
	},
toEditor: function(storeData, gridData){
r = gridData+'';
return r.to_boolean();

				}
			},

// EditorArgs para una columna booleana de gridx editable, la columna debe usar como editor un checkbox y estar como alwaysEditing: true para que muestre el checkbox, pero no es editable
EditorArgsToCellBooleanDisabled: {
props: 'value: true, disabled: "true"',
				fromEditor: function (d){
d1 = d+'';
		return d1.to_boolean();
	},
toEditor: function(storeData, gridData){
r = gridData+'';
return r.to_boolean();
				}
			}

};
});
