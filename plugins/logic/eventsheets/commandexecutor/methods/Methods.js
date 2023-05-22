import TreeManagerMethods from './TreeManagerMethods.js';
import WaitMethods from './WaitMethods.js';
import GameObjectMethods from './GameObjectMethods.js';
import BackgroundMusicMethods from './musicmethods/BackgroundMusicMethods.js';
import BackgroundMusic2Methods from './musicmethods/BackgroundMusic2Methods.js';
import SoundEffectsMethods from './musicmethods/SoundEffectsMethods.js';
import SoundEffects2Methods from './musicmethods/SoundEffects2Methods.js';
import DefaultHandler from './DefaultHandler.js';

var Methods = {
    defaultHandler: DefaultHandler,
}

Object.assign(
    Methods,
    TreeManagerMethods,
    WaitMethods,
    GameObjectMethods,
    BackgroundMusicMethods,
    BackgroundMusic2Methods,
    SoundEffectsMethods,
    SoundEffects2Methods,
)


export default Methods;