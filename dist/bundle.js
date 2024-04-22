/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Lexer.ts":
/*!**********************!*\
  !*** ./src/Lexer.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   EOF: () => (/* binding */ EOF),\n/* harmony export */   ERROR: () => (/* binding */ ERROR),\n/* harmony export */   NEWLINE: () => (/* binding */ NEWLINE),\n/* harmony export */   SPACE: () => (/* binding */ SPACE),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst match = (str, regex) => str.match(regex);\nconst EOF = \"EOF\";\nconst ERROR = \"ERROR\";\nconst NEWLINE = \"NEWLINE\";\nconst SPACE = \"SPACE\";\nconst defaultLexems = {\n    [NEWLINE]: new RegExp(`(?<${NEWLINE}>\\\\n)`),\n    [SPACE]: new RegExp(`(?<${SPACE}>[^\\\\S\\\\r\\\\n]+)`),\n};\nfunction combine(lexems) {\n    const source = Object.values(lexems).reduce((prev, current) => prev + \"|\" + current.source, \"\");\n    return new RegExp(`^(${source.slice(1)})`, \"u\");\n}\nvar LexerState;\n(function (LexerState) {\n    LexerState[LexerState[\"INITIAL\"] = 0] = \"INITIAL\";\n    LexerState[LexerState[\"STRING\"] = 1] = \"STRING\";\n})(LexerState || (LexerState = {}));\nclass Lexer {\n    constructor(input, lexems) {\n        this.input = input;\n        this.lexems = Object.assign(Object.assign({}, defaultLexems), Object.keys(lexems));\n        this.regex = combine(lexems);\n        this.row = 1;\n        this.col = 1;\n        this.error = false;\n        this.state = LexerState.INITIAL;\n    }\n    step(length) {\n        this.input = this.input.slice(length);\n    }\n    parse() {\n        if (this.input == \"\") {\n            return { type: EOF, value: \"\", row: -1, col: -1 };\n        }\n        let matchResult = match(this.input, this.regex);\n        let value = matchResult && matchResult.input;\n        let groups = matchResult && matchResult.groups;\n        let lexem = groups && Object.keys(groups).find((key) => !!groups[key] || groups[key] == '');\n        if (!matchResult) {\n            let col = this.col;\n            this.step(1);\n            this.col += 1;\n            if (this.error) {\n                return this.parse();\n            }\n            else {\n                this.error = true;\n                return {\n                    type: ERROR,\n                    value: \"\",\n                    row: this.row,\n                    col,\n                };\n            }\n        }\n        if (this.error) {\n            this.error = false;\n        }\n        if (lexem == NEWLINE) {\n            this.step(1);\n            this.row += 1;\n            this.col = 1;\n            return this.parse();\n        }\n        else if (lexem == SPACE) {\n            value = groups[lexem];\n            this.step(value.length);\n            this.col += value.length;\n            return this.parse();\n        }\n        value = groups[lexem];\n        console.log(lexem);\n        this.step(value.length);\n        let col = this.col;\n        this.col += value.length;\n        return { type: lexem, value, row: this.row, col };\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Lexer);\n\n\n//# sourceURL=webpack://lab5/./src/Lexer.ts?");

/***/ }),

/***/ "./src/config.ts":
/*!***********************!*\
  !*** ./src/config.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   controlSymbols: () => (/* binding */ controlSymbols),\n/* harmony export */   lexemList: () => (/* binding */ lexemList)\n/* harmony export */ });\nconst match = (str, regex) => str.match(regex);\nconst keyWords = {\n    AND: \"_and_\",\n};\nconst controlSymbols = {\n    NUL: 0,\n    SOH: 1,\n};\nfunction resolveControlSymbol(symbol) {\n    return controlSymbols[symbol];\n}\nfunction getControlsRegex() {\n    const controls = Object.keys(controlSymbols).join('|');\n    return new RegExp(`(?<CONTROL_SYMBOL_ALPHABETIC>\\\\$(${controls})\\\\$)`);\n}\nfunction getKeyWords(keyWords) {\n    const lexemList = {};\n    for (const key in keyWords) {\n        lexemList[key] = new RegExp(`(?<${key}>${keyWords[key]}\\\\b)`);\n    }\n    return lexemList;\n}\nfunction getNumbers() {\n    const template = (base, name) => {\n        if (base < 11) {\n            const symbol = `[0-${base - 1}]`;\n            return `(?<${name}>${symbol}${symbol}*\\\\{${base}\\\\})`;\n        }\n        const lastCharUpper = String.fromCharCode(54 + base);\n        const lastCharLower = lastCharUpper.toLowerCase();\n        const symbol = `[0-9a-${lastCharLower}A-${lastCharUpper}]`;\n        return `(?<${name}>${symbol}${symbol}*\\\\{${base}\\\\})`;\n    };\n    const lexemList = {};\n    for (let i = 2; i < 37; i++) {\n        const name = `NUMBER_${i}`;\n        lexemList[name] = new RegExp(template(i, name));\n    }\n    lexemList.NUMBER = new RegExp(`(?<NUMBER>[0-9][0-9]*)`);\n    return lexemList;\n}\nfunction getStringRegex() {\n    const controls = Object.keys(controlSymbols).join('|');\n    return new RegExp(`(?<STRING>(('[^\\p{Cc}']*')?|(%AP%.*%AP%)?|(${controls})?))`);\n}\nconst lexemList = Object.assign(Object.assign(Object.assign(Object.assign({}, getKeyWords(keyWords)), { IDENT: /(?<IDENT>(_|!|@|\\.|#)\\p{L}\\w*)/, SYMBOL_QUOTE: /(?<SYMBOL_QUOTE>\"\"\"\")/, SYMBOL: /(?<SYMBOL>\"[^\\p{Cc}]\")/, CONTROL_SYMBOL_NUMERIC: /(?<CONTROL_SYMBOL_NUMERIC>\\$([0-9]|[0-2][0-9]|30|31)\\$)/, CONTROL_SYMBOL_ALPHABETIC: getControlsRegex() }), getNumbers()), { STRING: getStringRegex() });\nconsole.log(lexemList);\n\n\n//# sourceURL=webpack://lab5/./src/config.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   lexemFormat: () => (/* binding */ lexemFormat)\n/* harmony export */ });\n/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ \"./src/config.ts\");\n/* harmony import */ var _Lexer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Lexer */ \"./src/Lexer.ts\");\n\n\nconst fs = __webpack_require__(/*! node:fs */ \"node:fs\");\nfunction lexemFormat(lexem) {\n    return `${lexem.type} (${lexem.row},${lexem.col}): ${lexem.value}`;\n}\nfunction print(lexer) {\n    let lexem = lexer.parse();\n    while (lexem.type != _Lexer__WEBPACK_IMPORTED_MODULE_1__.EOF) {\n        if (lexem.type == _Lexer__WEBPACK_IMPORTED_MODULE_1__.ERROR) {\n            console.log(`syntax error (${lexem.row},${lexem.col})`);\n        }\n        else {\n            console.log(lexemFormat(lexem));\n        }\n        lexem = lexer.parse();\n    }\n}\nfs.readFile(\"input.txt\", \"utf8\", (err, data) => {\n    if (err) {\n        console.error(err);\n        return;\n    }\n    let lexer = new _Lexer__WEBPACK_IMPORTED_MODULE_1__[\"default\"](data, _config__WEBPACK_IMPORTED_MODULE_0__.lexemList);\n    print(lexer);\n});\n\n\n//# sourceURL=webpack://lab5/./src/index.ts?");

/***/ }),

/***/ "node:fs":
/*!**************************!*\
  !*** external "node:fs" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("node:fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;