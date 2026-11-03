import AppLoader from './appLoader';
import type { NewsResponse, SourcesResponse } from '../../types/api';

enum Endpoint {
    Sources = 'sources',
    Everything = 'everything',
}

class AppController extends AppLoader {
    public getSources(callback: (data: SourcesResponse) => void): void {
        super.getResp<SourcesResponse>(
            {
                endpoint: Endpoint.Sources,
            },
            callback
        );
    }

    public getNews(e: MouseEvent, callback: (data: NewsResponse) => void): void {
        const sourcesContainer = e.currentTarget;
        const target = e.target;

        if (!(sourcesContainer instanceof Element) || !(target instanceof Element)) {
            return;
        }

        let sourceElement: Element | null = target;

        while (sourceElement && sourceElement !== sourcesContainer) {
            if (sourceElement.classList.contains('source__item')) {
                const sourceId = sourceElement.getAttribute('data-source-id');
                if (sourceId) {
                    this.getNewsForSource(sourceId, sourcesContainer, callback);
                }
                return;
            }
            sourceElement = sourceElement.parentElement;
        }
    }

    public getNewsForSource(sourceId: string, sourcesContainer: Element, callback: (data: NewsResponse) => void): void {
        const sourceElement = Array.from(sourcesContainer.querySelectorAll('.source__item')).find(
            (item) => item.getAttribute('data-source-id') === sourceId
        );

        if (!sourceElement || sourcesContainer.getAttribute('data-source') === sourceId) {
            return;
        }

        sourcesContainer.setAttribute('data-source', sourceId);
        sourcesContainer.querySelector('[aria-pressed="true"]')?.setAttribute('aria-pressed', 'false');
        sourceElement.setAttribute('aria-pressed', 'true');
        super.getResp<NewsResponse>(
            {
                endpoint: Endpoint.Everything,
                options: {
                    sources: sourceId,
                },
            },
            callback
        );
    }
}

export default AppController;
