import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { styled } from "@mui/material/styles";
import { withAuthGuard } from "src/hocs/with-auth-guard";
import { TopNav } from "./top-nav";
import { CatalogsProvider } from "src/contexts/catalogs-context";

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  maxWidth: "100%",
  backgroundImage: 'url("/FondoRelax.avif")', // Fondo de imagen deseado
  backgroundSize: "cover",
  backgroundPosition: "center",
  [theme.breakpoints.up("lg")]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled("div")({

});

export const Layout = withAuthGuard((props) => {
  const { children } = props;
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  return (
    <>
      <CatalogsProvider>
        <TopNav onNavOpen={() => setOpenNav(true)} />

        <LayoutRoot>
          <LayoutContainer>{children}</LayoutContainer>
        </LayoutRoot>
      </CatalogsProvider>
    </>
  );
});
