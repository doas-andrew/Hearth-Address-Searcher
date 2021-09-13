export const propertyHeaders = [
    { display: 'ID',          column: 'property_id',   sortable: true  },
    { display: 'Type',        column: 'property_type', sortable: true  },
    { display: 'Address',     column: 'address',       sortable: true  },
    { display: 'City',        column: 'city',          sortable: true  },
    // { display: 'State',       column: 'state',         sortable: true  },
    { display: 'State',       column: 'state_abbrev',  sortable: true  },
    { display: 'Zip',         column: 'zip',           sortable: true  },
    { display: 'Price (USD)', column: 'price',         sortable: true  },
    { display: 'Sq. Feet',    column: 'square_feet',   sortable: true  },
    { display: 'Beds',        column: 'beds',          sortable: true  },
    { display: 'Baths',       column: 'baths',         sortable: true  },
    { display: 'Year Built',  column: 'year_built',    sortable: true  },
    { display: '',            column: 'url',           sortable: false }
]

export const baseUrl = 'http://localhost:3000'
