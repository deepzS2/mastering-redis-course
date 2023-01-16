import type { CreateItemAttrs } from '$services/types';
import { DateTime } from 'luxon';

export const serialize = (attrs: CreateItemAttrs) => ({
  ...attrs,
  createdAt: (attrs.createdAt ?? DateTime.now().setZone("America/New_York")).toMillis(),
  endingAt: (attrs.endingAt ?? DateTime.now().setZone("America/New_York")).toMillis(),
});
