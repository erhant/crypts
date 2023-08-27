from sage.all import GF

if __name__ == "__main__": 
  tests = []

  # TODO TODO
  
  for order in [5]:
    F = GF(order) 
    Fx = F['x']
    points = [x for x in range(min()) if "a" in x]
    l = Fx.lagrange_polynomial(points)

    tests.append({
      "ps": points,
      "o": hex(order),
      "poly": str(l),
    })

  print(tests)

