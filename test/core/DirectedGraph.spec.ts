import { expect } from 'chai'

import { DirectedGraph } from '../../src/core/DirectedGraph'
import { Set } from 'immutable'
import { newVertex, newEdge } from './DirectedGraphUtils';


describe('A Directed Graph', () => {
    it('should throw exception when a vertex in edges set is not in vertices set', () => {
        const vertices = [newVertex(), newVertex(), newVertex()]
        const [v1, v2, v3] = vertices
        const extra = newVertex()
        const edges = [newEdge(v1, v2), newEdge(v2, v3), newEdge(v3, v1), newEdge(v1, extra)]
        expect(() => new DirectedGraph(Set(vertices), Set(edges)))
            .to.throw(`The vertices [${extra.name}] are not in the vertices set`)
    })
})