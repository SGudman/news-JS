import './news.css';
import type { NewsArticle } from '../../../types/api';

class News {
    public draw(data: NewsArticle[]): void {
        const news = data.length >= 10 ? data.filter((_item, idx) => idx < 10) : data;

        const fragment = document.createDocumentFragment();
        const newsItemTemp = document.querySelector('#newsItemTemp');
        const newsContainer = document.querySelector('.news');

        if (!(newsItemTemp instanceof HTMLTemplateElement) || !newsContainer) {
            throw new Error('News template or container is missing');
        }

        news.forEach((item, idx) => {
            const newsClone = newsItemTemp.content.cloneNode(true);

            if (!(newsClone instanceof DocumentFragment)) {
                throw new Error('News template clone is not a document fragment');
            }

            const newsItem = newsClone.querySelector('.news__item');
            const photo = newsClone.querySelector('.news__meta-photo');
            const author = newsClone.querySelector('.news__meta-author');
            const date = newsClone.querySelector('.news__meta-date');
            const title = newsClone.querySelector('.news__description-title');
            const source = newsClone.querySelector('.news__description-source');
            const content = newsClone.querySelector('.news__description-content');
            const link = newsClone.querySelector('.news__read-more a');

            if (
                !newsItem ||
                !(photo instanceof HTMLElement) ||
                !author ||
                !date ||
                !title ||
                !source ||
                !content ||
                !link
            ) {
                throw new Error('News item markup is missing');
            }

            if (idx % 2) newsItem.classList.add('alt');

            photo.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
            author.textContent = item.author || item.source.name;
            date.textContent = item.publishedAt.slice(0, 10).split('-').reverse().join('-');

            title.textContent = item.title;
            source.textContent = item.source.name;
            content.textContent = item.description;
            link.setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        newsContainer.innerHTML = '';
        newsContainer.appendChild(fragment);
    }
}

export default News;
