(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.rexgroupnavigatorplugin = factory());
})(this, (function () { 'use strict';

    var EventEmitterMethods = {
        setEventEmitter(eventEmitter, EventEmitterClass) {
            if (EventEmitterClass === undefined) {
                EventEmitterClass = Phaser.Events.EventEmitter; // Use built-in EventEmitter class by default
            }
            this._privateEE = (eventEmitter === true) || (eventEmitter === undefined);
            this._eventEmitter = (this._privateEE) ? (new EventEmitterClass()) : eventEmitter;
            return this;
        },

        destroyEventEmitter() {
            if (this._eventEmitter && this._privateEE) {
                this._eventEmitter.shutdown();
            }
            return this;
        },

        getEventEmitter() {
            return this._eventEmitter;
        },

        on() {
            if (this._eventEmitter) {
                this._eventEmitter.on.apply(this._eventEmitter, arguments);
            }
            return this;
        },

        once() {
            if (this._eventEmitter) {
                this._eventEmitter.once.apply(this._eventEmitter, arguments);
            }
            return this;
        },

        off() {
            if (this._eventEmitter) {
                this._eventEmitter.off.apply(this._eventEmitter, arguments);
            }
            return this;
        },

        emit(event) {
            if (this._eventEmitter && event) {
                this._eventEmitter.emit.apply(this._eventEmitter, arguments);
            }
            return this;
        },

        addListener() {
            if (this._eventEmitter) {
                this._eventEmitter.addListener.apply(this._eventEmitter, arguments);
            }
            return this;
        },

        removeListener() {
            if (this._eventEmitter) {
                this._eventEmitter.removeListener.apply(this._eventEmitter, arguments);
            }
            return this;
        },

        removeAllListeners() {
            if (this._eventEmitter) {
                this._eventEmitter.removeAllListeners.apply(this._eventEmitter, arguments);
            }
            return this;
        },

        listenerCount() {
            if (this._eventEmitter) {
                return this._eventEmitter.listenerCount.apply(this._eventEmitter, arguments);
            }
            return 0;
        },

        listeners() {
            if (this._eventEmitter) {
                return this._eventEmitter.listeners.apply(this._eventEmitter, arguments);
            }
            return [];
        },

        eventNames() {
            if (this._eventEmitter) {
                return this._eventEmitter.eventNames.apply(this._eventEmitter, arguments);
            }
            return [];
        },
    };

    const Wrap = Phaser.Math.Wrap;

    var GetNextameObject = function ({
        startX, startY, backward,
    }) {

        var targets = this.targets;
        var is1DTargetsArray = !Array.isArray(targets[0]);

        // Correct startX, startY
        if (is1DTargetsArray) {
            startY = 0;
        } else {
            // Wrap 
            startY = Wrap(startY, 0, targets.length);
        }

        var row;
        if (is1DTargetsArray) {
            row = targets;
        } else {
            row = targets[startY];
        }
        // Wrap 
        startX = Wrap(startX, 0, row.length);

        var x = startX;
        var y = startY;

        var gameObject;
        while (!gameObject) {
            // Get game object from targets array
            var row;
            if (is1DTargetsArray) {
                row = targets;
            } else {
                row = targets[y];
            }
            gameObject = row[x];

            // Test if this game object is focus-able
            var focusEnable = true;
            if (this.getFocusEnableCallback) {
                focusEnable = this.getFocusEnableCallback(gameObject);
            }

            // Not focus-enable
            if (!focusEnable) {
                gameObject = null;  // Select game object at next index

                if (!backward) {
                    x += 1;
                    if (x >= row.length) {
                        x = 0;
                        // Next row
                        if (!is1DTargetsArray) {
                            y = Wrap(y + 1, 0, targets.length - 1);
                        }
                    }

                } else {
                    x -= 1;
                    if (x < 0) {
                        x = row.length - 1;
                        // Previous row
                        if (!is1DTargetsArray) {
                            y = Wrap(y - 1, 0, targets.length - 1);
                        }
                    }
                }

                // Back to startX, startY, fail
                if ((startX === x) && (startY === y)) {
                    this.focusIndex.x = undefined;
                    this.focusIndex.y = undefined;
                    return null;
                }
            }

        }

        // Return game object
        this.focusIndex.x = x;
        this.focusIndex.y = y;
        return gameObject;
    };

    var GetNextMethods = {
        getFirst() {
            return GetNextameObject.call(this, {
                startX: 0,
                startY: 0,
                backward: false
            });
        },

        getLast() {
            return GetNextameObject.call(this, {
                startX: -1,
                startY: -1,
                backward: true,
            });
        },

        getNext() {
            if (this.focusIndex.x === undefined) {
                return this.getFirst();
            }

            return GetNextameObject.call(this, {
                startX: this.focusIndex.x + 1,
                startY: this.focusIndex.y,
                backward: false
            });
        },

        getPrevious() {
            if (this.focusIndex.x === undefined) {
                return this.getLast();
            }

            return GetNextameObject.call(this, {
                startX: this.focusIndex.x - 1,
                startY: this.focusIndex.y,
                backward: true,
            });
        },

        getNextRow() {
            if (this.focusIndex.x === undefined) {
                return this.getFirst();
            }

            return GetNextameObject.call(this, {
                startX: this.focusIndex.x,
                startY: this.focusIndex.y + 1,
                backward: false
            });
        },

        getPreviousRow() {
            if (this.focusIndex.x === undefined) {
                return this.getLast();
            }

            return GetNextameObject.call(this, {
                startX: this.focusIndex.x,
                startY: this.focusIndex.y - 1,
                backward: true,
            });
        },
    };

    var Focus = function (gameObject) {
        // Already focus
        if (gameObject === this.focusedTarget) {
            return this;
        }

        Blur.call(this);

        this.focusedTarget = gameObject;
        if (gameObject) {
            this.emit('focus', gameObject);
        }
    };

    var Blur = function () {
        if (!this.focusedTarget) {
            return this;
        }

        var gameObject = this.focusedTarget;
        this.focusedTarget = null;
        this.emit('blur', gameObject);
    };

    var FocusMethods = {
        first() {
            Focus.call(this, this.getFirst());
            return this;
        },

        last() {
            Focus.call(this, this.getLast());
            return this;
        },

        next() {
            Focus.call(this, this.getNext());
            return this;
        },

        previous() {
            Focus.call(this, this.getPrevious());
            return this;
        },

        nextRow() {
            Focus.call(this, this.getNextRow());
            return this;
        },

        previousRow() {
            Focus.call(this, this.getPreviousRow());
            return this;
        },

        focus(gameObject) {
            // Already focus
            if (gameObject === this.focusedTarget) {
                return this;
            }

            var targets = this.targets;
            var is1DTargetsArray = (Array.isArray(targets)) && (!Array.isArray(targets[0]));

            if (is1DTargetsArray) {
                var x = targets.indexOf(gameObject);
                if (x !== -1) {
                    this.focusIndex.x = x;
                    this.focusIndex.y = 0;
                    Focus.call(this, gameObject);
                }
            } else {
                for (var y = 0, rowCount = targets.length; y < rowCount; y++) {
                    var row = targets[y];
                    var x = row.indexOf(gameObject);
                    if (x !== -1) {
                        this.focusIndex.x = x;
                        this.focusIndex.y = y;
                        Focus.call(this, gameObject);
                    }
                }
            }
            return this;
        },

        blur: Blur,

    };

    var Methods = {

    };

    Object.assign(
        Methods,
        GetNextMethods,
        FocusMethods
    );

    var ReshapeArray1DTo2D = function (array, columns) {
        return array.reduce(function (acc, curr, index) {
            if (index % columns === 0) {
                acc.push([]);
            }
            acc[acc.length - 1].push(curr);
            return acc;
        }, []);
    };

    const GetValue = Phaser.Utils.Objects.GetValue;
    const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;

    class GroupNavigator {
        constructor(scene, config) {
            if (IsPlainObject(scene) && (config === undefined)) {
                config = scene;
                scene = undefined;
            }

            // Event emitter
            var eventEmitter = GetValue(config, 'eventEmitter', undefined);
            var EventEmitterClass = GetValue(config, 'EventEmitterClass', undefined);
            this.setEventEmitter(eventEmitter, EventEmitterClass);

            this.scene = scene;
            this.focusedTarget = undefined;
            this.focusIndex = { x: undefined, y: undefined };

            this.resetFromJSON(config);
        }

        resetFromJSON(o) {
            this.setTargets(GetValue(o, 'targets'), GetValue(o, 'columns'));

            var focusEnableCallback = GetValue(o, 'getFocusEnableCallback');
            if (focusEnableCallback) {
                this.setGetFocusEnableCallback(focusEnableCallback);
            } else {
                var focusEnableDataKey = GetValue(o, 'focusEnableDataKey');
                if (focusEnableDataKey) {
                    this.setFocusEnableDataKey(focusEnableDataKey);
                } else {
                    var focusEnableKey = GetValue(o, 'focusEnableKey');
                    if (focusEnableKey) {
                        this.setFocusEnableKey(focusEnableKey);
                    }
                }
            }
        }


        destroy() {
            this.targets = undefined;
        }

        setTargets(targets, columns) {
            if (targets && (columns !== undefined)) {
                targets = ReshapeArray1DTo2D(targets, columns);
            }

            this.targets = targets;

            this.blur();
            this.focusIndex.x = undefined;
            this.focusIndex.y = undefined;

            return this;
        }

        setFocusEnableDataKey(dataKey) {
            var callback;
            if (dataKey) {
                callback = function (gameObject) {
                    return gameObject.getData(dataKey);
                };
            }
            this.setGetFocusEnableCallback(callback);
            return this;
        }

        setFocusEnableKey(key) {
            var callback;
            if (key) {
                callback = function (gameObject) {
                    return gameObject[key];
                };
            }
            this.setGetFocusEnableCallback(callback);
            return this;
        }

        setGetFocusEnableCallback(callback) {
            this.getFocusEnableCallback = callback;
            return this;
        }

        getFocusedTarget() {
            return this.focusedTarget;
        }
    }

    Object.assign(
        GroupNavigator.prototype,
        EventEmitterMethods,
        Methods,
    );

    class GroupNavigatorPlugin extends Phaser.Plugins.BasePlugin {
        constructor(pluginManager) {
            super(pluginManager);
        }

        start() {
            var eventEmitter = this.game.events;
            eventEmitter.on('destroy', this.destroy, this);
        }

        add(config) {
            return new GroupNavigator(config);
        }
    }

    return GroupNavigatorPlugin;

}));
