import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import ThumbnailCard from '../components/ThumbnailCard.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/photo/:id',
      name: 'singlePhoto',
      component: { template: '<div>MockPhoto</div>' },
    },
  ],
});

const defaultProps = {
  id: 1,
  albumId: 10,
  thumbnailUrl: 'https://via.placeholder.com/150/92c952',
  title: 'accusamus beatae ad facilis cum similique qui sunt',
  url: 'https://via.placeholder.com/600/92c952',
};

let wrapper;

beforeEach(async () => {
  wrapper = mount(ThumbnailCard, {
    props: defaultProps,
    global: {
      plugins: [router],
    },
  });
});

describe('ThumbnailCard', () => {
  it('renders with correct props', () => {
    expect(wrapper.find('p').text()).toContain(`ID: ${defaultProps.id}`);
    expect(wrapper.find('h3').text()).toBe(defaultProps.title);

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(defaultProps.thumbnailUrl);
    expect(img.attributes('alt')).toBe(defaultProps.thumbnailUrl);
  });

  it('renders RouterLink with the correct "to" prop', () => {
    const link = wrapper.findComponent({ name: 'RouterLink' });
    expect(link.exists()).toBe(true);
    expect(link.props('to')).toEqual({ name: 'singlePhoto', params: { id: defaultProps.id } });
  });

  it('applies the .thumbnail-card class to the div', () => {
    const card = wrapper.find('.thumbnail-card');
    expect(card.exists()).toBe(true);
  });

  it('renders updated props correctly', async () => {
    const newProps = {
      id: 7,
      albumId: 3,
      thumbnailUrl: 'https://via.placeholder.com/150/abcd12',
      title: 'new test title',
      url: 'https://via.placeholder.com/600/abcd12',
    };

    await wrapper.setProps(newProps);

    expect(wrapper.find('p').text()).toContain(`ID: ${newProps.id}`);
    expect(wrapper.find('h3').text()).toBe(newProps.title);

    const img = wrapper.find('img');
    expect(img.attributes('src')).toBe(newProps.thumbnailUrl);
    expect(img.attributes('alt')).toBe(newProps.thumbnailUrl);

    const link = wrapper.findComponent({ name: 'RouterLink' });
    expect(link.props('to')).toEqual({ name: 'singlePhoto', params: { id: newProps.id } });
  });
});