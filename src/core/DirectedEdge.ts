import { Vertex } from "./Vertex";

export class DirectedEdge {
    constructor(
        readonly name: string,
        readonly source: Vertex,
        readonly target: Vertex,
        readonly weight: number) {
    }

    withName(newName: string): DirectedEdge {
        return new DirectedEdge(newName, this.source, this.target, this.weight)
    }

    withSource(newSource: Vertex): DirectedEdge {
        return new DirectedEdge(this.name, newSource, this.target, this.weight)
    }

    withTarget(newTarget: Vertex): DirectedEdge {
        return new DirectedEdge(this.name, this.source, newTarget, this.weight)
    }

    withWeight(newWeight: number): DirectedEdge {
        return new DirectedEdge(this.name, this.source, this.target, newWeight)
    }
}