describe('Posts', () => {
    describe('GET post', () => {
        let response;
        beforeEach(async () => {
            await request(app)
                .post('/auth/signup')
                .send(signupUser)
                .expect(201);

            response = await request(app)
                .post('/auth/login')
                .send(signupUser);
                expect(response.status).toBe(200);
        });

        it('should return 200 OK and the requested post', () => {
            const { header } = response;

            const post = await request(app)
                .get('/posts/post')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${response.body.token}`,
                })
                .set('Cookie', [...header['set-cookie']]);
            
            expect(post.status).toBe(200);
        })

        it('should return 404 Not Found if the post id is invalid', () => {
            const { header } = response;

            await request(app)
                .get('/posts/notAPost')
                .set({
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${response.body.token}`,
                })
                .set('Cookie', [...header['set-cookie']])
                .expect(404);
        })
    })

    describe('POST new post', () => {

    })
});