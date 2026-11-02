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
        const newsContainer = e.currentTarget;
        const target = e.target;

        if (!(newsContainer instanceof Element) || !(target instanceof Element)) {
            return;
        }

        let sourceElement: Element | null = target;

        while (sourceElement && sourceElement !== newsContainer) {
            if (sourceElement.classList.contains('source__item')) {
                const sourceId = sourceElement.getAttribute('data-source-id');
                if (!sourceId) {
                    return;
                }
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
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
                return;
            }
            sourceElement = sourceElement.parentElement;
        }
    }
}

export default AppController;
