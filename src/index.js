/* Plane JS entry point file for bundlers */

import { Renderer} from './renderer.js';
import { SceneController } from './scene.js';
import { Shape } from './shape.js';

// Force bundler tree
const _Shape = Shape;
const _SceneController = new SceneController;
const _Renderer = new Renderer;