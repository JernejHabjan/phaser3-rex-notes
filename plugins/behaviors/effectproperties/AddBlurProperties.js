import HasProperty from '../../utils/object/HasProperty.js';

var AddBlurProperties = function (gameObject) {
    // Don't attach properties again
    if (HasProperty(gameObject, 'blurColor') || !gameObject.preFX) {
        return gameObject;
    }

    var blurColor,
        blurQuality = 0,
        blurX = 1,
        blurY = 1,
        blurStrength = 1,
        blurSteps = 4;
    Object.defineProperty(gameObject, 'blurColor', {
        get: function () {
            return blurColor;
        },
        set: function (value) {
            if (blurColor === value) {
                return;
            }

            blurColor = value;

            if ((blurColor === null) || (blurColor === false)) {
                if (gameObject._blur) {
                    gameObject.preFX.remove(gameObject._blur);
                    gameObject._blur = undefined;
                }
            } else {
                if (!gameObject._blur) {
                    var offset = Math.max(blurX, blurY);
                    gameObject.preFX.setPadding(offset + 1);
                    gameObject._blur = gameObject.preFX.addBlur(blurQuality, blurX, blurY, blurStrength, blurColor, blurSteps);
                } else {
                    gameObject._blur.color = blurColor;
                }
            }

        },
    })

    Object.defineProperty(gameObject, 'blurQuality', {
        get: function () {
            return blurQuality;
        },
        set: function (value) {
            if (blurQuality === value) {
                return;
            }

            blurQuality = value;

            if (gameObject._blur) {
                gameObject._blur.quality = blurQuality;
            }

        },
    })

    Object.defineProperty(gameObject, 'blurX', {
        get: function () {
            return blurX;
        },
        set: function (value) {
            if (blurX === value) {
                return;
            }

            blurX = value;

            if (gameObject._blur) {
                var offset = Math.max(blurX, blurY);
                gameObject.preFX.setPadding(offset + 1);
                gameObject._blur.x = blurX;
            }
        },
    })

    Object.defineProperty(gameObject, 'blurY', {
        get: function () {
            return blurY;
        },
        set: function (value) {
            if (blurY === value) {
                return;
            }

            blurY = value;

            if (gameObject._blur) {
                var offset = Math.max(blurX, blurY);
                gameObject.preFX.setPadding(offset + 1);
                gameObject._blur.y = blurY;
            }
        },
    })

    Object.defineProperty(gameObject, 'blurStrength', {
        get: function () {
            return blurStrength;
        },
        set: function (value) {
            if (blurStrength === value) {
                return;
            }

            blurStrength = value;

            if (gameObject._blur) {
                gameObject._blur.strength = blurStrength;
            }
        },
    })

    Object.defineProperty(gameObject, 'blurSteps', {
        get: function () {
            return blurSteps;
        },
        set: function (value) {
            if (blurSteps === value) {
                return;
            }

            blurSteps = value;

            if (gameObject._blur) {
                gameObject._blur.steps = blurSteps;
            }
        },
    })

    gameObject.blurColor = null;

    return gameObject;
}

export default AddBlurProperties;