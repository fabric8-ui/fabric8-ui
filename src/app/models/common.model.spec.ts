import {
  switchModel,
  cleanObject,
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


describe('Unit Test :: Common model :: Object cleaner', () => {
  it('Should correctly clean up an objectm - 1', () => {
    const input = {
      name: 'Sudipta'
    };
    return expect(input).toEqual(cleanObject(input));
  })

  it('Should correctly clean up an objectm - 2', () => {
    const input = {
      name: 'Sudipta',
      address: null
    };
    const expOutput = {
      name: 'Sudipta'
    };
    const output = cleanObject(input);
    return expect(output).toEqual(expOutput);
  })

  it('Should correctly clean up an objectm - 3', () => {
    const input = {
      name: 'Sudipta',
      address: {
        city: 'Bangalore',
        country: 'India',
        pin: null
      }
    };
    const expOutput = {
      name: 'Sudipta',
      address: {
        city: 'Bangalore',
        country: 'India',
      }
    };
    const output = cleanObject(input);
    return expect(output).toEqual(expOutput);
  })

  it('Should correctly clean up an objectm - 3', () => {
    const input = {
      name: 'Sudipta',
      address: {
        city: 'Bangalore',
        country: 'India',
        pin: {
          code: null,
          random: {
            one: ['one'],
            two: null
          }
        }
      }
    };
    const expOutput = {
      name: 'Sudipta',
      address: {
        city: 'Bangalore',
        country: 'India',
        pin: {
          random: {
            one: ['one']
          }
        }
      }
    };
    const output = cleanObject(input);
    return expect(output).toEqual(expOutput);
  })

  it('Should correctly clean up an objectm - 4', () => {
    const input = {
      name: 'Sudipta',
      address: {
        city: 'Bangalore',
        country: 'India',
        pin: {
          code: null,
          random: {
            one: ['one'],
            two: null
          },
          relationships: {
            rel1: 'rel1'
          }
        }
      }
    };
    const expOutput = {
      name: 'Sudipta',
      address: {
        city: 'Bangalore',
        country: 'India',
        pin: {
          random: {
            one: ['one']
          }
        }
      }
    };
    const output = cleanObject(input, ['relationships']);
    return expect(output).toEqual(expOutput);
  })
})
