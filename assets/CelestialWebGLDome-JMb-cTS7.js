import{a as e,n as t,t as n}from"./jsx-runtime-B-hcVAMW.js";var r=e(t(),1),i=n(),a=`
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`,o=`
  precision mediump float;

  varying vec2 v_uv;
  uniform vec2 u_resolution;
  uniform vec2 u_sun;
  uniform vec2 u_moon;
  uniform float u_daylight;
  uniform float u_time;

  float hash(vec2 point) {
    return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float starLayer(vec2 uv, float density, float threshold, float speed) {
    vec2 grid = uv * density;
    vec2 cell = floor(grid);
    vec2 local = fract(grid);
    vec2 offset = vec2(hash(cell + 1.7), hash(cell + 9.2));
    float distanceToStar = length(local - offset);
    float seed = hash(cell + 4.1);
    float core = (1.0 - smoothstep(0.0, 0.062, distanceToStar)) * step(threshold, seed);
    float twinkle = 0.72 + 0.28 * sin(u_time * speed + seed * 6.28318);
    return core * twinkle;
  }

  void main() {
    vec2 point = v_uv * 2.0 - 1.0;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    point.x *= aspect;
    float radius = length(point);
    float domeMask = 1.0 - smoothstep(0.975, 1.0, radius);
    float vignette = 1.0 - smoothstep(0.28, 1.0, radius);

    vec3 zenith = vec3(0.060, 0.190, 0.400);
    vec3 edge = vec3(0.006, 0.030, 0.090);
    vec3 color = mix(edge, zenith, 0.28 + vignette * 0.72);

    vec2 drift = vec2(u_time * 0.00018, u_time * 0.00007);
    float farStars = starLayer(v_uv + drift, 94.0, 0.985, 0.28);
    float nearStars = starLayer(v_uv * 1.17 - drift * 1.8, 58.0, 0.974, 0.42);
    float starField = (farStars * 0.82 + nearStars) * (1.0 - u_daylight * 0.52);
    color += vec3(0.82, 0.91, 1.0) * starField;

    float horizonCurve = point.y + 0.36 - point.x * point.x * 0.17;
    float horizonLine = exp(-abs(horizonCurve) * 72.0);
    float atmosphere = exp(-abs(horizonCurve) * 13.0) * smoothstep(-0.72, 0.22, point.y);
    vec3 horizonColor = mix(vec3(0.10, 0.45, 0.86), vec3(0.94, 0.54, 0.16), u_daylight * 0.78);
    color += horizonColor * horizonLine * 1.16;
    color += mix(vec3(0.030, 0.24, 0.62), horizonColor, 0.46) * atmosphere * 0.68;

    float sunGlow = exp(-length(point - u_sun) * 17.0);
    float moonGlow = exp(-length(point - u_moon) * 19.0);
    color += vec3(1.0, 0.65, 0.18) * sunGlow * 0.54;
    color += vec3(0.48, 0.68, 0.93) * moonGlow * 0.34;

    float lowerField = smoothstep(0.16, -0.62, horizonCurve);
    float groundGrid = starLayer(vec2(v_uv.x * 1.8, v_uv.y * 0.62) + drift * 0.35, 74.0, 0.989, 0.18);
    color += vec3(0.74, 0.48, 0.18) * groundGrid * lowerField * 0.28;

    color *= domeMask;
    gl_FragColor = vec4(color, domeMask);
  }
`;function s(e,t,n){let r=e.createShader(t);if(!r)throw Error(`Unable to create WebGL shader.`);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r)??`Unknown shader compilation error.`;throw e.deleteShader(r),Error(t)}return r}function c({sunX:e,sunY:t,moonX:n,moonY:c,sunAltitude:l,onUnavailable:u}){let d=(0,r.useRef)(null),f=(0,r.useRef)(u),p=(0,r.useRef)({sunX:e,sunY:t,moonX:n,moonY:c,sunAltitude:l});return(0,r.useEffect)(()=>{f.current=u},[u]),(0,r.useEffect)(()=>{p.current={sunX:e,sunY:t,moonX:n,moonY:c,sunAltitude:l}},[n,c,l,e,t]),(0,r.useEffect)(()=>{let e=d.current;if(!e)return;let t=e.getContext(`webgl`,{alpha:!0,antialias:!1,depth:!1,failIfMajorPerformanceCaveat:!0,powerPreference:`high-performance`,premultipliedAlpha:!1});if(!t){e.dataset.webglStatus=`unavailable`,f.current();return}let n=null,r=null,i=0,c=!0,l=!1,u=()=>{i&&window.cancelAnimationFrame(i),i=0};try{let d=s(t,t.VERTEX_SHADER,a),m=s(t,t.FRAGMENT_SHADER,o);if(n=t.createProgram(),!n)throw Error(`Unable to create WebGL program.`);if(t.attachShader(n,d),t.attachShader(n,m),t.linkProgram(n),t.deleteShader(d),t.deleteShader(m),!t.getProgramParameter(n,t.LINK_STATUS))throw Error(t.getProgramInfoLog(n)??`Unable to link WebGL program.`);if(r=t.createBuffer(),!r)throw Error(`Unable to create WebGL buffer.`);t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW);let h=t.getAttribLocation(n,`a_position`),g=t.getUniformLocation(n,`u_resolution`),_=t.getUniformLocation(n,`u_sun`),v=t.getUniformLocation(n,`u_moon`),y=t.getUniformLocation(n,`u_daylight`),b=t.getUniformLocation(n,`u_time`);t.useProgram(n),t.enableVertexAttribArray(h),t.vertexAttribPointer(h,2,t.FLOAT,!1,0,0),t.clearColor(0,0,0,0);let x=()=>{let n=e.getBoundingClientRect(),r=Math.min(window.devicePixelRatio||1,2),i=Math.max(1,Math.round(n.width*r)),a=Math.max(1,Math.round(n.height*r));(e.width!==i||e.height!==a)&&(e.width=i,e.height=a),t.viewport(0,0,i,a)},S=r=>{if(i=0,l||document.hidden||!c)return;x();let a=p.current,o=Math.max(0,Math.min(1,(a.sunAltitude+12)/18));t.clear(t.COLOR_BUFFER_BIT),t.useProgram(n),t.uniform2f(g,e.width,e.height),t.uniform2f(_,a.sunX,a.sunY),t.uniform2f(v,a.moonX,a.moonY),t.uniform1f(y,o),t.uniform1f(b,r/1e3),t.drawArrays(t.TRIANGLES,0,3),i=window.requestAnimationFrame(S)},C=()=>{!l&&!document.hidden&&c&&!i&&(i=window.requestAnimationFrame(S))},w=()=>{document.hidden?u():C()},T=t=>{t.preventDefault(),e.dataset.webglStatus=`unavailable`,u(),f.current()},E=new ResizeObserver(x),D=new IntersectionObserver(([e])=>{c=e.isIntersecting,c?C():u()},{rootMargin:`120px`});return E.observe(e),D.observe(e),document.addEventListener(`visibilitychange`,w),e.addEventListener(`webglcontextlost`,T),e.dataset.webglStatus=`ready`,x(),C(),()=>{l=!0,u(),E.disconnect(),D.disconnect(),document.removeEventListener(`visibilitychange`,w),e.removeEventListener(`webglcontextlost`,T),r&&t.deleteBuffer(r),n&&t.deleteProgram(n),t.getExtension(`WEBGL_lose_context`)?.loseContext()}}catch{e.dataset.webglStatus=`unavailable`,u(),r&&t.deleteBuffer(r),n&&t.deleteProgram(n),t.getExtension(`WEBGL_lose_context`)?.loseContext(),f.current()}},[]),(0,i.jsx)(`div`,{className:`sky-webgl-dome`,"aria-hidden":`true`,children:(0,i.jsx)(`canvas`,{ref:d,"data-celestial-webgl":`true`})})}export{c as default};