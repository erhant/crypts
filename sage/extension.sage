from sage.all import GF

if __name__ == "__main__":
  tests = []

  for (p, q, m, o) in [([0, 2], [1, 2], [1, 0, 1], 3)]:
    F = GF(o) 
    Fx = F['x']
    m = Fx(m)
    Fxm = GF(o^m.degree(), name="x", modulus=m)
    p, q = Fxm(p), Fxm(q)

    tests.append({
      "p": p.polynomial().coefficients(0),
      "q": q.polynomial().coefficients(0),
      "m": m.coefficients(0),
      "o": o,
      "add": str(p + q),
      "sub": str(p - q),
      "mul": str(p * q),
      "div": str(p / q), # quotient
      "neg": str(-p),
      "inv": str(1/ p)
    })


  print(tests)

    

  