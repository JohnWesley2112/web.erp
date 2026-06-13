import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import LogoMain from '../../../assets/images/logos/LogoMain.svg';
import LogoMini from '../../../assets/images/logos/LogoMini.svg';

// import type { RootState } from 'src/store';

const LinkStyled = styled(Link)<{
  collapse: boolean;
  topbarheight: string | number;
}>(({ collapse, topbarheight }) => ({
  height: topbarheight,
  width: collapse ? '40px' : '180px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
}));

const Logo = () => {
  const customizer = useSelector(
    (state: any) => state.customizer
  );

  return (
    <LinkStyled
      to="/"
      collapse={customizer.isCollapse}
      topbarheight={customizer.TopbarHeight}
    >
      <img
        // src={LogoMain}
        src={
          customizer.isCollapse
            ? LogoMini
            : LogoMain
        }
        alt="Logo"
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </LinkStyled>
  );
};

export default Logo;