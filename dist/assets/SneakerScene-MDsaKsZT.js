import{n as e,o as t,r as n}from"./vanilla-DVR5IbfM.js";import{f as r,i}from"./index-BE1v3gFg.js";import{L as a,X as o,a as s,c,f as l,ft as u,ht as d,it as f,p,r as m,t as h,z as g}from"./react-three-fiber.esm-DpoaJWBz.js";import{t as _}from"./extends-CvVTau-c.js";import{t as v}from"./Gltf-igVGkZ40.js";var y=t(n()),b=0,x=i(e=>(p.onStart=(t,n,r)=>{e({active:!0,item:t,loaded:n,total:r,progress:(n-b)/(r-b)*100})},p.onLoad=()=>{e({active:!1})},p.onError=t=>e(e=>({errors:[...e.errors,t]})),p.onProgress=(t,n,r)=>{n===r&&(b=r),e({active:!0,item:t,loaded:n,total:r,progress:(n-b)/(r-b)*100||100})},{errors:[],active:!1,progress:0,item:``,loaded:0,total:0})),S={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},C={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},w=y.forwardRef(({scale:e=10,frames:t=1/0,opacity:n=1,width:r=1,height:i=1,blur:c=1,near:u=0,far:p=10,resolution:h=512,smooth:v=!0,color:b=`#000000`,depthWrite:x=!1,renderOrder:w,...T},E)=>{let D=y.useRef(null),O=s(e=>e.scene),k=s(e=>e.gl),A=y.useRef(null);r*=Array.isArray(e)?e[0]:e||1,i*=Array.isArray(e)?e[1]:e||1;let[j,M,N,P,F,I,L]=y.useMemo(()=>{let e=new d(h,h),t=new d(h,h);t.texture.generateMipmaps=e.texture.generateMipmaps=!1;let n=new o(r,i).rotateX(Math.PI/2),s=new a(n),c=new g;c.depthTest=c.depthWrite=!1,c.onBeforeCompile=e=>{e.uniforms={...e.uniforms,ucolor:{value:new l(b)}},e.fragmentShader=e.fragmentShader.replace(`void main() {`,`uniform vec3 ucolor;
           void main() {
          `),e.fragmentShader=e.fragmentShader.replace(`vec4( vec3( 1.0 - fragCoordZ ), opacity );`,`vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );`)};let u=new f(S),p=new f(C);return p.depthTest=u.depthTest=!1,[e,n,c,s,u,p,t]},[h,r,i,e,b]),R=e=>{P.visible=!0,P.material=F,F.uniforms.tDiffuse.value=j.texture,F.uniforms.h.value=e*1/256,k.setRenderTarget(L),k.render(P,A.current),P.material=I,I.uniforms.tDiffuse.value=L.texture,I.uniforms.v.value=e*1/256,k.setRenderTarget(j),k.render(P,A.current),P.visible=!1},z=0,B,V;return m(()=>{A.current&&(t===1/0||z<t)&&(z++,B=O.background,V=O.overrideMaterial,D.current.visible=!1,O.background=null,O.overrideMaterial=N,k.setRenderTarget(j),k.render(O,A.current),R(c),v&&R(c*.4),k.setRenderTarget(null),D.current.visible=!0,O.overrideMaterial=V,O.background=B)}),y.useImperativeHandle(E,()=>D.current,[]),y.createElement(`group`,_({"rotation-x":Math.PI/2},T,{ref:D}),y.createElement(`mesh`,{renderOrder:w,geometry:M,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},y.createElement(`meshBasicMaterial`,{transparent:!0,map:j.texture,opacity:n,depthWrite:x})),y.createElement(`orthographicCamera`,{ref:A,args:[-r/2,r/2,i/2,-i/2,u,p]}))}),T=e();function E({color:e,motion:t}){let{scene:n}=v(`/models/free_sneaker_optimized.glb`),i=(0,y.useRef)(null),[o,s]=(0,y.useState)(!1),d=(0,y.useMemo)(()=>{let e=n.clone(!0),t=new c().setFromObject(e),r=t.getSize(new u),i=t.getCenter(new u),o=Math.max(r.x,r.y,r.z);return e.position.sub(i),e.traverse(e=>{if(e instanceof a){let t=(Array.isArray(e.material)?e.material:[e.material]).map(e=>e.clone());e.material=Array.isArray(e.material)?t:t[0]}}),{scene:e,scale:o>0?3.35/o:1}},[n]);return(0,y.useEffect)(()=>{let e=window.matchMedia(`(prefers-reduced-motion: reduce)`),t=()=>s(e.matches);return t(),e.addEventListener(`change`,t),()=>e.removeEventListener(`change`,t)},[]),(0,y.useEffect)(()=>()=>{d.scene.traverse(e=>{e instanceof a&&(Array.isArray(e.material)?e.material:[e.material]).forEach(e=>e.dispose())})},[d]),(0,y.useEffect)(()=>{let t=[],n=new l(e);return d.scene.traverse(e=>{e instanceof a&&(Array.isArray(e.material)?e.material:[e.material]).forEach(e=>{`color`in e&&e.color instanceof l&&t.push(r.to(e.color,{r:n.r,g:n.g,b:n.b,duration:.55,ease:`power2.out`}))})}),()=>t.forEach(e=>e.kill())},[e,d]),m(({camera:e,clock:n})=>{if(i.current){let e=o?0:Math.sin(n.elapsedTime*.65)*.035;i.current.rotation.y=t.current.rotationY+e,i.current.rotation.x=t.current.rotationX,i.current.rotation.z=t.current.rotationZ,i.current.position.y=t.current.offsetY+(o?0:Math.sin(n.elapsedTime*.85)*.035)}e.position.z=t.current.cameraZ,e.lookAt(0,0,0)}),(0,T.jsx)(`group`,{ref:i,scale:d.scale,children:(0,T.jsx)(`primitive`,{object:d.scene})})}function D({color:e,motion:t,className:n,label:r}){let{active:i,progress:a}=x();return(0,T.jsxs)(`div`,{className:n,children:[(0,T.jsxs)(h,{"aria-label":r,role:`img`,camera:{position:[0,0,t.current.cameraZ],fov:34},dpr:[1,1.5],gl:{alpha:!0,antialias:!0,powerPreference:`high-performance`},children:[(0,T.jsx)(`ambientLight`,{intensity:1.35}),(0,T.jsx)(`directionalLight`,{castShadow:!0,position:[4,6,5],intensity:2.5}),(0,T.jsx)(`directionalLight`,{position:[-4,2,-3],intensity:1.4,color:`#f4a261`}),(0,T.jsx)(`pointLight`,{position:[0,-2,4],intensity:.5,color:`#ffffff`}),(0,T.jsxs)(y.Suspense,{fallback:null,children:[(0,T.jsx)(E,{color:e,motion:t}),(0,T.jsx)(w,{position:[0,-1.35,0],opacity:.2,scale:4.5,blur:2.5,far:2.5})]})]}),i&&(0,T.jsxs)(`div`,{className:`shoe-loader`,role:`status`,"aria-live":`polite`,children:[(0,T.jsx)(`span`,{className:`shoe-loader-dot`}),`Loading 3D shoe`,a>0?` · ${Math.round(a)}%`:`…`]})]})}export{D as default};