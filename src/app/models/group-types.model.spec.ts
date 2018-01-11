import {
  GroupTypeMapper,
  GroupTypeUI,
  GroupTypeService
} from "./group-types.model";

describe('Unit Test :: Group type model', () => {
  it('should execute the canary test', () => {
    return expect(true).toBe(true)
  });

  it('should correctly convert to UI model - 1', () => {
    const gtm = new GroupTypeMapper();
    const input: GroupTypeService = {
      group: "portfolio",
      icon: "fa fa-suitcase",
      level: [0, 1],
      name: "Portfolio",
      wit_collection: [
        "b9a71831-c803-4f66-8774-4193fffd1311"
      ],
      sublevel: 3
    };
    const output: GroupTypeUI = gtm.toUIModel(input);
    const expectedOutput: GroupTypeUI = {
      group: "portfolio",
      icon: "fa fa-suitcase",
      level: [0, 1],
      name: "Portfolio",
      wit_collection: [
        "b9a71831-c803-4f66-8774-4193fffd1311"
      ],
      sublevel: 3,
      selected: false
    };
    return expect(expectedOutput).toEqual(output);
  });

  it('should correctly convert to Service model - 1', () => {
    const gtm = new GroupTypeMapper();
    const input: GroupTypeUI = {
      group: "portfolio",
      icon: "fa fa-suitcase",
      level: [0, 1],
      name: "Portfolio",
      wit_collection: [
        "b9a71831-c803-4f66-8774-4193fffd1311"
      ],
      sublevel: 3,
      selected: false
    };
    const output: GroupTypeService = gtm.toServiceModel(input);
    const expectedOutput: GroupTypeService  = {
      group: "portfolio",
      icon: "fa fa-suitcase",
      level: [0, 1],
      name: "Portfolio",
      wit_collection: [
        "b9a71831-c803-4f66-8774-4193fffd1311"
      ],
      sublevel: 3
    };
    return expect(expectedOutput).toEqual(output);
  });
})
