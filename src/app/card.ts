export class Card {
	id: number;
	name: string;
  	description: string;
	status: string = 'To Do';
	statusCode: number = 0;
	type: string = 'Story';	
	//Temp hack. Need to separate view related parameters
	//Need to create cardItem which in turn will be used by cardlist component
	isExpanded = false;
}
