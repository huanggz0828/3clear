(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const l of i)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const l={};return i.integrity&&(l.integrity=i.integrity),i.referrerpolicy&&(l.referrerPolicy=i.referrerpolicy),i.crossorigin==="use-credentials"?l.credentials="include":i.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(i){if(i.ep)return;i.ep=!0;const l=t(i);fetch(i.href,l)}})();const B={},Be=(e,n)=>e===n,De=Symbol("solid-track"),Y={equals:Be};let He=ke;const q=1,ee=2,xe={owned:null,cleanups:null,context:null,owner:null};var x=null;let j=null,p=null,_=null,R=null,re=0;function Q(e,n){const t=p,s=x,i=e.length===0,l=i?xe:{owned:null,cleanups:null,context:null,owner:n||s},r=i?e:()=>e(()=>z(()=>ce(l)));x=l,p=null;try{return W(r,!0)}finally{p=t,x=s}}function U(e,n){n=n?Object.assign({},Y,n):Y;const t={value:e,observers:null,observerSlots:null,comparator:n.equals||void 0},s=i=>(typeof i=="function"&&(i=i(t.value)),Se(t,i));return[_e.bind(t),s]}function M(e,n,t){const s=Ce(e,n,!1,q);ne(s)}function D(e,n,t){t=t?Object.assign({},Y,t):Y;const s=Ce(e,n,!0,0);return s.observers=null,s.observerSlots=null,s.comparator=t.equals||void 0,ne(s),_e.bind(s)}function z(e){let n,t=p;return p=null,n=e(),p=t,n}function je(e){return x===null||(x.cleanups===null?x.cleanups=[e]:x.cleanups.push(e)),e}function Re(e){const n=D(e),t=D(()=>le(n()));return t.toArray=()=>{const s=t();return Array.isArray(s)?s:s!=null?[s]:[]},t}function _e(){const e=j;if(this.sources&&(this.state||e))if(this.state===q||e)ne(this);else{const n=_;_=null,W(()=>te(this),!1),_=n}if(p){const n=this.observers?this.observers.length:0;p.sources?(p.sources.push(this),p.sourceSlots.push(n)):(p.sources=[this],p.sourceSlots=[n]),this.observers?(this.observers.push(p),this.observerSlots.push(p.sources.length-1)):(this.observers=[p],this.observerSlots=[p.sources.length-1])}return this.value}function Se(e,n,t){let s=e.value;return(!e.comparator||!e.comparator(s,n))&&(e.value=n,e.observers&&e.observers.length&&W(()=>{for(let i=0;i<e.observers.length;i+=1){const l=e.observers[i],r=j&&j.running;r&&j.disposed.has(l),(r&&!l.tState||!r&&!l.state)&&(l.pure?_.push(l):R.push(l),l.observers&&Le(l)),r||(l.state=q)}if(_.length>1e6)throw _=[],new Error},!1)),n}function ne(e){if(!e.fn)return;ce(e);const n=x,t=p,s=re;p=x=e,qe(e,e.value,s),p=t,x=n}function qe(e,n,t){let s;try{s=e.fn(n)}catch(i){e.pure&&(e.state=q),Ne(i)}(!e.updatedAt||e.updatedAt<=t)&&(e.updatedAt!=null&&"observers"in e?Se(e,s):e.value=s,e.updatedAt=t)}function Ce(e,n,t,s=q,i){const l={fn:e,state:s,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:n,owner:x,context:null,pure:t};return x===null||x!==xe&&(x.owned?x.owned.push(l):x.owned=[l]),l}function Ee(e){const n=j;if(e.state===0||n)return;if(e.state===ee||n)return te(e);if(e.suspense&&z(e.suspense.inFallback))return e.suspense.effects.push(e);const t=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<re);)(e.state||n)&&t.push(e);for(let s=t.length-1;s>=0;s--)if(e=t[s],e.state===q||n)ne(e);else if(e.state===ee||n){const i=_;_=null,W(()=>te(e,t[0]),!1),_=i}}function W(e,n){if(_)return e();let t=!1;n||(_=[]),R?t=!0:R=[],re++;try{const s=e();return Fe(t),s}catch(s){_||(R=null),Ne(s)}}function Fe(e){if(_&&(ke(_),_=null),e)return;const n=R;R=null,n.length&&W(()=>He(n),!1)}function ke(e){for(let n=0;n<e.length;n++)Ee(e[n])}function te(e,n){const t=j;e.state=0;for(let s=0;s<e.sources.length;s+=1){const i=e.sources[s];i.sources&&(i.state===q||t?i!==n&&Ee(i):(i.state===ee||t)&&te(i,n))}}function Le(e){const n=j;for(let t=0;t<e.observers.length;t+=1){const s=e.observers[t];(!s.state||n)&&(s.state=ee,s.pure?_.push(s):R.push(s),s.observers&&Le(s))}}function ce(e){let n;if(e.sources)for(;e.sources.length;){const t=e.sources.pop(),s=e.sourceSlots.pop(),i=t.observers;if(i&&i.length){const l=i.pop(),r=t.observerSlots.pop();s<i.length&&(l.sourceSlots[r]=s,i[s]=l,t.observerSlots[s]=r)}}if(e.owned){for(n=0;n<e.owned.length;n++)ce(e.owned[n]);e.owned=null}if(e.cleanups){for(n=0;n<e.cleanups.length;n++)e.cleanups[n]();e.cleanups=null}e.state=0,e.context=null}function Ge(e){return e instanceof Error||typeof e=="string"?e:new Error("Unknown error")}function Ne(e){throw e=Ge(e),e}function le(e){if(typeof e=="function"&&!e.length)return le(e());if(Array.isArray(e)){const n=[];for(let t=0;t<e.length;t++){const s=le(e[t]);Array.isArray(s)?n.push.apply(n,s):n.push(s)}return n}return e}const Ue=Symbol("fallback");function ae(e){for(let n=0;n<e.length;n++)e[n]()}function Ke(e,n,t={}){let s=[],i=[],l=[],r=0,o=n.length>1?[]:null;return je(()=>ae(l)),()=>{let u=e()||[],f,c;return u[De],z(()=>{let d=u.length,g,m,k,N,$,y,a,h,w;if(d===0)r!==0&&(ae(l),l=[],s=[],i=[],r=0,o&&(o=[])),t.fallback&&(s=[Ue],i[0]=Q(A=>(l[0]=A,t.fallback())),r=1);else if(r===0){for(i=new Array(d),c=0;c<d;c++)s[c]=u[c],i[c]=Q(b);r=d}else{for(k=new Array(d),N=new Array(d),o&&($=new Array(d)),y=0,a=Math.min(r,d);y<a&&s[y]===u[y];y++);for(a=r-1,h=d-1;a>=y&&h>=y&&s[a]===u[h];a--,h--)k[h]=i[a],N[h]=l[a],o&&($[h]=o[a]);for(g=new Map,m=new Array(h+1),c=h;c>=y;c--)w=u[c],f=g.get(w),m[c]=f===void 0?-1:f,g.set(w,c);for(f=y;f<=a;f++)w=s[f],c=g.get(w),c!==void 0&&c!==-1?(k[c]=i[f],N[c]=l[f],o&&($[c]=o[f]),c=m[c],g.set(w,c)):l[f]();for(c=y;c<d;c++)c in k?(i[c]=k[c],l[c]=N[c],o&&(o[c]=$[c],o[c](c))):i[c]=Q(b);i=i.slice(0,r=d),s=u.slice(0)}return i});function b(d){if(l[c]=d,o){const[g,m]=U(c);return o[c]=m,n(u[c],g)}return n(u[c])}}}function L(e,n){return z(()=>e(n||{}))}function de(e){const n="fallback"in e&&{fallback:()=>e.fallback};return D(Ke(()=>e.each,e.children,n||void 0))}function ze(e){let n=!1;const t=e.keyed,s=D(()=>e.when,void 0,{equals:(i,l)=>n?i===l:!i==!l});return D(()=>{const i=s();if(i){const l=e.children,r=typeof l=="function"&&l.length>0;return n=t||r,r?z(()=>l(i)):l}return e.fallback})}function Ve(e){let n=!1,t=!1;const s=Re(()=>e.children),i=D(()=>{let l=s();Array.isArray(l)||(l=[l]);for(let r=0;r<l.length;r++){const o=l[r].when;if(o)return t=!!l[r].keyed,[r,o,l[r]]}return[-1]},void 0,{equals:(l,r)=>l[0]===r[0]&&(n?l[1]===r[1]:!l[1]==!r[1])&&l[2]===r[2]});return D(()=>{const[l,r,o]=i();if(l<0)return e.fallback;const u=o.children,f=typeof u=="function"&&u.length>0;return n=t||f,f?z(()=>u(r)):u})}function he(e){return e}const Xe=["allowfullscreen","async","autofocus","autoplay","checked","controls","default","disabled","formnovalidate","hidden","indeterminate","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","seamless","selected"],Qe=new Set(["className","value","readOnly","formNoValidate","isMap","noModule","playsInline",...Xe]),We=new Set(["innerHTML","textContent","innerText","children"]),Ze={className:"class",htmlFor:"for"},ge={class:"className",formnovalidate:"formNoValidate",ismap:"isMap",nomodule:"noModule",playsinline:"playsInline",readonly:"readOnly"},Je=new Set(["beforeinput","click","dblclick","contextmenu","focusin","focusout","input","keydown","keyup","mousedown","mousemove","mouseout","mouseover","mouseup","pointerdown","pointermove","pointerout","pointerover","pointerup","touchend","touchmove","touchstart"]),Ye={xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace"};function et(e,n){return D(e,void 0,n?void 0:{equals:n})}function tt(e,n,t){let s=t.length,i=n.length,l=s,r=0,o=0,u=n[i-1].nextSibling,f=null;for(;r<i||o<l;){if(n[r]===t[o]){r++,o++;continue}for(;n[i-1]===t[l-1];)i--,l--;if(i===r){const c=l<s?o?t[o-1].nextSibling:t[l-o]:u;for(;o<l;)e.insertBefore(t[o++],c)}else if(l===o)for(;r<i;)(!f||!f.has(n[r]))&&n[r].remove(),r++;else if(n[r]===t[l-1]&&t[o]===n[i-1]){const c=n[--i].nextSibling;e.insertBefore(t[o++],n[r++].nextSibling),e.insertBefore(t[--l],c),n[i]=t[l]}else{if(!f){f=new Map;let b=o;for(;b<l;)f.set(t[b],b++)}const c=f.get(n[r]);if(c!=null)if(o<c&&c<l){let b=r,d=1,g;for(;++b<i&&b<l&&!((g=f.get(n[b]))==null||g!==c+d);)d++;if(d>c-o){const m=n[r];for(;o<c;)e.insertBefore(t[o++],m)}else e.replaceChild(t[o++],n[r++])}else r++;else n[r++].remove()}}}const me="_$DX_DELEGATE";function nt(e,n,t){let s;return Q(i=>{s=i,n===document?e():E(n,e(),n.firstChild?null:void 0,t)}),()=>{s(),n.textContent=""}}function I(e,n,t){const s=document.createElement("template");s.innerHTML=e;let i=s.content.firstChild;return t&&(i=i.firstChild),i}function fe(e,n=window.document){const t=n[me]||(n[me]=new Set);for(let s=0,i=e.length;s<i;s++){const l=e[s];t.has(l)||(t.add(l),n.addEventListener(l,ct))}}function J(e,n,t){t==null?e.removeAttribute(n):e.setAttribute(n,t)}function st(e,n,t,s){s==null?e.removeAttributeNS(n,t):e.setAttributeNS(n,t,s)}function it(e,n){n==null?e.removeAttribute("class"):e.className=n}function lt(e,n,t,s){if(s)Array.isArray(t)?(e[`$$${n}`]=t[0],e[`$$${n}Data`]=t[1]):e[`$$${n}`]=t;else if(Array.isArray(t)){const i=t[0];e.addEventListener(n,t[0]=l=>i.call(e,t[1],l))}else e.addEventListener(n,t)}function Te(e,n,t={}){const s=Object.keys(n||{}),i=Object.keys(t);let l,r;for(l=0,r=i.length;l<r;l++){const o=i[l];!o||o==="undefined"||n[o]||(we(e,o,!1),delete t[o])}for(l=0,r=s.length;l<r;l++){const o=s[l],u=!!n[o];!o||o==="undefined"||t[o]===u||!u||(we(e,o,!0),t[o]=u)}return t}function Me(e,n,t={}){const s=e.style,i=typeof t=="string";if(n==null&&i||typeof n=="string")return s.cssText=n;i&&(s.cssText=void 0,t={}),n||(n={});let l,r;for(r in t)n[r]==null&&s.removeProperty(r),delete t[r];for(r in n)l=n[r],l!==t[r]&&(s.setProperty(r,l),t[r]=l);return t}function ye(e,n,t,s){typeof n=="function"?M(i=>be(e,n(),i,t,s)):be(e,n,void 0,t,s)}function E(e,n,t,s){if(t!==void 0&&!s&&(s=[]),typeof n!="function")return K(e,n,s,t);M(i=>K(e,n(),i,t),s)}function ot(e,n,t,s,i={},l=!1){n||(n={});for(const r in i)if(!(r in n)){if(r==="children")continue;pe(e,r,null,i[r],t,l)}for(const r in n){if(r==="children"){s||K(e,n.children);continue}const o=n[r];i[r]=pe(e,r,o,i[r],t,l)}}function rt(e){return e.toLowerCase().replace(/-([a-z])/g,(n,t)=>t.toUpperCase())}function we(e,n,t){const s=n.trim().split(/\s+/);for(let i=0,l=s.length;i<l;i++)e.classList.toggle(s[i],t)}function pe(e,n,t,s,i,l){let r,o,u;if(n==="style")return Me(e,t,s);if(n==="classList")return Te(e,t,s);if(t===s)return s;if(n==="ref")l||t(e);else if(n.slice(0,3)==="on:"){const f=n.slice(3);s&&e.removeEventListener(f,s),t&&e.addEventListener(f,t)}else if(n.slice(0,10)==="oncapture:"){const f=n.slice(10);s&&e.removeEventListener(f,s,!0),t&&e.addEventListener(f,t,!0)}else if(n.slice(0,2)==="on"){const f=n.slice(2).toLowerCase(),c=Je.has(f);if(!c&&s){const b=Array.isArray(s)?s[0]:s;e.removeEventListener(f,b)}(c||t)&&(lt(e,f,t,c),c&&fe([f]))}else if((u=We.has(n))||!i&&(ge[n]||(o=Qe.has(n)))||(r=e.nodeName.includes("-")))n==="class"||n==="className"?it(e,t):r&&!o&&!u?e[rt(n)]=t:e[ge[n]||n]=t;else{const f=i&&n.indexOf(":")>-1&&Ye[n.split(":")[0]];f?st(e,f,n,t):J(e,Ze[n]||n,t)}return t}function ct(e){const n=`$$${e.type}`;let t=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==t&&Object.defineProperty(e,"target",{configurable:!0,value:t}),Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return t||document}}),B.registry&&!B.done&&(B.done=!0,document.querySelectorAll("[id^=pl-]").forEach(s=>s.remove()));t!==null;){const s=t[n];if(s&&!t.disabled){const i=t[`${n}Data`];if(i!==void 0?s.call(t,i,e):s.call(t,e),e.cancelBubble)return}t=t.host&&t.host!==t&&t.host instanceof Node?t.host:t.parentNode}}function be(e,n,t={},s,i){return n||(n={}),i||M(()=>t.children=K(e,n.children,t.children)),M(()=>n.ref&&n.ref(e)),M(()=>ot(e,n,s,!0,t,!0)),t}function K(e,n,t,s,i){for(B.context&&!t&&(t=[...e.childNodes]);typeof t=="function";)t=t();if(n===t)return t;const l=typeof n,r=s!==void 0;if(e=r&&t[0]&&t[0].parentNode||e,l==="string"||l==="number"){if(B.context)return t;if(l==="number"&&(n=n.toString()),r){let o=t[0];o&&o.nodeType===3?o.data=n:o=document.createTextNode(n),t=G(e,t,s,o)}else t!==""&&typeof t=="string"?t=e.firstChild.data=n:t=e.textContent=n}else if(n==null||l==="boolean"){if(B.context)return t;t=G(e,t,s)}else{if(l==="function")return M(()=>{let o=n();for(;typeof o=="function";)o=o();t=K(e,o,t,s)}),()=>t;if(Array.isArray(n)){const o=[],u=t&&Array.isArray(t);if(oe(o,n,t,i))return M(()=>t=K(e,o,t,s,!0)),()=>t;if(B.context){if(!o.length)return t;for(let f=0;f<o.length;f++)if(o[f].parentNode)return t=o}if(o.length===0){if(t=G(e,t,s),r)return t}else u?t.length===0?$e(e,o,s):tt(e,t,o):(t&&G(e),$e(e,o));t=o}else if(n instanceof Node){if(B.context&&n.parentNode)return t=r?[n]:n;if(Array.isArray(t)){if(r)return t=G(e,t,s,n);G(e,t,null,n)}else t==null||t===""||!e.firstChild?e.appendChild(n):e.replaceChild(n,e.firstChild);t=n}}return t}function oe(e,n,t,s){let i=!1;for(let l=0,r=n.length;l<r;l++){let o=n[l],u=t&&t[l];if(o instanceof Node)e.push(o);else if(!(o==null||o===!0||o===!1))if(Array.isArray(o))i=oe(e,o,u)||i;else if(typeof o=="function")if(s){for(;typeof o=="function";)o=o();i=oe(e,Array.isArray(o)?o:[o],Array.isArray(u)?u:[u])||i}else e.push(o),i=!0;else{const f=String(o);u&&u.nodeType===3&&u.data===f?e.push(u):e.push(document.createTextNode(f))}}return i}function $e(e,n,t){for(let s=0,i=n.length;s<i;s++)e.insertBefore(n[s],t)}function G(e,n,t,s){if(t===void 0)return e.textContent="";const i=s||document.createTextNode("");if(n.length){let l=!1;for(let r=n.length-1;r>=0;r--){const o=n[r];if(i!==o){const u=o.parentNode===e;!l&&!r?u?e.replaceChild(i,o):e.insertBefore(i,t):u&&o.remove()}else l=!0}}else e.insertBefore(i,t);return[i]}function ft(){const[e,n]=U("game"),[t,s]=U(3),[i,l]=U(1);return{step:e,setStep:n,difficulty:i,setDifficulty:l,grid:t,setGrid:s}}const ue=Q(ft),ut=I('<svg fill="currentColor" stroke-width="0" xmlns="http://www.w3.org/2000/svg"></svg>'),at=I("<title></title>");function se(e,n){return(()=>{const t=ut.cloneNode(!0);return ye(t,()=>e.a,!0,!0),ye(t,n,!0,!0),E(t,(()=>{const s=et(()=>!!n.title,!0);return()=>s()&&(()=>{const i=at.cloneNode(!0);return E(i,()=>n.title),i})()})()),M(s=>{const i=e.a.stroke,l={...n.style,overflow:"visible",color:n.color},r=n.size||"1em",o=n.size||"1em",u=e.c;return i!==s._v$&&J(t,"stroke",s._v$=i),s._v$2=Me(t,l,s._v$2),r!==s._v$3&&J(t,"height",s._v$3=r),o!==s._v$4&&J(t,"width",s._v$4=o),u!==s._v$5&&(t.innerHTML=s._v$5=u),s},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0,_v$5:void 0}),t})()}function dt(e){return se({a:{viewBox:"0 0 24 24"},c:'<path fill="none" d="M0 0h24v24H0z"/><path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"/>'},e)}function ht(e){return se({a:{fill:"none",stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",viewBox:"0 0 24 24"},c:'<path stroke="none" d="M0 0h24v24H0z"/><path d="M20 11A8.1 8.1 0 004.5 9M4 5v4h4M4 13a8.1 8.1 0 0015.5 2m.5 4v-4h-4"/>'},e)}const gt=I('<div class="tile-wrapper"><div class="tile-group"></div></div>'),mt=I('<div class="level"></div>'),yt=I('<div class="disabled-mask"></div>'),wt=I("<div></div>"),pt=I('<div class="place-group"></div>'),bt=I('<div class="game"><div class="header"></div><div class="btn-group"></div></div>'),ve={hotFace:"\u{1F975}",heart:"\u{1F496}",lemon:"\u{1F34B}",pepper:"\u{1F336}\uFE0F",meat:"\u{1F969}",sun:"\u2600\uFE0F",star:"\u2B50",planet:"\u{1FA90}",unicorn:"\u{1F984}",turtle:"\u{1F422}",dragon:"\u{1F432}",whale:"\u{1F433}",sakura:"\u{1F338}",fourLeafClover:"\u{1F340}",diamond:"\u{1F48E}"};var Ae;(function(e){e[e.pending=0]="pending",e[e.collect=1]="collect",e[e.storage=2]="storage"})(Ae||(Ae={}));const $t=81,X=9,P=40,Z=2,ie=(e,n)=>{Array.from(Array(e)).forEach(n)},vt=e=>Array.from(Array(e)).map((n,t)=>t),At=()=>{const{setStep:e,difficulty:n,grid:t}=ue,s=Object.keys(ve),i=d=>d[~~(d.length*Math.random())],l=d=>d&&d%2,r=()=>{const d=[],g=(a,h)=>a%h,m=(a,h)=>~~(a/h),k=(a,h)=>h*X+a,N=(a,h,w=-1)=>{const A=m(h,X),S=g(h,X),C=a.find(v=>v.position===k(S-1,A-1)),T=a.find(v=>v.position===k(S,A-1)),O=a.find(v=>v.position===k(S+1,A-1)),F=a.find(v=>v.position===k(S-1,A));let[H,V]=[0,0];if(C){const v=m(C.gridIndex,t());H=Math.max(v,H),v>0&&(V=Math.max(g(C.gridIndex,t()),V))}if(T){const v=m(T.gridIndex,t());H=Math.max(v,H)}if(O){const v=m(O.gridIndex,t());H=Math.max(v,H)}F&&(V=Math.max(g(F.gridIndex,t()),V));const Ie=vt(t()*t()-1).filter(v=>{const Oe=m(v,t()),Pe=g(v,t());return Oe>=H&&Pe>=V&&v!==w});return i(Ie)},$=(a,h)=>{const w=g(a,X)*P,A=g(h,t())*(P/t()),S=m(a,X)*P,C=m(h,t())*(P/t());return{left:w+A,top:S+C}},y=a=>{const h=d[a-1],w=[];if(ie($t,(A,S)=>{const C=h?.find(F=>F.position===S)?.gridIndex||-1,T=i(s),O=N(w,S,C);O===void 0||Math.random()<.4||w.push({id:`${a}-${S}`,text:ve[T],position:S,gridIndex:O,zIndex:a,key:T,...$(S,O)})}),l(a)){const A={};h.forEach(({key:C})=>{A[C]=A[C]||1}),Object.keys(A).forEach(C=>{const T=A[C];T&&T%3&&ie(T%3,()=>{const O=w.findIndex(F=>F.key===C);w.splice(O,1)})})}return w};return ie(n(),(a,h)=>{d.push(y(h))}),d},[o,u]=U(r()),f=d=>{if(d.zIndex===o().length-1)return!1;const{left:g,top:m}=d,k=g+P-Z,N=m+P-Z;for(let $=d.zIndex+1;$<o().length;$++){const y=o()[$];for(let a=0;a<y.length;a++){const h=y[a],{left:w,top:A}=h,S=w+P-Z,C=A+P-Z;if(!(S<g||w>k||C<m||A>N))return!0}}return!1},c=()=>(()=>{const d=gt.cloneNode(!0),g=d.firstChild;return E(g,L(de,{get each(){return o()},children:(m,k)=>(()=>{const N=mt.cloneNode(!0);return E(N,L(de,{each:m,children:$=>(()=>{const y=wt.cloneNode(!0);return y.$$click=()=>{f($)},E(y,L(ze,{get when(){return f($)},get children(){return yt.cloneNode(!0)}}),null),E(y,()=>$.text,null),M(a=>{const h={tile:!0,clickable:!0,[$.key]:!0,disabled:f($)},w=`translate(${$.left}px, ${$.top}px)`;return a._v$=Te(y,h,a._v$),w!==a._v$2&&y.style.setProperty("transform",a._v$2=w),a},{_v$:void 0,_v$2:void 0}),y})()})),M(()=>N.style.setProperty("z-index",k())),N})()})),d})();U([]);const b=()=>pt.cloneNode(!0);return(()=>{const d=bt.cloneNode(!0),g=d.firstChild,m=g.nextSibling;return E(g,L(dt,{class:"icon-back",onClick:()=>e("home")}),null),E(g,L(ht,{class:"icon-refresh",onClick:()=>u(r())}),null),E(d,c,m),E(d,b,m),d})()};fe(["click"]);function xt(e){return se({a:{viewBox:"0 0 448 512"},c:'<path d="M400 288H48c-17.69 0-32-14.32-32-32.01S30.31 224 48 224h352c17.69 0 32 14.3 32 31.99S417.7 288 400 288z"/>'},e)}function _t(e){return se({a:{viewBox:"0 0 448 512"},c:'<path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99h144v-144C192 62.32 206.33 48 224 48s32 14.32 32 32.01v144h144c17.7-.01 32 14.29 32 31.99z"/>'},e)}const St=I('<div class="home"><h1 class="title"><strong>3</strong>Clear</h1><span class="difficulty">\u96BE\u5EA6</span><div class="difficulty-set"><button></button><div class="display"></div><button></button></div><button class="start">\u5F00 \u59CB \u6E38 \u620F</button></div>'),Ct=()=>{const{setStep:e,difficulty:n,setDifficulty:t}=ue;return(()=>{const s=St.cloneNode(!0),i=s.firstChild,l=i.nextSibling,r=l.nextSibling,o=r.firstChild,u=o.nextSibling,f=u.nextSibling,c=r.nextSibling;return o.$$click=()=>{t(b=>b-1)},E(o,L(xt,{})),E(u,n),f.$$click=()=>{t(b=>b+1)},E(f,L(_t,{})),c.$$click=()=>{e("game")},s})()};fe(["click"]);const Et=I('<div class="app"></div>'),kt=()=>{const{step:e}=ue;return(()=>{const n=Et.cloneNode(!0);return E(n,L(Ve,{get children(){return[L(he,{get when(){return e()==="home"},get children(){return L(Ct,{})}}),L(he,{get when(){return e()==="game"},get children(){return L(At,{})}})]}})),n})()};nt(()=>L(kt,{}),document.getElementById("root"));
