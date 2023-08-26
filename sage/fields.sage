from sage.all import GF, legendre_symbol, xgcd

if __name__ == "__main__":
  tests = []

  for (n, m, o) in [
    (24, 32, 23),
    (9, 8, 13),
    (6, 12, 17),
    (1298, 1453, 2503),
    (5794175866541469688, 4718843181959614176, 18446744069414584321)
  ]:
    F = GF(o) 
    n, m = F(n), F(m)

    tests.append({
      "n": hex(n),
      "m": hex(m),
      "o": hex(o),
      # additive
      "add": hex(n + m),
      "sub": hex(n - m),
      "neg": hex(-n),
      # multiplicative
      "mul": hex(n * m),
      "div": hex(n / m),
      "inv": hex(1/n),
      # exponentiation
      "exp": hex(n ^ 5),
      # legendre
      "legendre": legendre_symbol(n, o)
    })

  print(tests)

