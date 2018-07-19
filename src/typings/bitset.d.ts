declare module 'bitset' {
    export interface BitSet {
        set(index: number, value: 0 | 1): BitSet
        get(index: number): 0 | 1
        isEmpty(): boolean
    }

    export type BitSetConstructor = (param?: string | BitSet | number | number[]) => BitSet
    export const BitSet: BitSetConstructor

    export default BitSet
}