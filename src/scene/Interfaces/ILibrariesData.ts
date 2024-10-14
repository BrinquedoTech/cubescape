import * as THREE from 'three';
import * as PIXI from 'pixi.js';

export interface ILibrariesData {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pixiApp: PIXI.Application;
}