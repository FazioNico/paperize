"use strict";(self.webpackChunkPaperize=self.webpackChunkPaperize||[]).push([[1241],{1241:(M,_,p)=>{p.r(_),p.d(_,{createReadableStreamWrapper:()=>k,createTransformStreamWrapper:()=>D,createWrappingReadableSource:()=>l,createWrappingTransformer:()=>P,createWrappingWritableSink:()=>W,createWritableStreamWrapper:()=>B}),typeof window<"u"||typeof global<"u"&&global;var y=function(r,e){return(y=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])})(r,e)};function v(r,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+e+" is not a constructor or null");function t(){this.constructor=r}y(r,e),r.prototype=null===e?Object.create(e):(t.prototype=e.prototype,new t)}function o(r){if(!r)throw new TypeError("Assertion failed")}function u(){}function d(r){return"object"==typeof r&&null!==r||"function"==typeof r}function c(r){if("function"!=typeof r)return!1;var e=!1;try{new r({start:function(){e=!0}})}catch{}return e}function h(r){return!!d(r)&&"function"==typeof r.getReader}function f(r){return!!d(r)&&"function"==typeof r.getWriter}function g(r){return!!d(r)&&!!h(r.readable)&&!!f(r.writable)}function b(r){try{return r.getReader({mode:"byob"}).releaseLock(),!0}catch{return!1}}function k(r){var t;o(!!c(t=r)&&!!h(new t));var e=function(t){try{return new t({type:"bytes"}),!0}catch{return!1}}(r);return function(t,n){var i=(void 0===n?{}:n).type;if("bytes"!==(i=R(i))||e||(i=void 0),t.constructor===r&&("bytes"!==i||b(t)))return t;if("bytes"===i){var a=l(t,{type:i});return new r(a)}return a=l(t),new r(a)}}function l(r,e){var t=(void 0===e?{}:e).type;return o(h(r)),o(!1===r.locked),"bytes"===(t=R(t))?new T(r):new j(r)}function R(r){var e=r+"";if("bytes"===e)return e;if(void 0===r)return r;throw new RangeError("Invalid type is specified")}var m=function(){function r(e){this._underlyingReader=void 0,this._readerMode=void 0,this._readableStreamController=void 0,this._pendingRead=void 0,this._underlyingStream=e,this._attachDefaultReader()}return r.prototype.start=function(e){this._readableStreamController=e},r.prototype.cancel=function(e){return o(void 0!==this._underlyingReader),this._underlyingReader.cancel(e)},r.prototype._attachDefaultReader=function(){if("default"!==this._readerMode){this._detachReader();var e=this._underlyingStream.getReader();this._readerMode="default",this._attachReader(e)}},r.prototype._attachReader=function(e){var t=this;o(void 0===this._underlyingReader),this._underlyingReader=e;var n=this._underlyingReader.closed;n&&n.then(function(){return t._finishPendingRead()}).then(function(){e===t._underlyingReader&&t._readableStreamController.close()},function(i){e===t._underlyingReader&&t._readableStreamController.error(i)}).catch(u)},r.prototype._detachReader=function(){void 0!==this._underlyingReader&&(this._underlyingReader.releaseLock(),this._underlyingReader=void 0,this._readerMode=void 0)},r.prototype._pullWithDefaultReader=function(){var e=this;this._attachDefaultReader();var t=this._underlyingReader.read().then(function(n){var i=e._readableStreamController;n.done?e._tryClose():i.enqueue(n.value)});return this._setPendingRead(t),t},r.prototype._tryClose=function(){try{this._readableStreamController.close()}catch{}},r.prototype._setPendingRead=function(e){var t,n=this,i=function(){n._pendingRead===t&&(n._pendingRead=void 0)};this._pendingRead=t=e.then(i,i)},r.prototype._finishPendingRead=function(){var e=this;if(this._pendingRead){var t=function(){return e._finishPendingRead()};return this._pendingRead.then(t,t)}},r}(),j=function(r){function e(){return null!==r&&r.apply(this,arguments)||this}return v(e,r),e.prototype.pull=function(){return this._pullWithDefaultReader()},e}(m);function w(r){return new Uint8Array(r.buffer,r.byteOffset,r.byteLength)}var T=function(r){function e(t){var n=this,i=b(t);return(n=r.call(this,t)||this)._supportsByob=i,n}return v(e,r),Object.defineProperty(e.prototype,"type",{get:function(){return"bytes"},enumerable:!1,configurable:!0}),e.prototype._attachByobReader=function(){if("byob"!==this._readerMode){o(this._supportsByob),this._detachReader();var t=this._underlyingStream.getReader({mode:"byob"});this._readerMode="byob",this._attachReader(t)}},e.prototype.pull=function(){if(this._supportsByob){var t=this._readableStreamController.byobRequest;if(t)return this._pullWithByobRequest(t)}return this._pullWithDefaultReader()},e.prototype._pullWithByobRequest=function(t){var n=this;this._attachByobReader();var i=new Uint8Array(t.view.byteLength),a=this._underlyingReader.read(i).then(function(s){var C,E;s.done?(n._tryClose(),t.respond(0)):(C=t.view,E=w(s.value),w(C).set(E,0),t.respond(s.value.byteLength))});return this._setPendingRead(a),a},e}(m);function B(r){return o(!!c(e=r)&&!!f(new e)),function(e){if(e.constructor===r)return e;var t=W(e);return new r(t)};var e}function W(r){o(f(r)),o(!1===r.locked);var e=r.getWriter();return new O(e)}var O=function(){function r(e){var t=this;this._writableStreamController=void 0,this._pendingWrite=void 0,this._state="writable",this._storedError=void 0,this._underlyingWriter=e,this._errorPromise=new Promise(function(n,i){t._errorPromiseReject=i}),this._errorPromise.catch(u)}return r.prototype.start=function(e){var t=this;this._writableStreamController=e,this._underlyingWriter.closed.then(function(){t._state="closed"}).catch(function(n){return t._finishErroring(n)})},r.prototype.write=function(e){var t=this,n=this._underlyingWriter;if(null===n.desiredSize)return n.ready;var i=n.write(e);i.catch(function(s){return t._finishErroring(s)}),n.ready.catch(function(s){return t._startErroring(s)});var a=Promise.race([i,this._errorPromise]);return this._setPendingWrite(a),a},r.prototype.close=function(){var e=this;return void 0===this._pendingWrite?this._underlyingWriter.close():this._finishPendingWrite().then(function(){return e.close()})},r.prototype.abort=function(e){if("errored"!==this._state)return this._underlyingWriter.abort(e)},r.prototype._setPendingWrite=function(e){var t,n=this,i=function(){n._pendingWrite===t&&(n._pendingWrite=void 0)};this._pendingWrite=t=e.then(i,i)},r.prototype._finishPendingWrite=function(){var e=this;if(void 0===this._pendingWrite)return Promise.resolve();var t=function(){return e._finishPendingWrite()};return this._pendingWrite.then(t,t)},r.prototype._startErroring=function(e){var t=this;if("writable"===this._state){this._state="erroring",this._storedError=e;var n=function(){return t._finishErroring(e)};void 0===this._pendingWrite?n():this._finishPendingWrite().then(n,n),this._writableStreamController.error(e)}},r.prototype._finishErroring=function(e){"writable"===this._state&&this._startErroring(e),"erroring"===this._state&&(this._state="errored",this._errorPromiseReject(this._storedError))},r}();function D(r){return o(!!c(e=r)&&!!g(new e)),function(e){if(e.constructor===r)return e;var t=P(e);return new r(t)};var e}function P(r){o(g(r));var e=r.readable,t=r.writable;o(!1===e.locked),o(!1===t.locked);var n,i=e.getReader();try{n=t.getWriter()}catch(a){throw i.releaseLock(),a}return new L(i,n)}var L=function(){function r(e,t){var n=this;this._transformStreamController=void 0,this._onRead=function(i){if(!i.done)return n._transformStreamController.enqueue(i.value),n._reader.read().then(n._onRead)},this._onError=function(i){n._flushReject(i),n._transformStreamController.error(i),n._reader.cancel(i).catch(u),n._writer.abort(i).catch(u)},this._onTerminate=function(){n._flushResolve(),n._transformStreamController.terminate();var i=new TypeError("TransformStream terminated");n._writer.abort(i).catch(u)},this._reader=e,this._writer=t,this._flushPromise=new Promise(function(i,a){n._flushResolve=i,n._flushReject=a})}return r.prototype.start=function(e){this._transformStreamController=e,this._reader.read().then(this._onRead).then(this._onTerminate,this._onError);var t=this._reader.closed;t&&t.then(this._onTerminate,this._onError)},r.prototype.transform=function(e){return this._writer.write(e)},r.prototype.flush=function(){var e=this;return this._writer.close().then(function(){return e._flushPromise})},r}()}}]);