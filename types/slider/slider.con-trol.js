{
	'use strict';

	const Control = window.Control;

	function placeAnchors() {
		const _ = this.components.anchors = [];
		if(!this.hasAttribute('anchors'))
			return;
		this.getAttribute('anchors')
			.replace(/\s/g, '')
			.split(',')
			.forEach(position => {
				const $ = document.createElement('div');
				_.push($);
				$.setAttribute('con-role', 'anchor');
				$.style.setProperty('--ratio', position);
				this.components.$anchors.appendChild($);
			});
	}
	function initDOM() {
		const _ = this.components;
		// the slider itself
		this.setAttribute('role', 'slider');
		['ratio', 'left', 'right'].map(
			attr => this.hasAttribute(attr) &&
				this.style.setProperty('--' + attr, this.getAttribute(attr))
		);
		// track
		this.appendChild(_.$track = document.createElement('div'));
		_.$track.setAttribute('con-role', 'track');
		// highlight
		_.$track.appendChild(_.$highlight = document.createElement('div'));
		_.$highlight.setAttribute('con-role', 'highlight');
		// handle
		[_.$handle, _.$sub_handle] = [0, 0].map(() => {
			const $ = document.createElement('div');
			$.setAttribute('con-role', 'handle');
			$.setAttribute('tabindex', '0');	// make the handle focusable
			this.appendChild($);
			return $;
		});
		// anchors
		_.$track.appendChild(_.$anchors = document.createElement('div'));
		_.$anchors.setAttribute('con-role', 'anchors');
		placeAnchors.call(this);
	}
	function Slider() {
		this.components = {};
		initDOM.call(this);
	}
	Slider.prototype = {
		__proto__: Control.prototype,
	};
	Object.defineProperties(Slider.prototype, {});

	Control.types.set('slider', Slider);
}