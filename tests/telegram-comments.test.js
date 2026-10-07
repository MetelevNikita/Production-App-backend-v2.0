import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../src/index.js', import.meta.url), 'utf8');
const handlers = {};
const sent = [];
const comments = [];
let groupText;
let lookups = 0;
const task = { id: 42, cardid: 'card', title: 'Проект', tgid: 123 };

// Run the actual handlers without starting the server or connecting to services.
vm.runInNewContext(source.slice(source.indexOf('const startBot ='), source.indexOf('//\n\nconst backendStatic')), {
  console: { log() {}, error() {} },
  logger: { error() {} },
  agreeColumn: 'agreed', disagreeColumn: 'disagreed',
  bot: {
    on: (event, handler) => { handlers[event] = handler; },
    editMessageText: async (text) => { groupText = text; },
    sendMessage: async (id, text) => { sent.push({ id, text }); },
    answerCallbackQuery: async () => {},
  },
  prisma: { message: {
    findFirst: async ({ where }) => { lookups++; assert.equal(where.id, 42); return task; },
    update: async () => {},
  } },
  getMessageYouGile: async () => ({ success: true, data: {
    title: task.title, description: '<strong>TelegramID</strong><br>123<br>',
  } }),
  moveMessageYouGile: async () => {},
  SampleMessage: () => ({ yg: 'description' }),
  putMessageYouGile: async (...args) => { comments.push(args); },
});

for (const status of ['agreed', 'disagreed']) {
  await handlers.callback_query({ data: `${status}:card:42`, message: { chat: { id: -1 }, message_id: 1 } });
  assert.match(groupText, /№42/);
  assert.match(sent.at(-1).text, /№42/);
  await handlers.message({ reply_to_message: { text: groupText }, text: 'Комментарий', chat: { id: -1 } });
  assert.equal(comments.at(-1)[0], 'card');
  assert.equal(comments.at(-1)[1], 'Комментарий');
  assert.equal(sent.at(-1).id, task.tgid);
}
assert.equal(comments.length, 2);
for (const reply of [{ text: 'Без номера' }, { photo: [] }]) {
  await handlers.message({ reply_to_message: reply, text: 'Комментарий', chat: { id: -1 } });
}
await handlers.message({ reply_to_message: { text: '№42' }, photo: [], chat: { id: -1 } });
assert.equal(lookups, 2);
console.log('Telegram comments: OK');
