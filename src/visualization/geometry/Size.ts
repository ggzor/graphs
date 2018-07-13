export class Size {
    constructor(readonly width: number, readonly height: number) { }

    toString(): string {
        return `w: ${this.width}, h: ${this.height}`
    }

    static readonly zero: Size = new Size(0, 0);
}