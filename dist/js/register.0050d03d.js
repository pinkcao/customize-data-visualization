(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["register"],{"3c35":function(t,e){(function(e){t.exports=e}).call(this,{})},6199:function(module,exports,__webpack_require__){(function(process,global){var __WEBPACK_AMD_DEFINE_RESULT__;
/*
 * [js-sha1]{@link https://github.com/emn178/js-sha1}
 *
 * @version 0.6.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */(function(){"use strict";var root="object"===typeof window?window:{},NODE_JS=!root.JS_SHA1_NO_NODE_JS&&"object"===typeof process&&process.versions&&process.versions.node;NODE_JS&&(root=global);var COMMON_JS=!root.JS_SHA1_NO_COMMON_JS&&"object"===typeof module&&module.exports,AMD=__webpack_require__("3c35"),HEX_CHARS="0123456789abcdef".split(""),EXTRA=[-2147483648,8388608,32768,128],SHIFT=[24,16,8,0],OUTPUT_TYPES=["hex","array","digest","arrayBuffer"],blocks=[],createOutputMethod=function(t){return function(e){return new Sha1(!0).update(e)[t]()}},createMethod=function(){var t=createOutputMethod("hex");NODE_JS&&(t=nodeWrap(t)),t.create=function(){return new Sha1},t.update=function(e){return t.create().update(e)};for(var e=0;e<OUTPUT_TYPES.length;++e){var r=OUTPUT_TYPES[e];t[r]=createOutputMethod(r)}return t},nodeWrap=function(method){var crypto=eval("require('crypto')"),Buffer=eval("require('buffer').Buffer"),nodeMethod=function(t){if("string"===typeof t)return crypto.createHash("sha1").update(t,"utf8").digest("hex");if(t.constructor===ArrayBuffer)t=new Uint8Array(t);else if(void 0===t.length)return method(t);return crypto.createHash("sha1").update(new Buffer(t)).digest("hex")};return nodeMethod};function Sha1(t){t?(blocks[0]=blocks[16]=blocks[1]=blocks[2]=blocks[3]=blocks[4]=blocks[5]=blocks[6]=blocks[7]=blocks[8]=blocks[9]=blocks[10]=blocks[11]=blocks[12]=blocks[13]=blocks[14]=blocks[15]=0,this.blocks=blocks):this.blocks=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],this.h0=1732584193,this.h1=4023233417,this.h2=2562383102,this.h3=271733878,this.h4=3285377520,this.block=this.start=this.bytes=this.hBytes=0,this.finalized=this.hashed=!1,this.first=!0}Sha1.prototype.update=function(t){if(!this.finalized){var e="string"!==typeof t;e&&t.constructor===root.ArrayBuffer&&(t=new Uint8Array(t));var r,s,o=0,i=t.length||0,a=this.blocks;while(o<i){if(this.hashed&&(this.hashed=!1,a[0]=this.block,a[16]=a[1]=a[2]=a[3]=a[4]=a[5]=a[6]=a[7]=a[8]=a[9]=a[10]=a[11]=a[12]=a[13]=a[14]=a[15]=0),e)for(s=this.start;o<i&&s<64;++o)a[s>>2]|=t[o]<<SHIFT[3&s++];else for(s=this.start;o<i&&s<64;++o)r=t.charCodeAt(o),r<128?a[s>>2]|=r<<SHIFT[3&s++]:r<2048?(a[s>>2]|=(192|r>>6)<<SHIFT[3&s++],a[s>>2]|=(128|63&r)<<SHIFT[3&s++]):r<55296||r>=57344?(a[s>>2]|=(224|r>>12)<<SHIFT[3&s++],a[s>>2]|=(128|r>>6&63)<<SHIFT[3&s++],a[s>>2]|=(128|63&r)<<SHIFT[3&s++]):(r=65536+((1023&r)<<10|1023&t.charCodeAt(++o)),a[s>>2]|=(240|r>>18)<<SHIFT[3&s++],a[s>>2]|=(128|r>>12&63)<<SHIFT[3&s++],a[s>>2]|=(128|r>>6&63)<<SHIFT[3&s++],a[s>>2]|=(128|63&r)<<SHIFT[3&s++]);this.lastByteIndex=s,this.bytes+=s-this.start,s>=64?(this.block=a[16],this.start=s-64,this.hash(),this.hashed=!0):this.start=s}return this.bytes>4294967295&&(this.hBytes+=this.bytes/4294967296<<0,this.bytes=this.bytes%4294967296),this}},Sha1.prototype.finalize=function(){if(!this.finalized){this.finalized=!0;var t=this.blocks,e=this.lastByteIndex;t[16]=this.block,t[e>>2]|=EXTRA[3&e],this.block=t[16],e>=56&&(this.hashed||this.hash(),t[0]=this.block,t[16]=t[1]=t[2]=t[3]=t[4]=t[5]=t[6]=t[7]=t[8]=t[9]=t[10]=t[11]=t[12]=t[13]=t[14]=t[15]=0),t[14]=this.hBytes<<3|this.bytes>>>29,t[15]=this.bytes<<3,this.hash()}},Sha1.prototype.hash=function(){var t,e,r,s=this.h0,o=this.h1,i=this.h2,a=this.h3,n=this.h4,h=this.blocks;for(e=16;e<80;++e)r=h[e-3]^h[e-8]^h[e-14]^h[e-16],h[e]=r<<1|r>>>31;for(e=0;e<20;e+=5)t=o&i|~o&a,r=s<<5|s>>>27,n=r+t+n+1518500249+h[e]<<0,o=o<<30|o>>>2,t=s&o|~s&i,r=n<<5|n>>>27,a=r+t+a+1518500249+h[e+1]<<0,s=s<<30|s>>>2,t=n&s|~n&o,r=a<<5|a>>>27,i=r+t+i+1518500249+h[e+2]<<0,n=n<<30|n>>>2,t=a&n|~a&s,r=i<<5|i>>>27,o=r+t+o+1518500249+h[e+3]<<0,a=a<<30|a>>>2,t=i&a|~i&n,r=o<<5|o>>>27,s=r+t+s+1518500249+h[e+4]<<0,i=i<<30|i>>>2;for(;e<40;e+=5)t=o^i^a,r=s<<5|s>>>27,n=r+t+n+1859775393+h[e]<<0,o=o<<30|o>>>2,t=s^o^i,r=n<<5|n>>>27,a=r+t+a+1859775393+h[e+1]<<0,s=s<<30|s>>>2,t=n^s^o,r=a<<5|a>>>27,i=r+t+i+1859775393+h[e+2]<<0,n=n<<30|n>>>2,t=a^n^s,r=i<<5|i>>>27,o=r+t+o+1859775393+h[e+3]<<0,a=a<<30|a>>>2,t=i^a^n,r=o<<5|o>>>27,s=r+t+s+1859775393+h[e+4]<<0,i=i<<30|i>>>2;for(;e<60;e+=5)t=o&i|o&a|i&a,r=s<<5|s>>>27,n=r+t+n-1894007588+h[e]<<0,o=o<<30|o>>>2,t=s&o|s&i|o&i,r=n<<5|n>>>27,a=r+t+a-1894007588+h[e+1]<<0,s=s<<30|s>>>2,t=n&s|n&o|s&o,r=a<<5|a>>>27,i=r+t+i-1894007588+h[e+2]<<0,n=n<<30|n>>>2,t=a&n|a&s|n&s,r=i<<5|i>>>27,o=r+t+o-1894007588+h[e+3]<<0,a=a<<30|a>>>2,t=i&a|i&n|a&n,r=o<<5|o>>>27,s=r+t+s-1894007588+h[e+4]<<0,i=i<<30|i>>>2;for(;e<80;e+=5)t=o^i^a,r=s<<5|s>>>27,n=r+t+n-899497514+h[e]<<0,o=o<<30|o>>>2,t=s^o^i,r=n<<5|n>>>27,a=r+t+a-899497514+h[e+1]<<0,s=s<<30|s>>>2,t=n^s^o,r=a<<5|a>>>27,i=r+t+i-899497514+h[e+2]<<0,n=n<<30|n>>>2,t=a^n^s,r=i<<5|i>>>27,o=r+t+o-899497514+h[e+3]<<0,a=a<<30|a>>>2,t=i^a^n,r=o<<5|o>>>27,s=r+t+s-899497514+h[e+4]<<0,i=i<<30|i>>>2;this.h0=this.h0+s<<0,this.h1=this.h1+o<<0,this.h2=this.h2+i<<0,this.h3=this.h3+a<<0,this.h4=this.h4+n<<0},Sha1.prototype.hex=function(){this.finalize();var t=this.h0,e=this.h1,r=this.h2,s=this.h3,o=this.h4;return HEX_CHARS[t>>28&15]+HEX_CHARS[t>>24&15]+HEX_CHARS[t>>20&15]+HEX_CHARS[t>>16&15]+HEX_CHARS[t>>12&15]+HEX_CHARS[t>>8&15]+HEX_CHARS[t>>4&15]+HEX_CHARS[15&t]+HEX_CHARS[e>>28&15]+HEX_CHARS[e>>24&15]+HEX_CHARS[e>>20&15]+HEX_CHARS[e>>16&15]+HEX_CHARS[e>>12&15]+HEX_CHARS[e>>8&15]+HEX_CHARS[e>>4&15]+HEX_CHARS[15&e]+HEX_CHARS[r>>28&15]+HEX_CHARS[r>>24&15]+HEX_CHARS[r>>20&15]+HEX_CHARS[r>>16&15]+HEX_CHARS[r>>12&15]+HEX_CHARS[r>>8&15]+HEX_CHARS[r>>4&15]+HEX_CHARS[15&r]+HEX_CHARS[s>>28&15]+HEX_CHARS[s>>24&15]+HEX_CHARS[s>>20&15]+HEX_CHARS[s>>16&15]+HEX_CHARS[s>>12&15]+HEX_CHARS[s>>8&15]+HEX_CHARS[s>>4&15]+HEX_CHARS[15&s]+HEX_CHARS[o>>28&15]+HEX_CHARS[o>>24&15]+HEX_CHARS[o>>20&15]+HEX_CHARS[o>>16&15]+HEX_CHARS[o>>12&15]+HEX_CHARS[o>>8&15]+HEX_CHARS[o>>4&15]+HEX_CHARS[15&o]},Sha1.prototype.toString=Sha1.prototype.hex,Sha1.prototype.digest=function(){this.finalize();var t=this.h0,e=this.h1,r=this.h2,s=this.h3,o=this.h4;return[t>>24&255,t>>16&255,t>>8&255,255&t,e>>24&255,e>>16&255,e>>8&255,255&e,r>>24&255,r>>16&255,r>>8&255,255&r,s>>24&255,s>>16&255,s>>8&255,255&s,o>>24&255,o>>16&255,o>>8&255,255&o]},Sha1.prototype.array=Sha1.prototype.digest,Sha1.prototype.arrayBuffer=function(){this.finalize();var t=new ArrayBuffer(20),e=new DataView(t);return e.setUint32(0,this.h0),e.setUint32(4,this.h1),e.setUint32(8,this.h2),e.setUint32(12,this.h3),e.setUint32(16,this.h4),t};var exports=createMethod();COMMON_JS?module.exports=exports:(root.sha1=exports,AMD&&(__WEBPACK_AMD_DEFINE_RESULT__=function(){return exports}.call(exports,__webpack_require__,exports,module),void 0===__WEBPACK_AMD_DEFINE_RESULT__||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)))})()}).call(this,__webpack_require__("4362"),__webpack_require__("c8ba"))},7803:function(t,e,r){"use strict";r.r(e);var s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"register-main-wrapper"},[r("div",{staticClass:"register-main-pane"},[r("el-form",{ref:"ruleForm",attrs:{model:t.ruleForm,"label-width":"80px",rules:t.rules}},[r("el-form-item",[r("div",{staticStyle:{"margin-bottom":"20px","margin-left":"50px"}},[r("span",{staticStyle:{"font-family":"'PingFang SC'","font-size":"40px","font-weight":"bold","letter-spacing":"10px"}},[t._v("注册")])])]),r("el-form-item",{attrs:{label:"账号",prop:"account"}},[r("el-input",{attrs:{placeholder:"请输入账号",autofocus:""},model:{value:t.ruleForm.account,callback:function(e){t.$set(t.ruleForm,"account",e)},expression:"ruleForm.account"}})],1),r("el-form-item",{attrs:{label:"密码",prop:"pass"}},[r("el-input",{attrs:{placeholder:"请输入密码","show-password":"",type:"password",autocomplete:"off"},model:{value:t.ruleForm.pass,callback:function(e){t.$set(t.ruleForm,"pass",e)},expression:"ruleForm.pass"}})],1),r("el-form-item",{attrs:{label:"确认密码",prop:"checkPass"}},[r("el-input",{attrs:{placeholder:"请重复密码",type:"password",autocomplete:"off"},model:{value:t.ruleForm.checkPass,callback:function(e){t.$set(t.ruleForm,"checkPass",e)},expression:"ruleForm.checkPass"}})],1),r("el-form-item",{attrs:{label:"邮件地址",prop:"email"}},[r("el-input",{attrs:{placeholder:"请输入邮件地址"},model:{value:t.ruleForm.email,callback:function(e){t.$set(t.ruleForm,"email",e)},expression:"ruleForm.email"}})],1),r("el-form-item",[r("el-button",{staticStyle:{width:"100%"},attrs:{round:"",type:"primary"},on:{keydown:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.onSubmit(e)},click:function(e){return t.onSubmit("ruleForm")}}},[t._v("提交")])],1),r("el-form-item",[r("el-button",{staticStyle:{width:"100%"},attrs:{round:""},on:{click:t.routeToLogin}},[t._v("返回")])],1)],1)],1)])},o=[],i=r("6199"),a=r.n(i),n=(r("a15e"),{name:"login",data:function(){var t=this,e=function(e,r,s){t.$axios({url:t.$url.validateAccount,method:"post",data:{account:r}}).then((function(t){200==t.status&&(1==t.data?s():s("用户名重复"))}))},r=function(e,r,s){""===r?s(new Error("请输入密码")):(""!==t.ruleForm.checkPass&&t.$refs.ruleForm.validateField("checkPass"),s())},s=function(e,r,s){""===r?s(new Error("请再次输入密码")):r!==t.ruleForm.pass?s(new Error("两次输入密码不一致!")):s()};return{loadingInstance:null,ruleForm:{account:"",pass:"",checkPass:"",email:""},rules:{account:[{validator:e,trigger:"blur",required:!0}],pass:[{validator:r,trigger:"blur",required:!0},{min:8,max:20,message:"长度在 8 到 20 个字符",trigger:"blur"}],checkPass:[{validator:s,trigger:"blur",required:!0}],email:[{type:"email",message:"请输入正确邮件地址",trigger:"blur",required:!0}]}}},computed:{},created:function(){},mounted:function(){},methods:{onSubmit:function(t){var e=this;this.loadingInstance=this.$loading({fullscreen:!0,spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)",text:"注册中..."}),this.$refs[t].validate((function(t){if(!t)return e.$message({type:"error",message:"提交失败、请检查校验项!"}),!1;e.$axios({url:e.$url.userRegister,method:"post",data:{userAccount:e.ruleForm.account,userPassword:a()(e.ruleForm.checkPass),userEmail:e.ruleForm.email}}).then((function(t){200==t.status&&1==t.data.registerStatus?(e.loadingInstance.close(),e.$message({type:"success",message:"注册成功!"}),e.$router.push("/login")):(e.loadingInstance.close(),e.$message({type:"error",message:"注册失败!"}))}))}))},routeToLogin:function(){this.$router.push("/login")}}}),h=n,l=(r("7fba"),r("0c7c")),c=Object(l["a"])(h,s,o,!1,null,null,null);e["default"]=c.exports},"7fba":function(t,e,r){"use strict";r("b619")},b619:function(t,e,r){}}]);
//# sourceMappingURL=register.0050d03d.js.map