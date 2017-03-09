import { extractDateAssets, extractUserAssets, extractTicketAssets } from './assets';

const { expect } = window;

test('should extract user asset', () => {
  const user = extractUserAssets('to @danmo and @mihai');

  expect(user).toBe('danmo');
});

test('should extract date asset', () => {
  const date = extractDateAssets('due February 1');

  expect(date).toEqual(new Date('2017-02-01T10:00:00.000Z'));
});

test('should extract ticket asset', () => {
  const ticket = extractTicketAssets('some ticket TK1235');

  expect(ticket).toBe('1235');
});
