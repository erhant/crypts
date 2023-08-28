from sage.all import GF, EllipticCurve
from sage._common import hexarr

def to_weierstrass(A, B, x, y):
	return (x/B + A/(3*B), y/B)
def to_montgomery(A, B, u, v):
	return (B * (u - A/(3*B)), B*v)

def random_points(E: EllipticCurve):
  inf = E(0)
  p = E.random_element()
  while p == inf:
    p = E.random_element()
  q = E.random_element()
  while q == inf or q == -p:
    q = E.random_element()
  return p, q

if __name__ == "__main__":
  tests = []

  for (params, order) in [
    ([8, 8], 13)
  ]:
    E = EllipticCurve(GF(order), params)
    p, q = random_points(E)

    tests.append({
      "p": hexarr(p.xy()),
      "q": hexarr(q.xy()),
      "o": hex(order),
      "ab": params,
      "double": str((p + p).xy()),
      "scale": str((p * 5).xy()),
      "add": str((p + q).xy()),
      "sub": str((p - q).xy()),
      "neg": str((-p).xy()),
    })


  print(tests)

    

  