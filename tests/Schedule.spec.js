import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import Schedule from "../src/components/Schedule.vue";

describe("Schedule.vue", () => {
  it("renders a list of classes", () => {
    const wrapper = mount(Schedule, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              classes: {
                loading: false,
                classes: [
                  {
                    id: 1,
                    className: "Pilates",
                    instructor: "Jane",
                    time: "10:00 AM",
                    spots: 10,
                    day: "Monday",
                  },
                ],
              },
            },
            stubActions: true,
          }),
        ],
      },
    });

    expect(wrapper.text()).toContain("Pilates");
    expect(wrapper.text()).toContain("Monday");
  });
});