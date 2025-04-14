import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { it, expect, vi, beforeEach } from 'vitest';
import ThumbnailsList from '../components/ThumbnailsList.vue';
import * as photosStore from '../stores/photos';

const createMockStore = () => ({
  visiblePhotos: [],
  isLoading: false,
  error: null,
  fetchData: vi.fn(),
});

let mockObserver;

beforeEach(() => {
  mockObserver = {
    observe: vi.fn(),
    disconnect: vi.fn(),
  };

  global.IntersectionObserver = vi.fn((callback) => {
    mockObserver.callback = callback;
    return mockObserver;
  });

  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
    { type: 'reload' },
  ]);
});

it('calls fetchData if visiblePhotos is empty on mount', async () => {
  const storeMock = createMockStore();
  vi.spyOn(photosStore, 'usePhotosStore').mockReturnValue(storeMock);

  mount(ThumbnailsList);
  await nextTick();

  expect(storeMock.fetchData).toHaveBeenCalled();
});