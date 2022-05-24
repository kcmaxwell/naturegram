describe('Profile page', () => {
    beforeEach(() => {
        cy.request('POST', Cypress.env('BACKEND') + '/auth/login', 
            {username: 'user', password: 'pass'})
            .then(res => {
                expect(res.status).to.eq(200);
            });
    });

    it('should be possible to follow a user from their profile', () => {
        cy.visit('/otherUser');
        cy.get('[data-cy=follow]').click();
        cy.visit('/user');
        cy.get('[data-cy=following]').click();
        
        cy.contains('otherUser');
    });

    it('should be possible to edit a user\'s own profile', () => {
        cy.visit('/user');
        cy.get('[data-cy=edit]').click();

        cy.url().should('include', 'edit');
        cy.get('[data-cy=newName]').type('New Name');

        cy.visit('/user');
        cy.contains('New User').should('be.visible');
    });

    it('should be possible to visit a follower', () => {
        cy.visit('/user');
        cy.get('[data-cy=followersList]').click();
        cy.contains('follower').click();

        cy.url().should('include', 'follower');
    });

    it('should be possible to visit a user you are following', () => {
        cy.visit('/user');
        cy.get('[data-cy=followingList]').click();
        cy.contains('following').click();

        cy.url().should('include', 'following');
    });

    it('should be able to see a user\'s posts', () => {
        cy.visit('/otherUser');
        cy.get('[data-cy=posts]').click();
        cy.get('[data-cy=post]').should('be.visible');
    });

    it('should be able to see your own saved posts, not other users', () => {
        cy.visit('/user');
        cy.get('[data-cy=savedPosts]').click();
        cy.get('[data-cy=savedPost]').should('be.visible');
    });
});