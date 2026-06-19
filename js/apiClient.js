(function (window) {
    const config = window.FreeMovieConfig || {};
    const directSameOriginPaths = [/^\/[^/]/, /^\.\.?\//];

    function proxify(url) {
        return `${config.proxyBaseUrl}?url=${encodeURIComponent(url)}`;
    }

    function shouldProxy(url) {
        if (!url || directSameOriginPaths.some(pattern => pattern.test(url))) {
            return false;
        }

        try {
            const parsedUrl = new URL(url, window.location.href);
            return parsedUrl.origin !== window.location.origin;
        } catch (error) {
            return false;
        }
    }

    async function fetchWithTimeout(url, options = {}) {
        const timeoutMs = options.timeoutMs || config.requestTimeoutMs || 12000;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const { timeoutMs: _timeoutMs, ...fetchOptions } = options;

        try {
            return await fetch(url, {
                ...fetchOptions,
                signal: fetchOptions.signal || controller.signal
            });
        } finally {
            clearTimeout(timer);
        }
    }

    async function request(url, options = {}) {
        const retries = Number.isInteger(options.retries) ? options.retries : (config.requestRetries || 0);
        const finalUrl = shouldProxy(url) ? proxify(url) : url;
        let lastError;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await fetchWithTimeout(finalUrl, options);
                if (!response.ok && response.status >= 500 && attempt < retries) {
                    continue;
                }
                return response;
            } catch (error) {
                lastError = error;
                if (attempt >= retries) {
                    break;
                }
            }
        }

        throw lastError || new Error('Request failed.');
    }

    async function json(url, options = {}) {
        const response = await request(url, options);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    }

    window.FreeMovieApi = {
        proxify,
        request,
        json,
        tmdbUrl(path, params = {}) {
            const searchParams = new URLSearchParams({
                api_key: config.tmdbApiKey,
                language: config.defaultLanguage,
                ...params
            });

            return `https://api.themoviedb.org/3/${path.replace(/^\/+/, '')}?${searchParams.toString()}`;
        }
    };
})(window);
