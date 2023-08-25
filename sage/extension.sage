from sage.all import GF

if __name__ == "__main__":
  # TODO TODO TODO
  order = 3
  F = GF(order)
  Fx = F['x']

  irr_poly = Fx([1, 0, 1]) # 2x^2 + 2
  assert(irr_poly.is_irreducible())
  deg = irr_poly.degree()

  Fm = GF(order^deg, name="x", modulus=irr_poly)

  for elem in Fm:
    print(elem)

  # p, q = Fx([10, 2, 3]), Fx([3, 2, 1])
  # tests = {
  #   "p": p,
  #   "q": q,
  #   "add": p + q,
  #   "sub": p - q,
  #   "mul": p * q,
  #   "neg": -p
  # }
  # print(tests)

