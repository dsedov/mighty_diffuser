"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(typeof self !== 'undefined' ? self : this)["webpackHotUpdatemd_ui"]("app",{

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[0]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/FileDragDrop.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[0]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/FileDragDrop.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  methods: {\n    ondragenter() {\n      alert(\"enter\");\n    }\n\n  },\n\n  mounted() {\n    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (evt) {\n      /*\r\n        For each event add an event listener that prevents the default action\r\n        (opening the file in the browser) and stop the propagation of the event (so\r\n        no other elements open the file in the browser)\r\n      */\n      alert(this.$refs.dropzone);\n      this.$refs.dropzone.addEventListener(evt, function (e) {\n        e.preventDefault();\n        e.stopPropagation();\n      }.bind(this), false);\n    }.bind(this));\n    /*\r\n      Add an event listener for drop to the form\r\n    */\n\n    this.$refs.fileform.addEventListener('drop', function (e) {\n      /*\r\n        Capture the files from the drop event and add them to our local files\r\n        array.\r\n      */\n      for (let i = 0; i < e.dataTransfer.files.length; i++) {\n        this.files.push(e.dataTransfer.files[i]);\n      }\n    }.bind(this));\n  }\n\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcz8/Y2xvbmVkUnVsZVNldC00MC51c2VbMF0hLi9ub2RlX21vZHVsZXMvQHZ1ZS92dWUtbG9hZGVyLXYxNS9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL3NyYy9jb21wb25lbnRzL0ZpbGVEcmFnRHJvcC52dWU/dnVlJnR5cGU9c2NyaXB0Jmxhbmc9anMmLmpzIiwibWFwcGluZ3MiOiI7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUhBOztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQWhDQSIsInNvdXJjZXMiOlsid2VicGFjazovL21kX3VpL3NyYy9jb21wb25lbnRzL0ZpbGVEcmFnRHJvcC52dWU/NTVjOSJdLCJzb3VyY2VzQ29udGVudCI6WyI8dGVtcGxhdGU+XHJcbiAgICA8di1zaGVldCByZWY9XCJkcm9wem9uZVwiIGNsYXNzPVwibWwtNCBtci00IG1iLTQgcGEtMlwiPkRyYWcgYW5kIGRyb3AgZmlsZSBoZXJlPC92LXNoZWV0PlxyXG48L3RlbXBsYXRlPlxyXG48c2NyaXB0PlxyXG4gICAgZXhwb3J0IGRlZmF1bHQge1xyXG4gICAgICAgIG1ldGhvZHM6e1xyXG4gICAgICAgICAgICBvbmRyYWdlbnRlcigpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiZW50ZXJcIilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgbW91bnRlZCgpIHtcclxuICAgICAgICAgICAgWydkcmFnJywgJ2RyYWdzdGFydCcsICdkcmFnZW5kJywgJ2RyYWdvdmVyJywgJ2RyYWdlbnRlcicsICdkcmFnbGVhdmUnLCAnZHJvcCddLmZvckVhY2goIGZ1bmN0aW9uKCBldnQgKSB7XHJcbiAgICAgIC8qXHJcbiAgICAgICAgRm9yIGVhY2ggZXZlbnQgYWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRoYXQgcHJldmVudHMgdGhlIGRlZmF1bHQgYWN0aW9uXHJcbiAgICAgICAgKG9wZW5pbmcgdGhlIGZpbGUgaW4gdGhlIGJyb3dzZXIpIGFuZCBzdG9wIHRoZSBwcm9wYWdhdGlvbiBvZiB0aGUgZXZlbnQgKHNvXHJcbiAgICAgICAgbm8gb3RoZXIgZWxlbWVudHMgb3BlbiB0aGUgZmlsZSBpbiB0aGUgYnJvd3NlcilcclxuICAgICAgKi9cclxuICAgICBhbGVydCh0aGlzLiRyZWZzLmRyb3B6b25lKVxyXG4gICAgICB0aGlzLiRyZWZzLmRyb3B6b25lLmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCBmdW5jdGlvbihlKXtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgfS5iaW5kKHRoaXMpLCBmYWxzZSk7XHJcbiAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgIC8qXHJcbiAgICAgIEFkZCBhbiBldmVudCBsaXN0ZW5lciBmb3IgZHJvcCB0byB0aGUgZm9ybVxyXG4gICAgKi9cclxuICAgIHRoaXMuJHJlZnMuZmlsZWZvcm0uYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAvKlxyXG4gICAgICAgIENhcHR1cmUgdGhlIGZpbGVzIGZyb20gdGhlIGRyb3AgZXZlbnQgYW5kIGFkZCB0aGVtIHRvIG91ciBsb2NhbCBmaWxlc1xyXG4gICAgICAgIGFycmF5LlxyXG4gICAgICAqL1xyXG4gICAgICBmb3IoIGxldCBpID0gMDsgaSA8IGUuZGF0YVRyYW5zZmVyLmZpbGVzLmxlbmd0aDsgaSsrICl7XHJcbiAgICAgICAgdGhpcy5maWxlcy5wdXNoKCBlLmRhdGFUcmFuc2Zlci5maWxlc1tpXSApO1xyXG4gICAgICB9XHJcbiAgICB9LmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuPC9zY3JpcHQ+Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[0]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/FileDragDrop.vue?vue&type=script&lang=js&\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ !function() {
/******/ 	__webpack_require__.h = function() { return "dc7476bdfe531cb6"; }
/******/ }();
/******/ 
/******/ }
);