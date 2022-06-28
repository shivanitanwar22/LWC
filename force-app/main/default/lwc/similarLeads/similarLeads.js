import { LightningElement, wire,track,api } from 'lwc';
import accountList from '@salesforce/apex/duplicateRecordsFinder.accountList';
import getCustomSettings from '@salesforce/apex/duplicateRecordsFinder.getCustomSettings';
import { NavigationMixin } from 'lightning/navigation';


import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class SimilarLeads extends NavigationMixin(LightningElement) {
@track Name;
@track Website;
@track ContactName;
@api recordId;
@track Id;
@track  message;
@track getName;
@track BID;
@track getBlockDomainRes='';
data;
error;
@track  stringWithoutComma ;
@track    fixeddata=[];
@track pageSize;
@track showTable ;
@track ContactEmail;
//@track AccountId;
@track columnTable;
@track AccountName;
loaded = false;

@track columnTable =[
    {label:'Account Name', fieldName: 'nameUrl',
    type: 'url',
    typeAttributes: {label: { fieldName: 'AccountName' }, 
    target: '_blank'}},
    {label:'Website',fieldName:'Website',type:'Text'},
    {label:'Contact Name',fieldName:'Name',type:'text'},
    {label:'Contact Email',fieldName:'Email',type:'Email'},
];


connectedCallback(){
 
  console.log(this.recordId + ' from Account connectedCallback');
  getCustomSettings().then(result=>{
    console.log('inside get custom cs result>>>>>',JSON.stringify(result));
    if(result.length>0){
        for(let x in result){
           
            this.getBlockDomainRes+=result[x].Name + ',' ;
            this.stringWithoutComma =   this.getBlockDomainRes.replace(/,*$/, "")
            console.log('comma seprated list is----> '+ this.stringWithoutComma);
        }
     }
 
   //   this.getBlockDomainRes=result;
    
  }).catch(error=>{
    this.message = undefined;
    this.error = error;
    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Error ',
            message: error.body.message,
            variant: 'error',
        }),
    ); 
  })
  //***************************** */

   accountList({recId:this.recordId}).then(result=>{

       this.message=result;
       console.log('result>>>>>',JSON.stringify(result));
       

       if(this.message.length === 0){
        this.loaded = !this.loaded;
        this.showTable= false;

         }  else{
            this.loaded = !this.loaded;
            this.showTable= true;
            
        }
    
       this.message.forEach((row) =>{
        let dataline2 = {};
       dataline2.Id = row.AccountId;
       dataline2.AccountName = row.AccountName;
       dataline2.Name = row.Name;
       this.getName=  row.Name;
       dataline2.Website = row.Website;

      // dataline2.ContactName = row.Contacts.Name;
       dataline2.ContactEmail = row.Email;
      
      console.log('account name'+dataline2.AccountName);
      console.log('Contact nmae'+ dataline2.ContactName);
      console.log('Contact Email'+dataline2.ContactEmail);

      
       this.fixeddata.push(dataline2);
       console.log(this.fixeddata);
   })

   }).catch(error=>{
    this.message = undefined;
    this.error = error;
    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Error',
            message: error.body.message,
            variant: 'error',
        }),
    );
   })
 

}

viewAccount(event) {
    console.log('inside nav',event.target.dataset.id);
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: event.target.dataset.id,
            objectApiName: 'Account',
            actionName: 'view'
        }
    });
}



}
