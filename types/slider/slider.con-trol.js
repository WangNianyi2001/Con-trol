{
	'use strict';

	const Control = window.Control;

	function initDOM() {
		// the slider itself
		this.setAttribute('role', 'slider');
		const setCSSVarByAttr = (attr, css) =>
			this.hasAttribute(attr) && this.style.setProperty('--' + css, this.getAttribute(attr));
		setCSSVarByAttr('value', 'ratio');
		setCSSVarByAttr('left', 'left');
		setCSSVarByAttr('right', 'right');
		// track
		const $track = document.createElement('div');
		$track.setAttribute('con-role', 'track');
			const $highlight = document.createElement('div');
			$highlight.setAttribute('con-role', 'highlight');
			$track.appendChild($highlight);
		this.appendChild($track);
		// handle
		const [$handle, $sub_handle] = [0, 0].map(() => {
			const $ = document.createElement('div');
			$.setAttribute('con-role', 'handle');
			$.setAttribute('tabindex', '0');	// make the handle focusable
			this.appendChild($);
			return $;
		});
		// anchors
		const $anchors = document.createElement('div');
		$anchors.setAttribute('con-role', 'anchors');
		if(this.hasAttribute('anchors')) {
			this.getAttribute('anchors')
				.replace(/\s/g, '')
				.split(',')
				.forEach(position => {
					const $anchor = document.createElement('div');
					$anchor.setAttribute('con-role', 'anchor');
					$anchor.style.setProperty('--ratio', position);
					$anchors.appendChild($anchor);
				});
		}
		$track.appendChild($anchors);
	}
	function Slider() {
		initDOM.call(this);
	}
	Slider.prototype = {
		__proto__: Control.prototype,
	};
	Object.defineProperties(Slider.prototype, {});

	Control.types.set('slider', Slider);
}