import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const textures = [
  'Ghost_BaseColor.png',
  'Ghost_Normal.png',
  'dungeon_texture.png',
];

const models = [
  'spikes_01.glb',
  'spikes_02.glb',
  'spikes_03.glb',
  'spikes_04.glb',
  'spikes_05.glb',

  'wall.glb',
  'wall_01.glb',
  'roof_01.glb',
  'roof_02.glb',
  'roof_03.glb',
  'floor_01.glb',
  'floor_02.glb',
  'corner_01.glb',
  'corner_02.glb',
  'edge_01.glb',
  'edge_01_1.glb',
  'edge_01_2.glb',
  'edge_02.glb',
  'edge_03.glb',

  'ghost.glb',
];

const pixiAssets = [
  'assets/arrow-right.png',
  'assets/arrow-left.png',
  'assets/arrow-up.png',
  'assets/arrow-down.png',
  'assets/arrow-clockwise.png',
  'assets/arrow-counter-clockwise.png',
];

const loadingPercentElement = document.querySelector('.loading-percent');

export default class Loader {
  static assets = {};

  private threeJSManager: THREE.LoadingManager;

  constructor() {
    Loader.assets = {};

    this.threeJSManager = new THREE.LoadingManager(this._onThreeJSAssetsLoaded, this._onThreeJSAssetsProgress);

    this._loadPixiAssets();
  }

  // _onBlackAssetsProgress(item, progress) { // eslint-disable-line no-unused-vars
    // progressRatio = progress;

    // const percent = Math.floor(progressRatio * 100);
    // loadingPercentElement.innerHTML = `${percent}%`;
  // }

  _onBlackAssetsLoaded() {
    // this.removeFromParent();
    // this._loadPixiAssets();
  }

  _loadPixiAssets() {
    const texturesNames = [];

    pixiAssets.forEach((textureFilename) => {
      const textureName = textureFilename.replace(/\.[^/.]+$/, "");
      // console.log(textureName, textureFilename);

      PIXI.Assets.add({ alias: textureName, src: textureFilename });

      texturesNames.push(textureName);
    });

    const texturesPromise = PIXI.Assets.load(texturesNames);

    texturesPromise.then((textures) => {
      texturesNames.forEach((name) => {
        // console.log(name, textures[name]);
        this._onAssetLoad(textures[name], name);
      });

      this._loadThreeJSAssets();
    });
  }

  _loadThreeJSAssets() {
    this._loadTextures();
    this._loadModels();

    if (textures.length === 0 && models.length === 0) {
      this._onThreeJSAssetsLoaded();
    }
  }

  _onThreeJSAssetsLoaded() {
    setTimeout(() => {
      loadingPercentElement.innerHTML = `100%`;
      loadingPercentElement.classList.add('ended');

      setTimeout(() => {
        (loadingPercentElement as HTMLElement).style.display = 'none'; // eslint-disable-line
      }, 300);
    }, 450);


    setTimeout(() => {
      const customEvent = new Event('onLoad');
      document.dispatchEvent(customEvent);
    }, 100);
  }

  _onThreeJSAssetsProgress() {
    const percent = Math.floor(0.5 * 100);
    loadingPercentElement.innerHTML = `${percent}%`;
  }

  _loadTextures() {
    const textureLoader = new THREE.TextureLoader(this.threeJSManager);

    const texturesBasePath = '/textures/';

    textures.forEach((textureFilename) => {
      const textureFullPath = `${texturesBasePath}${textureFilename}`;
      const textureName = textureFilename.replace(/\.[^/.]+$/, "");
      Loader.assets[textureName] = textureLoader.load(textureFullPath);
    });
  }

  _loadModels() {
    const gltfLoader = new GLTFLoader(this.threeJSManager);

    const modelsBasePath = '/models/';

    models.forEach((modelFilename) => {
      const modelFullPath = `${modelsBasePath}${modelFilename}`;
      const modelName = modelFilename.replace(/\.[^/.]+$/, "");
      gltfLoader.load(modelFullPath, (gltfModel) => this._onAssetLoad(gltfModel, modelName));
    });
  }

  _onAssetLoad(asset, name) {
    Loader.assets[name] = asset;
  }
}
