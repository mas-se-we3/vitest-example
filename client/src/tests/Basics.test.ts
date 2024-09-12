import { expect, test, vitest } from 'vitest'

test('the absolute minimum', () => {
  // assert
  expect(1).toBe(1)
})

test('if 2 is smaller than 3', () => {
  // assert
  expect(2).toBeLessThan(3)
})

test('the mock been called once', () => {
  // arrange
  const mock = vitest.fn()

  // act
  mock()

  // assert
  expect(mock).toHaveBeenCalledTimes(1)
})

test('the mock been called with arguments', () => {
  // arrange
  const mock = vitest.fn()

  // act
  mock(1, '2')

  // assert
  expect(mock).toHaveBeenCalledTimes(1)
  expect(mock).toHaveBeenCalledWith(1, '2')
})
