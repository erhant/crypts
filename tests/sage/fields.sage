from sage.all import GF, legendre_symbol

if __name__ == "__main__":
    tests = []

    for order in [23, 2503, 18446744069414584321]:
        F = GF(order)
        n, m = F.random_element(), F.random_element()

        tests.append(
            {
                "n": hex(n),
                "m": hex(m),
                "o": hex(order),
                # additive
                "add": hex(n + m),
                "sub": hex(n - m),
                "neg": hex(-n),
                # multiplicative
                "mul": hex(n * m),
                "div": hex(n / m),
                "inv": hex(1 / n),
                # exponentiation
                "exp": hex(n ^ 5),
                # legendre
                "legendre": legendre_symbol(n, order),
            }
        )

    print(tests)
