import { cloneDeep } from 'lodash';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'label-selector',
  templateUrl: './label-selector.component.html',
  styleUrls: ['./label-selector.component.less']
})

export class LabelSelectorComponent implements OnInit {

  @ViewChild('labelname') labelnameInput: ElementRef;

  private labels: any[] = [];
  private backup: any[] = [];
  private multiSelect: boolean = true;
  private searchValue: string = '';
  private activeAddLabel: boolean = false;
  private colors: any[] = [];
  private colorPickerActive: boolean = false;
  private newSelectedColor: any = {};

  ngOnInit() {
    this.colors = [
      {color: '#fbdebf', border: '#f39d3c'},
      {color: '#f7bd7f', border: '#f39d3c'},
      {color: '#fbeabc', border: '#f39d3c'},
      {color: '#f9d67a', border: '#f39d3c'},
      {color: '#e4f5bc', border: '#ace12e'},
      {color: '#cfe7cd', border: '#6ec664'},
      {color: '#9ecf99', border: '#6ec664'},
      {color: '#bedee1', border: '#3a9ca6'},
      {color: '#7dbdc3', border: '#3a9ca6'},
      {color: '#beedf9', border: '#35caed'},
      {color: '#7cdbf3', border: '#35caed'},
      {color: '#c7bfff', border: '#8461f7'},
      {color: '#a18fff', border: '#8461f7'},
      {color: '#ededed', border: '#bbbbbb'},
      {color: '#d1d1d1', border: '#bbbbbb'}
    ];
    this.newSelectedColor = this.colors[0];
    this.labels = [
      {id: 1, color: '#fbdebf', border: '#f39d3c', name: 'label-1', selected: false},
      {id: 2, color: '#f7bd7f', border: '#f39d3c', name: 'label-2', selected: false},
      {id: 3, color: '#fbeabc', border: '#f39d3c', name: 'label-3', selected: false},
      {id: 4, color: '#9ecf99', border: '#6ec664', name: 'label-4', selected: false},
      {id: 5, color: '#d1d1d1', border: '#bbbbbb', name: 'label-5', selected: false},
    ];

    this.backup = cloneDeep(this.labels);
  }


  onSelect(event: any) {
    let findIndex = this.labels.findIndex(i => i.id === event.id);
    if (findIndex > -1) {
      if (this.multiSelect) {
        this.labels[findIndex].selected = !this.labels[findIndex].selected;
      } else {
        this.labels.forEach(i => i.selected = false);
        this.labels[findIndex].selected = true;
      }
    }
    let findIndexBackup = this.backup.findIndex(i => i.id === event.id);
    if (findIndexBackup > -1) {
      if (this.multiSelect) {
        this.backup[findIndexBackup].selected = !this.backup[findIndexBackup].selected;
      } else {
        this.backup.forEach(i => i.selected = false);
        this.backup[findIndexBackup].selected = true;
      }
    }
  }

  onSearch(event: any) {
    let needle = event.trim();
    this.searchValue = needle;
    if (needle.length) {
      this.labels = cloneDeep(this.backup.filter(i => i.name.indexOf(needle) > - 1));
    } else {
      this.labels = cloneDeep(this.backup);
    }
  }

  clickOnAddLabel() {
    this.activeAddLabel = true;
  }

  closeAddLabel() {
    this.activeAddLabel = false;
  }

  toggleColorPicker() {
    this.colorPickerActive = !this.colorPickerActive;
  }

  selectColor(color: any) {
    this.newSelectedColor = color;
  }
  createLabel(name: any) {
    if (name.trim() === '') {
      return;
    }
    const newLabel = {
      id: this.backup.length + 1,
      color: this.newSelectedColor.color,
      border: this.newSelectedColor.border,
      name: name,
      selected: true
    };
    this.backup = [cloneDeep(newLabel), ...this.backup];
    if (this.searchValue === '' ||
        (this.searchValue !== '' &&
          name.indexOf(this.searchValue) > - 1
        )
      ) {
        this.labels = [cloneDeep(newLabel), ...this.labels];
      }
    this.labelnameInput.nativeElement.value = '';
    this.labelnameInput.nativeElement.focus();
  }
}
