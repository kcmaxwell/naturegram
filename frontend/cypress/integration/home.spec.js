describe('Home page', () => {
    beforeEach(() => {
        cy.request('POST', Cypress.env('BACKEND') + '/auth/login', 
            {username: 'user', password: 'pass'})
            .then(res => {
                expect(res.status).to.eq(200);
            });
        cy.visit('/');
    });

    it('should be able to logout when the button is clicked', () => {
        cy.get('[data-cy=logout]').click();

        cy.url().should('include', 'login');
    })

    it('should redirect to the profile page when profile button is clicked', () => {
        cy.get('[data-cy=profile]').click();

        cy.url().should('include', 'user');
    })
});