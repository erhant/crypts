from sage.all import GF, EllipticCurve

if __name__ == "__main__":
  tests = []

  for (ab, o, p, q) in [
    ([8, 8], 13, [10, 10], [1, 2])
  ]:
    E = EllipticCurve(GF(o), ab)
    p = E(p[0], p[1])
    q = E(q[0], q[1])

    tests.append({
      "p": list(p.xy()),
      "q": list(q.xy()),
      "o": o,
      "ab": ab,
      "double": str((p + p).xy()),
      "scale": str((p * (o - 1)).xy()),
      "add": str((p + q).xy()),
      "sub": str((p - q).xy()),
      "neg": str((-p).xy()),
    })


  print(tests)

    

  