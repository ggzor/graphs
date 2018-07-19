import * as SVG from 'svg.js'
import { Vector } from './visualization/geometry/Vector'
import createVertex from './visualization/svg/vertex/VertexCreation'
import { NEVER, of } from 'rxjs'
import { Vertex } from './core/Vertex'

const prefixedLog = (s: string) => <T>(element: T) => console.log(`${s}: ${element}`)

const canvas = SVG('root')
const canvasElement = document.getElementById(canvas.id())
const container = document.getElementById('container')

const newVertex = (position: Vector) =>
    createVertex({
        container,
        parent: canvas,
        canDrag: of(true),
        canSelect: of(true),
        colors: NEVER,
        positions: of(position),
        vertices: of(new Vertex('V', 5)),
        setSelected: NEVER
    })

newVertex(new Vector(400, 400))
newVertex(new Vector(100, 500))
newVertex(new Vector(500, 150))
