import { GophError } from '../src/index'

describe('GophError', () => {
  it('should properly return a result on error', () => {
    const tester = () => {
      throw new Error('test')
    }

    const [result, err] = GophError.from(tester)

    expect(result).toBeNull()
    expect(err).toBeInstanceOf(GophError)
  })

  it('should properly return a result on success', () => {
    const tester = () => {
      return 'test'
    }

    const [result, err] = GophError.from(tester)

    expect(result).toBe('test')
    expect(err).toBeNull()
  })

  it('should properly return a result on async error', async () => {
    const tester = async () => {
      throw new Error('test')
    }

    const [result, err] = await GophError.fromAsync(tester)

    expect(result).toBeNull()
    expect(err).toBeInstanceOf(GophError)
  })

  it('should properly return a result on async success', async () => {
    const tester = async () => {
      return 'test'
    }

    const [result, err] = await GophError.fromAsync(tester)

    expect(result).toBe('test')
    expect(err).toBeNull()
  })

  it("should correctly unwrap a GophError's child error", () => {
    const tester = () => {
      throw new Error('test')
    }

    const [result, err] = GophError.from(tester)

    expect(result).toBeNull()
    expect(err).toBeInstanceOf(GophError)

    const unwrapped = (err as GophError).unwrap()

    expect(unwrapped).toBeInstanceOf(Error)
    expect(unwrapped?.message).toBe('test')
  })

  it('should correctly unwrapAll to the base error', () => {
    const tester = () => {
      throw new Error('test')
    }

    const doubleTester = () => {
      const [res, err] = GophError.from(tester)

      if (err) {
        return GophError.wrap(err)
      }

      return [res, null]
    }

    const tripleTester = () => {
      const [res, err] = doubleTester()

      if (err) {
        return GophError.wrap(err)
      }

      return [res, null]
    }

    const [result, err] = tripleTester()

    expect(result).toBeNull()
    expect(err).toBeInstanceOf(GophError)

    const unwrapped = (err as GophError).unwrapAll()

    expect(unwrapped).toBeInstanceOf(Error)
    expect(unwrapped?.message).toBe('test')
  })

  it('should correctly unwrapAll to the base error on async', async () => {
    const tester = async () => {
      throw new Error('test')
    }

    const doubleTester = async () => {
      const [res, err] = await GophError.fromAsync(tester)

      if (err) {
        return GophError.wrap(err)
      }

      return [res, null]
    }

    const tripleTester = async () => {
      const [res, err] = await doubleTester()

      if (err) {
        return GophError.wrap(err)
      }

      return [res, null]
    }

    const [result, err] = await tripleTester()

    expect(result).toBeNull()
    expect(err).toBeInstanceOf(GophError)

    const unwrapped = (err as GophError).unwrapAll()

    expect(unwrapped).toBeInstanceOf(Error)
    expect(unwrapped?.message).toBe('test')
  })

  it('should correctly store the stack trace', () => {
    const tester = () => {
      throw new Error('test')
    }

    const tester2 = () => {
      const [res, err] = GophError.from(tester)

      if (err) {
        return GophError.wrap(err, 'test2')
      }

      return [res, null]
    }

    const [result, err] = tester2()

    expect(result).toBeNull()
    expect(err).toBeInstanceOf(GophError)
    expect(err?.stack).toBeDefined()
  })

  it('should correctly display the message trace', () => {
    const tester = () => {
      throw new Error('Something catastrophic happened')
    }

    const tester2 = () => {
      const [res, err] = GophError.from(tester)

      if (err) {
        return GophError.wrap(err, 'Something else happened')
      }

      return [res, null]
    }

    const [result, err] = tester2()

    expect(result).toBeNull()
    expect(err).toBeInstanceOf(GophError)
    expect(err?.messageStack()).toMatch('Something catastrophic happened')
    expect(err?.messageStack()).toMatch('Something else happened')
  })
})
