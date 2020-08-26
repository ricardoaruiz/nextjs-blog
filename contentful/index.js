import * as contentful from 'contentful';

export const client = contentful.createClient({
  space: process.env.space,
  accessToken: process.env.accessToken,
});
