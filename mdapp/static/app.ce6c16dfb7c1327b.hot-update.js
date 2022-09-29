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

/***/ "./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[0]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/HelloWorld.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[0]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/HelloWorld.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _ImageThumb__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImageThumb */ \"./src/components/ImageThumb.vue\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  components: {\n    ImageThumb: _ImageThumb__WEBPACK_IMPORTED_MODULE_0__[\"default\"]\n  },\n  data: () => ({\n    possible_modes: ['Text -> Image', 'List -> Image'],\n    current_mode: 0,\n    alert: false,\n    alertMessage: \"Warning, generated images contained some not safe for work content and have been replaced.\",\n    prompt: \"product photo, beautiful vase, zen garden, still life, photoreal, bokeh, depth of field, calming\",\n    image_history: [],\n    image_id: '',\n    selected_image_id: '',\n    selected_image_saved: false,\n    promptA: \"product photo, beautiful vase, zen garden, still life, photoreal, bokeh, depth of field, calming\",\n    promptB: \"renaissance painting, beautiful vase, zen garden, still life, photoreal, bokeh, depth of field, calming\",\n    prompt_blend: 0.5,\n    seed: 42,\n    width: {\n      label: 'width',\n      val: 512,\n      color: 'blue lighten-1'\n    },\n    height: {\n      label: 'height',\n      val: 512,\n      color: 'blue lighten-1'\n    },\n    scale: {\n      label: 'scale',\n      val: 7,\n      color: 'blue lighten-1'\n    },\n    steps: {\n      label: 'steps',\n      val: 25,\n      color: 'blue lighten-1'\n    },\n    num_of_images: 1\n  }),\n\n  mounted() {\n    window.addEventListener(\"resize\", this.onWindowResize);\n    const loadHistoryOptions = {\n      method: \"POST\",\n      headers: {\n        \"Content-Type\": \"application/json\"\n      },\n      body: JSON.stringify({\n        username: ''\n      })\n    };\n    fetch(this.api_server + '/load_history/', loadHistoryOptions).then(response => response.json()).then(data => {\n      if (data.result == 'OK') {\n        data.prompts.forEach(prompt => {\n          this.image_history.push({\n            prompt_id: prompt.prompt_id,\n            settings: {\n              seed: prompt.seed,\n              width: prompt.width,\n              height: prompt.height,\n              scale: prompt.scale,\n              steps: prompt.steps,\n              prompt: prompt.prompt,\n              prompt_id: prompt.prompt_id,\n              saved: prompt.saved,\n              status: prompt.status,\n              mode: prompt.mode\n            }\n          });\n        });\n      }\n    });\n  },\n\n  destroyed() {\n    window.removeEventListener(\"resize\", this.onWindowResize);\n  },\n\n  watch: {},\n  methods: {\n    time_estimate(width, height, steps) {\n      const per_s = 22000.0 / (768 * 768) / 50.0;\n      const per_w = 22000 / (50 * per_s) / (768 * 768);\n      const total_ms = per_w * width * (per_w * height) * (per_s * steps);\n      return total_ms * 1.1;\n    },\n\n    show_image(settings, url) {\n      this.seed = settings.seed;\n      this.width.val = settings.width;\n      this.height.val = settings.height;\n      this.steps.val = settings.steps;\n      this.scale.val = settings.scale;\n      this.selected_image_id = settings.prompt_id;\n      this.selected_image_saved = settings.saved;\n      this.current_mode = settings.mode;\n\n      if (settings.mode == 'List -> Image') {\n        this.promptA = settings.prompt[0].text;\n        this.promptB = settings.prompt[1].text;\n        this.prompt_blend = settings.prompt[1].weight;\n      } else {\n        this.prompt = settings.prompt;\n      }\n\n      var display_image = document.getElementById('display_image');\n\n      if (display_image != null) {\n        display_image.setAttribute('src', url);\n        this.onWindowResize();\n      } else {\n        document.querySelector('#imgcontainer').innerHTML = '';\n        let img = document.createElement('img');\n        img.id = \"display_image\";\n        var downloadingImage = new Image();\n\n        downloadingImage.onload = function () {\n          img.src = url;\n        };\n\n        downloadingImage.src = url;\n        document.querySelector('#imgcontainer').appendChild(img);\n        this.onWindowResize();\n      }\n    },\n\n    textarea_keypress() {\n      this.onGenerate();\n    },\n\n    onSave() {\n      const saveOptions = {\n        method: \"POST\",\n        headers: {\n          \"Content-Type\": \"application/json\"\n        },\n        body: JSON.stringify({\n          prompt_id: this.selected_image_id\n        })\n      };\n      fetch(this.api_server + '/save_prompt/', saveOptions).then(response => response.json()).then(data => {\n        if (data.result == 'OK') {\n          var i = 0;\n\n          for (i; i < this.image_history.length; i++) {\n            if (this.selected_image_id == this.image_history[i].prompt_id) {\n              this.image_history[i].settings.saved = true;\n              break;\n            }\n          }\n\n          this.selected_image_saved = true;\n        } else if (data.result == \"ERR\") {\n          this.warning(data.message);\n        }\n      });\n    },\n\n    onDelete() {\n      const deleteOptions = {\n        method: \"POST\",\n        headers: {\n          \"Content-Type\": \"application/json\"\n        },\n        body: JSON.stringify({\n          prompt_id: this.selected_image_id\n        })\n      };\n      fetch(this.api_server + '/delete_prompt/', deleteOptions).then(response => response.json()).then(data => {\n        if (data.result == 'OK') {\n          var i = 0;\n          var found = false;\n\n          for (i; i < this.image_history.length; i++) {\n            if (this.selected_image_id == this.image_history[i].prompt_id) {\n              found = true;\n              break;\n            }\n          }\n\n          if (found) {\n            this.image_history.splice(i, 1);\n\n            if (i > 0 && this.image_history.length > 0) {\n              this.selected_image_id = this.image_history[i - 1].prompt_id;\n              this.selected_image_saved = this.image_history[i - 1].settings.saved;\n              var display_image = document.getElementById('display_image');\n              display_image.setAttribute('src', this.api_server + \"/download_prompt/?prompt_id=\" + this.image_history[i - 1].prompt_id);\n              this.onWindowResize();\n            } else {\n              this.selected_image_id = '';\n              this.selected_image_saved = false;\n            }\n          }\n        } else if (data.result == \"ERR\") {\n          this.warning(data.message);\n        }\n      });\n    },\n\n    onExplore() {\n      this.seed = Math.floor(Math.random() * 10000000);\n      this.onGenerate();\n    },\n\n    onGenerate() {\n      for (var i = 0; i < this.num_of_images; i++) {\n        const seed_number = this.seed + i + i * Math.floor(Math.random() * 100000);\n        const prompt_value = this.current_mode == 1 ? [{\n          text: this.promptA,\n          weight: 1.0 - this.prompt_blend\n        }, {\n          text: this.promptB,\n          weight: this.prompt_blend\n        }] : this.prompt;\n        fetch(this.api_server + '/submit_prompt/', {\n          method: \"POST\",\n          headers: {\n            \"Content-Type\": \"application/json\"\n          },\n          body: JSON.stringify({\n            prompt: prompt_value,\n            w: this.width.val,\n            h: this.height.val,\n            scale: this.scale.val,\n            steps: this.steps.val,\n            seed: seed_number,\n            mode: this.current_mode\n          })\n        }).then(response => response.json()).then(data => {\n          if (data.result == \"OK\") {\n            this.image_history.push({\n              prompt_id: data.prompt_id,\n              settings: {\n                seed: seed_number,\n                width: this.width.val,\n                height: this.height.val,\n                scale: this.scale.val,\n                steps: this.steps.val,\n                prompt: prompt_value,\n                saved: false,\n                mode: this.current_mode,\n                status: 0,\n                prompt_id: data.prompt_id,\n                gen_time: this.time_estimate(this.width.val, this.height.val, this.steps.val)\n              }\n            });\n          } else if (data.result == \"ERR\") {\n            this.warning(data.message);\n          }\n\n          console.log(data);\n        });\n      }\n\n      this.num_of_images = 1;\n    },\n\n    onWindowResize() {\n      var container = document.querySelector('#imgcontainer');\n      var image_container = document.querySelector('#main');\n      var width = image_container.offsetWidth;\n      var height = window.innerHeight - 90;\n\n      if (this.current_mode == 1) {\n        height = window.innerHeight - 135;\n      }\n\n      container.style.width = width + \"px\";\n      container.style.height = height + \"px\";\n    },\n\n    warning(text) {\n      this.alertMessage = text;\n      this.alert = true;\n      window.setTimeout(() => {\n        this.alert = false;\n        console.log(\"hide alert after 3 seconds\");\n      }, 3000);\n    }\n\n  }\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvYmFiZWwtbG9hZGVyL2xpYi9pbmRleC5qcz8/Y2xvbmVkUnVsZVNldC00MC51c2VbMF0hLi9ub2RlX21vZHVsZXMvQHZ1ZS92dWUtbG9hZGVyLXYxNS9saWIvaW5kZXguanM/P3Z1ZS1sb2FkZXItb3B0aW9ucyEuL3NyYy9jb21wb25lbnRzL0hlbGxvV29ybGQudnVlP3Z1ZSZ0eXBlPXNjcmlwdCZsYW5nPWpzJi5qcyIsIm1hcHBpbmdzIjoiOztBQWtUQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQXJCQTs7QUF1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBREE7QUFIQTtBQU9BO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBVkE7QUFGQTtBQWVBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBREE7QUFIQTtBQVFBO0FBR0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFEQTtBQUhBO0FBT0E7QUFHQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBBO0FBSEE7QUFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYQTtBQUZBO0FBZ0JBO0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFoTUE7QUFsRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZF91aS9zcmMvY29tcG9uZW50cy9IZWxsb1dvcmxkLnZ1ZT8zOGM3Il0sInNvdXJjZXNDb250ZW50IjpbIjx0ZW1wbGF0ZT5cbiAgPHYtYXBwIGlkPVwiaW5zcGlyZVwiPlxuXG5cblxuXG4gICAgPHYtbmF2aWdhdGlvbi1kcmF3ZXIgYXBwIGNsaXBwZWQgcGVybWFuZW50IGxlZnQgd2lkdGg9XCIxNTBweFwiIGNvbG9yPVwidHJhbnNwYXJlbnRcIiBjbGFzcz1cInBhLTIgaW52aXNpYmxlLXNjcm9sbGJhclwiPlxuICAgICAgPHYtbGlzdCBjbGFzcz1cImQtZmxleCBmbGV4LWNvbHVtbi1yZXZlcnNlXCIgcmVmPVwiaGlzdG9yeV9jb250YWluZXJcIiBpZD1cImhpc3Rvcnljb250YWluZXJcIj5cbiAgICAgICAgPEltYWdlVGh1bWIgdi1mb3I9XCJpbSBpbiBpbWFnZV9oaXN0b3J5XCIgOmtleT1cImltLnByb21wdF9pZFwiXG4gICAgICAgICAgOnNldHRpbmdzPVwiaW0uc2V0dGluZ3NcIiBcbiAgICAgICAgICA6cHJvbXB0X2lkPVwiaW0ucHJvbXB0X2lkXCJcbiAgICAgICAgICA6c2VsZWN0ZWQ9XCJpbS5wcm9tcHRfaWQgPT0gc2VsZWN0ZWRfaW1hZ2VfaWRcIlxuICAgICAgICAgIEBzaG93PVwic2hvd19pbWFnZVwiXG4gICAgICAgID48L0ltYWdlVGh1bWI+XG4gICAgICAgIFxuICAgICAgPC92LWxpc3Q+XG4gICAgICA8di1idG5cbiAgICAgICAgY2xhc3M9XCJtbC00IHNhdmVfYnV0dG9uXCJcbiAgICAgICAgc29sb1xuICAgICAgICBzbWFsbFxuICAgICAgICBlbGV2YXRpb249XCIwXCJcbiAgICAgICAgc3R5bGU9XCJwYWRkaW5nOjIwcHg7XCJcbiAgICAgICAgbGFiZWw9XCJzYXZlXCJcbiAgICAgICAgdi1pZj1cInNlbGVjdGVkX2ltYWdlX2lkICE9ICcnICYmICFzZWxlY3RlZF9pbWFnZV9zYXZlZFwiXG4gICAgICAgIEBjbGljaz1cIm9uU2F2ZVwiXG4gICAgICA+PHYtaWNvbj5tZGktZmxvcHB5PC92LWljb24+PC92LWJ0bj5cbiAgICAgIDx2LWJ0blxuICAgICAgICBjbGFzcz1cIm1sLTQgZGVsZXRlX2J1dHRvblwiXG4gICAgICAgIHNvbG9cbiAgICAgICAgc21hbGxcbiAgICAgICAgZWxldmF0aW9uPVwiMFwiXG4gICAgICAgIHN0eWxlPVwicGFkZGluZzoyMHB4O1wiXG4gICAgICAgIGxhYmVsPVwiZGVsZXRlXCJcbiAgICAgICAgdi1pZj1cInNlbGVjdGVkX2ltYWdlX2lkICE9ICcnXCJcbiAgICAgICAgQGNsaWNrPVwib25EZWxldGVcIlxuICAgICAgPjx2LWljb24+bWRpLXRyYXNoLWNhbjwvdi1pY29uPjwvdi1idG4+XG4gICAgPC92LW5hdmlnYXRpb24tZHJhd2VyPlxuICAgIDx2LW1haW4gYXBwIHN0eWxlPVwiZGlzcGxheTogZmxleDtqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjthbGlnbi1pdGVtczogY2VudGVyO1wiIGlkPVwibWFpblwiPlxuICAgICAgPHYtY29udGFpbmVyIGZsdWlkIGlkPVwiaW1nY29udGFpbmVyXCIgc3R5bGU9XCJkaXNwbGF5OmJsb2NrO1wiPlxuICAgICAgICBcbiAgICAgIDwvdi1jb250YWluZXI+XG4gICAgPC92LW1haW4+XG4gICAgPHYtbmF2aWdhdGlvbi1kcmF3ZXIgYXBwIGNsaXBwZWQgcGVybWFuZW50IHJpZ2h0IGNvbG9yPVwidHJhbnNwYXJlbnRcIiBjbGFzcz1cInBhLTBcIj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgPHYtZXhwYW5zaW9uLXBhbmVscyBhY2NvcmRpb24gY2xhc3M9XCJtdC0wXCIgPlxuICAgICAgICAgICAgICA8di1leHBhbnNpb24tcGFuZWwgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50XCI+XG4gICAgICAgICAgICAgICAgPHYtZXhwYW5zaW9uLXBhbmVsLWhlYWRlciBjbGFzcz1cInBsLTRcIj57e3Bvc3NpYmxlX21vZGVzW2N1cnJlbnRfbW9kZV19fTwvdi1leHBhbnNpb24tcGFuZWwtaGVhZGVyPlxuICAgICAgICAgICAgICAgIDx2LWV4cGFuc2lvbi1wYW5lbC1jb250ZW50PlxuICAgICAgICAgICAgICAgICAgPHYtbGlzdC1pdGVtLWdyb3VwIHYtbW9kZWw9XCJjdXJyZW50X21vZGVcIiBtYW5kYXRvcnk+XG4gICAgICAgICAgICAgICAgICAgIDx2LWxpc3QtaXRlbSB2LWZvcj1cIml0ZW0gaW4gcG9zc2libGVfbW9kZXNcIiA6a2V5PVwiaXRlbVwiPlxuICAgICAgICAgICAgICAgICAgICAgIDx2LWxpc3QtaXRlbS1jb250ZW50PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHYtbGlzdC1pdGVtLXRpdGxlIHYtdGV4dD1cIml0ZW1cIj48L3YtbGlzdC1pdGVtLXRpdGxlPlxuICAgICAgICAgICAgICAgICAgICAgIDwvdi1saXN0LWl0ZW0tY29udGVudD5cbiAgICAgICAgICAgICAgICAgICAgPC92LWxpc3QtaXRlbT5cbiAgICAgICAgICAgICAgICAgIDwvdi1saXN0LWl0ZW0tZ3JvdXA+XG4gICAgICAgICAgICAgICAgPC92LWV4cGFuc2lvbi1wYW5lbC1jb250ZW50PlxuICAgICAgICAgICAgICA8L3YtZXhwYW5zaW9uLXBhbmVsPlxuICAgICAgICAgICAgICA8di1leHBhbnNpb24tcGFuZWwgc3R5bGU9XCJiYWNrZ3JvdW5kLWNvbG9yOnRyYW5zcGFyZW50XCI+XG4gICAgICAgICAgICAgICAgPHYtZXhwYW5zaW9uLXBhbmVsLWhlYWRlciBjbGFzcz1cInBsLTRcIj57e3dpZHRoLnZhbH19IHgge3toZWlnaHQudmFsfX0gcGl4ZWxzPC92LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXI+XG4gICAgICAgICAgICAgICAgPHYtZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICA8di1zbGlkZXIgXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibWEtMFwiXG4gICAgICAgICAgICAgICAgICAgIHYtbW9kZWw9XCJ3aWR0aC52YWxcIlxuICAgICAgICAgICAgICAgICAgICA6dGh1bWItY29sb3I9XCJ3aWR0aC5jb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIDptaW49XCI1MTJcIlxuICAgICAgICAgICAgICAgICAgICA6bWF4PVwiNzY4XCJcbiAgICAgICAgICAgICAgICAgICAgc3RlcD1cIjY0XCJcbiAgICAgICAgICAgICAgICAgICAgdGlja3M9XCJhbHdheXNcIlxuICAgICAgICAgICAgICAgICAgICB0aWNrLXNpemU9XCIyXCJcbiAgICAgICAgICAgICAgICAgICAgdGh1bWItbGFiZWxcbiAgICAgICAgICAgICAgICAgICAgcHJlcGVuZC1pY29uPVwibWRpLWFycm93LWV4cGFuZC1ob3Jpem9udGFsXCJcbiAgICAgICAgICAgICAgICAgICAgPjwvdi1zbGlkZXI+XG5cbiAgICAgICAgICAgICAgICAgIDx2LXNsaWRlciBcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJtYS0wXCJcbiAgICAgICAgICAgICAgICAgICAgdi1tb2RlbD1cImhlaWdodC52YWxcIlxuICAgICAgICAgICAgICAgICAgICA6dGh1bWItY29sb3I9XCJoZWlnaHQuY29sb3JcIlxuICAgICAgICAgICAgICAgICAgICA6bWluPVwiNTEyXCJcbiAgICAgICAgICAgICAgICAgICAgOm1heD1cIjc2OFwiXG4gICAgICAgICAgICAgICAgICAgIHN0ZXA9XCI2NFwiXG4gICAgICAgICAgICAgICAgICAgIHRpY2tzPVwiYWx3YXlzXCJcbiAgICAgICAgICAgICAgICAgICAgdGljay1zaXplPVwiMlwiXG4gICAgICAgICAgICAgICAgICAgIHByZXBlbmQtaWNvbj1cIm1kaS1hcnJvdy1leHBhbmQtdmVydGljYWxcIlxuICAgICAgICAgICAgICAgICAgICB0aHVtYi1sYWJlbFxuICAgICAgICAgICAgICAgICAgICA+PC92LXNsaWRlcj5cbiAgICAgICAgICAgICAgICA8L3YtZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQ+XG4gICAgICAgICAgICAgIDwvdi1leHBhbnNpb24tcGFuZWw+XG4gICAgICAgICAgICAgIDx2LWV4cGFuc2lvbi1wYW5lbCBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6dHJhbnNwYXJlbnRcIj5cbiAgICAgICAgICAgICAgICA8di1leHBhbnNpb24tcGFuZWwtaGVhZGVyIGNsYXNzPVwicGwtNFwiPnt7c3RlcHMudmFsfX0gc3RlcHMgQCB7e3NjYWxlLnZhbH19IHNjYWxlPC92LWV4cGFuc2lvbi1wYW5lbC1oZWFkZXI+XG4gICAgICAgICAgICAgICAgPHYtZXhwYW5zaW9uLXBhbmVsLWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICA8di1zbGlkZXIgXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwibWEtMFwiXG4gICAgICAgICAgICAgICAgICAgIHYtbW9kZWw9XCJzdGVwcy52YWxcIlxuICAgICAgICAgICAgICAgICAgICA6dGh1bWItY29sb3I9XCJzY2FsZS5jb2xvclwiXG4gICAgICAgICAgICAgICAgICAgIDptaW49XCIxMFwiXG4gICAgICAgICAgICAgICAgICAgIDptYXg9XCI2MFwiXG4gICAgICAgICAgICAgICAgICAgIHRodW1iLWxhYmVsXG4gICAgICAgICAgICAgICAgICAgIHByZXBlbmQtaWNvbj1cIm1kaS1hdi10aW1lclwiXG4gICAgICAgICAgICAgICAgICAgID48L3Ytc2xpZGVyPlxuICAgICAgICAgICAgICAgICAgPHYtc2xpZGVyIFxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cIm1hLTBcIlxuICAgICAgICAgICAgICAgICAgICB2LW1vZGVsPVwic2NhbGUudmFsXCJcbiAgICAgICAgICAgICAgICAgICAgOnRodW1iLWNvbG9yPVwic2NhbGUuY29sb3JcIlxuICAgICAgICAgICAgICAgICAgICA6bWluPVwiMVwiXG4gICAgICAgICAgICAgICAgICAgIDptYXg9XCIyMFwiXG4gICAgICAgICAgICAgICAgICAgIHRodW1iLWxhYmVsXG4gICAgICAgICAgICAgICAgICAgIHByZXBlbmQtaWNvbj1cIm1kaS1saWdodG5pbmctYm9sdC1vdXRsaW5lXCJcbiAgICAgICAgICAgICAgICAgICAgPjwvdi1zbGlkZXI+XG4gICAgICAgICAgICAgICAgPC92LWV4cGFuc2lvbi1wYW5lbC1jb250ZW50PlxuICAgICAgICAgICAgICA8L3YtZXhwYW5zaW9uLXBhbmVsPlxuICAgICAgICAgICAgPC92LWV4cGFuc2lvbi1wYW5lbHM+XG5cbiAgICAgICAgICAgIFxuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgPHYtc3ViaGVhZGVyPlxuICAgICAgICAgICAge3tudW1fb2ZfaW1hZ2VzfX0gaW1hZ2V7e251bV9vZl9pbWFnZXMgPiAxID8gJ3MnIDogJyd9fVxuICAgICAgICAgICAgPC92LXN1YmhlYWRlcj5cbiAgICAgICAgICAgIDx2LXNsaWRlciBcbiAgICAgICAgICAgICAgY2xhc3M9XCJtbC00IG1yLTRcIlxuICAgICAgICAgICAgICB2LW1vZGVsPVwibnVtX29mX2ltYWdlc1wiXG4gICAgICAgICAgICAgIHRodW1iLWNvbG9yPVwiYmx1ZSBsaWdodGVuLTFcIlxuICAgICAgICAgICAgICB0aWNrcz1cImFsd2F5c1wiXG4gICAgICAgICAgICAgIHRpY2stc2l6ZT1cIjJcIlxuICAgICAgICAgICAgICA6bWluPVwiMVwiXG4gICAgICAgICAgICAgIDptYXg9XCI0XCJcbiAgICAgICAgICAgICAgdGh1bWItbGFiZWxcbiAgICAgICAgICAgICAgcHJlcGVuZC1pY29uPVwibWRpLWFuaW1hdGlvbi1vdXRsaW5lXCJcbiAgICAgICAgICAgICAgPjwvdi1zbGlkZXI+XG4gICAgICAgICAgICAgIDx2LXN1YmhlYWRlcj5cbiAgICAgICAgICAgIFNlZWQgbnVtYmVyXG4gICAgICAgICAgICA8L3Ytc3ViaGVhZGVyPlxuICAgICAgICAgICAgPHYtdGV4dC1maWVsZFxuICAgICAgICAgICAgICBjbGFzcz1cIm1sLTQgbXItNFwiXG4gICAgICAgICAgICAgIHNvbG9cbiAgICAgICAgICAgICAgZmxhdFxuICAgICAgICAgICAgICBkZW5zZVxuICAgICAgICAgICAgICBsYWJlbD1cInNlZWRcIlxuICAgICAgICAgICAgICB2LW1vZGVsPVwic2VlZFwiXG4gICAgICAgICAgICA+PC92LXRleHQtZmllbGQ+XG4gICAgIFxuICAgICAgICAgICAgPHYtYnRuXG4gICAgICAgICAgICAgIGNsYXNzPVwibWwtNFwiXG4gICAgICAgICAgICAgIHNvbG9cbiAgICAgICAgICAgICAgc21hbGxcbiAgICAgICAgICAgICAgZWxldmF0aW9uPVwiMFwiXG4gICAgICAgICAgICAgIHN0eWxlPVwicGFkZGluZzoyMHB4O1wiXG4gICAgICAgICAgICAgIGxhYmVsPVwiZXhwbG9yZVwiXG4gICAgICAgICAgICAgIEBjbGljaz1cIm9uRXhwbG9yZVwiXG4gICAgICAgICAgICA+ZXhwbG9yZTwvdi1idG4+XG4gICAgICAgICAgICBcblxuICAgICAgICAgICAgPHYtYnRuXG4gICAgICAgICAgICAgICAgICBjbGFzcz1cIiBtYi0zIHJlbmRlcl9idXR0b25cIlxuICAgICAgICAgICAgICAgICAgc29sb1xuICAgICAgICAgICAgICAgICAgeC1sYXJnZVxuICAgICAgICAgICAgICAgICAgZWxldmF0aW9uPVwiMFwiXG4gICAgICAgICAgICAgICAgICBzdHlsZT1cInBhZGRpbmc6MjBweDtcIlxuICAgICAgICAgICAgICAgICAgbGFiZWw9XCJyZW5kZXJcIlxuICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICBAY2xpY2s9XCJvbkdlbmVyYXRlXCJcbiAgICAgICAgICAgID5yZW5kZXI8L3YtYnRuPlxuICAgIDwvdi1uYXZpZ2F0aW9uLWRyYXdlcj5cbiAgICBcbiAgICA8di1mb290ZXIgdi1pZj1cInBvc3NpYmxlX21vZGVzW2N1cnJlbnRfbW9kZV0gPT0gJ1RleHQgLT4gSW1hZ2UnXCIgZml4ZWQgYXBwIGNvbG9yPVwidHJhbnNwYXJlbnRcIiBoZWlnaHQ9XCI4MFwiIGluc2V0IGNsYXNzPVwicGwtMCBwci0wXCI+XG4gICAgICA8di1jb250YWluZXI+XG4gICAgICAgIDx2LXJvdz5cbiAgICAgICAgICA8di1jb2wgY2xhc3M9XCJtYS0wIHBhLTBcIj5cbiAgICAgICAgICAgIDx2LXRleHRhcmVhXG4gICAgICAgICAgICAgIGNsYXNzPVwibWwtNCBtci00XCJcbiAgICAgICAgICAgICAgZmlsbGVkXG4gICAgICAgICAgICAgIHJvd3M9XCIyXCJcbiAgICAgICAgICAgICAgc29sb1xuICAgICAgICAgICAgICBmbGF0XG4gICAgICAgICAgICAgIGRlbnNlXG4gICAgICAgICAgICAgIEBrZXlkb3duLmVudGVyLmV4YWN0LnByZXZlbnQ9XCJ0ZXh0YXJlYV9rZXlwcmVzc1wiXG4gICAgICAgICAgICAgIHYtbW9kZWw9XCJwcm9tcHRcIlxuICAgICAgICAgICAgICA+PC92LXRleHRhcmVhPlxuICAgICAgICAgICAgPC92LWNvbD5cbiAgICAgICAgPC92LXJvdz5cbiAgICAgIDwvdi1jb250YWluZXI+XG4gICAgPC92LWZvb3Rlcj5cbiAgICBcbiAgICA8di1mb290ZXIgdi1pZj1cInBvc3NpYmxlX21vZGVzW2N1cnJlbnRfbW9kZV0gPT0gJ0xpc3QgLT4gSW1hZ2UnXCIgZml4ZWQgYXBwIGNvbG9yPVwidHJhbnNwYXJlbnRcIiBoZWlnaHQ9XCIxMzVcIiBpbnNldCBjbGFzcz1cInBsLTAgcHItMFwiPlxuICAgICAgPHYtY29udGFpbmVyPlxuICAgICAgICA8di1yb3c+XG4gICAgICAgICAgPHYtY29sIGNsYXNzPVwibWEtMCBwYS0wXCI+XG4gICAgICAgICAgICA8di10ZXh0YXJlYVxuICAgICAgICAgICAgICBjbGFzcz1cIm1sLTQgbXItNFwiXG4gICAgICAgICAgICAgIGZpbGxlZFxuICAgICAgICAgICAgICByb3dzPVwiMVwiXG4gICAgICAgICAgICAgIHNvbG9cbiAgICAgICAgICAgICAgZmxhdFxuICAgICAgICAgICAgICBkZW5zZVxuICAgICAgICAgICAgICBoaWRlLWRldGFpbHNcbiAgICAgICAgICAgICAgdi1tb2RlbD1cInByb21wdEFcIlxuICAgICAgICAgICAgICA+PC92LXRleHRhcmVhPlxuICAgICAgICAgIDwvdi1jb2w+XG4gICAgICAgIDwvdi1yb3c+XG4gICAgICAgIDx2LXJvdz5cbiAgICAgICAgICA8di1jb2wgY2xhc3M9XCJtYS0wIHBhLTBcIj5cbiAgICAgICAgICAgIDx2LXNsaWRlciBcbiAgICAgICAgICAgIGNsYXNzPVwibWwtNCBtci00XCJcbiAgICAgICAgICAgICAgdi1tb2RlbD1cInByb21wdF9ibGVuZFwiXG4gICAgICAgICAgICAgIDptaW49XCIwLjBcIlxuICAgICAgICAgICAgICA6bWF4PVwiMS4wXCJcbiAgICAgICAgICAgICAgOnN0ZXA9XCIwLjAxXCJcbiAgICAgICAgICAgICAgdGh1bWItbGFiZWxcbiAgICAgICAgICAgICAgaGlkZS1kZXRhaWxzXG4gICAgICAgICAgICAgID48L3Ytc2xpZGVyPlxuICAgICAgICAgIDwvdi1jb2w+XG4gICAgICAgIDwvdi1yb3c+XG4gICAgICAgIDx2LXJvdz5cbiAgICAgICAgICA8di1jb2wgIGNsYXNzPVwibWEtMCBwYS0wXCI+XG4gICAgICAgICAgICA8di10ZXh0YXJlYVxuICAgICAgICAgICAgICBjbGFzcz1cIm1sLTQgbXItNFwiXG4gICAgICAgICAgICAgIGZpbGxlZFxuICAgICAgICAgICAgICByb3dzPVwiMVwiXG4gICAgICAgICAgICAgIHNvbG9cbiAgICAgICAgICAgICAgZmxhdFxuICAgICAgICAgICAgICBkZW5zZVxuICAgICAgICAgICAgICBoaWRlLWRldGFpbHNcbiAgICAgICAgICAgICAgdi1tb2RlbD1cInByb21wdEJcIlxuICAgICAgICAgICAgICA+PC92LXRleHRhcmVhPlxuICAgICAgICAgIDwvdi1jb2w+XG4gICAgICAgIDwvdi1yb3c+XG4gICAgICA8L3YtY29udGFpbmVyPlxuICAgIDwvdi1mb290ZXI+XG5cbiAgICA8di1hbGVydCBhcHAgOnZhbHVlPVwiYWxlcnRcIiBcbiAgICBwcm9taW5lbnQgXG4gICAgZGlzbWlzc2libGVcbiAgICBlbGV2YXRpb249XCIxNlwiXG5cbiAgICB0eXBlPVwiZXJyb3JcIlxuICAgID57e2FsZXJ0TWVzc2FnZX19PC92LWFsZXJ0PlxuICA8L3YtYXBwPlxuPC90ZW1wbGF0ZT5cbjxzdHlsZT5cbiAgLmltZ2gge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgICBvYmplY3QtZml0OiBjb250YWluO1xuICAgIG1pbi13aWR0aDoxMDAlO1xuICAgIG1pbi1oZWlnaHQ6MTAwJTtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgbWF4LWhlaWdodDogMTAwJTtcbiAgICBtYXJnaW4tYm90dG9tOiA0cHg7XG4gIH1cbiAgLnYtYWxlcnQge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGxlZnQ6MDtcbiAgd2lkdGg6MTAwJTtcbiAgdG9wOiAwcHg7XG4gIHotaW5kZXg6IDEwMDAwO1xuICBtYXJnaW46IDAgYXV0bzsgXG59XG48L3N0eWxlPlxuPHN0eWxlID5cbiAgLnJlbmRlcl9idXR0b24ge1xuICAgIHdpZHRoOjIyNHB4O1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICBib3R0b206IC0ycHg7XG4gICAgcmlnaHQ6IDE2cHg7XG4gIH1cbiAgLnNhdmVfYnV0dG9uIHtcbiAgICB3aWR0aDo1MHB4O1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICBib3R0b206IDIycHg7XG4gICAgbGVmdDogMHB4O1xuICB9XG4gIC5kZWxldGVfYnV0dG9uIHtcbiAgICB3aWR0aDo1MHB4O1xuICAgIHBvc2l0aW9uOiBmaXhlZDtcbiAgICBib3R0b206IDIycHg7XG4gICAgbGVmdDogNjZweDtcbiAgfVxuXG4gICNpbWdjb250YWluZXIgPiBpbWcge1xuICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIG9iamVjdC1maXQ6IGNvbnRhaW47XG4gICAgbWluLXdpZHRoOjEwMCU7XG4gICAgbWluLWhlaWdodDoxMDAlO1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgICBtYXgtaGVpZ2h0OiAxMDAlO1xuICB9XG4gICNoaXN0b3J5Y29udGFpbmVyID4gaW1nIHtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gIH1cbiAgOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgd2lkdGg6IDVweDtcbiAgfVxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcbiAgICBiYWNrZ3JvdW5kOiBibGFjaztcbiAgICBvcGFjaXR5OiAwLjU7XG4gIH1cbiAgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgYmFja2dyb3VuZDojMTgxODE4O1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgfVxuICA6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiAjMmMyYzJjO1xuICAgIG9wYWNpdHk6IDEuMDtcbiAgfVxuPC9zdHlsZT5cbjxzY3JpcHQ+XG4gIGltcG9ydCBJbWFnZVRodW1iIGZyb20gJy4vSW1hZ2VUaHVtYidcbiAgZXhwb3J0IGRlZmF1bHQge1xuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgIEltYWdlVGh1bWIsXG4gICAgfSxcbiAgICBkYXRhOiAoKSA9PiAoe1xuICAgICAgcG9zc2libGVfbW9kZXM6IFsnVGV4dCAtPiBJbWFnZScsICdMaXN0IC0+IEltYWdlJ10sXG4gICAgICBjdXJyZW50X21vZGU6IDAsXG4gICAgICBhbGVydDogZmFsc2UsXG4gICAgICBhbGVydE1lc3NhZ2U6IFwiV2FybmluZywgZ2VuZXJhdGVkIGltYWdlcyBjb250YWluZWQgc29tZSBub3Qgc2FmZSBmb3Igd29yayBjb250ZW50IGFuZCBoYXZlIGJlZW4gcmVwbGFjZWQuXCIsXG4gICAgICBwcm9tcHQ6IFwicHJvZHVjdCBwaG90bywgYmVhdXRpZnVsIHZhc2UsIHplbiBnYXJkZW4sIHN0aWxsIGxpZmUsIHBob3RvcmVhbCwgYm9rZWgsIGRlcHRoIG9mIGZpZWxkLCBjYWxtaW5nXCIsXG4gICAgICBpbWFnZV9oaXN0b3J5OiBbXSxcblxuICAgICAgaW1hZ2VfaWQ6JycsXG4gICAgICBzZWxlY3RlZF9pbWFnZV9pZDonJyxcbiAgICAgIHNlbGVjdGVkX2ltYWdlX3NhdmVkOmZhbHNlLFxuXG4gICAgICBwcm9tcHRBOiBcInByb2R1Y3QgcGhvdG8sIGJlYXV0aWZ1bCB2YXNlLCB6ZW4gZ2FyZGVuLCBzdGlsbCBsaWZlLCBwaG90b3JlYWwsIGJva2VoLCBkZXB0aCBvZiBmaWVsZCwgY2FsbWluZ1wiLFxuICAgICAgcHJvbXB0QjogXCJyZW5haXNzYW5jZSBwYWludGluZywgYmVhdXRpZnVsIHZhc2UsIHplbiBnYXJkZW4sIHN0aWxsIGxpZmUsIHBob3RvcmVhbCwgYm9rZWgsIGRlcHRoIG9mIGZpZWxkLCBjYWxtaW5nXCIsXG4gICAgICBwcm9tcHRfYmxlbmQ6IDAuNSxcblxuICAgICAgc2VlZDo0MixcbiAgICAgIHdpZHRoOiB7IGxhYmVsOiAnd2lkdGgnLCB2YWw6IDUxMiwgY29sb3I6ICdibHVlIGxpZ2h0ZW4tMSd9LFxuICAgICAgaGVpZ2h0OiB7IGxhYmVsOiAnaGVpZ2h0JywgdmFsOiA1MTIsIGNvbG9yOiAnYmx1ZSBsaWdodGVuLTEnfSxcbiAgICAgIHNjYWxlOiB7IGxhYmVsOiAnc2NhbGUnLCB2YWw6IDcsIGNvbG9yOiAnYmx1ZSBsaWdodGVuLTEnIH0sXG4gICAgICBzdGVwczogeyBsYWJlbDogJ3N0ZXBzJywgdmFsOiAyNSwgY29sb3I6ICdibHVlIGxpZ2h0ZW4tMScgfSxcbiAgICAgIG51bV9vZl9pbWFnZXM6IDEsXG4gICAgfSksXG4gICAgbW91bnRlZCgpIHtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMub25XaW5kb3dSZXNpemUpO1xuICAgICAgY29uc3QgbG9hZEhpc3RvcnlPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgXG4gICAgICAgICAgICAgICAgdXNlcm5hbWU6ICcnLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfTtcbiAgICAgIGZldGNoKHRoaXMuYXBpX3NlcnZlciArICcvbG9hZF9oaXN0b3J5LycsIGxvYWRIaXN0b3J5T3B0aW9ucylcbiAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4gcmVzcG9uc2UuanNvbigpKVxuICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICBpZiAoZGF0YS5yZXN1bHQgPT0gJ09LJykge1xuICAgICAgICAgICAgZGF0YS5wcm9tcHRzLmZvckVhY2gocHJvbXB0PT4ge1xuICAgICAgICAgICAgICB0aGlzLmltYWdlX2hpc3RvcnkucHVzaCgge1xuICAgICAgICAgICAgICAgICAgcHJvbXB0X2lkOiBwcm9tcHQucHJvbXB0X2lkLFxuICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgc2VlZDogcHJvbXB0LnNlZWQsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiBwcm9tcHQud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogcHJvbXB0LmhlaWdodCxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGU6IHByb21wdC5zY2FsZSxcbiAgICAgICAgICAgICAgICAgICAgc3RlcHM6IHByb21wdC5zdGVwcyxcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0IDogcHJvbXB0LnByb21wdCxcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0X2lkOiBwcm9tcHQucHJvbXB0X2lkLFxuICAgICAgICAgICAgICAgICAgICBzYXZlZDogcHJvbXB0LnNhdmVkLFxuICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHByb21wdC5zdGF0dXMsXG4gICAgICAgICAgICAgICAgICAgIG1vZGU6IHByb21wdC5tb2RlLFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGRlc3Ryb3llZCgpIHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMub25XaW5kb3dSZXNpemUpO1xuICAgIH0sXG4gICAgd2F0Y2ggOntcblxuICAgIH0sXG4gICAgbWV0aG9kczoge1xuICAgICAgdGltZV9lc3RpbWF0ZSh3aWR0aCwgaGVpZ2h0LCBzdGVwcykge1xuICAgICAgICBjb25zdCBwZXJfcyA9IDIyMDAwLjAgLyAoNzY4ICogNzY4KSAvIDUwLjBcbiAgICAgICAgY29uc3QgcGVyX3cgPSAyMjAwMCAvICg1MCAqIHBlcl9zKSAvICg3NjggKiA3NjgpXG5cbiAgICAgICAgY29uc3QgdG90YWxfbXMgPSAocGVyX3cgKiB3aWR0aCkgKiAocGVyX3cgKiBoZWlnaHQpICogKHBlcl9zICogc3RlcHMpXG4gICAgICAgIHJldHVybiB0b3RhbF9tcyAqIDEuMVxuICAgICAgfSxcbiAgICAgIHNob3dfaW1hZ2UgKHNldHRpbmdzLCB1cmwpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2VlZCA9IHNldHRpbmdzLnNlZWQ7XG4gICAgICAgIHRoaXMud2lkdGgudmFsID0gc2V0dGluZ3Mud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0LnZhbCA9IHNldHRpbmdzLmhlaWdodDtcbiAgICAgICAgdGhpcy5zdGVwcy52YWwgPSBzZXR0aW5ncy5zdGVwcztcbiAgICAgICAgdGhpcy5zY2FsZS52YWwgPSBzZXR0aW5ncy5zY2FsZTtcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9pbWFnZV9pZCA9IHNldHRpbmdzLnByb21wdF9pZDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZF9pbWFnZV9zYXZlZCA9IHNldHRpbmdzLnNhdmVkO1xuICAgICAgICB0aGlzLmN1cnJlbnRfbW9kZSA9IHNldHRpbmdzLm1vZGU7XG4gICAgICAgIGlmKHNldHRpbmdzLm1vZGUgPT0gJ0xpc3QgLT4gSW1hZ2UnKXtcbiAgICAgICAgICB0aGlzLnByb21wdEEgPSBzZXR0aW5ncy5wcm9tcHRbMF0udGV4dDtcbiAgICAgICAgICB0aGlzLnByb21wdEIgPSBzZXR0aW5ncy5wcm9tcHRbMV0udGV4dDtcbiAgICAgICAgICB0aGlzLnByb21wdF9ibGVuZCA9IHNldHRpbmdzLnByb21wdFsxXS53ZWlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wcm9tcHQgPSBzZXR0aW5ncy5wcm9tcHQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGlzcGxheV9pbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkaXNwbGF5X2ltYWdlJylcbiAgICAgICAgaWYoZGlzcGxheV9pbWFnZSAhPSBudWxsKXtcbiAgICAgICAgICBkaXNwbGF5X2ltYWdlLnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsKVxuICAgICAgICAgIHRoaXMub25XaW5kb3dSZXNpemUoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbWdjb250YWluZXInKS5pbm5lckhUTUwgPSAnJ1xuICAgICAgICAgIGxldCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuICAgICAgICAgIGltZy5pZCA9IFwiZGlzcGxheV9pbWFnZVwiXG4gICAgICAgICAgdmFyIGRvd25sb2FkaW5nSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICBkb3dubG9hZGluZ0ltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaW1nLnNyYyAgPSB1cmw7IFxuICAgICAgICAgIH1cbiAgICAgICAgICBkb3dubG9hZGluZ0ltYWdlLnNyYyA9IHVybDtcbiAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaW1nY29udGFpbmVyJykuYXBwZW5kQ2hpbGQoaW1nKVxuXG4gICAgICAgICAgdGhpcy5vbldpbmRvd1Jlc2l6ZSgpXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0ZXh0YXJlYV9rZXlwcmVzcygpIHtcbiAgICAgICAgICB0aGlzLm9uR2VuZXJhdGUoKTtcbiAgICAgIH0sXG5cbiAgICAgIG9uU2F2ZSgpe1xuICAgICAgICBjb25zdCBzYXZlT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IFxuICAgICAgICAgICAgICAgIHByb21wdF9pZDogdGhpcy5zZWxlY3RlZF9pbWFnZV9pZCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH07XG5cbiAgICAgICAgZmV0Y2godGhpcy5hcGlfc2VydmVyICsgJy9zYXZlX3Byb21wdC8nLCBzYXZlT3B0aW9ucylcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnJlc3VsdCA9PSAnT0snKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgICAgICAgICAgICBmb3IoaTsgaSA8IHRoaXMuaW1hZ2VfaGlzdG9yeS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWRfaW1hZ2VfaWQgPT0gdGhpcy5pbWFnZV9oaXN0b3J5W2ldLnByb21wdF9pZCl7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZV9oaXN0b3J5W2ldLnNldHRpbmdzLnNhdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZF9pbWFnZV9zYXZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnJlc3VsdCA9PSBcIkVSUlwiKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLndhcm5pbmcoZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBvbkRlbGV0ZSgpe1xuICAgICAgICBjb25zdCBkZWxldGVPcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgXG4gICAgICAgICAgICAgICAgcHJvbXB0X2lkOiB0aGlzLnNlbGVjdGVkX2ltYWdlX2lkLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfTtcbiAgICAgICAgZmV0Y2godGhpcy5hcGlfc2VydmVyICsgJy9kZWxldGVfcHJvbXB0LycsIGRlbGV0ZU9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXN1bHQgPT0gJ09LJykge1xuICAgICAgICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICBmb3IoaTsgaSA8IHRoaXMuaW1hZ2VfaGlzdG9yeS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0ZWRfaW1hZ2VfaWQgPT0gdGhpcy5pbWFnZV9oaXN0b3J5W2ldLnByb21wdF9pZCl7XG4gICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZihmb3VuZCl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VfaGlzdG9yeS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGkgPiAwICYmIHRoaXMuaW1hZ2VfaGlzdG9yeS5sZW5ndGggPiAwKXtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkX2ltYWdlX2lkID0gdGhpcy5pbWFnZV9oaXN0b3J5W2ktMV0ucHJvbXB0X2lkXG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZF9pbWFnZV9zYXZlZCA9IHRoaXMuaW1hZ2VfaGlzdG9yeVtpLTFdLnNldHRpbmdzLnNhdmVkO1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXNwbGF5X2ltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Rpc3BsYXlfaW1hZ2UnKVxuICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlfaW1hZ2Uuc2V0QXR0cmlidXRlKCdzcmMnLCB0aGlzLmFwaV9zZXJ2ZXIgKyBcIi9kb3dubG9hZF9wcm9tcHQvP3Byb21wdF9pZD1cIiArIHRoaXMuaW1hZ2VfaGlzdG9yeVtpLTFdLnByb21wdF9pZClcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uV2luZG93UmVzaXplKClcbiAgICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRfaW1hZ2VfaWQgPSAnJ1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRfaW1hZ2Vfc2F2ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5yZXN1bHQgPT0gXCJFUlJcIikge1xuICAgICAgICAgICAgICAgICAgdGhpcy53YXJuaW5nKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgXG4gICAgICB9LFxuICAgICAgb25FeHBsb3JlKCl7XG4gICAgICAgIHRoaXMuc2VlZCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMDAwMDAwKTtcbiAgICAgICAgdGhpcy5vbkdlbmVyYXRlKCk7XG4gICAgICB9LFxuICAgICAgb25HZW5lcmF0ZSgpe1xuXG4gICAgICAgIGZvcih2YXIgaT0wOyBpIDwgdGhpcy5udW1fb2ZfaW1hZ2VzOyBpKyspe1xuICAgICAgICAgIGNvbnN0IHNlZWRfbnVtYmVyID0gdGhpcy5zZWVkICsgaSArIGkgKiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwMDApO1xuICAgICAgICAgIGNvbnN0IHByb21wdF92YWx1ZSA9IHRoaXMuY3VycmVudF9tb2RlID09IDE/IFxuICAgICAgICAgICAgICAgICAgICBbe1xuICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMucHJvbXB0QSxcbiAgICAgICAgICAgICAgICAgICAgICB3ZWlnaHQ6IDEuMCAtIHRoaXMucHJvbXB0X2JsZW5kLFxuICAgICAgICAgICAgICAgICAgICB9LHtcbiAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLnByb21wdEIsXG4gICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0OiB0aGlzLnByb21wdF9ibGVuZFxuICAgICAgICAgICAgICAgICAgICB9XSA6IHRoaXMucHJvbXB0XG5cbiAgICAgICAgICBmZXRjaCh0aGlzLmFwaV9zZXJ2ZXIgKyAnL3N1Ym1pdF9wcm9tcHQvJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgXG4gICAgICAgICAgICAgICAgICAgIHByb21wdDogcHJvbXB0X3ZhbHVlLFxuICAgICAgICAgICAgICAgICAgICB3OiB0aGlzLndpZHRoLnZhbCxcbiAgICAgICAgICAgICAgICAgICAgaDogdGhpcy5oZWlnaHQudmFsLFxuICAgICAgICAgICAgICAgICAgICBzY2FsZTogdGhpcy5zY2FsZS52YWwsXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBzOiB0aGlzLnN0ZXBzLnZhbCxcbiAgICAgICAgICAgICAgICAgICAgc2VlZDogc2VlZF9udW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIG1vZGU6IHRoaXMuY3VycmVudF9tb2RlLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9IClcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xuICAgICAgICAgICAgICBpZihkYXRhLnJlc3VsdCA9PSBcIk9LXCIpe1xuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VfaGlzdG9yeS5wdXNoKCB7XG4gICAgICAgICAgICAgICAgICBwcm9tcHRfaWQ6IGRhdGEucHJvbXB0X2lkLFxuICAgICAgICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICAgICAgc2VlZDogc2VlZF9udW1iZXIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLndpZHRoLnZhbCxcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodC52YWwsXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlOiB0aGlzLnNjYWxlLnZhbCxcbiAgICAgICAgICAgICAgICAgICAgc3RlcHM6IHRoaXMuc3RlcHMudmFsLFxuICAgICAgICAgICAgICAgICAgICBwcm9tcHQgOiBwcm9tcHRfdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHNhdmVkOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogdGhpcy5jdXJyZW50X21vZGUsXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1czogMCxcbiAgICAgICAgICAgICAgICAgICAgcHJvbXB0X2lkOiBkYXRhLnByb21wdF9pZCxcbiAgICAgICAgICAgICAgICAgICAgZ2VuX3RpbWU6IHRoaXMudGltZV9lc3RpbWF0ZSh0aGlzLndpZHRoLnZhbCwgdGhpcy5oZWlnaHQudmFsLCB0aGlzLnN0ZXBzLnZhbClcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnJlc3VsdCA9PSBcIkVSUlwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53YXJuaW5nKGRhdGEubWVzc2FnZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm51bV9vZl9pbWFnZXMgPSAxXG4gICAgICB9LFxuICAgICAgb25XaW5kb3dSZXNpemUoKXtcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNpbWdjb250YWluZXInKTtcbiAgICAgICAgdmFyIGltYWdlX2NvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNtYWluJyk7XG4gICAgICAgIHZhciB3aWR0aCA9IGltYWdlX2NvbnRhaW5lci5vZmZzZXRXaWR0aDtcbiAgICAgICAgdmFyIGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodC05MDtcbiAgICAgICAgaWYodGhpcy5jdXJyZW50X21vZGUgPT0gMSl7XG4gICAgICAgICAgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0LTEzNTtcbiAgICAgICAgfSBcblxuICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSB3aWR0aCArIFwicHhcIjtcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGhlaWdodCArIFwicHhcIjtcbiAgICAgIH0sXG4gICAgICB3YXJuaW5nKHRleHQpIHtcbiAgICAgICAgdGhpcy5hbGVydE1lc3NhZ2UgPSB0ZXh0XG4gICAgICAgIHRoaXMuYWxlcnQgPSB0cnVlO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hbGVydCA9IGZhbHNlO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiaGlkZSBhbGVydCBhZnRlciAzIHNlY29uZHNcIik7XG4gICAgICAgIH0sIDMwMDApIFxuICAgICAgfVxuICAgIH1cbiAgfVxuPC9zY3JpcHQ+XG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/babel-loader/lib/index.js??clonedRuleSet-40.use[0]!./node_modules/@vue/vue-loader-v15/lib/index.js??vue-loader-options!./src/components/HelloWorld.vue?vue&type=script&lang=js&\n");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ !function() {
/******/ 	__webpack_require__.h = function() { return "732aa0bdbe224261"; }
/******/ }();
/******/ 
/******/ }
);