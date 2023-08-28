def hexarr(arr):
  '''
  Given an array of values, applies `hex` to each element and returns the resulting list.
  '''
  return list(map(lambda x : hex(x), arr))
