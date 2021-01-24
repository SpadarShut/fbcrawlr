export const SELECTORS = {
  login: '#m_login_email',
  pass: '#m_login_password',
  composer: '#MComposer',
  twoFactorCodeInput: '#approvals_code',
  checkpointSubmit: '#checkpointSubmitButton',
  postsContainer: '.storyStream',
  feedPost: '.storyStream > article', // [data-sigil="m-story-view"]
  reactionsMetaContainer: '[data-sigil="reactions-bling-bar"]',
  hasRepost: '[data-sigil="feed-ufi-metadata"]',
  feedLoadingIndicator: `
    .storyStream ~ * [role="progressbar"][aria-busy="true"],
    .storyStream ~ * [data-sigil ~= "m-loading-indicator-root"]
  `,
  img: 'i[role=img]',

  // single post, in feed or standalone
  postRoot: '[data-sigil="m-story-view"]',
  postLink: '[data-sigil="feed-ufi-trigger"]',
  postTime: '[data-sigil="m-feed-voice-subtitle"] abbr',
  postTextRoot: '.story_body_container > header + div',
  postMediaRoot: '.story_body_container > header + div + div', // what if no media attached?
  postShares: '[data-sigil="feed-ufi-sharers"]',
  postReactions: 'a[href*="ufi/reaction"]',
  postReactionsSentence: '[data-sigil="reactions-sentence-container"]',
  postCommentsRoot: '[data-sigil="m-mentions-expand"]',
  postComment: '[data-sigil="comment"]',
  postCommentBody: '[data-sigil="comment-body"]',
  postMoreLink: '[data-sigil="more"]',
  postSharedPortRoot: '.story_body_container .story_body_container',

  // Full post
  postCardContent: '.story_body_container > header + div [aria-hidden=true][role=presentation][style]'
}
