import { LightningElement ,api,track,wire} from 'lwc';
import getCSVFileId from '@salesforce/apex/DisplayCSVController.getCSVFileId';
import createOpportunities from'@salesforce/apex/DisplayCSVController.createOpportunities';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CloseActionScreenEvent } from 'lightning/actions';
import { NavigationMixin } from 'lightning/navigation';


export default class DisplayCSV  extends NavigationMixin(LightningElement) {
   // @api recordId;
    
    _recordId
    tableData
    columns
    dataList
    errorMssg;

  @api set recordId(value) {
    this._recordId = value;

    console.log('>recordId>>>'+ this._recordId);

    if(this._recordId){
    getCSVFileId( {recordId: this._recordId}).then(data=>{
        console.log('*********')
    if (data) {
        this.tableData=data;
        console.log('this.tableData.'+ JSON.stringify(this.tableData))
        console.log('Data===...',data)
        
        console.log('data.lstDataTableColumns===>>',data.lstDataTableColumns);

        console.log('data.lstDataTableData===>>',data.lstDataTableData);
        this.columns = data.lstDataTableColumns;

        const unformatedata = data.lstDataTableData;
        const header = data.lstDataTableColumns;

        console.log('unformatedata===>>',unformatedata);
        console.log('header===>>',header);

        var fieldName = Object.values(header).map(item=>{
            console.log('item==',item);
            return item.fieldName;
        })
           console.log('varfieldName==>');
          console.log('var fieldName==> ',fieldName);
          console.log('var fieldName==> ');

    
          
          var rowSize = fieldName.length;
          var rowList = Object.values(unformatedata).map(rowJson => {
            console.log('rowJson'+rowJson);
            const rowData = rowJson.split(',');
            console.log('rowDAta'+rowData);
            var rowObject = {};
            for(var i = 0; i < rowSize; i++){
                
                if(rowData[i].includes('\r')){
                    
                    rowObject[[fieldName[i]]] = rowData[i].replace('\r','');
                    console.log('in if>>rowObject rowObject[[fieldName[i]]]>>'+JSON.stringify( rowObject[[fieldName[i]]]));
                }else{
                    
                    rowObject[[fieldName[i]]] = rowData[i];
                    console.log('in else>>rowObject rowObject[[fieldName[i]]]>>'+JSON.stringify( rowObject[[fieldName[i]]]));
                }
                console.log('rowObject>>'+JSON.stringify(rowObject));
                
            }
            return rowObject;
          })

          this.dataList = rowList;
          if(this.columns.length === 0){
            this.errorMssg=true;
            console.log('  this.errorMssg==='+  this.errorMssg)
       }

        }
    
        }).catch(error=>{
           console.log('error'+JSON.stringify(error));
          

    })
}
  }
get recordId(){
    console.log('$$');
    return this._recordId;
}

createRecord(){
    console.log('inside btn');
    createOpportunities({recordId:this._recordId}).then(result=>{
        console.log('inside button >>>result'+ result);
        if(result.includes('success')){
        this.showToast('Success',result,'Success');
        this.navigateToView();
        }else{
            this.showToast('Error',result,'Error');  
        }
        this.closeQuickAction();
    }).catch(error=>{
        console.log('error'+JSON.stringify(error));
    })
}

showToast(title,message,variant){
const event = new ShowToastEvent({
    title:title,
    message:message,
    variant:variant
});
this.dispatchEvent(event);
}

closeQuickAction() {
    this.dispatchEvent(new CloseActionScreenEvent());
}

navigateToView(){
this[NavigationMixin.Navigate]({
    type: 'standard__objectPage',
    attributes: {
        objectApiName: 'Opportunity',
        actionName: 'list'
    },
    state: {
    
        filterName: 'Recent' 
    }
});
}

}  
