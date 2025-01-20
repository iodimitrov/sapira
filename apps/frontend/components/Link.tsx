import clsx from 'clsx';
import { useRouter } from 'next/router';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import MuiLink, { LinkProps as MuiLinkProps } from '@material-ui/core/Link';
import { forwardRef } from 'react';

interface LinkPropsBase {
  activeClassName?: string;
  naked?: boolean;
}

// Omit href from MuiLinkProps as we'll handle it via NextLinkProps
export type LinkProps = LinkPropsBase &
  Omit<MuiLinkProps, 'href'> &
  NextLinkProps;

const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const {
    activeClassName = 'active',
    className: classNameProps,
    href,
    naked,
    ...other
  } = props;

  const router = useRouter();
  const pathname = typeof href === 'string' ? href : href.pathname;
  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === pathname && activeClassName,
  });

  if (naked) {
    return <NextLink className={className} ref={ref} href={href} {...other} />;
  }

  return (
    <MuiLink
      component={NextLink}
      className={className}
      ref={ref}
      href={href.toString()}
      {...other}
    />
  );
});

Link.displayName = 'Link';

export default Link;
