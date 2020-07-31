
export class Texture {

    constructor() {
        this.textureId = null;
        this.dimensions = null;
    }

    delete(gl) {
        if( this.textureId) {
            gl.deleteTexture(this.textureId);
            this.textureId = null;
        }
    }

    /**
     * Asynchronously loads a texture from a URL into WebGL.  This function
     * returns a Promise that will resolve to the WebGLTextureObject.
     *   
     * @param {WebGL2RenderingContext} gl the WebGL2RenderingContext object
     * @param {String} url the URL of the image file
     * @returns {Promise.<WebGLTextureObject>} a Promise that will resolve to
     *           the loaded WebGLTextureObject.
     */
    static load(gl, url) {
        return new Promise( (resolve, reject) => {
            const img = new Image();
            img.addEventListener('load', () => resolve(img) );
            img.addEventListener('error', () => {
                console.error("Unable to load texture: " + url);
                reject("Unable to load texture: " + url);
            });
            img.src = url;
        }).then( (image) => {
            // Create the texture object
            const texture = new Texture();
            texture.textureId = gl.createTexture();

            // Bind to the texture and set texture parameters
            gl.bindTexture(gl.TEXTURE_2D, texture.textureId);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_BASE_LEVEL, 0);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 0);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

            // Create storage and load the texture
            gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, image.width, image.height);
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, image.width, image.height, gl.RGBA, gl.UNSIGNED_BYTE, image);

            console.log( `Loaded texture: ${url} (${image.width} x ${image.height})` );
            texture.dimensions = [image.width, image.height];
            return texture;
        });

    }

    getDimensions() { return this.dimensions; }
}