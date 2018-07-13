import { Vertex } from "../../src/core/Vertex";
import { DirectedEdge } from "../../src/core/DirectedEdge";

let i = 0
export function newVertex(): Vertex {
    i++
    return new Vertex(`v${i}`, 1)
}

let j = 0
export function newEdge(source: Vertex, target: Vertex): DirectedEdge {
    j++
    return new DirectedEdge(`e${j}`, source, target, 1)
}