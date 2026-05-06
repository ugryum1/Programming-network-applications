class Ajax {
    async get(url) {
        return this._send('GET', url);
    }

    async post(url, data) {
        return this._send('POST', url, data);
    }

    async patch(url, data) {
        return this._send('PATCH', url, data);
    }

    async delete(url) {
        return this._send('DELETE', url);
    }

    async _send(method, url, data) {
        const options = {method, headers: {}};
        if (data !== undefined && data !== null) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        const text = await response.text();
        const payload = text ? JSON.parse(text) : null;

        return {data: payload, status: response.status, ok: response.ok};
    }
}

export const ajax = new Ajax();
