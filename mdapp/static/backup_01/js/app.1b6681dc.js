(function(){"use strict";var e={2333:function(e,t,s){var r=s(144),a=function(){var e=this,t=e._self._c;return t("HelloWorld")},i=[],l=s(1653),n=s(998),o=s(2019),c=s(2150),h=s(8271),p=s(5808),d=s(3059),u=s(9991),m=s(2933),g=s(3305),v=s(1713),f=s(7414),b=s(2540),_=s(1357),y=s(2648),w=function(){var e=this,t=e._self._c;return t(n.Z,{attrs:{id:"inspire"}},[t(l.Z,{attrs:{app:"",value:e.alert,prominent:"",type:"error"}},[e._v(e._s(e.alertMessage))]),t(u.Z,{staticClass:"pa-2 invisible-scrollbar",attrs:{app:"",clipped:"",permanent:"",left:"",width:"150px",color:"transparent"}},[t(p.Z,{ref:"history_container",attrs:{id:"historycontainer"}},e._l(e.image_history,(function(s){return t("img",{key:s.id,staticClass:"imgh",attrs:{src:s.url,seed:s.seed,prompt:s.prompt,gen_width:s.gen_width,gen_height:s.gen_height,gen_scale:s.gen_scale,gen_steps:s.gen_steps},on:{click:e.image_click}})})),0)],1),t(d.Z,{staticStyle:{display:"flex","justify-content":"center","align-items":"center"},attrs:{app:"",id:"main"}},[t(m.Z,{attrs:{value:e.overlay,opacity:"0.9"}},[t(g.Z,{attrs:{rotate:360,size:100,width:15,value:e.progress,color:"teal"}},[e._v(" "+e._s(e.progress)+" ")])],1),t(c.Z,{staticStyle:{display:"block"},attrs:{fluid:"",id:"imgcontainer"}})],1),t(u.Z,{staticClass:"pa-0 flex",attrs:{app:"",clipped:"",permanent:"",right:"",color:"transparent"}},[t(b.Z,[e._v(" Width ")]),t(f.Z,{staticClass:"ml-4 mr-4",attrs:{label:e.width.val,"thumb-color":e.width.color,min:512,max:768,step:"64",ticks:"always","tick-size":"2","thumb-label":"","inverse-label":""},model:{value:e.width.val,callback:function(t){e.$set(e.width,"val",t)},expression:"width.val"}}),t(b.Z,[e._v(" Height ")]),t(f.Z,{staticClass:"ml-4 mr-4",attrs:{label:e.height.val,"thumb-color":e.height.color,min:512,max:768,step:"64",ticks:"always","tick-size":"2","thumb-label":"","inverse-label":""},model:{value:e.height.val,callback:function(t){e.$set(e.height,"val",t)},expression:"height.val"}}),t(b.Z,[e._v(" Scale ")]),t(f.Z,{staticClass:"ml-4 mr-4",attrs:{label:e.scale.val,"thumb-color":e.scale.color,min:1,max:20,"thumb-label":"","inverse-label":""},model:{value:e.scale.val,callback:function(t){e.$set(e.scale,"val",t)},expression:"scale.val"}}),t(b.Z,[e._v(" Steps ")]),t(f.Z,{staticClass:"ml-4 mr-4",attrs:{label:e.steps.val,"thumb-color":e.scale.color,min:10,max:70,"thumb-label":"","inverse-label":""},model:{value:e.steps.val,callback:function(t){e.$set(e.steps,"val",t)},expression:"steps.val"}}),t(b.Z,[e._v(" Seed ")]),t(_.Z,{staticClass:"ml-4 mr-4",attrs:{solo:"",flat:"",dense:"",value:e.seed}}),t(o.Z,{staticClass:"mb-3 render_button",staticStyle:{padding:"20px"},attrs:{solo:"","x-large":"",elevation:"0",label:"render"},on:{click:e.onGenerate}},[e._v("render")]),t(o.Z,{staticClass:"ml-4",staticStyle:{padding:"20px"},attrs:{solo:"",small:"",elevation:"0",label:"explore"},on:{click:e.onExplore}},[e._v("explore")])],1),t(h.Z,{staticClass:"pl-0 pr-0",attrs:{app:"",color:"transparent",height:"84",inset:""}},[t(c.Z,[t(v.Z,[t(y.Z,{staticClass:"ma-4",attrs:{filled:"",rows:"2",solo:"",flat:"",dense:""},on:{keydown:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")||t.ctrlKey||t.shiftKey||t.altKey||t.metaKey?null:(t.preventDefault(),e.textarea_keypress.apply(null,arguments))}},model:{value:e.prompt,callback:function(t){e.prompt=t},expression:"prompt"}})],1)],1)],1)],1)},k=[],Z={data:()=>({progress:0,progressInterval:{},alert:!1,overlay:!1,last_prompt:"",last_seed:0,prompt:"product photo, beautiful vase, zen garden, still life, photoreal, bokeh, depth of field, calming",showImage:!1,currentImageData:0,currentImageUrl:"test.html",currentImageName:"no_name.jpg",image_history:[],seed:42,lock_seed:!0,image_id:"",generatedImage:"imagepath",alertMessage:"Warning, generated images contained some not safe for work content and have been replaced.",links:["Dashboard","Messages","Profile","Updates"],width:{label:"width",val:512,color:"blue lighten-1"},height:{label:"height",val:512,color:"blue lighten-1"},scale:{label:"scale",val:7,color:"blue lighten-1"},steps:{label:"steps",val:25,color:"blue lighten-1"}}),created(){window.addEventListener("resize",this.onWindowResize)},destroyed(){window.removeEventListener("resize",this.onWindowResize)},watch:{seed:{immediate:!0,handler(){this.last_prompt=""}},lock_seed:{immediate:!0,handler(){this.last_prompt=""}}},methods:{textarea_keypress(){this.onGenerate()},image_click(e){var t=e.target||e.srcElement;this.prompt=""+t.getAttribute("prompt"),this.seed=parseInt(""+t.getAttribute("seed")),this.width.val=parseInt(""+t.getAttribute("gen_width")),this.height.val=parseInt(""+t.getAttribute("gen_height")),this.steps.val=parseInt(""+t.getAttribute("gen_steps")),this.scale.val=parseInt(""+t.getAttribute("gen_scale")),this.lock_seed=!0;var s=document.getElementById("display_image");s.setAttribute("src",t.getAttribute("src")),this.last_prompt=""},onExplore(){this.seed=Math.floor(1e7*Math.random())},onGenerate(){var e=this.api_server+"/submit_prompt/?q="+this.prompt+"&w="+this.width.val+"&h="+this.height.val+"&scale="+this.scale.val+"&steps="+this.steps.val;this.lock_seed&&(e=e+"&seed="+this.seed),fetch(e).then((e=>e.json())).then((e=>{"OK"==e.result?(this.seed=e.seed,this.image_id=e.id,this.overlay=!0,this.progressInterval=setInterval((()=>{100===this.progress&&fetch(this.api_server+"/check_prompt/?id="+this.image_id).then((e=>e.json())).then((e=>{if("OK"==e.result){this.overlay=!1,this.progress=0,clearInterval(this.progressInterval);var t=this.api_server+"/download_prompt/?id="+this.image_id;this.image_history.unshift({url:t,id:e.id,seed:this.seed,gen_width:this.width.val,gen_height:this.height.val,gen_scale:this.scale.val,gen_steps:this.steps.val,prompt:this.prompt}),document.querySelector("#imgcontainer").innerHTML="";let r=document.createElement("img"),a=document.createElement("img");r.id="display_image";var s=new Image;s.onload=function(){r.src=this.src,a.src=this.src},s.src=t,document.querySelector("#imgcontainer").appendChild(r),this.onWindowResize()}else this.progress=50})),this.progress+=10}),750)):"ERROR"==e.result&&this.warning(e.message),console.log(e)}))},onWindowResize(){var e=document.querySelector("#imgcontainer"),t=document.querySelector("#main"),s=t.offsetWidth,r=window.innerHeight-90;e.style.width=s+"px",e.style.height=r+"px"},warning(e){this.alertMessage=e,this.alert=!0,window.setTimeout((()=>{this.alert=!1,console.log("hide alert after 3 seconds")}),3e3)}}},x=Z,I=s(1001),O=(0,I.Z)(x,w,k,!1,null,null,null),S=O.exports,C={name:"App",metaInfo:{title:"Render Team AI Sandbox",titleTemplate:"%s"},components:{HelloWorld:S},data:()=>({})},j=C,E=(0,I.Z)(j,a,i,!1,null,null,null),P=E.exports,z=s(8864),A=s(2638);r.ZP.use(z.Z);var M=new z.Z({theme:{options:{customProperties:!0},dark:!0,themes:{dark:{primary:A.Z.blue.darken1,secondary:A.Z.blue.lighten4,accent:A.Z.indigo.base,background:"#161616"},light:{primary:A.Z.red.darken1,secondary:A.Z.red.lighten4,accent:A.Z.indigo.base,background:A.Z.red.darken1}}}}),T=s(7356);r.ZP.use(T.Z),r.ZP.config.productionTip=!1,r.ZP.prototype.api_server="http://17.185.242.37",new r.ZP({vuetify:M,render:e=>e(P)}).$mount("#app")}},t={};function s(r){var a=t[r];if(void 0!==a)return a.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,s),i.exports}s.m=e,function(){var e=[];s.O=function(t,r,a,i){if(!r){var l=1/0;for(h=0;h<e.length;h++){r=e[h][0],a=e[h][1],i=e[h][2];for(var n=!0,o=0;o<r.length;o++)(!1&i||l>=i)&&Object.keys(s.O).every((function(e){return s.O[e](r[o])}))?r.splice(o--,1):(n=!1,i<l&&(l=i));if(n){e.splice(h--,1);var c=a();void 0!==c&&(t=c)}}return t}i=i||0;for(var h=e.length;h>0&&e[h-1][2]>i;h--)e[h]=e[h-1];e[h]=[r,a,i]}}(),function(){s.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return s.d(t,{a:t}),t}}(),function(){s.d=function(e,t){for(var r in t)s.o(t,r)&&!s.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}}(),function(){s.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){s.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){s.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){var e={143:0};s.O.j=function(t){return 0===e[t]};var t=function(t,r){var a,i,l=r[0],n=r[1],o=r[2],c=0;if(l.some((function(t){return 0!==e[t]}))){for(a in n)s.o(n,a)&&(s.m[a]=n[a]);if(o)var h=o(s)}for(t&&t(r);c<l.length;c++)i=l[c],s.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return s.O(h)},r=self["webpackChunkmd_ui"]=self["webpackChunkmd_ui"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}();var r=s.O(void 0,[998],(function(){return s(2333)}));r=s.O(r)})();
//# sourceMappingURL=app.1b6681dc.js.map