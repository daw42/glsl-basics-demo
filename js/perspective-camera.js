
import * as mat4 from './gl-matrix/mat4.js';

import {Camera} from './camera.js';

export class PerspectiveCamera extends Camera {

    /**
     * A constructor function for a Camera object.  Sets a default
     * camera frustum, position and orientation.
     * 
     * @param {Number} aspect camera's (viewport's) aspect ratio
     */
    constructor(aspect) {
        super();

        this.aspect = aspect;

        //
        // Parameters for the perspective frustum
        //
        this.setFrustum( 45.0 * Math.PI / 180.0, this.aspect, 1.0, 200.0);
    }

    setFrustum(fov, aspect, near, far) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.projMatrix = mat4.perspective(mat4.create(), this.fov, this.aspect, this.near, this.far);
    }

    setNear(n) {
        this.setFrustum(this.fov, this.aspect, n, this.far);
    }

    setFar(f) {
        this.setFrustum(this.fov, this.aspect, this.near, f);
    }

    setFov(f) {
        this.setFrustum(f, this.aspect, this.near, this.far);
    }

    setAspect( newAspect ) {
        this.setFrustum(this.fov, newAspect, this.near, this.far);
    }

    getFrustum() {
        let tanFactor = Math.tan( this.fov / 2 );
        let nearHeight2 = tanFactor * this.near;
        let nearWidth2 = nearHeight2 * this.aspect;
        let farHeight2 = tanFactor * this.far;
        let farWidth2 = farHeight2 * this.aspect;

        let frustum = [];

        // Near plane in eye coords
        frustum.push( [-nearWidth2, -nearHeight2, -this.near] );
        frustum.push( [ nearWidth2, -nearHeight2, -this.near] );
        frustum.push( [ nearWidth2,  nearHeight2, -this.near] );
        frustum.push( [-nearWidth2,  nearHeight2, -this.near] );

        // Far plane in eye coords
        frustum.push( [-farWidth2, -farHeight2, -this.far] );
        frustum.push( [ farWidth2, -farHeight2, -this.far] );
        frustum.push( [ farWidth2,  farHeight2, -this.far] );
        frustum.push( [-farWidth2,  farHeight2, -this.far] );

        return frustum;
    }

    /**
     * Computes and returns the projection matrix based on this camera.
     * @returns {mat4} the projection matrix.
     */
    projectionMatrix() {
        return this.projMatrix;
    }


}