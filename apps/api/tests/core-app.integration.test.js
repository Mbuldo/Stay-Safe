const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { startApiServer } = require('./helpers/server');

let api;

before(async () => {
  api = await startApiServer();
});

after(async () => {
  await api?.stop();
});

test('user auth flow supports register, login, and profile lookup', async () => {
  const username = `user${Date.now()}`;
  const password = 'Pass1234';

  const registerResult = await api.request('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, age: 22, termsAccepted: true }),
  });

  assert.equal(registerResult.response.status, 201);
  assert.equal(registerResult.json.success, true);
  assert.equal(registerResult.json.data.user.username, username);
  assert.ok(registerResult.json.data.token);

  const loginResult = await api.request('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  assert.equal(loginResult.response.status, 200);
  assert.equal(loginResult.json.success, true);
  assert.equal(loginResult.json.data.user.username, username);

  const meResult = await api.request('/api/users/me', {
    headers: { Authorization: `Bearer ${loginResult.json.data.token}` },
  });

  assert.equal(meResult.response.status, 200);
  assert.equal(meResult.json.data.username, username);
});

test('core content and assessment endpoints return seeded and computed data', async () => {
  const username = `assessment${Date.now()}`;
  const password = 'Pass1234';
  const authResult = await api.request('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, age: 24, termsAccepted: true }),
  });
  const token = authResult.json.data.token;

  const articlesResult = await api.request('/api/articles?featured=true');
  assert.equal(articlesResult.response.status, 200);
  assert.equal(articlesResult.json.success, true);
  assert.ok(
    articlesResult.json.data.some(article => article.slug === 'contraception-basics-for-students')
  );

  const resourcesResult = await api.request('/api/resources?city=Nairobi');
  assert.equal(resourcesResult.response.status, 200);
  assert.equal(resourcesResult.json.success, true);
  assert.ok(resourcesResult.json.data.some(resource => resource.name === 'Campus Health Center'));

  const questionsResult = await api.request('/api/assessments/questions/contraception', {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(questionsResult.response.status, 200);
  assert.ok(Array.isArray(questionsResult.json.data));
  assert.ok(questionsResult.json.data.length >= 3);

  const submitResult = await api.request('/api/assessments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      category: 'contraception',
      responses: [
        {
          questionId: 'cont-1',
          question: 'Which contraception method are you currently relying on most often?',
          answer: 'Condoms',
          category: 'contraception',
        },
        {
          questionId: 'cont-2',
          question: 'How consistently have you used your chosen contraception over the past 4 weeks?',
          answer: 'Always',
          category: 'contraception',
        },
        {
          questionId: 'cont-3',
          question: 'Did you have unprotected sex in the last 2 weeks?',
          answer: false,
          category: 'contraception',
        },
      ],
    }),
  });

  assert.equal(submitResult.response.status, 201);
  assert.equal(submitResult.json.success, true);
  assert.equal(submitResult.json.data.category, 'contraception');
  assert.ok(['low', 'moderate', 'high', 'critical'].includes(submitResult.json.data.riskLevel));

  const historyResult = await api.request('/api/assessments', {
    headers: { Authorization: `Bearer ${token}` },
  });
  assert.equal(historyResult.response.status, 200);
  assert.equal(historyResult.json.success, true);
  assert.equal(historyResult.json.data.userId, authResult.json.data.user.id);
  assert.ok(historyResult.json.data.assessments.length >= 1);
});