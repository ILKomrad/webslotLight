export default class MoveController {
    constructor(settings, reelNum, reels) {
        this.settings = settings;
        this.reelNum = reelNum;
        this.reels = reels;
        this.childs = [];
    }

    addChild(child) {
        this.childs.push(child);
    }
}