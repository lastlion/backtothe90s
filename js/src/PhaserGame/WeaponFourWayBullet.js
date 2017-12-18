import Weapon from './Weapon';

class WeaponFourWayBullet extends  Weapon {
  fire(source) {
    if (this.game.time.time < this.nextFire) { return; }

    super.fire();

    let x = source.x;
    let y = source.y;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0)
    this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0)
    this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0)

    this.nextFire = this.game.time.time + this.fireRate;
  }
}

export default WeaponFourWayBullet;