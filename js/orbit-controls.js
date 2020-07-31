
export class OrbitControls {
    constructor( cam, canv ) {
        this.camera = cam;
        this.canvas = canv;
        this.updateEvent = new Event('repaint');
        this.STATE = { NONE: 0, ROTATING: 1 };
        this.state = this.STATE.NONE;
        this.mouseStart = [0,0];

        this.handlers = {
            mousedown: (e) => this.onMouseDown(e),
            mousewheel: (e) => this.onMouseWheel(e),
            mouseup: (e) => this.onMouseUp(e),
            mousemove: (e) => this.onMouseMove(e)
        };

        this.canvas.addEventListener("mousedown", this.handlers.mousedown, false);
        this.canvas.addEventListener('wheel', this.handlers.mousewheel, false );
    }

    update() {
        this.canvas.dispatchEvent(this.updateEvent);
    }

    onMouseDown(evt) {
        const mouseX = evt.pageX;
        const mouseY = evt.pageY;
        this.mouseStart[0] = mouseX; this.mouseStart[1] = mouseY;
        this.state = this.STATE.ROTATING;
        
        document.addEventListener( 'mousemove', this.handlers.mousemove, false );
		document.addEventListener( 'mouseup', this.handlers.mouseup, false );
    }

    onMouseWheel(evt) {
        evt.preventDefault();
        
        this.camera.dolly(evt.deltaY);
        this.update();
    }

    onMouseMove(evt) {
        evt.preventDefault();
        if( this.state === this.STATE.ROTATING ) {
            const mouseX = evt.pageX;
            const mouseY = evt.pageY;
    
            this.camera.orbit( mouseX - this.mouseStart[0], mouseY - this.mouseStart[1]);
    
            this.mouseStart[0] = mouseX;
            this.mouseStart[1] = mouseY;
            this.update();
        }
    }

    onMouseUp(evt) {
        this.state = this.STATE.NONE;
        document.removeEventListener('mousemove', this.handlers.mousemove);
        document.removeEventListener('mouseup', this.handlers.mouseup);
    }
}