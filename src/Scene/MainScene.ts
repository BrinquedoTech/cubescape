import * as THREE from 'three';
import { RotateDirection, TurnDirection } from "../Data/Enums/Cube/RotateDirection";
import { ScreenType } from '../Data/Enums/UI/ScreenType';
import DebugConfig from '../Data/Configs/Debug/DebugConfig';
import { ILevelScore } from '../Data/Interfaces/IScore';
import AudioController from './GameScene/AudioController';
import { Direction } from '../Data/Enums/Direction';
import { ILibrariesData } from '../Data/Interfaces/IBaseSceneData';
import UI from './UI/UI';
import GameScene from './GameScene/GameScene';

export default class MainScene {
  private data: ILibrariesData;
  private scene: THREE.Scene;
  private gameScene: GameScene;
  private ui: UI;

  constructor(data: ILibrariesData) {
    this.data = data;
    this.scene = data.scene;

    this.init();
  }

  public afterAssetsLoad(): void {
    this.scene.add(this.gameScene);

    if (DebugConfig.gameplay.disableIntro) {
      this.gameScene.startGameWithoutIntro();
    } else {
      this.startIntro();
    }
  }

  public update(dt: number): void {
    this.gameScene.update(dt);
  }

  private startIntro(): void {
    this.ui.showScreen(ScreenType.Intro);
    this.gameScene.startIntro();
  }
  
  public onResize(): void {
    this.ui.onResize();
  }

  private init(): void {
    this.gameScene = new GameScene(this.data);
    this.initUI();

    this.initSignals();
  }

  private initUI(): void {
    const ui = this.ui = new UI();
    this.data.pixiApp.stage.addChild(ui);

    ui.onResize();
  }

  private initSignals(): void {
    this.initUISignals();
    this.initGameSceneSignals();
  }

  private initUISignals(): void {
    this.ui.emitter.on('rotateRight', () => this.gameScene.rotateCube(RotateDirection.Right));
    this.ui.emitter.on('rotateLeft', () => this.gameScene.rotateCube(RotateDirection.Left));
    this.ui.emitter.on('rotateUp', () => this.gameScene.rotateCube(RotateDirection.Up));
    this.ui.emitter.on('rotateDown', () => this.gameScene.rotateCube(RotateDirection.Down));
    this.ui.emitter.on('rotateClockwise', () => this.gameScene.turnCube(TurnDirection.Clockwise));
    this.ui.emitter.on('rotateCounterClockwise', () => this.gameScene.turnCube(TurnDirection.CounterClockwise));

    this.ui.emitter.on('onStartClick', () => this.gameScene.startGame());
    this.ui.emitter.on('onNextLevelClick', () => this.gameScene.startNextLevel());
    this.ui.emitter.on('onStartAgain', () => this.gameScene.startGameAgain());
    this.ui.emitter.on('onSwipe', (direction: Direction) => this.gameScene.onSwipe(direction));
  }

  private initGameSceneSignals(): void {
    this.gameScene.emitter.on('onPressStart', () => this.onPressStart());
    this.gameScene.emitter.on('updateLevelOnStartLevel', (levelIndex: number) => this.ui.updateLevelText(levelIndex));
    this.gameScene.emitter.on('onWinLevel', ({ levelTime, levelScore }) => this.onWinLevel(levelTime, levelScore));
    this.gameScene.emitter.on('updateScore', (score: number) => this.ui.updateScore(score));
    this.gameScene.emitter.on('updateLives', (lives: number) => this.ui.updateLives(lives));
    this.gameScene.emitter.on('onLoseGame', () => this.onLoseGame());
    this.gameScene.emitter.on('onWinGame', (score: number) => this.onWinGame(score));
  }

  private onWinLevel(levelTime: number, levelScore: ILevelScore): void {
    this.ui.setLevelTime(levelTime);
    this.ui.setScoreForLevel(levelScore);
    this.ui.showScreen(ScreenType.LevelWin);
    this.ui.hideScreen(ScreenType.Gameplay);
  }

  private onPressStart(): void {
    if (this.ui.getActiveScreen() === ScreenType.Intro) {
      this.ui.hideScreen(ScreenType.Intro);
      this.ui.showScreen(ScreenType.Gameplay);
      this.gameScene.startGame();

      setTimeout(() => {
        AudioController.getInstance().playMusic();
      }, 200);
    }

    if (this.ui.getActiveScreen() === ScreenType.LevelWin) {
      this.ui.hideScreen(ScreenType.LevelWin);
      this.ui.showScreen(ScreenType.Gameplay);
      this.gameScene.startNextLevel();
    }

    if (this.ui.getActiveScreen() === ScreenType.Lose) {
      this.ui.hideScreen(ScreenType.Lose);
      this.ui.showScreen(ScreenType.Gameplay);
      this.gameScene.startGameAgain();
    }

    if (this.ui.getActiveScreen() === ScreenType.GameWin) {
      this.ui.hideScreen(ScreenType.GameWin);
      this.ui.showScreen(ScreenType.Gameplay);
      this.gameScene.startGameAgain();
    }
  }

  private onLoseGame(): void {
    this.ui.showScreen(ScreenType.Lose);
    this.ui.hideScreen(ScreenType.Gameplay);
  }

  private onWinGame(score: number): void {
    this.ui.setOverallScore(score);
    this.ui.showScreen(ScreenType.GameWin);
    this.ui.hideScreen(ScreenType.Gameplay);

    // Integração com API de pontuações
    try {
      // Salvar via API global, se disponível
      const anyWindow = window as any;
      if (anyWindow && anyWindow.gameScoreAPI && anyWindow.gameScoreAPI.isInitialized) {
        anyWindow.gameScoreAPI.saveScore('cubescape', score, { levels: 'all' })
          .then(() => {
            // Atualizar ranking, se existir
            if (anyWindow.refreshRanking) anyWindow.refreshRanking();
          })
          .catch((e: any) => console.error('Erro ao salvar score (API):', e));
      }

      // Notificar parent via postMessage (compatibilidade WorkAdventure)
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'GAME_SCORE',
          gameId: 'cubescape',
          score: score,
        }, '*');
      }
    } catch (err) {
      console.error('Falha ao integrar score:', err);
    }
  }
}
