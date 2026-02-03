import { ReadonlyURLSearchParams } from './navigation'

describe('wabix/navigation', () => {
  it('should be able to construct URLSearchParams from ReadonlyURLSearchParams', () => {
    const searchParams = new URLSearchParams('?foo=test&bar=test')
    const readonlySearchParams = new ReadonlyURLSearchParams(searchParams)
    expect(() => new URLSearchParams(readonlySearchParams)).not.toThrow()
  })
})
