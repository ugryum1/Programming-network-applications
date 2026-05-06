class StockUrls {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    getStocks(query = {}) {
        const params = new URLSearchParams(query).toString();
        return params
            ? `${this.baseUrl}/stocks?${params}`
            : `${this.baseUrl}/stocks`;
    }

    getStockById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }

    createStock() {
        return `${this.baseUrl}/stocks`;
    }

    removeStockById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }

    updateStockById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }
}

export const stockUrls = new StockUrls();
