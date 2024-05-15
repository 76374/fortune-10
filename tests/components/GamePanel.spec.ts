import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it } from 'vitest';
import currencyFormat from '../../src/services/format/currency-format';
import GamePanel from '../../src/components/GamePanel.vue';
import type { ComponentProps } from 'vue-component-type-helpers';

type Props = ComponentProps<typeof GamePanel>;

const getProps = (): Props => ({
  balance: 0,
  showSelectTicket: false,
  selectedTicket: 0,
});

const getWrapper = (props?: Partial<Props>) =>
  mount(GamePanel, { props: { ...getProps(), ...props } });

describe('GamePanel', () => {
  beforeAll(() => {
    currencyFormat.setCurrency('euro');
  });

  it('should render properly', () => {
    const wrapper = getWrapper({ balance: 200, selectedTicket: 8 });
    expect(wrapper.text()).toContain('Balance: 2.00€');
    expect(wrapper.text()).toContain('8');
  });

  it('should trigger selected event', () => {
    const wrapper = getWrapper({ showSelectTicket: true });
    wrapper.find('button').trigger('click');
    expect(wrapper.emitted()['purchase-clicked']).toHaveLength(1);
  });
});
