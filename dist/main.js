/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/entity.js":
/*!***********************!*\
  !*** ./src/entity.js ***!
  \***********************/
/*! exports provided: Entity, NexusThingy, GermThingy */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Entity\", function() { return Entity; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"NexusThingy\", function() { return NexusThingy; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GermThingy\", function() { return GermThingy; });\nconst MaxHealth = 100;\nclass Entity {\n  constructor(x, y) {\n    this.pos = {\n      x,\n      y\n    };\n    this.delta = {\n      x: 1,\n      y: 0\n    };\n    this.accel = 0;\n    this.health = MaxHealth;\n  }\n\n  update() {}\n\n  lerp() {\n    // clamp accel\n    if (this.accel >= 1) this.accel = 1;\n    if (this.accel <= 0) this.accel = 0;\n    this.pos.x += this.delta.x * this.accel;\n    this.pos.y += this.delta.y * this.accel;\n  }\n\n  render(ctx) {}\n\n  renderHealthBar(ctx) {\n    ctx.fillStyle = \"#ff0000\";\n    const {\n      x,\n      y\n    } = this.pos;\n    const barHeight = 8;\n    const barWidth = this.health;\n    ctx.fillRect(x, y - barHeight * 2, barWidth, barHeight);\n  }\n\n}\nclass NexusThingy extends Entity {\n  update() {}\n\n  render(ctx) {\n    this.renderHealthBar(ctx);\n    const {\n      x,\n      y\n    } = this.pos;\n    ctx.fillStyle = \"#00ff00\";\n    ctx.fillRect(x, y, 128, 128);\n  }\n\n} // https://imgur.com/j7VTlvc\n\nclass GermThingy extends Entity {\n  constructor(x, y) {\n    super(x, y);\n    const img = new Image();\n    img.src = 'https://i.imgur.com/fCKP3ZT.png';\n    this.img = img;\n  }\n\n  update() {\n    this.lerp();\n    this.delta.x = 1;\n    this.accel += 0.01;\n  }\n\n  render(ctx) {\n    this.renderHealthBar(ctx);\n    const {\n      x,\n      y\n    } = this.pos;\n    const size = 50;\n    ctx.drawImage(this.img, x, y, size, size);\n  }\n\n}\n\n//# sourceURL=webpack:///./src/entity.js?");

/***/ }),

/***/ "./src/game_map.js":
/*!*************************!*\
  !*** ./src/game_map.js ***!
  \*************************/
/*! exports provided: Tile, GameMap */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Tile\", function() { return Tile; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GameMap\", function() { return GameMap; });\n/* harmony import */ var _entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./entity */ \"./src/entity.js\");\n\nclass Tile {\n  constructor(id, img) {\n    this.id = id;\n    this.img = img;\n  }\n\n  update() {}\n\n  render(ctx, x, y) {\n    ctx.drawImage(this.img, x, y);\n  }\n\n}\nlet lastTileId = 0;\nlet tileRegister = new Map();\n\nfunction registerTile(imgLink) {\n  const img = new Image();\n  img.src = imgLink;\n\n  img.onload = () => {\n    let tile = new Tile(lastTileId++, img);\n    tileRegister.set(tile.id, tile);\n  };\n}\n\nfunction lookupTile(id) {\n  return tileRegister.get(id);\n}\n\nclass GameMap {\n  constructor() {\n    registerTile('https://i.imgur.com/FoeO51W.png');\n    this.tileData = [];\n    this.width = 64;\n    this.height = 64;\n\n    for (let i = 0; i < this.width * this.height; i++) {\n      this.tileData[i] = 0;\n    }\n\n    this.entities = [// spawn a nexus thingy at 256, 256\n    new _entity__WEBPACK_IMPORTED_MODULE_0__[\"NexusThingy\"](256, 256), // spawn a germ thingy at 50, 50\n    new _entity__WEBPACK_IMPORTED_MODULE_0__[\"GermThingy\"](50, 50)];\n  }\n\n  update() {\n    for (const e of this.entities) {\n      e.update();\n    }\n  }\n\n  render(ctx) {\n    for (let y = 0; y < this.height; y++) {\n      for (let x = 0; x < this.width; x++) {\n        const id = this.tileData[x + y * this.height];\n        const tileSize = 192;\n        const tile = lookupTile(id);\n\n        if (tile) {\n          tile.render(ctx, x * tileSize, y * tileSize);\n        }\n      }\n    }\n\n    for (const e of this.entities) {\n      e.render(ctx);\n    }\n  }\n\n}\n\n//# sourceURL=webpack:///./src/game_map.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./state */ \"./src/state.js\");\n\n\nfunction getCursorPosition(canvas, event) {\n  let rect = canvas.getBoundingClientRect();\n  let x = event.clientX - rect.left;\n  let y = event.clientY - rect.top;\n  return {\n    x: x,\n    y: y\n  };\n}\n\nclass Game {\n  constructor() {\n    this.container = document.querySelector(\"#game-container\");\n    this.ctx = this.container.getContext(\"2d\");\n    this.events = []; // initial game state...\n\n    this.currentState = new _state__WEBPACK_IMPORTED_MODULE_0__[\"GameState\"]();\n    this.container.addEventListener(\"click\", event => {\n      this.events.push({\n        type: \"click\",\n        event: event\n      });\n    });\n  }\n\n  update() {\n    // clear the events queue thing\n    while (this.events.length > 0) {\n      const {\n        type,\n        event\n      } = this.events.shift(); // process event types...\n\n      switch (type) {\n        case \"click\":\n          const {\n            x,\n            y\n          } = getCursorPosition(this.container, event);\n          console.log('clicked at ', x, y);\n          break;\n      }\n    }\n\n    const curr = this.currentState;\n\n    if (curr) {\n      curr.update();\n    }\n  }\n\n  render(ctx) {\n    ctx.fillStyle = \"#ffffff\";\n    ctx.fillRect(0, 0, 800, 600);\n    const curr = this.currentState;\n\n    if (curr) {\n      curr.render(ctx);\n    }\n  }\n\n  start() {\n    // TODO: fix this timestep.\n    const targetFPS = 60.0;\n    setInterval(() => {\n      const ctx = this.ctx;\n      ctx.font = \"16px Verdana\";\n      this.update();\n      this.render(ctx);\n    }, 1000 / targetFPS);\n  }\n\n}\n\nnew Game().start();\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/state.js":
/*!**********************!*\
  !*** ./src/state.js ***!
  \**********************/
/*! exports provided: GameState */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GameState\", function() { return GameState; });\n/* harmony import */ var _game_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game_map */ \"./src/game_map.js\");\n\n\nclass HUD {\n  constructor() {\n    // age starts at 1?\n    this.age = 1;\n    this.last = new Date();\n  }\n\n  update() {\n    const SECOND = 1000; // 5 seconds in a year.\n\n    const ageInterval = 5 * SECOND; // every 500ms, we age.\n\n    if (new Date() - this.last > ageInterval) {\n      this.age++;\n      this.last = new Date();\n    }\n  }\n\n  render(ctx) {\n    ctx.fillStyle = \"#000000\";\n    ctx.fillRect(0, 0, 800, 48);\n    ctx.fillStyle = \"#ffffff\";\n    ctx.fillText(`age ${this.age}`, 32, 32);\n  }\n\n}\n\nclass GameState {\n  constructor() {\n    this.hud = new HUD();\n    this.map = new _game_map__WEBPACK_IMPORTED_MODULE_0__[\"GameMap\"]();\n  }\n\n  update() {\n    this.hud.update();\n    this.map.update();\n  }\n\n  render(ctx) {\n    this.map.render(ctx); // hud renders over everything.\n\n    this.hud.render(ctx);\n  }\n\n}\n\n//# sourceURL=webpack:///./src/state.js?");

/***/ })

/******/ });