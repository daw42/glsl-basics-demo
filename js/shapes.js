import {ObjMesh} from './objmesh.js';

export function makeSphere(divU = 32, divV = 16) {
    const mesh = {};
    mesh.points = [];
    mesh.normals = [];
    mesh.uvs = [];
    mesh.verts = [];

    mesh.points.push([0,-1,0]);
    mesh.normals.push([0,-1,0]);
    // Generate verts (skip poles for now)
    for( let iv = 1; iv <= divV - 1; iv++ ) {
        const theta = iv * (Math.PI) / divV;
        for( let iu = 0; iu < divU; iu++ ) {
            const phi = iu * (Math.PI * 2.0) / divU;
            const p = [
                -Math.sin(theta) * Math.sin(phi), 
                -Math.cos(theta), 
                -Math.sin(theta) * Math.cos(phi)
            ];
            const n = p;
            mesh.points.push(p);
            mesh.normals.push(n);
        }
    }
    mesh.points.push([0,1,0]);
    mesh.normals.push([0,1,0]);

    // Generate UVs
    for( let iv = 0; iv <= divV; iv++ ) {
        for( let iu = 0; iu <= divU; iu++ ) {
            mesh.uvs.push([iu / divU, iv/divV]);
        }
    }

    // Generate triangles and UVs
    const stride = divU;
    for( let iv = 1; iv <= divV - 2; iv++ ) {
        for( let iu = 0; iu < divU; iu++ ) {
            const nextIdxU = (iu + 1) % divU;
            const idx0 = 1 + ( iv - 1 ) * stride + iu;
            const idx1 = 1 + ( iv - 1 ) * stride + nextIdxU;
            const idx2 = 1 + ( iv - 0 ) * stride + nextIdxU;
            const idx3 = 1 + ( iv - 0 ) * stride + iu;

            // Triangle 1
            mesh.verts.push( { p: idx0, n: idx0, uv: iu + 0 + ((divU + 1) * iv)} );
            mesh.verts.push( { p: idx1, n: idx1, uv: iu + 1 + ((divU + 1) * iv)} );
            mesh.verts.push( { p: idx2, n: idx2, uv: iu + 1 + ((divU + 1) * (iv + 1))} );
            // Triangle 2
            mesh.verts.push( { p: idx0, n: idx0, uv: iu + 0 + ((divU + 1) * iv)} );
            mesh.verts.push( { p: idx2, n: idx2, uv: iu + 1 + ((divU + 1) * (iv + 1))} );
            mesh.verts.push( { p: idx3, n: idx3, uv: iu + 0 + ((divU + 1) * (iv + 1))} );
        }
    }

    // South pole triangles
    for( let iu = 0; iu < divU; iu++ ) {
        const idx0 = 1 + iu;
        const idx1 = 0;
        const idx2 = 1 + (iu + 1) % divU;

        mesh.verts.push({p: idx0, n: idx0, uv: iu + (divU + 1)});
        mesh.verts.push({p: idx1, n: idx1, uv: iu});
        mesh.verts.push({p: idx2, n: idx2, uv: iu + 1 + (divU + 1)});
    }

    // North pole triangles
    for( let iu = 0; iu < divU; iu++ ) {
        const idx0 = 1 + (divU * (divV - 2)) + iu;
        const idx1 = 1 + (divU * (divV - 2)) + (iu + 1) % divU;
        const idx2 = 1 + (divU * (divV - 1));

        mesh.verts.push({p: idx0, n: idx0, uv: iu + 0 + (divU + 1) * (divV - 1)});
        mesh.verts.push({p: idx1, n: idx1, uv: iu + 1 + (divU + 1) * (divV - 1)});
        mesh.verts.push({p: idx2, n: idx2, uv: iu + (divV * (divU + 1))});
    }

    return new ObjMesh(mesh);
}