import Phaser from 'phaser';
import BaseState from './BaseState';
import cfg from './config';

class StartGameState extends BaseState {
  preload() {
    super.preload();
    
    this.load.spritesheet('start-game', 'imgs/start-main.png', 970, 100, 21);
    this.load.image('loading', 'imgs/loading.png');
  }

  create() {
    super.create();

    this.startGameText = this.add.sprite(cfg.width / 2, cfg.height / 2, 'start-game');
    this.startGameText.anchor.setTo(0.5);
    this.startGameText.animations.add('start');
    this.startGameText.animations.play('start', 30, true);

    const startGame = () => {
      this.game.state.start('Game');
    }

    this.startButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.startButton.onDown.add(startGame, this);
  }
}

export default StartGameState;