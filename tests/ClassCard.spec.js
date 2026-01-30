import { shallowMount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import ClassCard from "../src/components/ClassCard.vue";

describe("ClassCard.vue", () => {
  it("renders props when passed", () => {
    const wrapper = shallowMount(ClassCard, {
      global: {
        plugins: [createTestingPinia()],
      },
      props: {
        className: "Pilates Basics",
        instructor: "Jane Doe",
        time: "10:00 AM",
        spots: 10,
        showSpots: true,
      },
    });

    expect(wrapper.find("h2").text()).toBe("Pilates Basics");
    expect(wrapper.text()).toContain("Instructor: Jane Doe");
    expect(wrapper.text()).toContain("Time: 10:00 AM");
  });
});