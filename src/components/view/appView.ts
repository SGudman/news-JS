import News from './news/news';
import Sources from './sources/sources';
import type { NewsResponse, SourcesResponse } from '../../types/api';

export class AppView {
    private news: News;
    private sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    public drawNews(data?: Partial<Pick<NewsResponse, 'articles'>> | null): void {
        const values = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    public drawSources(data?: Partial<Pick<SourcesResponse, 'sources'>> | null): void {
        const values = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
