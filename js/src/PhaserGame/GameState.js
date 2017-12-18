import Phaser from "phaser";

import BaseState from './BaseState';
import cfg from './config';
import Single from './WeaponSingleBullet';
import Split from './WeaponSplitBullet';
import FourWay from './WeaponFourWayBullet';
import EightWay from './WeaponEightWayBullet';
import Beam from './WeaponBeam';
import Enemies from './Enemies';
import Bossters from './Boosters';

class Game extends BaseState {
  constructor() {
    super();
    this.player;

    this.enemies = [];

    this.explosions;

    this.curentWeapon = 0;
    this.weapon = [];

    this.boosters = [];

    this.cursors;
    this.pauseButton;
    this.fullscreenButton;
    
    this.lifeImg;
    this.lifeX;
    this.lifeNum;
    this.lifeCount = cfg.lifes;

    this.score = 0;
    this.scoreText = '';

    this.music;
    this.laserSound;
    this.explosionSound;
    this.upSound;
    this.downSound;

    this.pauseText = '';

    this.enemyRate = 2000;
    this.boosterRate = 10000;

    this.nextEnemy = 0;
    this.nextBooster = 0;

    this.playerSpeed = cfg.playerSpeed;
    this.enemySpeed = cfg.enemySpeed;
    this.boosterSpeed = cfg.enemySpeed;

    this.speedTimer;
    this.weaponTimer;
    this.timeTimer = 30000;

    this.prevEnemyRateFlag = 0;
    this.prevEnemySpeedFlag = 0;
    this.curentEnemyRateFlag = 0;
    this.curentEnemySpeedFlag = 0;
  }

  init() {
    super.init();
    this.physics.startSystem(Phaser.Physics.ARCADE);
  }

  preload() {
    this.loadingSprite = this.add.sprite(cfg.width / 2, cfg.height / 2, 'loading');
    this.loadingSprite.anchor.setTo(0.5);
    this.load.setPreloadSprite(this.loadingSprite);

    super.preload();

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
  }

  create() {
    super.create();

    this.nextBooster = this.game.time.time + this.boosterRate;

    this.music = this.add.audio('main');
    this.music.loopFull(1);

    this.laserSound = this.add.audio('laser');
    this.laserSound.volume = 0.2;

    this.explosionSound = this.add.audio('explosion');
    this.explosionSound.volume = 0.1;

    this.upSound = this.add.audio('up');
    this.upSound.volume = 1;

    this.downSound = this.add.audio('down');
    this.downSound.volume = 1;

    this.weapon.push(new Single(this.game, 'test', 'bullet', this.laserSound));
    this.weapon.push(new Split(this.game, 'test', 'bullet', this.laserSound));
    this.weapon.push(new FourWay(this.game, 'test', 'bullet', this.laserSound));
    this.weapon.push(new EightWay(this.game, 'test', 'bullet', this.laserSound));
    this.weapon.push(new Beam(this.game, 'test', 'beam', this.laserSound));

    const lifeDecrease = () => {
      this.downSound.play();
      this.lifeCount -= 1;
      if(this.lifeCount > 0) {
        for(let i of this.lifeNum.children) {
          i.visible = false;
        }
    
        this.lifeNum.children[this.lifeCount-1].visible = true;
      } else {
        this.music.stop();
        this.game.state.start('GameOver');
      }
    }

    this.enemies.push(new Enemies(this.game, 'test', 'enemy1', lifeDecrease));
    this.enemies.push(new Enemies(this.game, 'test', 'enemy2', lifeDecrease));
    this.enemies.push(new Enemies(this.game, 'test', 'enemy3', lifeDecrease));
    this.enemies.push(new Enemies(this.game, 'test', 'enemy4', lifeDecrease));

    this.boosters.push(new Bossters(this.game, 'speed', 'boost1'));
    this.boosters.push(new Bossters(this.game, 'life', 'boost2'));
    this.boosters.push(new Bossters(this.game, 'points', 'boost3'));
    this.boosters.push(new Bossters(this.game, 'weapon', 'boost4'));

    this.player = this.add.sprite(cfg.width / 2, cfg.height - cfg.playerHeight * cfg.spriteScale / 2, 'player');
    this.player.scale.setTo(cfg.spriteScale); 
    this.player.anchor.setTo(0.5);
    this.physics.arcade.enable(this.player);    
    this.player.body.collideWorldBounds = true;

     const setupLifeNum = () => {
      for(let i=0; i<cfg.lifes; i++) {
        let num = this.lifeNum.create(cfg.width - 50, 20, 'num' + i);
        num.anchor.setTo(0.5);
        num.visible = true;
      }
  
      for(let i of this.lifeNum.children) {
        i.visible = false;
      }
  
      this.lifeNum.children[this.lifeCount-1].visible = true;
    }
  
    const setupExplosion = (explosion) => {
      explosion.anchor.setTo(0.5);
      explosion.animations.add('kaboom');
    }

    this.explosions = this.add.group();
    this.explosions.createMultiple(30, 'kaboom');
    this.explosions.forEach(setupExplosion, this);

    this.lifeImg = this.add.sprite(cfg.width - 100, 20, 'life');
    this.lifeImg.anchor.setTo(0.5);
    this.lifeX = this.add.sprite(cfg.width - 70, 20, 'numX');
    this.lifeX.anchor.setTo(0.5);

    this.lifeNum = this.add.group();
    setupLifeNum();

    this.scoreText = this.add.text(20, 20, '', {font: '25px "Courier New"', fill: '#fff'});
    this.scoreText.anchor.setTo(0, 0.5);

    this.pauseText = this.add.sprite(cfg.width / 2, cfg.height / 2, 'game-paused');
    this.pauseText.anchor.setTo(0.5);

    this.pauseText.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
  
    const tooglePause = () => {
      if(this.game.paused) {
        this.pauseText.visible = false;
        this.game.paused = false;
      } else {
        this.pauseText.visible = true;
        this.game.paused = true;
      }
    }

    this.pauseButton = this.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
    this.pauseButton.onDown.add(tooglePause, this);

  }

  update() {
    this.scoreText.text = 'SCORE: ' + this.score;
    this.player.body.velocity.set(0);

    if(this.score !== 0) {
      this.curentEnemyRateFlag = (this.score - this.score % 100) / 100;
      this.curentEnemySpeedFlag = (this.score - this.score % 1000) / 1000;

      if(this.enemyRate > 100 && this.curentEnemyRateFlag !== this.prevEnemyRateFlag) {
        this.enemyRate -= 100;
        this.prevEnemyRateFlag = this.curentEnemyRateFlag;
      }

      if(this.enemySpeed < 500 && this.curentEnemySpeedFlag !== this.prevEnemySpeedFlag) {
        this.enemySpeed += 10;
        this.prevEnemySpeedFlag = this.curentEnemySpeedFlag;
      }
    }

    if (this.game.time.time > this.nextEnemy) {
      let randEnemy = this.game.rnd.between(0, 3);
      let randPosition = this.game.rnd.between(50, cfg.width-50);
      let randRate = this.game.rnd.between(500, 1000)
      this.enemies[randEnemy].release(randPosition, 0, this.enemySpeed, randRate);
      this.nextEnemy = this.game.time.time + this.enemyRate;
    }

    if(this.playerSpeed !== cfg.playerSpeed && this.speedTimer < this.game.time.time) {
      this.playerSpeed = cfg.playerSpeed;
      this.downSound.play();
    }

    if(this.curentWeapon !== 0 && this.weaponTimer < this.game.time.time) {
      this.curentWeapon = 0
      this.downSound.play();
    }

    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -this.playerSpeed;
    } else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = this.playerSpeed;
    }
    
    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -this.playerSpeed;
    } else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = this.playerSpeed;
    }

    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      this.weapon[this.curentWeapon].fire(this.player);
    }

    const bulletHitsEnemy = (bullet, enemy) => {
      this.score += 10;
      bullet.kill();
      let explosion = this.explosions.getFirstExists(false);
      explosion.reset(enemy.body.x + (cfg.explosionWidth - cfg.enemyWidth * cfg.spriteScale) / 2, enemy.body.y + (cfg.explosionHeight - cfg.enemyHeight * cfg.spriteScale) / 2)
      explosion.play('kaboom', 30, false, true);
      this.explosionSound.play();
      enemy.kill();
      if (this.game.time.time > this.nextBooster) {
        let randBooster = this.game.rnd.between(0, 3);
        this.boosters[randBooster].release(enemy, this.boosterSpeed);
        this.nextBooster = this.game.time.time + this.boosterRate;
      }
    }
  
    const enemyHitsPlayer = (player, enemy) => {
      this.downSound.play();
      this.lifeCount -= 1;

      if(this.lifeCount > 0) {
        enemy.kill();

        for(let i of this.lifeNum.children) {
          i.visible = false;
        }

        this.lifeNum.children[this.lifeCount-1].visible = true;

        let explosion = this.explosions.getFirstExists(false);
        explosion.reset(player.body.x + cfg.playerHeight * cfg.spriteScale / 2, player.body.y + cfg.playerHeight * cfg.spriteScale / 2);
        explosion.play('kaboom', 30, false, true);
        this.explosionSound.play();

        player.reset(cfg.width / 2, cfg.height - cfg.playerHeight * cfg.spriteScale / 2);
      } else {
        this.music.stop();
        this.game.state.start('GameOver');
      }
    }
  
    const playerTakeBoost = (player, booster) => {
      this.upSound.play();

      switch(booster.parent.name) {
        case 'weapon':
          this.weaponTimer = this.game.time.time + this.timeTimer;
          this.curentWeapon = this.game.rnd.between(1, 4);
          break;
        case 'speed':
          this.speedTimer = this.game.time.time + this.timeTimer;
          this.playerSpeed *= 1.5; 
          break;
        case 'life':
          if(this.lifeCount !== cfg.lifes) {
            this.lifeCount += 1;

            for(let i of this.lifeNum.children) {
              i.visible = false;
            }   

            this.lifeNum.children[this.lifeCount-1].visible = true;
          }
          break;
        case 'points':
          this.score += 50;
          break;
        default:
      }
      booster.kill();
    }

    this.physics.arcade.overlap(this.weapon, this.enemies, bulletHitsEnemy, null, this);
    this.physics.arcade.overlap(this.player, this.enemies, enemyHitsPlayer, null, this);
    this.physics.arcade.overlap(this.player, this.boosters, playerTakeBoost, null, this);
  }

  getScore() {
    return this.score;
  }
}

export default Game;