import AppController from '../controller/controller';
import { AppView } from '../view/appView';

const LAST_SELECTED_SOURCE_KEY = 'news-api-last-selected-source';

class App {
    private controller: AppController;
    private view: AppView;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    public start(): void {
        const sourcesContainer = document.querySelector('.sources');
        const sourcesPanel = document.querySelector('.source-sidebar');
        const sourceSearch = document.querySelector('.source-search');
        const clearSearchButton = document.querySelector('.source-search-clear');

        if (
            !(sourcesContainer instanceof HTMLElement) ||
            !(sourcesPanel instanceof HTMLElement) ||
            !(sourceSearch instanceof HTMLInputElement) ||
            !(clearSearchButton instanceof HTMLButtonElement)
        ) {
            throw new Error('Source controls are missing');
        }

        const mobileLayout = window.matchMedia('(max-width: 959px)');
        const updateSourcesLayout = (): void => {
            const isExpanded = !mobileLayout.matches || document.activeElement === sourceSearch;
            sourcesContainer.hidden = !isExpanded;
            sourceSearch.setAttribute('aria-expanded', String(isExpanded));
        };
        const expandSourcesOnMobile = (): void => {
            if (mobileLayout.matches) {
                sourcesContainer.hidden = false;
                sourceSearch.setAttribute('aria-expanded', 'true');
            }
        };
        const collapseSourcesOnMobile = (): void => {
            sourcesContainer.hidden = true;
            sourceSearch.setAttribute('aria-expanded', 'false');
        };
        document.addEventListener('pointerdown', (event) => {
            if (
                !mobileLayout.matches ||
                sourcesContainer.hidden ||
                !(event.target instanceof Node) ||
                sourcesPanel.contains(event.target)
            ) {
                return;
            }

            collapseSourcesOnMobile();
            sourceSearch.blur();
        });

        updateSourcesLayout();
        mobileLayout.addEventListener('change', updateSourcesLayout);
        sourceSearch.addEventListener('focus', expandSourcesOnMobile);
        sourceSearch.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mobileLayout.matches) {
                event.preventDefault();
                collapseSourcesOnMobile();
                sourceSearch.blur();
            }
        });

        sourcesContainer.addEventListener('click', (event) => {
            const sourceButton = event.target instanceof Element ? event.target.closest('.source__item') : null;
            const sourceId = sourceButton?.getAttribute('data-source-id');

            this.controller.getNews(event, (data) => this.view.drawNews(data));

            if (sourceId) {
                try {
                    window.localStorage.setItem(LAST_SELECTED_SOURCE_KEY, sourceId);
                } catch {
                    // Storage may be unavailable; source selection remains usable.
                }
            }

            if (mobileLayout.matches && sourceButton) {
                collapseSourcesOnMobile();
                sourceSearch.blur();
            }
        });

        const filterSources = (): void => {
            const query = sourceSearch.value.trim().toLowerCase();
            const sourceButtons = sourcesContainer.querySelectorAll<HTMLButtonElement>('.source__item');

            sourceButtons.forEach((sourceButton) => {
                sourceButton.hidden = !sourceButton.textContent?.toLowerCase().includes(query);
            });
        };

        sourceSearch.addEventListener('input', () => {
            expandSourcesOnMobile();
            clearSearchButton.hidden = sourceSearch.value.length === 0;
            filterSources();
        });

        clearSearchButton.addEventListener('click', () => {
            sourceSearch.value = '';
            clearSearchButton.hidden = true;
            filterSources();
            sourceSearch.focus();
        });

        this.controller.getSources((data) => {
            this.view.drawSources(data);

            const sourceButtons = Array.from(sourcesContainer.querySelectorAll<HTMLButtonElement>('.source__item'));
            let storedSourceId: string | null = null;

            try {
                storedSourceId = window.localStorage.getItem(LAST_SELECTED_SOURCE_KEY);
            } catch {
                // Storage may be unavailable; use the default source.
            }

            const sourceToRestore =
                sourceButtons.find((button) => button.getAttribute('data-source-id') === storedSourceId) ??
                sourceButtons.find((button) => button.getAttribute('data-source-id') === 'bbc-news') ??
                sourceButtons[0];
            const sourceId = sourceToRestore?.getAttribute('data-source-id');

            if (sourceId) {
                this.controller.getNewsForSource(sourceId, sourcesContainer, (newsData) =>
                    this.view.drawNews(newsData)
                );
            }
        });
    }
}

export default App;
