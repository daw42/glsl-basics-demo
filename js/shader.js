
export class ShaderProgram {
    constructor() {
        this.programId = null;
        this.uniforms = {};
    }

    use(gl) {
        if( this.programId ) {
            gl.useProgram(this.programId);
        }
    }

    uniform( name ) {
        return this.uniforms[name];
    }

    /**
     * 
     * @param gl 
     * @param vertShaderId 
     * @param fragShaderId 
     */
    static compile(gl, vertCode, fragCode) {
        const program = new ShaderProgram();

        // Compile
        const vertShdr = program.compileShader(gl, vertCode, gl.VERTEX_SHADER);
        const fragShdr = program.compileShader(gl, fragCode, gl.FRAGMENT_SHADER);

        // Create a program and attach the shaders
        program.programId = gl.createProgram();
        gl.attachShader( program.programId, vertShdr );
        gl.attachShader( program.programId, fragShdr );

        // Link
        program.link(gl);

        // Detach and delete shaders (they are not needed anymore after the program is linked)
        gl.detachShader( program.programId, vertShdr );
        gl.detachShader( program.programId, fragShdr );
        gl.deleteShader( vertShdr );
        gl.deleteShader( fragShdr );

        program.findUniformLocations(gl);

        return program;
    }

    compileShader( gl, code, shaderType ) {
        const shdr = gl.createShader( shaderType );
        
        gl.shaderSource( shdr, code );
        gl.compileShader( shdr );

        const shaderName = (gl, shaderType) => {
            switch(shaderType) {
                case gl.VERTEX_SHADER:
                    return "vertex";
                case gl.FRAGMENT_SHADER:
                    return "fragment";
                default:
                    return "";
            }
        };
    
        if ( ! gl.getShaderParameter(shdr, gl.COMPILE_STATUS) ) {
            let lines = gl.getShaderInfoLog(shdr).split(/\r?\n/);
            let name = shaderName(gl, shaderType);
            
            console.error(`Compilation of ${name} shader failed:`);
            console.group();
            lines.forEach( (line) => console.error(line) );
            console.groupEnd();
            
            throw new ShaderError( `Compilation of ${name} shader failed: ${lines}` );
        }
    
        return shdr;
    }

    link( gl ) {
        gl.linkProgram( this.programId );
            
        if ( !gl.getProgramParameter(this.programId, gl.LINK_STATUS) ) {
            let lines = gl.getProgramInfoLog( this.programId ).split(/\r?\n/);
            console.error("Shader program failed to link:");
            console.group();
            lines.forEach( (line) => console.error(line) );
            console.groupEnd();
            throw new ShaderError( "Shader program failed to link.  See console for error log." );
        }
    }

    /**
     * 
     * @param gl 
     * @param program 
     */
    findUniformLocations( gl ) {
        const numUniforms = gl.getProgramParameter( this.programId, gl.ACTIVE_UNIFORMS );

        this.uniforms = {};
        for( let i = 0; i < numUniforms; ++i ) {
            const info = gl.getActiveUniform(this.programId, i);
            let loc = gl.getUniformLocation(this.programId, info.name);
            this.uniforms[info.name] = loc;
        }
    }
}

class ShaderError extends Error {
    constructor(...params) {
        super(...params);
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ShaderError);
        }
        this.name = 'ShaderError';
    }
}

