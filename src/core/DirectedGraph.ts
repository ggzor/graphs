import { Set } from 'immutable'
import { Vertex } from './Vertex';
import { DirectedEdge } from './DirectedEdge';

export class DirectedGraph {
    constructor(readonly vertices: Set<Vertex>, readonly edges: Set<DirectedEdge>) {
        const edgesVertices = Set(edges.flatMap<DirectedEdge, Vertex>(e => [e.source, e.target]))

        if(!edgesVertices.isSubset(vertices)) {
            const diff = edgesVertices.subtract(vertices).toArray()
            throw new Error(`The vertices [${diff}] are not in the vertices set`)
        }
    }
}