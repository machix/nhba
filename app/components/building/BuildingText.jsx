import React from 'react';
import BuildingTable from './BuildingTable';
import BuildingCollapsible from './BuildingCollapsible';

export default class BuildingText extends React.Component {
  render() {
    const name = this.props.building.building_name
      ? this.props.building.building_name
      : this.props.building.address;

    const fields = [];
    if (this.props.building) {
      this.props.fields.map((field, i) => {
        if (field.collapsible) {
          fields.push(
            <div key={i} id={field.href}>
              <BuildingCollapsible
                childComponent={field.component}
                label={field.label}
              />
            </div>
          );
        } else {
          fields.push(
            <div key={i} id={field.href}>
              {field.component}
            </div>
          );
        }
      });
    }

    const tableFields = [
      { label: 'Year Built', field: 'year_built' },
      { label: 'Era', field: 'era' },
      { label: 'Functions', field: 'current_uses' },
      { label: 'Ownership Status', field: 'ownership_status' },
      { label: 'Style', field: 'styles' },
      { label: 'Architect', field: 'architect' },
      { label: 'Client', field: 'client' },
      { label: 'Neighborhood', field: 'neighborhoods' },
      { label: 'Tour', field: 'tours' },
      { label: 'Researcher', field: 'researcher' },
      { label: 'Created At', field: 'created_at', type: 'time' },
      { label: 'Updated At', field: 'updated_at', type: 'time' },
      { label: 'Story Maps', field: 'storymap_url', type: 'url' },
      { label: 'Multimedia', field: 'multimedia_url', type: 'url' }
    ];

    if (this.props.building.building_name) {
      tableFields.unshift({
        label: 'Address',
        field: 'address'
      });
    }

    return (
      <div className="building-text">
        <h1 className="address">{name}</h1>
        <BuildingTable
          building={this.props.building}
          tableFields={tableFields}
        />
        {fields}
      </div>
    );
  }
}
