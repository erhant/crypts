from sage.all import GF, EllipticCurve
from sage._common import hexarr, random_points


# Short Weiestrass curve to Montgomery curve
def sw_to_mont(a, b, s, z0):
    return 0  # TODO


# Short Weiestrass point to Montgomery point
def sw_to_mont_point(pt, s, z0):
    return (s * (pt[0] - z0), s * pt[1])


# Montgomery curve to Twisted Edwards curve
def mont_to_ted(pt):
    return 0  # TODO


# Montgomery point to Twisted Edwards point
def mont_to_ted_point(pt):
    return (pt[0] / pt[1], (pt[0] - 1) / (pt[0] + 1))


if __name__ == "__main__":
    tests = []

    for params, s, z0, order in [
        # tiny-jubjub
        ([8, 8], 7, 4, 13)
    ]:
        # Short Weierstrass curve
        E = EllipticCurve(GF(order), params)
        p, q = random_points(E)

        tests.append(
            {
                "o": hex(order),
                # short weierstrass
                "sw": {
                    "p": hexarr(p.xy()),
                    "q": hexarr(q.xy()),
                    "params": sw_params,
                    "double": str((p + p).xy()),
                    "scale": str((p * 5).xy()),
                    "add": str((p + q).xy()),
                    "sub": str((p - q).xy()),
                    "neg": str((-p).xy()),
                },
                "mont": {
                    "p": hexarr(pM),
                    "q": hexarr(qM),
                    "params": mont_params,
                    "double": str(M.add(pM, pM)),
                    # "scale": str((p * 5).xy()),
                    "add": str(M.add(pM, qM)),
                    "sub": str(M.add(pM, M.inverse(qM))),
                    "neg": str(M.inverse(pM)),
                },
            }
        )

    print(tests)
