/**
 * Represents a tuple that can either contain a value of type T and null, or an error of type GophError or Error and null.
 */
export type GophTuple<T> = [T, null] | [null, GophError | Error]

/**
 * Represents the arguments that can be passed to the GophError constructor.
 */
type GophErrorConstructor = {
  message?: string
  childError?: Error | GophError | null
}

/**
 * Represents an error that can be wrapped around another error.
 */
export class GophError extends Error {
  /**
   * The child error that this error is wrapping around.
   */
  private childErr: Error | GophError | null

  /**
   * Creates a new instance of the GophError class.
   * @param args The arguments to pass to the constructor.
   */
  public constructor(args: GophErrorConstructor) {
    super(args.message)

    this.childErr = args.childError || null
  }

  /**
   * Wraps an error in a GophError instance.
   * @param err The error to wrap.
   * @param errMsg The error message to use for the new GophError instance.
   * @returns A tuple containing null and the new GophError instance.
   */
  public static wrap(
    err: Error | GophError,
    errMsg?: string
  ): [null, GophError] {
    const error = new GophError({
      message: errMsg,
      childError: err,
    })

    return [null, error]
  }

  /**
   * Wraps an error with a message.
   * @param err The error to wrap.
   * @param errMsg The error message to use for the new GophError instance.
   * @returns A tuple of the result and the error
   */
  public wrap(err: Error | GophError, errMsg?: string): [null, GophError] {
    return GophError.wrap(err, errMsg)
  }

  /**
   * Unwraps the child error from this GophError instance.
   * @returns The child error, or null if there is no child error.
   */
  public unwrap(): Error | GophError | null {
    return this.childErr
  }

  /**
   * Unwraps all child errors in the stack
   * @returns The last error in the stack. If there is no child error, returns itself.
   */
  public unwrapAll(): Error | GophError {
    let err: Error | GophError = this

    while (err instanceof GophError) {
      const nextErr = err.unwrap()
      if (nextErr === null) break

      err = nextErr
    }

    return err
  }

  /**
   * Returns a string of all the error messages in the stack separated by newlines. The first message is the lowest level error.
   * @returns A string of all error messages.
   */
  public messageStack(): string {
    let err: Error | GophError = this
    let msgs: string[] = []

    while (err) {
      msgs.push(err.message)

      // Break if the error is not a GophError
      if (!(err instanceof GophError)) break

      const nextErr = err.unwrap()
      if (nextErr === null) break

      err = nextErr
    }

    return msgs.reverse().join('\n')
  }

  /**
   * Catches a function that may throw an error.
   * @param fn The function to execute.
   * @param errMsg The error message to use for the new GophError instance.
   * @returns a tuple of the result and the error.
   */
  public static from<T>(fn: () => T, errMsg?: string): GophTuple<T> {
    try {
      return [fn(), null]
    } catch (err) {
      return this.wrap(err as Error | GophError, errMsg)
    }
  }

  /**
   * Catches an async function that may throw an error.
   * @param fn The async function to execute.
   * @param errMsg The error message to use for the new GophError instance.
   * @returns A promise of a tuple of the result and the error.
   */
  public static async fromAsync<T>(
    fn: () => Promise<T>,
    errMsg?: string
  ): Promise<GophTuple<T>> {
    try {
      return [await fn(), null]
    } catch (err) {
      return this.wrap(err as Error | GophError, errMsg)
    }
  }
}
