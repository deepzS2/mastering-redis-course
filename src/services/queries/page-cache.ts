import { client } from "$services/redis";
import { getPageCacheKey } from "$services/keys";

const CACHE_ROUTES = ['/about', '/privacy', '/auth/signin', '/auth/signup'];

export const getCachedPage = (route: string) => {
  if (CACHE_ROUTES.includes(route)) {
    return client.get(getPageCacheKey(route))
  }

  return null;
};

export const setCachedPage = (route: string, page: string) => {
  if (CACHE_ROUTES.includes(route)) {
    return client.set(getPageCacheKey(route), page, {
      EX: 2
    })
  }
};
