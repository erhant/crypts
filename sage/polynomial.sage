from sage.all import GF

if __name__ == "__main__": 
  tests = []

  for (p, q, o) in [([1, 2, 3], [3, 2, 1], 5), ([1, 6, 7], [2, 3], 17)]:
    F = GF(o) 
    Fx = F['x']
    p, q = Fx(p), Fx(q)

    tests.append({
      "p": p.coefficients(0),
      "q": q.coefficients(0),
      "o": o,
      "lead": p.leading_coefficient(),
      "deg": p.degree(),
      "add": str(p + q),
      "sub": str(p - q),
      "mul": str(p * q),
      "div": str(p // q), # quotient
      "mod": str(p % q), # remainder
      "neg": str(-p),
    })

  print(tests)

