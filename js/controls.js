import {OrbitControls} from './orbit-controls.js';
import * as shaderCode from './shader-code.js';

export class Controls {

    constructor(canvas, camera, shaders) {
        this.canvas = canvas;
        this.camera = camera;
        this.shaders = shaders;

        this.orbitControls = new OrbitControls(camera, canvas);

        this.vEl = document.getElementById('vshader-code');
        this.fEl = document.getElementById('fshader-code');

        const selectEl = document.getElementById('shader-select');
        selectEl.addEventListener('change', (e) => { this.onShaderChange(e) });
        selectEl.dispatchEvent(new Event('change'));

        const sceneSelectEl = document.getElementById('scene-select');
        sceneSelectEl.addEventListener('change', (e) => { this.onSceneChange(e) });
        sceneSelectEl.dispatchEvent(new Event('change'));
    }

    onSceneChange(e) {
        this.shaders.scene = e.target.value;
        this.update();
    }

    onShaderChange(e) {
        switch(e.target.value) {
            case "simple":
                this.shaders.current = this.shaders.simple;
                this.vEl.value = shaderCode.SIMPLE_VERT;
                this.fEl.value = shaderCode.SIMPLE_FRAG;
                break;
            case "uniform":
                this.shaders.current = this.shaders.uniform;
                this.vEl.value = shaderCode.SIMPLE_UNIFORM_VERT;
                this.fEl.value = shaderCode.SIMPLE_UNIFORM_FRAG;
                break;
            case "diffuse":
                this.shaders.current = this.shaders.diffuse;
                this.vEl.value = shaderCode.DIFFUSE_VERT;
                this.fEl.value = shaderCode.DIFFUSE_FRAG;
                break;
            case "blinn-phong":
                this.shaders.current = this.shaders.blinn_phong;
                this.vEl.value = shaderCode.BLINN_PHONG_VERT;
                this.fEl.value = shaderCode.BLINN_PHONG_FRAG;
                break;
            case "blinn-phong-perfrag":
                this.shaders.current = this.shaders.blinn_phong_perfrag;
                this.vEl.value = shaderCode.BLINN_PHONG_PERFRAG_VERT;
                this.fEl.value = shaderCode.BLINN_PHONG_PERFRAG_FRAG;
                break;
            case "texture":
                this.shaders.current = this.shaders.texture;
                this.vEl.value = shaderCode.TEXTURE_VERT;
                this.fEl.value = shaderCode.TEXTURE_FRAG;
                break;
        }
        this.update();
    }

    update() {
        this.canvas.dispatchEvent(new Event('repaint'));
    }

}