from sage.all import GF

if __name__ == "__main__":
  order = 13
  F = GF(order)
  Fx = F['x']

  p, q = Fx([10, 2, 3]), Fx([3, 2, 1])
  tests = {
    "p": p,
    "q": q,
    "add": p + q,
    "sub": p - q,
    "mul": p * q,
    "neg": -p
  }
  print(tests)

