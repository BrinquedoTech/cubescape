import * as THREE from 'three';
import Loader from '../../Core/Loader/AssetsLoader';

export default class AudioController {
  static instance: AudioController;

  listener: THREE.AudioListener;
  sounds = {};
  music: THREE.Audio;

  coinsPool: THREE.Audio[] = [];

  private constructor() {

  }

  public static getInstance(): AudioController {
    if (!AudioController.instance) {
      AudioController.instance = new AudioController();
    }
    return AudioController.instance;
  }

  public playSound(soundName: string): void {
    const sound = this.sounds[soundName];
      
    if (sound.isPlaying) {
      sound.stop();
    }

    this.sounds[soundName].play();
  }

  public initSounds(soundNames: string[]): void {
    soundNames.forEach((soundName) => {
      this.initSound(soundName);
    });
  }

  public playCoinsSound(): void {
    const sound = this.coinsPool.find((sound) => !sound.isPlaying);

    if (sound) {
      sound.play();
    }
  }
  
  public initCoinsSound(): void {
    for (let i = 0; i < 10; i++) {
      const sound = new THREE.Audio(this.listener);
      sound.setBuffer(Loader.assets['coin_pickup'] as AudioBuffer);
      sound.setVolume(0.7);

      this.coinsPool.push(sound);
    }
  }

  public mute(): void {
    this.listener.setMasterVolume(0);
  }

  public unmute(): void {
    this.listener.setMasterVolume(1);
  }

  initSound(soundName: string): void {
    const sound = new THREE.Audio(this.listener);
    sound.setBuffer(Loader.assets[soundName] as AudioBuffer);

    sound.setVolume(1);

    this.sounds[soundName] = sound;
  }

  public initMusic(soundName: string): void {
    const music = this.music = new THREE.Audio(this.listener);
    music.setBuffer(Loader.assets[soundName] as AudioBuffer);
    music.setLoop(true);
    music.setVolume(0.5);
  }

  playMusic(): void {
    this.music.play();
  }

  initListener(camera: THREE.PerspectiveCamera): void {
    const listener = this.listener = new THREE.AudioListener();
    camera.add(listener);
  }
}

AudioController.instance = null;
