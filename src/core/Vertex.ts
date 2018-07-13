export class Vertex {
    constructor(
        readonly name: string,
        readonly weight: number) {
    }

    withName(newName: string): Vertex {
        return new Vertex(newName, this.weight)
    }

    withWeight(newWeight: number): Vertex {
        return new Vertex(this.name, newWeight)
    }

    equals(other: any): boolean {
        if(other instanceof Vertex)
            return other.name === this.name
        return false
    }

    toString(): string {
        return this.name
    }
}