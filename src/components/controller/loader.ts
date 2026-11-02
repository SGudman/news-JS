type QueryOptions = Record<string, string>;
type ResponseCallback<T> = (data: T) => void;

interface RequestOptions {
    endpoint: string;
    options?: QueryOptions;
}

class Loader {
    private baseLink: string;
    private options: QueryOptions;

    constructor(baseLink: string, options: QueryOptions) {
        this.baseLink = baseLink;
        this.options = options;
    }

    public getResp<T>(
        { endpoint, options = {} }: RequestOptions,
        callback: ResponseCallback<T> = () => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load<T>('GET', endpoint, callback, options);
    }

    private errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === 401 || res.status === 404)
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            throw Error(res.statusText);
        }

        return res;
    }

    private makeUrl(options: QueryOptions, endpoint: string): string {
        const urlOptions = { ...this.options, ...options };
        let url = `${this.baseLink}${endpoint}?`;

        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${urlOptions[key]}&`;
        });

        return url.slice(0, -1);
    }

    private load<T>(method: string, endpoint: string, callback: ResponseCallback<T>, options: QueryOptions = {}): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then(this.errorHandler)
            .then((res): Promise<unknown> => res.json())
            .then((data: unknown) => callback(data as T))
            .catch((err: unknown) => console.error(err));
    }
}

export default Loader;
