import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const textures = [
  'Ghost_BaseColor.png',
  'Ghost_Normal.png',
  'dungeon_texture.png',
];

const models = [
  'wall_01.glb',
  'wall_02.glb',
  'wall_03.glb',
  'wall_04.glb',
  'wall_05.glb',

  'roof_01.glb',
  'roof_02.glb',
  'roof_03.glb',
  'roof_04.glb',
  'roof_05.glb',
  'roof_06.glb',

  'floor_01.glb',
  'floor_02.glb',
  'floor_03.glb',
  'floor_04.glb',
  'floor_05.glb',
  'floor_06.glb',

  'corner_01.glb',
  'corner_02.glb',
  'corner_03.glb',
  'corner_04.glb',
  'corner_05.glb',

  'edge_01.glb',
  'edge_02.glb',
  'edge_03.glb',
  'edge_04.glb',

  'edge_wall_01.glb',

  'ghost.glb',

  'finish-object.glb',

  'floor_spikes.glb',
  'floor_spikes_base.glb',

  'coin.glb',

  'wall_spikes.glb',
];

const pixiAssets = [
  'assets/arrow-right.png',
  'assets/arrow-left.png',
  'assets/arrow-up.png',
  'assets/arrow-down.png',
  'assets/arrow-clockwise.png',
  'assets/arrow-counter-clockwise.png',
  'assets/sound-icon.png',
  'assets/sound-icon-mute.png',
  'fonts/casper.ttf',
  'fonts/riky.ttf',
];

const audio = [
  'death.mp3',
  'swoosh.mp3',
  'coin_pickup.mp3',
  'music.mp3',
]

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

    pixiAssets.forEach((assetFilename) => {
      const assetName = assetFilename.replace(/\.[^/.]+$/, "");
      // console.log(textureName, textureFilename);

      PIXI.Assets.add({ alias: assetName, src: assetFilename });

      texturesNames.push(assetName);
    });

    const texturesPromise = PIXI.Assets.load(texturesNames);

    texturesPromise.then((textures) => {
      texturesNames.forEach((name) => {
        this._onAssetLoad(textures[name], name);
      });

      this._loadThreeJSAssets();
    });
  }

  _loadThreeJSAssets() {
    this._loadTextures();
    this._loadModels();
    this._loadAudio();

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

  _loadAudio() {
    const audioLoader = new THREE.AudioLoader(this.threeJSManager);

    const audioBasePath = '/audio/';

    audio.forEach((audioFilename) => {
      const audioFullPath = `${audioBasePath}${audioFilename}`;
      const audioName = audioFilename.replace(/\.[^/.]+$/, "");
      audioLoader.load(audioFullPath, (audioBuffer) => this._onAssetLoad(audioBuffer, audioName));
    });
  }

  _onAssetLoad(asset, name) {
    Loader.assets[name] = asset;
  }
}
