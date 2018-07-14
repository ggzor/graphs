import * as SVG from 'svg.js'
import { fromEvent, of, NEVER } from '../node_modules/rxjs';
import { map, filter, tap } from '../node_modules/rxjs/operators';
import { mouseEventAsVector } from './visualization/geometry/VectorUtils';
import { createVertex } from './visualization/svg/vertex/VertexUtils';
import { sizesOf } from './visualization/manipulation/SizeObserver';
import { Vertex } from './core/Vertex';
import { asRect } from './visualization/geometry/RectUtils';

const canvas = SVG('root')
const container = document.getElementById('container')

const containerBounds = sizesOf(container).pipe(map(asRect))

fromEvent<MouseEvent>(container, 'click').pipe(
    map(mouseEventAsVector),
).subscribe(v => {
    createVertex({
        container: container,
        canvas: canvas,
        bounds: containerBounds,
        canDrag: of(true),
        colors: NEVER,
        positions: of(v),
        states: NEVER,
        vertices: of(new Vertex("v", 3))
    })
})