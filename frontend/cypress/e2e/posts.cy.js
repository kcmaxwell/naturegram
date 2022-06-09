describe('Post page', () => {
    const ownPost = 'VBg2buHoQJXl';
    const otherUserPost = 'mseYBbuyzvC9';
    const unlikePost = 'ejHGMAYTNx_2';

    beforeEach(() => {
        cy.task('db:seed');

        cy.request('POST', Cypress.env('backend') + '/auth/login', 
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

    it('should be possible to like a post', () => {
        cy.visit('/post/' + otherUserPost);
        cy.get('[data-cy=likePost]').click();
        cy.get('[data-cy=likes]').contains(1);
    })

    it('should be possible to unlike a post by clicking twice', () => {
        cy.visit('/post/' + unlikePost);
        cy.get('[data-cy=likePost]').click();
        cy.get('[data-cy=likePost]').click();
        cy.get('[data-cy=likes]').contains(0);
    })

    it('should be possible to save a post', () => {
        cy.visit('/post/' + otherUserPost);
        cy.get('[data-cy=savePost]').click();
    })

    /*
    it('should be able to leave a comment on any post', () => {
        cy.visit('/post/' + otherUserPost);
        cy.get('[data-cy=leaveComment]').type('This is my test comment.');
        cy.get('[data-cy=submitComment]').click();


    })
    */
})