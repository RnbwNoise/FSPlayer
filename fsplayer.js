/**
 * FragmentShader Player
 * Copyright (C) 2014 Vladimir P.
 * 
 * Portions Copyright (C) 2011 Mr.doob. Released under the MIT license.
 * https://github.com/mrdoob/glsl-sandbox/tree/eacba0261300fb67f664f5b16b3bb1edba9ebd76
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var FSPlayer = function(container, width, height, fsCode) {
    this._canvas = document.createElement('canvas');
    container.appendChild(this._canvas);
    
    this._gl = this._getWebGLContext(this._canvas);
    this._createAndEnableTriangleFanBuffer(this._gl);
    
    this._program = null;
    this._uniforms = {};
    this.updateProgram(fsCode);
    
    this._width = width;
    this._height = height;
    this._quality = 0.5;
    this._adjustSize();
    
    this._isPlaying = false;
    this._shaderTime = 0;
    this._lastFrameTime = Date.now();
    this._speed = 1;
};

/** Returns WebGL context. */
FSPlayer.prototype._getWebGLContext = function(canvas) { // static
    var gl = null;
    try {
        gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    }
    catch(e) { }
    if(gl === null)
        throw new Error('Cannot get WebGL context.');
    return gl;
};

/** Resizes the player's canvas and adjusts the viewport. */
FSPlayer.prototype._adjustSize = function() {
    this._canvas.width = this._width * this._quality;
    this._canvas.height = this._height * this._quality;
    
    this._canvas.style.width = this._width + 'px';
    this._canvas.style.height = this._height + 'px';
    
    this._gl.viewport(0, 0, this._canvas.width, this._canvas.height);
};

/** Creates and enables gl buffer used to draw the surface (two triangles) for a shader. */
FSPlayer.prototype._createAndEnableTriangleFanBuffer = function(gl) { // static
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    return buffer;
};

/** Updates the gl program with the provided fragment shader code. */
FSPlayer.prototype.updateProgram = function(fsCode) {
    var gl = this._gl;
    
    if(this._program !== null)
        gl.deleteProgram(this._program);
    this._program = gl.createProgram();
    
    var vertexShader = this._buildShader(gl,
                                         'attribute vec3 position;' +
                                         'void main() { gl_Position = vec4( position, 1.0 ); }',
                                         gl.VERTEX_SHADER);
    var fragmentShader = this._buildShader(gl, fsCode, gl.FRAGMENT_SHADER);

    gl.attachShader(this._program, vertexShader);
    gl.attachShader(this._program, fragmentShader);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    gl.linkProgram(this._program);
    if(!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
        throw new Error('Cannot link the program (' + gl.getError() + ': ' +
                        gl.getProgramParameter(program, gl.VALIDATE_STATUS) + ')');
    }
    
    gl.useProgram(this._program);
    
    this._uniforms = {
        time:       gl.getUniformLocation(this._program, 'time'),
        resolution: gl.getUniformLocation(this._program, 'resolution')
    };
};

/** Creates a gl shader of given type with provided source code. */
FSPlayer.prototype._buildShader = function(gl, source, type) { // static
    var shader = gl.createShader(type);
    
    gl.shaderSource(shader, source);
    
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error('Cannot compile shader (' + gl.getShaderInfoLog(shader) + ')');

    return shader;
};

/** Renders a frame and, if the player is not paused, schedules the next one. */
FSPlayer.prototype._renderFrame = function() {
    if(!this._isPlaying)
        return;
    requestAnimationFrame(this._renderFrame.bind(this));
    
    var gl = this._gl;
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    this._shaderTime += Date.now() - this._lastFrameTime;
    this._lastFrameTime = Date.now();
    gl.uniform1f(this._uniforms.time, (this._shaderTime / 1000) * this._speed);
    
    gl.uniform2f(this._uniforms.resolution, this._canvas.width, this._canvas.height);
    
    gl.drawArrays( gl.TRIANGLE_FAN, 0, 4);
};

/** Returns true if the player is active. */
FSPlayer.prototype.isPlaying = function() {
    return this._isPlaying;
};

/** Starts the player. */
FSPlayer.prototype.play = function() {
    this._isPlaying = true;
    this._lastFrameTime = Date.now();
    this._renderFrame();
};

/** Pauses the player. */
FSPlayer.prototype.pause = function() {
    this._isPlaying = false;
};

/** Sets the player's width. */
FSPlayer.prototype.setWidth = function(width) {
    this._width = width;
    this._adjustSize();
};

/** Sets the player's height. */
FSPlayer.prototype.setHeight = function(height) {
    this._height = height;
    this._adjustSize();
};

/** Sets the player's image quality. */
FSPlayer.prototype.setQuality = function(quality) {
    this._quality = quality;
    this._adjustSize();
};

/** Sets the player's speed. */
FSPlayer.prototype.setSpeed = function(speed) {
    this._speed = speed;
};