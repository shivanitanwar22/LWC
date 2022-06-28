import { LightningElement,wire,track } from 'lwc';
import { getISBN } from '@salesforce/apex/createBookController.getISBN';

const columns = [
   
    { label: 'Book Name', fieldName: 'Name', type: 'text' },
    { label: 'ISBN Number', fieldName: 'ISBN_Number-_c', type: 'Number' },
    { label: 'Price', fieldName: 'Price__c', type: 'currency' },
    { label: 'Author', fieldName: 'Author__c', type: 'text' },
];
export default class CreateBook extends LightningElement {
    @track isbn;
   data;
   error;
   columns=columns;

@wire(getISBN,{isbnNo : this.isbn})wiredISBN({data,error}){
    if(data){
      this.data=data;
      this.error = undefined;
    }else if(error){
        this.error=undefined;
    }
}

createBookHandler(event){
    this.isbn= event.target.value;
}





}