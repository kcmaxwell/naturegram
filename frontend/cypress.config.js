const { defineConfig } = require('cypress');
const axios = require('axios');

module.exports = defineConfig({
	env: {
		backend: 'http://localhost:8000',
	},
	e2e: {
		baseUrl: 'http://localhost:3000',
		setupNodeEvents(on, config) {
			on('task', {
				async 'db:seed'() {
					// Send request to backend API to re-seed database with test data
					//const { data } = await axios.post(`http://localhost:8000/test/seedDB`)
					return axios.post(`http://localhost:8000/test/seedDB`)
            .then((response) => {
              let data = response.data;
              return data;
            })
					//return data;
          // await fetch(Cypress.env(backend) + '/test/seedDB', {
					// 	method: 'POST',
					// 	headers: { 'Content-Type': 'application/json' },
					// });
				},
			});
		},
	},
});
