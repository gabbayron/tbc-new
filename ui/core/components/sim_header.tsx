import clsx from 'clsx';
import tippy, { ReferenceElement as TippyReferenceElement } from 'tippy.js';
import { ref } from 'tsx-vanilla';

import i18n from '../../i18n/config';
import { bindThemeToggle } from '../../shared/theme';
import { trackPageView } from '../../tracking/utils';
import { REPO_CHOOSE_NEW_ISSUE_URL, REPO_RELEASES_URL } from '../constants/other';
import { SimUI } from '../sim_ui';
import { isLocal, noop } from '../utils';
import { Component } from './component';
import { Exporter } from './exporter';
import { SimToolbarItem } from './header/sim_toolbar_item';
import { Importer } from './importer';
import { SettingsMenu } from './settings_menu';
import { SimTab } from './sim_tab';
import { SocialLinks } from './social_links';

interface ToolbarLinkArgs {
	parent: HTMLElement;
	href?: string;
	text?: string;
	icon?: string;
	tooltip?: string | HTMLElement;
	classes?: string;
	onclick?: () => void;
}

export class SimHeader extends Component {
	private simUI: SimUI;

	private simTabsContainer: HTMLElement;
	private mobileNav: HTMLSelectElement;
	private simToolbar: HTMLElement;
	private knownIssuesLink: TippyReferenceElement<HTMLElement>;
	private knownIssuesContent: HTMLUListElement;

	constructor(parentElem: HTMLElement, simUI: SimUI) {
		super(parentElem, 'sim-header');
		this.simUI = simUI;
		this.simTabsContainer = this.rootElem.querySelector<HTMLElement>('.sim-tabs')!;
		this.mobileNav = this.rootElem.querySelector<HTMLSelectElement>('.workspace-mobile-select')!;
		this.simToolbar = this.rootElem.querySelector<HTMLElement>('.sim-toolbar')!;
		bindThemeToggle(this.rootElem.querySelector<HTMLButtonElement>('[data-theme-toggle]')!);
		this.mobileNav.addEventListener('change', () => {
			const tab = Array.from(this.simTabsContainer.querySelectorAll<HTMLButtonElement>('.nav-link[role="tab"]')).find(
				button => button.getAttribute('data-bs-target') === `#${this.mobileNav.value}`,
			);
			tab?.click();
		});
		this.simTabsContainer.addEventListener('shown.bs.tab', event => {
			const target = (event.target as HTMLElement).getAttribute('data-bs-target');
			if (target) this.mobileNav.value = target.slice(1);
		});

		this.knownIssuesContent = (<ul className="text-start ps-3 mb-0"></ul>) as HTMLUListElement;
		this.knownIssuesLink = this.addKnownIssuesLink();
		this.addBugReportLink();
		this.addDownloadBinaryLink();
		this.addSimOptionsLink();
		this.addSocialLinks();

		// Allow styling the sticky header
		new IntersectionObserver(([e]) => e.target.classList.toggle('stuck', e.intersectionRatio < 1), { threshold: [1] }).observe(this.rootElem);
	}

	activateTab(className: string) {
		(this.simTabsContainer.getElementsByClassName(className)[0] as HTMLElement).click();
	}

	addTab(title: string, contentId: string) {
		const isFirstTab = this.simTabsContainer.querySelector('.nav-item') == null;

		this.simTabsContainer.appendChild(
			<li
				className={`${contentId} nav-item`}
				attributes={{
					role: 'presentation',
					// @ts-expect-error
					'aria-controls': contentId,
				}}>
				<button
					className={`nav-link ${isFirstTab && 'active'}`}
					type="button"
					dataset={{
						bsToggle: 'tab',
						bsTarget: `#${contentId}`,
					}}
					attributes={{
						role: 'tab',
						'aria-selected': isFirstTab,
					}}>
					{title}
				</button>
			</li>,
		);
		this.organizeTabs();
		this.updateMobileNav();
	}

	addSimTabLink(tab: SimTab) {
		const isFirstTab = this.simTabsContainer.querySelector('.nav-item') == null;

		tab.navLink.setAttribute('aria-selected', isFirstTab.toString());

		if (isFirstTab) tab.navLink.classList.add('active', 'show');

		this.simTabsContainer.appendChild(tab.navItem);
		this.organizeTabs();
		this.updateMobileNav();
	}

	private organizeTabs() {
		const order = ['gear-tab', 'talents-tab', 'rotation-tab', 'settings-tab', 'detailed-results-tab-tab', 'bulk-tab'];
		const groupLabels: Record<string, string> = {
			'gear-tab': i18n.t('workspace.build'),
			'settings-tab': i18n.t('workspace.setup'),
			'detailed-results-tab-tab': i18n.t('workspace.results'),
			'bulk-tab': i18n.t('workspace.batch'),
		};
		this.simTabsContainer.querySelectorAll('.workspace-nav-label').forEach(label => label.remove());
		const items = Array.from(this.simTabsContainer.querySelectorAll<HTMLElement>('.nav-item'));
		items.sort((a, b) => order.indexOf(a.classList[0]) - order.indexOf(b.classList[0]));
		items.forEach(item => {
			const label = groupLabels[item.classList[0]];
			if (label) {
				const heading = document.createElement('li');
				heading.className = 'workspace-nav-label';
				heading.setAttribute('role', 'presentation');
				heading.textContent = label;
				this.simTabsContainer.appendChild(heading);
			}
			this.simTabsContainer.appendChild(item);
		});
	}

	private updateMobileNav() {
		const active = this.simTabsContainer.querySelector<HTMLButtonElement>('.nav-link.active');
		this.mobileNav.replaceChildren();
		this.simTabsContainer.querySelectorAll<HTMLButtonElement>('.nav-link[role="tab"]').forEach(button => {
			const id = button.getAttribute('data-bs-target')?.slice(1);
			if (id) this.mobileNav.add(new Option(button.textContent?.trim() || id, id));
		});
		if (active) this.mobileNav.value = active.getAttribute('data-bs-target')?.slice(1) || '';
	}

	addImportLink(label: string, importer: Importer, isUnsupported = false) {
		this.addImportExportLink('.import-dropdown', label, importer, isUnsupported);
	}
	addExportLink(label: string, exporter: Exporter, isUnsupported = false) {
		this.addImportExportLink('.export-dropdown', label, exporter, isUnsupported);
	}
	private addImportExportLink(cssClass: string, label: string, importerExporter: Importer | Exporter, isUnsupported?: boolean) {
		const dropdownElem = this.rootElem.querySelector<HTMLElement>(cssClass)!;
		const menuElem = dropdownElem.querySelector<HTMLElement>('.dropdown-menu')!;
		const buttonRef = ref<HTMLButtonElement>();

		menuElem.appendChild(
			<li>
				<button ref={buttonRef} className={clsx('dropdown-item', isUnsupported && 'disabled')}>
					{label}
				</button>
			</li>,
		);
		if (buttonRef.value) {
			if (isUnsupported) {
				tippy(buttonRef.value, { content: 'Currently unsupported' });
				return;
			}
			buttonRef.value.addEventListener('click', () => importerExporter.open());
		}
	}

	private addToolbarLink({ parent, tooltip, classes, onclick, text, ...itemArgs }: ToolbarLinkArgs): HTMLElement {
		const itemRef = ref<HTMLAnchorElement>();
		parent.appendChild(
			<SimToolbarItem linkRef={itemRef} buttonClassName={classes} {...itemArgs}>
				{text}
			</SimToolbarItem>,
		);

		if (onclick) itemRef.value!.addEventListener('click', onclick);
		if (tooltip)
			tippy(itemRef.value!, {
				content: tooltip,
				placement: 'bottom',
			});
		return itemRef.value!;
	}

	private addKnownIssuesLink() {
		return this.addToolbarLink({
			parent: this.simToolbar,
			text: i18n.t('info.known_issues'),
			tooltip: this.knownIssuesContent,
			classes: 'known-issues link-danger hide',
		});
	}

	addKnownIssue(issue: string) {
		const listItem = (<li></li>) as HTMLLIElement;
		// Using innerHTML here because the issue text can contain stringified HTML
		listItem.innerHTML = issue;
		this.knownIssuesContent.appendChild(listItem);

		this.knownIssuesLink.classList.remove('hide');
		this.knownIssuesLink._tippy?.setContent(this.knownIssuesContent);
	}

	private addBugReportLink() {
		this.addToolbarLink({
			href: REPO_CHOOSE_NEW_ISSUE_URL,
			parent: this.simToolbar,
			icon: 'fas fa-bug fa-lg',
			tooltip: i18n.t('info.bug_report'),
		});
	}

	private addDownloadBinaryLink() {
		const href = REPO_RELEASES_URL;
		const icon = 'fas fa-gauge-high fa-lg';
		const parent = this.simToolbar;

		if (isLocal()) {
			fetch('/version')
				.then(resp => {
					resp.json()
						.then(versionInfo => {
							if (versionInfo.outdated == 2) {
								this.addToolbarLink({
									href: href,
									parent: parent,
									icon: icon,
									tooltip: 'Newer version of simulator available for download',
									classes: 'downbin link-danger',
								});
							}
						})
						.catch(_error => {
							console.warn('No version info found!');
						});
				})
				.catch(noop);
		} else {
			this.addToolbarLink({
				href: href,
				parent: parent,
				icon: icon,
				tooltip: 'Download simulator for faster simulating',
				classes: 'downbin',
			});
		}
	}

	private addSimOptionsLink() {
		const settingsMenu = new SettingsMenu(this.simUI.rootElem, this.simUI);
		this.addToolbarLink({
			parent: this.simToolbar,
			icon: 'fas fa-cog fa-lg',
			tooltip: i18n.t('info.sim_options'),
			classes: 'sim-options',
			onclick: () => {
				trackPageView('Options', '/settings-menu');
				settingsMenu.open();
			},
		});
	}

	private addSocialLinks() {
		const container = (<div className="sim-toolbar-socials" />) as HTMLElement;
		this.simToolbar.appendChild(container);

		this.addDiscordLink(container);
		this.addGitHubLink(container);
		this.addPatreonLink(container);
	}

	private addDiscordLink(container: HTMLElement) {
		container.appendChild(<SimToolbarItem>{SocialLinks.buildDiscordLink()}</SimToolbarItem>);
	}

	private addGitHubLink(container: HTMLElement) {
		container.appendChild(<SimToolbarItem>{SocialLinks.buildGitHubLink()}</SimToolbarItem>);
	}

	private addPatreonLink(container: HTMLElement) {
		container.appendChild(<SimToolbarItem>{SocialLinks.buildPatreonLink()}</SimToolbarItem>);
	}

	protected customRootElement(): HTMLElement {
		return (
			<header className="sim-header">
				<div className="sim-header-container">
					<div className="workspace-header-top">
						<div className="workspace-heading">
							<span>{i18n.t('workspace.subtitle')}</span>
							<strong>{i18n.t('workspace.title')}</strong>
						</div>
						<div className="workspace-utilities">
							<div className="import-export nav">
								<div className="dropdown sim-dropdown-menu import-dropdown">
									<button
										className="import-link"
										type="button"
										attributes={{ 'aria-expanded': 'false' }}
										dataset={{ bsToggle: 'dropdown', bsDisplay: 'dynamic' }}>
										<i className="fa fa-download"></i> {i18n.t('import.title')}
									</button>
									<ul className="dropdown-menu"></ul>
								</div>
								<div className="dropdown sim-dropdown-menu export-dropdown">
									<button
										className="export-link"
										type="button"
										attributes={{ 'aria-expanded': 'false' }}
										dataset={{ bsToggle: 'dropdown', bsDisplay: 'dynamic' }}>
										<i className="fa fa-right-from-bracket"></i> {i18n.t('export.title')}
									</button>
									<ul className="dropdown-menu"></ul>
								</div>
							</div>
							<button className="theme-toggle" type="button" dataset={{ themeToggle: '' }}>
								<i className="fa-regular fa-sun theme-icon-light" attributes={{ 'aria-hidden': 'true' }} />
								<i className="fa-regular fa-moon theme-icon-dark" attributes={{ 'aria-hidden': 'true' }} />
								<span className="theme-toggle-label" />
							</button>
							<div className="sim-toolbar nav"></div>
						</div>
					</div>
					<div className="workspace-navigation">
						<ul className="sim-tabs nav nav-tabs" attributes={{ role: 'tablist' }}></ul>
						<label className="workspace-mobile-nav">
							<span>{i18n.t('workspace.navigate')}</span>
							<select className="workspace-mobile-select form-select" />
						</label>
					</div>
				</div>
			</header>
		) as HTMLElement;
	}
}
