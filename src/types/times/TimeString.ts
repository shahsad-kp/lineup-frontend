type Hour = `${'0' | '1'}${Digit}` | `2${'0' | '1' | '2' | '3'}`;
type Minute = `${'0' | '1' | '2' | '3' | '4' | '5'}${Digit}`;
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type TimeString = `${Hour}:${Minute}`;