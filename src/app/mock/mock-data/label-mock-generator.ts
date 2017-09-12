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
        return this.allLabels = this.labels.map((i) => {
          return {
            attributes: {
              name: 'Example Label ' + i,
              "text-color": "#000000",
              "background-color": i.color,
              "border-color": i.border
            },
            links: {
              self: 'http://mock.service/api/spaces/space-id0/labels/label'+i
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
            id: 'label' + i,
            type: 'labels'
          }
        });
      }
    }
  }
