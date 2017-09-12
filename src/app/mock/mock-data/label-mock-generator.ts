/*
 * This class contains mock generator code for labels
 */
export class LabelMockGenerator {

    private label: any;
    private allLabels: any;
    private BackgroundColors = ['#f7bd7f', '#c8eb79', '#9ecf99', '#ededed', '#7bdbc3', '#7cdbf3'];
    private colors = ['#303030'];

    /*
     * Creates the label structure.
     */
    public getAllLabels(): any {
      if (this.allLabels)
        return this.allLabels;
      else {
        return this.allLabels = [0, 1, 2, 3, 4, 5].map((i) => {
          return {
            attributes: {
              name: 'Example Label ' + i,
              "text-color": this.colors[i],
              "background-color": this.BackgroundColors[i]
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
