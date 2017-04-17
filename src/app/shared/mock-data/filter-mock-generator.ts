/*
 * This class contains mock generator code for users, identities
 * and all depended entities.
 */
export class FilterMockGenerator {
  getFilters() {
    return [
      {
        attributes: {
          description: "Filter by assignee",
          query: "filter[assignee]={id}",
          title: "Assignee",
          type: "users"
        },
        type: "filters"
      },
      {
        attributes: {
          description: "Filter by area",
          query: "filter[area]={id}",
          title: "Area",
          type: "areas"
        },
        type: "filters"
      },
      {
        attributes: {
          description: "Filter by iteration",
          query: "filter[iteration]={id}",
          title: "Iteration",
          type: "iterations"
        },
        type: "filters"
      },
      {
        attributes: {
          description: "Filter by workitemtype",
          query: "filter[workitemtype]={id}",
          title: "Workitem type",
          type: "workitemtypes"
        },
        type: "filters"
      },
      {
        attributes: {
          description: "Filter by workitemstate",
          query: "filter[workitemstate]={id}",
          title: "Workitem state",
          type: "workitemstate"
        },
        type: "filters"
      }
    ];
  }
}
