
type TwoDigit = `${Digit}${Digit}`;
type FourDigitYear = `${Digit}${Digit}${Digit}${Digit}`;
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type DateString = `${TwoDigit}/${TwoDigit}/${FourDigitYear}`;
