const getToken = (req) => {
  const token = req.headers.authorization;

  const auth = token.split(" ")[1];

  return auth;
};

export default getToken;
