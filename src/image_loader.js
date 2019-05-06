let imageCache = new Map();

// loadImage, will look in the res folder,
// so to reference res/file.png, you would
// simply pass 'file.png' as the filename param.
function getResource(filename, loaded) {
    if (imageCache.has(filename)) {
        const image = imageCache.get(filename);
        if (loaded) loaded(image);
        return image;
    }
    
    let res = new Image();
    res.src = `${window.location.protocol}//${window.location.host}/res/${filename}`;
    console.log('Loading resource ', res.src);

    res.onload = () => {
        if (loaded) loaded(res);
    };
    imageCache.set(filename, res);
    return res;
}

export default getResource;