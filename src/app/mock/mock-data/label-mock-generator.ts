/*
 * This class contains mock generator code for labels
 */
export class LabelMockGenerator {

    private label: any;
    private allLabels: any;

    private labels = [
      {color: '#fbdebf', border: '#f39d3c'},
      {color: '#f7bd7f', border: '#f39d3c'},
      {color: '#fbeabc', border: '#f39d3c'},
      {color: '#9ecf99', border: '#6ec664'},
      {color: '#d1d1d1', border: '#bbbbbb'}
    ];

    /*
     * Creates the label structure.
     */
    public getAllLabels(): any {
      if (this.allLabels)
        return this.allLabels;
      else {
        return this.allLabels = this.labels.map((i, index) => {
          return {
            attributes: {
              name: 'Example Label ' + index,
              "text-color": "#000000",
              "background-color": i.color,
              "border-color": i.border
            },
            links: {
              self: 'http://mock.service/api/spaces/space-id0/labels/label'+index
            },
            relationships: {
              'space': {
                'data': {
                  'id': 'space-id0',
                  'type': 'spaces'
                },
                'links': {
                  'self': 'http://mock.service/api/spaces/space-id0'
                }
              },
            },
            id: 'label' + index,
            type: 'labels'
          }
        });
      }
    }

    public createLabel(body): any {
      body = body.data;
      this.allLabels.push({
        attributes: {
          name: body.attributes.name,
          "text-color": "#000000",
          "background-color": body.attributes["background-color"],
          "border-color": body.attributes["border-color"]
        },
        links: {
          self: 'http://mock.service/api/spaces/space-id0/labels/label'+this.labels.length
        },
        relationships: {
          'space': {
            'data': {
              'id': 'space-id0',
              'type': 'spaces'
            },
            'links': {
              'self': 'http://mock.service/api/spaces/space-id0'
            }
          },
        },
        id: 'label' + this.allLabels.length,
        type: 'labels'
      });
      return this.allLabels[this.allLabels.length - 1];
    }
  }
