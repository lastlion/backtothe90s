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

    this.enemies.push(new Enemies(this.game, 'test', 'enemy1'));
    this.enemies.push(new Enemies(this.game, 'test', 'enemy2'));
    this.enemies.push(new Enemies(this.game, 'test', 'enemy3'));
    this.enemies.push(new Enemies(this.game, 'test', 'enemy4'));

    this.boosters.push(new Bossters(this.game, 'speed', 'boost1'));
    this.boosters.push(new Bossters(this.game, 'life', 'boost2'));
    this.boosters.push(new Bossters(this.game, 'points', 'boost3'));
    this.boosters.push(new Bossters(this.game, 'weapon', 'boost4'));

    this.player = this.add.sprite(cfg.width / 2, cfg.height - cfg.playerHeight * cfg.spriteScale / 2, 'player');
    this.player.scale.setTo(cfg.spriteScale); 
    this.player.anchor.setTo(0.5);
    this.physics.arcade.enable(this.player);    
    this.player.body.collideWorldBounds = true;

    this.explosions = this.add.group();
    this.explosions.createMultiple(30, 'kaboom');
    this.explosions.forEach(this.setupExplosion, this);

    this.lifeImg = this.add.sprite(cfg.width - 100, 20, 'life');
    this.lifeImg.anchor.setTo(0.5);
    this.lifeX = this.add.sprite(cfg.width - 70, 20, 'numX');
    this.lifeX.anchor.setTo(0.5);

    this.lifeNum = this.add.group();
    this.setupLifeNum();

    this.scoreText = this.add.text(20, 20, '', {font: '25px "Courier New"', fill: '#fff'});
    this.scoreText.anchor.setTo(0, 0.5);

    this.pauseText = this.add.sprite(cfg.width / 2, cfg.height / 2, 'game-paused');
    this.pauseText.anchor.setTo(0.5);

    this.pauseText.visible = false;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    this.pauseButton = this.input.keyboard.addKey(Phaser.Keyboard.BACKSPACE);
    this.pauseButton.onDown.add(this.tooglePause, this);

    this.fullscreenButton = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.fullscreenButton.onDown.add(this.toogleFullscreen, this);
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

    this.physics.arcade.overlap(this.weapon, this.enemies, this.bulletHitsEnemy, null, this);
    this.physics.arcade.overlap(this.player, this.enemies, this.enemyHitsPlayer, null, this);
    this.physics.arcade.overlap(this.player, this.boosters, this.playerTakeBoost, null, this);
  }

  setupLifeNum() {
    for(let i=0; i<cfg.lifes; i++) {
      let num = this.lifeNum.create(cfg.width - 50, 20, 'num' + i);
      num.anchor.setTo(0.5);
      num.visible = true;
    }

    this.setLifeNumVisible(this.lifeCount-1);
  }

  setupExplosion(explosion) {
    explosion.anchor.setTo(0.5);
    explosion.animations.add('kaboom');
  }

  toogleFullscreen() {   
    if (this.scale.isFullScreen) {
      this.scale.stopFullScreen();
    } else {
      this.scale.startFullScreen(false);
    }    
  }

  tooglePause() {
    if(this.game.paused) {
      this.pauseText.visible = false;
      this.game.paused = false;
    } else {
      this.pauseText.visible = true;
      this.game.paused = true;
    }
  }

  setLifeNumVisible(num) {
    for(let i of this.lifeNum.children) {
      i.visible = false;
    }

    this.lifeNum.children[num].visible = true;
  }

  bulletHitsEnemy(bullet, enemy) {
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

  enemyHitsPlayer(player, enemy) {
    this.lifeCount -= 1;
    if(this.lifeCount > 0) {
      enemy.kill();
      this.setLifeNumVisible(this.lifeCount-1);
      let explosion = this.explosions.getFirstExists(false);
      explosion.reset(player.body.x + cfg.playerHeight * cfg.spriteScale / 2, player.body.y + cfg.playerHeight * cfg.spriteScale / 2);
      explosion.play('kaboom', 30, false, true);
      this.explosionSound.play();
      player.reset(cfg.width / 2, cfg.height - cfg.playerHeight * cfg.spriteScale / 2);
    } else {
      this.score = 0;
      this.lifeCount = cfg.lifes;
      this.music.stop();
      this.game.state.start('GameOver');
    }
  }

  playerTakeBoost(player, booster) {
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
          this.setLifeNumVisible(this.lifeCount-1);
        }
        break;
      case 'points':
        this.score += 50;
        break;
      default:
    }
    booster.kill();
  }
}

export default Game;