from sage.all import GF, legendre_symbol, xgcd

if __name__ == "__main__":
  tests = []

  for (n, m, o) in [(24, 32, 23), (9, 8, 13), (6, 12, 17)]:
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
      "neg": -n,
      "inv": 1/n,
    })

  print(tests)

