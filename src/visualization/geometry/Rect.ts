export class Rect {
    constructor(
        readonly x: number, readonly y: number,
        readonly width: number, readonly height: number) { }

    left(): number {
        return this.x
    }

    right(): number {
        return this.x + this.width
    }

    top(): number {
        return this.y
    }

    bottom(): number {
        return this.y + this.height
    }
}