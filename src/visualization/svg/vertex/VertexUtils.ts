import { Observable, merge, Subscription } from 'rxjs'

import * as SVG from 'svg.js'

import { Vertex } from '../../../core/Vertex'
import { Vector } from '../../geometry/Vector'
import { Rect } from '../../geometry/Rect'


import { adjustToBounds } from '../../manipulation/AdjustPosition'
import { fromVisual } from '../../manipulation/Draggable'
import { positionsFrom } from '../Dragging'

import { VertexVisual, VertexState } from './VertexVisual'
import { positionWithConstantDuration } from './VertexVisualBind'

export interface VertexVisualCreationOptions {
    container: HTMLElement
    canvas: SVG.Container
    vertices: Observable<Vertex>
    colors: Observable<string>
    states: Observable<VertexState>
    positions: Observable<Vector>
    canDrag: Observable<boolean>
    bounds: Observable<Rect>
}

class VertexVisualHandle implements IVertexVisualHandle {
    private readonly subscription: Subscription
    private readonly visual: VertexVisual

    constructor(options: VertexVisualCreationOptions) {
        this.visual = new VertexVisual(options.canvas, {
            colors: options.colors,
            vertices: options.vertices,
            states: options.states
        })

        this.subscription = positionWithConstantDuration(this.visual,
            adjustToBounds(
                merge(
                    positionsFrom(fromVisual(options.container, this.visual)),
                    options.positions
                ),
                this.visual.sizes, options.bounds, true
            )
        )
    }

    delete(): void {
        this.subscription.unsubscribe()
        this.visual.delete()
    }
}

export interface IVertexVisualHandle {
    delete(): void
}

export function createVertex(options: VertexVisualCreationOptions): IVertexVisualHandle {
    return new VertexVisualHandle(options)
}