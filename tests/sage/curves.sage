from sage.all import GF, EllipticCurve, is_prime, Field, FieldElement
from _common import hexarr, random_points


class SW_MONT_Converter:
    F: Field
    a: FieldElement
    b: FieldElement

    def __init__(self, order: int, a: int, b: int):
        assert is_prime(order), "expected prime"
        self.F = GF(order)
        self.a = self.F(a)
        self.b = self.F(b)

    def sw_to_mont(self, s, z0):
        """
        Short Weiestrass curve to Montgomery curve

        MoonMath Manual, Page 90
        """
        E = EllipticCurve(self.F, [self.a, self.b])

        return 0  # TODO

    # Short Weiestrass point to Montgomery point
    def sw_to_mont_point(self, pt, s, z0):
        """
        Short Weiestrass curve to Montgomery curve

        MoonMath Manual, Page 92
        """

        # z0 must be root of z^3 + az + b
        assert self.F["z"]([self.b, self.a, 0, 1])(z0) == 0

        return (s * (pt[0] - z0), s * pt[1])


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
                    "params": params,
                    "double": str((p + p).xy()),
                    "scale": str((p * 5).xy()),
                    "add": str((p + q).xy()),
                    "sub": str((p - q).xy()),
                    "neg": str((-p).xy()),
                },
                # "mont": {
                #     "p": hexarr(pM),
                #     "q": hexarr(qM),
                #     "params": mont_params,
                #     "double": str(M.add(pM, pM)),
                #     # "scale": str((p * 5).xy()),
                #     "add": str(M.add(pM, qM)),
                #     "sub": str(M.add(pM, M.inverse(qM))),
                #     "neg": str(M.inverse(pM)),
                # },
            }
        )

    print(tests)
