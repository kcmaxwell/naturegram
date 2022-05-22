describe('Login page', () => {
	beforeEach(() => {
		cy.visit('/login');
	});

	it('should redirect to homepage on successful login', () => {
        cy.get('[data-cy=username]').type('user');
        cy.get('[data-cy=password]').type('pass');
        cy.get('[data-cy=submit]').click();

		cy.location().should((loc) => {
            expect(loc.pathname).to.eq('/');
        });
	});

	it('should show an error if there is invalid input', () => {
        cy.get('[data-cy=password]').type('pass');
        cy.get('[data-cy=submit]').click();

		cy.url().should('include', 'login');
		cy.get('[data-cy=error]').should('be.visible');
	});

	it('should show an error if the username does not exist', () => {
        cy.get('[data-cy=username]').type('baduser');
        cy.get('[data-cy=password]').type('pass');
        cy.get('[data-cy=submit]').click();

		cy.url().should('include', 'login');
		cy.get('[data-cy=error]').should('be.visible');
	});

	it('should show an error if the password does not match', () => {
        cy.get('[data-cy=username]').type('user');
        cy.get('[data-cy=password]').type('badpass');
        cy.get('[data-cy=submit]').click();

		cy.url().should('include', 'login');
		cy.get('[data-cy=error]').should('be.visible');
	});
});
