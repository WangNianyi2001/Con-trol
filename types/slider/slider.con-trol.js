{
	'use strict';

	const attribAccessor = key => ({
		get() { return this.getAttribute(key); },
		set(value) {
			this.setAttribute(key, value);
			return value;
		},
	});
	const getStyleInPixels = ($, name) => +(window.getComputedStyle($).getPropertyValue(name).slice(0, -2));

	// ==== Helper functions above ==== //

	const Control = window.Control;

	const fireEvent = function(name) {
		this.dispatchEvent(new CustomEvent(name, { detail: {
			value: this.value
		} }));
	}

	function directlyChange(value, ratio, fire = true) {
		this.setAttribute('value', value);
		this.style.setProperty('--ratio', ratio);
		fire && fireEvent.call(this, 'change');
	}
	function changeByRatio(ratio) {
		const min = +this.min, max = +this.max, step = +this.step;
		const clipped_ratio = Math.min(Math.max(ratio, 0), 1);
		if(+this.step === 0) {
			const value = min + (max - min) * clipped_ratio;
			return directlyChange.call(this, value, clipped_ratio);
		}
		const interval_ordinal = Math.round((max - min) * clipped_ratio / step);
		const computed_value = min + interval_ordinal * step;
		const computed_ratio = (computed_value - min) / (max - min);
		directlyChange.call(this, computed_value, computed_ratio);
	}
	function changeByValue(value) {
		const max = +this.max, min = +this.min;
		changeByRatio.call(this, (+value - min) / (max - min));
	}

	function initDOM() {
		this.setAttribute("role", "slider");
		const $track = this.$track = document.createElement('div');
		$track.setAttribute('con-role', 'track');
		this.appendChild($track);
		const $handle = this.$handle = document.createElement('div');
		$handle.setAttribute('con-role', 'handle');
		$handle.setAttribute('tabindex', '0');
		this.appendChild($handle);
	}
	function initAttrib() {
		this.min = this.hasAttribute('min') ? this.min : 0;
		this.max = this.hasAttribute('max') ? this.max : this.min + 100;
		this.step = this.hasAttribute('step') ? (
			_ => isNaN(_) || +_ === 0 ? 0 : +_
		)(this.step) : 0;
		if(!this.hasAttribute('value')) {
			const value = +this.value, max = +this.max, min = +this.min;
			directlyChange.call(this, value, (value - min) / (max - min), false);
		}
	}
	function changeByMouse(event) {
		const
			selfX = this.offsetLeft,
			clickX = event.clientX,
			offsetX = ['left', 'padding-left', 'border-left-width'].reduce(
			(sum, name) => sum + getStyleInPixels(this.$track, name), 0
		);
		changeByRatio.call(this, (clickX - offsetX - selfX) / getStyleInPixels(this.$track, 'width'));
	}
	function registerEvent() {
		this.$handle.addEventListener('mousedown', () => {
			fireEvent.call(this, 'start');
			const mouseMoveHandler = event => {
				changeByMouse.call(this, event);
				fireEvent.call(this, 'slide');
			};
			document.documentElement.addEventListener('mousemove', mouseMoveHandler);
			document.documentElement.addEventListener(
				'mouseup',
				() => {
					document.documentElement.removeEventListener('mousemove', mouseMoveHandler);
					fireEvent.call(this, 'set');
				},
				{ once: true }
			);
		});
		this.$track.addEventListener('click', event => {
			fireEvent.call(this, 'start');
			this.$handle.focus();
			changeByMouse.call(this, event);
			fireEvent.call(this, 'jump');
			fireEvent.call(this, 'set');
		});
		this.$handle.addEventListener('keydown', event => {
			let delta = +this.step || 1;
			switch(event.keyCode) {
				default:
					return;
				case 37:	// left
				case 40:	// down
					delta *= -1;
				case 39:	// right
				case 38:	// up
			}
			if(!event.repeat)
				fireEvent.call(this, 'start');
			changeByValue.call(this, this.value + delta);
			fireEvent.call(this, 'slide');
			fireEvent.call(this, 'jump');
		});
		this.$handle.addEventListener('keyup', event => {
			if(event.keyCode >= 37 && event.keyCode <= 40)
				fireEvent.call(this, 'set');
		});
	}
	function Slider() {
		initDOM.call(this);
		initAttrib.call(this);
		registerEvent.call(this);
	}
	Slider.prototype.__proto__ = Control.prototype;	// must assign explicitly
	Object.defineProperties(Slider.prototype, {
		min: attribAccessor('min'),
		max: attribAccessor('max'),
		step: attribAccessor('step'),
		value: {
			get() { return +this.getAttribute('value'); },
			set(value) {
				fireEvent.call(this, 'start');
				changeByValue.call(this, value);
				fireEvent.call(this, 'jump');
				fireEvent.call(this, 'set');
				return this.value;
			}
		}
	});

	Control.types.set('slider', Slider);

	// ==== CSS Injection below ==== //

	const $style = document.createElement('style');
	$style.appendChild(document.createTextNode(`
con-trol[type=slider] {
	--width: 7.5em;
	--height: 1em;
	--track-length: 7em;
	--track-width: 2px;
	--track-padding-ratio: 1;
	--track-border-width: 1px;
	--track-border-color: dimgray;
	--track-radius-ratio: 1;
	--track-background: darkgray;
	--handle-width: .6em;
	--handle-height: 1em;
	--handle-border-width: 1px;
	--handle-border-color: gray;
	--handle-radius-ratio: .2;
	--handle-background: white;
}
/* Default visual preferences above, can be custom-defined */
con-trol[type=slider] {
	--ratio: 0;
	--track-padding: calc(var(--track-width) * var(--track-padding-ratio) / 2);
	--track-border-radius: calc((var(--track-width) / 2 + var(--track-border-width)) * var(--track-radius-ratio));
	--handle-border-radius: calc(var(--handle-radius-ratio) * min(var(--handle-width), var(--handle-height)) + var(--handle-border-width));
	position: relative;
	display: inline-block;
	width: var(--width);
	height: var(--height);
	line-height: var(--height);
}
con-trol[type=slider] [con-role=track] {
	position: relative;
	left: calc((var(--width) - var(--track-length)) / 2 - var(--track-padding) - var(--track-border-width));
	top: calc((var(--height) - var(--track-width)) / 2 - var(--track-border-width));
	padding: 0 var(--track-padding);
	width: calc(var(--track-length));
	height: calc(var(--track-width));
	border: var(--track-border-width) solid var(--track-border-color);
	border-radius: var(--track-border-radius);
	background: var(--track-background);
	cursor: pointer;
}
con-trol[type=slider] [con-role=handle] {
	--left-offset: calc((var(--width) - var(--track-length) - var(--handle-width)) / 2 - var(--handle-border-width));
	--top-offset: calc((var(--height) - var(--handle-height)) / 2 - var(--handle-border-width));
	position: absolute;
	left: calc(var(--left-offset) + var(--track-length) * var(--ratio));
	top: calc(var(--top-offset));
	width: var(--handle-width);
	height: var(--handle-height);
	border: var(--handle-border-width) solid var(--handle-border-color);
	border-radius: var(--handle-border-radius);
	background: var(--handle-background);
	cursor: pointer;
}
	`.trim()));
	document.head.insertAdjacentElement('afterbegin', $style);
}