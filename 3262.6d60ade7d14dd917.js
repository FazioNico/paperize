"use strict";(self.webpackChunkPaperize=self.webpackChunkPaperize||[]).push([[3262],{3262:(W,m,E)=>{E.r(m),E.d(m,{startTapClick:()=>b});var u=E(3756);const b=o=>{let e,p,r,s=10*-h,a=0;const y=o.getBoolean("animated",!0)&&o.getBoolean("rippleEffect",!0),f=new WeakMap,L=t=>{s=(0,u.u)(t),R(t)},A=()=>{clearTimeout(r),r=void 0,e&&(g(!1),e=void 0)},D=t=>{e||w(M(t),t)},R=t=>{w(void 0,t)},w=(t,n)=>{if(t&&t===e)return;clearTimeout(r),r=void 0;const{x:d,y:i}=(0,u.p)(n);if(e){if(f.has(e))throw new Error("internal error");e.classList.contains(l)||C(e,d,i),g(!0)}if(t){const I=f.get(t);I&&(clearTimeout(I),f.delete(t));const O=v(t)?0:k;t.classList.remove(l),r=setTimeout(()=>{C(t,d,i),r=void 0},O)}e=t},C=(t,n,d)=>{a=Date.now(),t.classList.add(l);const i=y&&P(t);i&&i.addRipple&&(S(),p=i.addRipple(n,d))},S=()=>{void 0!==p&&(p.then(t=>t()),p=void 0)},g=t=>{S();const n=e;if(!n)return;const d=T-Date.now()+a;if(t&&d>0&&!v(n)){const i=setTimeout(()=>{n.classList.remove(l),f.delete(n)},T);f.set(n,i)}else n.classList.remove(l)},c=document;c.addEventListener("ionGestureCaptured",A),c.addEventListener("touchstart",t=>{s=(0,u.u)(t),D(t)},!0),c.addEventListener("touchcancel",L,!0),c.addEventListener("touchend",L,!0),c.addEventListener("pointercancel",A,!0),c.addEventListener("mousedown",t=>{if(2===t.button)return;const n=(0,u.u)(t)-h;s<n&&D(t)},!0),c.addEventListener("mouseup",t=>{const n=(0,u.u)(t)-h;s<n&&R(t)},!0)},M=o=>{if(!o.composedPath)return o.target.closest(".ion-activatable");{const s=o.composedPath();for(let a=0;a<s.length-2;a++){const e=s[a];if(!(e instanceof ShadowRoot)&&e.classList.contains("ion-activatable"))return e}}},v=o=>o.classList.contains("ion-activatable-instant"),P=o=>{if(o.shadowRoot){const s=o.shadowRoot.querySelector("ion-ripple-effect");if(s)return s}return o.querySelector("ion-ripple-effect")},l="ion-activated",k=200,T=200,h=2500}}]);