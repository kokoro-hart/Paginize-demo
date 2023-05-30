class Pagination{targetRoot;targetNodes;pageCounterWrap;buttonPrev;buttonNext;perPageMd;perPageUnderMd;currentPagerEl;totalPage;totalContent;perPage;currentPager;indexStart;indexEnd;maxPager;constructor(t){Object.assign(this,t);const{targetNodes:e}=t;this.currentPagerEl=null,this.init(),this.totalContent=e.length,this.totalPage=Math.ceil(this.totalContent/this.perPage),this.registerEvents(),0===this.totalContent&&window.location.reload()}init(){const t=t=>{t.matches?(this.perPage=this.perPageMd,this.maxPager=7,this.initConstructor(),this.initQueryParams()):(this.perPage=this.perPageUnderMd,this.maxPager=5,this.initConstructor(),this.initQueryParams())},e=window.matchMedia("(min-width: 768px)");e.onchange=t,t(e)}initConstructor(){this.pageCounterWrap.innerHTML="",this.currentPager=0,this.indexStart=0,this.indexEnd=0,this.totalPage=Math.ceil(this.targetNodes.length/this.perPage)}initQueryParams(){const t=new URLSearchParams(window.location.search).get("paged");null===t||"0"===t?(this.updatePageState(),this.updateCurrentButton()):this.updatePageState(Number(t))}registerEvents(){this.buttonNext.addEventListener("click",(()=>{this.updatePageState(this.currentPager+=1)})),this.buttonPrev.addEventListener("click",(()=>{this.updatePageState(this.currentPager-=1)}))}activateButtonPrev(){this.buttonPrev.dataset.disable="false"}activateButtonNext(){this.buttonNext.dataset.disable="false"}disabledButtonPrev(){this.buttonPrev.dataset.disable="true"}disabledButtonNext=()=>{this.buttonNext.dataset.disable="true"};updateCurrentButton(t=1){this.currentPagerEl=document.querySelector(`.pageNumber[data-counter-id="${t}"]`),this.currentPagerEl?.setAttribute("data-current","true")}updateContentsView(t,e){this.indexStart=t*e-e,this.indexEnd=t*e-1;const a=[];for(let t=this.indexStart;t<this.indexEnd+1;t+=1)a.push(t);this.targetNodes.forEach((t=>{t.classList.remove("is-show")})),this.targetNodes.forEach(((t,e)=>{-1!==a.indexOf(e)&&t.classList.add("is-show")}))}updatePageState(t){1===t||void 0===t||1===this.currentPager?(this.currentPager=1,this.activateButtonNext(),this.disabledButtonPrev()):t===this.totalPage?(this.currentPager=t,this.disabledButtonNext(),this.activateButtonPrev()):(this.currentPager=t,this.activateButtonNext(),this.activateButtonPrev()),1===this.totalPage&&(this.disabledButtonNext(),this.disabledButtonPrev()),this.updateContentsView(this.currentPager,this.perPage),this.pageCounterWrap.innerHTML="",this.createPageCounter(this.currentPager,this.totalPage);const e=new URLSearchParams({paged:String(this.currentPager)}),a=new URL(window.location.href);a.search=e.toString(),window.history.replaceState({},"",a.toString()),this.updateCurrentButton(t),document.querySelectorAll(".pageNumber").forEach((t=>{t.addEventListener("click",(e=>{this.currentPager=Number(t.getAttribute("data-counter-id")),this.updatePageState(this.currentPager)}))}))}createPageCounter(t,e){const a=t=>{const e=document.createElement("button");e.setAttribute("data-ank-center","paginationAnchor"),e.setAttribute("data-counter-id",String(t)),e.classList.add("pageNumber"),e.textContent=String(t),this.pageCounterWrap.appendChild(e)},r=()=>{const t=document.createElement("span");t.classList.add("pageNumberEllipsis"),t.textContent=". . .",this.pageCounterWrap.appendChild(t)},i=this.maxPager<=5?2:3;if(e>this.maxPager){const n=1;if(e===this.maxPager+1)for(let t=1;t<=e;t+=1)a(t);else if(t<=this.maxPager/2+1){for(let e=n;e<=t+1;e+=1)a(e);t<e-2&&r();for(let t=this.maxPager<=5?e-1:e-2;t<=e;t+=1)a(t)}else if(t>=e-i){for(let t=n;t<=2;t+=1)a(t);r();const t=this.maxPager<=5?3:4;for(let r=e-(this.maxPager-t)-1;r<=e;r+=1)a(r)}else{const i=this.maxPager<=5?1:2;for(let t=n;t<=i;t+=1)a(t);r();for(let e=t-1;e<=t+1;e+=1)a(e);r();for(let t=this.maxPager<=5?e:e-1;t<=e;t+=1)a(t)}}else for(let t=1;t<=e;t+=1)a(t)}}const paginationDefault=()=>{const t=document.getElementById("js-paginationDefault");if(!t)return;const e=t.querySelectorAll(".js-cardSmall"),a=t.querySelector(".js-paginationCounter"),r=t.querySelector(".js-paginationPrev"),i=t.querySelector(".js-paginationNext");e&&a&&r&&i&&new Pagination({targetNodes:e,pageCounterWrap:a,buttonPrev:r,buttonNext:i,perPageMd:15,perPageUnderMd:12})};function App(){paginationDefault()}App();