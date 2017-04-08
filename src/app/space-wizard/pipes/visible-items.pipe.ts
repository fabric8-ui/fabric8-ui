import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, Injectable, Pipe , PipeTransform } from '@angular/core';

@Pipe({
    name: 'visibleItems'
})
export class VisibleItemsPipe implements PipeTransform {
  transform(items: any[], args: any[]): any {
      return items.filter(item => item.visible === true);
  }
}
