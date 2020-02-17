{
	'use strict';

	window.Control = class Control extends HTMLElement {
		constructor() {
			super();
			const typename = this.getAttribute('type');
			if(!Control.types.has(typename)) {
				return;
			}
			const type = Control.types.get(typename);
			this.__proto__ = type.prototype;
			Function.prototype.call.call(type, this);
		}
	};
	Control.types = new Map();
	
	document.addEventListener('DOMContentLoaded', () => customElements.define('con-trol', Control));
}