import { LightningElement,api,track } from 'lwc';
import getCSVFileId from '@salesforce/apex/DisplayCSVController.getCSVFileId';
import { NavigationMixin } from 'lightning/navigation';
export default class PreviewCSV extends NavigationMixin(LightningElement) {
    @api recordId;
@track contentDocumentId;
@api invoke(){
    console.log('quickaction called'+ this.recordId); 
   
    getCSVFileId({recordId:this.recordId})
    .then(result=>{
        this.contentDocumentId=result;
        console.log('contentDocumentId>>>'+ this.contentDocumentId); 
        if( this.contentDocumentId){
            console.log('&&&&&&&&&&&&&&&'+ this.contentDocumentId); 
       /* this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'filePreview'
            },
            state : {
               recordId: this.contentDocumentId,
                selectedRecordId: this.contentDocumentId
              
            }
          })*/
        }else{
            window.alert('No CSV file to display');
        }
    }).catch(error=>{
         window.alert('Error');
    })
}


}