import EventEmitter from "../common/EventEmmeter.js";

export default class Timer extends EventEmitter{
    constructor() {
        super();
       this.current = Date.now();
       this.elapsed = 0;

         requestAnimationFrame( () => {
            this.tick();
         })
    }
    tick(){
        const newTime = Date.now();
        const delta = newTime - this.current;
        this.current = newTime;
        this.elapsed += delta;        

        this.trigger('tick')
        requestAnimationFrame(() => {
            this.tick();
        })
    }
}