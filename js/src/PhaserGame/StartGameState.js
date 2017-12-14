import Phaser from 'phaser';
import BaseState from './BaseState';
import cfg from './config';

class StartGameState extends BaseState {
  preload() {
    super.preload();
    
    this.load.spritesheet('start-game', 'imgs/start-main.png', 970, 100, 21);

    this.load.image('player', 'imgs/player.png');
    this.load.image('bullet', 'imgs/laserBlue01.png');
    this.load.image('beam', 'imgs/laserBlue02.png');
    this.load.image('enemy1', 'imgs/enemy1.png');
    this.load.image('enemy2', 'imgs/enemy2.png');
    this.load.image('enemy3', 'imgs/enemy3.png');
    this.load.image('enemy4', 'imgs/enemy4.png');
    this.load.image('boost1', 'imgs/bolt_gold.png');
    this.load.image('boost2', 'imgs/pill_yellow.png');
    this.load.image('boost3', 'imgs/star_gold.png');
    this.load.image('boost4', 'imgs/things_gold.png');
    this.load.image('life', 'imgs/playerLife.png');
    this.load.image('numX', 'imgs/numeralX.png');
    this.load.image('num0', 'imgs/numeral0.png');
    this.load.image('num1', 'imgs/numeral1.png');
    this.load.image('num2', 'imgs/numeral2.png');
    this.load.image('num3', 'imgs/numeral3.png'); 
    this.load.image('game-paused', 'imgs/game-paused.png');

    this.load.spritesheet('kaboom', 'imgs/explode.png', 128, 128);

    this.load.audio('main', 'sounds/Crystals.mp3');
    this.load.audio('laser', 'sounds/sfx_laser1.ogg');
    this.load.audio('up', 'sounds/sfx_shieldUp.ogg');
    this.load.audio('down', 'sounds/sfx_shieldDown.ogg');
    this.load.audio('explosion', 'sounds/explode1.wav');

    this.load.image('game-over', 'imgs/game-over.png');
    this.load.spritesheet('restart-game', 'imgs/restart-main.png', 970, 100, 21);
  }

  create() {
    super.create();

    this.startGameText = this.add.sprite(cfg.width / 2, cfg.height / 2, 'start-game');
    this.startGameText.anchor.setTo(0.5);
    this.startGameText.animations.add('start');
    this.startGameText.animations.play('start', 30, true);

    this.startButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.startButton.onDown.add(this.startGame, this);
  }

  startGame() {
    this.game.state.start('Game');
  }
}

export default StartGameState;