import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Link from 'next/link';
import axios from 'axios';
import Layout, { siteTitle } from '../components/Layout';
import Date from '../components/Date';
import utilStyles from '../styles/util.module.scss';
import { getSortedPostsData } from '../lib/posts';
import { client } from '../contentful';

const Home = ({ allPostsData, people, foods }) => {
  // console.log('allPostsData', allPostsData);
  // console.log('people', people);
  // console.log('foods', foods);

  return (
    <Layout home>
      <>
        <Head>
          <title>{siteTitle}</title>
        </Head>
        <section className={utilStyles.headingMd}>
          <p>[Your Self Introduction]</p>
          <p>
            (This is a sample website - you’ll be building a site like this on
{' '}
            <a href="https://nextjs.org/learn">our Next.js tutorial</a>
            .)
          </p>
          <Link href="/posts/first-post">
            <a>First Post</a>
          </Link>
        </section>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>Blog</h2>
          <ul className={utilStyles.list}>
            {allPostsData.map(({ id, date, title }) => (
              <li className={utilStyles.listItem} key={id}>
                <Link href="/posts/[id]" as={`/posts/${id}`}>
                  <a>{title}</a>
                </Link>
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
              </li>
            ))}
          </ul>
        </section>
      </>
    </Layout>
  );
};

// Em prod é executado somente em tempo de build
// Em dev é executado sempre que a página é carregada
// "getStaticProps" é utilizado para renderização estática ou seja em tempo de build

// https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
export const getStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  const peopleResponse = await axios.get(
    'https://randomuser.me/api/?gender=male',
  );

  const recipesResponse = await client.getEntries({ content_type: 'recipes' });

  return {
    props: {
      allPostsData,
      people: peopleResponse.data.results,
      foods: recipesResponse.items,
    },
  };
};

// Em prod é executado somente em tempo de build
// Em dev é executado sempre que a página é carregada
// "getServerSideProps" é utilizado para renderização server side a cada requisição.

// https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
const getServerSideProps = async () => {
  const peopleResponse = await axios.get(
    'https://randomuser.me/api/?gender=male',
  );
  const recipesResponse = await client.getEntries({ content_type: 'recipes' });

  return {
    props: {
      allPostsData: [],
      people: peopleResponse.data.results,
      foods: recipesResponse.items,
    },
  };
};

Home.defaultProps = {
  allPostsData: [],
  people: [],
  foods: [],
};

Home.propTypes = {
  allPostsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      date: PropTypes.string,
    }),
  ),
  people: PropTypes.arrayOf(
    PropTypes.shape({
      name: {
        first: PropTypes.string,
        last: PropTypes.string,
      },
    }),
  ),
  foods: PropTypes.arrayOf(
    PropTypes.shape({
      fields: {
        name: PropTypes.string,
        description: PropTypes.string,
        type: PropTypes.string,
        featuredImage: PropTypes.string,
      },
    }),
  ),
};

export default Home;
