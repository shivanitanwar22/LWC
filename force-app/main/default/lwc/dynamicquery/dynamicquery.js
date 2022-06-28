import { LightningElement ,api} from 'lwc';
import sendTemplateMessage from '@salesforce/apex/WhatsappController.sendTemplateMessage';
import googleSheetIntegrattionHandler from '@salesforce/apex/GoogleSheetIntegrattion.googleSheetIntegrattionHandler';
export default class Dynamicquery extends LightningElement {
 
    @api recordId;
    connectedCallback(){
        console.log('contactId>>>>>>>>>>>>>>'+this.recordId);
    }
    handleSend(){
        sendTemplateMessage({contactId:this.recordId})
        .then(result=>{
            window.alert('Messgae Sent Successfully');
        }).catch(error=>{
             window.alert('Error');
        })
    }

    handleSyncData(){
        googleSheetIntegrattionHandler({contactId:this.recordId})
        .then(result=>{
            window.alert('Sync Successfully');
        }).catch(error=>{
             window.alert('Error');
        })
    }
   
   /* @track qry = 'Select Id from Account ';
    @track message;
    @track accName = '';
    @track accPhone = '';
    @track accAnnualRev = '';
    @track accFax = '';
    handleNameChange(event){
        this.qry = 'Select Id from Account ';
        if (event.target.label === 'Name') {
           this.accName = event.target.value;
           console.log('this.name === '+this.name);
        }
        if (event.target.label === 'AnnualRevenue') {
            this.accAnnualRev = event.target.value;
        }
        if (event.target.label === 'Fax') {
            this.accFax = event.target.value;
        }
        if (event.target.label === 'Phone') {
            this.accPhone = event.target.value;
        }
    }
    
    handleSubmit(event){
        var whereCon = '';
        if(this.accName.length > 0){
            if(whereCon.length > 0){
                whereCon = whereCon + ' AND ';
                console.log('wherecon>>>>>>>',whereCon);
            }
            let acName = "'"+this.accName+"'";
            whereCon = whereCon + ' Name = '+acName;
            console.log('2nd wherecon>>>>>>>',whereCon);
        }

        if(this.accAnnualRev.length > 0){
            if(whereCon.length > 0){
                whereCon = whereCon + ' AND ';
            }
            let annRev = this.accAnnualRev;
            whereCon = whereCon + ' AnnualRevenue = '+annRev;
        }

        if(this.accPhone.length > 0){
            if(whereCon.length > 0){
                whereCon = whereCon + ' AND ';
            }
            let acPhn = "'"+this.accPhone+"'";
            whereCon = whereCon + ' Phone = '+acPhn;
        }

        if(this.accFax.length > 0){
            if(whereCon.length > 0){
                whereCon = whereCon + ' AND ';
            }
            let acFx = "'"+this.accFax+"'";
            whereCon = whereCon + ' Fax = '+acFx;
        }
        console.log('whereCon ==== > '+whereCon);
        if(whereCon.length > 0){
            whereCon = ' Where '+ whereCon;
        }
        this.qry = this.qry + whereCon;
        console.log('qry> ==== '+this.qry);
         
        dynamicqueryController({q:this.qry}).then(result=>{
            this.message=result;
            
          }).catch(error=>{
           
          })
    }*/

}