import './sources.css';
import type { NewsSource } from '../../../types/api';

type SourceItem = Readonly<Pick<NewsSource, 'id' | 'name'>>;

class Sources {
    public draw(data: readonly SourceItem[]): void {
        const sourceItemTemp = document.querySelector('#sourceItemTemp');
        const sourcesContainer = document.querySelector('.sources');

        if (!(sourceItemTemp instanceof HTMLTemplateElement) || !(sourcesContainer instanceof HTMLElement)) {
            throw new Error('Sources template or container is missing');
        }

        const fragment = document.createDocumentFragment();

        const sortedData = [...data].sort((first, second) => first.name.localeCompare(second.name));

        sortedData.forEach((item) => {
            const sourceClone = sourceItemTemp.content.cloneNode(true);

            if (!(sourceClone instanceof DocumentFragment)) {
                throw new Error('Sources template clone is not a document fragment');
            }

            const sourceName = sourceClone.querySelector('.source__item-name');
            const sourceItem = sourceClone.querySelector('.source__item');

            if (!sourceName || !sourceItem) {
                throw new Error('Source item markup is missing');
            }

            sourceName.textContent = item.name;
            sourceItem.setAttribute('data-source-id', item.id);
            fragment.append(sourceClone);
        });

        sourcesContainer.replaceChildren(fragment);
    }
}

export default Sources;
