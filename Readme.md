# FragmentShader Player

A JavaScript library for adding animated visual effects to your webpage based on WebGL fragment shaders.

![](https://github.com/RnbwNoise/FSPlayer/blob/master/screenshot.png)


## API

### new FSPlayer(container, width, height, fsCode)

Creates an instance of FragmentShader Player. Parameters:

* [Element](https://developer.mozilla.org/en-US/docs/Web/API/element) `container` -- reference to an element that will contain the player's canvas.
* int `width` -- the initial width of the player's window.
* int `height` -- the initial height of the player's window.
* string `fsCode` -- the code of the fragment shader.

### setWidth(width)

Changes the width of the player's window.

* int `width` -- the new width.

### setHeight(height)

Changes the height of the player's window.

* int `height` -- the new height.

### setQuality(quality)

Changes the number of samples taken for one pixel of the image.

* float `quality` -- the new number of samples. Default: `0.5`.

### setSpeed(speed)

Changes the playback speed.

* float `speed` -- the new playback speed. The default speed is `1.0`.

### updateProgram(fsCode)

Replaces the fragment shader.

* string `fsCode` -- the code of the fragment shader.

### isPlaying()

Returns `true` if the player is in the playback mode, `false` otherwise.

### play()

Starts the playback.

### pause()

Pauses the player.


## Example
    
    <script id="shader" type="x-shader/x-fragment">
        precision mediump float;
        
        uniform float time;
        uniform vec2 resolution;
        
        void main() {
            vec2 position = gl_FragCoord.xy / resolution.xy;
            gl_FragColor = vec4(position.x, position.y, sin(time) / 2.0 + 0.5, 1.0);
        }
    </script>
    
    <div id="effect-container"></div>
    
    <script type="text/javascript">
        var container = document.getElementById('effect-container');
        var shaderCode = document.getElementById('shader').textContent;
        
        var player = new FSPlayer(container, 640, 480, shaderCode);
        player.setQuality(1/4);
        player.setSpeed(2);
        
        player.play();
    </script>


## License

Copyright (C) 2014 Vladimir P.

Portions Copyright (C) 2011 Mr.doob. Released under the MIT license.
https://github.com/mrdoob/glsl-sandbox/tree/eacba0261300fb67f664f5b16b3bb1edba9ebd76

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.