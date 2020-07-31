export const SIMPLE_VERT=`#version 300 es
layout(location=0) in vec3 vPosition;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
    gl_Position = uProjection * uView * uModel * vec4(vPosition, 1.0);
}`;

export const SIMPLE_FRAG=`#version 300 es
precision highp float;

out vec4 fragColor;

void main() {
    fragColor = vec4(0.4, 0.6, 1.0, 1.0); 
}`;

export const SIMPLE_UNIFORM_VERT=`#version 300 es
layout(location=0) in vec3 vPosition;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

void main() {
    gl_Position = uProjection * uView * uModel * vec4(vPosition, 1.0);
}`;

export const SIMPLE_UNIFORM_FRAG=`#version 300 es
precision highp float;

uniform vec3 uColor;

out vec4 fragColor;

void main() {
    fragColor = vec4(uColor, 1.0); 
}`;

export const DIFFUSE_VERT=`#version 300 es
layout(location=0) in vec3 vPosition;
layout(location=1) in vec3 vNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform vec3 uLightPosition;  // In eye coordinates
uniform vec3 uDiffuseColor;   // Diffuse base color (Kd)

out vec3 fSurfaceColor;    // Color for fragment shader

void main() {
    // Transform things into eye space
    mat4 mv = uView * uModel;    // Object space to eye space
    vec3 eyeSpacePosition = (mv * vec4(vPosition, 1.0)).xyz;

    // We should use the inverse transpose of mv to compute the
    // eye space normal.  However, we can use the upper-left
    // 3x3 of mv if there are no non-uniform scalings.
    vec3 eyeSpaceNormal = normalize(mat3(mv) * vNormal);

    // Calculate surface color
    vec3 lightDir = normalize(uLightPosition - eyeSpacePosition);
    fSurfaceColor = uDiffuseColor * max(dot(lightDir, eyeSpaceNormal), 0.0);

    // Calculate projected point (clip space)
    gl_Position = uProjection * mv * vec4(vPosition, 1.0);
}`;

export const DIFFUSE_FRAG=`#version 300 es
precision highp float;

in vec3 fSurfaceColor;

out vec4 fragColor;

void main() {
    fragColor = vec4(fSurfaceColor, 1.0); 
}`;

export const BLINN_PHONG_VERT=`#version 300 es
layout(location=0) in vec3 vPosition;
layout(location=1) in vec3 vNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

uniform vec3 uLightPosition;   // In eye coordinates
uniform vec3 uDiffuseColor;    // Diffuse base color (Kd)
uniform vec3 uSpecularColor;   // Specular base color (Ks)
uniform float uPhongExponent;  // Exponent of specular term

out vec3 fSurfaceColor;    // Color for fragment shader

void main() {
    // Transform things into eye space
    mat4 mv = uView * uModel;    // Object space to eye space
    vec3 eyeSpacePosition = (mv * vec4(vPosition, 1.0)).xyz;

    // We should use the inverse transpose of mv to compute the
    // eye space normal.  However, we can use the upper-left
    // 3x3 of mv if there are no non-uniform scalings.
    vec3 eyeSpaceNormal = normalize(mat3(mv) * vNormal);

    // Calculate surface color
    vec3 lightDir = normalize(uLightPosition - eyeSpacePosition);
    vec3 viewDir = normalize(-eyeSpacePosition);
    vec3 halfDir = normalize(viewDir + lightDir);
    vec3 diffuseComponent = uDiffuseColor * max(dot(lightDir, eyeSpaceNormal),0.0);
    vec3 specularComponent = uSpecularColor * 
        pow(max(0.0, dot(halfDir, eyeSpaceNormal)), uPhongExponent);
    fSurfaceColor = diffuseComponent + specularComponent;

    // Calculate projected point (clip space)
    gl_Position = uProjection * mv * vec4(vPosition, 1.0);
}`;

export const BLINN_PHONG_FRAG=`#version 300 es
precision highp float;

in vec3 fSurfaceColor;

out vec4 fragColor;

void main() {
    fragColor = vec4(fSurfaceColor, 1.0); 
}`;

export const BLINN_PHONG_PERFRAG_VERT=`#version 300 es
layout(location=0) in vec3 vPosition;
layout(location=1) in vec3 vNormal;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

out vec3 fPosition;  // Eye space position for fragment shader
out vec3 fNormal;    // Eye space normal for fragment shader

void main() {
    // Transform things into eye space
    mat4 mv = uView * uModel;    // Object space to eye space
    fPosition = (mv * vec4(vPosition, 1.0)).xyz;

    // We should use the inverse transpose of mv to compute the
    // eye space normal.  However, we can use the upper-left
    // 3x3 of mv if there are no non-uniform scalings.
    fNormal = normalize(mat3(mv) * vNormal);

    // Calculate projected point (clip space)
    gl_Position = uProjection * mv * vec4(vPosition, 1.0);
}`;

export const BLINN_PHONG_PERFRAG_FRAG=`#version 300 es
precision highp float;

uniform vec3 uLightPosition;   // In eye coordinates
uniform vec3 uDiffuseColor;    // Diffuse base color (Kd)
uniform vec3 uSpecularColor;   // Specular base color (Ks)
uniform float uPhongExponent;  // Exponent of specular term

in vec3 fNormal;    // Eye space, interpolated
in vec3 fPosition;  // Eye space, interpolated

out vec4 fragColor;

void main() {
    // Calculate surface color
    vec3 lightDir = normalize(uLightPosition - fPosition);
    vec3 viewDir = normalize(-fPosition);
    vec3 halfDir = normalize(viewDir + lightDir);
    // Renormalize the normal vector, interpolation may change the length
    vec3 normal = normalize( fNormal );  
    vec3 diffuseComponent = uDiffuseColor * max(dot(lightDir, normal),0.0);
    vec3 specularComponent = uSpecularColor * 
        pow(max(0.0, dot(halfDir, normal)), uPhongExponent);
    vec3 surfaceColor = diffuseComponent + specularComponent;

    fragColor = vec4(surfaceColor, 1.0); 
}`;

export const TEXTURE_VERT=`#version 300 es
layout(location=0) in vec3 vPosition;
layout(location=1) in vec3 vNormal;
layout(location=2) in vec2 vUv;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;

out vec3 fPosition;  // Eye space position for fragment shader
out vec3 fNormal;    // Eye space normal for fragment shader
out vec2 fUv;        // Texture coordinates

void main() {
    // Transform things into eye space
    mat4 mv = uView * uModel;    // Object space to eye space
    fPosition = (mv * vec4(vPosition, 1.0)).xyz;

    // We should use the inverse transpose of mv to compute the
    // eye space normal.  However, we can use the upper-left
    // 3x3 of mv if there are no non-uniform scalings.
    fNormal = normalize(mat3(mv) * vNormal);

    // Pass texture coordinates to fragment shader
    fUv = vUv;

    // Calculate projected point (clip space)
    gl_Position = uProjection * mv * vec4(vPosition, 1.0);
}`;

export const TEXTURE_FRAG=`#version 300 es
precision highp float;

uniform vec3 uLightPosition;   // In eye coordinates
uniform vec3 uSpecularColor;   // Specular base color (Ks)
uniform float uPhongExponent;  // Exponent of specular term

uniform sampler2D uTexture;    // Used for diffuse color

in vec3 fNormal;    // Eye space
in vec3 fPosition;  // Eye space
in vec2 fUv;        // Tex coord

out vec4 fragColor;

void main() {
    // Calculate surface color
    vec3 lightDir = normalize(uLightPosition - fPosition);
    vec3 viewDir = normalize(-fPosition);
    vec3 halfDir = normalize(viewDir + lightDir);
    // Renormalize the normal vector, interpolation may change the length
    vec3 normal = normalize( fNormal ); 
    vec3 diffuseColor = texture(uTexture, fUv).xyz;
    vec3 diffuseComponent = diffuseColor * max(dot(lightDir, normal),0.0);
    vec3 specularComponent = uSpecularColor * 
        pow(max(0.0, dot(halfDir, normal)), uPhongExponent);
    vec3 surfaceColor = diffuseComponent + specularComponent;

    fragColor = vec4(surfaceColor, 1.0); 
}`;