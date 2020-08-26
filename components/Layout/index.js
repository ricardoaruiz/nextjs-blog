import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';

import utilStyles from '../../styles/util.module.scss';
import * as S from './styles.js';

export const siteTitle = 'Next.js Sample Website';

const Layout = ({ children, home }) => {
  const name = useMemo(() => 'Your Name', []);

  return (
    <S.Container>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <S.Header>
        {home ? (
          <>
            <S.HeaderHomeImage
              src="/images/profile.jpeg"
              className={utilStyles.borderCircle}
              alt={name}
            />
            <h1 className={utilStyles.heading2Xl}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <S.HeaderImage
                  src="/images/profile.jpeg"
                  className={utilStyles.borderCircle}
                  alt={name}
                />
              </a>
            </Link>
            <h2 className={utilStyles.headingLg}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </>
        )}
      </S.Header>

      <main>{children}</main>

      {!home && (
        <S.BackToHome>
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </S.BackToHome>
      )}
    </S.Container>
  );
};

Layout.defaultProps = {
  home: false,
};

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  home: PropTypes.bool,
};

export default Layout;
