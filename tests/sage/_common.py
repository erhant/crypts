from sage.all import EllipticCurve, GF, euler_phi, factor


def hexarr(arr):
    """
    Given an array of values, applies `hex` to each element and returns the resulting list.
    """
    return list(map(lambda x: hex(x), arr))


def random_points(E):
    """
    Generates two points `p, q` on the curve, such that both are not the point at infinity and
    `p != -q`.
    """
    inf = E(0)
    p = E.random_element()
    while p == inf:
        p = E.random_element()
    q = E.random_element()
    while q == inf or q == -p:
        q = E.random_element()
    return p, q


def find_generators(p):
    """
    Find generators of a prime field.
    """
    Fp = GF(p)

    order = p - 1
    assert order.is_prime()
    factorization = factor(order)
    print("Factors of", order, "are", factorization)

    gens = []
    for e in range(2, p):
        e = Fp(e)

        is_gen = True
        for f in map(lambda f: f[0], factorization):
            cf = order // f  # cofactor
            if e**cf == 1:
                # cofactor clearing results in 1, this is NOT a generator
                is_gen = False
                break

        if is_gen:
            gens.append(e)

    print(gens)
    assert len(gens) == euler_phi(order)
