import { GameObject } from "./GameObject.js";
import { Inventory } from "./Inventory.js";
import { maps } from "./World.js";
export class OtherPlayer extends GameObject {
    frames;
    username;
    lastKey;
    width;
    height;
    moving = false;
    static width = 48;
    static height = 68;
    hat;
    health = 100;
    energy = 100;
    inventory;
    map;
    constructor(ctx, pos, img, frames = {
        max: 4,
        val: 0,
        tick: 0,
        imgs: {
            up: new Image(),
            left: new Image(),
            right: new Image(),
            down: new Image(),
        },
    }, username, mapId) {
        super(ctx, pos, img);
        this.frames = frames;
        this.username = username;
        this.inventory = new Inventory(ctx, this);
        this.lastKey = "";
        this.frames.imgs.up.src = "/assets/playerUp.png";
        this.frames.imgs.down.src = "/assets/playerDown.png";
        this.frames.imgs.left.src = "/assets/playerLeft.png";
        this.frames.imgs.right.src = "/assets/playerRight.png";
        this.width = OtherPlayer.width;
        this.height = OtherPlayer.height;
        this.hat = {
            front: new GameObject(ctx, this.pos, "/assets/hatFront.png"),
            side: new GameObject(ctx, this.pos, "/assets/hatSide.png"),
            back: new GameObject(ctx, this.pos, "/assets/hatBack.png"),
        };
        this.map = maps[mapId];
    }
    animate() {
        this.hat.front.pos = {
            x: this.pos.x - this.width / 5,
            y: this.pos.y - this.height / 2,
        };
        this.hat.back.pos = {
            x: this.pos.x - this.width / 5,
            y: this.pos.y - this.height / 2,
        };
        this.hat.side.pos = {
            x: this.pos.x - this.width / 5,
            y: this.pos.y - this.height / 2,
        };
    }
    draw() {
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(this.img, this.width * this.frames.val, 0, this.img.width / this.frames.max, this.img.height, this.pos.x, this.pos.y, this.img.width / this.frames.max, this.img.height);
        this.ctx.font = "bold 20px arial";
        this.ctx.lineWidth = 800;
        this.ctx.fillStyle = "green";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.drawHat();
        this.ctx.fillText(this.username, this.pos.x + 23, this.pos.y);
    }
    drawHat() {
        this.ctx.imageSmoothingEnabled = false;
        switch (this.lastKey) {
            case "w":
                this.hat.back.draw(64, 64);
                break;
            case "a":
                this.hat.side.draw(64, 64);
                break;
            case "d":
                this.hat.side.draw(64, 64);
                break;
            case "s":
                this.hat.front.draw(64, 64);
                break;
        }
    }
}
