from sage.all import GF
from sage._common import hexarr

if __name__ == "__main__":
  tests = []

  for order in [23, 2503]:
    F = GF(order) 
    Fx = F['x']
    m = Fx.irreducible_element(4) # degree 4
    Fxm = GF(order^m.degree(), name="x", modulus=m)
    p, q = Fxm.random_element(), Fxm.random_element()

    tests.append({
      "p": hexarr(p.polynomial().coefficients(0)),
      "q": hexarr(q.polynomial().coefficients(0)),
      "m": hexarr(m.coefficients(0)),
      "o": order,
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
