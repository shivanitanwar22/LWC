import { LightningElement,api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContacts from '@salesforce/apex/SimpleInterestContact.getContacts';
import createContacts from '@salesforce/apex/SimpleInterestContact.createContacts';


export default class CalculateSimpleInterest extends LightningElement {
    @api recordId;
    @track contactList = [];
    @track error;
    @track message;

    Name;
    Email;
    Principal__c;
    Rate__c;
    Time__c;
    Simple_Interest__c;

    connectedCallback(){
        getContacts({recId : this.recordId})
            .then(result => {
                this.contactList = result;
                
            })

    }

    calculate(event){
      
         this.contactList[event.target.dataset.id][event.target.name] = event.target.value;
         //console.log(event.target.value);
         //this.contactList[event.target.dataset.id].Rate__c
         if(event.target.name == 'Principal__c' || event.target.name == 'Rate__c' || event.target.name == 'Time__c'){
             let sum = (this.contactList[event.target.dataset.id].Principle__c  * this.contactList[event.target.dataset.id].Rate__c * this.contactList[event.target.dataset.id].Time__c)/100;
             this.contactList[event.target.dataset.id].Simple_Interest__c = sum;

      
        
    }
}



       addRow(){
        this.contactList.push({
            LastName : '',
            Email : '',
            Principle__c : '',
            Rate__c : '',
            Time__c : '',
            Simple_Interest__c : ''
        });
    }

    deleteRow(event){
        this.contactList.splice(event.target.dataset.id, 1);
    }

    saveContactsHandler(){
        // let savedata = JSON.stringify(this.contactData);
        createContacts({updateRecord : this.contactList,recordId: this.recordId })
        .then(result => {
            this.message = result;
            this.error = undefined; 
          
        
            console.log('message'+JSON.stringify(this.message));
          
        console.log('inserted');
        this.connectedCallback();
            //this.accountRecList = [];
            if(this.message !== undefined) {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contacts Created!',
                        variant: 'success',
                    }),
                );
            }
            
            console.log(JSON.stringify(result));
            console.log("result", this.message);
        })
        .catch(error => {
            this.message = undefined;
            this.error = error;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating records',
                    message: error.body.message,
                    variant: 'error',
                }),
            );
            
        }); 


    }
    
        
}

    

