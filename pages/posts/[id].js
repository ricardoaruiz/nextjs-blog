import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Layout from '../../components/Layout';
import Date from '../../components/Date';

import { getAllPostIds, getPostData } from '../../lib/posts';
import utilStyles from '../../styles/util.module.scss';

const Post = ({ postData }) => {
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

// Em prod é executado somente em tempo de build
// Em dev é executado sempre que a página é carregada
// getStaticProps é utilizado para renderização estática ou seja em tempo de build
// caso queira que os dados sejam coletados a cada requisição deve-se utilizar o "getServerSideProps"
// fazendo com que a renderização ocorra no server a cada requisição

// https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation
// https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering

export const getStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
};

Post.propTypes = {
  postData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    date: PropTypes.string,
    contentHtml: PropTypes.string,
  }).isRequired,
};

export default Post;
