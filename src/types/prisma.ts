export type Size = {
  id: string
  name: "SMALL" | "MEDIUM" | "LARGE"
  price: number
  productId: string | null
}

export type Extra = {
  id: string
  name: string
  price: number
  productId: string | null
}
