from sage.all import GF

if __name__ == "__main__":
  tests = []

  for (p, q, m, o) in [
    ([0, 2], [1, 2], [1, 0, 1], 3),
    ([1, 0, 11], [1, 2, 3], [7, 0, 9, 1], 13)
  ]:
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
      # additive
      "add": str(p + q),
      "sub": str(p - q),
      "neg": str(-p),
      # multiplicative
      "mul": str(p * q),
      "div": str(p / q), # quotient
      "inv": str(1/ p),
      # exponentiation
      "exp": str(p ^ 5)
    })


  print(tests)

    

  