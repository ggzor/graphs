import * as SVG from 'svg.js'
import { Vector } from './visualization/geometry/Vector'
import { fromVisualWithMouseAndTouch } from './visualization/manipulation/Draggable'
import { positionsFrom } from './visualization/manipulation/Dragging'
import { withLatestFrom, map, startWith, flatMap, combineAll, tap, scan, distinctUntilChanged } from 'rxjs/operators'
import { TweenLite, Back } from 'gsap'
import createVertex from './visualization/svg/vertex/VertexCreation';
import { NEVER, of, Subject, Observable, combineLatest } from 'rxjs';
import { Vertex } from './core/Vertex';
import BitSet from 'bitset'
import { when } from './rx/AdditionalOperators';

const prefixedLog = (s: string) => <T>(element: T) => console.log(`${s}: ${element}`)

const canvas = SVG('root')
const canvasElement = document.getElementById(canvas.id())
const container = document.getElementById('container')

const draggings = new Subject<Observable<boolean>>()

const notDragging = draggings.pipe(
    flatMap((o, i) => o.pipe(map(v => <[number, 0 | 1]>[i, v ? 1 : 0]))),
    scan<[number, 0 | 1], BitSet>((acc, curr) => acc.set(curr[0], curr[1]), BitSet()),
    map(b => b.isEmpty()),
    startWith(true),
    distinctUntilChanged()
)

const dragging = fromVisualWithMouseAndTouch(container, {
    element: canvasElement,
    getPosition: () => Vector.zero
})

const positions = positionsFrom(dragging)

const maxOpacity = 0.4
const radius = 45
const circle = canvas.circle(radius).fill('#FF3E41')
const circleElement = document.getElementById(circle.id())
TweenLite.set(circleElement, { opacity: 0 })

dragging.start.pipe(
    map(v => v.minus(new Vector(radius / 2, radius / 2))),
    when(notDragging)
).subscribe(v => {
    TweenLite.set(circleElement, { ...v, attr: { r: 0 } })
    TweenLite.to(circleElement, 0.2, { opacity: maxOpacity })
})

dragging.end.pipe(
    when(notDragging)
).subscribe(v => {
    TweenLite.to(circleElement, 0.2, { opacity: 0 })
})

const weight = positions.pipe(map(v => Math.min(200, Math.max(10, v.length()))))

weight.pipe(when(notDragging)).subscribe(v => TweenLite.to(circleElement, 0.4, { attr: { r: v }, ease: Back.easeOut.config(5) }))

dragging.end.pipe(
    when(notDragging),
    withLatestFrom(dragging.start, weight),
    map(t => <[Vector, number]>[t[1], t[2] / 5]),

).subscribe(t => {
    const [position, weight] = t

    draggings.next(createVertex({
        canDrag: of(true),
        colors: NEVER,
        container, parent: canvas,
        positions: of(position),
        vertices: of(new Vertex('V', weight))
    }).isDragging)
})