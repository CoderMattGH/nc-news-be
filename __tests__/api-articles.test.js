require('jest-sorted');
const request = require('supertest');

const app = require('../app.js');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("GET /api/articles:article_id", () => {
  test("Returns the correct article", () => {
    return request(app).get('/api/articles/2').expect(200)
        .then(({body}) => {
          const article = body.article;

          expect(article).toMatchObject({
            article_id: 2,
            title: 'Sony Vaio; or, The Laptop',
            topic: 'mitch',
            author: 'icellusedkars',
            body: expect.any(String),
            created_at: '2020-10-16T05:03:00.000Z',
            votes: 0,
            article_img_url:
                'https://images.pexels.com/photos/158651/news-newsletter'
                + '-newspaper-information-158651.jpeg?w=700&h=700'
          });

          expect(article.body.length).toBe(1123);
          expect(article.body).toContain(
              'Call me Mitchell. Some years ago—never mind how long precisely');
        });
  });

  test("Returns a 404 when article_id does not exist", () => {
    return request(app).get('/api/articles/99999').expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('Resource not found!');
        });
  });

  test("Returns a 400 when article_id is not a number", () => {
    return request(app).get('/api/articles/banana').expect(400)
        .then(({body}) => {
          expect(body.msg).toBe('Bad request!');
        });
  });
});

describe("GET /api/articles", () => {
  test("Returns a valid articles array in descending order", () => {
    return request(app).get('/api/articles').expect(200)
        .then(({body}) => {
          const articles = body.articles;
          expect(articles).toHaveLength(5);

          // Sorted in descending order by created_at key
          expect(articles).toBeSorted({key: 'created_at', descending: true});

          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });

            // Does not contain 'body' key
            expect(article.body).toBeUndefined();

            // Expect article_img_url to be valid URL
            expect(() => new URL(article.article_img_url)).not.toThrow(Error);

            // Expect created_at to be valid Date
            expect(() => new Date(article.created_at)).not.toThrow(Error);
          });
        });
  });
});