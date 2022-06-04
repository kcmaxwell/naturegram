describe('Post page', () => {
    const ownPost = 1234;
    const otherUserPost = 1234;
    const unlikePost = 1234;

    beforeEach(() => {
        cy.request('POST', Cypress.env('BACKEND') + '/auth/login', 
            {username: 'user', password: 'pass'})
            .then(res => {
                expect(res.status).to.eq(200);
            });
    });

    it('should have the image, description, comments, likes, author, and timestamp visible', () => {
        cy.visit('/post/' + ownPost);
        cy.get('[data-cy=image]').should('be.visible');
        cy.get('[data-cy=description]').should('be.visible');
        cy.get('[data-cy=commentList]').should('be.visible');
        cy.get('[data-cy=likes]').should('be.visible');
        cy.get('[data-cy=author').should('be.visible');
        cy.get('[data-cy=timestamp]').should('be.visible');
    });

    it('should be possible to like a different user\'s post', () => {
        cy.visit('/post/' + otherUserPost);
        cy.get('[data-cy=likePost]').click();


    })

    it('should be possible to unlike a post by clicking twice', () => {
        cy.visit('/post/' + unlikePost);
        cy.get('[data-cy=likePost]').click();
        cy.get('[data-cy=likePost]').click();
    })

    it('should be able to leave a comment on any post', () => {
        cy.visit('/post/' + otherUserPost);
        cy.get('[data-cy=leaveComment]').type('This is my test comment.');
        cy.get('[data-cy=submitComment]').click();


    })
})