import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    backEndUrl: process.env.BACKEND_URL,
  },
});
