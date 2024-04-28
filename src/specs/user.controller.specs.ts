export const LoginSchema = {
  description: 'login paramters',
  content: {
    'application/x-www-form-urlencoded': {
      schema: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: {type: 'string'},
          password: {type: 'string'},
        },
      },
    },
  },
};
