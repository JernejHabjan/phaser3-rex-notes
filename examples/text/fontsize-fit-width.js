import phaser from 'phaser/src/phaser.js';
import FontSizeFitToWidth from '../../plugins/utils/text/FontSizeFitToWidth';

class Demo extends Phaser.Scene {
    constructor() {
        super({
            key: 'examples'
        })
    }

    preload() {
    }

    create() {
        var textObject = this.add.text(200, 200, 'Hello', {
            fontFamily: 'Forte',
            backgroundColor: 'grey',
            padding: {
                top: 20, bottom: 20, left: 20, right: 20
            }
        });
        FontSizeFitToWidth(textObject, 300);

        console.log(textObject.style.fontSize);
        console.log(textObject.width);
    }

    update() {

    }
}

var config = {
    type: Phaser.AUTO,
    scale: {
        parent: 'phaser-example',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600,
    },
    scene: Demo
};

var game = new Phaser.Game(config);