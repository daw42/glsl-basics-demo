
export class GLMesh {
    constructor(gl, mesh) {
        this.points = null;
        this.normals = null;
        this.uvs = null;
        this.indices = null;
        this.vao = null;
        this.buffers = [];

        this.build(gl, mesh);
    }

    render(gl, shader) {
        // If the buffers haven't been initialized, do nothing
        if( this.vao === null ) return;

        // Bind to the VAO and draw the triangles
        gl.bindVertexArray(this.vao);
        gl.drawElements( gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
        gl.bindVertexArray(null);  // Un-bind the VAO
    }

    build(gl, mesh) {
        const vertHash = new Map();
        this.indices = new Uint32Array(mesh.verts.length);
        this.points = [];
        if( mesh.normals ) {
            this.normals = [];
        }
        if( mesh.uvs ) {
            this.uvs = [];
        }

        for (let i = 0; i < mesh.verts.length; i++) {
            let vert = mesh.verts[i];
            let vertKey = vert.p + ":" + vert.n + ":" + vert.uv;

            let index = vertHash.get(vertKey);
            if( index === undefined ) {
                index = this.points.length / 3;
                this.points.push(mesh.points[vert.p][0], mesh.points[vert.p][1], mesh.points[vert.p][2]);
                if( vert.n !== -1 && this.normals ) {
                    this.normals.push(mesh.normals[vert.n][0], mesh.normals[vert.n][1], mesh.normals[vert.n][2]);
                }
                if( vert.uv !== -1 && this.uvs ) {
                    this.uvs.push(mesh.uvs[vert.uv][0], mesh.uvs[vert.uv][1]);
                }
                vertHash.set(vertKey, index);
            }
            this.indices[i] = index;
        }

        // Convert to Float32Arrays
        this.points = Float32Array.from(this.points);
        if( this.normals ) {
            this.normals = Float32Array.from(this.normals);
        }
        if( this.uvs ) {
            this.uvs = Float32Array.from(this.uvs);
        }

        this.initVao(gl);
    }

    initVao(gl) {
        // Build vertex buffers and VAO

        // Check whether or not the buffers have already been initialized, if so, delete them
        if( this.vao !== null ) this.deleteBuffers(gl);

        // Index buffer
        this.buffers[0] = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers[0]);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

        // Position buffer
        this.buffers[1] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
        gl.bufferData(gl.ARRAY_BUFFER, this.points, gl.STATIC_DRAW);

        // Normal buffer
        this.buffers[2] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[2]);
        gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);

        // Texture coord buffer
        if( this.uvs ) {
            this.buffers[3] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[3]);
            gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        }

        // Setup VAO
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        // Set up the element buffer.  The buffer bound to GL_ELEMENT_ARRAY_BUFFER
        // is used by glDrawElements to pull index data (the indices used to access
        // data in the other buffers).
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers[0]);

        // Set up the position pointer.  The position is bound to vertex attribute 0.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[1]);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0);
        gl.enableVertexAttribArray(0);

        // Set up the normal pointer.  The normal is bound to vertex attribute 1.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[2]);
        gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 0, 0);
        gl.enableVertexAttribArray(1);

        // Set up the texture coordinate pointer.  This is bound to vertex attribute 2.
        if( this.uvs ) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[3]);
            gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 0, 0);
            gl.enableVertexAttribArray(2);
        }
        gl.bindVertexArray(null); // Done with this VAO
    }

    /**
     * Deletes all of the vertex data in WebGL memory for this object.  This invalidates the
     * vertex arrays, and the object can no longer be drawn.
     * 
     * @param {WebGL2RenderingContext} gl 
     */
    deleteBuffers(gl) {
        // Delete all buffers
        this.buffers.forEach( (buf) => gl.deleteBuffer(buf) );
        this.buffers = [];

        // Delete the VAO
        if( this.vao ) {
            gl.deleteVertexArray(this.vao);
            this.vao = null;
        }
    }
}