from sage.all import EllipticCurve, GF


def random_points(E: EllipticCurve):
    """
    Generates two random points `p, q` such that both are not the point at infinity,
    and `p != -q` so that their sum is not the point at infinity.
    """
    inf = E(0)
    p = E.random_element()
    while p == inf:
        p = E.random_element()
    q = E.random_element()
    while q == inf or q == -p:
        q = E.random_element()
    return p, q


class MontgomeryCurve:
    """
    A Montgomery Curve over affine points.
    """

    A = 0
    B = 0
    F: GF

    def __init__(self, A, B, prime) -> None:
        F = GF(prime)
        self.A = F(A)
        self.B = F(B)
        self.F = F

    def add(self, P, Q):
        """
        Add points P and Q in the Montgomery curve.

        If P == Q, tangent law is used.
        If P != Q, chord law is used.
        """
        x1, x2, y1, y2 = P[0], Q[0], P[1], Q[1]
        if x1 != x2:
            # chord
            common = (y2 - y1) / (x2 - x1)
        else:
            # tangent
            common = (3 * x1 * x1 + 2 * self.A * x1 + 1) / (2 * self.B & y1)

        x3 = common * common * self.B - (x1 + x2) - self.A
        y3 = common * (x1 - x3) - y1
        assert self.in_curve((x3, y3))
        return (x3, y3)

    def in_curve(self, P) -> bool:
        """
        Returns true if the given point is in curve.
        """
        return self.B * (P[1] ** 2) == (P[0] ** 3) + self.A * (P[0] ** 2) + P[0]

    def inverse(self, P):
        """
        Inverts a point.
        """
        return (P[0], self.F.order() - P[1])

    def point(self, x, y):
        """
        Return the a point in curve.
        """
        P = (self.F(x), self.F(y))
        assert self.in_curve(P)
        return P


class TwistedEdwardsCurve:
    """
    A Twisted Edwards Curve over affine points.
    """

    a = 0
    d = 0
    F: GF

    def __init__(self, a, d, prime) -> None:
        F = GF(prime)
        self.a = F(a)
        self.d = F(d)
        self.F = F

    def add(self, P, Q):
        """
        Add points P and Q in the Twisted Edwards curve.
        """
        x1, x2, y1, y2 = P[0], Q[0], P[1], Q[1]

        x3 = (x1 * y2 + y1 * x2) / (1 + self.d * x1 * x2 * y1 * y2)
        y3 = (y1 * y2 - self.a * x1 * x2) / (1 - self.d * x1 * x2 * y1 * y2)
        return (x3, y3)

    def in_curve(self, P) -> bool:
        """
        Returns true if the given point is in curve.
        """
        return self.a * (P[0] ** 2) + (P[1] ** 2) == self.F(1) + self.d * (
            P[0] ** 2
        ) * (P[1] ** 2)

    def inverse(self, P):
        """
        Inverts a point.
        """
        return (self.F.order() - P[0], P[1])

    def point(self, x, y):
        """
        Return the a point in curve.
        """
        P = (self.F(x), self.F(y))
        assert self.in_curve(P)
        return P
