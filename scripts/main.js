const pins = require("pins")

const shockwave = new Effect(40, e => {
    Lines.stroke(5 * e.finpow());
    Draw.alpha(e.finpow());
    Lines.circle(e.x, e.y, 500 * (1 - e.finpow()));
})

const pinRing = extend(Weapon, {
    reload: 520,
    mirror: false,
    x: 0,
    y: -4,
    shootY: 0,
    bullet: pins.fakePinBullet,
    rotate: false,
    shootSound: Sounds.none,
    shootStatus: StatusEffects.unmoving,
    shootStatusDuration: 90
})
const pinWeapon = extend(Weapon, {
    reload: 10,
    mirror: true,
    alternate: true,
    x: 20,
    bullet: pins.pinBullet,
    shootY: 0,
    firstShotDelay: 30,
    shootSound: Sounds.missile
})



const goob = extend(UnitType, "goober", {
    health: 120,
    speed: 2,
    hitSize: 5,
    drawCell: false,

    localizedName: "Goober",
    update(unit){
        this.super$update(unit);
        this.maxHealth = 120;
        this.health = this.maxHealth;
        this.dead = false;
        unit.heal();
    }
})

// death effect is temporary
goob.constructor = () => extend(MechUnit, {
    destroy(){
        print("no");
        this.maxHealth = 120;
        this.health = this.maxHealth;
        this.dead = false;
        this.heal()
    },
    remove(){
        pins.pinShine.at(this.x, this.y)
        Sounds.lasercharge2.at(this.x, this.y)
        shockwave.at(this.x, this.y, 0, {direction: -1})
        Time.run(40, () => {
            pins.pinHit.at(this.x, this.y);
            Sounds.shotgun.at(this.x, this.y);
            this.super$remove()
        })
    },
})

var pinWeapon2 = pinWeapon.copy()
pinWeapon2.x = 15;
pinWeapon2.y = -20;
pinWeapon2.reload = 30;

var pinWeapon3 = pinWeapon.copy()
pinWeapon3.x = 17.5;
pinWeapon3.y = -10;
pinWeapon3.reload = 20;

goob.weapons.add(pinWeapon, pinWeapon2, pinWeapon3, pinRing)

