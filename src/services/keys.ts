// Users
export const getUsersKey = (userId: string) => `users#${userId}`;
export const getUserLikeKey = (userId: string) => `users:likes#${userId}`;
export const getUsernamesUniqueKey = () => 'usernames:unique';
export const getUsernamesKey = () => 'usernames';

// Session
export const getSessionsKey = (sessionId: string) => `sessions#${sessionId}`;

// Page cache
export const getPageCacheKey = (id: string) => `pagecache#${id}`;

// Items
export const getItemsByViewsKey = () => 'items:views';
export const getItemsByEndingAtKey = () => 'items:endingAt';
export const getItemsKey = (itemId: string) => `items#${itemId}`;
export const getItemsViewsKey = (itemId: string) => `items:views#${itemId}`;
export const getBidHistoryKey = (itemId: string) => `history#${itemId}`;
export const getItemsByPriceKey = () => `items:price`;
export const getItemsIndexKey = () => `idx:items`;