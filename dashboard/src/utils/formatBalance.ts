import { formatBalance } from '@polkadot/util';

const format = (value: string, withSi?: boolean): string => {
    const M_LENGTH = 6 + 1;
    const K_LENGTH = 3 + 1;
    
    const [prefix, postfix] = formatBalance(value, { forceUnit: '-', withSi: false }).split('.');
    const isShort = withSi && prefix.length >= K_LENGTH;

    if (prefix.length > M_LENGTH) {
      return formatBalance(value);
    }

    return value;
  }

  export default format
