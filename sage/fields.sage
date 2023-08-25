from sage.all import GF, legendre_symbol, xgcd

if __name__ == "__main__":
  order = 13
  F = GF(order) 

  tests = []
  for (n, m, o) in [(24, 32, 23), (9, 8, 13), (2, 1, 5), (6, 12, 17)]:
    F = GF(o) 
    n, m = F(n), F(m)

    tests.append({
      "n": n,
      "m": m,
      "o": o,
      "add": n + m,
      "sub": n - m,
      "mul": n * m,
      "div": n / m,
      "exp": n ^ m,
      "neg": -n,
      "inv": 1/n,
      "legendre": legendre_symbol(n, order),
      "xgcd": list(xgcd(n, m))
    })

  print(tests)

