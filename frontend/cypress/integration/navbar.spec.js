describe('Navbar', () => {
    beforeEach(() => {
        cy.request('POST', Cypress.env('BACKEND') + '/auth/login', 
            {username: 'user', password: 'pass'})
            .then(res => {
                expect(res.status).to.eq(200);
            });
        cy.visit('/');
    });

    it('check navbar is visible on all authorized pages', () => {
        
    })
});