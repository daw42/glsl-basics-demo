// Axis-aligned bounding box
export class Aabb {
    constructor() {
        this.min = [Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
        this.max = [-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE];
    }

    add( x, y, z ) {
        this.min[0] = Math.min( x, this.min[0] );
        this.min[1] = Math.min( y, this.min[1] );
        this.min[2] = Math.min( z, this.min[2] );

        this.max[0] = Math.max( x, this.max[0] );
        this.max[1] = Math.max( y, this.max[1] );
        this.max[2] = Math.max( z, this.max[2] );
    }

    centerPoint() {
        return [
            (this.min[0] + this.max[0]) / 2,
            (this.min[1] + this.max[1]) / 2,
            (this.min[2] + this.max[2]) / 2
        ];
    }
}
