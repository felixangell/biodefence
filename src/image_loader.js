let imageCache = new Map();

function loadResource(filename) {
    return new Promise((resolve, reject) => {
        let res = new Image();
        res.src = `${window.location.protocol}//${window.location.host}/res/${filename}`;
        console.log('Loading resource ', res.src);
        res.onload = () => {
            console.log('Loaded', filename);
            imageCache.set(filename, res);
            return resolve(res);
        };
        res.onerror = (err) => {
            return reject(err);
        }
    });
}

// loadImage, will look in the res folder,
// so to reference res/file.png, you would
// simply pass 'file.png' as the filename param.
function getResource(filename, loaded) {
    if (imageCache.has(filename)) {
        const image = imageCache.get(filename);
        if (loaded) loaded(image);
        return image;
    }
    alert(`no such image ${filename}`);
}

export { loadResource };
export default getResource;