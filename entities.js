var PlayerEntity = me.ObjectEntity.extend({
  speed: 4,
  jumpHeight: 100,
  init: function(x, y, settings) {
    this.parent(x, y, settings);
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
    this.setVelocity(3, 12);
  },
  update: function() {
    if (me.input.isKeyPressed('left')) {
      this.vel.x = -this.speed;
    } 
    else if (me.input.isKeyPressed('right')) {
      this.vel.x = this.speed;
    } 
    else {
      this.vel.x = 0;
    };
    if (me.input.isKeyPressed('jump')) {
      this.vel.y = -this.jumpHeight;
    }
    if(me.input.isKeyPressed("shoot")){
      var enemy = new EnemyEntity()
      me.game.world.addChild(enemy);
      enemy.direct(1,0);
    }
    me.game.collide(this);
    this.updateMovement();
    if (this.bottom > 490){ this.gameOver(); }
    if (this.vel.x!=0 || this.vel.y!=0) {
      this.parent(this);
      return true;
    }
    return false;
  },
  gameOver: function() {
    me.state.change(me.state.MENU);
  },
  youWin: function() {
    me.state.change(me.state.MENU);
    document.getElementById('game_state').innerHTML = "You Win!";
    document.getElementById('instructions').innerHTML = "";
  }
});
var CoinEntity = me.CollectableEntity.extend({
  init: function(x, y, settings) {
    this.parent(x, y, settings);
  },
  onCollision : function (res, obj) {
    me.gamestat.updateValue("coins", 1);
    this.collidable = false;
    me.game.remove(this);
    if(me.gamestat.getItemValue("coins") === me.gamestat.getItemValue("totalCoins")){
      obj.youWin();
    }
  }
}); 
var EnemyEntity = me.ObjectEntity.extend({
  init: function(x, y, settings) {
    settings.image = "badGuy";
    settings.spritewidth = 16;
    this.parent(x, y, settings);
    this.startX = x;
    this.endX = x + settings.width - settings.spritewidth;
    this.pos.x = this.endX;
    this.walkLeft = true;
    this.setVelocity(2);
    this.collidable = true;
  },
  onCollision: function(res, obj) {
    obj.gameOver();
  },
  update: function() {
    if (!this.visible){
      return false;
    }
    if (this.alive) {
      if (this.walkLeft && this.pos.x <= this.startX) {
        this.walkLeft = false;
      } 
      else if (!this.walkLeft && this.pos.x >= this.endX){ 
        this.walkLeft = true;
      }
      this.doWalk(this.walkLeft);
    }
    else { this.vel.x = 0; }
    this.updateMovement();
    if (this.vel.x!=0 || this.vel.y!=0) {
      this.parent(this);
      return true;
    }
    return false;
  }
});
var BootsEntity = me.CollectableEntity.extend({
  init: function(x, y, settings) {
    this.parent(x, y, settings);
  },
  onCollision : function (res, obj) {
    this.collidable = false;
    me.game.remove(this);
    obj.gravity = obj.gravity/1.5;
  }
});
var BulletEntity = me.ObjectEntity.extend({
  init:function(x,y,setting){
    bullet.position = PlayerEntity.position
    settings.image = "bullet";
    this.parent(x,y,settings);
  },
  onCollision : function(res,obj){
    me.game.remove(obj);
    me.game.remove(this);
  },
  direct:function(x,y){
    this.vel.x = x;
    this.vel.y = y;
  }
});