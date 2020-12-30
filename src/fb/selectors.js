export const SELECTORS = {
  login: '#email',
  pass: '#pass',
  twoFactorCodeInput: '#approvals_code',
  checkpointSubmit: '#checkpointSubmitButton',
  postsContainer: '.storyStream',
  feedPost: '.storyStream > article', // [data-sigil="m-story-view"]
  reactionsMetaContainer: '[data-sigil="reactions-bling-bar"]',
  hasRepost: '[data-sigil="feed-ufi-metadata"]',
  feedLoadingIndicator: '.storyStream [role="progressbar"][aria-busy="true"]',

  // single post
  postRoot: '[data-sigil="m-story-view"]',
  postLink: '[data-sigil="feed-ufi-trigger"]',
  postTime: '[data-sigil="m-feed-voice-subtitle"] abbr',
  postShares: '[data-sigil="feed-ufi-sharers"]',
  postReactions: 'a[href*="ufi/reaction"]',
  postCommentsRoot: '[data-sigil="m-mentions-expand"]',
  postComment: '[data-sigil="comment"]',
  postCommentBody: '[data-sigil="comment-body"]',
  postMoreLink: '[data-sigil="more"]'
}
