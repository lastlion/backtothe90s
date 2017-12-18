import Phaser from 'phaser';

import BaseState from './BaseState';
import Game from './GameState';
import cfg from './config';

class GameOver extends BaseState {
  preload() {
    super.preload();

    this.load.image('game-over', 'imgs/game-over.png');
    this.load.spritesheet('restart-game', 'imgs/restart-main.png', 970, 100, 21);
  }

  create() {
    super.create()
    this.gameOverText = this.add.sprite(cfg.width / 2, cfg.height / 2 - 50, 'game-over');
    this.gameOverText.anchor.setTo(0.5);

    this.restartGameText = this.add.sprite(cfg.width / 2, cfg.height / 2 + 50, 'restart-game');
    this.restartGameText.anchor.setTo(0.5);
    this.restartGameText.scale.setTo(0.9);
    this.restartGameText.animations.add('restart');
    this.restartGameText.animations.play('restart', 30, true)

    this.scoreText = this.add.text(20, 20, '', {font: '25px "Courier New"', fill: '#fff'});
    this.scoreText.anchor.setTo(0, 0.5);
    this.scoreText.text = 'SCORE: ' + this.game.state.states.Game.getScore();

    const restartGame = () => {
      this.game.state.remove('Game');
      this.game.state.add('Game', Game, false);
      this.game.state.start('Game', true, false);
    }

    this.restartButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.restartButton.onDown.add(restartGame, this);
  }
}

export default GameOver;