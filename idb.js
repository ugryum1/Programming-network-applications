function openConveyorDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ConveyorGalleryDB", 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("conveyors")) {
                db.createObjectStore("conveyors", {keyPath: "id", autoIncrement: true});
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function addConveyorToDB(conveyor) {
    return openConveyorDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction("conveyors", "readwrite");
        const req = tx.objectStore("conveyors").add(conveyor);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    }));
}

function getAllConveyorsFromDB() {
    return openConveyorDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction("conveyors", "readonly");
        const req = tx.objectStore("conveyors").getAll();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    }));
}

function getConveyorByIdFromDB(id) {
    return openConveyorDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction("conveyors", "readonly");
        const req = tx.objectStore("conveyors").get(Number(id));
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    }));
}

function deleteConveyorFromDB(id) {
    return openConveyorDB().then(db => new Promise((resolve, reject) => {
        const tx = db.transaction("conveyors", "readwrite");
        const req = tx.objectStore("conveyors").delete(Number(id));
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    }));
}
