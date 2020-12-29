export const SELECTORS = {
  login: '#email',
  pass: '#pass',
  twoFactorCodeInput: '#approvals_code',
  checkpointSubmit: '#checkpointSubmitButton',
  postsContainer: '.storyStream',
  feedPost: '.storyStream > article', // [data-sigil="m-story-view"]
  reactionsMetaContainer: '[data-sigil="reactions-bling-bar"]',
  hasRepost: '[data-sigil="feed-ufi-metadata"]',
  feedScrollDetector: '[data-sigil="marea"]',

  // single post page
  postRoot: '[data-sigil="m-story-view"]',
  postLink: '[data-sigil="feed-ufi-trigger"]',
  postTime: '[data-sigil="m-feed-voice-subtitle"] abbr',
  postShares: '[data-sigil="feed-ufi-sharers"]',
  postReactions: 'a[href*="ufi/reaction"]',
  postCommentsRoot: '[data-sigil="m-mentions-expand"]',
  postComment: '[data-sigil="comment"]',
  postCommentBody: '[data-sigil="comment-body"]',
}