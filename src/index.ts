import { of, fromEvent, NEVER } from 'rxjs'
import { map, startWith, flatMap, delay, tap, bufferCount, repeat } from 'rxjs/operators'
import { Vertex } from './core/Vertex'
import { Vector } from './visualization/geometry/Vector'
import { sizes } from './visualization/manipulation/SizeObserver'
import { createVertex } from './visualization/svg/vertex/VertexUtils'
import * as SVG from 'svg.js'
import { asRect } from './visualization/geometry/RectUtils'
import { VertexState } from './visualization/svg/vertex/VertexVisual';

const canvas = SVG('root')
const container = document.getElementById('container')

const v = new Vertex('XD', 1);
const vertices = of(1, 2, 3, 5, 10, 20, 30, 50).pipe(
    map(n => new Vertex("v1", n)),
    flatMap((e, i) => of(e).pipe(
        delay((i + 1) * 2000)
    ))
)

const positions = fromEvent<MouseEvent>(container, 'click').pipe(
    map(m => new Vector(m.offsetX, m.offsetY)),
    startWith(new Vector(200, 200))
)

const containerBounds = sizes(container).pipe(map(asRect))
const canDrag = of(true)

const states = of<VertexState>("selected", "normal").pipe(
    flatMap((e, i) => of(e).pipe(
        delay((i + 1) * 2000)
    )),
    repeat()
)

createVertex({ container: canvas, vertices, colors: NEVER, positions, canDrag, bounds: containerBounds, states })