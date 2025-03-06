const gCD = (a, b) => {
  if (b > a) return gCD(b, a);
  if (!(a % b)) return b;
  return gCD(b, a % b);
};

console.log(gCD(9, 12));

console.log(gCD(12, 9));

console.log(gCD(2, 5));

console.log(-12 % -9);

//console.log(gCD(-12, -9));
