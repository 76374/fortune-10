import { mount } from '@vue/test-utils';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { nextTick } from "vue";
import { ComponentProps } from 'vue-component-type-helpers';
import currencyFormat from '../../src/services/format/currency-format';
import TicketsPurchase from '../../src/components/TicketsPurchase.vue';

type Props = ComponentProps<typeof TicketsPurchase>;

const getProps = (): Props => ({ ticketPrice: 0 });

const getWrapper = (props?: Partial<Props>) =>
  mount(TicketsPurchase, { props: { ...getProps(), ...props }, shallow: true });

vi.useFakeTimers();

describe('GamePanel', () => {
  beforeAll(() => {
    currencyFormat.setCurrency('euro');
  });

  it('should render all tickets and ticket cost', () => {
    const wrapper = getWrapper({ ticketPrice: 100 });

    expect(wrapper.findAll('.ticket')).toHaveLength(10);
    expect(wrapper.text()).toContain('Ticket cost: 1.00€');
  });

  it('should emit complete on timeout', () => {
    const wrapper = getWrapper();
    vi.runAllTimers();
    expect(wrapper.emitted()['completed']).toHaveLength(1);
  });
});
