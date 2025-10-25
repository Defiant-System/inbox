let CssSelector = (() => {

	let Sel = {
		constrain(base, str) {
			// Match selectors followed by a block
			let regex = /([^{]+)(\{[^}]*\})/g;
		    let parsed = [];
		    let match;
		    // Loop through all matches in the string
		    while ((match = regex.exec(str)) !== null) {
		        // Split by commas to handle multiple selectors
		        let selectors = match[1].split(",").map(s => `${base} ${s.trim()}`);
		        let rules = match[2];
		        parsed.push(`${selectors.join(",")} ${rules}`);
		    }
			return parsed.join("\n");
		}
	};

	return Sel;

})();

/*! @license DOMPurify 3.3.0
 *| (c) Cure53 and other contributors
 *| Released under the Apache license 2.0 and Mozilla Public License 2.0
 *| github.com/cure53/DOMPurify/blob/3.3.0/LICENSE
 */

let purify = (function () {
	'use strict';

	const {
		entries,
		setPrototypeOf,
		isFrozen,
		getPrototypeOf,
		getOwnPropertyDescriptor
	} = Object;
	let {
		freeze,
		seal,
		create
	} = Object; // eslint-disable-line import/no-mutable-exports
	let {
		apply,
		construct
	} = typeof Reflect !== 'undefined' && Reflect;
	if (!freeze) {
		freeze = function freeze(x) {
			return x;
		};
	}
	if (!seal) {
		seal = function seal(x) {
			return x;
		};
	}
	if (!apply) {
		apply = function apply(func, thisArg) {
			for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
				args[_key - 2] = arguments[_key];
			}
			return func.apply(thisArg, args);
		};
	}
	if (!construct) {
		construct = function construct(Func) {
			for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}
			return new Func(...args);
		};
	}
	const arrayForEach = unapply(Array.prototype.forEach);
	const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
	const arrayPop = unapply(Array.prototype.pop);
	const arrayPush = unapply(Array.prototype.push);
	const arraySplice = unapply(Array.prototype.splice);
	const stringToLowerCase = unapply(String.prototype.toLowerCase);
	const stringToString = unapply(String.prototype.toString);
	const stringMatch = unapply(String.prototype.match);
	const stringReplace = unapply(String.prototype.replace);
	const stringIndexOf = unapply(String.prototype.indexOf);
	const stringTrim = unapply(String.prototype.trim);
	const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
	const regExpTest = unapply(RegExp.prototype.test);
	const typeErrorCreate = unconstruct(TypeError);
	/**
	 * Creates a new function that calls the given function with a specified thisArg and arguments.
	 *
	 * @param func - The function to be wrapped and called.
	 * @returns A new function that calls the given function with a specified thisArg and arguments.
	 */
	function unapply(func) {
		return function (thisArg) {
			if (thisArg instanceof RegExp) {
				thisArg.lastIndex = 0;
			}
			for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
				args[_key3 - 1] = arguments[_key3];
			}
			return apply(func, thisArg, args);
		};
	}
	/**
	 * Creates a new function that constructs an instance of the given constructor function with the provided arguments.
	 *
	 * @param func - The constructor function to be wrapped and called.
	 * @returns A new function that constructs an instance of the given constructor function with the provided arguments.
	 */
	function unconstruct(Func) {
		return function () {
			for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				args[_key4] = arguments[_key4];
			}
			return construct(Func, args);
		};
	}
	/**
	 * Add properties to a lookup table
	 *
	 * @param set - The set to which elements will be added.
	 * @param array - The array containing elements to be added to the set.
	 * @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
	 * @returns The modified set with added elements.
	 */
	function addToSet(set, array) {
		let transformCaseFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : stringToLowerCase;
		if (setPrototypeOf) {
			// Make 'in' and truthy checks like Boolean(set.constructor)
			// independent of any properties defined on Object.prototype.
			// Prevent prototype setters from intercepting set as a this value.
			setPrototypeOf(set, null);
		}
		let l = array.length;
		while (l--) {
			let element = array[l];
			if (typeof element === 'string') {
				const lcElement = transformCaseFunc(element);
				if (lcElement !== element) {
					// Config presets (e.g. tags.js, attrs.js) are immutable.
					if (!isFrozen(array)) {
						array[l] = lcElement;
					}
					element = lcElement;
				}
			}
			set[element] = true;
		}
		return set;
	}
	/**
	 * Clean up an array to harden against CSPP
	 *
	 * @param array - The array to be cleaned.
	 * @returns The cleaned version of the array
	 */
	function cleanArray(array) {
		for (let index = 0; index < array.length; index++) {
			const isPropertyExist = objectHasOwnProperty(array, index);
			if (!isPropertyExist) {
				array[index] = null;
			}
		}
		return array;
	}
	/**
	 * Shallow clone an object
	 *
	 * @param object - The object to be cloned.
	 * @returns A new object that copies the original.
	 */
	function clone(object) {
		const newObject = create(null);
		for (const [property, value] of entries(object)) {
			const isPropertyExist = objectHasOwnProperty(object, property);
			if (isPropertyExist) {
				if (Array.isArray(value)) {
					newObject[property] = cleanArray(value);
				} else if (value && typeof value === 'object' && value.constructor === Object) {
					newObject[property] = clone(value);
				} else {
					newObject[property] = value;
				}
			}
		}
		return newObject;
	}
	/**
	 * This method automatically checks if the prop is function or getter and behaves accordingly.
	 *
	 * @param object - The object to look up the getter function in its prototype chain.
	 * @param prop - The property name for which to find the getter function.
	 * @returns The getter function found in the prototype chain or a fallback function.
	 */
	function lookupGetter(object, prop) {
		while (object !== null) {
			const desc = getOwnPropertyDescriptor(object, prop);
			if (desc) {
				if (desc.get) {
					return unapply(desc.get);
				}
				if (typeof desc.value === 'function') {
					return unapply(desc.value);
				}
			}
			object = getPrototypeOf(object);
		}
		function fallbackValue() {
			return null;
		}
		return fallbackValue;
	}

	const html$1 = freeze(['a', 'abbr', 'acronym', 'address', 'area', 'article', 'aside', 'audio', 'b', 'bdi', 'bdo', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'content', 'data', 'datalist', 'dd', 'decorator', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meter', 'nav', 'nobr', 'ol', 'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'search', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']);
	const svg$1 = freeze(['svg', 'a', 'altglyph', 'altglyphdef', 'altglyphitem', 'animatecolor', 'animatemotion', 'animatetransform', 'circle', 'clippath', 'defs', 'desc', 'ellipse', 'enterkeyhint', 'exportparts', 'filter', 'font', 'g', 'glyph', 'glyphref', 'hkern', 'image', 'inputmode', 'line', 'lineargradient', 'marker', 'mask', 'metadata', 'mpath', 'part', 'path', 'pattern', 'polygon', 'polyline', 'radialgradient', 'rect', 'stop', 'style', 'switch', 'symbol', 'text', 'textpath', 'title', 'tref', 'tspan', 'view', 'vkern']);
	const svgFilters = freeze(['feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap', 'feDistantLight', 'feDropShadow', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile', 'feTurbulence']);
	// List of SVG elements that are disallowed by default.
	// We still need to know them so that we can do namespace
	// checks properly in case one wants to add them to
	// allow-list.
	const svgDisallowed = freeze(['animate', 'color-profile', 'cursor', 'discard', 'font-face', 'font-face-format', 'font-face-name', 'font-face-src', 'font-face-uri', 'foreignobject', 'hatch', 'hatchpath', 'mesh', 'meshgradient', 'meshpatch', 'meshrow', 'missing-glyph', 'script', 'set', 'solidcolor', 'unknown', 'use']);
	const mathMl$1 = freeze(['math', 'menclose', 'merror', 'mfenced', 'mfrac', 'mglyph', 'mi', 'mlabeledtr', 'mmultiscripts', 'mn', 'mo', 'mover', 'mpadded', 'mphantom', 'mroot', 'mrow', 'ms', 'mspace', 'msqrt', 'mstyle', 'msub', 'msup', 'msubsup', 'mtable', 'mtd', 'mtext', 'mtr', 'munder', 'munderover', 'mprescripts']);
	// Similarly to SVG, we want to know all MathML elements,
	// even those that we disallow by default.
	const mathMlDisallowed = freeze(['maction', 'maligngroup', 'malignmark', 'mlongdiv', 'mscarries', 'mscarry', 'msgroup', 'mstack', 'msline', 'msrow', 'semantics', 'annotation', 'annotation-xml', 'mprescripts', 'none']);
	const text = freeze(['#text']);

	const html = freeze(['accept', 'action', 'align', 'alt', 'autocapitalize', 'autocomplete', 'autopictureinpicture', 'autoplay', 'background', 'bgcolor', 'border', 'capture', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'clear', 'color', 'cols', 'colspan', 'controls', 'controlslist', 'coords', 'crossorigin', 'datetime', 'decoding', 'default', 'dir', 'disabled', 'disablepictureinpicture', 'disableremoteplayback', 'download', 'draggable', 'enctype', 'enterkeyhint', 'exportparts', 'face', 'for', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'id', 'inert', 'inputmode', 'integrity', 'ismap', 'kind', 'label', 'lang', 'list', 'loading', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'minlength', 'multiple', 'muted', 'name', 'nonce', 'noshade', 'novalidate', 'nowrap', 'open', 'optimum', 'part', 'pattern', 'placeholder', 'playsinline', 'popover', 'popovertarget', 'popovertargetaction', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'rev', 'reversed', 'role', 'rows', 'rowspan', 'spellcheck', 'scope', 'selected', 'shape', 'size', 'sizes', 'slot', 'span', 'srclang', 'start', 'src', 'srcset', 'step', 'style', 'summary', 'tabindex', 'title', 'translate', 'type', 'usemap', 'valign', 'value', 'width', 'wrap', 'xmlns', 'slot']);
	const svg = freeze(['accent-height', 'accumulate', 'additive', 'alignment-baseline', 'amplitude', 'ascent', 'attributename', 'attributetype', 'azimuth', 'basefrequency', 'baseline-shift', 'begin', 'bias', 'by', 'class', 'clip', 'clippathunits', 'clip-path', 'clip-rule', 'color', 'color-interpolation', 'color-interpolation-filters', 'color-profile', 'color-rendering', 'cx', 'cy', 'd', 'dx', 'dy', 'diffuseconstant', 'direction', 'display', 'divisor', 'dur', 'edgemode', 'elevation', 'end', 'exponent', 'fill', 'fill-opacity', 'fill-rule', 'filter', 'filterunits', 'flood-color', 'flood-opacity', 'font-family', 'font-size', 'font-size-adjust', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'fx', 'fy', 'g1', 'g2', 'glyph-name', 'glyphref', 'gradientunits', 'gradienttransform', 'height', 'href', 'id', 'image-rendering', 'in', 'in2', 'intercept', 'k', 'k1', 'k2', 'k3', 'k4', 'kerning', 'keypoints', 'keysplines', 'keytimes', 'lang', 'lengthadjust', 'letter-spacing', 'kernelmatrix', 'kernelunitlength', 'lighting-color', 'local', 'marker-end', 'marker-mid', 'marker-start', 'markerheight', 'markerunits', 'markerwidth', 'maskcontentunits', 'maskunits', 'max', 'mask', 'mask-type', 'media', 'method', 'mode', 'min', 'name', 'numoctaves', 'offset', 'operator', 'opacity', 'order', 'orient', 'orientation', 'origin', 'overflow', 'paint-order', 'path', 'pathlength', 'patterncontentunits', 'patterntransform', 'patternunits', 'points', 'preservealpha', 'preserveaspectratio', 'primitiveunits', 'r', 'rx', 'ry', 'radius', 'refx', 'refy', 'repeatcount', 'repeatdur', 'restart', 'result', 'rotate', 'scale', 'seed', 'shape-rendering', 'slope', 'specularconstant', 'specularexponent', 'spreadmethod', 'startoffset', 'stddeviation', 'stitchtiles', 'stop-color', 'stop-opacity', 'stroke-dasharray', 'stroke-dashoffset', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-opacity', 'stroke', 'stroke-width', 'style', 'surfacescale', 'systemlanguage', 'tabindex', 'tablevalues', 'targetx', 'targety', 'transform', 'transform-origin', 'text-anchor', 'text-decoration', 'text-rendering', 'textlength', 'type', 'u1', 'u2', 'unicode', 'values', 'viewbox', 'visibility', 'version', 'vert-adv-y', 'vert-origin-x', 'vert-origin-y', 'width', 'word-spacing', 'wrap', 'writing-mode', 'xchannelselector', 'ychannelselector', 'x', 'x1', 'x2', 'xmlns', 'y', 'y1', 'y2', 'z', 'zoomandpan']);
	const mathMl = freeze(['accent', 'accentunder', 'align', 'bevelled', 'close', 'columnsalign', 'columnlines', 'columnspan', 'denomalign', 'depth', 'dir', 'display', 'displaystyle', 'encoding', 'fence', 'frame', 'height', 'href', 'id', 'largeop', 'length', 'linethickness', 'lspace', 'lquote', 'mathbackground', 'mathcolor', 'mathsize', 'mathvariant', 'maxsize', 'minsize', 'movablelimits', 'notation', 'numalign', 'open', 'rowalign', 'rowlines', 'rowspacing', 'rowspan', 'rspace', 'rquote', 'scriptlevel', 'scriptminsize', 'scriptsizemultiplier', 'selection', 'separator', 'separators', 'stretchy', 'subscriptshift', 'supscriptshift', 'symmetric', 'voffset', 'width', 'xmlns']);
	const xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

	// eslint-disable-next-line unicorn/better-regex
	const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm); // Specify template detection regex for SAFE_FOR_TEMPLATES mode
	const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
	const TMPLIT_EXPR = seal(/\$\{[\w\W]*/gm); // eslint-disable-line unicorn/better-regex
	const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/); // eslint-disable-line no-useless-escape
	const ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
	const IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
	);
	const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
	const ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
	);
	const DOCTYPE_NAME = seal(/^html$/i);
	const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);

	var EXPRESSIONS = /*#__PURE__*/Object.freeze({
		__proto__: null,
		ARIA_ATTR: ARIA_ATTR,
		ATTR_WHITESPACE: ATTR_WHITESPACE,
		CUSTOM_ELEMENT: CUSTOM_ELEMENT,
		DATA_ATTR: DATA_ATTR,
		DOCTYPE_NAME: DOCTYPE_NAME,
		ERB_EXPR: ERB_EXPR,
		IS_ALLOWED_URI: IS_ALLOWED_URI,
		IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA,
		MUSTACHE_EXPR: MUSTACHE_EXPR,
		TMPLIT_EXPR: TMPLIT_EXPR
	});

	/* eslint-disable @typescript-eslint/indent */
	// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
	const NODE_TYPE = {
		element: 1,
		attribute: 2,
		text: 3,
		cdataSection: 4,
		entityReference: 5,
		// Deprecated
		entityNode: 6,
		// Deprecated
		progressingInstruction: 7,
		comment: 8,
		document: 9,
		documentType: 10,
		documentFragment: 11,
		notation: 12 // Deprecated
	};
	const getGlobal = function getGlobal() {
		return typeof window === 'undefined' ? null : window;
	};
	/**
	 * Creates a no-op policy for internal use only.
	 * Don't export this function outside this module!
	 * @param trustedTypes The policy factory.
	 * @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
	 * @return The policy created (or null, if Trusted Types
	 * are not supported or creating the policy failed).
	 */
	const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
		if (typeof trustedTypes !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
			return null;
		}
		// Allow the callers to control the unique policy name
		// by adding a data-tt-policy-suffix to the script element with the DOMPurify.
		// Policy creation with duplicate names throws in Trusted Types.
		let suffix = null;
		const ATTR_NAME = 'data-tt-policy-suffix';
		if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
			suffix = purifyHostElement.getAttribute(ATTR_NAME);
		}
		const policyName = 'dompurify' + (suffix ? '#' + suffix : '');
		try {
			return trustedTypes.createPolicy(policyName, {
				createHTML(html) {
					return html;
				},
				createScriptURL(scriptUrl) {
					return scriptUrl;
				}
			});
		} catch (_) {
			// Policy creation failed (most likely another DOMPurify script has
			// already run). Skip creating the policy, as this will only cause errors
			// if TT are enforced.
			console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
			return null;
		}
	};
	const _createHooksMap = function _createHooksMap() {
		return {
			afterSanitizeAttributes: [],
			afterSanitizeElements: [],
			afterSanitizeShadowDOM: [],
			beforeSanitizeAttributes: [],
			beforeSanitizeElements: [],
			beforeSanitizeShadowDOM: [],
			uponSanitizeAttribute: [],
			uponSanitizeElement: [],
			uponSanitizeShadowNode: []
		};
	};
	function createDOMPurify() {
		let window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();
		const DOMPurify = root => createDOMPurify(root);
		DOMPurify.version = '3.3.0';
		DOMPurify.removed = [];
		if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
			// Not running in a browser, provide a factory function
			// so that you can pass your own Window
			DOMPurify.isSupported = false;
			return DOMPurify;
		}
		let {
			document
		} = window;
		const originalDocument = document;
		const currentScript = originalDocument.currentScript;
		const {
			DocumentFragment,
			HTMLTemplateElement,
			Node,
			Element,
			NodeFilter,
			NamedNodeMap = window.NamedNodeMap || window.MozNamedAttrMap,
			HTMLFormElement,
			DOMParser,
			trustedTypes
		} = window;
		const ElementPrototype = Element.prototype;
		const cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
		const remove = lookupGetter(ElementPrototype, 'remove');
		const getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
		const getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
		const getParentNode = lookupGetter(ElementPrototype, 'parentNode');
		// As per issue #47, the web-components registry is inherited by a
		// new document created via createHTMLDocument. As per the spec
		// (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
		// a new empty registry is used when creating a template contents owner
		// document, so we use that as our parent document to ensure nothing
		// is inherited.
		if (typeof HTMLTemplateElement === 'function') {
			const template = document.createElement('template');
			if (template.content && template.content.ownerDocument) {
				document = template.content.ownerDocument;
			}
		}
		let trustedTypesPolicy;
		let emptyHTML = '';
		const {
			implementation,
			createNodeIterator,
			createDocumentFragment,
			getElementsByTagName
		} = document;
		const {
			importNode
		} = originalDocument;
		let hooks = _createHooksMap();
		/**
		 * Expose whether this browser supports running the full DOMPurify.
		 */
		DOMPurify.isSupported = typeof entries === 'function' && typeof getParentNode === 'function' && implementation && implementation.createHTMLDocument !== undefined;
		const {
			MUSTACHE_EXPR,
			ERB_EXPR,
			TMPLIT_EXPR,
			DATA_ATTR,
			ARIA_ATTR,
			IS_SCRIPT_OR_DATA,
			ATTR_WHITESPACE,
			CUSTOM_ELEMENT
		} = EXPRESSIONS;
		let {
			IS_ALLOWED_URI: IS_ALLOWED_URI$1
		} = EXPRESSIONS;
		/**
		 * We consider the elements and attributes below to be safe. Ideally
		 * don't add any new ones but feel free to remove unwanted ones.
		 */
		/* allowed element names */
		let ALLOWED_TAGS = null;
		const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
		/* Allowed attribute names */
		let ALLOWED_ATTR = null;
		const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
		/*
		 * Configure how DOMPurify should handle custom elements and their attributes as well as customized built-in elements.
		 * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
		 * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
		 * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
		 */
		let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
			tagNameCheck: {
				writable: true,
				configurable: false,
				enumerable: true,
				value: null
			},
			attributeNameCheck: {
				writable: true,
				configurable: false,
				enumerable: true,
				value: null
			},
			allowCustomizedBuiltInElements: {
				writable: true,
				configurable: false,
				enumerable: true,
				value: false
			}
		}));
		/* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
		let FORBID_TAGS = null;
		/* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
		let FORBID_ATTR = null;
		/* Config object to store ADD_TAGS/ADD_ATTR functions (when used as functions) */
		const EXTRA_ELEMENT_HANDLING = Object.seal(create(null, {
			tagCheck: {
				writable: true,
				configurable: false,
				enumerable: true,
				value: null
			},
			attributeCheck: {
				writable: true,
				configurable: false,
				enumerable: true,
				value: null
			}
		}));
		/* Decide if ARIA attributes are okay */
		let ALLOW_ARIA_ATTR = true;
		/* Decide if custom data attributes are okay */
		let ALLOW_DATA_ATTR = true;
		/* Decide if unknown protocols are okay */
		let ALLOW_UNKNOWN_PROTOCOLS = false;
		/* Decide if self-closing tags in attributes are allowed.
		 * Usually removed due to a mXSS issue in jQuery 3.0 */
		let ALLOW_SELF_CLOSE_IN_ATTR = true;
		/* Output should be safe for common template engines.
		 * This means, DOMPurify removes data attributes, mustaches and ERB
		 */
		let SAFE_FOR_TEMPLATES = false;
		/* Output should be safe even for XML used within HTML and alike.
		 * This means, DOMPurify removes comments when containing risky content.
		 */
		let SAFE_FOR_XML = true;
		/* Decide if document with <html>... should be returned */
		let WHOLE_DOCUMENT = false;
		/* Track whether config is already set on this instance of DOMPurify. */
		let SET_CONFIG = false;
		/* Decide if all elements (e.g. style, script) must be children of
		 * document.body. By default, browsers might move them to document.head */
		let FORCE_BODY = false;
		/* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
		 * string (or a TrustedHTML object if Trusted Types are supported).
		 * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
		 */
		let RETURN_DOM = false;
		/* Decide if a DOM `DocumentFragment` should be returned, instead of a html
		 * string  (or a TrustedHTML object if Trusted Types are supported) */
		let RETURN_DOM_FRAGMENT = false;
		/* Try to return a Trusted Type object instead of a string, return a string in
		 * case Trusted Types are not supported  */
		let RETURN_TRUSTED_TYPE = false;
		/* Output should be free from DOM clobbering attacks?
		 * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
		 */
		let SANITIZE_DOM = true;
		/* Achieve full DOM Clobbering protection by isolating the namespace of named
		 * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
		 *
		 * HTML/DOM spec rules that enable DOM Clobbering:
		 *   - Named Access on Window (Â§7.3.3)
		 *   - DOM Tree Accessors (Â§3.1.5)
		 *   - Form Element Parent-Child Relations (Â§4.10.3)
		 *   - Iframe srcdoc / Nested WindowProxies (Â§4.8.5)
		 *   - HTMLCollection (Â§4.2.10.2)
		 *
		 * Namespace isolation is implemented by prefixing `id` and `name` attributes
		 * with a constant string, i.e., `user-content-`
		 */
		let SANITIZE_NAMED_PROPS = false;
		const SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
		/* Keep element content when removing element? */
		let KEEP_CONTENT = true;
		/* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
		 * of importing it into a new Document and returning a sanitized copy */
		let IN_PLACE = false;
		/* Allow usage of profiles like html, svg and mathMl */
		let USE_PROFILES = {};
		/* Tags to ignore content of when KEEP_CONTENT is true */
		let FORBID_CONTENTS = null;
		const DEFAULT_FORBID_CONTENTS = addToSet({}, ['annotation-xml', 'audio', 'colgroup', 'desc', 'foreignobject', 'head', 'iframe', 'math', 'mi', 'mn', 'mo', 'ms', 'mtext', 'noembed', 'noframes', 'noscript', 'plaintext', 'script', 'style', 'svg', 'template', 'thead', 'title', 'video', 'xmp']);
		/* Tags that are safe for data: URIs */
		let DATA_URI_TAGS = null;
		const DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
		/* Attributes safe for values like "javascript:" */
		let URI_SAFE_ATTRIBUTES = null;
		const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ['alt', 'class', 'for', 'id', 'label', 'name', 'pattern', 'placeholder', 'role', 'summary', 'title', 'value', 'style', 'xmlns']);
		const MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
		const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
		const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
		/* Document namespace */
		let NAMESPACE = HTML_NAMESPACE;
		let IS_EMPTY_INPUT = false;
		/* Allowed XHTML+XML namespaces */
		let ALLOWED_NAMESPACES = null;
		const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
		let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
		let HTML_INTEGRATION_POINTS = addToSet({}, ['annotation-xml']);
		// Certain elements are allowed in both SVG and HTML
		// namespace. We need to specify them explicitly
		// so that they don't get erroneously deleted from
		// HTML namespace.
		const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
		/* Parsing of strict XHTML documents */
		let PARSER_MEDIA_TYPE = null;
		const SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
		const DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
		let transformCaseFunc = null;
		/* Keep a reference to config to pass to hooks */
		let CONFIG = null;
		/* Ideally, do not touch anything below this line */
		/* ______________________________________________ */
		const formElement = document.createElement('form');
		const isRegexOrFunction = function isRegexOrFunction(testValue) {
			return testValue instanceof RegExp || testValue instanceof Function;
		};
		/**
		 * _parseConfig
		 *
		 * @param cfg optional config literal
		 */
		// eslint-disable-next-line complexity
		const _parseConfig = function _parseConfig() {
			let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			if (CONFIG && CONFIG === cfg) {
				return;
			}
			/* Shield configuration object from tampering */
			if (!cfg || typeof cfg !== 'object') {
				cfg = {};
			}
			/* Shield configuration object from prototype pollution */
			cfg = clone(cfg);
			PARSER_MEDIA_TYPE =
			// eslint-disable-next-line unicorn/prefer-includes
			SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
			// HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.
			transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;
			/* Set configuration parameters */
			ALLOWED_TAGS = objectHasOwnProperty(cfg, 'ALLOWED_TAGS') ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
			ALLOWED_ATTR = objectHasOwnProperty(cfg, 'ALLOWED_ATTR') ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
			ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, 'ALLOWED_NAMESPACES') ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
			URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, 'ADD_URI_SAFE_ATTR') ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
			DATA_URI_TAGS = objectHasOwnProperty(cfg, 'ADD_DATA_URI_TAGS') ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
			FORBID_CONTENTS = objectHasOwnProperty(cfg, 'FORBID_CONTENTS') ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
			FORBID_TAGS = objectHasOwnProperty(cfg, 'FORBID_TAGS') ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : clone({});
			FORBID_ATTR = objectHasOwnProperty(cfg, 'FORBID_ATTR') ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : clone({});
			USE_PROFILES = objectHasOwnProperty(cfg, 'USE_PROFILES') ? cfg.USE_PROFILES : false;
			ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
			ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
			ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
			ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true
			SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
			SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false; // Default true
			WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
			RETURN_DOM = cfg.RETURN_DOM || false; // Default false
			RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
			RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
			FORCE_BODY = cfg.FORCE_BODY || false; // Default false
			SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
			SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false
			KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
			IN_PLACE = cfg.IN_PLACE || false; // Default false
			IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
			NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
			MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
			HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
			CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
			if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
				CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
			}
			if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
				CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
			}
			if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === 'boolean') {
				CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
			}
			if (SAFE_FOR_TEMPLATES) {
				ALLOW_DATA_ATTR = false;
			}
			if (RETURN_DOM_FRAGMENT) {
				RETURN_DOM = true;
			}
			/* Parse profile info */
			if (USE_PROFILES) {
				ALLOWED_TAGS = addToSet({}, text);
				ALLOWED_ATTR = [];
				if (USE_PROFILES.html === true) {
					addToSet(ALLOWED_TAGS, html$1);
					addToSet(ALLOWED_ATTR, html);
				}
				if (USE_PROFILES.svg === true) {
					addToSet(ALLOWED_TAGS, svg$1);
					addToSet(ALLOWED_ATTR, svg);
					addToSet(ALLOWED_ATTR, xml);
				}
				if (USE_PROFILES.svgFilters === true) {
					addToSet(ALLOWED_TAGS, svgFilters);
					addToSet(ALLOWED_ATTR, svg);
					addToSet(ALLOWED_ATTR, xml);
				}
				if (USE_PROFILES.mathMl === true) {
					addToSet(ALLOWED_TAGS, mathMl$1);
					addToSet(ALLOWED_ATTR, mathMl);
					addToSet(ALLOWED_ATTR, xml);
				}
			}
			/* Merge configuration parameters */
			if (cfg.ADD_TAGS) {
				if (typeof cfg.ADD_TAGS === 'function') {
					EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
				} else {
					if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
						ALLOWED_TAGS = clone(ALLOWED_TAGS);
					}
					addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
				}
			}
			if (cfg.ADD_ATTR) {
				if (typeof cfg.ADD_ATTR === 'function') {
					EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
				} else {
					if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
						ALLOWED_ATTR = clone(ALLOWED_ATTR);
					}
					addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
				}
			}
			if (cfg.ADD_URI_SAFE_ATTR) {
				addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
			}
			if (cfg.FORBID_CONTENTS) {
				if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
					FORBID_CONTENTS = clone(FORBID_CONTENTS);
				}
				addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
			}
			/* Add #text in case KEEP_CONTENT is set to true */
			if (KEEP_CONTENT) {
				ALLOWED_TAGS['#text'] = true;
			}
			/* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
			if (WHOLE_DOCUMENT) {
				addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
			}
			/* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
			if (ALLOWED_TAGS.table) {
				addToSet(ALLOWED_TAGS, ['tbody']);
				delete FORBID_TAGS.tbody;
			}
			if (cfg.TRUSTED_TYPES_POLICY) {
				if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== 'function') {
					throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
				}
				if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== 'function') {
					throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
				}
				// Overwrite existing TrustedTypes policy.
				trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
				// Sign local variables required by `sanitize`.
				emptyHTML = trustedTypesPolicy.createHTML('');
			} else {
				// Uninitialized policy, attempt to initialize the internal dompurify policy.
				if (trustedTypesPolicy === undefined) {
					trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
				}
				// If creating the internal policy succeeded sign internal variables.
				if (trustedTypesPolicy !== null && typeof emptyHTML === 'string') {
					emptyHTML = trustedTypesPolicy.createHTML('');
				}
			}
			// Prevent further manipulation of configuration.
			// Not available in IE8, Safari 5, etc.
			if (freeze) {
				freeze(cfg);
			}
			CONFIG = cfg;
		};
		/* Keep track of all possible SVG and MathML tags
		 * so that we can perform the namespace checks
		 * correctly. */
		const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
		const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
		/**
		 * @param element a DOM element whose namespace is being checked
		 * @returns Return false if the element has a
		 *  namespace that a spec-compliant parser would never
		 *  return. Return true otherwise.
		 */
		const _checkValidNamespace = function _checkValidNamespace(element) {
			let parent = getParentNode(element);
			// In JSDOM, if we're inside shadow DOM, then parentNode
			// can be null. We just simulate parent in this case.
			if (!parent || !parent.tagName) {
				parent = {
					namespaceURI: NAMESPACE,
					tagName: 'template'
				};
			}
			const tagName = stringToLowerCase(element.tagName);
			const parentTagName = stringToLowerCase(parent.tagName);
			if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
				return false;
			}
			if (element.namespaceURI === SVG_NAMESPACE) {
				// The only way to switch from HTML namespace to SVG
				// is via <svg>. If it happens via any other tag, then
				// it should be killed.
				if (parent.namespaceURI === HTML_NAMESPACE) {
					return tagName === 'svg';
				}
				// The only way to switch from MathML to SVG is via`
				// svg if parent is either <annotation-xml> or MathML
				// text integration points.
				if (parent.namespaceURI === MATHML_NAMESPACE) {
					return tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
				}
				// We only allow elements that are defined in SVG
				// spec. All others are disallowed in SVG namespace.
				return Boolean(ALL_SVG_TAGS[tagName]);
			}
			if (element.namespaceURI === MATHML_NAMESPACE) {
				// The only way to switch from HTML namespace to MathML
				// is via <math>. If it happens via any other tag, then
				// it should be killed.
				if (parent.namespaceURI === HTML_NAMESPACE) {
					return tagName === 'math';
				}
				// The only way to switch from SVG to MathML is via
				// <math> and HTML integration points
				if (parent.namespaceURI === SVG_NAMESPACE) {
					return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
				}
				// We only allow elements that are defined in MathML
				// spec. All others are disallowed in MathML namespace.
				return Boolean(ALL_MATHML_TAGS[tagName]);
			}
			if (element.namespaceURI === HTML_NAMESPACE) {
				// The only way to switch from SVG to HTML is via
				// HTML integration points, and from MathML to HTML
				// is via MathML text integration points
				if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
					return false;
				}
				if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
					return false;
				}
				// We disallow tags that are specific for MathML
				// or SVG and should never appear in HTML namespace
				return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
			}
			// For XHTML and XML documents that support custom namespaces
			if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
				return true;
			}
			// The code should never reach this place (this means
			// that the element somehow got namespace that is not
			// HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
			// Return false just in case.
			return false;
		};
		/**
		 * _forceRemove
		 *
		 * @param node a DOM node
		 */
		const _forceRemove = function _forceRemove(node) {
			arrayPush(DOMPurify.removed, {
				element: node
			});
			try {
				// eslint-disable-next-line unicorn/prefer-dom-node-remove
				getParentNode(node).removeChild(node);
			} catch (_) {
				remove(node);
			}
		};
		/**
		 * _removeAttribute
		 *
		 * @param name an Attribute name
		 * @param element a DOM node
		 */
		const _removeAttribute = function _removeAttribute(name, element) {
			try {
				arrayPush(DOMPurify.removed, {
					attribute: element.getAttributeNode(name),
					from: element
				});
			} catch (_) {
				arrayPush(DOMPurify.removed, {
					attribute: null,
					from: element
				});
			}
			element.removeAttribute(name);
			// We void attribute values for unremovable "is" attributes
			if (name === 'is') {
				if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
					try {
						_forceRemove(element);
					} catch (_) {}
				} else {
					try {
						element.setAttribute(name, '');
					} catch (_) {}
				}
			}
		};
		/**
		 * _initDocument
		 *
		 * @param dirty - a string of dirty markup
		 * @return a DOM, filled with the dirty markup
		 */
		const _initDocument = function _initDocument(dirty) {
			/* Create a HTML document */
			let doc = null;
			let leadingWhitespace = null;
			if (FORCE_BODY) {
				dirty = '<remove></remove>' + dirty;
			} else {
				/* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
				const matches = stringMatch(dirty, /^[\r\n\t ]+/);
				leadingWhitespace = matches && matches[0];
			}
			if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
				// Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
				dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
			}
			const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
			/*
			 * Use the DOMParser API by default, fallback later if needs be
			 * DOMParser not work for svg when has multiple root element.
			 */
			if (NAMESPACE === HTML_NAMESPACE) {
				try {
					doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
				} catch (_) {}
			}
			/* Use createHTMLDocument in case DOMParser is not available */
			if (!doc || !doc.documentElement) {
				doc = implementation.createDocument(NAMESPACE, 'template', null);
				try {
					doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
				} catch (_) {
					// Syntax error if dirtyPayload is invalid xml
				}
			}
			const body = doc.body || doc.documentElement;
			if (dirty && leadingWhitespace) {
				body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
			}
			/* Work on whole document or just its body */
			if (NAMESPACE === HTML_NAMESPACE) {
				return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
			}
			return WHOLE_DOCUMENT ? doc.documentElement : body;
		};
		/**
		 * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
		 *
		 * @param root The root element or node to start traversing on.
		 * @return The created NodeIterator
		 */
		const _createNodeIterator = function _createNodeIterator(root) {
			return createNodeIterator.call(root.ownerDocument || root, root,
			// eslint-disable-next-line no-bitwise
			NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION, null);
		};
		/**
		 * _isClobbered
		 *
		 * @param element element to check for clobbering attacks
		 * @return true if clobbered, false if safe
		 */
		const _isClobbered = function _isClobbered(element) {
			return element instanceof HTMLFormElement && (typeof element.nodeName !== 'string' || typeof element.textContent !== 'string' || typeof element.removeChild !== 'function' || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== 'function' || typeof element.setAttribute !== 'function' || typeof element.namespaceURI !== 'string' || typeof element.insertBefore !== 'function' || typeof element.hasChildNodes !== 'function');
		};
		/**
		 * Checks whether the given object is a DOM node.
		 *
		 * @param value object to check whether it's a DOM node
		 * @return true is object is a DOM node
		 */
		const _isNode = function _isNode(value) {
			return typeof Node === 'function' && value instanceof Node;
		};
		function _executeHooks(hooks, currentNode, data) {
			arrayForEach(hooks, hook => {
				hook.call(DOMPurify, currentNode, data, CONFIG);
			});
		}
		/**
		 * _sanitizeElements
		 *
		 * @protect nodeName
		 * @protect textContent
		 * @protect removeChild
		 * @param currentNode to check for permission to exist
		 * @return true if node was killed, false if left alive
		 */
		const _sanitizeElements = function _sanitizeElements(currentNode) {
			let content = null;
			/* Execute a hook if present */
			_executeHooks(hooks.beforeSanitizeElements, currentNode, null);
			/* Check if element is clobbered or can clobber */
			if (_isClobbered(currentNode)) {
				_forceRemove(currentNode);
				return true;
			}
			/* Now let's check the element's type and name */
			const tagName = transformCaseFunc(currentNode.nodeName);
			/* Execute a hook if present */
			_executeHooks(hooks.uponSanitizeElement, currentNode, {
				tagName,
				allowedTags: ALLOWED_TAGS
			});
			/* Detect mXSS attempts abusing namespace confusion */
			if (SAFE_FOR_XML && currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w!]/g, currentNode.innerHTML) && regExpTest(/<[/\w!]/g, currentNode.textContent)) {
				_forceRemove(currentNode);
				return true;
			}
			/* Remove any occurrence of processing instructions */
			if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
				_forceRemove(currentNode);
				return true;
			}
			/* Remove any kind of possibly harmful comments */
			if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
				_forceRemove(currentNode);
				return true;
			}
			/* Remove element if anything forbids its presence */
			if (!(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) && (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName])) {
				/* Check if we have a custom element to handle */
				if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
					if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
						return false;
					}
					if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
						return false;
					}
				}
				/* Keep content except for bad-listed elements */
				if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
					const parentNode = getParentNode(currentNode) || currentNode.parentNode;
					const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
					if (childNodes && parentNode) {
						const childCount = childNodes.length;
						for (let i = childCount - 1; i >= 0; --i) {
							const childClone = cloneNode(childNodes[i], true);
							childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
							parentNode.insertBefore(childClone, getNextSibling(currentNode));
						}
					}
				}
				_forceRemove(currentNode);
				return true;
			}
			/* Check whether element has a valid namespace */
			if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
				_forceRemove(currentNode);
				return true;
			}
			/* Make sure that older browsers don't get fallback-tag mXSS */
			if ((tagName === 'noscript' || tagName === 'noembed' || tagName === 'noframes') && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
				_forceRemove(currentNode);
				return true;
			}
			/* Sanitize element content to be template-safe */
			if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
				/* Get the element's text content */
				content = currentNode.textContent;
				arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
					content = stringReplace(content, expr, ' ');
				});
				if (currentNode.textContent !== content) {
					arrayPush(DOMPurify.removed, {
						element: currentNode.cloneNode()
					});
					currentNode.textContent = content;
				}
			}
			/* Execute a hook if present */
			_executeHooks(hooks.afterSanitizeElements, currentNode, null);
			return false;
		};
		/**
		 * _isValidAttribute
		 *
		 * @param lcTag Lowercase tag name of containing element.
		 * @param lcName Lowercase attribute name.
		 * @param value Attribute value.
		 * @return Returns true if `value` is valid, otherwise false.
		 */
		// eslint-disable-next-line complexity
		const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
			/* Make sure attribute cannot clobber */
			if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
				return false;
			}
			/* Allow valid data-* attributes: At least one character after "-"
					(https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
					XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
					We don't need to check the value; it's always URI safe. */
			if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR, lcName)) ; else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR, lcName)) ; else if (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function && EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag)) ; else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
				if (
				// First condition does a very basic check if a) it's basically a valid custom element tagname AND
				// b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
				// and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
				_isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)) ||
				// Alternative, second condition checks if it's an `is`-attribute, AND
				// the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
				lcName === 'is' && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))) ; else {
					return false;
				}
				/* Check value is safe. First, is attr inert? If so, is safe */
			} else if (URI_SAFE_ATTRIBUTES[lcName]) ; else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if ((lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') && lcTag !== 'script' && stringIndexOf(value, 'data:') === 0 && DATA_URI_TAGS[lcTag]) ; else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA, stringReplace(value, ATTR_WHITESPACE, ''))) ; else if (value) {
				return false;
			} else ;
			return true;
		};
		/**
		 * _isBasicCustomElement
		 * checks if at least one dash is included in tagName, and it's not the first char
		 * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
		 *
		 * @param tagName name of the tag of the node to sanitize
		 * @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
		 */
		const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
			return tagName !== 'annotation-xml' && stringMatch(tagName, CUSTOM_ELEMENT);
		};
		/**
		 * _sanitizeAttributes
		 *
		 * @protect attributes
		 * @protect nodeName
		 * @protect removeAttribute
		 * @protect setAttribute
		 *
		 * @param currentNode to sanitize
		 */
		const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
			/* Execute a hook if present */
			_executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
			const {
				attributes
			} = currentNode;
			/* Check if we have attributes; if not we might have a text node */
			if (!attributes || _isClobbered(currentNode)) {
				return;
			}
			const hookEvent = {
				attrName: '',
				attrValue: '',
				keepAttr: true,
				allowedAttributes: ALLOWED_ATTR,
				forceKeepAttr: undefined
			};
			let l = attributes.length;
			/* Go backwards over all attributes; safely remove bad ones */
			while (l--) {
				const attr = attributes[l];
				const {
					name,
					namespaceURI,
					value: attrValue
				} = attr;
				const lcName = transformCaseFunc(name);
				const initValue = attrValue;
				let value = name === 'value' ? initValue : stringTrim(initValue);
				/* Execute a hook if present */
				hookEvent.attrName = lcName;
				hookEvent.attrValue = value;
				hookEvent.keepAttr = true;
				hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
				_executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
				value = hookEvent.attrValue;
				/* Full DOM Clobbering protection via namespace isolation,
				 * Prefix id and name attributes with `user-content-`
				 */
				if (SANITIZE_NAMED_PROPS && (lcName === 'id' || lcName === 'name')) {
					// Remove the attribute with this value
					_removeAttribute(name, currentNode);
					// Prefix the value and later re-create the attribute with the sanitized value
					value = SANITIZE_NAMED_PROPS_PREFIX + value;
				}
				/* Work around a security issue with comments inside attributes */
				if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title|textarea)/i, value)) {
					_removeAttribute(name, currentNode);
					continue;
				}
				/* Make sure we cannot easily use animated hrefs, even if animations are allowed */
				if (lcName === 'attributename' && stringMatch(value, 'href')) {
					_removeAttribute(name, currentNode);
					continue;
				}
				/* Did the hooks approve of the attribute? */
				if (hookEvent.forceKeepAttr) {
					continue;
				}
				/* Did the hooks approve of the attribute? */
				if (!hookEvent.keepAttr) {
					_removeAttribute(name, currentNode);
					continue;
				}
				/* Work around a security issue in jQuery 3.0 */
				if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
					_removeAttribute(name, currentNode);
					continue;
				}
				/* Sanitize attribute content to be template-safe */
				if (SAFE_FOR_TEMPLATES) {
					arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
						value = stringReplace(value, expr, ' ');
					});
				}
				/* Is `value` valid for this attribute? */
				const lcTag = transformCaseFunc(currentNode.nodeName);
				if (!_isValidAttribute(lcTag, lcName, value)) {
					_removeAttribute(name, currentNode);
					continue;
				}
				/* Handle attributes that require Trusted Types */
				if (trustedTypesPolicy && typeof trustedTypes === 'object' && typeof trustedTypes.getAttributeType === 'function') {
					if (namespaceURI) ; else {
						switch (trustedTypes.getAttributeType(lcTag, lcName)) {
							case 'TrustedHTML':
								{
									value = trustedTypesPolicy.createHTML(value);
									break;
								}
							case 'TrustedScriptURL':
								{
									value = trustedTypesPolicy.createScriptURL(value);
									break;
								}
						}
					}
				}
				/* Handle invalid data-* attribute set by try-catching it */
				if (value !== initValue) {
					try {
						if (namespaceURI) {
							currentNode.setAttributeNS(namespaceURI, name, value);
						} else {
							/* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
							currentNode.setAttribute(name, value);
						}
						if (_isClobbered(currentNode)) {
							_forceRemove(currentNode);
						} else {
							arrayPop(DOMPurify.removed);
						}
					} catch (_) {
						_removeAttribute(name, currentNode);
					}
				}
			}
			/* Execute a hook if present */
			_executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
		};
		/**
		 * _sanitizeShadowDOM
		 *
		 * @param fragment to iterate over recursively
		 */
		const _sanitizeShadowDOM = function _sanitizeShadowDOM(fragment) {
			let shadowNode = null;
			const shadowIterator = _createNodeIterator(fragment);
			/* Execute a hook if present */
			_executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
			while (shadowNode = shadowIterator.nextNode()) {
				/* Execute a hook if present */
				_executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
				/* Sanitize tags and elements */
				_sanitizeElements(shadowNode);
				/* Check attributes next */
				_sanitizeAttributes(shadowNode);
				/* Deep shadow DOM detected */
				if (shadowNode.content instanceof DocumentFragment) {
					_sanitizeShadowDOM(shadowNode.content);
				}
			}
			/* Execute a hook if present */
			_executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
		};
		// eslint-disable-next-line complexity
		DOMPurify.sanitize = function (dirty) {
			let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
			let body = null;
			let importedNode = null;
			let currentNode = null;
			let returnNode = null;
			/* Make sure we have a string to sanitize.
				DO NOT return early, as this will return the wrong type if
				the user has requested a DOM object rather than a string */
			IS_EMPTY_INPUT = !dirty;
			if (IS_EMPTY_INPUT) {
				dirty = '<!-->';
			}
			/* Stringify, in case dirty is an object */
			if (typeof dirty !== 'string' && !_isNode(dirty)) {
				if (typeof dirty.toString === 'function') {
					dirty = dirty.toString();
					if (typeof dirty !== 'string') {
						throw typeErrorCreate('dirty is not a string, aborting');
					}
				} else {
					throw typeErrorCreate('toString is not a function');
				}
			}
			/* Return dirty HTML if DOMPurify cannot run */
			if (!DOMPurify.isSupported) {
				return dirty;
			}
			/* Assign config vars */
			if (!SET_CONFIG) {
				_parseConfig(cfg);
			}
			/* Clean up removed elements */
			DOMPurify.removed = [];
			/* Check if dirty is correctly typed for IN_PLACE */
			if (typeof dirty === 'string') {
				IN_PLACE = false;
			}
			if (IN_PLACE) {
				/* Do some early pre-sanitization to avoid unsafe root nodes */
				if (dirty.nodeName) {
					const tagName = transformCaseFunc(dirty.nodeName);
					if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
						throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
					}
				}
			} else if (dirty instanceof Node) {
				/* If dirty is a DOM element, append to an empty document to avoid
					 elements being stripped by the parser */
				body = _initDocument('<!---->');
				importedNode = body.ownerDocument.importNode(dirty, true);
				if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === 'BODY') {
					/* Node is already a body, use as is */
					body = importedNode;
				} else if (importedNode.nodeName === 'HTML') {
					body = importedNode;
				} else {
					// eslint-disable-next-line unicorn/prefer-dom-node-append
					body.appendChild(importedNode);
				}
			} else {
				/* Exit directly if we have nothing to do */
				if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT &&
				// eslint-disable-next-line unicorn/prefer-includes
				dirty.indexOf('<') === -1) {
					return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
				}
				/* Initialize the document to work on */
				body = _initDocument(dirty);
				/* Check we have a DOM node from the data */
				if (!body) {
					return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
				}
			}
			/* Remove first element node (ours) if FORCE_BODY is set */
			if (body && FORCE_BODY) {
				_forceRemove(body.firstChild);
			}
			/* Get node iterator */
			const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
			/* Now start iterating over the created document */
			while (currentNode = nodeIterator.nextNode()) {
				/* Sanitize tags and elements */
				_sanitizeElements(currentNode);
				/* Check attributes next */
				_sanitizeAttributes(currentNode);
				/* Shadow DOM detected, sanitize it */
				if (currentNode.content instanceof DocumentFragment) {
					_sanitizeShadowDOM(currentNode.content);
				}
			}
			/* If we sanitized `dirty` in-place, return it. */
			if (IN_PLACE) {
				return dirty;
			}
			/* Return sanitized string or DOM */
			if (RETURN_DOM) {
				if (RETURN_DOM_FRAGMENT) {
					returnNode = createDocumentFragment.call(body.ownerDocument);
					while (body.firstChild) {
						// eslint-disable-next-line unicorn/prefer-dom-node-append
						returnNode.appendChild(body.firstChild);
					}
				} else {
					returnNode = body;
				}
				if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
					/*
						AdoptNode() is not used because internal state is not reset
						(e.g. the past names map of a HTMLFormElement), this is safe
						in theory but we would rather not risk another attack vector.
						The state that is cloned by importNode() is explicitly defined
						by the specs.
					*/
					returnNode = importNode.call(originalDocument, returnNode, true);
				}
				return returnNode;
			}
			let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
			/* Serialize doctype if allowed */
			if (WHOLE_DOCUMENT && ALLOWED_TAGS['!doctype'] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
				serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
			}
			/* Sanitize final string template-safe */
			if (SAFE_FOR_TEMPLATES) {
				arrayForEach([MUSTACHE_EXPR, ERB_EXPR, TMPLIT_EXPR], expr => {
					serializedHTML = stringReplace(serializedHTML, expr, ' ');
				});
			}
			return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
		};
		DOMPurify.setConfig = function () {
			let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			_parseConfig(cfg);
			SET_CONFIG = true;
		};
		DOMPurify.clearConfig = function () {
			CONFIG = null;
			SET_CONFIG = false;
		};
		DOMPurify.isValidAttribute = function (tag, attr, value) {
			/* Initialize shared config vars if necessary. */
			if (!CONFIG) {
				_parseConfig({});
			}
			const lcTag = transformCaseFunc(tag);
			const lcName = transformCaseFunc(attr);
			return _isValidAttribute(lcTag, lcName, value);
		};
		DOMPurify.addHook = function (entryPoint, hookFunction) {
			if (typeof hookFunction !== 'function') {
				return;
			}
			arrayPush(hooks[entryPoint], hookFunction);
		};
		DOMPurify.removeHook = function (entryPoint, hookFunction) {
			if (hookFunction !== undefined) {
				const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
				return index === -1 ? undefined : arraySplice(hooks[entryPoint], index, 1)[0];
			}
			return arrayPop(hooks[entryPoint]);
		};
		DOMPurify.removeHooks = function (entryPoint) {
			hooks[entryPoint] = [];
		};
		DOMPurify.removeAllHooks = function () {
			hooks = _createHooksMap();
		};
		return DOMPurify;
	}
	var purify = createDOMPurify();

	return purify;

})();

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * Portions Copyright (C) Philipp Kewisch */
class t{static fromString(e){return new t(e)}constructor(t){this.value=t;}icaltype="binary";decodeValue(){return this._b64_decode(this.value)}setEncodedValue(t){this.value=this._b64_encode(t);}_b64_encode(t){let e,i,r,n,s,a,o,l,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",u=0,c=0,d="",m=[];if(!t)return t;do{e=t.charCodeAt(u++),i=t.charCodeAt(u++),r=t.charCodeAt(u++),l=e<<16|i<<8|r,n=l>>18&63,s=l>>12&63,a=l>>6&63,o=63&l,m[c++]=h.charAt(n)+h.charAt(s)+h.charAt(a)+h.charAt(o);}while(u<t.length);d=m.join("");let f=t.length%3;return (f?d.slice(0,f-3):d)+"===".slice(f||3)}_b64_decode(t){let e,i,r,n,s,a,o,l,h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",u=0,c=0,d="",m=[];if(!t)return t;t+="";do{n=h.indexOf(t.charAt(u++)),s=h.indexOf(t.charAt(u++)),a=h.indexOf(t.charAt(u++)),o=h.indexOf(t.charAt(u++)),l=n<<18|s<<12|a<<6|o,e=l>>16&255,i=l>>8&255,r=255&l,m[c++]=64==a?String.fromCharCode(e):64==o?String.fromCharCode(e,i):String.fromCharCode(e,i,r);}while(u<t.length);return d=m.join(""),d}toString(){return this.value}}const e=/([PDWHMTS]{1,1})/,i=["weeks","days","hours","minutes","seconds","isNegative"];class r{static fromSeconds(t){return (new r).fromSeconds(t)}static isValueString(t){return "P"===t[0]||"P"===t[1]}static fromString(t){let i=0,s=Object.create(null),a=0;for(;-1!==(i=t.search(e));){let e=t[i],r=t.slice(0,Math.max(0,i));t=t.slice(i+1),a+=n(e,r,s);}if(a<2)throw new Error('invalid duration value: Not enough duration components in "'+t+'"');return new r(s)}static fromData(t){return new r(t)}constructor(t){this.wrappedJSObject=this,this.fromData(t);}weeks=0;days=0;hours=0;minutes=0;seconds=0;isNegative=!1;icalclass="icalduration";icaltype="duration";clone(){return r.fromData(this)}toSeconds(){let t=this.seconds+60*this.minutes+3600*this.hours+86400*this.days+604800*this.weeks;return this.isNegative?-t:t}fromSeconds(t){let e=Math.abs(t);return this.isNegative=t<0,this.days=b(e/86400),this.days%7==0?(this.weeks=this.days/7,this.days=0):this.weeks=0,e-=86400*(this.days+7*this.weeks),this.hours=b(e/3600),e-=3600*this.hours,this.minutes=b(e/60),e-=60*this.minutes,this.seconds=e,this}fromData(t){for(let e of i)this[e]=t&&e in t?t[e]:0;}reset(){this.isNegative=!1,this.weeks=0,this.days=0,this.hours=0,this.minutes=0,this.seconds=0;}compare(t){let e=this.toSeconds(),i=t.toSeconds();return (e>i)-(e<i)}normalize(){this.fromSeconds(this.toSeconds());}toString(){if(0==this.toSeconds())return "PT0S";{let t="";this.isNegative&&(t+="-"),t+="P";let e=!1;return this.weeks?this.days||this.hours||this.minutes||this.seconds?t+=7*this.weeks+this.days+"D":(t+=this.weeks+"W",e=!0):this.days&&(t+=this.days+"D"),e||(this.hours||this.minutes||this.seconds)&&(t+="T",this.hours&&(t+=this.hours+"H"),this.minutes&&(t+=this.minutes+"M"),this.seconds&&(t+=this.seconds+"S")),t}}toICALString(){return this.toString()}}function n(t,e,i){let r;switch(t){case"P":i.isNegative=!(!e||"-"!==e);break;case"D":r="days";break;case"W":r="weeks";break;case"H":r="hours";break;case"M":r="minutes";break;case"S":r="seconds";break;default:return 0}if(r){if(!e&&0!==e)throw new Error('invalid duration value: Missing number before "'+t+'"');let n=parseInt(e,10);if(y(n))throw new Error('invalid duration value: Invalid number "'+e+'" before "'+t+'"');i[r]=n;}return 1}class s{static fromString(t,e){let i=t.split("/");if(2!==i.length)throw new Error('Invalid string value: "'+t+'" must contain a "/" char.');let n={start:a.fromDateTimeString(i[0],e)},o=i[1];return r.isValueString(o)?n.duration=r.fromString(o):n.end=a.fromDateTimeString(o,e),new s(n)}static fromData(t){return new s(t)}static fromJSON(t,e,i){function n(t,e){return i?a.fromString(t,e):a.fromDateTimeString(t,e)}return r.isValueString(t[1])?s.fromData({start:n(t[0],e),duration:r.fromString(t[1])}):s.fromData({start:n(t[0],e),end:n(t[1],e)})}constructor(t){if(this.wrappedJSObject=this,t&&"start"in t){if(t.start&&!(t.start instanceof a))throw new TypeError(".start must be an instance of ICAL.Time");this.start=t.start;}if(t&&t.end&&t.duration)throw new Error("cannot accept both end and duration");if(t&&"end"in t){if(t.end&&!(t.end instanceof a))throw new TypeError(".end must be an instance of ICAL.Time");this.end=t.end;}if(t&&"duration"in t){if(t.duration&&!(t.duration instanceof r))throw new TypeError(".duration must be an instance of ICAL.Duration");this.duration=t.duration;}}start=null;end=null;duration=null;icalclass="icalperiod";icaltype="period";clone(){return s.fromData({start:this.start?this.start.clone():null,end:this.end?this.end.clone():null,duration:this.duration?this.duration.clone():null})}getDuration(){return this.duration?this.duration:this.end.subtractDate(this.start)}getEnd(){if(this.end)return this.end;{let t=this.start.clone();return t.addDuration(this.duration),t}}compare(t){return t.compare(this.start)<0?1:t.compare(this.getEnd())>0?-1:0}toString(){return this.start+"/"+(this.end||this.duration)}toJSON(){return [this.start.toString(),(this.end||this.duration).toString()]}toICALString(){return this.start.toICALString()+"/"+(this.end||this.duration).toICALString()}}class a{static _dowCache={};static _wnCache={};static daysInMonth(t,e){let i=30;return t<1||t>12||(i=[0,31,28,31,30,31,30,31,31,30,31,30,31][t],2==t&&(i+=a.isLeapYear(e))),i}static isLeapYear(t){return t<=1752?t%4==0:t%4==0&&t%100!=0||t%400==0}static fromDayOfYear(t,e){let i=e,r=t,n=new a;n.auto_normalize=!1;let s=a.isLeapYear(i)?1:0;if(r<1)return i--,s=a.isLeapYear(i)?1:0,r+=a.daysInYearPassedMonth[s][12],a.fromDayOfYear(r,i);if(r>a.daysInYearPassedMonth[s][12])return s=a.isLeapYear(i)?1:0,r-=a.daysInYearPassedMonth[s][12],i++,a.fromDayOfYear(r,i);n.year=i,n.isDate=!0;for(let t=11;t>=0;t--)if(r>a.daysInYearPassedMonth[s][t]){n.month=t+1,n.day=r-a.daysInYearPassedMonth[s][t];break}return n.auto_normalize=!0,n}static fromStringv2(t){return new a({year:parseInt(t.slice(0,4),10),month:parseInt(t.slice(5,7),10),day:parseInt(t.slice(8,10),10),isDate:!0})}static fromDateString(t){return new a({year:_(t.slice(0,4)),month:_(t.slice(5,7)),day:_(t.slice(8,10)),isDate:!0})}static fromDateTimeString(t,e){if(t.length<19)throw new Error('invalid date-time value: "'+t+'"');let i,r;"Z"===t.slice(-1)?i=m.utcTimezone:e&&(r=e.getParameter("tzid"),e.parent&&("standard"===e.parent.name||"daylight"===e.parent.name?i=m.localTimezone:r&&(i=e.parent.getTimeZoneByID(r))));const n={year:_(t.slice(0,4)),month:_(t.slice(5,7)),day:_(t.slice(8,10)),hour:_(t.slice(11,13)),minute:_(t.slice(14,16)),second:_(t.slice(17,19))};return r&&!i&&(n.timezone=r),new a(n,i)}static fromString(t,e){return t.length>10?a.fromDateTimeString(t,e):a.fromDateString(t)}static fromJSDate(t,e){return (new a).fromJSDate(t,e)}static fromData=function(t,e){return (new a).fromData(t,e)};static now(){return a.fromJSDate(new Date,!1)}static weekOneStarts(t,e){let i=a.fromData({year:t,month:1,day:1,isDate:!0}),r=i.dayOfWeek(),n=e||a.DEFAULT_WEEK_START;return r>a.THURSDAY&&(i.day+=7),n>a.THURSDAY&&(i.day-=7),i.day-=r-n,i}static getDominicalLetter(t){let e="GFEDCBA",i=(t+(t/4|0)+(t/400|0)-(t/100|0)-1)%7;return a.isLeapYear(t)?e[(i+6)%7]+e[i]:e[i]}static#t=null;static get epochTime(){return this.#t||(this.#t=a.fromData({year:1970,month:1,day:1,hour:0,minute:0,second:0,isDate:!1,timezone:"Z"})),this.#t}static _cmp_attr(t,e,i){return t[i]>e[i]?1:t[i]<e[i]?-1:0}static daysInYearPassedMonth=[[0,31,59,90,120,151,181,212,243,273,304,334,365],[0,31,60,91,121,152,182,213,244,274,305,335,366]];static SUNDAY=1;static MONDAY=2;static TUESDAY=3;static WEDNESDAY=4;static THURSDAY=5;static FRIDAY=6;static SATURDAY=7;static DEFAULT_WEEK_START=2;constructor(t,e){this.wrappedJSObject=this,this._time=Object.create(null),this._time.year=0,this._time.month=1,this._time.day=1,this._time.hour=0,this._time.minute=0,this._time.second=0,this._time.isDate=!1,this.fromData(t,e);}icalclass="icaltime";_cachedUnixTime=null;get icaltype(){return this.isDate?"date":"date-time"}zone=null;_pendingNormalization=!1;get year(){return this._getTimeAttr("year")}set year(t){this._setTimeAttr("year",t);}get month(){return this._getTimeAttr("month")}set month(t){this._setTimeAttr("month",t);}get day(){return this._getTimeAttr("day")}set day(t){this._setTimeAttr("day",t);}get hour(){return this._getTimeAttr("hour")}set hour(t){this._setTimeAttr("hour",t);}get minute(){return this._getTimeAttr("minute")}set minute(t){this._setTimeAttr("minute",t);}get second(){return this._getTimeAttr("second")}set second(t){this._setTimeAttr("second",t);}get isDate(){return this._getTimeAttr("isDate")}set isDate(t){this._setTimeAttr("isDate",t);}_getTimeAttr(t){return this._pendingNormalization&&(this._normalize(),this._pendingNormalization=!1),this._time[t]}_setTimeAttr(t,e){"isDate"===t&&e&&!this._time.isDate&&this.adjust(0,0,0,0),this._cachedUnixTime=null,this._pendingNormalization=!0,this._time[t]=e;}clone(){return new a(this._time,this.zone)}reset(){this.fromData(a.epochTime),this.zone=m.utcTimezone;}resetTo(t,e,i,r,n,s,a){this.fromData({year:t,month:e,day:i,hour:r,minute:n,second:s,zone:a});}fromJSDate(t,e){return t?e?(this.zone=m.utcTimezone,this.year=t.getUTCFullYear(),this.month=t.getUTCMonth()+1,this.day=t.getUTCDate(),this.hour=t.getUTCHours(),this.minute=t.getUTCMinutes(),this.second=t.getUTCSeconds()):(this.zone=m.localTimezone,this.year=t.getFullYear(),this.month=t.getMonth()+1,this.day=t.getDate(),this.hour=t.getHours(),this.minute=t.getMinutes(),this.second=t.getSeconds()):this.reset(),this._cachedUnixTime=null,this}fromData(t,e){if(t)for(let[e,i]of Object.entries(t))"icaltype"!==e&&(this[e]=i);if(e&&(this.zone=e),t&&!("isDate"in t)?this.isDate=!("hour"in t):t&&"isDate"in t&&(this.isDate=t.isDate),t&&"timezone"in t){let e=p.get(t.timezone);this.zone=e||m.localTimezone;}return t&&"zone"in t&&(this.zone=t.zone),this.zone||(this.zone=m.localTimezone),this._cachedUnixTime=null,this}dayOfWeek(t){let e=t||a.SUNDAY,i=(this.year<<12)+(this.month<<8)+(this.day<<3)+e;if(i in a._dowCache)return a._dowCache[i];let r=this.day,n=this.month+(this.month<3?12:0),s=this.year-(this.month<3?1:0),o=r+s+b(26*(n+1)/10)+b(s/4);return o+=6*b(s/100)+b(s/400),o=(o+7-e)%7+1,a._dowCache[i]=o,o}dayOfYear(){let t=a.isLeapYear(this.year)?1:0;return a.daysInYearPassedMonth[t][this.month-1]+this.day}startOfWeek(t){let e=t||a.SUNDAY,i=this.clone();return i.day-=(this.dayOfWeek()+7-e)%7,i.isDate=!0,i.hour=0,i.minute=0,i.second=0,i}endOfWeek(t){let e=t||a.SUNDAY,i=this.clone();return i.day+=(7-this.dayOfWeek()+e-a.SUNDAY)%7,i.isDate=!0,i.hour=0,i.minute=0,i.second=0,i}startOfMonth(){let t=this.clone();return t.day=1,t.isDate=!0,t.hour=0,t.minute=0,t.second=0,t}endOfMonth(){let t=this.clone();return t.day=a.daysInMonth(t.month,t.year),t.isDate=!0,t.hour=0,t.minute=0,t.second=0,t}startOfYear(){let t=this.clone();return t.day=1,t.month=1,t.isDate=!0,t.hour=0,t.minute=0,t.second=0,t}endOfYear(){let t=this.clone();return t.day=31,t.month=12,t.isDate=!0,t.hour=0,t.minute=0,t.second=0,t}startDoyWeek(t){let e=t||a.SUNDAY,i=this.dayOfWeek()-e;return i<0&&(i+=7),this.dayOfYear()-i}getDominicalLetter(){return a.getDominicalLetter(this.year)}nthWeekDay(t,e){let i,r=a.daysInMonth(this.month,this.year),n=e,s=0,o=this.clone();if(n>=0){o.day=1,0!=n&&n--,s=o.day;let e=t-o.dayOfWeek();e<0&&(e+=7),s+=e,s-=t,i=t;}else {o.day=r,n++,i=o.dayOfWeek()-t,i<0&&(i+=7),i=r-i;}return i+=7*n,s+i}isNthWeekDay(t,e){let i=this.dayOfWeek();return 0===e&&i===t||this.nthWeekDay(t,e)===this.day}weekNumber(t){let e,i=(this.year<<12)+(this.month<<8)+(this.day<<3)+t;if(i in a._wnCache)return a._wnCache[i];let r=this.clone();r.isDate=!0;let n=this.year;12==r.month&&r.day>25?(e=a.weekOneStarts(n+1,t),r.compare(e)<0?e=a.weekOneStarts(n,t):n++):(e=a.weekOneStarts(n,t),r.compare(e)<0&&(e=a.weekOneStarts(--n,t)));let s=b(r.subtractDate(e).toSeconds()/86400/7)+1;return a._wnCache[i]=s,s}addDuration(t){let e=t.isNegative?-1:1,i=this.second,r=this.minute,n=this.hour,s=this.day;i+=e*t.seconds,r+=e*t.minutes,n+=e*t.hours,s+=e*t.days,s+=7*e*t.weeks,this.second=i,this.minute=r,this.hour=n,this.day=s,this._cachedUnixTime=null;}subtractDate(t){let e=this.toUnixTime()+this.utcOffset(),i=t.toUnixTime()+t.utcOffset();return r.fromSeconds(e-i)}subtractDateTz(t){let e=this.toUnixTime(),i=t.toUnixTime();return r.fromSeconds(e-i)}compare(t){if(t instanceof s)return -1*t.compare(this);{let e=this.toUnixTime(),i=t.toUnixTime();return e>i?1:i>e?-1:0}}compareDateOnlyTz(t,e){let i=this.convertToZone(e),r=t.convertToZone(e),n=0;return 0!=(n=a._cmp_attr(i,r,"year"))||0!=(n=a._cmp_attr(i,r,"month"))||(n=a._cmp_attr(i,r,"day")),n}convertToZone(t){let e=this.clone(),i=this.zone.tzid==t.tzid;return this.isDate||i||m.convert_time(e,this.zone,t),e.zone=t,e}utcOffset(){return this.zone==m.localTimezone||this.zone==m.utcTimezone?0:this.zone.utcOffset(this)}toICALString(){let t=this.toString();return t.length>10?ct.icalendar.value["date-time"].toICAL(t):ct.icalendar.value.date.toICAL(t)}toString(){let t=this.year+"-"+O(this.month)+"-"+O(this.day);return this.isDate||(t+="T"+O(this.hour)+":"+O(this.minute)+":"+O(this.second),this.zone===m.utcTimezone&&(t+="Z")),t}toJSDate(){return this.zone==m.localTimezone?this.isDate?new Date(this.year,this.month-1,this.day):new Date(this.year,this.month-1,this.day,this.hour,this.minute,this.second,0):new Date(1e3*this.toUnixTime())}_normalize(){return this._time.isDate&&(this._time.hour=0,this._time.minute=0,this._time.second=0),this.adjust(0,0,0,0),this}adjust(t,e,i,r,n){let s,o,l,h,u,c,d,m=0,f=0,p=n||this._time;if(p.isDate||(l=p.second+r,p.second=l%60,s=b(l/60),p.second<0&&(p.second+=60,s--),h=p.minute+i+s,p.minute=h%60,o=b(h/60),p.minute<0&&(p.minute+=60,o--),u=p.hour+e+o,p.hour=u%24,m=b(u/24),p.hour<0&&(p.hour+=24,m--)),p.month>12?f=b((p.month-1)/12):p.month<1&&(f=b(p.month/12)-1),p.year+=f,p.month-=12*f,c=p.day+t+m,c>0)for(;d=a.daysInMonth(p.month,p.year),!(c<=d);)p.month++,p.month>12&&(p.year++,p.month=1),c-=d;else for(;c<=0;)1==p.month?(p.year--,p.month=12):p.month--,c+=a.daysInMonth(p.month,p.year);return p.day=c,this._cachedUnixTime=null,this}fromUnixTime(t){this.zone=m.utcTimezone;let e=new Date(1e3*t);this.year=e.getUTCFullYear(),this.month=e.getUTCMonth()+1,this.day=e.getUTCDate(),this._time.isDate?(this.hour=0,this.minute=0,this.second=0):(this.hour=e.getUTCHours(),this.minute=e.getUTCMinutes(),this.second=e.getUTCSeconds()),this._cachedUnixTime=null;}toUnixTime(){if(null!==this._cachedUnixTime)return this._cachedUnixTime;let t=this.utcOffset(),e=Date.UTC(this.year,this.month-1,this.day,this.hour,this.minute,this.second-t);return this._cachedUnixTime=e/1e3,this._cachedUnixTime}toJSON(){let t,e=["year","month","day","hour","minute","second","isDate"],i=Object.create(null),r=0,n=e.length;for(;r<n;r++)t=e[r],i[t]=this[t];return this.zone&&(i.timezone=this.zone.tzid),i}}const o=/[^ \t]/,l=":",h={"^'":'"',"^n":"\n","^^":"^"};function u(t){let e={},i=e.component=[];if(e.stack=[i],u._eachLine(t,(function(t,i){u._handleContentLine(i,e);})),e.stack.length>1)throw new c("invalid ical body. component began but did not end");return e=null,1==i.length?i[0]:i}u.property=function(t,e){let i={component:[[],[]],designSet:e||ct.defaultSet};return u._handleContentLine(t,i),i.component[1][0]},u.component=function(t){return u(t)};class c extends Error{name=this.constructor.name}u.ParserError=c,u._handleContentLine=function(t,e){let i,r,n,s,a,o,h=t.indexOf(l),d=t.indexOf(";"),m={};if(-1!==d&&-1!==h&&d>h&&(d=-1),-1!==d){if(n=t.slice(0,Math.max(0,d)).toLowerCase(),a=u._parseParameters(t.slice(Math.max(0,d)),0,e.designSet),-1==a[2])throw new c("Invalid parameters in '"+t+"'");let o;if(m=a[0],o="string"==typeof a[1]?a[1].length:a[1].reduce(((t,e)=>t+e.length),0),i=o+a[2]+d,-1===(r=t.slice(Math.max(0,i)).indexOf(l)))throw new c("Missing parameter value in '"+t+"'");s=t.slice(Math.max(0,i+r+1));}else {if(-1===h)throw new c('invalid line (no token ";" or ":") "'+t+'"');if(n=t.slice(0,Math.max(0,h)).toLowerCase(),s=t.slice(Math.max(0,h+1)),"begin"===n){let t=[s.toLowerCase(),[],[]];return 1===e.stack.length?e.component.push(t):e.component[2].push(t),e.stack.push(e.component),e.component=t,void(e.designSet||(e.designSet=ct.getDesignSet(e.component[0])))}if("end"===n)return void(e.component=e.stack.pop())}let f,p,y,_,g=!1,D=!1;e.designSet.propertyGroups&&-1!==n.indexOf(".")?(p=n.split("."),m.group=p[0],y=p[1]):y=n,y in e.designSet.property&&(f=e.designSet.property[y],"multiValue"in f&&(g=f.multiValue),"structuredValue"in f&&(D=f.structuredValue),s&&"detectType"in f&&(o=f.detectType(s))),o||(o="value"in m?m.value.toLowerCase():f?f.defaultType:"unknown"),delete m.value,g&&D?(s=u._parseMultiValue(s,D,o,[],g,e.designSet,D),_=[y,m,o,s]):g?(_=[y,m,o],u._parseMultiValue(s,g,o,_,null,e.designSet,!1)):D?(s=u._parseMultiValue(s,D,o,[],null,e.designSet,D),_=[y,m,o,s]):(s=u._parseValue(s,o,e.designSet,!1),_=[y,m,o,s]),"vcard"!==e.component[0]||0!==e.component[1].length||"version"===n&&"4.0"===s||(e.designSet=ct.getDesignSet("vcard3")),e.component[1].push(_);},u._parseValue=function(t,e,i,r){return e in i.value&&"fromICAL"in i.value[e]?i.value[e].fromICAL(t,r):t},u._parseParameters=function(t,e,i){let r,n,s,a,o,h,d=e,m=0,f={},p=-1;for(;!1!==m&&-1!==(m=t.indexOf("=",m+1));){if(r=t.slice(d+1,m),0==r.length)throw new c("Empty parameter name in '"+t+"'");if(n=r.toLowerCase(),h=!1,o=!1,a=n in i.param&&i.param[n].valueType?i.param[n].valueType:"text",n in i.param&&(o=i.param[n].multiValue,i.param[n].multiValueSeparateDQuote&&(h=u._rfc6868Escape('"'+o+'"'))),'"'===t[m+1]){if(p=m+2,m=t.indexOf('"',p),o&&-1!=m){let e=!0;for(;e;)t[m+1]==o&&'"'==t[m+2]?m=t.indexOf('"',m+3):e=!1;}if(-1===m)throw new c('invalid line (no matching double quote) "'+t+'"');s=t.slice(p,m),d=t.indexOf(";",m);let e=t.indexOf(l,m);(-1===d||-1!==e&&d>e)&&(m=!1);}else {p=m+1;let e=t.indexOf(";",p),i=t.indexOf(l,p);-1!==i&&e>i?(e=i,m=!1):-1===e?(e=-1===i?t.length:i,m=!1):(d=e,m=e),s=t.slice(p,e);}const e=s.length;if(s=u._rfc6868Escape(s),p+=e-s.length,o){let t=h||o;s=u._parseMultiValue(s,t,a,[],null,i);}else s=u._parseValue(s,a,i);o&&n in f?Array.isArray(f[n])?f[n].push(s):f[n]=[f[n],s]:f[n]=s;}return [f,s,p]},u._rfc6868Escape=function(t){return t.replace(/\^['n^]/g,(function(t){return h[t]}))},u._parseMultiValue=function(t,e,i,r,n,s,a){let o,l=0,h=0;if(0===e.length)return t;for(;-1!==(l=D(t,e,h));)o=t.slice(h,l),o=n?u._parseMultiValue(o,n,i,[],null,s,a):u._parseValue(o,i,s,a),r.push(o),h=l+e.length;return o=t.slice(h),o=n?u._parseMultiValue(o,n,i,[],null,s,a):u._parseValue(o,i,s,a),r.push(o),1==r.length?r[0]:r},u._eachLine=function(t,e){let i,r,n,s=t.length,a=t.search(o),l=a;do{l=t.indexOf("\n",a)+1,n=l>1&&"\r"===t[l-2]?2:1,0===l&&(l=s,n=0),r=t[a]," "===r||"\t"===r?i+=t.slice(a+1,l-n):(i&&e(null,i),i=t.slice(a,l-n)),a=l;}while(l!==s);i=i.trim(),i.length&&e(null,i);};const d=["tzid","location","tznames","latitude","longitude"];class m{static _compare_change_fn(t,e){return t.year<e.year?-1:t.year>e.year?1:t.month<e.month?-1:t.month>e.month?1:t.day<e.day?-1:t.day>e.day?1:t.hour<e.hour?-1:t.hour>e.hour?1:t.minute<e.minute?-1:t.minute>e.minute?1:t.second<e.second?-1:t.second>e.second?1:0}static convert_time(t,e,i){if(t.isDate||e.tzid==i.tzid||e==m.localTimezone||i==m.localTimezone)return t.zone=i,t;let r=e.utcOffset(t);return t.adjust(0,0,0,-r),r=i.utcOffset(t),t.adjust(0,0,0,r),null}static fromData(t){return (new m).fromData(t)}static#e=null;static get utcTimezone(){return this.#e||(this.#e=m.fromData({tzid:"UTC"})),this.#e}static#i=null;static get localTimezone(){return this.#i||(this.#i=m.fromData({tzid:"floating"})),this.#i}static adjust_change(t,e,i,r,n){return a.prototype.adjust.call(t,e,i,r,n,t)}static _minimumExpansionYear=-1;static EXTRA_COVERAGE=5;constructor(t){this.wrappedJSObject=this,this.fromData(t);}tzid="";location="";tznames="";latitude=0;longitude=0;component=null;expandedUntilYear=0;icalclass="icaltimezone";fromData(t){if(this.expandedUntilYear=0,this.changes=[],t instanceof _t)this.component=t;else {if(t&&"component"in t)if("string"==typeof t.component){let e=u(t.component);this.component=new _t(e);}else t.component instanceof _t?this.component=t.component:this.component=null;for(let e of d)t&&e in t&&(this[e]=t[e]);}return this.component instanceof _t&&!this.tzid&&(this.tzid=this.component.getFirstPropertyValue("tzid")),this}utcOffset(t){if(this==m.utcTimezone||this==m.localTimezone)return 0;if(this._ensureCoverage(t.year),!this.changes.length)return 0;let e={year:t.year,month:t.month,day:t.day,hour:t.hour,minute:t.minute,second:t.second},i=this._findNearbyChange(e),r=-1,n=1;for(;;){let t=Y(this.changes[i],!0);if(t.utcOffset<t.prevUtcOffset?m.adjust_change(t,0,0,0,t.utcOffset):m.adjust_change(t,0,0,0,t.prevUtcOffset),m._compare_change_fn(e,t)>=0?r=i:n=-1,-1==n&&-1!=r)break;if(i+=n,i<0)return 0;if(i>=this.changes.length)break}let s=this.changes[r];if(s.utcOffset-s.prevUtcOffset<0&&r>0){let t=Y(s,!0);if(m.adjust_change(t,0,0,0,t.prevUtcOffset),m._compare_change_fn(e,t)<0){let t=this.changes[r-1],e=!1;s.is_daylight!=e&&t.is_daylight==e&&(s=t);}}return s.utcOffset}_findNearbyChange(t){let e=T(this.changes,t,m._compare_change_fn);return e>=this.changes.length?this.changes.length-1:e}_ensureCoverage(t){if(-1==m._minimumExpansionYear){let t=a.now();m._minimumExpansionYear=t.year;}let e=t;if(e<m._minimumExpansionYear&&(e=m._minimumExpansionYear),e+=m.EXTRA_COVERAGE,!this.changes.length||this.expandedUntilYear<t){let t=this.component.getAllSubcomponents(),i=t.length,r=0;for(;r<i;r++)this._expandComponent(t[r],e,this.changes);this.changes.sort(m._compare_change_fn),this.expandedUntilYear=e;}}_expandComponent(t,e,i){if(!t.hasProperty("dtstart")||!t.hasProperty("tzoffsetto")||!t.hasProperty("tzoffsetfrom"))return null;let r,n=t.getFirstProperty("dtstart").getFirstValue();function s(t){return t.factor*(3600*t.hours+60*t.minutes)}function a(){let e={};return e.is_daylight="daylight"==t.name,e.utcOffset=s(t.getFirstProperty("tzoffsetto").getFirstValue()),e.prevUtcOffset=s(t.getFirstProperty("tzoffsetfrom").getFirstValue()),e}if(t.hasProperty("rrule")||t.hasProperty("rdate")){let s=t.getAllProperties("rdate");for(let t of s){let e=t.getFirstValue();r=a(),r.year=e.year,r.month=e.month,r.day=e.day,e.isDate?(r.hour=n.hour,r.minute=n.minute,r.second=n.second,n.zone!=m.utcTimezone&&m.adjust_change(r,0,0,0,-r.prevUtcOffset)):(r.hour=e.hour,r.minute=e.minute,r.second=e.second,e.zone!=m.utcTimezone&&m.adjust_change(r,0,0,0,-r.prevUtcOffset)),i.push(r);}let o=t.getFirstProperty("rrule");if(o){o=o.getFirstValue(),r=a(),o.until&&o.until.zone==m.utcTimezone&&(o.until.adjust(0,0,0,r.prevUtcOffset),o.until.zone=m.localTimezone);let t,s=o.iterator(n);for(;(t=s.next())&&(r=a(),!(t.year>e)&&t);)r.year=t.year,r.month=t.month,r.day=t.day,r.hour=t.hour,r.minute=t.minute,r.second=t.second,r.isDate=t.isDate,m.adjust_change(r,0,0,0,-r.prevUtcOffset),i.push(r);}}else r=a(),r.year=n.year,r.month=n.month,r.day=n.day,r.hour=n.hour,r.minute=n.minute,r.second=n.second,m.adjust_change(r,0,0,0,-r.prevUtcOffset),i.push(r);return i}toString(){return this.tznames?this.tznames:this.tzid}}let f=null;const p={get count(){return null===f?0:Object.keys(f).length},reset:function(){f=Object.create(null);let t=m.utcTimezone;f.Z=t,f.UTC=t,f.GMT=t;},_hard_reset:function(){f=null;},has:function(t){return null!==f&&!!f[t]},get:function(t){return null===f&&this.reset(),f[t]},register:function(t,e){if(null===f&&this.reset(),"string"==typeof t&&e instanceof m&&([t,e]=[e,t]),e||(t instanceof m?e=t.tzid:"vtimezone"===t.name&&(e=(t=new m(t)).tzid)),!e)throw new TypeError("Neither a timezone nor a name was passed");if(!(t instanceof m))throw new TypeError("timezone must be ICAL.Timezone or ICAL.Component");f[e]=t;},remove:function(t){return null===f?null:delete f[t]}};function y(t){return "number"==typeof t&&isNaN(t)}function _(t){let e=parseInt(t,10);if(y(e))throw new Error('Could not extract integer from "'+t+'"');return e}function g(t,e){if(void 0!==t)return t instanceof e?t:new e(t)}function D(t,e,i){for(;-1!==(i=t.indexOf(e,i));){if(!(i>0&&"\\"===t[i-1]))return i;i+=1;}return -1}function T(t,e,i){if(!t.length)return 0;let r,n,s=0,a=t.length-1;for(;s<=a;)if(r=s+Math.floor((a-s)/2),n=i(e,t[r]),n<0)a=r-1;else {if(!(n>0))break;s=r+1;}return n<0?r:n>0?r+1:r}function Y(t,e){if(t&&"object"==typeof t){if(t instanceof Date)return new Date(t.getTime());if("clone"in t)return t.clone();if(Array.isArray(t)){let i=[];for(let r=0;r<t.length;r++)i.push(e?Y(t[r],!0):t[r]);return i}{let i={};for(let[r,n]of Object.entries(t))i[r]=e?Y(n,!0):n;return i}}return t}function A(t){let e="",i=t||"",r=0,n=0;for(;i.length;){let t=i.codePointAt(r);t<128?++n:n+=t<2048?2:t<65536?3:4,n<Yt.foldLength+1?r+=t>65535?2:1:(e+=Yt.newLineChar+" "+i.slice(0,Math.max(0,r)),i=i.slice(Math.max(0,r)),r=n=0);}return e.slice(Yt.newLineChar.length+1)}function O(t){switch("string"!=typeof t&&("number"==typeof t&&(t=parseInt(t)),t=String(t)),t.length){case 0:return "00";case 1:return "0"+t;default:return t}}function b(t){return t<0?Math.ceil(t):Math.floor(t)}function S(t,e){for(let i in t){let r=Object.getOwnPropertyDescriptor(t,i);r&&!Object.getOwnPropertyDescriptor(e,i)&&Object.defineProperty(e,i,r);}return e}var E=Object.freeze({__proto__:null,binsearchInsert:T,clone:Y,extend:S,foldline:A,formatClassType:g,isStrictlyNaN:y,pad2:O,strictParseInt:_,trunc:b,unescapedIndexOf:D,updateTimezones:function(t){let e,i,r,n,s;if(!t||"vcalendar"!==t.name)return t;for(e=t.getAllSubcomponents(),i=[],r={},s=0;s<e.length;s++)if("vtimezone"===e[s].name){r[e[s].getFirstProperty("tzid").getFirstValue()]=e[s];}else i=i.concat(e[s].getAllProperties());for(n={},s=0;s<i.length;s++){let t=i[s].getParameter("tzid");t&&(n[t]=!0);}for(let[e,i]of Object.entries(r))n[e]||t.removeSubcomponent(i);for(let e of Object.keys(n))!r[e]&&p.has(e)&&t.addSubcomponent(p.get(e).component);return t}});class w{static fromString(t){let e={};return e.factor="+"===t[0]?1:-1,e.hours=_(t.slice(1,3)),e.minutes=_(t.slice(4,6)),new w(e)}static fromSeconds(t){let e=new w;return e.fromSeconds(t),e}constructor(t){this.fromData(t);}hours=0;minutes=0;factor=1;icaltype="utc-offset";clone(){return w.fromSeconds(this.toSeconds())}fromData(t){if(t)for(let[e,i]of Object.entries(t))this[e]=i;this._normalize();}fromSeconds(t){let e=Math.abs(t);return this.factor=t<0?-1:1,this.hours=b(e/3600),e-=3600*this.hours,this.minutes=b(e/60),this}toSeconds(){return this.factor*(60*this.minutes+3600*this.hours)}compare(t){let e=this.toSeconds(),i=t.toSeconds();return (e>i)-(i>e)}_normalize(){let t=this.toSeconds(),e=this.factor;for(;t<-43200;)t+=97200;for(;t>50400;)t-=97200;this.fromSeconds(t),0==t&&(this.factor=e);}toICALString(){return ct.icalendar.value["utc-offset"].toICAL(this.toString())}toString(){return (1==this.factor?"+":"-")+O(this.hours)+":"+O(this.minutes)}}class C extends a{static fromDateAndOrTimeString(t,e){function i(t,e,i){return t?_(t.slice(e,e+i)):null}let r=t.split("T"),n=r[0],s=r[1],a=s?ct.vcard.value.time._splitZone(s):[],o=a[0],l=a[1],h=n?n.length:0,u=l?l.length:0,c=n&&"-"==n[0]&&"-"==n[1],d=l&&"-"==l[0],f={year:c?null:i(n,0,4),month:!c||4!=h&&7!=h?7==h||10==h?i(n,5,2):null:i(n,2,2),day:5==h?i(n,3,2):7==h&&c?i(n,5,2):10==h?i(n,8,2):null,hour:d?null:i(l,0,2),minute:d&&3==u?i(l,1,2):u>4?i(l,d?1:3,2):null,second:4==u?i(l,2,2):6==u?i(l,4,2):8==u?i(l,6,2):null};return o="Z"==o?m.utcTimezone:o&&":"==o[3]?w.fromString(o):null,new C(f,o,e)}constructor(t,e,i){super(t,e),this.icaltype=i||"date-and-or-time";}icalclass="vcardtime";icaltype="date-and-or-time";clone(){return new C(this._time,this.zone,this.icaltype)}_normalize(){return this}utcOffset(){return this.zone instanceof w?this.zone.toSeconds():a.prototype.utcOffset.apply(this,arguments)}toICALString(){return ct.vcard.value[this.icaltype].toICAL(this.toString())}toString(){let t,e=this.year,i=this.month,r=this.day,n=this.hour,s=this.minute,a=this.second,o=null!==i,l=null!==r,h=null!==n,u=null!==s,c=null!==a,d=(null!==e?O(e)+(o||l?"-":""):o||l?"--":"")+(o?O(i):"")+(l?"-"+O(r):""),f=(h?O(n):"-")+(h&&u?":":"")+(u?O(s):"")+(h||u?"":"-")+(u&&c?":":"")+(c?O(a):"");if(this.zone===m.utcTimezone)t="Z";else if(this.zone instanceof w)t=this.zone.toString();else if(this.zone===m.localTimezone)t="";else if(this.zone instanceof m){t=w.fromSeconds(this.zone.utcOffset(this)).toString();}else t="";switch(this.icaltype){case"time":return f+t;case"date-and-or-time":case"date-time":return d+("--"==f?"":"T"+f+t);case"date":return d}return null}}class x{static _indexMap={BYSECOND:0,BYMINUTE:1,BYHOUR:2,BYDAY:3,BYMONTHDAY:4,BYYEARDAY:5,BYWEEKNO:6,BYMONTH:7,BYSETPOS:8};static _expandMap={SECONDLY:[1,1,1,1,1,1,1,1],MINUTELY:[2,1,1,1,1,1,1,1],HOURLY:[2,2,1,1,1,1,1,1],DAILY:[2,2,2,1,1,1,1,1],WEEKLY:[2,2,2,2,3,3,1,1],MONTHLY:[2,2,2,2,2,3,3,1],YEARLY:[2,2,2,2,2,2,2,2]};static UNKNOWN=0;static CONTRACT=1;static EXPAND=2;static ILLEGAL=3;constructor(t){this.fromData(t);}completed=!1;rule=null;dtstart=null;last=null;occurrence_number=0;by_indices=null;initialized=!1;by_data=null;days=null;days_index=0;fromData(t){if(this.rule=g(t.rule,L),!this.rule)throw new Error("iterator requires a (ICAL.Recur) rule");if(this.dtstart=g(t.dtstart,a),!this.dtstart)throw new Error("iterator requires a (ICAL.Time) dtstart");if(t.by_data?this.by_data=t.by_data:this.by_data=Y(this.rule.parts,!0),t.occurrence_number&&(this.occurrence_number=t.occurrence_number),this.days=t.days||[],t.last&&(this.last=g(t.last,a)),this.by_indices=t.by_indices,this.by_indices||(this.by_indices={BYSECOND:0,BYMINUTE:0,BYHOUR:0,BYDAY:0,BYMONTH:0,BYWEEKNO:0,BYMONTHDAY:0}),this.initialized=t.initialized||!1,!this.initialized)try{this.init();}catch(t){if(!(t instanceof N))throw t;this.completed=!0;}}init(){this.initialized=!0,this.last=this.dtstart.clone();let t=this.by_data;if("BYDAY"in t&&this.sort_byday_rules(t.BYDAY),"BYYEARDAY"in t&&("BYMONTH"in t||"BYWEEKNO"in t||"BYMONTHDAY"in t))throw new Error("Invalid BYYEARDAY rule");if("BYWEEKNO"in t&&"BYMONTHDAY"in t)throw new Error("BYWEEKNO does not fit to BYMONTHDAY");if("MONTHLY"==this.rule.freq&&("BYYEARDAY"in t||"BYWEEKNO"in t))throw new Error("For MONTHLY recurrences neither BYYEARDAY nor BYWEEKNO may appear");if("WEEKLY"==this.rule.freq&&("BYYEARDAY"in t||"BYMONTHDAY"in t))throw new Error("For WEEKLY recurrences neither BYMONTHDAY nor BYYEARDAY may appear");if("YEARLY"!=this.rule.freq&&"BYYEARDAY"in t)throw new Error("BYYEARDAY may only appear in YEARLY rules");if(this.last.second=this.setup_defaults("BYSECOND","SECONDLY",this.dtstart.second),this.last.minute=this.setup_defaults("BYMINUTE","MINUTELY",this.dtstart.minute),this.last.hour=this.setup_defaults("BYHOUR","HOURLY",this.dtstart.hour),this.last.day=this.setup_defaults("BYMONTHDAY","DAILY",this.dtstart.day),this.last.month=this.setup_defaults("BYMONTH","MONTHLY",this.dtstart.month),"WEEKLY"==this.rule.freq)if("BYDAY"in t){let[,e]=this.ruleDayOfWeek(t.BYDAY[0],this.rule.wkst),i=e-this.last.dayOfWeek(this.rule.wkst);(this.last.dayOfWeek(this.rule.wkst)<e&&i>=0||i<0)&&(this.last.day+=i);}else {let e=L.numericDayToIcalDay(this.dtstart.dayOfWeek());t.BYDAY=[e];}if("YEARLY"==this.rule.freq){const t=this.rule.until?this.rule.until.year:2e4;for(;this.last.year<=t&&(this.expand_year_days(this.last.year),!(this.days.length>0));)this.increment_year(this.rule.interval);if(0==this.days.length)throw new N;if(!(this._nextByYearDay()||this.next_year()||this.next_year()||this.next_year()))throw new N}if("MONTHLY"==this.rule.freq)if(this.has_by_data("BYDAY")){let t=null,e=this.last.clone(),i=a.daysInMonth(this.last.month,this.last.year);for(let r of this.by_data.BYDAY){this.last=e.clone();let[n,s]=this.ruleDayOfWeek(r),o=this.last.nthWeekDay(s,n);if(n>=6||n<=-6)throw new Error("Malformed values in BYDAY part");if(o>i||o<=0){if(t&&t.month==e.month)continue;for(;o>i||o<=0;)this.increment_month(),i=a.daysInMonth(this.last.month,this.last.year),o=this.last.nthWeekDay(s,n);}this.last.day=o,(!t||this.last.compare(t)<0)&&(t=this.last.clone());}if(this.last=t.clone(),this.has_by_data("BYMONTHDAY")&&this._byDayAndMonthDay(!0),this.last.day>i||0==this.last.day)throw new Error("Malformed values in BYDAY part")}else if(this.has_by_data("BYMONTHDAY")){this.last.day=1;let t=this.normalizeByMonthDayRules(this.last.year,this.last.month,this.rule.parts.BYMONTHDAY).filter((t=>t>=this.last.day));if(t.length)this.last.day=t[0],this.by_data.BYMONTHDAY=t;else if(!this.next_month()&&!this.next_month()&&!this.next_month())throw new N}}next(t=!1){let e,i=this.last?this.last.clone():null;if((this.rule.count&&this.occurrence_number>=this.rule.count||this.rule.until&&this.last.compare(this.rule.until)>0)&&(this.completed=!0),this.completed)return null;if(0==this.occurrence_number&&this.last.compare(this.dtstart)>=0)return this.occurrence_number++,this.last;let r=0;do{switch(e=1,this.rule.freq){case"SECONDLY":this.next_second();break;case"MINUTELY":this.next_minute();break;case"HOURLY":this.next_hour();break;case"DAILY":this.next_day();break;case"WEEKLY":this.next_week();break;case"MONTHLY":if(e=this.next_month(),e)r=0;else if(336==++r)return this.completed=!0,null;break;case"YEARLY":if(e=this.next_year(),e)r=0;else if(28==++r)return this.completed=!0,null;break;default:return null}}while(!this.check_contracting_rules()||this.last.compare(this.dtstart)<0||!e);if(0==this.last.compare(i)){if(t)throw new Error("Same occurrence found twice, protecting you from death by recursion");this.next(!0);}return this.rule.until&&this.last.compare(this.rule.until)>0?(this.completed=!0,null):(this.occurrence_number++,this.last)}next_second(){return this.next_generic("BYSECOND","SECONDLY","second","minute")}increment_second(t){return this.increment_generic(t,"second",60,"minute")}next_minute(){return this.next_generic("BYMINUTE","MINUTELY","minute","hour","next_second")}increment_minute(t){return this.increment_generic(t,"minute",60,"hour")}next_hour(){return this.next_generic("BYHOUR","HOURLY","hour","monthday","next_minute")}increment_hour(t){this.increment_generic(t,"hour",24,"monthday");}next_day(){let t="DAILY"==this.rule.freq;return 0==this.next_hour()||(t?this.increment_monthday(this.rule.interval):this.increment_monthday(1)),0}next_week(){let t=0;if(0==this.next_weekday_by_week())return t;if(this.has_by_data("BYWEEKNO")){this.by_indices.BYWEEKNO++,this.by_indices.BYWEEKNO==this.by_data.BYWEEKNO.length&&(this.by_indices.BYWEEKNO=0,t=1),this.last.month=1,this.last.day=1;let e=this.by_data.BYWEEKNO[this.by_indices.BYWEEKNO];this.last.day+=7*e,t&&this.increment_year(1);}else this.increment_monthday(7*this.rule.interval);return t}normalizeByMonthDayRules(t,e,i){let r,n=a.daysInMonth(e,t),s=[],o=0,l=i.length;for(;o<l;o++){if(r=parseInt(i[o],10),isNaN(r))throw new Error("Invalid BYMONTHDAY value");if(!(Math.abs(r)>n)){if(r<0)r=n+(r+1);else if(0===r)continue;-1===s.indexOf(r)&&s.push(r);}}return s.sort((function(t,e){return t-e}))}_byDayAndMonthDay(t){let e,i,r,n,s=this.by_data.BYDAY,o=0,l=s.length,h=0,u=this,c=this.last.day;function d(){for(n=a.daysInMonth(u.last.month,u.last.year),e=u.normalizeByMonthDayRules(u.last.year,u.last.month,u.by_data.BYMONTHDAY),r=e.length;e[o]<=c&&(!t||e[o]!=c)&&o<r-1;)o++;}function m(){c=0,u.increment_month(),o=0,d();}d(),t&&(c-=1);let f=48;for(;!h&&f;){if(f--,i=c+1,i>n){m();continue}let t=e[o++];if(t>=i){c=t;for(let t=0;t<l;t++){let e=this.ruleDayOfWeek(s[t]),i=e[0],r=e[1];if(this.last.day=c,this.last.isNthWeekDay(r,i)){h=1;break}}h||o!==r||m();}else m();}if(f<=0)throw new Error("Malformed values in BYDAY combined with BYMONTHDAY parts");return h}next_month(){let t=1;if(0==this.next_hour())return t;if(this.has_by_data("BYDAY")&&this.has_by_data("BYMONTHDAY"))t=this._byDayAndMonthDay();else if(this.has_by_data("BYDAY")){let e,i=a.daysInMonth(this.last.month,this.last.year),r=0,n=0;if(this.has_by_data("BYSETPOS")){let t=this.last.day;for(let e=1;e<=i;e++)this.last.day=e,this.is_day_in_byday(this.last)&&(n++,e<=t&&r++);this.last.day=t;}for(t=0,e=this.last.day+1;e<=i;e++)if(this.last.day=e,this.is_day_in_byday(this.last)&&(!this.has_by_data("BYSETPOS")||this.check_set_position(++r)||this.check_set_position(r-n-1))){t=1;break}e>i&&(this.last.day=1,this.increment_month(),this.is_day_in_byday(this.last)?this.has_by_data("BYSETPOS")&&!this.check_set_position(1)||(t=1):t=0);}else if(this.has_by_data("BYMONTHDAY")){if(this.by_indices.BYMONTHDAY++,this.by_indices.BYMONTHDAY>=this.by_data.BYMONTHDAY.length&&(this.by_indices.BYMONTHDAY=0,this.increment_month(),this.by_indices.BYMONTHDAY>=this.by_data.BYMONTHDAY.length))return 0;let e=a.daysInMonth(this.last.month,this.last.year),i=this.by_data.BYMONTHDAY[this.by_indices.BYMONTHDAY];i<0&&(i=e+i+1),i>e?(this.last.day=1,t=this.is_day_in_byday(this.last)):this.last.day=i;}else {this.increment_month();let e=a.daysInMonth(this.last.month,this.last.year);this.by_data.BYMONTHDAY[0]>e?t=0:this.last.day=this.by_data.BYMONTHDAY[0];}return t}next_weekday_by_week(){let t=0;if(0==this.next_hour())return t;if(!this.has_by_data("BYDAY"))return 1;for(;;){let e=new a;this.by_indices.BYDAY++,this.by_indices.BYDAY==Object.keys(this.by_data.BYDAY).length&&(this.by_indices.BYDAY=0,t=1);let i=this.by_data.BYDAY[this.by_indices.BYDAY],r=this.ruleDayOfWeek(i)[1];r-=this.rule.wkst,r<0&&(r+=7),e.year=this.last.year,e.month=this.last.month,e.day=this.last.day;let n=e.startDoyWeek(this.rule.wkst);if(r+n<1&&!t)continue;let s=a.fromDayOfYear(n+r,this.last.year);return this.last.year=s.year,this.last.month=s.month,this.last.day=s.day,t}}next_year(){return 0==this.next_hour()?0:0!=this.days.length&&++this.days_index!=this.days.length||(this.days_index=0,this.increment_year(this.rule.interval),this.has_by_data("BYMONTHDAY")&&(this.by_data.BYMONTHDAY=this.normalizeByMonthDayRules(this.last.year,this.last.month,this.rule.parts.BYMONTHDAY)),this.expand_year_days(this.last.year),0!=this.days.length)?this._nextByYearDay():0}_nextByYearDay(){let t=this.days[this.days_index],e=this.last.year;if(366==Math.abs(t)&&!a.isLeapYear(this.last.year))return 0;t<1&&(t+=1,e+=1);let i=a.fromDayOfYear(t,e);return this.last.day=i.day,this.last.month=i.month,1}ruleDayOfWeek(t,e){let i=t.match(/([+-]?[0-9])?(MO|TU|WE|TH|FR|SA|SU)/);if(i){return [parseInt(i[1]||0,10),t=L.icalDayToNumericDay(i[2],e)]}return [0,0]}next_generic(t,e,i,r,n){let s=t in this.by_data,a=this.rule.freq==e,o=0;if(n&&0==this[n]())return o;if(s){this.by_indices[t]++;let e=this.by_data[t];this.by_indices[t]==e.length&&(this.by_indices[t]=0,o=1),this.last[i]=e[this.by_indices[t]];}else a&&this["increment_"+i](this.rule.interval);return s&&o&&a&&this["increment_"+r](1),o}increment_monthday(t){for(let e=0;e<t;e++){let t=a.daysInMonth(this.last.month,this.last.year);this.last.day++,this.last.day>t&&(this.last.day-=t,this.increment_month());}}increment_month(){if(this.last.day=1,this.has_by_data("BYMONTH"))this.by_indices.BYMONTH++,this.by_indices.BYMONTH==this.by_data.BYMONTH.length&&(this.by_indices.BYMONTH=0,this.increment_year(1)),this.last.month=this.by_data.BYMONTH[this.by_indices.BYMONTH];else {"MONTHLY"==this.rule.freq?this.last.month+=this.rule.interval:this.last.month++,this.last.month--;let t=b(this.last.month/12);this.last.month%=12,this.last.month++,0!=t&&this.increment_year(t);}this.has_by_data("BYMONTHDAY")&&(this.by_data.BYMONTHDAY=this.normalizeByMonthDayRules(this.last.year,this.last.month,this.rule.parts.BYMONTHDAY));}increment_year(t){this.last.day=1,this.last.year+=t;}increment_generic(t,e,i,r){this.last[e]+=t;let n=b(this.last[e]/i);this.last[e]%=i,0!=n&&this["increment_"+r](n);}has_by_data(t){return t in this.rule.parts}expand_year_days(t){let e=new a;this.days=[];let i={},r=["BYDAY","BYWEEKNO","BYMONTHDAY","BYMONTH","BYYEARDAY"];for(let t of r)t in this.rule.parts&&(i[t]=this.rule.parts[t]);if("BYMONTH"in i&&"BYWEEKNO"in i){let r=1,n={};e.year=t,e.isDate=!0;for(let i=0;i<this.by_data.BYMONTH.length;i++){let r=this.by_data.BYMONTH[i];e.month=r,e.day=1;let s=e.weekNumber(this.rule.wkst);e.day=a.daysInMonth(r,t);let o=e.weekNumber(this.rule.wkst);for(i=s;i<o;i++)n[i]=1;}for(let t=0;t<this.by_data.BYWEEKNO.length&&r;t++){this.by_data.BYWEEKNO[t]<52?r&=n[t]:r=0;}r?delete i.BYMONTH:delete i.BYWEEKNO;}let n=Object.keys(i).length;if(0==n){let t=this.dtstart.clone();t.year=this.last.year,this.days.push(t.dayOfYear());}else if(1==n&&"BYMONTH"in i)for(let e of this.by_data.BYMONTH){let i=this.dtstart.clone();i.year=t,i.month=e,i.isDate=!0,this.days.push(i.dayOfYear());}else if(1==n&&"BYMONTHDAY"in i)for(let e of this.by_data.BYMONTHDAY){let i=this.dtstart.clone();if(e<0){e=e+a.daysInMonth(i.month,t)+1;}i.day=e,i.year=t,i.isDate=!0,this.days.push(i.dayOfYear());}else if(2==n&&"BYMONTHDAY"in i&&"BYMONTH"in i)for(let i of this.by_data.BYMONTH){let r=a.daysInMonth(i,t);for(let n of this.by_data.BYMONTHDAY)n<0&&(n=n+r+1),e.day=n,e.month=i,e.year=t,e.isDate=!0,this.days.push(e.dayOfYear());}else if(1==n&&"BYWEEKNO"in i);else if(2==n&&"BYWEEKNO"in i&&"BYMONTHDAY"in i);else if(1==n&&"BYDAY"in i)this.days=this.days.concat(this.expand_by_day(t));else if(2==n&&"BYDAY"in i&&"BYMONTH"in i){for(let i of this.by_data.BYMONTH){let r=a.daysInMonth(i,t);e.year=t,e.month=i,e.day=1,e.isDate=!0;let n=e.dayOfWeek(),s=e.dayOfYear()-1;e.day=r;let o=e.dayOfWeek();if(this.has_by_data("BYSETPOS")){let t=[];for(let i=1;i<=r;i++)e.day=i,this.is_day_in_byday(e)&&t.push(i);for(let e=0;e<t.length;e++)(this.check_set_position(e+1)||this.check_set_position(e-t.length))&&this.days.push(s+t[e]);}else for(let t of this.by_data.BYDAY){let e,i=this.ruleDayOfWeek(t),a=i[0],l=i[1],h=(l+7-n)%7+1,u=r-(o+7-l)%7;if(0==a)for(let t=h;t<=r;t+=7)this.days.push(s+t);else a>0?(e=h+7*(a-1),e<=r&&this.days.push(s+e)):(e=u+7*(a+1),e>0&&this.days.push(s+e));}}this.days.sort((function(t,e){return t-e}));}else if(2==n&&"BYDAY"in i&&"BYMONTHDAY"in i){let e=this.expand_by_day(t);for(let i of e){let e=a.fromDayOfYear(i,t);this.by_data.BYMONTHDAY.indexOf(e.day)>=0&&this.days.push(i);}}else if(3==n&&"BYDAY"in i&&"BYMONTHDAY"in i&&"BYMONTH"in i){let e=this.expand_by_day(t);for(let i of e){let e=a.fromDayOfYear(i,t);this.by_data.BYMONTH.indexOf(e.month)>=0&&this.by_data.BYMONTHDAY.indexOf(e.day)>=0&&this.days.push(i);}}else if(2==n&&"BYDAY"in i&&"BYWEEKNO"in i){let e=this.expand_by_day(t);for(let i of e){let e=a.fromDayOfYear(i,t).weekNumber(this.rule.wkst);this.by_data.BYWEEKNO.indexOf(e)&&this.days.push(i);}}else if(3==n&&"BYDAY"in i&&"BYWEEKNO"in i&&"BYMONTHDAY"in i);else if(1==n&&"BYYEARDAY"in i)this.days=this.days.concat(this.by_data.BYYEARDAY);else if(2==n&&"BYYEARDAY"in i&&"BYDAY"in i){let e=a.isLeapYear(t)?366:365,i=new Set(this.expand_by_day(t));for(let t of this.by_data.BYYEARDAY)t<0&&(t+=e+1),i.has(t)&&this.days.push(t);}else this.days=[];let s=a.isLeapYear(t)?366:365;return this.days.sort(((t,e)=>(t<0&&(t+=s+1),e<0&&(e+=s+1),t-e))),0}expand_by_day(t){let e=[],i=this.last.clone();i.year=t,i.month=1,i.day=1,i.isDate=!0;let r=i.dayOfWeek();i.month=12,i.day=31,i.isDate=!0;let n=i.dayOfWeek(),s=i.dayOfYear();for(let t of this.by_data.BYDAY){let i=this.ruleDayOfWeek(t),a=i[0],o=i[1];if(0==a){for(let t=(o+7-r)%7+1;t<=s;t+=7)e.push(t);}else if(a>0){let t;t=o>=r?o-r+1:o-r+8,e.push(t+7*(a-1));}else {let t;a=-a,t=o<=n?s-n+o:s-n+o-7,e.push(t-7*(a-1));}}return e}is_day_in_byday(t){if(this.by_data.BYDAY)for(let e of this.by_data.BYDAY){let i=this.ruleDayOfWeek(e),r=i[0],n=i[1],s=t.dayOfWeek();if(0==r&&n==s||t.nthWeekDay(n,r)==t.day)return 1}return 0}check_set_position(t){if(this.has_by_data("BYSETPOS")){return -1!==this.by_data.BYSETPOS.indexOf(t)}return !1}sort_byday_rules(t){for(let e=0;e<t.length;e++)for(let i=0;i<e;i++){if(this.ruleDayOfWeek(t[i],this.rule.wkst)[1]>this.ruleDayOfWeek(t[e],this.rule.wkst)[1]){let r=t[e];t[e]=t[i],t[i]=r;}}}check_contract_restriction(t,e){let i=x._indexMap[t],r=x._expandMap[this.rule.freq][i],n=!1;if(t in this.by_data&&r==x.CONTRACT){let i=this.by_data[t];for(let t of i)if(t==e){n=!0;break}}else n=!0;return n}check_contracting_rules(){let t=this.last.dayOfWeek(),e=this.last.weekNumber(this.rule.wkst),i=this.last.dayOfYear();return this.check_contract_restriction("BYSECOND",this.last.second)&&this.check_contract_restriction("BYMINUTE",this.last.minute)&&this.check_contract_restriction("BYHOUR",this.last.hour)&&this.check_contract_restriction("BYDAY",L.numericDayToIcalDay(t))&&this.check_contract_restriction("BYWEEKNO",e)&&this.check_contract_restriction("BYMONTHDAY",this.last.day)&&this.check_contract_restriction("BYMONTH",this.last.month)&&this.check_contract_restriction("BYYEARDAY",i)}setup_defaults(t,e,i){let r=x._indexMap[t];return x._expandMap[this.rule.freq][r]!=x.CONTRACT&&(t in this.by_data||(this.by_data[t]=[i]),this.rule.freq!=e)?this.by_data[t][0]:i}toJSON(){let t=Object.create(null);return t.initialized=this.initialized,t.rule=this.rule.toJSON(),t.dtstart=this.dtstart.toJSON(),t.by_data=this.by_data,t.days=this.days,t.last=this.last.toJSON(),t.by_indices=this.by_indices,t.occurrence_number=this.occurrence_number,t}}class N extends Error{constructor(){super("Recurrence rule has no valid occurrences");}}const v=/^(SU|MO|TU|WE|TH|FR|SA)$/,I=/^([+-])?(5[0-3]|[1-4][0-9]|[1-9])?(SU|MO|TU|WE|TH|FR|SA)$/,B={SU:a.SUNDAY,MO:a.MONDAY,TU:a.TUESDAY,WE:a.WEDNESDAY,TH:a.THURSDAY,FR:a.FRIDAY,SA:a.SATURDAY},M=Object.fromEntries(Object.entries(B).map((t=>t.reverse()))),z=["SECONDLY","MINUTELY","HOURLY","DAILY","WEEKLY","MONTHLY","YEARLY"];class L{static fromString(t){let e=this._stringToData(t,!1);return new L(e)}static fromData(t){return new L(t)}static _stringToData(t,e){let i=Object.create(null),r=t.split(";"),n=r.length;for(let t=0;t<n;t++){let n=r[t].split("="),s=n[0].toUpperCase(),a=n[0].toLowerCase(),o=e?a:s,l=n[1];if(s in U){let t=l.split(","),e=new Set;for(let i of t)e.add(U[s](i));t=[...e],i[o]=1==t.length?t[0]:t;}else s in P?P[s](l,i,e):i[a]=l;}return i}static icalDayToNumericDay(t,e){let i=e||a.SUNDAY;return (B[t]-i+7)%7+1}static numericDayToIcalDay(t,e){let i=t+(e||a.SUNDAY)-a.SUNDAY;return i>7&&(i-=7),M[i]}constructor(t){this.wrappedJSObject=this,this.parts={},t&&"object"==typeof t&&this.fromData(t);}parts=null;interval=1;wkst=a.MONDAY;until=null;count=null;freq=null;icalclass="icalrecur";icaltype="recur";iterator(t){return new x({rule:this,dtstart:t})}clone(){return new L(this.toJSON())}isFinite(){return !(!this.count&&!this.until)}isByCount(){return !(!this.count||this.until)}addComponent(t,e){let i=t.toUpperCase();i in this.parts?this.parts[i].push(e):this.parts[i]=[e];}setComponent(t,e){this.parts[t.toUpperCase()]=e.slice();}getComponent(t){let e=t.toUpperCase();return e in this.parts?this.parts[e].slice():[]}getNextOccurrence(t,e){let i,r=this.iterator(t);do{i=r.next();}while(i&&i.compare(e)<=0);return i&&e.zone&&(i.zone=e.zone),i}fromData(t){for(let e in t){let i=e.toUpperCase();i in U?Array.isArray(t[e])?this.parts[i]=t[e]:this.parts[i]=[t[e]]:this[e]=t[e];}this.interval&&"number"!=typeof this.interval&&P.INTERVAL(this.interval,this),this.wkst&&"number"!=typeof this.wkst&&(this.wkst=L.icalDayToNumericDay(this.wkst)),!this.until||this.until instanceof a||(this.until=a.fromString(this.until));}toJSON(){let t=Object.create(null);t.freq=this.freq,this.count&&(t.count=this.count),this.interval>1&&(t.interval=this.interval);for(let[e,i]of Object.entries(this.parts))Array.isArray(i)&&1==i.length?t[e.toLowerCase()]=i[0]:t[e.toLowerCase()]=Y(i);return this.until&&(t.until=this.until.toString()),"wkst"in this&&this.wkst!==a.DEFAULT_WEEK_START&&(t.wkst=L.numericDayToIcalDay(this.wkst)),t}toString(){let t="FREQ="+this.freq;this.count&&(t+=";COUNT="+this.count),this.interval>1&&(t+=";INTERVAL="+this.interval);for(let[e,i]of Object.entries(this.parts))t+=";"+e+"="+i;return this.until&&(t+=";UNTIL="+this.until.toICALString()),"wkst"in this&&this.wkst!==a.DEFAULT_WEEK_START&&(t+=";WKST="+L.numericDayToIcalDay(this.wkst)),t}}function k(t,e,i,r){let n=r;if("+"===r[0]&&(n=r.slice(1)),n=_(n),void 0!==e&&r<e)throw new Error(t+': invalid value "'+r+'" must be > '+e);if(void 0!==i&&r>i)throw new Error(t+': invalid value "'+r+'" must be < '+e);return n}const P={FREQ:function(t,e,i){if(-1===z.indexOf(t))throw new Error('invalid frequency "'+t+'" expected: "'+z.join(", ")+'"');e.freq=t;},COUNT:function(t,e,i){e.count=_(t);},INTERVAL:function(t,e,i){e.interval=_(t),e.interval<1&&(e.interval=1);},UNTIL:function(t,e,i){t.length>10?e.until=ct.icalendar.value["date-time"].fromICAL(t):e.until=ct.icalendar.value.date.fromICAL(t),i||(e.until=a.fromString(e.until));},WKST:function(t,e,i){if(!v.test(t))throw new Error('invalid WKST value "'+t+'"');e.wkst=L.icalDayToNumericDay(t);}},U={BYSECOND:k.bind(void 0,"BYSECOND",0,60),BYMINUTE:k.bind(void 0,"BYMINUTE",0,59),BYHOUR:k.bind(void 0,"BYHOUR",0,23),BYDAY:function(t){if(I.test(t))return t;throw new Error('invalid BYDAY value "'+t+'"')},BYMONTHDAY:k.bind(void 0,"BYMONTHDAY",-31,31),BYYEARDAY:k.bind(void 0,"BYYEARDAY",-366,366),BYWEEKNO:k.bind(void 0,"BYWEEKNO",-53,53),BYMONTH:k.bind(void 0,"BYMONTH",1,12),BYSETPOS:k.bind(void 0,"BYSETPOS",-366,366)},j=/\\\\|\\,|\\[Nn]/g,V=/\\|,|\n/g;function H(t,e){return {matches:/.*/,fromICAL:function(e,i){return function(t,e,i){if(-1===t.indexOf("\\"))return t;i&&(e=new RegExp(e.source+"|\\\\"+i,e.flags));return t.replace(e,$)}(e,t,i)},toICAL:function(t,i){let r=e;return i&&(r=new RegExp(r.source+"|"+i,r.flags)),t.replace(r,(function(t){switch(t){case"\\":return "\\\\";case";":return "\\;";case",":return "\\,";case"\n":return "\\n";default:return t}}))}}}const R={defaultType:"text"},W={defaultType:"text",multiValue:","},F={defaultType:"text",structuredValue:";"},K={defaultType:"integer"},q={defaultType:"date-time",allowedTypes:["date-time","date"]},J={defaultType:"date-time"},Z={defaultType:"uri"},G={defaultType:"utc-offset"},X={defaultType:"recur"},Q={defaultType:"date-and-or-time",allowedTypes:["date-time","date","text"]};function $(t){switch(t){case"\\\\":return "\\";case"\\;":return ";";case"\\,":return ",";case"\\n":case"\\N":return "\n";default:return t}}let tt={categories:W,url:Z,version:R,uid:R},et={boolean:{values:["TRUE","FALSE"],fromICAL:function(t){return "TRUE"===t},toICAL:function(t){return t?"TRUE":"FALSE"}},float:{matches:/^[+-]?\d+\.\d+$/,fromICAL:function(t){let e=parseFloat(t);return y(e)?0:e},toICAL:function(t){return String(t)}},integer:{fromICAL:function(t){let e=parseInt(t);return y(e)?0:e},toICAL:function(t){return String(t)}},"utc-offset":{toICAL:function(t){return t.length<7?t.slice(0,3)+t.slice(4,6):t.slice(0,3)+t.slice(4,6)+t.slice(7,9)},fromICAL:function(t){return t.length<6?t.slice(0,3)+":"+t.slice(3,5):t.slice(0,3)+":"+t.slice(3,5)+":"+t.slice(5,7)},decorate:function(t){return w.fromString(t)},undecorate:function(t){return t.toString()}}};const it=S(et,{text:H(/\\\\|\\;|\\,|\\[Nn]/g,/\\|;|,|\n/g),uri:{},binary:{decorate:function(e){return t.fromString(e)},undecorate:function(t){return t.toString()}},"cal-address":{},date:{decorate:function(t,e){return ct.strict?a.fromDateString(t,e):a.fromString(t,e)},undecorate:function(t){return t.toString()},fromICAL:function(t){return !ct.strict&&t.length>=15?it["date-time"].fromICAL(t):t.slice(0,4)+"-"+t.slice(4,6)+"-"+t.slice(6,8)},toICAL:function(t){let e=t.length;return 10==e?t.slice(0,4)+t.slice(5,7)+t.slice(8,10):e>=19?it["date-time"].toICAL(t):t}},"date-time":{fromICAL:function(t){if(ct.strict||8!=t.length){let e=t.slice(0,4)+"-"+t.slice(4,6)+"-"+t.slice(6,8)+"T"+t.slice(9,11)+":"+t.slice(11,13)+":"+t.slice(13,15);return t[15]&&"Z"===t[15]&&(e+="Z"),e}return it.date.fromICAL(t)},toICAL:function(t){let e=t.length;if(10!=e||ct.strict){if(e>=19){let e=t.slice(0,4)+t.slice(5,7)+t.slice(8,13)+t.slice(14,16)+t.slice(17,19);return t[19]&&"Z"===t[19]&&(e+="Z"),e}return t}return it.date.toICAL(t)},decorate:function(t,e){return ct.strict?a.fromDateTimeString(t,e):a.fromString(t,e)},undecorate:function(t){return t.toString()}},duration:{decorate:function(t){return r.fromString(t)},undecorate:function(t){return t.toString()}},period:{fromICAL:function(t){let e=t.split("/");return e[0]=it["date-time"].fromICAL(e[0]),r.isValueString(e[1])||(e[1]=it["date-time"].fromICAL(e[1])),e},toICAL:function(t){return t=t.slice(),ct.strict||10!=t[0].length?t[0]=it["date-time"].toICAL(t[0]):t[0]=it.date.toICAL(t[0]),r.isValueString(t[1])||(ct.strict||10!=t[1].length?t[1]=it["date-time"].toICAL(t[1]):t[1]=it.date.toICAL(t[1])),t.join("/")},decorate:function(t,e){return s.fromJSON(t,e,!ct.strict)},undecorate:function(t){return t.toJSON()}},recur:{fromICAL:function(t){return L._stringToData(t,!0)},toICAL:function(t){let e="";for(let[i,r]of Object.entries(t))"until"==i?r=r.length>10?it["date-time"].toICAL(r):it.date.toICAL(r):"wkst"==i?"number"==typeof r&&(r=L.numericDayToIcalDay(r)):Array.isArray(r)&&(r=r.join(",")),e+=i.toUpperCase()+"="+r+";";return e.slice(0,Math.max(0,e.length-1))},decorate:function(t){return L.fromData(t)},undecorate:function(t){return t.toJSON()}},time:{fromICAL:function(t){if(t.length<6)return t;let e=t.slice(0,2)+":"+t.slice(2,4)+":"+t.slice(4,6);return "Z"===t[6]&&(e+="Z"),e},toICAL:function(t){if(t.length<8)return t;let e=t.slice(0,2)+t.slice(3,5)+t.slice(6,8);return "Z"===t[8]&&(e+="Z"),e}}});let rt=S(tt,{action:R,attach:{defaultType:"uri"},attendee:{defaultType:"cal-address"},calscale:R,class:R,comment:R,completed:J,contact:R,created:J,description:R,dtend:q,dtstamp:J,dtstart:q,due:q,duration:{defaultType:"duration"},exdate:{defaultType:"date-time",allowedTypes:["date-time","date"],multiValue:","},exrule:X,freebusy:{defaultType:"period",multiValue:","},geo:{defaultType:"float",structuredValue:";"},"last-modified":J,location:R,method:R,organizer:{defaultType:"cal-address"},"percent-complete":K,priority:K,prodid:R,"related-to":R,repeat:K,rdate:{defaultType:"date-time",allowedTypes:["date-time","date","period"],multiValue:",",detectType:function(t){return -1!==t.indexOf("/")?"period":-1===t.indexOf("T")?"date":"date-time"}},"recurrence-id":q,resources:W,"request-status":F,rrule:X,sequence:K,status:R,summary:R,transp:R,trigger:{defaultType:"duration",allowedTypes:["duration","date-time"]},tzoffsetfrom:G,tzoffsetto:G,tzurl:Z,tzid:R,tzname:R});const nt=S(et,{text:H(j,V),uri:H(j,V),date:{decorate:function(t){return C.fromDateAndOrTimeString(t,"date")},undecorate:function(t){return t.toString()},fromICAL:function(t){return 8==t.length?it.date.fromICAL(t):"-"==t[0]&&6==t.length?t.slice(0,4)+"-"+t.slice(4):t},toICAL:function(t){return 10==t.length?it.date.toICAL(t):"-"==t[0]&&7==t.length?t.slice(0,4)+t.slice(5):t}},time:{decorate:function(t){return C.fromDateAndOrTimeString("T"+t,"time")},undecorate:function(t){return t.toString()},fromICAL:function(t){let e=nt.time._splitZone(t,!0),i=e[0],r=e[1];return 6==r.length?r=r.slice(0,2)+":"+r.slice(2,4)+":"+r.slice(4,6):4==r.length&&"-"!=r[0]?r=r.slice(0,2)+":"+r.slice(2,4):5==r.length&&(r=r.slice(0,3)+":"+r.slice(3,5)),5!=i.length||"-"!=i[0]&&"+"!=i[0]||(i=i.slice(0,3)+":"+i.slice(3)),r+i},toICAL:function(t){let e=nt.time._splitZone(t),i=e[0],r=e[1];return 8==r.length?r=r.slice(0,2)+r.slice(3,5)+r.slice(6,8):5==r.length&&"-"!=r[0]?r=r.slice(0,2)+r.slice(3,5):6==r.length&&(r=r.slice(0,3)+r.slice(4,6)),6!=i.length||"-"!=i[0]&&"+"!=i[0]||(i=i.slice(0,3)+i.slice(4)),r+i},_splitZone:function(t,e){let i,r,n=t.length-1,s=t.length-(e?5:6),a=t[s];return "Z"==t[n]?(i=t[n],r=t.slice(0,Math.max(0,n))):t.length>6&&("-"==a||"+"==a)?(i=t.slice(s),r=t.slice(0,Math.max(0,s))):(i="",r=t),[i,r]}},"date-time":{decorate:function(t){return C.fromDateAndOrTimeString(t,"date-time")},undecorate:function(t){return t.toString()},fromICAL:function(t){return nt["date-and-or-time"].fromICAL(t)},toICAL:function(t){return nt["date-and-or-time"].toICAL(t)}},"date-and-or-time":{decorate:function(t){return C.fromDateAndOrTimeString(t,"date-and-or-time")},undecorate:function(t){return t.toString()},fromICAL:function(t){let e=t.split("T");return (e[0]?nt.date.fromICAL(e[0]):"")+(e[1]?"T"+nt.time.fromICAL(e[1]):"")},toICAL:function(t){let e=t.split("T");return nt.date.toICAL(e[0])+(e[1]?"T"+nt.time.toICAL(e[1]):"")}},timestamp:it["date-time"],"language-tag":{matches:/^[a-zA-Z0-9-]+$/},"phone-number":{fromICAL:function(t){return Array.from(t).filter((function(t){return "\\"===t?void 0:t})).join("")},toICAL:function(t){return Array.from(t).map((function(t){return ","===t||";"===t?"\\"+t:t})).join("")}}});let st=S(tt,{adr:{defaultType:"text",structuredValue:";",multiValue:","},anniversary:Q,bday:Q,caladruri:Z,caluri:Z,clientpidmap:F,email:R,fburl:Z,fn:R,gender:F,geo:Z,impp:Z,key:Z,kind:R,lang:{defaultType:"language-tag"},logo:Z,member:Z,n:{defaultType:"text",structuredValue:";",multiValue:","},nickname:W,note:R,org:{defaultType:"text",structuredValue:";"},photo:Z,related:Z,rev:{defaultType:"timestamp"},role:R,sound:Z,source:Z,tel:{defaultType:"uri",allowedTypes:["uri","text"]},title:R,tz:{defaultType:"text",allowedTypes:["text","utc-offset","uri"]},xml:R}),at=S(et,{binary:it.binary,date:nt.date,"date-time":nt["date-time"],"phone-number":nt["phone-number"],uri:it.uri,text:nt.text,time:it.time,vcard:it.text,"utc-offset":{toICAL:function(t){return t.slice(0,7)},fromICAL:function(t){return t.slice(0,7)},decorate:function(t){return w.fromString(t)},undecorate:function(t){return t.toString()}}}),ot=S(tt,{fn:R,n:{defaultType:"text",structuredValue:";",multiValue:","},nickname:W,photo:{defaultType:"binary",allowedTypes:["binary","uri"]},bday:{defaultType:"date-time",allowedTypes:["date-time","date"],detectType:function(t){return -1===t.indexOf("T")?"date":"date-time"}},adr:{defaultType:"text",structuredValue:";",multiValue:","},label:R,tel:{defaultType:"phone-number"},email:R,mailer:R,tz:{defaultType:"utc-offset",allowedTypes:["utc-offset","text"]},geo:{defaultType:"float",structuredValue:";"},title:R,role:R,logo:{defaultType:"binary",allowedTypes:["binary","uri"]},agent:{defaultType:"vcard",allowedTypes:["vcard","text","uri"]},org:F,note:W,prodid:R,rev:{defaultType:"date-time",allowedTypes:["date-time","date"],detectType:function(t){return -1===t.indexOf("T")?"date":"date-time"}},"sort-string":R,sound:{defaultType:"binary",allowedTypes:["binary","uri"]},class:R,key:{defaultType:"binary",allowedTypes:["binary","text"]}}),lt={name:"ical",value:it,param:{cutype:{values:["INDIVIDUAL","GROUP","RESOURCE","ROOM","UNKNOWN"],allowXName:!0,allowIanaToken:!0},"delegated-from":{valueType:"cal-address",multiValue:",",multiValueSeparateDQuote:!0},"delegated-to":{valueType:"cal-address",multiValue:",",multiValueSeparateDQuote:!0},encoding:{values:["8BIT","BASE64"]},fbtype:{values:["FREE","BUSY","BUSY-UNAVAILABLE","BUSY-TENTATIVE"],allowXName:!0,allowIanaToken:!0},member:{valueType:"cal-address",multiValue:",",multiValueSeparateDQuote:!0},partstat:{values:["NEEDS-ACTION","ACCEPTED","DECLINED","TENTATIVE","DELEGATED","COMPLETED","IN-PROCESS"],allowXName:!0,allowIanaToken:!0},range:{values:["THISANDFUTURE"]},related:{values:["START","END"]},reltype:{values:["PARENT","CHILD","SIBLING"],allowXName:!0,allowIanaToken:!0},role:{values:["REQ-PARTICIPANT","CHAIR","OPT-PARTICIPANT","NON-PARTICIPANT"],allowXName:!0,allowIanaToken:!0},rsvp:{values:["TRUE","FALSE"]},"sent-by":{valueType:"cal-address"},tzid:{matches:/^\//},value:{values:["binary","boolean","cal-address","date","date-time","duration","float","integer","period","recur","text","time","uri","utc-offset"],allowXName:!0,allowIanaToken:!0}},property:rt,propertyGroups:!1},ht={name:"vcard4",value:nt,param:{type:{valueType:"text",multiValue:","},value:{values:["text","uri","date","time","date-time","date-and-or-time","timestamp","boolean","integer","float","utc-offset","language-tag"],allowXName:!0,allowIanaToken:!0}},property:st,propertyGroups:!0},ut={name:"vcard3",value:at,param:{type:{valueType:"text",multiValue:","},value:{values:["text","uri","date","date-time","phone-number","time","boolean","integer","float","utc-offset","vcard","binary"],allowXName:!0,allowIanaToken:!0}},property:ot,propertyGroups:!0};const ct={strict:!0,defaultSet:lt,defaultType:"unknown",components:{vcard:ht,vcard3:ut,vevent:lt,vtodo:lt,vjournal:lt,valarm:lt,vtimezone:lt,daylight:lt,standard:lt},icalendar:lt,vcard:ht,vcard3:ut,getDesignSet:function(t){return t&&t in ct.components?ct.components[t]:ct.defaultSet}},dt="\r\n",mt="unknown",ft={'"':"^'","\n":"^n","^":"^^"};function pt(t){"string"==typeof t[0]&&(t=[t]);let e=0,i=t.length,r="";for(;e<i;e++)r+=pt.component(t[e])+dt;return r}pt.component=function(t,e){let i=t[0].toUpperCase(),r="BEGIN:"+i+dt,n=t[1],s=0,a=n.length,o=t[0];for("vcard"===o&&t[1].length>0&&("version"!==t[1][0][0]||"4.0"!==t[1][0][3])&&(o="vcard3"),e=e||ct.getDesignSet(o);s<a;s++)r+=pt.property(n[s],e)+dt;let l=t[2]||[],h=0,u=l.length;for(;h<u;h++)r+=pt.component(l[h],e)+dt;return r+="END:"+i,r},pt.property=function(t,e,i){let r=t[0].toUpperCase(),n=t[0],s=t[1];e||(e=ct.defaultSet);let a,o=s.group;a=e.propertyGroups&&o?o.toUpperCase()+"."+r:r;for(let[t,i]of Object.entries(s)){if(e.propertyGroups&&"group"==t)continue;let r=e.param[t],n=r&&r.multiValue;n&&Array.isArray(i)?(i=i.map((function(t){return t=pt._rfc6868Unescape(t),t=pt.paramPropertyValue(t,r.multiValueSeparateDQuote)})),i=pt.multiValue(i,n,"unknown",null,e)):(i=pt._rfc6868Unescape(i),i=pt.paramPropertyValue(i)),a+=";"+t.toUpperCase()+"="+i;}if(3===t.length)return a+":";let l,h=t[2],u=!1,c=!1,d=!1;return n in e.property?(l=e.property[n],"multiValue"in l&&(u=l.multiValue),"structuredValue"in l&&Array.isArray(t[3])&&(c=l.structuredValue),"defaultType"in l?h===l.defaultType&&(d=!0):h===mt&&(d=!0)):h===mt&&(d=!0),d||(a+=";VALUE="+h.toUpperCase()),a+=":",a+=u&&c?pt.multiValue(t[3],c,h,u,e,c):u?pt.multiValue(t.slice(3),u,h,null,e,!1):c?pt.multiValue(t[3],c,h,null,e,c):pt.value(t[3],h,e,!1),i?a:A(a)},pt.paramPropertyValue=function(t,e){return e||-1!==t.indexOf(",")||-1!==t.indexOf(":")||-1!==t.indexOf(";")?'"'+t+'"':t},pt.multiValue=function(t,e,i,r,n,s){let a="",o=t.length,l=0;for(;l<o;l++)r&&Array.isArray(t[l])?a+=pt.multiValue(t[l],r,i,null,n,s):a+=pt.value(t[l],i,n,s),l!==o-1&&(a+=e);return a},pt.value=function(t,e,i,r){return e in i.value&&"toICAL"in i.value[e]?i.value[e].toICAL(t,r):t},pt._rfc6868Unescape=function(t){return t.replace(/[\n^"]/g,(function(t){return ft[t]}))};class yt{static fromString(t,e){return new yt(u.property(t,e))}constructor(t,e){this._parent=e||null,"string"==typeof t?(this.jCal=[t,{},ct.defaultType],this.jCal[2]=this.getDefaultType()):this.jCal=t,this._updateType();}get type(){return this.jCal[2]}get name(){return this.jCal[0]}get parent(){return this._parent}set parent(t){let e=!this._parent||t&&t._designSet!=this._parent._designSet;this._parent=t,this.type==ct.defaultType&&e&&(this.jCal[2]=this.getDefaultType(),this._updateType());}get _designSet(){return this.parent?this.parent._designSet:ct.defaultSet}_updateType(){let t=this._designSet;this.type in t.value&&("decorate"in t.value[this.type]?this.isDecorated=!0:this.isDecorated=!1,this.name in t.property&&(this.isMultiValue="multiValue"in t.property[this.name],this.isStructuredValue="structuredValue"in t.property[this.name]));}_hydrateValue(t){return this._values&&this._values[t]?this._values[t]:this.jCal.length<=3+t?null:this.isDecorated?(this._values||(this._values=[]),this._values[t]=this._decorate(this.jCal[3+t])):this.jCal[3+t]}_decorate(t){return this._designSet.value[this.type].decorate(t,this)}_undecorate(t){return this._designSet.value[this.type].undecorate(t,this)}_setDecoratedValue(t,e){this._values||(this._values=[]),"object"==typeof t&&"icaltype"in t?(this.jCal[3+e]=this._undecorate(t),this._values[e]=t):(this.jCal[3+e]=t,this._values[e]=this._decorate(t));}getParameter(t){return t in this.jCal[1]?this.jCal[1][t]:void 0}getFirstParameter(t){let e=this.getParameter(t);return Array.isArray(e)?e[0]:e}setParameter(t,e){let i=t.toLowerCase();"string"==typeof e&&i in this._designSet.param&&"multiValue"in this._designSet.param[i]&&(e=[e]),this.jCal[1][t]=e;}removeParameter(t){delete this.jCal[1][t];}getDefaultType(){let t=this.jCal[0],e=this._designSet;if(t in e.property){let i=e.property[t];if("defaultType"in i)return i.defaultType}return ct.defaultType}resetType(t){this.removeAllValues(),this.jCal[2]=t,this._updateType();}getFirstValue(){return this._hydrateValue(0)}getValues(){let t=this.jCal.length-3;if(t<1)return [];let e=0,i=[];for(;e<t;e++)i[e]=this._hydrateValue(e);return i}removeAllValues(){this._values&&(this._values.length=0),this.jCal.length=3;}setValues(t){if(!this.isMultiValue)throw new Error(this.name+": does not not support mulitValue.\noverride isMultiValue");let e=t.length,i=0;if(this.removeAllValues(),e>0&&"object"==typeof t[0]&&"icaltype"in t[0]&&this.resetType(t[0].icaltype),this.isDecorated)for(;i<e;i++)this._setDecoratedValue(t[i],i);else for(;i<e;i++)this.jCal[3+i]=t[i];}setValue(t){this.removeAllValues(),"object"==typeof t&&"icaltype"in t&&this.resetType(t.icaltype),this.isDecorated?this._setDecoratedValue(t,0):this.jCal[3]=t;}toJSON(){return this.jCal}toICALString(){return pt.property(this.jCal,this._designSet,!0)}}class _t{static fromString(t){return new _t(u.component(t))}constructor(t,e){"string"==typeof t&&(t=[t,[],[]]),this.jCal=t,this.parent=e||null,this.parent||"vcalendar"!==this.name||(this._timezoneCache=new Map);}_hydratedPropertyCount=0;_hydratedComponentCount=0;_timezoneCache=null;_components=null;_properties=null;get name(){return this.jCal[0]}get _designSet(){let t=this.parent&&this.parent._designSet;if(!t&&"vcard"==this.name){let t=this.jCal[1]?.[0];if(t&&"version"==t[0]&&"3.0"==t[3])return ct.getDesignSet("vcard3")}return t||ct.getDesignSet(this.name)}_hydrateComponent(t){if(this._components||(this._components=[],this._hydratedComponentCount=0),this._components[t])return this._components[t];let e=new _t(this.jCal[2][t],this);return this._hydratedComponentCount++,this._components[t]=e}_hydrateProperty(t){if(this._properties||(this._properties=[],this._hydratedPropertyCount=0),this._properties[t])return this._properties[t];let e=new yt(this.jCal[1][t],this);return this._hydratedPropertyCount++,this._properties[t]=e}getFirstSubcomponent(t){if(t){let e=0,i=this.jCal[2],r=i.length;for(;e<r;e++)if(i[e][0]===t){return this._hydrateComponent(e)}}else if(this.jCal[2].length)return this._hydrateComponent(0);return null}getAllSubcomponents(t){let e=this.jCal[2].length,i=0;if(t){let r=this.jCal[2],n=[];for(;i<e;i++)t===r[i][0]&&n.push(this._hydrateComponent(i));return n}if(!this._components||this._hydratedComponentCount!==e)for(;i<e;i++)this._hydrateComponent(i);return this._components||[]}hasProperty(t){let e=this.jCal[1],i=e.length,r=0;for(;r<i;r++)if(e[r][0]===t)return !0;return !1}getFirstProperty(t){if(t){let e=0,i=this.jCal[1],r=i.length;for(;e<r;e++)if(i[e][0]===t){return this._hydrateProperty(e)}}else if(this.jCal[1].length)return this._hydrateProperty(0);return null}getFirstPropertyValue(t){let e=this.getFirstProperty(t);return e?e.getFirstValue():null}getAllProperties(t){let e=this.jCal[1].length,i=0;if(t){let r=this.jCal[1],n=[];for(;i<e;i++)t===r[i][0]&&n.push(this._hydrateProperty(i));return n}if(!this._properties||this._hydratedPropertyCount!==e)for(;i<e;i++)this._hydrateProperty(i);return this._properties||[]}_removeObjectByIndex(t,e,i){if((e=e||[])[i]){let t=e[i];"parent"in t&&(t.parent=null);}e.splice(i,1),this.jCal[t].splice(i,1);}_removeObject(t,e,i){let r=0,n=this.jCal[t],s=n.length,a=this[e];if("string"==typeof i){for(;r<s;r++)if(n[r][0]===i)return this._removeObjectByIndex(t,a,r),!0}else if(a)for(;r<s;r++)if(a[r]&&a[r]===i)return this._removeObjectByIndex(t,a,r),!0;return !1}_removeAllObjects(t,e,i){let r=this[e],n=this.jCal[t],s=n.length-1;for(;s>=0;s--)i&&n[s][0]!==i||this._removeObjectByIndex(t,r,s);}addSubcomponent(t){this._components||(this._components=[],this._hydratedComponentCount=0),t.parent&&t.parent.removeSubcomponent(t);let e=this.jCal[2].push(t.jCal);return this._components[e-1]=t,this._hydratedComponentCount++,t.parent=this,t}removeSubcomponent(t){let e=this._removeObject(2,"_components",t);return e&&this._hydratedComponentCount--,e}removeAllSubcomponents(t){let e=this._removeAllObjects(2,"_components",t);return this._hydratedComponentCount=0,e}addProperty(t){if(!(t instanceof yt))throw new TypeError("must be instance of ICAL.Property");this._properties||(this._properties=[],this._hydratedPropertyCount=0),t.parent&&t.parent.removeProperty(t);let e=this.jCal[1].push(t.jCal);return this._properties[e-1]=t,this._hydratedPropertyCount++,t.parent=this,t}addPropertyWithValue(t,e){let i=new yt(t);return i.setValue(e),this.addProperty(i),i}updatePropertyWithValue(t,e){let i=this.getFirstProperty(t);return i?i.setValue(e):i=this.addPropertyWithValue(t,e),i}removeProperty(t){let e=this._removeObject(1,"_properties",t);return e&&this._hydratedPropertyCount--,e}removeAllProperties(t){let e=this._removeAllObjects(1,"_properties",t);return this._hydratedPropertyCount=0,e}toJSON(){return this.jCal}toString(){return pt.component(this.jCal,this._designSet)}getTimeZoneByID(t){if(this.parent)return this.parent.getTimeZoneByID(t);if(!this._timezoneCache)return null;if(this._timezoneCache.has(t))return this._timezoneCache.get(t);const e=this.getAllSubcomponents("vtimezone");for(const i of e)if(i.getFirstProperty("tzid").getFirstValue()===t){const e=new m({component:i,tzid:t});return this._timezoneCache.set(t,e),e}return null}}class gt{constructor(t){this.ruleDates=[],this.exDates=[],this.fromData(t);}complete=!1;ruleIterators=null;ruleDates=null;exDates=null;ruleDateInc=0;exDateInc=0;exDate=null;ruleDate=null;dtstart=null;last=null;fromData(t){let e=g(t.dtstart,a);if(!e)throw new Error(".dtstart (ICAL.Time) must be given");if(this.dtstart=e,t.component)this._init(t.component);else {if(this.last=g(t.last,a)||e.clone(),!t.ruleIterators)throw new Error(".ruleIterators or .component must be given");this.ruleIterators=t.ruleIterators.map((function(t){return g(t,x)})),this.ruleDateInc=t.ruleDateInc,this.exDateInc=t.exDateInc,t.ruleDates&&(this.ruleDates=t.ruleDates.map((t=>g(t,a))),this.ruleDate=this.ruleDates[this.ruleDateInc]),t.exDates&&(this.exDates=t.exDates.map((t=>g(t,a))),this.exDate=this.exDates[this.exDateInc]),void 0!==t.complete&&(this.complete=t.complete);}}_compare_special(t,e){return !t.isDate&&e.isDate?new a({year:t.year,month:t.month,day:t.day}).compare(e):t.compare(e)}next(){let t,e,i,r=0;for(;;){if(r++>500)throw new Error("max tries have occurred, rule may be impossible to fulfill.");if(e=this.ruleDate,t=this._nextRecurrenceIter(this.last),!e&&!t){this.complete=!0;break}if((!e||t&&e.compare(t.last)>0)&&(e=t.last.clone(),t.next()),this.ruleDate===e&&this._nextRuleDay(),this.last=e,!this.exDate||(i=this._compare_special(this.last,this.exDate),i>0&&this._nextExDay(),0!==i))return this.last;this._nextExDay();}}toJSON(){function t(t){return t.toJSON()}let e=Object.create(null);return e.ruleIterators=this.ruleIterators.map(t),this.ruleDates&&(e.ruleDates=this.ruleDates.map(t)),this.exDates&&(e.exDates=this.exDates.map(t)),e.ruleDateInc=this.ruleDateInc,e.exDateInc=this.exDateInc,e.last=this.last.toJSON(),e.dtstart=this.dtstart.toJSON(),e.complete=this.complete,e}_extractDates(t,e){let i=[],r=t.getAllProperties(e);for(let t=0,e=r.length;t<e;t++)for(let e of r[t].getValues()){let t=T(i,e,((t,e)=>t.compare(e)));i.splice(t,0,e);}return i}_init(t){if(this.ruleIterators=[],this.last=this.dtstart.clone(),!t.hasProperty("rdate")&&!t.hasProperty("rrule")&&!t.hasProperty("recurrence-id"))return this.ruleDate=this.last.clone(),void(this.complete=!0);if(t.hasProperty("rdate")&&(this.ruleDates=this._extractDates(t,"rdate"),this.ruleDates[0]&&this.ruleDates[0].compare(this.dtstart)<0?(this.ruleDateInc=0,this.last=this.ruleDates[0].clone()):this.ruleDateInc=T(this.ruleDates,this.last,((t,e)=>t.compare(e))),this.ruleDate=this.ruleDates[this.ruleDateInc]),t.hasProperty("rrule")){let e,i,r=t.getAllProperties("rrule"),n=0,s=r.length;for(;n<s;n++)e=r[n].getFirstValue(),i=e.iterator(this.dtstart),this.ruleIterators.push(i),i.next();}t.hasProperty("exdate")&&(this.exDates=this._extractDates(t,"exdate"),this.exDateInc=T(this.exDates,this.last,this._compare_special),this.exDate=this.exDates[this.exDateInc]);}_nextExDay(){this.exDate=this.exDates[++this.exDateInc];}_nextRuleDay(){this.ruleDate=this.ruleDates[++this.ruleDateInc];}_nextRecurrenceIter(){let t=this.ruleIterators;if(0===t.length)return null;let e,i,r,n=t.length,s=0;for(;s<n;s++)e=t[s],i=e.last,e.completed?(n--,0!==s&&s--,t.splice(s,1)):(!r||r.last.compare(i)>0)&&(r=e);return r}}class Dt{constructor(t,e){t instanceof _t||(e=t,t=null),this.component=t||new _t("vevent"),this._rangeExceptionCache=Object.create(null),this.exceptions=Object.create(null),this.rangeExceptions=[],e&&e.strictExceptions&&(this.strictExceptions=e.strictExceptions),e&&e.exceptions?e.exceptions.forEach(this.relateException,this):this.component.parent&&!this.isRecurrenceException()&&this.component.parent.getAllSubcomponents("vevent").forEach((function(t){t.hasProperty("recurrence-id")&&this.relateException(t);}),this);}static THISANDFUTURE="THISANDFUTURE";exceptions=null;strictExceptions=!1;relateException(t){if(this.isRecurrenceException())throw new Error("cannot relate exception to exceptions");if(t instanceof _t&&(t=new Dt(t)),this.strictExceptions&&t.uid!==this.uid)throw new Error("attempted to relate unrelated exception");let e=t.recurrenceId.toString();if(this.exceptions[e]=t,t.modifiesFuture()){let i=[t.recurrenceId.toUnixTime(),e],r=T(this.rangeExceptions,i,Tt);this.rangeExceptions.splice(r,0,i);}}modifiesFuture(){if(!this.component.hasProperty("recurrence-id"))return !1;return this.component.getFirstProperty("recurrence-id").getParameter("range")===Dt.THISANDFUTURE}findRangeException(t){if(!this.rangeExceptions.length)return null;let e=t.toUnixTime(),i=T(this.rangeExceptions,[e],Tt);if(i-=1,i<0)return null;let r=this.rangeExceptions[i];return e<r[0]?null:r[1]}getOccurrenceDetails(t){let e,i=t.toString(),r=t.convertToZone(m.utcTimezone).toString(),n={recurrenceId:t};if(i in this.exceptions)e=n.item=this.exceptions[i],n.startDate=e.startDate,n.endDate=e.endDate,n.item=e;else if(r in this.exceptions)e=this.exceptions[r],n.startDate=e.startDate,n.endDate=e.endDate,n.item=e;else {let e,i=this.findRangeException(t);if(i){let r=this.exceptions[i];n.item=r;let s=this._rangeExceptionCache[i];if(!s){let t=r.recurrenceId.clone(),e=r.startDate.clone();t.zone=e.zone,s=e.subtractDate(t),this._rangeExceptionCache[i]=s;}let a=t.clone();a.zone=r.startDate.zone,a.addDuration(s),e=a.clone(),e.addDuration(r.duration),n.startDate=a,n.endDate=e;}else e=t.clone(),e.addDuration(this.duration),n.endDate=e,n.startDate=t,n.item=this;}return n}iterator(t){return new gt({component:this.component,dtstart:t||this.startDate})}isRecurring(){let t=this.component;return t.hasProperty("rrule")||t.hasProperty("rdate")}isRecurrenceException(){return this.component.hasProperty("recurrence-id")}getRecurrenceTypes(){let t=this.component.getAllProperties("rrule"),e=0,i=t.length,r=Object.create(null);for(;e<i;e++){r[t[e].getFirstValue().freq]=!0;}return r}get uid(){return this._firstProp("uid")}set uid(t){this._setProp("uid",t);}get startDate(){return this._firstProp("dtstart")}set startDate(t){this._setTime("dtstart",t);}get endDate(){let t=this._firstProp("dtend");if(!t){let e=this._firstProp("duration");t=this.startDate.clone(),e?t.addDuration(e):t.isDate&&(t.day+=1);}return t}set endDate(t){this.component.hasProperty("duration")&&this.component.removeProperty("duration"),this._setTime("dtend",t);}get duration(){let t=this._firstProp("duration");return t||this.endDate.subtractDateTz(this.startDate)}set duration(t){this.component.hasProperty("dtend")&&this.component.removeProperty("dtend"),this._setProp("duration",t);}get location(){return this._firstProp("location")}set location(t){this._setProp("location",t);}get attendees(){return this.component.getAllProperties("attendee")}get summary(){return this._firstProp("summary")}set summary(t){this._setProp("summary",t);}get description(){return this._firstProp("description")}set description(t){this._setProp("description",t);}get color(){return this._firstProp("color")}set color(t){this._setProp("color",t);}get organizer(){return this._firstProp("organizer")}set organizer(t){this._setProp("organizer",t);}get sequence(){return this._firstProp("sequence")}set sequence(t){this._setProp("sequence",t);}get recurrenceId(){return this._firstProp("recurrence-id")}set recurrenceId(t){this._setTime("recurrence-id",t);}_setTime(t,e){let i=this.component.getFirstProperty(t);i||(i=new yt(t),this.component.addProperty(i)),e.zone===m.localTimezone||e.zone===m.utcTimezone?i.removeParameter("tzid"):i.setParameter("tzid",e.zone.tzid),i.setValue(e);}_setProp(t,e){this.component.updatePropertyWithValue(t,e);}_firstProp(t){return this.component.getFirstPropertyValue(t)}toString(){return this.component.toString()}}function Tt(t,e){return t[0]>e[0]?1:e[0]>t[0]?-1:0}var Yt={foldLength:75,debug:!1,newLineChar:"\r\n",Binary:t,Component:_t,ComponentParser:class{constructor(t){void 0===t&&(t={});for(let[e,i]of Object.entries(t))this[e]=i;}parseEvent=!0;parseTimezone=!0;oncomplete=function(){};onerror=function(t){};ontimezone=function(t){};onevent=function(t){};process(t){"string"==typeof t&&(t=u(t)),t instanceof _t||(t=new _t(t));let e,i=t.getAllSubcomponents(),r=0,n=i.length;for(;r<n;r++)switch(e=i[r],e.name){case"vtimezone":if(this.parseTimezone){let t=e.getFirstPropertyValue("tzid");t&&this.ontimezone(new m({tzid:t,component:e}));}break;case"vevent":this.parseEvent&&this.onevent(new Dt(e));break;default:continue}this.oncomplete();}},Duration:r,Event:Dt,Period:s,Property:yt,Recur:L,RecurExpansion:gt,RecurIterator:x,Time:a,Timezone:m,TimezoneService:p,UtcOffset:w,VCardTime:C,parse:u,stringify:pt,design:ct,helpers:E};

module.exports = {
	// PostalMime,
	CssSelector,
	DOMPurify: purify,
	ICAL: Yt,
};
