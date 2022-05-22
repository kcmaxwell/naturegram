describe('Signup page', () => {
	beforeEach(() => {
		cy.visit('/signup');
	});

	it('should redirect to login on successful signup', () => {
		cy.get('[data-cy=username]').type('username');
		cy.get('[data-cy=password]').type('password');
		cy.get('[data-cy=fullname]').type('User Name');
		cy.get('[data-cy=submit]').click();

		cy.url().should('include', 'login');
	});

	it('should not redirect if there is invalid input', () => {
		cy.get('[data-cy=username]').type(123);
		cy.get('[data-cy=password]').type('password');
		cy.get('[data-cy=fullname]').type('User Name');
		cy.get('[data-cy=submit]').click();

		cy.url().should('include', 'signup');
		cy.get('[data-cy=error]').should('be.visible');
	});
});
