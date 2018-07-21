import * as SVG from 'svg.js'
import { Vector } from './visualization/geometry/Vector'
import createVertex from './visualization/svg/vertex/VertexCreation'
import { NEVER, of, Observable, Subject, merge } from 'rxjs'
import { Vertex } from './core/Vertex'
import { Toggle } from './rx/Toggle';

const prefixedLog = (s: string) => <T>(element: T) => console.log(`${s}: ${element}`)

const canvas = SVG('root')
const canvasElement = document.getElementById(canvas.id())
const container = document.getElementById('container')

const toggle = new Toggle(of(true))

const newVertex = (position: Vector) => {
    return createVertex({
        container,
        parent: canvas,
        canDrag: of(true),
        colors: NEVER,
        positions: of(position),
        vertices: of(new Vertex('V', 5)),
        selected: merge(NEVER),
        registerSelection: toggle
    })
}

newVertex(new Vector(400, 400))
newVertex(new Vector(100, 500))
newVertex(new Vector(500, 150))