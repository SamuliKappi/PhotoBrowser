import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SinglePhoto from '../components/SinglePhoto.vue'; // update path if needed
import { useRoute, useRouter } from 'vue-router';

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(),
}));

const mockPush = vi.fn();
const mockBack = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn();
  useRouter.mockReturnValue({ push: mockPush, back: mockBack });
});

describe('SinglePhoto.vue', () => {
  it('shows loading state initially', () => {
    useRoute.mockReturnValue({ params: { id: 1 } });
    const wrapper = mount(SinglePhoto);
    expect(wrapper.text()).toContain('Loading photo...');
  });

  it('renders photo details after successful fetch', async () => {
    useRoute.mockReturnValue({ params: { id: 1 } });

    const mockPhoto = {
      id: 1,
      albumId: 10,
      title: 'Test Photo',
      url: 'https://example.com/photo.jpg',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockPhoto,
    });

    const wrapper = mount(SinglePhoto);
    await flushPromises();

    expect(wrapper.text()).toContain(mockPhoto.title);
    expect(wrapper.text()).toContain(`ID: ${mockPhoto.id}`);
    expect(wrapper.text()).toContain(`Album Id: ${mockPhoto.albumId}`);
    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toContain(`/id/${mockPhoto.id % 1000}/800/800`);
  });

  it('shows error message on failed fetch', async () => {
    useRoute.mockReturnValue({ params: { id: 999 } });

    global.fetch.mockResolvedValueOnce({
      ok: false,
    });

    const wrapper = mount(SinglePhoto);
    await flushPromises();

    expect(wrapper.text()).toContain('Error');
  });

  it('shows error message on fetch exception', async () => {
    useRoute.mockReturnValue({ params: { id: 999 } });

    global.fetch.mockRejectedValueOnce(new Error('Network Error'));

    const wrapper = mount(SinglePhoto);
    await flushPromises();

    expect(wrapper.text()).toContain('Error: Network Error');
  });

  it('calls router.back() if internal referrer', async () => {
    useRoute.mockReturnValue({ params: { id: 1 } });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, title: 'A', url: '', albumId: 2 }),
    });
  
    Object.defineProperty(document, 'referrer', {
      value: `http://${window.location.hostname}/somepage`,
      configurable: true,
    });
  
    Object.defineProperty(window, 'history', {
      value: { length: 2 },
      writable: true,
    });
  
    const wrapper = mount(SinglePhoto);
    await flushPromises();
  
    await wrapper.find('.back-button').trigger('click');
  
    expect(mockBack).toHaveBeenCalled();
  });

  it('calls router.push("/") if external referrer', async () => {
    useRoute.mockReturnValue({ params: { id: 1 } });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, title: 'B', url: '', albumId: 2 }),
    });

    // Simulate external referrer
    Object.defineProperty(document, 'referrer', {
      value: 'https://google.com',
      configurable: true,
    });

    const wrapper = mount(SinglePhoto);
    await flushPromises();

    await wrapper.find('.back-button').trigger('click');
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});