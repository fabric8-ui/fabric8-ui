import { 
	Component, 
	OnInit, 
	Input 
} from '@angular/core';

import { WorkItem } from './../work-item/work-item';


@Component({
	selector: 'status-drawer',
	templateUrl: './status-drawer.component.html',
	styleUrls: ['./status-drawer.component.css'],
})
export class StatusDrawerComponent implements OnInit{
	@Input() workItem: WorkItem;
	show: boolean = false;
	
	ngOnInit(): void {
		if(!this.workItem.hasOwnProperty("statusCode")){
			this.workItem.statusCode = 0;
			this.workItem.status = "To Do";
		}
  	}

	onDrawerToggle(): void {
		this.show = !this.show;
	}

	changeStatus(code: number, status: string): void {
		this.workItem.statusCode = code;
		this.workItem.status = status;
		this.onDrawerToggle();
	}
}
