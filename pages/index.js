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
        </section>
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
          <h2 className={utilStyles.headingLg}>
            Dados do Markdown no file system
          </h2>
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

          <h2 className={utilStyles.headingLg}>Dados do contentful</h2>
          <ul>
            {foods.map(food => (
              <li key={food.title}>
                <img src={food.image} alt={food.title} />
              </li>
            ))}
          </ul>

          <h2 className={utilStyles.headingLg}>Dados da api randomuser.me</h2>
          <ul>
            {people.map(p => (
              <li key={p.name}>{p.name}</li>
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
    'https://randomuser.me/api/?results=5&gender=male',
  );

  const people = peopleResponse.data.results.map(p => ({
    name: `${p.name.first} ${p.name.last}`,
  }));

  const recipesResponse = await client.getEntries({
    content_type: 'recipes',
  });

  const foods = recipesResponse.items.map(food => {
    const { featuredImage } = food.fields;

    return {
      title: featuredImage.fields.title,
      image: featuredImage.fields.file.url,
    };
  });

  return {
    props: {
      allPostsData,
      people,
      foods,
    },
  };
};

// Em prod é executado somente em tempo de build
// Em dev é executado sempre que a página é carregada
// "getServerSideProps" é utilizado para renderização server side a cada requisição.

// https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
const getServerSideProps = async () => {
  const peopleResponse = await axios.get(
    'https://randomuser.me/api/?results=5&gender=male',
  );

  const people = peopleResponse.data.results.map(p => ({
    name: `${p.name.first} ${p.name.last}`,
  }));

  const recipesResponse = await client.getEntries({
    content_type: 'recipes',
  });

  const foods = recipesResponse.items.map(food => {
    return {
      title: food.fields.featuredImage.fields.title,
      image: food.fields.featuredImage.fields.file.url,
    };
  });

  return {
    props: {
      allPostsData: [],
      people,
      foods,
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
      name: PropTypes.string,
    }),
  ),
  foods: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      image: PropTypes.string,
    }),
  ),
};

export default Home;
