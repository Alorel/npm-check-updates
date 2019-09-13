const marker: unique symbol = Symbol('EarlyTermination');

export class EarlyTermination extends Error {
  public readonly [marker]: true;

  public static is(v: any): v is EarlyTermination {
    return !!v && !!v[marker];
  }
}

Object.defineProperty(EarlyTermination.prototype, marker, {value: true});
