import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { FormsModule }  from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DropdownConfig, DropdownModule } from 'ng2-bootstrap';

import { Filter } from './filter';
import { FilterComponent } from './filter.component';
import { FilterConfig } from './filter-config';
import { FilterField } from './filter-field';
import { FilterFieldsComponent } from './filter-fields.component';
import { FilterResultsComponent } from './filter-results.component';

describe('Filter component - ', () => {
  let comp: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let config: FilterConfig;

  beforeEach(() => {
    config = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          placeholder: 'Filter by Name...',
          filterType: 'text'
        },
        {
          id: 'age',
          title:  'Age',
          placeholder: 'Filter by Age...',
          filterType: 'text'
        },
        {
          id: 'address',
          title:  'Address',
          placeholder: 'Filter by Address...',
          filterType: 'text'
        },
        {
          id: 'birthMonth',
          title:  'Birth Month',
          placeholder: 'Filter by Birth Month...',
          filterType: 'select',
          filterValues: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
      ] as FilterField[],
      resultsCount: 5,
      appliedFilters: []
    } as FilterConfig;
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, DropdownModule],
      declarations: [FilterComponent, FilterFieldsComponent, FilterResultsComponent],
      providers: [DropdownConfig]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(FilterComponent);
        comp = fixture.componentInstance;
        comp.config = config;
        fixture.detectChanges();
      });
  }));

  it('should have correct number of filter fields', function () {
    let fields = fixture.debugElement.queryAll(By.css('.filter-field'));
    expect(fields.length).toBe(4);
  });

  it('should have correct number of results', function () {
    let results = fixture.debugElement.query(By.css('h5'));
    expect(results).not.toBeNull();
    expect(results.nativeElement.textContent.trim().slice(0, '5 Results'.length)).toBe('5 Results');

    config.resultsCount = 10;
    fixture.detectChanges();

    results = fixture.debugElement.query(By.css('h5'));
    expect(results).not.toBeNull();
    expect(results.nativeElement.textContent.trim().slice(0, '10 Results'.length)).toBe('10 Results');
  });

  it('should show active filters and clear filters button when there are filters', function () {
    let activeFilters = fixture.debugElement.queryAll(By.css('.active-filter'));
    let clearFilters = fixture.debugElement.query(By.css('.clear-filters'));
    expect(activeFilters.length).toBe(0);
    expect(clearFilters).toBeNull();

    config.appliedFilters = [
      {
        id: 'address',
        title: 'Address',
        value: 'New York'
      }
    ] as Filter[];
    fixture.detectChanges();

    activeFilters = fixture.debugElement.queryAll(By.css('.active-filter'));
    clearFilters = fixture.debugElement.query(By.css('.clear-filters'));
    expect(activeFilters.length).toBe(1);
    expect(clearFilters).not.toBeNull();
  });

  it ('should add a dropdown select when a select type is chosen', function() {
    let filterSelect = fixture.debugElement.query(By.css('.filter-select'));
    let fields = fixture.debugElement.queryAll(By.css('.filter-field'));

    expect(filterSelect).toBeNull();
    fields[3].triggerEventHandler('click', {});
    fixture.detectChanges();

    filterSelect = fixture.debugElement.query(By.css('.filter-select'));
    expect(filterSelect).not.toBeNull();

    let items = filterSelect.queryAll(By.css('li'));
    expect(items.length).toBe(config.fields[3].filterValues.length + 1); // +1 for the null value
  });

  it ('should clear a filter when the close button is clicked', function () {
    let closeButtons = fixture.debugElement.queryAll(By.css('.pficon-close'));
    expect(closeButtons.length).toBe(0);

    config.appliedFilters = [
      {
        id: 'address',
        title: 'Address',
        value: 'New York'
      }
    ] as Filter[];
    fixture.detectChanges();

    closeButtons = fixture.debugElement.queryAll(By.css('.pficon-close'));
    expect(closeButtons.length).toBe(1);

    closeButtons[0].triggerEventHandler('click', {});
    fixture.detectChanges();

    closeButtons = fixture.debugElement.queryAll(By.css('.pficon-close'));
    expect(closeButtons.length).toBe(0);
  });

  it ('should clear all filters when the clear all filters button is clicked', function () {
    let activeFilters = fixture.debugElement.queryAll(By.css('.active-filter'));
    let clearButton = fixture.debugElement.query(By.css('.clear-filters'));
    expect(activeFilters.length).toBe(0);
    expect(clearButton).toBeNull();

    config.appliedFilters = [
      {
        id: 'address',
        title: 'Address',
        value: 'New York'
      }
    ] as Filter[];
    fixture.detectChanges();

    activeFilters = fixture.debugElement.queryAll(By.css('.active-filter'));
    clearButton = fixture.debugElement.query(By.css('.clear-filters'));
    expect(activeFilters.length).toBe(1);
    expect(clearButton).not.toBeNull();

    clearButton.triggerEventHandler('click', {});
    fixture.detectChanges();

    activeFilters = fixture.debugElement.queryAll(By.css('.active-filter'));
    clearButton = fixture.debugElement.query(By.css('.clear-filters'));
    expect(activeFilters.length).toBe(0);
    expect(clearButton).toBeNull();
  });
});
