require({cache:{
'dojo/i18n':function(){
define("dojo/i18n", ["./_base/kernel", "require", "./has", "./_base/array", "./_base/config", "./_base/lang", "./_base/xhr", "./json", "module"],
	function(dojo, require, has, array, config, lang, xhr, json, module){

	// module:
	//		dojo/i18n

	has.add("dojo-preload-i18n-Api",
		// if true, define the preload localizations machinery
		1
	);

	 1 || has.add("dojo-v1x-i18n-Api",
		// if true, define the v1.x i18n functions
		1
	);

	var
		thisModule = dojo.i18n =
			{
				// summary:
				//		This module implements the dojo/i18n! plugin and the v1.6- i18n API
				// description:
				//		We choose to include our own plugin to leverage functionality already contained in dojo
				//		and thereby reduce the size of the plugin compared to various loader implementations. Also, this
				//		allows foreign AMD loaders to be used without their plugins.
			},

		nlsRe =
			// regexp for reconstructing the master bundle name from parts of the regexp match
			// nlsRe.exec("foo/bar/baz/nls/en-ca/foo") gives:
			// ["foo/bar/baz/nls/en-ca/foo", "foo/bar/baz/nls/", "/", "/", "en-ca", "foo"]
			// nlsRe.exec("foo/bar/baz/nls/foo") gives:
			// ["foo/bar/baz/nls/foo", "foo/bar/baz/nls/", "/", "/", "foo", ""]
			// so, if match[5] is blank, it means this is the top bundle definition.
			// courtesy of http://requirejs.org
			/(^.*(^|\/)nls)(\/|$)([^\/]*)\/?([^\/]*)/,

		getAvailableLocales = function(
			root,
			locale,
			bundlePath,
			bundleName
		){
			// summary:
			//		return a vector of module ids containing all available locales with respect to the target locale
			//		For example, assuming:
			//
			//		- the root bundle indicates specific bundles for "fr" and "fr-ca",
			//		-  bundlePath is "myPackage/nls"
			//		- bundleName is "myBundle"
			//
			//		Then a locale argument of "fr-ca" would return
			//
			//			["myPackage/nls/myBundle", "myPackage/nls/fr/myBundle", "myPackage/nls/fr-ca/myBundle"]
			//
			//		Notice that bundles are returned least-specific to most-specific, starting with the root.
			//
			//		If root===false indicates we're working with a pre-AMD i18n bundle that doesn't tell about the available locales;
			//		therefore, assume everything is available and get 404 errors that indicate a particular localization is not available

			for(var result = [bundlePath + bundleName], localeParts = locale.split("-"), current = "", i = 0; i<localeParts.length; i++){
				current += (current ? "-" : "") + localeParts[i];
				if(!root || root[current]){
					result.push(bundlePath + current + "/" + bundleName);
				}
			}
			return result;
		},

		cache = {},

		getBundleName = function(moduleName, bundleName, locale){
			locale = locale ? locale.toLowerCase() : dojo.locale;
			moduleName = moduleName.replace(/\./g, "/");
			bundleName = bundleName.replace(/\./g, "/");
			return (/root/i.test(locale)) ?
				(moduleName + "/nls/" + bundleName) :
				(moduleName + "/nls/" + locale + "/" + bundleName);
		},

		getL10nName = dojo.getL10nName = function(moduleName, bundleName, locale){
			return moduleName = module.id + "!" + getBundleName(moduleName, bundleName, locale);
		},

		doLoad = function(require, bundlePathAndName, bundlePath, bundleName, locale, load){
			// summary:
			//		get the root bundle which instructs which other bundles are required to construct the localized bundle
			require([bundlePathAndName], function(root){
				var current = lang.clone(root.root),
					availableLocales = getAvailableLocales(!root._v1x && root, locale, bundlePath, bundleName);
				require(availableLocales, function(){
					for (var i = 1; i<availableLocales.length; i++){
						current = lang.mixin(lang.clone(current), arguments[i]);
					}
					// target may not have been resolve (e.g., maybe only "fr" exists when "fr-ca" was requested)
					var target = bundlePathAndName + "/" + locale;
					cache[target] = current;
					load();
				});
			});
		},

		normalize = function(id, toAbsMid){
			// summary:
			//		id may be relative.
			//		preload has form `*preload*<path>/nls/<module>*<flattened locales>` and
			//		therefore never looks like a relative
			return /^\./.test(id) ? toAbsMid(id) : id;
		},

		getLocalesToLoad = function(targetLocale){
			var list = config.extraLocale || [];
			list = lang.isArray(list) ? list : [list];
			list.push(targetLocale);
			return list;
		},

		load = function(id, require, load){
			// summary:
			//		id is in one of the following formats
			//
			//		1. <path>/nls/<bundle>
			//			=> load the bundle, localized to config.locale; load all bundles localized to
			//			config.extraLocale (if any); return the loaded bundle localized to config.locale.
			//
			//		2. <path>/nls/<locale>/<bundle>
			//			=> load then return the bundle localized to <locale>
			//
			//		3. *preload*<path>/nls/<module>*<JSON array of available locales>
			//			=> for config.locale and all config.extraLocale, load all bundles found
			//			in the best-matching bundle rollup. A value of 1 is returned, which
			//			is meaningless other than to say the plugin is executing the requested
			//			preloads
			//
			//		In cases 1 and 2, <path> is always normalized to an absolute module id upon entry; see
			//		normalize. In case 3, it <path> is assumed to be absolute; this is arranged by the builder.
			//
			//		To load a bundle means to insert the bundle into the plugin's cache and publish the bundle
			//		value to the loader. Given <path>, <bundle>, and a particular <locale>, the cache key
			//
			//			<path>/nls/<bundle>/<locale>
			//
			//		will hold the value. Similarly, then plugin will publish this value to the loader by
			//
			//			define("<path>/nls/<bundle>/<locale>", <bundle-value>);
			//
			//		Given this algorithm, other machinery can provide fast load paths be preplacing
			//		values in the plugin's cache, which is public. When a load is demanded the
			//		cache is inspected before starting any loading. Explicitly placing values in the plugin
			//		cache is an advanced/experimental feature that should not be needed; use at your own risk.
			//
			//		For the normal AMD algorithm, the root bundle is loaded first, which instructs the
			//		plugin what additional localized bundles are required for a particular locale. These
			//		additional locales are loaded and a mix of the root and each progressively-specific
			//		locale is returned. For example:
			//
			//		1. The client demands "dojo/i18n!some/path/nls/someBundle
			//
			//		2. The loader demands load(some/path/nls/someBundle)
			//
			//		3. This plugin require's "some/path/nls/someBundle", which is the root bundle.
			//
			//		4. Assuming config.locale is "ab-cd-ef" and the root bundle indicates that localizations
			//		are available for "ab" and "ab-cd-ef" (note the missing "ab-cd", then the plugin
			//		requires "some/path/nls/ab/someBundle" and "some/path/nls/ab-cd-ef/someBundle"
			//
			//		5. Upon receiving all required bundles, the plugin constructs the value of the bundle
			//		ab-cd-ef as...
			//
			//				mixin(mixin(mixin({}, require("some/path/nls/someBundle"),
			//		  			require("some/path/nls/ab/someBundle")),
			//					require("some/path/nls/ab-cd-ef/someBundle"));
			//
			//		This value is inserted into the cache and published to the loader at the
			//		key/module-id some/path/nls/someBundle/ab-cd-ef.
			//
			//		The special preload signature (case 3) instructs the plugin to stop servicing all normal requests
			//		(further preload requests will be serviced) until all ongoing preloading has completed.
			//
			//		The preload signature instructs the plugin that a special rollup module is available that contains
			//		one or more flattened, localized bundles. The JSON array of available locales indicates which locales
			//		are available. Here is an example:
			//
			//			*preload*some/path/nls/someModule*["root", "ab", "ab-cd-ef"]
			//
			//		This indicates the following rollup modules are available:
			//
			//			some/path/nls/someModule_ROOT
			//			some/path/nls/someModule_ab
			//			some/path/nls/someModule_ab-cd-ef
			//
			//		Each of these modules is a normal AMD module that contains one or more flattened bundles in a hash.
			//		For example, assume someModule contained the bundles some/bundle/path/someBundle and
			//		some/bundle/path/someOtherBundle, then some/path/nls/someModule_ab would be expressed as follows:
			//
			//			define({
			//				some/bundle/path/someBundle:<value of someBundle, flattened with respect to locale ab>,
			//				some/bundle/path/someOtherBundle:<value of someOtherBundle, flattened with respect to locale ab>,
			//			});
			//
			//		E.g., given this design, preloading for locale=="ab" can execute the following algorithm:
			//
			//			require(["some/path/nls/someModule_ab"], function(rollup){
			//				for(var p in rollup){
			//					var id = p + "/ab",
			//					cache[id] = rollup[p];
			//					define(id, rollup[p]);
			//				}
			//			});
			//
			//		Similarly, if "ab-cd" is requested, the algorithm can determine that "ab" is the best available and
			//		load accordingly.
			//
			//		The builder will write such rollups for every layer if a non-empty localeList  profile property is
			//		provided. Further, the builder will include the following cache entry in the cache associated with
			//		any layer.
			//
			//			"*now":function(r){r(['dojo/i18n!*preload*<path>/nls/<module>*<JSON array of available locales>']);}
			//
			//		The *now special cache module instructs the loader to apply the provided function to context-require
			//		with respect to the particular layer being defined. This causes the plugin to hold all normal service
			//		requests until all preloading is complete.
			//
			//		Notice that this algorithm is rarely better than the standard AMD load algorithm. Consider the normal case
			//		where the target locale has a single segment and a layer depends on a single bundle:
			//
			//		Without Preloads:
			//
			//		1. Layer loads root bundle.
			//		2. bundle is demanded; plugin loads single localized bundle.
			//
			//		With Preloads:
			//
			//		1. Layer causes preloading of target bundle.
			//		2. bundle is demanded; service is delayed until preloading complete; bundle is returned.
			//
			//		In each case a single transaction is required to load the target bundle. In cases where multiple bundles
			//		are required and/or the locale has multiple segments, preloads still requires a single transaction whereas
			//		the normal path requires an additional transaction for each additional bundle/locale-segment. However all
			//		of these additional transactions can be done concurrently. Owing to this analysis, the entire preloading
			//		algorithm can be discard during a build by setting the has feature dojo-preload-i18n-Api to false.

			if(has("dojo-preload-i18n-Api")){
				var split = id.split("*"),
					preloadDemand = split[1] == "preload";
				if(preloadDemand){
					if(!cache[id]){
						// use cache[id] to prevent multiple preloads of the same preload; this shouldn't happen, but
						// who knows what over-aggressive human optimizers may attempt
						cache[id] = 1;
						preloadL10n(split[2], json.parse(split[3]), 1, require);
					}
					// don't stall the loader!
					load(1);
				}
				if(preloadDemand || waitForPreloads(id, require, load)){
					return;
				}
			}

			var match = nlsRe.exec(id),
				bundlePath = match[1] + "/",
				bundleName = match[5] || match[4],
				bundlePathAndName = bundlePath + bundleName,
				localeSpecified = (match[5] && match[4]),
				targetLocale =	localeSpecified || dojo.locale,
				loadTarget = bundlePathAndName + "/" + targetLocale,
				loadList = localeSpecified ? [targetLocale] : getLocalesToLoad(targetLocale),
				remaining = loadList.length,
				finish = function(){
					if(!--remaining){
						load(lang.delegate(cache[loadTarget]));
					}
				};
			array.forEach(loadList, function(locale){
				var target = bundlePathAndName + "/" + locale;
				if(has("dojo-preload-i18n-Api")){
					checkForLegacyModules(target);
				}
				if(!cache[target]){
					doLoad(require, bundlePathAndName, bundlePath, bundleName, locale, finish);
				}else{
					finish();
				}
			});
		};

	if(has("dojo-unit-tests")){
		var unitTests = thisModule.unitTests = [];
	}

	if(has("dojo-preload-i18n-Api") ||  1 ){
		var normalizeLocale = thisModule.normalizeLocale = function(locale){
				var result = locale ? locale.toLowerCase() : dojo.locale;
				return result == "root" ? "ROOT" : result;
			},

			isXd = function(mid, contextRequire){
				return ( 1  &&  1 ) ?
					contextRequire.isXdUrl(require.toUrl(mid + ".js")) :
					true;
			},

			preloading = 0,

			preloadWaitQueue = [],

			preloadL10n = thisModule._preloadLocalizations = function(/*String*/bundlePrefix, /*Array*/localesGenerated, /*boolean?*/ guaranteedAmdFormat, /*function?*/ contextRequire){
				// summary:
				//		Load available flattened resource bundles associated with a particular module for dojo/locale and all dojo/config.extraLocale (if any)
				// description:
				//		Only called by built layer files. The entire locale hierarchy is loaded. For example,
				//		if locale=="ab-cd", then ROOT, "ab", and "ab-cd" are loaded. This is different than v1.6-
				//		in that the v1.6- would only load ab-cd...which was *always* flattened.
				//
				//		If guaranteedAmdFormat is true, then the module can be loaded with require thereby circumventing the detection algorithm
				//		and the extra possible extra transaction.

				// If this function is called from legacy code, then guaranteedAmdFormat and contextRequire will be undefined. Since the function
				// needs a require in order to resolve module ids, fall back to the context-require associated with this dojo/i18n module, which
				// itself may have been mapped.
				contextRequire = contextRequire || require;

				function doRequire(mid, callback){
					if(isXd(mid, contextRequire) || guaranteedAmdFormat){
						contextRequire([mid], callback);
					}else{
						syncRequire([mid], callback, contextRequire);
					}
				}

				function forEachLocale(locale, func){
					// given locale= "ab-cd-ef", calls func on "ab-cd-ef", "ab-cd", "ab", "ROOT"; stops calling the first time func returns truthy
					var parts = locale.split("-");
					while(parts.length){
						if(func(parts.join("-"))){
							return;
						}
						parts.pop();
					}
					func("ROOT");
				}

				function preload(locale){
					locale = normalizeLocale(locale);
					forEachLocale(locale, function(loc){
						if(array.indexOf(localesGenerated, loc)>=0){
							var mid = bundlePrefix.replace(/\./g, "/")+"_"+loc;
							preloading++;
							doRequire(mid, function(rollup){
								for(var p in rollup){
									cache[require.toAbsMid(p) + "/" + loc] = rollup[p];
								}
								--preloading;
								while(!preloading && preloadWaitQueue.length){
									load.apply(null, preloadWaitQueue.shift());
								}
							});
							return true;
						}
						return false;
					});
				}

				preload();
				array.forEach(dojo.config.extraLocale, preload);
			},

			waitForPreloads = function(id, require, load){
				if(preloading){
					preloadWaitQueue.push([id, require, load]);
				}
				return preloading;
			},

			checkForLegacyModules = function()
				{};
	}

	if( 1 ){
		// this code path assumes the dojo loader and won't work with a standard AMD loader
		var amdValue = {},
			evalBundle =
				// use the function ctor to keep the minifiers away (also come close to global scope, but this is secondary)
				new Function(
					"__bundle",				   // the bundle to evalutate
					"__checkForLegacyModules", // a function that checks if __bundle defined __mid in the global space
					"__mid",				   // the mid that __bundle is intended to define
					"__amdValue",

					// returns one of:
					//		1 => the bundle was an AMD bundle
					//		a legacy bundle object that is the value of __mid
					//		instance of Error => could not figure out how to evaluate bundle

					  // used to detect when __bundle calls define
					  "var define = function(mid, factory){define.called = 1; __amdValue.result = factory || mid;},"
					+ "	   require = function(){define.called = 1;};"

					+ "try{"
					+		"define.called = 0;"
					+		"eval(__bundle);"
					+		"if(define.called==1)"
								// bundle called define; therefore signal it's an AMD bundle
					+			"return __amdValue;"

					+		"if((__checkForLegacyModules = __checkForLegacyModules(__mid)))"
								// bundle was probably a v1.6- built NLS flattened NLS bundle that defined __mid in the global space
					+			"return __checkForLegacyModules;"

					+ "}catch(e){}"
					// evaulating the bundle was *neither* an AMD *nor* a legacy flattened bundle
					// either way, re-eval *after* surrounding with parentheses

					+ "try{"
					+		"return eval('('+__bundle+')');"
					+ "}catch(e){"
					+		"return e;"
					+ "}"
				),

			syncRequire = function(deps, callback, require){
				var results = [];
				array.forEach(deps, function(mid){
					var url = require.toUrl(mid + ".js");

					function load(text){
						var result = evalBundle(text, checkForLegacyModules, mid, amdValue);
						if(result===amdValue){
							// the bundle was an AMD module; re-inject it through the normal AMD path
							// we gotta do this since it could be an anonymous module and simply evaluating
							// the text here won't provide the loader with the context to know what
							// module is being defined()'d. With browser caching, this should be free; further
							// this entire code path can be circumvented by using the AMD format to begin with
							results.push(cache[url] = amdValue.result);
						}else{
							if(result instanceof Error){
								console.error("failed to evaluate i18n bundle; url=" + url, result);
								result = {};
							}
							// nls/<locale>/<bundle-name> indicates not the root.
							results.push(cache[url] = (/nls\/[^\/]+\/[^\/]+$/.test(url) ? result : {root:result, _v1x:1}));
						}
					}

					if(cache[url]){
						results.push(cache[url]);
					}else{
						var bundle = require.syncLoadNls(mid);
						// don't need to check for legacy since syncLoadNls returns a module if the module
						// (1) was already loaded, or (2) was in the cache. In case 1, if syncRequire is called
						// from getLocalization --> load, then load will have called checkForLegacyModules() before
						// calling syncRequire; if syncRequire is called from preloadLocalizations, then we
						// don't care about checkForLegacyModules() because that will be done when a particular
						// bundle is actually demanded. In case 2, checkForLegacyModules() is never relevant
						// because cached modules are always v1.7+ built modules.
						if(bundle){
							results.push(bundle);
						}else{
							if(!xhr){
								try{
									require.getText(url, true, load);
								}catch(e){
									results.push(cache[url] = {});
								}
							}else{
								xhr.get({
									url:url,
									sync:true,
									load:load,
									error:function(){
										results.push(cache[url] = {});
									}
								});
							}
						}
					}
				});
				callback && callback.apply(null, results);
			};

		checkForLegacyModules = function(target){
			// legacy code may have already loaded [e.g] the raw bundle x/y/z at x.y.z; when true, push into the cache
			for(var result, names = target.split("/"), object = dojo.global[names[0]], i = 1; object && i<names.length-1; object = object[names[i++]]){}
			if(object){
				result = object[names[i]];
				if(!result){
					// fallback for incorrect bundle build of 1.6
					result = object[names[i].replace(/-/g,"_")];
				}
				if(result){
					cache[target] = result;
				}
			}
			return result;
		};

		thisModule.getLocalization = function(moduleName, bundleName, locale){
			var result,
				l10nName = getBundleName(moduleName, bundleName, locale);
			load(
				l10nName,

				// isXd() and syncRequire() need a context-require in order to resolve the mid with respect to a reference module.
				// Since this legacy function does not have the concept of a reference module, resolve with respect to this
				// dojo/i18n module, which, itself may have been mapped.
				(!isXd(l10nName, require) ? function(deps, callback){ syncRequire(deps, callback, require); } : require),

				function(result_){ result = result_; }
			);
			return result;
		};

		if(has("dojo-unit-tests")){
			unitTests.push(function(doh){
				doh.register("tests.i18n.unit", function(t){
					var check;

					check = evalBundle("{prop:1}", checkForLegacyModules, "nonsense", amdValue);
					t.is({prop:1}, check); t.is(undefined, check[1]);

					check = evalBundle("({prop:1})", checkForLegacyModules, "nonsense", amdValue);
					t.is({prop:1}, check); t.is(undefined, check[1]);

					check = evalBundle("{'prop-x':1}", checkForLegacyModules, "nonsense", amdValue);
					t.is({'prop-x':1}, check); t.is(undefined, check[1]);

					check = evalBundle("({'prop-x':1})", checkForLegacyModules, "nonsense", amdValue);
					t.is({'prop-x':1}, check); t.is(undefined, check[1]);

					check = evalBundle("define({'prop-x':1})", checkForLegacyModules, "nonsense", amdValue);
					t.is(amdValue, check); t.is({'prop-x':1}, amdValue.result);

					check = evalBundle("define('some/module', {'prop-x':1})", checkForLegacyModules, "nonsense", amdValue);
					t.is(amdValue, check); t.is({'prop-x':1}, amdValue.result);

					check = evalBundle("this is total nonsense and should throw an error", checkForLegacyModules, "nonsense", amdValue);
					t.is(check instanceof Error, true);
				});
			});
		}
	}

	return lang.mixin(thisModule, {
		dynamic:true,
		normalize:normalize,
		load:load,
		cache:cache
	});
});

},
'gridx/modules/ColumnResizer':function(){
define([
	"dojo/_base/declare",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/_base/event",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/keys",
	"dojo/query",
	"../core/_Module"
], function(declare, sniff, win, event, dom, domStyle, domClass, domConstruct, domGeometry, keys, query, _Module){

	var removeClass = domClass.remove;

	function getCell(e){
		var node = e.target;
		if(node){
			if(/table/i.test(node.tagName)){
				var m = e.offsetX || e.layerX || 0,
					i = 0,
					cells = node.rows[0].cells;
				while(m > 0 && cells[i]){
					m -= cells[i].offsetWidth;
					i++;
				}
				return cells[i] || null;
			}
			while(node && node.tagName){
				if(node.tagName.toLowerCase() == 'th'){
					return node;
				}
				node = node.parentNode;
			}
		}
		return null;
	}

	return declare(/*===== "gridx.modules.ColumnResizer", =====*/_Module, {
		// summary:
		//		Column Resizer machinery.
		// description:
		//		This module provides a way to resize column width. 
		
		// name: [readonly] String
		//		module name
		name: 'columnResizer',

//		required: ['hScroller'],

		// minWidth: Integer
		//		min column width in px
		minWidth: 20,

		detectWidth: 5,

		load: function(args){
			var t = this,
				g = t.grid;
			t.batchConnect(
				[g.header.innerNode, 'mousemove', '_mousemove'],
				[g, 'onHeaderMouseOut', '_mouseout'],
				[g, 'onHeaderMouseDown', '_mousedown', t, t.name],
				[g, 'onHeaderKeyDown', '_keydown'],
				[win.doc, 'mousemove', '_docMousemove'],
				[win.doc, 'onmouseup', '_mouseup']
			);
			t.loaded.callback();
		},

		getAPIPath: function(){
			// summary:
			//		Module reference shortcut so that we can 
			//		quickly locate this module by grid.columnResizer
			return {
				columnResizer: this
			};
		},

		// columnMixin: Object
		//		A map of functions to be mixed into grid column object, so that we can use select api on column object directly
		//		- grid.column(1).setWidth(300);
		columnMixin: {
			setWidth: function(width){
				this.grid.columnResizer.setWidth(this.id, width);
			}
		},

		//Public---------------------------------------------------------------------
		setWidth: function(/*String | Integer*/colId, /*Integer*/width){
			// summary:
			//		Set width of the target column
			var t = this,
				g = t.grid, i,
				cols = g._columns,
				minWidth = t.arg('minWidth'),
				oldWidth;
			width = parseInt(width, 10);
			if(width < minWidth){
				width = minWidth;
			}
			g._columnsById[colId].width = width + 'px';
			for(i = 0; i < cols.length; ++i){
				cols[i].declaredWidth = cols[i].width;
			}
			query('[colid="' + colId + '"]', g.domNode).forEach(function(cell){
				if(!oldWidth){
					oldWidth = domStyle.get(cell, 'width');
				}
				cell.style.width = width + 'px';
			});
			g.body.onRender();
			g.vLayout.reLayout();
			
			t.onResize(colId, width, oldWidth);
		},

		//Event--------------------------------------------------------------
		onResize: function(/* colId, newWidth, oldWidth */){},

		//Private-----------------------------------------------------------
		_mousemove: function(e){
			var t = this,
				cell = getCell(e),
				flags = t.grid._eventFlags;
			if(cell){
				if(t._resizing){
					removeClass(cell, 'gridxHeaderCellOver');
				}
				if(t._resizing || !cell || t._ismousedown){
					return;
				}
				var ready = t._readyToResize = t._isInResizeRange(e);
				//Forbid anything else to happen when we are resizing a column!
				flags.onHeaderMouseDown = flags.onHeaderCellMouseDown = ready ? t.name : undefined;

				domClass.toggle(win.body(), 'gridxColumnResizing', ready);
				if(ready){
					removeClass(cell, 'gridxHeaderCellOver');
				}
			}
		},

		_docMousemove: function(e){
			if(this._resizing){
				this._updateResizerPosition(e);
			}
		},

		_mouseout: function(e){
			if(!this._resizing){
				this._readyToResize = 0;	//0 as false
				removeClass(win.body(), 'gridxColumnResizing');
			}
		},
		
		_keydown: function(evt){
			//support keyboard to resize a column
			if((evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW) && evt.ctrlKey && evt.shiftKey){
				var colId = evt.columnId,
					g = this.grid,
					dir = g.isLeftToRight() ? 1 : -1,
					step = dir * 2;
				query('[colid="' + colId + '"]', g.header.domNode).forEach(function(cell){
					var width = domStyle.get(cell, 'width');
					if(evt.keyCode == keys.LEFT_ARROW){width -= step;}
					else {width += step;}
					this.setWidth(colId, width);
					event.stop(evt);
				}, this);
			}
		},
		
		_updateResizerPosition: function(e){
			var t = this,
				delta = e.pageX - t._startX,
				cell = t._targetCell,
				g = t.grid,
				hs = g.hScroller,
				h = 0,
				n,
				left = e.pageX - t._gridX,
				minWidth = t.arg('minWidth'),
				ltr = this.grid.isLeftToRight();
			if(!ltr){
				delta = -delta;
			}
			if(cell.offsetWidth + delta < minWidth){
				if(ltr){
					left = t._startX - t._gridX - cell.offsetWidth + minWidth;
				}else{
					left = t._startX - t._gridX + (cell.offsetWidth - minWidth);
				}
			}
			n = hs && hs.container.offsetHeight ? hs.container : g.bodyNode;
			h = n.parentNode.offsetTop + n.offsetHeight - g.header.domNode.offsetTop;
			domStyle.set(t._resizer, {
				top: g.header.domNode.offsetTop + 'px',
				left: left + 'px',
				height: h + 'px'
			});
		},

		_showResizer: function(e){
			var t = this;
			if(!t._resizer){
				t._resizer = domConstruct.create('div', {
					className: 'gridxColumnResizer'}, 
					t.grid.domNode, 'last');
				t.connect(t._resizer, 'mouseup', '_mouseup');
			}
			t._resizer.style.display = 'block';
			t._updateResizerPosition(e);
		},

		_hideResizer: function(){
			this._resizer.style.display = 'none';
		},

		_mousedown: function(e){
			//begin resize
			var t = this;
			if(!t._readyToResize){
				t._ismousedown = 1;	//1 as true
				return;
			}
			dom.setSelectable(t.grid.domNode, false);
			win.doc.onselectstart = function(){
				return false;
			};
			t._resizing = 1;	//1 as true
			t._startX = e.pageX;
			t._gridX = domGeometry.position(t.grid.domNode).x;
			t._showResizer(e);
		},

		_mouseup: function(e){
			//end resize
			var t = this;
			t._ismousedown = 0;	//0 as false
			if(t._resizing){
				t._resizing = 0;	//0 as false
				t._readyToResize = 0;	//0 as false
				removeClass(win.body(), 'gridxColumnResizing');
				dom.setSelectable(t.grid.domNode, true);
				win.doc.onselectstart = null;
				
				var cell = t._targetCell,
					delta = e.pageX - t._startX;
				if(!t.grid.isLeftToRight()){
					delta = -delta;
				}
				var	w = (sniff('webkit') ? cell.offsetWidth : domStyle.get(cell, 'width')) + delta,
					minWidth = t.arg('minWidth');
				if(w < minWidth){
					w = minWidth;
				}
				t.setWidth(cell.getAttribute('colid'), w);
				t._hideResizer();
				
			}
		},
		
		_isInResizeRange: function(e){
			var t = this,
				cell = getCell(e),
				x = t._getCellX(e),
				detectWidth = t.arg('detectWidth'),
				ltr = t.grid.isLeftToRight();
			if(x < detectWidth){
				//If !t._targetCell, the first cell is not able to be resize
				if(ltr){
					return !!(t._targetCell = cell.previousSibling);
				}else{
					t._targetCell = cell;
					return 1;
				}
			}else if(x > cell.offsetWidth - detectWidth && x <= cell.offsetWidth){
				if(ltr){
					t._targetCell = cell;
					return 1;	//1 as true
				}else{
					return !!(t._targetCell = cell.previousSibling);
				}
			}
			return 0;	//0 as false
		},

		_getCellX: function(e){
			var target = e.target,
				cell = getCell(e);
			if(!cell){
				return 100000;
			}
			
			if(/table/i.test(target.tagName)){
				return 0;
			}
			var lx = e.offsetX;
			if(lx == undefined){
				lx = e.layerX;
			}
			if(!/th/i.test(target.tagName)){
				lx += target.offsetLeft;
			}
			//Firefox seems have problem to get offsetX for TH
			if(sniff('ff') && /th/i.test(target.tagName)){
				var ltr = this.grid.isLeftToRight();
				var scrollLeft = -parseInt(domStyle.get(cell.parentNode.parentNode.parentNode, ltr ? 'marginLeft' : 'marginRight'));
				if(!ltr){
					scrollLeft = this.grid.header.domNode.firstChild.scrollWidth - scrollLeft - this.grid.header.innerNode.offsetWidth;
				}
				var d = lx - (cell.offsetLeft - scrollLeft);
				if(d >= 0){
					lx = d;
				}
				if(lx >= cell.offsetWidth)lx = 0;
			}
			return lx;
		}
	});
});

},
'dojo/dnd/autoscroll':function(){
define("dojo/dnd/autoscroll", ["../_base/lang", "../sniff", "../_base/window", "../dom-geometry", "../dom-style", "../window"],
	function(lang, has, win, domGeom, domStyle, winUtils){

// module:
//		dojo/dnd/autoscroll

var exports = {
	// summary:
	//		Used by dojo/dnd/Manager to scroll document or internal node when the user
	//		drags near the edge of the viewport or a scrollable node
};
lang.setObject("dojo.dnd.autoscroll", exports);

exports.getViewport = winUtils.getBox;

exports.V_TRIGGER_AUTOSCROLL = 32;
exports.H_TRIGGER_AUTOSCROLL = 32;

exports.V_AUTOSCROLL_VALUE = 16;
exports.H_AUTOSCROLL_VALUE = 16;

// These are set by autoScrollStart().
// Set to default values in case autoScrollStart() isn't called. (back-compat, remove for 2.0)
var viewport,
	doc = win.doc,
	maxScrollTop = Infinity,
	maxScrollLeft = Infinity;

exports.autoScrollStart = function(d){
	// summary:
	//		Called at the start of a drag.
	// d: Document
	//		The document of the node being dragged.

	doc = d;
	viewport = winUtils.getBox(doc);

	// Save height/width of document at start of drag, before it gets distorted by a user dragging an avatar past
	// the document's edge
	var html = win.body(doc).parentNode;
	maxScrollTop = Math.max(html.scrollHeight - viewport.h, 0);
	maxScrollLeft = Math.max(html.scrollWidth - viewport.w, 0);	// usually 0
};

exports.autoScroll = function(e){
	// summary:
	//		a handler for mousemove and touchmove events, which scrolls the window, if
	//		necessary
	// e: Event
	//		mousemove/touchmove event

	// FIXME: needs more docs!
	var v = viewport || winUtils.getBox(doc), // getBox() call for back-compat, in case autoScrollStart() wasn't called
		html = win.body(doc).parentNode,
		dx = 0, dy = 0;
	if(e.clientX < exports.H_TRIGGER_AUTOSCROLL){
		dx = -exports.H_AUTOSCROLL_VALUE;
	}else if(e.clientX > v.w - exports.H_TRIGGER_AUTOSCROLL){
		dx = Math.min(exports.H_AUTOSCROLL_VALUE, maxScrollLeft - html.scrollLeft);	// don't scroll past edge of doc
	}
	if(e.clientY < exports.V_TRIGGER_AUTOSCROLL){
		dy = -exports.V_AUTOSCROLL_VALUE;
	}else if(e.clientY > v.h - exports.V_TRIGGER_AUTOSCROLL){
		dy = Math.min(exports.V_AUTOSCROLL_VALUE, maxScrollTop - html.scrollTop);	// don't scroll past edge of doc
	}
	window.scrollBy(dx, dy);
};

exports._validNodes = {"div": 1, "p": 1, "td": 1};
exports._validOverflow = {"auto": 1, "scroll": 1};

exports.autoScrollNodes = function(e){
	// summary:
	//		a handler for mousemove and touchmove events, which scrolls the first available
	//		Dom element, it falls back to exports.autoScroll()
	// e: Event
	//		mousemove/touchmove event

	// FIXME: needs more docs!

	var b, t, w, h, rx, ry, dx = 0, dy = 0, oldLeft, oldTop;

	for(var n = e.target; n;){
		if(n.nodeType == 1 && (n.tagName.toLowerCase() in exports._validNodes)){
			var s = domStyle.getComputedStyle(n),
				overflow = (s.overflow.toLowerCase() in exports._validOverflow),
				overflowX = (s.overflowX.toLowerCase() in exports._validOverflow),
				overflowY = (s.overflowY.toLowerCase() in exports._validOverflow);
			if(overflow || overflowX || overflowY){
				b = domGeom.getContentBox(n, s);
				t = domGeom.position(n, true);
			}
			// overflow-x
			if(overflow || overflowX){
				w = Math.min(exports.H_TRIGGER_AUTOSCROLL, b.w / 2);
				rx = e.pageX - t.x;
				if(has("webkit") || has("opera")){
					// FIXME: this code should not be here, it should be taken into account
					// either by the event fixing code, or the domGeom.position()
					// FIXME: this code doesn't work on Opera 9.5 Beta
					rx += win.body().scrollLeft;
				}
				dx = 0;
				if(rx > 0 && rx < b.w){
					if(rx < w){
						dx = -w;
					}else if(rx > b.w - w){
						dx = w;
					}
					oldLeft = n.scrollLeft;
					n.scrollLeft = n.scrollLeft + dx;
				}
			}
			// overflow-y
			if(overflow || overflowY){
				//console.log(b.l, b.t, t.x, t.y, n.scrollLeft, n.scrollTop);
				h = Math.min(exports.V_TRIGGER_AUTOSCROLL, b.h / 2);
				ry = e.pageY - t.y;
				if(has("webkit") || has("opera")){
					// FIXME: this code should not be here, it should be taken into account
					// either by the event fixing code, or the domGeom.position()
					// FIXME: this code doesn't work on Opera 9.5 Beta
					ry += win.body().scrollTop;
				}
				dy = 0;
				if(ry > 0 && ry < b.h){
					if(ry < h){
						dy = -h;
					}else if(ry > b.h - h){
						dy = h;
					}
					oldTop = n.scrollTop;
					n.scrollTop  = n.scrollTop  + dy;
				}
			}
			if(dx || dy){ return; }
		}
		try{
			n = n.parentNode;
		}catch(x){
			n = null;
		}
	}
	exports.autoScroll(e);
};

return exports;

});

},
'gridx/modules/dnd/_Base':function(){
define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"../../core/_Module",
	"./Avatar",
	"./_Dnd"
], function(declare, array, lang, _Module, Avatar){

	return declare(_Module, {

		// delay: Number
		//		The time delay before starting dnd after mouse down.
		delay: 2,
	
		// enabled: Boolean
		//		Whether this module is enabled.
		enabled: true,

		// canRearrange: Boolean
		//		Whether rearrange within grid using dnd iw allowed.
		canRearrange: true,

		// copyWhenDragOut: Boolean|Object
		//		When dragging out, whehter to delete in this grid.
		copyWhenDragOut: false,

		// avatar: Function
		//		The avatar used during dnd.
		avatar: Avatar,

		preload: function(args){
			var dnd = this.grid.dnd._dnd;
			dnd.register(this.name, this);
			dnd.avatar = this.arg('avatar');
		},

		checkArg: function(name, arr){
			var arg = this.arg(name);
			return (arg && lang.isObject(arg)) ? array.some(arr, function(v){
				return arg[v];
			}) : arg;
		}
	});
});

},
'gridx/modules/dnd/_Dnd':function(){
define("gridx/modules/dnd/_Dnd", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/dom",
	"dojo/_base/window",
	"dojo/_base/sniff",
	"dojo/dnd/Source",
	"dojo/dnd/Manager",
	"../../core/_Module",
	"../AutoScroll"
], function(declare, lang, Deferred, domConstruct, domGeometry, domClass, domStyle, dom, win, sniff,
	Source, DndManager, _Module){

	var hitch = lang.hitch;

	return _Module.register(
	declare(_Module, {
		name: '_dnd',

		constructor: function(){
			var t = this,
				g = t.grid,
				doc = win.doc;
			t.accept = [];
			t._profiles = {};
			t._selectStatus = {};
			t._node = domConstruct.create('div');
			t.batchConnect(
				[g, 'onCellMouseOver', '_checkDndReady'],
				[g, 'onCellMouseOut', '_dismissDndReady'],
				[g, 'onCellMouseDown', '_beginDnd'],
				[doc, 'onmouseup', '_endDnd'],
				[doc, 'onmousemove', '_onMouseMove']
			);
			t.subscribe("/dnd/cancel", '_endDnd');
		},

		load: function(args){
			var t = this,
				n = t.grid.mainNode;
			t._source = new Source(n, {
				isSource: false,
				accept: t.accept,
				getSelectedNodes: function(){return [0];},
				getItem: hitch(t, '_getItem'),
				checkAcceptance: hitch(t, '_checkAcceptance'),
				onDraggingOver: hitch(t, '_onDraggingOver'),
				onDraggingOut: hitch(t, '_onDraggingOut'),
				onDropExternal: hitch(t, '_onDropExternal'),
				onDropInternal: hitch(t, '_onDropInternal')
			});
			if(sniff('ff')){
				t._fixFF(t._source, n);
			}
			t._source.grid = t.grid;
			t._saveSelectStatus();
			t.loaded.callback();
		},
		
		destroy: function(){
			this.inherited(arguments);
			this._source.destroy();
			domConstruct.destroy(this._node);
		},
	
		getAPIPath: function(){
			return {
				dnd: {
					_dnd: this
				}
			};
		},

		//Public----------------------------------------------------------------------
		profile: null,

		register: function(name, profile){
			this._profiles[name] = profile;
			[].push.apply(this.accept, profile.arg('accept'));
		},
		
		//Private-----------------------------------------------------------------
		_fixFF: function(source){
			return this.connect(win.doc, 'onmousemove', function(evt){
				var pos = domGeometry.position(source.node),
					x = evt.clientX,
					y = evt.clientY,
					alreadyIn = source._alreadyIn,
					isIn = y >= pos.y && y <= pos.y + pos.h && x >= pos.x && x <= pos.x + pos.w;
				if(!alreadyIn && isIn){
					source._alreadyIn = 1;	//1 as true
					source.onOverEvent();
				}else if(alreadyIn && !isIn){
					source._alreadyIn = 0;	//0 as false
					source.onOutEvent();
				}
			});
		},

		_onMouseMove: function(evt){
			var t = this;
			if(t._alreadyIn && (t._dnding || t._extDnding)){
				t._markTargetAnchor(evt);
			}
		},

		_saveSelectStatus: function(enabled){
			var name, selector, selectors = this.grid.select;
			if(selectors){
				for(name in selectors){
					selector = selectors[name];
					if(selector && lang.isObject(selector)){
						this._selectStatus[name] = selector.arg('enabled');
						if(enabled !== undefined){
							selector.enabled = enabled;
						}
					}
				}
			}
		},

		_loadSelectStatus: function(){
			var name, selector, selectors = this.grid.select;
			if(selectors){
				for(name in selectors){
					selector = selectors[name];
					if(selector && lang.isObject(selector)){
						selector.enabled = this._selectStatus[name];
					}
				}
			}
		},

		_checkDndReady: function(evt){
			var t = this, name, p;
			if(!t._dndReady && !t._dnding && !t._extDnding){
				for(name in t._profiles){
					p = t._profiles[name];
					if(p.arg('enabled') && p._checkDndReady(evt)){
						t.profile = p;
						t._saveSelectStatus(false);
						domClass.add(win.body(), 'gridxDnDReadyCursor');
						t._dndReady = 1;
						return;
					}
				}
			}
		},
		
		_dismissDndReady: function(){
			if(this._dndReady){
				this._loadSelectStatus();
				this._dndReady = 0;	//0 as false
				domClass.remove(win.body(), 'gridxDnDReadyCursor');
			}
		},

		_beginDnd: function(evt){
			var t = this;
			t._checkDndReady(evt);
			if(t._dndReady){
				var p = t.profile,
					m = DndManager.manager();
				t._source.isSource = true;
				t._source.canNotDragOut = !p.arg('provide').length;
				t._node.innerHTML = p._buildDndNodes();
				t._oldStartDrag = m.startDrag;
				m.startDrag = hitch(t, '_startDrag', evt);
				
				if(t.avatar){
					t._oldMakeAvatar = m.makeAvatar;
					m.makeAvatar = function(){
						return new t.avatar(m);
					};
				}
				m._dndInfo = {
					cssName: p._cssName,
					count: p._getDndCount()
				};
				p._onBeginDnd(t._source);
				dom.setSelectable(t.grid.domNode, false);	
			}
		},

		_endDnd: function(){
			var t = this,
				m = DndManager.manager();
			t._source.isSource = false;
			t._alreadyIn = 0;	//0 as false
			delete m._dndInfo;
			if(t._oldStartDrag){
				m.startDrag = t._oldStartDrag;
				delete t._oldStartDrag;
			}
			if(t._oldMakeAvatar){
				m.makeAvatar = t._oldMakeAvatar;
				delete t._oldMakeAvatar;
			}
			if(t._dndReady || t._dnding || t._extDnding){
				t._dnding = t._extDnding = 0;	//0 as false
				t._destroyUI();
				dom.setSelectable(t.grid.domNode, true);
				domClass.remove(win.body(), 'gridxDnDReadyCursor');
				t.profile._onEndDnd();
				t._loadSelectStatus();
			}
		},
		
		_createUI: function(){
			domClass.add(win.body(), 'gridxDnDCursor');
			if(this.grid.autoScroll){
				this.profile._onBeginAutoScroll();
				this.grid.autoScroll.enabled = true;
			}
		},

		_destroyUI: function(){
			var t = this;
			t._unmarkTargetAnchor();
			domClass.remove(win.body(), 'gridxDnDCursor');
			if(t.grid.autoScroll){
				t.profile._onEndAutoScroll();
				t.grid.autoScroll.enabled = false;
			}
		},

		_createTargetAnchor: function(){
			return domConstruct.create("div", {
				"class": "gridxDnDAnchor"
			});
		},

		_markTargetAnchor: function(evt){
			var t = this;
			if(t._extDnding || t.profile.arg('canRearrange')){
				var targetAnchor = t._targetAnchor,
					containerPos = domGeometry.position(t.grid.mainNode);
				if(!targetAnchor){
					targetAnchor = t._targetAnchor = t._createTargetAnchor();
					targetAnchor.style.display = "none";
					t.grid.mainNode.appendChild(targetAnchor);
				}
				domClass.add(targetAnchor, 'gridxDnDAnchor' + t.profile._cssName);
				var pos = t.profile._calcTargetAnchorPos(evt, containerPos);
				if(pos){
					domStyle.set(targetAnchor, pos);
					targetAnchor.style.display = "block";
				}else{
					targetAnchor.style.display = "none";
				}
			}
		},

		_unmarkTargetAnchor: function(){
			var targetAnchor = this._targetAnchor;
			if(targetAnchor){
				targetAnchor.style.display = "none";
				domClass.remove(targetAnchor, 'gridxDnDAnchor' + this.profile._cssName);
			}
		},

		//---------------------------------------------------------------------------------
		_startDrag: function(evt, source, nodes, copy){
			var t = this;
			if(t._dndReady && source === t._source){
				t._oldStartDrag.call(DndManager.manager(), source, t._node.childNodes, copy);
				t._dndReady = 0;	//0 as false
				t._dnding = t._alreadyIn = 1;	//1 as true
				t._createUI();
				t._markTargetAnchor(evt);
			}
		},

		_getItem: function(id){
			return {
				type: this.profile.arg('provide'),
				data: this.profile._getItemData(id)
			};
		},

		_checkAcceptance: function(source, nodes){
			var t = this,
				getHash = function(arr){
					var res = {};
					for(var i = arr.length - 1; i >= 0; --i){
						res[arr[i]] = 1;
					}
					return res;
				},
				checkAcceptance = Source.prototype.checkAcceptance,
				res = checkAcceptance.apply(t._source, arguments);
			if(res){
				if(source.grid === t.grid){
					return t.profile.arg('canRearrange');
				}
				if(!source.canNotDragOut){
					for(var name in t._profiles){
						var p = t._profiles[name];
						var accepted = checkAcceptance.apply({
							accept: getHash(p.arg('accept'))
						}, arguments);
						if(p.arg('enabled') && accepted &&
							(!p.checkAcceptance || p.checkAcceptance.apply(p, arguments))){
							t.profile = p;
							t._extDnding = 1;	//1 as true
							return true;
						}
					}
				}
			}
			return false;
		},

		_onDraggingOver: function(){
			var t = this;
			if(t._dnding || t._extDnding){
				t._alreadyIn = 1;	//1 as true
				t._createUI();
			}
		},

		_onDraggingOut: function(){
			var t = this;
			if(t._dnding || t._extDnding){
				t._alreadyIn = 0;	//0 as false
				t._destroyUI();
			}
		},

		_onDropInternal: function(nodes, copy){
			this.profile._onDropInternal(nodes, copy);
		},
		
		_onDropExternal: function(source, nodes, copy){
			var t = this, dropped = t.profile._onDropExternal(source, nodes, copy);
			Deferred.when(dropped, function(){
				if(!copy){
					if(source.grid){
						source.grid.dnd._dnd.profile.onDraggedOut(t._source);
					}else{
						source.deleteSelectedNodes();
					}
				}
			});
		}
	}));
});

},
'gridx/modules/Body':function(){
define("gridx/modules/Body", [
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/json",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/keys",
	"../core/_Module",
	"../core/util",
	"dojo/i18n!../nls/Body"
], function(declare, query, array, lang, json, domConstruct, domClass, Deferred, sniff, keys, _Module, util, nls){

	/*=====
	gridx._RowCellInfo = function(){
		// summary:
		//		This structure includes all possible information that can be used to identify a row or a cell, it is used
		//		to retrieve a row or a cell in grid body.
		//		Usually user only need to provide some of them that is sufficient to uniquely identify a row or a cell,
		//		e.g. rowId, or rowIndex and parentId, or visualIndex.
		// rowId: String|Number
		//		The ID of a row.
		// rowIndex: Integer
		//		The index of a row. It is the index below the parent of this row. The parent of root rows is an imaginary row
		//		with id "" (empty string).
		// visualIndex: Integer
		//		The visual index of a row. It represents the visual position of this row in the current body view.
		//		If there are no pagination, no filtering, no tree structure data, this value is equal to the row index.
		// colId: String|Number
		//		The ID of a column (should not be false values)
		// colIndex: Integer
		//		The index of a column.
		this.rowId = '';
		this.rowIndex = 0;
		this.visualIndex = 0;
		this.parentId = '';
		this.colId = 1;
		this.colIndex = 0;
	};
	=====*/

	return declare(/*===== "gridx.modules.Body", =====*/_Module, {
		// summary:
		//		The body UI of grid.
		// description:
		//		This module is in charge of row rendering. It should be compatible with virtual/non-virtual scroll, 
		//		pagination, details on demand, and even tree structure.

		name: "body",

		optional: ['tree'],

		getAPIPath: function(){
			// tags:
			//		protected extended
			return {
				body: this
			};
		},

		constructor: function(){
			var t = this,
				m = t.model,
				g = t.grid,
				dn = t.domNode = g.bodyNode,
				refresh = function(){ t.refresh(); };
			if(t.arg('rowHoverEffect')){
				domClass.add(dn, 'gridxBodyRowHoverEffect');
			}
			g.emptyNode.innerHTML = t.arg('loadingInfo', nls.loadingInfo);
			g._connectEvents(dn, '_onMouseEvent', t);
			t.aspect(m, 'onDelete', '_onDelete');
			t.aspect(m, 'onSet', '_onSet');
			t.aspect(g, 'onRowMouseOver', '_onRowMouseOver');
			t.aspect(g, 'onCellMouseOver', '_onCellMouseOver');
			t.aspect(g, 'onCellMouseOut', '_onCellMouseOver');
			t.connect(g.bodyNode, 'onmouseleave', function(){
				query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
			});
			t.connect(g.bodyNode, 'onmouseover', function(e){
				if(e.target == g.bodyNode){
					query('> .gridxRowOver', t.domNode).removeClass('gridxRowOver');
				}
			});
			t.aspect(g, 'setStore', refresh);
		},

		preload: function(){
			// tags:
			//		protected extended
			this._initFocus();
		},

		load: function(args){
			// tags:
			//		protected extended
			var t = this,
				m = t.model,
				g = t.grid,
				finish = function(){
					t.aspect(m, 'onSizeChange', '_onSizeChange');
					t.loaded.callback();
				};
			//Load the store size
			m.when({}, function(){
				t.rootCount = t.rootCount || m.size();
				t.visualCount = g.tree ? g.tree.getVisualSize(t.rootStart, t.rootCount) : t.rootCount;
				finish();
			}).then(null, function(e){
				t._loadFail(e);
				finish();
			});
		},

		destroy: function(){
			// tags:
			//		protected extended
			this.inherited(arguments);
			this.domNode.innerHTML = '';
		},
	
		rowMixin: {
			node: function(){
				// summary:
				//		Get the dom node of this row.
				// return:
				//		DOMNode|null
				return this.grid.body.getRowNode({
					rowId: this.id
				});
			},

			visualIndex: function(){
				// summary:
				//		Get the visual index of this row.
				var t = this,
					id = t.id;
				return t.grid.body.getRowInfo({
					rowId: id,
					rowIndex: t.index(),
					parentId: t.model.parentId(id)
				}).visualIndex;
			}
		},

		cellMixin: {
			node: function(){
				// summary:
				//		Get the dom node of this cell.
				// return:
				//		DOMNode|null
				return this.grid.body.getCellNode({
					rowId: this.row.id,
					colId: this.column.id
				});
			}
		},

		//Public-----------------------------------------------------------------------------

		// rowHoverEffect: Boolean
		//		Whether to show a visual effect when mouse hovering a row.
		rowHoverEffect: true,

		// stuffEmptyCell: Boolean
		//		Whether to stuff a cell with &nbsp; if it is empty.
		stuffEmptyCell: true,

		// renderWholeRowOnSet: Boolean
		//		If true, the whole row will be re-rendered even if only one field has changed.
		//		Default to false, so that only one cell will be re-rendered editing that cell.
		renderWholeRowOnSet: false,

		// compareOnSet: Function
		//		When data is changed in store, compare the old data and the new data of grid, return true if
		//		they are the same, false if not, so that the body can decide whether to refresh the corresponding cell.
		compareOnSet: function(v1, v2){
			return typeof v1 == 'object' && typeof v2 == 'object' ? 
				json.stringify(v1) == json.stringify(v2) : 
				v1 === v2;
		},

		getRowNode: function(args){
			// summary:
			//		Get the DOM node of a row
			// args: gridx.__RowCellInfo
			//		A row info object containing row index or row id
			// returns:
			//		The DOM node of the row. Null if not found.
			if(this.model.isId(args.rowId) && sniff('ie')){
				return this._getRowNode(args.rowId);
			}else{
				var rowQuery = this._getRowNodeQuery(args);
				return rowQuery && query('> ' + rowQuery, this.domNode)[0] || null;	//DOMNode|null
			}
		},

		_getRowNode: function(id){
			//TODO: this should be resolved in dojo.query!
			//In IE, some special ids (with special charactors in it, e.g. "+") can not be queried out.
			for(var i = 0, rows = this.domNode.childNodes, row; row = rows[i]; ++i){
				if(row.getAttribute('rowid') == id){
					return row;
				}
			}
			return null;
		},

		getCellNode: function(args){
			// summary:
			//		Get the DOM node of a cell
			// args: gridx.__RowCellInfo
			//		A cell info object containing sufficient info
			// returns:
			//		The DOM node of the cell. Null if not found.
			var t = this,
				colId = args.colId,
				cols = t.grid._columns,
				r = t._getRowNodeQuery(args);
			if(r){
				if(!colId && cols[args.colIndex]){
					colId = cols[args.colIndex].id;
				}
				var c = " [colid='" + colId + "'].gridxCell";
				if(t.model.isId(args.rowId) && sniff('ie')){
					var rowNode = t._getRowNode(args.rowId);
					return query(c, rowNode)[0] || null;	//DOMNode|null
				}else{
					return query(r + c, t.domNode)[0] || null;	//DOMNode|null
				}
			}
			return null;	//null
		},

		getRowInfo: function(args){
			// summary:
			//		Get complete row info by partial row info
			// args: gridx.__RowCellInfo
			//		A row info object containing partial row info
			// returns:
			//		A row info object containing as complete as possible row info.
			var t = this,
				m = t.model,
				g = t.grid,
				id = args.rowId;
			if(m.isId(id)){
				args.rowIndex = m.idToIndex(id);
				args.parentId = m.parentId(id);
			}
			if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
				args.visualIndex = g.tree ? 
					g.tree.getVisualIndexByRowInfo(args.parentId, args.rowIndex, t.rootStart) : 
					args.rowIndex - t.rootStart;
			}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
				if(g.tree){
					var info = g.tree.getRowInfoByVisualIndex(args.visualIndex, t.rootStart);
					args.rowIndex = info.start;
					args.parentId = info.parentId;
				}else{
					args.rowIndex = t.rootStart + args.visualIndex;
				} 
			}else{
				return args;	//gridx.__RowCellInfo
			}
			args.rowId = m.isId(id) ? id : m.indexToId(args.rowIndex, args.parentId);
			return args;	//gridx.__RowCellInfo
		},
	
		refresh: function(start){
			// summary:
			//		Refresh the grid body
			// start: Integer?
			//		The visual row index to start refresh. If omitted, default to 0.
			// returns:
			//		A deferred object indicating when the refreshing process is finished.
			var t = this;
			delete t._err;
			//Call when to make sure all pending commands are executed
			return t.model.when({}).then(function(){	//dojo.Deferred
				var rs = t.renderStart,
					rc = t.renderCount;
				if(typeof start == 'number' && start >= 0){
					start = rs > start ? rs : start;
					var count = rs + rc - start,
						n = query('> [visualindex="' + start + '"]', t.domNode)[0],
						uncachedRows = [],
						renderedRows = [];
					if(n){
						var rows = t._buildRows(start, count, uncachedRows, renderedRows);
						if(rows){
							domConstruct.place(rows, n, 'before');
						}
					}
					while(n){
						var tmp = n.nextSibling,
							vidx = parseInt(n.getAttribute('visualindex'), 10),
							id = n.getAttribute('rowid');
						domConstruct.destroy(n);
						if(vidx >= start + count){
							t.onUnrender(id);
						}
						n = tmp;
					}
					array.forEach(renderedRows, t.onAfterRow, t);
					Deferred.when(t._buildUncachedRows(uncachedRows), function(){
						t.onRender(start, count);
						t.onForcedScroll();
					});
				}else{
					t.renderRows(rs, rc, 0, 1);
					t.onForcedScroll();
				}
			}, function(e){
				t._loadFail(e);
			});
		},
	
		refreshCell: function(rowVisualIndex, columnIndex){
			// summary:
			//		Refresh a single cell
			// rowVisualIndex: Integer
			//		The visual index of the row of this cell
			// columnIndex: Integer
			//		The index of the column of this cell
			// returns:
			//		A deferred object indicating when this refreshing process is finished.
			var d = new Deferred(),
				t = this,
				m = t.model,
				g = t.grid,
				col = g._columns[columnIndex],
				cellNode = col && t.getCellNode({
					visualIndex: rowVisualIndex,
					colId: col.id
				});
			if(cellNode){
				var rowCache,
					rowInfo = t.getRowInfo({visualIndex: rowVisualIndex}),
					idx = rowInfo.rowIndex, pid = rowInfo.parentId;
				m.when({
					start: idx,
					count: 1,
					parentId: pid
				}, function(){
					rowCache = m.byIndex(idx, pid);
					if(rowCache){
						rowInfo.rowId = m.indexToId(idx, pid);
						var isPadding = g.tree && rowCache.data[col.id] === undefined;
						var cell = g.cell(rowInfo.rowId, col.id, 1);
						cellNode.innerHTML = t._buildCellContent(cell, isPadding);
						t.onAfterCell(cell);
					}
				}).then(function(){
					d.callback(!!rowCache);
				});
				return d;	//dojo.Deferred
			}
			d.callback(false);
			return d;	//dojo.Deferred
		},
		
		//Package--------------------------------------------------------------------------------
		
		// rootStart: [readonly] Integer
		//		The row index of the first root row that logically exists in the current body
		rootStart: 0,

		// rootCount: [readonly] Integer
		//		The count of root rows that logically exist in thi current body
		rootCount: 0,
	
		// renderStart: [readonly] Integer
		//		The visual row index of the first renderred row in the current body
		renderStart: 0,
		// renderCount: [readonly] Integer
		//		The count of renderred rows in the current body.
		renderCount: 0,
	
		// visualStart: [readonly] Integer
		//		The visual row index of the first row that is logically visible in the current body.
		//		This should be always zero.
		visualStart: 0, 
		// visualCount: [readonly] Integer
		//		The count of rows that are logically visible in the current body
		visualCount: 0,
	
		// autoUpdate: [read|write] Boolean
		//		Update grid body automatically when onNew/onSet/onDelete is fired
		autoUpdate: true,
	
		// autoChangeSize: [read|write] Boolean
		//		Whether to change rootStart and rootCount automatically when store size is changed.
		//		This need to be turned off when pagination is used.
		autoChangeSize: true,

		updateRootRange: function(start, count){
			// tags:
			//		private package
			var t = this, tree = t.grid.tree,
				vc = t.visualCount = tree ? tree.getVisualSize(start, count) : count;
			t.rootStart = start;
			t.rootCount = count;
			if(t.renderStart + t.renderCount > vc){
				t.renderStart = vc - t.renderCount;
				if(t.renderStart < 0){
					t.renderStart = 0;
					t.renderCount = vc;
				}
			}
			//If there was nothing shown in the body, should force the scroller to check again.
			if(!t.renderCount && vc){
				t.onForcedScroll();
			}
		},

		renderRows: function(start, count, position/*?top|bottom*/, isRefresh){
			// tags:
			//		private package
			var t = this,
				g = t.grid,
				str = '',
				uncachedRows = [], 
				renderedRows = [],
				n = t.domNode,
				en = g.emptyNode,
				emptyInfo = t.arg('emptyInfo', nls.emptyInfo),
				finalInfo = '';
			if(t._err){
				return;
			}
			if(count > 0){
				en.innerHTML = t.arg('loadingInfo', nls.loadingInfo);
				en.style.zIndex = '';
				if(position != 'top' && position != 'bottom'){
					t.model.free();
				}
				str = t._buildRows(start, count, uncachedRows, renderedRows);
				if(position == 'top'){
					t.renderCount += t.renderStart - start;
					t.renderStart = start;
					domConstruct.place(str, n, 'first');
				}else if(position == 'bottom'){
					t.renderCount = start + count - t.renderStart;
					domConstruct.place(str, n, 'last');
				}else{
					t.renderStart = start;
					t.renderCount = count;
					var scrollTop = isRefresh ? n.scrollTop : 0;
					n.scrollTop = 0;
					if(sniff('ie')){
						//In IE, setting innerHTML will completely destroy the node,
						//But CellWidget still need it.
						while(n.childNodes.length){
							n.removeChild(n.firstChild);
						}
					}
					n.innerHTML = str;
					if(scrollTop){
						n.scrollTop = scrollTop;
					}
					n.scrollLeft = g.hScrollerNode.scrollLeft;
					finalInfo = str ? "" : emptyInfo;
					if(!str){
						en.style.zIndex = 1;
					}
					t.onUnrender();
				}
				array.forEach(renderedRows, t.onAfterRow, t);
				Deferred.when(t._buildUncachedRows(uncachedRows), function(){
					en.innerHTML = finalInfo;
					t.onRender(start, count);
				});
			}else if(!{top: 1, bottom: 1}[position]){
				n.scrollTop = 0;
				if(sniff('ie')){
					//In IE, setting innerHTML will completely destroy the node,
					//But CellWidget still need it.
					while(n.childNodes.length){
						n.removeChild(n.firstChild);
					}
				}
				n.innerHTML = '';
				en.innerHTML = emptyInfo;
				en.style.zIndex = 1;
				t.onUnrender();
				t.onEmpty();
				t.model.free();
			}
		},
	
		unrenderRows: function(count, preOrPost){
			// tags:
			//		private package
			if(count > 0){
				//Just remove the nodes from DOM tree instead of destroying them,
				//in case other logic still needs these nodes.
				var t = this, i = 0, id, bn = t.domNode;
				if(preOrPost == 'post'){
					for(; i < count && bn.lastChild; ++i){
						id = bn.lastChild.getAttribute('rowid');
						t.model.free(id);
						bn.removeChild(bn.lastChild);
						t.onUnrender(id);
					}
				}else{
					var tp = bn.scrollTop;
					for(; i < count && bn.firstChild; ++i){
						id = bn.firstChild.getAttribute('rowid');
						t.model.free(id);
						tp -= bn.firstChild.offsetHeight;
						bn.removeChild(bn.firstChild);
						t.onUnrender(id);
					}
					t.renderStart += i;
					bn.scrollTop = tp > 0 ? tp : 0;
				}
				t.renderCount -= i;
				//Force check cache size
				t.model.when();
			}
		},

		//Events--------------------------------------------------------------------------------

		onAfterRow: function(/* Row */){
			// summary:
			//		Fired when a row is created, data is filled in, and its node is inserted into the dom tree.
			// row: gridx.core.Row
			//		A row object representing this row.
		},

		onAfterCell: function(/* Cell */){
			// summary:
			//		Fired when a cell is updated by cell editor (or store data change), or by cell refreshing.
			//		Note this is not fired when rendering the whole grid. Use onAfterRow in that case.
			// cell: grid.core.Cell
			//		A cell object representing this cell
		},

		onRender: function(/*start, count*/){
			// summary:
			//		Fired everytime the grid body content is rendered or updated.
			// start: Integer
			//		The visual index of the start row that is affected by this rendering. If omitted, all rows are affected.
			// count: Integer
			//		The count of rows that is affected by this rendering. If omitted, all rows from start are affected.
		},

		onUnrender: function(/* id */){
			// summary:
			//		Fired when a row is unrendered (removed from the grid dom tree).
			//		Usually, this event is only useful when using virtual scrolling.
			// id: String|Number
			//		The ID of the row that is unrendered.
		},

		onDelete: function(/*id, index*/){
			// summary:
			//		Fired when a row in current view is deleted from the store.
			//		Note if the deleted row is not visible in current view, this event will not fire.
			// id: String|Number
			//		The ID of the deleted row.
			// index: Integer
			//		The index of the deleted row.
		},

		onSet: function(/* Row */){
			// summary:
			//		Fired when a row in current view is updated in store.
			// row: gridx.core.Row
			//		A row object representing the updated row.
		},

		onMoveToCell: function(){
			// summary:
			//		Fired when the focus is moved to a body cell by keyboard.
		},

		onEmpty: function(){
			// summary:
			//		Fired when there's no rows in current body view.
		},

		onForcedScroll: function(){
			// summary:
			//		Fired when the body needs to fetch more data, but there's no trigger to the scroller.
			//		This is an inner mechanism to solve some problems when using virtual scrolling or pagination.
			//		This event should not be used by grid users.
			// tags:
			//		private package
		},


		collectCellWrapper: function(/* wrappers, rowId, colId */){
			// summary:
			//		Fired when a cell is being rendered, so as to collect wrappers for the content in this cell.
			//		This is currently an inner mechanism used to implement widgets in cell and tree node.
			// tags:
			//		package
			// wrappers: Array
			//		An array of functions with signature function(cellData, rowId, colId) and should return a string to replace
			//		cell data. The connectors of this event should push a new wrapper function in this array.
			//		The functions in this array can also carry a number typed "priority" property.
			//		The wrappers will be executed in ascending order of this "priority" function.
			// rowId: String|Number
			//		The row ID of this cell
			// colId: String|Number
			//		The column ID of this cell.
		},

		//Private---------------------------------------------------------------------------
		_getRowNodeQuery: function(args){
			var r;
			if(this.model.isId(args.rowId)){
				r = "[rowid='" + args.rowId + "']";
			}else if(typeof args.rowIndex == 'number' && args.rowIndex >= 0){
				r = "[rowindex='" + args.rowIndex + "']";
				if(args.parentId){
					r += "[parentid='" + args.parentId + "']";
				}
			}else if(typeof args.visualIndex == 'number' && args.visualIndex >= 0){
				r = "[visualindex='" + args.visualIndex + "']";
			}
			return r && r + '.gridxRow';
		},

		_buildRows: function(start, count, uncachedRows, renderedRows){
			var t = this,
				i,
				end = start + count,
				s = [],
				g = t.grid,
				m = t.model,
				w = t.domNode.scrollWidth;
			for(i = start; i < end; ++i){
				var rowInfo = t.getRowInfo({visualIndex: i}),
					row = g.row(rowInfo.rowId, 1);
				s.push('<div class="gridxRow ', i % 2 ? 'gridxRowOdd' : '',
					'" role="row" visualindex="', i);
				if(row){
					m.keep(row.id);
					s.push('" rowid="', row.id,
						'" rowindex="', rowInfo.rowIndex,
						'" parentid="', rowInfo.parentId,
						'">', t._buildCells(row),
					'</div>');
					renderedRows.push(row);
				}else{
					s.push('"><div class="gridxRowDummy" style="width:', w, 'px;"></div></div>');
					rowInfo.start = rowInfo.rowIndex;
					rowInfo.count = 1;
					uncachedRows.push(rowInfo);
				}
			}
			return s.join('');
		},

		_buildUncachedRows: function(uncachedRows){
			var t = this;
			return uncachedRows.length && t.model.when(uncachedRows, function(){
				try{
					array.forEach(uncachedRows, t._buildRowContent, t);
				}catch(e){
					t._loadFail(e);
				}
			}).then(null, function(e){
				t._loadFail(e);
			});
		},

		_loadFail: function(e){
			console.error(e);
			var en = this.grid.emptyNode;
			en.innerHTML = this.arg('loadFailInfo', nls.loadFailInfo);
			en.style.zIndex = 1;
			this.domNode.innerHTML = '';
			this._err = 1;	//1 as true;
		},
	
		_buildRowContent: function(rowInfo){
			var t = this,
				n = query('> [visualindex="' + rowInfo.visualIndex + '"]', t.domNode)[0];
			if(n){
				var row = t.grid.row(rowInfo.rowIndex, 0, rowInfo.parentId);
				if(row){
					t.model.keep(row.id);
					n.setAttribute('rowid', row.id);
					n.setAttribute('rowindex', rowInfo.rowIndex);
					n.setAttribute('parentid', rowInfo.parentId || '');
					n.innerHTML = t._buildCells(row);
					t.onAfterRow(row);
				}else{
					throw new Error('Row is not in cache:' + rowInfo.rowIndex);
				}
			}
		},
	
		_buildCells: function(row){
			var col, cell, isPadding, cls, style, i, len,
				t = this,
				g = t.grid,
				columns = g._columns,
				rowData = row.data(),
				isFocusArea = g.focus && (g.focus.currentArea() == 'body'),
				sb = ['<table class="gridxRowTable" role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'];
			for(i = 0, len = columns.length; i < len; ++i){
				col = columns[i];
				isPadding = g.tree && rowData[col.id] === undefined;
				cell = g.cell(row.id, col.id, 1);
				cls = (lang.isFunction(col['class']) ? col['class'](cell) : col['class']) || '';
				style = (lang.isFunction(col.style) ? col.style(cell) : col.style) || '';
				sb.push('<td aria-describedby="', (g.id + '-' + col.id).replace(/\s+/, ''), '" class="gridxCell ');
				if(isPadding){
					sb.push('gridxPaddingCell');
				}
				if(isFocusArea && t._focusCellRow === row.visualIndex() && t._focusCellCol === i){
					sb.push('gridxCellFocus');
				}
				sb.push(cls,
					'" aria-readonly="true" role="gridcell" tabindex="-1" colid="', col.id, 
					'" style="width: ', col.width,
					'; ', style,
					'">', t._buildCellContent(cell, isPadding),
				'</td>');
			}
			sb.push('</tr></table>');
			return sb.join('');
		}, 
	
		_buildCellContent: function(cell, isPadding){
			var r = '',
				col = cell.column,
				row = cell.row,
				data = cell.data();
			if(!isPadding){
				var s = col.decorator ? col.decorator(data, row.id, row.visualIndex()) : data;
				r = this._wrapCellData(s, row.id, col.id);
			}
			return (r === '' || r === null || r === undefined) && (sniff('ie') < 8 || this.arg('stuffEmptyCell')) ? '&nbsp;' : r;
		},

		_wrapCellData: function(cellData, rowId, colId){
			var wrappers = [];
			this.collectCellWrapper(wrappers, rowId, colId);
			var i = wrappers.length - 1;
			if(i > 0){
				wrappers.sort(function(a, b){
					a.priority = a.priority || 0;
					b.priority = b.priority || 0;
					return a.priority - b.priority;
				});
			}
			for(; i >= 0; --i){
				cellData = wrappers[i].wrap(cellData, rowId, colId);
			}
			return cellData;
		},
	
		//Events-------------------------------------------------------------
		_onMouseEvent: function(eventName, e){
			var g = this.grid,
				evtCell = 'onCell' + eventName,
				evtRow = 'onRow' + eventName;
			if(g._isConnected(evtCell) || g._isConnected(evtRow)){
				this._decorateEvent(e);
				if(e.rowId){
					if(e.columnId){
						g[evtCell](e);
					}
					g[evtRow](e);
				}
			}
		},
	
		_decorateEvent: function(e){
			var n = e.target || e.originalTarget,
				g = this.grid,
				tag;
			for(; n && n != g.bodyNode; n = n.parentNode){
				tag = n.tagName && n.tagName.toLowerCase();
				if(tag == 'td' && domClass.contains(n, 'gridxCell')){
					var col = g._columnsById[n.getAttribute('colid')];
					e.cellNode = n;
					e.columnId = col.id;
					e.columnIndex = col.index;
				}
				if(tag == 'div' && domClass.contains(n, 'gridxRow')){
					e.rowId = n.getAttribute('rowid');
					e.parentId = n.getAttribute('parentid');
					e.rowIndex = parseInt(n.getAttribute('rowindex'), 10);
					e.visualIndex = parseInt(n.getAttribute('visualindex'), 10);
					return;
				}
			}
		},
	
		//Store Notification-------------------------------------------------------------------
		_onSet: function(id, index, rowCache, oldCache){
			var t = this;
			if(t.autoUpdate && rowCache){
				var g = t.grid,
					row = g.row(id, 1),
					rowNode = row && row.node();
				if(rowNode){
					var curData = rowCache.data,
						oldData = oldCache.data,
						cols = g._columns,
						renderWhole = t.arg('renderWholeRowOnSet'),
						compareOnSet = t.arg('compareOnSet');
					if(renderWhole){
						rowNode.innerHTML = t._buildCells(row);
						t.onAfterRow(row);
						t.onSet(row);
						t.onRender(index, 1);
					}else{
						array.forEach(cols, function(col){
							if(!compareOnSet(curData[col.id], oldData[col.id])){
								var isPadding = g.tree && curData[col.id] === undefined,
									cell = row.cell(col.id, 1);
								cell.node().innerHTML = t._buildCellContent(cell, isPadding);
								t.onAfterCell(cell);
							}
						});
					}
				}
			}
		},


		_onDelete: function(id){
			var t = this;
			if(t.autoUpdate){
				var node = t.getRowNode({rowId: id});
				if(node){
					var sn, count = 0,
						start = parseInt(node.getAttribute('rowindex'), 10),
						pid = node.getAttribute('parentid'),
						pids = {},
						toDelete = [node],
						rid, ids = [id],
						vidx;
					pids[id] = 1;
					for(sn = node.nextSibling; sn && pids[sn.getAttribute('parentid')]; sn = sn.nextSibling){
						rid = sn.getAttribute('rowid');
						ids.push(rid);
						toDelete.push(sn);
						pids[rid] = 1;
					}
					for(; sn; sn = sn.nextSibling){
						if(sn.getAttribute('parentid') == pid){
							sn.setAttribute('rowindex', parseInt(sn.getAttribute('rowindex'), 10) - 1);
						}
						vidx = parseInt(sn.getAttribute('visualindex'), 10) - toDelete.length;
						sn.setAttribute('visualindex', vidx);
						domClass.toggle(sn, 'gridxRowOdd', vidx % 2);
						++count;
					}
					t.renderCount -= toDelete.length;
					array.forEach(toDelete, domConstruct.destroy);
					array.forEach(ids, t.onUnrender, t);
					if(t.autoChangeSize && t.rootStart === 0 && !pid){
						t.updateRootRange(0, t.rootCount - 1);
					}
					t.onDelete(id, start);
					t.onRender(start, count);
				}
			}
		},
	
		_onSizeChange: function(size, oldSize){
			var t = this;
			if(t.autoChangeSize && t.rootStart === 0 && (t.rootCount === oldSize || oldSize < 0)){
				t.updateRootRange(0, size);
				t.refresh();
			}
		},
		
		//-------------------------------------------------------------------------------------
		_onRowMouseOver: function(e){
			var preNode = query('> div.gridxRowOver', this.domNode)[0],
				rowNode = this.getRowNode({rowId: e.rowId});
			if(preNode != rowNode){
				if(preNode){
					domClass.remove(preNode, 'gridxRowOver');
				}
				if(rowNode){
					domClass.add(rowNode, 'gridxRowOver');
				}
			}
		},
		
		_onCellMouseOver: function(e){
			domClass.toggle(e.cellNode, 'gridxCellOver', e.type == 'mouseover');
		},
	
		//Focus------------------------------------------------------------------------------------------
		_focusCellCol: 0,
		_focusCellRow: 0,

		_initFocus: function(){
			var t = this,
				g = t.grid,
				ltr = g.isLeftToRight(),
				bn = g.bodyNode,
				focus = g.focus,
				c = 'connect';
			if(focus){
				focus.registerArea({
					name: 'body',
					priority: 1,
					focusNode: bn,
					scope: t,
					doFocus: t._doFocus,
					doBlur: t._blurCell,
					onFocus: t._onFocus,
					onBlur: t._blurCell
				});
				t[c](g.mainNode, 'onkeypress', function(evt){
					if(focus.currentArea() == 'body' && (!g.tree || !evt.ctrlKey)){
						focus._noBlur = 1;	//1 as true
						var dk = keys, arr = {}, dir = ltr ? 1 : -1;
						arr[dk.LEFT_ARROW] = [0, -dir, evt];
						arr[dk.RIGHT_ARROW] = [0, dir, evt];
						arr[dk.UP_ARROW] = [-1, 0, evt];
						arr[dk.DOWN_ARROW] = [1, 0, evt];
						t._moveFocus.apply(t, arr[evt.keyCode] || []);
						focus._noBlur = 0;	//0 as false
					}
				});
				t[c](g, 'onCellClick', function(evt){
					t._focusCellRow = evt.visualIndex;
					t._focusCellCol = evt.columnIndex;
				});
				t[c](t, 'onRender', function(start, count){
					if(t._focusCellRow >= start &&
						t._focusCellRow < start + count &&
						focus.currentArea() == 'body'){
						t._focusCell();
					}
				});
				t[c](g.emptyNode, 'onfocus', function(){
					focus.focusArea('body');
				});
			}
		},

		_doFocus: function(evt){
			return this._focusCell(evt) || this._focusCell(0, -1, -1);
		},

		_focusCell: function(evt, rowVisIdx, colIdx){
			var t = this,
				g = t.grid;
			g.focus.stopEvent(evt);
			colIdx = colIdx >= 0 ? colIdx : t._focusCellCol;
			rowVisIdx = rowVisIdx >= 0 ? rowVisIdx : t._focusCellRow;
			var colId = g._columns[colIdx].id,
				n = t.getCellNode({
					visualIndex: rowVisIdx,
					colId: colId
				});
			if(n){
				var preNode = query('.gridxCellFocus', t.domNode)[0];
				if(n != preNode){
					if(preNode){
						domClass.remove(preNode, 'gridxCellFocus');
					}
					domClass.add(n, 'gridxCellFocus');
					t._focusCellRow = rowVisIdx;
					t._focusCellCol = colIdx;
					g.header._focusHeaderId = colId;
				}
				g.hScroller.scrollToColumn(colId);
				if(sniff('ie') < 8){
					//In IE7 focus cell node will scroll grid to the left most.
					//So save the scrollLeft first and then set it back.
					//FIXME: this still makes the grid body shake, any better solution?
					var scrollLeft = g.bodyNode.scrollLeft;
					n.focus();
					g.bodyNode.scrollLeft = scrollLeft;
				}else{
					n.focus();
				}
			}else if(!g.rowCount()){
				g.emptyNode.focus();
				return true;
			}
			return n;
		},

		_moveFocus: function(rowStep, colStep, evt){
			if(rowStep || colStep){
				var r, c,
					t = this,
					g = t.grid, 
					cols = g._columns,
					vc = t.visualCount;
				g.focus.stopEvent(evt); //Prevent scrolling the whole page.
				r = t._focusCellRow + rowStep;
				r = r < 0 ? 0 : (r >= vc ? vc - 1 : r);
				c = t._focusCellCol + colStep;
				c = c < 0 ? 0 : (c >= cols.length ? cols.length - 1 : c);
				g.vScroller.scrollToRow(r).then(function(){
					t._focusCell(0, r, c);
					t.onMoveToCell(r, c, evt);
				});
			}
		},

		_nextCell: function(r, c, dir, checker){
			var d = new Deferred(),
				g = this.grid,
				cc = g._columns.length,
				rc = this.visualCount;
			do{
				c += dir;
				if(c < 0 || c >= cc){
					r += dir;
					c = c < 0 ? cc - 1 : 0;
					if(r < 0){
						r = rc - 1;
						c = cc - 1;
					}else if(r >= rc){
						r = 0;
						c = 0;
					}
				}
			}while(!checker(r, c));
			g.vScroller.scrollToRow(r).then(function(){
				d.callback({r: r, c: c});
			});
			return d;
		},

		_blurCell: function(){
			var n = query('.gridxCellFocus', this.domNode)[0];
			if(n){
				domClass.remove(n, 'gridxCellFocus');
			}
			return true;
		},

		_onFocus: function(evt){
			for(var n = evt.target, t = this; n && n != t.domNode; n = n.parentNode){
				if(domClass.contains(n, 'gridxCell')){
					var colIndex = t.grid._columnsById[n.getAttribute('colid')].index;
					while(!domClass.contains(n, 'gridxRow')){
						n = n.parentNode;
					}
					return t._focusCell(0, parseInt(n.getAttribute('visualindex'), 10), colIndex);
				}
			}
			return false;
		}
	});
});

},
'gridx/core/model/Model':function(){
define("gridx/core/model/Model", [
	"require",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"dojo/aspect"
], function(require, declare, array, lang, Deferred, DeferredList, aspect){

	var isArrayLike = lang.isArrayLike,
		isString = lang.isString;

	function isId(it){
		return it || it === 0;
	}

	function isIndex(it){
		return typeof it == 'number' && it >= 0;
	}

	function isRange(it){
		return it && isIndex(it.start);
	}

	function normArgs(self, args){
		var i, rgs = [], ids = [],
		res = {
			range: rgs,
			id: ids 
		},
		f = function(a){
			if(isRange(a)){
				rgs.push(a);
			}else if(isIndex(a)){
				rgs.push({start: a, count: 1});
			}else if(isArrayLike(a)){
				for(i = a.length - 1; i >= 0; --i){
					if(isIndex(a[i])){
						rgs.push({
							start: a[i],
							count: 1
						});
					}else if(isRange(a[i])){
						rgs.push(a[i]);
					}else if(isString(a)){
						ids.push(a[i]);
					}
				}
			}else if(isString(a)){
				ids.push(a);
			}
		};
		if(args && (args.index || args.range || args.id)){
			f(args.index);
			f(args.range);
			if(isArrayLike(args.id)){
				for(i = args.id.length - 1; i >= 0; --i){
					ids.push(args.id[i]);
				}
			}else if(isId(args.id)){
				ids.push(args.id);
			}
		}else{
			f(args);
		}
		if(!rgs.length && !ids.length && self.size() < 0){
			//first time load, try to load a page
			rgs.push({start: 0, count: self._cache.pageSize || 1});
		}
		return res;
	}

	return declare(/*===== "gridx.core.model.Model", =====*/[], {
		// summary:
		//		This class handles all of the data logic in grid.
		// description:
		//		It provides a clean and useful set of APIs to encapsulate complicated data operations, 
		//		even for huge asynchronous (server side) data stores.
		//		It is built upon a simple extension mechanism, allowing new (even user defined) data operaions to be pluged in.
		//		An instance of this class can be regarded as a stand-alone logic grid providing consistent data processing 
		//		functionalities. This class can even be instanticated alone without any grid UI.

		
		constructor: function(args){
			var t = this,
				cacheClass = args.cacheClass;
			cacheClass = typeof cacheClass == 'string' ? require(cacheClass) : cacheClass;
			t.store = args.store;
			t._exts = {};
			t._cmdQueue = [];
			t._model = t._cache = new cacheClass(t, args);
			t._createExts(args.modelExtensions || [], args);
			var m = t._model;
			t._cnnts = [
				aspect.after(m, "onDelete", lang.hitch(t, "onDelete"), 1),
				aspect.after(m, "onNew", lang.hitch(t, "onNew"), 1),
				aspect.after(m, "onSet", lang.hitch(t, "onSet"), 1)
			];
		},
	
		destroy: function(){
			array.forEach(this._cnnts, function(cnnt){
				cnnt.remove();
			});
			for(var n in this._exts){
				this._exts[n].destroy();
			}
		},

		clearCache: function(){
			this._cache.clear();
		},

		isId: isId,

		setStore: function(store){
			this.store = store;
			this._cache.setStore(store);
		},
	
		//Public-------------------------------------------------------------------

		/*=====
		byIndex: function(index, parentId){
			// summary:
			//		Get the row cache by row index.
			// index: Integer
			//		The row index
			// parentId: String?
			//		If parentId is valid, the row index means the child index under this parent.
			// returns:
			//		The row cache
			return null;	//gridx.core.model.__RowCache
		},

		byId: function(id){
			// summary:
			//		Get the row cache by row id
			// id: String
			//		The row ID
			// returns:
			//		The row cache
			return null;	//gridx.core.model.__RowCache
		},

		indexToId: function(index, parentId){
			// summary:
			//		Transform row index to row ID
			// index: Integer
			//		The row index
			// parentId: String?
			//		If parentId is valid, the row index means the child index under this parent.
			// returns:
			//		The row ID
			return '';	//String
		},

		idToIndex: function(id){
			// summary:
			//		Transform row ID to row index
			// id: String
			//		The row ID
			// returns:
			//		The row index
			return -1;	//Integer
		},

		treePath: function(id){
			// summary:
			//		Get tree path of row by row ID
			// id: String
			//		The row ID
			// returns:
			//		An array of parent row IDs, from root to parent.
			//		Root level rows have parent of id ""(empty string).
			return [];	//String[]
		},

		parent: function(id){
			// summary:
			//		Get the parent ID of the given row.
			// id: String
			//		The row ID
			// returns:
			//		The parent ID.
			return [];
		},

		hasChildren: function(id){
			// summary:
			//		Check whether a row has children rows.
			// id: String
			//		The row ID
			// returns:
			//		Whether this row has child rows.
			return false;	//Boolean
		},

		children: function(id){
			// summary:
			//		Get IDs of children rows.
			// id: String
			//		The row ID
			// returns:
			//		An array of row IDs
			return [];	//Array
		},

		size: function(parentId){
			// summary:
			//		Get the count of rows under the given parent. 
			// parentId: String?
			//		The ID of a parent row. No parentId means root rows.
			// returns:
			//		The count of (child) rows
			return -1;	//Integer
		},

		keep: function(id){
			// summary:
			//		Lock up a row cache in memory, avoid clearing it out when cache size is reached.
			// id: String
			//		The row ID
		},

		free: function(id){
			// summary:
			//		Unlock a row cache in memory, so that it could be cleared out when cache size is reached.
			// id: String?
			//		The row ID. If omitted, all kept rows will be freed.
		},
		=====*/

		
		when: function(args, callback, scope){
			// summary:
			//		Call this method to make sure all the pending data operations are executed and
			//		all the needed rows are at client side.
			// description:
			//		This method makes it convenient to do various grid operations without worrying too much about server side
			//		or client side store. This method is the only asynchronous public method in grid model, so that most of
			//		the custom code can be written in synchronous way.
			// args: Object|null?
			//		Indicate what rows are needed by listing row IDs or row indexes.
			//		Acceptable args include: 
			//		1. A single row index.
			//		e.g.: model.when(1, ...)
			//		2. A single row index range object in form of: {start: ..., count: ...}.
			//		If count is omitted, means all remaining rows.
			//		e.g.: model.when({start: 10, count: 100}, ...)
			//		3. An array of row indexes and row index ranges.
			//		e.g.: model.when([0, 1, {start: 10, count: 3}, 100], ...)
			//		4. An object with property "index" set to the array defined in 3.
			//		e.g.: model.when({
			//			index: [0, 1, {start: 10, count: 3}, 100]
			//		}, ...)
			//		5. An object with property "id" set to an array of row IDs.
			//		e.g.: model.when({
			//		id: ['a', 'b', 'c']
			//		}, ...)
			//		6. An object containing both contents defined in 4 and 5.
			//		7. An empty object
			//		The model will fetch the store size. Currently it is implemented by fetching the first page of data.
			//		8. null or call this method without any arguments.
			//		This is useful when we only need to execute pending data operations but don't need to fetch rows.
			// callback: Function?
			//		The callback function is called when all the pending data operations are executed and all
			// returns:
			//		A Deferred object indicating when all this process is finished. Note that in this Deferred object,
			//		The needed rows might not be available since they might be cleared up to reduce memory usage.
			this._oldSize = this.size();
			this._addCmd({
				name: '_cmdRequest',
				scope: this,
				args: arguments,
				async: 1
			});
			return this._exec();	//dojo.Deferred
		},

		scan: function(args, callback){
			// summary:
			//		Go through all the rows in several batches from start to end (or according to given args),
			//		and execute the callback function for every batch of rows.
			// args: Object
			//		An object containing scan arguments
			// callback: Function(rows,startIndex)
			//		The callback function.
			// returns:
			//		If return true in this function, the scan process will end immediately.
			var d = new Deferred,
				start = args.start || 0,
				pageSize = args.pageSize || this._cache.pageSize || 1,
				count = args.count,
				end = count > 0 ? start + count : Infinity,
				scope = args.whenScope || this,
				whenFunc = args.whenFunc || scope.when;
			var f = function(s){
					d.progress(s / (count > 0 ? s + count : scope.size()));
					whenFunc.call(scope, {
						id: [],
						range: [{
							start: s,
							count: pageSize
						}]
					}, function(){
						var i, r, rows = [];
						for(i = s; i < s + pageSize && i < end; ++i){
							r = scope.byIndex(i);
							if(r){
								rows.push(r);
							}else{
								end = -1;
								break;
							}
						}
						if(callback(rows, s) || i == end){
							end = -1;
						}
					}).then(function(){
						if(end == -1){
							d.callback();
						}else{
							f(s + pageSize);
						}
					});
				};
			f(start);
			return d;	//dojo.Deferred
		},

		//Events---------------------------------------------------------------------------------
		onDelete: function(/*id, index*/){
			// summary:
			//		Fired when a row is deleted from store
			// tags:
			//		callback
		},

		onNew: function(/*id, index, row*/){
			// summary:
			//		Fired when a row is added to the store
			// tags:
			//		callback
		},

		onSet: function(/*id, index, row*/){
			// summary:
			//		Fired when a row's data is changed
			// tags:
			//		callback
		},

		onSizeChange: function(/*size, oldSize*/){
			// summary:
			//		Fired when the size of the grid model is changed
			// tags:
			//		callback
		},

		//Package----------------------------------------------------------------------------
		_msg: function(/* msg */){},

		_addCmd: function(args){
			//Add command to the command queue, and combine same kind of commands if possible.
			var cmds = this._cmdQueue,
				cmd = cmds[cmds.length - 1];
			if(cmd && cmd.name == args.name && cmd.scope == args.scope){
				cmd.args.push(args.args || []);
			}else{
				args.args = [args.args || []];
				cmds.push(args);
			}
		},

		//Private----------------------------------------------------------------------------
		_onSizeChange: function(){
			var t = this,
				oldSize = t._oldSize,
				size = t._oldSize = t.size();
			if(oldSize != size){
				t.onSizeChange(size, oldSize);
			}
		},

		_cmdRequest: function(){
			var t = this;
			return new DeferredList(array.map(arguments, function(args){
				var arg = args[0],
					finish = function(){
						t._onSizeChange();
						//TODO: fire events here
						//args[1] is callback, args[2] is scope
						if(args[1]){
							args[1].call(args[2]);
						}
					};
				if(arg === null || !args.length){
					var d = new Deferred;
					finish();
					d.callback();
					return d;
				}
				return t._model._call('when', [normArgs(t, arg), finish]);
			}), 0, 1);
		},

		_exec: function(){
			//Execute commands one by one.
			var t = this,
				c = t._cache,
				d = new Deferred,
				cmds = t._cmdQueue,
				finish = function(d, err){
					t._busy = 0;
					if(c._checkSize){
						c._checkSize();
					}
					if(err){
						d.errback(err);
					}else{
						d.callback();
					}
				},
				func = function(){
					if(array.some(cmds, function(cmd){
						return cmd.name == '_cmdRequest';
					})){
						try{
							while(cmds.length){
								var cmd = cmds.shift(),
									dd = cmd.scope[cmd.name].apply(cmd.scope, cmd.args);
								if(cmd.async){
									Deferred.when(dd, func, lang.partial(finish, d));
									return;
								}
							}
						}catch(e){
							finish(d, e);
							return;
						}
					}
					finish(d);
				};
			if(t._busy){
				return t._busy;
			}
			t._busy = d;
			func();
			return d;
		},

		_createExts: function(exts, args){
			//Ensure the given extensions are valid
			exts = array.filter(exts, function(ext){
				ext = typeof ext == 'string' ? require(ext) : ext;
				return ext && ext.prototype;
			});
			//Sort the extensions by priority
			exts.sort(function(a, b){
				return a.prototype.priority - b.prototype.priority;
			});
			for(var i = 0, len = exts.length; i < len; ++i){
				//Avoid duplicated extensions
				//IMPORTANT: Assume extensions all have different priority values!
				if(i == exts.length - 1 || exts[i] != exts[i + 1]){
					var ext = new exts[i](this, args);
					this._exts[ext.name] = ext;
				}
			}
		}
	});
});

},
'dojo/dnd/common':function(){
define("dojo/dnd/common", ["../_base/connect", "../_base/kernel", "../_base/lang", "../dom"],
	function(connect, kernel, lang, dom){

// module:
//		dojo/dnd/common

var exports = lang.getObject("dojo.dnd", true);
/*=====
// TODO: for 2.0, replace line above with this code.
var exports = {
	// summary:
	//		TODOC
};
=====*/

exports.getCopyKeyState = connect.isCopyKey;

exports._uniqueId = 0;
exports.getUniqueId = function(){
	// summary:
	//		returns a unique string for use with any DOM element
	var id;
	do{
		id = kernel._scopeName + "Unique" + (++exports._uniqueId);
	}while(dom.byId(id));
	return id;
};

exports._empty = {};

exports.isFormElement = function(/*Event*/ e){
	// summary:
	//		returns true if user clicked on a form element
	var t = e.target;
	if(t.nodeType == 3 /*TEXT_NODE*/){
		t = t.parentNode;
	}
	return " button textarea input select option ".indexOf(" " + t.tagName.toLowerCase() + " ") >= 0;	// Boolean
};

return exports;
});

},
'gridx/core/Row':function(){
define("gridx/core/Row", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred"
], function(declare, lang, Deferred){

	
	return declare(/*===== "gridx.core.Row", =====*/[], {
		// summary:
		//		Represents a row of a grid
		// description:
		//		An instance of this class represents a grid row.
		//		This class should not be directly instantiated by users. It should be returned by grid APIs.

		/*=====
		// id: [readonly] String
		//		The ID of this row
		id: null,

		// grid: [readonly] gridx.Grid
		//		Reference to the grid
		grid: null,

		// model: [readonly] grid.core.model.Model
		//		Reference to this grid model
		model: null,
		=====*/

		

		constructor: function(grid, id){
			this.grid = grid;
			this.model = grid.model;
			this.id = id;
		},

		
		index: function(){
			// summary:
			//		Get the index of this row
			// returns:
			//		The row index
			return this.model.idToIndex(this.id);	//Integer
		},

		parent: function(){
			return this.grid.row(this.model.parentId(this.id), 1);	//gridx.core.Row
		},

		
		cell: function(column, isId){
			// summary:
			//		Get a cell object in this row
			// column: gridx.core.Column|Integer|String
			//		Column index or column ID or a column object
			// isId: Boolean?
			//		If the column parameter is a numeric ID, set this to true
			// returns:
			//		If the params are valid return the cell object, else return null.
			return this.grid.cell(this, column, isId);	//gridx.core.Cell|null
		},

		
		cells: function(start, count){
			// summary:
			//		Get cells in this row.
			// start: Integer?
			//		The column index of the first cell in the returned array.
			//		If omitted, defaults to 0, so row.cells() gets all the cells.
			// count: Integer?
			//		The number of cells to return.
			//		If omitted, all the cells starting from column 'start' will be returned.
			// returns:
			//		An array of cells in this row
			var t = this,
				g = t.grid,
				cells = [],
				cols = g._columns,
				total = cols.length,
				i = start || 0,
				end = count >= 0 ? start + count : total;
			for(; i < end && i < total; ++i){
				cells.push(g.cell(t.id, cols[i].id, 1));	//1 as true
			}
			return cells;	//gridx.core.Cell[]
		},

		
		data: function(){
			// summary:
			//		Get the grid data in this row.
			// description:
			//		Grid data means the result of the formatter functions (if exist).
			//		It can be different from store data (a.k.a. raw data).
			// returns:
			//		An associative array using column IDs as keys and grid data as values
			return this.model.byId(this.id).data;	//Object
		},

		
		rawData: function(){
			// summary:
			//		Get the store data in this row.
			// description:
			//		Store data means the data defined in store. It is the data before applying the formatter functions.
			//		It can be different from grid data (a.k.a. formatted data)
			// returns:
			//		An associative array using store fields as keys and store data as values
			return this.model.byId(this.id).rawData;	//Object
		},

		
		item: function(){
			// summary:
			//		Get the store item of this row
			// description:
			//		If using the old dojo.data store, store items usually have complicated structures,
			//		and they are also useful when doing store operations.
			// returns:
			//		A store item
			return this.model.byId(this.id).item;	//Object
		},

		
		setRawData: function(rawData){
			// summary:
			//		Set new raw data of this row into the store
			// rawData: Object
			//		The new data to be set. It can be incomplete, only providing a few fields.
			// returns:
			//		If using server side store, a Deferred object is returned to indicate when the operation is finished.
			var t = this, 
				s = t.grid.store,
				item = t.item(),
				field, d;
			if(s.setValue){
				d = new Deferred();
				try{
					for(field in rawData){
						s.setValue(item, field, rawData[field]);
					}
					s.save({
						onComplete: lang.hitch(d, d.callback),
						onError: lang.hitch(d, d.errback)
					});
				}catch(e){
					d.errback(e);
				}
			}
			return d || Deferred.when(s.put(lang.mixin(lang.clone(item), rawData)));	//dojo.Deferred
		}
	});
});

},
'url:gridx/templates/Grid.html':"<div class=\"gridx\" role=\"grid\" tabindex=\"0\" aria-readonly=\"true\"\n\t><div class=\"gridxHeader\" role=\"presentation\" data-dojo-attach-point=\"headerNode\"></div\n\t><div class=\"gridxMain\" role=\"presentation\" data-dojo-attach-point=\"mainNode\"\n\t\t><div class=\"gridxBodyEmpty\" role=\"alert\" tabindex=\"-1\" data-dojo-attach-point=\"emptyNode\"></div\n\t\t><div class=\"gridxBody\" role=\"presentation\" data-dojo-attach-point=\"bodyNode\"></div\n\t\t><div class=\"gridxVScroller\" data-dojo-attach-point=\"vScrollerNode\" tabindex=\"-1\"\n\t\t\t><div style='width: 1px;'></div\n\t\t></div\n\t></div\n\t><div class=\"gridxFooter\" data-dojo-attach-point=\"footerNode\"\n\t\t><div class=\"gridxHScroller\"\n\t\t\t><div class=\"gridxHScrollerInner\" data-dojo-attach-point=\"hScrollerNode\" tabindex=\"-1\"\n\t\t\t\t><div style=\"width:1px; height: 1px;\"></div\n\t\t\t></div\n\t\t></div\n\t></div\n\t><span data-dojo-attach-point=\"lastFocusNode\" tabindex=\"0\"></span\n></div>\n",
'gridx/modules/extendedSelect/Column':function(){
define("gridx/modules/extendedSelect/Column", [
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/query",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/dom-class",
	"dojo/mouse",
	"dojo/keys",
	"../../core/_Module",
	"./_Base"
], function(declare, array, query, lang, sniff, domClass, mouse, keys, _Module, _Base){

	return declare(/*===== "gridx.modules.extendedSelect.Column", =====*/_Base, {
		// summary:
		//		Provides advanced column selections.
		// description:
		//		This module provides an advanced way for selecting columns by clicking, swiping, SPACE key, or CTRL/SHIFT CLICK to select multiple columns.
		//
		// example:
		//		1. Use select api on column object obtained from grid.column(i)
		//		|	grid.column(1).select();
		//		|	grid.column(1).deselect();
		//		|	grid.column(1).isSelected();
		//
		//		2. Use select api on select.row module
		//		|	grid.select.column.selectById(columnId);
		//		|	grid.select.column.deSelectById(columnId);
		//		|	grid.select.column.isSelected(columnId);
		//		|	grid.select.column.getSelected();//[]
		//		|	grid.select.column.clear();

		// name: [readonly] String
		//		module name
		name: 'selectColumn',

//        optional: ['columnResizer'],

		// columnMixin: Object
		//		A map of functions to be mixed into grid column object, so that we can use select api on column object directly
		//		- grid.column(1).select() | deselect() | isSelected();
		columnMixin: {
			select: function(){
				this.grid.select.column.selectById(this.id);
				return this;
			},
			deselect: function(){
				this.grid.select.column.deselectById(this.id);
				return this;
			},
			isSelected: function(){
				return !!this.grid._columnsById[this.id]._selected;
			}
		},

		//Public-----------------------------------------------------------------
/*=====
		selectById: function(columnId){
			// summary:
			//		Select a column by id.
		},
		
		deselectById: function(columnId){
			// summary:
			//		Deselect a column by id.
		},
		
		selectByIndex: function(columnIndex){
			// summary:
			//		Select a column by index
		},
		
		deSelectByIndex: function(columnIndex){
			// summary:
			//		Deselect a column by index.
		},		
=====*/
		
		getSelected: function(){
			// summary:
			//		Get id array of all selected columns
			return array.map(array.filter(this.grid._columns, function(col){
				return col._selected;
			}), function(col){
				return col.id;
			});
		},

		clear: function(silent){
			// summary:
			//		Deselected all selected columns;			
			query(".gridxColumnSelected", this.grid.domNode).forEach(function(node){
				domClass.remove(node, 'gridxColumnSelected');
				node.removeAttribute('aria-selected');
			});
			array.forEach(this.grid._columns, function(col){
				col._selected = 0;	//0 as false
			});
			this._clear();
			if(!silent){
				this._onSelectionChange();
			}
		},

		isSelected: function(){
			// summary:
			//		Check if the given column(s) are all selected.			
			var cols = this.grid._columnsById;
			return array.every(arguments, function(id){
				var col = cols[id];
				return col && col._selected;
			});
		},
		
		//Private---------------------------------------------------------------
		_type: 'column',

		_markById: function(args, toSelect){
			array.forEach(args, function(colId){
				var col = this.grid._columnsById[colId];
				if(col){
					col._selected = toSelect;
					this._doHighlight({column: col.index}, toSelect);
				}
			}, this);
		},

		_markByIndex: function(args, toSelect){
			var i, col, columns = this.grid._columns;
			for(i = 0; i < args.length; ++i){
				var arg = args[i];
				if(lang.isArrayLike(arg)){
					var start = arg[0],
						end = arg[1],
						count;
					if(start >= 0 && start < Infinity){
						if(!(end >= start && end < Infinity)){
							end = columns.length - 1;
						}
						for(; start < end + 1; ++start){
							col = columns[start];
							if(col){
								col._selected = toSelect;
								this._doHighlight({column: col.index}, toSelect);
							}
						}
					}
				}else if(arg >= 0 && arg < Infinity){
					col = columns[arg];
					if(col){
						col._selected = toSelect;
						this._doHighlight({column: arg}, toSelect);
					}
				}
			}
		},
		
		_init: function(){
			var t = this, g = t.grid;
			t.batchConnect(
				[g, 'onHeaderCellMouseDown', function(e){
					if(mouse.isLeft(e) && !domClass.contains(e.target, 'gridxArrowButtonNode')){
						t._start({column: e.columnIndex}, g._isCopyEvent(e), e.shiftKey);
					}
				}],
				[g, 'onHeaderCellMouseOver', function(e){
					t._highlight({column: e.columnIndex});
				}],
				[g, 'onCellMouseOver', function(e){
					t._highlight({column: e.columnIndex});
				}],
				[g, sniff('ff') < 4 ? 'onHeaderCellKeyUp' : 'onHeaderCellKeyDown', function(e){
					if((e.keyCode == keys.SPACE || e.keyCode == keys.ENTER) && !domClass.contains(e.target, 'gridxArrowButtonNode')){
						t._start({column: e.columnIndex}, g._isCopyEvent(e), e.shiftKey);
						t._end();
					}
				}],
				[g.header, 'onMoveToHeaderCell', '_onMoveToHeaderCell']
			);
		},

		_onRender: function(start, count){
			var i, j, end = start + count, g = this.grid, bn = g.bodyNode, node,
				cols = array.filter(g._columns, function(col){
					return col._selected;
				});
			for(i = cols.length - 1; i >= 0; --i){
				for(j = start; j < end; ++j){
					node = query(['[visualindex="', j, '"] [colid="', cols[i].id, '"]'].join(''), bn)[0];
					domClass.add(node, 'gridxColumnSelected');
					node.setAttribute('aria-selected', true);
				}
			}
		},

		_onMoveToHeaderCell: function(columnId, e){
			if(e.shiftKey && (e.keyCode == keys.LEFT_ARROW || e.keyCode == keys.RIGHT_ARROW)){
				var t = this, col = t.grid._columnsById[columnId];
				t._start({column: col.index}, t.grid._isCopyEvent(e), 1);	//1 as true
				t._end();
			}
		},

		_isSelected: function(target){
			var t = this, col = t.grid._columns[target.column], id = col.id;
			return t._isRange ? array.indexOf(t._refSelectedIds, id) >= 0 : col._selected;
		},

		_beginAutoScroll: function(){
			var autoScroll = this.grid.autoScroll;
			this._autoScrollV = autoScroll.vertical;
			autoScroll.vertical = false;
		},

		_endAutoScroll: function(){
			this.grid.autoScroll.vertical = this._autoScrollV;
		},

		_doHighlight: function(target, toHighlight){
			query('[colid="' + this.grid._columns[target.column].id + '"].gridxCell', this.grid.domNode).forEach(function(node){
				domClass.toggle(node, 'gridxColumnSelected', toHighlight);
			});
		},

		_focus: function(target){
			var g = this.grid;
			if(g.focus){
				//Seems breaking encapsulation...
				g.header._focusNode(query('[colid="' + g._columns[target.column].id + '"].gridxCell', g.header.domNode)[0]);
			}
		},

		_addToSelected: function(start, end, toSelect){
			var t = this, g = t.grid, a, i;
			if(!t._isRange){
				t._refSelectedIds = t.getSelected();
			}
			if(t._isRange && t._inRange(end.column, start.column, t._lastEndItem.column)){
				start = Math.min(end.column, t._lastEndItem.column);
				end = Math.max(end.column, t._lastEndItem.column);
				for(i = start; i <= end; ++i){
					g._columns[i]._selected = array.indexOf(t._refSelectedIds, g._columns[i].id) >= 0;
				}
			}else{
				a = Math.min(start.column, end.column);
				end = Math.max(start.column, end.column);
				start = a;
				for(i = start; i <= end; ++i){
					g._columns[i]._selected = toSelect;
				}
			}
		}
	});
});

},
'gridx/modules/Header':function(){
define("gridx/modules/Header", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/query",
	"dojo/_base/sniff",
	"dojo/keys",
	"../core/util",
	"../core/_Module"
], function(declare, lang, array, domConstruct, domClass, domGeometry, query, sniff, keys, util, _Module){

	
	return declare(/*===== "gridx.modules.Header", =====*/_Module, {
		// summary:
		//		The header UI of grid
		// description:
		//		This module is in charge of the rendering of the grid header. But it should not manage column width,
		//		which is the responsibility of ColumnWidth module.

		name: 'header',

		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				header: this
			};
		},

		constructor: function(){
			var t = this,
				dn = t.domNode = domConstruct.create('div', {
					'class': 'gridxHeaderRow',
					role: 'presentation'
				}),
				inner = t.innerNode = domConstruct.create('div', {
					'class': 'gridxHeaderRowInner',
					role: 'row'
				});
			t.grid._connectEvents(dn, '_onMouseEvent', t);
		},

		preload: function(args){
			// tags:
			//		protected extension
			var t = this,
				g = t.grid;
			t.domNode.appendChild(t.innerNode);
			t._build();
			g.headerNode.appendChild(t.domNode);
			//Add this.domNode to be a part of the grid header
			g.vLayout.register(t, 'domNode', 'headerNode');
			t.aspect(g, 'onHScroll', '_onHScroll');
			t.aspect(g, 'onHeaderCellMouseOver', '_onHeaderCellMouseOver');
			t.aspect(g, 'onHeaderCellMouseOut', '_onHeaderCellMouseOver');
			//FIXME: sometimes FF will remember the scroll position of the header row, so force aligned with body.
			//Does not occur in any other browsers.
			if(sniff('ff')){
				t.aspect(g, 'onModulesLoaded', function(){
					t._onHScroll(t._scrollLeft);
				});
			}
			if(g.columnResizer){
				t.aspect(g.columnResizer, 'onResize', function(){
					if(g.hScrollerNode.style.display == 'none'){
						t._onHScroll(0);
					}
				});
			}
			t._initFocus();
		},

		destroy: function(){
			// tags:
			//		protected extension
			this.inherited(arguments);
			domConstruct.destroy(this.domNode);
		},

		columnMixin: {
			headerNode: function(){
				return this.grid.header.getHeaderNode(this.id);
			}
		},
	
		//Public-----------------------------------------------------------------------------
		

		// hidden: Boolean
		//		Whether the header UI should be hidden.
		hidden: false,

		
		getHeaderNode: function(id){
			// summary:
			//		Get the header DOM node by column ID.
			// id: String
			//		The column ID
			// returns:
			//		The header DOM node
			return query("[colid='" + id + "']", this.domNode)[0];	//DOMNode
		},
		
		
		refresh: function(){
			// summary:
			//		Re-build the header UI.
			this._build();
			this._onHScroll(this._scrollLeft);
			this.onRender();
		},

		onRender: function(){
			// summary:
			//		Fired when the header is rendered.
			// tags:
			//		callback
		},

		onMoveToHeaderCell: function(/* columnId, e */){
			// summary:
			//		Fired when the focus is moved to a header cell by keyboard.
			// tags:
			//		callback
		},
		
		//Private-----------------------------------------------------------------------------
		_scrollLeft: 0,

		_build: function(){
			var t = this,
				g = t.grid,
				f = g.focus,
				sb = ['<table border="0" cellpadding="0" cellspacing="0"><tr>'];
			array.forEach(g._columns, function(col){
				sb.push('<th id="', (g.id + '-' + col.id).replace(/\s+/, ''),
					'" role="columnheader" aria-readonly="true" tabindex="-1" colid="', col.id,
					'" class="gridxCell ',
					f && f.currentArea() == 'header' && col.id == t._focusHeaderId ? t._focusClass : '',
					(lang.isFunction(col.headerClass) ? col.headerClass(col) : col.headerClass) || '',
					'" style="width: ', col.width, ';',
					(lang.isFunction(col.headerStyle) ? col.headerStyle(col) : col.headerStyle) || '',
					'"><div class="gridxSortNode">',
					col.name || '',
					'</div></th>');
			});
			sb.push('</tr></table>');
			t.innerNode.innerHTML = sb.join('');
			domClass.toggle(t.domNode, 'gridxHeaderRowHidden', t.arg('hidden'));
		},

		_onHScroll: function(left){
			if((sniff('webkit') || sniff('ie') < 8) && !this.grid.isLeftToRight()){
				left = this.innerNode.scrollWidth - this.innerNode.offsetWidth - left;
			}
			this.innerNode.scrollLeft = this._scrollLeft = left;
		},
	
		_onMouseEvent: function(eventName, e){
			var g = this.grid,
				evtCell = 'onHeaderCell' + eventName,
				evtRow = 'onHeader' + eventName;
			if(g._isConnected(evtCell) || g._isConnected(evtRow)){
				this._decorateEvent(e);
				if(e.columnIndex >= 0){
					g[evtCell](e);
				}
				g[evtRow](e);
			}
		},
	
		_decorateEvent: function(e){
			for(var n = e.target, c; n && n !== this.domNode; n = n.parentNode){
				if(n.tagName && n.tagName.toLowerCase() == 'th'){
					c = this.grid._columnsById[n.getAttribute('colid')];
					if(c){
						e.headerCellNode = n;
						e.columnId = c.id;
						e.columnIndex = c.index;
					}
					return;
				}
			}
		},
		
		_onHeaderCellMouseOver: function(e){
			domClass.toggle(this.getHeaderNode(e.columnId), 'gridxHeaderCellOver', e.type == 'mouseover');
		},
		
		// Focus
		_focusHeaderId: null,

		_focusClass: "gridxHeaderCellFocus",

		_initFocus: function(){
			var t = this, g = t.grid;
			if(g.focus){
				g.focus.registerArea({
					name: 'header',
					priority: 0,
					focusNode: t.innerNode,
					scope: t,
					doFocus: t._doFocus,
					doBlur: t._blurNode,
					onBlur: t._blurNode,
					connects: [
						t.connect(g, 'onHeaderCellKeyDown', '_onKeyDown'),
						t.connect(g, 'onHeaderCellMouseDown', function(evt){
							t._focusNode(t.getHeaderNode(evt.columnId));
						})
					]
				});
			}
		},

		_doFocus: function(evt, step){
			var t = this, 
				n = t._focusHeaderId && t.getHeaderNode(t._focusHeaderId),
				r = t._focusNode(n || query('th.gridxCell', t.domNode)[0]);
			t.grid.focus.stopEvent(r && evt);
			return r;
		},
		
		_focusNode: function(node){
			if(node){
				var t = this, g = t.grid,
					fid = t._focusHeaderId = node.getAttribute('colid');
				if(fid){
					t._blurNode();
					if(g.hScroller){
						g.hScroller.scrollToColumn(fid);
					}
					g.body._focusCellCol = g._columnsById[fid].index;

					domClass.add(node, t._focusClass);
					//If no timeout, the header and body may be mismatch.
					setTimeout(function(){
						//For webkit browsers, when moving column using keyboard, the header cell will lose this focus class,
						//although it was set correctly before this setTimeout. So re-add it here.
						if(sniff('webkit')){
							domClass.add(node, t._focusClass);
						}
						node.focus();
						if(sniff('ie') < 8){
							t.innerNode.scrollLeft = t._scrollLeft;
						}
					}, 0);
					return true;
				}
			}
			return false;
		},

		_blurNode: function(){
			var t = this, n = query('th.' + t._focusClass, t.innerNode)[0];
			if(n){
				domClass.remove(n, t._focusClass);
			}
			return true;
		},

		_onKeyDown: function(evt){
			var t = this, g = t.grid, col,
				dir = g.isLeftToRight() ? 1 : -1,
				delta = evt.keyCode == keys.LEFT_ARROW ? -dir : dir;
			if(t._focusHeaderId && !evt.ctrlKey && !evt.altKey &&
				(evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW)){
				//Prevent scrolling the whole page.
				g.focus.stopEvent(evt);
				col = g._columnsById[t._focusHeaderId];
				col = g._columns[col.index + delta];
				if(col){
					t._focusNode(t.getHeaderNode(col.id));
					t.onMoveToHeaderCell(col.id, evt);
				}
			}
		}
	});
});

},
'gridx/modules/dnd/Avatar':function(){
define([
	"dojo/_base/declare",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/_base/window",
	"dojo/dnd/Avatar"
], function(declare, domClass, domConstruct, win, Avatar){

	return declare(Avatar, {
		construct: function(manager){
			// summary:
			//		constructor function;
			//		it is separate so it can be (dynamically) overwritten in case of need
			var t = this;
			t.isA11y = domClass.contains(win.body(), "dijit_a11y");
			
			t.node = domConstruct.toDom(["<table border='0' cellspacing='0' class='gridxDndAvatar' ",
				"style='position: absolute; z-index: 1999; margin: 0'>",
				"<tbody><tr style='opacity: 0.9;'>",
					"<td class='gridxDnDIcon'>",
						t.isA11y ? "<span id='a11yIcon'>" + (t.manager.copy ? '+' : '<') + "</span>" : '',
					"</td>",
					"<td class='gridxDnDItemIcon ", t._getIconClass(), "'></td>",
					"<td><span class='gridxDnDItemCount'>", t._generateText(), "</span></td>",
				"</tr></tbody></table>"
			].join(''));
		},

		_getIconClass: function(){
			var info = this.manager._dndInfo;
			return ['gridxDnDIcon', info.cssName, info.count === 1 ? 'Single' : 'Multi'].join('');
		},

		_generateText: function(){
			// summary:
			//		generates a proper text to reflect copying or moving of items
			return "(" + this.manager._dndInfo.count + ")";
		}
	});
});

},
'gridx/core/Cell':function(){
define("gridx/core/Cell", [
	"dojo/_base/declare"
], function(declare){

	
	return declare(/*===== "gridx.core.Cell", =====*/[], {
		// summary:
		//		Represents a cell of a grid
		// description:
		//		An instance of this class represents a grid cell.
		//		This class should not be directly instantiated by users. It should be returned by grid APIs.

		/*=====
		// row: [readonly] gridx.core.Row
		//		Reference to the row of this cell
		row: null,

		// column [readonly] gridx.core.Column
		//		Reference to the column of this cell
		column: null,

		// grid: [readonly] gridx.Grid
		//		Reference to the grid
		grid: null,

		// model: [readonly] grid.core.model.Model
		//		Reference to this grid model
		model: null,
		=====*/

		constructor: function(grid, row, column){
			var t = this;
			t.grid = grid;
			t.model = grid.model;
			t.row = row;
			t.column = column;
		},

		data: function(){
			// summary:
			//		Get the grid data of this cell.
			// description:
			//		Grid data means the result of the formatter functions (if exist).
			//		It can be different from store data (a.k.a. raw data).
			// returns:
			//		The grid data in this cell
			return this.model.byId(this.row.id).data[this.column.id];	//String|Number
		},

		rawData: function(){
			// summary:
			//		Get the store data of this cell.
			// description:
			//		If the column of this cell has a store field, then this method can return the store data of this cell.
			// returns:
			//		The store data of this cell
			var t = this, f = t.column.field();
			return f && t.model.byId(t.row.id).rawData[f];	//anything
		},

		setRawData: function(rawData){
			// summary:
			//		Set new raw data to this cell.
			// rawData:
			//		Anything that store can recognize as data
			// returns:
			//		If using server side store, a Deferred object is returned to indicate when the operation is finished.
			var obj = {},
				field = this.column.field();
			if(field){
				obj[field] = rawData;
				return this.row.setRawData(obj);	//dojo.Deferred
			}
		}
	});
});

},
'gridx/core/Core':function(){
define("gridx/core/Core", [
	"require",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"./model/Model",
	"./Row",
	"./Column",
	"./Cell",
	"./_Module"
], function(require, declare, array, lang, Deferred, DeferredList, Model, Row, Column, Cell, _Module){	

	var delegate = lang.delegate,
		isFunc = lang.isFunction,
		isString = lang.isString,
		hitch = lang.hitch,
		forEach = array.forEach;

	function getDepends(mod){
		var p = mod.moduleClass.prototype;
		return (p.forced || []).concat(p.optional || []);
	}

	function configColumns(columns){
		var cs = {}, c, i, len;
		if(lang.isArray(columns)){
			for(i = 0, len = columns.length; i < len; ++i){
				c = columns[i];
				c.index = i;
				c.id = c.id || String(i + 1);
				cs[c.id] = c;
			}
		}
		return cs;
	}

	function mixinAPI(base, apiPath){
		if(apiPath){
			for(var path in apiPath){
				var bp = base[path],
					ap = apiPath[path];
				if(bp && lang.isObject(bp) && !isFunc(bp)){
					mixinAPI(bp, ap);
				}else{
					base[path] = ap;
				}
			}
		}
	}

	function normalizeModules(self){
		var mods = [],
			coreModCount = self.coreModules.length;
		forEach(self.modules, function(m, i){
			if(isFunc(m) || isString(m)){
				m = {
					moduleClass: m
				};
			}
			if(m){
				var mc = m.moduleClass;
				if(isString(mc)){
					try{
						mc = m.moduleClass = require(mc);
					}catch(e){
						console.error(e);
					}
				}
				if(isFunc(mc)){
					mods.push(m);
					return;
				}
			}
			console.error("The " + (i + 1 - coreModCount) +
				"-th declared module can NOT be found, please require it before using it");
		});
		self.modules = mods;
	}
	
	function checkForced(self){
		var registeredMods = _Module._modules,
			modules = self.modules, i, j, k, p, deps, depName, err;
		for(i = 0; i < modules.length; ++i){
			p = modules[i].moduleClass.prototype;
			deps = (p.forced || []).concat(p.required || []);
			for(j = 0; j < deps.length; ++j){
				depName = deps[j];
				for(k = modules.length - 1; k >= 0; --k){
					if(modules[k].moduleClass.prototype.name === depName){
						break;
					}
				}
				if(k < 0){
					if(registeredMods[depName]){
						modules.push({
							moduleClass: registeredMods[depName]
						});
					}else{
						err = 1;	//1 as true
						console.error("Forced/Required dependent module '" + depName +
							"' is NOT found for '" + p.name + "' module.");
					}
				}
			}
		}
		if(err){
			throw new Error("Some forced/required dependent modules are NOT found.");
		}
	}

	function removeDuplicate(self){
		var i, mods = {}, modules = [];
		forEach(self.modules, function(m){
			mods[m.moduleClass.prototype.name] = m;
		});
		for(i in mods){
			modules.push(mods[i]);
		}
		self.modules = modules;
	}

	function checkCircle(self){
		var modules = self.modules, i, m, modName, q, key,
			getModule = function(modName){
				for(var j = modules.length - 1; j >= 0; --j){
					if(modules[j].moduleClass.prototype.name == modName){
						return modules[j];
					}
				}
				return null;
			};
		for(i = modules.length - 1; m = modules[i]; --i){
			modName = m.moduleClass.prototype.name;
			q = getDepends(m);
			while(q.length){
				key = q.shift();
				if(key == modName){
					throw new Error("Module '" + key + "' is in a dependancy circle!");
				}
				m = getModule(key);
				if(m){
					q = q.concat(getDepends(m));
				}
			}
		}
	}

	function checkModelExtensions(self){
		var modules = self.modules,
			i, modExts;
		for(i = modules.length - 1; i >= 0; --i){
			modExts = modules[i].moduleClass.prototype.modelExtensions;
			if(modExts){
				[].push.apply(self.modelExtensions, modExts);
			}
		}
	}

	function arr(self, total, type, start, count, pid){
		var i = start || 0, end = count >= 0 ? start + count : total, r = [];
		for(; i < end && i < total; ++i){
			r.push(self[type](i, 0, pid));
		}
		return r;
	}

	function mixin(self, component, name){
		var m, a, mods = self._modules;
		for(m in mods){
			m = mods[m].mod;
			a = m[name + 'Mixin'];
			if(isFunc(a)){
				a = a.apply(m);
			}
			lang.mixin(component, a || {});
		}
		return component;
	}

	function initMod(self, deferredStartup, key){
		var mods = self._modules,
			m = mods[key],
			mod = m.mod,
			d = mod.loaded;
		if(!m.done){
			m.done = 1;
			new DeferredList(array.map(array.filter(m.deps, function(depModName){
				return mods[depModName];
			}), hitch(self, initMod, self, deferredStartup)), 0, 1).then(function(){
				if(mod.load){
					mod.load(m.args, deferredStartup);
				}else if(d.fired < 0){
					d.callback();
				}
			});
		}
		return d;
	}

	return declare(/*===== "gridx.core.Core", =====*/[], {
		// summary:
		//		This is the logical grid (also the base class of the grid widget), 
		//		providing grid data model and defines a module/plugin framework
		//		so that the whole grid can be as flexible as possible while still convenient enough for
		//		web page developers.

		setStore: function(store){
			// summary:
			//		Change the store for grid.
			// store: dojo.data.*|dojox.data.*|dojo.store.*
			//		The new data store
			if(this.store != store){
				this.store = store;
				this.model.setStore(store);
			}
		},

		setColumns: function(columns){
			// summary:
			//		Change all the column definitions for grid.
			// columns: Array
			//		The new column structure
			var t = this;
			t.structure = columns;
			t._columns = lang.clone(columns);
			t._columnsById = configColumns(t._columns);
			if(t.model){
				t.model._cache.onSetColumns(t._columnsById);
			}
		},

		row: function(row, isId, parentId){
			// summary:
			//		Get a row object by ID or index.
			//		For asyc store, if the data of this row is not in cache, then null will be returned.
			// row: Integer|String
			//		Row index of row ID
			// isId: Boolean?
			//		If the row parameter is a numeric ID, set this to true
			// returns:
			//		If the params are valid and row data is in cache, return a row object, else return null.
			var t = this;
			if(typeof row == "number" && !isId){
				row = t.model.indexToId(row, parentId);
			}
			if(t.model.byId(row)){
				t._rowObj = t._rowObj || mixin(t, new Row(t), "row");
				return delegate(t._rowObj, {	//gridx.core.Row
					id: row
				});
			}
			return null;	//null
		},

		column: function(column, isId){
			// summary:
			//		Get a column object by ID or index
			// column: Integer|String
			//		Column index or column ID
			// isId: Boolean
			//		If the column parameter is a numeric ID, set this to true
			// returns:
			//		If the params are valid return a column object, else return NULL
			var t = this, c, a, obj = {};
			if(typeof column == "number" && !isId){
				c = t._columns[column];
				column = c && c.id;
			}
			c = t._columnsById[column];
			if(c){
				t._colObj = t._colObj || mixin(t, new Column(t), "column");
				for(a in c){
					if(t._colObj[a] === undefined){
						obj[a] = c[a];
					}
				}
				return delegate(t._colObj, obj);	//gridx.core.Column
			}
			return null;	//null
		},

		cell: function(row, column, isId, parentId){
			// summary:
			//		Get a cell object
			// row: gridx.core.Row|Integer|String
			//		Row index or row ID or a row object
			// column: gridx.core.Column|Integer|String
			//		Column index or column ID or a column object
			// isId: Boolean?
			//		If the row and coumn params are numeric IDs, set this to true
			// returns:
			//		If the params are valid and the row is in cache return a cell object, else return null.
			var t = this, r = row instanceof Row ? row : t.row(row, isId, parentId);
			if(r){
				var c = column instanceof Column ? column : t.column(column, isId);
				if(c){
					t._cellObj = t._cellObj || mixin(t, new Cell(t), "cell");
					return delegate(t._cellObj, {	//gridx.core.Cell
						row: r,
						column: c
					});
				}
			}
			return null;	//null
		},

		columnCount: function(){
			// summary:
			//		Get the number of columns
			// returns:
			//		The count of columns
			return this._columns.length;	//Integer
		},

		rowCount: function(parentId){
			// summary:
			//		Get the number of rows.
			// description:
			//		For async store, the return value is valid only when the grid has fetched something from the store.
			// parentId: String?
			//		If provided, return the child count of the given parent row.
			// returns:
			//		The count of rows. -1 if the size info is not available (using server side store and never fetched any data)
			return this.model.size(parentId);	//Integer
		},

		columns: function(start, count){
			// summary:
			//		Get a range of columns, from index 'start' to index 'start + count'.
			// start: Integer?
			//		The index of the first column in the returned array.
			//		If omitted, defaults to 0, so grid.columns() gets all the columns.
			// count: Integer?
			//		The number of columns to return.
			//		If omitted, all the columns starting from 'start' will be returned.
			// returns:
			//		An array of column objects
			return arr(this, this._columns.length, 'column', start, count);	//gridx.core.Column[]
		},

		rows: function(start, count, parentId){
			// summary:
			//		Get a range of rows, from index 'start' to index 'start + count'.
			// description:
			//		For async store, if some rows are not in cache, then there will be NULLs in the returned array.
			// start: Integer?
			//		The index of the first row in the returned array.
			//		If omitted, defaults to 0, so grid.rows() gets all the rows.
			// count: Integer?
			//		The number of rows to return.
			//		If omitted, all the rows starting from 'start' will be returned.
			// returns:
			//		An array of row objects
			return arr(this, this.rowCount(parentId), 'row', start, count, parentId);	//gridx.core.Row[]
		},

		onModulesLoaded: function(){
			// summary:
			//		Fired when all grid modules are loaded. Can be used as a signal of grid creation complete.
			// tags:
			//		callback
		},

		//Private-------------------------------------------------------------------------------------
		_init: function(){
			//Reset the grid data model completely. Also used in initialization.
			var t = this,
				d = t._deferStartup = new Deferred();
			t.modules = t.modules || [];
			t.modelExtensions = t.modelExtensions || [];
			t.setColumns(t.structure);

			normalizeModules(t);
			checkForced(t);
			removeDuplicate(t);
			checkCircle(t);
			checkModelExtensions(t);
			//Create model before module creation, so that all modules can use the logic grid from very beginning.
			t.model = new Model(t);
			t.when = lang.hitch(t.model, t.model.when);
			t._create();
			t._preload();
			t._load(d).then(hitch(t, 'onModulesLoaded'));
		},

		_uninit: function(){
			var t = this, mods = t._modules, m;
			for(m in mods){
				mods[m].mod.destroy();
			}
			if(t.model){
				t.model.destroy();
			}
		},

		_create: function(){
			var t = this,
				mods = t._modules = {};
			forEach(t.modules, function(mod){
				var m, key = mod.moduleClass.prototype.name;
				if(!mods[key]){
					mods[key] = {
						args: mod,
						mod: m = new mod.moduleClass(t, mod),
						deps: getDepends(mod)
					};
					if(m.getAPIPath){
						mixinAPI(t, m.getAPIPath());
					}
				}
			});
		},

		_preload: function(){
			var m, mods = this._modules;
			for(m in mods){
				m = mods[m];
				if(m.mod.preload){
					m.mod.preload(m.args);
				}
			}
		},

		_load: function(deferredStartup){
			var dl = [], m;
			for(m in this._modules){
				dl.push(initMod(this, deferredStartup, m));
			}
			return new DeferredList(dl, 0, 1);
		}
	});
});

},
'dojo/dnd/Selector':function(){
define("dojo/dnd/Selector", [
	"../_base/array", "../_base/declare", "../_base/event", "../_base/kernel", "../_base/lang",
	"../dom", "../dom-construct", "../mouse", "../_base/NodeList", "../on", "../touch", "./common", "./Container"
], function(array, declare, event, kernel, lang, dom, domConstruct, mouse, NodeList, on, touch, dnd, Container){

// module:
//		dojo/dnd/Selector

/*
	Container item states:
		""			- an item is not selected
		"Selected"	- an item is selected
		"Anchor"	- an item is selected, and is an anchor for a "shift" selection
*/

/*=====
var __SelectorArgs = declare([Container.__ContainerArgs], {
	// singular: Boolean
	//		allows selection of only one element, if true
	singular: false,

	// autoSync: Boolean
	//		autosynchronizes the source with its list of DnD nodes,
	autoSync: false
});
=====*/

var Selector = declare("dojo.dnd.Selector", Container, {
	// summary:
	//		a Selector object, which knows how to select its children

	/*=====
	// selection: Set<String>
	//		The set of id's that are currently selected, such that this.selection[id] == 1
	//		if the node w/that id is selected.  Can iterate over selected node's id's like:
	//	|		for(var id in this.selection)
	selection: {},
	=====*/

	constructor: function(node, params){
		// summary:
		//		constructor of the Selector
		// node: Node||String
		//		node or node's id to build the selector on
		// params: __SelectorArgs?
		//		a dictionary of parameters
		if(!params){ params = {}; }
		this.singular = params.singular;
		this.autoSync = params.autoSync;
		// class-specific variables
		this.selection = {};
		this.anchor = null;
		this.simpleSelection = false;
		// set up events
		this.events.push(
			on(this.node, touch.press, lang.hitch(this, "onMouseDown")),
			on(this.node, touch.release, lang.hitch(this, "onMouseUp"))
		);
	},

	// object attributes (for markup)
	singular: false,	// is singular property

	// methods
	getSelectedNodes: function(){
		// summary:
		//		returns a list (an array) of selected nodes
		var t = new NodeList();
		var e = dnd._empty;
		for(var i in this.selection){
			if(i in e){ continue; }
			t.push(dom.byId(i));
		}
		return t;	// NodeList
	},
	selectNone: function(){
		// summary:
		//		unselects all items
		return this._removeSelection()._removeAnchor();	// self
	},
	selectAll: function(){
		// summary:
		//		selects all items
		this.forInItems(function(data, id){
			this._addItemClass(dom.byId(id), "Selected");
			this.selection[id] = 1;
		}, this);
		return this._removeAnchor();	// self
	},
	deleteSelectedNodes: function(){
		// summary:
		//		deletes all selected items
		var e = dnd._empty;
		for(var i in this.selection){
			if(i in e){ continue; }
			var n = dom.byId(i);
			this.delItem(i);
			domConstruct.destroy(n);
		}
		this.anchor = null;
		this.selection = {};
		return this;	// self
	},
	forInSelectedItems: function(/*Function*/ f, /*Object?*/ o){
		// summary:
		//		iterates over selected items;
		//		see `dojo/dnd/Container.forInItems()` for details
		o = o || kernel.global;
		var s = this.selection, e = dnd._empty;
		for(var i in s){
			if(i in e){ continue; }
			f.call(o, this.getItem(i), i, this);
		}
	},
	sync: function(){
		// summary:
		//		sync up the node list with the data map

		Selector.superclass.sync.call(this);

		// fix the anchor
		if(this.anchor){
			if(!this.getItem(this.anchor.id)){
				this.anchor = null;
			}
		}

		// fix the selection
		var t = [], e = dnd._empty;
		for(var i in this.selection){
			if(i in e){ continue; }
			if(!this.getItem(i)){
				t.push(i);
			}
		}
		array.forEach(t, function(i){
			delete this.selection[i];
		}, this);

		return this;	// self
	},
	insertNodes: function(addSelected, data, before, anchor){
		// summary:
		//		inserts new data items (see `dojo/dnd/Container.insertNodes()` method for details)
		// addSelected: Boolean
		//		all new nodes will be added to selected items, if true, no selection change otherwise
		// data: Array
		//		a list of data items, which should be processed by the creator function
		// before: Boolean
		//		insert before the anchor, if true, and after the anchor otherwise
		// anchor: Node
		//		the anchor node to be used as a point of insertion
		var oldCreator = this._normalizedCreator;
		this._normalizedCreator = function(item, hint){
			var t = oldCreator.call(this, item, hint);
			if(addSelected){
				if(!this.anchor){
					this.anchor = t.node;
					this._removeItemClass(t.node, "Selected");
					this._addItemClass(this.anchor, "Anchor");
				}else if(this.anchor != t.node){
					this._removeItemClass(t.node, "Anchor");
					this._addItemClass(t.node, "Selected");
				}
				this.selection[t.node.id] = 1;
			}else{
				this._removeItemClass(t.node, "Selected");
				this._removeItemClass(t.node, "Anchor");
			}
			return t;
		};
		Selector.superclass.insertNodes.call(this, data, before, anchor);
		this._normalizedCreator = oldCreator;
		return this;	// self
	},
	destroy: function(){
		// summary:
		//		prepares the object to be garbage-collected
		Selector.superclass.destroy.call(this);
		this.selection = this.anchor = null;
	},

	// mouse events
	onMouseDown: function(e){
		// summary:
		//		event processor for onmousedown
		// e: Event
		//		mouse event
		if(this.autoSync){ this.sync(); }
		if(!this.current){ return; }
		if(!this.singular && !dnd.getCopyKeyState(e) && !e.shiftKey && (this.current.id in this.selection)){
			this.simpleSelection = true;
			if(mouse.isLeft(e)){
				// Accept the left button and stop the event.   Stopping the event prevents text selection while
				// dragging.   However, don't stop the event on mobile because that prevents a click event,
				// and also prevents scroll (see #15838).
				// For IE we don't stop event when multiple buttons are pressed.
				event.stop(e);
			}
			return;
		}
		if(!this.singular && e.shiftKey){
			if(!dnd.getCopyKeyState(e)){
				this._removeSelection();
			}
			var c = this.getAllNodes();
			if(c.length){
				if(!this.anchor){
					this.anchor = c[0];
					this._addItemClass(this.anchor, "Anchor");
				}
				this.selection[this.anchor.id] = 1;
				if(this.anchor != this.current){
					var i = 0, node;
					for(; i < c.length; ++i){
						node = c[i];
						if(node == this.anchor || node == this.current){ break; }
					}
					for(++i; i < c.length; ++i){
						node = c[i];
						if(node == this.anchor || node == this.current){ break; }
						this._addItemClass(node, "Selected");
						this.selection[node.id] = 1;
					}
					this._addItemClass(this.current, "Selected");
					this.selection[this.current.id] = 1;
				}
			}
		}else{
			if(this.singular){
				if(this.anchor == this.current){
					if(dnd.getCopyKeyState(e)){
						this.selectNone();
					}
				}else{
					this.selectNone();
					this.anchor = this.current;
					this._addItemClass(this.anchor, "Anchor");
					this.selection[this.current.id] = 1;
				}
			}else{
				if(dnd.getCopyKeyState(e)){
					if(this.anchor == this.current){
						delete this.selection[this.anchor.id];
						this._removeAnchor();
					}else{
						if(this.current.id in this.selection){
							this._removeItemClass(this.current, "Selected");
							delete this.selection[this.current.id];
						}else{
							if(this.anchor){
								this._removeItemClass(this.anchor, "Anchor");
								this._addItemClass(this.anchor, "Selected");
							}
							this.anchor = this.current;
							this._addItemClass(this.current, "Anchor");
							this.selection[this.current.id] = 1;
						}
					}
				}else{
					if(!(this.current.id in this.selection)){
						this.selectNone();
						this.anchor = this.current;
						this._addItemClass(this.current, "Anchor");
						this.selection[this.current.id] = 1;
					}
				}
			}
		}
		event.stop(e);
	},
	onMouseUp: function(/*===== e =====*/){
		// summary:
		//		event processor for onmouseup
		// e: Event
		//		mouse event
		if(!this.simpleSelection){ return; }
		this.simpleSelection = false;
		this.selectNone();
		if(this.current){
			this.anchor = this.current;
			this._addItemClass(this.anchor, "Anchor");
			this.selection[this.current.id] = 1;
		}
	},
	onMouseMove: function(/*===== e =====*/){
		// summary:
		//		event processor for onmousemove
		// e: Event
		//		mouse event
		this.simpleSelection = false;
	},

	// utilities
	onOverEvent: function(){
		// summary:
		//		this function is called once, when mouse is over our container
		this.onmousemoveEvent = on(this.node, touch.move, lang.hitch(this, "onMouseMove"));
	},
	onOutEvent: function(){
		// summary:
		//		this function is called once, when mouse is out of our container
		if(this.onmousemoveEvent){
			this.onmousemoveEvent.remove();
			delete this.onmousemoveEvent;
		}
	},
	_removeSelection: function(){
		// summary:
		//		unselects all items
		var e = dnd._empty;
		for(var i in this.selection){
			if(i in e){ continue; }
			var node = dom.byId(i);
			if(node){ this._removeItemClass(node, "Selected"); }
		}
		this.selection = {};
		return this;	// self
	},
	_removeAnchor: function(){
		if(this.anchor){
			this._removeItemClass(this.anchor, "Anchor");
			this.anchor = null;
		}
		return this;	// self
	}
});

return Selector;

});

},
'gridx/core/model/extensions/Query':function(){
define([
	"dojo/_base/declare",
	'../_Extension'
], function(declare, _Extension){

	return declare(/*===== "gridx.core.model.extensions.Query", =====*/_Extension, {
		name: 'query',

		priority: 40,

		constructor: function(model, args){
			this._mixinAPI('query');
			if(args.query){
				this.query(args.query, args.queryOptions);
			}
		},

		//Public--------------------------------------------------------------
		query: function(/* query, queryOptions */){
			this.model._addCmd({
				name: '_cmdQuery',
				scope: this,
				args: arguments
			});
		},
	
		//Private--------------------------------------------------------------
		_cmdQuery: function(){
			var a = arguments,
				args = a[a.length - 1],
				m = this.model,
				c = m._cache, 
				op = c.options = c.options || {};
			op.query = args[0];
			op.queryOptions = args[1];
			m._msg('storeChange');
			c.clear();
		}
	});
});

},
'gridx/modules/extendedSelect/_Base':function(){
define("gridx/modules/extendedSelect/_Base", [
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/connect",
	"dojo/_base/Deferred",
	"dojo/_base/sniff",
	"dojo/_base/window",
	"dojo/dom",
	"dojo/keys",
	"../../core/_Module",
	"../AutoScroll"
], function(declare, query, connect, Deferred, sniff, win, dom, keys, _Module){

	return declare(_Module, {
		required: ['autoScroll'],

		getAPIPath: function(){
			var path = {
				select: {}
			};
			path.select[this._type] = this;
			return path;
		},
		
		load: function(){
			var t = this, g = t.grid, doc = win.doc;
			g.domNode.setAttribute('aria-multiselectable', true);
			t._refSelectedIds = [];
			t.subscribe('gridClearSelection_' + g.id, function(type){
				if(type != t._type){
					t.clear();
				}
			});
			t.batchConnect(
				[g.body, 'onRender', '_onRender'],
				[doc, 'onmouseup', '_end'],
				[doc, 'onkeydown', function(e){
					if(e.keyCode == keys.SHIFT){
						dom.setSelectable(g.domNode, false);
					}
				}],
				[doc, 'onkeyup', function(e){
					if(e.keyCode == keys.SHIFT){
						dom.setSelectable(g.domNode, true);
					}
				}]
			);
			t._init();
			t.loaded.callback();
		},

		//Public ------------------------------------------------------------------
		enabled: true,

		holdingCtrl: false,

		holdingShift: false,

		selectById: function(/* id */){
			return this._subMark('_markById', arguments, true);
		},

		deselectById: function(/* id */){
			return this._subMark('_markById', arguments, false);
		},

		selectByIndex: function(/* start, end */){
			return this._subMark('_markByIndex', arguments, true);
		},

		deselectByIndex: function(/* start, end */){
			return this._subMark('_markByIndex', arguments, false);
		},

		onSelectionChange: function(/*newSelectedIds, oldSelectedIds*/){
			// summary:
			//		Event: fired when the selection is changed.
		},

		//Private -----------------------------------------------------------------
		_clear: function(){
			var t = this;
			delete t._lastToSelect;
			delete t._lastStartItem;
			delete t._lastEndItem;
		},

		_subMark: function(func, args, toSelect){
			var t = this;
			if(t.arg('enabled')){
				if(toSelect){
					connect.publish('gridClearSelection_' + t.grid.id, [t._type]);
				}
				t._lastSelectedIds = t.getSelected();
				t._refSelectedIds = [];
				return Deferred.when(t[func](args, toSelect), function(){
					t._onSelectionChange();
				});
			}
		},

		_start: function(item, extending, isRange){
			var t = this;
			if(!t._selecting && !t._marking && t.arg('enabled')){
				dom.setSelectable(t.grid.domNode, false);
				t._fixFF(1);
				var isSelected = t._isSelected(item);
				isRange = isRange || t.arg('holdingShift');
				if(isRange && t._lastStartItem){
					t._isRange = 1;	//1 as true
					t._toSelect = t._lastToSelect;
					t._startItem = t._lastStartItem;
					t._currentItem = t._lastEndItem;
				}else{
					t._startItem = item;
					t._currentItem = null;
					if(extending || t.arg('holdingCtrl')){
						t._toSelect = !isSelected;
					}else{
						t._toSelect = 1;	//1 as true
						t.clear(1);
					}
				}
				connect.publish('gridClearSelection_' + t.grid.id, [t._type]);
				t._beginAutoScroll();
				t.grid.autoScroll.enabled = true;
				t._lastSelectedIds = t.getSelected();
				t._selecting = 1;	//1 as true
				t._highlight(item);
			}
		},

		_highlight: function(target){
			var t = this;
			if(t._selecting){
				var type = t._type,
					start = t._startItem,
					current = t._currentItem,
					highlight = function(from, to, toHL){
						from = from[type];
						to = to[type];
						var dir = from < to ? 1 : -1;
						for(; from != to; from += dir){
							var item = {};
							item[type] = from;
							t._highlightSingle(item, toHL);
						}
					};
				if(current === null){
					//First time select.
					t._highlightSingle(target, 1);	//1 as true
				}else{
					if(t._inRange(target[type], start[type], current[type])){
						//target is between start and current, some selected should be deselected.
						highlight(current, target, 0);	//0 as false
					}else{
						if(t._inRange(start[type], target[type], current[type])){
							//selection has jumped to different direction, all should be deselected.
							highlight(current, start, 0);	//0 as false
							current = start;
						}
						highlight(target, current, 1);	//1 as true
					}
				}
				t._currentItem = target;
				t._focus(target);
			}
		},

		_end: function(){
			var t = this, g = t.grid;
			if(t._selecting){
				t._fixFF();
				t._endAutoScroll();
				t._selecting = 0;	//0 as false
				t._marking = 1;	//1 as true
				g.autoScroll.enabled = false;
				var d = t._addToSelected(t._startItem, t._currentItem, t._toSelect);
				t._lastToSelect = t._toSelect;
				t._lastStartItem = t._startItem;
				t._lastEndItem = t._currentItem;
				t._startItem = t._currentItem = t._isRange = null;
				Deferred.when(d, function(){
					dom.setSelectable(g.domNode, true);
					t._marking = 0;	//0 as false
					t._onSelectionChange();
				});
			}
		},

		_highlightSingle: function(target, toHighlight){
			toHighlight = toHighlight ? this._toSelect : this._isSelected(target);
			this._doHighlight(target, toHighlight);
		},

		_onSelectionChange: function(){
			var t = this, selectedIds = t.getSelected();
			t.onSelectionChange(selectedIds, t._lastSelectedIds);
			t._lastSelectedIds = selectedIds;
		},

		_inRange: function(value, start, end, isClose){
			return ((value >= start && value <= end) || (value >= end && value <= start)) && (isClose || value != end);
		},

		_fixFF: function(isStart){
			if(sniff('ff')){
				query('.gridxSortNode', this.grid.headerNode).style('overflow', isStart ? 'visible' : '');
			}
		}
	});
});

},
'gridx/core/_Module':function(){
define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/_base/Deferred",
	"dojo/_base/connect",
	"dojo/aspect"
], function(declare, lang, array, Deferred, connect, aspect){

var isFunc = lang.isFunction,
	c = 'connect',	//To reduce code size

	
	moduleBase = declare(/*===== "gridx.core._Module", =====*/[], {
	/*=====
		// name: String
		//		The API set name of this module. This name represents the API set that this module implements, 
		//		instead of this module itself. Two different modules can have the same name, so that they provide
		//		two different implementations of this API set.
		//		For example, simple row selection and extended row selection are two modules implementing a same set of APIs.
		//		They can be used in two different grids in one page (maybe due to different requirements), 
		//		without worrying about conflicting with eachother. And any module of grid can be replaced by a new implementation
		//		without re-writing any other modules.
		//		This property is mandatary.
		name: "SomeModule",
		
		// forced: String[] 
		//		An array of module names. All these modules must exist, and have finished loading before this module loads.
		//		This property can be omitted.
		forced: [],
		
		// optional: String[] 
		//		An array of module names. These modules can be absent, but if they do exist, 
		//		they must be loaded before this module loads.
		//		This property can be omitted.
		optional: [],
		
		// required: []
		//		An array of module names. These modules must exist, but they can be loaded at any time.
		//		This property can be omitted.
		required: [],

		getAPIPath: function(){
			// summary: 
			//		This function defines how to access this module's methods from the grid object.
			// description:
			//		The returned object of this function will be "recursively" mixed into the grid object.
			//		That is, any property of object type in grid will be preserved. For example, if this function
			//		returns { abc: { def: 'ghi'} }, and the grid already has a property called "abc", and 
			//		grid.abc is { jkl: 'mno'}. Then after mixin, grid.abc will still have this jkl property:
			// |	{
			// |		abc: {
			// |			jkl: 'mno',
			// |			def: 'ghi'
			// |		}
			// |	}
			//		This mechanism makes it possible for different modules to provide APIs to a same sub-API object.
			//		Sub-API object is used to provide structures for grid APIs, so as to avoid API conflicts as much as possible.
			//		This function can be omitted.
			return {}
		},

		preload: function(args){
			// summary:
			//		Preload this module.
			// description:
			//		If this function exists, it is called after all modules are created ("new"-ed), but not yet loaded.
			//		At this time point, all the module APIs are already accessable, so all the mothods of those modules that
			//		do not need to load can be used here.
			//		Note that this function is not the "load" process, so the module dependancy is not honored. For example,
			//		if module A forcedly depends on module B, it is still possible that module A.preload is called before 
			//		module B.preload.
			//		This function can be omitted.
		},

		load: function(args, deferStartup){
			// summary: 
			//		Completely load this module.
			// description:
			//		This is the formal loading process of this module. This function will not be called until all the "forced"
			//		and existing "optional" modules are loaded. When the loading process of this module is finished (Note that
			//		this might be an async process), this.loaded.callback() must be called to tell any other modules that
			//		depend on this module.
			this.loaded.callback();
		},

		// grid: gridx.Grid
		//		Reference to the grid
		grid: null,
		
		// model: gridx.core.model.Model
		//		Reference to the grid model
		model: null,

		// loaded: dojo.Deferred
		//		Indicate when this module is completely loaded.
		loaded: null,
	=====*/
	
		
		constructor: function(grid, args){
			var t = this;
			t.grid = grid;
			t.model = grid.model;
			t.loaded = new Deferred;
			t._cnnts = [];
			t._sbscs = [];
			lang.mixin(t, args);
		},

		destroy: function(){
			var f = array.forEach;
			f(this._cnnts, connect.disconnect);
			f(this._sbscs, connect.unsubscribe);
		},

		arg: function(argName, defaultValue, validate){
			// summary:
			//		This method provides a normalized way to access module arguments.
			// description:
			//		There are two ways to provide module arguments when creating grid.
			//		One is to write them in the module declaration object:
			// |	var grid = new Grid({
			// |		......
			// |		modules: [
			// |			{
			// |				moduleClass: gridx.modules.Pagination,
			// |				initialPage: 1		//Put module arguments in module declaration object
			// |			}
			// |		],
			// |		......
			// |	});
			//		This way is straightforward, but quite verbose. And if user would like to set arguments 
			//		for pre-included core modules (e.g. Header, Body), he'd have to explictly declare the
			//		module. This would be too demanding for a grid user, so we need another approach.
			//		The other way is to treat them as grid arguments:
			// |	var grid = new Grid({
			// |		......
			// |		modules: [
			// |			gridx.modules.Pagination
			// |		],
			// |		paginationInitialPage: 1,	//Treat module arguments as grid arguments
			// |		......
			// |	});
			//		In this way, there's no need to provide a module declaration object, but one has to tell
			//		grid for which module the arguments is applied. One can simply put the module name at the
			//		front of every module argument:
			//			"pagination" -- module name
			//			"initialPage" -- module argument
			//			---------------------------------
			//			paginationInitialPage -- module argument treated as grid argument
			//		Note the first letter of the module arugment must be capitalized in the combined argument.
			//
			//		This "arg" method makes it possible to access module arguments without worring about where
			//		they are declared. The priority of every kinds of declarations are:
			//			Module argument > Grid argument > default value > Base class argument (inherited)
			//		After this method, the argument will automatically become module argument. But it is still
			//		recommended to alway access arguments by this.arg(...);
			// argName: String
			//		The name of this argument. This is the "short" name, not the name prefixed with module name.
			// defaultValue: anything?
			//		This value will by asigned to the argument if there's no user provided values.
			// validate: Function?
			//		This is a validation function and it must return a boolean value. If the user provided value
			//		can not pass validation, the default value will be used.
			//		Note if this function is provided, defaultValue must also be provided.
			// returns:
			//		The value of this argument.
			if(arguments.length == 2 && isFunc(defaultValue)){
				validate = defaultValue;
				defaultValue = undefined;
			}
			var t = this, g = t.grid, r = t[argName];
			if(!t.hasOwnProperty(argName)){
				var gridArgName = t.name + argName.substring(0, 1).toUpperCase() + argName.substring(1);
				if(g[gridArgName] === undefined){
					if(defaultValue !== undefined){
						r = defaultValue;
					}
				}else{
					r = g[gridArgName];
				}
			}
			t[argName] = (validate && !validate(r)) ? defaultValue : r;
			return r;	//anything
		},

		aspect: function(obj, e, method, scope, pos){
			var cnnt = aspect[pos || 'after'](obj, e, lang.hitch(scope || this, method), 1);
			this._cnnts.push(cnnt);
			return cnnt;
		},

		connect: function(obj, e, method, scope, flag){
			// summary:
			//		Connect an event handler to an event or function.
			// description:
			//		Similar to widget.connect, the scope of the listener will be default to this module.
			//		But in this API, the scope argument is placed behind the listener function, so as to
			//		avoid arguemnt checking logic.
			//		This method also allows conditional event firing using the flag argument.
			// obj: Object
			// e: String
			// method: String|Function
			// scope: Object?
			// flag: Anything
			//		If provided, the listener will only be triggered when grid._eventFlags[e] is set to flag.
			// returns:
			//		The connect handle
			var t = this,
				cnnt,
				g = t.grid,
				s = scope || t;
			if(obj === g && typeof e == 'string'){
				cnnt = connect[c](obj, e, function(){
					var a = arguments;
					if(g._eventFlags[e] === flag){
						if(isFunc(method)){
							method.apply(s, a);
						}else if(isFunc(s[method])){
							s[method].apply(s, a);
						}
					}
				});
			}else{
				cnnt = connect[c](obj, e, s, method);
			}
			t._cnnts.push(cnnt);
			return cnnt;	//Object
		},

		batchConnect: function(){
			// summary:
			//		Do a lot of connects in a batch.
			// description:
			//		This method is used to optimize code size.
			for(var i = 0, args = arguments, len = args.length; i < len; ++i){
				if(lang.isArrayLike(args[i])){
					this[c].apply(this, args[i]);
				}
			}
		},

		subscribe: function(topic, method, scope){
			// summary:
			//		Subscribe to a topic.
			// description:
			//		This is similar to widget.subscribe, except that the "scope" argument in this method is behind the listener function.
			// returns:
			//		The subscription handle
			var s = connect.subscribe(topic, scope || this, method);
			this._sbscs.push(s);
			return s;	//Object
		}
	}),
	mods = moduleBase._modules = {};
	
	moduleBase.register = function(modClass){
		var p = modClass.prototype;
		return mods[p.name || p.declaredClass] = modClass;
	};
	//! means not string, should be 'eval'ed.
	moduleBase._markupAttrs = ['id', 'name', 'field', 'width', 'dataType', '!formatter', '!decorator', '!sortable'];

	return moduleBase;
});

},
'gridx/core/Column':function(){
define([
	"dojo/_base/declare"
], function(declare){

	
	return declare(/*===== "gridx.core.Column", =====*/[], {
		// summary:
		//		Represents a column of a grid
		// description:
		//		An instance of this class represents a grid column.
		//		This class should not be directly instantiated by users. It should be returned by grid APIs.

		/*=====
		// id: [readonly] String
		//		The ID of this column
		id: null,

		// grid: [readonly] gridx.Grid
		//		Reference to the grid
		grid: null,

		// model: [readonly] grid.core.model.Model
		//		Reference to this grid model
		model: null,
		=====*/

		

		constructor: function(grid, id){
			this.grid = grid;
			this.model = grid.model;
			this.id = id;
		},

		
		index: function(){
			// summary:
			//		Get the index of this column
			// returns:
			//		The index of this column
			var c = this.def();
			return c ? c.index : -1;	//Integer
		},

		
		def: function(){
			// summary:
			//		Get the definition of this column
			// returns:
			//		The definition of this column
			return this.grid._columnsById[this.id];	//Object
		},

		
		cell: function(row, isId, parentId){
			// summary:
			//		Get a cell object in this column
			// row: gridx.core.Row|Integer|String
			//		Row index or row ID or a row object
			// returns:
			//		If the params are valid and the row is in cache return a cell object, else return null
			return this.grid.cell(row, this, isId, parentId);	//gridx.core.Cell|null 
		},

		
		cells: function(start, count, parentId){
			// summary:
			//		Get cells in this column.
			//		If some rows are not in cache, there will be NULLs in the returned array.
			// start: Integer?
			//		The row index of the first cell in the returned array.
			//		If omitted, defaults to 0, so column.cells() gets all the cells.
			// count: Integer?
			//		The number of cells to return.
			//		If omitted, all the cells starting from row 'start' will be returned.
			// returns:
			//		An array of cells in this column
			var t = this,
				g = t.grid,
				cells = [],
				total = g.rowCount(parentId),
				i = start || 0,
				end = count >= 0 ? start + count : total;
			for(; i < end && i < total; ++i){
				cells.push(g.cell(i, t, 0, parentId));	//1 as true
			}
			return cells;	//gridx.core.Cell[]
		},

		
		name: function(){
			// summary:
			//		Get the name of this column.
			// description:
			//		Column name is the string displayed in the grid header cell.
			//		Column names can be anything. Two columns can share one name. But they must have different IDs.
			// returns:
			//		The name of this column
			return this.def().name || '';	//String
		},

		
		setName: function(name){
			// summary:
			//		Set the name of this column
			// name: String
			//		The new name
			// returns:
			//		Return self reference, so as to cascade methods
			this.def().name = name;
			return this;	//gridx.core.Column
		},

		
		field: function(){
			// summary:
			//		Get the store field of this column
			// description:
			//		If a column corresponds to a field in store, this method returns the field.
			//		It's possible for a column to have no store field related.
			// returns:
			//		The store field of this column
			return this.def().field || null;	//String
		},

		
		getWidth: function(){
			// summary:
			//		Get the width of this column
			// returns:
			//		The CSS value of column width
			return this.def().width;	//String
		}
	});
});

},
'dojo/DeferredList':function(){
define("dojo/DeferredList", ["./_base/kernel", "./_base/Deferred", "./_base/array"], function(dojo, Deferred, darray){
	// module:
	//		dojo/DeferredList


dojo.DeferredList = function(/*Array*/ list, /*Boolean?*/ fireOnOneCallback, /*Boolean?*/ fireOnOneErrback, /*Boolean?*/ consumeErrors, /*Function?*/ canceller){
	// summary:
	//		Deprecated, use dojo/promise/all instead.
	//		Provides event handling for a group of Deferred objects.
	// description:
	//		DeferredList takes an array of existing deferreds and returns a new deferred of its own
	//		this new deferred will typically have its callback fired when all of the deferreds in
	//		the given list have fired their own deferreds.  The parameters `fireOnOneCallback` and
	//		fireOnOneErrback, will fire before all the deferreds as appropriate
	// list:
	//		The list of deferreds to be synchronizied with this DeferredList
	// fireOnOneCallback:
	//		Will cause the DeferredLists callback to be fired as soon as any
	//		of the deferreds in its list have been fired instead of waiting until
	//		the entire list has finished
	// fireonOneErrback:
	//		Will cause the errback to fire upon any of the deferreds errback
	// canceller:
	//		A deferred canceller function, see dojo.Deferred
	var resultList = [];
	Deferred.call(this);
	var self = this;
	if(list.length === 0 && !fireOnOneCallback){
		this.resolve([0, []]);
	}
	var finished = 0;
	darray.forEach(list, function(item, i){
		item.then(function(result){
			if(fireOnOneCallback){
				self.resolve([i, result]);
			}else{
				addResult(true, result);
			}
		},function(error){
			if(fireOnOneErrback){
				self.reject(error);
			}else{
				addResult(false, error);
			}
			if(consumeErrors){
				return null;
			}
			throw error;
		});
		function addResult(succeeded, result){
			resultList[i] = [succeeded, result];
			finished++;
			if(finished === list.length){
				self.resolve(resultList);
			}

		}
	});
};
dojo.DeferredList.prototype = new Deferred();

dojo.DeferredList.prototype.gatherResults = function(deferredList){
	// summary:
	//		Gathers the results of the deferreds for packaging
	//		as the parameters to the Deferred Lists' callback
	// deferredList: dojo/DeferredList
	//		The deferred list from which this function gathers results.
	// returns: dojo/DeferredList
	//		The newly created deferred list which packs results as
	//		parameters to its callback.

	var d = new dojo.DeferredList(deferredList, false, true, false);
	d.addCallback(function(results){
		var ret = [];
		darray.forEach(results, function(result){
			ret.push(result[1]);
		});
		return ret;
	});
	return d;
};

return dojo.DeferredList;
});

},
'gridx/modules/HScroller':function(){
define([
	"dojo/_base/declare",
	"dojo/dom-style",
	"dojo/_base/sniff",
	"dojo/_base/Deferred",
	"dojo/query",
	"dojo/dom-geometry",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, domStyle, sniff, Deferred, query, domGeo, metrics, _Module){

	return declare(/*===== "gridx.modules.HScroller", =====*/_Module, {
		// summary:
		//		This module provides basic horizontal scrolling for grid

		name: 'hScroller',

		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				hScroller: this
			};
		},

		constructor: function(){
			var t = this,
				g = t.grid,
				n = g.hScrollerNode;
			g._initEvents(['H'], ['Scroll']);
			t.domNode = n;
			t.container = n.parentNode;
			t.stubNode = n.firstChild;
		},

		preload: function(){
			// tags:
			//		protected extension
			var t = this,
				g = t.grid,
				n = g.hScrollerNode;
			if(!g.autoWidth){
				g.vLayout.register(t, 'container', 'footerNode', 0);
				n.style.display = 'block';
				t.batchConnect(
					[g.columnWidth, 'onUpdate', 'refresh'],
					[n, 'onscroll', '_onScroll']);
				if(sniff('ie')){
					//In IE8 the horizontal scroller bar will disappear when grid.domNode's css classes are changed.
					//In IE6 this.domNode will become a bit taller than usual, still don't know why.
					n.style.height = (metrics.getScrollbar().h + 1) + 'px';
				}
			}
		},
		
		//Public API-----------------------------------------------------------

		scroll: function(left){
			// summary:
			//		Scroll the grid horizontally
			// tags:
			//		package
			// left: Number
			//		The scrollLeft value
			
			var dn = this.domNode;
			if((sniff('webkit') || sniff('ie') < 8) && !this.grid.isLeftToRight()){
				left = dn.scrollWidth - dn.offsetWidth - left;
			}
			if((sniff('ff')) && !this.grid.isLeftToRight() && left > 0){
				left = -left;
			}
			dn.scrollLeft = left;
		},
		
		scrollToColumn: function(colId){
			// summary:
			//	Scroll the grid to make a column fully visible.
			var hNode = this.grid.header.innerNode,
				table = query('table', hNode)[0],
				cells = table.rows[0].cells,
				left = 0,
				right = 0,
				ltr = this.grid.isLeftToRight(),
				scrollLeft = this.domNode.scrollLeft;
			
			if(!ltr && (sniff('webkit') || sniff('ie') < 8)){
				scrollLeft = this.domNode.scrollWidth - scrollLeft - hNode.offsetWidth;//the value relative to col 0
			}
			scrollLeft = Math.abs(scrollLeft);
			//get cell's left border and right border position
			for(var i = 0; i < cells.length; i++){
				right += cells[i].offsetWidth;
				if(cells[i].getAttribute('colid') == colId){
					break;
				}
				left += cells[i].offsetWidth;
			}
			
			//if the cell is not visible, scroll to it
			if(left < scrollLeft){
				this.scroll(left);
			}else if(right > scrollLeft + hNode.offsetWidth){
				this.scroll(right - hNode.offsetWidth);
			}
		},
		
		refresh: function(){
			// summary:
			//		Refresh scroller itself to match grid body
			// tags:
			//		package
			var t = this,
				g = t.grid,
				ltr = g.isLeftToRight(),
				marginLead = ltr ? 'marginLeft' : 'marginRight',
				marginTail = ltr ? 'marginRight' : 'marginLeft',
				lead = g.hLayout.lead,
				tail = g.hLayout.tail,
				w = (g.domNode.clientWidth || domStyle.get(g.domNode, 'width')) - lead - tail,
				headerBorder = domGeo.getBorderExtents(g.header.domNode).w,
				bn = g.header.innerNode,
				pl = domStyle.get(bn, ltr ? 'paddingLeft' : 'paddingRight') || 0,	//TODO: It is special for column lock now.
				s = t.domNode.style,
				sw = bn.firstChild.offsetWidth + pl,
				oldDisplay = s.display,
				newDisplay = (sw <= w) ? 'none' : 'block';
			s[marginLead] = lead + pl + 'px';
			s[marginTail] = tail + 'px';
			//Insure IE does not throw error...
			if(pl > 0){
				s.width = (w - pl < 0 ? 0 : w - pl) + 'px';
			}
			t.stubNode.style.width = (sw - pl < 0 ? 0 : sw - pl) + 'px';
			s.display = newDisplay;
			if(oldDisplay != newDisplay){
				g.vLayout.reLayout();
			}
		},
		
		//Private-----------------------------------------------------------
		_lastLeft: 0,

		_onScroll: function(e){
			//	Fired by h-scroller's scrolling event
			var t = this,
				s = t.domNode.scrollLeft;
			if((sniff('webkit') || sniff('ie') < 8) && !t.grid.isLeftToRight()){
				s = t.domNode.scrollWidth - t.domNode.offsetWidth - s;
			}
			if(t._lastLeft != s){
				t._lastLeft = s;
				t._doScroll();
			}
		},

		_doScroll: function(rowNode){
			//	Sync the grid body with the scroller.
			var t = this,
				g = t.grid;
			g.bodyNode.scrollLeft = t.domNode.scrollLeft;
			g.onHScroll(t._lastLeft);
		}
	});
});

},
'gridx/modules/VScroller':function(){
define("gridx/modules/VScroller", [
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/event",
	"dojo/_base/sniff",
	"dojo/_base/query",
	"dojo/dom-geometry",
	"dojo/keys",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, Deferred, event, sniff, query, domGeo, keys, metrics, _Module){
	
	var st = 'scrollTop';

	return declare(/*===== "gridx.modules.VScroller", =====*/_Module, {
		// summary:
		//		This module provides basic vertical scrolling logic for grid.
		// description:
		//		This module will make the grid body render all rows without paging.
		//		So it is very fast for small client side store, and might be extremely slow
		//		for large server side store.

		name: 'vScroller',
	
		forced: ['body', 'vLayout', 'columnWidth'],

		optional: ['pagination'],
	
		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				vScroller: this
			};
		},

		constructor: function(){
			var t = this,
				g = t.grid,
				dn = t.domNode = g.vScrollerNode;
			t.stubNode = dn.firstChild;
			if(g.autoHeight){
				dn.style.display = 'none';
				if(sniff('ie') < 8){
					dn.style.width = '0px';
				}
			}else{
				var w = metrics.getScrollbar().w,
					ltr = g.isLeftToRight();
				dn.style.width = w + 'px';
				dn.style[ltr ? 'right' : 'left'] = -w + 'px';
				if(sniff('ie') < 8){
					t.stubNode.style.width = w;
				}
			}
		},

		preload: function(args){
			// tags:
			//		protected extension
			this.grid.hLayout.register(null, this.domNode, 1);
		},

		load: function(args, startup){
			// tags:
			//		protected extension
			var t = this,
				g = t.grid,
				bd = g.body,
				dn = t.domNode,
				bn = g.bodyNode;
			t.batchConnect(
				[t.domNode, 'onscroll', '_doScroll'],
				[bn, 'onmousewheel', '_onMouseWheel'],
				[g.mainNode, 'onkeypress', '_onKeyScroll'],
				sniff('ff') && [bn, 'DOMMouseScroll', '_onMouseWheel']);
			t.aspect(g, '_onResizeEnd', '_onBodyChange');
			t.aspect(bd, 'onForcedScroll', '_onForcedScroll');
			t.aspect(bd, 'onRender', '_onBodyChange');
			if(!g.autoHeight){
				t.aspect(bd, 'onEmpty', function(){
					var ds = dn.style;
					ds.display = 'none';
					ds.width = '';
					if(sniff('ie') < 8){
						ds.width = t.stub.style.width = '0px';
					}
					g.hLayout.reLayout();
					g.hScroller.refresh();
				});
			}
			startup.then(function(){
				t._updatePos();
				Deferred.when(t._init(args), function(){
					t.domNode.style.width = '';
					t.loaded.callback();
				});
			});
		},
	
		//Public ----------------------------------------------------

		scrollToRow: function(rowVisualIndex, toTop){
			// summary:
			//		Scroll the grid until the required row is in view.
			// description:
			//		This job will be an asynchronous one if the lazy-loading and lazy-rendering are used.
			// rowVisualIndex: Integer
			//		The visual index of the row
			// toTop: Boolean?
			//		If set this to true, the grid will try to scroll the required row to the top of the view.
			//		Otherwise, the grid will stop scrolling as soon as the row is visible.
			// returns:
			//		A deferred object indicating when the scrolling process is finished. This will be useful
			//		when using lazy-loading and lazy-rendering.
			var d = new Deferred(),
				bn = this.grid.bodyNode,
				dn = this.domNode,
				dif = 0,
				n = query('[visualindex="' + rowVisualIndex + '"]', bn)[0],
				finish = function(success){
					setTimeout(function(){
						d.callback(success);
					}, 5);
				};
			if(n){
				var no = n.offsetTop,
					bs = bn[st];
				if(toTop){
					dn[st] = no;
					finish(true);
					return d;	//dojo.Deferred
				}else if(no < bs){
					dif = no - bs;
				}else if(no + n.offsetHeight > bs + bn.clientHeight){
					dif = no + n.offsetHeight - bs - bn.clientHeight;
				}else{
					finish(true);
					return d;	//dojo.Deferred
				}
				dn[st] += dif;
			}
			finish(!!n);
			return d;	//dojo.Deferred
		},
	
		//Protected -------------------------------------------------
		_init: function(){
			this._onForcedScroll();
		},

		_update: function(){
			var t = this,
				g = t.grid;
			if(!g.autoHeight){
				var bd = g.body,
					bn = g.bodyNode,
					toShow = bd.renderCount < bd.visualCount || bn.scrollHeight > bn.clientHeight,
					ds = t.domNode.style;
					scrollBarWidth = metrics.getScrollbar().w + (sniff('webkit') ? 1 : 0);//Fix a chrome RTL defect
				if(sniff('ie') < 8){
					var w = toShow ? scrollBarWidth + 'px' : '0px';
					t.stubNode.style.width = w;
					ds.width = w;
				}else{
					ds.width = '';
				}
				ds.display = toShow ? '' : 'none';
				t._updatePos();
			}
			g.hLayout.reLayout();
		},

		_updatePos: function(){
			var g = this.grid,
				dn = this.domNode,
				ds = dn.style,
				ltr = g.isLeftToRight(),
				mainBorder = domGeo.getBorderExtents(g.mainNode);
			ds[ltr ? 'right' : 'left'] = -(dn.offsetWidth + (ltr ? mainBorder.r : mainBorder.l)) + 'px';
		},

		_doScroll: function(){
			this.grid.bodyNode[st] = this.domNode[st];
		},
	
		_onMouseWheel: function(e){
			if(this.grid.vScrollerNode.style.display != 'none'){
				var rolled = typeof e.wheelDelta === "number" ? e.wheelDelta / 3 : (-40 * e.detail); 
				this.domNode[st] -= rolled;
				event.stop(e);
			}
		},
	
		_onBodyChange: function(){
			var t = this,
				g = t.grid;
			t._update();
			//IE7 Needs setTimeout
			setTimeout(function(){
				if(!g.bodyNode){
					//fix FF10 - g.bodyNode will be undefined during a quick recreation
					return;
				}				
				t.stubNode.style.height = g.bodyNode.scrollHeight + 'px';
				t._doScroll();
				//FIX IE7 problem:
				g.vScrollerNode[st] = g.vScrollerNode[st] || 0;
			}, 0);
		},

		_onForcedScroll: function(){
			var t = this,
				bd = t.grid.body;
			return t.model.when({
				start: bd.rootStart,
				count: bd.rootCount
			}, function(){
				bd.renderRows(0, bd.visualCount);
			});
		},
	
		_onKeyScroll: function(evt){
			var t = this,
				g = t.grid,
				bd = g.body,
				bn = g.bodyNode,
				focus = g.focus,
				sn = t.domNode,
				rowNode;
			if(bn.childNodes.length && (!focus || focus.currentArea() == 'body')){
				if(evt.keyCode == keys.HOME){
					sn[st] = 0;
					rowNode = bn.firstChild;
				}else if(evt.keyCode == keys.END){
					sn[st] = sn.scrollHeight - sn.offsetHeight;
					rowNode = bn.lastChild;
				}else if(evt.keyCode == keys.PAGE_UP){
					if(!sn[st]){
						rowNode = bn.firstChild;
					}else{
						sn[st] -= sn.offsetHeight;
					}
				}else if(evt.keyCode == keys.PAGE_DOWN){
					if(sn[st] >= sn.scrollHeight - sn.offsetHeight){
						rowNode = bn.lastChild;
					}else{
						sn[st] += sn.offsetHeight;
					}
				}else{
					return;
				}
				if(focus){
					if(rowNode){
						bd._focusCellRow = parseInt(rowNode.getAttribute('visualindex'), 10);
						focus.focusArea('body', 1);	//1 as true
					}else{
						setTimeout(function(){
							var rowNodes = bn.childNodes,
								start = 0,
								end = rowNodes.length - 1,
								containerPos = domGeo.position(bn),
								i, p,
								checkPos = function(idx){
									var rn = rowNodes[idx],
										pos = domGeo.position(rn);
									if(evt.keyCode == keys.PAGE_DOWN){
										var prev = rn.previousSibling;
										if((!prev && pos.y >= containerPos.y) || pos.y == containerPos.y){
											return 0;
										}else if(!prev){
											return -1;
										}else{
											var prevPos = domGeo.position(prev);
											if(prevPos.y < containerPos.y && prevPos.y + prevPos.h >= containerPos.y){
												return 0;
											}else if(prevPos.y > containerPos.y){
												return 1;
											}else{
												return -1;
											}
										}
									}else{
										var post = rn.nextSibling;
										if((!post && pos.y + pos.h <= containerPos.y + containerPos.h) ||
											pos.y + pos.h == containerPos.y + containerPos.h){
											return 0;
										}else if(!post){
											return 1;
										}else{
											var postPos = domGeo.position(post);
											if(postPos.y <= containerPos.y + containerPos.h &&
													postPos.y + postPos.h > containerPos.y + containerPos.h){
												return 0;
											}else if(postPos.y > containerPos.y + containerPos.h){
												return 1;
											}else{
												return -1;
											}
										}
									}
								};
							//Binary search the row to focus
							while(start <= end){
								i = Math.floor((start + end) / 2);
								p = checkPos(i);
								if(p < 0){
									start = i + 1;
								}else if(p > 0){
									end = i - 1;
								}else{
									rowNode = rowNodes[i];
									break;
								}
							}
							if(rowNode){
								bd._focusCellRow = parseInt(rowNode.getAttribute('visualindex'), 10);
								focus.focusArea('body', 1);	//1 as true
							}
						}, 0);
					}
				}
				event.stop(evt);
			}
		}
	});
});

},
'gridx/core/util':function(){
define("gridx/core/util", {
	biSearch: function(arr, comp){
		var i = 0, j = arr.length, k;
		for(k = Math.floor((i + j) / 2); i + 1 < j; k = Math.floor((i + j) / 2)){
			if(comp(arr[k]) > 0){
				j = k;
			}else{
				i = k;
			}
		}
		return arr.length && comp(arr[i]) >= 0 ? i : j;
	}
});

},
'gridx/core/model/_Extension':function(){
define("gridx/core/model/_Extension", [
	'dojo/_base/declare',
	"dojo/_base/lang",
	'dojo/_base/array',
	'dojo/aspect'
], function(declare, lang, array, aspect){

	return declare([], {
		// summary:
		//		Abstract base class for all model components (including cache)
		constructor: function(model){
			var t = this,
				i = t.inner = model._model;
			t._cnnts = [];
			t.model = model;
			model._model = t;
			if(i){
				t.aspect(i, 'onDelete', '_onDelete');
				t.aspect(i, 'onNew', '_onNew');
				t.aspect(i, 'onSet', '_onSet');
			}
		},

		destroy: function(){
			array.forEach(this._cnnts, function(cnnt){
				cnnt.remove();
			});
		},

		aspect: function(obj, e, method, scope, pos){
			var cnnt = aspect[pos || 'after'](obj, e, lang.hitch(scope || this, method), 1);
			this._cnnts.push(cnnt);
			return cnnt;
		},

		//Events----------------------------------------------------------------------
		//Make sure every extension has the oppotunity to decide when to fire an event at its level.
		_onNew: function(){
			this.onNew.apply(this, arguments);
		},

		_onSet: function(){
			this.onSet.apply(this, arguments);
		},

		_onDelete: function(){
			this.onDelete.apply(this, arguments);
		},

		onNew: function(){},
		onDelete: function(){},
		onSet: function(){},

		//Protected-----------------------------------------------------------------
		_call: function(method, args){
			var t = this,
				m = t[method],
				n = t.inner;
			return m ? m.apply(t, args || []) : n && n._call(method, args);
		},

		_mixinAPI: function(){
			var i,
				m = this.model,
				args = arguments,
				api = function(method){
					return function(){
						return m._model._call(method, arguments);
					};
				};
			for(i = args.length - 1; i >= 0; --i){
				m[args[i]] = api(args[i]);
			}
		}
	});
});

},
'dojox/html/metrics':function(){
define("dojox/html/metrics", ["dojo/_base/kernel","dojo/_base/lang", "dojo/_base/sniff", "dojo/ready", "dojo/_base/unload",
		"dojo/_base/window", "dojo/dom-geometry"],
  function(kernel,lang,has,ready,UnloadUtil,Window,DOMGeom){
	var dhm = lang.getObject("dojox.html.metrics",true);
	var dojox = lang.getObject("dojox");

	//	derived from Morris John's emResized measurer
	dhm.getFontMeasurements = function(){
		// summary:
		//		Returns an object that has pixel equivilents of standard font size values.
		var heights = {
			'1em':0, '1ex':0, '100%':0, '12pt':0, '16px':0, 'xx-small':0, 'x-small':0,
			'small':0, 'medium':0, 'large':0, 'x-large':0, 'xx-large':0
		};
	
		if(has("ie")){
			//	we do a font-size fix if and only if one isn't applied already.
			//	NOTE: If someone set the fontSize on the HTML Element, this will kill it.
			Window.doc.documentElement.style.fontSize="100%";
		}
	
		//	set up the measuring node.
		var div=Window.doc.createElement("div");
		var ds = div.style;
		ds.position="absolute";
		ds.left="-100px";
		ds.top="0";
		ds.width="30px";
		ds.height="1000em";
		ds.borderWidth="0";
		ds.margin="0";
		ds.padding="0";
		ds.outline="0";
		ds.lineHeight="1";
		ds.overflow="hidden";
		Window.body().appendChild(div);
	
		//	do the measurements.
		for(var p in heights){
			ds.fontSize = p;
			heights[p] = Math.round(div.offsetHeight * 12/16) * 16/12 / 1000;
		}
		
		Window.body().removeChild(div);
		div = null;
		return heights; 	//	object
	};

	var fontMeasurements = null;
	
	dhm.getCachedFontMeasurements = function(recalculate){
		if(recalculate || !fontMeasurements){
			fontMeasurements = dhm.getFontMeasurements();
		}
		return fontMeasurements;
	};

	var measuringNode = null, empty = {};
	dhm.getTextBox = function(/* String */ text, /* Object */ style, /* String? */ className){
		var m, s;
		if(!measuringNode){
			m = measuringNode = Window.doc.createElement("div");
			// Container that we can set contraints on so that it doesn't
			// trigger a scrollbar.
			var c = Window.doc.createElement("div");
			c.appendChild(m);
			s = c.style;
			s.overflow='scroll';
			s.position = "absolute";
			s.left = "0px";
			s.top = "-10000px";
			s.width = "1px";
			s.height = "1px";
			s.visibility = "hidden";
			s.borderWidth = "0";
			s.margin = "0";
			s.padding = "0";
			s.outline = "0";
			Window.body().appendChild(c);
		}else{
			m = measuringNode;
		}
		// reset styles
		m.className = "";
		s = m.style;
		s.borderWidth = "0";
		s.margin = "0";
		s.padding = "0";
		s.outline = "0";
		// set new style
		if(arguments.length > 1 && style){
			for(var i in style){
				if(i in empty){ continue; }
				s[i] = style[i];
			}
		}
		// set classes
		if(arguments.length > 2 && className){
			m.className = className;
		}
		// take a measure
		m.innerHTML = text;
		var box = DOMGeom.position(m);
		// position doesn't report right (reports 1, since parent is 1)
		// So we have to look at the scrollWidth to get the real width
		// Height is right.
		box.w = m.parentNode.scrollWidth;
		return box;
	};

	//	determine the scrollbar sizes on load.
	var scroll={ w:16, h:16 };
	dhm.getScrollbar=function(){ return { w:scroll.w, h:scroll.h }; };

	dhm._fontResizeNode = null;

	dhm.initOnFontResize = function(interval){
		var f = dhm._fontResizeNode = Window.doc.createElement("iframe");
		var fs = f.style;
		fs.position = "absolute";
		fs.width = "5em";
		fs.height = "10em";
		fs.top = "-10000px";
		fs.display = "none";
		if(has("ie")){
			f.onreadystatechange = function(){
				if(f.contentWindow.document.readyState == "complete"){
					f.onresize = f.contentWindow.parent[dojox._scopeName].html.metrics._fontresize;
				}
			};
		}else{
			f.onload = function(){
				f.contentWindow.onresize = f.contentWindow.parent[dojox._scopeName].html.metrics._fontresize;
			};
		}
		//The script tag is to work around a known firebug race condition.  See comments in bug #9046
		f.setAttribute("src", "javascript:'<html><head><script>if(\"loadFirebugConsole\" in window){window.loadFirebugConsole();}</script></head><body></body></html>'");
		Window.body().appendChild(f);
		dhm.initOnFontResize = function(){};
	};

	dhm.onFontResize = function(){};
	dhm._fontresize = function(){
		dhm.onFontResize();
	};

	UnloadUtil.addOnUnload(function(){
		// destroy our font resize iframe if we have one
		var f = dhm._fontResizeNode;
		if(f){
			if(has("ie") && f.onresize){
				f.onresize = null;
			}else if(f.contentWindow && f.contentWindow.onresize){
				f.contentWindow.onresize = null;
			}
			dhm._fontResizeNode = null;
		}
	});

	ready(function(){
		// getScrollbar metrics node
		try{
			var n=Window.doc.createElement("div");
			n.style.cssText = "top:0;left:0;width:100px;height:100px;overflow:scroll;position:absolute;visibility:hidden;";
			Window.body().appendChild(n);
			scroll.w = n.offsetWidth - n.clientWidth;
			scroll.h = n.offsetHeight - n.clientHeight;
			Window.body().removeChild(n);
			//console.log("Scroll bar dimensions: ", scroll);
			delete n;
		}catch(e){}

		// text size poll setup
		if("fontSizeWatch" in kernel.config && !!kernel.config.fontSizeWatch){
			dhm.initOnFontResize();
		}
	});
	return dhm;
});
},
'gridx/modules/AutoScroll':function(){
define("gridx/modules/AutoScroll", [
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/dom-geometry",
	"../core/_Module"
], function(declare, win, domGeometry, _Module){

	return _Module.register(
	declare(_Module, {

		name: 'autoScroll',

		constructor: function(){
			this.connect(win.doc, 'mousemove', '_onMouseMove');
		},

		getAPIPath: function(){
			return {
				autoScroll: this
			};
		},
	
		//Public ---------------------------------------------------------------------
		enabled: false,

		vertical: true,

		horizontal: true,

		margin: 20,

		//Private ---------------------------------------------------------------------

		_timeout: 100,

		_step: 10,

		_maxMargin: 100,

		_onMouseMove: function(e){
			var t = this;
			if(t.arg('enabled')){
				var d1, d2, g = t.grid, m = t.arg('margin'), 
					pos = domGeometry.position(g.bodyNode);
				if(t.arg('vertical') && g.vScroller){
					d1 = e.clientY - pos.y - m;
					d2 = d1 + 2 * m - pos.h;
					t._vdir = d1 < 0 ? d1 : (d2 > 0 ? d2 : 0);
				}
				if(t.arg('horizontal') && g.hScroller){
					d1 = e.clientX - pos.x - m;
					d2 = d1 + 2 * m - pos.w;
					t._hdir = d1 < 0 ? d1 : (d2 > 0 ? d2 : 0);
				}
				if(!t._handler){
					t._scroll();
				}
			}
		},

		_scroll: function(){
			var t = this;
			if(t.arg('enabled')){
				var dir, a, needScroll, g = t.grid,
					m = t._maxMargin, s = t._step,
					v = t._vdir, h = t._hdir;
				if(t.arg('vertical') && v){
					dir = v > 0 ? 1 : -1;
					a = Math.min(m, Math.abs(v)) / s;
					a = (a < 1 ? 1 : a) * s * dir;
					g.vScroller.domNode.scrollTop += a;
					needScroll = 1;
				}
				if(t.arg('horizontal') && h){
					dir = h > 0 ? 1 : -1;
					a = Math.min(m, Math.abs(h)) / s;
					a = (a < 1 ? 1 : a) * s * dir;
					g.hScroller.domNode.scrollLeft += a;
					needScroll = 1;
				}
				if(needScroll){
					t._handler = setTimeout(function(){
						t._scroll();
					}, t._timeout);
					return;
				}
			}
			delete t._handler;
		}
	}));
});

},
'gridx/core/model/cache/_Cache':function(){
define("gridx/core/model/cache/_Cache", [
	'dojo/_base/declare',
	'dojo/_base/array',
	'dojo/_base/lang',
	'dojo/_base/Deferred',
	'../_Extension'
], function(declare, array, lang, Deferred, _Extension){

	var hitch = lang.hitch,
		mixin = lang.mixin,
		indexOf = array.indexOf;

	function _onBegin(size){
		//Private function to be called in the scope of cache
		this._size[''] = parseInt(size, 10);
	}

	function _onComplete(d, start, items){
		//Private function to be called in the scope of cache
		try{
			var t = this, i = 0, item;
			for(; item = items[i]; ++i){
				t._addRow(t.store.getIdentity(item), start + i, t._itemToObject(item), item);
			}
			d.callback();
		}catch(e){
			d.errback(e);
		}
	}

	return declare(_Extension, {
		// summary:
		//		Abstract base cache class, providing cache data structure and some common cache functions.
		constructor: function(model, args){
			var t = this;
			t.setStore(args.store);
			t.columns = args._columnsById;
			t._mixinAPI('byIndex', 'byId', 'indexToId', 'idToIndex', 'size', 'treePath', 'parentId',
				'hasChildren', 'children', 'keep', 'free');
		},

		destroy: function(){
			this.inherited(arguments);
			this.clear();
		},

		setStore: function(store){
			var t = this,
				c = 'aspect',
				old = store.fetch;
			t.clear();
			t.store = store;
			if(!old && store.notify){
				//The store implements the dojo.store.Observable API
				t[c](store, 'notify', function(item, id){
					if(item === undefined){
						t._onDelete(id);
					}else if(id === undefined){
						t._onNew(item);
					}else{
						t._onSet(item);
					}
				});
			}else{
				t[c](store, old ? "onSet" : "put", "_onSet");
				t[c](store, old ? "onNew" : "add", "_onNew");
				t[c](store, old ? "onDelete" : "remove", "_onDelete");
			}
		},

		//Public----------------------------------------------
		clear: function(){
			var t = this;
			t._filled = 0;
			t._priority = [];
			t._struct = {};
			t._cache = {};
			t._size = {};
			//virtual root node, with id ''.
			t._struct[''] = [];
			t._size[''] = -1;
		},

		byIndex: function(index, parentId){
			this._init('byIndex', arguments);
			return this._cache[this.indexToId(index, parentId)];
		},

		byId: function(id){
			this._init('byId', arguments);
			return this._cache[id];
		},

		indexToId: function(index, parentId){
			this._init('indexToId', arguments);
			var items = this._struct[this.model.isId(parentId) ? parentId : ''];
			return typeof index == 'number' && index >= 0 ? items && items[index + 1] : undefined;
		},

		idToIndex: function(id){
			this._init('idToIndex', arguments);
			var s = this._struct,
				pid = s[id] && s[id][0],
				index = indexOf(s[pid] || [], id);
			return index > 0 ? index - 1 : -1;
		},

		treePath: function(id){
			this._init('treePath', arguments);
			var s = this._struct,
				path = [];
			while(id !== undefined){
				path.unshift(id);
				id = s[id] && s[id][0];
			}
			if(path[0] !== ''){
				path = [];
			}else{
				path.pop();
			}
			return path;
		},

		parentId: function(id){
			return this.treePath(id).pop();
		},

		hasChildren: function(id){
			var t = this,
				s = t.store,
				c;
			t._init('hasChildren', arguments);
			c = t.byId(id);
			return s.hasChildren && s.hasChildren(id, c && c.item);
		},

		children: function(parentId){
			this._init('children', arguments);
			parentId = this.model.isId(parentId) ? parentId : '';
			var size = this._size[parentId],
				children = [],
				i = 0;
			for(; i < size; ++i){
				children.push(this.indexToId(i, parentId));
			}
			return children;
		},

		size: function(parentId){
			this._init('size', arguments);
			var s = this._size[this.model.isId(parentId) ? parentId : ''];
			return s >= 0 ? s : -1;
		},

		//Events--------------------------------------------
		onBeforeFetch: function(){},
		onAfterFetch: function(){},
		onLoadRow: function(){},

		onSetColumns: function(columns){
			var t = this, id, c, colId, col;
			t.columns = columns;
			for(id in t._cache){
				c = t._cache[id];
				for(colId in columns){
					col = columns[colId];
					c.data[colId] = t._formatCell(col.id, c.rawData);
				}
			}
		},

		//Protected-----------------------------------------
		_itemToObject: function(item){
			var s = this.store,
				obj = {};
			if(s.fetch){
				array.forEach(s.getAttributes(item), function(attr){
					obj[attr] = s.getValue(item, attr);
				});
				return obj;	
			}
			return item;
		},

		_formatCell: function(colId, rawData){
			var col = this.columns[colId];
			return col.formatter ? col.formatter(rawData) : rawData[col.field || colId];
		},

		_formatRow: function(rowData){
			var cols = this.columns, res = {}, colId;
			for(colId in cols){
				res[colId] = this._formatCell(colId, rowData);
			}
			return res;
		},

		_addRow: function(id, index, rowData, item, parentId){
			var t = this,
				st = t._struct,
				pr = t._priority,
				pid = t.model.isId(parentId) ? parentId : '',
				ids = st[pid],
				i;
			if(!ids){
				throw new Error("Fatal error of cache._addRow: parent item " + pid + " of " + id + " is not loaded");
			}
			if(!ids[index + 1]){
				ids[index + 1] = id;
			}else if(ids[index + 1] !== id){
				throw new Error("Fatal error of cache._addRow: different row id " + id + " and " + ids[index + 1] + " for same row index " + index);
			}
			st[id] = st[id] || [pid];
			if(pid === ''){
				i = indexOf(pr, id);
				if(i >= 0){
					pr.splice(i, 1);
				}
				pr.push(id);
			}
			t._cache[id] = {
				data: t._formatRow(rowData),
				rawData: rowData,
				item: item
			};
			t.onLoadRow(id);
		},

		_loadChildren: function(parentId){
			var t = this,
				d = new Deferred(),
				s = t.store,
				row = t.byId(parentId),
				items = row && s.getChildren && s.getChildren(row.item) || [];
			Deferred.when(items, function(items){
				var i = 0,
					item,
					len = t._size[parentId] = items.length;
				for(; i < len; ++i){
					item = items[i];
					t._addRow(s.getIdentity(item), i, t._itemToObject(item), item, parentId);
				}
				d.callback();
			}, hitch(d, d.errback));
			return d;
		},

		_storeFetch: function(options, onFetched){
//            console.debug("\tFETCH start: ",
//                    options.start, ", count: ",
//                    options.count, ", end: ",
//                    options.count && options.start + options.count - 1, ", options:",
//                    this.options);

			var t = this,
				s = t.store,
				d = new Deferred(),
				req = mixin({}, t.options || {}, options),
				onBegin = hitch(t, _onBegin),
				onComplete = hitch(t, _onComplete, d, options.start),
				onError = hitch(d, d.errback);
			t._filled = 1;	//1 as true;
			t.onBeforeFetch();
			if(s.fetch){
				s.fetch(mixin(req, {
					onBegin: onBegin,
					onComplete: onComplete,
					onError: onError
				}));
			}else{
				var results = s.query(req.query || {}, req);
				Deferred.when(results.total, onBegin);
				Deferred.when(results, onComplete, onError);
			}
			d.then(hitch(t, t.onAfterFetch));
			return d;
		},

		//--------------------------------------------------------------------------
		_onSet: function(item){
			var t = this,
				id = t.store.getIdentity(item),
				index = t.idToIndex(id),
				path = t.treePath(id),
				old = t._cache[id];
			if(path.length){
				t._addRow(id, index, t._itemToObject(item), item, path.pop());
			}
			t.onSet(id, index, t._cache[id], old);
		},
	
		_onNew: function(item, parentInfo){
			var t = this, s = t.store,
				row = t._itemToObject(item),
				parentItem = parentInfo && parentInfo[s.fetch ? 'item' : 'parent'],
				parentId = parentItem ? s.getIdentity(parentItem) : '',
				size = t._size[''];
			t.clear();
			t.onNew(s.getIdentity(item), 0, {
				data: t._formatRow(row),
				rawData: row,
				item: item
			});
			if(!parentItem && size >= 0){
				t._size[''] = size + 1;
				t.model._onSizeChange();
			}
		},
	
		_onDelete: function(item){
			var t = this, s = t.store, st = t._struct,
				id = s.fetch ? s.getIdentity(item) : item, 
				path = t.treePath(id);
			if(path.length){
				var children, i, j, ids = [id],
					parentId = path.pop(),
					sz = t._size,
					size = sz[''],
					index = indexOf(st[parentId], id);
				//This must exist, because we've already have treePath
				st[parentId].splice(index, 1);
				--sz[parentId];
	
				for(i = 0; i < ids.length; ++i){
					children = st[ids[i]];
					if(children){
						for(j = children.length - 1; j > 0; --j){
							ids.push(children[j]);
						}
					}
				}
				for(i = ids.length - 1; i >= 0; --i){
					j = ids[i];
					delete t._cache[j];
					delete st[j];
					delete sz[j];
				}
				i = indexOf(t._priority, id);
				if(i >= 0){
					t._priority.splice(i, 1);
				}
				t.onDelete(id, index - 1);
				if(!parentId && size >= 0){
					sz[''] = size - 1;
					t.model._onSizeChange();
				}
			}else{
				t.onDelete(id);
//                var onBegin = hitch(t, _onBegin),
//                    req = mixin({}, t.options || {}, {
//                        start: 0,
//                        count: 1
//                    });
//                setTimeout(function(){
//                    if(s.fetch){
//                        s.fetch(mixin(req, {
//                            onBegin: onBegin
//                        }));
//                    }else{
//                        var results = s.query(req.query, req);
//                        Deferred.when(results.total, onBegin);
//                    }
//                }, 10);
			}
		}
	});
});

},
'dojo/dnd/Source':function(){
define("dojo/dnd/Source", [
	"../_base/array", "../_base/connect", "../_base/declare", "../_base/kernel", "../_base/lang",
	"../dom-class", "../dom-geometry", "../mouse", "../ready", "../topic",
	"./common", "./Selector", "./Manager"
], function(array, connect, declare, kernel, lang, domClass, domGeom, mouse, ready, topic,
			dnd, Selector, Manager){

// module:
//		dojo/dnd/Source

/*
	Container property:
		"Horizontal"- if this is the horizontal container
	Source states:
		""			- normal state
		"Moved"		- this source is being moved
		"Copied"	- this source is being copied
	Target states:
		""			- normal state
		"Disabled"	- the target cannot accept an avatar
	Target anchor state:
		""			- item is not selected
		"Before"	- insert point is before the anchor
		"After"		- insert point is after the anchor
*/

/*=====
var __SourceArgs = {
	// summary:
	//		a dict of parameters for DnD Source configuration. Note that any
	//		property on Source elements may be configured, but this is the
	//		short-list
	// isSource: Boolean?
	//		can be used as a DnD source. Defaults to true.
	// accept: Array?
	//		list of accepted types (text strings) for a target; defaults to
	//		["text"]
	// autoSync: Boolean
	//		if true refreshes the node list on every operation; false by default
	// copyOnly: Boolean?
	//		copy items, if true, use a state of Ctrl key otherwise,
	//		see selfCopy and selfAccept for more details
	// delay: Number
	//		the move delay in pixels before detecting a drag; 0 by default
	// horizontal: Boolean?
	//		a horizontal container, if true, vertical otherwise or when omitted
	// selfCopy: Boolean?
	//		copy items by default when dropping on itself,
	//		false by default, works only if copyOnly is true
	// selfAccept: Boolean?
	//		accept its own items when copyOnly is true,
	//		true by default, works only if copyOnly is true
	// withHandles: Boolean?
	//		allows dragging only by handles, false by default
	// generateText: Boolean?
	//		generate text node for drag and drop, true by default
};
=====*/

// For back-compat, remove in 2.0.
if(!kernel.isAsync){
	ready(0, function(){
		var requires = ["dojo/dnd/AutoSource", "dojo/dnd/Target"];
		require(requires);	// use indirection so modules not rolled into a build
	});
}

var Source = declare("dojo.dnd.Source", Selector, {
	// summary:
	//		a Source object, which can be used as a DnD source, or a DnD target

	// object attributes (for markup)
	isSource: true,
	horizontal: false,
	copyOnly: false,
	selfCopy: false,
	selfAccept: true,
	skipForm: false,
	withHandles: false,
	autoSync: false,
	delay: 0, // pixels
	accept: ["text"],
	generateText: true,

	constructor: function(/*DOMNode|String*/ node, /*__SourceArgs?*/ params){
		// summary:
		//		a constructor of the Source
		// node:
		//		node or node's id to build the source on
		// params:
		//		any property of this class may be configured via the params
		//		object which is mixed-in to the `dojo/dnd/Source` instance
		lang.mixin(this, lang.mixin({}, params));
		var type = this.accept;
		if(type.length){
			this.accept = {};
			for(var i = 0; i < type.length; ++i){
				this.accept[type[i]] = 1;
			}
		}
		// class-specific variables
		this.isDragging = false;
		this.mouseDown = false;
		this.targetAnchor = null;
		this.targetBox = null;
		this.before = true;
		this._lastX = 0;
		this._lastY = 0;
		// states
		this.sourceState  = "";
		if(this.isSource){
			domClass.add(this.node, "dojoDndSource");
		}
		this.targetState  = "";
		if(this.accept){
			domClass.add(this.node, "dojoDndTarget");
		}
		if(this.horizontal){
			domClass.add(this.node, "dojoDndHorizontal");
		}
		// set up events
		this.topics = [
			topic.subscribe("/dnd/source/over", lang.hitch(this, "onDndSourceOver")),
			topic.subscribe("/dnd/start",  lang.hitch(this, "onDndStart")),
			topic.subscribe("/dnd/drop",   lang.hitch(this, "onDndDrop")),
			topic.subscribe("/dnd/cancel", lang.hitch(this, "onDndCancel"))
		];
	},

	// methods
	checkAcceptance: function(source, nodes){
		// summary:
		//		checks if the target can accept nodes from this source
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		if(this == source){
			return !this.copyOnly || this.selfAccept;
		}
		for(var i = 0; i < nodes.length; ++i){
			var type = source.getItem(nodes[i].id).type;
			// type instanceof Array
			var flag = false;
			for(var j = 0; j < type.length; ++j){
				if(type[j] in this.accept){
					flag = true;
					break;
				}
			}
			if(!flag){
				return false;	// Boolean
			}
		}
		return true;	// Boolean
	},
	copyState: function(keyPressed, self){
		// summary:
		//		Returns true if we need to copy items, false to move.
		//		It is separated to be overwritten dynamically, if needed.
		// keyPressed: Boolean
		//		the "copy" key was pressed
		// self: Boolean?
		//		optional flag that means that we are about to drop on itself

		if(keyPressed){ return true; }
		if(arguments.length < 2){
			self = this == Manager.manager().target;
		}
		if(self){
			if(this.copyOnly){
				return this.selfCopy;
			}
		}else{
			return this.copyOnly;
		}
		return false;	// Boolean
	},
	destroy: function(){
		// summary:
		//		prepares the object to be garbage-collected
		Source.superclass.destroy.call(this);
		array.forEach(this.topics, function(t){t.remove();});
		this.targetAnchor = null;
	},

	// mouse event processors
	onMouseMove: function(e){
		// summary:
		//		event processor for onmousemove
		// e: Event
		//		mouse event
		if(this.isDragging && this.targetState == "Disabled"){ return; }
		Source.superclass.onMouseMove.call(this, e);
		var m = Manager.manager();
		if(!this.isDragging){
			if(this.mouseDown && this.isSource &&
					(Math.abs(e.pageX - this._lastX) > this.delay || Math.abs(e.pageY - this._lastY) > this.delay)){
				var nodes = this.getSelectedNodes();
				if(nodes.length){
					m.startDrag(this, nodes, this.copyState(dnd.getCopyKeyState(e), true));
				}
			}
		}
		if(this.isDragging){
			// calculate before/after
			var before = false;
			if(this.current){
				if(!this.targetBox || this.targetAnchor != this.current){
					this.targetBox = domGeom.position(this.current, true);
				}
				if(this.horizontal){
					// In LTR mode, the left part of the object means "before", but in RTL mode it means "after".
					before = (e.pageX - this.targetBox.x < this.targetBox.w / 2) == domGeom.isBodyLtr(this.current.ownerDocument);
				}else{
					before = (e.pageY - this.targetBox.y) < (this.targetBox.h / 2);
				}
			}
			if(this.current != this.targetAnchor || before != this.before){
				this._markTargetAnchor(before);
				m.canDrop(!this.current || m.source != this || !(this.current.id in this.selection));
			}
		}
	},
	onMouseDown: function(e){
		// summary:
		//		event processor for onmousedown
		// e: Event
		//		mouse event
		if(!this.mouseDown && this._legalMouseDown(e) && (!this.skipForm || !dnd.isFormElement(e))){
			this.mouseDown = true;
			this._lastX = e.pageX;
			this._lastY = e.pageY;
			Source.superclass.onMouseDown.call(this, e);
		}
	},
	onMouseUp: function(e){
		// summary:
		//		event processor for onmouseup
		// e: Event
		//		mouse event
		if(this.mouseDown){
			this.mouseDown = false;
			Source.superclass.onMouseUp.call(this, e);
		}
	},

	// topic event processors
	onDndSourceOver: function(source){
		// summary:
		//		topic event processor for /dnd/source/over, called when detected a current source
		// source: Object
		//		the source which has the mouse over it
		if(this !== source){
			this.mouseDown = false;
			if(this.targetAnchor){
				this._unmarkTargetAnchor();
			}
		}else if(this.isDragging){
			var m = Manager.manager();
			m.canDrop(this.targetState != "Disabled" && (!this.current || m.source != this || !(this.current.id in this.selection)));
		}
	},
	onDndStart: function(source, nodes, copy){
		// summary:
		//		topic event processor for /dnd/start, called to initiate the DnD operation
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise
		if(this.autoSync){ this.sync(); }
		if(this.isSource){
			this._changeState("Source", this == source ? (copy ? "Copied" : "Moved") : "");
		}
		var accepted = this.accept && this.checkAcceptance(source, nodes);
		this._changeState("Target", accepted ? "" : "Disabled");
		if(this == source){
			Manager.manager().overSource(this);
		}
		this.isDragging = true;
	},
	onDndDrop: function(source, nodes, copy, target){
		// summary:
		//		topic event processor for /dnd/drop, called to finish the DnD operation
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise
		// target: Object
		//		the target which accepts items
		if(this == target){
			// this one is for us => move nodes!
			this.onDrop(source, nodes, copy);
		}
		this.onDndCancel();
	},
	onDndCancel: function(){
		// summary:
		//		topic event processor for /dnd/cancel, called to cancel the DnD operation
		if(this.targetAnchor){
			this._unmarkTargetAnchor();
			this.targetAnchor = null;
		}
		this.before = true;
		this.isDragging = false;
		this.mouseDown = false;
		this._changeState("Source", "");
		this._changeState("Target", "");
	},

	// local events
	onDrop: function(source, nodes, copy){
		// summary:
		//		called only on the current target, when drop is performed
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise

		if(this != source){
			this.onDropExternal(source, nodes, copy);
		}else{
			this.onDropInternal(nodes, copy);
		}
	},
	onDropExternal: function(source, nodes, copy){
		// summary:
		//		called only on the current target, when drop is performed
		//		from an external source
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise

		var oldCreator = this._normalizedCreator;
		// transferring nodes from the source to the target
		if(this.creator){
			// use defined creator
			this._normalizedCreator = function(node, hint){
				return oldCreator.call(this, source.getItem(node.id).data, hint);
			};
		}else{
			// we have no creator defined => move/clone nodes
			if(copy){
				// clone nodes
				this._normalizedCreator = function(node /*=====, hint =====*/){
					var t = source.getItem(node.id);
					var n = node.cloneNode(true);
					n.id = dnd.getUniqueId();
					return {node: n, data: t.data, type: t.type};
				};
			}else{
				// move nodes
				this._normalizedCreator = function(node /*=====, hint =====*/){
					var t = source.getItem(node.id);
					source.delItem(node.id);
					return {node: node, data: t.data, type: t.type};
				};
			}
		}
		this.selectNone();
		if(!copy && !this.creator){
			source.selectNone();
		}
		this.insertNodes(true, nodes, this.before, this.current);
		if(!copy && this.creator){
			source.deleteSelectedNodes();
		}
		this._normalizedCreator = oldCreator;
	},
	onDropInternal: function(nodes, copy){
		// summary:
		//		called only on the current target, when drop is performed
		//		from the same target/source
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise

		var oldCreator = this._normalizedCreator;
		// transferring nodes within the single source
		if(this.current && this.current.id in this.selection){
			// do nothing
			return;
		}
		if(copy){
			if(this.creator){
				// create new copies of data items
				this._normalizedCreator = function(node, hint){
					return oldCreator.call(this, this.getItem(node.id).data, hint);
				};
			}else{
				// clone nodes
				this._normalizedCreator = function(node/*=====, hint =====*/){
					var t = this.getItem(node.id);
					var n = node.cloneNode(true);
					n.id = dnd.getUniqueId();
					return {node: n, data: t.data, type: t.type};
				};
			}
		}else{
			// move nodes
			if(!this.current){
				// do nothing
				return;
			}
			this._normalizedCreator = function(node /*=====, hint =====*/){
				var t = this.getItem(node.id);
				return {node: node, data: t.data, type: t.type};
			};
		}
		this._removeSelection();
		this.insertNodes(true, nodes, this.before, this.current);
		this._normalizedCreator = oldCreator;
	},
	onDraggingOver: function(){
		// summary:
		//		called during the active DnD operation, when items
		//		are dragged over this target, and it is not disabled
	},
	onDraggingOut: function(){
		// summary:
		//		called during the active DnD operation, when items
		//		are dragged away from this target, and it is not disabled
	},

	// utilities
	onOverEvent: function(){
		// summary:
		//		this function is called once, when mouse is over our container
		Source.superclass.onOverEvent.call(this);
		Manager.manager().overSource(this);
		if(this.isDragging && this.targetState != "Disabled"){
			this.onDraggingOver();
		}
	},
	onOutEvent: function(){
		// summary:
		//		this function is called once, when mouse is out of our container
		Source.superclass.onOutEvent.call(this);
		Manager.manager().outSource(this);
		if(this.isDragging && this.targetState != "Disabled"){
			this.onDraggingOut();
		}
	},
	_markTargetAnchor: function(before){
		// summary:
		//		assigns a class to the current target anchor based on "before" status
		// before: Boolean
		//		insert before, if true, after otherwise
		if(this.current == this.targetAnchor && this.before == before){ return; }
		if(this.targetAnchor){
			this._removeItemClass(this.targetAnchor, this.before ? "Before" : "After");
		}
		this.targetAnchor = this.current;
		this.targetBox = null;
		this.before = before;
		if(this.targetAnchor){
			this._addItemClass(this.targetAnchor, this.before ? "Before" : "After");
		}
	},
	_unmarkTargetAnchor: function(){
		// summary:
		//		removes a class of the current target anchor based on "before" status
		if(!this.targetAnchor){ return; }
		this._removeItemClass(this.targetAnchor, this.before ? "Before" : "After");
		this.targetAnchor = null;
		this.targetBox = null;
		this.before = true;
	},
	_markDndStatus: function(copy){
		// summary:
		//		changes source's state based on "copy" status
		this._changeState("Source", copy ? "Copied" : "Moved");
	},
	_legalMouseDown: function(e){
		// summary:
		//		checks if user clicked on "approved" items
		// e: Event
		//		mouse event

		// accept only the left mouse button, or the left finger
		if(e.type != "touchstart" && !mouse.isLeft(e)){ return false; }

		if(!this.withHandles){ return true; }

		// check for handles
		for(var node = e.target; node && node !== this.node; node = node.parentNode){
			if(domClass.contains(node, "dojoDndHandle")){ return true; }
			if(domClass.contains(node, "dojoDndItem") || domClass.contains(node, "dojoDndIgnore")){ break; }
		}
		return false;	// Boolean
	}
});

return Source;

});

},
'gridx/modules/ColumnWidth':function(){
define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/Deferred",
	"dojo/_base/query",
	"dojo/_base/sniff",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/keys",
	"../core/_Module"
], function(declare, array, Deferred, query, sniff, domGeometry, domClass, domStyle, keys, _Module){

	return declare(/*===== "gridx.modules.ColumnWidth", =====*/_Module, {
		// summary:
		//		Manages column width distribution, allow grid autoWidth and column autoResize.

		name: 'columnWidth',
	
		forced: ['hLayout'],

		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				columnWidth: this
			};
		},

		constructor: function(){
			this._init();
		},

		preload: function(){
			// tags:
			//		protected extension
			var t = this,
				g = t.grid;
			t._ready = new Deferred();
			t.batchConnect(
				[g.hLayout, 'onUpdateWidth', '_onUpdateWidth'],
				[g, 'setColumns', '_onSetColumns']);
		},

		load: function(){
			this._adaptWidth();
			this.loaded.callback();
		},

		//Public-----------------------------------------------------------------------------

		// default: Number
		//		Default column width. Applied when it's not possible to decide accurate column width from user's config.
		'default': 60,

		// autoResize: Boolean
		//		If set to true, the column width can only be set to auto or percentage values (if not, it'll be regarded as auto),
		//		then the column will automatically resize when the grid width is changed (this is the default behavior of an
		//		HTML table).
		autoResize: false,

		onUpdate: function(){
			// summary:
			//		Fired when column widths are updated.
		},

		//Private-----------------------------------------------------------------------------
		_init: function(){
			var t = this,
				g = t.grid,
				dn = g.domNode,
				cols = g._columns;
			array.forEach(cols, function(col){
				if(!col.hasOwnProperty('declaredWidth')){
					col.declaredWidth = col.width = col.width || 'auto';
				}
			});
			if(g.autoWidth){
				array.forEach(cols, function(c){
					if(c.declaredWidth == 'auto'){
						c.width = t.arg('default') + 'px';
					}
				});
			}else if(t.arg('autoResize')){
				domClass.add(dn, 'gridxPercentColumnWidth');
				array.forEach(cols, function(c){
					if(!(/%$/).test(c.declaredWidth)){
						c.width = 'auto';
					}
				});
			}
		},

		_onUpdateWidth: function(){
			var t = this,
				g = t.grid;
			if(g.autoWidth){
				t._adaptWidth();
			}else{
				var noHScroller = g.hScrollerNode.style.display == 'none';
				t._adaptWidth(!noHScroller, 1);	//1 as true
				if(!t.arg('autoResize') && noHScroller){
					query('.gridxCell', g.bodyNode).forEach(function(cellNode){
						var col = g._columnsById[cellNode.getAttribute('colId')];
						if(t.arg('autoResize') ||
							!col.declaredWidth ||
							col.declaredWidth == 'auto' ||
							(/%$/).test(col.declaredWidth)){
							cellNode.style.width = col.width;
						}
					});
				}
				t.onUpdate();
			}
		},

		_adaptWidth: function(skip, noEvent){
			var t = this,
				g = t.grid,
				dn = g.domNode,
				header = g.header,
				ltr = g.isLeftToRight(),
				marginLead = ltr ? 'marginLeft' : 'marginRight',
				marginTail = ltr ? 'marginRight' : 'marginLeft',
				lead = g.hLayout.lead,
				tail = g.hLayout.tail,
				innerNode = header.innerNode,
				bs = g.bodyNode.style,
				hs = innerNode.style,
				headerBorder = domGeometry.getBorderExtents(header.domNode).w,
				tailBorder = headerBorder,
				mainBorder = 0,
				bodyWidth = (dn.clientWidth || domStyle.get(dn, 'width')) - lead - tail - headerBorder,
				refNode = query('.gridxCell', innerNode)[0],
				padBorder = refNode ? domGeometry.getMarginBox(refNode).w - domGeometry.getContentBox(refNode).w : 0,
				isGridHidden = !dn.offsetHeight;
			//FIXME: this is theme dependent. Any better way to do this?
			if(tailBorder === 0){
				tailBorder = 1;
			}else{
				mainBorder = 2;
			}
			hs[marginLead] = lead + 'px';
			hs[marginTail] = (tail > tailBorder ? tail - tailBorder : 0)  + 'px';
			g.mainNode.style[marginLead] = lead + 'px';
			g.mainNode.style[marginTail] = tail + 'px';
			bodyWidth = bodyWidth < 0 ? 0 : bodyWidth;
			if(skip){
				t.onUpdate();
				return;
			}
			if(g.autoWidth){
				var headers = query('th.gridxCell', innerNode),
					totalWidth = 0;
				headers.forEach(function(node){
					var w = domStyle.get(node, 'width');
					if(!sniff('safari') || !isGridHidden){
						w += padBorder;
					}
					totalWidth += w;
					var c = g._columnsById[node.getAttribute('colid')];
					if(c.width == 'auto' || (/%$/).test(c.width)){
						node.style.width = c.width = w + 'px';
					}
				});
				bs.width = totalWidth + 'px';
				dn.style.width = (lead + tail + totalWidth + mainBorder) + 'px';
			}else if(t.arg('autoResize')){
				hs.borderWidth = g.vScrollerNode.style.display == 'none' ? 0 : '';
			}else{
				var autoCols = [],
					cols = g._columns,
					fixedWidth = 0;
				if(sniff('safari')){
					padBorder = 0;
				}
				array.forEach(cols, function(c){
					if(c.declaredWidth == 'auto'){
						autoCols.push(c);
					}else if(/%$/.test(c.declaredWidth)){
						var w = parseInt(bodyWidth * parseFloat(c.declaredWidth, 10) / 100 - padBorder, 10);
						//Check if less than zero, prevent error in IE.
						if(w < 0){
							w = 0;
						}
						header.getHeaderNode(c.id).style.width = c.width = w + 'px';
					}
				});
				array.forEach(cols, function(c){
					if(c.declaredWidth != 'auto'){
						var headerNode = header.getHeaderNode(c.id),
							w = sniff('safari') ? parseFloat(headerNode.style.width, 10) :
								headerNode.offsetWidth || (domStyle.get(headerNode, 'width') + padBorder);
						if(/%$/.test(c.declaredWidth)){
							c.width = (w > padBorder ? w - padBorder : 0) + 'px';
						}
						fixedWidth += w;
					}
				});
				if(autoCols.length){
					var w = bodyWidth > fixedWidth ? ((bodyWidth - fixedWidth) / autoCols.length - padBorder) : t.arg('default'),
						ww = parseInt(w, 10);
					if(bodyWidth > fixedWidth){
						ww = bodyWidth - fixedWidth - (ww + padBorder) * (autoCols.length - 1) - padBorder;
					}
					w = parseInt(w, 10);
					//Check if less than zero, prevent error in IE.
					if(w < 0){
						w = 0;
					}
					if(ww < 0){
						ww = 0;
					}
					array.forEach(autoCols, function(c, i){
						header.getHeaderNode(c.id).style.width = c.width = (i < autoCols.length - 1 ? w : ww) + 'px';
					});
				}
			}
			g.hScroller.scroll(0);
			header._onHScroll(0);
			g.vLayout.reLayout();
			if(!noEvent){
				t.onUpdate();
			}
		},

		_onSetColumns: function(){
			var t = this,
				g = t.grid;
			t._init();
			g.header.refresh();
			t._adaptWidth();
			//FIXME: Is there any more elegant way to do this?
			if(g.cellWidget){
				g.cellWidget._init();
				if(g.edit){
					g.edit._init();
				}
			}
			if(g.tree){
				g.tree._initExpandLevel();
			}
			g.body.refresh();
		}
	});
});

},
'gridx/core/model/cache/Async':function(){
define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"./_Cache"
], function(declare, array, lang, Deferred, DeferredList, _Cache){

	var hitch = lang.hitch;

	function fetchById(self, args){
		//Although store supports query by id, it does not support get index by id, so must find the index by ourselves.
		var d = new Deferred(),
			i, r, len, pid,
			success = hitch(d, d.callback),
			fail = hitch(d, d.errback),
			ranges = args.range,
			isTree = self.store.getChildren;
		args.pids = [];
		if(isTree){
			for(i = ranges.length - 1; i >= 0; --i){
				r = ranges[i];
				pid = r.parentId;
				if(self.model.isId(pid)){
					args.id.push(pid);
					args.pids.push(pid);
					ranges.splice(i, 1);
				}
			}
		}
		var ids = findMissingIds(self, args.id),
			mis = [];
		if(ids.length){
			array.forEach(ids, function(id){
				var idx = self.idToIndex(id);
				if(idx >= 0 && !self.treePath(id).pop()){
					ranges.push({
						start: idx,
						count: 1
					});
				}else{
					mis.push(id);
				}
			});
			searchRootLevel(self, mis).then(function(ids){
				if(ids.length && isTree){
					searchChildLevel(self, ids).then(function(ids){
						if(ids.length){
							console.warn('Requested row ids are not found: ', ids);
						}
						success(args);
					}, fail);
				}else{
					success(args);
				}
			}, fail);
		}else{
			success(args);
		}
		return d;
	}

	function fetchByIndex(self, args){
		var d = new Deferred(),
			size = self._size[''];
		args = connectRanges(self,
			mergePendingRequests(self,
				findMissingIndexes(self,
					mergeRanges(args))));
		var ranges = size > 0 ? array.filter(args.range, function(r){
			if(r.count > 0 && size < r.start + r.count){
				r.count = size - r.start;
			}
			return r.start < size;
		}) : args.range;
		new DeferredList(array.map(ranges, function(r){
			return self._storeFetch(r);
		}), 0, 1).then(hitch(d, d.callback, args), hitch(d, d.errback));
		return d;
	}

	function fetchByParentId(self, args){
		var d = new Deferred();
		new DeferredList(array.map(args.pids, function(pid){
			return self._loadChildren(pid);
		}), 0, 1).then(hitch(d, d.callback, args), hitch(d, d.errback));
		return d;
	}

	function mergePendingRequests(self, args){
		var i, req,
			reqs = self._requests,
			defs = [];
		for(i = reqs.length - 1; i >= 0; --i){
			req = reqs[i];
			args.range = minus(args.range, req.range);
			if(args.range._overlap){
				defs.push(req._def);
			}
		}
		args._req = defs.length && new DeferredList(defs, 0, 1);
		reqs.push(args);
		return args;
	}

	function minus(rangesA, rangesB){
		//Minus index range list B from index range list A, 
		//assuming A and B do not have overlapped ranges.
		//This is a set operation
		if(!rangesB.length || !rangesA.length){
			return rangesA;
		}
		var indexes = [], f = 0, r, res = [],
			mark = function(idx, flag){
				indexes[idx] = indexes[idx] || 0;
				indexes[idx] += flag;
			},
			markRanges = function(ranges, flag){
				var i, r;
				for(i = ranges.length - 1; i >= 0; --i){
					r = ranges[i];
					mark(r.start, flag);
					if(r.count){
						mark(r.start + r.count, -flag);
					}
				}
			};
		markRanges(rangesA, 1);
		markRanges(rangesB, 2);
		for(var i = 0, len = indexes.length; i < len; ++i){
			if(indexes[i]){
				f += indexes[i];
				if(f === 1){
					res.push({
						start: i
					});
				}else{
					if(f === 3){
						res._overlap = true;
					}
					r = res[res.length - 1];
					if(r && !r.count){
						r.count = i - r.start;
					}
				}
			}
		}
		return res;
	}

	function mergeRanges(args){
		//Merge index ranges into separate ones.
		var ranges = [], r = args.range, i, t, a, b, c, merged;
		while(r.length > 0){
			c = a = r.pop();
			merged = 0;
			for(i = r.length - 1; i >= 0; --i){
				b = r[i];
				if(a.start < b.start){
					//make sure a is always after b, so the logic can be simplified
					t = b;
					b = a;
					a = t;
				}
				//If b is an open range, and starts before a, then b must include a.
				if(b.count){
					//b is a closed range, it's possible to overlap.
					if(a.start <= b.start + b.count){
						//overlap
						if(a.count && a.start + a.count > b.start + b.count){
							b.count = a.start + a.count - b.start;
						}else if(!a.count){
							b.count = null;
						}
						//otherwise, b includes a
					}else{
						//not overlap, try next range
						a = c;
						continue;
					}
				}
				//now n is a merged range
				r[i] = b;
				merged = 1;
				break;
			}
			if(!merged){
				//Can not merge, this is a sperate range
				ranges.push(c);
			}
		}
		args.range = ranges;
		return args;
	}

	function connectRanges(self, args){
		//Connect small ranges into big ones to reduce request count
		//FIXME: find a better way to do this!
		var r = args.range, ranges = [], a, b, ps = self.pageSize;
		r.sort(function(a, b){
			return a.start - b.start;
		});
		while(r.length){
			a = r.shift();
			if(r.length){
				b = r[0];
				if(b.count && b.count + b.start - a.start <= ps){
					b.count = b.count + b.start - a.start;
					b.start = a.start;
					continue;
				}else if(!b.count && b.start - a.start < ps){
					b.start = a.start;
					continue;
				}
			}
			ranges.push(a);
		}
		//Improve performance for most cases
		if(ranges.length == 1 && ranges[0].count < ps){
			ranges[0].count = ps;
		}
		args.range = ranges;
		return args;
	}

	function findMissingIds(self, ids){
		var c = self._cache;
		return array.filter(ids, function(id){
			return !c[id];
		});
	}

	function findMissingIndexes(self, args){
		//Removed loaded rows from the request index ranges.
		//generate unsorted range list.
		var i, j, r, end, newRange,
			ranges = [],
			indexMap = self._struct[''],
			totalSize = self._size[''];
		for(i = args.range.length - 1; i >= 0; --i){
			r = args.range[i];
			end = r.count ? r.start + r.count : indexMap.length - 1;
			newRange = 1;
			for(j = r.start; j < end; ++j){
				var id = indexMap[j + 1];
				if(!id || !self._cache[id]){
					if(newRange){
						ranges.push({
							start: j,
							count: 1
						});
					}else{
						++ranges[ranges.length - 1].count;
					}
					newRange = 0;
				}else{
					newRange = 1;
				}
			}
			if(!r.count){
				if(!newRange){
					delete ranges[ranges.length - 1].count;
				}else if(totalSize < 0 || j < totalSize){
					ranges.push({
						start: j
					});
				}
			}
		}
		args.range = ranges;
		return args;
	}

	function searchRootLevel(self, ids){
		//search root level for missing ids
		var d = new Deferred(),
			fail = hitch(d, d.errback),
			indexMap = self._struct[''],
			ranges = [],
			lastRange,
			premissing; //Whether the previous item is missing
		if(ids.length){
			for(var i = 1, len = indexMap.length; i < len; ++i){
				if(!indexMap[i]){
					if(premissing){
						lastRange.count++;
					}else{
						premissing = 1;
						ranges.push(lastRange = {
							start: i - 1,
							count: 1
						});
					}
				}
			}
			ranges.push({
				start: indexMap.length < 2 ? 0 : indexMap.length - 2
			});
		}
		var func = function(ids){
			if(ids.length && ranges.length){
				self._storeFetch(ranges.shift()).then(function(){
					func(findMissingIds(self, ids));
				}, fail);
			}else{
				d.callback(ids);
			}
		};
		func(ids);
		return d;
	}

	function searchChildLevel(self, ids){
		//Search children level of current level for missing ids
		var d = new Deferred(),
			fail = hitch(d, d.errback),
			st = self._struct,
			parentIds = st[''].slice(1),
			func = function(ids){
				if(ids.length && parentIds.length){
					var pid = parentIds.shift();
					self._loadChildren(pid).then(function(){
						[].push.apply(parentIds, st[pid].slice(1));
						func(findMissingIds(self, ids));
					}, fail);
				}else{
					d.callback(ids);
				}
			};
		func(ids);
		return d;
	}

	return declare(/*===== "gridx.core.model.cache.Async", =====*/_Cache, {
		// summary:
		//		Implement lazy-loading for server side store.

		//isAsync: Boolean
		//		Whether this cache is for asynchronous(server side) store.
		isAsync: true,

/*=====
		//cacheSize: Integer
		//		The max cached row count in client side.
		//		By default, do not clear cache when scrolling, this is the same with DataGrid
		cacheSize: -1,

		//pageSize: Integer
		//		The recommended row count for every fetch.
		pageSize: 100,
=====*/
		
		constructor: function(model, args){
			var cs = args.cacheSize,
				ps = args.pageSize;
			this.cacheSize = cs >= 0 ? cs : -1;
			this.pageSize = ps > 0 ? ps : 100;
		},

		when: function(args, callback){
			var t = this,
				d = args._def = new Deferred(),
				fail = hitch(d, d.errback),
				innerFail = function(e){
					t._requests.pop();
					fail(e);
				};
			fetchById(t, args).then(function(args){
				fetchByIndex(t, args).then(function(args){
					fetchByParentId(t, args).then(function(args){
						Deferred.when(args._req, function(){
							var err;
							if(callback){
								try{
									callback();
								}catch(e){
									err = e;
								}
							}
							t._requests.shift();
							if(err){
								d.errback(err);
							}else{
								d.callback();
							}
						}, innerFail);
					}, innerFail);
				}, innerFail);
			}, fail);
			return d;
		},

		keep: function(id){
			var t = this,
				k = t._kept;
			if(t._cache[id] && t._struct[id] && !k[id]){
				k[id] = 1;
				++t._keptSize;
			}
		},

		free: function(id){
			var t = this;
			if(!t.model.isId(id)){
				t._kept = {};
				t._keptSize = 0;
			}else if(t._kept[id]){
				delete t._kept[id];
				--t._keptSize;
			}
		},

		clear: function(){
			var t = this;
			if(t._requests && t._requests.length){
				t._clearLock = 1;	//1 as true
				return;
			}
			t.inherited(arguments);
			t._requests = [];
			t._priority = [];
			t._kept = {};
			t._keptSize = 0;
		},

		//-----------------------------------------------------------------------------------------------------------
		_init: function(){},

		_checkSize: function(){
			var t = this, id,
				cs = t.cacheSize,
				p = t._priority;
			if(t._clearLock){
				t._clearLock = 0;	//0 as false
				t.clear();
			}else if(cs >= 0){
				cs += t._keptSize;
//                console.warn("### Cache size:", p.length,
//                        ", To release: ", p.length - cs,
//                        ", Keep size: ", this._keptSize);
				while(p.length > cs){
					id = p.shift();
					if(t._kept[id]){
						p.push(id);
					}else{
						delete t._cache[id];
					}
				}
			}
		}
	});
});

},
'gridx/modules/move/Column':function(){
define("gridx/modules/move/Column", [
	"dojo/_base/declare",
	"dojo/_base/query",
	"dojo/_base/array",
	"dojo/keys",
	"../../core/_Module"
], function(declare, query, array, keys, _Module){

	return declare(/*===== "gridx.modules.move.Column", =====*/_Module, {
		// summary:
		//		This module provides several APIs to move columns within grid.
		// description:
		//		This module does not include any UI. So different kind of column dnd UI implementations can be built
		//		upon this module.
		//		But this module does provide a keyboard support for reordering columns. When focus is on a column header,
		//		pressing CTRL+LEFT/RIGHT ARROW will move the column around within grid.

		name: 'moveColumn',
		
		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				move: {
					column: this
				}
			};
		},

		preload: function(){
			this.aspect(this.grid, 'onHeaderCellKeyDown', '_onKeyDown');
		},

		columnMixin: {
			moveTo: function(target){
				// summary:
				//		Move this column to the position before the column with index "target"
				// target: Integer
				//		The target index
				this.grid.move.column.moveRange(this.index(), 1, target);
				return this;
			}
		},
		
		//public---------------------------------------------------------------

		//moveSelected: Boolean
		//		When moving using keyboard, whether to move all selected columns together.
		moveSelected: true,

		move: function(columnIndexes, target){
			// summary:
			//		Move some columns to the given target position
			// columnIndexes: Integer[]
			//		The current indexes of columns to move
			// target: Integer
			//		The moved columns will be inserted before the column with this index.
			if(typeof columnIndexes === 'number'){
				columnIndexes = [columnIndexes];
			}
			var map = [], i, len, columns = this.grid._columns, pos, movedCols = [];
			for(i = 0, len = columnIndexes.length; i < len; ++i){
				map[columnIndexes[i]] = true;
			}
			for(i = map.length - 1; i >= 0; --i){
				if(map[i]){
					movedCols.unshift(columns[i]);
					columns.splice(i, 1);
				}
			}
			for(i = 0, len = columns.length; i < len; ++i){
				if(columns[i].index >= target){
					pos = i;
					break;
				}
			}
			if(pos === undefined){
				pos = columns.length;
			}
			this._moveComplete(movedCols, pos);
		},
	
		moveRange: function(start, count, target){
			// summary:
			//		Move a range of columns to a given target position
			// start: Integer
			//		The index of the first column to move
			// count: Integer
			//		The count of columns to move
			if(target < start || target > start + count){
				if(target > start + count){
					target -= count;
				}
				this._moveComplete(this.grid._columns.splice(start, count), target);
			}
		},
		
		//Events--------------------------------------------------------------------
		onMoved: function(){
			// summary:
			//		Fired when column move is performed successfully
			// tags:
			//		callback
		},
		
		//Private-------------------------------------------------------------------
		_moveComplete: function(movedCols, target){
			var g = this.grid,
				map = {},
				columns = g._columns,
				i, movedColIds = {},
				targetId = target < columns.length ? columns[target].id : null,
				update = function(tr){
					var cells = query('> .gridxCell', tr).filter(function(cellNode){
						return movedColIds[cellNode.getAttribute('colid')];
					});
					if(targetId === null){
						cells.place(tr);
					}else{
						cells.place(query('> [colid="' + targetId + '"]', tr)[0], 'before');
					}
				};
			for(i = movedCols.length - 1; i >= 0; --i){
				map[movedCols[i].index] = target + i;
				movedColIds[movedCols[i].id] = 1;
			}
			[].splice.apply(columns, [target, 0].concat(movedCols));
			for(i = columns.length - 1; i >= 0; --i){
				columns[i].index = i;
			}
			update(query('.gridxHeaderRowInner > table > tbody > tr', g.headerNode)[0]);
			query('.gridxRow > table > tbody > tr', g.bodyNode).forEach(update);
			this.onMoved(map);
		},

		_onKeyDown: function(e){
			var t = this,
				g = t.grid,
				selector = t.arg('moveSelected') && g.select && g.select.column,
				ltr = g.isLeftToRight(),
				preKey = ltr ? keys.LEFT_ARROW : keys.RIGHT_ARROW,
				postKey = ltr ? keys.RIGHT_ARROW : keys.LEFT_ARROW;
			if(e.ctrlKey && !e.shiftKey && !e.altKey && (e.keyCode == preKey || e.keyCode == postKey)){
				var target = e.columnIndex,
					colIdxes = selector && selector.isSelected(e.columnId) ?
						array.map(selector.getSelected(), function(id){
							return g._columnsById[id].index;
						}) : [e.columnIndex],
					node = g.header.getHeaderNode(e.columnId);
				if(e.keyCode == preKey){
					while(array.indexOf(colIdxes, target) >= 0){
						target--;
					}
					if(target >= 0){
						t.move(colIdxes, target);
						g.header._focusNode(node);
					}
				}else if(e.keyCode == postKey){
					while(array.indexOf(colIdxes, target) >= 0){
						target++;
					}
					if(target < g._columns.length){
						t.move(colIdxes, target + 1);
						g.header._focusNode(node);
					}
				}
			}
		}
	});
});

},
'dojo/dnd/Container':function(){
define("dojo/dnd/Container", [
	"../_base/array",
	"../_base/declare",
	"../_base/event",
	"../_base/kernel",
	"../_base/lang",
	"../_base/window",
	"../dom",
	"../dom-class",
	"../dom-construct",
	"../Evented",
	"../has",
	"../on",
	"../query",
	"../ready",
	"../touch",
	"./common"
], function(
	array, declare, event, kernel, lang, win,
	dom, domClass, domConstruct, Evented, has, on, query, ready, touch, dnd){

// module:
//		dojo/dnd/Container

/*
	Container states:
		""		- normal state
		"Over"	- mouse over a container
	Container item states:
		""		- normal state
		"Over"	- mouse over a container item
*/



var Container = declare("dojo.dnd.Container", Evented, {
	// summary:
	//		a Container object, which knows when mouse hovers over it,
	//		and over which element it hovers

	// object attributes (for markup)
	skipForm: false,
	// allowNested: Boolean
	//		Indicates whether to allow dnd item nodes to be nested within other elements.
	//		By default this is false, indicating that only direct children of the container can
	//		be draggable dnd item nodes
	allowNested: false,
	/*=====
	// current: DomNode
	//		The DOM node the mouse is currently hovered over
	current: null,

	// map: Hash<String, Container.Item>
	//		Map from an item's id (which is also the DOMNode's id) to
	//		the dojo/dnd/Container.Item itself.
	map: {},
	=====*/

	constructor: function(node, params){
		// summary:
		//		a constructor of the Container
		// node: Node
		//		node or node's id to build the container on
		// params: Container.__ContainerArgs
		//		a dictionary of parameters
		this.node = dom.byId(node);
		if(!params){ params = {}; }
		this.creator = params.creator || null;
		this.skipForm = params.skipForm;
		this.parent = params.dropParent && dom.byId(params.dropParent);

		// class-specific variables
		this.map = {};
		this.current = null;

		// states
		this.containerState = "";
		domClass.add(this.node, "dojoDndContainer");

		// mark up children
		if(!(params && params._skipStartup)){
			this.startup();
		}

		// set up events
		this.events = [
			on(this.node, touch.over, lang.hitch(this, "onMouseOver")),
			on(this.node, touch.out,  lang.hitch(this, "onMouseOut")),
			// cancel text selection and text dragging
			on(this.node, "dragstart",   lang.hitch(this, "onSelectStart")),
			on(this.node, "selectstart", lang.hitch(this, "onSelectStart"))
		];
	},

	// object attributes (for markup)
	creator: function(){
		// summary:
		//		creator function, dummy at the moment
	},

	// abstract access to the map
	getItem: function(/*String*/ key){
		// summary:
		//		returns a data item by its key (id)
		return this.map[key];	// Container.Item
	},
	setItem: function(/*String*/ key, /*Container.Item*/ data){
		// summary:
		//		associates a data item with its key (id)
		this.map[key] = data;
	},
	delItem: function(/*String*/ key){
		// summary:
		//		removes a data item from the map by its key (id)
		delete this.map[key];
	},
	forInItems: function(/*Function*/ f, /*Object?*/ o){
		// summary:
		//		iterates over a data map skipping members that
		//		are present in the empty object (IE and/or 3rd-party libraries).
		o = o || kernel.global;
		var m = this.map, e = dnd._empty;
		for(var i in m){
			if(i in e){ continue; }
			f.call(o, m[i], i, this);
		}
		return o;	// Object
	},
	clearItems: function(){
		// summary:
		//		removes all data items from the map
		this.map = {};
	},

	// methods
	getAllNodes: function(){
		// summary:
		//		returns a list (an array) of all valid child nodes
		return query((this.allowNested ? "" : "> ") + ".dojoDndItem", this.parent);	// NodeList
	},
	sync: function(){
		// summary:
		//		sync up the node list with the data map
		var map = {};
		this.getAllNodes().forEach(function(node){
			if(node.id){
				var item = this.getItem(node.id);
				if(item){
					map[node.id] = item;
					return;
				}
			}else{
				node.id = dnd.getUniqueId();
			}
			var type = node.getAttribute("dndType"),
				data = node.getAttribute("dndData");
			map[node.id] = {
				data: data || node.innerHTML,
				type: type ? type.split(/\s*,\s*/) : ["text"]
			};
		}, this);
		this.map = map;
		return this;	// self
	},
	insertNodes: function(data, before, anchor){
		// summary:
		//		inserts an array of new nodes before/after an anchor node
		// data: Array
		//		a list of data items, which should be processed by the creator function
		// before: Boolean
		//		insert before the anchor, if true, and after the anchor otherwise
		// anchor: Node
		//		the anchor node to be used as a point of insertion
		if(!this.parent.firstChild){
			anchor = null;
		}else if(before){
			if(!anchor){
				anchor = this.parent.firstChild;
			}
		}else{
			if(anchor){
				anchor = anchor.nextSibling;
			}
		}
		var i, t;
		if(anchor){
			for(i = 0; i < data.length; ++i){
				t = this._normalizedCreator(data[i]);
				this.setItem(t.node.id, {data: t.data, type: t.type});
				anchor.parentNode.insertBefore(t.node, anchor);
			}
		}else{
			for(i = 0; i < data.length; ++i){
				t = this._normalizedCreator(data[i]);
				this.setItem(t.node.id, {data: t.data, type: t.type});
				this.parent.appendChild(t.node);
			}
		}
		return this;	// self
	},
	destroy: function(){
		// summary:
		//		prepares this object to be garbage-collected
		array.forEach(this.events, function(handle){ handle.remove(); });
		this.clearItems();
		this.node = this.parent = this.current = null;
	},

	// markup methods
	markupFactory: function(params, node, Ctor){
		params._skipStartup = true;
		return new Ctor(node, params);
	},
	startup: function(){
		// summary:
		//		collects valid child items and populate the map

		// set up the real parent node
		if(!this.parent){
			// use the standard algorithm, if not assigned
			this.parent = this.node;
			if(this.parent.tagName.toLowerCase() == "table"){
				var c = this.parent.getElementsByTagName("tbody");
				if(c && c.length){ this.parent = c[0]; }
			}
		}
		this.defaultCreator = dnd._defaultCreator(this.parent);

		// process specially marked children
		this.sync();
	},

	// mouse events
	onMouseOver: function(e){
		// summary:
		//		event processor for onmouseover or touch, to mark that element as the current element
		// e: Event
		//		mouse event
		var n = e.relatedTarget;
		while(n){
			if(n == this.node){ break; }
			try{
				n = n.parentNode;
			}catch(x){
				n = null;
			}
		}
		if(!n){
			this._changeState("Container", "Over");
			this.onOverEvent();
		}
		n = this._getChildByEvent(e);
		if(this.current == n){ return; }
		if(this.current){ this._removeItemClass(this.current, "Over"); }
		if(n){ this._addItemClass(n, "Over"); }
		this.current = n;
	},
	onMouseOut: function(e){
		// summary:
		//		event processor for onmouseout
		// e: Event
		//		mouse event
		for(var n = e.relatedTarget; n;){
			if(n == this.node){ return; }
			try{
				n = n.parentNode;
			}catch(x){
				n = null;
			}
		}
		if(this.current){
			this._removeItemClass(this.current, "Over");
			this.current = null;
		}
		this._changeState("Container", "");
		this.onOutEvent();
	},
	onSelectStart: function(e){
		// summary:
		//		event processor for onselectevent and ondragevent
		// e: Event
		//		mouse event
		if(!this.skipForm || !dnd.isFormElement(e)){
			event.stop(e);
		}
	},

	// utilities
	onOverEvent: function(){
		// summary:
		//		this function is called once, when mouse is over our container
	},
	onOutEvent: function(){
		// summary:
		//		this function is called once, when mouse is out of our container
	},
	_changeState: function(type, newState){
		// summary:
		//		changes a named state to new state value
		// type: String
		//		a name of the state to change
		// newState: String
		//		new state
		var prefix = "dojoDnd" + type;
		var state  = type.toLowerCase() + "State";
		//domClass.replace(this.node, prefix + newState, prefix + this[state]);
		domClass.replace(this.node, prefix + newState, prefix + this[state]);
		this[state] = newState;
	},
	_addItemClass: function(node, type){
		// summary:
		//		adds a class with prefix "dojoDndItem"
		// node: Node
		//		a node
		// type: String
		//		a variable suffix for a class name
		domClass.add(node, "dojoDndItem" + type);
	},
	_removeItemClass: function(node, type){
		// summary:
		//		removes a class with prefix "dojoDndItem"
		// node: Node
		//		a node
		// type: String
		//		a variable suffix for a class name
		domClass.remove(node, "dojoDndItem" + type);
	},
	_getChildByEvent: function(e){
		// summary:
		//		gets a child, which is under the mouse at the moment, or null
		// e: Event
		//		a mouse event
		var node = e.target;
		if(node){
			for(var parent = node.parentNode; parent; node = parent, parent = node.parentNode){
				if((parent == this.parent || this.allowNested) && domClass.contains(node, "dojoDndItem")){ return node; }
			}
		}
		return null;
	},
	_normalizedCreator: function(/*Container.Item*/ item, /*String*/ hint){
		// summary:
		//		adds all necessary data to the output of the user-supplied creator function
		var t = (this.creator || this.defaultCreator).call(this, item, hint);
		if(!lang.isArray(t.type)){ t.type = ["text"]; }
		if(!t.node.id){ t.node.id = dnd.getUniqueId(); }
		domClass.add(t.node, "dojoDndItem");
		return t;
	}
});

dnd._createNode = function(tag){
	// summary:
	//		returns a function, which creates an element of given tag
	//		(SPAN by default) and sets its innerHTML to given text
	// tag: String
	//		a tag name or empty for SPAN
	if(!tag){ return dnd._createSpan; }
	return function(text){	// Function
		return domConstruct.create(tag, {innerHTML: text});	// Node
	};
};

dnd._createTrTd = function(text){
	// summary:
	//		creates a TR/TD structure with given text as an innerHTML of TD
	// text: String
	//		a text for TD
	var tr = domConstruct.create("tr");
	domConstruct.create("td", {innerHTML: text}, tr);
	return tr;	// Node
};

dnd._createSpan = function(text){
	// summary:
	//		creates a SPAN element with given text as its innerHTML
	// text: String
	//		a text for SPAN
	return domConstruct.create("span", {innerHTML: text});	// Node
};

// dnd._defaultCreatorNodes: Object
//		a dictionary that maps container tag names to child tag names
dnd._defaultCreatorNodes = {ul: "li", ol: "li", div: "div", p: "div"};

dnd._defaultCreator = function(node){
	// summary:
	//		takes a parent node, and returns an appropriate creator function
	// node: Node
	//		a container node
	var tag = node.tagName.toLowerCase();
	var c = tag == "tbody" || tag == "thead" ? dnd._createTrTd :
			dnd._createNode(dnd._defaultCreatorNodes[tag]);
	return function(item, hint){	// Function
		var isObj = item && lang.isObject(item), data, type, n;
		if(isObj && item.tagName && item.nodeType && item.getAttribute){
			// process a DOM node
			data = item.getAttribute("dndData") || item.innerHTML;
			type = item.getAttribute("dndType");
			type = type ? type.split(/\s*,\s*/) : ["text"];
			n = item;	// this node is going to be moved rather than copied
		}else{
			// process a DnD item object or a string
			data = (isObj && item.data) ? item.data : item;
			type = (isObj && item.type) ? item.type : ["text"];
			n = (hint == "avatar" ? dnd._createSpan : c)(String(data));
		}
		if(!n.id){
			n.id = dnd.getUniqueId();
		}
		return {node: n, data: data, type: type};
	};
};

/*=====
Container.__ContainerArgs = declare([], {
	creator: function(){
		// summary:
		//		a creator function, which takes a data item, and returns an object like that:
		//		{node: newNode, data: usedData, type: arrayOfStrings}
	},

	// skipForm: Boolean
	//		don't start the drag operation, if clicked on form elements
	skipForm: false,

	// dropParent: Node||String
	//		node or node's id to use as the parent node for dropped items
	//		(must be underneath the 'node' parameter in the DOM)
	dropParent: null,

	// _skipStartup: Boolean
	//		skip startup(), which collects children, for deferred initialization
	//		(this is used in the markup mode)
	_skipStartup: false
});

Container.Item = function(){
	// summary:
	//		Represents (one of) the source node(s) being dragged.
	//		Contains (at least) the "type" and "data" attributes.
	// type: String[]
	//		Type(s) of this item, by default this is ["text"]
	// data: Object
	//		Logical representation of the object being dragged.
	//		If the drag object's type is "text" then data is a String,
	//		if it's another type then data could be a different Object,
	//		perhaps a name/value hash.

	this.type = type;
	this.data = data;
};
=====*/

return Container;
});

},
'gridx/core/model/cache/Sync':function(){
define("gridx/core/model/cache/Sync", [
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"./_Cache"
], function(declare, lang, Deferred, _Cache){

	function fetchChildren(self){
		var s = self._struct,
			pids = s[''].slice(1),
			pid,
			appendChildren = function(pid){
				[].push.apply(pids, s[pid].slice(1));
			};
		while(pids.length){
			pid = pids.shift();
			Deferred.when(self._loadChildren(pid), lang.partial(appendChildren, pid));
		}
	}

	return declare(/*===== "gridx.core.model.cache.Async", =====*/_Cache, {
		keep: function(){},
		free: function(){},

		when: function(args, callback){
			var d = new Deferred();
			try{
				if(callback){
					callback();
				}
				d.callback();
			}catch(e){
				d.errback(e);
			}
			return d;
		},

		//Private---------------------------------------------
		_init: function(/*method, args*/){
			var t = this;
			if(!t._filled){
				t._storeFetch({ start: 0 });
				if(t.store.getChildren){
					fetchChildren(t);
				}
				t.model._onSizeChange();
			}
		}
	});
});

},
'gridx/modules/dnd/Column':function(){
define("gridx/modules/dnd/Column", [
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/dom-geometry",
	"dojo/dom-class",
	"dojo/_base/query",
	"./_Base",
	"../../core/_Module"
], function(declare, array, domGeometry, domClass, query, _Base, _Module){

	return declare(/*===== "gridx.modules.dnd.Column", =====*/_Base, {
		// summary:
		//		This module provides an implementation of column drag & drop.
		//		It supports column reordering within grid, dragging out of grid, and dragging into grid.

		name: 'dndColumn',

		required: ['_dnd', 'selectColumn', 'moveColumn'],

		getAPIPath: function(){
			return {
				dnd: {
					column: this
				}
			};
		},

		preload: function(){
			var t = this,
				g = t.grid;
			t.inherited(arguments);
			t._selector = g.select.column;
			t.connect(g.header, 'onRender', '_initHeader');
		},

		load: function(){
			this._initHeader();
			this.loaded.callback();
		},
	
		//Public---------------------------------------------------------------------------------------

		//accept: String[]
		//		Can drag out what kind of stuff.
		//		For now can not drag in any columns.
		accept: [],

		//provide: String[]
		//		Can drag out what kind of stuff
		provide: ['grid/columns'],

		//Package--------------------------------------------------------------------------------------
		_checkDndReady: function(evt){
			var t = this;
			if(t._selector.isSelected(evt.columnId)){
				t._selectedColIds = t._selector.getSelected();
				t.grid.dnd._dnd.profile = t;
				return true;
			}
			return false;
		},

		onDraggedOut: function(/*source*/){
			//TODO: Support drag columns out (remove columns).
		},

		//Private--------------------------------------------------------------------------------------
		_cssName: "Column",

		_initHeader: function(){
			query('.gridxCell', this.grid.header.domNode).attr('aria-dragged', 'false');
		},

		_onBeginDnd: function(source){
			var t = this;
			source.delay = t.arg('delay');
			array.forEach(t._selectedColIds, function(id){
				query('[colid="' + id + '"].gridxCell', t.grid.header.domNode).attr('aria-dragged', 'true');
			});
		},

		_getDndCount: function(){
			return this._selectedColIds.length;
		},

		_onEndDnd: function(){
			query('[aria-dragged="true"].gridxCell', this.grid.header.domNode).attr('aria-dragged', 'false');
		},

		_buildDndNodes: function(){
			var gid = this.grid.id;
			return array.map(this._selectedColIds, function(colId){
				return ["<div id='", gid, "_dndcolumn_", colId, "' gridid='", gid, "' columnid='", colId, "'></div>"].join('');
			}).join('');
		},
	
		_onBeginAutoScroll: function(){
			var autoScroll = this.grid.autoScroll;
			this._autoScrollV = autoScroll.vertical;
			autoScroll.vertical = false;
		},

		_onEndAutoScroll: function(){
			this.grid.autoScroll.vertical = this._autoScrollV;
		},

		_getItemData: function(id){
			return id.substring((this.grid.id + '_dndcolumn_').length);
		},
		
		//---------------------------------------------------------------------------------------------
		_calcTargetAnchorPos: function(evt, containerPos){
			var node = evt.target,
				t = this,
				g = t.grid,
				ltr = g.isLeftToRight(),
				columns = g._columns,
				ret = {
					height: containerPos.h + "px",
					width: '',
					top: ''
				},
				func = function(n){
					var id = n.getAttribute('colid'),
						index = g._columnsById[id].index,
						first = n,
						last = n,
						firstIdx = index,
						lastIdx = index;
					if(t._selector.isSelected(id)){
						firstIdx = index;
						while(firstIdx > 0 && t._selector.isSelected(columns[firstIdx - 1].id)){
							--firstIdx;
						}
						first = query(".gridxHeaderRow [colid='" + columns[firstIdx].id + "']", g.headerNode)[0];
						lastIdx = index;
						while(lastIdx < columns.length - 1 && t._selector.isSelected(columns[lastIdx + 1].id)){
							++lastIdx;
						}
						last = query(".gridxHeaderRow [colid='" + columns[lastIdx].id + "']", g.headerNode)[0];
					}
					if(first && last){
						var firstPos = domGeometry.position(first),
							lastPos = domGeometry.position(last),
							middle = (firstPos.x + lastPos.x + lastPos.w) / 2,
							pre = evt.clientX < middle;
						if(pre){
							ret.left = (firstPos.x - containerPos.x - 1) + "px";
						}else{
							ret.left = (lastPos.x + lastPos.w - containerPos.x - 1) + "px";
						}
						t._target = pre ^ ltr ? lastIdx + 1 : firstIdx;
					}else{
						delete t._target;
					}
					return ret;
				};
			while(node){
				if(domClass.contains(node, 'gridxCell')){
					return func(node);
				}
				node = node.parentNode;
			}
			//For FF, when dragging from another grid, the evt.target is always grid.bodyNode!
			// so have to get the cell node by position, which is relatively slow.
			var rowNode = query(".gridxRow", g.bodyNode)[0],
				rowPos = domGeometry.position(rowNode.firstChild);
			if(rowPos.x + rowPos.w <= evt.clientX){
				ret.left = (rowPos.x + rowPos.w - containerPos.x - 1) + 'px';
				t._target = columns.length;
			}else if(rowPos.x >= evt.clientX){
				ret.left = (rowPos.x - containerPos.x - 1) + 'px';
				t._target = 0;
			}else if(query(".gridxCell", rowNode).some(function(cellNode){
				var cellPos = domGeometry.position(cellNode);
				if(cellPos.x <= evt.clientX && cellPos.x + cellPos.w >= evt.clientX){
					node = cellNode;
					return true;
				}
			})){
				return func(node);
			}
			return ret;
		},
		
		_onDropInternal: function(nodes, copy){
			var t = this;
			if(t._target >= 0){
				var indexes = array.map(t._selectedColIds, function(colId){
					return t.grid._columnsById[colId].index;
				});
				t.grid.move.column.move(indexes, t._target);
			}
		},
		
		_onDropExternal: function(/*source, nodes, copy*/){
			//TODO: Support drag in columns from another grid or non-grid source
		}
	});
});

},
'dojo/dnd/Manager':function(){
define("dojo/dnd/Manager", [
	"../_base/array",  "../_base/declare", "../_base/event", "../_base/lang", "../_base/window",
	"../dom-class", "../Evented", "../has", "../keys", "../on", "../topic", "../touch",
	"./common", "./autoscroll", "./Avatar"
], function(array, declare, event, lang, win, domClass, Evented, has, keys, on, topic, touch,
	dnd, autoscroll, Avatar){

// module:
//		dojo/dnd/Manager

var Manager = declare("dojo.dnd.Manager", [Evented], {
	// summary:
	//		the manager of DnD operations (usually a singleton)
	constructor: function(){
		this.avatar  = null;
		this.source = null;
		this.nodes = [];
		this.copy  = true;
		this.target = null;
		this.canDropFlag = false;
		this.events = [];
	},

	// avatar's offset from the mouse
	OFFSET_X: has("touch") ? 0 : 16,
	OFFSET_Y: has("touch") ? -64 : 16,

	// methods
	overSource: function(source){
		// summary:
		//		called when a source detected a mouse-over condition
		// source: Object
		//		the reporter
		if(this.avatar){
			this.target = (source && source.targetState != "Disabled") ? source : null;
			this.canDropFlag = Boolean(this.target);
			this.avatar.update();
		}
		topic.publish("/dnd/source/over", source);
	},
	outSource: function(source){
		// summary:
		//		called when a source detected a mouse-out condition
		// source: Object
		//		the reporter
		if(this.avatar){
			if(this.target == source){
				this.target = null;
				this.canDropFlag = false;
				this.avatar.update();
				topic.publish("/dnd/source/over", null);
			}
		}else{
			topic.publish("/dnd/source/over", null);
		}
	},
	startDrag: function(source, nodes, copy){
		// summary:
		//		called to initiate the DnD operation
		// source: Object
		//		the source which provides items
		// nodes: Array
		//		the list of transferred items
		// copy: Boolean
		//		copy items, if true, move items otherwise

		// Tell autoscroll that a drag is starting
		autoscroll.autoScrollStart(win.doc);

		this.source = source;
		this.nodes  = nodes;
		this.copy   = Boolean(copy); // normalizing to true boolean
		this.avatar = this.makeAvatar();
		win.body().appendChild(this.avatar.node);
		topic.publish("/dnd/start", source, nodes, this.copy);
		this.events = [
			on(win.doc, touch.move, lang.hitch(this, "onMouseMove")),
			on(win.doc, touch.release,   lang.hitch(this, "onMouseUp")),
			on(win.doc, "keydown",   lang.hitch(this, "onKeyDown")),
			on(win.doc, "keyup",     lang.hitch(this, "onKeyUp")),
			// cancel text selection and text dragging
			on(win.doc, "dragstart",   event.stop),
			on(win.body(), "selectstart", event.stop)
		];
		var c = "dojoDnd" + (copy ? "Copy" : "Move");
		domClass.add(win.body(), c);
	},
	canDrop: function(flag){
		// summary:
		//		called to notify if the current target can accept items
		var canDropFlag = Boolean(this.target && flag);
		if(this.canDropFlag != canDropFlag){
			this.canDropFlag = canDropFlag;
			this.avatar.update();
		}
	},
	stopDrag: function(){
		// summary:
		//		stop the DnD in progress
		domClass.remove(win.body(), ["dojoDndCopy", "dojoDndMove"]);
		array.forEach(this.events, function(handle){ handle.remove(); });
		this.events = [];
		this.avatar.destroy();
		this.avatar = null;
		this.source = this.target = null;
		this.nodes = [];
	},
	makeAvatar: function(){
		// summary:
		//		makes the avatar; it is separate to be overwritten dynamically, if needed
		return new Avatar(this);
	},
	updateAvatar: function(){
		// summary:
		//		updates the avatar; it is separate to be overwritten dynamically, if needed
		this.avatar.update();
	},

	// mouse event processors
	onMouseMove: function(e){
		// summary:
		//		event processor for onmousemove
		// e: Event
		//		mouse event
		var a = this.avatar;
		if(a){
			autoscroll.autoScrollNodes(e);
			//autoscroll.autoScroll(e);
			var s = a.node.style;
			s.left = (e.pageX + this.OFFSET_X) + "px";
			s.top  = (e.pageY + this.OFFSET_Y) + "px";
			var copy = Boolean(this.source.copyState(dnd.getCopyKeyState(e)));
			if(this.copy != copy){
				this._setCopyStatus(copy);
			}
		}
		if(has("touch")){
			// Prevent page from scrolling so that user can drag instead.
			e.preventDefault();
		}
	},
	onMouseUp: function(e){
		// summary:
		//		event processor for onmouseup
		// e: Event
		//		mouse event
		if(this.avatar){
			if(this.target && this.canDropFlag){
				var copy = Boolean(this.source.copyState(dnd.getCopyKeyState(e)));
				topic.publish("/dnd/drop/before", this.source, this.nodes, copy, this.target, e);
				topic.publish("/dnd/drop", this.source, this.nodes, copy, this.target, e);
			}else{
				topic.publish("/dnd/cancel");
			}
			this.stopDrag();
		}
	},

	// keyboard event processors
	onKeyDown: function(e){
		// summary:
		//		event processor for onkeydown:
		//		watching for CTRL for copy/move status, watching for ESCAPE to cancel the drag
		// e: Event
		//		keyboard event
		if(this.avatar){
			switch(e.keyCode){
				case keys.CTRL:
					var copy = Boolean(this.source.copyState(true));
					if(this.copy != copy){
						this._setCopyStatus(copy);
					}
					break;
				case keys.ESCAPE:
					topic.publish("/dnd/cancel");
					this.stopDrag();
					break;
			}
		}
	},
	onKeyUp: function(e){
		// summary:
		//		event processor for onkeyup, watching for CTRL for copy/move status
		// e: Event
		//		keyboard event
		if(this.avatar && e.keyCode == keys.CTRL){
			var copy = Boolean(this.source.copyState(false));
			if(this.copy != copy){
				this._setCopyStatus(copy);
			}
		}
	},

	// utilities
	_setCopyStatus: function(copy){
		// summary:
		//		changes the copy status
		// copy: Boolean
		//		the copy status
		this.copy = copy;
		this.source._markDndStatus(this.copy);
		this.updateAvatar();
		domClass.replace(win.body(),
			"dojoDnd" + (this.copy ? "Copy" : "Move"),
			"dojoDnd" + (this.copy ? "Move" : "Copy"));
	}
});

// dnd._manager:
//		The manager singleton variable. Can be overwritten if needed.
dnd._manager = null;

Manager.manager = dnd.manager = function(){
	// summary:
	//		Returns the current DnD manager.  Creates one if it is not created yet.
	if(!dnd._manager){
		dnd._manager = new Manager();
	}
	return dnd._manager;	// Object
};

return Manager;
});

},
'dojo/dnd/Avatar':function(){
define("dojo/dnd/Avatar", [
	"../_base/declare",
	"../_base/window",
	"../dom",
	"../dom-attr",
	"../dom-class",
	"../dom-construct",
	"../hccss",
	"../query"
], function(declare, win, dom, domAttr, domClass, domConstruct, has, query){

// module:
//		dojo/dnd/Avatar

return declare("dojo.dnd.Avatar", null, {
	// summary:
	//		Object that represents transferred DnD items visually
	// manager: Object
	//		a DnD manager object

	constructor: function(manager){
		this.manager = manager;
		this.construct();
	},

	// methods
	construct: function(){
		// summary:
		//		constructor function;
		//		it is separate so it can be (dynamically) overwritten in case of need

		var a = domConstruct.create("table", {
				"class": "dojoDndAvatar",
				style: {
					position: "absolute",
					zIndex:   "1999",
					margin:   "0px"
				}
			}),
			source = this.manager.source, node,
			b = domConstruct.create("tbody", null, a),
			tr = domConstruct.create("tr", null, b),
			td = domConstruct.create("td", null, tr),
			k = Math.min(5, this.manager.nodes.length), i = 0;

		if(has("highcontrast")){
			domConstruct.create("span", {
				id : "a11yIcon",
				innerHTML : this.manager.copy ? '+' : "<"
			}, td)
		}
		domConstruct.create("span", {
			innerHTML: source.generateText ? this._generateText() : ""
		}, td);

		// we have to set the opacity on IE only after the node is live
		domAttr.set(tr, {
			"class": "dojoDndAvatarHeader",
			style: {opacity: 0.9}
		});
		for(; i < k; ++i){
			if(source.creator){
				// create an avatar representation of the node
				node = source._normalizedCreator(source.getItem(this.manager.nodes[i].id).data, "avatar").node;
			}else{
				// or just clone the node and hope it works
				node = this.manager.nodes[i].cloneNode(true);
				if(node.tagName.toLowerCase() == "tr"){
					// insert extra table nodes
					var table = domConstruct.create("table"),
						tbody = domConstruct.create("tbody", null, table);
					tbody.appendChild(node);
					node = table;
				}
			}
			node.id = "";
			tr = domConstruct.create("tr", null, b);
			td = domConstruct.create("td", null, tr);
			td.appendChild(node);
			domAttr.set(tr, {
				"class": "dojoDndAvatarItem",
				style: {opacity: (9 - i) / 10}
			});
		}
		this.node = a;
	},
	destroy: function(){
		// summary:
		//		destructor for the avatar; called to remove all references so it can be garbage-collected
		domConstruct.destroy(this.node);
		this.node = false;
	},
	update: function(){
		// summary:
		//		updates the avatar to reflect the current DnD state
		domClass.toggle(this.node, "dojoDndAvatarCanDrop", this.manager.canDropFlag);
		if(has("highcontrast")){
			var icon = dom.byId("a11yIcon");
			var text = '+';   // assume canDrop && copy
			if (this.manager.canDropFlag && !this.manager.copy){
				text = '< '; // canDrop && move
			}else if (!this.manager.canDropFlag && !this.manager.copy){
				text = "o"; //!canDrop && move
			}else if(!this.manager.canDropFlag){
				text = 'x';  // !canDrop && copy
			}
			icon.innerHTML=text;
		}
		// replace text
		query(("tr.dojoDndAvatarHeader td span" +(has("highcontrast") ? " span" : "")), this.node).forEach(
			function(node){
				node.innerHTML = this.manager.source.generateText ? this._generateText() : "";
			}, this);
	},
	_generateText: function(){
		// summary:
		//		generates a proper text to reflect copying or moving of items
		return this.manager.nodes.length.toString();
	}
});

});

},
'gridx/modules/VLayout':function(){
define("gridx/modules/VLayout", [
	"dojo/_base/declare",
	"dojo/DeferredList",
	"../core/_Module"
], function(declare, DeferredList, _Module){

	return declare(/*===== "gridx.modules.VLayout", =====*/_Module, {
		// summary:
		//		This module manages the vertical layout of all the grid UI parts.
		// description:
		//		When user creates a grid with a given height, it means the height of the whole grid,
		//		which includes grid body, toobar, pagination bar, headerbar, horizontal scrollerbar, etc.
		//		So the height of the grid body must be calculated out so as to layout the grid properly.
		//		This module calculates grid body height by collecting height from all the registered
		//		grid UI parts. The reLayout function in this module will be called everytime the
		//		grid size is changed.

		name: 'vLayout',

		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				vLayout: this
			};
		},

		preload: function(){
			// tags:
			//		protected extension
			var t = this,
				g = t.grid;
			t.connect(g, '_onResizeEnd', function(changeSize, ds){
				var d, dl = [];
				for(d in ds){
					dl.push(ds[d]);
				}
				new DeferredList(dl).then(function(){
					t.reLayout();
				});
			});
			if(g.autoHeight){
				t.connect(g.body, 'onRender', 'reLayout');
			}else{
				t.connect(g, 'setColumns', function(){
					setTimeout(function(){
						t.reLayout();
					}, 0);
				});
			}
		},
	
		load: function(args, startup){
			// tags:
			//		protected extension
			var t = this;
			startup.then(function(){
				if(t._defs && t._mods){
					new DeferredList(t._defs).then(function(){
						t._layout();
						t.loaded.callback();
					});
				}else{
					t.loaded.callback();
				}
			});
		},
	
		//Public ---------------------------------------------------------------------
		register: function(mod, nodeName, hookPoint, priority, deferReady){
			// summary:
			//		When the 'mod' is loaded or "ready", hook 'mod'['nodeName'] to grid['hookPoint'] with priority 'priority'
			// mod: Object
			//		The module object
			// nodeName: String
			//		The name of the node to be hooked. Must be able to be accessed by mod[nodeName]
			// hookPoint: String
			//		The name of a hook point in grid.
			// priority: Number?
			//		The priority of the hook node. If less than 0, then it's above the base node, larger than 0, below the base node.
			var t = this;
			t._defs = t._defs || [];
			t._mods = t._mods || {};
			t._mods[hookPoint] = t._mods[hookPoint] || [];
			t._defs.push(deferReady || mod.loaded);
			t._mods[hookPoint].push({
				p: priority || 0,
				mod: mod,
				nodeName: nodeName
			});
		},
		
		reLayout: function(){
			// summary:
			//		Virtically re-layout all the grid UI parts.
			var t = this,
				freeHeight = 0,
				hookPoint, n;
			for(hookPoint in t._mods){
				n = t.grid[hookPoint];
				if(n){
					freeHeight += n.offsetHeight;
				}
			}
			t._updateHeight(freeHeight);
		},

		//Private-------------------------------------------------------------------------------
		_layout: function(){
			var freeHeight = 0,
				t = this,
				mods = t._mods,
				hookPoint, n, i, hp, mod, nodeName;
			for(hookPoint in mods){
				n = t.grid[hookPoint];
				if(n){
					hp = mods[hookPoint];
					hp.sort(function(a, b){
						return a.p - b.p;
					});
					for(i = 0; i < hp.length; ++i){
						mod = hp[i].mod;
						nodeName = hp[i].nodeName;
						if(mod && mod[nodeName]){
							n.appendChild(mod[nodeName]);
						}
					}
					freeHeight += n.offsetHeight;
				}
			}
			t._updateHeight(freeHeight);
		},

		_updateHeight: function(freeHeight){
			var g = this.grid,
				dn = g.domNode,
				ms = g.mainNode.style;
			if(g.autoHeight){
				g.vScroller.loaded.then(function(){
					var lastRow = g.bodyNode.lastChild,
						bodyHeight = lastRow ? lastRow.offsetTop + lastRow.offsetHeight : g.emptyNode.offsetHeight;
					dn.style.height = (bodyHeight + freeHeight) + 'px';
					ms.height = bodyHeight + "px";
				});
			}else if(dn.clientHeight > freeHeight){
				//If grid height is smaller than freeHeight, IE will throw errer.
				ms.height = (dn.clientHeight - freeHeight) + "px";
			}
		}
	});
});

},
'dojo/_base/query':function(){
define("dojo/_base/query", ["../query", "./NodeList"], function(query){
	// module:
	//		dojo/_base/query

	/*=====
	return {
		// summary:
		//		Deprecated.   Use dojo/query instead.
	};
	=====*/

	return query;
});

},
'gridx/modules/HLayout':function(){
define("gridx/modules/HLayout", [
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/array",
	"dojo/dom-style",
	"dojo/DeferredList",
	"../core/_Module"
], function(declare, Deferred, array, domStyle, DeferredList, _Module){

	return declare(/*===== "gridx.modules.HLayout", =====*/_Module, {
		// summary:
		//		This module manages the horizontal layout of all grid UI parts.
		// description:
		//		When a user creates a grid with a given width, it means the width of the whole grid,
		//		which includes grid body, row header, and virtical scrollerbar (and maybe more in the future).
		//		So the width of the grid body must be calculated out so as to layout the grid properly.
		//		This module calculates grid body width by collecting width from all the registered
		//		grid UI parts. It is assumed that the width of these UI parts will not change when grid is resized.

		name: 'hLayout',

		getAPIPath: function(){
			// tags:
			//		protected extension
			return {
				hLayout: this
			};
		},
	
		load: function(args, startup){
			// tags:
			//		protected extension
			var t = this;
			t.connect(t.grid, '_onResizeEnd', function(changeSize, ds){
				var d, dl = [];
				for(d in ds){
					dl.push(ds[d]);
				}
				new DeferredList(dl).then(function(){
					t.reLayout();
				});
			});
			startup.then(function(){
				t._layout();
			});
		},

		//Package--------------------------------------------------------

		// lead: [package readonly] Number
		//		The pixel size of the total width of all the UI parts that are before(LTR: left, RTL: right) the grid body.
		lead: 0,

		// tail: [package readonly] Number
		//		The pixel size of the total width of all the UI parts that are after(LTR: right, RTL: left) the grid body.
		tail: 0,
	
		register: function(ready, refNode, isTail){
			// summary:
			//		Register a 'refNode' so this module can calculate its width when it is 'ready'
			// tags:
			//		package
			// ready: dojo.Deferred|null
			//		A deferred object indicating when the DOM node is ready for width calculation.
			//		If omitted, it means the refNode can be calculated at any time.
			// refNode: DOMNode
			//		The DOM node that represents a UI part in grid.
			// isTail: Boolean?
			//		If the 'refNode' appears after(LTR: right, RTL: left) the grid body, set this to true.
			var r = this._regs = this._regs || [];
			if(!ready){
				ready = new Deferred();
				ready.callback();
			}
			r.push([ready, refNode, isTail]);
		},

		reLayout: function(){
			// summary:
			//		Re-layout the grid horizontally. This means calculated the width of all registered
			//		grid UI components except the grid body. Then update the grid body width.
			//		Usually there's no need for users to call this method. It'll be automatically called
			//		when calling grid.resize().
			var t = this,
				r = t._regs,
				lead = 0,
				tail = 0;
			if(r){
				array.forEach(r, function(reg){
					var w = reg[1].offsetWidth || domStyle.get(reg[1], 'width');
					if(reg[2]){
						tail += w;
					}else{
						lead += w;
					}
				});
				t.lead = lead;
				t.tail = tail;
				t.onUpdateWidth(lead, tail);
			}
		},

		//Event---------------------------------------------------------
		onUpdateWidth: function(){
			// summary:
			//		Fired when the body width is updated.
			// tags:
			//		package
		},

		//Private-------------------------------------------------------
		_layout: function(){
			var t = this, r = t._regs;
			if(r){
				var lead = 0, tail = 0,
					dl = array.map(r, function(reg){
						return reg[0];
					});
				new DeferredList(dl).then(function(){
					array.forEach(r, function(reg){
						var w = reg[1].offsetWidth || domStyle.get(reg[1], 'width');
						if(reg[2]){
							tail += w;
						}else{
							lead += w;
						}
					});
					t.lead = lead;
					t.tail = tail;
					t.loaded.callback();
				});
			}else{
				t.loaded.callback();
			}
		}
	});
});

},
'*now':function(r){r(['dojo/i18n!*preload*gridx/nls/Grid*["ar","ca","cs","da","de","el","en-gb","en-us","es-es","fi-fi","fr-fr","he-il","hu","it-it","ja-jp","ko-kr","nl-nl","nb","pl","pt-br","pt-pt","ru","sk","sl","sv","th","tr","zh-tw","zh-cn","ROOT"]']);}
}});
define("gridx/Grid", [
	"dojo/_base/kernel",
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dojo/_base/sniff",
	"dojo/on",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/_base/query",
	"dojox/html/metrics",
	"dijit/_WidgetBase",
	"dijit/_FocusMixin",
	"dijit/_TemplatedMixin",
	"dojo/text!./templates/Grid.html",
	"./core/Core",
	"./core/model/extensions/Query",
	"./core/_Module",
	"./modules/Header",
	"./modules/Body",
	"./modules/VLayout",
	"./modules/HLayout",
	"./modules/VScroller",
	"./modules/HScroller",
	"./modules/ColumnWidth"
], function(kernel, declare, array, lang, has, on, domClass, domGeometry, query, metrics,
	_WidgetBase, _FocusMixin, _TemplatedMixin, template,
	Core, Query, _Module, Header, Body, VLayout, HLayout, VScroller, HScroller, ColumnWidth){

	var forEach = array.forEach,
		dummyFunc = function(){};

	
	var Grid = declare('gridx.Grid', [_WidgetBase, _TemplatedMixin, _FocusMixin, Core], {
		// summary:
		//		Gridx is a highly extensible widget providing grid/table functionalities. 
		// description:
		//		Gridx is much smaller, faster, more reasonable designed, more powerful and more flexible 
		//		compared to the old dojo DataGrid/EnhancedGrid.
		//
		//		NOTE:
		//		=====
		//		The API documents will be updated from time to time. If you encountered an API whose doc is
		//		not sufficient enough, please refer to the following link for latest API docs:
		//		http://evanhw.github.com/gridx/doc/gridx.html

		
		templateString: template,

		coreModules: [
			//Put default modules here!
			Header,
			Body,
			VLayout,
			HLayout,
			VScroller,
			HScroller,
			ColumnWidth
		],

		coreExtensions: [
			//Put default extensions here!
			Query
		],
	
		postCreate: function(){
			// summary:
			//		Override to initialize grid modules
			// tags:
			//		protected extension
			var t = this;
			t.inherited(arguments);
			t._eventFlags = {};
			t.modules = t.coreModules.concat(t.modules || []);
			t.modelExtensions = t.coreExtensions.concat(t.modelExtensions || []);
			domClass.toggle(t.domNode, 'gridxRtl', !t.isLeftToRight());
			t.lastFocusNode.setAttribute('tabIndex', t.domNode.getAttribute('tabIndex'));
			t._initEvents(t._compNames, t._eventNames);
			t._init();
			//resize the grid when zoomed in/out.
			t.connect(metrics, 'onFontResize', function(){
				t.resize();
			});
		},
	
		startup: function(){
			// summary:
			//		Startup this grid widget
			// tags:
			//		public extension
			if(!this._started){
				this.inherited(arguments);
				this._deferStartup.callback();
			}
		},
	
		destroy: function(){
			// summary:
			//		Destroy this grid widget
			// tags:
			//		public extension
			this._uninit();
			this.inherited(arguments);
		},

	/*=====
		// autoHeight: Boolean
		//		If true, the grid's height is determined by the total height of the rows in current body view,
		//		so that there will never be vertical scroller bar. And when scrolling the mouse wheel over grid body,
		//		the whole page will be scrolled. Note if this is false, only the grid body will be scrolled.
		autoHeight: false,
		// autoWidth: Boolean
		//		If true, the grid's width is determined by the total width of the columns, so that there will
		//		never be horizontal scroller bar.
		autoWidth: false,
	=====*/

		
		resize: function(changeSize){
			// summary:
			//		Resize the grid using given width and height.
			// tags:
			//		public
			// changeSize: Object?
			//		An object like {w: ..., h: ...}.
			//		If omitted, the grid will re-layout itself in current width/height.
			var t = this, ds = {};
			if(changeSize){
				if(t.autoWidth){
					changeSize.w = undefined;
				}
				if(t.autoHeight){
					changeSize.h = undefined;
				}
				domGeometry.setMarginBox(t.domNode, changeSize);
			}
			t._onResizeBegin(changeSize, ds);
			t._onResizeEnd(changeSize, ds);
		},

		//Private-------------------------------------------------------------------------------
		_onResizeBegin: function(){},
		_onResizeEnd: function(){},
		
		//event handling begin
		_compNames: ['Cell', 'HeaderCell', 'Row', 'Header'],
	
		_eventNames: [
			'Click', 'DblClick', 
			'MouseDown', 'MouseUp', 
			'MouseOver', 'MouseOut', 
			'MouseMove', 'ContextMenu',
			'KeyDown', 'KeyPress', 'KeyUp'
		],
	
		_initEvents: function(objNames, evtNames){
			var t = this;
			forEach(objNames, function(comp){
				forEach(evtNames, function(event){
					var evtName = 'on' + comp + event;
					t[evtName] = t[evtName] || dummyFunc;
				});
			});
		},
	
		_connectEvents: function(node, connector, scope){
			for(var t = this,
					m = t.model,
					eventName,
					eventNames = t._eventNames,
					len = eventNames.length,
					i = 0; i < len; ++i){
				eventName = eventNames[i];
				m._cnnts.push(on(node, eventName.toLowerCase(), lang.hitch(scope, connector, eventName)));
			}
		},
	
		_isConnected: function(eventName){
			return this[eventName] !== dummyFunc;
		},
		//event handling end

		_isCopyEvent: function(evt){
			// summary:
			//		On Mac Ctrl+click also opens a context menu. So call this to check ctrlKey instead of directly call evt.ctrlKey
			//		if you need to implement some handler for Ctrl+click.
			return has('mac') ? evt.metaKey : evt.ctrlKey;
		}
	});

	Grid.markupFactory = function(props, node, ctor){
		if(!props.structure && node.nodeName.toLowerCase() == "table"){
			kernel.deprecated('Column declaration in <th> elements is deprecated,', 'use "structure" attribute in data-dojo-props instead', '1.1');
			var s = props.structure = [];
			query("thead > tr > th", node).forEach(function(th){
				var col = {};
				forEach(_Module._markupAttrs, function(attr){
					if(attr[0] == '!'){
						attr = attr.slice(1);
						col[attr] = eval(th.getAttribute(attr));
					}else{
						col[attr] = th.getAttribute(attr);
					}
				});
				col.name = col.name || th.innerHTML;
				s.push(col);
			});
		}
		return new ctor(props, node);
	};
	
	return Grid;
});
