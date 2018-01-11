import {
  switchModel,
  MapTree
} from "./common.model";

describe('Unit Test :: Common model', () => {
  it('should execute the canary test', () => {
    return expect(true).toBe(true)
  });

  it('should correctly convert to UI model - 1', () => {
    interface InputModel {
      user: {
        name: string;
      }
    }

    interface OutputModel {
      name: {
        firstName: string;
      }
    }

    const mapTree: MapTree = [{
      toPath: ['name', 'firstName'],
      fromPath: ['user', 'name']
    }];

    const input = {
      user: {
        name: 'Sanborn'
      }
    };

    const expectedOutput = {
      name: {
        firstName: 'Sanborn'
      }
    };

    return expect(expectedOutput)
      .toEqual(
        switchModel<InputModel, OutputModel>(input, mapTree)
      );
  });

  it('should correctly convert to UI model - 2', () => {
    interface ServiceModel {
      attributes: {
        relationships: {
          user: {
            detail: {
              name: string;
            }
          }
        }
      }
    }

    interface UIModel {
      name: {
        firstName: string;
      };
      selected: boolean;
    }

    const input = {
      attributes: {
        relationships: {
          user: {
            detail: {
              name: 'Sanborn'
            }
          }
        }
      }
    };

    const expectedOutput = {
      name: {
        firstName: 'Sanborn'
      },
      selected: false
    };

    const mapTree: MapTree = [{
      fromPath: ['attributes', 'relationships', 'user', 'detail', 'name'],
      toPath: ['name', 'firstName']
    }, {
      toPath: ['selected'],
      toValue: false
    }];

    return expect(expectedOutput)
      .toEqual(
        switchModel<ServiceModel, UIModel>(input, mapTree)
      );
  });

})
