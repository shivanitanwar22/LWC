import { LightningElement,api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getAccountsId from '@salesforce/apex/getRelatedContacts.getAccountsId';
import createContacts from '@salesforce/apex/getRelatedContacts.createContacts';

export default class SimpleInterest extends LightningElement {
    @api recordId;
    @track contactData = [];
    @track error;
    @track message;

    /* prin;
     rate;
     time;
     n;
     em;
     si;*/
   
    Name;
    Email;
    Principal__c;
    Rate__c;
    Time__c;
    Simple_Interest__c;

    connectedCallback(){
        console.log('recordId',this.recordId);
        console.log('result',this.contactData);

        getAccountsId({acctId : this.recordId})
            .then(result => {
                this.contactData=result;
                console.log('result',result);
               
    })
             .catch(error => {
              console.log( 'error' );
               });
    }
    handleChangePrin(event){
        //this.n=event.target.value;
        this[event.currentTarget.dataset.field] = event.currentTarget.value;
        this.Principal__c=this[event.currentTarget.dataset.field] ;
        console.log(this[event.currentTarget.dataset.field]);
        
    }
    handleChangeEmail(event){
           this[event.currentTarget.dataset.field] = event.currentTarget.value;
        this.Email=this[event.currentTarget.dataset.field] ;
        this.Email=event.target.value;
    }
    handleChangeRate(event){
        this[event.currentTarget.dataset.field] = event.currentTarget.value;
        this.Rate__c=this[event.currentTarget.dataset.field] ;
        //this.prin=event.target.value;
    }
    handleChangeTime(event){
        this[event.currentTarget.dataset.field] = event.currentTarget.value;
        this.Time__c=this[event.currentTarget.dataset.field] ;
        this.rate=event.target.value;
    }
    handleChangeName(event){
        this[event.currentTarget.dataset.field] = event.currentTarget.value;
        this.Name=this[event.currentTarget.dataset.field] ;
        
    }

    calculateSI(event){
        //console.log('principle',this.prin);
        this.contactData[event.target.dataset.id][event.target.name] = event.target.value;
        //this.Simple_Interest__c=this.Principal__c*this.Rate__c * this.Time__c/100;
        this.Simple_Interest__c=this.Principal__c*this.Rate__c * this.Time__c/100;

         //
         console.log('values',this.contactData[event.target.dataset.id].Principal__c);
         /*console.log('values',this.contactData[event.target.dataset.id].Rate__c);

         //this.contactData[event.target.dataset.id].Rate__c*/
         /*if(event.target.name == 'Principal__c' || event.target.name == 'Rate__c' || event.target.name == 'Time__c'){
             let sum = (this.contactData[event.target.dataset.id].Principal__c * this.contactData[event.target.dataset.id].Rate__c * this.contactData[event.target.dataset.id].Time__c)/100;
             this.contactData[event.target.dataset.id].Simple_Interest__c = sum;
      
        
    }*/
}



addRow(){
        this.contactData.push({
            LastName : '',
            Email : '',
            Principal__c : '',
            Rate__c : '',
            Time__c : '',
            Simple_Interest__c : ''
        });
    }

    removeRow(event){
        this.contactData.splice(event.target.dataset.id, 1);
    }

    saveMultipleContacts(){
        // let savedata = JSON.stringify(this.contactData);
        createContacts({ contList : this.contactData,recordId: this.recordId })
    
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