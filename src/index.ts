import { of, fromEvent, NEVER } from 'rxjs'
import { map, startWith, flatMap, delay, repeat, take, skip, tap } from 'rxjs/operators'
import { Vertex } from './core/Vertex'
import { Vector } from './visualization/geometry/Vector'
import { sizes } from './visualization/manipulation/SizeObserver'
import { createVertex } from './visualization/svg/vertex/VertexUtils'
import * as SVG from 'svg.js'
import { asRect } from './visualization/geometry/RectUtils'
import { VertexState } from './visualization/svg/vertex/VertexVisual';
import { delayItems } from './rx/AdditionalOperators';

const canvas = SVG('root')
const container = document.getElementById('container')
 
const vertices = of(2, 3, 4, 5, 30).pipe(
    map(n => new Vertex("v1", n)),
    delayItems(i => i * 2000)
)

const positions = fromEvent<MouseEvent>(container, 'click').pipe(
    map(m => new Vector(m.offsetX, m.offsetY)),
    startWith(new Vector(200, 200))
)

const containerBounds = sizes(container).pipe(map(asRect))
const canDrag = of(true)

const states = of<VertexState>("selected")

createVertex({ container: canvas, vertices, colors: NEVER, positions, canDrag, bounds: containerBounds, states })