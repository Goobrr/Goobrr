var pinColor = Color.white

// EFFECTS
const pinShine = new Effect(20, e => {
    Draw.z(Layer.bullet - 0.1)
    Draw.alpha(0.4 * e.fout())
    for(var i = 0; i < 4; i++){
        Drawf.tri(e.x, e.y, 10, 240, 180 * (e.fin() / 2) + (90 * i))
    }  

    Draw.alpha(1)
    Draw.z(Layer.effect)
    Lines.stroke(e.fout() * 10)
    Lines.circle(e.x, e.y, e.fslope() * 40)

    Angles.circleVectors(4, e.fslope() * 40, 180 * e.fin(), (x, y) => {
        var x = e.x + x
        var y = e.y + y
        var angle = Angles.angle(e.x, e.y, x, y)
        Drawf.tri(x, y, 5 * e.fout(), 120 * e.fslope(), angle )
    });
})

const pinHit = new Effect(30, e => {
    Draw.color(pinColor)
    Draw.alpha(1 - e.finpow())
    Lines.stroke(15 * (1 - e.finpow()));
    Lines.circle(e.x, e.y, 100 * e.finpow());

    Draw.alpha(1)
    Angles.randLenVectors(e.id, 5, e.fin()*100, (x, y) => {
        let angle = Mathf.angle(x, y)
        Drawf.tri(e.x + x, e.y + y, 4, 40 * e.fout(), angle )
        Drawf.tri(e.x + x, e.y + y, 4, 5 * e.fout(), angle - 180 )
    });
})

const pinShoot = new Effect(30, e => {
    Draw.color(pinColor)
    Draw.alpha(e.fin());
    Drawf.tri(e.x, e.y, 4, 25, e.rotation);
    Drawf.tri(e.x, e.y, 4, 4, (e.rotation - 180));
});

const pinShoot2 = new Effect(30, e => {
    let x = e.x + Angles.trnsx(e.rotation, -60 * (1 - e.finpow()))
    let y = e.y + Angles.trnsy(e.rotation, -60 * (1 - e.finpow()))
    Draw.color(pinColor)
    Draw.alpha(e.finpow());
    Drawf.tri(x, y, 4, 25, e.rotation);
    Drawf.tri(x, y, 4, 4, (e.rotation - 180));
});

// BULLETS
const pinBullet = extend(MissileBulletType, {
    damage: 8500,
    lifetime: 60,
    speed: 18,
    homingPower: 0.3,
    homingRange: 200,
    shootEffect: pinShoot,
    hitEffect: pinHit,
    despawnEffect: pinShine,
    smokeEffect: Fx.none,
    trailEffect: Fx.none,
    draw(b){
        Draw.alpha(0.75);
        b.data.draw(Color.valueOf("FFFFFFAA"), 2);

        Draw.alpha(1);
        Draw.color(pinColor)
        Drawf.tri(b.x, b.y, 4, 25, b.rotation());
        Drawf.tri(b.x, b.y, 4, 4, (b.rotation() - 180));
    },
    update(b){
        this.super$update(b);
        b.data.update(b.x, b.y);
    },
    init(b){
        if(!b)return;
        b.data = new Trail(10);
    }
});

var alternate = 1;
var order = 1;
const pinRotateBullet = extend(MissileBulletType, {
    damage: 8500,
    lifetime: 60,
    speed: 18,
    shootEffect: pinShoot,
    hitEffect: pinShine,
    despawnEffect: pinHit,
    smokeEffect: Fx.none,
    trailEffect: Fx.none,
    draw(b){
        Draw.alpha(0.75);
        b.data.draw(Color.valueOf("FFFFFFAA"), 2);

        Draw.alpha(1);
        Draw.color(pinColor)
        Drawf.tri(b.x, b.y, 4, 25, b.rotation());
        Drawf.tri(b.x, b.y, 4, 4, (b.rotation() - 180));
    },
    update(b){
        this.super$update(b);
        b.rotation(b.rotation() + ((2.5 * alternate)* Time.delta));
        b.data.update(b.x, b.y);
    },
    init(b){
        if(!b)return;
        b.data = new Trail(10);
    }
});

const fakePinBullet = extend(BasicBulletType, {
    lifetime: 1,
    speed: 0.001,
    hitEffect: Fx.none,
    despawnEffect: Fx.none,
    hittable: false,
    collides: false,
    keepVelocity: false,
    shootEffect: Fx.none,
    smokeEffect: Fx.none,

    draw(b){},
    create(b){
        var i = 0;
        alternate = -1 * alternate
        order = 1 - order
        Angles.circleVectors(32, 40, 180, (x, y) => {
            var x = b.x + x
            var y = b.y + y
            var angle = Angles.angle(b.x, b.y, x, y)
            Time.run(Math.abs((64 * order) - 2 * i), ()=>{
                pinShoot2.at(x, y, angle);
                Time.run(30, () => {
                    pinRotateBullet.create(b, x, y, angle);
                    Sounds.missile.at(x, y);
                })
            })
            i++
        });
    }
})
//EXPORTS
module.exports = {
    pinBullet: pinBullet,
    fakePinBullet: fakePinBullet,
    pinHit: pinHit,
    pinShine: pinShine
}
