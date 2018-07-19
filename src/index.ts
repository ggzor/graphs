import * as SVG from 'svg.js'
import { of, fromEvent, merge, combineLatest } from 'rxjs';
import { Vertex } from './core/Vertex';
import { createVertex } from './visualization/svg/vertex/VertexBuilder';
import { map, filter, timestamp, repeat, throttleTime } from 'rxjs/operators';
import { touchEventAsVector, mouseEventAsVector } from './visualization/geometry/Utils';
import { Vector } from './visualization/geometry/Vector';
import { delayItems } from './rx/AdditionalOperators';

const canvas = SVG('root')
const canvasElement = document.getElementById(canvas.id())
const container = document.getElementById('container')

const addEvent = fromEvent<MouseEvent>(canvas, 'click').pipe(map(mouseEventAsVector))

addEvent.subscribe(console.log)

const ifTargetIsCanvas = filter((event: Event) => event.target === canvasElement)

const downEvent = merge(
    fromEvent(container, 'mousedown').pipe(
        ifTargetIsCanvas,
        map(mouseEventAsVector)
    ),
    fromEvent(container, 'touchdown').pipe(
        ifTargetIsCanvas,
        map(touchEventAsVector)
    ),
)

const upEvent = merge(
    fromEvent(container, 'mouseup'),
    merge(
        fromEvent(container, 'touchend'),
        fromEvent(container, 'touchcancel')
    )
).pipe(
    ifTargetIsCanvas
)

combineLatest(downEvent.pipe(timestamp()), upEvent.pipe(timestamp())).pipe(
    filter(([{ timestamp: start }, { timestamp: end }]
        : [{ timestamp: number, value: Vector }, { timestamp: number }]) => {

        const diff = end - start
        return start < end && 0 <= diff && diff <= 300
    }),
    map(t => t[0].value),
    throttleTime(250)
).subscribe(v => {
    createVertex({
        parent: canvas,
        container,
        colors: of('231123', '82204A', '558C8C', 'E8DB7D').pipe(
            map(c => `#${c}`),
            repeat(10),
            delayItems(i => i * 2000),
        ),
        vertices: of(new Vertex("V", Math.max(1, Math.floor(Math.random() * 8)))),
        canDrag: of(true),
        positions: of(v)
    }).isDragging.subscribe(console.log)
})