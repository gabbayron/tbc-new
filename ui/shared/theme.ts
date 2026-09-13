export type Theme = 'dark' | 'light';

// Keep presentation preferences separate from the simulator's saved settings.
const THEME_STORAGE_KEY = '__tbc_new_theme';

function readTheme(): Theme {
	try {
		return window.localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
	} catch {
		return 'dark';
	}
}

function updateToggle(button: HTMLButtonElement, theme: Theme) {
	const nextTheme = theme === 'dark' ? 'light' : 'dark';
	const label = nextTheme === 'light' ? 'Switch to light theme' : 'Switch to dark theme';
	button.setAttribute('aria-label', label);
	button.setAttribute('title', label);
	button.setAttribute('aria-pressed', String(theme === 'light'));
	const text = button.querySelector('.theme-toggle-label');
	if (text) text.textContent = nextTheme === 'light' ? 'Light mode' : 'Dark mode';
}

export function applyTheme(theme: Theme) {
	document.documentElement.dataset.theme = theme;
	document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach(button => updateToggle(button, theme));
	window.dispatchEvent(new CustomEvent('wowsims:themechange', { detail: theme }));
}

export function initializeTheme() {
	applyTheme(readTheme());
}

export function bindThemeToggle(button: HTMLButtonElement) {
	if (button.dataset.themeBound) return;
	button.dataset.themeBound = 'true';
	updateToggle(button, document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
	button.addEventListener('click', () => {
		const theme: Theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
		try {
			window.localStorage.setItem(THEME_STORAGE_KEY, theme);
		} catch {
			// The toggle still works when storage is unavailable.
		}
		applyTheme(theme);
	});
}
