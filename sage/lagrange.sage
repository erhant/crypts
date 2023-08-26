from sage.all import GF

if __name__ == "__main__": 
  tests = []

  for (ps, o) in [
    ([[0, 1], [1, 2]], 5)
  ]:
    F = GF(o) 
    Fx = F['x']
    l = Fx.lagrange_polynomial(ps)

    tests.append({
      "ps": ps,
      "o": o,
      "poly": str(l),
    })

  print(tests)

