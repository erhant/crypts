from sage.all import EllipticCurve

def hexarr(arr):
  '''
  Given an array of values, applies `hex` to each element and returns the resulting list.
  '''
  return list(map(lambda x : hex(x), arr))


def random_points(E: EllipticCurve):
  '''
  Generates two points `p, q` on the curve, such that both are not the point at infinity and
  `p != -q`.
  '''
  inf = E(0)
  p = E.random_element()
  while p == inf:
    p = E.random_element()
  q = E.random_element()
  while q == inf or q == -p:
    q = E.random_element()
  return p, q
