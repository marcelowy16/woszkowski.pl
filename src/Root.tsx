import {Composition} from 'remotion';
import {LogoReveal} from './LogoReveal';

export const RemotionRoot = () => {
  return (
    <Composition
      id="LogoReveal"
      component={LogoReveal}
      durationInFrames={150}
      fps={30}
      width={3840}
      height={2160}
    />
  );
};
