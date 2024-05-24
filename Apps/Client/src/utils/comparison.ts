interface Comparator<T> {
  (a: T, b: T): number;
}

export const createCompareFunction = <T> (comparators: Comparator<T>[]): Comparator<T> => {
  return (a: T, b: T): number => {
      for (const comparator of comparators) {
          const result = comparator(a, b);
          if (result !== 0) {
              return result;
          }
      }
      return 0; // If all comparisons result in equality
  };
}