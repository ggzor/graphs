import * as SVG from 'svg.js'
import { of, NEVER, Observable } from 'rxjs';
import { Vertex } from './core/Vertex';
import { createVertex } from './visualization/svg/vertex/VertexBuilder';
import { Vector } from './visualization/geometry/Vector';
import { VertexMovement } from './visualization/svg/vertex/VertexPositioning';
import { flatMap, scan, map, tap, startWith } from 'rxjs/operators';
import { delayItems } from './rx/AdditionalOperators';

const canvas = SVG('root')
const container = document.getElementById('container')

const start = new Vector(0, 0)
const nextVectors = [
    new Vector(50, 50)
]

const positions = of(nextVectors).pipe(
    flatMap(v => v),
    scan((cur, next) => cur.add(next), start),
    startWith(start),
    delayItems(i => i * 2000),
    map<Vector, VertexMovement>((v, i) => i == 0 ? v : [v, 0.4]),
)

const sub = createVertex(canvas, container, {
    colors: NEVER,
    vertices: of(new Vertex("V", 8)),
    positions: positions
})

//setTimeout(() => sub.unsubscribe(), 10000)