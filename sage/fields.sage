from sage.all import GF, legendre_symbol

if __name__ == "__main__":
  order = 13
  F = GF(order)

  n, m = F(24), F(32)
  tests = {
    "n": n,
    "m": m,
    "add": n + m,
    "sub": n - m,
    "mul": n * m,
    "exp": n ^ m,
    "neg": -n,
    "inv": 1/n,
    "legendre": legendre_symbol(n, order)
  }
  print(tests)

