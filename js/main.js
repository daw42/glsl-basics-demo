import * as glMatrix from './gl-matrix/common.js';
import * as mat4 from './gl-matrix/mat4.js';

import * as shaderCode from './shader-code.js';
import {GLMesh} from './glmesh.js';
import {makeSphere} from './shapes.js';
import {PerspectiveCamera} from './perspective-camera.js';
import {ShaderProgram} from './shader.js';
import {Controls} from './controls.js';
import {Texture} from './texture.js';
import { loadObjMesh } from './objloader.js';

const shaders = {
    simple: null,
    uniform: null,
    diffuse: null,
    blinn_phong: null,
    blinn_phong_perfrag: null,
    current: null,
    scene: "spheres",
};

let teapot = null;
let sphere = null;
let camera = null;
let canvas = null;
let gl = null;
let modelMatrix = mat4.create();
let controls = null;
let texture = null;

function main() {

    glMatrix.setMatrixArrayType(Array);

    canvas = document.getElementById('gl-canvas');
    gl = canvas.getContext("webgl2", {preserveDrawingBuffer: true});
    if(gl === null ) {
        alert("Unable to initialize a WebGL2 context.");
        return;
    }

    window.addEventListener('resize', resize);
    canvas.addEventListener('repaint', repaint);
    initGL();
    
    camera = new PerspectiveCamera(1.0);
    camera.lookAt([0,0,7], [0,0,0], [0,1,0]);
    controls = new Controls(canvas, camera, shaders);

    Texture.load(gl,'data/earth.png').then( (result) => {
        texture = result;
        resize();
    });

    sphere = new GLMesh(gl, makeSphere());
    teapot = null;
    fetch('data/teapot.obj').then( (resp) => {
        return resp.text();
    })
    .then( (text) => {
        const msh = loadObjMesh(text);
        const m = mat4.create();
        mat4.translate(m, m, [0, -0.6, 0]);
        mat4.scale(m, m, [0.6, 0.6, 0.6]);
        msh.transform(m);
        teapot = new GLMesh(gl, msh);
    });

}

function resize() {
    let el = document.getElementById('view-container');
    let w = el.clientWidth;
    let h = el.clientHeight;
    
    canvas.width = w;
    canvas.height = h;

    gl.viewport(0, 0, w, h);
    camera.setFrustum(40.0 * Math.PI / 180.0, w / h, 1.0, 100.0);
    repaint();
}

function initGL() {
    // Set the background color
    gl.clearColor(0.5, 0.5, 0.5, 1.0);
    gl.enable(gl.DEPTH_TEST);

    shaders.simple = ShaderProgram.compile(gl, shaderCode.SIMPLE_VERT, shaderCode.SIMPLE_FRAG);
    shaders.uniform = ShaderProgram.compile(gl, shaderCode.SIMPLE_UNIFORM_VERT, shaderCode.SIMPLE_UNIFORM_FRAG);
    shaders.diffuse = ShaderProgram.compile(gl, shaderCode.DIFFUSE_VERT, shaderCode.DIFFUSE_FRAG);
    shaders.blinn_phong = ShaderProgram.compile(gl, shaderCode.BLINN_PHONG_VERT, shaderCode.BLINN_PHONG_FRAG);
    shaders.blinn_phong_perfrag = ShaderProgram.compile(gl,
        shaderCode.BLINN_PHONG_PERFRAG_VERT, shaderCode.BLINN_PHONG_PERFRAG_FRAG);
    shaders.texture = ShaderProgram.compile(gl,
        shaderCode.TEXTURE_VERT, shaderCode.TEXTURE_FRAG);
    shaders.texture.use(gl);
    gl.uniform1i(shaders.texture.uniform('uTexture'), 0);
}

function setUniforms(shader) {
    gl.uniformMatrix4fv(shader.uniform('uView'), false, camera.viewMatrix());
    gl.uniformMatrix4fv(shader.uniform('uProjection'), false, camera.projectionMatrix());
    gl.uniform3fv(shader.uniform('uLightPosition'), [0.0, 0.0, 0.0]);
    if( shader === shaders.blinn_phong  ||
        shader === shaders.blinn_phong_perfrag ||
        shader === shaders.texture ) {
        gl.uniform3fv(shader.uniform('uSpecularColor'), [1.0, 1.0, 1.0]);
        gl.uniform1f(shader.uniform('uPhongExponent'), 200.0);
    }
    if(shader === shaders.texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture.textureId);    
    }
}

function setBaseColor(shader, color) {
    if( shader === shaders.uniform ) {
        gl.uniform3fv(shader.uniform('uColor'), color);
    } else if( shader === shaders.diffuse || 
        shader === shaders.blinn_phong ||
        shader === shaders.blinn_phong_perfrag ) {
        gl.uniform3fv(shader.uniform('uDiffuseColor'), color);
    }
}

function drawScene(shader) {
    if( shaders.scene === "spheres") {
        // Left sphere
        mat4.fromTranslation(modelMatrix, [1.5,0,0]);
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, modelMatrix);
        setBaseColor(shader, [0.4, 0.6, 1.0]);
        sphere.render(gl, shader);

        // Right sphere
        mat4.fromTranslation(modelMatrix, [-1.5,0,0]);
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, modelMatrix);
        setBaseColor(shader, [1.0, 0.6, 0.4]);
        sphere.render(gl, shader);
    } else if( shaders.scene === "teapot" && teapot !== null ) {
        mat4.identity(modelMatrix);
        gl.uniformMatrix4fv(shader.uniform('uModel'), false, modelMatrix);
        setBaseColor(shader, [1.0, 0.6, 0.4]);
        teapot.render(gl, shader);
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    shaders.current.use(gl);
    setUniforms(shaders.current);
    drawScene(shaders.current);
}

function repaint() {
    window.requestAnimationFrame(render);
}

window.addEventListener("load", main);