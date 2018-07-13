import { Observable, Subscription } from 'rxjs'
import { map, startWith, bufferCount, filter } from 'rxjs/operators'

import * as SVG from 'svg.js'

import { TweenLite, Back } from 'gsap'
import { computePosition } from '../../animation/GSAPUtils'

import { Vertex } from '../../../core/Vertex'

import { Vector } from '../../geometry/Vector'
import { Size } from '../../geometry/Size'

import { IVisual } from '../../IVisual'
import { Defaults } from '../../Defaults';

export type VertexState = "normal" | "selected"

export class VertexVisual implements IVisual {
    readonly element: HTMLElement
    readonly vertex: HTMLElement
    readonly selectedCircle: HTMLElement

    readonly sizes: Observable<Size>

    private readonly elementSVG: SVG.G
    private readonly vertexSVG: SVG.Circle
    private readonly selectedCircleSVG: SVG.Circle

    private subscriptions: Subscription = new Subscription()

    constructor(readonly parent: SVG.Container, options: VertexVisualCreationOptions) {
        function getElement(element: SVG.Element) {
            return document.getElementById(element.id())
        }

        this.elementSVG = parent.group()
        this.element = getElement(this.elementSVG)

        this.vertexSVG = this.elementSVG.circle(0).fill(Defaults.vertexFill)
        this.vertex = getElement(this.vertexSVG)

        this.selectedCircleSVG = this.elementSVG.circle(0)
            .fill("#00000000")
            .stroke({
                color: Defaults.selectedVertexFill,
                dasharray: "10 10",
                width: 2.5

            }).cx(0).cy(0)
        
        this.selectedCircleSVG.after(this.vertexSVG)

        this.selectedCircle = getElement(this.selectedCircleSVG)
        TweenLite.set(this.selectedCircle, { scale: 1.2, opacity: 0, transformOrigin: "50% 50%" })

        const states = options.states.pipe(
            startWith<VertexState>("normal"),
            bufferCount(2, 1),
            filter(buffer => buffer[1] !== undefined)
        );

        const weights = options.vertices.pipe(
            map(v => v.weight)
        )

        this.sizes = weights.pipe(
            map(size => new Size(size * 10, size * 10)),
            startWith(Size.zero)
        )

        this.subscriptions.add(
            states.subscribe(states => this.setState(states[0], states[1]))
        )

        this.subscriptions.add(
            weights.subscribe(weight => this.setWeight(weight))
        )

        this.subscriptions.add(
            options.colors.subscribe(color => this.setColor(color))
        )
    }

    getPosition(): Vector { return computePosition(this.element) }

    private setColor(color: string): void {
        TweenLite.to(this.vertex, 0.5, { fill: color })
    }

    private setWeight(weight: number) {
        TweenLite.to(this.vertex, 0.4, { attr: { r: weight * 5 }, ease: Back.easeOut })
        TweenLite.to(this.selectedCircle, 1, {
            attr: { r: (weight * 5) + 7 },
            ease: Back.easeOut.config(1.2)
        })
    }

    private setState(previousState: VertexState, newState: VertexState) {
        if (previousState == "selected") {
            TweenLite.to(this.selectedCircle, 0.3, { scale: 1.2, opacity: 0 })
        }

        if (newState == "selected") {
            TweenLite.to(this.selectedCircle, 0.3, { scale: 1, opacity: 1 })
        }
    }

    delete(): void {
        this.subscriptions.unsubscribe()
        this.parent.removeElement(this.elementSVG)
    }
}

export interface VertexVisualCreationOptions {
    vertices: Observable<Vertex>
    colors: Observable<string>
    states: Observable<VertexState>
}