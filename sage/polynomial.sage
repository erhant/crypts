from sage.all import GF, randrange

if __name__ == "__main__": 
  tests = []

  for order in [23, 2503]:
    F = GF(order) 
    Fx = F['x']
    p_deg, q_deg = randrange(0, 7), randrange(0, 7)
    p, q = Fx.random_element(p_deg), Fx.random_element(q_deg)

    tests.append({
      "p": list(map(lambda x : hex(x), p.coefficients(0))),
      "q": list(map(lambda x : hex(x), q.coefficients(0))),
      "o": hex(order),
      "lead": hex(p.leading_coefficient()),
      "deg": p.degree(),
      "add": str(p + q),
      "sub": str(p - q),
      "mul": str(p * q),
      # p over q
      "divpq": str(p // q), # quotient
      "modpq": str(p % q), # remainder
      # q over p
      "divqp": str(q // p), # quotient
      "modqp": str(q % p), # remainder
      "neg": str(-p),
    })

  print(tests)

