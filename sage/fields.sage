from sage.all import GF, legendre_symbol, xgcd

if __name__ == "__main__":
  tests = []

  for (n, m, o) in [(24, 32, 23), (9, 8, 13), (6, 12, 17), (1298, 1453, 2503)]:
    F = GF(o) 
    n, m = F(n), F(m)

    tests.append({
      "n": n,
      "m": m,
      "o": o,
      # additive
      "add": n + m,
      "sub": n - m,
      "neg": -n,
      # multiplicative
      "mul": n * m,
      "div": n / m,
      "inv": 1/n,
      # exponentiation
      "exp": n ^ 5,
      # legendre
      "legendre": legendre_symbol(n, o)
    })

  print(tests)

