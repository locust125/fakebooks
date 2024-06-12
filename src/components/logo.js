import * as FractalIcon from 'public/assets/icons/icon.svg';
import Image from 'next/image';

export const Logo = () => {
  return (
    <Image
      src={FractalIcon}
      alt="Fractal icon"
      width={150}
      height={50}
      style={{ objectFit: 'fill' }}
    />
  );
};
