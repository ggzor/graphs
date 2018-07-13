import { expect } from 'chai'

import { Vertex } from "../../src/core/Vertex";

describe('A vertex', () => {
    it('should be equal to another vertex with same name', () => {
        const v1 = new Vertex('v1', 1)
        const v2 = new Vertex('v1', 3)

        expect(v1.equals(v2)).to.be.true
    })
})