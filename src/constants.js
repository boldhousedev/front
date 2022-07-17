

export default {
    env: {
        development: 0,
        testing: 1,
        staging: 2,
        production: 3,
    },
    auth: {
        access: {
            public: 0,
            private: 1,
            internal: 2,
        },
        route: {
            preferredAuth: 'login',
            login: 'login',
            signup: 'signup',
            activate: 'activate',
        }
    },

};