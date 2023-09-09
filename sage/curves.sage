from sage.all import GF, EllipticCurve
from sage._common import hexarr
from sage._curves import random_points


if __name__ == "__main__":
    tests = []

    for params, order in [([8, 8], 13)]:
        E = EllipticCurve(GF(order), params)
        p, q = random_points(E)

        tests.append(
            {
                "p": hexarr(p.xy()),
                "q": hexarr(q.xy()),
                "o": hex(order),
                "ab": params,
                "double": str((p + p).xy()),
                "scale": str((p * 5).xy()),
                "add": str((p + q).xy()),
                "sub": str((p - q).xy()),
                "neg": str((-p).xy()),
            }
        )

    print(tests)
