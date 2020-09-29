const foo: string = 'Bar'

describe('My First Test', () => {
  it('Does not do much!', () => {
    console.log(foo)
    expect(true).to.equal(true)
  })
})
