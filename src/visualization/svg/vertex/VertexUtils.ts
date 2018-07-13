import * as SVG from 'svg.js'
import { Observable, merge, Subscription } from 'rxjs'
import { Vertex } from '../../../core/Vertex'
import { Vector } from '../../geometry/Vector'
import { Rect } from '../../geometry/Rect'
import { VertexVisual, VertexState } from './VertexVisual'
import { positionWithConstantDuration } from './VertexVisualBind'
import { adjustToBounds } from '../../manipulation/AdjustPosition'
import { fromVisual } from '../../manipulation/Draggable'
import { positionsFrom } from '../Dragging'
import { startWith } from '../../../../node_modules/rxjs/operators';
import { Defaults } from '../../Defaults'

export interface VertexVisualCreationOptions {
    container: SVG.Container
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
        this.visual = new VertexVisual(options.container, {
            colors: options.colors,
            vertices: options.vertices,
            states: options.states
        })

        this.subscription = positionWithConstantDuration(this.visual,
            adjustToBounds(
                merge(
                    positionsFrom(fromVisual(this.visual)),
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