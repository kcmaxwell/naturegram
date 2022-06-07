describe('Navbar', () => {
	beforeEach(() => {
		cy.task('db:seed');

		cy.request('POST', Cypress.env('backend') + '/auth/login', {
			username: 'user',
			password: 'pass',
		}).then((res) => {
			expect(res.status).to.eq(200);
		});
		cy.visit('/');
	});

	it('check navbar is visible on all authorized pages', () => {});

	it('check navbar is not visible on unauthorized pages', () => {});
});
