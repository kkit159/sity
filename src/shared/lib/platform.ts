import useMedia from 'react-use/esm/useMedia';

export enum Platform {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
}

export const usePlatform = () => {
  const isMobile = useMedia('(max-width: 743px)');

  return isMobile ? Platform.MOBILE : Platform.DESKTOP;
};

export const useIsMobile = () => {
  return usePlatform() === Platform.MOBILE;
};

export const useIsDesktop = () => {
  return usePlatform() === Platform.DESKTOP;
};
