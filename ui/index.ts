/// <reference types="vite/client" />
import '@fontsource-variable/inter';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './shared/bootstrap_overrides';

import * as Popper from '@popperjs/core';
import { Dropdown, Modal, Tab } from 'bootstrap';
import { Chart, registerables } from 'chart.js';
import tippy from 'tippy.js';
import { bindThemeToggle, initializeTheme } from './shared/theme';

declare global {
	interface Window {
		Popper: any;
		bootstrap: any;
	}
}

Chart.register(...registerables);

function syncChartTheme() {
	const light = document.documentElement.dataset.theme === 'light';
	Chart.defaults.color = light ? '#18222c' : '#f4f1e8';
	Chart.defaults.borderColor = light ? '#c6cdd0' : '#39424d';
	Object.values(Chart.instances).forEach(chart => chart.update('none'));
}

initializeTheme();
syncChartTheme();
window.addEventListener('wowsims:themechange', syncChartTheme);

tippy.setDefaultProps({ arrow: false, allowHTML: true });
window.Popper = Popper;
window.bootstrap = { Dropdown, Modal, Tab };

// Force scroll to top when refreshing
if (history.scrollRestoration) {
	history.scrollRestoration = 'manual';
} else {
	window.onbeforeunload = function () {
		window.scrollTo(0, 0);
	};
}

function docReady(fn: any) {
	// see if DOM is already available
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		// call on next available tick
		setTimeout(fn, 1);
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
}

docReady(function () {
	document.body.classList.add('ready');
	document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach(bindThemeToggle);
});
