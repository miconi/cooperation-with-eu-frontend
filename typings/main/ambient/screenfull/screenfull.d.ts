// Compiled using typings@0.6.6
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/41232640266ad8f92cc5a6686977a153c98432dc/screenfull/screenfull.d.ts
// Type definitions for screenfull.js 2.0.0
// Project: https://github.com/sindresorhus/screenfull.js
// Definitions by: Ilia Choly <http://github.com/icholy>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare var screenfull: IScreenfull;

interface IScreenfullRaw {
  requestFullscreen?: string;
  exitFullscreen?: string;
  fullscreenElement?: string;
  fullscreenEnabled?: string;
  fullscreenchange?: string;
  fullscreenerror?: string;
}

interface IScreenfull {
  isFullscreen: boolean;
  element: Element;
  enabled: boolean;
  raw: IScreenfullRaw;
  request(elem?: Element): void;
  toggle(elem?: Element): void;
  exit(): void;
}